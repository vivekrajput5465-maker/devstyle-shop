import { ProductCard } from "@/components/product-card";
import { CATEGORY_LABEL, useShop, type Category } from "@/lib/shop";

export function CategoryPage({
  category,
  blurb,
}: {
  category: Category;
  blurb: string;
}) {
  const { products } = useShop();
  const items = products.filter((p) => p.category === category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <header className="mb-10 border-l-2 border-primary/50 pl-6">
        <p className="font-display text-xs font-bold uppercase tracking-widest text-primary">
          [ dir: /root/{category} ]
        </p>
        <h1 className="mt-3 text-3xl font-extrabold uppercase tracking-tighter sm:text-5xl">
          {CATEGORY_LABEL[category]}
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">{blurb}</p>
      </header>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4">
          <h2 className="font-display text-xl font-bold uppercase">
            {String(items.length).padStart(2, "0")}_Items
          </h2>
          <span className="h-px flex-1 bg-border" />
        </div>
        <span className="border border-primary bg-primary/10 px-3 py-1 font-display text-[10px] uppercase tracking-widest text-primary">
          COD Only Mode
        </span>
      </div>

      {items.length === 0 ? (
        <p className="font-display text-sm text-muted-foreground">
          $ ls — nothing here yet, check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
