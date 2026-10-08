import { getMaterials, saveMaterials } from "../utils/storage";
import { MapelMateri, Bab, SubBab } from "../data/materials";

const OFFICIAL_DISPLAY_MAPELS = [
  "Matematika",
  "Bahasa Indonesia",
  "Pendidikan Pancasila",
  "IPAS",
  "Bahasa Jawa",
  "Bahasa Inggris",
  "PAI",
  "PJOK",
  "Seni Budaya"
];

export function renderMateriPortal(selectedSemester: 1 | 2 = 1, activeMapelName: string = "Matematika", searchTerm: string = ""): string {
  const materials = getMaterials();
  const mapelKeys = OFFICIAL_DISPLAY_MAPELS.filter(k => materials[k]);
  const activeMapel = materials[activeMapelName] || materials["Matematika"] || materials[mapelKeys[0]];
  const semesterBabs = activeMapel ? (activeMapel.semesters[selectedSemester] || []) : [];

  // Filter by search query if any
  const filteredBabs = semesterBabs.filter(b => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return b.judul.toLowerCase().includes(term) ||
      b.subbab.some(sb => sb.judul.toLowerCase().includes(term) || sb.ringkasan.toLowerCase().includes(term));
  });

  return `
    <div class="space-y-6">
      <!-- Header & Filter Bar -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span>📚</span> Portal Materi Kurikulum Merdeka (Fase B)
            </h2>
            <p class="text-xs text-slate-500">Materi ringkas ramah anak dilengkapi contoh kontekstual dan latihan soal</p>
          </div>
          <!-- Semester Toggle -->
          <div class="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button id="btn-materi-sem-1" class="px-4 py-2 rounded-lg text-xs font-bold transition ${selectedSemester === 1 ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
              Semester 1
            </button>
            <button id="btn-materi-sem-2" class="px-4 py-2 rounded-lg text-xs font-bold transition ${selectedSemester === 2 ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
              Semester 2
            </button>
          </div>
        </div>

        <!-- Search and Subject Selector -->
        <div class="flex flex-col sm:flex-row gap-3 items-center">
          <div class="relative flex-1 w-full">
            <span class="absolute left-3 top-2.5 text-slate-400">🔍</span>
            <input type="text" id="input-search-materi" value="${searchTerm}" placeholder="Cari bab, topik, atau kata kunci materi..." class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
          </div>
          <select id="select-materi-mapel" class="w-full sm:w-64 py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
            ${mapelKeys.map(k => `
              <option value="${k}" ${k === activeMapelName ? 'selected' : ''}>
                ${materials[k].icon} ${k}
              </option>
            `).join("")}
          </select>
          <button id="btn-print-materi" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition">
            🖨️ Cetak
          </button>
        </div>
      </div>

      <!-- Subject Tabs Ribbon & CBT Quick Launch -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
          ${mapelKeys.map(k => {
            const m = materials[k];
            const isActive = k === activeMapelName;
            return `
              <button id="btn-tab-mapel-${encodeURIComponent(k)}" data-mapel="${k}" class="px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition cursor-pointer ${isActive ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}">
                <span>${m.icon}</span>
                <span>${k}</span>
              </button>
            `;
          }).join("")}
        </div>

        <button
          type="button"
          id="btn-materi-open-cbt-${encodeURIComponent(activeMapel.mapel)}"
          data-action="open-cbt-mapel"
          data-mapel="${activeMapel.mapel}"
          class="shrink-0 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
          title="Buka Ujian CBT 50 Soal untuk mata pelajaran ${activeMapel.mapel}"
        >
          <span>💻</span>
          <span>Ujian CBT 50 Soal (${selectedSemester === 1 ? 'ATS 1 / ASAS 1' : 'ATS 2 / ASAS 2'})</span>
        </button>
      </div>

      <!-- Chapter Cards List -->
      ${filteredBabs.length === 0 ? `
        <div class="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
          <div class="text-4xl">🔍</div>
          <h3 class="font-bold text-slate-700">Materi Tidak Ditemukan</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">Tidak ada bab yang sesuai dengan kata kunci pencarian. Coba kata kunci lain atau pilih mata pelajaran lain.</p>
        </div>
      ` : `
        <div class="space-y-6">
          ${filteredBabs.map(bab => `
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <!-- Bab Header -->
              <div class="p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center">
                    ${bab.nomor}
                  </div>
                  <div>
                    <h3 class="font-bold text-slate-800 text-base">Bab ${bab.nomor}: ${bab.judul}</h3>
                    <p class="text-xs text-slate-500">${activeMapel.mapel} • Semester ${selectedSemester}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button 
                    type="button"
                    id="btn-play-bab-${bab.nomor}-${encodeURIComponent(activeMapel.mapel)}"
                    data-action="play-materi-game"
                    data-mapel="${activeMapel.mapel}"
                    data-bab-nomor="${bab.nomor}"
                    data-bab-judul="${encodeURIComponent(bab.judul)}"
                    class="btn-play-bab-game px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer transform active:scale-95"
                    title="Mainkan kuis interaktif petualangan untuk Bab ${bab.nomor}"
                  >
                    <span>🎮</span> Mainkan Game Bab Ini
                  </button>
                </div>
              </div>

              <!-- Subbab Items -->
              <div class="p-5 divide-y divide-slate-100 space-y-6">
                ${bab.subbab.map((sb, sbIdx) => `
                  <div class="${sbIdx > 0 ? 'pt-6' : ''} space-y-4">
                    <h4 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <span class="text-emerald-600 font-mono">${bab.nomor}.${sbIdx + 1}</span>
                      <span>${sb.judul}</span>
                    </h4>

                    <!-- Ringkasan Bacaan -->
                    <div class="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100/80 text-xs text-slate-700 leading-relaxed space-y-1">
                      <div class="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        <span>📖</span> Ringkasan Bacaan
                      </div>
                      <p>${sb.ringkasan}</p>
                    </div>

                    <!-- Contoh Kontekstual -->
                    <div class="p-3.5 bg-amber-50/40 rounded-xl border border-amber-200/60 text-xs text-slate-700 space-y-1">
                      <div class="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                        <span>💡</span> Contoh Nyata di Sekitar Kita
                      </div>
                      <p class="italic text-slate-600">${sb.contoh}</p>
                    </div>

                    <!-- Contoh Latihan Soal -->
                    <div class="space-y-2 pt-1">
                      <div class="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <span>📝</span> Contoh Soal & Pembahasan
                      </div>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        ${sb.contohSoal.map((cq, qIdx) => `
                          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                            <div class="font-semibold text-slate-800">
                              <span class="text-sky-600 font-bold">Soal ${qIdx + 1}:</span> ${cq.tanya}
                            </div>
                            <div class="p-2 bg-white rounded-lg border border-slate-100 font-medium text-emerald-800 text-[11px]">
                              <strong>Jawaban:</strong> ${cq.jawab}
                            </div>
                            <div class="text-[11px] text-slate-500">
                              <em>Ulasan:</em> ${cq.penjelasan}
                            </div>
                          </div>
                        `).join("")}
                      </div>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      `}
    </div>
  `;
}
