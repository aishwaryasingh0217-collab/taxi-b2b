import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import api from '../services/api';
import { 
  FileCheck, Shield, AlertTriangle, AlertCircle, CheckCircle2, Clock, 
  Search, Filter, Plus, Calendar, Car, FileText, ChevronRight, X, 
  Trash2, RefreshCw, Eye, LayoutGrid, Table, DownloadCloud, Sparkles,
  Check, Edit3, ShieldAlert, ShieldCheck, User
} from 'lucide-react';

const ComplianceVault = () => {
  const [documents, setDocuments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [summary, setSummary] = useState({ total_documents: 0, valid: 0, expiring_soon: 0, expired: 0 });
  const [loading, setLoading] = useState(true);

  // View Mode: 'cars' (By Fleet Car - Recommended) or 'documents' (All Documents List)
  const [viewMode, setViewMode] = useState('cars');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected vehicle for details modal
  const [selectedVehicleForDetails, setSelectedVehicleForDetails] = useState(null);

  // Add / Edit Modal State
  const [showDocModal, setShowDocModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const initialFormState = {
    vehicle: '',
    document_type: 'INSURANCE',
    document_number: '',
    issue_date: new Date().toISOString().split('T')[0],
    expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    issuer_authority: '',
    notes: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchComplianceData = async () => {
    setLoading(true);
    try {
      const [docsRes, summaryRes, vehiclesRes] = await Promise.all([
        api.get('fleet/compliance/'),
        api.get('fleet/compliance/summary/'),
        api.get('fleet/vehicles/')
      ]);

      setDocuments(docsRes.data.results || docsRes.data || []);
      setSummary(summaryRes.data || { total_documents: 0, valid: 0, expiring_soon: 0, expired: 0 });
      setVehicles(vehiclesRes.data.results || vehiclesRes.data || []);
    } catch (err) {
      console.error('Failed to load compliance data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplianceData();
  }, []);

  const handleOpenAddModal = (preselectedVehicleId = '') => {
    setEditingDoc(null);
    setFormData({
      ...initialFormState,
      vehicle: preselectedVehicleId || vehicles[0]?.id || ''
    });
    setShowDocModal(true);
  };

  const handleOpenEditModal = (doc) => {
    setEditingDoc(doc);
    setFormData({
      vehicle: doc.vehicle,
      document_type: doc.document_type,
      document_number: doc.document_number,
      issue_date: doc.issue_date,
      expiry_date: doc.expiry_date,
      issuer_authority: doc.issuer_authority || '',
      notes: doc.notes || ''
    });
    setShowDocModal(true);
  };

  // Helper date buttons for expiry (+6 months, +1 year, +5 years)
  const setQuickExpiry = (months) => {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    setFormData({
      ...formData,
      expiry_date: d.toISOString().split('T')[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vehicle || !formData.document_number) {
      alert('Please select a car and specify document number.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingDoc) {
        await api.put(`fleet/compliance/${editingDoc.id}/`, formData);
      } else {
        await api.post('fleet/compliance/', formData);
      }
      setShowDocModal(false);
      fetchComplianceData();
    } catch (err) {
      alert('Error saving document: ' + JSON.stringify(err.response?.data || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (docId, docNum) => {
    if (!window.confirm(`Are you sure you want to delete certificate ${docNum}? This cannot be undone.`)) {
      return;
    }
    try {
      await api.delete(`fleet/compliance/${docId}/`);
      fetchComplianceData();
    } catch (err) {
      alert('Error deleting document: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  // Human-readable document type labels and icons
  const getDocTypeInfo = (type) => {
    switch (type) {
      case 'INSURANCE':
        return { label: 'Commercial Insurance', shortLabel: 'Insurance', icon: '🛡️' };
      case 'PUC':
        return { label: 'Pollution Under Control (PUC)', shortLabel: 'PUC', icon: '💨' };
      case 'RC_BOOK':
        return { label: 'RC Book (Registration)', shortLabel: 'RC Book', icon: '📋' };
      case 'FITNESS':
        return { label: 'Fitness Certificate', shortLabel: 'Fitness', icon: '🔧' };
      case 'PERMIT':
        return { label: 'Commercial / Taxi Permit', shortLabel: 'Taxi Permit', icon: '📄' };
      case 'TAX_REC':
        return { label: 'Road Tax Receipt', shortLabel: 'Road Tax', icon: '🧾' };
      default:
        return { label: type, shortLabel: type, icon: '📁' };
    }
  };

  // Group documents by Vehicle ID
  const vehicleComplianceMap = {};
  vehicles.forEach((v) => {
    vehicleComplianceMap[v.id] = {
      vehicle: v,
      docs: [],
      hasExpired: false,
      hasExpiringSoon: false,
      isFullyLegal: true
    };
  });

  documents.forEach((doc) => {
    if (vehicleComplianceMap[doc.vehicle]) {
      vehicleComplianceMap[doc.vehicle].docs.push(doc);
      if (doc.computed_status === 'EXPIRED') {
        vehicleComplianceMap[doc.vehicle].hasExpired = true;
        vehicleComplianceMap[doc.vehicle].isFullyLegal = false;
      } else if (doc.computed_status === 'EXPIRING_SOON') {
        vehicleComplianceMap[doc.vehicle].hasExpiringSoon = true;
        vehicleComplianceMap[doc.vehicle].isFullyLegal = false;
      }
    }
  });

  // Calculate vehicle counts
  const vehicleList = Object.values(vehicleComplianceMap);
  const fullyLegalVehiclesCount = vehicleList.filter(item => item.docs.length >= 3 && !item.hasExpired && !item.hasExpiringSoon).length;
  const expiredVehiclesCount = vehicleList.filter(item => item.hasExpired).length;
  const expiringSoonVehiclesCount = vehicleList.filter(item => item.hasExpiringSoon && !item.hasExpired).length;

  // Filtered vehicles for Card view
  const filteredVehicles = vehicleList.filter((item) => {
    const q = searchQuery.toLowerCase();
    const v = item.vehicle;
    const matchesSearch = 
      v.registration_number?.toLowerCase().includes(q) ||
      v.make?.toLowerCase().includes(q) ||
      v.model?.toLowerCase().includes(q) ||
      item.docs.some(d => d.document_number?.toLowerCase().includes(q));

    let matchesStatus = true;
    if (statusFilter === 'EXPIRED') {
      matchesStatus = item.hasExpired;
    } else if (statusFilter === 'EXPIRING_SOON') {
      matchesStatus = item.hasExpiringSoon;
    } else if (statusFilter === 'VALID') {
      matchesStatus = item.isFullyLegal && item.docs.length > 0;
    }

    return matchesSearch && matchesStatus;
  });

  // Filtered documents for Table view
  const filteredDocs = documents.filter((doc) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      doc.document_number?.toLowerCase().includes(q) ||
      doc.vehicle_registration?.toLowerCase().includes(q) ||
      doc.vehicle_make?.toLowerCase().includes(q) ||
      doc.vehicle_model?.toLowerCase().includes(q) ||
      doc.issuer_authority?.toLowerCase().includes(q);

    const matchesType = docTypeFilter ? doc.document_type === docTypeFilter : true;
    const matchesStatus = statusFilter ? doc.computed_status === statusFilter : true;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Helper chip renderer for document status
  const renderStatusBadge = (status, days) => {
    if (status === 'EXPIRED') {
      return (
        <span style={{ 
          fontSize: '0.74rem', 
          padding: '3px 8px', 
          borderRadius: '12px', 
          background: 'var(--color-danger-bg)', 
          color: 'var(--color-danger)', 
          fontWeight: 700,
          border: '1px solid var(--color-danger-border)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <AlertCircle size={12} /> EXPIRED ({Math.abs(days)}d ago)
        </span>
      );
    }
    if (status === 'EXPIRING_SOON') {
      return (
        <span style={{ 
          fontSize: '0.74rem', 
          padding: '3px 8px', 
          borderRadius: '12px', 
          background: 'var(--color-warning-bg)', 
          color: 'var(--color-warning)', 
          fontWeight: 700,
          border: '1px solid var(--color-warning-border)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Clock size={12} /> Expiring in {days}d
        </span>
      );
    }
    return (
      <span style={{ 
        fontSize: '0.74rem', 
        padding: '3px 8px', 
        borderRadius: '12px', 
        background: 'var(--color-success-bg)', 
        color: 'var(--color-success)', 
        fontWeight: 600,
        border: '1px solid var(--color-success-border)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <CheckCircle2 size={12} /> Legal ({days}d left)
      </span>
    );
  };

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
            background: 'var(--color-success-bg)',
            color: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ShieldCheck size={28} color="var(--color-success)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Car Papers & Expiry (RTO Compliance)
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Track Insurance, Pollution (PUC), Fitness, and Taxi Permits. Avoid police fines and car seizures.
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenAddModal()}
          className="btn-primary"
          style={{ padding: '12px 24px', borderRadius: '28px', fontSize: '0.92rem', gap: '8px' }}
        >
          <Plus size={18} />
          <span>Add / Renew Paper</span>
        </button>
      </div>

      {/* Urgent Warning Banner (Traffic-Light System) */}
      {summary.expired > 0 && (
        <div style={{
          padding: '18px 24px',
          background: 'var(--color-danger-bg)',
          border: '1px solid var(--color-danger-border)',
          borderRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(197, 34, 31, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={22} color="var(--color-danger)" />
            </div>
            <div>
              <strong style={{ fontSize: '1rem', color: 'var(--color-danger)', fontWeight: 800 }}>
                🛑 Action Required: {summary.expired} Vehicle Paper(s) Expired!
              </strong>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', marginTop: '2px' }}>
                Cars with expired insurance or fitness certificates risk ₹10,000+ RTO fines, police seizure, and cannot be dispatched for trips.
              </p>
            </div>
          </div>

          <button
            onClick={() => { setStatusFilter('EXPIRED'); setViewMode('cars'); }}
            className="btn-danger"
            style={{ padding: '8px 18px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700 }}
          >
            Show Expired Cars ({expiredVehiclesCount})
          </button>
        </div>
      )}

      {summary.expired === 0 && summary.expiring_soon > 0 && (
        <div style={{
          padding: '16px 22px',
          background: 'var(--color-warning-bg)',
          border: '1px solid var(--color-warning-border)',
          borderRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Clock size={20} color="var(--color-warning)" />
            <div>
              <strong style={{ fontSize: '0.92rem', color: 'var(--color-warning)', fontWeight: 700 }}>
                ⚠️ Notice: {summary.expiring_soon} Document(s) Expiring within 30 Days
              </strong>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginTop: '1px' }}>
                Renew before the expiration date to avoid last-minute rush and police checkpoints.
              </p>
            </div>
          </div>

          <button
            onClick={() => { setStatusFilter('EXPIRING_SOON'); setViewMode('cars'); }}
            className="btn-secondary"
            style={{ padding: '6px 14px', borderRadius: '16px', fontSize: '0.8rem', color: 'var(--color-warning)', borderColor: 'var(--color-warning-border)' }}
          >
            View Expiring ({summary.expiring_soon})
          </button>
        </div>
      )}

      {/* 4 Summary Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        
        {/* Legal Cars */}
        <div 
          onClick={() => { setStatusFilter(''); setViewMode('cars'); }}
          className="md3-card" 
          style={{ 
            padding: '20px', 
            cursor: 'pointer',
            border: statusFilter === '' && viewMode === 'cars' ? '2px solid var(--color-success)' : '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-success)', fontWeight: 700, textTransform: 'uppercase' }}>
              🟢 ROAD LEGAL CARS
            </span>
            <ShieldCheck size={18} color="var(--color-success)" />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '6px' }}>
            {fullyLegalVehiclesCount} / {vehicles.length}
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Cars with all papers valid & legal
          </p>
        </div>

        {/* Expiring Soon */}
        <div 
          onClick={() => { setStatusFilter('EXPIRING_SOON'); }}
          className="md3-card" 
          style={{ 
            padding: '20px', 
            cursor: 'pointer',
            background: summary.expiring_soon > 0 ? 'var(--color-warning-bg)' : '#ffffff',
            border: statusFilter === 'EXPIRING_SOON' ? '2px solid var(--color-warning)' : '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-warning)', fontWeight: 700, textTransform: 'uppercase' }}>
              🟡 EXPIRING SOON (&lt;30d)
            </span>
            <Clock size={18} color="var(--color-warning)" />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-warning)', marginTop: '6px' }}>
            {summary.expiring_soon}
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Papers within 30-day renewal window
          </p>
        </div>

        {/* Expired Papers */}
        <div 
          onClick={() => { setStatusFilter('EXPIRED'); }}
          className="md3-card" 
          style={{ 
            padding: '20px', 
            cursor: 'pointer',
            background: summary.expired > 0 ? 'var(--color-danger-bg)' : '#ffffff',
            border: statusFilter === 'EXPIRED' ? '2px solid var(--color-danger)' : '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-danger)', fontWeight: 700, textTransform: 'uppercase' }}>
              🔴 EXPIRED (FINE RISK)
            </span>
            <AlertCircle size={18} color="var(--color-danger)" />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-danger)', marginTop: '6px' }}>
            {summary.expired}
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            {summary.expired > 0 ? 'Ground car immediately & renew' : 'Zero expired papers! Great job'}
          </p>
        </div>

        {/* Total Documents Filed */}
        <div className="md3-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
              📁 PAPERS IN VAULT
            </span>
            <FileCheck size={18} color="#0b57d0" />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>
            {summary.total_documents}
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Insurance, PUC, Fitness, RC, Permits
          </p>
        </div>

      </div>

      {/* Controls Bar: View Mode Switcher + Search + Filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        
        {/* View Mode Toggle: "By Fleet Car" vs "All Documents" */}
        <div style={{ display: 'flex', background: 'var(--md-surface-container)', padding: '4px', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setViewMode('cars')}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: viewMode === 'cars' ? '#ffffff' : 'transparent',
              color: viewMode === 'cars' ? 'var(--text-main)' : 'var(--text-dim)',
              boxShadow: viewMode === 'cars' ? 'var(--elevation-1)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Car size={15} />
            <span>By Fleet Car ({vehicles.length} Cars)</span>
          </button>

          <button
            onClick={() => setViewMode('documents')}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: viewMode === 'documents' ? '#ffffff' : 'transparent',
              color: viewMode === 'documents' ? 'var(--text-main)' : 'var(--text-dim)',
              boxShadow: viewMode === 'documents' ? 'var(--elevation-1)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileText size={15} />
            <span>All Documents List ({documents.length})</span>
          </button>
        </div>

        {/* Search & Status Filters */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '40px', borderRadius: '24px', background: '#ffffff', fontSize: '0.85rem' }}
              placeholder={viewMode === 'cars' ? "Search car plate, model..." : "Search certificate #, car plate..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ width: '180px' }}>
            <select
              className="select-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ borderRadius: '24px', background: '#ffffff', fontSize: '0.85rem' }}
            >
              <option value="">All Health Status</option>
              <option value="EXPIRED">🔴 Expired / Fine Risk</option>
              <option value="EXPIRING_SOON">🟡 Expiring Soon (&lt;30d)</option>
              <option value="VALID">🟢 100% Road Legal</option>
            </select>
          </div>

          {viewMode === 'documents' && (
            <div style={{ width: '180px' }}>
              <select
                className="select-field"
                value={docTypeFilter}
                onChange={(e) => setDocTypeFilter(e.target.value)}
                style={{ borderRadius: '24px', background: '#ffffff', fontSize: '0.85rem' }}
              >
                <option value="">All Paper Types</option>
                <option value="INSURANCE">Commercial Insurance</option>
                <option value="PUC">Pollution (PUC)</option>
                <option value="FITNESS">Fitness Certificate</option>
                <option value="RC_BOOK">RC Book</option>
                <option value="PERMIT">Taxi Permit</option>
                <option value="TAX_REC">Road Tax</option>
              </select>
            </div>
          )}

          {(searchQuery || statusFilter || docTypeFilter) && (
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter(''); setDocTypeFilter(''); }}
              className="btn-secondary"
              style={{ borderRadius: '24px', padding: '6px 14px', fontSize: '0.8rem' }}
            >
              Reset
            </button>
          )}
        </div>

      </div>

      {/* VIEW MODE 1: BY FLEET CAR (RECOMMENDED & INTUITIVE FOR OPERATORS) */}
      {viewMode === 'cars' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {filteredVehicles.length === 0 ? (
            <div className="md3-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Car size={36} color="var(--text-dim)" style={{ margin: '0 auto 12px auto' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>No Fleet Cars Match Filters</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                Try resetting your search query or status filter.
              </p>
            </div>
          ) : (
            filteredVehicles.map(({ vehicle: v, docs, hasExpired, hasExpiringSoon, isFullyLegal }) => (
              <div 
                key={v.id}
                className="md3-card"
                style={{
                  padding: '24px',
                  borderRadius: '20px',
                  borderLeft: hasExpired 
                    ? '6px solid var(--color-danger)' 
                    : hasExpiringSoon 
                      ? '6px solid var(--color-warning)' 
                      : '6px solid var(--color-success)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px'
                }}
              >
                {/* Vehicle Header & Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '14px',
                      background: 'var(--md-surface-container)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Car size={22} color="var(--text-main)" />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {v.registration_number}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                          • {v.make} {v.model} ({v.model_year})
                        </span>
                        <span style={{ fontSize: '0.74rem', padding: '2px 8px', borderRadius: '10px', background: 'var(--md-surface-container-high)', color: 'var(--text-muted)' }}>
                          {v.fuel_type} • {v.vehicle_class}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                        <span>Odometer: <strong>{v.current_odometer?.toLocaleString()} KM</strong></span>
                        {v.assigned_driver_detail && (
                          <span>
                            Assigned Driver: <strong>{v.assigned_driver_detail.full_name}</strong> (📞 {v.assigned_driver_detail.phone_number})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Road Legal Status Pill */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {hasExpired ? (
                      <span className="badge badge-danger" style={{ fontSize: '0.82rem', padding: '6px 14px', borderRadius: '16px' }}>
                        🛑 STOP: Papers Expired (Police Fine Risk)
                      </span>
                    ) : hasExpiringSoon ? (
                      <span className="badge badge-warning" style={{ fontSize: '0.82rem', padding: '6px 14px', borderRadius: '16px' }}>
                        ⚠️ Warning: 1+ Papers Expiring Soon
                      </span>
                    ) : (
                      <span className="badge badge-success" style={{ fontSize: '0.82rem', padding: '6px 14px', borderRadius: '16px' }}>
                        🟢 100% Road Legal (All Clear)
                      </span>
                    )}

                    <button
                      onClick={() => handleOpenAddModal(v.id)}
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.82rem', borderRadius: '18px', gap: '6px' }}
                    >
                      <Plus size={14} />
                      <span>+ Renew / Add Paper</span>
                    </button>
                  </div>
                </div>

                {/* 5 Essential Paper Checklist Grid */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(5, 1fr)', 
                  gap: '12px',
                  background: 'var(--md-surface-container-low)',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)'
                }}>
                  {['INSURANCE', 'PUC', 'FITNESS', 'RC_BOOK', 'PERMIT'].map((docType) => {
                    const info = getDocTypeInfo(docType);
                    const doc = docs.find(d => d.document_type === docType);

                    return (
                      <div 
                        key={docType}
                        style={{
                          background: '#ffffff',
                          padding: '12px 14px',
                          borderRadius: '12px',
                          border: doc?.computed_status === 'EXPIRED' 
                            ? '1.5px solid var(--color-danger)' 
                            : doc?.computed_status === 'EXPIRING_SOON' 
                              ? '1.5px solid var(--color-warning)' 
                              : '1px solid var(--border-color)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {info.icon} {info.shortLabel}
                          </span>
                          {doc && (
                            <button
                              onClick={() => handleOpenEditModal(doc)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', padding: 0 }}
                              title="Edit / Update Certificate"
                            >
                              <Edit3 size={13} />
                            </button>
                          )}
                        </div>

                        {doc ? (
                          <div>
                            <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                              #{doc.document_number}
                            </p>
                            <p style={{ fontSize: '0.74rem', color: 'var(--text-main)', marginTop: '2px' }}>
                              Exp: <strong>{new Date(doc.expiry_date).toLocaleDateString()}</strong>
                            </p>
                            <div style={{ marginTop: '6px' }}>
                              {renderStatusBadge(doc.computed_status, doc.days_remaining)}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontStyle: 'italic', display: 'block' }}>
                              No record uploaded
                            </span>
                            <button
                              onClick={() => {
                                setEditingDoc(null);
                                setFormData({
                                  ...initialFormState,
                                  vehicle: v.id,
                                  document_type: docType
                                });
                                setShowDocModal(true);
                              }}
                              style={{ 
                                marginTop: '6px',
                                background: 'transparent',
                                border: '1px dashed var(--accent-primary)',
                                color: 'var(--accent-primary)',
                                fontSize: '0.72rem',
                                padding: '3px 8px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                width: '100%'
                              }}
                            >
                              + Upload
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* VIEW MODE 2: ALL DOCUMENTS TABLE (FOR DETAILED AUDIT / SEARCH) */}
      {viewMode === 'documents' && (
        <div className="md3-card" style={{ overflow: 'hidden', padding: 0 }}>
          {filteredDocs.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <FileCheck size={36} color="var(--text-dim)" style={{ margin: '0 auto 12px auto' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>No Certificates Found</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                Try adjusting your filter or search query.
              </p>
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Vehicle License Plate</th>
                  <th>Document Type</th>
                  <th>Certificate / Policy #</th>
                  <th>Issue & Expiry Dates</th>
                  <th>Road Legal Status</th>
                  <th>Issuer Authority</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc) => {
                  const info = getDocTypeInfo(doc.document_type);
                  return (
                    <tr key={doc.id}>
                      <td>
                        <strong className="font-mono" style={{ color: 'var(--text-main)', fontSize: '0.92rem' }}>
                          {doc.vehicle_registration}
                        </strong>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          {doc.vehicle_make} {doc.vehicle_model}
                        </p>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          {info.icon} {info.label}
                        </span>
                      </td>

                      <td>
                        <strong className="font-mono" style={{ color: 'var(--accent-primary)', fontSize: '0.88rem' }}>
                          {doc.document_number}
                        </strong>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>
                          <span>Expires: <strong>{new Date(doc.expiry_date).toLocaleDateString()}</strong></span>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                          Issued: {new Date(doc.issue_date).toLocaleDateString()}
                        </span>
                      </td>

                      <td>
                        {renderStatusBadge(doc.computed_status, doc.days_remaining)}
                      </td>

                      <td>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {doc.issuer_authority || 'RTO Transport Dept'}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleOpenEditModal(doc)}
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: '14px' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id, doc.document_number)}
                            style={{ 
                              background: 'transparent', 
                              border: 'none', 
                              cursor: 'pointer', 
                              color: 'var(--color-danger)', 
                              padding: '6px' 
                            }}
                            title="Delete certificate"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* RENEW / ADD DOCUMENT MODAL */}
      {showDocModal && createPortal(
        <div className="portal-modal-overlay" onClick={() => setShowDocModal(false)}>
          <div 
            className="md3-card portal-modal-card" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '600px', padding: '32px', borderRadius: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'var(--accent-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileCheck size={22} color="#0b57d0" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {editingDoc ? 'Update Vehicle Paper' : 'Add / Renew Car Paper'}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    Record verified insurance policy, PUC certificate, fitness or permit.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDocModal(false)}
                className="btn-secondary"
                style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Select Fleet Car */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  1. Which Fleet Car? *
                </label>
                <select
                  className="select-field"
                  value={formData.vehicle}
                  onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  required
                  style={{ borderRadius: '12px', padding: '12px' }}
                >
                  <option value="">Choose vehicle...</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.registration_number} — {v.make} {v.model} ({v.vehicle_class})
                    </option>
                  ))}
                </select>
              </div>

              {/* Document Type */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  2. Document / Certificate Type *
                </label>
                <select
                  className="select-field"
                  value={formData.document_type}
                  onChange={(e) => setFormData({ ...formData, document_type: e.target.value })}
                  required
                  style={{ borderRadius: '12px', padding: '12px' }}
                >
                  <option value="INSURANCE">🛡️ Commercial Vehicle Insurance</option>
                  <option value="PUC">💨 Pollution Under Control (PUC)</option>
                  <option value="FITNESS">🔧 RTO Fitness Certificate</option>
                  <option value="RC_BOOK">📋 RC Book (Registration Certificate)</option>
                  <option value="PERMIT">📄 Commercial / Tourist Taxi Permit</option>
                  <option value="TAX_REC">🧾 Road Tax Receipt</option>
                </select>
              </div>

              {/* Certificate Number & Issuing Authority */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Certificate / Policy Number *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. POL-99214488"
                    value={formData.document_number}
                    onChange={(e) => setFormData({ ...formData, document_number: e.target.value })}
                    required
                    style={{ borderRadius: '12px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Issuer / Agency
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. ICICI Lombard / RTO"
                    value={formData.issuer_authority}
                    onChange={(e) => setFormData({ ...formData, issuer_authority: e.target.value })}
                    style={{ borderRadius: '12px' }}
                  />
                </div>
              </div>

              {/* Issue & Expiry Dates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.issue_date}
                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                    required
                    style={{ borderRadius: '12px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    required
                    style={{ borderRadius: '12px' }}
                  />
                </div>
              </div>

              {/* Quick Date Helpers */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>Quick Expiry:</span>
                <button
                  type="button"
                  onClick={() => setQuickExpiry(6)}
                  className="btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.74rem', borderRadius: '12px' }}
                >
                  +6 Months (PUC)
                </button>
                <button
                  type="button"
                  onClick={() => setQuickExpiry(12)}
                  className="btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.74rem', borderRadius: '12px' }}
                >
                  +1 Year (Insurance/Fitness)
                </button>
                <button
                  type="button"
                  onClick={() => setQuickExpiry(60)}
                  className="btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.74rem', borderRadius: '12px' }}
                >
                  +5 Years (Permit/RC)
                </button>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Notes / Coverage Details (Optional)
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Comprehensive commercial policy with zero dep + passenger cover"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  style={{ borderRadius: '12px' }}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  className="btn-secondary"
                  style={{ borderRadius: '24px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ borderRadius: '24px', padding: '10px 24px' }}
                >
                  {submitting ? 'Saving...' : editingDoc ? 'Update Paper' : 'Save Paper to Vault'}
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

export default ComplianceVault;
