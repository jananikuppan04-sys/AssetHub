import React from 'react';
import { Lightbulb, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import type { Insight } from '@/types/dashboard';

interface KeyInsightsProps {
  insights?: Insight[];
  isLoading?: boolean;
}

export function KeyInsights({ insights, isLoading }: KeyInsightsProps) {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2"><Skeleton className="h-5 w-32" /></CardHeader>
        <CardContent className="space-y-3"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></CardContent>
      </Card>
    );
  }

  if (!insights || insights.length === 0) {
    return (
      <Card className="h-full flex flex-col items-center justify-center">
        <EmptyState title="No Insights" description="AI insights will appear here as data grows." className="scale-90" />
      </Card>
    );
  }

  return (
    <Card className="h-full border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
      <CardHeader className="pb-2 border-b border-primary/10">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
          <Lightbulb className="h-4 w-4" />
          Key Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {insights.map(insight => {
          const isPos = insight.type === 'positive';
          const isNeg = insight.type === 'negative';
          const Icon = isPos ? TrendingUp : isNeg ? TrendingDown : Minus;
          const color = isPos ? 'text-green-500 bg-green-500/10' : isNeg ? 'text-red-500 bg-red-500/10' : 'text-blue-500 bg-blue-500/10';

          return (
            <div key={insight.id} className="flex gap-3 text-sm">
              <div className={`mt-0.5 shrink-0 h-6 w-6 rounded-md flex items-center justify-center ${color}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <p className="text-muted-foreground leading-snug font-medium">
                {insight.message}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
