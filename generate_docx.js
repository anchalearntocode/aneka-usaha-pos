import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
  HeadingLevel,
} from 'docx';
import fs from 'fs';
import path from 'path';

async function createDocument() {
  const tableBorder = {
    top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    insideVertical: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
  };

  const cellMargins = {
    top: 120,
    bottom: 120,
    left: 150,
    right: 150,
  };

  // Prototype Choices list
  const prototypeOptions = [
    'Wireframe/mid-fidelity UI.',
    'Figma/clickable prototype.',
    'Landing page.',
    '[X] Dashboard (Interactive Owner Analytics)',
    'Flowchart + simulasi proses.',
    'Prototype IoT.',
    'Arsitektur jaringan/infrastruktur.',
    '[X] Demo aplikasi sederhana (Aneka POS Web Application)',
    'Database/data-flow prototype.',
    'Mockup layanan digital.',
  ];

  // Table 1: Prototype Brief rows
  const briefData = [
    {
      component: 'Nama solusi',
      content: 'Aneka POS (Point of Sale & Smart Stock Monitoring Toko Aneka Usaha)',
    },
    {
      component: 'Core problem',
      content:
        '1. Pencatatan transaksi belanja masih manual memakai buku tulis, sehingga antrean sangat lambat dan rawan salah hitung saat jam sibuk pagi (anak sekolah dan guru di Pappa, Takalar).\n2. Tidak adanya pencatatan stok otomatis menyebabkan barang cepat laku (kertas HVS, tinta printer, pulpen) mendadak habis (stock-out), memaksa pemilik toko belanja dadakan ke Makassar tanpa rencana.',
    },
    {
      component: 'Target user',
      content:
        '1. Kasir / Karyawan Toko: Membutuhkan antarmuka kasir cepat, bebas distraksi, dan pencarian instan untuk melayani transaksi Tunai maupun QRIS.\n2. Owner / Pemilik Toko (Bapak Hasrul): Membutuhkan dashboard visual untuk memantau pemasukan harian, valuasi aset barang, dan peringatan dini stok menipis.',
    },
    {
      component: 'Value proposition awal',
      content:
        'Aplikasi kasir dan pemantau inventaris berbasis web-tablet yang memangkas waktu transaksi belanja hingga di bawah 15 detik serta mencegah kekosongan stok melalui peringatan otomatis dan format pesanan kulakan Makassar satu klik.',
    },
    {
      component: 'Fitur inti 1',
      content:
        'Katalog Cepat & Multi-Payment POS (Kasir): Pencarian produk seketika, keranjang belanja dengan validasi stok riil, perhitungan otomatis kembalian tunai dan QRIS digital, serta penerbitan nota/struk belanja digital.',
    },
    {
      component: 'Fitur inti 2',
      content:
        'Peringatan Batas Minimum Stok & Salin Format WA Makassar: Deteksi otomatis barang yang mencapai batas kritis (stock <= min_stock), penanda visual peringatan, dan tombol satu klik untuk menyalin draf daftar pesanan barang ke supplier Makassar via WhatsApp.',
    },
    {
      component: 'Fitur inti 3',
      content:
        'Dashboard Pemantauan & Analitik Khusus Owner: Pemisahan hak akses akun (Owner vs Kasir), ringkasan omzet harian riil, valuasi rupiah aset stok toko, grafik tren jam sibuk belanja, dan rasio perbandingan penerimaan Tunai vs QRIS.',
    },
    {
      component: 'Fitur yang sengaja tidak dibuat',
      content:
        '1. Backend database cloud server berbayar (sementara digantikan browser LocalStorage agar aplikasi dapat berjalan cepat, tanpa biaya hosting, dan tetap berfungsi saat internet offline).\n2. Sistem ERP multi-cabang dan akuntansi perpajakan rumit (dieliminasi agar antarmuka tetap bersih, minimalis, dan langsung dipahami staf tanpa pelatihan khusus).',
    },
    {
      component: 'Teknologi',
      content:
        'Frontend: React 18, TypeScript, Tailwind CSS, Browser LocalStorage API (penyimpanan lokal persisten), arsitektur responsif ramah tablet landscape (10-12 inci) dan komputer kasir.',
    },
    {
      component: 'Indikator keberhasilan prototype',
      content:
        '1. Waktu proses transaksi per pembeli berkurang drastis dari >1 menit (tulis nota buku) menjadi <20 detik.\n2. Nol kejadian kehabisan stok mendadak (unplanned stock-out) pada barang-barang esensial ritel.\n3. Pemilik toko dapat mengetahui total omzet kasir dan sisa modal stok secara riil setiap saat tanpa perlu rekapitulasi buku manual di malam hari.\n4. Kasir dan Owner dapat mengoperasikan alur kerja aplikasi secara lancar dalam waktu adaptasi <10 menit.',
    },
  ];

  // Helper to split text by newline into paragraphs
  const formatCellParagraphs = (text, isHeader = false) => {
    const lines = text.split('\n');
    return lines.map(
      (line, idx) =>
        new Paragraph({
          spacing: { before: idx === 0 ? 0 : 60, after: 60, line: 260 },
          children: [
            new TextRun({
              text: line,
              bold: isHeader,
              size: 21, // 10.5 pt
              font: 'Calibri',
            }),
          ],
        })
    );
  };

  const briefRows = [
    // Header Row
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 3000, type: WidthType.DXA },
          shading: { fill: 'F1F5F9', type: ShadingType.CLEAR },
          margins: cellMargins,
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Komponen',
                  bold: true,
                  size: 22,
                  font: 'Calibri',
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 6500, type: WidthType.DXA },
          shading: { fill: 'F1F5F9', type: ShadingType.CLEAR },
          margins: cellMargins,
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Isi',
                  bold: true,
                  size: 22,
                  font: 'Calibri',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    // Data Rows
    ...briefData.map(
      (item) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 3000, type: WidthType.DXA },
              margins: cellMargins,
              children: formatCellParagraphs(item.component, true),
            }),
            new TableCell({
              width: { size: 6500, type: WidthType.DXA },
              margins: cellMargins,
              children: formatCellParagraphs(item.content, false),
            }),
          ],
        })
    ),
  ];

  // Table 2: Storyboard data
  const storyboardData = [
    {
      step: '1',
      initial:
        'Kasir bersiap melayani antrean pelanggan di pagi hari; aplikasi kasir terbuka di tablet kasir.',
      interaction:
        'Kasir memilih profil "Kasir", memasukkan 4-digit PIN (1234), lalu mengetik kata kunci barang (contoh: "hvs" atau "pulpen") di kolom pencarian atau langsung mengetuk kartu produk di layar.',
      output:
        'Katalog produk terfilter seketika menampilkan nama, foto riil, harga, dan sisa stok. Barang langsung masuk ke keranjang belanja tanpa ada jeda/hambatan.',
    },
    {
      step: '2',
      initial:
        'Pembeli meminta 2 rim kertas HVS A4 dan 1 pack buku tulis; barang sudah berada dalam daftar pesanan keranjang.',
      interaction:
        'Kasir menekan tombol "+" atau "-" untuk menyesuaikan jumlah pesanan pembeli. Sistem memeriksa ketersediaan stok fisik di etalase.',
      output:
        'Jumlah belanja dan subtotal terkalkulasi otomatis. Jika jumlah melebihi stok yang ada, muncul peringatan cegah-transaksi sehingga kasir tidak menjual barang fiktif.',
    },
    {
      step: '3',
      initial:
        'Pembeli ingin menyelesaikan transaksi menggunakan pembayaran QRIS atau Uang Tunai.',
      interaction:
        'Kasir memilih opsi "QRIS" atau menginput nominal uang tunai pembeli pada pilihan "Tunai", lalu menekan tombol "Selesaikan Transaksi".',
      output:
        'Transaksi tercatat sukses, modal struk nota belanja muncul seketika menampilkan nomor nota dan rincian kembalian, serta kuantitas stok barang otomatis terpotong di sistem.',
    },
    {
      step: '4',
      initial:
        'Pemotongan stok pada transaksi sebelumnya menyebabkan salah satu barang (misal Pulpen Faster) sisa 2 lusin (batas aman min: 5).',
      interaction:
        'Sistem otomatis mengevaluasi kondisi stock <= min_stock pada inventaris toko secara background.',
      output:
        'Muncul indikator titik merah pada menu navigasi serta kartu peringatan stok prioritas, memberi tahu staf bahwa barang tersebut harus segera didaftarkan untuk restok.',
    },
    {
      step: '5',
      initial:
        'Pemilik toko (Owner) login menggunakan akun "Owner" (PIN: 9999) dari tablet/laptop pribadinya untuk evaluasi toko.',
      interaction:
        'Owner masuk ke halaman khusus "Dashboard", memantau grafik tren omzet jam sibuk, dan menekan tombol "Salin Order Makassar" pada daftar barang menipis.',
      output:
        'Owner mendapatkan gambaran lengkap kesehatan finansial toko (omzet riil dan rasio kas), serta teks format pesanan grosir siap tempel (paste) ke WhatsApp supplier Makassar dalam 1 detik.',
    },
  ];

  const storyboardRows = [
    // Header Row
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 1400, type: WidthType.DXA },
          shading: { fill: 'F1F5F9', type: ShadingType.CLEAR },
          margins: cellMargins,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'Langkah pengguna',
                  bold: true,
                  size: 21,
                  font: 'Calibri',
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 2600, type: WidthType.DXA },
          shading: { fill: 'F1F5F9', type: ShadingType.CLEAR },
          margins: cellMargins,
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Kondisi awal',
                  bold: true,
                  size: 21,
                  font: 'Calibri',
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 2800, type: WidthType.DXA },
          shading: { fill: 'F1F5F9', type: ShadingType.CLEAR },
          margins: cellMargins,
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Interaksi',
                  bold: true,
                  size: 21,
                  font: 'Calibri',
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 2700, type: WidthType.DXA },
          shading: { fill: 'F1F5F9', type: ShadingType.CLEAR },
          margins: cellMargins,
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Output/benefit',
                  bold: true,
                  size: 21,
                  font: 'Calibri',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    // Data Rows
    ...storyboardData.map(
      (item) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 1400, type: WidthType.DXA },
              margins: cellMargins,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: item.step,
                      bold: true,
                      size: 21,
                      font: 'Calibri',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 2600, type: WidthType.DXA },
              margins: cellMargins,
              children: formatCellParagraphs(item.initial),
            }),
            new TableCell({
              width: { size: 2800, type: WidthType.DXA },
              margins: cellMargins,
              children: formatCellParagraphs(item.interaction),
            }),
            new TableCell({
              width: { size: 2700, type: WidthType.DXA },
              margins: cellMargins,
              children: formatCellParagraphs(item.output),
            }),
          ],
        })
    ),
  ];

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 22,
            color: '1E293B',
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              bottom: 1000,
              left: 1200,
              right: 1200,
            },
          },
        },
        children: [
          // Sub-header info
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: 'Kewirausahaan - Muh. Fajri Raharjo',
                italics: true,
                size: 20,
                color: '64748B',
                font: 'Calibri',
              }),
            ],
          }),

          // Title
          new Paragraph({
            spacing: { before: 0, after: 120 },
            children: [
              new TextRun({
                text: 'MINGGU 11 - Prototype',
                bold: true,
                size: 28,
                color: '2563EB',
                font: 'Calibri',
              }),
            ],
          }),

          // Tujuan
          new Paragraph({
            spacing: { before: 80, after: 60 },
            children: [
              new TextRun({
                text: 'Tujuan',
                bold: true,
                size: 23,
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 140 },
            children: [
              new TextRun({
                text: 'Membuat representasi solusi yang cukup nyata untuk memperoleh feedback pengguna, bukan membangun produk final.',
                size: 22,
                font: 'Calibri',
              }),
            ],
          }),

          // Pilihan Prototype
          new Paragraph({
            spacing: { before: 60, after: 60 },
            children: [
              new TextRun({
                text: 'Pilihan prototype',
                bold: true,
                size: 23,
                font: 'Calibri',
              }),
            ],
          }),
          ...prototypeOptions.map((opt) => {
            const isChosen = opt.startsWith('[X]');
            return new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: opt,
                  bold: isChosen,
                  color: isChosen ? '2563EB' : '334155',
                  size: 21,
                  font: 'Calibri',
                }),
              ],
            });
          }),

          // Space before Table 1
          new Paragraph({
            spacing: { before: 240, after: 80 },
            children: [
              new TextRun({
                text: 'Prototype Brief',
                bold: true,
                size: 24,
                color: '2563EB',
                font: 'Calibri',
              }),
            ],
          }),

          // Table 1
          new Table({
            width: { size: 9500, type: WidthType.DXA },
            borders: tableBorder,
            rows: briefRows,
          }),

          // Space before Table 2
          new Paragraph({
            spacing: { before: 300, after: 80 },
            children: [
              new TextRun({
                text: 'Prototype Storyboard',
                bold: true,
                size: 24,
                color: '2563EB',
                font: 'Calibri',
              }),
            ],
          }),

          // Table 2
          new Table({
            width: { size: 9500, type: WidthType.DXA },
            borders: tableBorder,
            rows: storyboardRows,
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.resolve('Modul_Minggu_11_Prototype_Aneka_POS.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Document successfully created at: ${outputPath}`);
}

createDocument().catch(console.error);
