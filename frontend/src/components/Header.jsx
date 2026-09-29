import React from 'react';
import { Shield, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ title }) => {
  const { user } = useAuth();

  return (
    <header style={{
      height: '74px',
      background: 'rgba(255, 255, 255, 0.82)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 36px',
      flexShrink: 0,
      boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.03)'
    }}>
      {/* Title - Clearly visible, high-contrast, elegant typography */}
      <div>
        <h2 style={{ 
          fontSize: '1.4rem', 
          fontWeight: 700, 
          color: '#0f172a', 
          letterSpacing: '-0.015em',
          margin: 0
        }}>
          {title}
        </h2>
        <p style={{ 
          fontSize: '0.8rem', 
          color: '#64748b', 
          fontWeight: 500,
          margin: 0,
          marginTop: '2px',
          letterSpacing: '0.01em'
        }}>
          Executive Chauffeur & Fleet Operations Console
        </p>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* System Health */}
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
          <Radio size={13} className="animate-pulse" />
          <span>Fleet Live</span>
        </div>

        {/* Company Badge - Clean Google-style neutral */}
        <div style={{
          padding: '6px 16px',
          background: 'rgba(241, 245, 249, 0.9)',
          border: '1px solid #cbd5e1',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.8rem',
          color: '#1e293b',
          fontWeight: 600
        }}>
          <Shield size={14} color="#334155" />
          <span>{user?.company_name || 'Apex Executive Mobility'}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
