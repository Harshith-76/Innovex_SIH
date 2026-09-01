import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { LoginPage } from './pages/LoginPage';

// Pages
import { DistrictDashboardPage } from './pages/DistrictDashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ProjectRoutePage } from './pages/ProjectRoutePage';
import { GisParcelsPage } from './pages/GisParcelsPage';
import { WorkflowPage } from './pages/WorkflowPage';
import { CompensationPage } from './pages/CompensationPage';
import { AffectedFamiliesPage } from './pages/AffectedFamiliesPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { AlertsPage } from './pages/AlertsPage';
import { AdministrationPage } from './pages/AdministrationPage';

const MainContent: React.FC = () => {
  const { currentPage, canAccess, setCurrentPage, currentRole, t } = useApp();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'district-dashboard':
      case 'district-monitoring':
      case 'analytics':
        return <DistrictDashboardPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'project-detail':
        return <ProjectDetailPage />;
      case 'project-route':
        return <ProjectRoutePage />;
      case 'gis-parcels':
        return <GisParcelsPage />;
      case 'workflow':
        return <WorkflowPage />;
      case 'compensation':
        return <CompensationPage />;
      case 'affected-families':
        return <AffectedFamiliesPage />;
      case 'documents':
        return <DocumentsPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'administration':
        return <AdministrationPage />;
      case 'access-denied':
        return (
          <div className="page-body">
            <div className="gov-card" style={{ maxWidth: 620, margin: '64px auto', padding: 32, textAlign: 'center' }}>
              <h1 className="page-title">{t('page.access-denied', 'Access Denied')}</h1>
              <p className="page-subtitle" style={{ marginTop: 10 }}>
                {t('page.access-denied_message', 'You do not have permission to access this module.')}
              </p>
              {currentRole !== 'user' && (
                <button
                  className="gov-btn gov-btn-primary"
                  style={{ marginTop: 20 }}
                  onClick={() => {
                    const fallback = (['workflow', 'projects', 'compensation', 'gis-parcels', 'district-monitoring'] as const)
                      .find((page) => canAccess(page));
                    if (fallback) setCurrentPage(fallback);
                  }}
                >
                  {t('page.go_authorized', 'Go to an authorized module')}
                </button>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="app-main">
        <TopHeader />
        {renderCurrentPage()}
      </div>
    </div>
  );
};

const AppShell: React.FC = () => {
  const { currentUser, authLoading, login } = useApp();

  if (authLoading) return <div className="lp2-container" aria-label="Restoring secure session" />;
  if (!currentUser) return <LoginPage onLoginSuccess={login} />;

  return (
    <MainContent />
  );
};

export const App: React.FC = () => (
  <AppProvider>
    <AppShell />
  </AppProvider>
);

export default App;
