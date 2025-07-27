import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Toast } from "../ui/Toast";
import { Settings as SettingsIcon, Clock, Save, Plus } from "lucide-react";
import { useSettings } from "../../hooks/useSettings";
import { WorkRule } from "../../types";

export function Settings() {
  const [activeTab, setActiveTab] = useState("work-rules");
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  const { workRules, createWorkRule, toggleRuleStatus, loading } =
    useSettings();

  const [systemSettings, setSystemSettings] = useState({
    companyName: "Minha Empresa LTDA",
    timezone: "America/Sao_Paulo",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    language: "pt-BR",
    autoBackup: true,
    emailNotifications: true,
    smsNotifications: false,
    geolocationRequired: true,
    maxLocationRadius: 100,
    allowManualAdjustments: false,
    requireJustification: true,
  });

  const [newRule, setNewRule] = useState<WorkRule>({
    name: "",
    workDayStart: "08:00",
    workDayEnd: "17:00",
    breakDuration: 60,
    lateToleranceMinutes: 15,
    overtimeThreshold: 8,
    weeklyHoursLimit: 44,
    isActive: false,
  });

  const handleSubmitWorkRules = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.name) return;

    try {
      await createWorkRule(newRule);
      setShowForm(false);
      setNewRule({
        name: "",
        workDayStart: "08:00",
        workDayEnd: "17:00",
        breakDuration: 60,
        lateToleranceMinutes: 15,
        overtimeThreshold: 8,
        weeklyHoursLimit: 44,
        isActive: false,
      });
    } catch (error) {}
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
          {/* Current Rules */}
          <Card>
            <CardHeader className="flex justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Regras de Trabalho Ativas
              </h3>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Regra de Trabalho
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* New Rule Form */}
                {showForm && (
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Nova Regra de Trabalho
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmitWorkRules}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Nome da Regra"
                            value={newRule.name || ""}
                            onChange={(e) =>
                              setNewRule({ ...newRule, name: e.target.value })
                            }
                            placeholder="Ex: Horário Comercial"
                            required
                          />

                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="time"
                              label="Início do Expediente"
                              value={newRule.workDayStart || "08:00"}
                              onChange={(e) =>
                                setNewRule({
                                  ...newRule,
                                  workDayStart: e.target.value,
                                })
                              }
                            />
                            <Input
                              type="time"
                              label="Fim do Expediente"
                              value={newRule.workDayEnd || "17:00"}
                              onChange={(e) =>
                                setNewRule({
                                  ...newRule,
                                  workDayEnd: e.target.value,
                                })
                              }
                            />
                          </div>

                          <Input
                            type="number"
                            label="Duração do Intervalo (minutos)"
                            value={newRule.breakDuration || 60}
                            onChange={(e) =>
                              setNewRule({
                                ...newRule,
                                breakDuration: parseInt(e.target.value),
                              })
                            }
                          />

                          <Input
                            type="number"
                            label="Tolerância de Atraso (minutos)"
                            value={newRule.lateToleranceMinutes || 15}
                            onChange={(e) =>
                              setNewRule({
                                ...newRule,
                                lateToleranceMinutes: parseInt(e.target.value),
                              })
                            }
                          />

                          <Input
                            type="number"
                            label="Limite para Hora Extra (horas)"
                            value={newRule.overtimeThreshold || 8}
                            onChange={(e) =>
                              setNewRule({
                                ...newRule,
                                overtimeThreshold: parseInt(e.target.value),
                              })
                            }
                          />

                          <Input
                            type="number"
                            label="Limite Semanal (horas)"
                            value={newRule.weeklyHoursLimit || 44}
                            onChange={(e) =>
                              setNewRule({
                                ...newRule,
                                weeklyHoursLimit: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>

                        <div className="flex justify-end space-x-3 mt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowForm(false);
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button type="submit" disabled={loading}>
                            {loading ? "Criando..." : "Adicionar"}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
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
                        variant="outline"
                        size="sm"
                        onClick={() => toggleRuleStatus(rule.id as string)}
                      >
                        {rule.isActive ? "Desativar" : "Ativar"}
                      </Button>
                      <Button variant="ghost" size="sm">
                        Editar
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
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                Configurações Gerais
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome da Empresa"
                  value={systemSettings.companyName}
                  onChange={(e) =>
                    setSystemSettings({
                      ...systemSettings,
                      companyName: e.target.value,
                    })
                  }
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fuso Horário
                  </label>
                  <select
                    value={systemSettings.timezone}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        timezone: e.target.value,
                      })
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
                    value={systemSettings.dateFormat}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        dateFormat: e.target.value,
                      })
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
                    value={systemSettings.timeFormat}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        timeFormat: e.target.value,
                      })
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
                      checked={systemSettings.geolocationRequired}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          geolocationRequired: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <Input
                  type="number"
                  label="Raio Máximo de Localização (metros)"
                  value={systemSettings.maxLocationRadius}
                  onChange={(e) =>
                    setSystemSettings({
                      ...systemSettings,
                      maxLocationRadius: parseInt(e.target.value),
                    })
                  }
                  helperText="Distância máxima permitida do local de trabalho"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Configurações de Notificação
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Notificações por Email
                  </p>
                  <p className="text-sm text-gray-600">
                    Receber alertas e relatórios por email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings.emailNotifications}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        emailNotifications: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Notificações por SMS
                  </p>
                  <p className="text-sm text-gray-600">
                    Receber alertas críticos por SMS
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings.smsNotifications}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        smsNotifications: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Backup Automático</p>
                  <p className="text-sm text-gray-600">
                    Realizar backup diário dos dados
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings.autoBackup}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        autoBackup: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Configurações de Segurança
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Permitir Ajustes Manuais
                  </p>
                  <p className="text-sm text-gray-600">
                    Administradores podem ajustar registros de ponto
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings.allowManualAdjustments}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        allowManualAdjustments: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Exigir Justificativa
                  </p>
                  <p className="text-sm text-gray-600">
                    Obrigar justificativa para faltas e atrasos
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings.requireJustification}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        requireJustification: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integrations Tab */}
      {activeTab === "integrations" && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Integrações</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Folha de Pagamento
                    </p>
                    <p className="text-sm text-gray-600">
                      Integração com sistema de folha de pagamento
                    </p>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">ERP</p>
                    <p className="text-sm text-gray-600">
                      Sincronização com sistema ERP
                    </p>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">API Externa</p>
                    <p className="text-sm text-gray-600">
                      Integração via API REST
                    </p>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
