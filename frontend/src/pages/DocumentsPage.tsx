import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DocumentRecord } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/layout/Modal';
import {
  FileText,
  UploadCloud,
  Search,
  Filter,
  Download,
  Eye,
  ShieldCheck,
  History,
  FileCode,
  FolderOpen,
  CheckCircle2
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const { documents, addDocument, activeProject, searchQuery: globalSearch } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form state
  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState<DocumentRecord['category']>('Section 3A Notification');
  const [docVersion, setDocVersion] = useState('1.0');
  const [docFormat, setDocFormat] = useState<DocumentRecord['fileFormat']>('PDF');
  const [docGazette, setDocGazette] = useState('');

  const searchKeyword = (localSearch || globalSearch).toLowerCase().trim();

  const filteredDocs = documents.filter((doc) => {
    const matchesCat = filterCategory === 'ALL' || doc.category.includes(filterCategory);
    const matchesSearch =
      !searchKeyword ||
      doc.documentName.toLowerCase().includes(searchKeyword) ||
      doc.category.toLowerCase().includes(searchKeyword) ||
      doc.uploadedBy.toLowerCase().includes(searchKeyword) ||
      doc.projectName.toLowerCase().includes(searchKeyword);

    return matchesCat && matchesSearch;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    addDocument({
      documentName: docName.endsWith(`.${docFormat.toLowerCase()}`) ? docName : `${docName}.${docFormat.toLowerCase()}`,
      category: docCategory,
      projectId: activeProject?.id || 'proj-001',
      projectName: activeProject?.name || 'Bengaluru–Mysuru Highway Expansion',
      version: docVersion,
      fileFormat: docFormat,
      fileSize: `${(Math.random() * 8 + 1).toFixed(1)} MB`,
      uploadedBy: 'Shri R. K. Hegde, KAS (District LAO)',
      uploadedByRole: 'Special Land Acquisition Officer',
      status: 'Verified',
      gazetteNumber: docGazette || undefined
    });

    setIsUploadModalOpen(false);
    setDocName('');
    setDocGazette('');
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Documents & Statutory Records Repository</h1>
          <p className="page-subtitle">
            Digitally signed land records, Section 3A/3D gazettes, SIA survey reports, award declarations and possession mahazars
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="gov-btn gov-btn-primary"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <UploadCloud size={14} /> Upload Statutory Document
          </button>
        </div>
      </div>

      {/* Category Filter Badges */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}
      >
        {[
          { label: 'All Documents', value: 'ALL' },
          { label: 'Gazette Notifications (3A/3D)', value: 'Notification' },
          { label: 'Land Records (RTC/Khata)', value: 'Land Records' },
          { label: 'SIA Studies', value: 'Social Impact' },
          { label: 'Award Orders', value: 'Award' },
          { label: 'Possession Mahazars', value: 'Possession' },
          { label: 'R&R Entitlements', value: 'R&R' }
        ].map((cat) => (
          <button
            key={cat.value}
            className={`gov-btn ${filterCategory === cat.value ? 'gov-btn-primary' : 'gov-btn-secondary'} gov-btn-sm`}
            onClick={() => setFilterCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
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
          placeholder="Filter by Document title, Gazette number, Uploading authority..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>

      {/* Documents Table */}
      <div className="gov-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>Document Title</th>
                <th>Category</th>
                <th>Project Corridor</th>
                <th style={{ textAlign: 'center' }}>Version</th>
                <th>Format & Size</th>
                <th>Uploaded By</th>
                <th>Timestamp</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={15} color="var(--gov-blue-700)" />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--gov-navy-900)' }}>{doc.documentName}</div>
                        {doc.gazetteNumber && (
                          <div style={{ fontSize: '10px', color: 'var(--gov-slate-500)', fontFamily: 'var(--font-mono)' }}>
                            Gazette: {doc.gazetteNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{doc.category}</td>
                  <td style={{ fontSize: '11px' }}>{doc.projectName}</td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>v{doc.version}</td>
                  <td style={{ fontSize: '11px', color: 'var(--gov-slate-600)' }}>
                    {doc.fileFormat} ({doc.fileSize})
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{doc.uploadedBy}</div>
                    <div style={{ fontSize: '10px', color: 'var(--gov-slate-500)' }}>{doc.uploadedByRole}</div>
                  </td>
                  <td style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>{doc.uploadedDate}</td>
                  <td><StatusBadge status={doc.status} size="sm" /></td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                      <button
                        className="gov-btn gov-btn-secondary gov-btn-sm"
                        onClick={() => setSelectedDoc(doc)}
                        title="Audit & Version History"
                      >
                        <History size={12} /> Audit
                      </button>
                      <button
                        className="gov-btn gov-btn-secondary gov-btn-sm"
                        onClick={() => alert(`Downloading verified document ${doc.documentName}...`)}
                        title="Download"
                      >
                        <Download size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Audit & Version History Modal */}
      <Modal
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        title={selectedDoc ? selectedDoc.documentName : ''}
        subtitle={selectedDoc ? `Category: ${selectedDoc.category} | Version ${selectedDoc.version}` : ''}
        footer={
          <button className="gov-btn gov-btn-primary" onClick={() => setSelectedDoc(null)}>
            Done
          </button>
        }
      >
        {selectedDoc && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Cryptographic Hash Verification Box */}
            <div
              style={{
                backgroundColor: 'var(--gov-slate-50)',
                border: '1px solid var(--gov-slate-200)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                fontSize: '11.5px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gov-green-700)', fontWeight: 600 }}>
                <ShieldCheck size={16} /> Digital Signature & Integrity Verified
              </div>
              <div style={{ marginTop: '6px', color: 'var(--gov-slate-500)', fontSize: '10.5px' }}>
                SHA-256 Hash Digest:
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  backgroundColor: '#ffffff',
                  padding: '6px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--gov-slate-300)',
                  wordBreak: 'break-all',
                  marginTop: '2px'
                }}
              >
                {selectedDoc.sha256Hash}
              </div>
            </div>

            {/* Audit Trail Timeline */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gov-navy-900)', marginBottom: '8px' }}>
                Chronological Audit History & Approvals
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedDoc.auditTrail.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      borderLeft: '2px solid var(--gov-blue-600)',
                      paddingLeft: '10px',
                      fontSize: '11.5px'
                    }}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--gov-navy-900)' }}>
                      {item.action}
                    </div>
                    <div style={{ color: 'var(--gov-slate-500)', fontSize: '10.5px' }}>
                      {item.timestamp} · Actor: <strong>{item.actor}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Upload Document Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Statutory Acquisition Document"
        subtitle="Ingest PDF/GeoTIFF/DWG records with digital cryptographic registration"
        footer={
          <>
            <button className="gov-btn gov-btn-secondary" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </button>
            <button className="gov-btn gov-btn-primary" onClick={handleUploadSubmit}>
              Register & Upload Document
            </button>
          </>
        }
      >
        <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '3px' }}>
              Document Name / Title
            </label>
            <input
              type="text"
              className="gov-input"
              style={{ width: '100%' }}
              placeholder="e.g. Gazette_Section_3A_Notification_NH275.pdf"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '3px' }}>
                Document Classification Category
              </label>
              <select
                className="gov-select"
                style={{ width: '100%' }}
                value={docCategory}
                onChange={(e) => setDocCategory(e.target.value as any)}
              >
                <option value="Section 3A Notification">Section 3A Notification</option>
                <option value="Section 3D Declaration">Section 3D Declaration</option>
                <option value="Land Records (RTC/Khata)">Land Records (RTC / Khata)</option>
                <option value="Social Impact Assessment (SIA)">Social Impact Assessment (SIA)</option>
                <option value="Award Orders">Award Orders</option>
                <option value="Possession Orders">Possession Orders</option>
                <option value="R&R Entitlements">R&R Entitlements</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '3px' }}>
                File Format
              </label>
              <select
                className="gov-select"
                style={{ width: '100%' }}
                value={docFormat}
                onChange={(e) => setDocFormat(e.target.value as any)}
              >
                <option value="PDF">PDF (Portable Document)</option>
                <option value="GeoTIFF">GeoTIFF (Raster Cadastre)</option>
                <option value="DWG">DWG (AutoCAD Alignment)</option>
                <option value="DOCX">DOCX</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '3px' }}>
              Gazette Publication Ref / Order Number (Optional)
            </label>
            <input
              type="text"
              className="gov-input"
              style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
              placeholder="e.g. CG-DL-E-14092025-248102"
              value={docGazette}
              onChange={(e) => setDocGazette(e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
