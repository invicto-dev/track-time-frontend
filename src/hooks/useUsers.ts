import { useState, useEffect } from "react";
import { apiFetch } from "../contexts/AuthContext";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
  position: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
  name?: string;
  email?: string;
  position?: string;
  role?: string;
  isActive?: boolean;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar todos os usuários
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch("/users");
      const data = await response.json();
      if (response.ok) {
        setUsers(data.data || []);
      } else {
        throw new Error(data.error || "Erro ao carregar usuários");
      }
    } catch (error) {
      setUsers([]);
      throw error;
    } finally {
      setIsLoading(false); // Sempre reseta o loading
    }
  };

  // Buscar usuário por ID
  const getUserById = async (userId: string): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await apiFetch(`/users/${userId}`);
      const data = await response.json();
      if (response.ok) {
        return data.data;
      } else {
        throw new Error(data.error || "Erro ao buscar usuário");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUserById = async (userId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await apiFetch(`/users/${userId}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Criar usuario
  const createUser = async (userData: UserData): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await apiFetch("/users", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar usuário");
      }
      return data as User;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar usuário
  const updateUser = async (
    userId: string,
    userData: UserData
  ): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await apiFetch(`/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.ok) {
        // Atualizar a lista local
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, ...data.data } : user
          )
        );
        return data.data;
      } else {
        throw new Error(data.error || "Erro ao atualizar usuário");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Alterar senha
  const changePassword = async (
    passwordData: ChangePasswordData
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await apiFetch("/users/change-password", {
        method: "POST",
        body: JSON.stringify(passwordData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erro ao alterar senha");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Admin alterar senha
  const adminChangePassword = async ({
    newPassword,
    userId,
  }: {
    newPassword: string;
    userId: string;
  }): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await apiFetch(`/users/${userId}/password`, {
        method: "PUT",
        body: JSON.stringify({ newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erro ao alterar senha");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Ativar/Desativar usuário
  const toggleUserStatus = async (
    userId: string,
    isActive: boolean
  ): Promise<User> => {
    return updateUser(userId, { isActive });
  };

  // Carregar usuários automaticamente
  useEffect(() => {
    loadUsers().catch(() => {});
  }, []);

  const stats = {
    totalEmployees: users.length,
    presentToday: users.filter((u) => u.isActive).length,
    absentToday: users.filter((u) => !u.isActive).length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    employees: users.filter((u) => u.role === "EMPLOYEE").length,
  };

  return {
    users,
    isLoading,
    stats,
    loadUsers,
    getUserById,
    deleteUserById,
    createUser,
    updateUser,
    changePassword,
    adminChangePassword,
    toggleUserStatus,
    reload: loadUsers,
  };
}
