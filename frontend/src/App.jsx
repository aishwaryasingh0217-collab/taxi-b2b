import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import DashboardOverview from './pages/DashboardOverview';
import VehicleManagement from './pages/VehicleManagement';
import DriverDirectory from './pages/DriverDirectory';
import ComplianceVault from './pages/ComplianceVault';

const MainLayout = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <Login />;
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Fleet Operations Dashboard';
      case 'vehicles': return 'Fleet Vehicle Registry';
      case 'drivers': return 'Driver Roster & Operations';
      case 'compliance': return 'Vehicle Compliance Vault';
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
