import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { RiskBadge } from '../components/common/RiskBadge';
import { ProjectCreationWizard } from '../components/projects/ProjectCreationWizard';
import {
  Plus,
  Search,
  ChevronRight,
  Download,
  Filter,
  Route,
  Building2,
  FolderKanban
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { projects, openProjectDetail, openProjectRoute, searchQuery: globalSearch, currentRole } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterDistrict, setFilterDistrict] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterStage, setFilterStage] = useState('ALL');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  const searchKeyword = (localSearch || globalSearch).toLowerCase().trim();

  const filteredProjects = projects.filter((proj) => {
    const matchesSearch =
      !searchKeyword ||
      proj.name.toLowerCase().includes(searchKeyword) ||
      proj.code.toLowerCase().includes(searchKeyword) ||
      proj.district.toLowerCase().includes(searchKeyword) ||
      (proj.implementingAgency || '').toLowerCase().includes(searchKeyword);

    const matchesType = filterType === 'ALL' || (proj.projectType || '').includes(filterType);
    const matchesDistrict = filterDistrict === 'ALL' || proj.district === filterDistrict;
    const matchesStatus = filterStatus === 'ALL' || proj.status === filterStatus;
    const matchesStage = filterStage === 'ALL' || proj.currentStage === filterStage;

    return matchesSearch && matchesType && matchesDistrict && matchesStatus && matchesStage;
  });

  return (
    <div className="page-body">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title" style={{ letterSpacing: '0.02em' }}>PROJECTS DIRECTORY</h1>
          <p className="page-subtitle">
            Manage land acquisition projects, project scope, route alignment and acquisition progress.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            className="gov-btn gov-btn-secondary"
            onClick={() => alert('Exporting project directory in NIC Excel format...')}
          >
            <Download size={13} /> Export CSV
          </button>
          {currentRole === 'Land Acquisition Officer' ? (
            <div style={{ fontSize: '11px', color: '#b45309', backgroundColor: '#fef3c7', padding: '4px 10px', borderRadius: '4px', border: '1px solid #fcd34d' }} title="Project proposal creation is an Implementing Agency function. Switch Dev Role in top header to Agency mode to create proposals.">
              Agency Creation Restricted (Officer View)
            </div>
          ) : (
            <button
              className="gov-btn gov-btn-primary"
              onClick={() => setIsNewProjectModalOpen(true)}
            >
              <Plus size={14} /> REGISTER NEW PROJECT
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="gov-card" style={{ marginBottom: '16px', padding: '12px 16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '240px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--gov-slate-400)' }} />
            <input
              type="text"
              className="gov-input"
              style={{ width: '100%', paddingLeft: '32px' }}
              placeholder="Search by project code, title, district, or PIA agency..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>

          {/* Filter Selects */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-600)' }}>
              <Filter size={12} /> FILTERS:
            </div>

            <select
              className="gov-select"
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              style={{ minWidth: '140px' }}
            >
              <option value="ALL">All Districts</option>
              <option value="Bengaluru Rural">Bengaluru Rural</option>
              <option value="Bengaluru Urban">Bengaluru Urban</option>
              <option value="Ramanagara">Ramanagara</option>
              <option value="Vijayapura">Vijayapura</option>
              <option value="Tumakuru">Tumakuru</option>
              <option value="Hassan">Hassan</option>
              <option value="Ballari">Ballari</option>
              <option value="Dakshina Kannada">Dakshina Kannada</option>
            </select>

            <select
              className="gov-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ minWidth: '140px' }}
            >
              <option value="ALL">All Categories</option>
              <option value="Highway">Highway Infrastructure</option>
              <option value="Rail">Rail Corridor</option>
              <option value="Irrigation">Irrigation Canal</option>
              <option value="Industrial">Industrial Township</option>
            </select>

            <select
              className="gov-select"
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              style={{ minWidth: '130px' }}
            >
              <option value="ALL">All Workflow Stages</option>
              <option value="Proposal">Proposal / SLAO</option>
              <option value="Verification">JMS Verification</option>
              <option value="Notification">Sec 11 Notification</option>
              <option value="Award">Sec 23 Award</option>
              <option value="Possession">Possession</option>
            </select>

            <select
              className="gov-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ minWidth: '120px' }}
            >
              <option value="ALL">All Status</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Delayed">Delayed</option>
            </select>

            {(localSearch || filterDistrict !== 'ALL' || filterType !== 'ALL' || filterStage !== 'ALL' || filterStatus !== 'ALL') && (
              <button
                className="gov-btn gov-btn-secondary gov-btn-sm"
                onClick={() => {
                  setLocalSearch('');
                  setFilterDistrict('ALL');
                  setFilterType('ALL');
                  setFilterStage('ALL');
                  setFilterStatus('ALL');
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Projects Data Table Card */}
      <div className="gov-card" style={{ overflow: 'hidden' }}>
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'var(--gov-slate-100)',
            borderBottom: '1px solid var(--gov-slate-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderKanban size={16} color="var(--gov-navy-800)" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gov-navy-900)', letterSpacing: '0.03em' }}>
              REGISTERED LAND ACQUISITION PROJECTS ({filteredProjects.length})
            </span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>
            Showing {filteredProjects.length} of {projects.length} total active projects
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th style={{ width: '120px' }}>Project Code</th>
                <th>Project Title & Scope</th>
                <th>District / Location</th>
                <th style={{ width: '120px' }}>Required Land</th>
                <th style={{ width: '110px' }}>Progress</th>
                <th style={{ width: '130px' }}>Current Stage</th>
                <th style={{ width: '100px' }}>Status</th>
                <th style={{ width: '100px' }}>Risk Level</th>
                <th style={{ width: '160px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: 'var(--gov-slate-500)' }}>
                    No land acquisition projects found matching the specified query criteria.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((proj) => (
                  <tr key={proj.id} className="gov-table-row-interactive">
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '11px', color: 'var(--gov-navy-900)' }}>
                      {proj.code}
                    </td>
                    <td>
                      <div
                        style={{ fontWeight: 700, fontSize: '13px', color: 'var(--gov-navy-950)', cursor: 'pointer' }}
                        onClick={() => openProjectDetail(proj.id)}
                      >
                        {proj.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span><Building2 size={11} style={{ display: 'inline', marginRight: '3px' }} />{proj.implementingAgency || proj.agencyName}</span>
                        <span>·</span>
                        <span>{proj.projectType}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '12px' }}>{proj.district}</div>
                      <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>
                        {proj.state || 'Karnataka'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '12px' }}>{proj.landRequiredAcres} Acres</div>
                      <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>
                        Acquired: {proj.landAcquiredAcres} Acres
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--gov-slate-200)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${proj.progressPercentage}%`,
                              backgroundColor: proj.progressPercentage >= 80 ? 'var(--gov-green-600)' : proj.progressPercentage >= 40 ? 'var(--gov-gold-500)' : 'var(--gov-navy-700)'
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 700 }}>{proj.progressPercentage}%</span>
                      </div>
                    </td>
                    <td>
                      <span className="gov-badge gov-badge-info" style={{ fontSize: '10px' }}>
                        {proj.currentStage}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={proj.status} />
                    </td>
                    <td>
                      <RiskBadge level={proj.riskLevel} score={proj.riskScore} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          className="gov-btn gov-btn-primary gov-btn-sm"
                          onClick={() => openProjectDetail(proj.id)}
                          title="Open Project Detail Dashboard"
                        >
                          VIEW PROJECT
                        </button>
                        <button
                          className="gov-btn gov-btn-secondary gov-btn-sm"
                          onClick={() => openProjectRoute(proj.id)}
                          title="View GIS Route Alignment"
                        >
                          <Route size={12} /> Route
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Database-Driven Map-First Project Creation Wizard */}
      <ProjectCreationWizard
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
    </div>
  );
};

export default ProjectsPage;
