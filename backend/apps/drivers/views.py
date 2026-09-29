from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import DriverProfile, ShiftLog
from .serializers import DriverProfileSerializer, ShiftLogSerializer

class DriverViewSet(viewsets.ModelViewSet):
    queryset = DriverProfile.objects.all().order_by('-created_at')
    serializer_class = DriverProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['license_number', 'user__first_name', 'user__last_name', 'user__username', 'badge_number']
    ordering_fields = ['rating', 'safety_score', 'created_at']

    @action(detail=False, methods=['get'])
    def summary(self, request):
        total = self.get_queryset().count()
        on_duty = self.get_queryset().filter(duty_status=DriverProfile.DutyStatus.ON_DUTY_AVAILABLE).count()
        on_trip = self.get_queryset().filter(duty_status=DriverProfile.DutyStatus.ON_TRIP).count()
        off_duty = self.get_queryset().filter(duty_status=DriverProfile.DutyStatus.OFF_DUTY).count()

        return Response({
            'total_drivers': total,
            'on_duty': on_duty,
            'on_trip': on_trip,
            'off_duty': off_duty
        })

    @action(detail=True, methods=['post'])
    def assign_vehicle(self, request, pk=None):
        driver = self.get_object()
        vehicle_id = request.data.get('vehicle_id')
        if not vehicle_id:
            return Response({'error': 'vehicle_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        from apps.fleet.models import Vehicle
        try:
            vehicle = Vehicle.objects.get(pk=vehicle_id)
        except Vehicle.DoesNotExist:
            return Response({'error': 'Vehicle not found'}, status=status.HTTP_404_NOT_FOUND)

        # Unassign any other driver currently assigned to this vehicle
        DriverProfile.objects.filter(assigned_vehicle=vehicle).exclude(pk=driver.pk).update(assigned_vehicle=None)

        driver.assigned_vehicle = vehicle
        driver.save(update_fields=['assigned_vehicle'])

        return Response({
            'message': f"Vehicle {vehicle.registration_number} assigned to driver {driver.user.get_full_name() or driver.user.username}",
            'driver': DriverProfileSerializer(driver).data
        })

    @action(detail=True, methods=['post'])
    def unassign_vehicle(self, request, pk=None):
        driver = self.get_object()
        driver.assigned_vehicle = None
        driver.save(update_fields=['assigned_vehicle'])

        return Response({
            'message': f"Vehicle unassigned from driver {driver.user.get_full_name() or driver.user.username}",
            'driver': DriverProfileSerializer(driver).data
        })

class ShiftLogViewSet(viewsets.ModelViewSet):
    queryset = ShiftLog.objects.all().order_by('-shift_start')
    serializer_class = ShiftLogSerializer
    permission_classes = [permissions.IsAuthenticated]
