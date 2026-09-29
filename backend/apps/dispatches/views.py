from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import CorporateClient, DispatchBooking
from .serializers import CorporateClientSerializer, DispatchBookingSerializer
from apps.fleet.models import Vehicle
from apps.drivers.models import DriverProfile

class CorporateClientViewSet(viewsets.ModelViewSet):
    queryset = CorporateClient.objects.all().order_by('name')
    serializer_class = CorporateClientSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'contact_person', 'gstin', 'contact_email']
    ordering_fields = ['name', 'created_at']


class DispatchBookingViewSet(viewsets.ModelViewSet):
    queryset = DispatchBooking.objects.all().order_by('-pickup_time')
    serializer_class = DispatchBookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        'booking_reference', 'passenger_name', 'passenger_phone', 
        'pickup_location', 'dropoff_location', 'flight_number', 
        'client__name', 'assigned_vehicle__registration_number'
    ]
    ordering_fields = ['pickup_time', 'created_at', 'total_fare_inr', 'status']

    @action(detail=False, methods=['get'])
    def summary(self, request):
        today = timezone.now().date()
        queryset = self.get_queryset()

        total = queryset.count()
        pending = queryset.filter(status=DispatchBooking.DispatchStatus.PENDING).count()
        active = queryset.filter(status__in=[
            DispatchBooking.DispatchStatus.DISPATCHED,
            DispatchBooking.DispatchStatus.ON_TRIP
        ]).count()
        completed = queryset.filter(status=DispatchBooking.DispatchStatus.COMPLETED).count()
        
        rev_aggregate = queryset.filter(status=DispatchBooking.DispatchStatus.COMPLETED).aggregate(
            total_rev=Sum('total_fare_inr')
        )
        total_revenue = float(rev_aggregate['total_rev'] or 0.0)

        return Response({
            'total_bookings': total,
            'pending_allocation': pending,
            'active_live': active,
            'completed': completed,
            'total_revenue_inr': total_revenue
        })

    @action(detail=True, methods=['post'])
    def dispatch(self, request, pk=None):
        """Allocate driver and vehicle and change status to DISPATCHED."""
        booking = self.get_object()
        vehicle_id = request.data.get('vehicle_id')
        driver_id = request.data.get('driver_id')

        if not vehicle_id or not driver_id:
            return Response(
                {'error': 'Both vehicle_id and driver_id are required for dispatch'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            vehicle = Vehicle.objects.get(pk=vehicle_id)
            driver = DriverProfile.objects.get(pk=driver_id)
        except (Vehicle.DoesNotExist, DriverProfile.DoesNotExist) as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)

        booking.assigned_vehicle = vehicle
        booking.assigned_driver = driver
        booking.status = DispatchBooking.DispatchStatus.DISPATCHED
        booking.start_odometer = vehicle.current_odometer
        booking.save()

        # Update vehicle status to ON_DUTY
        vehicle.status = Vehicle.VehicleStatus.ON_DUTY
        vehicle.save(update_fields=['status'])

        # Update driver status to ON_TRIP
        driver.duty_status = DriverProfile.DutyStatus.ON_TRIP
        driver.save(update_fields=['duty_status'])

        return Response({
            'message': f"Booking {booking.booking_reference} dispatched with {vehicle.registration_number}",
            'booking': DispatchBookingSerializer(booking).data
        })

    @action(detail=True, methods=['post'])
    def start_trip(self, request, pk=None):
        """Chauffeur picks up passenger and starts meter."""
        booking = self.get_object()
        start_odo = request.data.get('start_odometer')
        if start_odo:
            booking.start_odometer = float(start_odo)
        elif not booking.start_odometer and booking.assigned_vehicle:
            booking.start_odometer = booking.assigned_vehicle.current_odometer

        booking.status = DispatchBooking.DispatchStatus.ON_TRIP
        booking.save()

        return Response({
            'message': f"Trip {booking.booking_reference} is now live and in progress",
            'booking': DispatchBookingSerializer(booking).data
        })

    @action(detail=True, methods=['post'])
    def complete_trip(self, request, pk=None):
        """Trip concluded. Record end odometer and calculate total invoice value."""
        booking = self.get_object()
        end_odo = request.data.get('end_odometer')
        toll_parking = request.data.get('toll_parking_inr', 0.0)

        if end_odo is not None:
            booking.end_odometer = float(end_odo)
            if booking.start_odometer:
                booking.distance_km = max(0.0, float(booking.end_odometer) - float(booking.start_odometer))
            
            # Update vehicle's odometer
            if booking.assigned_vehicle:
                booking.assigned_vehicle.current_odometer = float(end_odo)
                booking.assigned_vehicle.status = Vehicle.VehicleStatus.AVAILABLE
                booking.assigned_vehicle.save()

        if toll_parking:
            booking.toll_parking_inr = float(toll_parking)

        booking.calculate_total_fare()
        booking.status = DispatchBooking.DispatchStatus.COMPLETED
        booking.save()

        # Release driver back to available duty
        if booking.assigned_driver:
            booking.assigned_driver.duty_status = DriverProfile.DutyStatus.ON_DUTY_AVAILABLE
            booking.assigned_driver.total_trips += 1
            booking.assigned_driver.save()

        return Response({
            'message': f"Trip {booking.booking_reference} successfully completed. Total Fare: ₹{booking.total_fare_inr:,.2f}",
            'booking': DispatchBookingSerializer(booking).data
        })

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel dispatch booking and release resources."""
        booking = self.get_object()
        booking.status = DispatchBooking.DispatchStatus.CANCELLED
        booking.save()

        if booking.assigned_vehicle:
            booking.assigned_vehicle.status = Vehicle.VehicleStatus.AVAILABLE
            booking.assigned_vehicle.save(update_fields=['status'])

        if booking.assigned_driver:
            booking.assigned_driver.duty_status = DriverProfile.DutyStatus.ON_DUTY_AVAILABLE
            booking.assigned_driver.save(update_fields=['duty_status'])

        return Response({
            'message': f"Booking {booking.booking_reference} has been cancelled",
            'booking': DispatchBookingSerializer(booking).data
        })
