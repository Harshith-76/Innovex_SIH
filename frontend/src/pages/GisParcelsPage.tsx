import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LeafletGisMap } from '../components/gis/LeafletGisMap';
import { ParcelDetailDrawer } from '../components/gis/ParcelDetailDrawer';
import { ParcelStatus } from '../types';
import {
  MapPin,
  Filter,
  Search,
  Layers,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  FileCheck2
} from 'lucide-react';

export const GisParcelsPage: React.FC = () => {
  const {
    parcels,
    selectedParcelId,
    setSelectedParcelId,
    activeParcel,
    projects,
    selectedProjectId,
    setSelectedProjectId
  } = useApp();

  // Filters
  const [filterState, setFilterState] = useState('Karnataka');
  const [filterDistrict, setFilterDistrict] = useState('ALL');
  const [filterTaluk, setFilterTaluk] = useState('ALL');
  const [filterVillage, setFilterVillage] = useState('ALL');
  const [filterSearch, setFilterSearch] = useState('');
  const [filterLandType, setFilterLandType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterHissaOnly, setFilterHissaOnly] = useState<string>('ALL');

  // Dynamic filter options based on available parcel data
  const dynamicDistricts = Array.from(new Set(parcels.map((p) => p.district).filter(Boolean)));
  const dynamicTaluks = Array.from(new Set(parcels.map((p) => p.taluk).filter(Boolean)));
  const dynamicVillages = Array.from(new Set(parcels.map((p) => p.village).filter(Boolean)));

  const filteredParcels = parcels.filter((p) => {
    const matchesDistrict = filterDistrict === 'ALL' || p.district === filterDistrict;
    const matchesTaluk = filterTaluk === 'ALL' || p.taluk === filterTaluk;
    const matchesVillage = filterVillage === 'ALL' || p.village === filterVillage;
    const matchesLandType = filterLandType === 'ALL' || p.landType === filterLandType;
    const matchesStatus = filterStatus === 'ALL' || p.acquisitionStatus === filterStatus;
    const matchesHissa =
      filterHissaOnly === 'ALL' ||
      (filterHissaOnly === 'WITH_HISSA' && p.hasHissa) ||
      (filterHissaOnly === 'WITHOUT_HISSA' && !p.hasHissa);

    if (!matchesDistrict || !matchesTaluk || !matchesVillage || !matchesLandType || !matchesStatus || !matchesHissa) {
      return false;
    }

    if (!filterSearch || !filterSearch.trim()) {
      return true;
    }

    const q = filterSearch.trim().toLowerCase();

    // 1. Survey Number match
    if (p.surveyNumber.toLowerCase().includes(q)) return true;

    // 2. Parcel ID / Cadastral ID / ULPIN match
    if (p.parcelId.toLowerCase().includes(q)) return true;
    if (p.cadastralId && p.cadastralId.toLowerCase().includes(q)) return true;
    if (p.ulpin && p.ulpin.toLowerCase().includes(q)) return true;

    // 3. Owner Name match
    if (p.ownerName && p.ownerName.toLowerCase().includes(q)) return true;

    // 4. Detailed Hissa Records & Hissa Owner match
    if (p.hissaRecords && p.hissaRecords.length > 0) {
      const hissaMatch = p.hissaRecords.some((h) => {
        const hissaNo = String(h.hissa_no).toLowerCase();
        const hissaId = String(h.hissa_id).toLowerCase();
        const ownerName = (h.owner?.name || '').toLowerCase();
        const ownerId = (h.owner?.owner_id || h.owner_id || '').toLowerCase();
        const ownerMobile = (h.owner?.mobile || '').toLowerCase();
        const ownerAddress = (h.owner?.address || '').toLowerCase();

        return (
          hissaNo === q ||
          `hissa ${hissaNo}`.includes(q) ||
          `hissa ${hissaNo}` === q ||
          `hissa ${hissaNo}`.replace(/\s+/g, '') === q.replace(/\s+/g, '') ||
          `/${hissaNo}`.includes(q) ||
          hissaId.includes(q) ||
          ownerName.includes(q) ||
          ownerId.includes(q) ||
          ownerMobile.includes(q) ||
          ownerAddress.includes(q)
        );
      });
      if (hissaMatch) return true;
    }

    return false;
  });

  const resetFilters = () => {
    setFilterState('Karnataka');
    setFilterDistrict('ALL');
    setFilterTaluk('ALL');
    setFilterVillage('ALL');
    setFilterSearch('');
    setFilterLandType('ALL');
    setFilterStatus('ALL');
    setFilterHissaOnly('ALL');
  };

  const hissaLinkedCount = parcels.filter(p => p.hasHissa).length;

  return (
    <div className="gis-layout">
      {/* Left Filter Sidebar */}
      <div className="gis-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '13px', color: 'var(--gov-navy-900)' }}>
            <SlidersHorizontal size={15} /> Cadastral Filters
          </div>
          <button
            className="gov-btn gov-btn-secondary gov-btn-sm"
            onClick={resetFilters}
            title="Reset Filters"
            style={{ padding: '2px 6px', fontSize: '10px' }}
          >
            <RotateCcw size={11} /> Reset
          </button>
        </div>

        {/* Project Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-600)', marginBottom: '3px' }}>
            Infrastructure Project
          </label>
          <select
            className="gov-select"
            style={{ width: '100%' }}
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            ))}
          </select>
        </div>

        {/* Multi-attribute Search Input */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-600)', marginBottom: '3px' }}>
            Search Survey / Hissa / Owner / ULPIN
          </label>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: '8px', color: 'var(--gov-slate-400)' }} />
            <input
              type="text"
              className="gov-input"
              style={{ width: '100%', paddingLeft: '26px' }}
              placeholder="e.g. 307, Hissa 2, Shetty, ULPIN..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Hissa Data Availability Filter */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-600)', marginBottom: '3px' }}>
            Hissa Sub-division Records
          </label>
          <select
            className="gov-select"
            style={{ width: '100%' }}
            value={filterHissaOnly}
            onChange={(e) => setFilterHissaOnly(e.target.value)}
          >
            <option value="ALL">All Cadastral Parcels ({parcels.length})</option>
            <option value="WITH_HISSA">With Verified Hissa Records ({hissaLinkedCount})</option>
            <option value="WITHOUT_HISSA">Standard Parcels (Hissa Sync Pending)</option>
          </select>
        </div>

        {/* State */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-600)', marginBottom: '3px' }}>
            State
          </label>
          <select
            className="gov-select"
            style={{ width: '100%' }}
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
          >
            <option value="Karnataka">Karnataka</option>
          </select>
        </div>

        {/* District */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-600)', marginBottom: '3px' }}>
            District
          </label>
          <select
            className="gov-select"
            style={{ width: '100%' }}
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
          >
            <option value="ALL">All Districts</option>
            {dynamicDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Taluk */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-600)', marginBottom: '3px' }}>
            Taluk
          </label>
          <select
            className="gov-select"
            style={{ width: '100%' }}
            value={filterTaluk}
            onChange={(e) => setFilterTaluk(e.target.value)}
          >
            <option value="ALL">All Taluks</option>
            {dynamicTaluks.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Village */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-600)', marginBottom: '3px' }}>
            Revenue Village
          </label>
          <select
            className="gov-select"
            style={{ width: '100%' }}
            value={filterVillage}
            onChange={(e) => setFilterVillage(e.target.value)}
          >
            <option value="ALL">All Villages</option>
            {dynamicVillages.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Land Type */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-600)', marginBottom: '3px' }}>
            Land Type / Classification
          </label>
          <select
            className="gov-select"
            style={{ width: '100%' }}
            value={filterLandType}
            onChange={(e) => setFilterLandType(e.target.value)}
          >
            <option value="ALL">All Classifications</option>
            <option value="Agricultural">Agricultural</option>
            <option value="Commercial">Commercial</option>
            <option value="Residential">Residential</option>
            <option value="Government">Government / Gomal</option>
            <option value="Forest">Forest / Wetland</option>
          </select>
        </div>

        {/* Acquisition Status */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-600)', marginBottom: '3px' }}>
            Acquisition Status
          </label>
          <select
            className="gov-select"
            style={{ width: '100%' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="Notification">Notification</option>
            <option value="Under Acquisition">Under Acquisition</option>
            <option value="Compensation Pending">Compensation Pending</option>
            <option value="Possession Pending">Possession Pending</option>
            <option value="R&R Pending">R&R Pending</option>
            <option value="Acquired">Acquired</option>
          </select>
        </div>

        {/* Filter Summary Stats */}
        <div
          style={{
            marginTop: 'auto',
            padding: '10px 12px',
            backgroundColor: 'var(--gov-slate-50)',
            border: '1px solid var(--gov-slate-200)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px'
          }}
        >
          <div style={{ color: 'var(--gov-slate-500)' }}>Visible Parcels on Cadastre:</div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gov-navy-900)', marginTop: '2px' }}>
            {filteredParcels.length} Polygons
          </div>
          <div style={{ fontSize: '10.5px', color: 'var(--gov-slate-600)', marginTop: '2px' }}>
            Total Extent: {filteredParcels.reduce((sum, p) => sum + p.areaAcres, 0).toFixed(1)} Acres
          </div>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="gis-map-container">
        <LeafletGisMap
          parcels={filteredParcels}
          selectedParcelId={selectedParcelId}
          onSelectParcel={(id) => setSelectedParcelId(id)}
          height="100%"
          showLegend={true}
          showLayerToggle={true}
        />
      </div>

      {/* Right Drawer: Selected Parcel Detail Inspector */}
      {activeParcel && (
        <ParcelDetailDrawer
          parcel={activeParcel}
          onClose={() => setSelectedParcelId(null)}
        />
      )}
    </div>
  );
};
