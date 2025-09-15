import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/screens/LoginScreen';
import { MainScreen } from './components/screens/MainScreen';
import { UserRole } from './types';
import { ToastProvider } from './context/ToastContext';

function App() {
  const [view, setView] = useState<'login' | 'app'>('login');
  const [userRole, setUserRole] = useState<UserRole>('customer');
  // Add a key to force remounting MainScreen on login, ensuring it starts from the top.
  const [appKey, setAppKey] = useState(0);

  useEffect(() => {
    if (view === 'app') {
      // When the main application is active, we prevent the body from scrolling,
      // as the inner layout handles its own scrolling.
      document.body.style.overflow = 'hidden';
      // We also ensure the window is scrolled to the top to prevent a scrolled-down view.
      window.scrollTo(0, 0);
    } else {
      // When on the login screen, we restore the default body scroll behavior.
      document.body.style.overflow = 'auto';
    }

    // Cleanup function to restore default behavior when the component unmounts.
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [view]);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setView('app');
    // By changing the key, we ensure MainScreen is completely remounted.
    setAppKey(prevKey => prevKey + 1);
  };

  const handleLogout = () => {
    setView('login');
  };

  return (
    <ToastProvider>
      {view === 'login' ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <MainScreen key={appKey} userRole={userRole} onLogout={handleLogout} />
      )}
    </ToastProvider>
  );
}

export default App;
