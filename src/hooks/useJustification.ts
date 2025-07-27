import { useState, useEffect } from 'react';
import { apiFetch } from '../contexts/AuthContext';
import { Justification } from '../types';

export function useJustifications() {
  const [justifications, setJustifications] = useState<Justification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadJustifications = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch('/justifications');
      const data = await response.json();
      setJustifications(data.data || []);
    } catch {
      setJustifications([]);
    }
    setIsLoading(false);
  };

  const createJustification = async (payload: {
    date: string;
    type: string;
    reason: string;
    attachments?: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await apiFetch('/justifications', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao enviar justificativa');
      await loadJustifications();
      return data.data;
    } finally {
      setIsLoading(false);
    }
  };

  // Para admin: aprovar/rejeitar
  const updateStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setIsLoading(true);
    try {
      const response = await apiFetch(`/justifications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao atualizar justificativa');
      await loadJustifications();
      return data.data;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJustifications();
  }, []);

  return {
    justifications,
    isLoading,
    createJustification,
    updateStatus,
    reload: loadJustifications,
  };
}