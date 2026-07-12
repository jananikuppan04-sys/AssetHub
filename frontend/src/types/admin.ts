import type { User, UserRole } from './index';
import type { Status } from './index';

// Extending base User type for full Employee Directory features
export interface Employee extends User {
  phone?: string;
  manager?: User | string;
  assetCount: number;
  status: Status;
  joinDate: string;
  designation?: string;
}

export interface PermissionMatrixItem {
  module: string;
  permissions: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    approve: boolean;
    export: boolean;
    import: boolean;
    audit: boolean;
    reports: boolean;
  };
}

export interface RoleDefinition {
  _id: string;
  name: string;
  description?: string;
  isCustom: boolean;
  userCount: number;
  matrix: PermissionMatrixItem[];
  createdAt: string;
  updatedAt: string;
}
