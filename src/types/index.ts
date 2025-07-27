export interface User {
  id: string;
  name: string;
  email: string;
  role: "EMPLOYEE" | "ADMIN";
  department: string;
  position: string;
  avatar?: string;
  isActive: boolean;
}

export interface TimeRecord {
  id: string;
  employeeId: string;
  date: string;
  entries: TimeEntry[];
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  status: "COMPLETE" | "INCOMPLETE" | "ABSENT";
  justification?: string;
  createdAt: string;
}

export interface TimeEntry {
  id: string;
  type: "CLOCK_IN" | "BREAK_OUT" | "BREAK_IN" | "CLOCK_OUT";
  timestamp: string;
  latitude: number;
  longitude: number;
  address: string;
  isLate?: boolean;
  lateDuration?: number;
}

export interface WorkRule {
  id?: string;
  name: string;
  workDayStart: string;
  workDayEnd: string;
  breakDuration: number;
  lateToleranceMinutes: number;
  overtimeThreshold: number;
  weeklyHoursLimit: number;
  isActive: boolean;
}

export interface Justification {
  id: string;
  employeeId: string;
  date: string;
  type: "absence" | "late" | "early-departure" | "overtime";
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  attachments?: string[];
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface Report {
  id: string;
  title: string;
  type: "individual" | "department" | "company";
  period: {
    start: string;
    end: string;
  };
  filters: {
    employees?: string[];
    departments?: string[];
    status?: string[];
  };
  data: any;
  generatedAt: string;
  generatedBy: string;
}
