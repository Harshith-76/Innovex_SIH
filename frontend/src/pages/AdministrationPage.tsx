import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdminRoleConfig, AdminUser, UserRole } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/layout/Modal';
import {
  ShieldCheck,
  Users,
  Key,
  Building,
  CheckCircle2,
  XCircle,
  Clock,
  UserPlus,
  Search,
  Lock,
  Server,
  Database
} from 'lucide-react';

export const AdministrationPage: React.FC = () => {
  const { adminRoles, adminUsers, t } = useApp();
  const [activeTab, setActiveTab] = useState<'roles' | 'users' | 'system'>('roles');
  const [selectedRole, setSelectedRole] = useState<AdminRoleConfig | null>(null);
  const [userSearch, setUserSearch] = useState('');

  const filteredUsers = adminUsers.filter((u) =>
    !userSearch ||
    u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.designation.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">{t('admin.title', 'ADMINISTRATION & ACCESS CONTROL')}</h1>
          <p className="page-subtitle">
            {t('admin.subtitle', 'Manage user roles, system permissions matrix, district assignments, and security audit logs.')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="gov-btn gov-btn-secondary"
            onClick={() => alert('Synchronizing user access credentials with National e-Pramaan Single Sign-On...')}
          >
            <Lock size={13} /> Sync e-Pramaan SSO
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="gov-tabs">
        <button
          className={`gov-tab-btn ${activeTab === 'roles' ? 'active' : ''}`}
          onClick={() => setActiveTab('roles')}
        >
          Stakeholder Roles & Permission Matrix ({adminRoles.length})
        </button>
        <button
          className={`gov-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Active Administrative Officers ({adminUsers.length})
        </button>
        <button
          className={`gov-tab-btn ${activeTab === 'system' ? 'active' : ''}`}
          onClick={() => setActiveTab('system')}
        >
          System Integrations & Gateways
        </button>
      </div>

      {/* TAB 1: ROLES & PERMISSION MATRIX */}
      {activeTab === 'roles' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Role Cards Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {adminRoles.map((role) => (
              <div
                key={role.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--gov-slate-200)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer',
                  borderTop: '3px solid var(--gov-navy-900)'
                }}
                onClick={() => setSelectedRole(role)}
              >
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gov-blue-700)' }}>
                  Level: {role.jurisdictionLevel}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gov-navy-900)', marginTop: '2px' }}>
                  {role.roleTitle}
                </div>
                <p style={{ fontSize: '11px', color: 'var(--gov-slate-600)', marginTop: '6px', minHeight: '44px', lineHeight: '1.4' }}>
                  {role.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--gov-slate-200)', fontSize: '11px' }}>
                  <span style={{ color: 'var(--gov-slate-500)' }}>Active Officers:</span>
                  <span style={{ fontWeight: 700, color: 'var(--gov-navy-900)' }}>{role.activeUsersCount}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Permission Matrix Table */}
          <div className="gov-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--gov-slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--gov-navy-900)' }}>
                Granular Governance Permissions Matrix
              </div>
              <span style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>
                Conforms to MeitY Guidelines & RFCTLARR Delegation of Powers
              </span>
            </div>

            <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>Stakeholder Role</th>
                    <th>Jurisdiction</th>
                    <th style={{ textAlign: 'center' }}>View Projects</th>
                    <th style={{ textAlign: 'center' }}>Manage Projects</th>
                    <th style={{ textAlign: 'center' }}>View GIS Parcels</th>
                    <th style={{ textAlign: 'center' }}>Update Acquisition</th>
                    <th style={{ textAlign: 'center' }}>Manage Compensation</th>
                    <th style={{ textAlign: 'center' }}>Manage R&R</th>
                    <th style={{ textAlign: 'center' }}>Upload Docs</th>
                    <th style={{ textAlign: 'center' }}>View Analytics</th>
                  </tr>
                </thead>
                <tbody>
                  {adminRoles.map((role) => (
                    <tr key={role.id}>
                      <td style={{ fontWeight: 700, color: 'var(--gov-navy-900)' }}>{role.roleTitle}</td>
                      <td>{role.jurisdictionLevel}</td>
                      <td style={{ textAlign: 'center' }}>
                        {role.permissions.viewProjects ? <CheckCircle2 size={16} color="var(--gov-green-600)" /> : <XCircle size={16} color="var(--gov-slate-300)" />}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {role.permissions.manageProjects ? <CheckCircle2 size={16} color="var(--gov-green-600)" /> : <XCircle size={16} color="var(--gov-slate-300)" />}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {role.permissions.viewLandParcels ? <CheckCircle2 size={16} color="var(--gov-green-600)" /> : <XCircle size={16} color="var(--gov-slate-300)" />}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {role.permissions.updateAcquisitionStatus ? <CheckCircle2 size={16} color="var(--gov-green-600)" /> : <XCircle size={16} color="var(--gov-slate-300)" />}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {role.permissions.manageCompensation ? <CheckCircle2 size={16} color="var(--gov-green-600)" /> : <XCircle size={16} color="var(--gov-slate-300)" />}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {role.permissions.manageRR ? <CheckCircle2 size={16} color="var(--gov-green-600)" /> : <XCircle size={16} color="var(--gov-slate-300)" />}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {role.permissions.uploadDocuments ? <CheckCircle2 size={16} color="var(--gov-green-600)" /> : <XCircle size={16} color="var(--gov-slate-300)" />}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {role.permissions.viewAnalytics ? <CheckCircle2 size={16} color="var(--gov-green-600)" /> : <XCircle size={16} color="var(--gov-slate-300)" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE ADMINISTRATIVE OFFICERS */}
      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--gov-slate-200)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center'
            }}
          >
            <Search size={14} color="var(--gov-slate-400)" />
            <input
              type="text"
              className="gov-input"
              style={{ width: '100%', border: 'none' }}
              placeholder="Search officer name, designation, email, government badge ID..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </div>

          <div className="gov-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>Officer Name & Designation</th>
                    <th>Role Classification</th>
                    <th>Official Email</th>
                    <th>Assigned Jurisdiction</th>
                    <th>Parent Department</th>
                    <th>Service Badge ID</th>
                    <th>Status</th>
                    <th>Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--gov-navy-900)' }}>{u.fullName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>{u.designation}</div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 500, color: 'var(--gov-blue-700)' }}>{u.role}</span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{u.email}</td>
                      <td>{u.jurisdiction}</td>
                      <td>{u.department}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{u.badgeId}</td>
                      <td><StatusBadge status={u.status} size="sm" /></td>
                      <td style={{ fontSize: '10.5px', color: 'var(--gov-slate-500)' }}>{u.lastLogin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM INTEGRATIONS & GATEWAYS */}
      {activeTab === 'system' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <Database size={16} color="var(--gov-blue-600)" />
                <span>State Land Records (Bhoomi) Gateway</span>
              </div>
              <StatusBadge status="Verified" size="sm" />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--gov-slate-700)', lineHeight: '1.45' }}>
              Bi-directional automated synchronization with Karnataka Bhoomi RTC and mutation servers. Cadastral shapefiles and RTC ownership changes are ingested in near-real-time.
            </p>
            <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--gov-slate-500)' }}>
              Last Heartbeat: <strong>2026-08-29 16:05 IST (Latency: 42ms)</strong>
            </div>
          </div>

          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <Server size={16} color="var(--gov-green-600)" />
                <span>RBI e-Kuber & State Treasury Direct Payout</span>
              </div>
              <StatusBadge status="Verified" size="sm" />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--gov-slate-700)', lineHeight: '1.45' }}>
              Direct integration with Reserve Bank of India (RBI) e-Kuber Core Banking Solution for automated RTGS/NEFT batch payments against approved Section 3G awards.
            </p>
            <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--gov-slate-500)' }}>
              Gateway Status: <strong>Operational (NPCI Aadhaar Bridge Active)</strong>
            </div>
          </div>

          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <Lock size={16} color="var(--gov-purple-700)" />
                <span>Central Gazette e-Publishing Portal</span>
              </div>
              <StatusBadge status="Verified" size="sm" />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--gov-slate-700)', lineHeight: '1.45' }}>
              Automated ingestion and verification of Section 3A, 3D and 3G notifications published in the official Gazette of India (egazette.gov.in).
            </p>
            <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--gov-slate-500)' }}>
              Ingested Gazettes: <strong>84 Statutory Publications</strong>
            </div>
          </div>

          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <Key size={16} color="var(--gov-amber-600)" />
                <span>NIC e-Pramaan Single Sign-On (SSO)</span>
              </div>
              <StatusBadge status="Verified" size="sm" />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--gov-slate-700)', lineHeight: '1.45' }}>
              Multi-factor authentication supporting Aadhaar OTP, e-Token digital signature dongles (DSC Class 3), and official gov.in email verification for authorized officers.
            </p>
            <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--gov-slate-500)' }}>
              Authentication Protocol: <strong>SAML 2.0 / OAuth2 (TLS 1.3)</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
