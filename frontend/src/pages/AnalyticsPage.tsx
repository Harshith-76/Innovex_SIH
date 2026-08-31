import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectRiskAnalytics } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  Info,
  Clock,
  ChevronRight,
  ExternalLink,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { riskAnalytics, navigateToProject } = useApp();
  const [selectedRiskProj, setSelectedRiskProj] = useState<ProjectRiskAnalytics>(riskAnalytics[0]);

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Project Risk & Delay Analytics</h1>
          <p className="page-subtitle">
            Explainable rule-based bottleneck assessment across statutory milestones, compensation liquidity, and R&R handover schedules
          </p>
        </div>
      </div>

      {/* Methodology Notice Banner */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--gov-slate-200)',
          borderLeft: '4px solid var(--gov-blue-600)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <Info size={20} color="var(--gov-blue-600)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '11.5px', color: 'var(--gov-slate-700)', lineHeight: '1.45' }}>
          <strong>Deterministic Administrative Model:</strong> Risk indices are computed deterministically from 5 empirical metrics:
          (1) Compensation disbursement backlog, (2) Resettlement colony site allotment pace, (3) Section 3A/4 lapsing proximity, (4) Possession mahazar rate, and (5) Active inter-departmental NOC pendency.
        </div>
      </div>

      {/* Main Grid: Selected Project Deep Dive & Factors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px' }}>
        {/* Project Risk Breakdown Card */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gov-slate-500)', textTransform: 'uppercase' }}>
                Project Health Diagnostic
              </span>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gov-navy-900)' }}>
                {selectedRiskProj.projectName}
              </div>
            </div>
            <RiskBadge score={selectedRiskProj.riskScore} level={selectedRiskProj.riskLevel} />
          </div>

          {/* Core Diagnostic Metric Block */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '12px',
              backgroundColor: 'var(--gov-slate-50)',
              border: '1px solid var(--gov-slate-200)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px',
              marginBottom: '16px'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>Primary Bottleneck Cause</div>
              <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--gov-navy-900)', marginTop: '2px' }}>
                {selectedRiskProj.primaryIssue}
              </div>
            </div>
            <div style={{ borderLeft: '1px solid var(--gov-slate-200)', paddingLeft: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--gov-slate-500)' }}>Projected Schedule Impact</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gov-red-700)', marginTop: '2px' }}>
                {selectedRiskProj.expectedDelay}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--gov-slate-500)', marginTop: '2px' }}>
                Assessed: {selectedRiskProj.lastAssessment}
              </div>
            </div>
          </div>

          {/* Factor Breakdown List */}
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--gov-navy-900)', marginBottom: '10px' }}>
              Contributing Risk Factors & Empirical Weightages
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedRiskProj.factors.map((factor, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--gov-slate-200)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    fontSize: '11.5px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--gov-navy-900)' }}>
                      {factor.name} <span style={{ color: 'var(--gov-slate-400)', fontWeight: 400 }}>(Weight: {factor.weight})</span>
                    </span>
                    <StatusBadge status={factor.status === 'Critical' ? 'Critical' : factor.status === 'Warning' ? 'Warning' : 'Verified'} size="sm" />
                  </div>

                  {/* Impact Progress Bar */}
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--gov-slate-100)', borderRadius: '3px', overflow: 'hidden', margin: '4px 0 6px' }}>
                    <div
                      style={{
                        width: `${factor.impactScore}%`,
                        height: '100%',
                        backgroundColor: factor.impactScore > 75 ? 'var(--gov-red-600)' : factor.impactScore > 50 ? 'var(--gov-amber-500)' : 'var(--gov-green-600)'
                      }}
                    />
                  </div>

                  <div style={{ color: 'var(--gov-slate-600)', fontSize: '11px' }}>
                    {factor.details}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Trend & Historical Score Chart Panel */}
        <div className="gov-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="gov-card-header">
            <div className="gov-card-title">
              <TrendingUp size={16} color="var(--gov-blue-600)" />
              <span>5-Month Risk Index Trend</span>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '200px' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--gov-slate-600)', marginBottom: '12px' }}>
              Historical composite bottleneck score for <strong>{selectedRiskProj.projectName}</strong>
            </div>

            {/* Custom Bar/Line Trend Chart */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: '12px',
                height: '160px',
                padding: '10px 10px 0',
                borderBottom: '1px solid var(--gov-slate-300)',
                backgroundColor: 'var(--gov-slate-50)',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              {selectedRiskProj.trendData.map((pt) => {
                const heightPercent = (pt.score / 100) * 100;
                const barColor = pt.score > 70 ? 'var(--gov-red-600)' : pt.score > 45 ? 'var(--gov-amber-500)' : 'var(--gov-green-600)';
                return (
                  <div
                    key={pt.month}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flex: 1,
                      height: '100%',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: barColor, marginBottom: '4px' }}>
                      {pt.score}
                    </span>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '28px',
                        height: `${heightPercent}%`,
                        backgroundColor: barColor,
                        borderRadius: '3px 3px 0 0',
                        transition: 'height 0.3s ease'
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px 0', fontSize: '10.5px', color: 'var(--gov-slate-500)' }}>
              {selectedRiskProj.trendData.map(pt => (
                <span key={pt.month}>{pt.month}</span>
              ))}
            </div>

            <div
              style={{
                marginTop: '16px',
                padding: '10px',
                backgroundColor: 'var(--gov-slate-100)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                color: 'var(--gov-slate-700)'
              }}
            >
              <strong>Thresholds:</strong> 0–35 (Normal Flow) · 36–65 (Administrative Warning) · 66–100 (Critical Escalation Required).
            </div>
          </div>
        </div>
      </div>

      {/* Delay Projection Summary Table */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="gov-card-title">
            <BarChart3 size={16} color="var(--gov-navy-900)" />
            <span>Multi-Project Risk & Delay Projection Matrix</span>
          </div>
        </div>

        <div className="table-container">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Project Corridor</th>
                <th>District</th>
                <th style={{ textAlign: 'center' }}>Risk Score</th>
                <th>Risk Profile</th>
                <th>Primary Administrative Bottleneck</th>
                <th>Projected Schedule Delay</th>
                <th>Last Assessed</th>
                <th style={{ textAlign: 'center' }}>Inspect</th>
              </tr>
            </thead>
            <tbody>
              {riskAnalytics.map((item) => {
                const isSelected = item.projectId === selectedRiskProj.projectId;
                return (
                  <tr
                    key={item.projectId}
                    className="clickable"
                    style={{ backgroundColor: isSelected ? 'var(--gov-blue-50)' : undefined }}
                    onClick={() => setSelectedRiskProj(item)}
                  >
                    <td style={{ fontWeight: 600, color: 'var(--gov-navy-900)' }}>{item.projectName}</td>
                    <td>{item.district}</td>
                    <td style={{ textAlign: 'center', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      {item.riskScore} / 100
                    </td>
                    <td><RiskBadge score={item.riskScore} level={item.riskLevel} /></td>
                    <td style={{ maxWidth: '300px', fontSize: '11.5px' }}>{item.primaryIssue}</td>
                    <td style={{ fontWeight: 600, color: item.riskLevel === 'High' ? 'var(--gov-red-700)' : 'var(--gov-slate-700)' }}>
                      {item.expectedDelay}
                    </td>
                    <td style={{ fontSize: '10.5px', color: 'var(--gov-slate-500)' }}>{item.lastAssessment}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="gov-btn gov-btn-secondary gov-btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToProject(item.projectId);
                        }}
                      >
                        Workspace <ExternalLink size={11} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
