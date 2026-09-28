import os
import sys
import django
from datetime import date, timedelta

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.fleet.models import Vehicle, VehicleCompliance
from apps.drivers.models import DriverProfile

User = get_user_model()

def seed_data():
    print("🌱 Seeding B2B Fleet Platform initial demo data with vehicle & driver images...")

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
    else:
        admin_user.set_password('admin123')
        admin_user.save()

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
    else:
        dispatcher.set_password('pass123')
        dispatcher.save()

    # 3. Fleet Vehicles with High-Res Image URLs
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
            'seating_capacity': 4,
            'image_url': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&auto=format&fit=crop&q=80'
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
            'seating_capacity': 4,
            'image_url': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500&auto=format&fit=crop&q=80'
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
            'seating_capacity': 6,
            'image_url': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&auto=format&fit=crop&q=80'
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
            'seating_capacity': 8,
            'image_url': 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=500&auto=format&fit=crop&q=80'
        },
    ]

    vehicles = []
    for vdata in vehicles_data:
        v, created = Vehicle.objects.get_or_create(registration_number=vdata['registration_number'], defaults=vdata)
        if not created:
            v.image_url = vdata['image_url']
            v.save()
        vehicles.append(v)
    print(f"  ✓ Seeded {len(vehicles)} Vehicles with images")

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
            'expiry_date': today + timedelta(days=15),
            'issuer_authority': 'City Emission Board'
        }
    )
    VehicleCompliance.objects.get_or_create(
        vehicle=vehicles[3],
        document_type=VehicleCompliance.DocType.FITNESS,
        defaults={
            'document_number': 'FIT-2025-0091',
            'issue_date': today - timedelta(days=380),
            'expiry_date': today - timedelta(days=10),
            'issuer_authority': 'Department of Motor Vehicles'
        }
    )
    print("  ✓ Seeded Vehicle Compliance Records")

    # 5. Drivers with Avatar URLs
    drivers_info = [
        ('driver_john', 'John', 'Doe', 'DL-NY-9823145', 4.92, 98.50, DriverProfile.DutyStatus.ON_DUTY_AVAILABLE, vehicles[1], 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'),
        ('driver_sarah', 'Sarah', 'Jenkins', 'DL-CA-4451299', 4.88, 96.00, DriverProfile.DutyStatus.OFF_DUTY, None, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'),
        ('driver_marcus', 'Marcus', 'Vance', 'DL-TX-7712301', 4.95, 99.20, DriverProfile.DutyStatus.ON_DUTY_AVAILABLE, None, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'),
    ]

    for username, fname, lname, lic, rating, safety, dstatus, assigned_v, avatar in drivers_info:
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
        else:
            duser.set_password('pass123')
            duser.save()

        dp, created = DriverProfile.objects.get_or_create(
            user=duser,
            defaults={
                'license_number': lic,
                'license_expiry': today + timedelta(days=400),
                'badge_number': f"BDG-{lic[-4:]}",
                'badge_expiry': today + timedelta(days=300),
                'duty_status': dstatus,
                'assigned_vehicle': assigned_v,
                'rating': rating,
                'safety_score': safety,
                'total_trips': 142,
                'avatar_url': avatar
            }
        )
        if not created:
            dp.avatar_url = avatar
            dp.save()

    print("  ✓ Seeded Driver Profiles with Avatar Images")
    print("🎉 Seeding Completed Successfully!")

if __name__ == '__main__':
    seed_data()
