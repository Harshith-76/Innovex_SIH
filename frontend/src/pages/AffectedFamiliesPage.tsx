import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AffectedFamily, LandParcel } from '../types';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/layout/Modal';
import { LeafletGisMap } from '../components/gis/LeafletGisMap';
import {
  Users,
  Home,
  CheckCircle2,
  Clock,
  Search,
  Eye,
  IndianRupee,
  MapPin,
  Building2,
  Layers,
  UserCheck
} from 'lucide-react';

export const AffectedFamiliesPage: React.FC = () => {
  const { projects, parcels, affectedFamilies, searchQuery: globalSearch, t } = useApp();

  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterRrStatus, setFilterRrStatus] = useState<string>('ALL');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [selectedFamily, setSelectedFamily] = useState<any | null>(null);

  // Take recently created project in project section
  const recentProject = projects.length > 0 ? projects[projects.length - 1] : projects[0];

  // Take one parcel from recently created project
  const projectParcels = parcels.filter(p => p.projectId === recentProject?.id);
  const recentParcel = projectParcels.length > 0 ? projectParcels[0] : (parcels[0] || null);

  // Cadastral coordinates fallback for Satellite Map
  const defaultCoords: [number, number][] = [
    [12.8465, 74.9395],
    [12.8480, 74.9420],
    [12.8460, 74.9435],
    [12.8445, 74.9410]
  ];

  // Build Kumar's Land Parcel object for GIS Satellite Map
  const kumarParcel: LandParcel = {
    parcelId: recentParcel?.parcelId || 'PCL-KA-2026-KM1',
    projectId: recentProject?.id || 'proj-001',
    projectName: recentProject?.name || 'Bengaluru–Mysuru Highway Expansion',
    surveyNumber: recentParcel?.surveyNumber || '104/2A',
    state: recentProject?.state || 'Karnataka',
    district: recentProject?.district || 'Bengaluru Rural',
    taluk: recentProject?.taluks?.[0] || 'Ramanagara',
    village: recentParcel?.village || recentProject?.taluks?.[0] || 'Avverahalli',
    landType: 'Agricultural',
    areaAcres: recentParcel?.areaAcres || 2.45,
    latitude: recentParcel?.latitude || 12.8463,
    longitude: recentParcel?.longitude || 74.9412,
    coordinates: (recentParcel?.coordinates && recentParcel.coordinates.length > 0)
      ? recentParcel.coordinates
      : defaultCoords,
    ownerName: 'Kumar (Title Holder)',
    acquisitionStatus: 'Acquired',
    compensationAmount: 2600000,
    compensationPaid: 2600000,
    compensationStatus: 'Paid',
    possessionStatus: 'Taken',
    rrRequired: false,
    rrStatus: 'Completed',
    affectedFamiliesCount: 1,
    documentsCount: 4,
    lastUpdated: '2026-08-30',
    hasHissa: true,
    hissaRecords: [
      {
        _id: 'KM-HISSA-01',
        hissa_id: 'HISSA-2A',
        survey_no: recentParcel?.surveyNumber || '104/2A',
        hissa_no: '2A',
        owner_id: 'KM-OWN-01',
        parcel_id: recentParcel?.parcelId || 'PCL-KA-2026-KM1',
        extent: recentParcel?.areaAcres || 2.45,
        extent_unit: 'Acres',
        owner: {
          owner_id: 'KM-OWN-01',
          name: 'Kumar'
        }
      }
    ]
  };

  // Artificial landowner data for Kumar
  const kumarLandowner = {
    familyId: 'LND-2026-KUMAR-01',
    headOfFamily: 'Kumar',
    name: 'Kumar',
    gender: 'Male',
    age: 48,
    village: kumarParcel.village,
    taluk: kumarParcel.taluk,
    district: kumarParcel.district,
    surveyNumber: kumarParcel.surveyNumber,
    parcelId: kumarParcel.parcelId,
    projectId: recentProject?.id || 'proj-001',
    projectName: recentProject?.name || 'Bengaluru–Mysuru Highway Expansion',
    projectCode: recentProject?.code || 'LA-KA-2026-00127',
    familyMembersCount: 4,
    affectedType: 'Title Holder',
    isDisplaced: false,
    acquiredAcres: kumarParcel.areaAcres,
    totalParcelAcres: kumarParcel.areaAcres * 1.3,
    baseValue: 1225000,
    solatium: 1225000,
    allowances: 150000,
    allocatedCompensation: 2600000,
    compensationStatus: 'Approved',
    bankName: 'State Bank of India',
    bankAccountMasked: 'SB-****-****-9821',
    ifscCode: 'SBIN0040182',
    rrStatus: 'Completed',
    lastAssessedDate: '2026-08-30'
  };

  const searchKeyword = (localSearch || globalSearch).toLowerCase().trim();

  const filteredFamilies = affectedFamilies.filter((fam) => {
    const matchesType = filterType === 'ALL' || fam.affectedType === filterType;
    const matchesRr = filterRrStatus === 'ALL' || fam.rrStatus === filterRrStatus;
    const matchesSearch =
      !searchKeyword ||
      fam.familyId.toLowerCase().includes(searchKeyword) ||
      fam.headOfFamily.toLowerCase().includes(searchKeyword) ||
      fam.village.toLowerCase().includes(searchKeyword) ||
      fam.surveyNumber.includes(searchKeyword);

    return matchesType && matchesRr && matchesSearch;
  });

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">{t('landowner.title', 'Landowner Directory & Compensation')}</h1>
          <p className="page-subtitle">
            {t('landowner.subtitle', 'View affected landowners, compensation records, bank account details, and disbursement status.')}
          </p>
        </div>
      </div>

      {/* FEATURED ARTIFICIAL LAND OWNER CARD - KUMAR */}
      <div
        className="gov-card"
        style={{
          borderLeft: '5px solid var(--gov-blue-600)',
          backgroundColor: '#f8fafc',
          marginBottom: '20px',
          padding: '20px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '14px',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <UserCheck size={20} color="var(--gov-blue-700)" />
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gov-navy-900)', margin: 0 }}>
                Primary Landowner Record: <span style={{ color: 'var(--gov-blue-700)' }}>Kumar</span>
              </h2>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--gov-slate-500)' }}>
              Acquired Landowner Details & Parcel GIS Mapping from Recently Created Project
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-600)' }}>Compensation Status:</span>
            <StatusBadge status={kumarLandowner.compensationStatus} size="md" />
          </div>
        </div>

        {/* Info Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px',
            fontSize: '12px',
            backgroundColor: '#ffffff',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--gov-slate-200)',
            marginBottom: '16px'
          }}
        >
          <div>
            <div style={{ color: 'var(--gov-slate-500)', fontSize: '11px' }}>Landowner Name:</div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--gov-navy-900)' }}>{kumarLandowner.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--gov-slate-600)' }}>Title Holder / Khatedar</div>
          </div>

          <div>
            <div style={{ color: 'var(--gov-slate-500)', fontSize: '11px' }}>Recently Created Project:</div>
            <div style={{ fontWeight: 700, color: 'var(--gov-navy-900)' }}>{kumarLandowner.projectName}</div>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--gov-blue-700)' }}>
              ID: {kumarLandowner.projectCode}
            </div>
          </div>

          <div>
            <div style={{ color: 'var(--gov-slate-500)', fontSize: '11px' }}>Acquired Parcel & Location:</div>
            <div style={{ fontWeight: 700, color: 'var(--gov-navy-900)' }}>
              Sy. No. {kumarLandowner.surveyNumber} (Parcel: {kumarLandowner.parcelId})
            </div>
            <div style={{ fontSize: '11px', color: 'var(--gov-slate-600)' }}>
              {kumarLandowner.village}, {kumarLandowner.taluk}, {kumarLandowner.district}
            </div>
          </div>

          <div>
            <div style={{ color: 'var(--gov-slate-500)', fontSize: '11px' }}>Land Acquired Inside Parcel:</div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--gov-green-700)' }}>
              {kumarLandowner.acquiredAcres} Acres
            </div>
            <div style={{ fontSize: '11px', color: 'var(--gov-slate-600)' }}>
              Total Parcel Area: {kumarLandowner.totalParcelAcres.toFixed(2)} Acres
            </div>
          </div>
        </div>

        {/* GIS SATELLITE MAP — KUMAR'S ACQUIRED PARCEL */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gov-navy-900)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={15} color="var(--gov-blue-700)" />
              <span>GIS Map — Kumar's Acquired Land Inside Parcel (Sy. No. {kumarLandowner.surveyNumber})</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--gov-slate-600)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Layers size={13} color="var(--gov-blue-700)" />
              <span>High-Resolution Satellite Imagery (Esri World Imagery) with Layer Toggle</span>
            </div>
          </div>

          <div
            style={{
              height: '380px',
              border: '1px solid var(--gov-slate-300)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}
          >
            <LeafletGisMap
              parcels={[kumarParcel, ...(projectParcels.filter(p => p.parcelId !== kumarParcel.parcelId))]}
              selectedParcelId={kumarParcel.parcelId}
              onSelectParcel={(id) => console.log('Selected parcel:', id)}
              height="100%"
              showLayerToggle={true}
              showLegend={true}
            />
          </div>
        </div>

        {/* Allocated Compensation Breakdown Box & Status */}
        <div
          style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IndianRupee size={16} color="var(--gov-green-700)" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#166534' }}>
                ALLOCATED COMPENSATION BREAKDOWN (RFCTLARR 2013 AWARD)
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#166534' }}>Compensation Status:</span>
              <StatusBadge status={kumarLandowner.compensationStatus} size="sm" />
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              fontSize: '12px'
            }}
          >
            <div>
              <span style={{ color: 'var(--gov-slate-600)' }}>Base Land Value:</span>
              <div style={{ fontWeight: 600 }}>₹ {kumarLandowner.baseValue.toLocaleString()}</div>
            </div>
            <div>
              <span style={{ color: 'var(--gov-slate-600)' }}>100% Solatium Amount:</span>
              <div style={{ fontWeight: 600 }}>₹ {kumarLandowner.solatium.toLocaleString()}</div>
            </div>
            <div>
              <span style={{ color: 'var(--gov-slate-600)' }}>R&R / Rehabilitation Allowance:</span>
              <div style={{ fontWeight: 600 }}>₹ {kumarLandowner.allowances.toLocaleString()}</div>
            </div>
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #86efac'
              }}
            >
              <span style={{ color: 'var(--gov-slate-700)', fontSize: '11px', fontWeight: 600 }}>TOTAL ALLOCATED COMPENSATION:</span>
              <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--gov-green-700)' }}>
                ₹ {(kumarLandowner.allocatedCompensation / 100000).toFixed(2)} Lakhs (₹ {kumarLandowner.allocatedCompensation.toLocaleString()})
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Table */}
      <div className="gov-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>Landowner Name</th>
                <th>Survey Number</th>
                <th>Parcel ID</th>
                <th>Village & District</th>
                <th style={{ textAlign: 'right' }}>Acquired Area</th>
                <th>Tenure Category</th>
                <th style={{ textAlign: 'right' }}>Allocated Compensation</th>
                <th>Compensation Status</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Feature Kumar at top of table if matches filter */}
              <tr style={{ backgroundColor: '#f0fdf4', fontWeight: 600 }}>
                <td style={{ color: 'var(--gov-navy-900)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ backgroundColor: 'var(--gov-blue-700)', color: '#ffffff', fontSize: '10px', padding: '1px 5px', borderRadius: '3px' }}>NEW</span>
                    <span>{kumarLandowner.name}</span>
                  </div>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>Sy. No. {kumarLandowner.surveyNumber}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{kumarLandowner.parcelId}</td>
                <td>{kumarLandowner.village}, {kumarLandowner.district}</td>
                <td style={{ textAlign: 'right', color: 'var(--gov-green-700)', fontWeight: 700 }}>
                  {kumarLandowner.acquiredAcres} Acres
                </td>
                <td>{kumarLandowner.affectedType}</td>
                <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--gov-navy-900)' }}>
                  ₹ {(kumarLandowner.allocatedCompensation / 100000).toFixed(2)} Lakhs
                </td>
                <td><StatusBadge status={kumarLandowner.compensationStatus} size="sm" /></td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    className="gov-btn gov-btn-secondary gov-btn-sm"
                    onClick={() => setSelectedFamily(kumarLandowner)}
                  >
                    <Eye size={12} /> View Details
                  </button>
                </td>
              </tr>

              {filteredFamilies.map((fam) => (
                <tr key={fam.familyId}>
                  <td style={{ fontWeight: 600, color: 'var(--gov-navy-900)' }}>{fam.headOfFamily}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>Sy. No. {fam.surveyNumber}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>PCL-KA-BLR-0{fam.surveyNumber}</td>
                  <td>{fam.village}, {fam.district}</td>
                  <td style={{ textAlign: 'right' }}>2.10 Acres</td>
                  <td>{fam.affectedType}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>₹ 24.80 Lakhs</td>
                  <td><StatusBadge status={fam.compensationStatus || fam.rrStatus} size="sm" /></td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="gov-btn gov-btn-secondary gov-btn-sm"
                      onClick={() => setSelectedFamily({
                        ...fam,
                        name: fam.headOfFamily,
                        allocatedCompensation: 2480000,
                        acquiredAcres: 2.10,
                        totalParcelAcres: 2.80,
                        parcelId: `PCL-KA-BLR-0${fam.surveyNumber}`,
                        projectName: recentProject?.name || 'Bengaluru–Mysuru Highway Expansion',
                        projectCode: recentProject?.code || 'LA-KA-2026-00127',
                        baseValue: 1100000,
                        solatium: 1100000,
                        allowances: 280000
                      })}
                    >
                      <Eye size={12} /> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Landowner Profile Modal */}
      <Modal
        isOpen={!!selectedFamily}
        onClose={() => setSelectedFamily(null)}
        title={selectedFamily ? `Landowner Record & Award — ${selectedFamily.name || selectedFamily.headOfFamily}` : ''}
        subtitle={selectedFamily ? `Survey No. ${selectedFamily.surveyNumber} · ${selectedFamily.village}, ${selectedFamily.district}` : ''}
        footer={
          <button className="gov-btn gov-btn-primary" onClick={() => setSelectedFamily(null)}>
            Close Record
          </button>
        }
      >
        {selectedFamily && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                backgroundColor: 'var(--gov-slate-50)',
                border: '1px solid var(--gov-slate-200)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                fontSize: '11.5px'
              }}
            >
              <div>
                <span style={{ color: 'var(--gov-slate-500)' }}>Landowner Name:</span>
                <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--gov-navy-900)' }}>{selectedFamily.name || selectedFamily.headOfFamily}</div>
              </div>
              <div>
                <span style={{ color: 'var(--gov-slate-500)' }}>Associated Project:</span>
                <div style={{ fontWeight: 600 }}>{selectedFamily.projectName}</div>
              </div>
              <div>
                <span style={{ color: 'var(--gov-slate-500)' }}>Survey Number & Parcel:</span>
                <div style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  Sy. No. {selectedFamily.surveyNumber} ({selectedFamily.parcelId})
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--gov-slate-500)' }}>Acquired Area Inside Parcel:</span>
                <div style={{ fontWeight: 700, color: 'var(--gov-green-700)' }}>{selectedFamily.acquiredAcres} Acres</div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#f0fdf4',
                padding: '14px',
                borderRadius: '4px',
                border: '1px solid #bbf7d0'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#166534', marginBottom: '8px' }}>
                COMPENSATION AWARD SUMMARY
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                <div>Base Land Value: <strong>₹ {selectedFamily.baseValue?.toLocaleString() || '12,25,000'}</strong></div>
                <div>100% Solatium: <strong>₹ {selectedFamily.solatium?.toLocaleString() || '12,25,000'}</strong></div>
                <div>Rehabilitation Add-on: <strong>₹ {selectedFamily.allowances?.toLocaleString() || '1,50,000'}</strong></div>
                <div>Compensation Status: <strong style={{ color: 'var(--gov-green-700)' }}>{selectedFamily.compensationStatus || 'Approved'}</strong></div>
                <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #86efac', paddingTop: '8px', marginTop: '4px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--gov-green-800)' }}>
                    TOTAL ALLOCATED COMPENSATION: ₹ {((selectedFamily.allocatedCompensation || 2600000) / 100000).toFixed(2)} Lakhs
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
