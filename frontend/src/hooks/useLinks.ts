import { useState, useCallback } from 'react';
import type { Link, LinkCreate, LinkUpdate, DashboardStats } from '../types';
import { api, getErrorMessage } from '../services/api';

export function useLinks() {
  const [links, setLinks] = useState<Link[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getLinks();
      setLinks(response.links);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getDashboardStats();
      setStats(response);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createLink = useCallback(async (data: LinkCreate) => {
    setError(null);
    try {
      const newLink = await api.createLink(data);
      setLinks((prev) => [newLink, ...prev]);
      return newLink;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw new Error(message);
    }
  }, []);

  const updateLink = useCallback(async (id: number, data: LinkUpdate) => {
    setError(null);
    try {
      const updatedLink = await api.updateLink(id, data);
      setLinks((prev) =>
        prev.map((link) => (link.id === id ? updatedLink : link))
      );
      return updatedLink;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw new Error(message);
    }
  }, []);

  const deleteLink = useCallback(async (id: number) => {
    setError(null);
    try {
      await api.deleteLink(id);
      setLinks((prev) => prev.filter((link) => link.id !== id));
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw new Error(message);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
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
  };
}
