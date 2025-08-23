export const formatHoursToHoursAndMinutes = (hours: number): string => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours % 1) * 60);
  return `${wholeHours}h ${minutes}min`;
};

export const formatMinutesToHoursAndMinutes = (minutes: number): string => {
    console.log(minutes)
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}min`;
};
