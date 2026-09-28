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
    print("🌱 Seeding B2B Fleet Platform demo data (10+ vehicles & drivers)...")

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
    admin_user.set_password('admin123')
    admin_user.save()
    print("  ✓ Admin: admin / admin123")

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
    dispatcher.set_password('pass123')
    dispatcher.save()
    print("  ✓ Dispatcher: dispatcher1 / pass123")

    # 3. Fleet Vehicles (10 Vehicles across 5 Categories)
    vehicles_data = [
        # Executive Sedans
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
            'image_url': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop&q=80',
            'notes': 'Equipped with GPS Telemetry & Auto Toll Pass'
        },
        {
            'registration_number': 'B2B-TX-102',
            'vin': '1HGCR2F83HA001002',
            'make': 'Honda',
            'model': 'Accord Executive',
            'year': 2024,
            'vehicle_class': Vehicle.VehicleClass.SEDAN,
            'fuel_type': Vehicle.FuelType.PETROL,
            'status': Vehicle.VehicleStatus.ON_DUTY,
            'current_odometer': 19800.00,
            'seating_capacity': 4,
            'image_url': 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&auto=format&fit=crop&q=80',
            'notes': 'Corporate Airport Transfer Special'
        },
        # Electric Fleet
        {
            'registration_number': 'B2B-EV-201',
            'vin': '5YJ3E1EA7KF002001',
            'make': 'Tesla',
            'model': 'Model 3 Executive',
            'year': 2025,
            'vehicle_class': Vehicle.VehicleClass.EV,
            'fuel_type': Vehicle.FuelType.ELECTRIC,
            'status': Vehicle.VehicleStatus.ON_DUTY,
            'current_odometer': 8920.00,
            'seating_capacity': 4,
            'image_url': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop&q=80',
            'notes': 'Supercharger Pass & Full Autopilot'
        },
        {
            'registration_number': 'B2B-EV-202',
            'vin': '5YJ3E1EA7KF002002',
            'make': 'Hyundai',
            'model': 'Ioniq 5 EV',
            'year': 2025,
            'vehicle_class': Vehicle.VehicleClass.EV,
            'fuel_type': Vehicle.FuelType.ELECTRIC,
            'status': Vehicle.VehicleStatus.AVAILABLE,
            'current_odometer': 5400.00,
            'seating_capacity': 5,
            'image_url': 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=80',
            'notes': 'Ultra fast 800V charging'
        },
        # Premium SUVs
        {
            'registration_number': 'B2B-SUV-301',
            'vin': '4T1B11HK5JU003001',
            'make': 'Toyota',
            'model': 'Highlander Hybrid',
            'year': 2023,
            'vehicle_class': Vehicle.VehicleClass.SUV,
            'fuel_type': Vehicle.FuelType.PETROL,
            'status': Vehicle.VehicleStatus.AVAILABLE,
            'current_odometer': 32410.80,
            'seating_capacity': 6,
            'image_url': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
            'notes': 'All-Wheel Drive & Roof Luggage Carrier'
        },
        {
            'registration_number': 'B2B-SUV-302',
            'vin': '4T1B11HK5JU003002',
            'make': 'Ford',
            'model': 'Explorer Limited',
            'year': 2024,
            'vehicle_class': Vehicle.VehicleClass.SUV,
            'fuel_type': Vehicle.FuelType.DIESEL,
            'status': Vehicle.VehicleStatus.ON_DUTY,
            'current_odometer': 21150.00,
            'seating_capacity': 7,
            'image_url': 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop&q=80',
            'notes': 'Outstation Corporate Shuttle Ready'
        },
        # Multi-Passenger Vans
        {
            'registration_number': 'B2B-VAN-401',
            'vin': 'W1W44770313004001',
            'make': 'Mercedes-Benz',
            'model': 'Metris Shuttle',
            'year': 2024,
            'vehicle_class': Vehicle.VehicleClass.VAN,
            'fuel_type': Vehicle.FuelType.DIESEL,
            'status': Vehicle.VehicleStatus.IN_MAINTENANCE,
            'current_odometer': 45100.20,
            'seating_capacity': 8,
            'image_url': 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80',
            'notes': 'Scheduled Brake Pad Maintenance'
        },
        {
            'registration_number': 'B2B-VAN-402',
            'vin': 'W1W44770313004002',
            'make': 'Toyota',
            'model': 'HiAce Commuter',
            'year': 2024,
            'vehicle_class': Vehicle.VehicleClass.VAN,
            'fuel_type': Vehicle.FuelType.DIESEL,
            'status': Vehicle.VehicleStatus.AVAILABLE,
            'current_odometer': 28900.00,
            'seating_capacity': 10,
            'image_url': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
            'notes': 'Dual Airbags & Fleet Telematics'
        },
        # Luxury Fleet
        {
            'registration_number': 'B2B-LUX-501',
            'vin': 'WBA71CH0508005001',
            'make': 'Mercedes-Benz',
            'model': 'S-Class S580',
            'year': 2025,
            'vehicle_class': Vehicle.VehicleClass.LUXURY,
            'fuel_type': Vehicle.FuelType.PETROL,
            'status': Vehicle.VehicleStatus.AVAILABLE,
            'current_odometer': 4100.00,
            'seating_capacity': 4,
            'image_url': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=80',
            'notes': 'VIP Chauffeur Service Specification'
        },
        {
            'registration_number': 'B2B-LUX-502',
            'vin': 'WBA71CH0508005002',
            'make': 'BMW',
            'model': '7 Series Hybrid',
            'year': 2025,
            'vehicle_class': Vehicle.VehicleClass.LUXURY,
            'fuel_type': Vehicle.FuelType.PETROL,
            'status': Vehicle.VehicleStatus.ON_DUTY,
            'current_odometer': 7200.00,
            'seating_capacity': 4,
            'image_url': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=80',
            'notes': 'Executive Reclining Rear Seats & Wifi'
        }
    ]

    vehicles = []
    for vdata in vehicles_data:
        v, created = Vehicle.objects.get_or_create(registration_number=vdata['registration_number'], defaults=vdata)
        if not created:
            v.image_url = vdata['image_url']
            v.status = vdata['status']
            v.current_odometer = vdata['current_odometer']
            v.notes = vdata['notes']
            v.save()
        vehicles.append(v)
    print(f"  ✓ Seeded {len(vehicles)} Vehicles across all categories")

    # 4. Compliance Docs
    today = date.today()
    for idx, v in enumerate(vehicles):
        VehicleCompliance.objects.get_or_create(
            vehicle=v,
            document_type=VehicleCompliance.DocType.INSURANCE,
            defaults={
                'document_number': f'INS-2026-{8800 + idx}',
                'issue_date': today - timedelta(days=180),
                'expiry_date': today + timedelta(days=185),
                'issuer_authority': 'Global Fleet Assurance Corp'
            }
        )
        VehicleCompliance.objects.get_or_create(
            vehicle=v,
            document_type=VehicleCompliance.DocType.PUC,
            defaults={
                'document_number': f'PUC-2026-{1100 + idx}',
                'issue_date': today - timedelta(days=330),
                'expiry_date': today + timedelta(days=15 if idx % 3 == 0 else 120),
                'issuer_authority': 'Department of Motor Vehicles'
            }
        )
        if idx % 4 == 0:
            VehicleCompliance.objects.get_or_create(
                vehicle=v,
                document_type=VehicleCompliance.DocType.FITNESS,
                defaults={
                    'document_number': f'FIT-2025-00{idx}',
                    'issue_date': today - timedelta(days=380),
                    'expiry_date': today - timedelta(days=10),  # Expired
                    'issuer_authority': 'Commercial Transport Board'
                }
            )

    print("  ✓ Seeded Compliance Documents")

    # 5. Drivers
    drivers_info = [
        ('driver_john', 'John', 'Doe', 'DL-NY-9823145', 4.92, 98.50, DriverProfile.DutyStatus.ON_DUTY_AVAILABLE, vehicles[0], 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'),
        ('driver_sarah', 'Sarah', 'Jenkins', 'DL-CA-4451299', 4.88, 96.00, DriverProfile.DutyStatus.OFF_DUTY, None, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'),
        ('driver_marcus', 'Marcus', 'Vance', 'DL-TX-7712301', 4.95, 99.20, DriverProfile.DutyStatus.ON_DUTY_AVAILABLE, vehicles[2], 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'),
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
            dp.assigned_vehicle = assigned_v
            dp.save()

    print("  ✓ Seeded Driver Profiles")
    print("🎉 Seeding Completed Successfully!")

if __name__ == '__main__':
    seed_data()
