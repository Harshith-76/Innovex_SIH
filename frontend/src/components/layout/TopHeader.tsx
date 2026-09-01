import React, { useState } from 'react';
import {
  Search,
  Bell,
  MapPin,
  ChevronRight,
  Shield,
  Building2,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { useApp, PageId, JurisdictionLevel } from '../../context/AppContext';
import { NotificationDrawer } from '../common/NotificationDrawer';
import { ROLE_LABELS } from '../../auth/rbac';

const PAGE_NAMES: Record<PageId, string> = {
  'district-dashboard': 'District Monitoring',
  'district-monitoring': 'District Monitoring',
  projects: 'Land Acquisition Projects',
  'project-detail': 'Project Workspace',
  'project-route': 'Project Route & GIS Alignment',
  'gis-parcels': 'GIS & Land Parcels',
  workflow: 'Acquisition Window',
  compensation: 'Compensation Management',
  'affected-families': 'Landowner Directory & Compensation',
  documents: 'Documents & Records Repository',
  alerts: 'Operational Alerts & Notifications',
  analytics: 'District Monitoring',
  administration: 'Administration & Access Control',
  'access-denied': 'Access Denied'
};

export const TopHeader: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    activeProject,
    jurisdictionLevel,
    setJurisdictionLevel,
    selectedJurisdictionName,
    setSelectedJurisdictionName,
    searchQuery,
    setSearchQuery,
    unreadAlertsCount,
    currentRole,
    currentUser,
    logout,
    canAccess
  } = useApp();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleJurisdictionChange = (level: JurisdictionLevel, name: string) => {
    setJurisdictionLevel(level);
    setSelectedJurisdictionName(name);
  };

  return (
    <header className="app-header">
      {/* Breadcrumbs & Title */}
      <div className="header-left">
        <div className="breadcrumbs">
          <span className="breadcrumb-item">
            LAMS Portal
          </span>
          <ChevronRight size={12} className="breadcrumb-separator" />
          <span
            className="breadcrumb-item"
            onClick={() => {
              if (currentPage === 'project-detail') setCurrentPage('projects');
            }}
          >
            {PAGE_NAMES[currentPage]}
          </span>
          {currentPage === 'project-detail' && activeProject && (
            <>
              <ChevronRight size={12} className="breadcrumb-separator" />
              <span className="breadcrumb-current">{activeProject.code}</span>
            </>
          )}
        </div>
      </div>

      {/* Global Search */}
      <div className="header-center">
        <div className="header-search-box">
          <Search size={14} color="var(--gov-slate-400)" />
          <input
            type="text"
            className="header-search-input"
            placeholder="Search Survey No., Project Code, Khata No., Village, Beneficiary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '11px',
                color: 'var(--gov-slate-400)'
              }}
              onClick={() => setSearchQuery('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Jurisdiction & User Status */}
      <div className="header-right">
        {/* Jurisdiction Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Building2 size={14} color="var(--gov-blue-700)" />
          <select
            className="gov-select"
            style={{
              padding: '3px 8px',
              fontSize: '11.5px',
              fontWeight: 600,
              color: 'var(--gov-navy-900)',
              backgroundColor: 'var(--gov-blue-50)',
              borderColor: 'var(--gov-blue-100)',
              cursor: 'pointer'
            }}
            value={`${jurisdictionLevel}:${selectedJurisdictionName}`}
            onChange={(e) => {
              const [level, name] = e.target.value.split(':') as [JurisdictionLevel, string];
              handleJurisdictionChange(level, name);
            }}
          >
            <option value="State:Karnataka">State: Karnataka</option>
            <option value="District:Bengaluru Rural">District: Bengaluru Rural</option>
            <option value="District:Vijayapura">District: Vijayapura</option>
            <option value="District:Tumakuru">District: Tumakuru</option>
            <option value="National:All India">National: All India</option>
          </select>
        </div>

        {/* Official Badge */}
        <div className="jurisdiction-tag" title="Authenticated Indian Gov Session">
          <Shield size={13} />
          <span>NIC-Bhoomi Gateway</span>
        </div>

        {/* Notifications Icon Button */}
        {canAccess('alerts') && <div style={{ position: 'relative' }}>
          <button
            className="header-icon-btn"
            title="Notifications & Operational Alerts"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          >
            <Bell size={16} />
            {unreadAlertsCount > 0 && <span className="badge-dot" />}
          </button>
          <NotificationDrawer
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
        </div>}

        {/* User shortcut badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            paddingLeft: '6px',
            borderLeft: '1px solid var(--gov-slate-200)',
            cursor: 'pointer'
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: 'var(--gov-navy-800)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 700
            }}
          >
            {currentUser?.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gov-navy-900)' }}>
              {currentUser?.name}
            </div>
            <div style={{ fontSize: '9.5px', color: 'var(--gov-slate-500)' }}>
              {ROLE_LABELS[currentRole]}
            </div>
          </div>
        </div>
        <button className="header-icon-btn" title="Sign out" onClick={() => void logout()}>
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};
