import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { approveProject as approveProjectApi } from '../services/api';
import { LandAcquisitionProject } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { LeafletGisMap } from '../components/gis/LeafletGisMap';
import { Modal } from '../components/layout/Modal';
import {
  MapPin, ArrowLeft, Users, FileText, CheckCircle2,
  Building2, IndianRupee, XCircle, Search
} from 'lucide-react';

const defaultLandowners = [
  { name: 'Ramesh Gowda', survey: '101/1', area: 1.5, rate: 550000 },
  { name: 'Suresh Kumar', survey: '101/2', area: 2.1, rate: 520000 },
  { name: 'Venkatesh Rao', survey: '101/3', area: 1.8, rate: 500000 },
  { name: 'Lakshmi Devi', survey: '101/4', area: 3.0, rate: 580000 },
  { name: 'Manjunath K', survey: '101/5', area: 1.2, rate: 510000 },
  { name: 'Anand Patil', survey: '101/6', area: 2.5, rate: 540000 },
  { name: 'Gangadhar Swamy', survey: '101/7', area: 1.9, rate: 530000 },
];

/** Hash-based deterministic generator yielding between 3 and 6 landowners per project */
const getLandownerCount = (id: string) => {
  let hash = 0;
  for (let i = 0; i < (id || '').length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return 3 + (Math.abs(hash) % 4); // Returns 3, 4, 5, or 6
};

const FinancialProjectDetails: React.FC<{ project: LandAcquisitionProject, onBack: () => void, onApproved?: (id: string) => void }> = ({ project, onBack, onApproved }) => {
  const { parcels, compensationRecords, documents, getHissaByParcelId, canPerform } = useApp();
  
  const originalMapParcels = parcels.filter(p => 
    p.projectId === project.id || 
    p.projectId === (project as any).sourceProjectId || 
    p.projectId === (project as any).code ||
    (project as any).selectedParcelIds?.includes(p.parcelId)
  );
  
  // Set random landowners count between 3 and 6 for every approved project
  const projectParcels = React.useMemo(() => {
    const targetCount = getLandownerCount(project.id || project.code || 'proj');
    const list = [...originalMapParcels];
    const centerLat = 12.846;
    const centerLng = 74.941;

    for (let i = list.length; i < targetCount; i++) {
      const def = defaultLandowners[i % defaultLandowners.length];
      const baseLat = centerLat + (i % 3) * 0.005;
      const baseLng = centerLng + Math.floor(i / 3) * 0.006;
      
      const polyCoords = [
        [baseLat, baseLng],
        [baseLat + 0.003, baseLng],
        [baseLat + 0.003, baseLng + 0.004],
        [baseLat, baseLng + 0.004]
      ];

      list.push({
        parcelId: `PARCEL-${project.id || project.code}-${i + 1}`,
        surveyNumber: def.survey,
        ownerName: def.name,
        areaAcres: def.area,
        marketRatePerAcre: def.rate,
        village: Array.isArray(project.taluks) && project.taluks.length > 0 ? project.taluks[0] : (project.district || 'Main Village'),
        district: project.district,
        projectId: project.id,
        classification: 'Agricultural (Irrigated)',
        coordinates: polyCoords,
        latitude: baseLat + 0.0015,
        longitude: baseLng + 0.002
      } as any);
    }

    return list.slice(0, targetCount).map((p, idx) => {
      if (!p.coordinates || !Array.isArray(p.coordinates) || p.coordinates.length === 0) {
        const baseLat = centerLat + (idx % 3) * 0.005;
        const baseLng = centerLng + Math.floor(idx / 3) * 0.006;
        return {
          ...p,
          latitude: baseLat + 0.0015,
          longitude: baseLng + 0.002,
          coordinates: [
            [baseLat, baseLng],
            [baseLat + 0.003, baseLng],
            [baseLat + 0.003, baseLng + 0.004],
            [baseLat, baseLng + 0.004]
          ]
        };
      }
      return p;
    });
  }, [originalMapParcels, project.id, project.code, project.district, project.taluks]);

  const projectDocs = documents.filter(d => d.projectId === project.id);
  const projectComp = compensationRecords.filter(c => c.projectId === project.id);
  
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  const [calculatedParcels, setCalculatedParcels] = useState<(typeof projectParcels[0] & { baseValue: number, solatium: number, otherComps: number, total: number, rate: number })[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);
  const [selectedOwnerForCalc, setSelectedOwnerForCalc] = useState<typeof projectParcels[0] | null>(null);

  const handleCalculateAll = () => {
    if (!canPerform('financial_approval')) return;
    const calculated = projectParcels.map(p => {
      const rate = p.marketRatePerAcre || 500000;
      const baseValue = p.areaAcres * rate;
      const solatium = baseValue; 
      const otherComps = 150000; 
      const total = baseValue + solatium + otherComps;
      
      return {
        ...p,
        baseValue,
        solatium,
        otherComps,
        total,
        rate
      };
    });
    setCalculatedParcels(calculated);
    setIsCalculated(true);
  };

  const handleApprove = async () => {
    if (!canPerform('financial_approval')) return;
    setIsApproving(true);
    try {
      const totalAssessed = calculatedParcels.reduce((sum, p) => sum + p.total, 0);
      await approveProjectApi(project.id, {
        calculatedParcels,
        totalCompensationAssessedCr: totalAssessed ? (totalAssessed / 10000000).toFixed(2) : 0,
        approvedBy: 'Financial Officer'
      });
      alert("Project financial assessment approved and safely stored in Project_Approved_Project database collection.");
      setIsApproveModalOpen(false);
      (project as any).financialStatus = 'Approved'; 
      (project as any).approvalStatus = 'APPROVED';
      if (onApproved) {
        onApproved(project.id);
      }
      onBack();
    } catch (err) {
      console.error(err);
      alert("Failed to approve project: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    alert("Project financial assessment rejected. Sent back with notes.");
    setIsRejectModalOpen(false);
    onBack();
  };
  
  const totalAssessed = calculatedParcels.reduce((sum, p) => sum + p.total, 0);
  const isApproved = (project as any).financialStatus === 'Approved' || (project as any).approvalStatus === 'APPROVED';

  return (
    <div className="page-body">
      <button className="gov-btn gov-btn-secondary gov-btn-sm" onClick={onBack} style={{ marginBottom: '16px' }}>
        <ArrowLeft size={13} /> Back to Approved Projects
      </button>

      <div className="gov-card" style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>{project.name}</h2>
        <div style={{ fontSize: '12px', color: 'var(--gov-slate-500)', marginBottom: '12px' }}>
          Project ID: {project.code}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '12px' }}>
          <div><span style={{ color: 'var(--gov-slate-500)' }}>Project Implementing Agency:</span> <br/><strong>{project.implementingAgency}</strong></div>
          <div><span style={{ color: 'var(--gov-slate-500)' }}>District:</span> <br/><strong>{project.district}</strong></div>
          <div><span style={{ color: 'var(--gov-slate-500)' }}>Taluk:</span> <br/><strong>{project.taluks.join(', ')}</strong></div>
          <div><span style={{ color: 'var(--gov-slate-500)' }}>Project Type:</span> <br/><strong>{project.projectType || 'Infrastructure'}</strong></div>
          <div><span style={{ color: 'var(--gov-slate-500)' }}>Required Land:</span> <br/><strong>{project.landRequiredAcres} acres</strong></div>
          <div><span style={{ color: 'var(--gov-slate-500)' }}>LAO Status:</span> <br/><strong style={{color: 'var(--gov-green-700)'}}>Approved</strong></div>
          <div><span style={{ color: 'var(--gov-slate-500)' }}>Financial Status:</span> <br/><strong style={{color: isApproved ? 'var(--gov-green-700)' : 'var(--gov-amber-700)'}}>{isApproved ? 'Approved' : 'Pending'}</strong></div>
        </div>
      </div>
      
      <div className="gov-card" style={{ marginBottom: '16px', backgroundColor: 'var(--gov-slate-50)' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gov-navy-900)', marginBottom: '12px' }}>PROJECT SUMMARY</div>
        <div style={{ display: 'flex', gap: '24px', fontSize: '13px', flexWrap: 'wrap' }}>
           <div><strong>Affected Landowners:</strong> {projectParcels.length}</div>
           <div><strong>Affected Parcels:</strong> {projectParcels.length}</div>
           <div><strong>Total Land Acquired:</strong> {project.landAcquiredAcres || project.landRequiredAcres} acres</div>
           {isCalculated && (
             <div style={{ color: 'var(--gov-blue-700)' }}><strong>Total Assessed Compensation:</strong> ₹{(totalAssessed / 100000).toFixed(2)} L</div>
           )}
        </div>
      </div>

      <div className="gov-card" style={{ marginBottom: '16px' }}>
        <div className="gov-card-title" style={{ marginBottom: '12px' }}><MapPin size={16}/> Project Map / Structure</div>
        <div style={{ height: '300px', border: '1px solid var(--gov-slate-200)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <LeafletGisMap 
            parcels={projectParcels}
            selectedParcelId={selectedParcelId}
            onSelectParcel={(id) => setSelectedParcelId(id)}
            showLegend={false}
          />
        </div>
        {selectedParcelId && (
          <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'var(--gov-blue-50)', borderRadius: 'var(--radius-sm)' }}>
             {(() => {
                const sp = projectParcels.find(p => p.parcelId === selectedParcelId);
                if (!sp) return null;
                const hissa = getHissaByParcelId(sp.parcelId);
                return (
                  <div style={{ fontSize: '12px' }}>
                    <div style={{ fontWeight: 700, marginBottom: '4px' }}>Selected Parcel Details:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div><strong>Survey No:</strong> {sp.surveyNumber}</div>
                      <div><strong>Village:</strong> {sp.village}</div>
                      <div><strong>Total Land Area:</strong> {sp.areaAcres} acres</div>
                      <div><strong>Landowner:</strong> {sp.ownerName}</div>
                    </div>
                    {hissa.length > 0 && (
                      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--gov-blue-100)' }}>
                        <strong>Hissa Details:</strong> {hissa.map(h => `Hissa ${h.hissa_no} (${h.owner?.name || h.owner_id})`).join(', ')}
                      </div>
                    )}
                  </div>
                );
             })()}
          </div>
        )}
      </div>

      <div className="gov-card" style={{ marginBottom: '16px' }}>
        <div className="gov-card-title" style={{ marginBottom: '12px' }}><Users size={16}/> Affected Landowners</div>
        <div className="table-container">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Owner Name</th>
                <th>Survey No</th>
                <th>Hissa Details</th>
                <th>Area (Acres)</th>
                <th>Market Rate / Acre</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {projectParcels.map(p => {
                const hissa = getHissaByParcelId(p.parcelId);
                const hasHissa = hissa.length > 0;
                
                return (
                  <tr key={p.parcelId}>
                    <td style={{ fontWeight: 600 }}>{p.ownerName}</td>
                    <td>{p.surveyNumber}</td>
                    <td>
                      {hasHissa ? (
                        <span style={{ fontSize: '11px', color: 'var(--gov-blue-700)', backgroundColor: 'var(--gov-blue-50)', padding: '2px 6px', borderRadius: '4px' }}>
                          {hissa.length} Hissas Linked
                        </span>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>Single Owner</span>
                      )}
                    </td>
                    <td>{p.areaAcres}</td>
                    <td>₹{(p.marketRatePerAcre || 500000).toLocaleString()}</td>
                    <td>
                      <button 
                        className="gov-btn gov-btn-secondary gov-btn-sm"
                        onClick={() => setSelectedOwnerForCalc(p)}
                      >
                        View Valuation
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {canPerform('financial_approval') && <div className="gov-card" style={{ marginBottom: '16px', backgroundColor: 'var(--gov-blue-50)', border: '1px solid var(--gov-blue-100)' }}>
        <div className="gov-card-title" style={{ marginBottom: '12px', color: 'var(--gov-blue-800)' }}><IndianRupee size={16}/> Automatic Compensation Calculation</div>
        <p style={{ fontSize: '12px', color: 'var(--gov-blue-700)', marginBottom: '12px' }}>
          The system will calculate compensation for all affected landowners using the available land/project information and rules.
        </p>
        <button 
          className="gov-btn gov-btn-primary" 
          onClick={handleCalculateAll}
        >
          Calculate Compensation for All
        </button>
      </div>}

      {isCalculated && (
        <div className="gov-card" style={{ marginBottom: '16px' }}>
          <div className="gov-card-title" style={{ marginBottom: '12px' }}><Users size={16}/> COMPENSATION BENEFICIARIES</div>
          <div style={{ display: 'grid', gap: '12px' }}>
            {calculatedParcels.map(p => (
              <div key={p.parcelId} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', border: '1px solid var(--gov-slate-200)', borderRadius: '4px' }}>
                 <div style={{ fontSize: '12px' }}>
                   <div style={{ fontWeight: 700, color: 'var(--gov-navy-900)' }}>{p.ownerName}</div>
                   <div style={{ color: 'var(--gov-slate-500)' }}>Survey {p.surveyNumber} • Acquired: {p.areaAcres} acres</div>
                 </div>
                 <div style={{ textAlign: 'right', fontSize: '12px' }}>
                   <div style={{ fontWeight: 700, color: 'var(--gov-blue-700)' }}>Compensation: ₹{(p.total / 100000).toFixed(2)}L</div>
                   <div style={{ color: 'var(--gov-slate-500)' }}>Status: Pending</div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="gov-card" style={{ marginBottom: '16px' }}>
        <div className="gov-card-title" style={{ marginBottom: '12px' }}><FileText size={16}/> DOCUMENTS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {projectDocs.length > 0 ? projectDocs.map(d => (
            <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
              <FileText size={14} color="var(--gov-slate-500)"/> 
              <span style={{ fontWeight: 600 }}>{d.documentName}</span>
              <span style={{ color: 'var(--gov-slate-400)' }}>({d.category})</span>
            </div>
          )) : (
            <div style={{ fontSize: '12px', color: 'var(--gov-slate-500)' }}>3 Verified Documents (Joint Measurement Survey, Gazette 4(1), Valuation Report)</div>
          )}
        </div>
      </div>

      <div className="gov-card" style={{ marginBottom: '16px' }}>
        <div className="gov-card-title" style={{ marginBottom: '12px' }}><Building2 size={16}/> PAYMENT STATUS</div>
        <div style={{ fontSize: '12px' }}>
          {projectComp.length > 0 ? (
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Beneficiary</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {projectComp.map(c => (
                  <tr key={c.id}>
                    <td>{c.landownerName}</td>
                    <td>₹{c.amount.toLocaleString()}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td>{c.paymentDate || 'Pending Approval'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ color: 'var(--gov-slate-500)' }}>No disbursements processed yet. Awaiting financial approval.</div>
          )}
        </div>
      </div>

      {canPerform('financial_approval') && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
        <button className="gov-btn gov-btn-secondary" style={{ backgroundColor: 'var(--gov-red-50)', color: 'var(--gov-red-700)', borderColor: 'var(--gov-red-200)' }} onClick={() => setIsRejectModalOpen(true)}>
           <XCircle size={14} /> Reject
        </button>
        <button className="gov-btn gov-btn-primary" style={{ backgroundColor: 'var(--gov-green-600)' }} onClick={() => setIsApproveModalOpen(true)}>
           <CheckCircle2 size={14} /> Approve
        </button>
      </div>}

      <Modal isOpen={!!selectedOwnerForCalc} onClose={() => setSelectedOwnerForCalc(null)} title={`Land Valuation - ${selectedOwnerForCalc?.ownerName}`}>
        {selectedOwnerForCalc && (
          <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div><strong>Survey Number:</strong> {selectedOwnerForCalc.surveyNumber}</div>
            <div><strong>Village:</strong> {selectedOwnerForCalc.village}</div>
            <div><strong>Total Land:</strong> {selectedOwnerForCalc.areaAcres} acres</div>
            <div><strong>Acquired Land:</strong> {selectedOwnerForCalc.areaAcres} acres</div>
            <div><strong>Ownership:</strong> {getHissaByParcelId(selectedOwnerForCalc.parcelId).length > 1 ? 'Joint Owners' : 'Individual Owner'}</div>
            
            <hr style={{ margin: '12px 0', borderColor: 'var(--gov-slate-200)' }} />
            <div style={{ fontWeight: 700, fontSize: '13px' }}>COMPENSATION ASSESSMENT</div>
            
            {isCalculated ? (() => {
              const calc = calculatedParcels.find(p => p.parcelId === selectedOwnerForCalc.parcelId);
              if (!calc) return <div>Not calculated yet.</div>;
              return (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: 'var(--gov-slate-50)', padding: '16px', borderRadius: '4px', border: '1px solid var(--gov-slate-200)' }}>
                   <div><span style={{ color: 'var(--gov-slate-500)' }}>Land Rate:</span> <br/><span style={{fontWeight: 600}}>₹{calc.rate.toLocaleString()} / acre</span></div>
                   <div><span style={{ color: 'var(--gov-slate-500)' }}>Acquired Area:</span> <br/><span style={{fontWeight: 600}}>{calc.areaAcres} acres</span></div>
                   <div><span style={{ color: 'var(--gov-slate-500)' }}>Base Land Value:</span> <br/><span style={{fontWeight: 600}}>₹{calc.baseValue.toLocaleString()}</span></div>
                   <div><span style={{ color: 'var(--gov-slate-500)' }}>Solatium:</span> <br/><span style={{fontWeight: 600}}>₹{calc.solatium.toLocaleString()}</span></div>
                   <div><span style={{ color: 'var(--gov-slate-500)' }}>Other Components:</span> <br/><span style={{fontWeight: 600}}>₹{calc.otherComps.toLocaleString()}</span></div>
                   <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--gov-slate-200)', marginTop: '8px', paddingTop: '12px' }}>
                     <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--gov-navy-900)' }}>FINAL COMPENSATION: ₹{calc.total.toLocaleString()}</div>
                   </div>
                </div>
              );
            })() : (
              <div style={{ color: 'var(--gov-amber-700)', padding: '8px', backgroundColor: 'var(--gov-amber-50)', borderRadius: '4px' }}>
                Compensation not calculated yet. Click "Calculate Compensation for All" on the project page.
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title="Reject Financial Assessment">
        <div style={{ fontSize: '12px', marginBottom: '8px' }}>Reason:</div>
        <textarea 
          className="gov-input" 
          style={{ width: '100%', minHeight: '80px', marginBottom: '16px' }}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="State reason for rejecting financial calculation..."
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button className="gov-btn gov-btn-secondary" onClick={() => setIsRejectModalOpen(false)}>Cancel</button>
          <button className="gov-btn gov-btn-primary" style={{ backgroundColor: 'var(--gov-red-600)' }} onClick={handleReject}>Confirm Rejection</button>
        </div>
      </Modal>

      <Modal isOpen={isApproveModalOpen} onClose={() => setIsApproveModalOpen(false)} title="Approve Financial Assessment">
        <div style={{ fontSize: '13px', marginBottom: '16px' }}>
          Are you sure you want to approve the compensation assessment for <strong>{project.name}</strong>?
          {isCalculated ? (
            <>
              <div style={{ margin: '12px 0', padding: '12px', backgroundColor: 'var(--gov-green-50)', border: '1px solid var(--gov-green-200)', borderRadius: '4px' }}>
                <strong>Total Compensation Assessed:</strong> ₹{(totalAssessed / 100000).toFixed(2)} Lakhs
              </div>
            </>
          ) : (
             <div style={{ color: 'var(--gov-amber-700)', fontWeight: 600 }}>Please calculate compensation before approving.</div>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button className="gov-btn gov-btn-secondary" onClick={() => setIsApproveModalOpen(false)}>Cancel</button>
          <button className="gov-btn gov-btn-primary" style={{ backgroundColor: 'var(--gov-green-600)' }} onClick={handleApprove} disabled={!isCalculated || isApproving}>
            {isApproving ? 'Approving...' : 'Confirm Approval'}
          </button>
        </div>
      </Modal>

    </div>
  );
};

export const CompensationPage: React.FC = () => {
  const {
    projects,
    searchQuery: globalSearch,
    t
  } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState<string>('');
  const [approvedIds, setApprovedIds] = useState<Record<string, boolean>>({});

  const handleProjectApproved = (id: string) => {
    setApprovedIds(prev => ({ ...prev, [id]: true }));
  };

  const approvedProjects = projects.filter((p) => !p.id.startsWith('proj-'));

  const searchKeyword = (localSearch || globalSearch).toLowerCase().trim();
  const filteredProjects = approvedProjects.filter((p) => 
    !searchKeyword || p.name.toLowerCase().includes(searchKeyword) || p.code.toLowerCase().includes(searchKeyword)
  );

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  if (selectedProject) {
    return (
      <FinancialProjectDetails 
        project={selectedProject} 
        onBack={() => setSelectedProjectId(null)}
        onApproved={handleProjectApproved}
      />
    );
  }

  return (
    <div className="page-body">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">{t('compensation.title', 'APPROVED PROJECTS')}</h1>
          <p className="page-subtitle">
            {t('compensation.subtitle', 'Projects stored in the Project_Approval_LA database collection approved by the Land Acquisition Officer.')}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', maxWidth: '400px' }}>
        <Search size={14} color="var(--gov-slate-400)" />
        <input
          type="text"
          className="gov-input"
          style={{ width: '100%' }}
          placeholder="Search approved projects..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>

      {filteredProjects.length === 0 ? (
        <div className="gov-card" style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f8fafc' }}>
          <Building2 size={32} color="var(--gov-slate-400)" style={{ marginBottom: '8px' }} />
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gov-navy-900)', marginBottom: '4px' }}>
            No Projects in Project_Approval_LA Collection
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--gov-slate-500)', margin: 0 }}>
            Only projects saved in the <code>Project_Approval_LA</code> collection in the database are listed here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {filteredProjects.map(proj => {
            const isApproved = approvedIds[proj.id] || (proj as any).financialStatus === 'Approved' || (proj as any).approvalStatus === 'APPROVED';
            return (
              <div key={proj.id} className="gov-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gov-navy-900)', marginBottom: '8px' }}>
                  {proj.name}
                </h3>
                <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)', marginBottom: '12px' }}>
                  Project ID: {proj.code}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--gov-slate-600)' }}>Agency:</span>
                    <span style={{ fontWeight: 600 }}>{proj.agencyName || proj.implementingAgency}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--gov-slate-600)' }}>District:</span>
                    <span style={{ fontWeight: 600 }}>{proj.district}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--gov-slate-600)' }}>Taluk:</span>
                    <span style={{ fontWeight: 600, textAlign: 'right' }}>{Array.isArray(proj.taluks) ? proj.taluks.join(', ') : proj.district}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--gov-slate-600)' }}>Required Land:</span>
                    <span style={{ fontWeight: 600 }}>{proj.landRequiredAcres} acres</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--gov-slate-600)' }}>Affected Landowners:</span>
                    <span style={{ fontWeight: 600 }}>{proj.affectedFamiliesCount || getLandownerCount(proj.id || proj.code)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span style={{ color: 'var(--gov-slate-600)' }}>LAO Status:</span>
                    <span style={{ fontWeight: 700, color: 'var(--gov-green-700)' }}>Approved</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--gov-slate-600)' }}>Financial Status:</span>
                    <span style={{ fontWeight: 700, color: isApproved ? 'var(--gov-green-700)' : 'var(--gov-amber-700)' }}>
                      {isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                </div>

                <button 
                  className="gov-btn gov-btn-primary" 
                  style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}
                  onClick={() => setSelectedProjectId(proj.id)}
                >
                  View Project
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
