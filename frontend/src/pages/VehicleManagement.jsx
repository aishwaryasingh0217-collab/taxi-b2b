import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Car, Plus, Search, Filter, Fuel, Gauge, AlertCircle, CheckCircle2, ShieldAlert, X } from 'lucide-react';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    registration_number: '',
    vin: '',
    make: '',
    model: '',
    year: 2025,
    vehicle_class: 'SEDAN',
    fuel_type: 'DIESEL',
    status: 'AVAILABLE',
    current_odometer: 0,
    seating_capacity: 4,
  });

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await api.get('fleet/vehicles/');
      setVehicles(res.data.results || res.data);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('fleet/vehicles/', formData);
      setShowAddModal(false);
      fetchVehicles();
      setFormData({
        registration_number: '',
        vin: '',
        make: '',
        model: '',
        year: 2025,
        vehicle_class: 'SEDAN',
        fuel_type: 'DIESEL',
        status: 'AVAILABLE',
        current_odometer: 0,
        seating_capacity: 4,
      });
    } catch (err) {
      alert('Error saving vehicle: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.registration_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vin.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? v.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="badge badge-success">Available</span>;
      case 'ON_DUTY':
        return <span className="badge badge-info">On Duty</span>;
      case 'IN_MAINTENANCE':
        return <span className="badge badge-warning">In Maintenance</span>;
      case 'DECOMMISSIONED':
        return <span className="badge badge-danger">Decommissioned</span>;
      default:
        return <span className="badge badge-info">{status}</span>;
    }
  };

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Header & Search Control */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Vehicle Master Registry</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Track VIN records, fuel types, odometer readings, and compliance status.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <Plus size={18} />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '38px' }}
            placeholder="Search by Registration Plate, VIN, Make, Model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ width: '200px' }}>
          <select
            className="select-field"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Vehicle Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="ON_DUTY">On Duty</option>
            <option value="IN_MAINTENANCE">In Maintenance</option>
            <option value="DECOMMISSIONED">Decommissioned</option>
          </select>
        </div>
      </div>

      {/* Vehicle Registry Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading fleet data from Django API...</div>
        ) : filteredVehicles.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No vehicles found matching your criteria.</div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Registration Plate</th>
                <th>Make & Model</th>
                <th>Class / Fuel</th>
                <th>Odometer</th>
                <th>Status</th>
                <th>Compliance Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                        <Car size={18} color="#3b82f6" />
                      </div>
                      <div>
                        <strong className="font-mono" style={{ color: '#fff', fontSize: '0.9rem' }}>{vehicle.registration_number}</strong>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>VIN: {vehicle.vin}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{vehicle.make} {vehicle.model}</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Year: {vehicle.year} ({vehicle.seating_capacity} Seats)</p>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{vehicle.vehicle_class_display || vehicle.vehicle_class}</span>
                      <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>{vehicle.fuel_type_display || vehicle.fuel_type}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f8fafc' }}>
                      <Gauge size={14} color="var(--text-muted)" />
                      <span className="font-mono" style={{ fontWeight: 600 }}>{Number(vehicle.current_odometer).toLocaleString()} KM</span>
                    </div>
                  </td>
                  <td>{getStatusBadge(vehicle.status)}</td>
                  <td>
                    {vehicle.compliance_docs && vehicle.compliance_docs.length > 0 ? (
                      vehicle.compliance_docs.some(d => d.computed_status === 'EXPIRED') ? (
                        <span className="badge badge-danger"><ShieldAlert size={12} /> Expired Doc</span>
                      ) : vehicle.compliance_docs.some(d => d.computed_status === 'EXPIRING_SOON') ? (
                        <span className="badge badge-warning"><AlertCircle size={12} /> Expiry Soon</span>
                      ) : (
                        <span className="badge badge-success"><CheckCircle2 size={12} /> Compliant</span>
                      )
                    ) : (
                      <span className="badge badge-success"><CheckCircle2 size={12} /> Valid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>Add Vehicle to Fleet</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Registration Plate *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. B2B-TX-505"
                  value={formData.registration_number}
                  onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>VIN Number *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. 1HGCR2F83HA005005"
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Make *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Toyota"
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Model *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Camry Hybrid"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Year</label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Class</label>
                <select
                  className="select-field"
                  value={formData.vehicle_class}
                  onChange={(e) => setFormData({ ...formData, vehicle_class: e.target.value })}
                >
                  <option value="SEDAN">Executive Sedan</option>
                  <option value="SUV">Premium SUV</option>
                  <option value="EV">Electric Vehicle</option>
                  <option value="VAN">Multi-Passenger Van</option>
                  <option value="LUXURY">Luxury Class</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Fuel Type</label>
                <select
                  className="select-field"
                  value={formData.fuel_type}
                  onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
                >
                  <option value="PETROL">Petrol</option>
                  <option value="DIESEL">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="ELECTRIC">Electric (EV)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Initial Odometer (KM)</label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.current_odometer}
                  onChange={(e) => setFormData({ ...formData, current_odometer: parseFloat(e.target.value) })}
                />
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default VehicleManagement;
