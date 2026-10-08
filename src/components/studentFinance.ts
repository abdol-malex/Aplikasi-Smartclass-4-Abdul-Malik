import { Student } from "../data/students";
import {
  getCashTransactions, calculateCashBalance,
  getSavingsTransactions, calculateStudentSavingsBalance,
  CashTransaction, SavingsTransaction
} from "../utils/storage";

export function renderStudentFinanceView(student: Student): string {
  const cashTransactions = getCashTransactions();
  const savingsTransactions = getSavingsTransactions();

  // Cash summary
  const currentCashBalance = calculateCashBalance(cashTransactions);
  let totalCashIn = 0;
  let totalCashOut = 0;
  cashTransactions.forEach(t => {
    if (t.type === "masuk") totalCashIn += t.amount;
    else totalCashOut += t.amount;
  });

  // Student's own iuran contributions
  const myIuranList = cashTransactions.filter(t => t.nisn === student.nisn || (t.studentName && t.studentName.toLowerCase().includes(student.nama.toLowerCase())));
  const myTotalIuranPaid = myIuranList.reduce((acc, t) => acc + t.amount, 0);

  // Student's own savings passbook
  const mySavingsList = savingsTransactions
    .filter(t => t.nisn === student.nisn)
    .sort((a, b) => a.date.localeCompare(b.date));

  let running = 0;
  let totalSetor = 0;
  let totalTarik = 0;
  const mySavingsWithBalance = mySavingsList.map(t => {
    if (t.type === "setor") {
      running += t.amount;
      totalSetor += t.amount;
    } else {
      running -= t.amount;
      totalTarik += t.amount;
    }
    return { ...t, runningBalance: running };
  });

  const displaySavings = [...mySavingsWithBalance].reverse();

  return `
    <div class="space-y-6">
      <!-- Title & Greeting Banner -->
      <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div class="max-w-xl space-y-2">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-bold text-amber-200">
            <span>💰</span> Keuangan Siswa & Kas Kelas
          </div>
          <h2 class="text-2xl sm:text-3xl font-black">
            Kas Kelas & Tabunganku
          </h2>
          <p class="text-xs sm:text-sm text-emerald-50 leading-relaxed">
            Hai ${student.nama}! Di sini kamu dapat melihat keterbukaan kas kelas 4 dan memeriksa buku tabungan pribadimu yang dikelola oleh bapak/ibu guru.
          </p>
        </div>
      </div>

      <!-- Part 1: Ringkasan Kas Kelas & Status Iuran Saya -->
      <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 class="text-lg font-black text-slate-800 flex items-center gap-2">
              <span>🏫</span> Transparansi Arus Kas Kelas 4
            </h3>
            <p class="text-xs text-slate-500">Ringkasan pemasukan, pengeluaran, dan status iuran kas atas namamu.</p>
          </div>
          <span class="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
            Mode Murid (Lihat Saja)
          </span>
        </div>

        <!-- 3 Cash Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <div class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Total Kas Masuk</div>
            <div class="text-lg font-black text-emerald-800 font-mono mt-1">+Rp ${totalCashIn.toLocaleString("id-ID")}</div>
            <div class="text-[11px] text-emerald-600 mt-1">Dari seluruh iuran & sosial</div>
          </div>
          <div class="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
            <div class="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Total Pengeluaran Kas</div>
            <div class="text-lg font-black text-rose-800 font-mono mt-1">-Rp ${totalCashOut.toLocaleString("id-ID")}</div>
            <div class="text-[11px] text-rose-600 mt-1">Untuk ATK & kegiatan kelas</div>
          </div>
          <div class="p-4 ${currentCashBalance >= 0 ? 'bg-teal-600 text-white' : 'bg-rose-600 text-white'} rounded-2xl shadow-xs">
            <div class="text-[10px] font-bold opacity-80 uppercase tracking-wider">Saldo Kas Kelas Saat Ini</div>
            <div class="text-xl font-black font-mono mt-1">Rp ${currentCashBalance.toLocaleString("id-ID")}</div>
            <div class="text-[11px] opacity-90 mt-1">Dana tersimpan aman</div>
          </div>
        </div>

        <!-- Status Iuran Siswa Ini -->
        <div class="space-y-3 pt-2">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span>💳</span> Catatan Iuran Kas Saya (${student.nama})
            </h4>
            <div class="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              Total Iuran Terbayar: Rp ${myTotalIuranPaid.toLocaleString("id-ID")}
            </div>
          </div>

          <div class="overflow-x-auto rounded-2xl border border-slate-200">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th class="py-2.5 px-3 w-10 text-center">No</th>
                  <th class="py-2.5 px-3 w-28">Tanggal</th>
                  <th class="py-2.5 px-3">Keterangan Iuran</th>
                  <th class="py-2.5 px-3 text-right w-32">Nominal Iuran</th>
                  <th class="py-2.5 px-3 text-center w-28">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                ${myIuranList.length === 0 ? `
                  <tr>
                    <td colspan="5" class="py-6 text-center text-slate-400 italic">
                      Belum ada catatan setoran iuran kas atas nama ${student.nama}. Hubungi bapak/ibu guru untuk konfirmasi iuran kas.
                    </td>
                  </tr>
                ` : myIuranList.map((t, idx) => `
                  <tr class="hover:bg-slate-50">
                    <td class="py-2.5 px-3 text-center text-slate-400 font-bold">${idx + 1}</td>
                    <td class="py-2.5 px-3 font-mono">${t.date}</td>
                    <td class="py-2.5 px-3 font-medium text-slate-800">${t.description}</td>
                    <td class="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">+Rp ${t.amount.toLocaleString("id-ID")}</td>
                    <td class="py-2.5 px-3 text-center">
                      <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                        ✓ Tercatat
                      </span>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Part 2: Buku Tabungan Pribadi Murid -->
      <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 class="text-lg font-black text-slate-800 flex items-center gap-2">
              <span>🏦</span> Buku Tabungan Saya (${student.nama})
            </h3>
            <p class="text-xs text-slate-500">Riwayat setoran dan penarikan tabungan lengkap dengan saldo berjalan.</p>
          </div>
          <button id="btn-student-print-tabungan" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition">
            <span>🖨️</span> Cetak Buku Tabunganku
          </button>
        </div>

        <!-- Student Savings Card -->
        <div class="p-5 bg-gradient-to-r from-sky-50 to-emerald-50 border border-sky-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-center gap-3">
            <span class="text-4xl">${student.avatar || '👦'}</span>
            <div>
              <div class="text-xs text-sky-800 font-bold">No. Urut ${student.no} • NISN: ${student.nisn}</div>
              <h4 class="text-lg font-black text-slate-900">${student.nama}</h4>
              <p class="text-xs text-slate-500">Kelas 4 SDN Banyurip</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="px-4 py-2 bg-white border border-sky-200 rounded-xl text-center">
              <div class="text-[10px] font-bold text-slate-400 uppercase">Total Disetor</div>
              <div class="font-mono font-bold text-xs text-emerald-700">+Rp ${totalSetor.toLocaleString("id-ID")}</div>
            </div>
            <div class="px-4 py-2 bg-white border border-sky-200 rounded-xl text-center">
              <div class="text-[10px] font-bold text-slate-400 uppercase">Total Ditarik</div>
              <div class="font-mono font-bold text-xs text-rose-600">-Rp ${totalTarik.toLocaleString("id-ID")}</div>
            </div>
            <div class="px-5 py-2.5 bg-sky-600 text-white rounded-xl shadow-xs text-right">
              <div class="text-[10px] font-bold opacity-80 uppercase">Saldo Tabunganku</div>
              <div class="font-mono font-black text-base">Rp ${running.toLocaleString("id-ID")}</div>
            </div>
          </div>
        </div>

        <!-- Tabungan Table (Read-Only) -->
        <div class="overflow-x-auto rounded-2xl border border-slate-200">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th class="py-3 px-3.5 text-center w-12">No</th>
                <th class="py-3 px-3.5 w-28">Tanggal</th>
                <th class="py-3 px-3.5">Catatan / Keterangan</th>
                <th class="py-3 px-3.5 text-right w-32">Setoran (+)</th>
                <th class="py-3 px-3.5 text-right w-32">Penarikan (-)</th>
                <th class="py-3 px-3.5 text-right w-36 bg-sky-50 text-sky-900">Saldo Berjalan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              ${displaySavings.length === 0 ? `
                <tr>
                  <td colspan="6" class="py-8 text-center text-slate-400 italic">
                    Belum ada riwayat transaksi tabungan. Hubungi wali kelas untuk mulai menabung! 🪙
                  </td>
                </tr>
              ` : displaySavings.map((t, idx) => `
                <tr class="hover:bg-slate-50 transition">
                  <td class="py-3 px-3.5 text-center font-bold text-slate-400">${idx + 1}</td>
                  <td class="py-3 px-3.5 font-mono text-slate-600">${t.date}</td>
                  <td class="py-3 px-3.5 font-medium text-slate-900">${t.note || '-'}</td>
                  <td class="py-3 px-3.5 text-right font-mono font-bold text-emerald-700">
                    ${t.type === 'setor' ? `+ Rp ${t.amount.toLocaleString("id-ID")}` : '-'}
                  </td>
                  <td class="py-3 px-3.5 text-right font-mono font-bold text-rose-600">
                    ${t.type === 'tarik' ? `- Rp ${t.amount.toLocaleString("id-ID")}` : '-'}
                  </td>
                  <td class="py-3 px-3.5 text-right font-mono font-black text-sky-900 bg-sky-50/40">
                    Rp ${t.runningBalance.toLocaleString("id-ID")}
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
