/**
 * workflowService.ts
 * 
 * Mock-first service layer for all workflow operations.
 * Replace mock functions with real axiosInstance calls as the backend matures.
 */

import type { Allocation, Booking, Maintenance, Audit } from '@/types';
import type {
  AllocationRequest,
  ReturnRequest,
  TransferRequest,
  MaintenanceRequestForm,
  ResolutionForm,
  AssetReportData,
  MaintenanceReportData,
  BookingReportData,
  AuditReportData,
} from '../types/workflow.types';

// ---------------------------------------------------------------
// MOCK DATA
// ---------------------------------------------------------------

const MOCK_ALLOCATIONS: AllocationRequest[] = [
  {
    _id: 'alloc-1', asset: 'asset-1', employee: 'emp-1', department: 'dept-1',
    requestedBy: 'manager-1', approvalStatus: 'Pending',
    allocationDate: '2026-07-10', expectedReturnDate: '2026-08-10',
    purpose: 'Project Athena development', remarks: 'Urgent requirement',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: 'alloc-2', asset: 'asset-2', employee: 'emp-2', department: 'dept-2',
    requestedBy: 'manager-1', approvalStatus: 'Approved',
    allocationDate: '2026-07-05', expectedReturnDate: '2026-09-05',
    purpose: 'Sales demo equipment', createdAt: new Date(Date.now() - 604800000).toISOString(),
    updatedAt: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    _id: 'alloc-3', asset: 'asset-3', employee: 'emp-3', department: 'dept-1',
    requestedBy: 'emp-3', approvalStatus: 'Rejected',
    allocationDate: '2026-07-01', purpose: 'Personal use request',
    approverComment: 'Not aligned with policy.',
    createdAt: new Date(Date.now() - 1209600000).toISOString(),
    updatedAt: new Date(Date.now() - 1209600000).toISOString(),
  },
];

const MOCK_BOOKINGS: Booking[] = [
  {
    _id: 'book-1', asset: 'Conference Room A' as any, requestedBy: 'emp-1' as any,
    status: 'Approved', startDate: '2026-07-13T09:00:00', endDate: '2026-07-13T11:00:00',
    purpose: 'Team standup', createdAt: new Date().toISOString(),
  },
  {
    _id: 'book-2', asset: 'Projector XD-200' as any, requestedBy: 'emp-2' as any,
    status: 'Pending', startDate: '2026-07-14T14:00:00', endDate: '2026-07-14T16:00:00',
    purpose: 'Client presentation', createdAt: new Date().toISOString(),
  },
  {
    _id: 'book-3', asset: 'Conference Room B' as any, requestedBy: 'emp-3' as any,
    status: 'Rejected', startDate: '2026-07-12T10:00:00', endDate: '2026-07-12T11:00:00',
    purpose: 'Training session', rejectionReason: 'Conflict with existing booking',
    createdAt: new Date().toISOString(),
  },
];

const MOCK_MAINTENANCE: Maintenance[] = [
  {
    _id: 'maint-1', asset: 'asset-1' as any, requestedBy: 'emp-1' as any,
    status: 'Pending', priority: 'High', issueDescription: 'Screen flickering intermittently',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    _id: 'maint-2', asset: 'asset-2' as any, requestedBy: 'emp-2' as any,
    assignedTo: 'tech-1' as any, status: 'InProgress', priority: 'Critical',
    issueDescription: 'Server not booting after power outage',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: 'maint-3', asset: 'asset-3' as any, requestedBy: 'emp-3' as any,
    status: 'Resolved', priority: 'Low', issueDescription: 'Keyboard keys sticky',
    resolutionNotes: 'Cleaned and replaced keycaps', actualCost: 25,
    resolvedDate: new Date(Date.now() - 43200000).toISOString(),
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

const MOCK_AUDITS: Audit[] = [
  {
    _id: 'audit-1', auditName: 'Q3 IT Audit 2026', department: 'Engineering' as any,
    auditor: 'auditor-1' as any, status: 'InProgress', scheduledDate: '2026-07-15',
    assets: [], createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: 'audit-2', auditName: 'Sales Dept Audit', department: 'Sales' as any,
    auditor: 'auditor-1' as any, status: 'Completed', scheduledDate: '2026-06-30',
    startDate: '2026-06-30', endDate: '2026-07-01',
    assets: [], missingAssets: ['asset-x'], createdAt: new Date(Date.now() - 1296000000).toISOString(),
  },
];

// ---------------------------------------------------------------
// ALLOCATION SERVICE
// ---------------------------------------------------------------
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const workflowService = {
  // Allocations
  getAllocations: async (): Promise<AllocationRequest[]> => {
    await delay(400);
    return MOCK_ALLOCATIONS;
  },
  createAllocation: async (data: Partial<AllocationRequest>): Promise<AllocationRequest> => {
    await delay(600);
    const newRecord: AllocationRequest = {
      _id: `alloc-${Date.now()}`,
      asset: data.asset || '',
      employee: data.employee || '',
      department: data.department || '',
      requestedBy: 'current-user',
      approvalStatus: 'Pending',
      allocationDate: data.allocationDate || new Date().toISOString(),
      expectedReturnDate: data.expectedReturnDate,
      purpose: data.purpose || '',
      remarks: data.remarks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_ALLOCATIONS.unshift(newRecord);
    return newRecord;
  },
  approveAllocation: async (id: string, approved: boolean, comment?: string): Promise<void> => {
    await delay(400);
    const idx = MOCK_ALLOCATIONS.findIndex(a => a._id === id);
    if (idx !== -1) {
      MOCK_ALLOCATIONS[idx].approvalStatus = approved ? 'Approved' : 'Rejected';
      MOCK_ALLOCATIONS[idx].approverComment = comment;
    }
  },
  returnAsset: async (data: ReturnRequest): Promise<void> => {
    await delay(400);
    console.log('Return asset:', data);
  },
  createTransfer: async (data: Partial<TransferRequest>): Promise<TransferRequest> => {
    await delay(500);
    return { _id: `tr-${Date.now()}`, ...data, approvalStatus: 'Pending', createdAt: new Date().toISOString() } as TransferRequest;
  },

  // Bookings
  getBookings: async (): Promise<Booking[]> => {
    await delay(400);
    return MOCK_BOOKINGS;
  },
  createBooking: async (data: Partial<Booking>): Promise<Booking> => {
    await delay(500);
    const newBooking: Booking = {
      _id: `book-${Date.now()}`,
      asset: data.asset || '',
      requestedBy: 'current-user' as any,
      status: 'Pending',
      startDate: data.startDate || '',
      endDate: data.endDate || '',
      purpose: data.purpose || '',
      createdAt: new Date().toISOString(),
    };
    MOCK_BOOKINGS.unshift(newBooking);
    return newBooking;
  },
  approveBooking: async (id: string, approved: boolean, reason?: string): Promise<void> => {
    await delay(400);
    const idx = MOCK_BOOKINGS.findIndex(b => b._id === id);
    if (idx !== -1) {
      MOCK_BOOKINGS[idx].status = approved ? 'Approved' : 'Rejected';
      MOCK_BOOKINGS[idx].rejectionReason = reason;
    }
  },

  // Maintenance
  getMaintenanceRequests: async (): Promise<Maintenance[]> => {
    await delay(400);
    return MOCK_MAINTENANCE;
  },
  createMaintenanceRequest: async (data: MaintenanceRequestForm): Promise<Maintenance> => {
    await delay(600);
    const newRequest: Maintenance = {
      _id: `maint-${Date.now()}`,
      asset: data.assetId as any,
      requestedBy: 'current-user' as any,
      status: 'Pending',
      priority: data.priority,
      issueDescription: data.description,
      createdAt: new Date().toISOString(),
    };
    MOCK_MAINTENANCE.unshift(newRequest);
    return newRequest;
  },
  resolveMaintenanceRequest: async (data: ResolutionForm): Promise<void> => {
    await delay(500);
    const idx = MOCK_MAINTENANCE.findIndex(m => m._id === data.maintenanceId);
    if (idx !== -1) {
      MOCK_MAINTENANCE[idx].status = 'Resolved';
      MOCK_MAINTENANCE[idx].resolutionNotes = data.resolutionNotes;
      MOCK_MAINTENANCE[idx].actualCost = data.actualCost;
      MOCK_MAINTENANCE[idx].resolvedDate = data.completionDate;
    }
  },

  // Audits
  getAudits: async (): Promise<Audit[]> => {
    await delay(400);
    return MOCK_AUDITS;
  },
  createAudit: async (data: Partial<Audit>): Promise<Audit> => {
    await delay(600);
    const newAudit: Audit = {
      _id: `audit-${Date.now()}`,
      auditName: data.auditName || '',
      department: data.department || '',
      auditor: 'current-user' as any,
      status: 'Scheduled',
      scheduledDate: data.scheduledDate || new Date().toISOString(),
      assets: [],
      createdAt: new Date().toISOString(),
    };
    MOCK_AUDITS.unshift(newAudit);
    return newAudit;
  },

  // Reports
  getAssetReport: async (): Promise<AssetReportData> => {
    await delay(500);
    return {
      totalAssets: 499,
      byStatus: [
        { name: 'Available', value: 124 },
        { name: 'Allocated', value: 280 },
        { name: 'Maintenance', value: 35 },
        { name: 'Lost', value: 12 },
        { name: 'Retired', value: 48 },
      ],
      byCategory: [
        { name: 'Laptop', value: 210 },
        { name: 'Desktop', value: 120 },
        { name: 'Mobile', value: 75 },
        { name: 'Server', value: 55 },
        { name: 'Equipment', value: 39 },
      ],
      byDepartment: [
        { name: 'Engineering', count: 180, cost: 540000 },
        { name: 'Sales', count: 95, cost: 190000 },
        { name: 'HR', count: 40, cost: 80000 },
        { name: 'Finance', count: 60, cost: 120000 },
        { name: 'Operations', count: 124, cost: 248000 },
      ],
    };
  },
  getMaintenanceReport: async (): Promise<MaintenanceReportData> => {
    await delay(500);
    return {
      totalRequests: 87,
      resolved: 64,
      pending: 23,
      totalCost: 18540,
      byMonth: [
        { month: 'Jan', count: 12, cost: 2100 },
        { month: 'Feb', count: 8, cost: 1800 },
        { month: 'Mar', count: 15, cost: 3200 },
        { month: 'Apr', count: 11, cost: 2400 },
        { month: 'May', count: 18, cost: 4200 },
        { month: 'Jun', count: 23, cost: 4840 },
      ],
    };
  },
  getBookingReport: async (): Promise<BookingReportData> => {
    await delay(500);
    return {
      totalBookings: 342,
      approved: 290,
      rejected: 52,
      byDepartment: [
        { name: 'Engineering', count: 120 },
        { name: 'Sales', count: 90 },
        { name: 'HR', count: 45 },
        { name: 'Finance', count: 55 },
        { name: 'Operations', count: 32 },
      ],
      byResource: [
        { name: 'Conference Room A', count: 145 },
        { name: 'Conference Room B', count: 98 },
        { name: 'Projector XD-200', count: 67 },
        { name: 'Training Lab', count: 32 },
      ],
    };
  },
  getAuditReport: async (): Promise<AuditReportData> => {
    await delay(500);
    return {
      totalAudits: 12,
      completed: 9,
      totalVerified: 2840,
      totalMissing: 23,
      totalDamaged: 47,
    };
  },
};
