from rest_framework import serializers
from .models import Vehicle, VehicleCompliance

class VehicleComplianceSerializer(serializers.ModelSerializer):
    computed_status = serializers.CharField(read_only=True)
    document_type_display = serializers.CharField(source='get_document_type_display', read_only=True)

    class Meta:
        model = VehicleCompliance
        fields = '__all__'

class VehicleSerializer(serializers.ModelSerializer):
    compliance_docs = VehicleComplianceSerializer(many=True, required=False)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    fuel_type_display = serializers.CharField(source='get_fuel_type_display', read_only=True)
    vehicle_class_display = serializers.CharField(source='get_vehicle_class_display', read_only=True)

    class Meta:
        model = Vehicle
        fields = '__all__'

    def create(self, validated_data):
        compliance_docs_data = validated_data.pop('compliance_docs', [])
        vehicle = Vehicle.objects.create(**validated_data)
        for doc_data in compliance_docs_data:
            VehicleCompliance.objects.create(vehicle=vehicle, **doc_data)
        return vehicle

