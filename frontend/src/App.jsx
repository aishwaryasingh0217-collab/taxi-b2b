import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import DashboardOverview from './pages/DashboardOverview';
import VehicleManagement from './pages/VehicleManagement';
import DriverDirectory from './pages/DriverDirectory';
import ComplianceVault from './pages/ComplianceVault';
import B2BDispatches from './pages/B2BDispatches';

const MainLayout = ({ onViewWebsite }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Fleet Operations Dashboard';
      case 'vehicles': return 'Fleet Cars & Vehicle Inventory';
      case 'drivers': return 'Drivers & Chauffeurs Directory';
      case 'compliance': return 'Car Papers & Expiry (RTO Compliance)';
      case 'dispatches': return 'Trips & Daily Duty (B2B Dispatches)';
      default: return 'Fleet Control Center';
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-content">
        <Header title={getPageTitle()} onViewWebsite={onViewWebsite} />
        {activeTab === 'dashboard' && <DashboardOverview setActiveTab={setActiveTab} />}
        {activeTab === 'vehicles' && <VehicleManagement />}
        {activeTab === 'drivers' && <DriverDirectory />}
        {activeTab === 'compliance' && <ComplianceVault />}
        {activeTab === 'dispatches' && <B2BDispatches />}
      </div>
    </div>
  );
};

const AppContent = () => {
  const { user } = useAuth();
  // If user is authenticated, default to console; if not, default to marketing website
  const [currentView, setCurrentView] = useState(() => (localStorage.getItem('access_token') ? 'console' : 'website'));

  // If user is logged in
  if (user) {
    if (currentView === 'website') {
      return (
        <LandingPage 
          onNavigateToLogin={() => setCurrentView('console')} 
        />
      );
    }
    return <MainLayout onViewWebsite={() => setCurrentView('website')} />;
  }

  // If user is NOT logged in:
  if (currentView === 'login') {
    return <Login onBackToWebsite={() => setCurrentView('website')} />;
  }

  return (
    <LandingPage 
      onNavigateToLogin={() => setCurrentView('login')} 
    />
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
