const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

const dataPath = path.join(__dirname, 'students.json');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

function getStudents() {
    try {
        const data = fs.readFileSync(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading students.json:", error);
        return [];
    }
}

function saveStudents(data) {
    fs.writeFile(dataPath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error("Error saving data:", err);
        } else {
            console.log("Data saved successfully to students.json");
        }
    });
}


// GET: Mendapatkan daftar mahasiswa
app.get('/students', (req, res) => {
    res.json(getStudents());
});

// GET: Mendapatkan data mahasiswa berdasarkan NIM
app.get('/students/:nim', (req, res) => {
    const students = getStudents();
    const student = students.find(s => s.nim === req.params.nim);
    if (student) {
        res.json(student);
    } else {
        res.status(404).json({ message: 'Student not found' });
    }
});

// POST: Menambahkan mahasiswa baru
app.post('/students', (req, res) => {
    console.log("Received POST request:", req.body); // Log data yang diterima

    const students = getStudents();
    const newStudent = req.body;
    students.push(newStudent);

    console.log("Updated student list:", students); // Log array sebelum disimpan

    saveStudents(students);
    res.json(newStudent);
});


// PUT: Mengedit data mahasiswa berdasarkan NIM
app.put('/students/:nim', (req, res) => {
    const students = getStudents();
    const nim = req.params.nim;
    const updatedStudent = req.body;

    const index = students.findIndex(student => student.nim === nim);
    if (index !== -1) {
        students[index] = updatedStudent;
        saveStudents(students);
        res.json(updatedStudent);
    } else {
        res.status(404).json({ message: 'Student not found' });
    }
});

// DELETE: Menghapus data mahasiswa berdasarkan NIM
app.delete('/students/:nim', (req, res) => {
    let students = getStudents();
    students = students.filter(student => student.nim !== req.params.nim);
    saveStudents(students);
    res.json({ message: 'Student deleted' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});