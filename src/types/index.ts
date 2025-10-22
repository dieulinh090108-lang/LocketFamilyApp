// Common types
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FamilyMember extends User {
  role: 'admin' | 'member';
  relationship: string;
  joinedAt: Date;
}

export interface Family {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  members: FamilyMember[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  thumbnail?: string;
  uploadedBy: string;
  uploadedAt: Date;
  familyId: string;
  tags?: string[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Profile: { userId: string };
  FamilyDetails: { familyId: string };
  MediaDetails: { mediaId: string };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Family: undefined;
  Photos: undefined;
  Settings: undefined;
};
