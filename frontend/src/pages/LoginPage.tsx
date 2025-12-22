import { useState, type FormEvent } from 'react';
import { Link2, Mail, ArrowRight, Loader2, UserPlus } from 'lucide-react';
import { getErrorMessage } from '../services/api';
import type { User } from '../types';

interface LoginPageProps {
  onLogin: (email: string) => Promise<User>;
  onRegister: (email: string) => Promise<User>;
}

export function LoginPage({ onLogin, onRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        await onLogin(email.trim());
      } else {
        await onRegister(email.trim());
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setError(null);
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo">
              <Link2 size={32} strokeWidth={2.5} />
            </div>
            <h1>Link Manager</h1>
            <p>
              {mode === 'login'
                ? 'Sign in to manage your knowledge base'
                : 'Create an account to get started'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="error-message">
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="spinner" size={20} />
              ) : (
                <>
                  {mode === 'login' ? 'Continue' : 'Create Account'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <button type="button" onClick={toggleMode} className="toggle-mode">
              {mode === 'login' ? (
                <>
                  <UserPlus size={16} />
                  <span>Need an account? Register</span>
                </>
              ) : (
                <>
                  <Mail size={16} />
                  <span>Already have an account? Sign in</span>
                </>
              )}
            </button>
          </div>

          <div className="demo-hint">
            <p>Demo accounts: <code>demo@example.com</code> or <code>test@example.com</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
