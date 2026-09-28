import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Car, Users, CheckCircle2, AlertTriangle, ShieldCheck, Activity, Wrench, ArrowUpRight } from 'lucide-react';

const DashboardOverview = ({ setActiveTab }) => {
  const [vehicleSummary, setVehicleSummary] = useState({ total_vehicles: 0, available: 0, on_duty: 0, in_maintenance: 0 });
  const [driverSummary, setDriverSummary] = useState({ total_drivers: 0, on_duty: 0, on_trip: 0, off_duty: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vRes, dRes] = await Promise.all([
          api.get('fleet/vehicles/summary/'),
          api.get('drivers/drivers/summary/'),
        ]);
        setVehicleSummary(vRes.data);
        setDriverSummary(dRes.data);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const utilizationRate = vehicleSummary.total_vehicles > 0 
    ? Math.round((vehicleSummary.on_duty / vehicleSummary.total_vehicles) * 100) 
    : 0;

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner / Hero Metric */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between'
      }}>
        <div>
          <span className="badge badge-info" style={{ marginBottom: '8px' }}>B2B Operations Status</span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Fleet Operational Readiness: <span style={{ color: '#34d399' }}>94.2%</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Active duty assignments, driver safety scores, and compliance monitoring across Metro Fleet.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setActiveTab('vehicles')} className="btn-primary">
            <Car size={16} />
            <span>Manage Vehicles</span>
          </button>
          <button onClick={() => setActiveTab('drivers')} className="btn-secondary">
            <Users size={16} />
            <span>Driver Roster</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Card 1: Total Fleet */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>TOTAL VEHICLES</span>
            <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '10px' }}>
              <Car size={20} color="#3b82f6" />
            </div>
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '10px' }}>
            {loading ? '...' : vehicleSummary.total_vehicles}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem', color: '#34d399' }}>
            <CheckCircle2 size={14} />
            <span>{vehicleSummary.available} Available for dispatch</span>
          </div>
        </div>

        {/* Card 2: On Duty Vehicles */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>ON DUTY / DISPATCHED</span>
            <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '10px' }}>
              <Activity size={20} color="#10b981" />
            </div>
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '10px' }}>
            {loading ? '...' : vehicleSummary.on_duty}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Fleet Utilization: <strong style={{ color: '#38bdf8' }}>{utilizationRate}%</strong></span>
          </div>
        </div>

        {/* Card 3: Active Drivers */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>ACTIVE DRIVERS</span>
            <div style={{ padding: '8px', background: 'rgba(6, 182, 212, 0.15)', borderRadius: '10px' }}>
              <Users size={20} color="#06b6d4" />
            </div>
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '10px' }}>
            {loading ? '...' : driverSummary.total_drivers}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem', color: '#34d399' }}>
            <ShieldCheck size={14} />
            <span>Avg Safety Score: <strong>97.8/100</strong></span>
          </div>
        </div>

        {/* Card 4: In Maintenance */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>IN MAINTENANCE</span>
            <div style={{ padding: '8px', background: 'rgba(245, 158, 11, 0.15)', borderRadius: '10px' }}>
              <Wrench size={20} color="#f59e0b" />
            </div>
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '10px' }}>
            {loading ? '...' : vehicleSummary.in_maintenance}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem', color: '#fbbf24' }}>
            <AlertTriangle size={14} />
            <span>Scheduled routine service</span>
          </div>
        </div>

      </div>

      {/* Operational Highlights Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Left Column: Quick B2B Fleet Capabilities */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
            B2B Operations Architecture Capabilities
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ padding: '16px', background: '#0f172a', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge badge-success">Phase 1 Live</span>
                <strong style={{ color: '#fff', fontSize: '0.9rem' }}>Vehicle & Driver Registry</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ACID relational models for VIN, compliance documents, driver licensing & duty status.
              </p>
            </div>

            <div style={{ padding: '16px', background: '#0f172a', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge badge-info">Phase 2 Next</span>
                <strong style={{ color: '#fff', fontSize: '0.9rem' }}>Shift Handover & Inspection</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Digital pre-inspection checklist, start/end odometer verification, shift log logs.
              </p>
            </div>

            <div style={{ padding: '16px', background: '#0f172a', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge badge-warning">Phase 3 Planned</span>
                <strong style={{ color: '#fff', fontSize: '0.9rem' }}>Corporate Billing Engine</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Contract pricing cards, corporate retainer billing, toll reimbursements & driver payouts.
              </p>
            </div>

            <div style={{ padding: '16px', background: '#0f172a', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge badge-warning">Phase 4 Planned</span>
                <strong style={{ color: '#fff', fontSize: '0.9rem' }}>Live Telematics & Redis</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Real-time GPS ingestion, geofence alerts, speed monitoring & live operational map.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Fleet Compliance Alert Box */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <AlertTriangle size={20} color="#f59e0b" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Compliance Alerts</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '10px 12px', background: 'rgba(245, 158, 11, 0.1)', borderLeft: '3px solid #f59e0b', borderRadius: '4px' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fbbf24' }}>PUC Certificate Expiring</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>B2B-TX-101 (Toyota Camry) — Expiry in 15 days</p>
              </div>

              <div style={{ padding: '10px 12px', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid #ef4444', borderRadius: '4px' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f87171' }}>Fitness Certificate Expired</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>B2B-VAN-404 (Mercedes Metris) — Expired 10 days ago</p>
              </div>
            </div>
          </div>

          <button onClick={() => setActiveTab('vehicles')} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
            <span>View Full Compliance Vault</span>
            <ArrowUpRight size={16} />
          </button>
        </div>

      </div>

    </div>
  );
};

export default DashboardOverview;
