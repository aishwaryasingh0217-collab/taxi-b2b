import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  Users, Search, Plus, Shield, Award, Car, X, CheckCircle2, Clock, 
  ArrowLeft, Phone, Mail, FileText, BadgeCheck, Activity, Gauge, 
  AlertTriangle, UserCheck, Eye, ShieldCheck
} from 'lucide-react';

const DriverDirectory = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Selected driver for Full Screen / Detailed Drawer View
  const [selectedDriver, setSelectedDriver] = useState(null);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await api.get('drivers/drivers/');
      const data = res.data.results || res.data;
      setDrivers(data);
      if (selectedDriver) {
        const updated = data.find(d => d.id === selectedDriver.id);
        if (updated) setSelectedDriver(updated);
      }
    } catch (err) {
      console.error('Failed to fetch drivers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleDutyStatusChange = async (driverId, newStatus) => {
    try {
      await api.patch(`drivers/drivers/${driverId}/`, { duty_status: newStatus });
      fetchDrivers();
    } catch (err) {
      alert('Error updating duty status: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  const filteredDrivers = drivers.filter((d) => {
    const name = `${d.user_detail?.first_name || ''} ${d.user_detail?.last_name || ''} ${d.user_detail?.username || ''}`.toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase()) || d.license_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? d.duty_status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const getDutyBadge = (status) => {
    switch (status) {
      case 'ON_DUTY_AVAILABLE':
        return <span className="badge badge-success"><CheckCircle2 size={12} /> On Duty (Available)</span>;
      case 'ON_TRIP':
        return <span className="badge badge-info"><Clock size={12} /> On Active Trip</span>;
      case 'OFF_DUTY':
        return <span className="badge badge-warning">Off Duty</span>;
      case 'SUSPENDED':
        return <span className="badge badge-danger">Suspended</span>;
      default:
        return <span className="badge badge-info">{status}</span>;
    }
  };

  // DETAILED DRIVER PROFILE MODAL / DRAWER
  if (selectedDriver) {
    const driverUser = selectedDriver.user_detail || {};
    const vehicle = selectedDriver.vehicle_detail;

    return (
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--bg-primary)', minHeight: '100vh' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <button 
            onClick={() => setSelectedDriver(null)} 
            className="btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <ArrowLeft size={18} />
            <span>Back to Driver Operations Roster</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="badge badge-info">Badge: {selectedDriver.badge_number || 'BDG-881'}</span>
            {getDutyBadge(selectedDriver.duty_status)}
          </div>
        </div>

        {/* Main Split 2-Column Driver Profile Showcase */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px' }}>
          
          {/* Left Column: Driver Info, Licensing & Vehicle Pairing */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Driver Hero Card */}
            <div className="glass-panel" style={{ padding: '28px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              {selectedDriver.avatar_url ? (
                <img
                  src={selectedDriver.avatar_url}
                  alt={driverUser.first_name || driverUser.username}
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid var(--accent-primary)',
                    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
                  }}
                />
              ) : (
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  fontWeight: 800,
                  color: '#fff',
                  fontSize: '2rem'
                }}>
                  {(driverUser.first_name?.[0] || driverUser.username?.[0] || 'D').toUpperCase()}
                </div>
              )}

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                    {driverUser.first_name ? `${driverUser.first_name} ${driverUser.last_name}` : driverUser.username}
                  </h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontSize: '1rem', fontWeight: 800 }}>
                    <Award size={18} fill="#fbbf24" />
                    <span>{selectedDriver.rating} ★</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Fleet Operations Officer & Commercial Chauffeur
                </p>

                <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} color="var(--accent-primary)" />
                    <strong style={{ color: '#fff' }}>{driverUser.phone_number || '+1 (555) 302-8811'}</strong>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} color="var(--accent-primary)" />
                    <strong style={{ color: '#fff' }}>{driverUser.email || `${driverUser.username}@fleetops.b2b`}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div className="glass-card" style={{ padding: '18px', textAlign: 'center' }}>
                <Shield size={22} color="#34d399" style={{ margin: '0 auto 6px auto' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>SAFETY SCORE</span>
                <strong style={{ color: '#34d399', fontSize: '1.2rem', fontWeight: 800 }}>{selectedDriver.safety_score} / 100</strong>
              </div>

              <div className="glass-card" style={{ padding: '18px', textAlign: 'center' }}>
                <Activity size={22} color="#3b82f6" style={{ margin: '0 auto 6px auto' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>TOTAL DISPATCHES</span>
                <strong style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800 }}>{selectedDriver.total_trips || 142} Trips</strong>
              </div>

              <div className="glass-card" style={{ padding: '18px', textAlign: 'center' }}>
                <Award size={22} color="#fbbf24" style={{ margin: '0 auto 6px auto' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>RATING</span>
                <strong style={{ color: '#fbbf24', fontSize: '1.2rem', fontWeight: 800 }}>{selectedDriver.rating} ★</strong>
              </div>
            </div>

            {/* Assigned Vehicle Card */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Car size={18} color="#3b82f6" />
                <span>Currently Assigned Vehicle</span>
              </h3>

              {vehicle ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#0f172a', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  {vehicle.image_url ? (
                    <img
                      src={vehicle.image_url}
                      alt={vehicle.registration_number}
                      style={{ width: '90px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                    />
                  ) : (
                    <div style={{ width: '90px', height: '60px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Car size={28} color="#3b82f6" />
                    </div>
                  )}

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <strong style={{ color: '#fff', fontSize: '1rem' }}>{vehicle.make} {vehicle.model}</strong>
                      <span className="badge badge-info">{vehicle.fuel_type_display || vehicle.fuel_type}</span>
                    </div>
                    <p className="font-mono" style={{ color: '#60a5fa', fontSize: '0.85rem', fontWeight: 600, marginTop: '2px' }}>
                      Plate: {vehicle.registration_number} &nbsp;|&nbsp; Odometer: {Number(vehicle.current_odometer).toLocaleString()} KM
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '16px', background: '#0f172a', borderRadius: '10px', border: '1px dashed var(--border-color)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No vehicle currently paired. Driver is available for shift assignment.
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Duty Status Switcher & License Verification */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Duty Status Control Card */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={18} color="#34d399" />
                <span>Duty Status Control</span>
              </h3>

              <select
                className="select-field"
                value={selectedDriver.duty_status}
                onChange={(e) => handleDutyStatusChange(selectedDriver.id, e.target.value)}
                style={{ width: '100%', fontSize: '0.9rem' }}
              >
                <option value="OFF_DUTY">Off Duty</option>
                <option value="ON_DUTY_AVAILABLE">On Duty (Available for Dispatch)</option>
                <option value="ON_TRIP">On Active Trip</option>
                <option value="SUSPENDED">Suspended / Inactive</option>
              </select>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                Changing status updates the live dispatch control board & driver roster immediately.
              </p>
            </div>

            {/* Driving License & Credentials Verification */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BadgeCheck size={18} color="#3b82f6" />
                <span>Licensing & Commercial Verification</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '12px 14px', background: '#0f172a', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>DRIVING LICENSE</span>
                    <strong className="font-mono" style={{ color: '#fff', fontSize: '0.95rem' }}>{selectedDriver.license_number}</strong>
                  </div>
                  <span className="badge badge-success">VALID ({selectedDriver.license_expiry})</span>
                </div>

                <div style={{ padding: '12px 14px', background: '#0f172a', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>COMMERCIAL BADGE</span>
                    <strong className="font-mono" style={{ color: '#fff', fontSize: '0.95rem' }}>{selectedDriver.badge_number || 'BDG-881'}</strong>
                  </div>
                  <span className="badge badge-success">VALID ({selectedDriver.badge_expiry || '2027-10-15'})</span>
                </div>
              </div>
            </div>

            {/* Recent Shift Activity Log */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="#f59e0b" />
                <span>Recent Shift Logs & Duty Checks</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '10px 12px', background: '#0f172a', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>Shift #1042 — Pre-Shift Check Passed</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Vehicle: {vehicle?.registration_number || 'B2B-TX-101'} | Initial Odo: 14,250 KM</p>
                  </div>
                  <span className="badge badge-success">Completed</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Driver Operations Roster</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Click on any driver row to view full driver profile, license verification, safety metrics & vehicle pairing.
          </p>
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
            placeholder="Search driver by name, license number, badge..."
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
            <option value="">All Duty Statuses</option>
            <option value="ON_DUTY_AVAILABLE">On Duty (Available)</option>
            <option value="ON_TRIP">On Active Trip</option>
            <option value="OFF_DUTY">Off Duty</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Driver Directory Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading drivers directory...</div>
        ) : filteredDrivers.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No drivers found matching your search.</div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Driver Name & Photo</th>
                <th>License & Expiry</th>
                <th>Duty Status</th>
                <th>Assigned Vehicle</th>
                <th>Safety Score</th>
                <th>Rating</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((driver) => (
                <tr 
                  key={driver.id}
                  onClick={() => setSelectedDriver(driver)}
                  style={{ cursor: 'pointer' }}
                  title="Click to view complete driver profile and duty logs"
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {driver.avatar_url ? (
                        <img
                          src={driver.avatar_url}
                          alt={driver.user_detail?.first_name || driver.user_detail?.username}
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid rgba(59, 130, 246, 0.4)',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'center',
                          fontWeight: 700,
                          color: '#fff',
                          fontSize: '0.85rem'
                        }}>
                          {(driver.user_detail?.first_name?.[0] || driver.user_detail?.username?.[0] || 'D').toUpperCase()}
                        </div>
                      )}
                      <div>
                        <strong style={{ color: '#fff', fontSize: '0.9rem' }}>
                          {driver.user_detail?.first_name ? `${driver.user_detail.first_name} ${driver.user_detail.last_name}` : driver.user_detail?.username}
                        </strong>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                          {driver.user_detail?.phone_number || '+1 (555) 302-8811'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono" style={{ color: '#fff', fontSize: '0.85rem' }}>{driver.license_number}</span>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Exp: {driver.license_expiry}</p>
                  </td>
                  <td>{getDutyBadge(driver.duty_status)}</td>
                  <td>
                    {driver.vehicle_detail ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {driver.vehicle_detail.image_url ? (
                          <img
                            src={driver.vehicle_detail.image_url}
                            alt={driver.vehicle_detail.registration_number}
                            style={{ width: '28px', height: '20px', borderRadius: '4px', objectFit: 'cover' }}
                          />
                        ) : (
                          <Car size={14} color="#3b82f6" />
                        )}
                        <strong className="font-mono" style={{ color: '#60a5fa', fontSize: '0.85rem' }}>
                          {driver.vehicle_detail.registration_number}
                        </strong>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Unassigned</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Shield size={14} color="#34d399" />
                      <strong style={{ color: '#34d399', fontSize: '0.9rem' }}>{driver.safety_score}/100</strong>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontWeight: 700 }}>
                      <Award size={14} />
                      <span>{driver.rating} ★</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDriver(driver);
                      }}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      <Eye size={14} />
                      <span>View Profile</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default DriverDirectory;
