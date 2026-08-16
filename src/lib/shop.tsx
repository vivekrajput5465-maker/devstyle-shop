import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import tshirtImg from "@/assets/tshirt.jpg";
import hoodieImg from "@/assets/hoodie.jpg";
import mugImg from "@/assets/mug.jpg";

export type Category = "tshirts" | "hoodies" | "mugs";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: Category;
  description: string;
  stock: number;
  image: string;
};

export type CartLine = { productId: string; size: string; qty: number };

export type Order = {
  id: string;
  user: string;
  items: { name: string; size: string; qty: number; price: number }[];
  total: number;
  status: "pending" | "shipped" | "delivered";
  createdAt: string;
};

export type User = { username: string; role: "admin" | "customer" };

export const CATEGORY_IMAGE: Record<Category, string> = {
  tshirts: tshirtImg,
  hoodies: hoodieImg,
  mugs: mugImg,
};

export const CATEGORY_LABEL: Record<Category, string> = {
  tshirts: "T-Shirts",
  hoodies: "Hoodies",
  mugs: "Mugs",
};

export const SIZES: Record<Category, string[]> = {
  tshirts: ["S", "M", "L", "XL", "XXL"],
  hoodies: ["S", "M", "L", "XL"],
  mugs: ["330ml", "450ml"],
};

const SEED: Product[] = [
  {
    id: "t1",
    name: "Hello World Tee",
    price: 799,
    category: "tshirts",
    description: "Classic black tee with the first line of code you ever wrote.",
    stock: 42,
    image: tshirtImg,
  },
  {
    id: "t2",
    name: "404 Not Found Tee",
    price: 849,
    category: "tshirts",
    description: "For the days when nothing works. 100% combed cotton.",
    stock: 30,
    image: tshirtImg,
  },
  {
    id: "t3",
    name: "Python Lover Tee",
    price: 899,
    category: "tshirts",
    description: "Indented perfectly. Soft-touch print that survives 50+ washes.",
    stock: 25,
    image: tshirtImg,
  },
  {
    id: "h1",
    name: "Dark Mode Hoodie",
    price: 1999,
    category: "hoodies",
    description: "Heavyweight 380 GSM fleece hoodie for late-night commits.",
    stock: 18,
    image: hoodieImg,
  },
  {
    id: "h2",
    name: "git push --force Hoodie",
    price: 2199,
    category: "hoodies",
    description: "Live dangerously. Brushed inner fleece, kangaroo pocket.",
    stock: 12,
    image: hoodieImg,
  },
  {
    id: "m1",
    name: "Coffee to Code Mug",
    price: 399,
    category: "mugs",
    description: "Matte black ceramic mug. Microwave and dishwasher safe.",
    stock: 60,
    image: mugImg,
  },
  {
    id: "m2",
    name: "It Works On My Machine Mug",
    price: 449,
    category: "mugs",
    description: "The universal excuse, printed in signature crimson.",
    stock: 55,
    image: mugImg,
  },
];

type ShopState = {
  products: Product[];
  cart: CartLine[];
  orders: Order[];
  user: User | null;
  addToCart: (productId: string, size: string, qty?: number) => void;
  setQty: (productId: string, size: string, qty: number) => void;
  removeLine: (productId: string, size: string) => void;
  clearCart: () => void;
  checkout: () => Order | null;
  login: (username: string, password: string) => { ok: boolean; error?: string };
  signup: (username: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  saveProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  setOrderStatus: (id: string, status: Order["status"]) => void;
};

const ShopContext = createContext<ShopState | null>(null);

const ADMIN_USERNAME = "harry@codewithvivek.com";
const ADMIN_PASSWORD = "Password8989$$";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SEED);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Record<string, string>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProducts(read("cwh_products", SEED));
    setCart(read("cwh_cart", [] as CartLine[]));
    setOrders(read("cwh_orders", [] as Order[]));
    setUser(read("cwh_user", null as User | null));
    setAccounts(read("cwh_accounts", {} as Record<string, string>));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("cwh_products", JSON.stringify(products));
    localStorage.setItem("cwh_cart", JSON.stringify(cart));
    localStorage.setItem("cwh_orders", JSON.stringify(orders));
    localStorage.setItem("cwh_user", JSON.stringify(user));
    localStorage.setItem("cwh_accounts", JSON.stringify(accounts));
  }, [hydrated, products, cart, orders, user, accounts]);

  const addToCart = useCallback((productId: string, size: string, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((l) => l.productId === productId && l.size === size);
      if (found) {
        return prev.map((l) => (l === found ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { productId, size, qty }];
    });
  }, []);

  const setQty = useCallback((productId: string, size: string, qty: number) => {
    setCart((prev) =>
      prev
        .map((l) => (l.productId === productId && l.size === size ? { ...l, qty } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const removeLine = useCallback((productId: string, size: string) => {
    setCart((prev) => prev.filter((l) => !(l.productId === productId && l.size === size)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const checkout = useCallback((): Order | null => {
    if (!user || cart.length === 0) return null;
    const items = cart.map((l) => {
      const p = products.find((x) => x.id === l.productId)!;
      return { name: p.name, size: l.size, qty: l.qty, price: p.price };
    });
    const order: Order = {
      id: `CWH-${Date.now().toString().slice(-6)}`,
      user: user.username,
      items,
      total: items.reduce((s, i) => s + i.price * i.qty, 0),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
    setProducts((prev) =>
      prev.map((p) => {
        const bought = cart
          .filter((l) => l.productId === p.id)
          .reduce((s, l) => s + l.qty, 0);
        return bought ? { ...p, stock: Math.max(0, p.stock - bought) } : p;
      }),
    );
    setCart([]);
    return order;
  }, [cart, products, user]);

  const login = useCallback(
    (username: string, password: string) => {
      const name = username.trim();
      if (name === ADMIN_USERNAME) {
        if (password !== ADMIN_PASSWORD) return { ok: false, error: "Invalid credentials" };
        setUser({ username: name, role: "admin" });
        return { ok: true };
      }
      if (!accounts[name] || accounts[name] !== password) {
        return { ok: false, error: "Invalid credentials" };
      }
      setUser({ username: name, role: "customer" });
      return { ok: true };
    },
    [accounts],
  );

  const signup = useCallback(
    (username: string, password: string) => {
      const name = username.trim();
      if (name.length < 3) return { ok: false, error: "Username must be 3+ characters" };
      if (password.length < 6) return { ok: false, error: "Password must be 6+ characters" };
      if (name === ADMIN_USERNAME || accounts[name])
        return { ok: false, error: "Username already taken" };
      setAccounts((prev) => ({ ...prev, [name]: password }));
      setUser({ username: name, role: "customer" });
      return { ok: true };
    },
    [accounts],
  );

  const logout = useCallback(() => setUser(null), []);

  const saveProduct = useCallback((p: Product) => {
    setProducts((prev) =>
      prev.some((x) => x.id === p.id) ? prev.map((x) => (x.id === p.id ? p : x)) : [p, ...prev],
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((l) => l.productId !== id));
  }, []);

  const setOrderStatus = useCallback((id: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }, []);

  const value = useMemo(
    () => ({
      products,
      cart,
      orders,
      user,
      addToCart,
      setQty,
      removeLine,
      clearCart,
      checkout,
      login,
      signup,
      logout,
      saveProduct,
      deleteProduct,
      setOrderStatus,
    }),
    [
      products,
      cart,
      orders,
      user,
      addToCart,
      setQty,
      removeLine,
      clearCart,
      checkout,
      login,
      signup,
      logout,
      saveProduct,
      deleteProduct,
      setOrderStatus,
    ],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
