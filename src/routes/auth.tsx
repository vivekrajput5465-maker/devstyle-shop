import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useShop } from "@/lib/shop";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — CodeWithHarry Merch" },
      {
        name: "description",
        content: "Sign in or create an account to order CodeWithHarry merchandise.",
      },
      { property: "og:title", content: "Sign in — CodeWithHarry Merch" },
      {
        property: "og:description",
        content: "Sign in or create an account to order CodeWithHarry merchandise.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { login, signup } = useShop();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = (mode: "login" | "signup") => (e: React.FormEvent) => {
    e.preventDefault();
    const res = mode === "login" ? login(username, password) : signup(username, password);
    if (!res.ok) {
      toast.error(res.error ?? "Something went wrong");
      return;
    }
    toast.success(mode === "login" ? "Welcome back!" : "Account created");
    navigate({ to: username.trim() === "admin" ? "/admin" : "/" });
  };

  const fields = (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-center text-3xl font-bold">Account</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Sign in to track orders. Admins get the dashboard.
      </p>

      <Tabs defaultValue="login" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Log in</TabsTrigger>
          <TabsTrigger value="signup">Sign up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <form onSubmit={submit("login")} className="space-y-4 rounded-xl border border-border bg-card p-5">
            {fields}
            <Button type="submit" className="w-full">
              Log in
            </Button>
          </form>
        </TabsContent>
        <TabsContent value="signup">
          <form onSubmit={submit("signup")} className="space-y-4 rounded-xl border border-border bg-card p-5">
            {fields}
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
