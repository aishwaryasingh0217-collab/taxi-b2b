import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import DashboardOverview from './pages/DashboardOverview';
import VehicleManagement from './pages/VehicleManagement';
import DriverDirectory from './pages/DriverDirectory';
import ComplianceVault from './pages/ComplianceVault';
import B2BDispatches from './pages/B2BDispatches';

const MainLayout = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <Login />;
  }

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
        <Header title={getPageTitle()} />
        {activeTab === 'dashboard' && <DashboardOverview setActiveTab={setActiveTab} />}
        {activeTab === 'vehicles' && <VehicleManagement />}
        {activeTab === 'drivers' && <DriverDirectory />}
        {activeTab === 'compliance' && <ComplianceVault />}
        {activeTab === 'dispatches' && <B2BDispatches />}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;
