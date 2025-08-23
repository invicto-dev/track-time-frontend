import { useState } from "react";
import { WorkRule } from "../../types";

export function useWorkRulesForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [rulesFormData, setRulesFormData] = useState({
    id: "",
    name: "",
    workDayStart: "08:00",
    workDayEnd: "17:00",
    breakDuration: 60,
    lateToleranceMinutes: 15,
    overtimeThreshold: 8,
    weeklyHoursLimit: 44,
    isActive: false,
  });

  const isCreating = mode === "create";
  const isEditing = mode === "edit";

  const openCreateForm = () => {
    setMode("create");
    setRulesFormData({
      id: "",
      name: "",
      workDayStart: "08:00",
      workDayEnd: "17:00",
      breakDuration: 60,
      lateToleranceMinutes: 15,
      overtimeThreshold: 8,
      weeklyHoursLimit: 44,
      isActive: false,
    });
    setIsOpen(true);
  };

  const openEditForm = (rule: WorkRule) => {
    setMode("edit");
    setRulesFormData({
      id: rule.id as string,
      name: rule.name,
      workDayStart: rule.workDayStart,
      workDayEnd: rule.workDayEnd,
      breakDuration: rule.breakDuration,
      lateToleranceMinutes: rule.lateToleranceMinutes,
      overtimeThreshold: rule.overtimeThreshold,
      weeklyHoursLimit: rule.weeklyHoursLimit,
      isActive: rule.isActive,
    });
    setIsOpen(true);
  };

  const closeForm = () => {
    setIsOpen(false);
    setRulesFormData({
      id: "",
      name: "",
      workDayStart: "08:00",
      workDayEnd: "17:00",
      breakDuration: 60,
      lateToleranceMinutes: 15,
      overtimeThreshold: 8,
      weeklyHoursLimit: 44,
      isActive: false,
    });
  };

  const updateField = (field: string, value: string | number | boolean) => {
    setRulesFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    isOpen,
    mode,
    rulesFormData,
    isCreating,
    isEditing,
    openCreateForm,
    openEditForm,
    closeForm,
    updateField,
  };
}