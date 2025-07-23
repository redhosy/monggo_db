// Contoh CRUD (Create, Read, Update, Delete) dengan MongoDB menggunakan Node.js
// Pastikan sudah menginstal modul "mongodb": npm install mongodb

const { MongoClient } = require('mongodb');

// URL koneksi ke MongoDB
const url = 'mongodb://localhost:27017';
const dbName = 'tutorial_db';

// Fungsi untuk menghubungkan ke database
async function connect() {
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log('Terhubung dengan MongoDB');
        return client.db(dbName);
    } catch (error) {
        console.error('Gagal terhubung ke MongoDB:', error);
        process.exit(1);
    }
}

// Contoh operasi Create (Tambah Data)
async function createData() {
    const db = await connect();
    const collection = db.collection('users');
    
    try {
        // Menambahkan satu dokumen
        const singleResult = await collection.insertOne({
            name: "Andi",
            age: 25,
            email: "andi@example.com",
            created_at: new Date()
        });
        console.log('Dokumen berhasil ditambahkan:', singleResult.insertedId);
        
        // Menambahkan banyak dokumen
        const manyResult = await collection.insertMany([
            { name: "Budi", age: 30, email: "budi@example.com", created_at: new Date() },
            { name: "Citra", age: 28, email: "citra@example.com", created_at: new Date() },
            { name: "Deni", age: 35, email: "deni@example.com", created_at: new Date() }
        ]);
        console.log(`${manyResult.insertedCount} dokumen berhasil ditambahkan`);
    } catch (error) {
        console.error('Gagal menambahkan dokumen:', error);
    }
}

// Contoh operasi Read (Baca Data)
async function readData() {
    const db = await connect();
    const collection = db.collection('users');
    
    try {
        // Membaca semua dokumen
        const allUsers = await collection.find({}).toArray();
        console.log('Semua pengguna:', allUsers);
        
        // Membaca dokumen dengan filter
        const filteredUsers = await collection.find({ age: { $gte: 30 } }).toArray();
        console.log('Pengguna dengan umur >= 30:', filteredUsers);
        
        // Membaca satu dokumen
        const oneUser = await collection.findOne({ name: "Andi" });
        console.log('Detail pengguna Andi:', oneUser);
    } catch (error) {
        console.error('Gagal membaca dokumen:', error);
    }
}

// Contoh operasi Update (Ubah Data)
async function updateData() {
    const db = await connect();
    const collection = db.collection('users');
    
    try {
        // Mengubah satu dokumen
        const updateOneResult = await collection.updateOne(
            { name: "Andi" },
            { $set: { age: 26, updated_at: new Date() } }
        );
        console.log(`${updateOneResult.modifiedCount} dokumen diubah`);
        
        // Mengubah banyak dokumen
        const updateManyResult = await collection.updateMany(
            { age: { $gte: 30 } },
            { $set: { city: "Jakarta", updated_at: new Date() } }
        );
        console.log(`${updateManyResult.modifiedCount} dokumen diubah`);
    } catch (error) {
        console.error('Gagal mengubah dokumen:', error);
    }
}

// Contoh operasi Delete (Hapus Data)
async function deleteData() {
    const db = await connect();
    const collection = db.collection('users');
    
    try {
        // Menghapus satu dokumen
        const deleteOneResult = await collection.deleteOne({ name: "Citra" });
        console.log(`${deleteOneResult.deletedCount} dokumen dihapus`);
        
        // Menghapus banyak dokumen
        const deleteManyResult = await collection.deleteMany({ age: { $gte: 30 } });
        console.log(`${deleteManyResult.deletedCount} dokumen dihapus`);
    } catch (error) {
        console.error('Gagal menghapus dokumen:', error);
    }
}

// Fungsi utama untuk menjalankan semua operasi CRUD
async function main() {
    console.log('--- Menjalankan operasi Create ---');
    await createData();
    
    console.log('\n--- Menjalankan operasi Read ---');
    await readData();
    
    console.log('\n--- Menjalankan operasi Update ---');
    await updateData();
    
    console.log('\n--- Membaca data setelah update ---');
    await readData();
    
    console.log('\n--- Menjalankan operasi Delete ---');
    await deleteData();
    
    console.log('\n--- Membaca data setelah delete ---');
    await readData();
    
    console.log('\nSemua operasi CRUD selesai');
    process.exit(0);
}

// Jalankan program
main().catch(console.error);