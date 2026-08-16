import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { CATEGORY_IMAGE, CATEGORY_LABEL, useShop } from "@/lib/shop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CodeWithHarry Merch — Tees, Hoodies & Mugs for Devs" },
      {
        name: "description",
        content:
          "Official CodeWithHarry merchandise store. Developer t-shirts, heavyweight hoodies and ceramic mugs, cash on delivery across India.",
      },
      { property: "og:title", content: "CodeWithHarry Merch — Tees, Hoodies & Mugs for Devs" },
      {
        property: "og:description",
        content:
          "Official CodeWithHarry merchandise store. Developer t-shirts, heavyweight hoodies and ceramic mugs, cash on delivery across India.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const CATEGORIES = [
  {
    key: "tshirts" as const,
    to: "/tshirts" as const,
    dir: "DIR: /root/tees",
    blurb: "Cotton-rich fits for 12-hour coding marathons.",
  },
  {
    key: "hoodies" as const,
    to: "/hoodies" as const,
    dir: "DIR: /root/hoodies",
    blurb: "Stealth mode enabled. Heavyweight fleece, deep hoods.",
  },
  {
    key: "mugs" as const,
    to: "/mugs" as const,
    dir: "DIR: /root/mugs",
    blurb: "Matte black ceramics for your workstation.",
  },
];

function Index() {
  const { products } = useShop();
  const featured = products.slice(0, 4);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-20 px-4 py-12 md:gap-24 md:px-8 md:py-16">
      {/* HERO */}
      <section className="relative">
        <div className="pointer-events-none absolute -left-10 -top-10 size-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative z-10 space-y-6 border-l-2 border-primary/50 pl-6 md:pl-8">
          <p className="font-display text-xs font-bold uppercase tracking-widest text-primary sm:text-sm">
            [ system_status: ready ]
          </p>
          <h1 className="text-4xl font-extrabold uppercase leading-tight tracking-tighter sm:text-6xl md:text-7xl">
            Gear for the <span className="text-primary">Modern Dev</span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Tees, hoodies and mugs for the CodeWithHarry community. Limited drops, tactical quality,
            cash on delivery across India.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/tshirts"
              className="bg-primary px-6 py-4 font-display text-sm font-bold uppercase text-primary-foreground shadow-[4px_4px_0px_0px] shadow-primary/30 transition-all hover:opacity-90 active:scale-95 sm:px-8"
            >
              EXECUTE_SHOP.EXE
            </Link>
            <span className="hidden border border-border px-3 py-1 font-display text-xs text-muted-foreground md:block">
              $ sudo get merch --latest
            </span>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section>
        <div className="mb-8 flex items-center gap-4">
          <h2 className="font-display text-xl font-bold uppercase">01_Categories</h2>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              to={c.to}
              className="group relative overflow-hidden border border-border bg-card/50 p-8 transition-colors hover:border-primary/50"
            >
              <img
                src={CATEGORY_IMAGE[c.key]}
                alt={CATEGORY_LABEL[c.key]}
                width={600}
                height={600}
                loading="lazy"
                className="pointer-events-none absolute inset-0 size-full object-cover opacity-15 grayscale transition-all duration-500 group-hover:opacity-30 group-hover:grayscale-0"
              />
              <span className="absolute right-0 top-0 p-2 font-display text-[10px] text-muted-foreground transition-colors group-hover:text-primary">
                {c.dir}
              </span>
              <div className="relative">
                <h3 className="mb-2 text-2xl font-bold transition-transform group-hover:translate-x-2">
                  {CATEGORY_LABEL[c.key]}
                </h3>
                <p className="text-sm text-muted-foreground">{c.blurb}</p>
                <p className="mt-6 font-display text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  ls -la items &gt;
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FRESH DROPS */}
      <section>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-4">
            <h2 className="font-display text-xl font-bold uppercase">02_Fresh_Drops</h2>
            <span className="h-px flex-1 bg-border" />
          </div>
          <span className="border border-primary bg-primary/10 px-3 py-1 font-display text-[10px] uppercase tracking-widest text-primary">
            COD Only Mode
          </span>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* PERKS */}
      <section className="grid gap-4 sm:grid-cols-3">
        <Perk icon={<Truck className="size-5" />} title="Free shipping" text="On every order, all over India." />
        <Perk icon={<RotateCcw className="size-5" />} title="7-day returns" text="Wrong size? Swap it, no drama." />
        <Perk icon={<ShieldCheck className="size-5" />} title="Cash on delivery" text="Pay the courier. No cards needed." />
      </section>

      {/* COD BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border border-primary/30 bg-primary/5 p-4">
        <div className="flex items-center gap-3">
          <span className="size-2 animate-pulse rounded-full bg-primary" />
          <span className="font-display text-[10px] font-bold uppercase tracking-widest text-primary">
            Cash on delivery enabled only
          </span>
        </div>
        <span className="font-display text-[10px] text-muted-foreground">
          SECURE_LOCAL_CHECKOUT_V2.0
        </span>
      </div>
    </div>
  );
}

function Perk({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="border border-border bg-card p-5">
      <span className="text-primary">{icon}</span>
      <h3 className="mt-3 font-display text-base font-bold uppercase">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
