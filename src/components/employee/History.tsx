import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTimeTracking } from "../../hooks/employee/useTimeTracking";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Toast } from "../ui/Toast";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Download,
  MapPin,
  Play,
  Square,
  Coffee,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { monthNames } from "../../constains";
import { formatHoursToHoursAndMinutes } from "../../utils/formatTime";

export function History() {
  const { user } = useAuth();
  const { records, isLoading, loadRecords } = useTimeTracking(user);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  useEffect(() => {
    if (user && loadRecords) {
      const startDate = new Date(selectedYear, selectedMonth, 1);
      const endDate = new Date(selectedYear, selectedMonth + 1, 0);

      loadRecords(
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0]
      );
    }
  }, [selectedMonth, selectedYear, user]);

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      searchTerm === "" ||
      new Date(record.createdAt)
        .toLocaleDateString("pt-br", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
        .includes(searchTerm) ||
      record.status.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const getEntryIcon = (type: string) => {
    switch (type) {
      case "CLOCK_IN":
        return <Play className="w-4 h-4 text-green-600" />;
      case "CLOCK_OUT":
        return <Square className="w-4 h-4 text-red-600" />;
      case "BREAK_OUT":
      case "BREAK_IN":
        return <Coffee className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEntryLabel = (type: string) => {
    switch (type) {
      case "CLOCK_IN":
        return "Entrada";
      case "CLOCK_OUT":
        return "Saída";
      case "BREAK_OUT":
        return "Início Intervalo";
      case "BREAK_IN":
        return "Fim Intervalo";
      default:
        return type;
    }
  };

  const exportData = () => {
    if (filteredRecords.length === 0) {
      setToast({ message: "Nenhum registro para exportar", type: "warning" });
      return;
    }

    try {
      const csvContent = filteredRecords
        .map((record) => {
          const entriesText =
            record.entries
              ?.map(
                (entry) =>
                  `${getEntryLabel(entry.type)}: ${new Date(
                    entry.timestamp
                  ).toLocaleTimeString("pt-BR")}`
              )
              .join(" | ") || "";

          return `${record.date},${record.totalHours.toFixed(
            2
          )},${getStatusLabel(record.status)},"${entriesText}"`;
        })
        .join("\n");

      const blob = new Blob(
        [`Data,Horas Totais,Status,Registros\n${csvContent}`],
        { type: "text/csv;charset=utf-8;" }
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `historico-ponto-${String(selectedMonth + 1).padStart(
        2,
        "0"
      )}-${selectedYear}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      setToast({
        message: "Histórico exportado com sucesso!",
        type: "success",
      });
    } catch (error) {
      setToast({ message: "Erro ao exportar histórico", type: "error" });
    }
  };

  const totalHours = filteredRecords.reduce(
    (sum, record) => sum + record.totalHours,
    0
  );
  const workingDays = filteredRecords.filter(
    (r) => r.status === "COMPLETE"
  ).length;
  const averageHours = workingDays > 0 ? totalHours / workingDays : 0;
  const incompleteRecords = filteredRecords.filter(
    (r) => r.status === "INCOMPLETE"
  ).length;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "COMPLETE":
        return "Completo";
      case "INCOMPLETE":
        return "Incompleto";
      case "ABSENT":
        return "Ausente";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETE":
        return "bg-green-100 text-green-800";
      case "INCOMPLETE":
        return "bg-yellow-100 text-yellow-800";
      case "ABSENT":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
            Histórico de Registros
          </h1>
          <p className="text-gray-600">
            Visualize e exporte seu histórico de ponto
          </p>
        </div>
        <Button
          onClick={exportData}
          disabled={filteredRecords.length === 0 || isLoading}
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar registros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            >
              {monthNames.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            >
              {Array.from(
                { length: 15 },
                (_, i) => new Date().getFullYear() - i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <Button variant="outline" disabled>
              <Filter className="w-4 h-4 mr-2" />
              Filtros Avançados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total de Horas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatHoursToHoursAndMinutes(totalHours)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Dias Trabalhados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {workingDays}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Média Diária</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatHoursToHoursAndMinutes(averageHours)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Incompletos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {incompleteRecords}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Records List */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Registros de {monthNames[selectedMonth]} {selectedYear} (
            {filteredRecords.length})
          </h3>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Carregando registros...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum registro encontrado</p>
              <p className="text-sm text-gray-500">
                {searchTerm
                  ? "Ajuste os filtros para ver mais resultados"
                  : `Nenhum registro em ${monthNames[selectedMonth]} ${selectedYear}`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div
                  key={record.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(record.createdAt).toLocaleDateString(
                            "pt-br",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          {record.totalHours.toFixed(1)}h trabalhadas
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        record.status
                      )}`}
                    >
                      {getStatusLabel(record.status)}
                    </div>
                  </div>

                  {record.entries && record.entries.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {record.entries.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-shrink-0">
                            {getEntryIcon(entry.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {getEntryLabel(entry.type)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(entry.timestamp).toLocaleTimeString(
                                "pt-BR"
                              )}
                            </p>
                          </div>
                          {entry.latitude && entry.longitude && (
                            <div className="flex items-center text-xs text-gray-500">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span className="truncate max-w-24">
                                Localizado
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">
                        Nenhum registro de ponto neste dia
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
