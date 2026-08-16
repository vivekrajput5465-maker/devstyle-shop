import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { CATEGORY_IMAGE, CATEGORY_LABEL, useShop } from "@/lib/shop";
import heroTee from "@/assets/tshirt.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CodeWithHarry Merch — Tees, Hoodies & Mugs for Devs" },
      {
        name: "description",
        content:
          "Official CodeWithHarry merchandise store. Developer t-shirts, heavyweight hoodies and ceramic mugs, shipped across India.",
      },
      { property: "og:title", content: "CodeWithHarry Merch — Tees, Hoodies & Mugs for Devs" },
      {
        property: "og:description",
        content:
          "Official CodeWithHarry merchandise store. Developer t-shirts, heavyweight hoodies and ceramic mugs, shipped across India.",
      },
    ],
  }),
  component: Index,
});

const CATEGORIES = ["tshirts", "hoodies", "mugs"] as const;

function Index() {
  const { products } = useShop();
  const featured = products.slice(0, 3);

  return (
    <div>
      <section className="surface-grid border-b border-border">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="font-display text-xs uppercase tracking-widest text-primary">
              // official merch store
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
              Wear the code.
              <br />
              <span className="text-primary">Ship the vibe.</span>
            </h1>
            <p className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base">
              Tees, hoodies and mugs for the CodeWithHarry community. Premium fabrics, prints that
              last, free shipping across India.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/tshirts">
                  Shop t-shirts <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/hoodies">Browse hoodies</Link>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border glow-primary">
            <img
              src={heroTee}
              alt="CodeWithHarry black developer t-shirt"
              width={800}
              height={800}
              className="size-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold">Shop by category</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to={c === "tshirts" ? "/tshirts" : c === "hoodies" ? "/hoodies" : "/mugs"}
              className="group relative overflow-hidden rounded-xl border border-border"
            >
              <img
                src={CATEGORY_IMAGE[c]}
                alt={CATEGORY_LABEL[c]}
                width={800}
                height={800}
                loading="lazy"
                className="aspect-4/3 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-background to-transparent p-4">
                <span className="font-display text-lg font-bold">{CATEGORY_LABEL[c]}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-2xl font-bold">Fresh drops</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:grid-cols-3">
          <Perk icon={<Truck className="size-5" />} title="Free shipping" text="On every order, all over India." />
          <Perk icon={<RotateCcw className="size-5" />} title="7-day returns" text="Wrong size? Swap it, no drama." />
          <Perk icon={<ShieldCheck className="size-5" />} title="Secure checkout" text="Your data stays yours." />
        </div>
      </section>
    </div>
  );
}

function Perk({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <span className="text-primary">{icon}</span>
      <h3 className="mt-3 text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
