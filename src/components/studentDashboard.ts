import { Student } from "../data/students";
import { getCurrentAndNextLesson, WeekSchedule } from "../data/schedule";
import {
  getSchedule, getGameProgress, getSavingsTransactions, getPiket, getReadingLogs,
  getStudentPhoto
} from "../utils/storage";

export function renderStudentDashboard(student: Student, semester: 1 | 2 = 1): string {
  const schedule = getSchedule();
  const lessonInfo = getCurrentAndNextLesson(schedule);
  const progress = getGameProgress(student.nisn, semester);
  const customPhoto = getStudentPhoto(student.nisn);

  // Check today's piket
  const piket = getPiket();
  const dayName = lessonInfo.dayName as keyof typeof piket;
  const todaysPiketList = piket[dayName] || [];
  const myPiketAssignment = todaysPiketList.find(p => p.nisn === student.nisn);
  const isPiketToday = !!myPiketAssignment;

  // Student savings balance
  const savingsTx = getSavingsTransactions().filter(t => t.nisn === student.nisn);
  let mySavingsBalance = 0;
  savingsTx.forEach(t => {
    if (t.type === "setor") mySavingsBalance += t.amount;
    else mySavingsBalance -= t.amount;
  });

  // Reading logs and revision alerts
  const myReadingLogs = getReadingLogs().filter(l => l.nisn === student.nisn);
  const needsRevisionCount = myReadingLogs.filter(l => l.status === "needs_revision").length;

  return `
    <div class="space-y-6">
      <!-- Greeting Card with Mascot & Student Profile Photo -->
      <div class="bg-gradient-to-r from-sky-600 via-emerald-600 to-teal-600 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 z-10 relative">
          <!-- Left: Greeting Text -->
          <div class="max-w-xl space-y-3">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-bold text-amber-200">
              <span>🎒</span> Kelas 4 SDN Banyurip • TA 2026/2027
            </div>
            <h2 class="text-2xl sm:text-3xl font-black tracking-tight flex flex-wrap items-center gap-2">
              <span>Halo, ${student.nama}!</span>
            </h2>
            <p class="text-xs sm:text-sm text-sky-50 leading-relaxed">
              Semangat belajar dan raih mimpimu setinggi langit! Nusa dan Tara siap menemanimu bertualang menimba ilmu hari ini.
            </p>

            <div class="pt-2 flex flex-wrap gap-2.5">
              <button id="btn-quick-play-game" class="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-sm transition transform hover:scale-105 cursor-pointer">
                <span>🎮</span> Mainkan Petualangan Nusantara
              </button>
              <button id="btn-quick-read-materi" class="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl text-xs flex items-center gap-2 backdrop-blur-xs transition cursor-pointer">
                <span>📖</span> Baca Materi
              </button>
              <button id="btn-quick-view-literasi" class="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition cursor-pointer">
                <span>📚</span> Pojok Baca ${needsRevisionCount > 0 ? `<span class="px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-black rounded-full">${needsRevisionCount}</span>` : ''}
              </button>
              <button id="btn-quick-view-scores" class="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition cursor-pointer">
                <span>📋</span> Raporku
              </button>
              <button id="btn-quick-edit-profil" class="px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition cursor-pointer" title="Perbarui data diri, kontak, dan PIN">
                <span>✏️</span> Edit Profil
              </button>
            </div>
          </div>

          <!-- Right: Identity Photo Card (Fitur Unggah Foto Profil Mandiri) -->
          <div class="bg-white/15 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 flex flex-col items-center text-center space-y-3 shrink-0 self-stretch md:self-auto min-w-[200px]">
            <div class="relative group">
              ${customPhoto ? `
                <img
                  src="${customPhoto}"
                  alt="Foto ${student.nama}"
                  class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-lg ring-4 ring-emerald-300/40"
                />
              ` : `
                <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/25 flex items-center justify-center text-4xl sm:text-5xl border border-white/40 shadow-inner">
                  ${student.avatar || "👦"}
                </div>
              `}
              <span class="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-full text-xs shadow-md" title="Akun Terverifikasi">
                ✓
              </span>
            </div>

            <div>
              <div class="text-xs font-black leading-tight text-white">${student.nama}</div>
              <div class="text-[10px] font-mono text-emerald-100 mt-0.5">NISN: ${student.nisn}</div>
            </div>

            <div class="flex flex-col gap-1.5 w-full">
              <button
                type="button"
                id="btn-card-edit-profil"
                class="w-full py-2 px-3 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                title="Kelola Data Diri dan Foto Profil Siswa"
              >
                <span>✏️</span>
                <span>Edit Profil & Foto</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Revision Alert Banner for Student -->
      ${needsRevisionCount > 0 ? `
        <div class="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
          <div class="flex items-center gap-3">
            <span class="text-3xl">⚠️</span>
            <div>
              <h4 class="font-bold text-xs sm:text-sm">Status Akun: Perlu Diperbaiki (${needsRevisionCount} Jurnal)</h4>
              <p class="text-[11px] text-rose-700 mt-0.5">
                Bapak/Ibu Guru meminta kamu untuk mengisi ulang catatan membaca yang terindikasi terlalu singkat.
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-quick-fix-literasi"
            class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition shrink-0 cursor-pointer"
          >
            Perbaiki Sekarang ➔
          </button>
        </div>
      ` : ''}

      <!-- Real-Time Lesson Schedule Widgets -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Current Lesson Card -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <div class="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>⏰ Jam Belajar Saat Ini</span>
            <span class="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold">${lessonInfo.timeNow}</span>
          </div>
          <div class="text-lg font-black text-slate-800">
            ${lessonInfo.current}
          </div>
          <p class="text-[11px] text-slate-500">
            Hari ${lessonInfo.dayName} • SDN Banyurip
          </p>
        </div>

        <!-- Next Lesson Card -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <div class="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
            <span>⏭️</span> Pelajaran Berikutnya
          </div>
          <div class="text-lg font-black text-emerald-700">
            ${lessonInfo.next}
          </div>
          <p class="text-[11px] text-slate-500">
            Siapkan buku catatanmu ya! 📚
          </p>
        </div>

        <!-- Piket Alert Card -->
        <div class="rounded-2xl p-5 border shadow-2xs space-y-2 ${isPiketToday ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-white border-slate-200'}">
          <div class="text-xs font-semibold flex items-center justify-between">
            <span>🧹 Tugas Piket Kelas</span>
            <span class="font-bold text-[11px]">${lessonInfo.dayName}</span>
          </div>
          <div class="text-base font-bold">
            ${isPiketToday ? `Hari ini giliran kamu piket! ⭐ (${myPiketAssignment?.task})` : 'Hari ini kamu bebas piket 😊'}
          </div>
          <p class="text-[11px] ${isPiketToday ? 'text-amber-800' : 'text-slate-500'}">
            ${isPiketToday ? 'Bantu sapu lantai dan bersihkan papan tulis bersama teman.' : 'Tetap jaga kebersihan bangku dan mejamu ya.'}
          </p>
        </div>
      </div>

      <!-- CBT Exam Quick Banner -->
      <div class="bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-700 rounded-3xl p-5 sm:p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm relative overflow-hidden">
        <div class="flex items-center gap-3.5 relative z-10">
          <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shrink-0">
            💻
          </div>
          <div>
            <h3 class="font-black text-base sm:text-lg leading-tight">Ujian CBT 50 Soal (ATS & ASAS)</h3>
            <p class="text-xs text-blue-100 mt-0.5">Asesmen periodik proporsional dengan rekapitulasi nilai otomatis ke buku nilai & rapor digital</p>
          </div>
        </div>
        <button id="btn-quick-play-cbt" class="px-5 py-2.5 bg-white text-blue-900 hover:bg-blue-50 font-black rounded-xl text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer shrink-0 z-10 transform active:scale-95">
          <span>Mulai Ujian CBT</span> <span>🚀</span>
        </button>
      </div>

      <!-- Student Stats Highlights -->
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
          <div class="text-2xl">⭐</div>
          <div class="text-lg font-black text-amber-600 font-mono">${progress.xp}</div>
          <div class="text-[11px] font-bold text-slate-600">Total XP Siswa</div>
        </div>

        <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
          <div class="text-2xl">🪙</div>
          <div class="text-lg font-black text-yellow-600 font-mono">${progress.coins}</div>
          <div class="text-[11px] font-bold text-slate-600">Koin Pintar</div>
        </div>

        <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
          <div class="text-2xl">💎</div>
          <div class="text-lg font-black text-emerald-600 font-mono">${progress.gems.length}/10</div>
          <div class="text-[11px] font-bold text-slate-600">Permata Ilmu</div>
        </div>

        <button id="btn-quick-stat-literasi" class="bg-white hover:bg-emerald-50 p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-2xs text-center space-y-1 transition cursor-pointer">
          <div class="text-2xl">📚</div>
          <div class="text-lg font-black text-emerald-700 font-mono">${myReadingLogs.length} Buku</div>
          <div class="text-[11px] font-bold text-slate-600">Pojok Baca ➔</div>
        </button>

        <button id="btn-quick-view-savings" class="bg-white hover:bg-sky-50 p-3.5 rounded-2xl border border-slate-200 hover:border-sky-300 shadow-2xs text-center space-y-1 transition cursor-pointer">
          <div class="text-2xl">🏦</div>
          <div class="text-xs sm:text-sm font-black text-sky-700 font-mono">Rp ${mySavingsBalance.toLocaleString("id-ID")}</div>
          <div class="text-[11px] font-bold text-slate-600">Tabungan ➔</div>
        </button>
      </div>
    </div>
  `;
}
