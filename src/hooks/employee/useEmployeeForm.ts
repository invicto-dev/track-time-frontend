import { useState } from "react";

export function useEmployeeForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [formData, setFormData] = useState({
      id: "",
      name: "",
      email: "",
      position: "",
      password: "",
      role: "",
    });
  
    const isCreating = mode === 'create';
    const isEditing = mode === 'edit';
  
    const openCreateForm = () => {
      setMode('create');
      setFormData({
        id: "",
        name: "",
        email: "",
        position: "",
        password: "",
        role: "",
      });
      setIsOpen(true);
    };
  
    const openEditForm = (employee: any) => {
      setMode('edit');
      setFormData({
        id: employee.id,
        name: employee.name,
        email: employee.email,
        position: employee.position,
        password: "",
        role: employee.role,
      });
      setIsOpen(true);
    };
  
    const closeForm = () => {
      setIsOpen(false);
      setFormData({
        id: "",
        name: "",
        email: "",
        position: "",
        password: "",
        role: "",
      });
    };
  
    const updateField = (field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };
  
    return {
      isOpen,
      mode,
      formData,
      isCreating,
      isEditing,
      openCreateForm,
      openEditForm,
      closeForm,
      updateField,
    };
  }