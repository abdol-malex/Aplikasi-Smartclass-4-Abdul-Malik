import {
  getCashTransactions, saveCashTransactions, calculateCashBalance,
  getStudents, getAuditLogs, addAuditLog,
  getTrashItems, saveTrashItems, addToTrash,
  CashTransaction, TrashItem, AuditLog
} from "../utils/storage";

export interface KasState {
  tab: "buku" | "log" | "sampah";
  filterMonth: string; // "" for all, or "2026-07"
  filterType: "all" | "masuk" | "keluar";
  filterStudent: string; // "all" or NISN
  search: string;
  editingId: string | null;
}

export let kasState: KasState = {
  tab: "buku",
  filterMonth: "",
  filterType: "all",
  filterStudent: "all",
  search: "",
  editingId: null,
};

export function setKasState(partial: Partial<KasState>) {
  kasState = { ...kasState, ...partial };
}

export function renderAdminKas(): string {
  const transactions = getCashTransactions();
  const students = getStudents();
  const currentBalance = calculateCashBalance(transactions);
  const auditLogs = getAuditLogs().filter(l => l.module === "kas");
  const trashItems = getTrashItems().filter(t => t.module === "kas");

  // Calculate totals
  let totalMasuk = 0;
  let totalKeluar = 0;
  transactions.forEach(t => {
    if (t.type === "masuk") totalMasuk += t.amount;
    else totalKeluar += t.amount;
  });

  // Extract unique available months (YYYY-MM)
  const availableMonths = Array.from(new Set(transactions.map(t => t.date.substring(0, 7)))).sort().reverse();

  // Apply filters
  let filteredTx = transactions.filter(t => {
    if (kasState.filterMonth && !t.date.startsWith(kasState.filterMonth)) return false;
    if (kasState.filterType !== "all" && t.type !== kasState.filterType) return false;
    if (kasState.filterStudent !== "all") {
      if (t.nisn !== kasState.filterStudent) return false;
    }
    if (kasState.search.trim()) {
      const q = kasState.search.toLowerCase();
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchCat = (t.category || "").toLowerCase().includes(q);
      const matchStudent = (t.studentName || "").toLowerCase().includes(q);
      if (!matchDesc && !matchCat && !matchStudent) return false;
    }
    return true;
  });

  // Sort chronologically for table & running balance calculation
  filteredTx.sort((a, b) => b.date.localeCompare(a.date));

  // Editing transaction
  const editingTx = kasState.editingId ? transactions.find(t => t.id === kasState.editingId) : null;

  return `
    <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-8 space-y-6">
      <!-- Header Banner -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-5 border-b border-slate-100">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-2xl">💰</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900">Arus Kas Kelas 4 SDN Banyurip</h2>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            Pengelolaan dana iuran kas, uang sosial, dan operasional kelas secara terbuka, akurat, dan transparan.
          </p>
        </div>

        <!-- Summary Badges -->
        <div class="flex flex-wrap items-center gap-3">
          <div class="px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <div class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Total Masuk</div>
            <div class="text-sm sm:text-base font-black text-emerald-800 font-mono">+Rp ${totalMasuk.toLocaleString("id-ID")}</div>
          </div>
          <div class="px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-2xl">
            <div class="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Total Keluar</div>
            <div class="text-sm sm:text-base font-black text-rose-800 font-mono">-Rp ${totalKeluar.toLocaleString("id-ID")}</div>
          </div>
          <div class="px-5 py-2.5 ${currentBalance >= 0 ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'} rounded-2xl shadow-sm text-right">
            <div class="text-[10px] font-bold opacity-80 uppercase tracking-wider">Saldo Kas Saat Ini</div>
            <div class="text-lg sm:text-xl font-black font-mono">Rp ${currentBalance.toLocaleString("id-ID")}</div>
          </div>
        </div>
      </div>

      <!-- Navigation Sub-tabs & Action Toolbar -->
      <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div class="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button id="btn-kas-tab-buku" class="px-4 py-2 rounded-xl text-xs font-bold transition ${kasState.tab === 'buku' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            📖 Buku Kas Transaksi
          </button>
          <button id="btn-kas-tab-log" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${kasState.tab === 'log' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            <span>📜</span> Catatan Perubahan
            <span class="px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full text-[10px]">${auditLogs.length}</span>
          </button>
          <button id="btn-kas-tab-sampah" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${kasState.tab === 'sampah' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            <span>🗑️</span> Kotak Sampah
            <span class="px-1.5 py-0.2 ${trashItems.length > 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'} rounded-full text-[10px] font-bold">${trashItems.length}</span>
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button id="btn-print-laporan-kas" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition">
            <span>🖨️</span> Cetak / PDF Laporan Kas
          </button>
        </div>
      </div>

      ${kasState.tab === 'buku' ? renderBukuKasView(students, filteredTx, availableMonths, editingTx, currentBalance, transactions) : ''}
      ${kasState.tab === 'log' ? renderCatatanPerubahanView(auditLogs) : ''}
      ${kasState.tab === 'sampah' ? renderKotakSampahView(trashItems) : ''}
    </div>
  `;
}

function renderBukuKasView(students: any[], filteredTx: CashTransaction[], availableMonths: string[], editingTx: CashTransaction | null | undefined, currentBalance: number, allTransactions: CashTransaction[]): string {
  const isEditing = !!editingTx;

  // Monthly summary breakdown
  const monthlySummaries = availableMonths.map(monthKey => {
    const monthTx = allTransactions.filter(t => t.date.startsWith(monthKey));
    const mMasuk = monthTx.filter(t => t.type === 'masuk').reduce((acc, t) => acc + t.amount, 0);
    const mKeluar = monthTx.filter(t => t.type === 'keluar').reduce((acc, t) => acc + t.amount, 0);
    const mNet = mMasuk - mKeluar;
    return {
      monthKey,
      label: formatMonthYear(monthKey),
      masuk: mMasuk,
      keluar: mKeluar,
      net: mNet,
      count: monthTx.length
    };
  });

  // Calculate filtered totals
  let filteredMasuk = 0;
  let filteredKeluar = 0;
  filteredTx.forEach(t => {
    if (t.type === 'masuk') filteredMasuk += t.amount;
    else filteredKeluar += t.amount;
  });
  const filteredNet = filteredMasuk - filteredKeluar;

  return `
    <!-- Form Tambah / Edit Transaksi -->
    <div class="p-5 rounded-2xl border ${isEditing ? 'bg-amber-50/80 border-amber-300' : 'bg-slate-50 border-slate-200'} space-y-4">
      <div class="flex justify-between items-center">
        <h3 class="font-bold text-sm ${isEditing ? 'text-amber-900' : 'text-slate-800'} flex items-center gap-2">
          <span>${isEditing ? '✏️' : '➕'}</span>
          <span>${isEditing ? `Edit Transaksi Kas (ID: ${editingTx?.id})` : 'Tambah Transaksi Kas Baru'}</span>
        </h3>
        ${isEditing ? `
          <button id="btn-cancel-edit-kas" class="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold">
            Batal Edit ✕
          </button>
        ` : ''}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Tanggal Transaksi *</label>
          <input type="date" id="input-kas-date" value="${editingTx ? editingTx.date : new Date().toISOString().split("T")[0]}" class="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium">
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Jenis Transaksi *</label>
          <select id="select-kas-type" class="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium">
            <option value="masuk" ${editingTx?.type === 'masuk' ? 'selected' : ''}>Pemasukan (+)</option>
            <option value="keluar" ${editingTx?.type === 'keluar' ? 'selected' : ''}>Pengeluaran (-)</option>
          </select>
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Kategori *</label>
          <select id="select-kas-category" class="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium">
            <option value="Iuran Kas" ${editingTx?.category === 'Iuran Kas' ? 'selected' : ''}>Iuran Kas</option>
            <option value="Uang Sosial" ${editingTx?.category === 'Uang Sosial' ? 'selected' : ''}>Uang Sosial / Peduli</option>
            <option value="ATK / Fotokopi" ${editingTx?.category === 'ATK / Fotokopi' ? 'selected' : ''}>ATK / Fotokopi</option>
            <option value="Kegiatan Kelas" ${editingTx?.category === 'Kegiatan Kelas' ? 'selected' : ''}>Kegiatan Kelas / Lomba</option>
            <option value="Lainnya" ${editingTx?.category === 'Lainnya' ? 'selected' : ''}>Lainnya</option>
          </select>
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Siswa Pembayar (Untuk Iuran)</label>
          <select id="select-kas-student" class="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium">
            <option value="">-- Bukan Iuran Pribadi --</option>
            ${students.map(s => `
              <option value="${s.nisn}" ${editingTx?.nisn === s.nisn ? 'selected' : ''}>${s.nama}</option>
            `).join("")}
          </select>
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Nominal (Rp) *</label>
          <input type="number" id="input-kas-amount" value="${editingTx ? editingTx.amount : ''}" placeholder="Contoh: 10000" min="500" step="500" class="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold">
        </div>

        <div class="sm:col-span-2 lg:col-span-6 flex flex-col sm:flex-row gap-3 items-end">
          <div class="flex-1 w-full">
            <label class="block font-semibold text-slate-700 mb-1">Keterangan Transaksi *</label>
            <input type="text" id="input-kas-desc" value="${editingTx ? editingTx.description : ''}" placeholder="Contoh: Iuran kas minggu ke-1 Agustus / Beli spidol kelas" class="w-full p-2.5 bg-white border border-slate-300 rounded-xl">
          </div>
          <button id="${isEditing ? 'btn-save-edit-kas' : 'btn-submit-new-kas'}" class="w-full sm:w-auto px-6 py-2.5 ${isEditing ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-2">
            <span>${isEditing ? '💾 Simpan Perubahan' : '➕ Catat Transaksi'}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Rekap Total Pemasukan, Pengeluaran & Saldo per Bulan -->
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <span>📊</span> Rekapitulasi Kas per Bulan
        </h4>
        <span class="text-[11px] text-slate-400">Total ${monthlySummaries.length} bulan tercatat</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        ${monthlySummaries.map(m => `
          <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between gap-2 transition hover:bg-slate-100/70 ${kasState.filterMonth === m.monthKey ? 'ring-2 ring-emerald-500 bg-emerald-50/40' : ''}">
            <div class="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
              <span class="font-black text-xs text-slate-800">${m.label}</span>
              <span class="text-[10px] font-mono px-2 py-0.5 bg-white border border-slate-200 rounded-full text-slate-600">${m.count} trx</span>
            </div>
            <div class="grid grid-cols-3 gap-1.5 text-center pt-0.5">
              <div class="bg-white p-1.5 rounded-xl border border-emerald-100">
                <div class="text-[9px] font-bold text-emerald-600 uppercase">Masuk</div>
                <div class="text-[11px] font-bold font-mono text-emerald-700 truncate">+${m.masuk.toLocaleString("id-ID")}</div>
              </div>
              <div class="bg-white p-1.5 rounded-xl border border-rose-100">
                <div class="text-[9px] font-bold text-rose-600 uppercase">Keluar</div>
                <div class="text-[11px] font-bold font-mono text-rose-700 truncate">-${m.keluar.toLocaleString("id-ID")}</div>
              </div>
              <div class="bg-white p-1.5 rounded-xl border border-slate-200">
                <div class="text-[9px] font-bold text-slate-500 uppercase">Net Bulan</div>
                <div class="text-[11px] font-black font-mono ${m.net >= 0 ? 'text-emerald-800' : 'text-rose-800'} truncate">Rp ${m.net.toLocaleString("id-ID")}</div>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div>
          <label class="block font-semibold text-slate-600 mb-1">Filter Periode Bulan</label>
          <select id="filter-kas-month" class="w-full p-2 bg-white border border-slate-300 rounded-xl">
            <option value="">Semua Periode (${availableMonths.length} bulan)</option>
            ${availableMonths.map(m => `
              <option value="${m}" ${kasState.filterMonth === m ? 'selected' : ''}>Bulan ${formatMonthYear(m)}</option>
            `).join("")}
          </select>
        </div>

        <div>
          <label class="block font-semibold text-slate-600 mb-1">Filter Jenis</label>
          <select id="filter-kas-type" class="w-full p-2 bg-white border border-slate-300 rounded-xl">
            <option value="all" ${kasState.filterType === 'all' ? 'selected' : ''}>Semua Transaksi</option>
            <option value="masuk" ${kasState.filterType === 'masuk' ? 'selected' : ''}>Pemasukan Saja (+)</option>
            <option value="keluar" ${kasState.filterType === 'keluar' ? 'selected' : ''}>Pengeluaran Saja (-)</option>
          </select>
        </div>

        <div>
          <label class="block font-semibold text-slate-600 mb-1">Filter Siswa</label>
          <select id="filter-kas-student" class="w-full p-2 bg-white border border-slate-300 rounded-xl">
            <option value="all" ${kasState.filterStudent === 'all' ? 'selected' : ''}>Semua Siswa</option>
            ${students.map(s => `
              <option value="${s.nisn}" ${kasState.filterStudent === s.nisn ? 'selected' : ''}>${s.nama}</option>
            `).join("")}
          </select>
        </div>

        <div>
          <label class="block font-semibold text-slate-600 mb-1">Cari Keterangan / Kategori</label>
          <div class="relative">
            <input type="text" id="input-kas-search" value="${kasState.search}" placeholder="Ketik kata kunci..." class="w-full p-2 pr-8 bg-white border border-slate-300 rounded-xl">
            ${kasState.search ? `
              <button id="btn-clear-kas-search" class="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 font-bold">✕</button>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- Rekap Filter Aktif -->
      <div class="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div class="text-slate-500 font-medium">
          Menampilkan <strong class="text-slate-800">${filteredTx.length}</strong> transaksi ${kasState.filterMonth ? `di bulan <strong>${formatMonthYear(kasState.filterMonth)}</strong>` : '(semua bulan)'}
        </div>
        <div class="flex items-center gap-3">
          <span class="text-emerald-700 font-mono font-bold">Masuk: +Rp ${filteredMasuk.toLocaleString("id-ID")}</span>
          <span class="text-slate-300">|</span>
          <span class="text-rose-600 font-mono font-bold">Keluar: -Rp ${filteredKeluar.toLocaleString("id-ID")}</span>
          <span class="text-slate-300">|</span>
          <span class="px-2.5 py-0.5 rounded-lg font-mono font-black ${filteredNet >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
            Net: Rp ${filteredNet.toLocaleString("id-ID")}
          </span>
        </div>
      </div>
    </div>

    <!-- Tabel Daftar Transaksi Kas -->
    <div class="overflow-x-auto rounded-2xl border border-slate-200">
      <table class="w-full text-left border-collapse text-xs">
        <thead>
          <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
            <th class="py-3 px-3.5 text-center w-12">No</th>
            <th class="py-3 px-3.5 w-28">Tanggal</th>
            <th class="py-3 px-3.5 w-32">Kategori</th>
            <th class="py-3 px-3.5">Keterangan Transaksi</th>
            <th class="py-3 px-3.5 text-right w-32">Pemasukan</th>
            <th class="py-3 px-3.5 text-right w-32">Pengeluaran</th>
            <th class="py-3 px-3.5 text-center w-28">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-slate-700">
          ${filteredTx.length === 0 ? `
            <tr>
              <td colspan="7" class="py-10 text-center text-slate-400 italic">
                Tidak ada transaksi kas yang sesuai dengan filter atau kata kunci pencarian.
              </td>
            </tr>
          ` : filteredTx.map((t, idx) => `
            <tr class="hover:bg-slate-50/80 transition ${editingTx?.id === t.id ? 'bg-amber-50/60' : ''}">
              <td class="py-3 px-3.5 text-center font-bold text-slate-400">${idx + 1}</td>
              <td class="py-3 px-3.5 font-mono text-slate-600">${t.date}</td>
              <td class="py-3 px-3.5">
                <span class="px-2 py-0.5 rounded-md text-[11px] font-semibold ${getCategoryBadgeClass(t.category)}">
                  ${t.category || (t.type === 'masuk' ? 'Pemasukan' : 'Pengeluaran')}
                </span>
              </td>
              <td class="py-3 px-3.5">
                <div class="font-medium text-slate-900">${t.description}</div>
                ${t.studentName ? `
                  <div class="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                    <span>👤</span> Pembayar: ${t.studentName}
                  </div>
                ` : ''}
              </td>
              <td class="py-3 px-3.5 text-right font-mono font-bold text-emerald-700">
                ${t.type === 'masuk' ? `+ Rp ${t.amount.toLocaleString("id-ID")}` : '-'}
              </td>
              <td class="py-3 px-3.5 text-right font-mono font-bold text-rose-600">
                ${t.type === 'keluar' ? `- Rp ${t.amount.toLocaleString("id-ID")}` : '-'}
              </td>
              <td class="py-3 px-3.5 text-center">
                <div class="inline-flex items-center gap-1">
                  <button type="button" id="btn-edit-kas-${t.id}" data-module="kas" data-aksi="edit" data-id="${t.id}" class="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold transition cursor-pointer" title="Edit transaksi">
                    ✏️ Edit
                  </button>
                  <button type="button" id="btn-del-kas-${t.id}" data-module="kas" data-aksi="hapus" data-id="${t.id}" class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition cursor-pointer" title="Hapus transaksi (masuk ke sampah)">
                    🗑️ Hapus
                  </button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderCatatanPerubahanView(logs: AuditLog[]): string {
  return `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
            <span>📜</span> Catatan Perubahan & Riwayat Audit Kas
          </h3>
          <p class="text-xs text-slate-500">Mencatat setiap aksi penambahan, perubahan (edit), penghapusan, dan pemulihan transaksi.</p>
        </div>
      </div>

      <div class="overflow-x-auto rounded-2xl border border-slate-200">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th class="py-3 px-3.5 w-40">Waktu</th>
              <th class="py-3 px-3.5 w-28">Aksi</th>
              <th class="py-3 px-3.5">Ringkasan Perubahan</th>
              <th class="py-3 px-3.5 w-44">Sebelum</th>
              <th class="py-3 px-3.5 w-44">Sesudah</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            ${logs.length === 0 ? `
              <tr>
                <td colspan="5" class="py-8 text-center text-slate-400 italic">Belum ada catatan perubahan transaksi kas.</td>
              </tr>
            ` : logs.map(l => `
              <tr class="hover:bg-slate-50/70">
                <td class="py-3 px-3.5 font-mono text-slate-500">${l.timestamp}</td>
                <td class="py-3 px-3.5">
                  <span class="px-2 py-0.5 rounded text-[11px] font-bold ${getAuditActionBadge(l.action)}">
                    ${l.action.toUpperCase()}
                  </span>
                </td>
                <td class="py-3 px-3.5 font-medium text-slate-800">${l.summary}</td>
                <td class="py-3 px-3.5 font-mono text-[11px] text-slate-500">${l.before ? formatDetailJSON(l.before) : '-'}</td>
                <td class="py-3 px-3.5 font-mono text-[11px] text-slate-800 font-semibold">${l.after ? formatDetailJSON(l.after) : '-'}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderKotakSampahView(trashList: TrashItem[]): string {
  return `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
            <span>🗑️</span> Kotak Sampah Transaksi Kas
          </h3>
          <p class="text-xs text-slate-500">Transaksi yang dihapus tersimpan di sini. Anda dapat memulihkannya kembali atau menghapusnya secara permanen.</p>
        </div>
      </div>

      <div class="overflow-x-auto rounded-2xl border border-slate-200">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th class="py-3 px-3.5 w-36">Dihapus Pada</th>
              <th class="py-3 px-3.5 w-24">Tanggal Asli</th>
              <th class="py-3 px-3.5 w-24">Jenis</th>
              <th class="py-3 px-3.5">Keterangan Transaksi</th>
              <th class="py-3 px-3.5 text-right w-32">Nominal</th>
              <th class="py-3 px-3.5 text-center w-40">Tindakan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            ${trashList.length === 0 ? `
              <tr>
                <td colspan="6" class="py-8 text-center text-slate-400 italic">Kotak sampah kas kosong bersih. Tidak ada transaksi terhapus.</td>
              </tr>
            ` : trashList.map(t => {
              const item = t.item as CashTransaction;
              return `
                <tr class="hover:bg-slate-50/70">
                  <td class="py-3 px-3.5 font-mono text-slate-500">${t.deletedAt}</td>
                  <td class="py-3 px-3.5 font-mono">${item.date}</td>
                  <td class="py-3 px-3.5">
                    <span class="px-2 py-0.5 rounded text-[11px] font-semibold ${item.type === 'masuk' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                      ${item.type === 'masuk' ? 'Pemasukan' : 'Pengeluaran'}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 font-medium text-slate-800">
                    <div>${item.description}</div>
                    ${item.studentName ? `<span class="text-[10px] text-slate-500">Siswa: ${item.studentName}</span>` : ''}
                  </td>
                  <td class="py-3 px-3.5 text-right font-mono font-bold ${item.type === 'masuk' ? 'text-emerald-700' : 'text-rose-600'}">
                    Rp ${item.amount.toLocaleString("id-ID")}
                  </td>
                  <td class="py-3 px-3.5 text-center">
                    <div class="inline-flex items-center gap-1.5">
                      <button type="button" id="btn-restore-kas-${t.id}" data-module="kas" data-aksi="pulihkan" data-id="${t.id}" class="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-bold transition cursor-pointer" title="Pulihkan transaksi kas">
                        ♻️ Pulihkan
                      </button>
                      <button type="button" id="btn-perm-del-kas-${t.id}" data-module="kas" data-aksi="hapus_permanen" data-id="${t.id}" class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-lg font-bold transition cursor-pointer" title="Hapus permanen dari sampah">
                        ❌ Hapus Permanen
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

function formatMonthYear(ym: string): string {
  const parts = ym.split("-");
  if (parts.length < 2) return ym;
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const mIdx = parseInt(parts[1], 10) - 1;
  return `${monthNames[mIdx] || parts[1]} ${parts[0]}`;
}

function getCategoryBadgeClass(category?: string): string {
  switch (category) {
    case "Iuran Kas": return "bg-emerald-100 text-emerald-800 border border-emerald-200";
    case "Uang Sosial": return "bg-sky-100 text-sky-800 border border-sky-200";
    case "ATK / Fotokopi": return "bg-amber-100 text-amber-800 border border-amber-200";
    case "Kegiatan Kelas": return "bg-purple-100 text-purple-800 border border-purple-200";
    default: return "bg-slate-100 text-slate-700 border border-slate-200";
  }
}

function getAuditActionBadge(action: string): string {
  switch (action) {
    case "tambah": return "bg-emerald-100 text-emerald-800";
    case "edit": return "bg-amber-100 text-amber-800";
    case "hapus": return "bg-rose-100 text-rose-800";
    case "pulihkan": return "bg-teal-100 text-teal-800";
    case "hapus_permanen": return "bg-gray-200 text-gray-800";
    default: return "bg-slate-100 text-slate-700";
  }
}

function formatDetailJSON(obj: any): string {
  if (!obj) return "-";
  if (typeof obj === "string") return obj;
  return `Rp ${obj.amount ? obj.amount.toLocaleString("id-ID") : 0} • ${obj.description || obj.note || '-'}`;
}
