// User types
export interface User {
  id: number;
  email: string;
  created_at: string;
  links: Link[];
}

// Link types
export type LinkStatus = 'pending' | 'processing' | 'completed';

export interface Link {
  id: number;
  user_id: number;
  url: string;
  title: string | null;
  status: LinkStatus;
  created_at: string;
  updated_at: string;
}

export interface LinkCreate {
  url: string;
  title?: string;
}

export interface LinkUpdate {
  url?: string;
  title?: string;
  status?: LinkStatus;
}

export interface LinkListResponse {
  links: Link[];
  total: number;
}

// Dashboard types
export interface StatusBreakdown {
  pending: number;
  processing: number;
  completed: number;
}

export interface DashboardStats {
  total_links: number;
  status_breakdown: StatusBreakdown;
  recent_links: Link[];
  member_since: string;
}

// API Error type
export interface ApiError {
  detail: string;
}
