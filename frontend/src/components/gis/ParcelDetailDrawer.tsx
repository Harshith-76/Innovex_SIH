import React, { useState } from 'react';
import {
  LandParcel,
  ParcelStatus,
  CompensationStatus
} from '../../types';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../layout/Modal';
import {
  X,
  MapPin,
  FileText,
  IndianRupee,
  Users,
  CheckCircle2,
  Edit3,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  User,
  Phone,
  Layers,
  Info
} from 'lucide-react';

interface ParcelDetailDrawerProps {
  parcel: LandParcel | null;
  onClose: () => void;
}

export const ParcelDetailDrawer: React.FC<ParcelDetailDrawerProps> = ({ parcel, onClose }) => {
  const { updateParcelStatus, setCurrentPage, getHissaByParcelId } = useApp();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<ParcelStatus>(parcel?.acquisitionStatus || 'Notification');
  const [targetCompStatus, setTargetCompStatus] = useState<CompensationStatus>(parcel?.compensationStatus || 'Pending Approval');
  const [statusUpdateNote, setStatusUpdateNote] = useState('');

  if (!parcel) return null;

  const hissaRecords = parcel.hissaRecords && parcel.hissaRecords.length > 0
    ? parcel.hissaRecords
    : getHissaByParcelId(parcel.parcelId);

  const handleUpdateStatusSubmit = () => {
    updateParcelStatus(parcel.parcelId, targetStatus, targetCompStatus);
    setIsUpdateModalOpen(false);
  };

  const formattedComp = (parcel.compensationAmount / 100000).toFixed(2);

  return (
    <div className="gis-drawer" style={{ width: '380px', minWidth: '380px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-500)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Cadastral Record & Land Title
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>
            Survey No. {parcel.surveyNumber}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--gov-slate-600)' }}>
            {parcel.village}, {parcel.taluk} Taluk, {parcel.district}
          </div>
        </div>
        <button
          className="gov-btn gov-btn-secondary gov-btn-sm"
          style={{ padding: '4px' }}
          onClick={onClose}
          title="Close Drawer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Status Banner */}
      <div
        style={{
          backgroundColor: 'var(--gov-slate-50)',
          border: '1px solid var(--gov-slate-200)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <div style={{ fontSize: '10.5px', color: 'var(--gov-slate-500)' }}>Acquisition Status</div>
          <div style={{ marginTop: '2px' }}>
            <StatusBadge status={parcel.acquisitionStatus} />
          </div>
        </div>
        <button
          className="gov-btn gov-btn-primary gov-btn-sm"
          onClick={() => {
            setTargetStatus(parcel.acquisitionStatus);
            setTargetCompStatus(parcel.compensationStatus);
            setIsUpdateModalOpen(true);
          }}
        >
          <Edit3 size={12} /> Update Status
        </button>
      </div>

      {/* Hissa Sub-divisions & Registered Owners Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gov-navy-900)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={14} color="#4f46e5" />
            Hissa Sub-divisions & Ownership
          </div>
          {hissaRecords.length > 0 && (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                backgroundColor: '#e0e7ff',
                color: '#4338ca',
                padding: '2px 6px',
                borderRadius: '10px'
              }}
            >
              {hissaRecords.length} Sub-division{hissaRecords.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {hissaRecords.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {hissaRecords.map((hissa, idx) => (
              <div
                key={hissa.hissa_id || hissa._id || idx}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #c7d2fe',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e7ff', paddingBottom: '6px', marginBottom: '6px' }}>
                  <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#1e1b4b' }}>
                    Hissa No. {hissa.hissa_no}
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#4338ca' }}>
                    Extent: {hissa.extent} {hissa.extent_unit}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <User size={13} style={{ marginTop: '2px', color: '#6366f1', flexShrink: 0 }} />
                    <div>
                      <span style={{ color: 'var(--gov-slate-500)' }}>Owner: </span>
                      <strong style={{ color: 'var(--gov-navy-900)' }}>{hissa.owner?.name || 'Owner Name Pending'}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--gov-slate-400)', marginLeft: '19px' }}>Owner ID:</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 600, color: '#334155' }}>
                      {hissa.owner?.owner_id || hissa.owner_id}
                    </span>
                  </div>

                  {hissa.owner?.mobile && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={12} style={{ color: 'var(--gov-slate-400)', marginLeft: '3px' }} />
                      <span style={{ color: 'var(--gov-slate-600)', fontSize: '10.5px', fontFamily: 'var(--font-mono)' }}>
                        {hissa.owner.mobile}
                      </span>
                    </div>
                  )}

                  {hissa.owner?.address && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginTop: '2px' }}>
                      <MapPin size={12} style={{ marginTop: '2px', color: 'var(--gov-slate-400)', marginLeft: '3px', flexShrink: 0 }} />
                      <span style={{ color: 'var(--gov-slate-500)', fontSize: '10px' }}>
                        {hissa.owner.address}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Clear Parent Parcel Geometry distinction alert */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '6px',
                padding: '6px 8px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-sm)',
                fontSize: '10px',
                color: '#64748b',
                lineHeight: 1.3
              }}
            >
              <Info size={13} style={{ marginTop: '1px', flexShrink: 0, color: '#3b82f6' }} />
              <div>
                <strong>Geometry Reference:</strong> The highlighted map boundary represents the entire parent cadastral parcel ({parcel.areaAcres} Acres). Official internal sub-division boundaries are not demarcated in GIS.
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: 'var(--gov-slate-50)',
              border: '1px dashed var(--gov-slate-200)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              color: 'var(--gov-slate-600)'
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--gov-navy-900)', marginBottom: '2px' }}>
              Standard Cadastral Record
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--gov-slate-500)' }}>
              No separate Hissa sub-divisions recorded in database. Registered Khatadar: <strong>{parcel.ownerName}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Land & Cadastral Attributes */}
      <div>
        <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--gov-navy-900)', marginBottom: '8px' }}>
          Cadastral Identifiers & Location
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--gov-slate-200)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            fontSize: '11.5px'
          }}
        >
          <div>
            <div style={{ color: 'var(--gov-slate-500)', fontSize: '10px' }}>Cadastral ID</div>
            <div style={{ fontWeight: 600, color: 'var(--gov-slate-800)', fontFamily: 'var(--font-mono)' }}>
              {parcel.cadastralId || '—'}
            </div>
          </div>
          <div>
            <div style={{ color: 'var(--gov-slate-500)', fontSize: '10px' }}>ULPIN</div>
            <div style={{ fontWeight: 600, color: 'var(--gov-slate-800)', fontFamily: 'var(--font-mono)' }}>
              {parcel.ulpin || '—'}
            </div>
          </div>
          <div>
            <div style={{ color: 'var(--gov-slate-500)', fontSize: '10px' }}>Total Extent</div>
            <div style={{ fontWeight: 600, color: 'var(--gov-slate-800)' }}>{parcel.areaAcres} Acres</div>
          </div>
          <div>
            <div style={{ color: 'var(--gov-slate-500)', fontSize: '10px' }}>Land Classification</div>
            <div style={{ fontWeight: 600, color: 'var(--gov-slate-800)' }}>{parcel.landType}</div>
          </div>
          <div>
            <div style={{ color: 'var(--gov-slate-500)', fontSize: '10px' }}>Hobli / Taluk</div>
            <div style={{ fontWeight: 600, color: 'var(--gov-slate-800)' }}>
              {parcel.hobli ? `${parcel.hobli} (${parcel.taluk})` : parcel.taluk}
            </div>
          </div>
          <div>
            <div style={{ color: 'var(--gov-slate-500)', fontSize: '10px' }}>District</div>
            <div style={{ fontWeight: 600, color: 'var(--gov-slate-800)' }}>{parcel.district}</div>
          </div>
          <div>
            <div style={{ color: 'var(--gov-slate-500)', fontSize: '10px' }}>Khata / RTC Number</div>
            <div style={{ fontWeight: 600, color: 'var(--gov-slate-800)', fontFamily: 'var(--font-mono)' }}>
              {parcel.khataNumber || '—'}
            </div>
          </div>
          <div>
            <div style={{ color: 'var(--gov-slate-500)', fontSize: '10px' }}>Soil / Quality</div>
            <div style={{ fontWeight: 600, color: 'var(--gov-slate-800)' }}>{parcel.soilClassification || '—'}</div>
          </div>
        </div>
      </div>

      {/* Compensation & Possession Summary */}
      <div>
        <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--gov-navy-900)', marginBottom: '8px' }}>
          Compensation & Rehabilitation
        </div>
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--gov-slate-200)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '11.5px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--gov-slate-500)' }}>Assessed Amount:</span>
            <span style={{ fontWeight: 700, color: 'var(--gov-navy-900)' }}>₹{formattedComp} Lakh</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--gov-slate-500)' }}>Payment Status:</span>
            <StatusBadge status={parcel.compensationStatus} size="sm" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--gov-slate-500)' }}>Physical Possession:</span>
            <span style={{ fontWeight: 600, color: parcel.possessionStatus === 'Taken' ? 'var(--gov-green-700)' : 'var(--gov-amber-700)' }}>
              {parcel.possessionStatus}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--gov-slate-500)' }}>R&R Requirement:</span>
            <span style={{ fontWeight: 600 }}>{parcel.rrRequired ? 'Required' : 'Not Required'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--gov-slate-500)' }}>Affected Families:</span>
            <span style={{ fontWeight: 600 }}>{parcel.affectedFamiliesCount} Families</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
        <button
          className="gov-btn gov-btn-secondary"
          onClick={() => {
            setCurrentPage('documents');
          }}
        >
          <FileText size={14} /> View Registered Documents ({parcel.documentsCount})
        </button>
        <button
          className="gov-btn gov-btn-secondary"
          onClick={() => {
            setCurrentPage('compensation');
          }}
        >
          <IndianRupee size={14} /> View Compensation Ledger
        </button>
        <button
          className="gov-btn gov-btn-secondary"
          onClick={() => {
            setCurrentPage('affected-families');
          }}
        >
          <Users size={14} /> View Affected Families ({parcel.affectedFamiliesCount})
        </button>
      </div>

      {/* Update Parcel Status Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title={`Update Status — Survey No. ${parcel.surveyNumber}`}
        subtitle={`Village: ${parcel.village} | District: ${parcel.district}`}
        footer={
          <>
            <button className="gov-btn gov-btn-secondary" onClick={() => setIsUpdateModalOpen(false)}>
              Cancel
            </button>
            <button className="gov-btn gov-btn-primary" onClick={handleUpdateStatusSubmit}>
              Save Administrative Record
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, marginBottom: '4px' }}>
              Acquisition Lifecycle Stage
            </label>
            <select
              className="gov-select"
              style={{ width: '100%' }}
              value={targetStatus}
              onChange={(e) => setTargetStatus(e.target.value as ParcelStatus)}
            >
              <option value="Notification">Notification (Section 3A / 4)</option>
              <option value="Under Acquisition">Under Acquisition (Joint Measurement / SIA)</option>
              <option value="Compensation Pending">Compensation Pending (Section 3G Award Passed)</option>
              <option value="Possession Pending">Possession Pending (Section 3E Issued)</option>
              <option value="R&R Pending">R&R Pending (Resettlement Colony In Progress)</option>
              <option value="Acquired">Acquired (Mutation in Revenue Record Completed)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, marginBottom: '4px' }}>
              Direct Benefit Transfer / Compensation Status
            </label>
            <select
              className="gov-select"
              style={{ width: '100%' }}
              value={targetCompStatus}
              onChange={(e) => setTargetCompStatus(e.target.value as CompensationStatus)}
            >
              <option value="Pending Approval">Pending Approval</option>
              <option value="Processing">Processing via e-Kuber / Treasury</option>
              <option value="Paid">Paid & Disbursed</option>
              <option value="Payment Failed">Payment Failed / Khata Dispute</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, marginBottom: '4px' }}>
              Official Order / Verification Notes
            </label>
            <textarea
              className="gov-input"
              rows={3}
              style={{ width: '100%', resize: 'none' }}
              placeholder="Enter official gazette order number, SLAO sanction ref, or field mahazar notes..."
              value={statusUpdateNote}
              onChange={(e) => setStatusUpdateNote(e.target.value)}
            />
          </div>

          <div
            style={{
              padding: '8px 12px',
              backgroundColor: 'var(--gov-blue-50)',
              border: '1px solid var(--gov-blue-100)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              color: 'var(--gov-blue-700)'
            }}
          >
            <strong>Note:</strong> Status changes are recorded in the immutable audit log and automatically sync with the State Land Records Gateway (Bhoomi).
          </div>
        </div>
      </Modal>
    </div>
  );
};
