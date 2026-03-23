import fs from "fs";
import path from "path";

const dirPath = "app"; // Directory to search
const dictionary: Record<string, string> = {
  // Common UI Actions
  "Tambah ": "Add ",
  Simpan: "Save",
  Batal: "Cancel",
  Ubah: "Edit",
  Hapus: "Delete",
  Kembali: "Back",
  Cari: "Search",
  Pencarian: "Search",
  Detail: "Details",
  Tugas: "Task",
  Aksi: "Actions",
  Memuat: "Loading",
  Tutup: "Close",
  Keluar: "Logout",
  Masuk: "Login",
  Daftar: "List",
  "Pilih ": "Select ",
  Gagal: "Failed",
  Berhasil: "Success",

  // Data / Tables
  "Waktu Pembuatan": "Created At",
  "Waktu Diubah": "Updated At",
  Dibuat: "Created",
  Diubah: "Updated",
  Status: "Status",
  Aktif: "Active",
  "Tidak Aktif": "Inactive",
  Ya: "Yes",
  Tidak: "No",
  Keterangan: "Description",
  Deskripsi: "Description",
  Catatan: "Notes",
  Nomor: "Number",
  Tanggal: "Date",

  // Specific phrases
  "Nama wajib diisi": "Name is required",
  "wajib diisi": "is required",
  "wajib dipilih": "is required",
  wajib: "required",
  "tidak valid": "invalid",
  "minimal 8 karakter": "minimum 8 characters",
  "Format email tidak valid": "Invalid email format",
  "Password dan Konfirmasi Password tidak cocok": "Password and Confirm Password do not match",
  "Gagal membuat": "Failed to create",
  "Terjadi kesalahan sistem": "A system error occurred",
  "Buat akun user baru": "Create a new user account",
  "Nama lengkap": "Full name",
  "Konfirmasi Password": "Confirm Password",
  Password: "Password",

  // Navigation / Master Data
  Pengguna: "Users",
  Peran: "Roles",
  Pengaturan: "Settings",
  Keuangan: "Finance",
  Operasional: "Operations",
  Perusahaan: "Company",
  Pelanggan: "Customer",
  Pemasok: "Vendor",

  // Other isolated words
  Nama: "Name",
  Alamat: "Address",
  Telepon: "Phone",
};

// Sort dictionary by longest keys first to prevent partial word replacement bugs
const sortedKeys = Object.keys(dictionary).sort((a, b) => b.length - a.length);

function walkSync(currentDirPath: string, callback: (filePath: string) => void) {
  fs.readdirSync(currentDirPath).forEach((name) => {
    const filePath = path.join(currentDirPath, name);
    const stat = fs.statSync(filePath);
    if (stat.isFile() && (filePath.endsWith(".vue") || filePath.endsWith(".ts"))) {
      callback(filePath);
    } else if (stat.isDirectory() && name !== "node_modules" && name !== ".nuxt") {
      walkSync(filePath, callback);
    }
  });
}

let modifiedCount = 0;

walkSync(dirPath, (filePath) => {
  let content = fs.readFileSync(filePath, "utf-8");
  let originalContent = content;

  // We want to be careful to mostly replace strings in `<template>` or between quotes in `<script>`
  // But a simple global replace bounded by word boundaries or just exact string match works well for UI.
  // We will do a generic replace but use a regex to ensure "Word boundary" or exact match for short words.

  sortedKeys.forEach((indonesianPhrase) => {
    const englishPhrase = dictionary[indonesianPhrase];
    // Create regex: if word is alphanumeric, add word boundaries
    const isAlphanumeric = /^[a-zA-Z0-9]+$/.test(indonesianPhrase.trim());

    // Some phrases have spaces at the end, etc. Just escape regex
    const escapedPhrase = indonesianPhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    let regexPattern;
    if (isAlphanumeric && indonesianPhrase.length <= 5) {
      // For short single words like 'Ubah', 'Batal', 'Nama', require word boundaries
      regexPattern = new RegExp(`\\b${escapedPhrase}\\b`, "g");
    } else {
      // For longer phrases or phrases with spaces "Tambah ", just globally replace
      regexPattern = new RegExp(escapedPhrase, "g");
    }

    content = content.replace(regexPattern, englishPhrase);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, "utf-8");
    modifiedCount++;
    console.log(`Updated ${filePath}`);
  }
});

console.log(`\nTranslation complete. Modified ${modifiedCount} files.`);
