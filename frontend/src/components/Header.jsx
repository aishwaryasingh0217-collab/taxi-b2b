import React from 'react';
import { Search, Bell, Shield, Database, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ title }) => {
  const { user } = useAuth();

  return (
    <header style={{
      height: '68px',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between',
      padding: '0 28px'
    }}>
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{title}</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time Fleet Operations Control Center</p>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* System Health */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem',
          color: '#34d399',
          fontWeight: 600
        }}>
          <Radio size={14} className="animate-pulse" />
          <span>DRF + MySQL Online</span>
        </div>

        {/* User Role Badge */}
        <div style={{
          padding: '6px 14px',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.8rem',
          color: '#60a5fa',
          fontWeight: 600
        }}>
          <Shield size={14} />
          <span>{user?.company_name || 'Metro Fleet B2B'}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
