# System & UI Design Document - Aneka POS

## 1. Architecture & Tech Stack
For this prototype, the application will be built as a Single Page Application (SPA) purely on the frontend to ensure quick deployment and testing on the shop's existing tablets.
*   **Framework:** React.js (via Vite)
*   **Styling:** Tailwind CSS (for fast, responsive UI)
*   **State Management:** React Context API or standard hooks (`useState`, `useEffect`).
*   **Data Persistence:** Browser `LocalStorage` (to simulate a database).

## 2. Data Models (TypeScript Interfaces)

```typescript
// Define the shape of a Product
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;       // Current available stock
  min_stock: number;   // Threshold for low stock alert (0 means no limit, e.g., for services)
}

// Define the shape of a Cart Item
interface CartItem extends Product {
  qty: number;
}
```

*Initial Seed Data (to be loaded into LocalStorage on first run):*
*   Kertas HVS A4 70gr (price: 50000, stock: 6, min_stock: 5)
*   Tinta Printer Epson Hitam (price: 85000, stock: 10, min_stock: 3)
*   Pulpen Faster (price: 25000, stock: 4, min_stock: 5) // Should trigger alert
*   Jasa Print (price: 1000, stock: 9999, min_stock: 0) // No alert needed

## 3. UI/UX Layout & Components

### 3.1. General Layout
*   **Header (Navbar):** 
    *   Logo/Title: "Aneka POS"
    *   Navigation Buttons: "Kasir" and "Stok Barang".
    *   Alert Badge: Render a small pulsing red dot on the "Stok Barang" button if `lowStockCount > 0`.

### 3.2. View 1: POS (Kasir)
*Layout: Two-column grid (Left: 60%, Right: 40%).*

*   **Left Column (Product Area):**
    *   `<SearchBar />`: Full-width input at the top.
    *   `<ProductGrid />`: CSS Grid displaying `<ProductCard />` components.
    *   `<ProductCard />`: Shows name, formatted price, and stock info. If `stock === 0`, disable click and dim opacity. If `stock <= min_stock`, show a small "Minim" badge.
*   **Right Column (Cart Area):**
    *   `<CartItemList />`: Scrollable list of selected items with `+` and `-` buttons for quantity control.
    *   `<CartSummary />`: Fixed at the bottom. Shows Total Price.
    *   `<CheckoutButtons />`: Two large buttons ("Tunai" and "QRIS").

### 3.3. View 2: Inventory (Stok Barang)
*Layout: Single column, centered container.*

*   **`<LowStockAlertBanner />`:**
    *   Render only if there are items with `stock <= min_stock`.
    *   Red background, bold text. Lists the names of items that need immediate restocking.
*   **`<InventoryTable />`:**
    *   Columns: Nama Barang, Harga, Sisa Stok, Batas Minimum, Status.
    *   Conditional formatting: If Status is "Harus Restok", make the row background slightly red and the text bold red.

## 4. State Management Flow (AI Implementation Guide)
1.  **Initialize:** On app mount, check `LocalStorage` for `products`. If null, load the initial seed data and save to `LocalStorage`.
2.  **Add to Cart:** Check if `cartItem.qty < product.stock`. If true, increment. If false, show a toast/alert "Stok tidak mencukupi".
3.  **Checkout:** 
    *   Iterate through `cart`.
    *   Map over `products` state, subtracting `item.qty` from `product.stock`.
    *   Update `products` state.
    *   Save new `products` to `LocalStorage`.
    *   Clear `cart` state.