import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Car, Lock, User, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(username, password);
    if (!res.success) {
      setError(res.error);
    }
  };

  const handleQuickLogin = async (userVal, passVal) => {
    setUsername(userVal);
    setPassword(passVal);
    setError('');
    const res = await login(userVal, passVal);
    if (!res.success) {
      setError(res.error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--md-surface-container)',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        padding: '44px 36px',
        background: '#ffffff',
        borderRadius: '28px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--elevation-3)'
      }}>
        {/* Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '20px',
            background: 'var(--accent-primary-container)',
            color: 'var(--accent-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--elevation-1)',
            marginBottom: '16px'
          }}>
            <Car size={32} color="#0b57d0" />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>APEX FLEET B2B</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Enterprise Driver & Fleet Operations Engine
          </p>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px',
            background: 'var(--color-danger-bg)',
            border: '1px solid var(--color-danger-border)',
            borderRadius: '12px',
            color: 'var(--color-danger)',
            fontSize: '0.85rem',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-main)', marginBottom: '6px' }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '42px', borderRadius: '12px' }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-main)', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                className="input-field"
                style={{ paddingLeft: '42px', borderRadius: '12px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: '10px', borderRadius: '28px', fontSize: '0.95rem' }}
          >
            {loading ? 'Authenticating...' : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Preset Quick Login Buttons */}
        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center', marginBottom: '12px', fontWeight: 600, letterSpacing: '0.04em' }}>
            DEMO ROLES QUICK ACCESS
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
              onClick={() => handleQuickLogin('admin', 'admin123')}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '8px 14px', borderRadius: '16px' }}
            >
              Fleet Admin
            </button>
            <button
              onClick={() => handleQuickLogin('dispatcher1', 'pass123')}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '8px 14px', borderRadius: '16px' }}
            >
              Dispatcher
            </button>
            <button
              onClick={() => handleQuickLogin('driver_john', 'pass123')}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '8px 14px', borderRadius: '16px' }}
            >
              Driver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
