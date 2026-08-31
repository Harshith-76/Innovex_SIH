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
  ArrowRight
} from 'lucide-react';

interface ParcelDetailDrawerProps {
  parcel: LandParcel | null;
  onClose: () => void;
}

export const ParcelDetailDrawer: React.FC<ParcelDetailDrawerProps> = ({ parcel, onClose }) => {
  const { updateParcelStatus, setCurrentPage, setSelectedParcelId } = useApp();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<ParcelStatus>(parcel?.acquisitionStatus || 'Notification');
  const [targetCompStatus, setTargetCompStatus] = useState<CompensationStatus>(parcel?.compensationStatus || 'Pending Approval');
  const [statusUpdateNote, setStatusUpdateNote] = useState('');

  if (!parcel) return null;

  const handleUpdateStatusSubmit = () => {
    updateParcelStatus(parcel.parcelId, targetStatus, targetCompStatus);
    setIsUpdateModalOpen(false);
  };

  const formattedComp = (parcel.compensationAmount / 100000).toFixed(2);

  return (
    <div className="gis-drawer">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-500)', textTransform: 'uppercase' }}>
            Cadastral Record
          </div>
          <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>
            Survey No. {parcel.surveyNumber}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--gov-slate-600)' }}>
            {parcel.village}, {parcel.taluk} Taluk
          </div>
        </div>
        <button
          className="gov-btn gov-btn-secondary gov-btn-sm"
          style={{ padding: '4px' }}
          onClick={onClose}
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

      {/* Land & Owner Specifications */}
      <div>
        <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--gov-navy-900)', marginBottom: '8px' }}>
          Title & Land Attributes
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
            <div style={{ color: 'var(--gov-slate-500)', fontSize: '10px' }}>Soil / Land Quality</div>
            <div style={{ fontWeight: 600, color: 'var(--gov-slate-800)' }}>{parcel.soilClassification || '—'}</div>
          </div>
          <div style={{ gridColumn: 'span 2', borderTop: '1px dashed var(--gov-slate-200)', paddingTop: '6px', marginTop: '2px' }}>
            <div style={{ color: 'var(--gov-slate-500)', fontSize: '10px' }}>Registered Owner / Khatadar</div>
            <div style={{ fontWeight: 600, color: 'var(--gov-navy-900)' }}>{parcel.ownerName || '—'}</div>
            <div style={{ fontSize: '10px', color: 'var(--gov-slate-500)' }}>Aadhaar: {parcel.aadhaarMasked || '— (Bhoomi Sync Pending)'}</div>
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
