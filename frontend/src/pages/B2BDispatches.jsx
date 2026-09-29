import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import api from '../services/api';
import { 
  Briefcase, Navigation, MapPin, Clock, Calendar, Car, User, 
  CheckCircle2, AlertCircle, Plus, Search, Filter, Phone, 
  ArrowRight, DollarSign, Shield, Zap, ChevronRight, X, Play, 
  Check, RefreshCw, Plane, UserCheck, Receipt, Building2, SlidersHorizontal
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

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showTripControlModal, setShowTripControlModal] = useState(false);
  
  // Selected booking for allocation or trip control
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Allocation form state
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [allocationSubmitting, setAllocationSubmitting] = useState(false);

  // Trip completion form state
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
    setSelectedVehicleId(matchingVehicles[0]?.id || vehicles[0]?.id || '');
    
    // Pre-select on-duty driver
    const onDutyDrivers = drivers.filter(d => d.duty_status === 'ON_DUTY_AVAILABLE');
    setSelectedDriverId(onDutyDrivers[0]?.id || drivers[0]?.id || '');
    
    setShowAllocateModal(true);
  };

  // Submit Driver + Vehicle Allocation
  const handleConfirmAllocation = async () => {
    if (!selectedVehicleId || !selectedDriverId || !selectedBooking) {
      alert('Please select both a fleet vehicle and an available driver.');
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
      alert('Error dispatching booking: ' + JSON.stringify(err.response?.data || err.message));
    } finally {
      setAllocationSubmitting(false);
    }
  };

  // Open Trip Control Modal
  const handleOpenTripControl = (booking) => {
    setSelectedBooking(booking);
    setEndOdo(booking.assigned_vehicle_detail?.current_odometer ? booking.assigned_vehicle_detail.current_odometer + 35 : '');
    setTollParking(0);
    setShowTripControlModal(true);
  };

  // Start Trip
  const handleStartTrip = async (bookingId) => {
    try {
      await api.post(`dispatches/bookings/${bookingId}/start_trip/`);
      setShowTripControlModal(false);
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
    if (!window.confirm('Are you sure you want to cancel this booking? Assigned driver and vehicle will be released.')) {
      return;
    }
    try {
      await api.post(`dispatches/bookings/${bookingId}/cancel/`);
      fetchDispatchesData();
    } catch (err) {
      alert('Error cancelling booking: ' + JSON.stringify(err.response?.data || err.message));
    }
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
      alert('Error creating booking: ' + JSON.stringify(err.response?.data || err.message));
    } finally {
      setCreateSubmitting(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      b.booking_reference?.toLowerCase().includes(q) ||
      b.passenger_name?.toLowerCase().includes(q) ||
      b.client_name?.toLowerCase().includes(q) ||
      b.pickup_location?.toLowerCase().includes(q) ||
      b.dropoff_location?.toLowerCase().includes(q) ||
      b.flight_number?.toLowerCase().includes(q);

    const matchesStatus = statusFilter ? b.status === statusFilter : true;
    const matchesClient = clientFilter ? String(b.client) === String(clientFilter) : true;

    return matchesSearch && matchesStatus && matchesClient;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><Clock size={12} /> Pending Allocation</span>;
      case 'DISPATCHED':
        return <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><Navigation size={12} /> Dispatched</span>;
      case 'ON_TRIP':
        return <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><Zap size={12} /> On Active Trip</span>;
      case 'COMPLETED':
        return <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(11, 87, 208, 0.12)', color: '#0b57d0', borderColor: 'rgba(11, 87, 208, 0.25)' }}><Receipt size={12} /> Invoiced</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge badge-info">{status}</span>;
    }
  };

  return (
    <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Banner / Hero Metric */}
      <div style={{
        padding: '30px 36px',
        background: 'var(--md-surface-container)',
        borderRadius: '24px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <span className="badge badge-info" style={{ marginBottom: '10px' }}>Phase 3 Dispatch Center</span>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            B2B Dispatches & Corporate Roster Engine
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '6px', maxWidth: '700px' }}>
            Coordinate corporate airport transfers, executive charters, and employee shift shuttles with real-time chauffeur allocation and automated billing.
          </p>
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
          <span>New Corporate Booking</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '18px' }}>
        <div className="md3-card" style={{ padding: '22px' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>TOTAL BOOKINGS</p>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>{summary.total_bookings || 0}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>All contracted requests</span>
        </div>

        <div className="md3-card" style={{ padding: '22px', background: summary.pending_allocation > 0 ? 'var(--color-warning-bg)' : '#ffffff', borderColor: summary.pending_allocation > 0 ? 'var(--color-warning-border)' : 'var(--border-color)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-warning)', fontWeight: 700, textTransform: 'uppercase' }}>PENDING DISPATCH</p>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-warning)', marginTop: '4px' }}>{summary.pending_allocation || 0}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '6px', display: 'block' }}>Awaiting chauffeur & car</span>
        </div>

        <div className="md3-card" style={{ padding: '22px' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700, textTransform: 'uppercase' }}>LIVE ON TRIP</p>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '4px' }}>{summary.active_live || 0}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>Chauffeur active & meter live</span>
        </div>

        <div className="md3-card" style={{ padding: '22px' }}>
          <p style={{ fontSize: '0.75rem', color: '#0b57d0', fontWeight: 700, textTransform: 'uppercase' }}>COMPLETED & BILLED</p>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0b57d0', marginTop: '4px' }}>{summary.completed || 0}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>Invoiced to corporate accounts</span>
        </div>

        <div className="md3-card" style={{ padding: '22px', background: 'var(--accent-primary-container)', borderColor: 'rgba(11, 87, 208, 0.2)' }}>
          <p style={{ fontSize: '0.75rem', color: '#0b57d0', fontWeight: 700, textTransform: 'uppercase' }}>REVENUE REALIZED</p>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#041e49', marginTop: '4px' }}>
            ₹{Number(summary.total_revenue_inr || 0).toLocaleString()}
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#0b57d0', marginTop: '6px', display: 'block' }}>Gross B2B billing + 5% GST</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="md3-card" style={{ padding: '16px 22px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '44px', borderRadius: '24px', background: 'var(--md-surface-container)' }}
            placeholder="Search booking ref, passenger name, flight #, pickup, destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ width: '220px' }}>
          <select
            className="select-field"
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            style={{ borderRadius: '24px' }}
          >
            <option value="">All Corporate Clients</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div style={{ width: '190px' }}>
          <select
            className="select-field"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ borderRadius: '24px' }}
          >
            <option value="">All Trip Statuses</option>
            <option value="PENDING">Pending Allocation</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="ON_TRIP">On Active Trip</option>
            <option value="COMPLETED">Completed & Invoiced</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Dispatches Board Table */}
      {loading ? (
        <div className="md3-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw size={24} className="animate-pulse" style={{ margin: '0 auto 12px auto' }} />
          Loading B2B dispatches roster...
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="md3-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Briefcase size={36} color="var(--text-dim)" style={{ margin: '0 auto 12px auto' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>No Dispatch Bookings Found</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            No bookings match your current filter criteria.
          </p>
        </div>
      ) : (
        <div className="md3-card" style={{ overflow: 'hidden', padding: 0 }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Booking Ref & Client</th>
                <th>Trip Type & Timing</th>
                <th>Passenger & Route</th>
                <th>Assigned Chauffeur & Vehicle</th>
                <th>Fare (₹ INR)</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Operations</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <strong className="font-mono" style={{ color: 'var(--accent-primary)', fontSize: '0.92rem' }}>
                      {b.booking_reference}
                    </strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <Building2 size={13} color="var(--text-dim)" />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600 }}>{b.client_name}</span>
                    </div>
                  </td>

                  <td>
                    <span className="badge badge-info" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                      {b.booking_type_display || b.booking_type}
                    </span>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      <span>{new Date(b.pickup_time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                    </p>
                    {b.flight_number && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#0b57d0', fontWeight: 600 }}>
                        <Plane size={11} /> {b.flight_number}
                      </span>
                    )}
                  </td>

                  <td>
                    <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{b.passenger_name}</strong>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>📞 {b.passenger_phone}</p>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '240px' }}>
                      <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>Pickup:</span> {b.pickup_location}<br />
                      <span style={{ color: '#0b57d0', fontWeight: 700 }}>Drop:</span> {b.dropoff_location}
                    </div>
                  </td>

                  <td>
                    {b.assigned_vehicle_detail && b.assigned_driver_detail ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Car size={14} color="var(--accent-primary)" />
                          <strong className="font-mono" style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>
                            {b.assigned_vehicle_detail.registration_number}
                          </strong>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                            ({b.assigned_vehicle_detail.make} {b.assigned_vehicle_detail.model})
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <User size={14} color="var(--color-success)" />
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 600 }}>
                            {b.assigned_driver_detail.full_name}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-warning)' }}>
                            ★ {b.assigned_driver_detail.rating}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-warning)', fontWeight: 600 }}>
                          Requested: {b.vehicle_class_requested_display || b.vehicle_class_requested}
                        </span>
                        <button
                          onClick={() => handleOpenAllocateModal(b)}
                          className="btn-primary"
                          style={{ fontSize: '0.76rem', padding: '5px 12px', borderRadius: '16px' }}
                        >
                          <UserCheck size={13} />
                          <span>Allocate Chauffeur</span>
                        </button>
                      </div>
                    )}
                  </td>

                  <td>
                    <strong style={{ color: 'var(--text-main)', fontSize: '1rem', fontWeight: 800 }}>
                      ₹{Number(b.total_fare_inr).toLocaleString()}
                    </strong>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Base: ₹{b.base_rate_inr} + 5% GST</p>
                    {b.distance_km > 0 && (
                      <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--color-success)' }}>
                        {b.distance_km} KM Traveled
                      </span>
                    )}
                  </td>

                  <td>
                    {getStatusBadge(b.status)}
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      {b.status === 'PENDING' && (
                        <button
                          onClick={() => handleOpenAllocateModal(b)}
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: '14px' }}
                        >
                          Allocate
                        </button>
                      )}

                      {b.status === 'DISPATCHED' && (
                        <button
                          onClick={() => handleStartTrip(b.id)}
                          className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: '14px', background: 'var(--color-success)', borderColor: 'var(--color-success)' }}
                        >
                          <Play size={12} />
                          <span>Start Trip</span>
                        </button>
                      )}

                      {b.status === 'ON_TRIP' && (
                        <button
                          onClick={() => handleOpenTripControl(b)}
                          className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: '14px' }}
                        >
                          <Receipt size={12} />
                          <span>End & Invoice</span>
                        </button>
                      )}

                      {(b.status === 'PENDING' || b.status === 'DISPATCHED') && (
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(220, 38, 38, 0.25)',
                            color: 'var(--color-danger)',
                            borderRadius: '14px',
                            padding: '6px 10px',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                          }}
                          title="Cancel Trip"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ALLOCATE CHAUFFEUR & VEHICLE MODAL */}
      {showAllocateModal && createPortal(
        <div className="portal-modal-overlay" onClick={() => setShowAllocateModal(false)}>
          <div 
            className="md3-card portal-modal-card" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px', padding: '32px', borderRadius: '28px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'var(--accent-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserCheck size={22} color="#0b57d0" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Allocate Fleet Car & Chauffeur
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
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
              
              {/* Trip Requirement Summary Box */}
              <div style={{ padding: '14px 18px', background: 'var(--md-surface-container-low)', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Passenger: <strong style={{ color: 'var(--text-main)' }}>{selectedBooking?.passenger_name}</strong></span>
                  <span style={{ color: 'var(--text-dim)' }}>Requested Class: <strong style={{ color: '#0b57d0' }}>{selectedBooking?.vehicle_class_requested}</strong></span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '6px' }}>
                  Route: {selectedBooking?.pickup_location} ➔ {selectedBooking?.dropoff_location}
                </p>
              </div>

              {/* Select Fleet Car */}
              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Assign Fleet Vehicle *
                </label>
                <select
                  className="select-field"
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  style={{ width: '100%', borderRadius: '12px' }}
                >
                  <option value="">Choose Available Vehicle...</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.registration_number} — {v.make} {v.model} ({v.vehicle_class}) [{v.status}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Available Driver */}
              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Assign Chauffeur / Driver *
                </label>
                <select
                  className="select-field"
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  style={{ width: '100%', borderRadius: '12px' }}
                >
                  <option value="">Choose On-Duty Chauffeur...</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.user_detail?.first_name ? `${d.user_detail.first_name} ${d.user_detail.last_name || ''}` : d.user_detail?.username} — Lic: {d.license_number} [{d.duty_status_display || d.duty_status}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  className="btn-secondary"
                  style={{ borderRadius: '24px', padding: '10px 22px' }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!selectedVehicleId || !selectedDriverId || allocationSubmitting}
                  onClick={handleConfirmAllocation}
                  className="btn-primary"
                  style={{ borderRadius: '24px', padding: '10px 26px', fontWeight: 700 }}
                >
                  {allocationSubmitting ? 'Confirming Dispatch...' : 'Dispatch Vehicle & Driver'}
                </button>
              </div>

            </div>
          </div>
        </div>,
        document.body
      )}

      {/* TRIP METER & INVOICING MODAL */}
      {showTripControlModal && createPortal(
        <div className="portal-modal-overlay" onClick={() => setShowTripControlModal(false)}>
          <div 
            className="md3-card portal-modal-card" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '600px', padding: '32px', borderRadius: '28px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'var(--color-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Receipt size={22} color="var(--color-success)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Conclude Journey & Bill Corporate Account
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    {selectedBooking?.booking_reference} • {selectedBooking?.client_name}
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
              
              <div style={{ padding: '14px 18px', background: 'var(--md-surface-container-low)', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Initial Odometer: <strong className="font-mono">{selectedBooking?.start_odometer || 0} KM</strong></span>
                  <span>Base Rate: <strong className="font-mono">₹{selectedBooking?.base_rate_inr}</strong></span>
                </div>
              </div>

              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Final Odometer Reading (KM) *
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="e.g. 18580"
                  value={endOdo}
                  onChange={(e) => setEndOdo(e.target.value)}
                  required
                  style={{ borderRadius: '12px' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  FASTag Tolls & Parking Expenses (₹ INR)
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="0.00"
                  value={tollParking}
                  onChange={(e) => setTollParking(e.target.value)}
                  style={{ borderRadius: '12px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowTripControlModal(false)}
                  className="btn-secondary"
                  style={{ borderRadius: '24px', padding: '10px 22px' }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!endOdo || tripSubmitting}
                  onClick={handleCompleteTrip}
                  className="btn-primary"
                  style={{ borderRadius: '24px', padding: '10px 26px', fontWeight: 700 }}
                >
                  {tripSubmitting ? 'Calculating Invoice...' : 'Generate Invoice & Conclude'}
                </button>
              </div>

            </div>
          </div>
        </div>,
        document.body
      )}

      {/* CREATE NEW CORPORATE BOOKING MODAL */}
      {showCreateModal && createPortal(
        <div className="portal-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div 
            className="md3-card portal-modal-card" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '680px', padding: '32px', borderRadius: '28px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'var(--accent-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={22} color="#0b57d0" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Create Corporate Dispatch Booking
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    Enter client contract details, routing, and passenger information.
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
              
              {/* Client & Booking Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>Corporate Client *</label>
                  <select
                    className="select-field"
                    value={bookingFormData.client}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, client: e.target.value })}
                    required
                    style={{ width: '100%', borderRadius: '12px' }}
                  >
                    <option value="">Select Corporate Account...</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>Trip Type *</label>
                  <select
                    className="select-field"
                    value={bookingFormData.booking_type}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, booking_type: e.target.value })}
                    required
                    style={{ width: '100%', borderRadius: '12px' }}
                  >
                    <option value="AIRPORT_TRANSFER">Airport Transfer</option>
                    <option value="CORP_CHARTER">Executive Charter (8h)</option>
                    <option value="EMPLOYEE_SHUTTLE">Employee Shuttle</option>
                    <option value="INTERCITY">Outstation Intercity</option>
                    <option value="POINT_TO_POINT">Point-to-Point</option>
                  </select>
                </div>
              </div>

              {/* Class & Timing */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>Vehicle Class Requested *</label>
                  <select
                    className="select-field"
                    value={bookingFormData.vehicle_class_requested}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, vehicle_class_requested: e.target.value })}
                    required
                    style={{ width: '100%', borderRadius: '12px' }}
                  >
                    <option value="SEDAN">Executive Sedan (Camry, Ciaz)</option>
                    <option value="SUV">Premium SUV (Innova, Fortuner)</option>
                    <option value="EV">Electric Vehicle (Tigor EV, BYD)</option>
                    <option value="VAN">Multi-Passenger Van</option>
                    <option value="LUXURY">Luxury Class (Mercedes E)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>Pickup Date & Time *</label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={bookingFormData.pickup_time}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, pickup_time: e.target.value })}
                    required
                    style={{ borderRadius: '12px' }}
                  />
                </div>
              </div>

              {/* Routing */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>Pickup Location *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Mopa GOX Airport Gate 4"
                    value={bookingFormData.pickup_location}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, pickup_location: e.target.value })}
                    required
                    style={{ borderRadius: '12px' }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>Drop-off Destination *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Grand Hyatt Bambolim"
                    value={bookingFormData.dropoff_location}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, dropoff_location: e.target.value })}
                    required
                    style={{ borderRadius: '12px' }}
                  />
                </div>
              </div>

              {/* Passenger & Flight */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>Passenger Name *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Rajesh Kumar (Director)"
                    value={bookingFormData.passenger_name}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, passenger_name: e.target.value })}
                    required
                    style={{ borderRadius: '12px' }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>Passenger Mobile *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="+91 98220 11223"
                    value={bookingFormData.passenger_phone}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, passenger_phone: e.target.value })}
                    required
                    style={{ borderRadius: '12px' }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>Flight Number</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. 6E-241"
                    value={bookingFormData.flight_number}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, flight_number: e.target.value })}
                    style={{ borderRadius: '12px' }}
                  />
                </div>
              </div>

              {/* Rates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>Base Shift Rate (₹ INR) *</label>
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
                  <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>Extra KM Rate (₹ / KM) *</label>
                  <input
                    type="number"
                    className="input-field"
                    value={bookingFormData.extra_km_rate_inr}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, extra_km_rate_inr: Number(e.target.value) })}
                    required
                    style={{ borderRadius: '12px' }}
                  />
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>Special Dispatch Instructions</label>
                <textarea
                  className="input-field"
                  rows={2}
                  placeholder="e.g. Name board arrival pickup Gate 4, non-smoking cabin..."
                  value={bookingFormData.special_instructions}
                  onChange={(e) => setBookingFormData({ ...bookingFormData, special_instructions: e.target.value })}
                  style={{ borderRadius: '12px', resize: 'vertical' }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '18px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                  style={{ borderRadius: '24px', padding: '10px 22px' }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="btn-primary"
                  style={{ borderRadius: '24px', padding: '10px 28px', fontWeight: 700 }}
                >
                  {createSubmitting ? 'Creating Booking...' : 'Save & Queue Booking'}
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
