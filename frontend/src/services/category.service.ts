import type { Category } from '@/types';
import { API } from '@/constants/api';
import { BaseService } from './base.service';

export const categoryService = new BaseService<Category>(API.CATEGORIES.BASE);
