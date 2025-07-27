import { useState, useEffect } from "react";
import { apiFetch } from "../contexts/AuthContext";
import { WorkRule } from "../types";

export function useSettings() {
  const [workRules, setWorkRules] = useState<WorkRule[]>([]);
  const [systemSettings, setSystemSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Carregar dados ao montar
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [rulesRes, sysRes] = await Promise.all([
          apiFetch("/settings/work-rules"),
          apiFetch("/settings/system"),
        ]);
        const rulesData = await rulesRes.json();
        const sysData = await sysRes.json();
        setWorkRules(rulesData.data || []);
        setSystemSettings(sysData.data || {});
      } catch {
        setWorkRules([]);
        setSystemSettings({});
      }
      setLoading(false);
    })();
  }, []);

  // Criar nova regra
  const createWorkRule = async (rule: WorkRule) => {
    const res = await apiFetch("/settings/work-rules", {
      method: "POST",
      body: JSON.stringify(rule),
    });
    const data = await res.json();
    if (res.ok) setWorkRules((rules) => [...rules, data.data]);
    return data;
  };

  // Atualizar regra existente
  const updateWorkRule = async (id: string, rule: Partial<WorkRule>) => {
    const res = await apiFetch(`/settings/work-rules/${id}`, {
      method: "PUT",
      body: JSON.stringify(rule),
    });
    const data = await res.json();
    if (res.ok)
      setWorkRules((rules) => rules.map((r) => (r.id === id ? data.data : r)));
    return data;
  };

  // Ativar/desativar regra
  const toggleRuleStatus = async (id: string) => {
    const res = await apiFetch(`/settings/work-rules/${id}/activate`, {
      method: "PATCH",
    });
    const data = await res.json();
    if (res.ok)
      setWorkRules((rules) => rules.map((r) => (r.id === id ? data.data : r)));
    return data;
  };

  // Salvar configurações do sistema
  const saveSystemSettings = async (settings: any) => {
    const res = await apiFetch("/settings/system", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (res.ok) setSystemSettings(data.data);
    return data;
  };

  return {
    workRules,
    systemSettings,
    loading,
    createWorkRule,
    updateWorkRule,
    toggleRuleStatus,
    saveSystemSettings,
    setWorkRules,
    setSystemSettings,
  };
}
