import React, { useState } from 'react';
import { 
  Car, ShieldCheck, Star, Clock, CheckCircle2, ChevronRight, 
  ArrowRight, FileText, Phone, Mail, Award, MapPin, Zap, 
  Bus, Building2, Users, X, Shield, Lock, FileCheck
} from 'lucide-react';

const LandingPage = ({ onNavigateToLogin }) => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [activeTermsTab, setActiveTermsTab] = useState('billing');

  // Google Verified Reviews Data
  const googleReviews = [
    {
      id: 1,
      name: 'Vikram Malhotra',
      role: 'Managing Director',
      company: 'Horizon Tech Labs Ltd.',
      avatar: 'VM',
      avatarBg: '#1e293b',
      rating: 5,
      date: '2 weeks ago',
      content: 'Apex Fleet has been handling our leadership team’s daily commutes and executive airport transfers for 8 months. Flawless punctuality, immaculate cars, and the automated GST invoices are generated without a single discrepancy.',
      verified: true
    },
    {
      id: 2,
      name: 'Pooja Ramachandran',
      role: 'Head of Operations',
      company: 'Starlight Luxury Hospitality Group',
      avatar: 'PR',
      avatarBg: '#0f766e',
      rating: 5,
      date: '1 month ago',
      content: 'As a luxury boutique hotel, our VIP guests expect pristine vehicles and courteous chauffeurs. Apex Fleet’s executive sedans have exceeded every standard. Their 30-minute standby replacement SLA gives us complete confidence.',
      verified: true
    },
    {
      id: 3,
      name: 'Rohan Mehta',
      role: 'Senior Partner',
      company: 'Mehta & Associates Advisory',
      avatar: 'RM',
      avatarBg: '#4338ca',
      rating: 5,
      date: '3 weeks ago',
      content: 'We transitioned from ride-hailing apps to Apex Fleet for corporate client meetings. The fixed shift pricing saves us 30% monthly compared to surge tariffs, and the chauffeurs are properly uniformed and polite.',
      verified: true
    },
    {
      id: 4,
      name: 'Sunita Rao',
      role: 'VP Human Resources',
      company: 'CloudScale Enterprises',
      avatar: 'SR',
      avatarBg: '#b45309',
      rating: 5,
      date: 'Just recently',
      content: 'The compliance vault and background-verified driver papers made our internal audit completely seamless. Emergency SOS switches, speed governors, and clean cars give our traveling female executives complete safety.',
      verified: true
    }
  ];

  // Fleet Pricing Slabs
  const fleetCategories = [
    {
      title: 'Executive Sedans',
      subtitle: 'Audi A4, BMW 3, Mercedes C-Class & Premium Sedans',
      rate: '₹2,500',
      period: 'per 8-hr shift',
      extraKm: '₹15 / extra km',
      features: ['Leather seating', 'Dual-zone climate', 'Dual dashcam', 'Wi-Fi hotspot', 'Speed governor (80 km/h)'],
      icon: Car,
      tag: 'Most Popular'
    },
    {
      title: 'Electric Fleet (EV)',
      subtitle: 'Tesla, BYD Seal & Hyundai Ioniq Executive',
      rate: '₹3,200',
      period: 'per 8-hr shift',
      extraKm: '₹16 / extra km',
      features: ['Zero emissions', 'Whisper-quiet cabin', 'Fast charging priority', 'Corporate ESG compliant'],
      icon: Zap,
      tag: 'Zero Emission'
    },
    {
      title: 'Premium SUVs',
      subtitle: 'Toyota Fortuner, Audi Q5 & BMW X3',
      rate: '₹4,500',
      period: 'per 8-hr shift',
      extraKm: '₹18 / extra km',
      features: ['6-7 passenger seating', 'Spacious luggage boot', 'High ground clearance', 'Intercity comfort'],
      icon: Car,
      tag: 'Delegation Comfort'
    },
    {
      title: 'Passenger Vans',
      subtitle: 'Mercedes V-Class & Executive Shuttles',
      rate: '₹5,500',
      period: 'per 8-hr shift',
      extraKm: '₹22 / extra km',
      features: ['9-14 passenger luxury', 'Conference table setup', 'Public address system', 'Group delegates'],
      icon: Bus,
      tag: 'Group Shuttles'
    },
    {
      title: 'Luxury VIP Fleet',
      subtitle: 'Mercedes S-Class & BMW 7 Series',
      rate: '₹8,500',
      period: 'per 8-hr shift',
      extraKm: '₹30 / extra km',
      features: ['VIP rear reclining massage', 'Executive privacy shades', 'White-glove chauffeur', 'Armored option'],
      icon: Award,
      tag: 'Presidential / VIP'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'inherit' }}>
      
      {/* 1. STICKY TOP NAVIGATION BAR */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.9)',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: '#1e293b',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(15, 23, 42, 0.2)'
          }}>
            <Car size={22} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a', display: 'block', lineHeight: 1.1 }}>
              APEX FLEET
            </span>
            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Executive B2B Mobility
            </span>
          </div>
        </div>

        {/* Center Quick Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="hide-mobile">
          <a href="#services" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}>
            Corporate Solutions
          </a>
          <a href="#fleet" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}>
            Fleet & Pricing Slabs
          </a>
          <a href="#workflow" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}>
            How It Works
          </a>
          <a href="#reviews" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}>
            Google Reviews
          </a>
          <a href="#terms" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}>
            Compliance & SLAs
          </a>
        </div>

        {/* Right CTA Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => setShowTermsModal(true)}
            className="btn-secondary"
            style={{ 
              padding: '8px 16px', 
              borderRadius: '20px', 
              fontSize: '0.82rem', 
              fontWeight: 600,
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#334155'
            }}
          >
            <FileText size={15} />
            <span>Trusted Terms</span>
          </button>

          <button 
            onClick={onNavigateToLogin}
            className="btn-primary"
            style={{ 
              padding: '9px 20px', 
              borderRadius: '24px', 
              fontSize: '0.86rem', 
              fontWeight: 600,
              background: '#1e293b',
              color: '#ffffff',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
            }}
          >
            <span>Sign In to Console</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '72px 32px 64px 32px',
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        {/* Verification Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid #e2e8f0',
          padding: '6px 16px',
          borderRadius: '24px',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: '#1e293b',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          marginBottom: '24px'
        }}>
          <ShieldCheck size={16} color="#047857" />
          <span>100% RTO Verified • Police-Checked Chauffeurs • Fixed Shift Slabs</span>
        </div>

        {/* Main Headline */}
        <h1 style={{
          fontSize: 'clamp(2.1rem, 4.5vw, 3.4rem)',
          fontWeight: 800,
          color: '#0f172a',
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          maxWidth: '920px',
          margin: '0 0 20px 0'
        }}>
          Premium B2B Executive Mobility Built for Modern Businesses
        </h1>

        {/* Concise Logical Subtitle */}
        <p style={{
          fontSize: '1.08rem',
          color: '#475569',
          maxWidth: '740px',
          lineHeight: 1.6,
          margin: '0 0 32px 0',
          fontWeight: 500
        }}>
          Transparent shift contracts, background-verified executive chauffeurs, and a spotless fleet of executive sedans, EVs, and luxury SUVs for corporate staff, airport transfers, and VIP delegates.
        </p>

        {/* Hero CTAs */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
          <button 
            onClick={onNavigateToLogin}
            className="btn-primary"
            style={{ 
              padding: '14px 32px', 
              borderRadius: '28px', 
              fontSize: '0.96rem', 
              fontWeight: 700,
              background: '#1e293b',
              color: '#ffffff',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.2)'
            }}
          >
            <span>Access Enterprise Console</span>
            <ArrowRight size={17} />
          </button>

          <a 
            href="#fleet"
            className="btn-secondary"
            style={{ 
              padding: '14px 28px', 
              borderRadius: '28px', 
              fontSize: '0.96rem', 
              fontWeight: 600,
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#1e293b',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
            }}
          >
            <span>View Fleet & INR Rates</span>
          </a>
        </div>

        {/* 4 Trust Highlights Badges Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
          width: '100%',
          maxWidth: '1080px'
        }}>
          <div className="glass-card" style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
          }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={22} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <strong style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>99.8% On-Time</strong>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500 }}>Guaranteed Punctuality SLA</span>
            </div>
          </div>

          <div className="glass-card" style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
          }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <strong style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>100% Verified</strong>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500 }}>RTO Papers & Police Clear</span>
            </div>
          </div>

          <div className="glass-card" style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
          }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={22} fill="#b45309" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <strong style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>Google 4.9 ★</strong>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500 }}>184+ Verified Reviews</span>
            </div>
          </div>

          <div className="glass-card" style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
          }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#f5f3ff', color: '#6d28d9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileCheck size={22} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <strong style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>Zero Surge</strong>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500 }}>GST 100% Tax Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LOGICAL SERVICES SECTION (CONCISE & NOT LENGTHY) */}
      <section id="services" style={{ padding: '64px 32px', background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', display: 'block', marginBottom: '6px' }}>
              Tailored Corporate Logistics
            </span>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
              B2B Mobility Solutions Engineered for Businesses
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#64748b', marginTop: '8px', maxWidth: '620px', margin: '8px auto 0 auto' }}>
              Eliminate daily transport uncertainties with dedicated enterprise chauffeurs and guaranteed standby SLAs.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            
            <div className="glass-card" style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#1e293b', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  <Building2 size={24} />
                </div>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                  Corporate Daily & Shift Retainers
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                  Dedicated vehicles on 8-hour or 12-hour duty shifts for company directors, managers, and corporate client commutes. Flat pricing with zero surge.
                </p>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0 0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', color: '#334155' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} color="#047857" /> Assigned dedicated chauffeur
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} color="#047857" /> Daily automated digital trip log
                </li>
              </ul>
            </div>

            <div className="glass-card" style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#1e293b', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  <MapPin size={24} />
                </div>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                  Airport & Intercity VIP Transfers
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                  Meet-and-greet terminal gate arrivals with flight delay tracking, luggage assistance, and executive intercity road travel between business hubs.
                </p>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0 0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', color: '#334155' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} color="#047857" /> Live flight delay tracking
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} color="#047857" /> Complimentary waiting (60 mins)
                </li>
              </ul>
            </div>

            <div className="glass-card" style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#1e293b', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  <Users size={24} />
                </div>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                  Delegation & Corporate Events
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                  Coordinated multi-vehicle fleet dispatches for conferences, board meetings, VIP delegations, and industrial plant client tours.
                </p>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0 0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', color: '#334155' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} color="#047857" /> Dedicated route supervisor
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} color="#047857" /> 30-min standby vehicle backup
                </li>
              </ul>
            </div>

            <div className="glass-card" style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#047857', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  <Zap size={24} />
                </div>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                  Sustainable ESG Electric Fleet
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                  100% zero-emission electric sedans and SUVs helping corporate enterprises meet internal ESG environmental sustainability goals.
                </p>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0 0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', color: '#334155' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} color="#047857" /> Zero tailpipe CO2 emissions
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} color="#047857" /> Monthly carbon offset certificates
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 4. TRANSPARENT FLEET & INR (₹) PRICING SLABS */}
      <section id="fleet" style={{ padding: '64px 32px', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', display: 'block', marginBottom: '6px' }}>
            Transparent Tariff Slabs
          </span>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            Fleet Vehicle Classes & Commercial Rates (₹ INR)
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#64748b', marginTop: '8px', maxWidth: '640px', margin: '8px auto 0 auto' }}>
            All rates include certified chauffeur duty, commercial insurance, fuel allowance, and full GST tax invoices.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {fleetCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div 
                key={idx}
                className="glass-card"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '18px',
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e293b' }}>
                      <Icon size={20} />
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#1e293b', background: '#f1f5f9', padding: '3px 8px', borderRadius: '12px' }}>
                      {cat.tag}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                    {cat.title}
                  </h3>
                  <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0 0 16px 0', minHeight: '34px' }}>
                    {cat.subtitle}
                  </p>

                  <div style={{ padding: '14px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', marginBottom: '16px' }}>
                    <div style={{ fontSize: '1.55rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                      {cat.rate}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                      {cat.period} &nbsp;|&nbsp; <span style={{ color: '#047857', fontWeight: 600 }}>{cat.extraKm}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.74rem', color: '#334155' }}>
                    {cat.features.map((f, fIdx) => (
                      <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={13} color="#047857" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={onNavigateToLogin}
                  className="btn-secondary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    marginTop: '20px',
                    padding: '9px 0',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#1e293b'
                  }}
                >
                  Reserve on Console
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. HOW IT WORKS (LOGICAL 3-STEP PROCESS) */}
      <section id="workflow" style={{ padding: '64px 32px', background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', display: 'block', marginBottom: '6px' }}>
              Simple & Transparent
            </span>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
              How Apex Fleet Works for Your Organization
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            
            <div style={{ padding: '24px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1e293b', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', marginBottom: '14px' }}>
                1
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Select Vehicle Tier & Shift
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                Choose required vehicles by capacity, fuel type (Diesel, Petrol, EV), or luxury slab for daily or monthly corporate shifts.
              </p>
            </div>

            <div style={{ padding: '24px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1e293b', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', marginBottom: '14px' }}>
                2
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Certified Chauffeur Assigned
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                Background-verified, uniformed chauffeur arrives at designated reporting time with vehicle inspection report pre-checked.
              </p>
            </div>

            <div style={{ padding: '24px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1e293b', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', marginBottom: '14px' }}>
                3
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Digital Trip Sheet & GST Invoice
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                Odometer start/stop logged digitally via console. Itemized GST tax invoices generated automatically at month-end.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. GOOGLE REVIEWS SECTION (VERIFIED REVIEWS WITH GOOGLE BADGE) */}
      <section id="reviews" style={{ padding: '64px 32px', maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Google Reviews Header Box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '36px',
          paddingBottom: '20px',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              {/* Google Multicolor G Icon */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                fontWeight: 800,
                fontSize: '1.1rem'
              }}>
                <span style={{ color: '#4285F4' }}>G</span>
              </div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Google Verified Business Reviews
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              Rated 4.9/5 by 184+ corporate clients, managing directors, and logistics heads across India.
            </p>
          </div>

          {/* Rating Summary Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: '#ffffff',
            padding: '10px 18px',
            borderRadius: '24px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
          }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>4.9</span>
            <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#f59e0b" />
              ))}
            </div>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>184 Google Reviews</span>
          </div>
        </div>

        {/* 4 Testimonial Review Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '20px' }}>
          {googleReviews.map((rev) => (
            <div 
              key={rev.id}
              className="glass-card"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)'
              }}
            >
              <div>
                {/* Reviewer Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: rev.avatarBg,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.82rem'
                    }}>
                      {rev.avatar}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                        {rev.name}
                      </h4>
                      <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0 }}>
                        {rev.role}, {rev.company}
                      </p>
                    </div>
                  </div>
                  
                  {/* Google G icon */}
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4285F4' }}>G</span>
                </div>

                {/* Stars and Date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={13} fill="#f59e0b" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>• {rev.date}</span>
                </div>

                {/* Content Quote */}
                <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.55, margin: 0 }}>
                  "{rev.content}"
                </p>
              </div>

              {/* Verified Badge */}
              <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', color: '#047857', fontWeight: 600 }}>
                <ShieldCheck size={14} color="#047857" />
                <span>Verified Corporate Booking</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. TRUSTED TERMS & CONDITIONS SECTION */}
      <section id="terms" style={{ padding: '64px 32px', background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', marginBottom: '32px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                Legal & SLA Assurance
              </span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
                Trusted Terms, Corporate SLAs & Legal Compliance
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '6px', maxWidth: '640px' }}>
                Clear commercial contracts with no hidden fees, 100% legal RTO compliance, and certified chauffeur accountability.
              </p>
            </div>

            <button
              onClick={() => setShowTermsModal(true)}
              className="btn-primary"
              style={{
                padding: '10px 22px',
                borderRadius: '24px',
                fontSize: '0.84rem',
                fontWeight: 600,
                background: '#1e293b',
                color: '#ffffff',
                gap: '8px'
              }}
            >
              <FileText size={16} />
              <span>Read Complete Terms Agreement</span>
            </button>
          </div>

          {/* 4 Pillars of Trusted B2B Terms */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            
            <div style={{ padding: '20px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle2 size={18} color="#047857" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  1. Fixed Shift Tariff Policy
                </h4>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                8-hour base shift covers vehicle, chauffeur duty & standard fuel. Extra KM and hours are strictly charged according to published rate slabs.
              </p>
            </div>

            <div style={{ padding: '20px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle2 size={18} color="#047857" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  2. Chauffeur Standards & Checks
                </h4>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                Police-verified commercial license holders with defensive driving certifications. Strict zero-tolerance policy on intoxicants.
              </p>
            </div>

            <div style={{ padding: '20px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle2 size={18} color="#047857" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  3. 30-Min Standby Backup SLA
                </h4>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                In the rare event of mechanical failure or delay, a backup vehicle of equivalent or superior category is dispatched within 30 minutes.
              </p>
            </div>

            <div style={{ padding: '20px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle2 size={18} color="#047857" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  4. Non-Disclosure & Privacy
                </h4>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                All chauffeurs sign strict corporate non-disclosure agreements (NDA) ensuring confidential in-car conversations remain private.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION BANNER */}
      <section style={{ padding: '72px 32px', maxWidth: '1080px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          background: '#1e293b',
          color: '#ffffff',
          borderRadius: '24px',
          padding: '48px 36px',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 12px 0' }}>
            Ready to Streamline Your Corporate Mobility?
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#cbd5e1', maxWidth: '600px', lineHeight: 1.6, margin: '0 0 28px 0' }}>
            Sign in to the live Enterprise Dispatch Console to book shifts, monitor RTO papers, and manage company trips.
          </p>
          <button 
            onClick={onNavigateToLogin}
            className="btn-primary"
            style={{ 
              padding: '13px 32px', 
              borderRadius: '28px', 
              fontSize: '0.95rem', 
              fontWeight: 700,
              background: '#ffffff',
              color: '#1e293b',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)'
            }}
          >
            <span>Sign In to Enterprise Console</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer style={{
        background: '#0f172a',
        color: '#94a3b8',
        padding: '48px 32px 32px 32px',
        borderTop: '1px solid #1e293b'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px', marginBottom: '36px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#334155', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Car size={18} />
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>APEX FLEET</span>
            </div>
            <p style={{ fontSize: '0.8rem', lineHeight: 1.6, color: '#94a3b8' }}>
              Apex Fleet Logistics Ltd. Certified corporate mobility and executive chauffeur services for small & mid-sized businesses.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
              <a href="#services" style={{ color: '#94a3b8', textDecoration: 'none' }}>Corporate Services</a>
              <a href="#fleet" style={{ color: '#94a3b8', textDecoration: 'none' }}>Fleet Classes & Tariff</a>
              <a href="#reviews" style={{ color: '#94a3b8', textDecoration: 'none' }}>Google Reviews</a>
              <a href="#terms" style={{ color: '#94a3b8', textDecoration: 'none' }}>Compliance & SLAs</a>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Legal & Trust
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
              <span onClick={() => setShowTermsModal(true)} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Terms & Conditions</span>
              <span onClick={() => setShowTermsModal(true)} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Corporate SLA Agreement</span>
              <span onClick={() => setShowTermsModal(true)} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Data Privacy & Telematics</span>
              <span onClick={() => setShowTermsModal(true)} style={{ color: '#cbd5e1', cursor: 'pointer' }}>RTO Compliance Standards</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Corporate Desk
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} /> <span>+91 (0) 80 4920 8800</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} /> <span>corporate@apexfleet.in</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} /> <span>Apex Hub, Bengaluru & Mumbai</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '20px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.74rem' }}>
          <div>© 2026 Apex Fleet Logistics Ltd. All rights reserved. GST Registered.</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span onClick={() => setShowTermsModal(true)} style={{ cursor: 'pointer', color: '#cbd5e1' }}>Privacy Policy</span>
            <span onClick={() => setShowTermsModal(true)} style={{ cursor: 'pointer', color: '#cbd5e1' }}>Terms of Service</span>
            <span onClick={onNavigateToLogin} style={{ cursor: 'pointer', color: '#ffffff', fontWeight: 600 }}>Sign In to Console</span>
          </div>
        </div>
      </footer>

      {/* 10. INTERACTIVE TRUSTED TERMS & CONDITIONS MODAL */}
      {showTermsModal && (
        <div className="portal-modal-overlay" style={{ zIndex: 1000 }}>
          <div className="glass-panel portal-modal-card" style={{
            maxWidth: '780px',
            background: 'rgba(255, 255, 255, 0.98)',
            border: '1px solid #cbd5e1',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#1e293b', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Apex Fleet — Corporate Terms & Service Agreement
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>B2B Executive Mobility SLA & Compliance Standards (2026)</span>
                </div>
              </div>

              <button 
                onClick={() => setShowTermsModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Terms Tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setActiveTermsTab('billing')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '16px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: activeTermsTab === 'billing' ? '#1e293b' : '#f1f5f9',
                  color: activeTermsTab === 'billing' ? '#ffffff' : '#475569'
                }}
              >
                1. Tariff & Billing Slabs
              </button>
              <button 
                onClick={() => setActiveTermsTab('driver')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '16px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: activeTermsTab === 'driver' ? '#1e293b' : '#f1f5f9',
                  color: activeTermsTab === 'driver' ? '#ffffff' : '#475569'
                }}
              >
                2. Chauffeur Standards
              </button>
              <button 
                onClick={() => setActiveTermsTab('sla')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '16px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: activeTermsTab === 'sla' ? '#1e293b' : '#f1f5f9',
                  color: activeTermsTab === 'sla' ? '#ffffff' : '#475569'
                }}
              >
                3. On-Time SLA Guarantee
              </button>
              <button 
                onClick={() => setActiveTermsTab('cancel')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '16px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: activeTermsTab === 'cancel' ? '#1e293b' : '#f1f5f9',
                  color: activeTermsTab === 'cancel' ? '#ffffff' : '#475569'
                }}
              >
                4. Cancellation & Booking
              </button>
            </div>

            {/* Tab Contents */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '6px', fontSize: '0.84rem', color: '#334155', lineHeight: 1.6 }}>
              {activeTermsTab === 'billing' && (
                <div>
                  <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Transparent Shift Billing & Commercial Tariff</h4>
                  <p>• <strong>Fixed Shift Package:</strong> Base shift duration is 8 hours (or 80 kilometers included). Shift starts from scheduled garage or pickup reporting time as approved in the dispatch trip sheet.</p>
                  <p>• <strong>Overtime & Extra Mileage:</strong> Any mileage exceeding the base shift package will be charged at the vehicle tier rate slab (₹15 to ₹30/km). Additional hours beyond 8 hours are billed at pro-rata hourly rates.</p>
                  <p>• <strong>Toll & Parking Reimbursements:</strong> FASTag toll fees and parking receipts are logged electronically with digital receipts attached directly to the corporate monthly invoice.</p>
                  <p>• <strong>GST Tax Invoicing:</strong> All trips receive compliant GST e-invoices with full Input Tax Credit (ITC) eligibility for corporate tax filings.</p>
                </div>
              )}

              {activeTermsTab === 'driver' && (
                <div>
                  <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Chauffeur Vetting, Conduct & Safety Assurances</h4>
                  <p>• <strong>Comprehensive Background Checks:</strong> 100% of Apex Fleet chauffeurs undergo police verification, permanent address validation, and strict background checks before assignment.</p>
                  <p>• <strong>Professional Attire & Conduct:</strong> Chauffeurs report in formal corporate uniform, maintain discreet conduct, and are strictly prohibited from smoking, mobile usage while driving, or unauthorized stops.</p>
                  <p>• <strong>Passenger Confidentiality (NDA):</strong> Every chauffeur is bound by non-disclosure clauses regarding in-car conversations, delegate schedules, and client privacy.</p>
                  <p>• <strong>Zero Tolerance Policy:</strong> Immediate permanent de-allocation and disciplinary action for any safety infraction or customer discourtesy.</p>
                </div>
              )}

              {activeTermsTab === 'sla' && (
                <div>
                  <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>99.8% On-Time SLA & Standby Vehicle Assurance</h4>
                  <p>• <strong>Punctual Reporting:</strong> Chauffeurs report 15 minutes prior to confirmed reporting time at the designated company premises or airport terminal.</p>
                  <p>• <strong>30-Minute Standby Backup Guarantee:</strong> In the rare occurrence of mechanical breakdown, puncture, or delay, Apex Fleet commits to dispatching a replacement vehicle of equal or higher tier within 30 minutes.</p>
                  <p>• <strong>Telematics & Speed Monitoring:</strong> All fleet cars are equipped with telematics speed governors capped at 80 km/h and dual dashcams to guarantee executive passenger security.</p>
                </div>
              )}

              {activeTermsTab === 'cancel' && (
                <div>
                  <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Reservation, Modification & Cancellation Terms</h4>
                  <p>• <strong>Free Cancellation Window:</strong> Corporate reservations can be modified or cancelled free of charge up to 2 hours before the scheduled dispatch time.</p>
                  <p>• <strong>Late Cancellation:</strong> Cancellations made within 2 hours of scheduled reporting will attract a minimum 4-hour nominal standby charge.</p>
                  <p>• <strong>Flight Delay Leniency:</strong> For airport pickups, flight delays are monitored live by dispatchers; waiting time caused by airline delays will never incur cancellation penalties.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => setShowTermsModal(false)}
                className="btn-secondary"
                style={{ padding: '8px 20px', borderRadius: '18px', fontSize: '0.82rem' }}
              >
                Close Terms
              </button>
              <button 
                onClick={() => {
                  setShowTermsModal(false);
                  onNavigateToLogin();
                }}
                className="btn-primary"
                style={{ padding: '8px 22px', borderRadius: '18px', fontSize: '0.82rem', background: '#1e293b' }}
              >
                Accept & Sign In
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;
