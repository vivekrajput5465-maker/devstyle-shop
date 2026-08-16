import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { inr, useShop } from "@/lib/shop";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — CodeWithHarry Merch" },
      { name: "description", content: "Review your CodeWithHarry merch before checkout." },
      { property: "og:title", content: "Your Cart — CodeWithHarry Merch" },
      { property: "og:description", content: "Review your CodeWithHarry merch before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, products, setQty, removeLine, checkout, user } = useShop();
  const navigate = useNavigate();

  const lines = cart
    .map((l) => ({ line: l, product: products.find((p) => p.id === l.productId) }))
    .filter((x) => x.product);
  const total = lines.reduce((s, x) => s + x.product!.price * x.line.qty, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Your cart</h1>

      {lines.length === 0 ? (
        <div className="mt-8 rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">Your cart is empty.</p>
          <Button asChild className="mt-4">
            <Link to="/tshirts">Browse t-shirts</Link>
          </Button>
        </div>
      ) : (
        <>
          <ul className="mt-6 space-y-3">
            {lines.map(({ line, product }) => (
              <li
                key={`${line.productId}-${line.size}`}
                className="flex gap-3 rounded-xl border border-border bg-card p-3"
              >
                <img
                  src={product!.image}
                  alt={product!.name}
                  width={80}
                  height={80}
                  loading="lazy"
                  className="size-20 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{product!.name}</p>
                  <p className="text-xs text-muted-foreground">Size {line.size}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-7"
                      onClick={() => setQty(line.productId, line.size, line.qty - 1)}
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="w-6 text-center text-sm">{line.qty}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-7"
                      onClick={() => setQty(line.productId, line.size, line.qty + 1)}
                    >
                      <Plus className="size-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground"
                      onClick={() => removeLine(line.productId, line.size)}
                      aria-label="Remove"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
                <span className="font-display text-sm font-bold">
                  {inr(product!.price * line.qty)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
              <span>Payment</span>
              <span>Cash on delivery</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-display text-2xl font-bold">{inr(total)}</span>
            </div>
            <Button
              className="mt-4 w-full"
              size="lg"
              onClick={() => {
                if (!user) {
                  toast.error("Please sign in to place your order");
                  navigate({ to: "/auth" });
                  return;
                }
                const order = checkout();
                if (order) toast.success(`Order ${order.id} placed!`);
              }}
            >
              {user ? "Place order" : "Sign in to checkout"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
