import { Product, SaleRecord } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Kertas HVS A4 70gr (1 Rim)',
    price: 50000,
    stock: 6,
    min_stock: 5,
    category: 'Kertas & Buku',
    image: '/products/kertas-hvs.png',
    barcode: '899123450001',
  },
  {
    id: 'prod-2',
    name: 'Tinta Printer Epson Hitam 003',
    price: 85000,
    stock: 10,
    min_stock: 3,
    category: 'Tinta & Percetakan',
    image: '/products/tinta-printer.png',
    barcode: '899123450002',
  },
  {
    id: 'prod-3',
    name: 'Pulpen Faster C600 Hitam (1 Lusin)',
    price: 25000,
    stock: 4,
    min_stock: 5,
    category: 'Alat Tulis',
    image: '/products/pulpen.png',
    barcode: '899123450003',
  },
  {
    id: 'prod-4',
    name: 'Jasa Cetak / Print Dokumen Warna',
    price: 1000,
    stock: 9999,
    min_stock: 0,
    category: 'Jasa',
    image: '/products/jasa-print.png',
  },
  {
    id: 'prod-5',
    name: 'Buku Tulis Sinar Dunia 38 Lembar (Pack)',
    price: 45000,
    stock: 15,
    min_stock: 5,
    category: 'Kertas & Buku',
    image: '/products/buku-sidu.png',
    barcode: '899123450005',
  },
  {
    id: 'prod-6',
    name: 'Map Snelhefter Kertas Folio',
    price: 2500,
    stock: 2,
    min_stock: 10,
    category: 'Alat Tulis',
    image: '/products/map-snelhefter.png',
    barcode: '899123450006',
  },
  {
    id: 'prod-7',
    name: 'Spidol Snowman Whiteboard Hitam',
    price: 10000,
    stock: 8,
    min_stock: 4,
    category: 'Alat Tulis',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=80',
    barcode: '899123450007',
  },
  {
    id: 'prod-8',
    name: 'Jasa Fotokopi Bolak-Balik HVS',
    price: 300,
    stock: 9999,
    min_stock: 0,
    category: 'Jasa',
    image: '/products/fotokopi.png',
  },
  {
    id: 'prod-9',
    name: 'Lakban Bening 2 Inch Daimaru',
    price: 14000,
    stock: 7,
    min_stock: 5,
    category: 'Alat Tulis',
    image: '/products/lakban-bening.png',
    barcode: '899123450009',
  },
  {
    id: 'prod-10',
    name: 'Penggaris Besi 30cm Butterfly',
    price: 8000,
    stock: 12,
    min_stock: 4,
    category: 'Alat Tulis',
    image: '/products/penggaris-besi.png',
    barcode: '899123450010',
  },
];

export const INITIAL_SALES: SaleRecord[] = [
  {
    id: 'TRX-948201',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    items: [
      {
        id: 'prod-1',
        name: 'Kertas HVS A4 70gr (1 Rim)',
        price: 50000,
        stock: 6,
        min_stock: 5,
        category: 'Kertas & Buku',
        image: '/products/kertas-hvs.png',
        qty: 2,
      },
      {
        id: 'prod-3',
        name: 'Pulpen Faster C600 Hitam (1 Lusin)',
        price: 25000,
        stock: 4,
        min_stock: 5,
        category: 'Alat Tulis',
        image: '/products/pulpen.png',
        qty: 1,
      },
    ],
    total: 125000,
    paymentMethod: 'Tunai',
    cashTendered: 150000,
    change: 25000,
    cashierName: 'Kasir 01',
    status: 'Selesai',
  },
  {
    id: 'TRX-948182',
    timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    items: [
      {
        id: 'prod-4',
        name: 'Jasa Cetak / Print Dokumen Warna',
        price: 1000,
        stock: 9999,
        min_stock: 0,
        category: 'Jasa',
        image: '/products/jasa-print.png',
        qty: 35,
      },
      {
        id: 'prod-6',
        name: 'Map Snelhefter Kertas Folio',
        price: 2500,
        stock: 2,
        min_stock: 10,
        category: 'Alat Tulis',
        image: '/products/map-snelhefter.png',
        qty: 2,
      },
    ],
    total: 40000,
    paymentMethod: 'QRIS',
    cashierName: 'Kasir 01',
    status: 'Selesai',
  },
  {
    id: 'TRX-948110',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    items: [
      {
        id: 'prod-2',
        name: 'Tinta Printer Epson Hitam 003',
        price: 85000,
        stock: 10,
        min_stock: 3,
        category: 'Tinta & Percetakan',
        image: '/products/tinta-printer.png',
        qty: 1,
      },
    ],
    total: 85000,
    paymentMethod: 'Tunai',
    cashTendered: 100000,
    change: 15000,
    cashierName: 'Kasir 01',
    status: 'Selesai',
  },
];

export const STORAGE_KEY_PRODUCTS = 'aneka_pos_products_v4';
export const STORAGE_KEY_SALES = 'aneka_pos_sales_v4';

// Direct product image overrides map
const IMAGE_OVERRIDES: Record<string, string> = {
  'prod-1': '/products/kertas-hvs.png',
  'prod-2': '/products/tinta-printer.png',
  'prod-3': '/products/pulpen.png',
  'prod-4': '/products/jasa-print.png',
  'prod-5': '/products/buku-sidu.png',
  'prod-6': '/products/map-snelhefter.png',
  'prod-8': '/products/fotokopi.png',
  'prod-9': '/products/lakban-bening.png',
  'prod-10': '/products/penggaris-besi.png',
};

export function loadStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    const parsed: Product[] = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Auto-update images if user has cached data from older version
      const updated = parsed.map((item) => {
        if (IMAGE_OVERRIDES[item.id]) {
          return { ...item, image: IMAGE_OVERRIDES[item.id] };
        }
        const nameLower = item.name.toLowerCase();
        if (nameLower.includes('pulpen')) return { ...item, image: '/products/pulpen.png' };
        if (nameLower.includes('snelhefter') || nameLower.includes('map')) return { ...item, image: '/products/map-snelhefter.png' };
        if (nameLower.includes('fotokopi')) return { ...item, image: '/products/fotokopi.png' };
        if (nameLower.includes('lakban')) return { ...item, image: '/products/lakban-bening.png' };
        if (nameLower.includes('penggaris')) return { ...item, image: '/products/penggaris-besi.png' };
        return item;
      });
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
      return updated;
    }
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  } catch (err) {
    console.error('Gagal membaca data produk:', err);
    return INITIAL_PRODUCTS;
  }
}

export function saveStoredProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  } catch (err) {
    console.error('Gagal menyimpan data produk:', err);
  }
}

export function loadStoredSales(): SaleRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SALES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SALES, JSON.stringify(INITIAL_SALES));
      return INITIAL_SALES;
    }
    const parsed: SaleRecord[] = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Auto-update items in past sales with the new local images
      const updated = parsed.map((sale) => ({
        ...sale,
        items: sale.items.map((item) => {
          if (IMAGE_OVERRIDES[item.id]) {
            return { ...item, image: IMAGE_OVERRIDES[item.id] };
          }
          const nameLower = item.name.toLowerCase();
          if (nameLower.includes('pulpen')) return { ...item, image: '/products/pulpen.png' };
          if (nameLower.includes('snelhefter') || nameLower.includes('map')) return { ...item, image: '/products/map-snelhefter.png' };
          if (nameLower.includes('fotokopi')) return { ...item, image: '/products/fotokopi.png' };
          if (nameLower.includes('lakban')) return { ...item, image: '/products/lakban-bening.png' };
          if (nameLower.includes('penggaris')) return { ...item, image: '/products/penggaris-besi.png' };
          return item;
        }),
      }));
      localStorage.setItem(STORAGE_KEY_SALES, JSON.stringify(updated));
      return updated;
    }
    localStorage.setItem(STORAGE_KEY_SALES, JSON.stringify(INITIAL_SALES));
    return INITIAL_SALES;
  } catch (err) {
    console.error('Gagal membaca data riwayat penjualan:', err);
    return INITIAL_SALES;
  }
}

export function saveStoredSales(sales: SaleRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SALES, JSON.stringify(sales));
  } catch (err) {
    console.error('Gagal menyimpan data riwayat penjualan:', err);
  }
}
