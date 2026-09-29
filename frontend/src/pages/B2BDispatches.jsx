import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import api from '../services/api';
import { 
  Briefcase, Navigation, MapPin, Clock, Calendar, Car, User, 
  CheckCircle2, AlertCircle, Plus, Search, Filter, Phone, 
  ArrowRight, DollarSign, Shield, Zap, ChevronRight, X, Play, 
  Check, RefreshCw, Plane, UserCheck, Receipt, Building2, 
  Printer, AlertTriangle, FileText, CheckCircle
} from 'lucide-react';

const B2BDispatches = () => {
  const [bookings, setBookings] = useState([]);
  const [clients, setClients] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [summary, setSummary] = useState({
    total_bookings: 0,
    pending_allocation: 0,
    active_live: 0,
    completed: 0,
    total_revenue_inr: 0
  });
  const [loading, setLoading] = useState(true);

  // Active Tab: 'needs_driver' | 'active' | 'completed' | 'all'
  const [activeTab, setActiveTab] = useState('needs_driver');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [clientFilter, setClientFilter] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showTripControlModal, setShowTripControlModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  
  // Selected booking for allocation, trip control, or invoice preview
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Allocation form state
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [allocationSubmitting, setAllocationSubmitting] = useState(false);

  // Trip completion form state
  const [startOdo, setStartOdo] = useState(0);
  const [endOdo, setEndOdo] = useState('');
  const [tollParking, setTollParking] = useState(0);
  const [tripSubmitting, setTripSubmitting] = useState(false);

  // Create Booking form state
  const initialBookingForm = {
    client: '',
    booking_type: 'AIRPORT_TRANSFER',
    vehicle_class_requested: 'SEDAN',
    pickup_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16),
    pickup_location: '',
    dropoff_location: '',
    flight_number: '',
    passenger_name: '',
    passenger_phone: '',
    passenger_count: 1,
    base_rate_inr: 2500,
    extra_km_rate_inr: 15,
    special_instructions: ''
  };
  const [bookingFormData, setBookingFormData] = useState(initialBookingForm);
  const [createSubmitting, setCreateSubmitting] = useState(false);

  const fetchDispatchesData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, summaryRes, clientsRes, vehiclesRes, driversRes] = await Promise.all([
        api.get('dispatches/bookings/'),
        api.get('dispatches/bookings/summary/'),
        api.get('dispatches/clients/'),
        api.get('fleet/vehicles/'),
        api.get('drivers/drivers/')
      ]);

      setBookings(bookingsRes.data.results || bookingsRes.data || []);
      setSummary(summaryRes.data || {});
      setClients(clientsRes.data.results || clientsRes.data || []);
      setVehicles(vehiclesRes.data.results || vehiclesRes.data || []);
      setDrivers(driversRes.data.results || driversRes.data || []);
    } catch (err) {
      console.error('Failed to load dispatches data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDispatchesData();
  }, []);

  // Open Allocation Modal
  const handleOpenAllocateModal = (booking) => {
    setSelectedBooking(booking);
    // Pre-select matching vehicle if any
    const matchingVehicles = vehicles.filter(v => v.vehicle_class === booking.vehicle_class_requested && v.status === 'AVAILABLE');
    setSelectedVehicleId(matchingVehicles[0]?.id || vehicles.find(v => v.status === 'AVAILABLE')?.id || vehicles[0]?.id || '');
    
    // Pre-select on-duty driver
    const onDutyDrivers = drivers.filter(d => d.duty_status === 'ON_DUTY_AVAILABLE');
    setSelectedDriverId(onDutyDrivers[0]?.id || drivers[0]?.id || '');
    
    setShowAllocateModal(true);
  };

  // Submit Driver + Vehicle Allocation
  const handleConfirmAllocation = async () => {
    if (!selectedVehicleId || !selectedDriverId || !selectedBooking) {
      alert('Please select both a car and a driver.');
      return;
    }

    setAllocationSubmitting(true);
    try {
      await api.post(`dispatches/bookings/${selectedBooking.id}/dispatch/`, {
        vehicle_id: selectedVehicleId,
        driver_id: selectedDriverId
      });
      setShowAllocateModal(false);
      fetchDispatchesData();
    } catch (err) {
      alert('Error assigning trip: ' + JSON.stringify(err.response?.data || err.message));
    } finally {
      setAllocationSubmitting(false);
    }
  };

  // Open Trip Control Modal (End Trip / Meter)
  const handleOpenTripControl = (booking) => {
    setSelectedBooking(booking);
    const currOdo = booking.assigned_vehicle_detail?.current_odometer || 12000;
    setStartOdo(currOdo);
    setEndOdo(currOdo + 35);
    setTollParking(0);
    setShowTripControlModal(true);
  };

  // Start Trip
  const handleStartTrip = async (bookingId) => {
    try {
      await api.post(`dispatches/bookings/${bookingId}/start_trip/`);
      fetchDispatchesData();
    } catch (err) {
      alert('Error starting trip: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  // Complete Trip
  const handleCompleteTrip = async () => {
    if (!selectedBooking) return;
    setTripSubmitting(true);
    try {
      await api.post(`dispatches/bookings/${selectedBooking.id}/complete_trip/`, {
        end_odometer: Number(endOdo),
        toll_parking_inr: Number(tollParking)
      });
      setShowTripControlModal(false);
      fetchDispatchesData();
    } catch (err) {
      alert('Error completing trip: ' + JSON.stringify(err.response?.data || err.message));
    } finally {
      setTripSubmitting(false);
    }
  };

  // Cancel Booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this trip? The assigned car and driver will be made available again.')) {
      return;
    }
    try {
      await api.post(`dispatches/bookings/${bookingId}/cancel/`);
      fetchDispatchesData();
    } catch (err) {
      alert('Error cancelling trip: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  // Open Invoice Preview Modal
  const handleOpenInvoiceModal = (booking) => {
    setSelectedBooking(booking);
    setShowInvoiceModal(true);
  };

  // Create Booking Submit
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!bookingFormData.client || !bookingFormData.pickup_location || !bookingFormData.dropoff_location) {
      alert('Please fill out client and route fields.');
      return;
    }

    setCreateSubmitting(true);
    try {
      await api.post('dispatches/bookings/', bookingFormData);
      setShowCreateModal(false);
      setBookingFormData(initialBookingForm);
      fetchDispatchesData();
    } catch (err) {
      alert('Error booking trip: ' + JSON.stringify(err.response?.data || err.message));
    } finally {
      setCreateSubmitting(false);
    }
  };

  // Filtering by active tab and search/client
  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      b.booking_reference?.toLowerCase().includes(q) ||
      b.passenger_name?.toLowerCase().includes(q) ||
      b.passenger_phone?.toLowerCase().includes(q) ||
      b.client_name?.toLowerCase().includes(q) ||
      b.pickup_location?.toLowerCase().includes(q) ||
      b.dropoff_location?.toLowerCase().includes(q) ||
      b.flight_number?.toLowerCase().includes(q);

    const matchesClient = clientFilter ? String(b.client) === String(clientFilter) : true;

    let matchesTab = true;
    if (activeTab === 'needs_driver') {
      matchesTab = b.status === 'PENDING';
    } else if (activeTab === 'active') {
      matchesTab = b.status === 'DISPATCHED' || b.status === 'ON_TRIP';
    } else if (activeTab === 'completed') {
      matchesTab = b.status === 'COMPLETED';
    }

    return matchesSearch && matchesClient && matchesTab;
  });

  // Tab counts
  const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
  const activeCount = bookings.filter(b => b.status === 'DISPATCHED' || b.status === 'ON_TRIP').length;
  const completedCount = bookings.filter(b => b.status === 'COMPLETED').length;
  const allCount = bookings.length;

  // Live bill calculation for End Trip modal
  const calcDist = Math.max(0, Number(endOdo) - Number(startOdo));
  const calcExtraKm = Math.max(0, calcDist - 40); // 40km allowance
  const calcExtraCharge = calcExtraKm * (selectedBooking?.extra_km_rate_inr || 15);
  const calcSubtotal = (selectedBooking?.base_rate_inr || 2500) + calcExtraCharge + Number(tollParking || 0);
  const calcGst = calcSubtotal * 0.05;
  const calcTotal = calcSubtotal + calcGst;

  return (
    <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Friendly Header Banner */}
      <div style={{
        padding: '24px 30px',
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: 'var(--elevation-1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '18px',
            background: 'var(--accent-primary-container)',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Briefcase size={28} color="#0b57d0" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Trips & Daily Duty
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Assign drivers, monitor active rides, and bill corporate clients without paperwork confusion.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setBookingFormData({
              ...initialBookingForm,
              client: clients[0]?.id || ''
            });
            setShowCreateModal(true);
          }}
          className="btn-primary"
          style={{ padding: '12px 24px', borderRadius: '28px', fontSize: '0.92rem', gap: '8px' }}
        >
          <Plus size={18} />
          <span>New Trip Booking</span>
        </button>
      </div>

      {/* 4 Action Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        
        {/* 1. Needs Driver Card */}
        <div 
          onClick={() => setActiveTab('needs_driver')}
          className="md3-card" 
          style={{ 
            padding: '20px', 
            cursor: 'pointer',
            border: activeTab === 'needs_driver' ? '2px solid var(--color-warning)' : '1px solid var(--border-color)',
            background: pendingCount > 0 ? 'var(--color-warning-bg)' : '#ffffff' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-warning)', fontWeight: 700, textTransform: 'uppercase' }}>
              🟡 NEEDS CAR & DRIVER
            </span>
            <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(176, 96, 0, 0.15)', color: 'var(--color-warning)', fontWeight: 700 }}>
              Action Required
            </span>
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-warning)', marginTop: '6px' }}>
            {pendingCount}
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            {pendingCount === 0 ? 'All trips assigned' : 'Click to assign car & driver'}
          </p>
        </div>

        {/* 2. Active on Road Card */}
        <div 
          onClick={() => setActiveTab('active')}
          className="md3-card" 
          style={{ 
            padding: '20px', 
            cursor: 'pointer',
            border: activeTab === 'active' ? '2px solid var(--color-success)' : '1px solid var(--border-color)',
            background: activeCount > 0 ? 'var(--color-success-bg)' : '#ffffff' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-success)', fontWeight: 700, textTransform: 'uppercase' }}>
              🟢 ACTIVE ON ROAD
            </span>
            {activeCount > 0 && (
              <span className="animate-pulse" style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px', background: 'var(--color-success)', color: '#ffffff', fontWeight: 600 }}>
                ● Live
              </span>
            )}
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '6px' }}>
            {activeCount}
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Trips dispatched or running live
          </p>
        </div>

        {/* 3. Finished Trips Card */}
        <div 
          onClick={() => setActiveTab('completed')}
          className="md3-card" 
          style={{ 
            padding: '20px', 
            cursor: 'pointer',
            border: activeTab === 'completed' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', color: '#0b57d0', fontWeight: 700, textTransform: 'uppercase' }}>
              🏁 FINISHED & INVOICED
            </span>
            <Receipt size={16} color="#0b57d0" />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#0b57d0', marginTop: '6px' }}>
            {completedCount}
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Completed & ready for billing
          </p>
        </div>

        {/* 4. Total Billed Revenue */}
        <div className="md3-card" style={{ padding: '20px', background: 'var(--accent-primary-container)', borderColor: 'rgba(11, 87, 208, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', color: '#041e49', fontWeight: 700, textTransform: 'uppercase' }}>
              💰 TOTAL BILLED
            </span>
            <DollarSign size={16} color="#0b57d0" />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#041e49', marginTop: '6px' }}>
            ₹{Number(summary.total_revenue_inr || 0).toLocaleString()}
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#0b57d0', marginTop: '4px' }}>
            Contract rate + 5% GST included
          </p>
        </div>

      </div>

      {/* Tabs & Search Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('needs_driver')}
            style={{
              padding: '10px 20px',
              borderRadius: '24px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'needs_driver' ? 'var(--color-warning)' : 'var(--md-surface-container)',
              color: activeTab === 'needs_driver' ? '#ffffff' : 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>🟡 Needs Car & Driver</span>
            <span style={{ 
              background: activeTab === 'needs_driver' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.08)',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.76rem'
            }}>
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('active')}
            style={{
              padding: '10px 20px',
              borderRadius: '24px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'active' ? 'var(--color-success)' : 'var(--md-surface-container)',
              color: activeTab === 'active' ? '#ffffff' : 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>🟢 Active On The Road</span>
            <span style={{ 
              background: activeTab === 'active' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.08)',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.76rem'
            }}>
              {activeCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            style={{
              padding: '10px 20px',
              borderRadius: '24px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'completed' ? 'var(--accent-primary)' : 'var(--md-surface-container)',
              color: activeTab === 'completed' ? '#ffffff' : 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>🏁 Finished & Invoiced</span>
            <span style={{ 
              background: activeTab === 'completed' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.08)',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.76rem'
            }}>
              {completedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '10px 20px',
              borderRadius: '24px',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'all' ? '#1f1f1f' : 'var(--md-surface-container)',
              color: activeTab === 'all' ? '#ffffff' : 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>📋 All Bookings</span>
            <span style={{ 
              background: activeTab === 'all' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.08)',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.76rem'
            }}>
              {allCount}
            </span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '44px', borderRadius: '24px', background: '#ffffff' }}
              placeholder="Search passenger name, phone, pickup, hotel, booking #, flight..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ width: '240px' }}>
            <select
              className="select-field"
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              style={{ borderRadius: '24px', background: '#ffffff' }}
            >
              <option value="">🏢 All Corporate Accounts</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {(searchQuery || clientFilter) && (
            <button
              onClick={() => { setSearchQuery(''); setClientFilter(''); }}
              className="btn-secondary"
              style={{ borderRadius: '24px', padding: '8px 16px', fontSize: '0.82rem' }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Trip Ticket Cards */}
      {loading ? (
        <div className="md3-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw size={24} className="animate-pulse" style={{ margin: '0 auto 12px auto' }} />
          Loading trip assignments...
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="md3-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <CheckCircle size={40} color="var(--color-success)" style={{ margin: '0 auto 14px auto' }} />
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {activeTab === 'needs_driver' ? 'All Clear! No Trips Waiting for Assignment' : 'No Trips Found in this Category'}
          </h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            {activeTab === 'needs_driver' 
              ? 'Great job! Every current corporate booking has a car and driver assigned.' 
              : 'Try selecting a different tab or clearing your search filter.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {filteredBookings.map((b) => (
            <div 
              key={b.id} 
              className="md3-card"
              style={{
                padding: '24px',
                borderRadius: '20px',
                borderLeft: b.status === 'PENDING' 
                  ? '6px solid var(--color-warning)' 
                  : (b.status === 'ON_TRIP' || b.status === 'DISPATCHED') 
                    ? '6px solid var(--color-success)' 
                    : '6px solid #0b57d0',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px'
              }}
            >
              {/* Card Top Row: Booking Ref, Corporate Client, Status */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span className="font-mono" style={{ 
                    fontSize: '0.95rem', 
                    fontWeight: 800, 
                    color: 'var(--accent-primary)',
                    background: 'var(--accent-primary-container)',
                    padding: '4px 10px',
                    borderRadius: '8px'
                  }}>
                    {b.booking_reference}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building2 size={16} color="var(--text-dim)" />
                    <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {b.client_name}
                    </span>
                  </div>

                  <span style={{
                    fontSize: '0.76rem',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    background: 'var(--md-surface-container-high)',
                    color: 'var(--text-muted)',
                    fontWeight: 600
                  }}>
                    {b.booking_type_display || b.booking_type}
                  </span>

                  {b.flight_number && (
                    <span style={{
                      fontSize: '0.76rem',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      background: 'rgba(11, 87, 208, 0.1)',
                      color: '#0b57d0',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Plane size={12} /> Flight: {b.flight_number}
                    </span>
                  )}
                </div>

                {/* Status Pill */}
                <div>
                  {b.status === 'PENDING' && (
                    <span className="badge badge-warning" style={{ fontSize: '0.82rem', padding: '6px 14px', borderRadius: '16px' }}>
                      🟡 Needs Car & Driver
                    </span>
                  )}
                  {b.status === 'DISPATCHED' && (
                    <span className="badge badge-info" style={{ fontSize: '0.82rem', padding: '6px 14px', borderRadius: '16px' }}>
                      🚗 Dispatched & On the Way
                    </span>
                  )}
                  {b.status === 'ON_TRIP' && (
                    <span className="badge badge-success" style={{ fontSize: '0.82rem', padding: '6px 14px', borderRadius: '16px' }}>
                      🟢 Live: Passenger in Car
                    </span>
                  )}
                  {b.status === 'COMPLETED' && (
                    <span style={{ 
                      fontSize: '0.82rem', 
                      padding: '6px 14px', 
                      borderRadius: '16px',
                      background: 'rgba(11, 87, 208, 0.12)',
                      color: '#0b57d0',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Receipt size={14} /> Completed & Invoiced
                    </span>
                  )}
                  {b.status === 'CANCELLED' && (
                    <span className="badge badge-danger" style={{ fontSize: '0.82rem', padding: '6px 14px', borderRadius: '16px' }}>
                      Cancelled
                    </span>
                  )}
                </div>
              </div>

              {/* Card Middle Row: Passenger & Route Banner */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1fr', gap: '20px', alignItems: 'stretch' }}>
                
                {/* Passenger Info */}
                <div style={{ 
                  background: 'var(--md-surface-container-low)', 
                  padding: '16px', 
                  borderRadius: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '6px'
                }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                    PASSENGER DETAILS
                  </span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>
                    {b.passenger_name}
                  </strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <a 
                      href={`tel:${b.passenger_phone}`}
                      style={{ 
                        fontSize: '0.85rem', 
                        color: 'var(--accent-primary)', 
                        textDecoration: 'none', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        fontWeight: 600,
                        background: '#ffffff',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <Phone size={13} /> {b.passenger_phone}
                    </a>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={13} />
                    <span>Pickup Time: <strong>{new Date(b.pickup_time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</strong></span>
                  </div>
                </div>

                {/* Visual Route */}
                <div style={{ 
                  background: 'var(--md-surface-container-low)', 
                  padding: '16px', 
                  borderRadius: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-success)', marginTop: '4px', flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-success)', fontWeight: 700, textTransform: 'uppercase' }}>PICKUP POINT</span>
                      <p style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '1px' }}>
                        {b.pickup_location}
                      </p>
                    </div>
                  </div>

                  <div style={{ borderLeft: '2px dashed var(--border-color)', height: '14px', marginLeft: '5px' }} />

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-primary)', marginTop: '4px', flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>DROP-OFF DESTINATION</span>
                      <p style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '1px' }}>
                        {b.dropoff_location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fare & Billing Summary */}
                <div style={{ 
                  background: 'var(--md-surface-container-low)', 
                  padding: '16px', 
                  borderRadius: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  textAlign: 'right'
                }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                    TOTAL BILL (INCL. GST)
                  </span>
                  <strong style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                    ₹{Number(b.total_fare_inr).toLocaleString()}
                  </strong>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    Base: ₹{b.base_rate_inr} + 5% GST
                  </span>
                  {b.distance_km > 0 && (
                    <span style={{ fontSize: '0.76rem', color: 'var(--color-success)', fontWeight: 700, marginTop: '4px' }}>
                      🚗 {b.distance_km} KM Traveled
                    </span>
                  )}
                  {b.toll_parking_inr > 0 && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      + ₹{b.toll_parking_inr} Toll/Parking
                    </span>
                  )}
                </div>

              </div>

              {/* Card Bottom Row: Assigned Car/Driver & Action Buttons */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                paddingTop: '14px', 
                borderTop: '1px solid var(--border-color)',
                flexWrap: 'wrap',
                gap: '14px'
              }}>
                {/* Driver & Car Info */}
                <div>
                  {b.assigned_vehicle_detail && b.assigned_driver_detail ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Car size={18} color="var(--accent-primary)" />
                        <div>
                          <strong className="font-mono" style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>
                            {b.assigned_vehicle_detail.registration_number}
                          </strong>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginLeft: '6px' }}>
                            ({b.assigned_vehicle_detail.make} {b.assigned_vehicle_detail.model})
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={18} color="var(--color-success)" />
                        <div>
                          <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>
                            {b.assigned_driver_detail.full_name}
                          </strong>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-warning)', marginLeft: '6px' }}>
                            ★ {b.assigned_driver_detail.rating}
                          </span>
                          <a 
                            href={`tel:${b.assigned_driver_detail.phone_number}`}
                            style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', textDecoration: 'none', marginLeft: '8px' }}
                          >
                            📞 {b.assigned_driver_detail.phone_number}
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-warning)' }}>
                      <AlertTriangle size={18} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                        No car or driver allocated yet. (Requested: <strong>{b.vehicle_class_requested}</strong>)
                      </span>
                    </div>
                  )}
                </div>

                {/* 1-Click Operations */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  
                  {/* PENDING ACTIONS */}
                  {b.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleOpenAllocateModal(b)}
                        className="btn-primary"
                        style={{ padding: '9px 18px', fontSize: '0.88rem', borderRadius: '20px', gap: '6px' }}
                      >
                        <UserCheck size={16} />
                        <span>Assign Car & Driver</span>
                      </button>

                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="btn-secondary"
                        style={{ padding: '9px 14px', fontSize: '0.82rem', borderRadius: '20px', color: 'var(--color-danger)' }}
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {/* DISPATCHED ACTIONS */}
                  {b.status === 'DISPATCHED' && (
                    <>
                      <button
                        onClick={() => handleStartTrip(b.id)}
                        className="btn-primary"
                        style={{ 
                          padding: '9px 20px', 
                          fontSize: '0.88rem', 
                          borderRadius: '20px', 
                          background: 'var(--color-success)', 
                          borderColor: 'var(--color-success)',
                          gap: '6px'
                        }}
                      >
                        <Play size={16} />
                        <span>Passenger In Car (Start Trip)</span>
                      </button>

                      <button
                        onClick={() => handleOpenAllocateModal(b)}
                        className="btn-secondary"
                        style={{ padding: '9px 14px', fontSize: '0.82rem', borderRadius: '20px' }}
                      >
                        Change Driver
                      </button>
                    </>
                  )}

                  {/* ON_TRIP ACTIONS */}
                  {b.status === 'ON_TRIP' && (
                    <button
                      onClick={() => handleOpenTripControl(b)}
                      className="btn-primary"
                      style={{ padding: '10px 22px', fontSize: '0.88rem', borderRadius: '20px', gap: '6px' }}
                    >
                      <Receipt size={16} />
                      <span>End Trip & Enter Meter (Bill Client)</span>
                    </button>
                  )}

                  {/* COMPLETED ACTIONS */}
                  {b.status === 'COMPLETED' && (
                    <button
                      onClick={() => handleOpenInvoiceModal(b)}
                      className="btn-secondary"
                      style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '20px', gap: '6px' }}
                    >
                      <FileText size={15} color="#0b57d0" />
                      <span>View Tax Invoice</span>
                    </button>
                  )}

                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: ASSIGN CAR & DRIVER */}
      {showAllocateModal && createPortal(
        <div className="portal-modal-overlay" onClick={() => setShowAllocateModal(false)}>
          <div 
            className="md3-card portal-modal-card" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '600px', padding: '30px', borderRadius: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'var(--accent-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserCheck size={22} color="#0b57d0" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Assign Car & Driver
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    {selectedBooking?.booking_reference} • {selectedBooking?.client_name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAllocateModal(false)}
                className="btn-secondary"
                style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Trip Quick Summary */}
              <div style={{ padding: '14px 18px', background: 'var(--md-surface-container-low)', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Passenger: <strong style={{ color: 'var(--text-main)' }}>{selectedBooking?.passenger_name}</strong></span>
                  <span style={{ color: 'var(--text-dim)' }}>Requested: <strong style={{ color: '#0b57d0' }}>{selectedBooking?.vehicle_class_requested}</strong></span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '6px' }}>
                  Route: {selectedBooking?.pickup_location} ➔ {selectedBooking?.dropoff_location}
                </p>
              </div>

              {/* Step 1: Select Fleet Car */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Step 1: Choose Fleet Car *
                </label>
                <select
                  className="select-field"
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  style={{ width: '100%', borderRadius: '12px', padding: '12px' }}
                >
                  <option value="">Select available car...</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.registration_number} — {v.make} {v.model} ({v.vehicle_class}) [{v.status}]
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                  Cars in maintenance or on other trips are excluded.
                </span>
              </div>

              {/* Step 2: Select Driver */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Step 2: Choose Driver / Chauffeur *
                </label>
                <select
                  className="select-field"
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  style={{ width: '100%', borderRadius: '12px', padding: '12px' }}
                >
                  <option value="">Select available driver...</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.full_name} — 📞 {d.phone_number} (★ {d.rating}) [{d.duty_status}]
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                  The driver will receive trip pickup location and passenger contact on dispatch.
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  className="btn-secondary"
                  style={{ borderRadius: '24px' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAllocation}
                  disabled={allocationSubmitting}
                  className="btn-primary"
                  style={{ borderRadius: '24px', padding: '10px 24px' }}
                >
                  {allocationSubmitting ? 'Assigning...' : 'Confirm & Dispatch Trip'}
                </button>
              </div>

            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 2: END TRIP & ENTER METER / INVOICE */}
      {showTripControlModal && createPortal(
        <div className="portal-modal-overlay" onClick={() => setShowTripControlModal(false)}>
          <div 
            className="md3-card portal-modal-card" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '580px', padding: '30px', borderRadius: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'var(--color-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Receipt size={22} color="var(--color-success)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    End Trip & Generate Bill
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    {selectedBooking?.booking_reference} • {selectedBooking?.passenger_name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTripControlModal(false)}
                className="btn-secondary"
                style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dim)' }}>
                    STARTING ODOMETER (KM)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={startOdo}
                    disabled
                    style={{ background: 'var(--md-surface-container-high)', borderRadius: '12px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    FINAL ODOMETER (KM) *
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={endOdo}
                    onChange={(e) => setEndOdo(e.target.value)}
                    style={{ borderRadius: '12px', fontWeight: 700 }}
                    placeholder="Enter final km reading"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  TOLL / PARKING / AIRPORT ENTRY CHARGES (₹ INR)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={tollParking}
                  onChange={(e) => setTollParking(e.target.value)}
                  style={{ borderRadius: '12px' }}
                  placeholder="0"
                />
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                  Any fastag tolls or parking slips paid by driver will be reimbursed and added to bill.
                </span>
              </div>

              {/* Real-time Bill Calculation Preview */}
              <div style={{ 
                background: 'var(--md-surface-container-low)', 
                padding: '16px', 
                borderRadius: '16px', 
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  LIVE BILL BREAKDOWN
                </span>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Distance Traveled:</span>
                  <strong>{calcDist} KM</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Agreed Base Rate:</span>
                  <span>₹{selectedBooking?.base_rate_inr || 2500}</span>
                </div>

                {calcExtraCharge > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-warning)' }}>
                    <span>Extra KM ({calcExtraKm} km @ ₹{selectedBooking?.extra_km_rate_inr}/km):</span>
                    <span>+ ₹{calcExtraCharge}</span>
                  </div>
                )}

                {Number(tollParking) > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Tolls & Parking:</span>
                    <span>+ ₹{Number(tollParking)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                  <span>GST (5%):</span>
                  <span>+ ₹{calcGst.toFixed(2)}</span>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: '1.1rem', 
                  fontWeight: 800, 
                  color: '#041e49',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '8px',
                  marginTop: '4px'
                }}>
                  <span>Total Invoiced:</span>
                  <span>₹{calcTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowTripControlModal(false)}
                  className="btn-secondary"
                  style={{ borderRadius: '24px' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCompleteTrip}
                  disabled={tripSubmitting || !endOdo || Number(endOdo) <= Number(startOdo)}
                  className="btn-primary"
                  style={{ borderRadius: '24px', padding: '10px 24px' }}
                >
                  {tripSubmitting ? 'Generating Invoice...' : 'Complete Trip & Bill Client'}
                </button>
              </div>

            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 3: VIEW INVOICE / RECEIPT */}
      {showInvoiceModal && selectedBooking && createPortal(
        <div className="portal-modal-overlay" onClick={() => setShowInvoiceModal(false)}>
          <div 
            className="md3-card portal-modal-card" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px', padding: '36px', borderRadius: '24px', background: '#ffffff' }}
          >
            {/* Invoice Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border-color)', paddingBottom: '20px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                  APEX FLEET B2B TAX INVOICE
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  Commercial Passenger Transport Service
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  GSTIN: <strong>30AAACA1234F1Z8</strong> • Panaji, Goa
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="font-mono" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  {selectedBooking.booking_reference}
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  Date: {new Date(selectedBooking.pickup_time).toLocaleDateString()}
                </p>
                <span className="badge badge-success" style={{ marginTop: '4px', fontSize: '0.75rem' }}>
                  PAID / BILLED TO ACCOUNT
                </span>
              </div>
            </div>

            {/* Client & Passenger Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div style={{ background: 'var(--md-surface-container-low)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>BILLED TO CLIENT:</span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>{selectedBooking.client_name}</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>B2B Corporate Contract</p>
              </div>

              <div style={{ background: 'var(--md-surface-container-low)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>PASSENGER & CHAUFFEUR:</span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>{selectedBooking.passenger_name}</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  Car: {selectedBooking.assigned_vehicle_detail?.registration_number || 'N/A'} • Driver: {selectedBooking.assigned_driver_detail?.full_name || 'N/A'}
                </p>
              </div>
            </div>

            {/* Route Details */}
            <div style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>TRIP JOURNEY:</span>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: '4px' }}>
                <strong>From:</strong> {selectedBooking.pickup_location} ➔ <strong>To:</strong> {selectedBooking.dropoff_location}
              </p>
              {selectedBooking.flight_number && (
                <p style={{ fontSize: '0.8rem', color: '#0b57d0', marginTop: '2px' }}>
                  Flight: {selectedBooking.flight_number}
                </p>
              )}
            </div>

            {/* Invoice Line Items */}
            <table className="custom-table" style={{ marginBottom: '20px' }}>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>KM / Qty</th>
                  <th>Rate</th>
                  <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedBooking.booking_type_display || selectedBooking.booking_type} (Base)</td>
                  <td>1 Trip</td>
                  <td>₹{selectedBooking.base_rate_inr}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{selectedBooking.base_rate_inr}</td>
                </tr>
                {selectedBooking.distance_km > 40 && (
                  <tr>
                    <td>Extra Kilometers Run</td>
                    <td>{selectedBooking.distance_km - 40} KM</td>
                    <td>₹{selectedBooking.extra_km_rate_inr}/km</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>
                      ₹{(selectedBooking.distance_km - 40) * selectedBooking.extra_km_rate_inr}
                    </td>
                  </tr>
                )}
                {selectedBooking.toll_parking_inr > 0 && (
                  <tr>
                    <td>Toll & Parking Reimbursement</td>
                    <td>—</td>
                    <td>At Actuals</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{selectedBooking.toll_parking_inr}</td>
                  </tr>
                )}
                <tr>
                  <td colSpan="3" style={{ textAlign: 'right', color: 'var(--text-dim)' }}>GST (5% SAC 9964):</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>
                    ₹{((Number(selectedBooking.total_fare_inr) || 0) * 0.05 / 1.05).toFixed(2)}
                  </td>
                </tr>
                <tr style={{ background: 'var(--md-surface-container-low)' }}>
                  <td colSpan="3" style={{ textAlign: 'right', fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                    TOTAL INVOICE AMOUNT:
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 800, fontSize: '1.15rem', color: '#0b57d0' }}>
                    ₹{Number(selectedBooking.total_fare_inr).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-secondary"
                style={{ borderRadius: '24px', gap: '6px' }}
              >
                <Printer size={16} />
                <span>Print Bill</span>
              </button>
              <button
                type="button"
                onClick={() => setShowInvoiceModal(false)}
                className="btn-primary"
                style={{ borderRadius: '24px' }}
              >
                Close
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* MODAL 4: NEW CORPORATE BOOKING */}
      {showCreateModal && createPortal(
        <div className="portal-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div 
            className="md3-card portal-modal-card" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px', padding: '32px', borderRadius: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'var(--accent-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={22} color="#0b57d0" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    New Trip Booking
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    Create corporate airport transfer, executive ride, or hotel shuttle.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="btn-secondary"
                style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Client & Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Corporate Account *
                  </label>
                  <select
                    className="select-field"
                    value={bookingFormData.client}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, client: e.target.value })}
                    required
                    style={{ borderRadius: '12px' }}
                  >
                    <option value="">Select Corporate Client...</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Trip Service Type
                  </label>
                  <select
                    className="select-field"
                    value={bookingFormData.booking_type}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, booking_type: e.target.value })}
                    style={{ borderRadius: '12px' }}
                  >
                    <option value="AIRPORT_TRANSFER">Airport Transfer (Flight)</option>
                    <option value="POINT_TO_POINT">Point to Point Ride</option>
                    <option value="HOURLY_RENTAL">Full Day / Hourly Rental</option>
                    <option value="HOTEL_TRANSFER">Hotel Resort Shuttle</option>
                    <option value="OUTSTATION">Outstation Trip</option>
                  </select>
                </div>
              </div>

              {/* Passenger Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Passenger Name *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Ramesh Kumar"
                    value={bookingFormData.passenger_name}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, passenger_name: e.target.value })}
                    required
                    style={{ borderRadius: '12px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Passenger Phone *
                  </label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="e.g. +91 98221 44556"
                    value={bookingFormData.passenger_phone}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, passenger_phone: e.target.value })}
                    required
                    style={{ borderRadius: '12px' }}
                  />
                </div>
              </div>

              {/* Route */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Pickup Location *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Taj Fort Aguada, Candolim"
                    value={bookingFormData.pickup_location}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, pickup_location: e.target.value })}
                    required
                    style={{ borderRadius: '12px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Drop-off Destination *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Goa Dabolim Airport"
                    value={bookingFormData.dropoff_location}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, dropoff_location: e.target.value })}
                    required
                    style={{ borderRadius: '12px' }}
                  />
                </div>
              </div>

              {/* Timing & Vehicle Class */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Pickup Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={bookingFormData.pickup_time}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, pickup_time: e.target.value })}
                    required
                    style={{ borderRadius: '12px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Car Type
                  </label>
                  <select
                    className="select-field"
                    value={bookingFormData.vehicle_class_requested}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, vehicle_class_requested: e.target.value })}
                    style={{ borderRadius: '12px' }}
                  >
                    <option value="SEDAN">Sedan (Dzire, Etios)</option>
                    <option value="SUV">SUV (Innova, Ertiga)</option>
                    <option value="PREMIUM_SEDAN">Premium (Camry)</option>
                    <option value="LUXURY_SUV">Luxury SUV (Fortuner)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Flight # (Optional)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. 6E-204"
                    value={bookingFormData.flight_number}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, flight_number: e.target.value })}
                    style={{ borderRadius: '12px' }}
                  />
                </div>
              </div>

              {/* Agreed Rates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Base Contract Fare (₹ INR) *
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={bookingFormData.base_rate_inr}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, base_rate_inr: Number(e.target.value) })}
                    required
                    style={{ borderRadius: '12px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Extra Rate per KM (₹ INR)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={bookingFormData.extra_km_rate_inr}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, extra_km_rate_inr: Number(e.target.value) })}
                    style={{ borderRadius: '12px' }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                  style={{ borderRadius: '24px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="btn-primary"
                  style={{ borderRadius: '24px', padding: '10px 24px' }}
                >
                  {createSubmitting ? 'Booking...' : 'Create Booking'}
                </button>
              </div>

            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default B2BDispatches;
