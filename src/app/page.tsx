"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/react";
import { AuthenticatedLayout } from "~/components/layout/authenticated-layout";
import { Calendar, Activity, TrendingUp, Users, Settings, UserCircle, Bell, Lock, ArrowRight } from "lucide-react";
import { Badge, getRoleBadgeVariant } from "~/components/ui/badge";
import { SkeletonStatCard } from "~/components/ui/skeleton-card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  // User stats
  const { data: userStats, isLoading: isLoadingStats } = api.user.getStats.useQuery(
    { userId: session?.user?.id ?? "" },
    { enabled: !!session?.user?.id },
  );

  const isAdmin = session?.user?.roles?.includes("ADMIN");

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Helper function to get user initials
  const getUserInitials = (name?: string | null, email?: string | null) => {
    const displayName = name ?? email ?? "U";
    return displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold">
              {getGreeting()}, {session?.user?.name?.split(" ")[0] ?? "there"}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here&apos;s what&apos;s happening with your account today.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {isLoadingStats ? (
              <>
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
              </>
            ) : (
              <>
                {/* Account Status Card */}
                <Card variant="stats">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Account Status
                </CardTitle>
                <div className="relative">
                  <Activity className="h-4 w-4 text-emerald-500" />
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-sm" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">Active</div>
                <p className="text-xs text-muted-foreground">
                  Member since recently
                </p>
              </CardContent>
            </Card>

            {/* Total Sessions Card */}
            <Card variant="stats">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Sessions
                </CardTitle>
                <div className="relative">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-sm" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {userStats?.totalSessions ?? 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  All time logins
                </p>
              </CardContent>
            </Card>

            {/* Last Login Card */}
            <Card variant="stats">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Last Login
                </CardTitle>
                <div className="relative">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-sm" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {userStats?.lastLogin
                    ? new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                      }).format(userStats.lastLogin)
                    : "Today"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {userStats?.lastLogin
                    ? new Intl.DateTimeFormat("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                      }).format(userStats.lastLogin)
                    : "First login"}
                </p>
              </CardContent>
            </Card>

            {/* Roles Card */}
            <Card variant="stats">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Your Roles
                </CardTitle>
                <div className="relative">
                  <Users className="h-4 w-4 text-orange-500" />
                  <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-sm" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {session?.user?.roles?.length ?? 0}
                </div>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {session?.user?.roles?.map((role) => (
                    <Badge key={role} variant={getRoleBadgeVariant(role)} className="text-xs">
                      {role}
                    </Badge>
                  )) ?? <p className="text-xs text-muted-foreground">No roles assigned</p>}
                </div>
              </CardContent>
            </Card>
              </>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Overview */}
            <Card variant="elevated" className="md:col-span-2">
              <CardHeader>
                <CardTitle className="gradient-text-primary">Profile Overview</CardTitle>
                <CardDescription>
                  Your account information and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* User Info Section */}
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={session?.user?.image ?? ""}
                        alt={session?.user?.name ?? ""}
                      />
                      <AvatarFallback className="text-lg font-semibold">
                        {getUserInitials(session?.user?.name, session?.user?.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-semibold text-xl">
                        {session?.user?.name ?? "User"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {session?.user?.email}
                      </p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {session?.user?.roles?.map((role) => (
                          <Badge key={role} variant={getRoleBadgeVariant(role)} className="text-xs">
                            {role}
                          </Badge>
                        )) ?? (
                          <Badge variant="outline" className="text-xs">
                            No roles assigned
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Account Details Grid */}
                  <div className="grid gap-6 pt-4 border-t md:grid-cols-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Full Name
                      </label>
                      <p className="text-sm font-medium">
                        {session?.user?.name ?? "Not set"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Email Address
                      </label>
                      <p className="text-sm font-medium">{session?.user?.email}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Account Type
                      </label>
                      <p className="text-sm font-medium">
                        {isAdmin ? "Administrator" : "Standard User"}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() => router.push("/settings/profile")}
                      variant="default"
                      size="sm"
                    >
                      <UserCircle className="mr-2 h-4 w-4" />
                      Edit Profile
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => router.push("/settings")}
                      variant="outline"
                      size="sm"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Recent Activity Section */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest actions and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Placeholder for future activity items */}
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No recent activity to display</p>
                    <p className="text-sm mt-1">
                      Your activity will appear here as you use the application
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Status Card (for admins) or Getting Started (for users) */}
            {isAdmin ? (
              <Card>
                <CardHeader>
                  <CardTitle>System Overview</CardTitle>
                  <CardDescription>
                    Quick insights into system health
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Total Users
                      </span>
                      <span className="text-sm font-medium">
                        {/* Placeholder - would come from API */}
                        Loading...
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Active Sessions
                      </span>
                      <span className="text-sm font-medium">
                        {/* Placeholder - would come from API */}
                        Loading...
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        System Status
                      </span>
                      <Badge variant="default" className="text-xs">
                        Operational
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                  <CardDescription>
                    Complete your profile setup
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Complete Profile</p>
                        <p className="text-xs text-muted-foreground">
                          Add your name and profile picture
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bell className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Set Notifications</p>
                        <p className="text-xs text-muted-foreground">
                          Choose how you want to be notified
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Lock className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Secure Account</p>
                        <p className="text-xs text-muted-foreground">
                          Enable two-factor authentication
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </AuthenticatedLayout>
  );
}