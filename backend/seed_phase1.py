import os
import sys
import django
from datetime import date, timedelta

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.fleet.models import Vehicle, VehicleCompliance
from apps.drivers.models import DriverProfile, ShiftLog

User = get_user_model()

def seed_data():
    print("🌱 Seeding B2B Fleet Platform initial demo data...")

    # 1. Admin User
    admin_user, created = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@fleetops.b2b',
            'first_name': 'Fleet',
            'last_name': 'Manager',
            'role': User.Roles.FLEET_ADMIN,
            'phone_number': '+1 (555) 019-2831',
            'company_name': 'Metro Fleet Logistics Ltd',
            'is_staff': True,
            'is_superuser': True
        }
    )
    if created:
        admin_user.set_password('admin123')
        admin_user.save()
        print("  ✓ Created Admin: admin / admin123")

    # 2. Dispatcher User
    dispatcher, created = User.objects.get_or_create(
        username='dispatcher1',
        defaults={
            'email': 'dispatcher@fleetops.b2b',
            'first_name': 'Alex',
            'last_name': 'Morgan',
            'role': User.Roles.DISPATCHER,
            'phone_number': '+1 (555) 014-9922',
            'company_name': 'Metro Fleet Logistics Ltd'
        }
    )
    if created:
        dispatcher.set_password('pass123')
        dispatcher.save()
        print("  ✓ Created Dispatcher: dispatcher1 / pass123")

    # 3. Fleet Vehicles
    vehicles_data = [
        {
            'registration_number': 'B2B-TX-101',
            'vin': '1HGCR2F83HA001001',
            'make': 'Toyota',
            'model': 'Camry Hybrid',
            'year': 2024,
            'vehicle_class': Vehicle.VehicleClass.SEDAN,
            'fuel_type': Vehicle.FuelType.PETROL,
            'status': Vehicle.VehicleStatus.AVAILABLE,
            'current_odometer': 14250.50,
            'seating_capacity': 4
        },
        {
            'registration_number': 'B2B-EV-202',
            'vin': '5YJ3E1EA7KF002002',
            'make': 'Tesla',
            'model': 'Model 3 Executive',
            'year': 2025,
            'vehicle_class': Vehicle.VehicleClass.EV,
            'fuel_type': Vehicle.FuelType.ELECTRIC,
            'status': Vehicle.VehicleStatus.ON_DUTY,
            'current_odometer': 8920.00,
            'seating_capacity': 4
        },
        {
            'registration_number': 'B2B-SUV-303',
            'vin': '4T1B11HK5JU003003',
            'make': 'Toyota',
            'model': 'Highlander Hybrid',
            'year': 2023,
            'vehicle_class': Vehicle.VehicleClass.SUV,
            'fuel_type': Vehicle.FuelType.PETROL,
            'status': Vehicle.VehicleStatus.AVAILABLE,
            'current_odometer': 32410.80,
            'seating_capacity': 6
        },
        {
            'registration_number': 'B2B-VAN-404',
            'vin': 'W1W44770313004004',
            'make': 'Mercedes-Benz',
            'model': 'Metris Shuttle',
            'year': 2024,
            'vehicle_class': Vehicle.VehicleClass.VAN,
            'fuel_type': Vehicle.FuelType.DIESEL,
            'status': Vehicle.VehicleStatus.IN_MAINTENANCE,
            'current_odometer': 45100.20,
            'seating_capacity': 8
        },
    ]

    vehicles = []
    for vdata in vehicles_data:
        v, _ = Vehicle.objects.get_or_create(registration_number=vdata['registration_number'], defaults=vdata)
        vehicles.append(v)
    print(f"  ✓ Seeded {len(vehicles)} Vehicles")

    # 4. Compliance Docs
    today = date.today()
    VehicleCompliance.objects.get_or_create(
        vehicle=vehicles[0],
        document_type=VehicleCompliance.DocType.INSURANCE,
        defaults={
            'document_number': 'INS-2026-98124',
            'issue_date': today - timedelta(days=180),
            'expiry_date': today + timedelta(days=185),
            'issuer_authority': 'Global Shield Assurance'
        }
    )
    VehicleCompliance.objects.get_or_create(
        vehicle=vehicles[0],
        document_type=VehicleCompliance.DocType.PUC,
        defaults={
            'document_number': 'PUC-2026-1102',
            'issue_date': today - timedelta(days=330),
            'expiry_date': today + timedelta(days=15),  # Expiring soon
            'issuer_authority': 'City Emission Board'
        }
    )
    VehicleCompliance.objects.get_or_create(
        vehicle=vehicles[3],
        document_type=VehicleCompliance.DocType.FITNESS,
        defaults={
            'document_number': 'FIT-2025-0091',
            'issue_date': today - timedelta(days=380),
            'expiry_date': today - timedelta(days=10),  # Expired
            'issuer_authority': 'Department of Motor Vehicles'
        }
    )
    print("  ✓ Seeded Vehicle Compliance Records")

    # 5. Drivers
    drivers_info = [
        ('driver_john', 'John', 'Doe', 'DL-NY-9823145', 4.92, 98.50, Vehicle.VehicleStatus.ON_DUTY, vehicles[1]),
        ('driver_sarah', 'Sarah', 'Jenkins', 'DL-CA-4451299', 4.88, 96.00, Vehicle.VehicleStatus.AVAILABLE, None),
        ('driver_marcus', 'Marcus', 'Vance', 'DL-TX-7712301', 4.95, 99.20, Vehicle.VehicleStatus.AVAILABLE, None),
    ]

    for username, fname, lname, lic, rating, safety, dstatus, assigned_v in drivers_info:
        duser, ucreated = User.objects.get_or_create(
            username=username,
            defaults={
                'email': f'{username}@fleetops.b2b',
                'first_name': fname,
                'last_name': lname,
                'role': User.Roles.DRIVER,
                'phone_number': '+1 (555) 302-8811'
            }
        )
        if ucreated:
            duser.set_password('pass123')
            duser.save()

        DriverProfile.objects.get_or_create(
            user=duser,
            defaults={
                'license_number': lic,
                'license_expiry': today + timedelta(days=400),
                'badge_number': f"BDG-{lic[-4:]}",
                'badge_expiry': today + timedelta(days=300),
                'duty_status': DriverProfile.DutyStatus.ON_DUTY_AVAILABLE if assigned_v else DriverProfile.DutyStatus.OFF_DUTY,
                'assigned_vehicle': assigned_v,
                'rating': rating,
                'safety_score': safety,
                'total_trips': 142
            }
        )

    print("  ✓ Seeded Driver Profiles")
    print("🎉 Seeding Completed Successfully!")

if __name__ == '__main__':
    seed_data()
