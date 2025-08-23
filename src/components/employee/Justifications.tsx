import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Toast } from "../ui/Toast";
import {
  Plus,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload,
  Eye,
} from "lucide-react";
import { useJustifications } from "../../hooks/useJustification";

export function Justifications() {
  const { justifications, isLoading, createJustification } =
    useJustifications();
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [formData, setFormData] = useState({
    date: "",
    type: "ABSENCE" as const,
    reason: "",
    attachments: [] as File[],
  });

  console.log(justifications);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const attachmentsJson =
        formData.attachments.length > 0
          ? JSON.stringify(formData.attachments.map((f) => f.name))
          : undefined;

      await createJustification({
        date: formData.date,
        type: formData.type,
        reason: formData.reason,
        attachments: attachmentsJson,
      });

      setFormData({ date: "", type: "ABSENCE", reason: "", attachments: [] });
      setShowForm(false);
      setToast({
        message: "Justificativa enviada com sucesso!",
        type: "success",
      });
    } catch (error) {
      setToast({
        message:
          error instanceof Error
            ? error.message
            : "Erro ao enviar justificativa",
        type: "error",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "REJECTED":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "PENDING":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Aprovada";
      case "REJECTED":
        return "Rejeitada";
      case "PENDING":
        return "Pendente";
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "ABSENCE":
        return "Falta";
      case "LATE":
        return "Atraso";
      case "EARLY_DEPARTURE":
        return "Saída Antecipada";
      case "OVERTIME":
        return "Hora Extra";
      default:
        return type;
    }
  };

  const pendingCount = justifications.filter(
    (j) => j.status === "PENDING"
  ).length;
  const approvedCount = justifications.filter(
    (j) => j.status === "APPROVED"
  ).length;
  const rejectedCount = justifications.filter(
    (j) => j.status === "REJECTED"
  ).length;

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
          <h1 className="text-2xl font-bold text-gray-900">Justificativas</h1>
          <p className="text-gray-600">
            Gerencie suas solicitações de justificativa
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} disabled={isLoading}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Justificativa
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Aprovadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {approvedCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Rejeitadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {rejectedCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {justifications.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Justification Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Nova Justificativa
            </h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Data"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as any })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="ABSENCE">Falta</option>
                    <option value="LATE">Atraso</option>
                    <option value="EARLY_DEPARTURE">Saída Antecipada</option>
                    <option value="OVERTIME">Hora Extra</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descreva o motivo da justificativa..."
                  required
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Anexos (opcional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Clique para fazer upload ou arraste arquivos aqui
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, JPG, PNG até 5MB
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        setFormData({
                          ...formData,
                          attachments: Array.from(e.target.files),
                        });
                      }
                    }}
                  />
                </div>
                {formData.attachments.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      {formData.attachments.length} arquivo(s) selecionado(s)
                    </p>
                  </div>
                )}
              </div> */}

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar Justificativa"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Justifications List */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Histórico de Justificativas
          </h3>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Carregando...</p>
            </div>
          ) : justifications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma justificativa encontrada</p>
              <p className="text-sm text-gray-500">
                Crie sua primeira justificativa clicando no botão acima
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {justifications.map((justification) => (
                <div
                  key={justification.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(justification.status)}
                        <div>
                          <p className="font-medium text-gray-900">
                            {getTypeLabel(justification.type)} -{" "}
                            {new Date(justification.date).toLocaleDateString(
                              "pt-BR"
                            )}
                          </p>
                          <p className="text-sm text-gray-600">
                            Enviado em{" "}
                            {new Date(
                              justification.createdAt
                            ).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">
                        {justification.reason}
                      </p>

                      {/*  {justification.attachments && (
                        <div className="flex items-center space-x-2 mb-3">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {JSON.parse(justification.attachments).length} anexo(s)
                          </span>
                        </div>
                      )} */}

                      {justification.reviewedBy && justification.reviewedAt && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            Revisado por:
                          </p>
                          <p className="text-xs text-gray-500">
                            {justification.reviewedBy} em{" "}
                            {new Date(
                              justification.reviewedAt
                            ).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          justification.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : justification.status === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {getStatusLabel(justification.status)}
                      </div>
                      {/*  <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
