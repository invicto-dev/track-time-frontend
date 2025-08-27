import { CheckCircle, Clock, Coffee, Play } from "lucide-react";

const latitude = Number(import.meta.env.VITE_ESTABLISHMENT_LATITUDE);

const longitude = Number(import.meta.env.VITE_ESTABLISHMENT_LONGITUDE);

export const ESTABLISHMENT_LOCATION = {
  latitude,
  longitude
};

export const ALLOWED_RADIUS_METERS = 800;

export const getDistanceFromLatLonInMeters = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371000; // Raio da Terra em metros
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const statusConfig = {
  "not-started": {
    label: "Não iniciado",
    color: "text-gray-600",
    bg: "bg-gray-100",
    icon: Clock,
  },
  working: {
    label: "Trabalhando",
    color: "text-green-600",
    bg: "bg-green-100",
    icon: Play,
  },
  "on-break": {
    label: "Em intervalo",
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    icon: Coffee,
  },
  finished: {
    label: "Finalizado",
    color: "text-blue-600",
    bg: "bg-blue-100",
    icon: CheckCircle,
  },
};
