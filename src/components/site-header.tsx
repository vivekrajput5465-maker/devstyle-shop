import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, ShoppingCart, Terminal, User2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useShop } from "@/lib/shop";

const NAV = [
  { to: "/tshirts", label: "T-Shirts" },
  { to: "/hoodies", label: "Hoodies" },
  { to: "/mugs", label: "Mugs" },
] as const;

export function SiteHeader() {
  const { cart, user, logout } = useShop();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const count = cart.reduce((s, l) => s + l.qty, 0);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary">
            <Terminal className="size-4 text-primary-foreground" />
          </span>
          <span className="font-display text-sm font-bold tracking-tight sm:text-base">
            CodeWithHarry<span className="text-primary">.merch</span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              {n.label}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="rounded-md px-3 py-2 text-sm text-primary transition-colors hover:bg-secondary"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" aria-label="Cart">
            <Link to="/cart" className="relative">
              <ShoppingCart className="size-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
          </Button>

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-xs text-muted-foreground">@{user.username}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
              >
                Log out
              </Button>
            </div>
          ) : (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-8 flex flex-col gap-1">
                {NAV.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-base font-medium hover:bg-secondary"
                  >
                    {n.label}
                  </Link>
                ))}
                <Link
                  to="/cart"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-base font-medium hover:bg-secondary"
                >
                  Cart ({count})
                </Link>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-base font-medium text-primary hover:bg-secondary"
                  >
                    Admin dashboard
                  </Link>
                )}
                <div className="mt-4 border-t border-border pt-4">
                  {user ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        logout();
                        setOpen(false);
                        navigate({ to: "/" });
                      }}
                    >
                      <User2 className="mr-2 size-4" /> Log out @{user.username}
                    </Button>
                  ) : (
                    <Button asChild className="w-full" onClick={() => setOpen(false)}>
                      <Link to="/auth">Sign in / Sign up</Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
