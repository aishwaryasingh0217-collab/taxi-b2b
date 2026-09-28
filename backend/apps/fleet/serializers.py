from rest_framework import serializers
from .models import Vehicle, VehicleCompliance

class VehicleComplianceSerializer(serializers.ModelSerializer):
    computed_status = serializers.CharField(read_only=True)
    document_type_display = serializers.CharField(source='get_document_type_display', read_only=True)

    class Meta:
        model = VehicleCompliance
        fields = '__all__'

class VehicleSerializer(serializers.ModelSerializer):
    compliance_docs = VehicleComplianceSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    fuel_type_display = serializers.CharField(source='get_fuel_type_display', read_only=True)
    vehicle_class_display = serializers.CharField(source='get_vehicle_class_display', read_only=True)

    class Meta:
        model = Vehicle
        fields = '__all__'
