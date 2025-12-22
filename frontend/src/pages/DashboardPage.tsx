import { useEffect, useState } from 'react';
import {
  Link2,
  Clock,
  CheckCircle,
  Loader,
  LogOut,
  Plus,
  RefreshCw,
} from 'lucide-react';
import type { User } from '../types';
import { useLinks } from '../hooks/useLinks';
import { LinkList } from '../components/LinkList';
import { AddLinkModal } from '../components/AddLinkModal';
import { StatsCard } from '../components/StatsCard';

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
}

export function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const {
    links,
    stats,
    isLoading,
    error,
    fetchLinks,
    fetchStats,
    createLink,
    updateLink,
    deleteLink,
    clearError,
  } = useLinks();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchLinks();
    fetchStats();
  }, [fetchLinks, fetchStats]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchLinks(), fetchStats()]);
    setIsRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <Link2 size={28} strokeWidth={2.5} />
          </div>
          <div className="header-info">
            <h1>Link Manager</h1>
            <span className="user-email">{user.email}</span>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="icon-button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh"
          >
            <RefreshCw size={20} className={isRefreshing ? 'spinning' : ''} />
          </button>
          <button className="logout-button" onClick={onLogout}>
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={clearError}>Dismiss</button>
          </div>
        )}

        <section className="stats-section">
          <div className="stats-grid">
            <StatsCard
              title="Total Links"
              value={stats?.total_links ?? 0}
              icon={<Link2 size={24} />}
              color="blue"
            />
            <StatsCard
              title="Pending"
              value={stats?.status_breakdown.pending ?? 0}
              icon={<Clock size={24} />}
              color="amber"
            />
            <StatsCard
              title="Processing"
              value={stats?.status_breakdown.processing ?? 0}
              icon={<Loader size={24} />}
              color="purple"
            />
            <StatsCard
              title="Completed"
              value={stats?.status_breakdown.completed ?? 0}
              icon={<CheckCircle size={24} />}
              color="green"
            />
          </div>

          {stats && (
            <div className="member-info">
              Member since {formatDate(stats.member_since)}
            </div>
          )}
        </section>

        <section className="links-section">
          <div className="section-header">
            <h2>Your Links</h2>
            <button
              className="add-button"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus size={20} />
              <span>Add Link</span>
            </button>
          </div>

          <LinkList
            links={links}
            isLoading={isLoading}
            onUpdate={updateLink}
            onDelete={deleteLink}
          />
        </section>
      </main>

      <AddLinkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={async (data) => {
          await createLink(data);
          await fetchStats();
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
}
