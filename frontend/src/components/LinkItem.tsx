import { useState } from 'react';
import {
  ExternalLink,
  Edit2,
  Trash2,
  Clock,
  Loader,
  CheckCircle,
  MoreVertical,
  X,
  Check,
} from 'lucide-react';
import type { Link, LinkUpdate, LinkStatus } from '../types';

interface LinkItemProps {
  link: Link;
  onUpdate: (id: number, data: LinkUpdate) => Promise<Link>;
  onDelete: (id: number) => Promise<void>;
}

export function LinkItem({ link, onUpdate, onDelete }: LinkItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editData, setEditData] = useState({
    url: link.url,
    title: link.title || '',
    status: link.status,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusConfig: Record<
    LinkStatus,
    { icon: typeof Clock; label: string; className: string }
  > = {
    pending: { icon: Clock, label: 'Pending', className: 'status-pending' },
    processing: { icon: Loader, label: 'Processing', className: 'status-processing' },
    completed: { icon: CheckCircle, label: 'Completed', className: 'status-completed' },
  };

  const StatusIcon = statusConfig[link.status].icon;

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onUpdate(link.id, {
        url: editData.url,
        title: editData.title || undefined,
        status: editData.status,
      });
      setIsEditing(false);
    } catch {
      // Error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await onDelete(link.id);
    } catch {
      // Error handled by parent
    } finally {
      setIsSubmitting(false);
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  if (isEditing) {
    return (
      <div className="link-item link-item-editing">
        <div className="edit-form">
          <div className="edit-field">
            <label>URL</label>
            <input
              type="url"
              value={editData.url}
              onChange={(e) => setEditData({ ...editData, url: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
          <div className="edit-field">
            <label>Title (optional)</label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="Enter a title"
            />
          </div>
          <div className="edit-field">
            <label>Status</label>
            <select
              value={editData.status}
              onChange={(e) =>
                setEditData({ ...editData, status: e.target.value as LinkStatus })
              }
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="edit-actions">
            <button
              className="btn-secondary"
              onClick={() => setIsEditing(false)}
              disabled={isSubmitting}
            >
              <X size={16} />
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              <Check size={16} />
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isDeleting) {
    return (
      <div className="link-item link-item-deleting">
        <div className="delete-confirm">
          <p>Delete this link?</p>
          <span className="delete-url">{link.title || getDomain(link.url)}</span>
          <div className="delete-actions">
            <button
              className="btn-secondary"
              onClick={() => setIsDeleting(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className="btn-danger"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="link-item">
      <div className="link-content">
        <div className="link-main">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-title"
          >
            {link.title || getDomain(link.url)}
            <ExternalLink size={14} />
          </a>
          <span className="link-url">{link.url}</span>
        </div>
        <div className="link-meta">
          <span className={`link-status ${statusConfig[link.status].className}`}>
            <StatusIcon size={14} />
            {statusConfig[link.status].label}
          </span>
          <span className="link-date">{formatDate(link.created_at)}</span>
        </div>
      </div>
      <div className="link-actions">
        <button
          className="menu-trigger"
          onClick={() => setShowMenu(!showMenu)}
          onBlur={() => setTimeout(() => setShowMenu(false), 150)}
        >
          <MoreVertical size={18} />
        </button>
        {showMenu && (
          <div className="action-menu">
            <button onClick={() => { setIsEditing(true); setShowMenu(false); }}>
              <Edit2 size={14} />
              Edit
            </button>
            <button
              onClick={() => { setIsDeleting(true); setShowMenu(false); }}
              className="danger"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
