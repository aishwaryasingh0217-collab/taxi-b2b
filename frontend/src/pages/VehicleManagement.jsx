import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  Car, Plus, Search, Filter, Fuel, Gauge, AlertCircle, CheckCircle2, 
  ShieldAlert, X, Eye, Calendar, FileText, Wrench, ShieldCheck, UserCheck, 
  LayoutGrid, Table, Zap, Crown, Bus, ChevronLeft, ChevronRight, Star, User
} from 'lucide-react';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (Showcase) or 'table'
  
  // Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Form State for Add Vehicle
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
    image_url: ''
  });

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await api.get('fleet/vehicles/');
      const data = res.data.results || res.data;
      setVehicles(data);
      if (selectedVehicle) {
        const updated = data.find(v => v.id === selectedVehicle.id);
        if (updated) setSelectedVehicle(updated);
      }
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
        image_url: ''
      });
    } catch (err) {
      alert('Error saving vehicle: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  const handleStatusChange = async (vehicleId, newStatus) => {
    try {
      await api.patch(`fleet/vehicles/${vehicleId}/`, { status: newStatus });
      fetchVehicles();
    } catch (err) {
      alert('Error updating status: ' + JSON.stringify(err.response?.data || err.message));
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

  // Category Configuration for Visual Showcase
  const categoryConfigs = {
    SEDAN: {
      title: 'Executive Sedans',
      subtitle: 'Premium corporate comfort & airport transfers',
      bgGradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
      icon: Car,
      rate: '$150 / shift'
    },
    EV: {
      title: 'Electric Fleet',
      subtitle: 'Zero emissions & eco executive dispatches',
      bgGradient: 'linear-gradient(135deg, #059669, #047857)',
      icon: Zap,
      rate: '$180 / shift'
    },
    SUV: {
      title: 'Premium SUVs',
      subtitle: 'Spacious 6-seater luxury & long distance',
      bgGradient: 'linear-gradient(135deg, #d97706, #b45309)',
      icon: Car,
      rate: '$220 / shift'
    },
    VAN: {
      title: 'Passenger Vans',
      subtitle: 'Corporate shuttles & multi-group transfers',
      bgGradient: 'linear-gradient(135deg, #0284c7, #0369a1)',
      icon: Bus,
      rate: '$260 / shift'
    },
    LUXURY: {
      title: 'Luxury Fleet',
      subtitle: 'VIP & Executive Class dispatches',
      bgGradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
      icon: Crown,
      rate: '$350 / shift'
    }
  };

  // Group vehicles by category
  const groupedVehicles = Object.keys(categoryConfigs).reduce((acc, catKey) => {
    const items = filteredVehicles.filter(v => (v.vehicle_class || 'SEDAN') === catKey);
    if (items.length > 0) acc[catKey] = items;
    return acc;
  }, {});

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Header & View Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Vehicle Master Registry</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Category-wise fleet dispatches, rate slabs, odometer readings, and compliance status.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* View Switcher Toggle */}
          <div style={{ display: 'flex', background: '#0f172a', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'grid' ? 'var(--accent-primary)' : 'transparent',
                color: viewMode === 'grid' ? '#fff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <LayoutGrid size={16} />
              <span>Showcase View</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'table' ? 'var(--accent-primary)' : 'transparent',
                color: viewMode === 'table' ? '#fff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <Table size={16} />
              <span>Table View</span>
            </button>
          </div>

          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            <Plus size={18} />
            <span>Add Vehicle</span>
          </button>
        </div>
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

      {/* VIEW MODE 1: SHOWCASE CARD CATEGORY CAROUSEL / GRID */}
      {viewMode === 'grid' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading fleet data from Django API...</div>
          ) : Object.keys(groupedVehicles).length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No vehicles found matching your search.</div>
          ) : (
            Object.entries(groupedVehicles).map(([catKey, vehicleList]) => {
              const cat = categoryConfigs[catKey] || categoryConfigs.SEDAN;
              const CatIcon = cat.icon;

              return (
                <div key={catKey} className="glass-panel" style={{ display: 'flex', overflow: 'hidden', minHeight: '260px' }}>
                  
                  {/* Category Banner Card (Left Side Block like WowGoa layout) */}
                  <div style={{
                    width: '260px',
                    background: cat.bgGradient,
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    color: '#fff',
                    flexShrink: 0
                  }}>
                    <div>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'center',
                        marginBottom: '16px'
                      }}>
                        <CatIcon size={24} color="#fff" />
                      </div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                        {cat.title}
                      </h3>
                      <p style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '6px', lineHeight: 1.4 }}>
                        {cat.subtitle}
                      </p>
                    </div>

                    <div>
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: '0.7rem' }}>
                        {vehicleList.length} Vehicles in Class
                      </span>
                      <p style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '8px', opacity: 0.95 }}>
                        Rate Slab: <strong style={{ color: '#fff' }}>{cat.rate}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Vehicle Cards Grid (Right Side Cards) */}
                  <div style={{
                    flex: 1,
                    padding: '20px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '16px',
                    overflowX: 'auto',
                    alignItems: 'stretch'
                  }}>
                    {vehicleList.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        onClick={() => setSelectedVehicle(vehicle)}
                        className="glass-card"
                        style={{
                          background: '#0f172a',
                          padding: '14px',
                          display: 'flex',
                          flexDirection: 'column',
                          justify: 'space-between',
                          cursor: 'pointer'
                        }}
                      >
                        {/* Vehicle Photo Container */}
                        <div style={{ position: 'relative', height: '130px', borderRadius: '10px', overflow: 'hidden', background: '#1e293b', marginBottom: '12px' }}>
                          {vehicle.image_url ? (
                            <img
                              src={vehicle.image_url}
                              alt={vehicle.registration_number}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Car size={40} color="var(--text-dim)" />
                            </div>
                          )}

                          {/* Status Badge Top Right */}
                          <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                            {getStatusBadge(vehicle.status)}
                          </div>

                          {/* Plate Badge Bottom Left */}
                          <div style={{
                            position: 'absolute',
                            bottom: '8px',
                            left: '8px',
                            background: 'rgba(0,0,0,0.75)',
                            backdropFilter: 'blur(4px)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: '#60a5fa'
                          }} className="font-mono">
                            {vehicle.registration_number}
                          </div>
                        </div>

                        {/* Title & Rating */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                              {vehicle.make} {vehicle.model}
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700 }}>
                              <Star size={12} fill="#fbbf24" />
                              <span>4.9</span>
                            </div>
                          </div>

                          {/* Specs Pills */}
                          <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                            <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{vehicle.fuel_type_display || vehicle.fuel_type}</span>
                            <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>{vehicle.seating_capacity} Seats</span>
                            <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{cat.rate}</span>
                          </div>
                        </div>

                        {/* Card Footer: Odometer & Driver Pairing */}
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>
                            <Gauge size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                            <strong className="font-mono" style={{ color: '#fff' }}>{Number(vehicle.current_odometer).toLocaleString()} KM</strong>
                          </span>
                          <span style={{ color: '#38bdf8', fontWeight: 600 }}>Inspect Details ➔</span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              );
            })
          )}
        </div>
      ) : (
        /* VIEW MODE 2: HIGH-DENSITY OPERATIONAL TABLE VIEW */
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading fleet data from Django API...</div>
          ) : filteredVehicles.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No vehicles found matching your criteria.</div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Vehicle Photo</th>
                  <th>Registration Plate</th>
                  <th>Make & Model</th>
                  <th>Class / Fuel</th>
                  <th>Odometer</th>
                  <th>Status</th>
                  <th>Compliance Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle) => (
                  <tr 
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ width: '90px' }}>
                      {vehicle.image_url ? (
                        <img
                          src={vehicle.image_url}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          style={{
                            width: '74px',
                            height: '48px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '74px',
                          height: '48px',
                          borderRadius: '8px',
                          background: 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'center'
                        }}>
                          <Car size={22} color="#3b82f6" />
                        </div>
                      )}
                    </td>
                    <td>
                      <div>
                        <strong className="font-mono" style={{ color: '#fff', fontSize: '0.9rem' }}>{vehicle.registration_number}</strong>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>VIN: {vehicle.vin}</p>
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
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVehicle(vehicle);
                        }}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                      >
                        <Eye size={14} />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* DETAILED VEHICLE MODAL */}
      {selectedVehicle && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.82)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', padding: '0' }}>
            
            {/* Modal Header Image Banner */}
            <div style={{ position: 'relative', height: '220px', background: '#0f172a', overflow: 'hidden' }}>
              {selectedVehicle.image_url ? (
                <img
                  src={selectedVehicle.image_url}
                  alt={selectedVehicle.registration_number}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
                  <Car size={64} color="var(--text-dim)" />
                </div>
              )}
              
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to top, rgba(15,23,42,1) 0%, rgba(15,23,42,0.4) 60%, rgba(0,0,0,0.6) 100%)'
              }} />

              <button
                onClick={() => setSelectedVehicle(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  cursor: 'pointer',
                  zIndex: 2
                }}
              >
                <X size={20} />
              </button>

              <div style={{ position: 'absolute', bottom: '16px', left: '24px', zIndex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-info">{selectedVehicle.vehicle_class_display || selectedVehicle.vehicle_class}</span>
                  <span className="badge badge-warning">{selectedVehicle.fuel_type_display || selectedVehicle.fuel_type}</span>
                  {getStatusBadge(selectedVehicle.status)}
                </div>
                <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
                  {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})
                </h2>
                <p className="font-mono" style={{ color: '#60a5fa', fontSize: '0.95rem', fontWeight: 600 }}>
                  Plate: {selectedVehicle.registration_number} &nbsp;|&nbsp; VIN: {selectedVehicle.vin}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <div style={{ padding: '14px', background: '#0f172a', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>ODOMETER</span>
                  <p className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                    {Number(selectedVehicle.current_odometer).toLocaleString()} KM
                  </p>
                </div>

                <div style={{ padding: '14px', background: '#0f172a', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>SEATING CAPACITY</span>
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                    {selectedVehicle.seating_capacity} Passengers
                  </p>
                </div>

                <div style={{ padding: '14px', background: '#0f172a', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>STATUS TOGGLE</span>
                  <select
                    className="select-field"
                    style={{ marginTop: '4px', padding: '4px 8px', fontSize: '0.8rem' }}
                    value={selectedVehicle.status}
                    onChange={(e) => handleStatusChange(selectedVehicle.id, e.target.value)}
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="ON_DUTY">On Duty</option>
                    <option value="IN_MAINTENANCE">In Maintenance</option>
                    <option value="DECOMMISSIONED">Decommissioned</option>
                  </select>
                </div>

                <div style={{ padding: '14px', background: '#0f172a', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>ASSIGNED DRIVER</span>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#34d399', marginTop: '6px' }}>
                    {selectedVehicle.current_driver && selectedVehicle.current_driver.length > 0 
                      ? selectedVehicle.current_driver[0].user_detail?.username 
                      : 'Unassigned / Available'}
                  </p>
                </div>
              </div>

              {/* Compliance Vault Documents Section */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="#3b82f6" />
                  <span>Compliance Vault & Legal Documents</span>
                </h4>

                {selectedVehicle.compliance_docs && selectedVehicle.compliance_docs.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {selectedVehicle.compliance_docs.map((doc) => (
                      <div key={doc.id} style={{
                        padding: '12px 16px',
                        background: '#0f172a',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between'
                      }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{doc.document_type_display || doc.document_type}</strong>
                            <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({doc.document_number})</span>
                          </div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                            Authority: {doc.issuer_authority || 'DMV / Transport Board'} | Issued: {doc.issue_date}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          {doc.computed_status === 'EXPIRED' ? (
                            <span className="badge badge-danger">EXPIRED ({doc.expiry_date})</span>
                          ) : doc.computed_status === 'EXPIRING_SOON' ? (
                            <span className="badge badge-warning">EXPIRING SOON ({doc.expiry_date})</span>
                          ) : (
                            <span className="badge badge-success">VALID (Exp: {doc.expiry_date})</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '16px', background: '#0f172a', borderRadius: '8px', border: '1px dashed var(--border-color)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No legal documents filed in vault yet.
                  </div>
                )}
              </div>

            </div>

            <div style={{ padding: '16px 24px', background: '#0f172a', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedVehicle(null)} className="btn-secondary">
                Close Panel
              </button>
            </div>

          </div>
        </div>
      )}

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

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Vehicle Image URL</label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
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
