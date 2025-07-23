// MongoDB Schema Validation
// File ini berisi contoh penggunaan schema validation di MongoDB

// ----- Membuat Collection dengan Schema Validation -----

/*
MongoDB memungkinkan kita menentukan aturan validasi untuk data yang dimasukkan ke dalam collection.
Ini membantu memastikan integritas dan konsistensi data.
*/

// Contoh Schema Validation sederhana
// db.createCollection("produk", {
//    validator: {
//       $jsonSchema: {
//          bsonType: "object",
//          required: ["nama", "harga", "stok"],
//          properties: {
//             nama: {
//                bsonType: "string",
//                description: "harus berupa string dan wajib ada"
//             },
//             harga: {
//                bsonType: "number",
//                minimum: 0,
//                description: "harus berupa angka positif dan wajib ada"
//             },
//             stok: {
//                bsonType: "int",
//                minimum: 0,
//                description: "harus berupa integer positif dan wajib ada"
//             },
//             kategori: {
//                bsonType: "string",
//                description: "harus berupa string jika ada"
//             },
//             deskripsi: {
//                bsonType: "string",
//                description: "harus berupa string jika ada"
//             },
//             tanggalDibuat: {
//                bsonType: "date",
//                description: "harus berupa tanggal jika ada"
//             }
//          }
//       }
//    }
// });

// Data yang valid akan berhasil dimasukkan
// db.produk.insertOne({
//    nama: "Laptop Asus",
//    harga: 8500000,
//    stok: 15,
//    kategori: "Elektronik",
//    deskripsi: "Laptop untuk kebutuhan gaming",
//    tanggalDibuat: new Date()
// });

// Data yang tidak valid akan gagal dimasukkan
// db.produk.insertOne({
//    nama: "Laptop HP",
//    harga: "tujuh juta", // Harusnya number, bukan string
//    stok: 10
// });
// Akan menghasilkan error validasi

// ----- Modifikasi Schema Validation pada Collection yang Ada -----

// Mengubah validator pada collection yang sudah ada
// db.runCommand({
//    collMod: "produk",
//    validator: {
//       $jsonSchema: {
//          bsonType: "object",
//          required: ["nama", "harga", "stok", "kategori"], // Menambahkan kategori sebagai field wajib
//          properties: {
//             nama: {
//                bsonType: "string",
//                description: "harus berupa string dan wajib ada"
//             },
//             harga: {
//                bsonType: "number",
//                minimum: 0,
//                description: "harus berupa angka positif dan wajib ada"
//             },
//             stok: {
//                bsonType: "int",
//                minimum: 0,
//                description: "harus berupa integer positif dan wajib ada"
//             },
//             kategori: {
//                bsonType: "string",
//                enum: ["Elektronik", "Fashion", "Makanan", "Minuman", "Lainnya"],
//                description: "harus berupa salah satu dari kategori yang ditentukan"
//             },
//             deskripsi: {
//                bsonType: "string",
//                description: "harus berupa string jika ada"
//             },
//             tanggalDibuat: {
//                bsonType: "date",
//                description: "harus berupa tanggal jika ada"
//             }
//          }
//       }
//    },
//    validationLevel: "strict", // "strict" atau "moderate"
//    validationAction: "error" // "error" atau "warn"
// });

/*
validationLevel:
- "strict": Validasi diterapkan pada semua operasi insert dan update
- "moderate": Validasi hanya diterapkan pada dokumen yang sudah valid atau baru dimasukkan

validationAction:
- "error": Operasi gagal jika data tidak valid
- "warn": Operasi tetap dilakukan tapi mencatat warning di log
*/

// ----- Contoh Schema dengan Array dan Nested Document -----

// db.createCollection("pesanan", {
//    validator: {
//       $jsonSchema: {
//          bsonType: "object",
//          required: ["kode", "pelanggan", "tanggal", "items"],
//          properties: {
//             kode: {
//                bsonType: "string",
//                description: "kode pesanan harus berupa string dan wajib ada"
//             },
//             pelanggan: {
//                bsonType: "object",
//                required: ["nama", "email"],
//                properties: {
//                   nama: {
//                      bsonType: "string"
//                   },
//                   email: {
//                      bsonType: "string",
//                      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
//                   },
//                   telepon: {
//                      bsonType: "string"
//                   },
//                   alamat: {
//                      bsonType: "string"
//                   }
//                }
//             },
//             tanggal: {
//                bsonType: "date"
//             },
//             items: {
//                bsonType: "array",
//                minItems: 1,
//                items: {
//                   bsonType: "object",
//                   required: ["produk_id", "nama", "harga", "jumlah"],
//                   properties: {
//                      produk_id: {
//                         bsonType: "objectId"
//                      },
//                      nama: {
//                         bsonType: "string"
//                      },
//                      harga: {
//                         bsonType: "number",
//                         minimum: 0
//                      },
//                      jumlah: {
//                         bsonType: "int",
//                         minimum: 1
//                      }
//                   }
//                }
//             },
//             totalHarga: {
//                bsonType: "number",
//                minimum: 0
//             },
//             status: {
//                bsonType: "string",
//                enum: ["pending", "diproses", "dikirim", "selesai", "dibatalkan"],
//                description: "status pesanan harus salah satu nilai yang ditentukan"
//             }
//          }
//       }
//    }
// });

/*
 * Catatan:
 * Schema validation di MongoDB memberi fleksibilitas sekaligus memastikan integritas data.
 * Gunakan validation level dan action sesuai kebutuhan aplikasi Anda.
 * Sebaiknya rancang schema validation sejak awal untuk menghindari masalah integritas data.
 */
