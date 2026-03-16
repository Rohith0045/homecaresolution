import { products as defaultProducts, type Product as DefaultProduct } from "@/data/products";

export type Product = DefaultProduct & Partial<Record<string, any>>;

const LS_KEY = "admin_products";

function readAdmin(): Product[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Product[];
  } catch {
    return [];
  }
}

// Return merged products: admin products override default ones with same id, otherwise appended.
export function loadProducts(): Product[] {
  const admin = readAdmin();
  const map = new Map<string, Product>();
  // first add defaults
  for (const p of defaultProducts) map.set(p.id, p as Product);
  // then override/add admin
  for (const a of admin) map.set(a.id, { ...map.get(a.id), ...a });
  return Array.from(map.values());
}

export function saveAdminProduct(p: Partial<Product>) {
  const admin = readAdmin();
  const newProd = { ...p, id: p.id || Date.now().toString() } as Product;
  const idx = admin.findIndex((x) => x.id === newProd.id);
  if (idx !== -1) {
    admin[idx] = newProd;
  } else {
    admin.push(newProd);
  }
  localStorage.setItem(LS_KEY, JSON.stringify(admin));
  return newProd;
}

export function removeAdminProduct(id: string) {
  const admin = readAdmin();
  const filtered = admin.filter((p) => p.id !== id);
  localStorage.setItem(LS_KEY, JSON.stringify(filtered));
}
