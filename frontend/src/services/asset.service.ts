import type { Asset, AssetDocument, AssetTimelineEvent, PaginatedResponse, FilterState } from '@/types';

const MOCK_ASSETS: Asset[] = [
  {
    _id: 'a1',
    assetTag: 'AST-2023-001',
    assetName: 'MacBook Pro 16" M2',
    description: 'High performance laptop for engineering',
    category: 'Laptops',
    department: 'Engineering',
    status: 'Allocated',
    condition: 'Excellent',
    location: 'New York Office',
    purchaseDate: '2023-01-15',
    purchasePrice: 2499,
    vendor: 'Apple Inc',
    manufacturer: 'Apple',
    model: 'MacBook Pro',
    warrantyStart: '2023-01-15',
    warrantyEnd: '2026-01-15',
    healthScore: 98,
    serialNumber: 'C02F239324',
    assignedTo: 'Alice Smith',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'a2',
    assetTag: 'AST-2023-002',
    assetName: 'Dell UltraSharp 32"',
    category: 'Monitors',
    department: 'Design',
    status: 'Available',
    condition: 'Good',
    location: 'London Office',
    purchaseDate: '2023-03-10',
    purchasePrice: 899,
    vendor: 'Dell',
    manufacturer: 'Dell',
    model: 'U3223QE',
    healthScore: 85,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

class AssetService {
  private delay = 500;

  async getAssets(filters?: FilterState): Promise<PaginatedResponse<Asset>> {
    return new Promise(resolve => setTimeout(() => {
      resolve({
        success: true,
        message: 'Fetched assets',
        data: { data: MOCK_ASSETS, total: MOCK_ASSETS.length, page: 1, limit: 10, totalPages: 1 }
      });
    }, this.delay));
  }

  async getAsset(id: string): Promise<{ success: boolean; data: Asset }> {
    return new Promise(resolve => setTimeout(() => {
      const asset = MOCK_ASSETS.find(a => a._id === id) || MOCK_ASSETS[0];
      resolve({ success: true, data: asset });
    }, this.delay));
  }

  async getAssetTimeline(id: string): Promise<{ success: boolean; data: AssetTimelineEvent[] }> {
    return new Promise(resolve => setTimeout(() => {
      resolve({
        success: true,
        data: [
          { _id: 't1', assetId: id, type: 'created', description: 'Asset registered in system', date: '2023-01-15' },
          { _id: 't2', assetId: id, type: 'allocated', description: 'Assigned to Alice Smith', date: '2023-01-16', user: 'Admin' }
        ]
      });
    }, this.delay));
  }

  async getAssetDocuments(id: string): Promise<{ success: boolean; data: AssetDocument[] }> {
    return new Promise(resolve => setTimeout(() => {
      resolve({
        success: true,
        data: [
          { _id: 'd1', assetId: id, name: 'Invoice_1023.pdf', type: 'invoice', url: '#', size: 1024000, uploadedBy: 'Admin', createdAt: '2023-01-15' },
          { _id: 'd2', assetId: id, name: 'Warranty_Terms.pdf', type: 'warranty', url: '#', size: 512000, uploadedBy: 'Admin', createdAt: '2023-01-15' }
        ]
      });
    }, this.delay));
  }
}

export const assetService = new AssetService();
