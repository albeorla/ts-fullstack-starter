import { Card, CardContent, CardHeader } from "./card";
import { Skeleton } from "./skeleton";

export function SkeletonCard() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-[150px]" />
        <Skeleton className="h-4 w-[250px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonStatCard() {
  return (
    <Card variant="stats">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-[100px]" />
        <div className="relative">
          <Skeleton className="h-6 w-6 rounded-lg" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg animate-pulse" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-8 w-[60px]" />
          <Skeleton className="h-3 w-[120px]" />
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonUserCard() {
  return (
    <Card variant="elevated">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-full animate-pulse" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right space-y-2">
              <div className="flex gap-1">
                <Skeleton className="h-5 w-12 rounded-md" />
                <Skeleton className="h-5 w-12 rounded-md" />
              </div>
              <Skeleton className="h-3 w-[60px]" />
            </div>
            <Skeleton className="h-9 w-[100px] rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced skeleton for loading text with shimmer effect
export function SkeletonText({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded ${className}`} />
  );
}