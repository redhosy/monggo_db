// MongoDB Relationships
// File ini berisi contoh implementasi relasi data di MongoDB

/*
Meskipun MongoDB adalah database NoSQL, kita tetap bisa
mengimplementasikan hubungan antar dokumen dengan beberapa cara:
1. Embedded Documents (Dokumen Tertanam)
2. Document References (Referensi Dokumen)
*/

// ----- 1. Embedded Documents (Dokumen Tertanam) -----

/*
Dengan pendekatan ini, kita menyimpan dokumen terkait sebagai
sub-dokumen di dalam dokumen utama. Cocok untuk relasi one-to-few
dan saat data terkait selalu diakses bersama dokumen utama.
*/

// Contoh embedded document untuk mahasiswa dengan daftar mata kuliah
// db.mahasiswa.insertOne({
//     nim: "A12345",
//     nama: "Budi Santoso",
//     jurusan: "Teknik Informatika",
//     semester: 3,
//     mata_kuliah: [
//         {
//             kode: "TI101",
//             nama: "Algoritma Pemrograman",
//             sks: 3,
//             nilai: "A"
//         },
//         {
//             kode: "TI102",
//             nama: "Basis Data",
//             sks: 3,
//             nilai: "B+"
//         },
//         {
//             kode: "TI103",
//             nama: "Matematika Diskrit",
//             sks: 2,
//             nilai: "A-"
//         }
//     ],
//     alamat: {
//         jalan: "Jl. Merdeka No. 123",
//         kota: "Jakarta",
//         kodePos: "12345",
//         provinsi: "DKI Jakarta"
//     }
// });

// Mencari mahasiswa dengan mata kuliah tertentu
// db.mahasiswa.find({ "mata_kuliah.nama": "Basis Data" });

// Menambahkan mata kuliah baru
// db.mahasiswa.updateOne(
//     { nim: "A12345" },
//     { $push: { mata_kuliah: {
//         kode: "TI104",
//         nama: "Jaringan Komputer",
//         sks: 3,
//         nilai: "B"
//     }}}
// );

// Mengubah nilai mata kuliah
// db.mahasiswa.updateOne(
//     { nim: "A12345", "mata_kuliah.kode": "TI102" },
//     { $set: { "mata_kuliah.$.nilai": "A-" }}
// );

// ----- 2. Document References (Referensi Dokumen) -----

/*
Dengan pendekatan ini, kita menyimpan ID dokumen terkait.
Cocok untuk relasi one-to-many dan many-to-many, serta saat data
perlu diakses secara independen.
*/

// Collection mata_kuliah
// db.mata_kuliah.insertMany([
//     {
//         _id: ObjectId(),
//         kode: "TI101",
//         nama: "Algoritma Pemrograman",
//         sks: 3,
//         dosen: "Dr. Ahmad"
//     },
//     {
//         _id: ObjectId(),
//         kode: "TI102",
//         nama: "Basis Data",
//         sks: 3,
//         dosen: "Prof. Budi"
//     },
//     {
//         _id: ObjectId(),
//         kode: "TI103",
//         nama: "Matematika Diskrit",
//         sks: 2,
//         dosen: "Dr. Cindy"
//     }
// ]);

// Collection mahasiswa dengan referensi mata_kuliah
// const mk1 = db.mata_kuliah.findOne({ kode: "TI101" })._id;
// const mk2 = db.mata_kuliah.findOne({ kode: "TI102" })._id;

// db.mahasiswa.insertOne({
//     nim: "A12346",
//     nama: "Dewi Anjani",
//     jurusan: "Teknik Informatika",
//     semester: 3,
//     mata_kuliah: [
//         {
//             matakuliah_id: mk1,
//             nilai: "A"
//         },
//         {
//             matakuliah_id: mk2,
//             nilai: "B+"
//         }
//     ]
// });

// ----- Lookup untuk Join Dokumen -----

/*
MongoDB menyediakan operator $lookup dalam aggregation pipeline
untuk melakukan join antar collection, mirip JOIN di SQL.
*/

// db.mahasiswa.aggregate([
//     {
//         $match: { nim: "A12346" }
//     },
//     {
//         $unwind: "$mata_kuliah"
//     },
//     {
//         $lookup: {
//             from: "mata_kuliah",
//             localField: "mata_kuliah.matakuliah_id",
//             foreignField: "_id",
//             as: "detail_mk"
//         }
//     },
//     {
//         $unwind: "$detail_mk"
//     },
//     {
//         $project: {
//             _id: 0,
//             nim: 1,
//             nama: 1,
//             "kode_mk": "$detail_mk.kode",
//             "nama_mk": "$detail_mk.nama",
//             "dosen": "$detail_mk.dosen",
//             "nilai": "$mata_kuliah.nilai"
//         }
//     }
// ]);

// ----- 3. Many-to-Many Relationship -----

/*
Hubungan many-to-many bisa diimplementasikan dengan:
1. Array of references di kedua collection
2. Menggunakan collection terpisah untuk junction
*/

// Contoh many-to-many dengan array of references

// Collection siswa
// db.siswa.insertMany([
//     { _id: ObjectId(), nis: "S001", nama: "Amir" },
//     { _id: ObjectId(), nis: "S002", nama: "Bela" },
//     { _id: ObjectId(), nis: "S003", nama: "Candra" }
// ]);

// Collection klub
// db.klub.insertMany([
//     { _id: ObjectId(), kode: "K001", nama: "Klub Sepak Bola" },
//     { _id: ObjectId(), kode: "K002", nama: "Klub Musik" },
//     { _id: ObjectId(), kode: "K003", nama: "Klub Komputer" }
// ]);

// Menambahkan referensi siswa ke klub
// db.klub.updateOne(
//     { kode: "K001" },
//     { $push: { anggota: db.siswa.findOne({ nis: "S001" })._id }}
// );
// db.klub.updateOne(
//     { kode: "K001" },
//     { $push: { anggota: db.siswa.findOne({ nis: "S002" })._id }}
// );
// db.klub.updateOne(
//     { kode: "K002" },
//     { $push: { anggota: db.siswa.findOne({ nis: "S002" })._id }}
// );
// db.klub.updateOne(
//     { kode: "K003" },
//     { $push: { anggota: db.siswa.findOne({ nis: "S001" })._id }}
// );

// Menambahkan referensi klub ke siswa
// db.siswa.updateOne(
//     { nis: "S001" },
//     { $push: { klub: db.klub.findOne({ kode: "K001" })._id }}
// );
// db.siswa.updateOne(
//     { nis: "S001" },
//     { $push: { klub: db.klub.findOne({ kode: "K003" })._id }}
// );

// Mendapatkan semua klub yang diikuti oleh siswa
// db.siswa.aggregate([
//     { $match: { nis: "S001" }},
//     { $lookup: {
//         from: "klub",
//         localField: "klub",
//         foreignField: "_id",
//         as: "daftar_klub"
//     }},
//     { $project: {
//         _id: 0,
//         nis: 1,
//         nama: 1,
//         klub: { $map: {
//             input: "$daftar_klub",
//             as: "item",
//             in: { kode: "$$item.kode", nama: "$$item.nama" }
//         }}
//     }}
// ]);

// ----- 4. Junction Collection untuk Many-to-Many -----

// Collection untuk menyimpan relasi siswa-klub
// db.siswa_klub.insertMany([
//     {
//         siswa_id: db.siswa.findOne({ nis: "S001" })._id,
//         klub_id: db.klub.findOne({ kode: "K001" })._id,
//         tanggal_gabung: new Date("2023-01-15"),
//         jabatan: "Anggota"
//     },
//     {
//         siswa_id: db.siswa.findOne({ nis: "S002" })._id,
//         klub_id: db.klub.findOne({ kode: "K001" })._id,
//         tanggal_gabung: new Date("2023-01-20"),
//         jabatan: "Ketua"
//     },
//     {
//         siswa_id: db.siswa.findOne({ nis: "S002" })._id,
//         klub_id: db.klub.findOne({ kode: "K002" })._id,
//         tanggal_gabung: new Date("2023-02-05"),
//         jabatan: "Anggota"
//     }
// ]);

// Query dengan double lookup
// db.siswa_klub.aggregate([
//     { $match: { jabatan: "Ketua" }},
//     { $lookup: {
//         from: "siswa",
//         localField: "siswa_id",
//         foreignField: "_id",
//         as: "detail_siswa"
//     }},
//     { $lookup: {
//         from: "klub",
//         localField: "klub_id",
//         foreignField: "_id",
//         as: "detail_klub"
//     }},
//     { $unwind: "$detail_siswa" },
//     { $unwind: "$detail_klub" },
//     { $project: {
//         _id: 0,
//         nama_siswa: "$detail_siswa.nama",
//         nama_klub: "$detail_klub.nama",
//         jabatan: 1,
//         tanggal_gabung: 1
//     }}
// ]);

/*
 * Catatan:
 * 1. Embedded documents cocok untuk:
 *    - Hubungan one-to-few
 *    - Data yang selalu diakses bersama dokumen utama
 *    - Data yang tidak sering berubah
 *
 * 2. Document references cocok untuk:
 *    - Hubungan one-to-many dan many-to-many
 *    - Data yang diakses secara independen
 *    - Data yang sering berubah
 *    - Data yang besar
 *
 * 3. Denormalisasi data dalam NoSQL seperti MongoDB adalah hal umum untuk
 *    meningkatkan performa, tetapi butuh keseimbangan antara performa dan
 *    kompleksitas dalam pembaruan data.
 */
