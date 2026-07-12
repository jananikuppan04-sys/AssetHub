import { z } from 'zod';

// ================================================================
// Auth Schemas
// ================================================================
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    department: z.string().optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// ================================================================
// Department & Category Schemas
// ================================================================
export const departmentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  headOf: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
});

// ================================================================
// Asset Schema
// ================================================================
export const assetSchema = z.object({
  assetName: z.string().min(2, 'Asset name is required'),
  assetTag: z.string().min(1, 'Asset tag is required'),
  category: z.string().min(1, 'Category is required'),
  department: z.string().min(1, 'Department is required'),
  status: z.enum(['Available', 'Allocated', 'Maintenance', 'Lost', 'Retired', 'Disposed']),
  condition: z.enum(['Excellent', 'Good', 'Average', 'Poor', 'Damaged']),
  location: z.string().optional(),
  serialNumber: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchasePrice: z.coerce.number().min(0).optional(),
  warrantyPeriodMonths: z.coerce.number().min(0).optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
});

// ================================================================
// Employee Schema
// ================================================================
export const employeeSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  role: z.enum(['admin', 'asset_manager', 'department_head', 'employee']),
  department: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(8).optional(),
});

// ================================================================
// Allocation Schema
// ================================================================
export const allocationSchema = z.object({
  asset: z.string().min(1, 'Asset is required'),
  employee: z.string().min(1, 'Employee is required'),
  department: z.string().min(1, 'Department is required'),
  allocationDate: z.string().min(1, 'Allocation date is required'),
  expectedReturnDate: z.string().optional(),
  purpose: z.string().optional(),
  notes: z.string().optional(),
});

// ================================================================
// Booking Schema
// ================================================================
export const bookingSchema = z.object({
  asset: z.string().min(1, 'Asset is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  purpose: z.string().min(5, 'Please describe the purpose (min 5 characters)'),
});

// ================================================================
// Maintenance Schema
// ================================================================
export const maintenanceSchema = z.object({
  asset: z.string().min(1, 'Asset is required'),
  issueDescription: z.string().min(10, 'Please describe the issue in detail'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  scheduledDate: z.string().optional(),
  estimatedCost: z.coerce.number().min(0).optional(),
});

export const maintenanceResolveSchema = z.object({
  resolutionNotes: z.string().min(10, 'Please describe the resolution'),
  actualCost: z.coerce.number().min(0).optional(),
  condition: z.enum(['Excellent', 'Good', 'Average', 'Poor', 'Damaged']),
});

// ================================================================
// Audit Schema
// ================================================================
export const auditSchema = z.object({
  auditName: z.string().min(2, 'Audit name is required'),
  department: z.string().min(1, 'Department is required'),
  auditor: z.string().min(1, 'Auditor is required'),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
});

// ================================================================
// Inferred Types
// ================================================================
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type AssetFormValues = z.infer<typeof assetSchema>;
export type DepartmentFormValues = z.infer<typeof departmentSchema>;
export type CategoryFormValues = z.infer<typeof categorySchema>;
export type EmployeeFormValues = z.infer<typeof employeeSchema>;
export type AllocationFormValues = z.infer<typeof allocationSchema>;
export type BookingFormValues = z.infer<typeof bookingSchema>;
export type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;
export type AuditFormValues = z.infer<typeof auditSchema>;
