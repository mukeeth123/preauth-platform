
import React, { useState } from 'react';
import { PreauthForm } from './components/PreauthForm';
import { DecisionDisplay } from './components/DecisionDisplay';
import { PolicyEditor } from './components/PolicyEditor';
import { AuditLogViewer } from './components/AuditLogViewer';
import { LoginPage } from './components/LoginPage';
import { AdminPage } from './components/AdminPage';
import { PreauthRequest, PreauthDecision, UserRole } from './types';
import * as api from './services/mockApiService';
import { Button } from './components/common/Button';
import { Toast } from './components/common/Toast';

type View = 'form' | 'decision' | 'policies' | 'audit' | 'admin';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('standard');
  const [currentView, setCurrentView] = useState<View>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [decision, setDecision] = useState<PreauthDecision | null>(null);
  const [resubmitData, setResubmitData] = useState<PreauthDecision | undefined>(undefined);
  const [selectedPolicyForEditor, setSelectedPolicyForEditor] = useState<string | undefined>();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSubmit = async (request: PreauthRequest) => {
    setIsLoading(true);
    try {
      const result = await api.validatePreauth(request);
      setDecision(result);
      setCurrentView('decision');
      setResubmitData(undefined); // Clear any previous resubmit data
    } catch (error) {
      console.error("Validation failed:", error);
      alert("An error occurred during validation. Please check the console.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResubmit = (decisionToResubmit: PreauthDecision) => {
    setResubmitData(decisionToResubmit);
    setCurrentView('form');
  };

  const handleNewRequest = () => {
    setDecision(null);
    setResubmitData(undefined);
    setCurrentView('form');
  };

  const handleSubmitPreauth = async (decisionToSubmit: PreauthDecision) => {
    setToastMessage('Submitting preauthorization to payer...');
    setShowToast(true);
    
    try {
      await api.submitPreauthorization(decisionToSubmit);
      
      // Hide first toast and navigate
      setShowToast(false);
      setCurrentView('form');
      setDecision(null);
      setResubmitData(undefined);
      
      // Show success toast after navigation
      setTimeout(() => {
        setToastMessage('Submitted to Payer');
        setShowToast(true);
      }, 100);
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('standard');
    // Optionally clear state
    setCurrentView('form');
    setDecision(null);
    setResubmitData(undefined);
  };

  const handleNavigate = (view: View, policyId?: string) => {
    setResubmitData(undefined); // always clear when navigating
    setDecision(null); // Clear decision when navigating away
    setSelectedPolicyForEditor(policyId);
    setCurrentView(view);
  };

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLogin} />;
  }


  const renderView = () => {
    switch (currentView) {
      case 'decision':
        return decision && <DecisionDisplay decision={decision} onResubmit={handleResubmit} onNewRequest={handleNewRequest} onSubmit={handleSubmitPreauth} />;
      case 'policies':
        return <PolicyEditor initialPolicyId={selectedPolicyForEditor} />;
      case 'audit':
        return <AuditLogViewer />;
       case 'admin':
        return <AdminPage />;
      case 'form':
      default:
        return <PreauthForm 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
            initialData={resubmitData} 
            onNavigateToPolicy={(policyId) => handleNavigate('policies', policyId)}
        />;
    }
  };

  const NavItem: React.FC<{ view: View, label: string }> = ({ view, label }) => (
    <button
      onClick={() => handleNavigate(view)}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        currentView === view
          ? 'bg-blue-600 text-white'
          : 'text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  const isAdmin = userRole === 'admin' || userRole === 'policy_ops';

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h1 className="text-xl font-bold text-gray-800">AI Preauthorization Platform</h1>
          </div>
          <div className="flex items-center space-x-4">
            <NavItem view="form" label="Preauthorization" />
            <NavItem view="policies" label="Policy Editor" />
            <NavItem view="audit" label="Audit Log" />
            {isAdmin && <NavItem view="admin" label="Admin" />}
            <Button variant="secondary" onClick={handleLogout} className="text-sm">Logout</Button>
          </div>
        </nav>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {renderView()}
      </main>
    </div>
  );
};

export default App;