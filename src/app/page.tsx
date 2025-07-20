"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string[]>>(
    {},
  );

  // Admin features
  const {
    data: users,
    refetch,
    error: usersError,
  } = api.user.getAll.useQuery(undefined, {
    enabled: session?.user.roles?.includes("ADMIN") ?? false,
  });

  // User stats
  const { data: userStats } = api.user.getStats.useQuery(
    { userId: session?.user?.id ?? "" },
    { enabled: !!session?.user?.id },
  );

  const { mutate: setUserRoles } = api.user.setUserRoles.useMutation({
    onSuccess: () => {
      toast.success("User roles updated successfully");
      void refetch();
    },
    onError: () => {
      toast.error("Failed to update user roles");
    },
  });

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

  const isRoleSelected = (userId: string, role: string) => {
    return (
      selectedRoles[userId]?.includes(role) ??
      users
        ?.find((user) => user.id === userId)
        ?.roles.some((r) => r.role.name === role) ??
      false
    );
  };

  const handleRoleChange = (userId: string, roleName: string) => {
    setSelectedRoles((prev) => {
      const currentRoles =
        prev[userId] ??
        users
          ?.find((user) => user.id === userId)
          ?.roles.map((r) => r.role.name) ??
        [];
      const newRoles = currentRoles.includes(roleName)
        ? currentRoles.filter((r) => r !== roleName)
        : [...currentRoles, roleName];
      return { ...prev, [userId]: newRoles };
    });
  };

  const handleUpdateRoles = (userId: string) => {
    const roles =
      selectedRoles[userId] ??
      users?.find((user) => user.id === userId)?.roles.map((r) => r.role.name);
    if (roles && roles.length > 0) {
      setUserRoles({ userId, roleNames: roles });
    }
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
            </CardContent>
          </Card>
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user roles and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersError ? (
                  <p className="text-red-500">
                    Error loading users: {usersError.message}
                  </p>
                ) : users ? (
                  users.length > 0 ? (
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-muted-foreground text-sm">
                              {user.email}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex gap-3">
                              {["ADMIN", "USER"].map((role) => (
                                <label
                                  key={role}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isRoleSelected(user.id, role)}
                                    onChange={() =>
                                      handleRoleChange(user.id, role)
                                    }
                                    className="rounded border-gray-300"
                                  />
                                  {role}
                                </label>
                              ))}
                            </div>
                            <Button
                              onClick={() => handleUpdateRoles(user.id)}
                              size="sm"
                              variant="outline"
                            >
                              Update
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No users found.</p>
                  )
                ) : (
                  <p className="text-muted-foreground">Loading users...</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Area */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Your Dashboard</CardTitle>
              <CardDescription>
                This is your main application dashboard. Add your primary
                content here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Start building your application by adding components and
                features to this dashboard. The layout is responsive and ready
                for your content.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
