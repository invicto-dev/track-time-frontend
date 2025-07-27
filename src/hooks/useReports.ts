import { useState, useEffect } from 'react';
import { apiFetch } from '../contexts/AuthContext';

export interface Report {
  id: string;
  title: string;
  type: 'INDIVIDUAL' | 'DEPARTMENT' | 'COMPANY';
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  generatedBy: string;
  data: string; // geralmente JSON
}

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch('/reports');
      const data = await response.json();
      setReports(data.data || []);
    } catch {
      setReports([]);
    }
    setIsLoading(false);
  };

  // Para admin: gerar novo relatório
  const generateReport = async (payload: {
    type: 'INDIVIDUAL' | 'DEPARTMENT' | 'COMPANY';
    periodStart: string;
    periodEnd: string;
    filters?: any;
  }) => {
    setIsLoading(true);
    try {
      const response = await apiFetch('/reports', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao gerar relatório');
      await loadReports();
      return data.data;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return {
    reports,
    isLoading,
    generateReport,
    reload: loadReports,
  };
}