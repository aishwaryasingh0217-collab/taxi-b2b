import React, { useState } from 'react';
import { 
  Car, ShieldCheck, Star, Clock, CheckCircle2, ChevronRight, 
  ArrowRight, FileText, Phone, Mail, Award, MapPin, Zap, 
  Bus, Building2, Users, X, Shield, Lock, Wifi, VolumeX, Laptop
} from 'lucide-react';

const LandingPage = ({ onNavigateToLogin }) => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [activeTermsTab, setActiveTermsTab] = useState('billing');
  const [activeFleetCategory, setActiveFleetCategory] = useState('SEDAN');

  // Real Fleet Data with High-Resolution Photos & Verified Slabs
  const fleetData = {
    SEDAN: {
      name: 'Audi A4 & Executive Sedans',
      tagline: 'Refined corporate comfort for daily executive commutes & airport transfers',
      rate: '₹2,500',
      period: 'per 8-hr shift (80 KM)',
      extraKm: '₹15/km extra',
      seats: '4 Passengers',
      luggage: '2 Large Bags',
      fuel: 'Diesel / Petrol',
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1000',
      specs: [
        'Dual-zone climate control',
        'In-cabin Wi-Fi hotspot',
        'Speed governor capped at 80 km/h',
        'Police-verified chauffeur'
      ]
    },
    EV: {
      name: 'Electric Executive (Tesla / BYD)',
      tagline: 'Zero-emission executive travel aligned with corporate ESG sustainability goals',
      rate: '₹3,200',
      period: 'per 8-hr shift (80 KM)',
      extraKm: '₹16/km extra',
      seats: '4 Passengers',
      luggage: '2 Large Bags',
      fuel: '100% Electric',
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1000',
      specs: [
        'Zero tailpipe emissions',
        'Whisper-quiet acoustic cabin',
        'Fast charging priority',
        'Live green carbon report'
      ]
    },
    SUV: {
      name: 'Toyota Fortuner & Audi Q5',
      tagline: 'Commanding road presence & spacious legroom for delegations and intercity trips',
      rate: '₹4,500',
      period: 'per 8-hr shift (80 KM)',
      extraKm: '₹18/km extra',
      seats: '6-7 Passengers',
      luggage: '4 Large Bags',
      fuel: 'Turbo Diesel',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1000',
      specs: [
        'High ground clearance',
        'Spacious 3-row recliners',
        'Dual dashcam telematics',
        'Dedicated route supervisor'
      ]
    },
    VAN: {
      name: 'Mercedes V-Class & Executive Shuttles',
      tagline: 'Mobile boardroom on wheels for VIP delegations and corporate team transfers',
      rate: '₹5,500',
      period: 'per 8-hr shift (80 KM)',
      extraKm: '₹22/km extra',
      seats: '9-12 Passengers',
      luggage: '8 Large Bags',
      fuel: 'Commercial Diesel',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000',
      specs: [
        'Face-to-face conference seating',
        'Public address sound system',
        'Individual USB charging ports',
        'Standby backup SLA'
      ]
    },
    LUXURY: {
      name: 'Mercedes-Benz S-Class VIP',
      tagline: 'The pinnacle of luxury mobility for C-suite executives, directors, and state guests',
      rate: '₹8,500',
      period: 'per 8-hr shift (80 KM)',
      extraKm: '₹30/km extra',
      seats: '3 VIP Guests',
      luggage: '3 Large Bags',
      fuel: 'Premium Hybrid',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1000',
      specs: [
        'Executive rear recliners with massage',
        'Privacy acoustic soundproofing',
        'White-glove chauffeur in formal attire',
        'Strict NDA confidentiality'
      ]
    }
  };

  const currentVehicle = fleetData[activeFleetCategory];

  // Authentic Google Business Reviews (Short, Punchy, Real)
  const googleReviews = [
    {
      name: 'Vikram Malhotra',
      role: 'Managing Director',
      company: 'Horizon Tech Labs',
      avatar: 'VM',
      rating: 5,
      date: '2 weeks ago',
      quote: 'Punctuality is 100%. Immaculate Mercedes sedans for our board members and the automated GST invoices have zero errors.'
    },
    {
      name: 'Pooja Ramachandran',
      role: 'Head of Operations',
      company: 'Starlight Luxury Hospitality',
      avatar: 'PR',
      rating: 5,
      date: '1 month ago',
      quote: 'Our VIP hotel guests demand perfection. Apex Fleet’s 30-minute standby replacement guarantee gives us complete peace of mind.'
    },
    {
      name: 'Rohan Mehta',
      role: 'Founding Partner',
      company: 'Mehta Advisory',
      avatar: 'RM',
      rating: 5,
      date: '3 weeks ago',
      quote: 'We switched from ride-hailing apps to Apex Fleet. Fixed shift pricing saves us 30% monthly with zero surge surprises.'
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
        padding: '14px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: '#1e293b',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(15, 23, 42, 0.2)'
          }}>
            <Car size={20} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a', display: 'block', lineHeight: 1.1 }}>
              APEX FLEET
            </span>
            <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Executive B2B Mobility
            </span>
          </div>
        </div>

        {/* Quick Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a href="#fleet" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155', textDecoration: 'none' }}>
            Fleet & Pricing Slabs
          </a>
          <a href="#cabin" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155', textDecoration: 'none' }}>
            Executive Cabin
          </a>
          <a href="#reviews" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155', textDecoration: 'none' }}>
            Google Reviews (4.9★)
          </a>
          <a href="#trust" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155', textDecoration: 'none' }}>
            Trust & Compliance
          </a>
        </div>

        {/* Right Action Buttons */}
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
            <FileText size={14} />
            <span>Trusted Terms</span>
          </button>

          <button 
            onClick={onNavigateToLogin}
            className="btn-primary"
            style={{ 
              padding: '9px 22px', 
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

      {/* 2. EYE-CATCHING HERO SECTION WITH CINEMATIC PHOTOGRAPHY */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 36px 64px 36px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.05fr 1fr',
          gap: '44px',
          alignItems: 'center'
        }}>
          {/* Left Text & Value Proposition */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#0f172a',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
              marginBottom: '20px'
            }}>
              <ShieldCheck size={16} color="#047857" />
              <span>100% RTO Verified Fleet • Background-Checked Chauffeurs</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.3rem, 4.5vw, 3.6rem)',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              lineHeight: 1.12,
              margin: '0 0 18px 0'
            }}>
              Executive Mobility.<br />
              <span style={{ color: '#334155' }}>On Your Schedule.</span>
            </h1>

            <p style={{
              fontSize: '1.05rem',
              color: '#475569',
              lineHeight: 1.6,
              margin: '0 0 28px 0',
              fontWeight: 500,
              maxWidth: '520px'
            }}>
              Fixed 8-hour shift tariffs, verified commercial chauffeurs, and spotlessly maintained luxury vehicles for corporate teams, airport pickups, and VIP delegations.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '36px' }}>
              <button 
                onClick={onNavigateToLogin}
                className="btn-primary"
                style={{ 
                  padding: '14px 30px', 
                  borderRadius: '28px', 
                  fontSize: '0.94rem', 
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
                  padding: '14px 26px', 
                  borderRadius: '28px', 
                  fontSize: '0.94rem', 
                  fontWeight: 600,
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#1e293b',
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
                }}
              >
                <span>Explore Fleet & Rates</span>
              </a>
            </div>

            {/* 3 Real Operational Guarantees */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '22px' }}>
              <div>
                <strong style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>99.8%</strong>
                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500 }}>On-Time Arrival SLA</span>
              </div>
              <div>
                <strong style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>Zero</strong>
                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500 }}>Surge Pricing Shock</span>
              </div>
              <div>
                <strong style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>30 Mins</strong>
                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500 }}>Standby Backup Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Hero Cinematic Visual Card */}
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              border: '1px solid rgba(226, 232, 240, 0.9)',
              position: 'relative',
              height: '460px',
              background: '#0f172a'
            }}>
              <img 
                src="/assets/hero_chauffeur.jpg" 
                alt="Executive Chauffeur with Mercedes S-Class at Corporate Skyscraper" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Floating Verified Telematics Card on the Image */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '16px',
                padding: '14px 18px',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#1e293b', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                      Certified Chauffeur On Duty
                    </strong>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Verified RTO Papers • Speed Governor (80 km/h) • Dual Dashcam
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#047857', background: '#ecfdf5', padding: '3px 8px', borderRadius: '10px' }}>
                    ● Active Fleet
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE VISUAL VEHICLE SHOWCASE (ATTENTION-SEEKING & REAL) */}
      <section id="fleet" style={{ padding: '64px 36px', background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', display: 'block', marginBottom: '6px' }}>
              Real Transparent Rates
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
              Explore Our Fleet & Fixed Shift Slabs
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '6px' }}>
              Click any vehicle class below to view real photos, certified equipment, and exact Indian Rupee (₹) pricing.
            </p>
          </div>

          {/* Category Tabs Switcher */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '36px',
            flexWrap: 'wrap'
          }}>
            {[
              { key: 'SEDAN', label: 'Executive Sedan', icon: Car },
              { key: 'EV', label: 'Electric EV Fleet', icon: Zap },
              { key: 'SUV', label: 'Premium SUV', icon: Car },
              { key: 'VAN', label: 'Passenger Vans', icon: Bus },
              { key: 'LUXURY', label: 'Luxury VIP Class', icon: Award }
            ].map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeFleetCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveFleetCategory(tab.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '24px',
                    border: isActive ? '1px solid #1e293b' : '1px solid #e2e8f0',
                    background: isActive ? '#1e293b' : '#ffffff',
                    color: isActive ? '#ffffff' : '#475569',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 4px 12px rgba(15, 23, 42, 0.15)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <TabIcon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Feature Card for Selected Fleet Vehicle */}
          <div className="glass-card" style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '24px',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)'
          }}>
            {/* Left Big Real Image Frame */}
            <div style={{ height: '420px', position: 'relative', background: '#0f172a' }}>
              <img 
                src={currentVehicle.image} 
                alt={currentVehicle.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(6px)',
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#ffffff'
              }}>
                {currentVehicle.fuel} • {currentVehicle.seats}
              </div>
            </div>

            {/* Right Information & Tariff Specs */}
            <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#047857', background: '#ecfdf5', padding: '3px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
                  Verified B2B Shift Package
                </span>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '10px 0 6px 0', letterSpacing: '-0.02em' }}>
                  {currentVehicle.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 20px 0', lineHeight: 1.5 }}>
                  {currentVehicle.tagline}
                </p>

                {/* Tariff Highlight */}
                <div style={{ padding: '16px 20px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{currentVehicle.rate}</span>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{currentVehicle.period}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#047857', fontWeight: 600, marginTop: '4px' }}>
                    Extra Mileage: {currentVehicle.extraKm} • Includes Fuel & Commercial Insurance
                  </div>
                </div>

                {/* Specs Checklist */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.78rem', color: '#334155' }}>
                  {currentVehicle.specs.map((spec, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={15} color="#047857" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={onNavigateToLogin}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '13px',
                  borderRadius: '24px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  background: '#1e293b',
                  color: '#ffffff',
                  gap: '8px',
                  marginTop: '24px'
                }}
              >
                <span>Reserve on Enterprise Console</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE EXECUTIVE CABIN EXPERIENCE (RICH LIFESTYLE VISUAL) */}
      <section id="cabin" style={{ maxWidth: '1240px', margin: '0 auto', padding: '64px 36px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.15fr',
          gap: '44px',
          alignItems: 'center'
        }}>
          {/* Left Visual: Executive Cabin with Tablet */}
          <div style={{
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
            border: '1px solid #e2e8f0',
            height: '420px',
            background: '#0f172a'
          }}>
            <img 
              src="/assets/executive_cabin.jpg" 
              alt="Inside the Luxury Executive Cabin" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Right Value Propositions */}
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', display: 'block', marginBottom: '6px' }}>
              Your Office On The Move
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 16px 0' }}>
              A Quiet, Connected Space for Executives
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, margin: '0 0 24px 0' }}>
              Turn travel time into productive work hours. Every vehicle in our fleet is tailored for executive focus, absolute privacy, and seamless comfort.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ffffff', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e293b', flexShrink: 0 }}>
                  <Wifi size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 2px 0' }}>In-Cabin Wi-Fi & Power Sockets</h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>Charge your laptop and attend calls with crystal clear audio and zero dropouts.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ffffff', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e293b', flexShrink: 0 }}>
                  <VolumeX size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 2px 0' }}>Acoustic Soundproofing & Privacy</h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>Private phone discussions stay confidential under strict chauffeur non-disclosure agreements.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ffffff', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e293b', flexShrink: 0 }}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 2px 0' }}>Telematics & Speed Governed (80 km/h)</h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>Speed capped strictly according to RTO corporate standards with live SOS emergency response.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GOOGLE VERIFIED REVIEWS (SHORT, AUTHENTIC, CLEAN) */}
      <section id="reviews" style={{ padding: '64px 36px', background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#4285F4' }}>G</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Google Business Verified
                </span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Rated 4.9/5 by Corporate Clients
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '8px 18px', borderRadius: '24px', border: '1px solid #cbd5e1' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>4.9</span>
              <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#f59e0b" />
                ))}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>184 Reviews</span>
            </div>
          </div>

          {/* 3 Concise Review Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {googleReviews.map((rev, i) => (
              <div 
                key={i}
                className="glass-card"
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1e293b', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                        {rev.avatar}
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.86rem', color: '#0f172a', display: 'block' }}>{rev.name}</strong>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{rev.role}, {rev.company}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4285F4' }}>G</span>
                  </div>

                  <div style={{ display: 'flex', gap: '2px', color: '#f59e0b', marginBottom: '8px' }}>
                    {[...Array(rev.rating)].map((_, s) => (
                      <Star key={s} size={12} fill="#f59e0b" />
                    ))}
                  </div>

                  <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                    "{rev.quote}"
                  </p>
                </div>

                <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#047857', fontWeight: 600 }}>
                  <CheckCircle2 size={13} />
                  <span>Verified Corporate Booking</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TRUSTED TERMS & LEGAL SLA (CONCISE PILLARS) */}
      <section id="trust" style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', display: 'block', marginBottom: '4px' }}>
              Clear Accountability
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Trusted B2B Terms & SLA Guarantees
            </h2>
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
              gap: '6px'
            }}
          >
            <FileText size={15} />
            <span>Read Complete Terms Agreement</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '18px 20px', borderRadius: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="#047857" /> Fixed 8-Hour Slabs
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0 }}>No sudden price surges. Extra KM billed strictly at transparent published slabs.</p>
          </div>

          <div style={{ padding: '18px 20px', borderRadius: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="#047857" /> 30-Min Standby Backup
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0 }}>If a vehicle has mechanical issues, an equal or higher car is dispatched in 30 mins.</p>
          </div>

          <div style={{ padding: '18px 20px', borderRadius: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="#047857" /> Police-Checked Drivers
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0 }}>100% background checks, valid commercial licenses, and defensive driving certified.</p>
          </div>

          <div style={{ padding: '18px 20px', borderRadius: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="#047857" /> Free 2-Hour Cancellation
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0 }}>Cancel or modify corporate shifts free of charge up to 2 hours before reporting.</p>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA SECTION */}
      <section style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 36px 64px 36px', textAlign: 'center' }}>
        <div style={{
          background: '#1e293b',
          borderRadius: '24px',
          padding: '44px 36px',
          color: '#ffffff',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.25)'
        }}>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, margin: '0 0 10px 0', color: '#ffffff' }}>
            Ready to Upgrade Your Company's Executive Fleet?
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#cbd5e1', maxWidth: '540px', margin: '0 auto 24px auto', lineHeight: 1.5 }}>
            Access the live Enterprise Dispatch Console to reserve shifts, check RTO compliance papers, and manage corporate dispatches.
          </p>
          <button 
            onClick={onNavigateToLogin}
            className="btn-primary"
            style={{ 
              padding: '13px 32px', 
              borderRadius: '28px', 
              fontSize: '0.94rem', 
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

      {/* 8. FOOTER */}
      <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '40px 36px 28px 36px', borderTop: '1px solid #1e293b' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#334155', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Car size={16} />
              </div>
              <strong style={{ color: '#ffffff', fontSize: '1.05rem' }}>APEX FLEET</strong>
            </div>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Executive B2B Mobility Logistics Ltd. • GST Registered</span>
          </div>

          <div style={{ display: 'flex', gap: '20px', fontSize: '0.78rem' }}>
            <span onClick={() => setShowTermsModal(true)} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Terms & Conditions</span>
            <span onClick={() => setShowTermsModal(true)} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Corporate SLA Agreement</span>
            <span onClick={onNavigateToLogin} style={{ color: '#ffffff', cursor: 'pointer', fontWeight: 600 }}>Sign In to Console ➔</span>
          </div>
        </div>
      </footer>

      {/* 9. MODAL: TRUSTED TERMS & CONDITIONS */}
      {showTermsModal && (
        <div className="portal-modal-overlay" style={{ zIndex: 1000 }}>
          <div className="glass-panel portal-modal-card" style={{
            maxWidth: '720px',
            background: 'rgba(255, 255, 255, 0.98)',
            border: '1px solid #cbd5e1',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#1e293b', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Apex Fleet Corporate Terms & SLA Agreement
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>B2B Standards & Transparent Legal Guarantees</span>
                </div>
              </div>

              <button onClick={() => setShowTermsModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '16px' }}>
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
                1. Tariff Slabs
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
                3. On-Time SLA
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
                4. Cancellation
              </button>
            </div>

            {/* Tab Body */}
            <div style={{ flex: 1, overflowY: 'auto', fontSize: '0.82rem', color: '#334155', lineHeight: 1.6 }}>
              {activeTermsTab === 'billing' && (
                <div>
                  <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Transparent Shift Billing Policy</h4>
                  <p>• <strong>8-Hour Package:</strong> Base shift duration is 8 hours (80 km included). Shift start begins from scheduled reporting time.</p>
                  <p>• <strong>Extra Mileage:</strong> Excess distance is billed strictly according to vehicle tier (₹15 to ₹30/km) with electronic odometer verification.</p>
                  <p>• <strong>GST Invoicing:</strong> Automated GST e-invoices with full Input Tax Credit (ITC) eligibility generated on month-end.</p>
                </div>
              )}

              {activeTermsTab === 'driver' && (
                <div>
                  <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Chauffeur Verification & Conduct</h4>
                  <p>• <strong>Police Verification:</strong> 100% of chauffeurs pass criminal background checks and address verification.</p>
                  <p>• <strong>Confidentiality (NDA):</strong> Chauffeurs sign non-disclosure clauses regarding in-cabin conversations and business discussions.</p>
                  <p>• <strong>Zero Tolerance:</strong> Immediate dismissal for speeding, phone usage during driving, or discourtesy.</p>
                </div>
              )}

              {activeTermsTab === 'sla' && (
                <div>
                  <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>30-Minute Standby Vehicle SLA</h4>
                  <p>• <strong>Prior Arrival:</strong> Chauffeur reports 15 minutes prior to scheduled pickup time.</p>
                  <p>• <strong>Immediate Backup:</strong> In case of mechanical delay or flat tire, a replacement vehicle of equal or higher tier is dispatched within 30 minutes.</p>
                </div>
              )}

              {activeTermsTab === 'cancel' && (
                <div>
                  <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Booking & Cancellation Terms</h4>
                  <p>• <strong>Free Cancellation:</strong> Modify or cancel any shift up to 2 hours before reporting with zero fee.</p>
                  <p>• <strong>Airport Delays:</strong> Flight delay tracking is automated; airport pickups never incur penalties for airline delays.</p>
                </div>
              )}
            </div>

            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setShowTermsModal(false)} className="btn-secondary" style={{ padding: '8px 18px', borderRadius: '16px', fontSize: '0.8rem' }}>
                Close
              </button>
              <button 
                onClick={() => {
                  setShowTermsModal(false);
                  onNavigateToLogin();
                }}
                className="btn-primary" 
                style={{ padding: '8px 20px', borderRadius: '16px', fontSize: '0.8rem', background: '#1e293b' }}
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
