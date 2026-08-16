import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { inr, SIZES, useShop, type Product } from "@/lib/shop";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useShop();
  const sizes = SIZES[product.category];
  const [size, setSize] = useState(sizes[0]!);
  const soldOut = product.stock <= 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/60">
      <div className="aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          width={800}
          height={800}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base font-semibold">{product.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
                size === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="font-display text-lg font-bold">{inr(product.price)}</span>
          <Button
            size="sm"
            disabled={soldOut}
            onClick={() => {
              addToCart(product.id, size);
              toast.success(`${product.name} (${size}) added to cart`);
            }}
          >
            {soldOut ? "Sold out" : "Add to cart"}
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground">
          {soldOut ? "Out of stock" : `${product.stock} in stock`}
        </p>
      </div>
    </article>
  );
}
