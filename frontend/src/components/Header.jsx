import React from 'react';
import { Shield, Radio, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ title }) => {
  const { user } = useAuth();

  return (
    <header style={{
      height: '72px',
      background: '#ffffff',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      flexShrink: 0,
      boxShadow: '0 1px 2px 0 rgba(60,64,67,0.06)'
    }}>
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.015em' }}>{title}</h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 400 }}>Real-time Fleet Operations Control Center</p>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* System Health MD3 Tonal Chip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          background: 'var(--color-success-bg)',
          border: '1px solid var(--color-success-border)',
          borderRadius: '20px',
          fontSize: '0.78rem',
          color: 'var(--color-success)',
          fontWeight: 600
        }}>
          <Radio size={14} className="animate-pulse" />
          <span>DRF + MySQL Online</span>
        </div>

        {/* User Role / Company MD3 Chip */}
        <div style={{
          padding: '6px 16px',
          background: 'var(--accent-primary-container)',
          border: '1px solid rgba(11, 87, 208, 0.15)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.8rem',
          color: 'var(--accent-on-primary-container)',
          fontWeight: 600
        }}>
          <Shield size={14} color="#0b57d0" />
          <span>{user?.company_name || 'Metro Fleet B2B'}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
