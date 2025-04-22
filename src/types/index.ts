export interface User {
  id: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse' | 'staff';
  name: string;
  specialization?: string;
  department?: string;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  contactNumber: string;
  address: string;
  medicalHistory: string[];
  currentStatus: 'admitted' | 'discharged' | 'emergency';
  admissionDate?: string;
  dischargeDate?: string;
}

export interface Schedule {
  id: string;
  userId: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night';
  department: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  startTime?: string;
  endTime?: string;
  duration?: number;
  value?: number;
  location?: string;
  sector?: 'presencial' | 'telemedicina';
  professionalType?: 'pj' | 'clt' | 'autonomo';
  specialty?: string;
  isFixed?: boolean;
  isCoverage?: boolean;
  observations?: string;
  internalComments?: string;
  checkInTime?: string;
  checkOutTime?: string;
  candidacyEnabled?: boolean;
  candidacyGroups?: string[];
  notificationSent?: boolean;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'medical' | 'general';
  status: 'available' | 'in-use' | 'maintenance';
  location: string;
  lastMaintenance: string;
  nextMaintenance: string;
}

export interface ScheduleCandidate {
  id: string;
  scheduleId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  updatedAt?: string;
}

export interface HealthUnit {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  sectors: ('presencial' | 'telemedicina')[];
  isActive: boolean;
}

export interface ProfessionalType {
  id: string;
  name: string;
  contractType: 'pj' | 'clt' | 'autonomo';
  specialty: string;
}