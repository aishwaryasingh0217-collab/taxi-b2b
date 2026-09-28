import React from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  FileCheck, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  ShieldAlert,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null, phase: 1 },
    { id: 'vehicles', label: 'Fleet Vehicles', icon: Car, badge: null, phase: 1 },
    { id: 'drivers', label: 'Driver Operations', icon: Users, badge: null, phase: 1 },
    { id: 'compliance', label: 'Compliance Vault', icon: FileCheck, badge: 'Phase 2', phase: 2 },
    { id: 'dispatches', label: 'B2B Dispatches', icon: Briefcase, badge: 'Phase 3', phase: 3 },
    { id: 'settlements', label: 'Financials', icon: DollarSign, badge: 'Phase 3', phase: 3 },
    { id: 'telematics', label: 'Live Telematics', icon: MapPin, badge: 'Phase 4', phase: 4 },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      justify: 'space-between',
      padding: '20px 14px'
    }}>
      <div>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px 24px 8px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(59, 130, 246, 0.4)'
          }}>
            <Car size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>APEX FLEET</h1>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>B2B Operations Platform</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div style={{ marginTop: '20px' }}>
          <p style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.08em', padding: '0 10px 10px 10px' }}>
            Main Menu
          </p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isLocked = item.phase > 1;

              return (
                <button
                  key={item.id}
                  onClick={() => !isLocked && setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: isActive ? 'linear-gradient(90deg, rgba(59, 130, 246, 0.18), rgba(59, 130, 246, 0.04))' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                    color: isActive ? '#fff' : isLocked ? 'var(--text-dim)' : 'var(--text-muted)',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    opacity: isLocked ? 0.65 : 1,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={18} color={isActive ? 'var(--accent-primary)' : isLocked ? '#64748b' : '#94a3b8'} />
                    <span style={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="badge badge-info" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>{item.badge}</span>
                  ) : isActive ? (
                    <ChevronRight size={14} color="var(--accent-primary)" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Info & Logout */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px' }}>
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{user?.first_name || user?.username || 'Fleet Manager'}</p>
            <span className="badge badge-success" style={{ fontSize: '0.65rem', marginTop: '2px' }}>
              {user?.role_display || 'Admin'}
            </span>
          </div>
          <button
            onClick={logout}
            title="Logout"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '8px',
              padding: '8px',
              color: '#f87171',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center'
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
