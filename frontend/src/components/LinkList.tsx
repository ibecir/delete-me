import type { Link, LinkUpdate } from '../types';
import { LinkItem } from './LinkItem';
import { Link2, Loader2 } from 'lucide-react';

interface LinkListProps {
  links: Link[];
  isLoading: boolean;
  onUpdate: (id: number, data: LinkUpdate) => Promise<Link>;
  onDelete: (id: number) => Promise<void>;
}

export function LinkList({ links, isLoading, onUpdate, onDelete }: LinkListProps) {
  if (isLoading && links.length === 0) {
    return (
      <div className="link-list-loading">
        <Loader2 className="spinner" size={32} />
        <span>Loading your links...</span>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="link-list-empty">
        <div className="empty-icon">
          <Link2 size={48} />
        </div>
        <h3>No links yet</h3>
        <p>Add your first link to start building your knowledge base</p>
      </div>
    );
  }

  return (
    <div className="link-list">
      {links.map((link) => (
        <LinkItem
          key={link.id}
          link={link}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
