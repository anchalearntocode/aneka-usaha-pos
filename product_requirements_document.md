# Product Requirements Document (PRD) - Aneka POS Prototype

## 1. Project Overview
**Name:** Aneka POS
**Description:** A lightweight Point of Sales (POS) and inventory management web application tailored for a stationary and printing shop (UMKM Toko Aneka Usaha).
**Goal:** Digitize manual transaction recording to speed up morning rush hour service and automate stock tracking to prevent abrupt stock-outs.

## 2. Target Audience
*   **Cashier (Karyawan):** Needs a fast, distraction-free interface to input orders and process payments.
*   **Shop Owner (Bapak Hasrul):** Needs to monitor stock levels and get alerts when items need to be restocked from Makassar.

## 3. Core Problems to Solve
1.  Manual transaction recording using notebooks is too slow during the morning rush hour (students/teachers).
2.  Lack of inventory tracking leads to sudden stock depletion, forcing the owner to make unplanned restock trips.

## 4. User Stories
*   **US1:** As a cashier, I want to search and tap on products to add them to the cart quickly.
*   **US2:** As a cashier, I want to adjust the quantity of items in the cart and see the total price update in real-time.
*   **US3:** As a cashier, I want to complete a checkout using "Tunai" (Cash) or "QRIS" so the transaction is recorded.
*   **US4:** As a system, I want to automatically deduct the sold quantity from the main inventory upon checkout.
*   **US5:** As an owner, I want to see a visual alert (red badge/banner) when a product's stock falls to or below its minimum threshold.
*   **US6:** As an owner, I want to view a table of all inventory items and their current stock status.

## 5. Functional Requirements
### 5.1. POS / Checkout Flow
*   **Product Catalog:** Display products in a grid. Each card shows name, price, and available stock.
*   **Search Bar:** Filter products by name in real-time.
*   **Cart Management:** 
    *   Add items by clicking product cards.
    *   Increase/decrease quantity using +/- buttons in the cart.
    *   Prevent adding more items than the available stock.
*   **Checkout:** Two buttons for payment (Tunai, QRIS). On click, clear the cart, show a success message, and deduct stock.

### 5.2. Inventory & Stock Alerts
*   **Navigation Badge:** A red alert badge on the "Stok Barang" menu if any item is at or below `min_stock`.
*   **Alert Banner:** A prominent banner in the inventory view listing specific items that need restocking.
*   **Stock Table:** A table displaying Name, Price, Current Stock, Minimum Stock limit, and Status (Aman / Harus Restok).

## 6. Non-Functional Requirements (Prototype Scope)
*   **Platform:** Web-based (responsive, optimized for Tablet landscape view).
*   **Performance:** UI interactions (search, add to cart) must be instantaneous.
*   **Persistence:** For this prototype phase, use browser `LocalStorage` to save product data and stock changes so data persists upon page refresh. No complex backend required yet.