import { Student } from "../data/students";
import { LIST_MAPEL_SEM1, LIST_MAPEL_SEM2, RAW_KURIKULUM_SEM1, RAW_KURIKULUM_SEM2 } from "../data/kurikulum";
import {
  getAssessmentEntries, getAssessmentSettings,
  calculateSubjectScoreBreakdown, calculateStudentReport
} from "../utils/storage";

export function renderStudentScoresView(student: Student, semester: 1 | 2 = 1): string {
  const allEntries = getAssessmentEntries();
  const settings = getAssessmentSettings();
  const report = calculateStudentReport(student.nisn, semester);
  const mapelList = semester === 2 ? LIST_MAPEL_SEM2 : LIST_MAPEL_SEM1;
  const rawKurikulum = semester === 2 ? RAW_KURIKULUM_SEM2 : RAW_KURIKULUM_SEM1;

  const periodATS = semester === 1 ? "ATS 1" : "ATS 2";
  const periodASAS = semester === 1 ? "ASAS 1" : "ASAS 2";

  return `
    <div class="space-y-6">
      <!-- Student Banner -->
      <div class="p-6 sm:p-8 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white rounded-3xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex items-center gap-4">
          <span class="text-5xl">${student.avatar || '👦'}</span>
          <div class="space-y-1">
            <div class="inline-flex items-center gap-1.5 px-3 py-0.5 bg-white/20 rounded-full text-xs font-bold text-amber-200">
              <span>📋</span> Rapor Capaian Belajarku • Semester ${semester}
            </div>
            <h2 class="text-2xl sm:text-3xl font-black">${student.nama}</h2>
            <p class="text-xs text-emerald-100 font-mono">NISN: ${student.nisn} • Kelas 4 SDN Banyurip • Fase B</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Semester Toggle -->
          <div class="inline-flex rounded-xl bg-black/20 p-1 border border-white/20">
            <button id="btn-scores-sem-1" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${semester === 1 ? 'bg-white text-emerald-900 shadow-sm' : 'text-white/80 hover:text-white'}">
              Semester 1
            </button>
            <button id="btn-scores-sem-2" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${semester === 2 ? 'bg-white text-emerald-900 shadow-sm' : 'text-white/80 hover:text-white'}">
              Semester 2
            </button>
          </div>

          <div class="px-4 py-2 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/20 text-center">
            <div class="text-[10px] font-bold opacity-80 uppercase">Mapel Tuntas</div>
            <div class="font-mono font-bold text-sm text-white">${report.completedSubjectsCount} / ${report.totalSubjectsCount}</div>
          </div>
          <div class="px-4 py-2 bg-amber-400 text-amber-950 rounded-2xl shadow-sm text-right">
            <div class="text-[10px] font-bold uppercase tracking-wider">Rata-Rata Umum</div>
            <div class="font-mono font-black text-lg">${report.overallAverage !== null ? report.overallAverage : 'Belum ada'}</div>
          </div>
        </div>
      </div>

      <!-- Information Card & CBT Quick Link -->
      <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <span class="text-lg">ℹ️</span>
          <span>
            Buku Rapor Asesmen Semester ${semester} menyajikan rekap nilai Harian, Sumatif Bab, serta Ujian CBT (${periodATS} & ${periodASAS}).
          </span>
        </div>
        <div class="flex items-center gap-2 self-end sm:self-auto">
          <button id="btn-scores-open-cbt" class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer">
            <span>💻</span> Ambil Ujian CBT
          </button>
          <button id="btn-print-student-scores" class="px-3.5 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 rounded-xl font-bold transition cursor-pointer">
            🖨️ Cetak Rapor
          </button>
        </div>
      </div>

      <!-- Subjects Cards List -->
      <div class="space-y-4">
        ${mapelList.map((mapelName) => {
          const breakdown = report.subjects[mapelName] || calculateSubjectScoreBreakdown(student.nisn, mapelName, semester, allEntries, settings);
          const rawMapel = rawKurikulum[mapelName] || {};
          const babs = Object.keys(rawMapel).filter(b => !b.startsWith("Evaluasi"));
          const isPassed = breakdown.finalScore !== null && breakdown.finalScore >= breakdown.kkm;

          return `
            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h3 class="font-black text-base text-slate-900 flex items-center gap-2">
                    <span>📖</span> ${mapelName}
                  </h3>
                  <span class="text-xs text-slate-400">Kurikulum Merdeka Kelas 4 • Semester ${semester}</span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-xs text-slate-500 font-mono">KKM: <strong>${breakdown.kkm}</strong></span>
                  <div class="px-3 py-1 rounded-xl font-mono font-black text-sm ${
                    breakdown.finalScore !== null ? (
                      isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    ) : 'bg-slate-100 text-slate-500'
                  }">
                    Nilai Akhir: ${breakdown.finalScore !== null ? breakdown.finalScore : 'Belum ada nilai'}
                    ${breakdown.finalScore !== null ? (isPassed ? ' (LULUS)' : ' (REMEDIAL)') : ''}
                  </div>
                </div>
              </div>

              <!-- Component Breakdown Pills -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div class="p-3 bg-sky-50 rounded-xl border border-sky-100">
                  <span class="text-slate-500 block text-[10px] font-bold uppercase">Rata-Rata Harian (TP)</span>
                  <span class="font-mono font-black text-sm text-sky-800">${breakdown.harianAvg !== null ? breakdown.harianAvg : 'Belum ada'}</span>
                </div>
                <div class="p-3 bg-teal-50 rounded-xl border border-teal-100">
                  <span class="text-slate-500 block text-[10px] font-bold uppercase">Sumatif Lingkup Bab</span>
                  <span class="font-mono font-black text-sm text-teal-800">${breakdown.sumatifBabAvg !== null ? breakdown.sumatifBabAvg : 'Belum ada'}</span>
                </div>
                <div class="p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <span class="text-slate-500 block text-[10px] font-bold uppercase">ASTS (${periodATS})</span>
                  <span class="font-mono font-black text-sm text-amber-800">${breakdown.astsScore !== null ? breakdown.astsScore : 'Belum ada'}</span>
                </div>
                <div class="p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <span class="text-slate-500 block text-[10px] font-bold uppercase">ASAS (${periodASAS})</span>
                  <span class="font-mono font-black text-sm text-purple-800">${breakdown.asasScore !== null ? breakdown.asasScore : 'Belum ada'}</span>
                </div>
              </div>

              <!-- Subbabs Detail Accordion / Table -->
              <div class="bg-slate-50/70 rounded-xl p-3.5 border border-slate-100 space-y-2">
                <div class="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Capaian per Tujuan Pembelajaran (TP Subbab):</div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  ${babs.flatMap(bTitle => {
                    const sList = (rawMapel[bTitle] || []).filter(s => !s.toLowerCase().includes("asesmen sumatif"));
                    return sList.map(sTitle => {
                      const data = breakdown.subbabAverages[sTitle];
                      const val = data ? data.avg : null;
                      return `
                        <div class="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-2">
                          <span class="truncate text-slate-700 font-medium" title="${sTitle}">${sTitle}</span>
                          <span class="font-mono font-bold shrink-0 ${val !== null ? (val >= breakdown.kkm ? 'text-emerald-700' : 'text-rose-600') : 'text-slate-400'}">
                            ${val !== null ? val : 'Belum ada'}
                          </span>
                        </div>
                      `;
                    });
                  }).join("")}
                </div>
              </div>

              <!-- Deskripsi Capaian -->
              <div class="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs space-y-1">
                <span class="font-bold text-emerald-900 block">Catatan Capaian Kompetensi Guru:</span>
                <p class="text-slate-700 leading-relaxed italic">
                  "${breakdown.capaianDeskripsi}"
                </p>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}
