// Core Types for VetConnect App

export type UserRole = 'vet' | 'stable_owner' | 'clinic_owner' | 'lab_owner';
export type EmploymentType = 'employee' | 'freelancer';
export type OrganizationType = 'stable' | 'clinic' | 'lab';
export type AppointmentStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type HorseAccessLevel = 'view' | 'edit' | 'full';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  specialization?: string;
  licenseNumber?: string;
  createdAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  ownerId: string;
}

export interface OrganizationMembership {
  id: string;
  userId: string;
  organizationId: string;
  employmentType: EmploymentType;
  startDate: Date;
  isActive: boolean;
  organization?: Organization;
}

export interface Horse {
  id: string;
  name: string;
  breed: string;
  age: number;
  color: string;
  gender: 'male' | 'female';
  microchipId?: string;
  image?: string;
  organizationId: string;
  organization?: Organization;
}

export interface HorseAccess {
  id: string;
  horseId: string;
  vetId: string;
  accessLevel: HorseAccessLevel;
  grantedBy: string;
  grantedAt: Date;
  expiresAt?: Date;
  horse?: Horse;
}

export interface Appointment {
  id: string;
  horseId: string;
  vetId: string;
  organizationId: string;
  title: string;
  description?: string;
  scheduledAt: Date;
  duration: number; // in minutes
  status: AppointmentStatus;
  location?: string;
  horse?: Horse;
  organization?: Organization;
}

export interface MedicalRecord {
  id: string;
  horseId: string;
  vetId: string;
  date: Date;
  type: 'checkup' | 'treatment' | 'surgery' | 'vaccination' | 'diagnosis';
  diagnosis?: string;
  treatment?: string;
  medications?: Medication[];
  notes?: string;
  attachments?: string[];
  horse?: Horse;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'appointment' | 'access_granted' | 'message' | 'reminder' | 'system';
  isRead: boolean;
  createdAt: Date;
  data?: Record<string, unknown>;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage?: Message;
  organization?: Organization;
  unreadCount: number;
}
