import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Mail, Phone, MapPin, Briefcase, Key, Activity, Calendar, ShieldCheck, Download, LogOut } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Mock Data
const MOCK_USER = {
  name: 'Alex Developer',
  role: 'Software Engineer',
  department: 'Engineering',
  email: 'alex@assethub.com',
  phone: '+1 (555) 012-3456',
  location: 'San Francisco, CA',
  joinDate: '2023-01-15',
  bio: 'Senior frontend engineer working on the AssetHub ERP system.',
  permissions: ['view:dashboard', 'view:assets', 'manage:assets'],
  recentActivity: [
    { id: 1, action: 'Logged in from new IP', time: '2 hours ago', icon: Activity },
    { id: 2, action: 'Requested MacBook Pro M2', time: '3 days ago', icon: Briefcase },
    { id: 3, action: 'Updated profile picture', time: '1 week ago', icon: Camera },
  ]
};

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(500, 'Bio must be under 500 characters').optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      name: MOCK_USER.name,
      email: MOCK_USER.email,
      phone: MOCK_USER.phone,
      location: MOCK_USER.location,
      bio: MOCK_USER.bio,
    }
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Profile updated:', data);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <PageHeader 
        title="My Profile" 
        description="Manage your personal information, roles, and activity history."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="relative group cursor-pointer">
                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-md overflow-hidden">
                  <span className="text-4xl font-bold text-primary">AD</span>
                </div>
                <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-xl font-bold mt-4">{MOCK_USER.name}</h2>
              <p className="text-muted-foreground font-medium">{MOCK_USER.role}</p>
              <Badge variant="secondary" className="mt-2">{MOCK_USER.department}</Badge>
              
              <div className="w-full mt-6 space-y-3 text-sm text-left">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4" /> <span>{MOCK_USER.email}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-4 w-4" /> <span>{MOCK_USER.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4" /> <span>{MOCK_USER.location}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="h-4 w-4" /> <span>Joined {MOCK_USER.joinDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Assigned Roles & Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600"><ShieldCheck className="h-3 w-3 mr-1"/> Employee</Badge>
                {MOCK_USER.permissions.map(p => (
                  <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="w-full justify-start h-12 bg-transparent border-b rounded-none mb-6">
              <TabsTrigger value="personal" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full bg-transparent px-6">Personal Info</TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full bg-transparent px-6">Activity Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Information</CardTitle>
                  <CardDescription>Update your contact details and bio.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input {...register('name')} />
                        {errors.name && <p className="text-xs text-destructive">{errors.name.message as string}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input {...register('email')} type="email" />
                        {errors.email && <p className="text-xs text-destructive">{errors.email.message as string}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input {...register('phone')} />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input {...register('location')} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Professional Bio</Label>
                      <Textarea {...register('bio')} rows={4} />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative border-l border-muted ml-3 space-y-6 pb-4">
                    {MOCK_USER.recentActivity.map((activity) => (
                      <div key={activity.id} className="relative pl-6">
                        <div className="absolute w-6 h-6 bg-background rounded-full -left-3 top-0 ring-2 ring-muted flex items-center justify-center">
                          <activity.icon className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>

      </div>
    </div>
  );
}
