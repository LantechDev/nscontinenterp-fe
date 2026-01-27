export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
  role?: string;
  banned?: boolean;
  banReason?: string;
  banExpires?: string;
  lastLogin?: string; // Not in spec but present in existing code usage
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
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
  user: User;
}

export interface AuthResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  url?: string;
  redirect?: boolean;
}

export interface SignUpResponse {
  token?: string;
  user: User;
}

export interface UserListResponse {
  users: User[];
}
