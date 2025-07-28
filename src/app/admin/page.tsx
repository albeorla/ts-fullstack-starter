"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Users, Shield, Lock } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: session } = useSession();

  // Check if user is admin
  const isAdmin = session?.user?.roles?.includes("ADMIN");
  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Manage users, roles, and permissions for your application.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users
            </CardTitle>
            <CardDescription>
              Manage user accounts and their role assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/users">
              <Button className="w-full">Manage Users</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Roles
            </CardTitle>
            <CardDescription>
              Create and manage roles with specific permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/roles">
              <Button className="w-full">Manage Roles</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Permissions
            </CardTitle>
            <CardDescription>
              Define granular permissions for your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/permissions">
              <Button className="w-full">Manage Permissions</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
