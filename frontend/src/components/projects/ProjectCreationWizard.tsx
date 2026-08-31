import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { KARNATAKA_DISTRICTS, getDistrictCenter } from '../../data/karnatakaDistricts';
import { LandParcel } from '../../types';
import { LeafletGisMap } from '../gis/LeafletGisMap';
import { fetchParcels } from '../../services/api';
import { featureCollectionToLandParcels } from '../../utils/geoAdapter';
import {
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  X,
  Building2,
  FileText,
  Trash2,
  Compass,
  Layers,
  Search,
  Maximize2
} from 'lucide-react';

interface ProjectCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectCreationWizard: React.FC<ProjectCreationWizardProps> = ({ isOpen, onClose }) => {
  const { createProjectRecord } = useApp();

  // Step State: 1 = Details, 2 = Map Selection, 3 = Review
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [code, setCode] = useState<string>('KSHIP-KA-2026-001');
  const [name, setName] = useState<string>('');
  const [projectType, setProjectType] = useState<string>('Highway Infrastructure');
  const [agencyName, setAgencyName] = useState<string>('Karnataka State Highway Improvement Project (KSHIP)');
  const [state, setState] = useState<string>('Karnataka');
  const [district, setDistrict] = useState<string>('Bengaluru Rural');
  const [landRequiredAcres, setLandRequiredAcres] = useState<number>(150);
  const [estimatedCompensationCr, setEstimatedCompensationCr] = useState<number>(45.0);
  const [scope, setScope] = useState<string>('');

  // Map Selection State
  const [selectedParcelIds, setSelectedParcelIds] = useState<string[]>([]);
  const [parcelSearch, setParcelSearch] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [wizardParcels, setWizardParcels] = useState<LandParcel[]>([]);
  const [isParcelsLoading, setIsParcelsLoading] = useState<boolean>(false);
  const [parcelsError, setParcelsError] = useState<string | null>(null);

  // Fetch real cadastral parcels only on Step 2, using the same API + adapter as GIS.
  useEffect(() => {
    if (!isOpen || step !== 2 || !district) {
      return;
    }

    let cancelled = false;

    const loadDistrictParcels = async () => {
      setIsParcelsLoading(true);
      setParcelsError(null);
      setWizardParcels([]);
      try {
        const featureCollection = await fetchParcels({
          state: 'Karnataka',
          district
        });
        const adapted = featureCollectionToLandParcels(featureCollection);
        if (!cancelled) {
          setWizardParcels(adapted);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        if (!cancelled) {
          setWizardParcels([]);
          setParcelsError(errorMsg);
        }
      } finally {
        if (!cancelled) {
          setIsParcelsLoading(false);
        }
      }
    };

    void loadDistrictParcels();

    return () => {
      cancelled = true;
    };
  }, [isOpen, step, district]);

  // Handle District Change in Step 1
  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    setSelectedParcelIds([]); // Clear selection when district changes
  };

  // Filtered parcels for map / table search
  const filteredParcels = useMemo(() => {
    if (!parcelSearch.trim()) return wizardParcels;
    const q = parcelSearch.toLowerCase().trim();
    return wizardParcels.filter(
      (p) =>
        p.surveyNumber.toLowerCase().includes(q) ||
        p.village.toLowerCase().includes(q) ||
        p.taluk.toLowerCase().includes(q) ||
        p.parcelId.toLowerCase().includes(q)
    );
  }, [wizardParcels, parcelSearch]);

  // Selected Parcel Objects
  const selectedParcels = useMemo(() => {
    return wizardParcels.filter((p) => selectedParcelIds.includes(p.parcelId));
  }, [wizardParcels, selectedParcelIds]);

  // Computed Land Metrics
  const totalSelectedAcres = useMemo(() => {
    const sum = selectedParcels.reduce((acc, p) => acc + (p.areaAcres || 0), 0);
    return Number(sum.toFixed(2));
  }, [selectedParcels]);

  const remainingAcres = useMemo(() => {
    const diff = landRequiredAcres - totalSelectedAcres;
    return Number(diff.toFixed(2));
  }, [landRequiredAcres, totalSelectedAcres]);

  const isRequirementSatisfied = totalSelectedAcres >= landRequiredAcres;
  const progressPercent = Math.min(100, Math.round((totalSelectedAcres / (landRequiredAcres || 1)) * 100));

  // Toggle Parcel Selection on Map Click
  const handleParcelClick = (parcelId: string) => {
    setSelectedParcelIds((prev) =>
      prev.includes(parcelId) ? prev.filter((id) => id !== parcelId) : [...prev, parcelId]
    );
  };

  // Remove single parcel from table
  const handleRemoveParcel = (parcelId: string) => {
    setSelectedParcelIds((prev) => prev.filter((id) => id !== parcelId));
  };

  // Step 1 Validation
  const handleNextToMap = () => {
    setFormError(null);
    if (!code.trim()) {
      setFormError('Please enter a valid Project Reference Code.');
      return;
    }
    if (!name.trim()) {
      setFormError('Please enter the Project Full Title.');
      return;
    }
    if (!district) {
      setFormError('Please select a District in Karnataka.');
      return;
    }
    if (!landRequiredAcres || landRequiredAcres <= 0) {
      setFormError('Please specify valid Land Required in Acres.');
      return;
    }
    setStep(2);
  };

  // Step 2 Validation
  const handleNextToReview = () => {
    setFormError(null);
    if (selectedParcelIds.length === 0) {
      setFormError('Please select at least one cadastral parcel on the map before continuing.');
      return;
    }
    setStep(3);
  };

  // Final Project Submit
  const handleCreateProject = async () => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      await createProjectRecord({
        code: code.trim(),
        name: name.trim(),
        projectType,
        agencyName,
        state: 'Karnataka',
        district,
        landRequiredAcres,
        estimatedCompensationCr,
        scope,
        description: scope,
        selectedParcelIds
      });
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setFormError(`Failed to save project to database: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        style={{
          width: '95vw',
          maxWidth: '1400px',
          height: '90vh',
          maxHeight: '900px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid var(--gov-slate-200)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: 'var(--gov-navy-900)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '3px solid var(--gov-gold-500)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  backgroundColor: 'var(--gov-gold-500)',
                  color: 'var(--gov-navy-950)',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  letterSpacing: '0.5px'
                }}
              >
                GOVT OF KARNATAKA · LAND ACQUISITION
              </span>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
                Register New Land Acquisition Project
              </h2>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--gov-slate-300)', margin: '4px 0 0 0' }}>
              Database-Driven Map-First Land Selection & Cadastral Alignment Workflow
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--gov-slate-200)',
            backgroundColor: 'var(--gov-slate-50)'
          }}
        >
          <div
            onClick={() => setStep(1)}
            style={{
              flex: 1,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              backgroundColor: step === 1 ? '#ffffff' : 'transparent',
              borderBottom: step === 1 ? '3px solid var(--gov-navy-800)' : '3px solid transparent'
            }}
          >
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: step >= 1 ? 'var(--gov-navy-800)' : 'var(--gov-slate-300)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700
              }}
            >
              1
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: step === 1 ? 'var(--gov-navy-900)' : 'var(--gov-slate-600)' }}>
                Step 1: Project Details
              </div>
              <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>Metadata & Administrative Scope</div>
            </div>
          </div>

          <div
            onClick={() => {
              if (name.trim() && district) setStep(2);
            }}
            style={{
              flex: 1,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: name.trim() && district ? 'pointer' : 'not-allowed',
              backgroundColor: step === 2 ? '#ffffff' : 'transparent',
              borderBottom: step === 2 ? '3px solid var(--gov-navy-800)' : '3px solid transparent'
            }}
          >
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: step >= 2 ? 'var(--gov-navy-800)' : 'var(--gov-slate-300)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700
              }}
            >
              2
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: step === 2 ? 'var(--gov-navy-900)' : 'var(--gov-slate-600)' }}>
                Step 2: Map Land Selection
              </div>
              <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>
                Interactive GIS Cadastral Selection ({selectedParcelIds.length} Selected)
              </div>
            </div>
          </div>

          <div
            onClick={() => {
              if (selectedParcelIds.length > 0) setStep(3);
            }}
            style={{
              flex: 1,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: selectedParcelIds.length > 0 ? 'pointer' : 'not-allowed',
              backgroundColor: step === 3 ? '#ffffff' : 'transparent',
              borderBottom: step === 3 ? '3px solid var(--gov-navy-800)' : '3px solid transparent'
            }}
          >
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: step === 3 ? 'var(--gov-navy-800)' : 'var(--gov-slate-300)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700
              }}
            >
              3
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: step === 3 ? 'var(--gov-navy-900)' : 'var(--gov-slate-600)' }}>
                Step 3: Review & Save
              </div>
              <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>MongoDB Record Persistence</div>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {formError && (
          <div
            style={{
              padding: '10px 16px',
              backgroundColor: '#fef2f2',
              borderBottom: '1px solid #fca5a5',
              color: '#991b1b',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertTriangle size={16} />
            <span>{formError}</span>
          </div>
        )}

        {/* Wizard Content Body */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* STEP 1: PROJECT DETAILS */}
          {step === 1 && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gov-navy-900)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={18} color="var(--gov-navy-700)" />
                  Project Administrative Specifications
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--gov-slate-700)', marginBottom: '6px' }}>
                      PROJECT REFERENCE CODE <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="e.g. KSHIP-SH34-2026"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        border: '1px solid var(--gov-slate-300)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px',
                        fontWeight: 600
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--gov-slate-700)', marginBottom: '6px' }}>
                      PROJECT CATEGORY / ALIGNMENT TYPE
                    </label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        border: '1px solid var(--gov-slate-300)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px'
                      }}
                    >
                      <option value="Highway Infrastructure">State Highway Infrastructure</option>
                      <option value="National Highway Alignment">National Highway Alignment</option>
                      <option value="Railway Corridor Expansion">Railway Corridor Expansion</option>
                      <option value="Industrial Park & KIADB Layout">Industrial Park & KIADB Layout</option>
                      <option value="Irrigation Canal Alignment">Irrigation Canal Alignment</option>
                      <option value="Urban Expressway Bypass">Urban Expressway Bypass</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--gov-slate-700)', marginBottom: '6px' }}>
                    PROJECT FULL TITLE <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. SH-34 Ramanagara - Channapatna Bypass Corridor Widening"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      border: '1px solid var(--gov-slate-300)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--gov-slate-700)', marginBottom: '6px' }}>
                      IMPLEMENTING AGENCY
                    </label>
                    <input
                      type="text"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="e.g. Karnataka State Highway Improvement Project (KSHIP)"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        border: '1px solid var(--gov-slate-300)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--gov-slate-700)', marginBottom: '6px' }}>
                      STATE <span style={{ color: 'red' }}>*</span>
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        border: '1px solid var(--gov-slate-300)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px',
                        fontWeight: 600,
                        backgroundColor: 'var(--gov-slate-100)'
                      }}
                    >
                      <option value="Karnataka">Karnataka</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--gov-slate-700)', marginBottom: '6px' }}>
                      DISTRICT IN KARNATAKA <span style={{ color: 'red' }}>*</span>
                    </label>
                    <select
                      value={district}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        border: '2px solid var(--gov-navy-700)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px',
                        fontWeight: 700,
                        backgroundColor: '#eff6ff'
                      }}
                    >
                      {KARNATAKA_DISTRICTS.map((d) => (
                        <option key={d.code} value={d.name}>
                          {d.name} ({d.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--gov-slate-700)', marginBottom: '6px' }}>
                      LAND REQUIRED (ACRES) <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.1"
                      value={landRequiredAcres}
                      onChange={(e) => setLandRequiredAcres(parseFloat(e.target.value) || 0)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        border: '1px solid var(--gov-slate-300)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px',
                        fontWeight: 700
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--gov-slate-700)', marginBottom: '6px' }}>
                      ESTIMATED COMPENSATION (₹ CR)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={estimatedCompensationCr}
                      onChange={(e) => setEstimatedCompensationCr(parseFloat(e.target.value) || 0)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        border: '1px solid var(--gov-slate-300)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--gov-slate-700)', marginBottom: '6px' }}>
                    PROJECT SCOPE & ALIGNMENT SUMMARY
                  </label>
                  <textarea
                    rows={4}
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    placeholder="Provide background, corridor length, service road alignment requirements, or acquisition rationale..."
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      border: '1px solid var(--gov-slate-300)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '13px',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    onClick={onClose}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--gov-slate-300)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--gov-slate-700)',
                      cursor: 'pointer'
                    }}
                  >
                    CANCEL
                  </button>

                  <button
                    onClick={handleNextToMap}
                    style={{
                      padding: '10px 24px',
                      backgroundColor: 'var(--gov-navy-800)',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    CONTINUE TO MAP LAND SELECTION
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: MAP-FIRST LAND SELECTION */}
          {step === 2 && (
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              {/* Main GIS Map Panel */}
              <div style={{ flex: 1, position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Map Control Bar */}
                <div
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid var(--gov-slate-200)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    zIndex: 10
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        padding: '4px 10px',
                        backgroundColor: 'var(--gov-navy-900)',
                        color: '#ffffff',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <MapPin size={14} color="var(--gov-gold-400)" />
                      District: {district}
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--gov-slate-600)' }}>
                      Click cadastral parcels on map to add/remove from selection.
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ position: 'relative', width: '220px' }}>
                      <Search size={14} style={{ position: 'absolute', left: '8px', top: '9px', color: 'var(--gov-slate-400)' }} />
                      <input
                        type="text"
                        placeholder="Search survey no / village..."
                        value={parcelSearch}
                        onChange={(e) => setParcelSearch(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '6px 8px 6px 28px',
                          fontSize: '11px',
                          border: '1px solid var(--gov-slate-300)',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      />
                    </div>

                    {selectedParcelIds.length > 0 && (
                      <button
                        onClick={() => setSelectedParcelIds([])}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#fef2f2',
                          border: '1px solid #fca5a5',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#991b1b',
                          cursor: 'pointer'
                        }}
                      >
                        CLEAR SELECTION
                      </button>
                    )}
                  </div>
                </div>

                {/* Leaflet Map Container */}
                <div style={{ flex: 1, position: 'relative' }}>
                  {isParcelsLoading && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 900,
                        backgroundColor: 'rgba(255, 255, 255, 0.75)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <div className="animate-spin" style={{ width: '24px', height: '24px', border: '3px solid var(--gov-navy-800)', borderTopColor: 'transparent', borderRadius: '50%' }} />
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gov-navy-900)' }}>
                        Loading cadastral parcels...
                      </div>
                    </div>
                  )}

                  {!isParcelsLoading && parcelsError && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 900,
                        backgroundColor: '#ffffff',
                        border: '1px solid #fca5a5',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px 24px',
                        boxShadow: 'var(--shadow-md)',
                        color: '#991b1b',
                        fontSize: '12px',
                        fontWeight: 600,
                        textAlign: 'center'
                      }}
                    >
                      Unable to load cadastral parcels from database.
                    </div>
                  )}

                  {!isParcelsLoading && !parcelsError && wizardParcels.length === 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 900,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid var(--gov-slate-300)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px 24px',
                        boxShadow: 'var(--shadow-lg)',
                        textAlign: 'center',
                        pointerEvents: 'none'
                      }}
                    >
                      <div style={{ fontWeight: 700, color: 'var(--gov-navy-900)', fontSize: '13px' }}>
                        No cadastral parcels found for this district.
                      </div>
                    </div>
                  )}

                  <LeafletGisMap
                    key={district}
                    parcels={filteredParcels}
                    selectedParcelId={selectedParcelIds[selectedParcelIds.length - 1] || null}
                    selectedParcelIds={selectedParcelIds}
                    onSelectParcel={handleParcelClick}
                    viewCenter={getDistrictCenter(district)}
                    showEmptyState={false}
                    height="100%"
                    showLegend={true}
                    showLayerToggle={true}
                  />
                </div>
              </div>

              {/* Right Side Selected Land Panel */}
              <div
                style={{
                  width: '420px',
                  backgroundColor: '#ffffff',
                  borderLeft: '1px solid var(--gov-slate-200)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
              >
                {/* Metrics Header */}
                <div style={{ padding: '16px', backgroundColor: 'var(--gov-slate-50)', borderBottom: '1px solid var(--gov-slate-200)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gov-navy-900)', margin: '0 0 12px 0' }}>
                    Selected Land Requirement Status
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gov-slate-200)' }}>
                      <div style={{ fontSize: '10px', color: 'var(--gov-slate-500)', fontWeight: 600 }}>LAND REQUIRED</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--gov-navy-900)' }}>{landRequiredAcres.toFixed(2)} <span style={{ fontSize: '11px', fontWeight: 500 }}>acres</span></div>
                    </div>

                    <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gov-slate-200)' }}>
                      <div style={{ fontSize: '10px', color: 'var(--gov-slate-500)', fontWeight: 600 }}>SELECTED LAND</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: totalSelectedAcres >= landRequiredAcres ? '#15803d' : '#1e40af' }}>
                        {totalSelectedAcres.toFixed(2)} <span style={{ fontSize: '11px', fontWeight: 500 }}>acres</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>
                      <span style={{ color: 'var(--gov-slate-600)' }}>Target Satisfaction</span>
                      <span style={{ color: isRequirementSatisfied ? '#15803d' : '#b45309' }}>
                        {progressPercent}% ({selectedParcelIds.length} Parcels)
                      </span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--gov-slate-200)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${progressPercent}%`,
                          backgroundColor: isRequirementSatisfied ? '#22c55e' : '#f59e0b',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>

                  {/* Satisfaction Alert Badge */}
                  {isRequirementSatisfied ? (
                    <div
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #86efac',
                        borderRadius: 'var(--radius-sm)',
                        color: '#166534',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <CheckCircle2 size={16} color="#166534" />
                      <span>LAND REQUIREMENT SATISFIED</span>
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#fffbe5',
                        border: '1px solid #fef08a',
                        borderRadius: 'var(--radius-sm)',
                        color: '#854d0e',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <AlertTriangle size={16} color="#854d0e" />
                      <span>REQUIREMENT NOT MET ({remainingAcres.toFixed(2)} acres remaining)</span>
                    </div>
                  )}
                </div>

                {/* Selected Parcels Table */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gov-navy-900)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Selected Parcels ({selectedParcels.length})</span>
                    <span style={{ fontSize: '11px', color: 'var(--gov-slate-500)', fontWeight: 400 }}>Click trash to deselect</span>
                  </div>

                  {selectedParcels.length === 0 ? (
                    <div
                      style={{
                        padding: '32px 16px',
                        textAlign: 'center',
                        color: 'var(--gov-slate-400)',
                        fontSize: '12px',
                        border: '1px dashed var(--gov-slate-300)',
                        borderRadius: 'var(--radius-md)',
                        margin: '8px 0'
                      }}
                    >
                      No cadastral parcels selected yet.
                      <br />
                      Click parcel boundaries on the map to begin.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {selectedParcels.map((pcl) => (
                        <div
                          key={pcl.parcelId}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: '#ffffff',
                            border: '1px solid var(--gov-slate-200)',
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>
                              Survey No: {pcl.surveyNumber}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--gov-slate-600)' }}>
                              {pcl.village}, {pcl.taluk}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--gov-navy-800)', fontWeight: 600, marginTop: '2px' }}>
                              {pcl.areaAcres} Acres · {pcl.landType}
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveParcel(pcl.parcelId)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              padding: '4px',
                              borderRadius: '4px'
                            }}
                            title="Deselect parcel"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div style={{ padding: '12px 16px', borderTop: '1px solid var(--gov-slate-200)', backgroundColor: '#ffffff', display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setStep(1)}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--gov-slate-300)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--gov-slate-700)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <ArrowLeft size={14} />
                    BACK
                  </button>

                  <button
                    onClick={handleNextToReview}
                    disabled={selectedParcelIds.length === 0}
                    style={{
                      flex: 1,
                      padding: '8px 16px',
                      backgroundColor: selectedParcelIds.length > 0 ? 'var(--gov-navy-800)' : 'var(--gov-slate-300)',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#ffffff',
                      cursor: selectedParcelIds.length > 0 ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    CONFIRM LAND SELECTION
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PROJECT REVIEW & SAVE */}
          {step === 3 && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gov-navy-900)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} color="var(--gov-navy-700)" />
                  Review Project & Selected Land Proposal
                </h3>

                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--gov-slate-200)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    marginBottom: '20px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)', fontWeight: 600 }}>PROJECT REFERENCE CODE</div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--gov-navy-900)' }}>{code}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)', fontWeight: 600 }}>PROJECT CATEGORY</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gov-slate-800)' }}>{projectType}</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)', fontWeight: 600 }}>PROJECT FULL TITLE</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gov-navy-950)' }}>{name}</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px', padding: '12px', backgroundColor: 'var(--gov-slate-50)', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)', fontWeight: 600 }}>STATE / DISTRICT</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>{state} · {district}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)', fontWeight: 600 }}>TARGET REQUIRED</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>{landRequiredAcres.toFixed(2)} Acres</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)', fontWeight: 600 }}>SELECTED LAND</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#15803d' }}>
                        {totalSelectedAcres.toFixed(2)} Acres ({selectedParcelIds.length} Parcels)
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)', fontWeight: 600 }}>IMPLEMENTING AGENCY</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gov-slate-800)' }}>{agencyName}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)', fontWeight: 600 }}>ESTIMATED COMPENSATION</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>₹{estimatedCompensationCr} Crore</div>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gov-navy-900)', marginBottom: '8px' }}>
                    Selected Cadastral Parcels Breakdown ({selectedParcels.length})
                  </h4>
                  <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--gov-slate-200)', borderRadius: 'var(--radius-sm)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead style={{ backgroundColor: 'var(--gov-slate-100)', position: 'sticky', top: 0 }}>
                        <tr>
                          <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700 }}>Survey No</th>
                          <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700 }}>Village</th>
                          <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700 }}>Taluk</th>
                          <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>Area (Acres)</th>
                          <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700 }}>Land Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedParcels.map((p) => (
                          <tr key={p.parcelId} style={{ borderBottom: '1px solid var(--gov-slate-200)' }}>
                            <td style={{ padding: '8px 12px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>{p.surveyNumber}</td>
                            <td style={{ padding: '8px 12px' }}>{p.village}</td>
                            <td style={{ padding: '8px 12px' }}>{p.taluk}</td>
                            <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>{p.areaAcres}</td>
                            <td style={{ padding: '8px 12px' }}>{p.landType}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                  <button
                    onClick={() => setStep(2)}
                    style={{
                      padding: '10px 18px',
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--gov-slate-300)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--gov-slate-700)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <ArrowLeft size={16} />
                    BACK TO MAP SELECTION
                  </button>

                  <button
                    onClick={handleCreateProject}
                    disabled={isSubmitting}
                    style={{
                      padding: '10px 28px',
                      backgroundColor: 'var(--gov-green-700, #15803d)',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '13px',
                      fontWeight: 800,
                      color: '#ffffff',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: 'var(--shadow-md)'
                    }}
                  >
                    {isSubmitting ? 'SAVING TO MONGODB...' : 'CREATE PROJECT & PERSIST RECORD'}
                    <CheckCircle2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
