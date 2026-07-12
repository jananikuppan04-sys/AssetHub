import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, QrCode, Edit, Trash2, Printer, Download, MapPin, Tag, Briefcase, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAssetDetails, useAssetTimeline, useAssetDocuments } from '@/hooks/useAssets';
import { ROUTES } from '@/constants/routes';

export default function AssetDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: asset, isLoading } = useAssetDetails(id);
  const { data: timeline } = useAssetTimeline(id);
  const { data: documents } = useAssetDocuments(id);

  if (isLoading || !asset) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading Asset Data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Back & Actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(ROUTES.ASSETS)} className="text-muted-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Inventory
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Printer className="h-4 w-4 mr-2"/> Print Label</Button>
          <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.ASSET_EDIT(asset._id))}><Edit className="h-4 w-4 mr-2"/> Edit Asset</Button>
          <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4 mr-2"/> Retire</Button>
        </div>
      </div>

      {/* Asset Header Card */}
      <Card className="overflow-hidden">
        <div className="flex flex-col md:flex-row gap-6 p-6">
          <div className="w-full md:w-48 h-48 bg-muted rounded-xl border flex items-center justify-center shrink-0">
            {asset.imageUrl ? (
              <img src={asset.imageUrl} alt={asset.assetName} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <QrCode className="h-20 w-20 text-muted-foreground/30" />
            )}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">{asset.assetName}</h1>
                <Badge variant={asset.status === 'Available' ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                  {asset.status}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <Tag className="h-4 w-4" /> <span className="font-mono">{asset.assetTag}</span> • {typeof asset.category === 'string' ? asset.category : asset.category.name}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Assigned To</p>
                <p className="font-medium flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5 text-primary"/> {typeof asset.assignedTo === 'string' ? asset.assignedTo : asset.assignedTo?.name || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Department</p>
                <p className="font-medium">{typeof asset.department === 'string' ? asset.department : asset.department.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Location</p>
                <p className="font-medium flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary"/> {asset.location || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Health Score</p>
                <div className="flex items-center gap-2">
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden max-w-[80px]">
                    <div className="h-full bg-green-500" style={{ width: `${asset.healthScore || 100}%` }} />
                  </div>
                  <span className="text-sm font-medium">{asset.healthScore || 100}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs Layout */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start h-12 bg-transparent border-b rounded-none mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full bg-transparent px-6">Overview</TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full bg-transparent px-6">Lifecycle Timeline</TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full bg-transparent px-6">Documents ({documents?.length || 0})</TabsTrigger>
          <TabsTrigger value="qrcode" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full bg-transparent px-6">QR Code</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Purchase & Vendor Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-y-4">
                  <div><p className="text-sm text-muted-foreground">Manufacturer</p><p className="font-medium">{asset.manufacturer || '—'}</p></div>
                  <div><p className="text-sm text-muted-foreground">Model</p><p className="font-medium">{asset.model || '—'}</p></div>
                  <div><p className="text-sm text-muted-foreground">Serial Number</p><p className="font-mono text-sm">{asset.serialNumber || '—'}</p></div>
                  <div><p className="text-sm text-muted-foreground">Vendor</p><p className="font-medium">{asset.vendor || '—'}</p></div>
                  <div><p className="text-sm text-muted-foreground">Purchase Date</p><p className="font-medium">{asset.purchaseDate || '—'}</p></div>
                  <div><p className="text-sm text-muted-foreground">Purchase Cost</p><p className="font-medium">${asset.purchasePrice || '—'}</p></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Maintenance & Warranty</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-y-4">
                  <div><p className="text-sm text-muted-foreground">Warranty Start</p><p className="font-medium flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5"/> {asset.warrantyStart || '—'}</p></div>
                  <div><p className="text-sm text-muted-foreground">Warranty End</p><p className="font-medium flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5"/> {asset.warrantyEnd || '—'}</p></div>
                  <div><p className="text-sm text-muted-foreground">Current Condition</p><p className="font-medium">{asset.condition || '—'}</p></div>
                  <div><p className="text-sm text-muted-foreground">Maintenance Count</p><p className="font-medium">{asset.maintenanceCount || 0}</p></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader><CardTitle>Asset Lifecycle</CardTitle></CardHeader>
            <CardContent>
              <div className="relative border-l border-muted ml-3 space-y-6 pb-4">
                {timeline?.map((event) => (
                  <div key={event._id} className="relative pl-6">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-1.5 ring-4 ring-background" />
                    <p className="text-sm font-semibold capitalize">{event.type}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{event.date} {event.user && `• by ${event.user}`}</p>
                    <p className="text-sm mt-2">{event.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {documents?.map(doc => (
              <Card key={doc._id} className="flex flex-col items-center p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer border-dashed">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Download className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-sm truncate w-full">{doc.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 uppercase">{doc.type} • {(doc.size / 1024 / 1024).toFixed(2)} MB</p>
              </Card>
            ))}
            <Card className="flex flex-col items-center justify-center p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer border-dashed border-2 bg-muted/20">
                <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="font-medium text-sm text-muted-foreground">Upload Document</h3>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="qrcode">
          <Card className="max-w-md mx-auto text-center">
            <CardHeader><CardTitle>Asset Identity Tag</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-xl border mb-6 shadow-sm">
                <QrCode className="w-48 h-48 text-black" />
              </div>
              <p className="font-mono text-lg font-bold tracking-widest">{asset.assetTag}</p>
              <p className="text-sm text-muted-foreground mb-6">{asset.assetName}</p>
              <Button className="w-full" variant="outline"><Download className="h-4 w-4 mr-2"/> Download Label PNG</Button>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
