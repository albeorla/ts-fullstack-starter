"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // User stats
  const { data: userStats } = api.user.getStats.useQuery(
    { userId: session?.user?.id ?? "" },
    { enabled: !!session?.user?.id },
  );

  useEffect(() => {
    // Redirect to auth page if not authenticated
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  const handleSignOut = async () => {
    toast.promise(
      signOut({ redirect: false }).then(() => {
        router.push("/auth");
      }),
      {
        loading: "Signing out...",
        success: "Successfully signed out!",
        error: "Failed to sign out",
      },
    );
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const isAdmin = session.user.roles?.includes("ADMIN");

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground text-sm">
                Welcome back, {session.user.name ?? session.user.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{session.user.name}</p>
                <p className="text-muted-foreground text-xs">
                  {session.user.email}
                </p>
              </div>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your profile details</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-muted-foreground text-sm font-medium">
                    Name
                  </dt>
                  <dd className="text-sm">{session.user.name ?? "Not set"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-sm font-medium">
                    Email
                  </dt>
                  <dd className="text-sm">{session.user.email}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-sm font-medium">
                    Roles
                  </dt>
                  <dd className="text-sm">
                    {!session?.user?.roles
                      ? "Loading..."
                      : session.user.roles.length > 0
                        ? session.user.roles.join(", ")
                        : "No roles assigned"}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Your activity overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Total Sessions
                  </span>
                  <span className="text-2xl font-bold">
                    {userStats?.totalSessions ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Last Login
                  </span>
                  <span className="text-sm">
                    {userStats?.lastLogin
                      ? new Intl.DateTimeFormat("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(userStats.lastLogin)
                      : "Never"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline" size="sm">
                Edit Profile
              </Button>
              <Button className="w-full" variant="outline" size="sm">
                View Settings
              </Button>
                      {isAdmin && (
          <>
            <Button
              onClick={() => router.push("/admin/users")}
              className="w-full"
              variant="outline"
              size="sm"
            >
              Manage Users
            </Button>
            <Button
              onClick={() => router.push("/admin/roles")}
              className="w-full"
              variant="outline"
              size="sm"
            >
              Manage Roles
            </Button>
            <Button
              onClick={() => router.push("/admin/permissions")}
              className="w-full"
              variant="outline"
              size="sm"
            >
              Manage Permissions
            </Button>
          </>
        )}
            </CardContent>
          </Card>
        </div>



        {/* Main Content Area */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Your Dashboard</CardTitle>
              <CardDescription>
                This is your main application dashboard. Use the quick actions above to manage your application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your dashboard is now clean and focused. Use the "Manage Users", "Manage Roles", and "Manage Permissions" buttons above to access the dedicated admin interfaces.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
