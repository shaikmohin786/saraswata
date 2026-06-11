"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Landmark, LockKeyhole } from "lucide-react";

type AdminLoginFormProps = {
  logoUrl: string | null;
  siteName: string;
};

export function AdminLoginForm({ logoUrl, siteName }: AdminLoginFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: fd.get("email"),
      password: fd.get("password"),
      redirect: false,
    });
    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else {
      window.location.href = "/admin/dashboard";
    }
  }

  return (
    <div className="admin-login-bg flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-[26rem]">
        <div className="admin-login-card rounded-2xl border border-primary/10 bg-white p-8 shadow-lg shadow-primary/5 sm:p-10">
          <div className="flex flex-col items-center text-center">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={siteName}
                width={360}
                height={96}
                priority
                className="h-auto w-full max-h-24 object-contain object-center sm:max-h-28"
              />
            ) : (
              <div className="flex w-full flex-col items-center gap-2 py-2">
                <Landmark className="h-12 w-12 text-primary/70 sm:h-14 sm:w-14" strokeWidth={1.25} />
                <p className="font-serif text-lg font-semibold text-primary">{siteName}</p>
              </div>
            )}
            <h1 className="mt-4 font-serif text-2xl font-semibold text-primary">Admin Login</h1>
            <p className="mt-1.5 text-sm text-muted">{siteName}</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@example.com"
                className="admin-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="admin-input"
              />
            </div>
            {error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" className="h-11 w-full gap-2" disabled={loading}>
              <LockKeyhole className="h-4 w-4" />
              {loading ? "Signing in..." : "Sign in to dashboard"}
            </Button>
          </form>

          <Link
            href="/"
            className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
