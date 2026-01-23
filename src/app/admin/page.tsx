'use client';

import { useState } from 'react';
import AdminLayout from './components/AdminLayout';
import PlanManager from './components/PlanManager';
import DashboardOverview from './components/DashboardOverview';
import ModsManager from './components/ModsManager';
import UsersManager from './components/UserManagement';

export default function Page() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && (
        <DashboardOverview onEditPlans={() => setActiveTab('plans')} />
      )}
      {activeTab === 'plans' && <PlanManager />}
      {activeTab === 'users' && <UsersManager/>}
      {activeTab === 'mods' && <ModsManager/>}
    </AdminLayout>
  );
}
