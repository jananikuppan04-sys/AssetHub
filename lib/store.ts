'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  User, Asset, Allocation, Transfer, Maintenance, Booking, Audit, ActivityLog,
  Notification, Department, Category, UserRole, AssetStatus, AssetCondition,
  AllocationStatus, TransferStatus, MaintenanceStatus, BookingStatus
} from './types'

const STORAGE_KEY = 'assetsphere_data'

// Initial Demo Data
const DEMO_USERS: User[] = [
  {
    id: 'user_admin',
    email: 'admin@assetsphere.com',
    name: 'Sarah Chen',
    department: 'IT',
    role: 'admin',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'user_manager',
    email: 'manager@assetsphere.com',
    name: 'James Wilson',
    department: 'Operations',
    role: 'asset_manager',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'user_head',
    email: 'head@assetsphere.com',
    name: 'Michelle Rodriguez',
    department: 'Finance',
    role: 'department_head',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'user_emp',
    email: 'emp@assetsphere.com',
    name: 'David Kumar',
    department: 'Finance',
    role: 'employee',
    createdAt: new Date('2024-01-01')
  }
]

const DEMO_DEPARTMENTS: Department[] = [
  { id: 'dept_it', name: 'IT', head: 'Sarah Chen', budget: 150000, assetCount: 45, createdAt: new Date('2024-01-01') },
  { id: 'dept_ops', name: 'Operations', head: 'James Wilson', budget: 200000, assetCount: 78, createdAt: new Date('2024-01-01') },
  { id: 'dept_finance', name: 'Finance', head: 'Michelle Rodriguez', budget: 100000, assetCount: 32, createdAt: new Date('2024-01-01') },
  { id: 'dept_hr', name: 'Human Resources', head: 'Lisa Anderson', budget: 50000, assetCount: 18, createdAt: new Date('2024-01-01') }
]

const DEMO_CATEGORIES: Category[] = [
  { id: 'cat_laptop', name: 'Laptops', icon: '💻', description: 'Computing devices', assetCount: 28 },
  { id: 'cat_monitor', name: 'Monitors', icon: '🖥️', description: 'Display devices', assetCount: 35 },
  { id: 'cat_printer', name: 'Printers', icon: '🖨️', description: 'Printing devices', assetCount: 12 },
  { id: 'cat_furniture', name: 'Furniture', icon: '🪑', description: 'Office furniture', assetCount: 95 },
  { id: 'cat_phone', name: 'Mobile Devices', icon: '📱', description: 'Phones and tablets', assetCount: 18 }
]

const generateQRCode = (assetId: string) => `https://qr.example.com/${assetId}`

const DEMO_ASSETS: Asset[] = [
  {
    id: 'ast_001',
    assetId: 'AST-001',
    name: 'MacBook Pro 16"',
    category: 'Laptops',
    description: 'High-performance laptop for development',
    purchaseDate: new Date('2023-06-15'),
    purchasePrice: 2499,
    warrantyExpiry: new Date('2026-06-15'),
    location: 'Building A, Floor 3',
    department: 'IT',
    owner: 'David Kumar',
    condition: 'excellent',
    status: 'active',
    healthScore: 95,
    serialNumber: 'MB12345',
    qrCode: generateQRCode('AST-001'),
    lastMaintenance: new Date('2024-06-01'),
    nextMaintenanceDate: new Date('2024-12-01'),
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2024-06-01'),
    tags: ['high-value', 'critical', 'development']
  },
  {
    id: 'ast_002',
    assetId: 'AST-002',
    name: 'Dell Latitude 5540',
    category: 'Laptops',
    description: 'Business laptop',
    purchaseDate: new Date('2023-01-10'),
    purchasePrice: 1299,
    warrantyExpiry: new Date('2025-01-10'),
    location: 'Building B, Floor 2',
    department: 'Finance',
    owner: 'Michelle Rodriguez',
    condition: 'good',
    status: 'active',
    healthScore: 82,
    serialNumber: 'DL54321',
    qrCode: generateQRCode('AST-002'),
    lastMaintenance: new Date('2024-05-15'),
    nextMaintenanceDate: new Date('2024-11-15'),
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2024-05-15'),
    tags: ['business', 'finance']
  },
  {
    id: 'ast_003',
    assetId: 'AST-003',
    name: 'Dell U2423DE Monitor',
    category: 'Monitors',
    description: '24" Professional monitor',
    purchaseDate: new Date('2023-08-20'),
    purchasePrice: 399,
    warrantyExpiry: new Date('2025-08-20'),
    location: 'Building A, Floor 3',
    department: 'IT',
    condition: 'excellent',
    status: 'active',
    healthScore: 98,
    serialNumber: 'MON789',
    qrCode: generateQRCode('AST-003'),
    lastMaintenance: new Date('2024-06-10'),
    nextMaintenanceDate: new Date('2024-12-10'),
    createdAt: new Date('2023-08-20'),
    updatedAt: new Date('2024-06-10'),
    tags: ['peripherals', 'display']
  },
  {
    id: 'ast_004',
    assetId: 'AST-004',
    name: 'HP LaserJet Pro M404n',
    category: 'Printers',
    description: 'Network printer',
    purchaseDate: new Date('2022-11-05'),
    purchasePrice: 599,
    warrantyExpiry: new Date('2024-11-05'),
    location: 'Building A, Floor 1',
    department: 'Operations',
    condition: 'fair',
    status: 'maintenance',
    healthScore: 58,
    serialNumber: 'PR404',
    qrCode: generateQRCode('AST-004'),
    lastMaintenance: new Date('2024-06-01'),
    nextMaintenanceDate: new Date('2024-09-01'),
    createdAt: new Date('2022-11-05'),
    updatedAt: new Date('2024-06-01'),
    tags: ['shared-resource', 'network']
  },
  {
    id: 'ast_005',
    assetId: 'AST-005',
    name: 'Office Desk - Ergonomic',
    category: 'Furniture',
    description: 'Height-adjustable standing desk',
    purchaseDate: new Date('2024-01-12'),
    purchasePrice: 450,
    location: 'Building B, Floor 2',
    department: 'Finance',
    condition: 'excellent',
    status: 'active',
    healthScore: 94,
    serialNumber: 'DESK001',
    qrCode: generateQRCode('AST-005'),
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    tags: ['furniture', 'workspace']
  }
]

const DEMO_ALLOCATIONS: Allocation[] = [
  {
    id: 'alloc_001',
    assetId: 'ast_001',
    employeeId: 'user_emp',
    requestedBy: 'user_emp',
    requestedAt: new Date('2024-06-01'),
    status: 'assigned',
    startDate: new Date('2024-06-01'),
    approvalNotes: 'Approved for development project',
    approvedBy: 'user_manager',
    approvedAt: new Date('2024-06-01')
  }
]

const DEMO_MAINTENANCE: Maintenance[] = [
  {
    id: 'maint_001',
    assetId: 'ast_004',
    type: 'preventive',
    status: 'in_progress',
    requestedBy: 'user_manager',
    requestedAt: new Date('2024-06-01'),
    description: 'Replace toner cartridge and clean',
    scheduledDate: new Date('2024-09-15'),
    startDate: new Date('2024-09-10'),
    technician: 'Tech Support',
    parts: ['Toner Cartridge', 'Pickup Roller']
  }
]

const DEMO_BOOKINGS: Booking[] = [
  {
    id: 'book_001',
    assetId: 'ast_003',
    bookedBy: 'user_head',
    startDate: new Date('2024-10-01'),
    endDate: new Date('2024-10-05'),
    status: 'confirmed',
    purpose: 'Executive presentation setup',
    approvalRequired: true,
    approvedBy: 'user_manager',
    approvedAt: new Date('2024-09-28')
  }
]

// Global store state
let globalStoreState = {
  currentUser: null as User | null,
  users: DEMO_USERS,
  assets: DEMO_ASSETS,
  allocations: DEMO_ALLOCATIONS,
  transfers: [] as Transfer[],
  maintenance: DEMO_MAINTENANCE,
  bookings: DEMO_BOOKINGS,
  departments: DEMO_DEPARTMENTS,
  categories: DEMO_CATEGORIES,
  activities: [] as ActivityLog[],
  notifications: [] as Notification[]
}

// Store with localStorage persistence
export function useAssetStore() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [allocations, setAllocations] = useState<Allocation[]>([])
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [maintenance, setMaintenance] = useState<Maintenance[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Initialize store from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        const newState = {
          users: data.users || DEMO_USERS,
          assets: data.assets || DEMO_ASSETS,
          allocations: data.allocations || DEMO_ALLOCATIONS,
          transfers: data.transfers || [],
          maintenance: data.maintenance || DEMO_MAINTENANCE,
          bookings: data.bookings || DEMO_BOOKINGS,
          departments: data.departments || DEMO_DEPARTMENTS,
          categories: data.categories || DEMO_CATEGORIES,
          activities: data.activities || [],
          notifications: data.notifications || []
        }
        setUsers(newState.users)
        setAssets(newState.assets)
        setAllocations(newState.allocations)
        setTransfers(newState.transfers)
        setMaintenance(newState.maintenance)
        setBookings(newState.bookings)
        setDepartments(newState.departments)
        setCategories(newState.categories)
        setActivities(newState.activities)
        setNotifications(newState.notifications)
      } else {
        setUsers(DEMO_USERS)
        setAssets(DEMO_ASSETS)
        setAllocations(DEMO_ALLOCATIONS)
        setTransfers([])
        setMaintenance(DEMO_MAINTENANCE)
        setBookings(DEMO_BOOKINGS)
        setDepartments(DEMO_DEPARTMENTS)
        setCategories(DEMO_CATEGORIES)
        setActivities([])
        setNotifications([])
      }
      // Check for persisted user session
      const userId = typeof window !== 'undefined' ? localStorage.getItem('currentUserId') : null
      if (userId) {
        const user = DEMO_USERS.find(u => u.id === userId)
        if (user) {
          setCurrentUser(user)
        }
      }
    } catch (e) {
      setUsers(DEMO_USERS)
      setAssets(DEMO_ASSETS)
      setAllocations(DEMO_ALLOCATIONS)
      setTransfers([])
      setMaintenance(DEMO_MAINTENANCE)
      setBookings(DEMO_BOOKINGS)
      setDepartments(DEMO_DEPARTMENTS)
      setCategories(DEMO_CATEGORIES)
      setActivities([])
      setNotifications([])
    }
  }, [])

  const initializeDefaults = () => {
    setUsers(DEMO_USERS)
    setAssets(DEMO_ASSETS)
    setAllocations(DEMO_ALLOCATIONS)
    setMaintenance(DEMO_MAINTENANCE)
    setBookings(DEMO_BOOKINGS)
    setDepartments(DEMO_DEPARTMENTS)
    setCategories(DEMO_CATEGORIES)
    // Check for persisted user session
    if (typeof window !== 'undefined') {
      const userId = sessionStorage.getItem('currentUserId')
      if (userId) {
        const user = DEMO_USERS.find(u => u.id === userId)
        if (user) {
          setCurrentUser(user)
        }
      }
    }
  }

  // Persist to localStorage
  const persist = useCallback((data: any) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [])

  // Auth methods
  const login = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      setCurrentUser(user)
      // Store in local storage for persistence across navigation
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUserId', userId)
      }
      addActivity({
        userId,
        type: 'user_login',
        description: `${user.name} logged in`
      })
    }
  }, [users])

  const logout = useCallback(() => {
    setCurrentUser(null)
  }, [])

  // Asset methods
  const addAsset = useCallback((asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAsset: Asset = {
      ...asset,
      id: `ast_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const updated = [...assets, newAsset]
    setAssets(updated)
    if (currentUser) {
      addActivity({
        userId: currentUser.id,
        type: 'asset_created',
        assetId: newAsset.id,
        description: `Created asset: ${asset.name}`
      })
    }
    persist({ users, assets: updated, allocations, transfers, maintenance, bookings, departments, categories, activities, notifications })
    return newAsset
  }, [assets, currentUser, persist, users, allocations, transfers, maintenance, bookings, departments, categories, activities, notifications])

  const updateAsset = useCallback((id: string, updates: Partial<Asset>) => {
    const updated = assets.map(a => a.id === id ? { ...a, ...updates, updatedAt: new Date() } : a)
    setAssets(updated)
    if (currentUser) {
      addActivity({
        userId: currentUser.id,
        type: 'asset_updated',
        assetId: id,
        description: `Updated asset`
      })
    }
    persist({ users, assets: updated, allocations, transfers, maintenance, bookings, departments, categories, activities, notifications })
  }, [assets, currentUser, persist, users, allocations, transfers, maintenance, bookings, departments, categories, activities, notifications])

  // Allocation methods
  const requestAllocation = useCallback((assetId: string, employeeId: string, endDate?: Date) => {
    const newAlloc: Allocation = {
      id: `alloc_${Date.now()}`,
      assetId,
      employeeId,
      requestedBy: currentUser?.id || '',
      requestedAt: new Date(),
      status: 'pending',
      startDate: new Date(),
      endDate
    }
    const updated = [...allocations, newAlloc]
    setAllocations(updated)
    if (currentUser) {
      addActivity({
        userId: currentUser.id,
        type: 'allocation_requested',
        assetId,
        description: `Requested allocation for asset`
      })
    }
    persist({ users, assets, allocations: updated, transfers, maintenance, bookings, departments, categories, activities, notifications })
    return newAlloc
  }, [allocations, currentUser, persist, users, assets, transfers, maintenance, bookings, departments, categories, activities, notifications])

  // Add activity log
  const addActivity = useCallback((activity: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newActivity: ActivityLog = {
      ...activity,
      id: `act_${Date.now()}`,
      timestamp: new Date()
    }
    setActivities(prev => [newActivity, ...prev])
  }, [])

  return {
    currentUser,
    users,
    assets,
    allocations,
    transfers,
    maintenance,
    bookings,
    departments,
    categories,
    activities,
    notifications,
    login,
    logout,
    addAsset,
    updateAsset,
    requestAllocation,
    addActivity
  }
}
