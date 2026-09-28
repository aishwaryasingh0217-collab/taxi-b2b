import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Users, Search, Plus, Shield, Award, Car, X, CheckCircle2, Clock } from 'lucide-react';

const DriverDirectory = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await api.get('drivers/drivers/');
      setDrivers(res.data.results || res.data);
    } catch (err) {
      console.error('Failed to fetch drivers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

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

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Driver Operations Roster</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Manage driver profiles, photo verification, licensing, duty statuses, and safety scores.
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
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((driver) => (
                <tr key={driver.id}>
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
                          {driver.user_detail?.phone_number || 'No Phone'}
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
