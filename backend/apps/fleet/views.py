from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Vehicle, VehicleCompliance
from .serializers import VehicleSerializer, VehicleComplianceSerializer

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all().order_by('-created_at')
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['registration_number', 'vin', 'make', 'model']
    ordering_fields = ['registration_number', 'created_at', 'current_odometer']

    @action(detail=False, methods=['get'])
    def summary(self, request):
        total = self.get_queryset().count()
        available = self.get_queryset().filter(status=Vehicle.VehicleStatus.AVAILABLE).count()
        on_duty = self.get_queryset().filter(status=Vehicle.VehicleStatus.ON_DUTY).count()
        in_maintenance = self.get_queryset().filter(status=Vehicle.VehicleStatus.IN_MAINTENANCE).count()
        
        return Response({
            'total_vehicles': total,
            'available': available,
            'on_duty': on_duty,
            'in_maintenance': in_maintenance
        })

class VehicleComplianceViewSet(viewsets.ModelViewSet):
    queryset = VehicleCompliance.objects.all().order_by('expiry_date')
    serializer_class = VehicleComplianceSerializer
    permission_classes = [permissions.IsAuthenticated]
