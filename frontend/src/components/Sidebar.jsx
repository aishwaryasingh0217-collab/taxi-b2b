import React from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  FileCheck, 
  Briefcase, 
  MapPin, 
  DollarSign, 
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
    { id: 'compliance', label: 'Compliance Vault', icon: FileCheck, badge: null, phase: 1 },
    { id: 'dispatches', label: 'B2B Dispatches', icon: Briefcase, badge: null, phase: 1 },
    { id: 'settlements', label: 'Financials', icon: DollarSign, badge: 'Phase 3', phase: 3 },
    { id: 'telematics', label: 'Live Telematics', icon: MapPin, badge: 'Phase 4', phase: 4 },
  ];

  return (
    <aside style={{
      width: '280px',
      background: '#ffffff',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      flexShrink: 0
    }}>
      <div>
        {/* MD3 Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '0 8px 24px 8px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'var(--accent-primary-container)',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--elevation-1)'
          }}>
            <Car size={24} color="#0b57d0" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>APEX FLEET</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 500 }}>Material 3 Operations</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div style={{ marginTop: '24px' }}>
          <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '0.08em', padding: '0 12px 12px 12px' }}>
            Main Menu
          </p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '28px',
                    border: 'none',
                    background: isActive ? 'var(--accent-primary-container)' : 'transparent',
                    color: isActive ? 'var(--accent-on-primary-container)' : isLocked ? 'var(--text-dim)' : 'var(--text-muted)',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    opacity: isLocked ? 0.65 : 1,
                    transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive && !isLocked) {
                      e.currentTarget.style.background = 'var(--md-surface-container)';
                      e.currentTarget.style.color = 'var(--text-main)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive && !isLocked) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <Icon size={20} color={isActive ? '#041e49' : isLocked ? '#9aa0a6' : '#5f6368'} />
                    <span style={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="badge badge-info" style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '12px' }}>{item.badge}</span>
                  ) : isActive ? (
                    <ChevronRight size={16} color="#041e49" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Info & Logout (MD3 Elevated Pill Card) */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: 'var(--md-surface-container)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#0b57d0',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}>
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{user?.first_name || user?.username || 'Fleet Manager'}</p>
              <span className="badge badge-success" style={{ fontSize: '0.65rem', marginTop: '2px', padding: '2px 6px' }}>
                {user?.role_display || 'Admin'}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            title="Logout"
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-color)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#c5221f',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--elevation-1)',
              transition: 'background 0.2s ease'
            }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
