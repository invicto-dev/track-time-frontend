import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTimeTracking } from "../../hooks/employee/useTimeTracking";
import { useGeolocation } from "../../hooks/useGeolocation";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Toast } from "../ui/Toast";
import {
  MapPin,
  Play,
  Square,
  Coffee,
  CheckCircle,
  AlertCircle,
  Calendar,
  Timer,
} from "lucide-react";
import {
  getDistanceFromLatLonInMeters,
  ESTABLISHMENT_LOCATION,
  ALLOWED_RADIUS_METERS,
  statusConfig,
} from "../../constains";
import {
  formatHoursToHoursAndMinutes,
  formatMinutesToHoursAndMinutes,
} from "../../utils/formatTime";

export function EmployeeDashboard() {
  const { user } = useAuth();
  const {
    currentRecord,
    records,
    clock,
    isLoading: timeLoading,
  } = useTimeTracking(user);
  const { getCurrentLocation, isLoading: locationLoading } = useGeolocation();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  console.log(currentRecord);

  // Função para determinar o status atual baseado nos registros
  const getCurrentStatus = () => {
    if (!currentRecord || !currentRecord.entries.length) {
      return "not-started";
    }

    const lastEntry = currentRecord.entries[currentRecord.entries.length - 1];

    switch (lastEntry.type) {
      case "CLOCK_IN":
        return "working";
      case "BREAK_OUT":
        return "on-break";
      case "BREAK_IN":
        return "working";
      case "CLOCK_OUT":
        return "finished";
      default:
        return "not-started";
    }
  };

  const handleClockAction = async (
    action: "CLOCK_IN" | "CLOCK_OUT" | "BREAK_OUT" | "BREAK_IN"
  ) => {
    try {
      const location = await getCurrentLocation();

      // Validação de distância
      const distance = getDistanceFromLatLonInMeters(
        location.latitude,
        location.longitude,
        ESTABLISHMENT_LOCATION.latitude,
        ESTABLISHMENT_LOCATION.longitude
      );

      if (distance > ALLOWED_RADIUS_METERS) {
        setToast({
          message: `Você está fora da área permitida para bater o ponto (${distance.toFixed(
            1
          )}m do local).`,
          type: "error",
        });
        return;
      }

      const address = `${location.latitude.toFixed(
        6
      )}, ${location.longitude.toFixed(6)}`;
      await clock(action, {
        latitude: location.latitude,
        longitude: location.longitude,
        address,
      });

      const messages = {
        CLOCK_IN: "Entrada registrada com sucesso!",
        CLOCK_OUT: "Saída registrada com sucesso!",
        BREAK_OUT: "Início do intervalo registrado!",
        BREAK_IN: "Fim do intervalo registrado!",
      };

      setToast({
        message: messages[action],
        type: action === "CLOCK_OUT" ? "success" : "info",
      });
    } catch (error) {
      console.error("Error:", error);
      setToast({
        message:
          error instanceof Error
            ? error.message
            : "Erro ao registrar ponto. Tente novamente.",
        type: "error",
      });
    }
  };

  const status = getCurrentStatus();
  const todayHours = currentRecord?.totalHours || 0;
  const thisWeekRecords = records.slice(-7);
  const weeklyHours = thisWeekRecords.reduce(
    (sum, record) => sum + record.totalHours,
    0
  );

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Olá, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            {currentTime.toLocaleTimeString("pt-BR")} -{" "}
            {currentTime.toLocaleDateString("pt-BR")}
          </p>
        </div>
        <div
          className={`flex items-center space-x-2 px-4 py-2 rounded-full ${currentStatus.bg}`}
        >
          <StatusIcon className={`w-5 h-5 ${currentStatus.color}`} />
          <span className={`font-medium ${currentStatus.color}`}>
            {currentStatus.label}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Timer className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Horas Hoje</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatHoursToHoursAndMinutes(todayHours)}
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
                <p className="text-sm text-gray-600">Horas Semana</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatHoursToHoursAndMinutes(weeklyHours)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Coffee className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Intervalos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentRecord?.entries.filter((e) => e.type === "BREAK_OUT")
                    .length || 0}
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
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-sm font-medium text-gray-900">
                  {currentStatus.label}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Tracking Actions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Registro de Ponto
          </h3>
          <p className="text-sm text-gray-600">
            Registre sua entrada, saída e intervalos com localização automática
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => handleClockAction("CLOCK_IN")}
              disabled={status !== "not-started" || timeLoading}
              isLoading={locationLoading}
              className="flex items-center justify-center space-x-2 h-16"
              variant={status === "not-started" ? "primary" : "outline"}
            >
              <Play className="w-5 h-5" />
              <span>Entrada</span>
            </Button>

            <Button
              onClick={() => handleClockAction("BREAK_OUT")}
              disabled={status !== "working" || timeLoading}
              isLoading={locationLoading}
              className="flex items-center justify-center space-x-2 h-16"
              variant={status === "working" ? "secondary" : "outline"}
            >
              <Coffee className="w-5 h-5" />
              <span>Sair Intervalo</span>
            </Button>

            <Button
              onClick={() => handleClockAction("BREAK_IN")}
              disabled={status !== "on-break" || timeLoading}
              isLoading={locationLoading}
              className="flex items-center justify-center space-x-2 h-16"
              variant={status === "on-break" ? "secondary" : "outline"}
            >
              <Coffee className="w-5 h-5" />
              <span>Voltar Intervalo</span>
            </Button>

            <Button
              onClick={() => handleClockAction("CLOCK_OUT")}
              disabled={status !== "working" || timeLoading}
              isLoading={locationLoading}
              className="flex items-center justify-center space-x-2 h-16"
              variant={status === "working" ? "destructive" : "outline"}
            >
              <Square className="w-5 h-5" />
              <span>Saída</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Timeline */}
      {currentRecord && currentRecord.entries.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Registro de Hoje
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentRecord.entries.map((entry, index) => (
                <div
                  key={`${index}-${entry.id}`}
                  className="flex items-center space-x-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {entry.type === "CLOCK_IN" && (
                        <Play className="w-5 h-5 text-blue-600" />
                      )}
                      {entry.type === "CLOCK_OUT" && (
                        <Square className="w-5 h-5 text-red-600" />
                      )}
                      {(entry.type === "BREAK_OUT" ||
                        entry.type === "BREAK_IN") && (
                        <Coffee className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {entry.type === "CLOCK_IN" && "Entrada"}
                          {entry.type === "CLOCK_OUT" && "Saída"}
                          {entry.type === "BREAK_OUT" && "Início do Intervalo"}
                          {entry.type === "BREAK_IN" && "Fim do Intervalo"}
                          {entry.isLate && (
                            <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              Atraso:{" "}
                              {formatMinutesToHoursAndMinutes(
                                entry.lateDuration || 0
                              )}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(entry.timestamp).toLocaleTimeString(
                            "pt-BR"
                          )}
                        </p>
                      </div>
                      {entry.address && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="truncate max-w-xs">
                            {entry.address}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Atividade Recente
          </h3>
        </CardHeader>
        <CardContent>
          {timeLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Carregando...</p>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum registro encontrado</p>
              <p className="text-sm text-gray-500">
                Registre seu primeiro ponto para começar
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {records
                .slice(-5)
                .reverse()
                .map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(record.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {record.entries.length} registros •{" "}
                        {formatHoursToHoursAndMinutes(record.totalHours)}
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === "COMPLETE"
                          ? "bg-green-100 text-green-800"
                          : record.status === "INCOMPLETE"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {record.status === "COMPLETE"
                        ? "Completo"
                        : record.status === "INCOMPLETE"
                        ? "Incompleto"
                        : "Ausente"}
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
