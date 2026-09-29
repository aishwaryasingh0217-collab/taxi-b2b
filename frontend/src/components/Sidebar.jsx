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
    { id: 'dispatches', label: 'Trips & Daily Duty', icon: Briefcase, badge: null, phase: 1 },
    { id: 'vehicles', label: 'Fleet Cars', icon: Car, badge: null, phase: 1 },
    { id: 'drivers', label: 'Drivers & Staff', icon: Users, badge: null, phase: 1 },
    { id: 'compliance', label: 'Car Papers & Expiry', icon: FileCheck, badge: null, phase: 1 },
    { id: 'settlements', label: 'Billing & Invoices', icon: DollarSign, badge: 'Phase 3', phase: 3 },
    { id: 'telematics', label: 'Live GPS Map', icon: MapPin, badge: 'Phase 4', phase: 4 },
  ];

  return (
    <aside style={{
      width: '280px',
      background: 'rgba(255, 255, 255, 0.82)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      flexShrink: 0
    }}>
      <div>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '0 8px 24px 8px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: '#1e293b',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.15)'
          }}>
            <Car size={22} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)', margin: 0 }}>APEX FLEET</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 500, margin: 0 }}>Executive Mobility Operations</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div style={{ marginTop: '24px' }}>
          <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '0.08em', padding: '0 12px 12px 12px' }}>
            OPERATIONS
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
                    padding: '11px 16px',
                    borderRadius: '24px',
                    border: 'none',
                    background: isActive ? '#1e293b' : 'transparent',
                    color: isActive ? '#ffffff' : isLocked ? 'var(--text-dim)' : 'var(--text-muted)',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    opacity: isLocked ? 0.6 : 1,
                    transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive && !isLocked) {
                      e.currentTarget.style.background = 'rgba(241, 245, 249, 0.9)';
                      e.currentTarget.style.color = '#0f172a';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive && !isLocked) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={18} color={isActive ? '#ffffff' : isLocked ? '#94a3b8' : '#64748b'} />
                    <span style={{ fontSize: '0.88rem', fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span style={{ 
                      fontSize: '0.68rem', 
                      padding: '2px 8px', 
                      borderRadius: '12px',
                      background: 'rgba(241, 245, 249, 0.9)',
                      color: 'var(--text-dim)',
                      fontWeight: 600
                    }}>
                      {item.badge}
                    </span>
                  ) : isActive ? (
                    <ChevronRight size={15} color="#ffffff" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Info & Logout */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: 'rgba(241, 245, 249, 0.75)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#1e293b',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.82rem'
            }}>
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                {user?.username || 'Operator'}
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: 0, textTransform: 'capitalize' }}>
                {user?.role ? user.role.toLowerCase() : 'Operations'}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-dim)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '8px',
              transition: 'color 0.2s ease'
            }}
            title="Log Out"
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-danger)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
