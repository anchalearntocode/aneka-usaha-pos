export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  min_stock: number;
  category: 'Kertas & Buku' | 'Alat Tulis' | 'Tinta & Percetakan' | 'Jasa';
  image: string;
  barcode?: string;
}

export interface CartItem extends Product {
  qty: number;
}

export interface SaleRecord {
  id: string;
  timestamp: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'Tunai' | 'QRIS';
  cashTendered?: number;
  change?: number;
  cashierName?: string;
  status: 'Selesai' | 'Dibatalkan';
}

export interface User {
  id: string;
  name: string;
  role: 'cashier' | 'owner';
  pin: string;
  avatarColor: string;
}
