import { useState, useMemo } from "react";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  KeyRound,
  SendHorizontal,
  X,
} from "lucide-react";

import { useUsers } from "../../hooks/useUsers";
import { Toast } from "../ui/Toast";
import { Select } from "../ui/Select";
import { useEmployeeForm } from "../../hooks/employee/useEmployeeForm";

export function EmployeeManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState({
    id: "",
    show: false,
  });
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const {
    users,
    isLoading,
    updateUser,
    createUser,
    toggleUserStatus,
    reload,
    adminChangePassword,
    deleteUserById,
  } = useUsers();

  const {
    isOpen: showForm,
    formData,
    isCreating,
    isEditing,
    openCreateForm,
    openEditForm,
    closeForm,
    updateField,
  } = useEmployeeForm();

  const employees = useMemo(
    () =>
      users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        position: user.position,
        status: user.isActive ? "active" : "inactive",
        avatar: user.avatar,
        role: user.role,
      })),
    [users]
  );

  // Filtros
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateUser(formData.id, {
          name: formData.name,
          email: formData.email,
          position: formData.position,
          role: formData.role,
        });
      } else {
        await createUser({
          name: formData.name,
          email: formData.email,
          position: formData.position,
          password: formData.password,
          role: formData.role,
          isActive: true,
        });
      }

      closeForm();
      setToast({
        message: isEditing
          ? "Funcionário atualizado com sucesso!"
          : "Funcionário criado com sucesso!",
        type: "success",
      });
      reload();
    } catch (error) {
      setToast({
        message:
          error instanceof Error
            ? error.message
            : isEditing
            ? "Erro ao atualizar o funcionário"
            : "Erro ao criar funcionário",
        type: "error",
      });
    }
  };

  const handleUpdatePassword = async (userId: string) => {
    try {
      if (!userId || !newPassword) {
        setToast({
          message: "ID e senha são obrigatórios para atualizar a senha.",
          type: "error",
        });
        return;
      }
      await adminChangePassword({ newPassword, userId });
      setToast({
        message: `Senha alterada com sucesso!`,
        type: "success",
      });
      setShowPasswordInput({
        id: "",
        show: false,
      });
      setNewPassword("");
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : "Erro ao alterar senha",
        type: "error",
      });
    }
  };

  // Ativar/desativar funcionário
  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    try {
      await toggleUserStatus(userId, !isActive);
      setToast({
        message: `Funcionário ${
          !isActive ? "ativado" : "desativado"
        } com sucesso!`,
        type: "success",
      });
      reload();
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : "Erro ao alterar status",
        type: "error",
      });
    }
  };

  // Deletar usuario por id
  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUserById(userId);
      setToast({
        message: `Funcionário deletado com sucesso!`,
        type: "success",
      });
      reload();
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : "Erro ao deletar usuário",
        type: "error",
      });
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gerenciamento de Funcionários
          </h1>
          <p className="text-gray-600">Gerencie funcionários e permissões</p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Funcionário
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por nome, email ou cargo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              {isCreating ? "Novo Funcionário" : "Editar Funcionário"}
            </h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="text"
                  label="Nome"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                />
                <Input
                  type="email"
                  label="Email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                />
                <Input
                  type="text"
                  label="Cargo"
                  value={formData.position}
                  onChange={(e) => updateField("position", e.target.value)}
                  required
                />
                {/* Campo de senha só aparece na criação */}
                {isCreating && (
                  <Input
                    type="password"
                    label="Senha"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    required
                  />
                )}
                <Select
                  label="Função"
                  value={formData.role}
                  onChange={(e) => updateField("role", e.target.value)}
                  required
                >
                  <option value="">Selecione uma função</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="EMPLOYEE">Funcionário</option>
                </Select>
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={closeForm}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Ativo</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.filter((e) => e.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <UserX className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Ausentes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.filter((e) => e.status === "inactive").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Funcionários ({filteredEmployees.length})
            </h3>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Carregando funcionários...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Funcionário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cargo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {employee.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium text-gray-900">
                                {employee.name}
                              </div>
                              <span
                                className={`
                                  inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                                  ${
                                    employee.role === "ADMIN"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-blue-100 text-blue-800"
                                  }
                                `}
                              >
                                {employee.role === "ADMIN"
                                  ? "Admin"
                                  : "Funcionário"}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {employee.position}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {employee.status === "active" ? (
                            <span className="text-sm text-green-800 bg-green-100 px-2 py-1 rounded-full">
                              Ativo
                            </span>
                          ) : (
                            <span className="text-sm text-red-800 bg-red-100 px-2 py-1 rounded-full">
                              Inativo
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {showPasswordInput.show &&
                          showPasswordInput.id === employee.id ? (
                            <form
                              onSubmit={() => handleUpdatePassword(employee.id)}
                            >
                              <div className="flex">
                                <Input
                                  type="password"
                                  onChange={(e) =>
                                    setNewPassword(e.target.value)
                                  }
                                  value={newPassword}
                                  placeholder="Digite a nova senha"
                                />
                                <Button variant="ghost" size="sm" type="submit">
                                  <SendHorizontal className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => {
                                    setShowPasswordInput({
                                      id: "",
                                      show: false,
                                    });
                                    setNewPassword("");
                                  }}
                                  variant="ghost"
                                  size="sm"
                                  type="button"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <Button
                                onClick={() => {
                                  setShowPasswordInput({
                                    id: employee.id,
                                    show: true,
                                  });
                                }}
                                variant="ghost"
                                size="sm"
                              >
                                <KeyRound className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => openEditForm(employee)}
                                variant="ghost"
                                size="sm"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleToggleStatus(
                                    employee.id,
                                    employee.status === "active"
                                  )
                                }
                              >
                                {employee.status === "active" ? (
                                  <UserX className="w-4 h-4 text-red-500" />
                                ) : (
                                  <UserCheck className="w-4 h-4 text-green-500" />
                                )}
                              </Button>
                              <Button
                                onClick={async () =>
                                  await handleDeleteUser(employee.id)
                                }
                                variant="ghost"
                                size="sm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
