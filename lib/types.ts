// User & Auth Types
export type UserRole = 'admin' | 'asset_manager' | 'department_head' | 'employee'

export interface User {
  id: string
  email: string
  name: string
  department: string
  role: UserRole
  createdAt: Date
}

// Asset Types
export type AssetStatus = 'active' | 'maintenance' | 'retired' | 'lost' | 'damaged'
export type AssetCondition = 'excellent' | 'good' | 'fair' | 'poor'

export interface Asset {
  id: string
  assetId: string // AST-001, AST-002, etc
  name: string
  category: string
  description: string
  purchaseDate: Date
  purchasePrice: number
  warrantyExpiry?: Date
  location: string
  department: string
  owner?: string
  condition: AssetCondition
  status: AssetStatus
  healthScore: number // 0-100
  serialNumber?: string
  qrCode: string
  lastMaintenance?: Date
  nextMaintenanceDate?: Date
  createdAt: Date
  updatedAt: Date
  tags: string[]
}

// Allocation Types
export type AllocationStatus = 'pending' | 'approved' | 'assigned' | 'returned'

export interface Allocation {
  id: string
  assetId: string
  employeeId: string
  requestedBy: string
  requestedAt: Date
  status: AllocationStatus
  startDate: Date
  endDate?: Date
  approvalNotes?: string
  approvedBy?: string
  approvedAt?: Date
  returnedAt?: Date
  returnNotes?: string
}

// Transfer Types
export type TransferStatus = 'pending_approval' | 'approved' | 'completed' | 'rejected'

export interface Transfer {
  id: string
  assetId: string
  fromDepartment: string
  toDepartment: string
  initiatedBy: string
  initiatedAt: Date
  status: TransferStatus
  approvalNotes?: string
  approvedBy?: string
  approvedAt?: Date
  completedAt?: Date
  rejectionReason?: string
}

// Maintenance Types
export type MaintenanceStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
export type MaintenanceType = 'routine' | 'preventive' | 'corrective' | 'emergency'

export interface Maintenance {
  id: string
  assetId: string
  type: MaintenanceType
  status: MaintenanceStatus
  requestedBy: string
  requestedAt: Date
  description: string
  scheduledDate?: Date
  startDate?: Date
  completedDate?: Date
  cost?: number
  technician?: string
  notes?: string
  parts?: string[]
}

// Booking Types
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface Booking {
  id: string
  assetId: string
  bookedBy: string
  startDate: Date
  endDate: Date
  status: BookingStatus
  purpose: string
  approvalRequired: boolean
  approvedBy?: string
  approvedAt?: Date
  cancelledAt?: Date
  cancelReason?: string
}

// Audit Types
export type DiscrepancyStatus = 'marked_verified' | 'marked_missing' | 'marked_damaged' | 'pending'

export interface AuditDiscrepancy {
  id: string
  assetId: string
  type: 'missing' | 'damaged' | 'location_mismatch' | 'condition_mismatch'
  status: DiscrepancyStatus
  description: string
  detectedAt: Date
  detectedBy: string
  resolution?: string
  resolvedAt?: Date
  resolvedBy?: string
}

export interface Audit {
  id: string
  auditDate: Date
  initiatedBy: string
  scope: 'full' | 'department' | 'category'
  scopeValue?: string
  status: 'pending' | 'in_progress' | 'completed'
  totalItems: number
  verifiedItems: number
  discrepancies: AuditDiscrepancy[]
  completedAt?: Date
  report?: string
}

// Activity Log
export type ActivityType = 
  | 'asset_created'
  | 'asset_updated'
  | 'allocation_requested'
  | 'allocation_approved'
  | 'allocation_returned'
  | 'transfer_initiated'
  | 'transfer_approved'
  | 'transfer_completed'
  | 'maintenance_requested'
  | 'maintenance_completed'
  | 'audit_completed'
  | 'status_changed'
  | 'user_login'

export interface ActivityLog {
  id: string
  userId: string
  type: ActivityType
  assetId?: string
  description: string
  timestamp: Date
  metadata?: Record<string, any>
}

// Notification Types
export type NotificationType = 'alert' | 'info' | 'warning' | 'success'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  relatedAssetId?: string
  read: boolean
  createdAt: Date
  actionUrl?: string
}

// Department
export interface Department {
  id: string
  name: string
  head: string
  budget?: number
  assetCount: number
  createdAt: Date
}

// Category
export interface Category {
  id: string
  name: string
  icon: string
  description: string
  assetCount: number
}

// Stats & Analytics
export interface AssetStats {
  totalAssets: number
  activeAssets: number
  maintenanceAssets: number
  retiredAssets: number
  lostAssets: number
  averageHealthScore: number
}

export interface HealthScoreFactor {
  name: string
  weight: number
  score: number
  description: string
}
