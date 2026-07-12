import React from 'react';
import { Building2, Clock, Briefcase } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { UserAvatar } from '@/components/avatars/UserAvatar';
import { formatRelativeTime } from '@/utils';
import { CloudRain, BriefcaseBusiness } from 'lucide-react';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function WelcomeCard() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Extract department name if populated
  const deptName = typeof user.department === 'string' ? user.department : user.department?.name;
  const firstName = user.name.split(' ')[0];

  return (
    <div className="relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-8 border-primary/20">
      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        
        {/* User Info */}
        <div className="flex items-center gap-5">
          <UserAvatar name={user.name} src={user.avatar} size="lg" className="h-20 w-20 border-4 border-background shadow-md hidden sm:block" />
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              {getGreeting()}, {firstName} 👋
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              Let's manage today's assets efficiently and keep operations running smoothly.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-3 pt-2 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5 bg-background/50 px-2.5 py-1 rounded-md border">
                <Briefcase className="h-3.5 w-3.5 text-primary" />
                <span className="capitalize">{user.role.replace('_', ' ')}</span>
              </div>
              {deptName && (
                <div className="flex items-center gap-1.5 bg-background/50 px-2.5 py-1 rounded-md border">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  <span>{deptName}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-background/50 px-2.5 py-1 rounded-md border">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-background/50 px-2.5 py-1 rounded-md border">
                <BriefcaseBusiness className="h-3.5 w-3.5 text-primary" />
                <span>Morning Shift</span>
              </div>
              <div className="flex items-center gap-1.5 bg-background/50 px-2.5 py-1 rounded-md border">
                <CloudRain className="h-3.5 w-3.5 text-primary" />
                <span>24°C</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
    </div>
  );
}
