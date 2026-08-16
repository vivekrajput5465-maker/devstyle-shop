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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <p className="font-display text-xs uppercase tracking-widest text-primary">Collection</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{CATEGORY_LABEL[category]}</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">{blurb}</p>
      </header>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing here yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
