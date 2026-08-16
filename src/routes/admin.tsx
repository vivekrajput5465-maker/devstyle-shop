import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Package, ShoppingBag, IndianRupee, AlertTriangle, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORY_IMAGE,
  CATEGORY_LABEL,
  inr,
  useShop,
  type Category,
  type Order,
  type Product,
} from "@/lib/shop";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — CodeWithHarry Merch" },
      { name: "description", content: "Manage products, stock and orders for the merch store." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Dashboard — CodeWithHarry Merch" },
      {
        property: "og:description",
        content: "Manage products, stock and orders for the merch store.",
      },
    ],
  }),
  component: AdminPage,
});

const EMPTY: Product = {
  id: "",
  name: "",
  price: 0,
  category: "tshirts",
  description: "",
  stock: 0,
  image: CATEGORY_IMAGE.tshirts,
};

function AdminPage() {
  const { user, products, orders, saveProduct, deleteProduct, setOrderStatus } = useShop();
  const [draft, setDraft] = useState<Product>(EMPTY);

  if (!user || user.role !== "admin") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <AlertTriangle className="mx-auto size-10 text-primary" />
        <h1 className="mt-4 text-2xl font-bold">Admins only</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You need an administrator account to open this dashboard.
        </p>
        <Button asChild className="mt-6">
          <Link to="/auth">Sign in as admin</Link>
        </Button>
      </div>
    );
  }

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter((p) => p.stock <= 15);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim() || draft.price <= 0) {
      toast.error("Name and a price above zero are required");
      return;
    }
    const product: Product = {
      ...draft,
      id: draft.id || `p${Date.now()}`,
      image: draft.image || CATEGORY_IMAGE[draft.category],
    };
    saveProduct(product);
    toast.success(draft.id ? "Product updated" : "Product added");
    setDraft(EMPTY);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="font-display text-xs uppercase tracking-widest text-primary">Control panel</p>
      <h1 className="mt-2 text-3xl font-bold">Admin dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={<IndianRupee className="size-4" />} label="Revenue" value={inr(revenue)} />
        <Stat icon={<ShoppingBag className="size-4" />} label="Orders" value={`${orders.length}`} />
        <Stat icon={<Package className="size-4" />} label="Products" value={`${products.length}`} />
        <Stat
          icon={<AlertTriangle className="size-4" />}
          label="Low stock"
          value={`${lowStock.length}`}
        />
      </div>

      <Tabs defaultValue="products" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="add">{draft.id ? "Edit" : "Add"}</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              <img
                src={p.image}
                alt={p.name}
                width={56}
                height={56}
                loading="lazy"
                className="size-14 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {CATEGORY_LABEL[p.category]} · {inr(p.price)} · {p.stock} in stock
                </p>
              </div>
              <Button variant="outline" size="icon" onClick={() => setDraft(p)} aria-label="Edit">
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Delete"
                onClick={() => {
                  deleteProduct(p.id);
                  toast.success("Product deleted");
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="add">
          <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-card p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Product name</Label>
                <Input
                  id="name"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={draft.price || ""}
                  onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={draft.category}
                  onValueChange={(v) =>
                    setDraft({
                      ...draft,
                      category: v as Category,
                      image: CATEGORY_IMAGE[v as Category],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tshirts">T-Shirts</SelectItem>
                    <SelectItem value="hoodies">Hoodies</SelectItem>
                    <SelectItem value="mugs">Mugs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={draft.stock || ""}
                  onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">{draft.id ? "Save changes" : "Add product"}</Button>
              {draft.id && (
                <Button type="button" variant="outline" onClick={() => setDraft(EMPTY)}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </TabsContent>

        <TabsContent value="orders" className="space-y-3">
          {orders.length === 0 && (
            <p className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
              No orders yet.
            </p>
          )}
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-display text-sm font-bold">{o.id}</p>
                  <p className="text-xs text-muted-foreground">
                    @{o.user} · {new Date(o.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-bold">{inr(o.total)}</span>
                  <Select
                    value={o.status}
                    onValueChange={(v) => setOrderStatus(o.id, v as Order["status"])}
                  >
                    <SelectTrigger className="h-8 w-32 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <ul className="mt-3 space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
                {o.items.map((i, idx) => (
                  <li key={idx}>
                    {i.qty} × {i.name} ({i.size}) — {inr(i.price * i.qty)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 font-display text-xl font-bold">{value}</p>
    </div>
  );
}
