import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import api from '../services/api';
import { 
  FileCheck, Shield, AlertTriangle, AlertCircle, CheckCircle2, Clock, 
  Search, Filter, Plus, Calendar, Car, FileText, ChevronRight, X, 
  Trash2, RefreshCw, Eye, LayoutGrid, Table, DownloadCloud, Sparkles
} from 'lucide-react';

const ComplianceVault = () => {
  const [documents, setDocuments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [summary, setSummary] = useState({ total_documents: 0, valid: 0, expiring_soon: 0, expired: 0 });
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

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

  const handleOpenAddModal = () => {
    setEditingDoc(null);
    setFormData({
      ...initialFormState,
      vehicle: vehicles[0]?.id || ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vehicle || !formData.document_number) {
      alert('Please select a vehicle and specify document number.');
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

  const getStatusChip = (status, days) => {
    switch (status) {
      case 'EXPIRED':
        return (
          <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', fontSize: '0.78rem' }}>
            <AlertCircle size={13} />
            <span>Expired ({Math.abs(days)}d ago)</span>
          </span>
        );
      case 'EXPIRING_SOON':
        return (
          <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', fontSize: '0.78rem' }}>
            <Clock size={13} />
            <span>Expiring Soon ({days}d left)</span>
          </span>
        );
      case 'VALID':
      default:
        return (
          <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', fontSize: '0.78rem' }}>
            <CheckCircle2 size={13} />
            <span>Valid ({days}d left)</span>
          </span>
        );
    }
  };

  const getDocTypeIcon = (type) => {
    switch (type) {
      case 'INSURANCE': return '🛡️';
      case 'RC_BOOK': return '📄';
      case 'PUC': return '🌱';
      case 'FITNESS': return '🔧';
      case 'PERMIT': return '✈️';
      case 'TAX_REC': return '💳';
      default: return '📜';
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
          <span className="badge badge-info" style={{ marginBottom: '10px' }}>Phase 2 Compliance Hub</span>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Fleet Legal & Compliance Vault
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '6px', maxWidth: '680px' }}>
            Centralized document vault for Commercial Insurance, RC Books, PUCs, Fitness Certificates, and Tourist Permits with automated expiration monitoring.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="btn-primary"
          style={{ padding: '12px 24px', borderRadius: '28px', fontSize: '0.92rem', gap: '8px' }}
        >
          <Plus size={18} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Critical Expiration Alert Callout (If Any Documents Expired or Expiring Soon) */}
      {(summary.expired > 0 || summary.expiring_soon > 0) && (
        <div style={{
          padding: '16px 20px',
          background: summary.expired > 0 ? 'var(--color-danger-bg)' : 'var(--color-warning-bg)',
          border: `1px solid ${summary.expired > 0 ? 'var(--color-danger-border)' : 'var(--color-warning-border)'}`,
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={22} color={summary.expired > 0 ? 'var(--color-danger)' : 'var(--color-warning)'} />
            <div>
              <strong style={{ color: summary.expired > 0 ? 'var(--color-danger)' : 'var(--color-warning)', fontSize: '0.95rem' }}>
                {summary.expired > 0 ? `${summary.expired} Vehicle Document(s) Expired!` : `${summary.expiring_soon} Document(s) Expiring within 30 Days`}
              </strong>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginTop: '2px' }}>
                {summary.expired > 0 
                  ? 'Expired certificates violate commercial transport regulations and void active trip dispatches. Please renew immediately.'
                  : 'Renew certificates before the 30-day grace period to prevent operational vehicle grounding.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {summary.expired > 0 && (
              <button
                onClick={() => setStatusFilter('EXPIRED')}
                className="btn-danger"
                style={{ fontSize: '0.78rem', padding: '6px 14px', borderRadius: '16px' }}
              >
                View Expired ({summary.expired})
              </button>
            )}
            {summary.expiring_soon > 0 && (
              <button
                onClick={() => setStatusFilter('EXPIRING_SOON')}
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '6px 14px', borderRadius: '16px', borderColor: 'var(--color-warning-border)', color: 'var(--color-warning)' }}
              >
                View Expiring Soon ({summary.expiring_soon})
              </button>
            )}
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="md3-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>TOTAL VAULTED</p>
              <h3 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>{summary.total_documents}</h3>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--accent-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileCheck size={24} color="#0b57d0" />
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>Verified compliance filings</span>
        </div>

        <div className="md3-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-success)', fontWeight: 600, textTransform: 'uppercase' }}>FULLY COMPLIANT</p>
              <h3 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '4px' }}>{summary.valid}</h3>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--color-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={24} color="var(--color-success)" />
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>Active validity &gt; 30 days</span>
        </div>

        <div className="md3-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-warning)', fontWeight: 600, textTransform: 'uppercase' }}>EXPIRING SOON</p>
              <h3 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--color-warning)', marginTop: '4px' }}>{summary.expiring_soon}</h3>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--color-warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={24} color="var(--color-warning)" />
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>Renewal window (&lt; 30 days)</span>
        </div>

        <div className="md3-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-danger)', fontWeight: 600, textTransform: 'uppercase' }}>EXPIRED ALERTS</p>
              <h3 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--color-danger)', marginTop: '4px' }}>{summary.expired}</h3>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--color-danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={24} color="var(--color-danger)" />
            </div>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>Immediate renewal required</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="md3-card" style={{ padding: '18px 24px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '44px', borderRadius: '24px', background: 'var(--md-surface-container)' }}
            placeholder="Search by license plate, document #, make, model, authority..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ width: '220px' }}>
          <select
            className="select-field"
            value={docTypeFilter}
            onChange={(e) => setDocTypeFilter(e.target.value)}
            style={{ borderRadius: '24px' }}
          >
            <option value="">All Document Types</option>
            <option value="INSURANCE">Commercial Insurance</option>
            <option value="RC_BOOK">RC Book (Registration)</option>
            <option value="PUC">Pollution (PUC)</option>
            <option value="FITNESS">Fitness Certificate</option>
            <option value="PERMIT">Tourist / Commercial Permit</option>
            <option value="TAX_REC">Road Tax Receipt</option>
          </select>
        </div>

        <div style={{ width: '180px' }}>
          <select
            className="select-field"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ borderRadius: '24px' }}
          >
            <option value="">All Statuses</option>
            <option value="VALID">Valid</option>
            <option value="EXPIRING_SOON">Expiring Soon</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', background: 'var(--md-surface-container)', padding: '4px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setViewMode('table')}
            style={{
              padding: '6px 14px',
              borderRadius: '16px',
              border: 'none',
              background: viewMode === 'table' ? '#ffffff' : 'transparent',
              color: viewMode === 'table' ? 'var(--text-main)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              boxShadow: viewMode === 'table' ? 'var(--elevation-1)' : 'none'
            }}
          >
            <Table size={15} />
            <span>Table</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '6px 14px',
              borderRadius: '16px',
              border: 'none',
              background: viewMode === 'grid' ? '#ffffff' : 'transparent',
              color: viewMode === 'grid' ? 'var(--text-main)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              boxShadow: viewMode === 'grid' ? 'var(--elevation-1)' : 'none'
            }}
          >
            <LayoutGrid size={15} />
            <span>Cards</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="md3-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw size={24} className="animate-pulse" style={{ margin: '0 auto 12px auto' }} />
          Loading compliance vault documents...
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="md3-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <FileCheck size={36} color="var(--text-dim)" style={{ margin: '0 auto 12px auto' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>No Compliance Documents Found</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            No documents matched your search filter or no certificates have been vaulted yet.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="btn-primary"
            style={{ marginTop: '18px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', borderRadius: '24px' }}
          >
            <Plus size={16} />
            <span>Upload First Document</span>
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="md3-card" style={{ overflow: 'hidden', padding: 0 }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Vehicle & Model</th>
                <th>Document Type</th>
                <th>Certificate #</th>
                <th>Issuing Authority</th>
                <th>Issue Date</th>
                <th>Expiry Date</th>
                <th>Compliance Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Car size={18} color="#0b57d0" />
                      </div>
                      <div>
                        <strong className="font-mono" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem' }}>
                          {doc.vehicle_registration || `Vehicle #${doc.vehicle}`}
                        </strong>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          {doc.vehicle_make} {doc.vehicle_model}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.1rem' }}>{getDocTypeIcon(doc.document_type)}</span>
                      <strong style={{ color: 'var(--text-main)', fontSize: '0.88rem' }}>
                        {doc.document_type_display || doc.document_type}
                      </strong>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono" style={{ color: 'var(--text-main)', fontSize: '0.88rem' }}>
                      {doc.document_number}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                      {doc.issuer_authority || 'RTO Authority'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{doc.issue_date}</span>
                  </td>
                  <td>
                    <span className="font-mono" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {doc.expiry_date}
                    </span>
                  </td>
                  <td>
                    {getStatusChip(doc.computed_status, doc.days_remaining)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleOpenEditModal(doc)}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: '14px' }}
                      >
                        Edit / Renew
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id, doc.document_number)}
                        style={{
                          background: 'transparent',
                          border: '1px solid rgba(220, 38, 38, 0.2)',
                          color: 'var(--color-danger)',
                          borderRadius: '14px',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Delete Certificate"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid Cards View */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="md3-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--accent-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                    {getDocTypeIcon(doc.document_type)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {doc.document_type_display || doc.document_type}
                    </h4>
                    <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      No: {doc.document_number}
                    </span>
                  </div>
                </div>

                {getStatusChip(doc.computed_status, doc.days_remaining)}
              </div>

              {/* Vehicle Bar */}
              <div style={{ padding: '10px 14px', background: 'var(--md-surface-container-low)', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Car size={16} color="var(--accent-primary)" />
                  <strong className="font-mono" style={{ color: 'var(--accent-primary)', fontSize: '0.88rem' }}>
                    {doc.vehicle_registration || `Vehicle #${doc.vehicle}`}
                  </strong>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {doc.vehicle_make} {doc.vehicle_model}
                </span>
              </div>

              {/* Dates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>ISSUE DATE</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{doc.issue_date}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>EXPIRY DATE</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{doc.expiry_date}</span>
                </div>
              </div>

              {doc.issuer_authority && (
                <p style={{ fontSize: '0.76rem', color: 'var(--text-dim)', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '2px' }}>
                  Authority: <strong style={{ color: 'var(--text-main)' }}>{doc.issuer_authority}</strong>
                </p>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => handleOpenEditModal(doc)}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '8px' }}
                >
                  Renew / Edit
                </button>
                <button
                  onClick={() => handleDelete(doc.id, doc.document_number)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(220, 38, 38, 0.2)',
                    color: 'var(--color-danger)',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    cursor: 'pointer'
                  }}
                  title="Delete Document"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD / RENEW DOCUMENT MODAL (Material Design 3 Dialog) */}
      {showDocModal && createPortal(
        <div className="portal-modal-overlay" onClick={() => setShowDocModal(false)}>
          <div 
            className="md3-card portal-modal-card" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              maxWidth: '640px',
              padding: '32px',
              borderRadius: '28px'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'var(--accent-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileCheck size={22} color="#0b57d0" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                    {editingDoc ? 'Renew / Update Document' : 'Upload Legal Certificate'}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    Store verified registration, commercial insurance, or permit documents in the vault.
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

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Select Fleet Vehicle */}
              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Assign to Fleet Vehicle *
                </label>
                <select
                  className="select-field"
                  value={formData.vehicle}
                  onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  required
                  style={{ width: '100%', borderRadius: '12px' }}
                >
                  <option value="">Select a Fleet Vehicle...</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.registration_number} — {v.make} {v.model} ({v.vehicle_class})
                    </option>
                  ))}
                </select>
              </div>

              {/* Document Type & Number */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    Document Type *
                  </label>
                  <select
                    className="select-field"
                    value={formData.document_type}
                    onChange={(e) => setFormData({ ...formData, document_type: e.target.value })}
                    required
                    style={{ width: '100%', borderRadius: '12px' }}
                  >
                    <option value="INSURANCE">Commercial Insurance</option>
                    <option value="RC_BOOK">RC Book (Registration)</option>
                    <option value="PUC">Pollution (PUC)</option>
                    <option value="FITNESS">Fitness Certificate</option>
                    <option value="PERMIT">Tourist / Commercial Permit</option>
                    <option value="TAX_REC">Road Tax Receipt</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    Certificate / Document # *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. POL-992819, RC-GA-01"
                    value={formData.document_number}
                    onChange={(e) => setFormData({ ...formData, document_number: e.target.value })}
                    required
                    style={{ borderRadius: '12px' }}
                  />
                </div>
              </div>

              {/* Issue & Expiry Dates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
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
                  <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
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

              {/* Issuer Authority */}
              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Issuing Authority / Insurance Underwriter
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. RTO Panaji, HDFC ERGO General Insurance, Digit"
                  value={formData.issuer_authority}
                  onChange={(e) => setFormData({ ...formData, issuer_authority: e.target.value })}
                  style={{ borderRadius: '12px' }}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Notes & Vault Endorsements
                </label>
                <textarea
                  className="input-field"
                  rows={2}
                  placeholder="Policy endorsement notes, cashless network claims contact, or renewal reminders..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  style={{ borderRadius: '12px', resize: 'vertical' }}
                />
              </div>

              {/* Footer Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  className="btn-secondary"
                  style={{ borderRadius: '24px', padding: '10px 22px' }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ borderRadius: '24px', padding: '10px 28px', fontWeight: 700 }}
                >
                  {submitting ? 'Saving to Vault...' : editingDoc ? 'Update Certificate' : 'Save Certificate to Vault'}
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
