# MongoDB Tutorial

MongoDB adalah sebuah database NoSQL yang bersifat open-source dan document-oriented. Berbeda dari database relasional yang menggunakan tabel, MongoDB menyimpan data dalam format BSON (Binary JSON) yang fleksibel dan cocok digunakan untuk big data maupun aplikasi web real-time.

## Instalasi MongoDB di Ubuntu

### 1. Menambahkan Public Key MongoDB

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
```

### 2. Menambahkan Repository MongoDB

```bash
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```

### 3. Update Paket dan Install MongoDB

```bash
sudo apt update
sudo apt install -y mongodb-org
```

### 4. Mengatur Layanan MongoDB

- Memulai layanan: `sudo systemctl start mongod`
- Memeriksa status layanan: `sudo systemctl status mongod`
- Mengaktifkan auto-start: `sudo systemctl enable mongod`
- Menghentikan layanan: `sudo systemctl stop mongod`

## Mengakses MongoDB

Masuk ke MongoDB Shell:

```bash
mongosh --host localhost --port 27017
```

Secara default, MongoDB berjalan pada localhost dan port 27017.

## Operasi Dasar MongoDB

### Membuat/Memilih Database

```javascript
use nama_database
```

### Membuat Collection

```javascript
db.createCollection("users")
```

### Operasi Create (Tambah Data)

```javascript
// Menambahkan satu dokumen
db.users.insertOne({ name: "Andi", age: 25 });

// Menambahkan banyak dokumen
db.users.insertMany([
  { name: "Budi", age: 30 },
  { name: "Citra", age: 28 }
]);
```

### Operasi Read (Baca Data)

```javascript
// Membaca semua data
db.users.find().pretty();

// Membaca dengan filter
db.users.find({ age: 30 });
```

### Operasi Update (Ubah Data)

```javascript
// Mengubah satu dokumen
db.users.updateOne({ name: "Andi" }, { $set: { age: 26 } });

// Mengubah banyak dokumen
db.users.updateMany({ age: 30 }, { $set: { city: "Jakarta" } });
```

### Operasi Delete (Hapus Data)

```javascript
// Menghapus satu dokumen
db.users.deleteOne({ name: "Citra" });

// Menghapus banyak dokumen
db.users.deleteMany({ age: { $gte: 30 } });

// Menghapus collection
db.users.drop();

// Menghapus database
db.dropDatabase();
```

## Referensi Lainnya

- [MongoDB Manual](https://docs.mongodb.com/)
- [MongoDB Compass](https://www.mongodb.com/products/compass) (GUI untuk MongoDB)
- [MongoDB pada GitLab](https://gitlab.com/mongodb)

---
*Materi ini disusun berdasarkan pertemuan ke-5 pembelajaran MongoDB dan cocok untuk pemula yang ingin memahami dasar penggunaan database NoSQL secara praktis dan terstruktur.*# monggo_db
