import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { useNavigate } from 'react-router-dom';
import type { Recommendation } from '@/types/dashboard';

interface SmartRecommendationsProps {
  recommendations?: Recommendation[];
  isLoading?: boolean;
}

export function SmartRecommendations({ recommendations, isLoading }: SmartRecommendationsProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2"><Skeleton className="h-5 w-40" /></CardHeader>
        <CardContent className="space-y-3"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></CardContent>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="h-full flex flex-col items-center justify-center">
        <EmptyState title="All Caught Up" description="No smart recommendations at this time." className="scale-90" />
      </Card>
    );
  }

  return (
    <Card className="h-full border-purple-500/20 bg-gradient-to-br from-purple-500/5 via-background to-background">
      <CardHeader className="pb-2 border-b border-purple-500/10">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-purple-600">
          <Sparkles className="h-4 w-4" />
          Smart Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {recommendations.map(rec => (
          <div key={rec.id} className="flex items-center justify-between gap-3 bg-background border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-foreground leading-snug">
              {rec.message}
            </p>
            <Button size="sm" variant="secondary" className="h-8 text-xs shrink-0 bg-purple-500/10 text-purple-700 hover:bg-purple-500/20" onClick={() => navigate(rec.actionRoute)}>
              {rec.actionLabel}
              <ArrowRight className="ml-1.5 h-3 w-3" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
