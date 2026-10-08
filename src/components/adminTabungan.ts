import {
  getSavingsTransactions, saveSavingsTransactions,
  getStudents, getAuditLogs, addAuditLog,
  getTrashItems, saveTrashItems, addToTrash,
  calculateStudentSavingsBalance, validateSavingsChronology,
  SavingsTransaction, TrashItem, AuditLog
} from "../utils/storage";

export interface TabunganState {
  tab: "siswa" | "rekap" | "log" | "sampah";
  selectedStudentNisn: string;
  editingId: string | null;
}

export let tabunganState: TabunganState = {
  tab: "siswa",
  selectedStudentNisn: "",
  editingId: null,
};

export function setTabunganState(partial: Partial<TabunganState>) {
  tabunganState = { ...tabunganState, ...partial };
}

export function renderAdminTabungan(): string {
  const students = getStudents();
  if (!tabunganState.selectedStudentNisn && students.length > 0) {
    tabunganState.selectedStudentNisn = students[0].nisn;
  }

  const allTransactions = getSavingsTransactions();
  const auditLogs = getAuditLogs().filter(l => l.module === "tabungan");
  const trashItems = getTrashItems().filter(t => t.module === "tabungan");

  // Calculate balances per student
  const studentBalances: Record<string, { totalSetor: number; totalTarik: number; saldo: number }> = {};
  students.forEach(s => {
    studentBalances[s.nisn] = { totalSetor: 0, totalTarik: 0, saldo: 0 };
  });

  allTransactions.forEach(t => {
    if (studentBalances[t.nisn]) {
      if (t.type === "setor") {
        studentBalances[t.nisn].totalSetor += t.amount;
        studentBalances[t.nisn].saldo += t.amount;
      } else {
        studentBalances[t.nisn].totalTarik += t.amount;
        studentBalances[t.nisn].saldo -= t.amount;
      }
    }
  });

  const totalClassSavings = Object.values(studentBalances).reduce((acc, curr) => acc + curr.saldo, 0);
  const totalClassSetor = Object.values(studentBalances).reduce((acc, curr) => acc + curr.totalSetor, 0);
  const totalClassTarik = Object.values(studentBalances).reduce((acc, curr) => acc + curr.totalTarik, 0);

  const selectedStudent = students.find(s => s.nisn === tabunganState.selectedStudentNisn) || students[0];
  const editingTx = tabunganState.editingId ? allTransactions.find(t => t.id === tabunganState.editingId) : null;

  return `
    <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-8 space-y-6">
      <!-- Header Banner -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-5 border-b border-slate-100">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-2xl">🏦</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900">Buku Tabungan Siswa Kelas 4</h2>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            Membiasakan budaya gemar menabung, mengelola keuangan, dan disiplin finansial sejak dini di SDN Banyurip.
          </p>
        </div>

        <!-- Class Total Badges -->
        <div class="flex flex-wrap items-center gap-3">
          <div class="px-4 py-2 bg-sky-50 border border-sky-200 rounded-2xl">
            <div class="text-[10px] font-bold text-sky-700 uppercase tracking-wider">Total Setoran Kelas</div>
            <div class="text-sm font-black text-sky-800 font-mono">+Rp ${totalClassSetor.toLocaleString("id-ID")}</div>
          </div>
          <div class="px-4 py-2 bg-amber-50 border border-amber-200 rounded-2xl">
            <div class="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Total Penarikan</div>
            <div class="text-sm font-black text-amber-800 font-mono">-Rp ${totalClassTarik.toLocaleString("id-ID")}</div>
          </div>
          <div class="px-5 py-2.5 bg-sky-600 text-white rounded-2xl shadow-sm text-right">
            <div class="text-[10px] font-bold opacity-80 uppercase tracking-wider">Total Saldo Kelas</div>
            <div class="text-lg sm:text-xl font-black font-mono">Rp ${totalClassSavings.toLocaleString("id-ID")}</div>
          </div>
        </div>
      </div>

      <!-- Navigation Sub-tabs -->
      <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div class="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button id="btn-tabungan-tab-siswa" class="px-4 py-2 rounded-xl text-xs font-bold transition ${tabunganState.tab === 'siswa' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            📖 Buku Tabungan per Siswa
          </button>
          <button id="btn-tabungan-tab-rekap" class="px-4 py-2 rounded-xl text-xs font-bold transition ${tabunganState.tab === 'rekap' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            🏫 Rekap Seluruh Kelas (8 Siswa)
          </button>
          <button id="btn-tabungan-tab-log" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${tabunganState.tab === 'log' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            <span>📜</span> Catatan Perubahan
            <span class="px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full text-[10px]">${auditLogs.length}</span>
          </button>
          <button id="btn-tabungan-tab-sampah" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${tabunganState.tab === 'sampah' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            <span>🗑️</span> Kotak Sampah
            <span class="px-1.5 py-0.2 ${trashItems.length > 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'} rounded-full text-[10px] font-bold">${trashItems.length}</span>
          </button>
        </div>

        <div class="flex items-center gap-2">
          ${tabunganState.tab === 'siswa' ? `
            <button id="btn-print-buku-siswa" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition">
              <span>🖨️</span> Cetak Buku Siswa Ini
            </button>
          ` : `
            <button id="btn-print-rekap-tabungan" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition">
              <span>🖨️</span> Cetak Rekap Kelas
            </button>
          `}
        </div>
      </div>

      <!-- Form Setor / Tarik Tabungan -->
      ${renderFormTabungan(students, editingTx, selectedStudent)}

      <!-- Sub-view content -->
      ${tabunganState.tab === 'siswa' ? renderBukuSiswaView(students, allTransactions, selectedStudent, studentBalances) : ''}
      ${tabunganState.tab === 'rekap' ? renderRekapKelasView(students, studentBalances, totalClassSavings, totalClassSetor, totalClassTarik) : ''}
      ${tabunganState.tab === 'log' ? renderCatatanPerubahanTabunganView(auditLogs) : ''}
      ${tabunganState.tab === 'sampah' ? renderKotakSampahTabunganView(trashItems) : ''}
    </div>
  `;
}

function renderFormTabungan(students: any[], editingTx: SavingsTransaction | null | undefined, selectedStudent: any): string {
  const isEditing = !!editingTx;

  return `
    <div class="p-5 rounded-2xl border ${isEditing ? 'bg-amber-50/80 border-amber-300' : 'bg-sky-50/50 border-sky-200'} space-y-4">
      <div class="flex justify-between items-center">
        <h3 class="font-bold text-sm ${isEditing ? 'text-amber-900' : 'text-sky-900'} flex items-center gap-2">
          <span>${isEditing ? '✏️' : '💳'}</span>
          <span>${isEditing ? `Edit Transaksi Tabungan (ID: ${editingTx?.id})` : 'Catat Setor / Tarik Tabungan Siswa'}</span>
        </h3>
        ${isEditing ? `
          <button id="btn-cancel-edit-tabungan" class="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold">
            Batal Edit ✕
          </button>
        ` : ''}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Pilih Siswa *</label>
          <select id="input-tabungan-student" class="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium">
            ${students.map(s => `
              <option value="${s.nisn}" ${((editingTx ? editingTx.nisn : tabunganState.selectedStudentNisn) === s.nisn) ? 'selected' : ''}>
                ${s.no}. ${s.nama} (${s.nisn})
              </option>
            `).join("")}
          </select>
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Tanggal Transaksi *</label>
          <input type="date" id="input-tabungan-date" value="${editingTx ? editingTx.date : new Date().toISOString().split("T")[0]}" class="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium">
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Jenis Transaksi *</label>
          <select id="input-tabungan-type" class="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium">
            <option value="setor" ${editingTx?.type === 'setor' ? 'selected' : ''}>Setoran (+) Masuk</option>
            <option value="tarik" ${editingTx?.type === 'tarik' ? 'selected' : ''}>Penarikan (-) Ambil Uang</option>
          </select>
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Nominal (Rp) *</label>
          <input type="number" id="input-tabungan-amount" value="${editingTx ? editingTx.amount : ''}" placeholder="Contoh: 10000" min="500" step="500" class="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold">
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Catatan / Keterangan</label>
          <input type="text" id="input-tabungan-note" value="${editingTx ? editingTx.note : ''}" placeholder="Contoh: Uang saku sisa / Beli buku gambar" class="w-full p-2.5 bg-white border border-slate-300 rounded-xl">
        </div>
      </div>

      <div class="flex justify-end pt-1">
        <button id="${isEditing ? 'btn-save-edit-tabungan' : 'btn-submit-new-tabungan'}" class="px-6 py-2.5 ${isEditing ? 'bg-amber-600 hover:bg-amber-700' : 'bg-sky-600 hover:bg-sky-700'} text-white font-bold rounded-xl transition shadow-xs flex items-center gap-2 text-xs">
          <span>${isEditing ? '💾 Simpan Perubahan Tabungan' : '💾 Proses Simpan Transaksi'}</span>
        </button>
      </div>
    </div>
  `;
}

function renderBukuSiswaView(students: any[], allTransactions: SavingsTransaction[], selectedStudent: any, studentBalances: any): string {
  // Get all transactions for this student
  const studentTxList = allTransactions
    .filter(t => t.nisn === selectedStudent.nisn)
    .sort((a, b) => a.date.localeCompare(b.date));

  // Compute running balance chronologically
  let running = 0;
  const txWithBalance = studentTxList.map(t => {
    if (t.type === "setor") running += t.amount;
    else running -= t.amount;
    return { ...t, runningBalance: running };
  });

  // For display, reverse chronological (latest on top)
  const displayList = [...txWithBalance].reverse();
  const bal = studentBalances[selectedStudent.nisn] || { totalSetor: 0, totalTarik: 0, saldo: 0 };

  return `
    <div class="space-y-6">
      <!-- Student Selector Pill Grid -->
      <div>
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pilih Buku Tabungan Siswa:</label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          ${students.map(s => {
            const b = studentBalances[s.nisn]?.saldo || 0;
            const isSelected = s.nisn === selectedStudent.nisn;
            return `
              <button type="button" id="btn-select-tabungan-student-${s.nisn}" data-module="tabungan" data-aksi="pilih_siswa" data-nisn="${s.nisn}" class="p-3 text-left rounded-2xl border transition flex items-center justify-between gap-2 cursor-pointer ${isSelected ? 'bg-sky-600 text-white border-sky-600 shadow-sm' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'}">
                <div class="flex items-center gap-2 truncate">
                  <span class="text-base">${s.avatar || '👦'}</span>
                  <div class="truncate">
                    <div class="font-bold text-xs truncate">${s.nama}</div>
                    <div class="text-[10px] ${isSelected ? 'text-sky-100' : 'text-slate-400'} font-mono">No. ${s.no}</div>
                  </div>
                </div>
                <div class="font-mono text-xs font-bold ${isSelected ? 'text-white' : 'text-sky-700'} shrink-0">
                  Rp ${b.toLocaleString("id-ID")}
                </div>
              </button>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Student Passbook Summary Card -->
      <div class="p-5 bg-gradient-to-r from-sky-50 to-teal-50 border border-sky-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex items-center gap-3">
          <span class="text-4xl">${selectedStudent.avatar || '👦'}</span>
          <div>
            <div class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white border border-sky-200 rounded-md text-[10px] font-bold text-sky-800 mb-1">
              Buku Tabungan Siswa No. Urut ${selectedStudent.no}
            </div>
            <h3 class="text-lg font-black text-slate-900">${selectedStudent.nama}</h3>
            <p class="text-xs text-slate-500 font-mono">NISN: ${selectedStudent.nisn} • NIS: ${selectedStudent.nis}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="px-4 py-2 bg-white border border-sky-200 rounded-xl text-center">
            <div class="text-[10px] font-bold text-slate-400 uppercase">Total Setor</div>
            <div class="font-mono font-bold text-xs text-emerald-700">+Rp ${bal.totalSetor.toLocaleString("id-ID")}</div>
          </div>
          <div class="px-4 py-2 bg-white border border-sky-200 rounded-xl text-center">
            <div class="text-[10px] font-bold text-slate-400 uppercase">Total Ditarik</div>
            <div class="font-mono font-bold text-xs text-rose-600">-Rp ${bal.totalTarik.toLocaleString("id-ID")}</div>
          </div>
          <div class="px-5 py-2.5 bg-sky-600 text-white rounded-xl shadow-xs text-right">
            <div class="text-[10px] font-bold opacity-80 uppercase">Saldo Berjalan</div>
            <div class="font-mono font-black text-base">Rp ${bal.saldo.toLocaleString("id-ID")}</div>
          </div>
        </div>
      </div>

      <!-- Passbook Table with Running Balance -->
      <div class="overflow-x-auto rounded-2xl border border-slate-200">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th class="py-3 px-3.5 text-center w-12">No</th>
              <th class="py-3 px-3.5 w-28">Tanggal</th>
              <th class="py-3 px-3.5">Catatan / Keterangan</th>
              <th class="py-3 px-3.5 text-right w-28">Setoran (+)</th>
              <th class="py-3 px-3.5 text-right w-28">Penarikan (-)</th>
              <th class="py-3 px-3.5 text-right w-32 bg-sky-50/70 text-sky-900">Saldo Berjalan</th>
              <th class="py-3 px-3.5 text-center w-28">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            ${displayList.length === 0 ? `
              <tr>
                <td colspan="7" class="py-8 text-center text-slate-400 italic">
                  Belum ada transaksi tabungan untuk siswa ini. Mulai mencatat setoran awal di atas! 💰
                </td>
              </tr>
            ` : displayList.map((t, idx) => `
              <tr class="hover:bg-slate-50 transition ${tabunganState.editingId === t.id ? 'bg-amber-50/60' : ''}">
                <td class="py-3 px-3.5 text-center font-bold text-slate-400">${idx + 1}</td>
                <td class="py-3 px-3.5 font-mono text-slate-600">${t.date}</td>
                <td class="py-3 px-3.5 font-medium text-slate-900">${t.note || '-'}</td>
                <td class="py-3 px-3.5 text-right font-mono font-bold text-emerald-700">
                  ${t.type === 'setor' ? `+ Rp ${t.amount.toLocaleString("id-ID")}` : '-'}
                </td>
                <td class="py-3 px-3.5 text-right font-mono font-bold text-rose-600">
                  ${t.type === 'tarik' ? `- Rp ${t.amount.toLocaleString("id-ID")}` : '-'}
                </td>
                <td class="py-3 px-3.5 text-right font-mono font-black text-sky-900 bg-sky-50/30">
                  Rp ${t.runningBalance.toLocaleString("id-ID")}
                </td>
                <td class="py-3 px-3.5 text-center">
                  <div class="inline-flex items-center gap-1">
                    <button type="button" id="btn-edit-tabungan-${t.id}" data-module="tabungan" data-aksi="edit" data-id="${t.id}" class="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold transition cursor-pointer" title="Edit transaksi tabungan">
                      ✏️ Edit
                    </button>
                    <button type="button" id="btn-del-tabungan-${t.id}" data-module="tabungan" data-aksi="hapus" data-id="${t.id}" class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition cursor-pointer" title="Hapus transaksi tabungan">
                      🗑️ Hapus
                    </button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderRekapKelasView(students: any[], studentBalances: any, totalClassSavings: number, totalClassSetor: number, totalClassTarik: number): string {
  return `
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="font-bold text-slate-800 text-base">Rekapitulasi Tabungan Seluruh Siswa Kelas 4</h3>
          <p class="text-xs text-slate-500">Tabel urut nomor absen siswa dengan total per siswa dan rekapitulasi kelas.</p>
        </div>
      </div>

      <div class="overflow-x-auto rounded-2xl border border-slate-200">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th class="py-3 px-3.5 text-center w-12">No</th>
              <th class="py-3 px-3.5 w-24">NISN</th>
              <th class="py-3 px-3.5">Nama Siswa</th>
              <th class="py-3 px-3.5 text-right w-36">Total Setoran</th>
              <th class="py-3 px-3.5 text-right w-36">Total Penarikan</th>
              <th class="py-3 px-3.5 text-right w-40 bg-sky-50/70 text-sky-900">Saldo Tabungan</th>
              <th class="py-3 px-3.5 text-center w-28">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            ${students.map(s => {
              const b = studentBalances[s.nisn] || { totalSetor: 0, totalTarik: 0, saldo: 0 };
              return `
                <tr class="hover:bg-slate-50">
                  <td class="py-3 px-3.5 text-center font-bold text-slate-400">${s.no}</td>
                  <td class="py-3 px-3.5 font-mono text-slate-500">${s.nisn}</td>
                  <td class="py-3 px-3.5 font-semibold text-slate-900 flex items-center gap-2">
                    <span>${s.avatar || '👦'}</span>
                    <span>${s.nama}</span>
                  </td>
                  <td class="py-3 px-3.5 text-right font-mono font-bold text-emerald-700">
                    Rp ${b.totalSetor.toLocaleString("id-ID")}
                  </td>
                  <td class="py-3 px-3.5 text-right font-mono font-bold text-rose-600">
                    Rp ${b.totalTarik.toLocaleString("id-ID")}
                  </td>
                  <td class="py-3 px-3.5 text-right font-mono font-black text-sky-800 bg-sky-50/30">
                    Rp ${b.saldo.toLocaleString("id-ID")}
                  </td>
                  <td class="py-3 px-3.5 text-center">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${b.saldo > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}">
                      ${b.saldo > 0 ? 'Aktif Menabung' : 'Belum Ada'}
                    </span>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
          <tfoot>
            <tr class="bg-slate-100/90 font-black text-slate-900 border-t-2 border-slate-300">
              <td colspan="3" class="py-3.5 px-3.5 text-right uppercase tracking-wider text-xs">TOTAL TABUNGAN KELAS 4:</td>
              <td class="py-3.5 px-3.5 text-right font-mono text-emerald-800 text-sm">Rp ${totalClassSetor.toLocaleString("id-ID")}</td>
              <td class="py-3.5 px-3.5 text-right font-mono text-rose-700 text-sm">Rp ${totalClassTarik.toLocaleString("id-ID")}</td>
              <td class="py-3.5 px-3.5 text-right font-mono text-sky-900 text-base bg-sky-100/60">Rp ${totalClassSavings.toLocaleString("id-ID")}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `;
}

function renderCatatanPerubahanTabunganView(logs: AuditLog[]): string {
  return `
    <div class="space-y-4">
      <div>
        <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
          <span>📜</span> Catatan Perubahan Transaksi Tabungan Siswa
        </h3>
        <p class="text-xs text-slate-500">Mencatat riwayat audit setiap edit, hapus, dan pemulihan buku tabungan.</p>
      </div>

      <div class="overflow-x-auto rounded-2xl border border-slate-200">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th class="py-3 px-3.5 w-40">Waktu</th>
              <th class="py-3 px-3.5 w-28">Aksi</th>
              <th class="py-3 px-3.5">Ringkasan</th>
              <th class="py-3 px-3.5 w-44">Sebelum</th>
              <th class="py-3 px-3.5 w-44">Sesudah</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            ${logs.length === 0 ? `
              <tr>
                <td colspan="5" class="py-8 text-center text-slate-400 italic">Belum ada catatan perubahan transaksi tabungan.</td>
              </tr>
            ` : logs.map(l => `
              <tr class="hover:bg-slate-50/70">
                <td class="py-3 px-3.5 font-mono text-slate-500">${l.timestamp}</td>
                <td class="py-3 px-3.5">
                  <span class="px-2 py-0.5 rounded text-[11px] font-bold ${l.action === 'hapus' ? 'bg-rose-100 text-rose-800' : l.action === 'edit' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'}">
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

function renderKotakSampahTabunganView(trashList: TrashItem[]): string {
  return `
    <div class="space-y-4">
      <div>
        <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
          <span>🗑️</span> Kotak Sampah Tabungan Siswa
        </h3>
        <p class="text-xs text-slate-500">Transaksi tabungan yang dihapus dapat dipulihkan atau dihapus permanen.</p>
      </div>

      <div class="overflow-x-auto rounded-2xl border border-slate-200">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th class="py-3 px-3.5 w-36">Dihapus Pada</th>
              <th class="py-3 px-3.5 w-24">Tanggal Asli</th>
              <th class="py-3 px-3.5">Nama Siswa</th>
              <th class="py-3 px-3.5 w-24">Jenis</th>
              <th class="py-3 px-3.5">Catatan</th>
              <th class="py-3 px-3.5 text-right w-32">Nominal</th>
              <th class="py-3 px-3.5 text-center w-40">Tindakan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            ${trashList.length === 0 ? `
              <tr>
                <td colspan="7" class="py-8 text-center text-slate-400 italic">Kotak sampah tabungan kosong bersih.</td>
              </tr>
            ` : trashList.map(t => {
              const item = t.item as SavingsTransaction;
              return `
                <tr class="hover:bg-slate-50/70">
                  <td class="py-3 px-3.5 font-mono text-slate-500">${t.deletedAt}</td>
                  <td class="py-3 px-3.5 font-mono">${item.date}</td>
                  <td class="py-3 px-3.5 font-bold text-slate-800">${item.studentName}</td>
                  <td class="py-3 px-3.5">
                    <span class="px-2 py-0.5 rounded text-[11px] font-semibold ${item.type === 'setor' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                      ${item.type === 'setor' ? 'Setor' : 'Tarik'}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 text-slate-600">${item.note || '-'}</td>
                  <td class="py-3 px-3.5 text-right font-mono font-bold ${item.type === 'setor' ? 'text-emerald-700' : 'text-rose-600'}">
                    Rp ${item.amount.toLocaleString("id-ID")}
                  </td>
                  <td class="py-3 px-3.5 text-center">
                    <div class="inline-flex items-center gap-1.5">
                      <button type="button" id="btn-restore-tabungan-${t.id}" data-module="tabungan" data-aksi="pulihkan" data-id="${t.id}" class="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-bold transition cursor-pointer" title="Pulihkan transaksi tabungan">
                        ♻️ Pulihkan
                      </button>
                      <button type="button" id="btn-perm-del-tabungan-${t.id}" data-module="tabungan" data-aksi="hapus_permanen" data-id="${t.id}" class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-lg font-bold transition cursor-pointer" title="Hapus permanen transaksi tabungan">
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

function formatDetailJSON(obj: any): string {
  if (!obj) return "-";
  if (typeof obj === "string") return obj;
  return `${obj.studentName || ''} • Rp ${obj.amount ? obj.amount.toLocaleString("id-ID") : 0} • ${obj.note || '-'}`;
}
