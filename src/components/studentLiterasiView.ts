import { Student } from "../data/students";
import {
  getReadingLogs,
  detectLiterasiAsal,
  ReadingLog
} from "../utils/storage";

export interface StudentLiterasiState {
  editingLogId: string | null;
}

export const studentLiterasiState: StudentLiterasiState = {
  editingLogId: null,
};

export function setStudentLiterasiEditingId(id: string | null) {
  studentLiterasiState.editingLogId = id;
}

export function renderStudentLiterasiView(student: Student): string {
  const allLogs = getReadingLogs();
  const myLogs = allLogs.filter(l => l.nisn === student.nisn);

  let validCount = 0;
  let flaggedCount = 0;
  let needsRevisionCount = 0;
  let totalPages = 0;

  myLogs.forEach(l => {
    totalPages += l.pages || 0;
    const d = detectLiterasiAsal(l.note);
    if (l.status === "needs_revision") {
      needsRevisionCount++;
    } else if (d.isLowEffort) {
      flaggedCount++;
    } else {
      validCount++;
    }
  });

  const editingLog = studentLiterasiState.editingLogId
    ? myLogs.find(l => l.id === studentLiterasiState.editingLogId)
    : null;

  const defaultNote = editingLog ? editingLog.note : "";
  const initialDetection = detectLiterasiAsal(defaultNote);

  return `
    <div class="space-y-6">
      <!-- Header Banner -->
      <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div class="max-w-xl space-y-2 relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-bold text-amber-200">
            <span>📚</span> Pojok Baca Literasi Siswa Kelas 4
          </div>
          <h2 class="text-2xl sm:text-3xl font-black tracking-tight">
            Jurnal Literasi & Pojok Baca
          </h2>
          <p class="text-xs sm:text-sm text-emerald-50 leading-relaxed">
            Rajin membaca pangkal pandai! Catat setiap buku yang kamu baca, ceritakan tokoh utama atau kesan menariknya untuk melatih kemampuan literasimu.
          </p>
        </div>

        <div class="hidden sm:flex absolute right-6 bottom-4 text-7xl opacity-80">
          📖✨
        </div>
      </div>

      <!-- Revision Alert if Any -->
      ${needsRevisionCount > 0 ? `
        <div class="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
          <div class="flex items-start gap-3">
            <span class="text-3xl">⚠️</span>
            <div>
              <h4 class="font-black text-sm text-rose-900">Perhatian: Ada ${needsRevisionCount} Catatan Perlu Diperbaiki!</h4>
              <p class="text-xs text-rose-700 mt-0.5">
                Bapak/Ibu Guru meminta kamu untuk mengisi ulang / melengkapi kesan atau tokoh utama cerita karena terlalu singkat atau indikasi asal.
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-scroll-to-revision"
            class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition shrink-0 cursor-pointer"
          >
            Lihat Catatan ⬇️
          </button>
        </div>
      ` : ''}

      <!-- Highlights / Stats Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
          <div class="text-2xl">📚</div>
          <div class="text-xl font-black text-slate-800 font-mono">${myLogs.length}</div>
          <div class="text-xs font-bold text-slate-600">Buku Dibaca</div>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
          <div class="text-2xl">📑</div>
          <div class="text-xl font-black text-sky-700 font-mono">${totalPages}</div>
          <div class="text-xs font-bold text-slate-600">Total Halaman</div>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
          <div class="text-2xl">✅</div>
          <div class="text-xl font-black text-emerald-600 font-mono">${validCount}</div>
          <div class="text-xs font-bold text-slate-600">Jurnal Valid</div>
        </div>

        <div class="bg-white p-4 rounded-2xl border ${needsRevisionCount > 0 ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'} shadow-2xs text-center space-y-1">
          <div class="text-2xl">${needsRevisionCount > 0 ? '⚠️' : '🌟'}</div>
          <div class="text-xl font-black ${needsRevisionCount > 0 ? 'text-rose-600' : 'text-amber-600'} font-mono">${needsRevisionCount}</div>
          <div class="text-xs font-bold ${needsRevisionCount > 0 ? 'text-rose-700' : 'text-slate-600'}">
            ${needsRevisionCount > 0 ? 'Perlu Diperbaiki' : 'Siap Lanjut'}
          </div>
        </div>
      </div>

      <!-- Reading Form (Submit / Edit) -->
      <div id="student-literasi-form-container" class="bg-white rounded-3xl p-6 sm:p-7 border ${editingLog ? 'border-amber-400 ring-2 ring-amber-200' : 'border-slate-200'} shadow-sm space-y-5">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 class="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>${editingLog ? '✏️' : '📝'}</span>
              <span>${editingLog ? 'Isi Ulang / Perbaiki Jurnal Membaca' : 'Form Catatan Membaca Harian'}</span>
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              ${editingLog ? 'Lengkapi kesan dan tokoh utama sesuai arahan guru agar status berubah menjadi Valid ✅.' : 'Isi judul buku, jumlah halaman, dan kesan/tokoh utama ceritamu.'}
            </p>
          </div>

          ${editingLog ? `
            <button
              type="button"
              id="btn-student-cancel-edit"
              class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              ✖ Batal Edit
            </button>
          ` : ''}
        </div>

        ${editingLog && editingLog.teacherNote ? `
          <div class="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5">
            <span class="text-lg">📢</span>
            <div>
              <div class="font-bold">Pesan / Masukan dari Guru:</div>
              <div class="mt-0.5 text-amber-800">${editingLog.teacherNote}</div>
            </div>
          </div>
        ` : ''}

        <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 text-xs">
          <input type="hidden" id="student-literasi-edit-id" value="${editingLog ? editingLog.id : ''}">

          <div class="sm:col-span-8 space-y-1.5">
            <label class="block font-bold text-slate-700">
              Judul Buku / Cerita <span class="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="student-literasi-title"
              value="${editingLog ? editingLog.bookTitle : ''}"
              placeholder="Contoh: Petualangan Menembus Hutan Misterius"
              class="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
          </div>

          <div class="sm:col-span-4 space-y-1.5">
            <label class="block font-bold text-slate-700">
              Jumlah Halaman yang Dibaca <span class="text-rose-500">*</span>
            </label>
            <input
              type="number"
              id="student-literasi-pages"
              min="1"
              max="1500"
              value="${editingLog ? editingLog.pages : '15'}"
              class="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
          </div>

          <!-- Form Kesan / Tokoh Utama with Auto-Detection -->
          <div class="sm:col-span-12 space-y-2">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label class="block font-bold text-slate-800">
                Kesan / Tokoh Utama Cerita <span class="text-rose-500">*</span>
              </label>

              <!-- Dynamic Auto-Detection Indicator Badge -->
              <div id="student-literasi-indicator-wrap" class="flex items-center gap-1.5">
                <span
                  id="student-literasi-live-badge"
                  class="px-2.5 py-1 rounded-full text-[11px] font-black transition-all ${
                    initialDetection.isLowEffort
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }"
                >
                  ${initialDetection.label}
                </span>
              </div>
            </div>

            <textarea
              id="student-literasi-note"
              rows="3"
              placeholder="Ceritakan siapa tokoh utama dalam buku ini dan apa pelajaran/kesan yang kamu dapatkan (Minimal 4 kata dan minimal 15 karakter)..."
              class="w-full p-3.5 bg-white border border-slate-300 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
            >${defaultNote}</textarea>

            <!-- Counter & Auto-detection info banner -->
            <div
              id="student-literasi-counter-box"
              class="p-3 rounded-xl border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 transition ${
                initialDetection.isLowEffort
                  ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                  : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              }"
            >
              <div class="flex items-center gap-2">
                <span id="student-literasi-status-icon">${initialDetection.isLowEffort ? '⚠️' : '✅'}</span>
                <span id="student-literasi-status-desc">
                  ${
                    initialDetection.isLowEffort
                      ? 'Isian terlalu singkat! Tuliskan minimal <strong>4 kata</strong> dan <strong>15 karakter</strong> agar jawaban bermakna.'
                      : 'Jawaban memenuhi syarat minimal kualitas literasi.'
                  }
                </span>
              </div>
              <div class="font-mono font-bold text-[11px] text-slate-600 shrink-0">
                <span id="student-live-words">${initialDetection.wordCount}</span> kata •
                <span id="student-live-chars">${initialDetection.charCount}</span> karakter
              </div>
            </div>
          </div>

          <div class="sm:col-span-12 flex justify-end gap-3 pt-2">
            <button
              type="button"
              id="btn-student-submit-literasi"
              class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black rounded-xl text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>${editingLog ? '💾 Simpan Perbaikan' : '🚀 Kirim Jurnal Baca'}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Student's Reading History Table -->
      <div id="reading-history-section" class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 class="font-black text-sm text-slate-800 flex items-center gap-2">
              <span>📖</span> Riwayat Jurnal Membacaku
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">Daftar buku yang sudah pernah kamu baca dan laporkan.</p>
          </div>
          <span class="text-xs text-slate-500 font-semibold">
            Total: <strong>${myLogs.length}</strong> catatan
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th class="py-3 px-3.5 w-10 text-center">No</th>
                <th class="py-3 px-3.5 w-24">Tanggal</th>
                <th class="py-3 px-3.5 min-w-[150px]">Judul Buku</th>
                <th class="py-3 px-2 text-center w-16">Hal</th>
                <th class="py-3 px-3.5 min-w-[220px]">Kesan / Tokoh Utama</th>
                <th class="py-3 px-3.5 text-center min-w-[170px]">Status di Akun Siswa</th>
                <th class="py-3 px-3.5 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-600 font-medium">
              ${myLogs.length === 0 ? `
                <tr>
                  <td colspan="7" class="py-10 text-center text-slate-400 italic">
                    Kamu belum memiliki catatan membaca. Ayo isi form di atas setelah membaca buku hari ini! 📚
                  </td>
                </tr>
              ` : myLogs.map((l, idx) => {
                const detection = detectLiterasiAsal(l.note);
                const isNeedsRevision = l.status === "needs_revision";
                const isLowEffort = detection.isLowEffort;

                return `
                  <tr class="hover:bg-slate-50 transition ${isNeedsRevision ? 'bg-rose-50/50' : ''}">
                    <td class="py-3 px-3.5 text-center font-bold text-slate-400">${idx + 1}</td>
                    <td class="py-3 px-3.5 font-mono text-slate-600 text-[11px] whitespace-nowrap">${l.date}</td>
                    <td class="py-3 px-3.5 font-bold text-slate-900">
                      📖 ${l.bookTitle}
                    </td>
                    <td class="py-3 px-2 text-center font-mono font-bold text-slate-700">${l.pages}</td>
                    <td class="py-3 px-3.5">
                      <div class="text-slate-700 leading-relaxed bg-white/70 p-2 rounded-lg border border-slate-200 text-[11px]">
                        "${l.note}"
                      </div>
                      ${isNeedsRevision && l.teacherNote ? `
                        <div class="mt-1 text-[10px] font-bold text-rose-700 bg-rose-100/70 px-2 py-1 rounded-md border border-rose-200">
                          Catatan Guru: ${l.teacherNote}
                        </div>
                      ` : ''}
                    </td>
                    <td class="py-3 px-3.5 text-center">
                      ${isNeedsRevision ? `
                        <div class="inline-flex flex-col items-center gap-1">
                          <span class="px-2.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                            ⚠️ Perlu Diperbaiki
                          </span>
                          <span class="text-[10px] text-rose-600 font-semibold">
                            Diminta Guru Isi Ulang
                          </span>
                        </div>
                      ` : isLowEffort ? `
                        <div class="inline-flex flex-col items-center gap-1">
                          <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            Terlalu Singkat / Indikasi Asal ⚠️
                          </span>
                          <span class="text-[10px] text-amber-700">
                            ${detection.reason}
                          </span>
                        </div>
                      ` : `
                        <div class="inline-flex flex-col items-center gap-1">
                          <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Valid ✅
                          </span>
                          <span class="text-[10px] text-emerald-600">
                            Terkonfirmasi Baik
                          </span>
                        </div>
                      `}
                    </td>
                    <td class="py-3 px-3.5 text-center">
                      ${isNeedsRevision ? `
                        <button
                          type="button"
                          class="btn-student-edit-literasi px-3 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold rounded-xl text-xs shadow-xs transition cursor-pointer whitespace-nowrap"
                          data-id="${l.id}"
                        >
                          ✏️ Isi Ulang
                        </button>
                      ` : `
                        <button
                          type="button"
                          class="btn-student-edit-literasi px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition cursor-pointer"
                          data-id="${l.id}"
                        >
                          ✏️ Edit
                        </button>
                      `}
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
