export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  role?: string;
  banned?: boolean;
  banReason?: string;
  banExpires?: string;
  lastLogin?: string;
  activeOrganizationId?: string | null;
}

export interface OrganizationMetadata {
  address?: string;
  phone?: string;
  email?: string;
  taxId?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  metadata?: OrganizationMetadata;
  role?: string;
  isOwner?: boolean;
}

export interface Session {
  id: string;
  expiresAt: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  ipAddress?: string;
  userAgent?: string;
  userId: string;
  impersonatedBy?: string;
  activeOrganizationId?: string;
}

export interface AuthSession {
  session: Session;
  sessionToken: string | null;
  user: User | null;
}

export interface AuthResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface LoginResponse {
  message?: string;
  sessionToken: string;
  expiresAt: string;
  activeOrganizationId?: string | null;
  user: User;
}

export interface SignUpResponse {
  token?: string;
  user: User;
}

export interface UserListResponse {
  users: User[];
}
