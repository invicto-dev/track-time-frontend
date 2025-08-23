import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Toast } from "../ui/Toast";
import { Settings as SettingsIcon, Clock, Edit, Save } from "lucide-react";
import { useSettings } from "../../hooks/admin/useSettings";
import { useWorkRulesForm } from "../../hooks/admin/useWorkRulesForm";
import { useSettingsForm } from "../../hooks/admin/useSettingsForm";

export function Settings() {
  const [activeTab, setActiveTab] = useState("work-rules");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  const {
    workRules,
    systemSettings,
    createWorkRule,
    updateWorkRule,
    saveSystemSettings,
    toggleRuleStatus,
    loading,
  } = useSettings();

  const {
    isOpen: showForm,
    rulesFormData,
    isCreating,
    isEditing,
    openEditForm,
    closeForm,
    updateField,
  } = useWorkRulesForm();

  const {
    formData: settingsFormData,
    hasChanges,
    updateField: updateSettingsField,
    validateForm,
    resetToOriginal,
  } = useSettingsForm();

  useEffect(() => {
    if (systemSettings) {
      resetToOriginal(systemSettings);
    }
  }, [systemSettings]);

  const handleSubmitWorkRules = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rulesFormData.name) {
      setToast({
        message: "Nome da regra é obrigatório",
        type: "error",
      });
      return;
    }

    try {
      if (isEditing) {
        await updateWorkRule(rulesFormData.id, {
          name: rulesFormData.name,
          workDayStart: rulesFormData.workDayStart,
          workDayEnd: rulesFormData.workDayEnd,
          breakDuration: rulesFormData.breakDuration,
          lateToleranceMinutes: rulesFormData.lateToleranceMinutes,
          overtimeThreshold: rulesFormData.overtimeThreshold,
          weeklyHoursLimit: rulesFormData.weeklyHoursLimit,
          isActive: rulesFormData.isActive,
        });
        setToast({
          message: "Regra de trabalho atualizada com sucesso!",
          type: "success",
        });
      } else {
        await createWorkRule({
          name: rulesFormData.name,
          workDayStart: rulesFormData.workDayStart,
          workDayEnd: rulesFormData.workDayEnd,
          breakDuration: rulesFormData.breakDuration,
          lateToleranceMinutes: rulesFormData.lateToleranceMinutes,
          overtimeThreshold: rulesFormData.overtimeThreshold,
          weeklyHoursLimit: rulesFormData.weeklyHoursLimit,
          isActive: rulesFormData.isActive,
        });
        setToast({
          message: "Regra de trabalho criada com sucesso!",
          type: "success",
        });
      }
      closeForm();
    } catch (error) {
      setToast({
        message:
          error instanceof Error
            ? error.message
            : isEditing
            ? "Erro ao atualizar regra"
            : "Erro ao criar regra",
        type: "error",
      });
    }
  };

  const handleSaveSystemSettings = async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      setToast({
        message: validation.errors[0],
        type: "error",
      });
      return;
    }

    try {
      await saveSystemSettings(settingsFormData);
      setToast({
        message: "Configurações salvas com sucesso!",
        type: "success",
      });
    } catch (error) {
      setToast({
        message:
          error instanceof Error
            ? error.message
            : "Erro ao salvar configurações",
        type: "error",
      });
    }
  };

  const tabs = [
    { id: "work-rules", label: "Regras de Trabalho", icon: Clock },
    { id: "system", label: "Sistema", icon: SettingsIcon },
    /*  { id: 'notifications', label: 'Notificações', icon: Bell }, */
    /* { id: 'security', label: 'Segurança', icon: Shield }, */
    /* { id: 'integrations', label: 'Integrações', icon: Database } */
  ];

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600">
            Gerencie as configurações do sistema de controle de ponto
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Work Rules Tab */}
      {activeTab === "work-rules" && (
        <div className="space-y-6">
          {/* Work Rules Form */}
          {showForm && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  {isCreating
                    ? "Nova Regra de Trabalho"
                    : "Editar Regra de Trabalho"}
                </h3>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitWorkRules}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nome da Regra"
                      value={rulesFormData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="Ex: Horário Comercial"
                      required
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="time"
                        label="Início do Expediente"
                        value={rulesFormData.workDayStart}
                        onChange={(e) =>
                          updateField("workDayStart", e.target.value)
                        }
                      />
                      <Input
                        type="time"
                        label="Fim do Expediente"
                        value={rulesFormData.workDayEnd}
                        onChange={(e) =>
                          updateField("workDayEnd", e.target.value)
                        }
                      />
                    </div>

                    <Input
                      type="number"
                      label="Duração do Intervalo (minutos)"
                      value={rulesFormData.breakDuration}
                      onChange={(e) =>
                        updateField("breakDuration", parseInt(e.target.value))
                      }
                    />

                    <Input
                      type="number"
                      label="Tolerância de Atraso (minutos)"
                      value={rulesFormData.lateToleranceMinutes}
                      onChange={(e) =>
                        updateField(
                          "lateToleranceMinutes",
                          parseInt(e.target.value)
                        )
                      }
                    />

                    <Input
                      type="number"
                      label="Limite para Hora Extra (horas)"
                      value={rulesFormData.overtimeThreshold}
                      onChange={(e) =>
                        updateField(
                          "overtimeThreshold",
                          parseInt(e.target.value)
                        )
                      }
                    />

                    <Input
                      type="number"
                      label="Limite Semanal (horas)"
                      value={rulesFormData.weeklyHoursLimit}
                      onChange={(e) =>
                        updateField(
                          "weeklyHoursLimit",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <Button type="button" variant="outline" onClick={closeForm}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading
                        ? isCreating
                          ? "Criando..."
                          : "Salvando..."
                        : isCreating
                        ? "Criar"
                        : "Salvar"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Current Rules */}
          <Card>
            <CardHeader className="flex justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Regras de Trabalho Ativas
              </h3>
              {/* <Button onClick={openCreateForm}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Regra de Trabalho
              </Button> */}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">
                          {rule.name}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rule.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {rule.isActive ? "Ativa" : "Inativa"}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Horário:</span>{" "}
                          {rule.workDayStart} - {rule.workDayEnd}
                        </div>
                        <div>
                          <span className="font-medium">Intervalo:</span>{" "}
                          {rule.breakDuration}min
                        </div>
                        <div>
                          <span className="font-medium">Tolerância:</span>{" "}
                          {rule.lateToleranceMinutes}min
                        </div>
                        <div>
                          <span className="font-medium">Limite Semanal:</span>{" "}
                          {rule.weeklyHoursLimit}h
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditForm(rule)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleRuleStatus(rule.id as string)}
                      >
                        {rule.isActive ? "Desativar" : "Ativar"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Tab */}
      {activeTab === "system" && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Configurações Gerais
              </h3>
              {hasChanges && (
                <Button onClick={handleSaveSystemSettings} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome da Empresa"
                  value={settingsFormData.companyName}
                  onChange={(e) =>
                    updateSettingsField("companyName", e.target.value)
                  }
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fuso Horário
                  </label>
                  <select
                    value={settingsFormData.timezone}
                    onChange={(e) =>
                      updateSettingsField("timezone", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                    <option value="America/Manaus">Manaus (GMT-4)</option>
                    <option value="America/Rio_Branco">
                      Rio Branco (GMT-5)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Formato de Data
                  </label>
                  <select
                    value={settingsFormData.dateFormat}
                    onChange={(e) =>
                      updateSettingsField("dateFormat", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Formato de Hora
                  </label>
                  <select
                    value={settingsFormData.timeFormat}
                    onChange={(e) =>
                      updateSettingsField("timeFormat", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="24h">24 horas</option>
                    <option value="12h">12 horas (AM/PM)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                Configurações de Localização
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Geolocalização Obrigatória
                    </p>
                    <p className="text-sm text-gray-600">
                      Exigir localização para registros de ponto
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsFormData.geolocationRequired}
                      onChange={(e) =>
                        updateSettingsField(
                          "geolocationRequired",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <Input
                  type="number"
                  label="Raio Máximo de Localização (metros)"
                  value={settingsFormData.maxLocationRadius}
                  onChange={(e) =>
                    updateSettingsField(
                      "maxLocationRadius",
                      parseInt(e.target.value)
                    )
                  }
                  helperText="Distância máxima permitida do local de trabalho"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
