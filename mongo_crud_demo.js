// File untuk dijalankan dengan MongoDB Shell (mongosh)
// Cara menjalankan: mongosh --file mongo_crud_demo.js

// ----- SETUP & UTILITY ----- //
// Menggunakan database tutorial_db
const dbName = 'tutorial_db';
db = db.getSiblingDB(dbName);

// Fungsi helper untuk memformat output
function printHeader(message) {
  print('\n========== ' + message + ' ==========');
}

// Hapus collection untuk memulai dari awal
db.users.drop();

// ----- CREATE OPERATION ----- //
printHeader('CREATE OPERATION');

// Menambahkan satu dokumen
const singleInsertResult = db.users.insertOne({
  name: "Andi",
  age: 25,
  email: "andi@example.com",
  created_at: new Date()
});
print(`Dokumen berhasil ditambahkan dengan ID: ${singleInsertResult.insertedId}`);

// Menambahkan banyak dokumen
const manyInsertResult = db.users.insertMany([
  { name: "Budi", age: 30, email: "budi@example.com", created_at: new Date() },
  { name: "Citra", age: 28, email: "citra@example.com", created_at: new Date() },
  { name: "Deni", age: 35, email: "deni@example.com", created_at: new Date() }
]);
print(`${manyInsertResult.insertedIds.length} dokumen berhasil ditambahkan`);

// ----- READ OPERATION ----- //
printHeader('READ OPERATION');

// Membaca semua dokumen
print('Semua pengguna:');
const allUsers = db.users.find().toArray();
printjson(allUsers);

// Membaca dokumen dengan filter
print('\nPengguna dengan umur >= 30:');
const filteredUsers = db.users.find({ age: { $gte: 30 } }).toArray();
printjson(filteredUsers);

// Membaca satu dokumen
print('\nDetail pengguna Andi:');
const oneUser = db.users.findOne({ name: "Andi" });
printjson(oneUser);

// ----- UPDATE OPERATION ----- //
printHeader('UPDATE OPERATION');

// Mengubah satu dokumen
const updateOneResult = db.users.updateOne(
  { name: "Andi" },
  { $set: { age: 26, updated_at: new Date() } }
);
print(`${updateOneResult.modifiedCount} dokumen diubah`);

// Mengubah banyak dokumen
const updateManyResult = db.users.updateMany(
  { age: { $gte: 30 } },
  { $set: { city: "Jakarta", updated_at: new Date() } }
);
print(`${updateManyResult.modifiedCount} dokumen diubah`);

// Membaca data setelah update
printHeader('DATA SETELAH UPDATE');
print('Semua pengguna setelah update:');
printjson(db.users.find().toArray());

// ----- DELETE OPERATION ----- //
printHeader('DELETE OPERATION');

// Menghapus satu dokumen
const deleteOneResult = db.users.deleteOne({ name: "Citra" });
print(`${deleteOneResult.deletedCount} dokumen dihapus`);

// Menghapus banyak dokumen
const deleteManyResult = db.users.deleteMany({ age: { $gte: 30 } });
print(`${deleteManyResult.deletedCount} dokumen dihapus`);

// Membaca data setelah delete
printHeader('DATA SETELAH DELETE');
print('Sisa pengguna setelah delete:');
printjson(db.users.find().toArray());

printHeader('SELESAI');
print('Demonstrasi operasi CRUD MongoDB selesai');
