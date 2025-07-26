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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-[60px] mb-1" />
        <Skeleton className="h-3 w-[120px]" />
      </CardContent>
    </Card>
  );
}

export function SkeletonUserCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
              <Skeleton className="h-5 w-[150px] mb-2" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <Skeleton className="h-4 w-[80px] mb-2" />
              <Skeleton className="h-3 w-[60px]" />
            </div>
            <Skeleton className="h-9 w-[100px]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}