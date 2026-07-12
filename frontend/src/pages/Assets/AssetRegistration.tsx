import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Save, UploadCloud } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ROUTES } from '@/constants/routes';

// ==========================================
// Zod Schema
// ==========================================
const assetSchema = z.object({
  assetName: z.string().min(3, 'Asset name is required'),
  assetTag: z.string().min(3, 'Asset tag is required'),
  category: z.string().min(1, 'Category is required'),
  department: z.string().min(1, 'Department is required'),
  status: z.enum(['Available', 'Allocated', 'Maintenance', 'Retired', 'Disposed']),
  condition: z.enum(['Excellent', 'Good', 'Average', 'Poor', 'Damaged']),
  purchasePrice: z.coerce.number().min(0, 'Price must be positive'),
  purchaseDate: z.string().optional(),
  vendor: z.string().optional(),
  manufacturer: z.string().optional(),
  serialNumber: z.string().optional(),
  description: z.string().optional(),
});

type AssetFormValues = z.infer<typeof assetSchema>;

export default function AssetRegistration() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema) as any,
    defaultValues: {
      status: 'Available',
      condition: 'Excellent',
      purchasePrice: 0,
    }
  });

  const onSubmit = async (data: AssetFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Submitting asset:', data);
      navigate(ROUTES.ASSETS);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(ROUTES.ASSETS)} className="text-muted-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>

      <PageHeader 
        title="Register New Asset" 
        description="Add a new physical or digital asset to the organizational inventory."
      />

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8">
        
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Core identity and classification details.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="assetName">Asset Name *</Label>
              <Input id="assetName" {...register('assetName')} placeholder="e.g. MacBook Pro 16" />
              {errors.assetName && <p className="text-xs text-destructive">{errors.assetName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="assetTag">Asset Tag *</Label>
              <Input id="assetTag" {...register('assetTag')} placeholder="e.g. AST-2023-001" />
              {errors.assetTag && <p className="text-xs text-destructive">{errors.assetTag.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select onValueChange={(val) => setValue('category', val)}>
                <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laptops">Laptops</SelectItem>
                  <SelectItem value="Monitors">Monitors</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Department *</Label>
              <Select onValueChange={(val) => setValue('department', val)}>
                <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </SelectContent>
              </Select>
              {errors.department && <p className="text-xs text-destructive">{errors.department.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Purchase & Vendor Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Input id="vendor" {...register('vendor')} placeholder="e.g. Apple Store" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input id="manufacturer" {...register('manufacturer')} placeholder="e.g. Apple" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input id="purchaseDate" type="date" {...register('purchaseDate')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Cost ($)</Label>
              <Input id="purchasePrice" type="number" step="0.01" {...register('purchasePrice')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input id="serialNumber" {...register('serialNumber')} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asset Status & Condition</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Current Status</Label>
              <Select defaultValue="Available" onValueChange={(val: any) => setValue('status', val)}>
                <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Allocated">Allocated</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Physical Condition</Label>
              <Select defaultValue="Excellent" onValueChange={(val: any) => setValue('condition', val)}>
                <SelectTrigger><SelectValue placeholder="Select Condition" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Average">Average</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                  <SelectItem value="Damaged">Damaged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images & Documentation</CardTitle>
            <CardDescription>Upload invoices, warranties, or photos of the asset.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
              <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-sm font-medium">Drag & drop files here, or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, PDF up to 10MB</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Label htmlFor="description">Additional Notes / Description</Label>
          <Textarea id="description" {...register('description')} rows={4} placeholder="Any specific configuration notes or warnings..." />
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.ASSETS)}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Register Asset</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
