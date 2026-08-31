import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { alerts, resolveAlert, setCurrentPage, setSelectedProjectId, setSelectedParcelId } = useApp();

  if (!isOpen) return null;

  const unreadAlerts = alerts.filter(a => a.status !== 'Resolved');

  return (
    <div
      style={{
        position: 'absolute',
        top: '56px',
        right: '20px',
        width: '380px',
        maxHeight: '520px',
        backgroundColor: '#ffffff',
        border: '1px solid var(--gov-slate-200)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--gov-slate-200)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--gov-slate-50)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={16} color="var(--gov-navy-900)" />
          <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--gov-navy-900)' }}>
            Operational Alerts
          </span>
          <span
            style={{
              backgroundColor: 'var(--gov-red-600)',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: '10px'
            }}
          >
            {unreadAlerts.length}
          </span>
        </div>
        <button
          className="gov-btn gov-btn-secondary gov-btn-sm"
          onClick={() => {
            onClose();
            setCurrentPage('alerts');
          }}
        >
          View All
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {unreadAlerts.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--gov-slate-500)' }}>
            <CheckCircle2 size={32} color="var(--gov-green-600)" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontSize: '12px' }}>No pending critical administrative alerts.</p>
          </div>
        ) : (
          unreadAlerts.slice(0, 5).map((alert) => (
            <div
              key={alert.id}
              className={`alert-item ${alert.category}`}
              style={{ padding: '8px 10px', fontSize: '11.5px' }}
            >
              <div style={{ marginTop: '2px' }}>
                {alert.category === 'Critical' && <AlertCircle size={15} color="var(--gov-red-600)" />}
                {alert.category === 'Warning' && <AlertTriangle size={15} color="var(--gov-amber-600)" />}
                {alert.category === 'Information' && <Info size={15} color="var(--gov-blue-600)" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--gov-slate-900)' }}>{alert.title}</div>
                <div style={{ color: 'var(--gov-slate-500)', fontSize: '10.5px', marginTop: '2px' }}>
                  {alert.projectName} {alert.surveyNumber ? `· Sy.No. ${alert.surveyNumber}` : ''}
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  <button
                    className="gov-btn gov-btn-secondary gov-btn-sm"
                    style={{ fontSize: '10px', padding: '2px 6px' }}
                    onClick={() => {
                      onClose();
                      setSelectedProjectId(alert.projectId);
                      if (alert.parcelId) setSelectedParcelId(alert.parcelId);
                      setCurrentPage('project-detail');
                    }}
                  >
                    Inspect <ExternalLink size={10} />
                  </button>
                  <button
                    className="gov-btn gov-btn-primary gov-btn-sm"
                    style={{ fontSize: '10px', padding: '2px 6px' }}
                    onClick={() => resolveAlert(alert.id, 'Actioned directly via quick notification popover.')}
                  >
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div
        style={{
          padding: '8px 14px',
          borderTop: '1px solid var(--gov-slate-200)',
          backgroundColor: 'var(--gov-slate-50)',
          fontSize: '11px',
          color: 'var(--gov-slate-500)',
          textAlign: 'center'
        }}
      >
        Real-time feed synced with District Collectorate portal
      </div>
    </div>
  );
};
