import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  MapPin,
  GitBranch,
  IndianRupee,
  Users,
  FileText,
  BellRing,
  BarChart3,
  ShieldCheck
} from 'lucide-react';
import { useApp, PageId } from '../../context/AppContext';

interface NavMenuItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage, unreadAlertsCount, currentRole } = useApp();

  const navItems: NavMenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={17} /> },
    { id: 'workflow', label: 'Acquisition Window', icon: <GitBranch size={17} /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban size={17} /> },
    { id: 'gis-parcels', label: 'GIS & Land Parcels', icon: <MapPin size={17} /> },
    { id: 'compensation', label: 'Compensation', icon: <IndianRupee size={17} /> },
    { id: 'affected-families', label: 'Affected Families & R&R', icon: <Users size={17} /> },
    { id: 'documents', label: 'Documents', icon: <FileText size={17} /> },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <BellRing size={17} />,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined
    },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={17} /> },
    { id: 'administration', label: 'Administration', icon: <ShieldCheck size={17} /> }
  ];

  return (
    <aside className="app-sidebar">
      {/* Header / Brand */}
      <div className="sidebar-brand">
        <span className="sidebar-emblem">🏛️</span>
        <div style={{ flex: 1 }}>
          <div className="sidebar-brand-title">
            Land Acquisition
            <br />
            Management System
          </div>
          <div className="sidebar-brand-sub">SIH 2026 · 26016</div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">
          {currentRole === 'Land Acquisition Officer' ? 'OFFICER PORTAL' : 'OPERATIONS PORTAL'}
        </div>
        {navItems.map((item) => {
          const isActive =
            currentPage === item.id ||
            (item.id === 'projects' && (currentPage === 'project-detail' || currentPage === 'project-route'));
          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge !== undefined && (
                <span className="nav-item-badge">{item.badge}</span>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div
        className="sidebar-footer"
        style={{ cursor: 'pointer' }}
        onClick={() => setCurrentPage('administration')}
        title="View Officer Profile & Permissions"
      >
        <div className="user-avatar">
          {currentRole === 'Land Acquisition Officer' ? 'RH' : currentRole === 'Project Implementing Agency' ? 'IA' : 'CM'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="user-info-name">
            {currentRole === 'Land Acquisition Officer' ? 'Shri R. K. Hegde, KAS' : currentRole === 'Project Implementing Agency' ? 'KSHIP PIU Director' : 'Ministry Administrator'}
          </div>
          <div className="user-info-role">
            {currentRole}
          </div>
        </div>
      </div>
    </aside>
  );
};
