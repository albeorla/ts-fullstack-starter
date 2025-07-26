"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Users, Shield, Mail, Calendar } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { api } from "~/trpc/react";
import { UserRoleForm } from "./_components/user-role-form";

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Always call hooks, but conditionally enable them
  const { data: users, refetch } = api.user.getAll.useQuery(undefined, {
    enabled: session?.user.roles?.includes("ADMIN") ?? false,
  });
  const { data: roles } = api.role.getAll.useQuery(undefined, {
    enabled: session?.user.roles?.includes("ADMIN") ?? false,
  });

  const setUserRoles = api.user.setUserRoles.useMutation({
    onSuccess: () => {
      toast.success("User roles updated successfully");
      void refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update user roles: ${error.message}`);
    },
  });

  if (status === "loading") {
    return (
      <div className="container mx-auto p-6">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user.roles?.includes("ADMIN")) {
    router.push("/");
    return null;
  }

  const handleRoleUpdate = async (userId: string, roleIds: string[]) => {
    // Convert role IDs to role names
    const selectedRoles = roles?.filter(role => roleIds.includes(role.id)) || [];
    const roleNames = selectedRoles.map(role => role.name);
    
    await setUserRoles.mutateAsync({ userId, roleNames });
    setIsRoleDialogOpen(false);
    setSelectedUser(null);
  };

  const handleEditRoles = (user: any) => {
    setSelectedUser(user);
    setIsRoleDialogOpen(true);
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage users and their role assignments
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
            <Shield className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Shield className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users?.filter((user) =>
                user.roles.some((ur: any) => ur.role.name === "ADMIN"),
              ).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <div className="grid gap-4">
        {users?.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.image || ""} alt={user.name || ""} />
                    <AvatarFallback>
                      {getUserInitials(user.name || user.email || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {user.name || "Unnamed User"}
                    </h3>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                    {user.emailVerified && (
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3" />
                        Joined {formatDate(user.emailVerified)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="mb-2 flex flex-wrap gap-1">
                      {user.roles.map((userRole: any) => (
                        <Badge key={userRole.role.id} variant="secondary">
                          {userRole.role.name}
                        </Badge>
                      ))}
                      {user.roles.length === 0 && (
                        <Badge variant="outline">No roles</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {user.roles.length} role
                      {user.roles.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditRoles(user)}
                  >
                    Edit Roles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role Assignment Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Roles</DialogTitle>
            <DialogDescription>
              Assign or remove roles for{" "}
              {selectedUser?.name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <UserRoleForm
              user={selectedUser}
              roles={roles || []}
              onSuccess={(roleIds) =>
                handleRoleUpdate(selectedUser?.id, roleIds)
              }
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
