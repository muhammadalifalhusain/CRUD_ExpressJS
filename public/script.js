const apiUrl = "http://localhost:3000/mahasiswa";

// Fungsi untuk memuat data mahasiswa
async function loadMahasiswa() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const mahasiswaList = document.getElementById("mahasiswa-list");
    mahasiswaList.innerHTML = "";

    data.forEach((mahasiswa) => {
        const row = document.createElement("tr");

        row.innerHTML = `
      <td>${mahasiswa.nama}</td>
      <td>${mahasiswa.nim}</td>
      <td>${mahasiswa.ipk}</td>
      <td>
        <button class="edit" onclick="editMahasiswa('${mahasiswa.nim}')">Edit</button>
        <button class="delete" onclick="deleteMahasiswa('${mahasiswa.nim}')">Hapus</button>
      </td>
    `;

        mahasiswaList.appendChild(row);
    });
}

// Fungsi untuk menambahkan data mahasiswa
document.getElementById("form-mahasiswa").addEventListener("submit", async(e) => {
    e.preventDefault();

    const nama = document.getElementById("nama").value;
    const nim = document.getElementById("nim").value;
    const ipk = document.getElementById("ipk").value;

    await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, nim, ipk }),
    });

    document.getElementById("form-mahasiswa").reset();
    loadMahasiswa();
});

// Fungsi untuk mengedit data mahasiswa
async function editMahasiswa(nim) {
    const newNama = prompt("Masukkan nama baru:");
    const newIpk = prompt("Masukkan IPK baru:");

    if (newNama && newIpk) {
        await fetch(`${apiUrl}/${nim}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nama: newNama, ipk: parseFloat(newIpk) }),
        });
        loadMahasiswa();
    }
}

// Fungsi untuk menghapus data mahasiswa
async function deleteMahasiswa(nim) {
    if (confirm("Yakin ingin menghapus mahasiswa ini?")) {
        await fetch(`${apiUrl}/${nim}`, { method: "DELETE" });
        loadMahasiswa();
    }
}

// Muat data mahasiswa saat halaman pertama kali dibuka
loadMahasiswa();