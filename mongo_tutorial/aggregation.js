// MongoDB Aggregation Framework
// File ini berisi contoh penggunaan aggregation pipeline di MongoDB

/*
Aggregation pipeline MongoDB adalah framework untuk pemrosesan data
yang memungkinkan transformasi dan analisis data yang kompleks.
Pipeline terdiri dari tahapan (stages) yang memproses dokumen satu per satu.
*/

// ----- Contoh Data -----
/*
Misalkan kita memiliki collection 'penjualan' dengan struktur:
{
    _id: ObjectId,
    tanggal: Date,
    customer: {
        id: String,
        nama: String,
        kota: String
    },
    items: [
        {
            produk_id: ObjectId,
            nama: String,
            kategori: String,
            harga: Number,
            jumlah: Number
        }
    ],
    total: Number,
    pembayaran: String // "tunai", "kredit", "transfer"
}
*/

// ----- Contoh Basic Aggregation -----

// Menghitung total penjualan per kota
// db.penjualan.aggregate([
//     {
//         $group: {
//             _id: "$customer.kota",
//             totalPenjualan: { $sum: "$total" }
//         }
//     },
//     {
//         $sort: { totalPenjualan: -1 }
//     }
// ]);

// Menghitung rata-rata penjualan per metode pembayaran
// db.penjualan.aggregate([
//     {
//         $group: {
//             _id: "$pembayaran",
//             rataRata: { $avg: "$total" },
//             jumlahTransaksi: { $sum: 1 }
//         }
//     },
//     {
//         $sort: { rataRata: -1 }
//     }
// ]);

// ----- $match: Filter Dokumen -----

// Menfilter penjualan pada bulan tertentu
// db.penjualan.aggregate([
//     {
//         $match: {
//             tanggal: {
//                 $gte: new Date("2023-01-01"),
//                 $lt: new Date("2023-02-01")
//             }
//         }
//     },
//     {
//         $group: {
//             _id: null,
//             totalPenjualan: { $sum: "$total" },
//             jumlahTransaksi: { $sum: 1 }
//         }
//     }
// ]);

// ----- $project: Memilih atau Membuat Field -----

// Memilih dan mengubah format field
// db.penjualan.aggregate([
//     {
//         $project: {
//             _id: 0,
//             tanggal: 1,
//             "customer.nama": 1,
//             totalPembelian: "$total",
//             metodePembayaran: "$pembayaran",
//             jumlahItem: { $size: "$items" }
//         }
//     }
// ]);

// ----- $unwind: "Membuka" Array -----

// Memisahkan item array menjadi dokumen terpisah
// db.penjualan.aggregate([
//     { $unwind: "$items" },
//     {
//         $project: {
//             _id: 0,
//             tanggal: 1,
//             customerName: "$customer.nama",
//             produk: "$items.nama",
//             kategori: "$items.kategori",
//             harga: "$items.harga",
//             jumlah: "$items.jumlah",
//             subtotal: { $multiply: ["$items.harga", "$items.jumlah"] }
//         }
//     }
// ]);

// ----- Analisis Produk -----

// Mencari produk terlaris
// db.penjualan.aggregate([
//     { $unwind: "$items" },
//     {
//         $group: {
//             _id: "$items.nama",
//             totalTerjual: { $sum: "$items.jumlah" },
//             totalPendapatan: { $sum: { $multiply: ["$items.harga", "$items.jumlah"] } }
//         }
//     },
//     { $sort: { totalTerjual: -1 } },
//     { $limit: 5 }
// ]);

// Menghitung penjualan per kategori produk
// db.penjualan.aggregate([
//     { $unwind: "$items" },
//     {
//         $group: {
//             _id: "$items.kategori",
//             totalTerjual: { $sum: "$items.jumlah" },
//             totalPendapatan: { $sum: { $multiply: ["$items.harga", "$items.jumlah"] } }
//         }
//     },
//     { $sort: { totalPendapatan: -1 } }
// ]);

// ----- Analisis Berdasarkan Waktu -----

// Penjualan per bulan
// db.penjualan.aggregate([
//     {
//         $project: {
//             year: { $year: "$tanggal" },
//             month: { $month: "$tanggal" },
//             total: 1
//         }
//     },
//     {
//         $group: {
//             _id: { year: "$year", month: "$month" },
//             totalPenjualan: { $sum: "$total" },
//             jumlahTransaksi: { $sum: 1 }
//         }
//     },
//     {
//         $sort: { "_id.year": 1, "_id.month": 1 }
//     }
// ]);

// ----- $lookup: Join dengan Collection Lain -----

// Misalkan kita memiliki collection 'products' dengan detail lengkap produk
// db.penjualan.aggregate([
//     { $unwind: "$items" },
//     {
//         $lookup: {
//             from: "products",
//             localField: "items.produk_id",
//             foreignField: "_id",
//             as: "product_details"
//         }
//     },
//     { $unwind: "$product_details" },
//     {
//         $project: {
//             _id: 0,
//             tanggal: 1,
//             customer: "$customer.nama",
//             produk: "$items.nama",
//             deskripsi: "$product_details.deskripsi",
//             supplier: "$product_details.supplier",
//             harga: "$items.harga",
//             jumlah: "$items.jumlah",
//             subtotal: { $multiply: ["$items.harga", "$items.jumlah"] }
//         }
//     }
// ]);

// ----- $facet: Multiple Aggregations in One Query -----

// Membuat beberapa analisis dalam satu query
// db.penjualan.aggregate([
//     {
//         $facet: {
//             "penjualanPerKota": [
//                 {
//                     $group: {
//                         _id: "$customer.kota",
//                         total: { $sum: "$total" }
//                     }
//                 },
//                 { $sort: { total: -1 } }
//             ],
//             "penjualanPerMetodePembayaran": [
//                 {
//                     $group: {
//                         _id: "$pembayaran",
//                         total: { $sum: "$total" }
//                     }
//                 },
//                 { $sort: { total: -1 } }
//             ],
//             "ringkasan": [
//                 {
//                     $group: {
//                         _id: null,
//                         totalPenjualan: { $sum: "$total" },
//                         rataRataPenjualan: { $avg: "$total" },
//                         jumlahTransaksi: { $sum: 1 },
//                         penjualanMin: { $min: "$total" },
//                         penjualanMax: { $max: "$total" }
//                     }
//                 }
//             ]
//         }
//     }
// ]);

// ----- $bucket: Mengelompokkan Data ke dalam Range -----

// Membuat bucket berdasarkan total penjualan
// db.penjualan.aggregate([
//     {
//         $bucket: {
//             groupBy: "$total",
//             boundaries: [0, 100000, 500000, 1000000, 5000000, 10000000],
//             default: "Above 10M",
//             output: {
//                 count: { $sum: 1 },
//                 totalPenjualan: { $sum: "$total" },
//                 customerIds: { $push: "$customer.id" }
//             }
//         }
//     }
// ]);

// ----- $addFields: Menambahkan Field Baru -----

// Menambahkan field profit dengan asumsi margin 30%
// db.penjualan.aggregate([
//     {
//         $addFields: {
//             profit: { $multiply: ["$total", 0.3] },
//             itemCount: { $size: "$items" }
//         }
//     },
//     {
//         $project: {
//             tanggal: 1,
//             customer: "$customer.nama",
//             total: 1,
//             profit: 1,
//             itemCount: 1,
//             profitPerItem: { $divide: ["$profit", "$itemCount"] }
//         }
//     }
// ]);

// ----- $out: Menyimpan Hasil Aggregation ke Collection Baru -----

// Menyimpan hasil analisis bulanan ke collection baru
// db.penjualan.aggregate([
//     {
//         $project: {
//             year: { $year: "$tanggal" },
//             month: { $month: "$tanggal" },
//             total: 1
//         }
//     },
//     {
//         $group: {
//             _id: { year: "$year", month: "$month" },
//             totalPenjualan: { $sum: "$total" },
//             jumlahTransaksi: { $sum: 1 }
//         }
//     },
//     {
//         $sort: { "_id.year": 1, "_id.month": 1 }
//     },
//     {
//         $out: "laporan_bulanan" // Hasil disimpan ke collection 'laporan_bulanan'
//     }
// ]);

// ----- $merge: Menyimpan Hasil ke Collection yang Sudah Ada -----

// Update atau insert hasil analisis ke collection yang sudah ada
// db.penjualan.aggregate([
//     // ... pipeline stages ...
//     {
//         $merge: {
//             into: "laporan_bulanan",
//             on: "_id",           // Field untuk identifikasi dokumen
//             whenMatched: "merge", // "merge", "replace", "keepExisting", atau fungsi
//             whenNotMatched: "insert" // "insert" atau "discard"
//         }
//     }
// ]);

/*
 * Catatan:
 * 1. Aggregation pipeline sangat powerful untuk analisis data kompleks
 * 2. Gunakan indeks yang tepat untuk mengoptimalkan performa
 * 3. Hindari penggunaan memori berlebihan, terutama untuk dataset besar
 * 4. Operasi aggregation dapat dikombinasikan dengan operasi lain seperti
 *    explain() untuk debugging performa
 * 5. Pipeline memproses dokumen secara berurutan, sehingga urutan stage
 *    dapat mempengaruhi performa dan hasil akhir
 */
