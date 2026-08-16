import { useState } from "react";
import { toast } from "sonner";
import { inr, SIZES, useShop, type Product } from "@/lib/shop";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useShop();
  const sizes = SIZES[product.category];
  const [size, setSize] = useState(sizes[0]!);
  const soldOut = product.stock <= 0;

  return (
    <article className="group relative flex flex-col overflow-hidden border border-border bg-card transition-colors hover:border-primary/60">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          width={800}
          height={800}
          loading="lazy"
          className="size-full scale-105 object-cover opacity-80 grayscale transition-all duration-500 group-hover:scale-100 group-hover:opacity-100 group-hover:grayscale-0"
        />
        {soldOut ? (
          <span className="absolute left-2 top-2 bg-muted px-2 py-0.5 font-display text-[10px] uppercase text-muted-foreground">
            Sold out
          </span>
        ) : (
          <span className="absolute left-2 top-2 bg-primary px-2 py-0.5 font-display text-[10px] uppercase text-primary-foreground">
            {product.stock} left
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-sm font-bold">{product.name}</h3>
          <span className="font-display text-sm text-primary">{inr(product.price)}</span>
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground">{product.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`border px-2.5 py-1 font-display text-[11px] transition-colors ${
                size === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={soldOut}
          onClick={() => {
            addToCart(product.id, size);
            toast.success(`${product.name} (${size}) added to cart`);
          }}
          className="mt-auto w-full border border-border py-2 font-display text-xs uppercase text-muted-foreground transition-colors disabled:opacity-50 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
        >
          {soldOut ? "Unavailable" : "ADD_TO_CART"}
        </button>
      </div>
    </article>
  );
}
