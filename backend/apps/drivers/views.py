from rest_framework import viewsets, permissions, filters
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

class ShiftLogViewSet(viewsets.ModelViewSet):
    queryset = ShiftLog.objects.all().order_by('-shift_start')
    serializer_class = ShiftLogSerializer
    permission_classes = [permissions.IsAuthenticated]
