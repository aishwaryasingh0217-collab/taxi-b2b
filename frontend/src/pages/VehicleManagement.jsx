import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { 
  Car, Plus, Search, Filter, Fuel, Gauge, AlertCircle, CheckCircle2, 
  ShieldAlert, X, Eye, Calendar, FileText, Wrench, ShieldCheck, UserCheck, 
  LayoutGrid, Table, Zap, Crown, Bus, ChevronLeft, ChevronRight, Star, User,
  ArrowLeft, Check, Radio, Navigation, Camera, Layers
} from 'lucide-react';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (Showcase Slider) or 'table'
  
  // Selected vehicle for Full Screen Detail View
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  // Multi-angle photo gallery index (. . . pagination)
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Form State for Add Vehicle
  const [formData, setFormData] = useState({
    registration_number: '',
    vin: '',
    make: '',
    model: '',
    year: 2025,
    vehicle_class: 'SEDAN',
    fuel_type: 'DIESEL',
    status: 'AVAILABLE',
    current_odometer: 0,
    seating_capacity: 4,
    image_url: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);

  // Category horizontal scroll refs
  const scrollRefs = useRef({});

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await api.get('fleet/vehicles/');
      const data = res.data.results || res.data;
      setVehicles(data);
      if (selectedVehicle) {
        const updated = data.find(v => v.id === selectedVehicle.id);
        if (updated) setSelectedVehicle(updated);
      }
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleOpenVehicle = (v) => {
    setSelectedVehicle(v);
    setActivePhotoIndex(0);
  };

  const handleScroll = (catKey, direction) => {
    const container = scrollRefs.current[catKey];
    if (container) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('fleet/vehicles/', formData);
      setShowAddModal(false);
      fetchVehicles();
      setFormData({
        registration_number: '',
        vin: '',
        make: '',
        model: '',
        year: 2025,
        vehicle_class: 'SEDAN',
        fuel_type: 'DIESEL',
        status: 'AVAILABLE',
        current_odometer: 0,
        seating_capacity: 4,
        image_url: ''
      });
    } catch (err) {
      alert('Error saving vehicle: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  const handleStatusChange = async (vehicleId, newStatus) => {
    try {
      await api.patch(`fleet/vehicles/${vehicleId}/`, { status: newStatus });
      fetchVehicles();
    } catch (err) {
      alert('Error updating status: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.registration_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vin.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? v.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="badge badge-success">Available</span>;
      case 'ON_DUTY':
        return <span className="badge badge-info">On Duty</span>;
      case 'IN_MAINTENANCE':
        return <span className="badge badge-warning">In Maintenance</span>;
      case 'DECOMMISSIONED':
        return <span className="badge badge-danger">Decommissioned</span>;
      default:
        return <span className="badge badge-info">{status}</span>;
    }
  };

  // Category Configurations with Indian Rupee (₹ INR) Pricing Slabs
  const categoryConfigs = {
    SEDAN: {
      title: 'Executive Sedans',
      subtitle: 'Premium corporate comfort & airport transfers',
      bgGradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
      icon: Car,
      rate: '₹2,500 / shift'
    },
    EV: {
      title: 'Electric Fleet',
      subtitle: 'Zero emissions & eco executive dispatches',
      bgGradient: 'linear-gradient(135deg, #059669, #047857)',
      icon: Zap,
      rate: '₹3,200 / shift'
    },
    SUV: {
      title: 'Premium SUVs',
      subtitle: 'Spacious 6-7 seater luxury & long distance',
      bgGradient: 'linear-gradient(135deg, #d97706, #b45309)',
      icon: Car,
      rate: '₹4,500 / shift'
    },
    VAN: {
      title: 'Passenger Vans',
      subtitle: 'Corporate shuttles & multi-group transfers',
      bgGradient: 'linear-gradient(135deg, #0284c7, #0369a1)',
      icon: Bus,
      rate: '₹5,500 / shift'
    },
    LUXURY: {
      title: 'Luxury Fleet',
      subtitle: 'VIP & Executive Class dispatches',
      bgGradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
      icon: Crown,
      rate: '₹8,500 / shift'
    }
  };

  // Group vehicles by category
  const groupedVehicles = Object.keys(categoryConfigs).reduce((acc, catKey) => {
    const items = filteredVehicles.filter(v => (v.vehicle_class || 'SEDAN') === catKey);
    if (items.length > 0) acc[catKey] = items;
    return acc;
  }, {});

  // FULL SCREEN DETAIL VIEW WITH MULTI-ANGLE GALLERY & DOTS (. . .)
  if (selectedVehicle) {
    const cat = categoryConfigs[selectedVehicle.vehicle_class] || categoryConfigs.SEDAN;
    const CatIcon = cat.icon;

    const galleryList = (selectedVehicle.gallery_images && selectedVehicle.gallery_images.length > 0)
      ? selectedVehicle.gallery_images
      : [selectedVehicle.image_url].filter(Boolean);

    const activePhotoUrl = galleryList[activePhotoIndex] || selectedVehicle.image_url;
    const angleLabels = ['Front View', 'Side Profile', 'Rear View', 'Interior Cabin'];

    return (
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--bg-primary)', minHeight: '100vh' }}>
        
        {/* Full Screen Top Navigation Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <button 
            onClick={() => setSelectedVehicle(null)} 
            className="btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <ArrowLeft size={18} />
            <span>Back to Fleet Showcase</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="badge badge-info">{selectedVehicle.vehicle_class_display || selectedVehicle.vehicle_class}</span>
            <span className="badge badge-warning">{selectedVehicle.fuel_type_display || selectedVehicle.fuel_type}</span>
            {getStatusBadge(selectedVehicle.status)}
          </div>
        </div>

        {/* Hero Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})
            </h1>
            <p className="font-mono" style={{ color: '#60a5fa', fontSize: '1rem', fontWeight: 600, marginTop: '4px' }}>
              Registration Plate: {selectedVehicle.registration_number} &nbsp;|&nbsp; VIN: {selectedVehicle.vin}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>B2B CONTRACT RATE SLAB</span>
            <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>
              {cat.rate}
            </p>
          </div>
        </div>

        {/* Main 2-Column Showcase Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          
          {/* Left Column: Multi-Angle Photo Frame + Dot Pagination (. . .) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Big Vehicle Photo Frame with Active Angle Overlay */}
            <div className="glass-panel" style={{ overflow: 'hidden', height: '380px', position: 'relative', background: '#0f172a' }}>
              {activePhotoUrl ? (
                <img
                  src={activePhotoUrl}
                  alt={`${selectedVehicle.make} ${selectedVehicle.model} - ${angleLabels[activePhotoIndex] || 'Photo'}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s ease' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Car size={80} color="var(--text-dim)" />
                </div>
              )}

              {/* Photo Angle Label Overlay */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '6px 12px',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Camera size={14} color="#60a5fa" />
                <span>Angle: {angleLabels[activePhotoIndex] || `Photo ${activePhotoIndex + 1}`}</span>
              </div>

              {/* Verified Fleet Badge */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(16, 185, 129, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '6px 12px',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                ⭐ 4.9 Verified Commercial Unit
              </div>

              {/* MULTI-ANGLE CAROUSEL DOTS PAGINATION (. . . . ) */}
              {galleryList.length > 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(255,255,255,0.15)'
                }}>
                  {galleryList.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      title={`View ${angleLabels[idx] || `Angle ${idx + 1}`}`}
                      style={{
                        width: activePhotoIndex === idx ? '24px' : '10px',
                        height: '10px',
                        borderRadius: '5px',
                        background: activePhotoIndex === idx ? 'var(--accent-primary)' : 'rgba(255,255,255,0.3)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Strip Selector */}
            {galleryList.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${galleryList.length}, 1fr)`, gap: '10px' }}>
                {galleryList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIndex(idx)}
                    style={{
                      padding: 0,
                      background: 'none',
                      border: activePhotoIndex === idx ? '2px solid var(--accent-primary)' : '2px solid transparent',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      height: '70px',
                      cursor: 'pointer',
                      opacity: activePhotoIndex === idx ? 1 : 0.6,
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{
                      position: 'absolute',
                      bottom: 0, left: 0, right: 0,
                      background: 'rgba(0,0,0,0.7)',
                      fontSize: '0.62rem',
                      color: '#fff',
                      padding: '2px 0',
                      textAlign: 'center'
                    }}>
                      {angleLabels[idx] || `Angle ${idx + 1}`}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Spec Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
                <Gauge size={20} color="#3b82f6" style={{ margin: '0 auto 6px auto' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>ODOMETER</span>
                <strong className="font-mono" style={{ color: '#fff', fontSize: '1rem' }}>{Number(selectedVehicle.current_odometer).toLocaleString()} KM</strong>
              </div>

              <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
                <User size={20} color="#06b6d4" style={{ margin: '0 auto 6px auto' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>CAPACITY</span>
                <strong style={{ color: '#fff', fontSize: '1rem' }}>{selectedVehicle.seating_capacity} Seats</strong>
              </div>

              <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
                <Fuel size={20} color="#f59e0b" style={{ margin: '0 auto 6px auto' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>FUEL TYPE</span>
                <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{selectedVehicle.fuel_type_display || selectedVehicle.fuel_type}</strong>
              </div>

              <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
                <CatIcon size={20} color="#a855f7" style={{ margin: '0 auto 6px auto' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>CLASS</span>
                <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{selectedVehicle.vehicle_class_display || selectedVehicle.vehicle_class}</strong>
              </div>
            </div>

            {/* Vehicle Telematics & Equipment Checklist */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Navigation size={18} color="#3b82f6" />
                <span>Vehicle Telematics & Equipment Features</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#0f172a', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <Check size={16} color="#34d399" />
                  <span style={{ fontSize: '0.85rem', color: '#fff' }}>GPS Telemetry & Live Tracker</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#0f172a', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <Check size={16} color="#34d399" />
                  <span style={{ fontSize: '0.85rem', color: '#fff' }}>Automated FASTag Toll Pass</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#0f172a', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <Check size={16} color="#34d399" />
                  <span style={{ fontSize: '0.85rem', color: '#fff' }}>Dual-Zone Climate Control</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#0f172a', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <Check size={16} color="#34d399" />
                  <span style={{ fontSize: '0.85rem', color: '#fff' }}>Commercial Fleet Insurance</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Status Control, Driver Pairing & Legal Compliance Vault */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Status Control Card */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
                Duty Status Control
              </h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select
                  className="select-field"
                  value={selectedVehicle.status}
                  onChange={(e) => handleStatusChange(selectedVehicle.id, e.target.value)}
                  style={{ flex: 1 }}
                >
                  <option value="AVAILABLE">Available for Shift Dispatch</option>
                  <option value="ON_DUTY">On Duty / Active Shift</option>
                  <option value="IN_MAINTENANCE">In Service / Maintenance</option>
                  <option value="DECOMMISSIONED">Decommissioned</option>
                </select>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                Updating status automatically notifies the dispatch board & driver shift roster.
              </p>
            </div>

            {/* Driver Assignment Card */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={18} color="#06b6d4" />
                <span>Assigned Driver</span>
              </h3>

              {selectedVehicle.current_driver && selectedVehicle.current_driver.length > 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#0f172a', borderRadius: '10px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
                    {selectedVehicle.current_driver[0].user_detail?.username?.[0]?.toUpperCase() || 'D'}
                  </div>
                  <div>
                    <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{selectedVehicle.current_driver[0].user_detail?.first_name} {selectedVehicle.current_driver[0].user_detail?.last_name}</strong>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>License: {selectedVehicle.current_driver[0].license_number}</p>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '14px', background: '#0f172a', borderRadius: '10px', border: '1px dashed var(--border-color)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No active driver currently assigned.
                </div>
              )}
            </div>

            {/* Legal Compliance Vault Card */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#3b82f6" />
                <span>Legal Compliance Vault</span>
              </h3>

              {selectedVehicle.compliance_docs && selectedVehicle.compliance_docs.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedVehicle.compliance_docs.map((doc) => (
                    <div key={doc.id} style={{
                      padding: '12px 14px',
                      background: '#0f172a',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between'
                    }}>
                      <div>
                        <strong style={{ color: '#fff', fontSize: '0.85rem' }}>{doc.document_type_display || doc.document_type}</strong>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>No: {doc.document_number}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {doc.computed_status === 'EXPIRED' ? (
                          <span className="badge badge-danger">EXPIRED ({doc.expiry_date})</span>
                        ) : doc.computed_status === 'EXPIRING_SOON' ? (
                          <span className="badge badge-warning">EXPIRING SOON ({doc.expiry_date})</span>
                        ) : (
                          <span className="badge badge-success">VALID ({doc.expiry_date})</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '16px', background: '#0f172a', borderRadius: '8px', border: '1px dashed var(--border-color)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No legal documents filed in vault yet.
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Header & View Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Vehicle Master Registry</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Category-wise horizontal vehicle sliders, Indian Rupee (₹) rate slabs, and compliance vault.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* View Switcher Toggle */}
          <div style={{ display: 'flex', background: '#0f172a', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'grid' ? 'var(--accent-primary)' : 'transparent',
                color: viewMode === 'grid' ? '#fff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <LayoutGrid size={16} />
              <span>Showcase Slider</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'table' ? 'var(--accent-primary)' : 'transparent',
                color: viewMode === 'table' ? '#fff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <Table size={16} />
              <span>Table View</span>
            </button>
          </div>

          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            <Plus size={18} />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '38px' }}
            placeholder="Search by Registration Plate, VIN, Make, Model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ width: '200px' }}>
          <select
            className="select-field"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Vehicle Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="ON_DUTY">On Duty</option>
            <option value="IN_MAINTENANCE">In Maintenance</option>
            <option value="DECOMMISSIONED">Decommissioned</option>
          </select>
        </div>
      </div>

      {/* VIEW MODE 1: SLEEK HORIZONTAL CATEGORY SLIDERS WITH < AND > ARROWS */}
      {viewMode === 'grid' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading fleet data from Django API...</div>
          ) : Object.keys(groupedVehicles).length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No vehicles found matching your search.</div>
          ) : (
            Object.entries(groupedVehicles).map(([catKey, vehicleList]) => {
              const cat = categoryConfigs[catKey] || categoryConfigs.SEDAN;
              const CatIcon = cat.icon;

              return (
                <div key={catKey} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '18px 20px' }}>
                  
                  {/* Category Header Bar with Left Title & Right < > Slide Arrows */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        background: cat.bgGradient,
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'center'
                      }}>
                        <CatIcon size={18} color="#fff" />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
                            {cat.title}
                          </h3>
                          <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{vehicleList.length} Vehicles</span>
                          <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{cat.rate}</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.subtitle}</p>
                      </div>
                    </div>

                    {/* Horizontal Slide Arrow Controls < > */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => handleScroll(catKey, 'left')}
                        title="Slide Left"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: '#0f172a',
                          border: '1px solid var(--border-color)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'center',
                          cursor: 'pointer',
                          transition: 'background 0.2s ease'
                        }}
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={() => handleScroll(catKey, 'right')}
                        title="Slide Right"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: '#0f172a',
                          border: '1px solid var(--border-color)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'center',
                          cursor: 'pointer',
                          transition: 'background 0.2s ease'
                        }}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Scrollable Cards Strip */}
                  <div
                    ref={(el) => (scrollRefs.current[catKey] = el)}
                    style={{
                      display: 'flex',
                      gap: '16px',
                      overflowX: 'auto',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      paddingBottom: '4px'
                    }}
                  >
                    {vehicleList.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        onClick={() => handleOpenVehicle(vehicle)}
                        className="glass-card"
                        style={{
                          width: '260px',
                          flexShrink: 0,
                          background: '#0f172a',
                          padding: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          justify: 'space-between',
                          cursor: 'pointer'
                        }}
                      >
                        {/* Vehicle Photo Container */}
                        <div style={{ position: 'relative', height: '135px', borderRadius: '8px', overflow: 'hidden', background: '#1e293b', marginBottom: '10px' }}>
                          {vehicle.image_url ? (
                            <img
                              src={vehicle.image_url}
                              alt={vehicle.registration_number}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Car size={36} color="var(--text-dim)" />
                            </div>
                          )}

                          <div style={{ position: 'absolute', top: '6px', right: '6px' }}>
                            {getStatusBadge(vehicle.status)}
                          </div>

                          <div style={{
                            position: 'absolute',
                            bottom: '6px',
                            left: '6px',
                            background: 'rgba(0,0,0,0.8)',
                            backdropFilter: 'blur(4px)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: '#60a5fa'
                          }} className="font-mono">
                            {vehicle.registration_number}
                          </div>
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {vehicle.make} {vehicle.model}
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#fbbf24', fontSize: '0.72rem', fontWeight: 700 }}>
                              <Star size={11} fill="#fbbf24" />
                              <span>4.9</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                            <span className="badge badge-info" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>{vehicle.fuel_type_display || vehicle.fuel_type}</span>
                            <span className="badge badge-warning" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>{vehicle.seating_capacity} Seats</span>
                          </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                          <span style={{ color: '#34d399', fontWeight: 700 }}>
                            {cat.rate}
                          </span>
                          <span style={{ color: '#38bdf8', fontWeight: 600 }}>Inspect ➔</span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              );
            })
          )}
        </div>
      ) : (
        /* VIEW MODE 2: HIGH-DENSITY OPERATIONAL TABLE VIEW */
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading fleet data from Django API...</div>
          ) : filteredVehicles.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No vehicles found matching your criteria.</div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Vehicle Photo</th>
                  <th>Registration Plate</th>
                  <th>Make & Model</th>
                  <th>Class / Fuel</th>
                  <th>Odometer</th>
                  <th>Rate Slab</th>
                  <th>Status</th>
                  <th>Compliance Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle) => {
                  const cat = categoryConfigs[vehicle.vehicle_class] || categoryConfigs.SEDAN;
                  return (
                    <tr 
                      key={vehicle.id}
                      onClick={() => handleOpenVehicle(vehicle)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ width: '90px' }}>
                        {vehicle.image_url ? (
                          <img
                            src={vehicle.image_url}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            style={{
                              width: '74px',
                              height: '48px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '74px',
                            height: '48px',
                            borderRadius: '8px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justify: 'center'
                          }}>
                            <Car size={22} color="#3b82f6" />
                          </div>
                        )}
                      </td>
                      <td>
                        <div>
                          <strong className="font-mono" style={{ color: '#fff', fontSize: '0.9rem' }}>{vehicle.registration_number}</strong>
                          <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>VIN: {vehicle.vin}</p>
                        </div>
                      </td>
                      <td>
                        <span style={{ color: '#fff', fontWeight: 600 }}>{vehicle.make} {vehicle.model}</span>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Year: {vehicle.year} ({vehicle.seating_capacity} Seats)</p>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{vehicle.vehicle_class_display || vehicle.vehicle_class}</span>
                          <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>{vehicle.fuel_type_display || vehicle.fuel_type}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f8fafc' }}>
                          <Gauge size={14} color="var(--text-muted)" />
                          <span className="font-mono" style={{ fontWeight: 600 }}>{Number(vehicle.current_odometer).toLocaleString()} KM</span>
                        </div>
                      </td>
                      <td>
                        <strong style={{ color: '#34d399', fontSize: '0.85rem' }}>{cat.rate}</strong>
                      </td>
                      <td>{getStatusBadge(vehicle.status)}</td>
                      <td>
                        {vehicle.compliance_docs && vehicle.compliance_docs.length > 0 ? (
                          vehicle.compliance_docs.some(d => d.computed_status === 'EXPIRED') ? (
                            <span className="badge badge-danger"><ShieldAlert size={12} /> Expired Doc</span>
                          ) : vehicle.compliance_docs.some(d => d.computed_status === 'EXPIRING_SOON') ? (
                            <span className="badge badge-warning"><AlertCircle size={12} /> Expiry Soon</span>
                          ) : (
                            <span className="badge badge-success"><CheckCircle2 size={12} /> Compliant</span>
                          )
                        ) : (
                          <span className="badge badge-success"><CheckCircle2 size={12} /> Valid</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenVehicle(vehicle);
                          }}
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                        >
                          <Eye size={14} />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>Add Vehicle to Fleet</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Registration Plate *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. B2B-TX-505"
                  value={formData.registration_number}
                  onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>VIN Number *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. 1HGCR2F83HA005005"
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Make *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Toyota"
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Model *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Camry Hybrid"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Year</label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Class</label>
                <select
                  className="select-field"
                  value={formData.vehicle_class}
                  onChange={(e) => setFormData({ ...formData, vehicle_class: e.target.value })}
                >
                  <option value="SEDAN">Executive Sedan</option>
                  <option value="SUV">Premium SUV</option>
                  <option value="EV">Electric Vehicle</option>
                  <option value="VAN">Multi-Passenger Van</option>
                  <option value="LUXURY">Luxury Class</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Fuel Type</label>
                <select
                  className="select-field"
                  value={formData.fuel_type}
                  onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
                >
                  <option value="PETROL">Petrol</option>
                  <option value="DIESEL">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="ELECTRIC">Electric (EV)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Initial Odometer (KM)</label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.current_odometer}
                  onChange={(e) => setFormData({ ...formData, current_odometer: parseFloat(e.target.value) })}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Vehicle Image URL</label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default VehicleManagement;
