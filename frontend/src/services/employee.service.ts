import type { User } from '@/types';
import { API } from '@/constants/api';
import { BaseService } from './base.service';

export const employeeService = new BaseService<User>(API.EMPLOYEES.BASE);
