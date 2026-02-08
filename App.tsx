
import React, { useState } from 'react';
import Landing from './components/Landing';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

enum Screen {
  Landing,
  Auth,
  Dashboard
}

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.Landing);
  const [user, setUser] = useState<{ username: string } | null>(null);

  const handleEnterMissionControl = () => {
    setScreen(Screen.Auth);
  };

  const handleLogin = (userData: { username: string }) => {
    setUser(userData);
    setScreen(Screen.Dashboard);
  };

  const handleLogout = () => {
    setUser(null);
    setScreen(Screen.Landing);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950">
      {screen === Screen.Landing && <Landing onEnter={handleEnterMissionControl} />}
      {screen === Screen.Auth && (
        <Auth 
          onLogin={handleLogin} 
          onBack={() => setScreen(Screen.Landing)} 
        />
      )}
      {screen === Screen.Dashboard && user && (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
