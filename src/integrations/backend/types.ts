// Auth DTOs
export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  roles?: AppRole[];
}

export interface AuthResponse {
  accessToken: string;
}

// Enums
export enum AppRole {
  ADMIN = 'admin',
  INSTRUCTOR = 'instructor',
  STUDENT = 'student',
}

export enum CourseLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

// User Entities
export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: string;
  userId: string;
  role: AppRole;
  createdAt: string;
}

// Course & Learning
export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  level: CourseLevel;
  duration?: string;
  isActive: boolean;
  googleFormLink?: string;
  whatsappNumber?: string;
  upiPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
}

export interface CourseClass {
  id: string;
  courseId: string;
  instructorId?: string;
  title: string;
  scheduledAt: string;
  meetLink?: string;
  createdAt: string;
}

export interface InstructorCourse {
  id: string;
  instructorId: string;
  courseId: string;
  assignedAt: string;
}

// Events
export interface Event {
  id: string;
  name: string;
  description?: string;
  eventDate: string;
  bannerUrl?: string;
  googleFormLink?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Admissions
export interface Admission {
  id: string;
  courseId: string;
  userId?: string;
  applicantName: string;
  dateOfBirth: string;
  gender: string;
  fatherName: string;
  motherName: string;
  email: string;
  phoneNumber: string;
  address: string;
  photoUrl?: string;
  classMode: string;
  preferredBatch?: string;
  referralCode?: string;
  status: string;
  createdAt: string;
}

// Payments
export interface Payment {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  status: string;
  transactionReference?: string;
  createdAt: string;
}

// Site Settings
export interface SiteSetting {
  id: string;
  settingKey: string;
  settingValue?: string;
  updatedAt: string;
}

// API Response Types
export interface ListResponse<T> extends Array<T> {}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ErrorResponse {
  message: string;
  status: number;
  timestamp: string;
}
