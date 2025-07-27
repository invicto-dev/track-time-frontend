import { useState, useEffect } from 'react';
import { apiFetch } from '../contexts/AuthContext';

interface DashboardStats {
    totalEmployees: number;
    presentToday: number;
    absentToday: number;
    lateToday: number;
    overtimeThisWeek: number;
    pendingJustifications: number;
  }

// Hook para buscar dados do dashboard
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      try {
        // Dashboard stats
        const statsRes = await apiFetch('/admin/dashboard');
        const statsData = await statsRes.json();
        setStats(statsData.data);

        // Recent activity
        const activityRes = await apiFetch('/admin/recent-activity');
        const activityData = await activityRes.json();
        setRecentActivity(activityData.data);

        // Departments overview
        const deptRes = await apiFetch('/admin/departments-overview');
        const deptData = await deptRes.json();
        setDepartments(deptData.data);
      } catch (e) {
        setStats(null);
        setRecentActivity([]);
        setDepartments([]);
      }
      setLoading(false);
    }
    fetchDashboard();
  }, []);

  return { stats, recentActivity, departments, loading };
}