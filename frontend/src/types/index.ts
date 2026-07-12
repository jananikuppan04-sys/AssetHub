// ================================================================
// Core User & Auth Types
// ================================================================
export type UserRole = 'admin' | 'asset_manager' | 'department_head' | 'employee';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string | Department;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// ================================================================
// Department & Category Types
// ================================================================
export type Status = 'active' | 'inactive' | 'archived';

export interface Department {
  _id: string;
  name: string;
  code?: string;
  description?: string;
  headOf?: string | User;
  assetCount?: number;
  employeeCount?: number;
  status?: Status;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  code?: string;
  description?: string;
  assetCount?: number;
  icon?: string;
  color?: string;
  status?: Status;
  createdAt: string;
  updatedAt?: string;
}

// ================================================================
// Asset Types
// ================================================================
export type AssetStatus = 'Available' | 'Allocated' | 'Maintenance' | 'Lost' | 'Retired' | 'Disposed';
export type AssetCondition = 'Excellent' | 'Good' | 'Average' | 'Poor' | 'Damaged';

export interface Asset {
  _id: string;
  assetTag: string;
  assetName: string;
  description?: string;
  category: string | Category;
  department: string | Department;
  status: AssetStatus;
  condition: AssetCondition;
  location?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  vendor?: string;
  manufacturer?: string;
  model?: string;
  warrantyStart?: string;
  warrantyEnd?: string;
  healthScore?: number;
  serialNumber?: string;
  barcode?: string;
  qrCode?: string;
  imageUrl?: string;
  images?: string[];
  assignedTo?: string | User;
  maintenanceCount?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssetDocument {
  _id: string;
  assetId: string;
  name: string;
  type: 'invoice' | 'warranty' | 'manual' | 'certificate' | 'other';
  url: string;
  size: number;
  uploadedBy: string | User;
  createdAt: string;
}

export interface AssetTimelineEvent {
  _id: string;
  assetId: string;
  type: 'created' | 'allocated' | 'transferred' | 'returned' | 'maintenance' | 'audit' | 'updated' | 'retired';
  description: string;
  user?: string | User;
  date: string;
  metadata?: Record<string, any>;
}

// ================================================================
// Allocation Types
// ================================================================
export type AllocationStatus = 'Active' | 'Returned' | 'Overdue' | 'Transferred';

export interface Allocation {
  _id: string;
  asset: string | Asset;
  employee: string | User;
  department: string | Department;
  allocatedBy: string | User;
  status: AllocationStatus;
  allocationDate: string;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  purpose?: string;
  condition?: AssetCondition;
  notes?: string;
  createdAt: string;
}

// ================================================================
// Booking Types
// ================================================================
export type BookingStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled' | 'Completed';

export interface Booking {
  _id: string;
  asset: string | Asset;
  requestedBy: string | User;
  approvedBy?: string | User;
  status: BookingStatus;
  startDate: string;
  endDate: string;
  purpose: string;
  rejectionReason?: string;
  createdAt: string;
}

// ================================================================
// Maintenance Types
// ================================================================
export type MaintenanceStatus = 'Pending' | 'Approved' | 'Assigned' | 'InProgress' | 'Resolved' | 'Cancelled';
export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Maintenance {
  _id: string;
  asset: string | Asset;
  requestedBy: string | User;
  assignedTo?: string | User;
  approvedBy?: string | User;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  issueDescription: string;
  resolutionNotes?: string;
  estimatedCost?: number;
  actualCost?: number;
  scheduledDate?: string;
  resolvedDate?: string;
  createdAt: string;
}

// ================================================================
// Audit Types
// ================================================================
export type AuditStatus = 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled';

export interface AuditAssetRecord {
  asset: string | Asset;
  isPresent: boolean;
  condition?: AssetCondition;
  notes?: string;
}

export interface Audit {
  _id: string;
  auditName: string;
  department: string | Department;
  auditor: string | User;
  status: AuditStatus;
  scheduledDate: string;
  startDate?: string;
  endDate?: string;
  assets: AuditAssetRecord[];
  missingAssets?: string[];
  damagedAssets?: string[];
  remarks?: string;
  createdAt: string;
}

// ================================================================
// Notification Types
// ================================================================
export type NotificationStatus = 'read' | 'unread';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';
export type NotificationCategory = 'asset' | 'workflow' | 'system';
export type NotificationType = 
  // Asset
  | 'asset_assigned' | 'asset_returned' | 'asset_transfer' | 'maintenance_due'
  // Workflow
  | 'approval_pending' | 'approval_approved' | 'approval_rejected'
  // System
  | 'security_alert' | 'system_update' | 'account_activity';

export interface Notification {
  _id: string;
  recipient: string;
  title: string;
  message: string;
  category: NotificationCategory;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  referenceId?: string;
  createdAt: string;
}

// ================================================================
// Activity Log Types
// ================================================================
export interface ActivityLog {
  _id: string;
  user: string | User;
  action: string;
  module: string;
  description: string;
  ipAddress?: string;
  previousValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  createdAt: string;
}

// ================================================================
// API Response Types
// ================================================================
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: { field?: string; message: string }[];
}

export interface PaginatedData<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: PaginatedData<T>;
}

// ================================================================
// UI / Navigation Types
// ================================================================
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  className?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface FilterState {
  search?: string;
  status?: string;
  department?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export * from './dashboard';

export * from './analytics';
export * from './admin';
