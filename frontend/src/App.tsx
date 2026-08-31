import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { LoginPage } from './pages/LoginPage';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ProjectRoutePage } from './pages/ProjectRoutePage';
import { GisParcelsPage } from './pages/GisParcelsPage';
import { WorkflowPage } from './pages/WorkflowPage';
import { CompensationPage } from './pages/CompensationPage';
import { AffectedFamiliesPage } from './pages/AffectedFamiliesPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { AlertsPage } from './pages/AlertsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AdministrationPage } from './pages/AdministrationPage';

const MainContent: React.FC = () => {
  const { currentPage } = useApp();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
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
      case 'analytics':
        return <AnalyticsPage />;
      case 'administration':
        return <AdministrationPage />;
      default:
        return <DashboardPage />;
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

export const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={(_username) => setIsLoggedIn(true)} />;
  }

  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;

