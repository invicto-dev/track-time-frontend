import { useState, useEffect } from "react";
import { TimeRecord, TimeEntry, User } from "../types";
import { apiFetch } from "../contexts/AuthContext";

export function useTimeTracking(user: User | null) {
  const [currentRecord, setCurrentRecord] = useState<TimeRecord | null>(null);
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTodayRecord();
      loadRecords();
    }
  }, [user]);

  const loadTodayRecord = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch("/time/today");
      const data = await response.json();
      setCurrentRecord(data.data);
    } catch (error) {
      setCurrentRecord(null);
    }
    setIsLoading(false);
  };

  // Função loadRecords sem parâmetros (carrega registros recentes)
  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch("/time/records");
      const data = await response.json();
      setRecords(data.data || []);
    } catch (error) {
      setRecords([]);
    }
    setIsLoading(false);
  };

  // Função loadRecords com parâmetros de data (para histórico)
  const loadRecordsByPeriod = async (startDate?: string, endDate?: string) => {
    setIsLoading(true);
    try {
      let url = "/time/records";
      const params = new URLSearchParams();
      
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await apiFetch(url);
      const data = await response.json();
      setRecords(data.data || []);
    } catch (error) {
      setRecords([]);
    }
    setIsLoading(false);
  };

  const clock = async (
    type: "CLOCK_IN" | "BREAK_OUT" | "BREAK_IN" | "CLOCK_OUT",
    location?: { latitude: number; longitude: number; address?: string }
  ) => {
    setIsLoading(true);
    try {
      const response = await apiFetch("/time/clock", {
        method: "POST",
        body: JSON.stringify({
          type,
          latitude: location?.latitude,
          longitude: location?.longitude,
          address: location?.address,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Erro ao registrar ponto");
      await loadTodayRecord();
      await loadRecords();
      return data.data as TimeEntry;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentRecord,
    records,
    isLoading,
    clock,
    loadRecords: loadRecordsByPeriod, // Exporta a versão com parâmetros
    reload: () => {
      loadTodayRecord();
      loadRecords(); // Usa a versão sem parâmetros internamente
    },
  };
}