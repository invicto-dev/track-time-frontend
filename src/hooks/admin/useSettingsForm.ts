import { useState } from "react";

interface SystemSettings {
  companyName: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  geolocationRequired: boolean;
  maxLocationRadius: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  autoBackup: boolean;
  allowManualAdjustments: boolean;
  requireJustification: boolean;
}

const defaultSettings: SystemSettings = {
  companyName: "",
  timezone: "America/Sao_Paulo",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "24h",
  geolocationRequired: false,
  maxLocationRadius: 100,
  emailNotifications: true,
  smsNotifications: false,
  autoBackup: true,
  allowManualAdjustments: true,
  requireJustification: false,
};

export function useSettingsForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "system" | "location" | "notifications" | "security"
  >("system");
  const [formData, setFormData] = useState<SystemSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  // Abrir formulário com dados existentes
  const openForm = (settings: Partial<SystemSettings> = {}) => {
    setFormData({
      ...defaultSettings,
      ...settings,
    });
    setHasChanges(false);
    setIsOpen(true);
  };

  // Fechar formulário
  const closeForm = () => {
    setIsOpen(false);
    setFormData(defaultSettings);
    setHasChanges(false);
  };

  // Atualizar campo do formulário
  const updateField = (
    field: keyof SystemSettings,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  // Atualizar múltiplos campos
  const updateFields = (updates: Partial<SystemSettings>) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
    setHasChanges(true);
  };

  // Resetar formulário para valores padrão
  const resetForm = () => {
    setFormData(defaultSettings);
    setHasChanges(false);
  };

  // Resetar para valores originais (dados salvos)
  const resetToOriginal = (originalSettings: Partial<SystemSettings>) => {
    setFormData({
      ...defaultSettings,
      ...originalSettings,
    });
    setHasChanges(false);
  };

  // Validar formulário
  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formData.companyName.trim()) {
      errors.push("Nome da empresa é obrigatório");
    }

    if (formData.maxLocationRadius < 1) {
      errors.push("Raio máximo de localização deve ser maior que 0");
    }

    if (formData.maxLocationRadius > 10000) {
      errors.push("Raio máximo de localização não pode exceder 10km");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const getChangedFields = (
    originalSettings: Partial<SystemSettings>
  ): Partial<SystemSettings> => {
    const changes: Partial<SystemSettings> = {};
    const original = { ...defaultSettings, ...originalSettings };

    (Object.keys(formData) as Array<keyof SystemSettings>).forEach((key) => {
      if (formData[key] !== original[key]) {
        changes[key] = formData[key] as any;
      }
    });

    return changes;
  };

  return {
    // Estado do formulário
    isOpen,
    activeSection,
    formData,
    hasChanges,

    // Ações do formulário
    openForm,
    closeForm,
    updateField,
    updateFields,
    resetForm,
    resetToOriginal,

    // Seção ativa
    setActiveSection,

    // Validação e utilitários
    validateForm,
    getChangedFields,

    // Getters para facilitar uso
    systemSettings: {
      companyName: formData.companyName,
      timezone: formData.timezone,
      dateFormat: formData.dateFormat,
      timeFormat: formData.timeFormat,
    },
    locationSettings: {
      geolocationRequired: formData.geolocationRequired,
      maxLocationRadius: formData.maxLocationRadius,
    },
    notificationSettings: {
      emailNotifications: formData.emailNotifications,
      smsNotifications: formData.smsNotifications,
      autoBackup: formData.autoBackup,
    },
    securitySettings: {
      allowManualAdjustments: formData.allowManualAdjustments,
      requireJustification: formData.requireJustification,
    },
  };
}
