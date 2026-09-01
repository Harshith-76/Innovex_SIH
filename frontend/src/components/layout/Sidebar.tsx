import React from 'react';
import { FolderKanban, MapPin, GitBranch, Users, FileText, BellRing, BarChart3, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp, type PageId } from '../../context/AppContext';
import { ROLE_LABELS } from '../../auth/rbac';

interface NavMenuItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage, unreadAlertsCount, currentRole, currentUser, canAccess } = useApp();
  const allNavItems: NavMenuItem[] = [
    { id: 'workflow', label: 'Acquisition Window', icon: <GitBranch size={17} /> },
    { id: 'projects', label: 'Projects Directory', icon: <FolderKanban size={17} /> },
    { id: 'gis-parcels', label: 'GIS & Land Parcels', icon: <MapPin size={17} /> },
    { id: 'compensation', label: 'Approved Projects', icon: <CheckCircle2 size={17} /> },
    { id: 'affected-families', label: 'Landowner', icon: <Users size={17} /> },
    { id: 'documents', label: 'Documents', icon: <FileText size={17} /> },
    { id: 'alerts', label: 'Alerts', icon: <BellRing size={17} />, badge: unreadAlertsCount || undefined },
    { id: 'district-monitoring', label: 'District Monitoring', icon: <BarChart3 size={17} /> },
    { id: 'administration', label: 'Administration', icon: <ShieldCheck size={17} /> }
  ];
  const navItems = allNavItems.filter((item) => canAccess(item.id));
  const initials = currentUser?.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'LU';

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-emblem">🏛️</span>
        <div style={{ flex: 1 }}>
          <div className="sidebar-brand-title">Land Acquisition<br />Management System</div>
          <div className="sidebar-brand-sub">SIH 2026 · 26016</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section-title">{currentRole === 'user' ? 'CITIZEN ACCESS' : 'OPERATIONS PORTAL'}</div>
        {navItems.map((item) => {
          const isActive = currentPage === item.id ||
            (item.id === 'projects' && (currentPage === 'project-detail' || currentPage === 'project-route')) ||
            (item.id === 'district-monitoring' && (currentPage === 'analytics' || currentPage === 'district-dashboard'));
          return (
            <button
              type="button"
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              {item.icon}
              <span className="nav-item-label">{item.label}</span>
              {item.badge !== undefined && <span className="nav-item-badge">{item.badge}</span>}
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <div className="user-avatar">{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="user-info-name">{currentUser?.name}</div>
          <div className="user-info-role">{ROLE_LABELS[currentRole]}</div>
        </div>
      </div>
    </aside>
  );
};
