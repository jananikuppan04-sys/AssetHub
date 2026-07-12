// ================================================================
// Workflow-specific Extended Types
// ================================================================

import type { Asset, User, Department, AssetCondition, MaintenancePriority } from '@/types';

// ---------------------------------------------------------------
// Allocation Workflow
// ---------------------------------------------------------------
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'ChangesRequested';

export interface AllocationRequest {
  _id: string;
  asset: string | Asset;
  employee: string | User;
  department: string | Department;
  requestedBy: string | User;
  approvalStatus: ApprovalStatus;
  allocationDate: string;
  expectedReturnDate?: string;
  purpose: string;
  remarks?: string;
  approverComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnRequest {
  allocationId: string;
  assetId: string;
  returnDate: string;
  condition: AssetCondition;
  remarks?: string;
}

export interface TransferRequest {
  _id: string;
  asset: string | Asset;
  fromEmployee: string | User;
  toEmployee: string | User;
  transferDate: string;
  reason: string;
  approvalStatus: ApprovalStatus;
  approverComment?: string;
  createdAt: string;
}

// ---------------------------------------------------------------
// Booking Workflow
// ---------------------------------------------------------------
export interface BookingSlot {
  date: string; // ISO date string
  resourceId: string;
  resourceName: string;
  bookedBy: string;
  startTime: string;
  endTime: string;
  status: 'Available' | 'Booked' | 'Maintenance';
}

// ---------------------------------------------------------------
// Maintenance Workflow
// ---------------------------------------------------------------
export type IssueType = 'Hardware' | 'Software' | 'Network' | 'Peripheral' | 'Other';

export interface MaintenanceRequestForm {
  assetId: string;
  issueType: IssueType;
  priority: MaintenancePriority;
  description: string;
}

export interface ResolutionForm {
  maintenanceId: string;
  resolutionNotes: string;
  partsUsed?: string;
  actualCost?: number;
  completionDate: string;
  technicianNotes?: string;
}

// ---------------------------------------------------------------
// Audit Workflow
// ---------------------------------------------------------------
export type VerificationStatus = 'Verified' | 'Missing' | 'Damaged' | 'Mismatch';

export interface AuditVerificationRecord {
  assetId: string;
  assetTag: string;
  assetName: string;
  status: VerificationStatus;
  notes?: string;
}

export interface DiscrepancyRecord {
  assetId: string;
  assetTag: string;
  assetName: string;
  issueType: 'Missing' | 'Damaged' | 'Misallocated';
  description: string;
  responsiblePerson?: string;
}

// ---------------------------------------------------------------
// Reports
// ---------------------------------------------------------------
export interface AssetReportData {
  totalAssets: number;
  byStatus: { name: string; value: number }[];
  byCategory: { name: string; value: number }[];
  byDepartment: { name: string; count: number; cost: number }[];
}

export interface MaintenanceReportData {
  totalRequests: number;
  resolved: number;
  pending: number;
  totalCost: number;
  byMonth: { month: string; count: number; cost: number }[];
}

export interface BookingReportData {
  totalBookings: number;
  approved: number;
  rejected: number;
  byDepartment: { name: string; count: number }[];
  byResource: { name: string; count: number }[];
}

export interface AuditReportData {
  totalAudits: number;
  completed: number;
  totalVerified: number;
  totalMissing: number;
  totalDamaged: number;
}
