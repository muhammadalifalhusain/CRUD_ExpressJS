const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;
const dataFile = "./data.json";

app.use(express.json());
app.use(express.static("public"));

// Fungsi untuk membaca data mahasiswa dari file JSON
function readData() {
    try {
        const data = fs.readFileSync(dataFile, "utf-8");
        console.log("Reading data from file:", data); // Log isi file
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Error reading data.json:", error.message);
        return [];
    }
}

function writeData(data) {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf-8');
        console.log("Data berhasil ditulis ke file.");
    } catch (error) {
        console.error("Gagal menulis data ke file:", error.message);
    }
}


// Endpoint GET untuk mendapatkan semua data mahasiswa
app.get("/mahasiswa", (req, res) => {
    const data = readData();
    res.json(data);
});

// Endpoint POST untuk menambahkan data mahasiswa baru
app.post("/mahasiswa", (req, res) => {
    try {
        const data = readData();
        const { nama, nim, ipk } = req.body;

        if (!nama || !nim || !ipk) {
            return res.status(400).json({ error: "Nama, NIM, dan IPK harus diisi" });
        }

        const newMahasiswa = { nama, nim, ipk };
        data.push(newMahasiswa);
        writeData(data);
        res.status(201).json(newMahasiswa);
    } catch (error) {
        console.error("Error adding mahasiswa:", error.message);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
});

// Endpoint PUT untuk mengedit data mahasiswa berdasarkan NIM
app.put("/mahasiswa/:nim", (req, res) => {
    const data = readData();
    const mahasiswaIndex = data.findIndex((m) => m.nim === req.params.nim);

    if (mahasiswaIndex !== -1) {
        data[mahasiswaIndex] = {...data[mahasiswaIndex], ...req.body };
        writeData(data);
        res.json(data[mahasiswaIndex]);
    } else {
        res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    }
});

// Endpoint DELETE untuk menghapus data mahasiswa berdasarkan NIM
app.delete("/mahasiswa/:nim", (req, res) => {
    let data = readData();
    const newData = data.filter((m) => m.nim !== req.params.nim);

    if (data.length !== newData.length) {
        writeData(newData);
        res.json({ message: "Mahasiswa berhasil dihapus" });
    } else {
        res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan pada http://localhost:${PORT}`);
});