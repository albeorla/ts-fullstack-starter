"use client";

import React from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function AuthPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in and lands on auth page, redirect to dashboard
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleSignIn = async () => {
    await signIn("discord", { callbackUrl: "/" });
  };

  const handleTestSignIn = async () => {
    await signIn("test-credentials", {
      email: "test@example.com",
      password: "test123",
      callbackUrl: "/",
    });
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="from-background to-muted flex min-h-screen items-center justify-center bg-gradient-to-b">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleSignIn} className="w-full" size="lg">
            Sign in with Discord
          </Button>

          {process.env.NODE_ENV === "development" && (
            <Button
              onClick={handleTestSignIn}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Test Login (Dev Only)
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
