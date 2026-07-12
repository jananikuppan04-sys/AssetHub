import type { Department } from '@/types';
import { API } from '@/constants/api';
import { BaseService } from './base.service';

export const departmentService = new BaseService<Department>(API.DEPARTMENTS.BASE);
