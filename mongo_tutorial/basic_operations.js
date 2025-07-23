// MongoDB Tutorial - Operasi Dasar
// File ini berisi contoh-contoh dasar operasi MongoDB

// ----- Koneksi ke MongoDB -----
// Di shell MongoDB (mongosh), koneksi sudah otomatis terhubung ke localhost:27017
// Jika ingin menghubungkan ke server tertentu: mongosh --host <hostname> --port <port>

// ----- Membuat dan Memilih Database -----
// use tutorial_db
// Catatan: Database akan dibuat secara otomatis saat data pertama disimpan

// ----- CRUD Operations (Create, Read, Update, Delete) -----

// ----- 1. Create (Menambahkan Data) -----

// Membuat collection
// db.createCollection("mahasiswa")

// Menambahkan satu dokumen
// db.mahasiswa.insertOne({
//     nama: "Budi Santoso",
//     nim: "A12345",
//     jurusan: "Teknik Informatika",
//     nilai: {
//         matematika: 85,
//         pemrograman: 90,
//         database: 88
//     },
//     status: "aktif"
// })

// Menambahkan banyak dokumen
// db.mahasiswa.insertMany([
//     {
//         nama: "Ani Wijaya",
//         nim: "A12346",
//         jurusan: "Teknik Informatika",
//         nilai: {
//             matematika: 78,
//             pemrograman: 85,
//             database: 92
//         },
//         status: "aktif"
//     },
//     {
//         nama: "Candra Kusuma",
//         nim: "A12347",
//         jurusan: "Sistem Informasi",
//         nilai: {
//             matematika: 80,
//             pemrograman: 75,
//             database: 85
//         },
//         status: "aktif"
//     },
//     {
//         nama: "Dewi Sartika",
//         nim: "A12348",
//         jurusan: "Sistem Informasi",
//         nilai: {
//             matematika: 90,
//             pemrograman: 82,
//             database: 78
//         },
//         status: "cuti"
//     }
// ])

// ----- 2. Read (Membaca Data) -----

// Membaca semua dokumen
// db.mahasiswa.find()

// Membaca dengan format yang lebih rapih
// db.mahasiswa.find().pretty()

// Membaca dengan filter
// db.mahasiswa.find({ jurusan: "Teknik Informatika" })

// Membaca satu dokumen
// db.mahasiswa.findOne({ nim: "A12345" })

// Menggunakan operator perbandingan
// db.mahasiswa.find({ "nilai.matematika": { $gte: 85 } })

// Menggunakan AND (implicit)
// db.mahasiswa.find({ jurusan: "Sistem Informasi", status: "aktif" })

// Menggunakan OR
// db.mahasiswa.find({ $or: [{ jurusan: "Teknik Informatika" }, { status: "cuti" }] })

// Memilih field tertentu
// db.mahasiswa.find({}, { nama: 1, nim: 1, _id: 0 })

// ----- 3. Update (Mengubah Data) -----

// Mengubah satu dokumen
// db.mahasiswa.updateOne(
//     { nim: "A12345" },
//     { $set: { "nilai.matematika": 87 } }
// )

// Mengubah banyak dokumen
// db.mahasiswa.updateMany(
//     { jurusan: "Sistem Informasi" },
//     { $set: { fakultas: "FTIK" } }
// )

// Menggunakan operator increment
// db.mahasiswa.updateOne(
//     { nim: "A12346" },
//     { $inc: { "nilai.pemrograman": 5 } }
// )

// Menambahkan elemen ke array
// db.mahasiswa.updateOne(
//     { nim: "A12347" },
//     { $push: { hobi: "membaca" } }
// )

// ----- 4. Delete (Menghapus Data) -----

// Menghapus satu dokumen
// db.mahasiswa.deleteOne({ nim: "A12348" })

// Menghapus banyak dokumen
// db.mahasiswa.deleteMany({ status: "cuti" })

// Menghapus semua dokumen di collection
// db.mahasiswa.deleteMany({})

// Menghapus collection
// db.mahasiswa.drop()

// Menghapus database (harus berada di database yang ingin dihapus)
// db.dropDatabase()

// ----- Agregasi -----

// Menghitung jumlah dokumen
// db.mahasiswa.countDocuments()

// Menghitung rata-rata nilai
// db.mahasiswa.aggregate([
//     { $group: {
//         _id: null,
//         rataRataMatematika: { $avg: "$nilai.matematika" }
//     }}
// ])

// Mengelompokkan berdasarkan jurusan
// db.mahasiswa.aggregate([
//     { $group: {
//         _id: "$jurusan",
//         jumlahMahasiswa: { $sum: 1 },
//         nilaiRataRata: { $avg: "$nilai.matematika" }
//     }}
// ])

// ----- Index -----

// Membuat index untuk meningkatkan performa query
// db.mahasiswa.createIndex({ nim: 1 })  // 1 untuk ascending, -1 untuk descending

// Membuat index unik
// db.mahasiswa.createIndex({ nim: 1 }, { unique: true })

// Melihat daftar index
// db.mahasiswa.getIndexes()

/*
 * Catatan:
 * Semua perintah di atas dieksekusi di MongoDB Shell (mongosh).
 * Untuk menjalankan di aplikasi Node.js, gunakan MongoDB Driver atau mongoose.
 */
