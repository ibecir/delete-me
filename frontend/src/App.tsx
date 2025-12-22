import { useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { Loader2 } from 'lucide-react';
import './App.css';

function App() {
  const { user, isLoading, isAuthenticated, login, register, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="app-loading">
        <Loader2 className="spinner" size={40} />
        <span>Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <LoginPage onLogin={login} onRegister={register} />;
  }

  return <DashboardPage user={user} onLogout={logout} />;
}

export default App
