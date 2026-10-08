import { getInventaris, saveInventaris, InventarisItem } from "../utils/storage";

export interface InventarisState {
  search: string;
  filterKategori: string;
  filterKondisi: string;
  editingId: string | null;
}

export let inventarisState: InventarisState = {
  search: "",
  filterKategori: "ALL",
  filterKondisi: "ALL",
  editingId: null,
};

export function setInventarisState(partial: Partial<InventarisState>): void {
  inventarisState = { ...inventarisState, ...partial };
}

// 1. FUNGSI HAPUS GLOBAL & MODAL FALLBACK
function showInAppConfirmHapusInventaris(id: string, namaBarang?: string) {
  const existing = document.getElementById("modal-confirm-hapus-inventaris");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "modal-confirm-hapus-inventaris";
  modal.className = "fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in";
  modal.innerHTML = `
    <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 text-center transform transition-all">
      <div class="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto mb-3 text-2xl shadow-sm">
        🗑️
      </div>
      <h3 class="text-base font-bold text-slate-800 mb-1">Hapus Barang Inventaris?</h3>
      <p class="text-xs text-slate-600 mb-5 leading-relaxed">
        Apakah Anda yakin ingin menghapus <strong>${namaBarang ? escapeHtml(namaBarang) : 'barang ini'}</strong> dari daftar inventaris sarana & prasarana kelas 4?
      </p>
      <div class="flex items-center justify-center gap-2.5">
        <button type="button" id="btn-batal-hapus-inv" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer">
          Batal
        </button>
        <button type="button" id="btn-eksekusi-hapus-inv" class="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer">
          🗑️ Ya, Hapus
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector("#btn-batal-hapus-inv")?.addEventListener("click", () => modal.remove());
  modal.querySelector("#btn-eksekusi-hapus-inv")?.addEventListener("click", () => {
    modal.remove();
    eksekusiHapusInventaris(id);
  });
}

function eksekusiHapusInventaris(id: string) {
  let raw = localStorage.getItem('smartclass_inventaris');
  let data: any[] = [];
  try {
    data = raw ? JSON.parse(raw) : [];
  } catch {
    data = [];
  }
  if (!Array.isArray(data) || data.length === 0) {
    data = getInventaris();
  }
  data = data.filter((item: any) => String(item.id) !== String(id));
  localStorage.setItem('smartclass_inventaris', JSON.stringify(data));
  if (typeof (window as any).renderApp === 'function') {
    (window as any).renderApp();
  } else {
    location.reload();
  }
}

(window as any).hapusBarangInventaris = function(id: string) {
  if (!id) return;

  let raw = localStorage.getItem('smartclass_inventaris');
  let items = raw ? JSON.parse(raw) : getInventaris();
  const targetItem = Array.isArray(items) ? items.find((i: any) => String(i.id) === String(id)) : null;
  const nama = targetItem ? targetItem.namaBarang : "";

  // Cek apakah dialog konfirmasi browser dapat dibuka
  const start = performance.now();
  let userConfirmed = false;
  try {
    userConfirmed = confirm("Apakah Anda yakin ingin menghapus barang ini?");
  } catch {
    userConfirmed = false;
  }
  const elapsed = performance.now() - start;

  if (userConfirmed) {
    eksekusiHapusInventaris(id);
    return;
  }

  // Jika pengguna secara sadar menekan Batal (butuh waktu interaksi > 80ms)
  if (!userConfirmed && elapsed >= 80) {
    return;
  }

  // Jika confirm diblokir oleh sandbox iframe (kembali false secara instan < 80ms), tampilkan modal konfirmasi in-app
  showInAppConfirmHapusInventaris(id, nama);
};

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderAdminInventaris(): string {
  const items = getInventaris();
  const searchLower = inventarisState.search.trim().toLowerCase();

  // Categories list for filter dropdown
  const allCategories = Array.from(new Set(items.map((i) => i.kodeKategori))).sort();

  // Filtered items
  const filteredItems = items.filter((item) => {
    // Condition filter
    if (inventarisState.filterKondisi !== "ALL" && item.kondisi !== inventarisState.filterKondisi) {
      return false;
    }
    // Category filter
    if (inventarisState.filterKategori !== "ALL" && item.kodeKategori !== inventarisState.filterKategori) {
      return false;
    }
    // Search text filter
    if (searchLower) {
      const matchName = item.namaBarang.toLowerCase().includes(searchLower);
      const matchCategory = item.kodeKategori.toLowerCase().includes(searchLower);
      const matchDesc = item.keterangan.toLowerCase().includes(searchLower);
      if (!matchName && !matchCategory && !matchDesc) {
        return false;
      }
    }
    return true;
  });

  // Calculate stats
  const totalItems = items.length;
  const totalQuantity = items.reduce((sum, i) => sum + (Number(i.jumlah) || 0), 0);
  const goodConditionCount = items.filter((i) => i.kondisi === "Baik").length;
  const lightDamageCount = items.filter((i) => i.kondisi === "Rusak Ringan").length;
  const heavyDamageCount = items.filter((i) => i.kondisi === "Rusak Berat").length;

  // Editing item if in edit mode
  const editingItem = inventarisState.editingId
    ? items.find((i) => i.id === inventarisState.editingId)
    : null;

  const todayStr = new Date().toISOString().split("T")[0];

  return `
    <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-8 animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold mb-2">
            <span>📦</span> Administrasi Fasilitas Kelas
          </div>
          <h2 class="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Inventaris Sarana & Prasarana Kelas 4
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            Pencatatan aset, sarana belajar, perangkat elektronik, dan kondisi barang SDN Banyurip
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            id="btn-print-inventaris"
            class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Cetak Daftar Inventaris"
          >
            <span>🖨️</span> Cetak Laporan
          </button>
          <button
            type="button"
            id="btn-inventaris-export-excel"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Export Seluruh Data ke Excel (.xlsx)"
          >
            <span>📥</span> Export Excel
          </button>
        </div>
      </div>

      <!-- Quick Summary Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-1">
          <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Jenis Barang</div>
          <div class="text-2xl font-black text-slate-800 font-mono">${totalItems}</div>
          <div class="text-[10px] text-slate-400">Total Macam Aset</div>
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center space-y-1">
          <div class="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Total Kuantitas</div>
          <div class="text-2xl font-black text-blue-800 font-mono">${totalQuantity}</div>
          <div class="text-[10px] text-blue-600">Total Unit / Pcs</div>
        </div>

        <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-1">
          <div class="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Kondisi Baik</div>
          <div class="text-2xl font-black text-emerald-800 font-mono">${goodConditionCount}</div>
          <div class="text-[10px] text-emerald-600">Siap Dipakai</div>
        </div>

        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center space-y-1">
          <div class="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Rusak Ringan</div>
          <div class="text-2xl font-black text-amber-800 font-mono">${lightDamageCount}</div>
          <div class="text-[10px] text-amber-600">Perlu Servis / Perbaikan</div>
        </div>

        <div class="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center space-y-1">
          <div class="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Rusak Berat</div>
          <div class="text-2xl font-black text-rose-800 font-mono">${heavyDamageCount}</div>
          <div class="text-[10px] text-rose-600">Perlu Ganti / Afkir</div>
        </div>
      </div>

      <!-- Form Input / Edit Barang -->
      <div class="rounded-2xl border ${editingItem ? 'border-amber-400 bg-amber-50/40' : 'border-slate-200 bg-slate-50/70'} p-5 sm:p-6 space-y-4 transition">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-lg">${editingItem ? '✏️' : '➕'}</span>
            <h3 class="font-bold text-sm sm:text-base text-slate-800">
              ${editingItem ? `Edit Inventaris: ${escapeHtml(editingItem.namaBarang)}` : 'Tambah Barang Inventaris Baru'}
            </h3>
          </div>
          ${editingItem ? `
            <button
              type="button"
              id="btn-cancel-edit-inventaris"
              class="px-3 py-1 bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              ✕ Batal Edit
            </button>
          ` : ''}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          <!-- Nama Barang -->
          <div class="sm:col-span-2">
            <label class="block font-bold text-slate-700 mb-1">Nama Barang *</label>
            <input
              type="text"
              id="inv-input-nama"
              value="${editingItem ? escapeHtml(editingItem.namaBarang) : ''}"
              placeholder="Contoh: Papan Tulis Whiteboard 120x240"
              class="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <!-- Kode / Kategori -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">Kode / Kategori *</label>
            <input
              type="text"
              id="inv-input-kategori"
              value="${editingItem ? escapeHtml(editingItem.kodeKategori) : ''}"
              placeholder="MEBELEIR / ELEKTRONIK / ATK"
              list="list-kategori-inventaris"
              class="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <datalist id="list-kategori-inventaris">
              <option value="MEBELEIR">Mebeleir (Meja, Kursi, Lemari)</option>
              <option value="ELEKTRONIK">Elektronik (Proyektor, Kipas, Speaker)</option>
              <option value="ALAT PERAGA">Alat Peraga & Media Pembelajaran</option>
              <option value="PERLENGKAPAN">Perlengkapan Kelas & Dinding</option>
              <option value="BUKU & LITERASI">Buku & Pojok Baca</option>
              <option value="OLAHRAGA">Alat Olahraga</option>
              <option value="ATK">Alat Tulis Kantor & Kertas</option>
              <option value="KEBERSIHAN">Kebersihan & Sanitasi</option>
              <option value="LAINNYA">Lainnya</option>
            </datalist>
          </div>

          <!-- Jumlah & Satuan -->
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Jumlah *</label>
              <input
                type="number"
                id="inv-input-jumlah"
                value="${editingItem ? editingItem.jumlah : '1'}"
                min="1"
                class="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Satuan</label>
              <select
                id="inv-select-satuan"
                class="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                ${["Unit", "Buah", "Set", "Pcs", "Paket", "Lembar"].map(
                  (st) => `<option value="${st}" ${editingItem?.satuan === st ? "selected" : ""}>${st}</option>`
                ).join("")}
              </select>
            </div>
          </div>

          <!-- Kondisi -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">Kondisi Barang *</label>
            <select
              id="inv-select-kondisi"
              class="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Baik" ${editingItem?.kondisi === "Baik" ? "selected" : ""}>✅ Baik (Siap Pakai)</option>
              <option value="Rusak Ringan" ${editingItem?.kondisi === "Rusak Ringan" ? "selected" : ""}>⚠️ Rusak Ringan</option>
              <option value="Rusak Berat" ${editingItem?.kondisi === "Rusak Berat" ? "selected" : ""}>❌ Rusak Berat</option>
            </select>
          </div>

          <!-- Tanggal Masuk -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">Tanggal Masuk *</label>
            <input
              type="date"
              id="inv-input-tanggal"
              value="${editingItem ? editingItem.tanggalMasuk : todayStr}"
              class="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <!-- Keterangan -->
          <div class="sm:col-span-2">
            <label class="block font-bold text-slate-700 mb-1">Keterangan / Lokasi</label>
            <input
              type="text"
              id="inv-input-keterangan"
              value="${editingItem ? escapeHtml(editingItem.keterangan) : ''}"
              placeholder="Contoh: Hibah sekolah, disimpan di pojok kelas sebelah barat"
              class="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div class="pt-2 flex justify-end gap-2.5">
          ${editingItem ? `
            <button
              type="button"
              id="btn-cancel-edit-inventaris-bottom"
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Batal
            </button>
          ` : ''}
          <button
            type="button"
            id="btn-save-inventaris"
            class="px-5 py-2.5 ${editingItem ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>💾</span>
            <span>${editingItem ? 'Simpan Perubahan Barang' : 'Simpan Barang Baru'}</span>
          </button>
        </div>
      </div>

      <!-- Filter & Search Toolbar -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div class="flex-1 relative">
          <span class="absolute left-3 top-2.5 text-slate-400">🔍</span>
          <input
            type="text"
            id="inv-search-input"
            value="${escapeHtml(inventarisState.search)}"
            placeholder="Cari nama barang, kode kategori, atau keterangan..."
            class="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          ${inventarisState.search ? `
            <button
              type="button"
              id="btn-clear-search-inventaris"
              class="absolute right-3 top-2 text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
            >
              ✕
            </button>
          ` : ''}
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <!-- Filter Kategori -->
          <div class="flex items-center gap-1.5">
            <label class="font-bold text-slate-600 text-[11px]">Kategori:</label>
            <select
              id="inv-filter-kategori"
              class="py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">Semua Kategori (${items.length})</option>
              ${allCategories.map(
                (c) => `<option value="${c}" ${inventarisState.filterKategori === c ? "selected" : ""}>${c}</option>`
              ).join("")}
            </select>
          </div>

          <!-- Filter Kondisi -->
          <div class="flex items-center gap-1.5">
            <label class="font-bold text-slate-600 text-[11px]">Kondisi:</label>
            <select
              id="inv-filter-kondisi"
              class="py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">Semua Kondisi</option>
              <option value="Baik" ${inventarisState.filterKondisi === "Baik" ? "selected" : ""}>✅ Baik</option>
              <option value="Rusak Ringan" ${inventarisState.filterKondisi === "Rusak Ringan" ? "selected" : ""}>⚠️ Rusak Ringan</option>
              <option value="Rusak Berat" ${inventarisState.filterKondisi === "Rusak Berat" ? "selected" : ""}>❌ Rusak Berat</option>
            </select>
          </div>

          <!-- Reset Filter -->
          ${inventarisState.filterKondisi !== "ALL" || inventarisState.filterKategori !== "ALL" || inventarisState.search ? `
            <button
              type="button"
              id="btn-reset-filters-inventaris"
              class="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              🔄 Reset
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Table Section -->
      <div class="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
        <table id="table-inventaris" class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
              <th class="py-3 px-3 text-center w-12">No</th>
              <th class="py-3 px-3 w-28">Kode / Kategori</th>
              <th class="py-3 px-3">Nama Barang</th>
              <th class="py-3 px-3 text-center w-20">Jumlah</th>
              <th class="py-3 px-3 text-center w-28">Kondisi</th>
              <th class="py-3 px-3 w-28">Tgl Masuk</th>
              <th class="py-3 px-3">Keterangan</th>
              <th class="py-3 px-3 text-center w-24">Aksi</th>
            </tr>
          </thead>
          <tbody id="table-inventaris-body" class="divide-y divide-slate-100 text-slate-700">
            ${filteredItems.length === 0 ? `
              <tr>
                <td colspan="8" class="py-8 text-center text-slate-400">
                  <div class="text-3xl mb-1">📦</div>
                  <div class="font-bold">Tidak ada barang inventaris yang sesuai filter.</div>
                  <div class="text-[11px] mt-0.5">Coba ubah kata kunci pencarian atau reset filter.</div>
                </td>
              </tr>
            ` : filteredItems.map((item, idx) => {
              const conditionBadge = item.kondisi === "Baik"
                ? `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">✅ Baik</span>`
                : item.kondisi === "Rusak Ringan"
                ? `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">⚠️ Rusak Ringan</span>`
                : `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">❌ Rusak Berat</span>`;

              const isEditing = inventarisState.editingId === item.id;

              return `
                <tr class="hover:bg-slate-50/80 transition ${isEditing ? 'bg-amber-50/50' : ''}">
                  <td class="py-3 px-3 text-center font-bold text-slate-500">${idx + 1}</td>
                  <td class="py-3 px-3 font-mono font-bold text-slate-800">
                    <span class="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-[10px]">
                      ${escapeHtml(item.kodeKategori)}
                    </span>
                  </td>
                  <td class="py-3 px-3 font-bold text-slate-900">
                    ${escapeHtml(item.namaBarang)}
                  </td>
                  <td class="py-3 px-3 text-center font-mono font-black text-slate-800">
                    ${item.jumlah} <span class="text-[10px] font-normal text-slate-500">${item.satuan || 'Unit'}</span>
                  </td>
                  <td class="py-3 px-3 text-center">
                    ${conditionBadge}
                  </td>
                  <td class="py-3 px-3 font-mono text-[11px] text-slate-600">
                    ${item.tanggalMasuk || '-'}
                  </td>
                  <td class="py-3 px-3 text-slate-600 leading-relaxed">
                    ${escapeHtml(item.keterangan || '-')}
                  </td>
                  <td class="py-3 px-3 text-center">
                    <div class="inline-flex items-center gap-1">
                      <button
                        type="button"
                        id="btn-edit-inventaris-${item.id}"
                        data-id="${item.id}"
                        class="btn-edit-inventaris p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-xs transition cursor-pointer"
                        title="Edit Data Barang"
                        onclick="window.editInventarisItem && window.editInventarisItem('${item.id}', event)"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        class="btn-hapus-inventaris p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs transition cursor-pointer"
                        data-id="${item.id}"
                        title="Hapus Barang"
                        onclick="window.hapusBarangInventaris('${item.id}')"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
