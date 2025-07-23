// MongoDB Indexing dan Performance Optimization
// File ini berisi contoh penggunaan index dan tips optimasi performa di MongoDB

/*
Index di MongoDB berfungsi mirip dengan index di database relasional,
membantu mempercepat query dengan mengurangi jumlah dokumen yang perlu diperiksa.
Tanpa index, MongoDB harus melakukan collection scan (memeriksa semua dokumen).
*/

// ----- Membuat Index -----

// 1. Single Field Index (Index pada satu field)
// db.products.createIndex({ name: 1 }); // 1 untuk ascending, -1 untuk descending

// 2. Compound Index (Index pada multiple fields)
// db.products.createIndex({ category: 1, price: -1 });

// 3. Multikey Index (Index pada array)
// db.articles.createIndex({ tags: 1 });

// 4. Text Index (Index untuk pencarian teks)
// db.articles.createIndex({ content: "text" });

// 5. Geospatial Index (Index untuk data lokasi)
// db.places.createIndex({ location: "2dsphere" });

// 6. Hashed Index (Index menggunakan hash function)
// db.users.createIndex({ _id: "hashed" });

// ----- Melihat Index yang Ada -----

// db.products.getIndexes();

// ----- Menghapus Index -----

// db.products.dropIndex({ name: 1 }); // Hapus index tertentu
// db.products.dropIndexes(); // Hapus semua index kecuali _id

// ----- Index Properties -----

// Unique Index (Memastikan tidak ada duplikasi)
// db.users.createIndex({ email: 1 }, { unique: true });

// Partial Index (Index subset dokumen)
// db.products.createIndex(
//     { price: 1 },
//     { partialFilterExpression: { quantity: { $gt: 0 } } }
// );

// TTL Index (Time-To-Live, menghapus dokumen secara otomatis setelah waktu tertentu)
// db.sessions.createIndex(
//     { lastModified: 1 },
//     { expireAfterSeconds: 3600 } // Hapus setelah 1 jam
// );

// Sparse Index (Hanya mengindeks dokumen yang memiliki field tertentu)
// db.products.createIndex({ promotionCode: 1 }, { sparse: true });

// ----- Analisis Query dengan explain() -----

/*
explain() digunakan untuk menganalisis bagaimana MongoDB mengeksekusi query.
Dapat membantu mengidentifikasi bottleneck dan mengoptimalkan index.
*/

// db.products.find({ category: "Electronics" }).explain("executionStats");

// Hasil explain() mencakup:
// - queryPlanner: rencana yang dipilih MongoDB untuk menjalankan query
// - executionStats: statistik eksekusi query, termasuk waktu dan dokumen yang diperiksa
// - serverInfo: informasi tentang instance MongoDB

// ----- Covered Query -----

/*
Covered query adalah query yang dapat dijawab sepenuhnya menggunakan index,
tanpa perlu memeriksa dokumen sebenarnya. Ini sangat efisien.
*/

// Membuat index untuk covered query
// db.products.createIndex({ category: 1, name: 1, price: 1 });

// Query yang dapat "covered" oleh index di atas
// db.products.find(
//     { category: "Electronics" },
//     { _id: 0, name: 1, price: 1 } // Projection hanya memilih field yang ada di index
// ).explain("executionStats");

// ----- Tips Optimasi Performa -----

/*
1. Hindari Sorting Tanpa Index
   Sorting pada field yang tidak terindeks memerlukan operasi in-memory sort
   yang dapat memakan banyak memori, terutama untuk dataset besar.
*/

// Untuk query dengan sort, buat index yang cocok
// db.products.createIndex({ category: 1, price: 1 }); // Untuk sort berdasarkan harga
// db.products.find({ category: "Electronics" }).sort({ price: 1 });

/*
2. Gunakan Projection untuk Membatasi Field
   Ambil hanya field yang diperlukan untuk mengurangi beban memori dan jaringan.
*/

// db.products.find({ category: "Electronics" }, { name: 1, price: 1, _id: 0 });

/*
3. Batasi Jumlah Hasil dengan limit()
   Menggunakan limit() dan skip() untuk pagination.
*/

// db.products.find().sort({ price: 1 }).skip(20).limit(10);

/*
4. Perhatikan Index Size
   Index mempercepat query tapi memakan ruang di memori dan disk.
   Terlalu banyak index juga dapat memperlambat operasi write.
*/

// Melihat ukuran index
// db.products.stats();

/*
5. Compound Index Order Matters
   Urutan field dalam compound index penting. Aturannya:
   - Field untuk equality match (=) harus didahulukan
   - Field untuk sort sebaiknya mengikuti equality match
   - Field untuk range query (>, <, between) terakhir
*/

// Index optimal untuk query dengan filter dan sort
// db.products.createIndex({ category: 1, brand: 1, price: -1 });
// db.products.find({ category: "Electronics", brand: "Samsung" }).sort({ price: -1 });

/*
6. Use $hint untuk Memaksa Penggunaan Index Tertentu
   Kadang MongoDB tidak memilih index terbaik, $hint memaksa penggunaan index.
*/

// db.products.find({ category: "Electronics" }).hint({ category: 1, price: 1 });

/*
7. Optimalkan Aggregation Pipeline
   - Gunakan $match di awal pipeline untuk mengurangi dokumen yang diproses
   - Gunakan projection untuk mengurangi ukuran dokumen
   - Perhatikan penggunaan memori, terutama untuk operasi seperti $sort, $group
*/

// db.sales.aggregate([
//     { $match: { date: { $gte: new Date("2023-01-01") } } }, // Filter awal
//     { $project: { customer: 1, items: 1, total: 1 } },      // Kurangi ukuran dokumen
//     { $sort: { total: -1 } },                               // Sort setelah jumlah dokumen berkurang
//     { $limit: 100 }
// ]);

/*
8. Gunakan Read Concern dan Write Concern Sesuai Kebutuhan
   - Sesuaikan read/write concern berdasarkan kebutuhan konsistensi vs performa
*/

// db.products.find().readConcern("local"); // Prioritas performa
// db.products.insertOne({ name: "New Product" }, { writeConcern: { w: "majority" } }); // Prioritas konsistensi

/*
9. Hindari Regex Tanpa Awalan Tetap
   - Regex dengan awalan tetap (^) dapat menggunakan index
   - Regex tanpa awalan tetap memerlukan collection scan
*/

// Efisien, dapat menggunakan index
// db.products.find({ name: /^Apple/ });

// Tidak efisien, memerlukan collection scan
// db.products.find({ name: /Apple/ });

/*
10. Batasi Nested Array dengan $slice
    - Operasi pada array besar bisa memakan banyak memori
*/

// Mengambil hanya 5 elemen pertama dari array reviews
// db.products.find({ category: "Electronics" }, { reviews: { $slice: 5 } });

/*
11. Gunakan $exists untuk Menangani Field yang Mungkin Tidak Ada
    - Efisien jika menggunakan sparse index
*/

// db.products.find({ promotionCode: { $exists: true } });

/*
12. Monitoring dan Profiling
    - Gunakan MongoDB Profiler untuk mengidentifikasi query yang lambat
*/

// Aktifkan profiler untuk query yang berjalan lebih dari 100ms
// db.setProfilingLevel(1, { slowms: 100 });

// Melihat log query lambat
// db.system.profile.find().sort({ ts: -1 }).limit(10);

/*
 * Catatan Penting:
 * 1. Index mempercepat query tapi memperlambat write operations
 * 2. Lakukan analisis performa secara berkala dengan explain()
 * 3. Tes performa dengan dataset yang mirip dengan produksi
 * 4. Perbarui index secara berkala berdasarkan pola akses yang berubah
 * 5. Gunakan MongoDB Compass atau MongoDB Atlas untuk visualisasi performa
 * 6. Pertimbangkan sharding untuk dataset yang sangat besar
 */
