import type { ApiResponse, PaginatedResponse, Department, Category, Employee, RoleDefinition, FilterState } from '@/types';

// Mock Data
const MOCK_DEPARTMENTS: Department[] = [
  { _id: 'd1', name: 'Information Technology', code: 'IT', description: 'Manages all tech assets', employeeCount: 45, assetCount: 320, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'd2', name: 'Human Resources', code: 'HR', description: 'Handles employee onboarding', employeeCount: 12, assetCount: 25, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'd3', name: 'Operations', code: 'OPS', description: 'Day to day operations', employeeCount: 150, assetCount: 500, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const MOCK_CATEGORIES: Category[] = [
  { _id: 'c1', name: 'Laptops', code: 'LPT', description: 'Portable computers', assetCount: 150, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'c2', name: 'Monitors', code: 'MON', description: 'External displays', assetCount: 200, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'c3', name: 'Furniture', code: 'FUR', description: 'Desks, chairs, etc.', assetCount: 400, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const MOCK_EMPLOYEES: Employee[] = [
  { _id: 'e1', name: 'Alice Smith', email: 'alice@assethub.com', role: 'admin', designation: 'IT Director', department: 'IT', status: 'active', assetCount: 4, joinDate: '2020-01-15', isActive: true, permissions: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'e2', name: 'Bob Jones', email: 'bob@assethub.com', role: 'employee', designation: 'Software Engineer', department: 'IT', status: 'active', assetCount: 2, joinDate: '2021-03-20', isActive: true, permissions: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'e3', name: 'Carol White', email: 'carol@assethub.com', role: 'department_head', designation: 'HR Manager', department: 'HR', status: 'active', assetCount: 1, joinDate: '2019-11-05', isActive: true, permissions: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const MOCK_ROLES: RoleDefinition[] = [
  { _id: 'r1', name: 'Admin', description: 'Full system access', isCustom: false, userCount: 5, matrix: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'r2', name: 'Asset Manager', description: 'Can manage assets and bookings', isCustom: false, userCount: 12, matrix: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { _id: 'r3', name: 'Employee', description: 'Default access', isCustom: false, userCount: 300, matrix: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

class AdminService {
  private delay = 500;

  // Departments
  async getDepartments(filters?: FilterState): Promise<PaginatedResponse<Department>> {
    return new Promise(resolve => setTimeout(() => {
      resolve({
        success: true,
        message: 'Fetched departments',
        data: { data: MOCK_DEPARTMENTS, total: MOCK_DEPARTMENTS.length, page: 1, limit: 10, totalPages: 1 }
      });
    }, this.delay));
  }

  // Categories
  async getCategories(filters?: FilterState): Promise<PaginatedResponse<Category>> {
    return new Promise(resolve => setTimeout(() => {
      resolve({
        success: true,
        message: 'Fetched categories',
        data: { data: MOCK_CATEGORIES, total: MOCK_CATEGORIES.length, page: 1, limit: 10, totalPages: 1 }
      });
    }, this.delay));
  }

  // Employees
  async getEmployees(filters?: FilterState): Promise<PaginatedResponse<Employee>> {
    return new Promise(resolve => setTimeout(() => {
      resolve({
        success: true,
        message: 'Fetched employees',
        data: { data: MOCK_EMPLOYEES, total: MOCK_EMPLOYEES.length, page: 1, limit: 10, totalPages: 1 }
      });
    }, this.delay));
  }

  // Roles
  async getRoles(filters?: FilterState): Promise<PaginatedResponse<RoleDefinition>> {
    return new Promise(resolve => setTimeout(() => {
      resolve({
        success: true,
        message: 'Fetched roles',
        data: { data: MOCK_ROLES, total: MOCK_ROLES.length, page: 1, limit: 10, totalPages: 1 }
      });
    }, this.delay));
  }
}

export const adminService = new AdminService();
