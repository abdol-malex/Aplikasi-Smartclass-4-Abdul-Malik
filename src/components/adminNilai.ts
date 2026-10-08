import {
  Student
} from "../data/students";
import {
  RAW_KURIKULUM_SEM1, RAW_KURIKULUM_SEM2, LIST_MAPEL_SEM1, LIST_MAPEL_SEM2, getStructuredMapels, MapelKurikulum
} from "../data/kurikulum";
import {
  getStudents, getAssessmentEntries, saveAssessmentEntries,
  getAssessmentSettings, saveAssessmentSettings,
  AssessmentEntry, AssessmentSettings,
  calculateSubjectScoreBreakdown, calculateStudentReport,
  getEffectiveScore, getAuditLogs, getTrashItems
} from "../utils/storage";

export interface NilaiState {
  tab: "input" | "matriks" | "rapor" | "log" | "sampah" | "pengaturan";
  semester: 1 | 2;
  selectedMapel: string;
  category: "harian" | "sumatif_bab" | "asts" | "asas";
  selectedBab: string;
  selectedSubbab: string;
  selectedStudentNisn: string;
  date: string;
  type: "Tugas" | "Kuis" | "Praktik" | "Keaktifan" | "Lainnya";
}

export let nilaiState: NilaiState = {
  tab: "input",
  semester: 1,
  selectedMapel: "PPKN",
  category: "harian",
  selectedBab: "",
  selectedSubbab: "",
  selectedStudentNisn: "3174825699",
  date: new Date().toISOString().split("T")[0],
  type: "Tugas",
};

export function setNilaiState(partial: Partial<NilaiState>) {
  nilaiState = { ...nilaiState, ...partial };
}

export function renderAdminNilai(selectedSemester: 1 | 2 = 1): string {
  nilaiState.semester = selectedSemester;
  const students = getStudents();
  const settings = getAssessmentSettings();
  const allEntries = getAssessmentEntries();
  const auditLogs = getAuditLogs().filter(l => l.module === "nilai");
  const trashItems = getTrashItems().filter(t => t.module === "nilai");

  const rawData = nilaiState.semester === 2 ? RAW_KURIKULUM_SEM2 : RAW_KURIKULUM_SEM1;
  const listMapel = nilaiState.semester === 2 ? LIST_MAPEL_SEM2 : LIST_MAPEL_SEM1;

  // Ensure selectedMapel is valid in current semester
  if (!listMapel.includes(nilaiState.selectedMapel)) {
    nilaiState.selectedMapel = listMapel[0] || "Matematika";
  }

  const rawMapel = rawData[nilaiState.selectedMapel] || {};
  const babs = Object.keys(rawMapel).filter(b => !b.startsWith("Evaluasi"));

  if (!nilaiState.selectedBab || !babs.includes(nilaiState.selectedBab)) {
    nilaiState.selectedBab = babs[0] || "";
  }

  const subbabs = (rawMapel[nilaiState.selectedBab] || []).filter(s => !s.toLowerCase().includes("asesmen sumatif"));
  if (!nilaiState.selectedSubbab || !subbabs.includes(nilaiState.selectedSubbab)) {
    nilaiState.selectedSubbab = subbabs[0] || "";
  }

  return `
    <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-8 space-y-6">
      <!-- Top Title & Semester Switcher -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-5 border-b border-slate-100">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-2xl">📊</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900">Penilaian Asesmen Kurikulum Merdeka</h2>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            Penilaian Harian (TP), Asesmen Sumatif Lingkup Materi (Bab), ASTS (ATS 1), dan ASAS (ASAS 1) Kelas 4 SDN Banyurip.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <div class="inline-flex rounded-2xl bg-slate-100 p-1 border border-slate-200">
            <button id="btn-admin-sem-1" class="px-4 py-2 rounded-xl text-xs font-bold transition ${nilaiState.semester === 1 ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
              Semester 1 (Aktif)
            </button>
            <button id="btn-admin-sem-2" class="px-4 py-2 rounded-xl text-xs font-bold transition ${(nilaiState.semester as number) === 2 ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
              Semester 2
            </button>
          </div>
        </div>
      </div>

      <!-- Navigation Sub-Tabs -->
      <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div class="inline-flex flex-wrap p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button id="btn-nilai-tab-input" class="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${nilaiState.tab === 'input' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            <span>📝</span> Input Nilai (8 Siswa)
          </button>
          <button id="btn-nilai-tab-matriks" class="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${nilaiState.tab === 'matriks' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            <span>📊</span> Matriks Rekap Mapel
          </button>
          <button id="btn-nilai-tab-rapor" class="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${nilaiState.tab === 'rapor' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            <span>📋</span> Rapor Siswa
          </button>
          <button id="btn-nilai-tab-log" class="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${nilaiState.tab === 'log' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            <span>📜</span> Catatan Perubahan
            <span class="px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full text-[10px]">${auditLogs.length}</span>
          </button>
          <button id="btn-nilai-tab-sampah" class="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${nilaiState.tab === 'sampah' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            <span>🗑️</span> Sampah
            <span class="px-1.5 py-0.2 ${trashItems.length > 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'} rounded-full text-[10px] font-bold">${trashItems.length}</span>
          </button>
          <button id="btn-nilai-tab-pengaturan" class="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${nilaiState.tab === 'pengaturan' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            <span>⚙️</span> KKM & Bobot
          </button>
        </div>

        <div class="flex items-center gap-2">
          ${nilaiState.tab === 'matriks' ? `
            <button id="btn-print-matriks-nilai" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer">
              <span>🖨️</span> Cetak / PDF
            </button>
            <button id="btn-export-csv-nilai" class="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer">
              <span>📥</span> Ekspor CSV
            </button>
          ` : ''}
          ${nilaiState.tab === 'rapor' ? `
            <button id="btn-print-rapor-siswa" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer">
              <span>🖨️</span> Cetak Rapor Siswa
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Content Views based on Tab -->
      ${nilaiState.tab === 'input' ? renderInputCepatView(students, settings, allEntries, babs, subbabs) : ''}
      ${nilaiState.tab === 'matriks' ? renderMatriksRekapView(students, settings, allEntries) : ''}
      ${nilaiState.tab === 'rapor' ? renderRaporSiswaView(students, settings, allEntries) : ''}
      ${nilaiState.tab === 'log' ? renderCatatanPerubahanView(auditLogs) : ''}
      ${nilaiState.tab === 'sampah' ? renderKotakSampahView(trashItems) : ''}
      ${nilaiState.tab === 'pengaturan' ? renderPengaturanView(settings) : ''}
    </div>
  `;
}

function renderSemesterEmptyView(sem: 2): string {
  return `
    <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 text-center space-y-4">
      <div class="text-5xl">📅</div>
      <h3 class="text-xl font-black text-slate-800">Penilaian Semester ${sem} Belum Dimulai</h3>
      <p class="text-xs text-slate-500 max-w-md mx-auto">
        Tahun Ajaran 2026/2027 saat ini sedang berlangsung pada Semester 1. Data penilaian Semester ${sem} dan mata pelajaran Komputer masih kosong tanpa error dan siap digunakan saat semester genap dimulai.
      </p>
      <div class="pt-2">
        <button id="btn-admin-sem-1" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs">
          Kembali ke Semester 1 🚀
        </button>
      </div>
    </div>
  `;
}

function renderInputCepatView(students: Student[], settings: AssessmentSettings, allEntries: AssessmentEntry[], babs: string[], subbabs: string[]): string {
  const currentMapel = nilaiState.selectedMapel;
  const currentKKM = settings.kkmPerMapel[currentMapel] || 70;

  // Find existing entries for this specific combination
  const existingEntriesForTarget = allEntries.filter(e => {
    if (e.semester !== nilaiState.semester) return false;
    if (e.mapel !== currentMapel) return false;
    if (e.category !== nilaiState.category) return false;
    if (nilaiState.category === "harian") {
      return e.bab === nilaiState.selectedBab && e.subbab === nilaiState.selectedSubbab;
    }
    if (nilaiState.category === "sumatif_bab") {
      return e.bab === nilaiState.selectedBab;
    }
    return true; // asts or asas
  });

  return `
    <div class="space-y-6">
      <!-- Selector Hierarchy: Mapel -> Kategori -> Bab -> Subbab -->
      <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <!-- 1. Mapel Selector -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">Mata Pelajaran (Semester 1) *</label>
            <select id="select-nilai-mapel" class="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800">
              ${LIST_MAPEL_SEM1.map(m => `
                <option value="${m}" ${nilaiState.selectedMapel === m ? 'selected' : ''}>${m}</option>
              `).join("")}
            </select>
          </div>

          <!-- 2. Jenis Penilaian -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">Jenis Penilaian Asesmen *</label>
            <select id="select-nilai-category" class="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800">
              <option value="harian" ${nilaiState.category === 'harian' ? 'selected' : ''}>1. Nilai Harian per Subbab (TP)</option>
              <option value="sumatif_bab" ${nilaiState.category === 'sumatif_bab' ? 'selected' : ''}>2. Asesmen Sumatif Lingkup Bab</option>
              <option value="asts" ${nilaiState.category === 'asts' ? 'selected' : ''}>3. Asesmen Tengah Semester (ATS 1)</option>
              <option value="asas" ${nilaiState.category === 'asas' ? 'selected' : ''}>4. Asesmen Akhir Semester (ASAS 1)</option>
            </select>
          </div>

          <!-- 3. Bab Selector (if harian or sumatif_bab) -->
          ${(nilaiState.category === 'harian' || nilaiState.category === 'sumatif_bab') ? `
            <div>
              <label class="block font-bold text-slate-700 mb-1">Pilih Bab / Lingkup Materi *</label>
              <select id="select-nilai-bab" class="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800">
                ${babs.map(b => `
                  <option value="${b}" ${nilaiState.selectedBab === b ? 'selected' : ''}>${b}</option>
                `).join("")}
              </select>
            </div>
          ` : `
            <div>
              <label class="block font-bold text-slate-400 mb-1">Bab / Lingkup Materi</label>
              <input type="text" disabled value="Evaluasi Semester" class="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 font-medium">
            </div>
          `}

          <!-- 4. Subbab Selector (if harian) -->
          ${nilaiState.category === 'harian' ? `
            <div>
              <label class="block font-bold text-slate-700 mb-1">Pilih Subbab (Tujuan Pembelajaran) *</label>
              <select id="select-nilai-subbab" class="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800">
                ${subbabs.map(s => `
                  <option value="${s}" ${nilaiState.selectedSubbab === s ? 'selected' : ''}>${s}</option>
                `).join("")}
              </select>
            </div>
          ` : `
            <div>
              <label class="block font-bold text-slate-400 mb-1">Subbab (TP)</label>
              <input type="text" disabled value="Cakupan Seluruh Bab / Mapel" class="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 font-medium">
            </div>
          `}
        </div>

        <!-- Global Header Toolbar: Tanggal, Jenis Tugas, Quick Fill, KKM Info -->
        <div class="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div class="flex flex-wrap items-center gap-3">
            <div>
              <span class="text-slate-500 font-semibold mr-1.5">Tanggal:</span>
              <input type="date" id="input-nilai-date-global" value="${nilaiState.date}" class="px-2.5 py-1 bg-white border border-slate-300 rounded-lg font-medium text-slate-700">
            </div>
            ${nilaiState.category === 'harian' ? `
              <div>
                <span class="text-slate-500 font-semibold mr-1.5">Bentuk:</span>
                <select id="select-nilai-type-global" class="px-2.5 py-1 bg-white border border-slate-300 rounded-lg font-medium text-slate-700">
                  <option value="Tugas" ${nilaiState.type === 'Tugas' ? 'selected' : ''}>Tugas</option>
                  <option value="Kuis" ${nilaiState.type === 'Kuis' ? 'selected' : ''}>Kuis</option>
                  <option value="Praktik" ${nilaiState.type === 'Praktik' ? 'selected' : ''}>Praktik</option>
                  <option value="Keaktifan" ${nilaiState.type === 'Keaktifan' ? 'selected' : ''}>Keaktifan</option>
                  <option value="Lainnya" ${nilaiState.type === 'Lainnya' ? 'selected' : ''}>Lainnya</option>
                </select>
              </div>
            ` : ''}
            <div class="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg font-bold">
              KKM Mapel: ${currentKKM}
            </div>
          </div>

          <!-- Quick Fill Controls -->
          <div class="flex flex-wrap items-center gap-2">
            <button type="button" id="btn-quick-fill-all" class="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg font-bold transition flex items-center gap-1">
              <span>⚡</span> Isi Semua Nilai...
            </button>
            <button type="button" id="btn-quick-clear-all" class="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg font-bold transition flex items-center gap-1">
              <span>🧹</span> Kosongkan Kolom
            </button>
            <button type="button" id="btn-paste-spreadsheet" class="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg font-bold transition flex items-center gap-1">
              <span>📋</span> Tempel Spreadsheet
            </button>
            <button type="button" id="btn-copy-quiz-scores" class="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-bold transition flex items-center gap-1" title="Salin skor kuis terbaik siswa sebagai nilai">
              <span>🎮</span> Salin Skor Kuis
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Guidance Banner -->
      <div class="p-3 bg-sky-50 border border-sky-200 text-sky-800 rounded-2xl text-xs flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span class="text-base">💡</span>
          <span>
            Gunakan tombol <strong>Tab</strong> atau <strong>Enter</strong> untuk langsung berpindah ke siswa berikutnya.
            Kolom <strong>KOSONG</strong> berarti <em>belum dinilai</em> (bukan 0). Nilai di bawah KKM (${currentKKM}) otomatis bertanda ⚠️.
          </span>
        </div>
        <span class="text-[11px] font-mono font-bold text-sky-700">Total: 8 Siswa Terdaftar</span>
      </div>

      <!-- 8 Students Table Input -->
      <div class="overflow-x-auto rounded-2xl border border-slate-200">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th class="py-3 px-3 text-center w-10">No</th>
              <th class="py-3 px-3 w-48">Nama Siswa</th>
              <th class="py-3 px-3 text-center w-28">Status Kehadiran</th>
              <th class="py-3 px-3 text-center w-36">Nilai Asli (0–100)</th>
              <th class="py-3 px-3 text-center w-36">Nilai Remedial (Jika &lt; ${currentKKM})</th>
              <th class="py-3 px-3">Catatan / Keterangan</th>
              <th class="py-3 px-3 text-center w-24">Aksi Entri</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700" id="table-input-nilai-body">
            ${students.map((s, idx) => {
              // Find matching entry
              const entry = existingEntriesForTarget.find(e => e.nisn === s.nisn);
              const valScore = entry && entry.score !== null && entry.score !== undefined ? entry.score : "";
              const valRemedial = entry && entry.remedialScore !== null && entry.remedialScore !== undefined ? entry.remedialScore : "";
              const isAbsent = entry ? !!entry.isAbsent : false;
              const isBelow = typeof valScore === "number" && valScore < currentKKM;

              return `
                <tr class="hover:bg-slate-50/80 transition ${isBelow ? 'bg-rose-50/40' : ''}" data-row-nisn="${s.nisn}">
                  <td class="py-3 px-3 text-center font-bold text-slate-400">${s.no || idx + 1}</td>
                  <td class="py-3 px-3">
                    <div class="font-bold text-slate-900 flex items-center gap-1.5">
                      <span class="text-sm">${s.avatar || '👦'}</span>
                      <span class="truncate">${s.nama}</span>
                    </div>
                    <div class="text-[10px] text-slate-400 font-mono">NISN: ${s.nisn}</div>
                  </td>
                  <td class="py-3 px-3 text-center">
                    <select id="input-absent-${s.nisn}" data-nisn="${s.nisn}" class="input-absent-toggle p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold ${isAbsent ? 'text-amber-800 bg-amber-50 border-amber-300' : 'text-slate-700'}">
                      <option value="false" ${!isAbsent ? 'selected' : ''}>Hadir (Dinilai)</option>
                      <option value="true" ${isAbsent ? 'selected' : ''}>Tidak Ikut / Absen</option>
                    </select>
                  </td>
                  <td class="py-3 px-3 text-center">
                    <div class="relative inline-block w-28">
                      <input
                        type="number"
                        id="input-score-${s.nisn}"
                        data-nisn="${s.nisn}"
                        data-idx="${idx}"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="Kosong"
                        value="${valScore}"
                        ${isAbsent ? 'disabled' : ''}
                        class="input-score-field w-full p-2 bg-white border ${isBelow ? 'border-rose-400 text-rose-800 bg-rose-50/50' : 'border-slate-300 text-slate-900'} rounded-xl font-mono font-bold text-center focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-400"
                      >
                      ${isBelow ? `
                        <span class="absolute right-2 top-2.5 text-xs text-rose-600" title="Nilai di bawah KKM (${currentKKM})">⚠️</span>
                      ` : ''}
                    </div>
                  </td>
                  <td class="py-3 px-3 text-center">
                    <input
                      type="number"
                      id="input-remedial-${s.nisn}"
                      data-nisn="${s.nisn}"
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="${isBelow ? 'Isi remedial' : '-'}"
                      value="${valRemedial}"
                      ${isAbsent ? 'disabled' : ''}
                      class="input-remedial-field w-28 p-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-center text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                  </td>
                  <td class="py-3 px-3">
                    <input
                      type="text"
                      id="input-note-${s.nisn}"
                      data-nisn="${s.nisn}"
                      placeholder="Catatan..."
                      value="${entry?.note || ''}"
                      class="w-full p-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                    >
                  </td>
                  <td class="py-3 px-3 text-center">
                    ${entry ? `
                      <button
                        type="button"
                        data-module="nilai"
                        data-aksi="hapus"
                        data-id="${entry.id}"
                        class="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Hapus entri nilai ini"
                      >
                        🗑️
                      </button>
                    ` : `
                      <span class="text-slate-300 text-xs">-</span>
                    `}
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>

      <!-- Bottom Save Action Bar -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
        <div class="text-xs text-slate-500">
          💡 Klik <strong>Simpan Nilai 8 Siswa Sekaligus</strong> untuk memperbarui data ke penyimpanan dan menghitung ulang seluruh rekap.
        </div>
        <button id="btn-save-all-scores" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md transition flex items-center gap-2 cursor-pointer transform hover:scale-[1.01]">
          <span>💾</span> Simpan Nilai 8 Siswa Sekaligus
        </button>
      </div>
    </div>
  `;
}

function renderMatriksRekapView(students: Student[], settings: AssessmentSettings, allEntries: AssessmentEntry[]): string {
  const currentMapel = nilaiState.selectedMapel;
  const currentKKM = settings.kkmPerMapel[currentMapel] || 70;
  const rawData = nilaiState.semester === 2 ? RAW_KURIKULUM_SEM2 : RAW_KURIKULUM_SEM1;
  const rawMapel = rawData[currentMapel] || {};
  const babs = Object.keys(rawMapel).filter(b => !b.startsWith("Evaluasi"));

  // Extract all subbabs in order
  const allSubbabs: { bab: string; subbab: string; shortCode: string }[] = [];
  babs.forEach((bTitle, bIdx) => {
    const sList = (rawMapel[bTitle] || []).filter(s => !s.toLowerCase().includes("asesmen sumatif"));
    sList.forEach((sTitle, sIdx) => {
      allSubbabs.push({
        bab: bTitle,
        subbab: sTitle,
        shortCode: `B${bIdx + 1}.${sIdx + 1}`
      });
    });
  });

  return `
    <div class="space-y-6">
      <!-- Mapel Selector for Matriks -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
        <div class="flex items-center gap-3">
          <label class="font-bold text-xs text-slate-700">Pilih Mapel Matriks:</label>
          <select id="select-matriks-mapel" class="p-2 bg-white border border-slate-300 rounded-xl font-bold text-xs text-slate-800">
            ${LIST_MAPEL_SEM1.map(m => `
              <option value="${m}" ${nilaiState.selectedMapel === m ? 'selected' : ''}>${m}</option>
            `).join("")}
          </select>
        </div>
        <div class="flex items-center gap-3 text-xs">
          <span class="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl font-bold">
            KKM: ${currentKKM}
          </span>
          <span class="text-slate-500">Bobot: Harian ${settings.bobot.harian}%, Sumatif ${settings.bobot.sumatifBab}%, ASTS ${settings.bobot.asts}%, ASAS ${settings.bobot.asas}%</span>
        </div>
      </div>

      <!-- Matrix Table with Horizontal Scroll -->
      <div class="overflow-x-auto rounded-2xl border border-slate-200 max-h-[600px] relative">
        <table class="w-full text-left border-collapse text-xs whitespace-nowrap">
          <thead class="sticky top-0 z-10 bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th class="py-3 px-3 text-center w-10 sticky left-0 bg-slate-100 z-20">No</th>
              <th class="py-3 px-3 w-40 sticky left-10 bg-slate-100 z-20">Nama Siswa</th>
              <!-- Subbabs columns -->
              ${allSubbabs.map(s => `
                <th class="py-3 px-2 text-center border-l border-slate-200" title="${s.bab} - ${s.subbab}">
                  ${s.shortCode}
                </th>
              `).join("")}
              <th class="py-3 px-3 text-center bg-sky-50 text-sky-900 border-l border-sky-200">Rata TP</th>
              <!-- Sumatif Bab columns -->
              ${babs.map((b, i) => `
                <th class="py-3 px-2 text-center border-l border-slate-200" title="${b}">
                  Sum.B${i + 1}
                </th>
              `).join("")}
              <th class="py-3 px-3 text-center bg-teal-50 text-teal-900 border-l border-teal-200">Rata Sum</th>
              <th class="py-3 px-3 text-center bg-amber-50 text-amber-900 border-l border-amber-200">ASTS</th>
              <th class="py-3 px-3 text-center bg-purple-50 text-purple-900 border-l border-purple-200">ASAS</th>
              <th class="py-3 px-3 text-center bg-emerald-100 text-emerald-900 font-black border-l border-emerald-300">Nilai Akhir</th>
              <th class="py-3 px-3 text-center border-l border-slate-200">Status</th>
              <th class="py-3 px-3 text-center border-l border-slate-200">Reset Ujian</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            ${students.map((s, idx) => {
              const breakdown = calculateSubjectScoreBreakdown(s.nisn, currentMapel, nilaiState.semester, allEntries, settings);

              return `
                <tr class="hover:bg-slate-50">
                  <td class="py-3 px-3 text-center font-bold text-slate-400 sticky left-0 bg-white z-10">${s.no || idx + 1}</td>
                  <td class="py-3 px-3 font-semibold text-slate-900 sticky left-10 bg-white z-10 border-r border-slate-100 truncate max-w-[160px]">
                    <span class="mr-1">${s.avatar || '👦'}</span> ${s.nama}
                  </td>
                  <!-- Subbab values -->
                  ${allSubbabs.map(sb => {
                    const subData = breakdown.subbabAverages[sb.subbab];
                    const val = subData ? subData.avg : null;
                    const isBelow = val !== null && val < currentKKM;

                    return `
                      <td class="py-3 px-2 text-center font-mono border-l border-slate-100 ${isBelow ? 'text-rose-700 font-bold bg-rose-50/30' : ''}">
                        ${val !== null ? val : '<span class="text-slate-300">-</span>'}
                      </td>
                    `;
                  }).join("")}
                  <!-- Rata Harian -->
                  <td class="py-3 px-3 text-center font-mono font-bold bg-sky-50/50 text-sky-900 border-l border-sky-100">
                    ${breakdown.harianAvg !== null ? breakdown.harianAvg : '-'}
                  </td>
                  <!-- Sumatif Bab values -->
                  ${babs.map(b => {
                    const sumEntry = allEntries.find(e => e.nisn === s.nisn && e.mapel === currentMapel && e.semester === nilaiState.semester && e.category === 'sumatif_bab' && e.bab === b);
                    const val = sumEntry ? getEffectiveScore(sumEntry, settings.useRemedialMax) : null;
                    const isBelow = val !== null && val < currentKKM;

                    return `
                      <td class="py-3 px-2 text-center font-mono border-l border-slate-100 ${isBelow ? 'text-rose-700 font-bold bg-rose-50/30' : ''}">
                        ${val !== null ? val : '<span class="text-slate-300">-</span>'}
                      </td>
                    `;
                  }).join("")}
                  <!-- Rata Sumatif Bab -->
                  <td class="py-3 px-3 text-center font-mono font-bold bg-teal-50/50 text-teal-900 border-l border-teal-100">
                    ${breakdown.sumatifBabAvg !== null ? breakdown.sumatifBabAvg : '-'}
                  </td>
                  <!-- ASTS -->
                  <td class="py-3 px-3 text-center font-mono font-bold bg-amber-50/50 text-amber-900 border-l border-amber-100">
                    ${breakdown.astsScore !== null ? breakdown.astsScore : '-'}
                  </td>
                  <!-- ASAS -->
                  <td class="py-3 px-3 text-center font-mono font-bold bg-purple-50/50 text-purple-900 border-l border-purple-100">
                    ${breakdown.asasScore !== null ? breakdown.asasScore : '-'}
                  </td>
                  <!-- Nilai Akhir -->
                  <td class="py-3 px-3 text-center font-mono font-black text-sm bg-emerald-50 text-emerald-800 border-l border-emerald-200">
                    ${breakdown.finalScore !== null ? breakdown.finalScore : '<span class="text-slate-400 font-normal">Belum lengkap</span>'}
                  </td>
                  <!-- Status -->
                  <td class="py-3 px-3 text-center border-l border-slate-100">
                    ${breakdown.finalScore !== null ? (
                      breakdown.finalScore >= currentKKM ? `
                        <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">Tuntas ✓</span>
                      ` : `
                        <span class="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full font-bold text-[10px]">⚠️ Remedial</span>
                      `
                    ) : `
                      <span class="text-slate-400 text-[10px]">Proses</span>
                    `}
                  </td>
                  <!-- Reset Nilai Ujian CBT -->
                  <td class="py-3 px-3 text-center border-l border-slate-100">
                    <button
                      type="button"
                      class="btn-reset-matriks-cbt-student px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 mx-auto cursor-pointer"
                      data-nisn="${s.nisn}"
                      data-name="${s.nama}"
                      title="Reset nilai ujian CBT (ASTS & ASAS) untuk ${s.nama}"
                    >
                      <span>🗑️</span>
                      <span>Reset</span>
                    </button>
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

function renderRaporSiswaView(students: Student[], settings: AssessmentSettings, allEntries: AssessmentEntry[]): string {
  const selectedNisn = nilaiState.selectedStudentNisn || students[0].nisn;
  const currentStudent = students.find(s => s.nisn === selectedNisn) || students[0];
  const report = calculateStudentReport(currentStudent.nisn, nilaiState.semester);

  return `
    <div class="space-y-6">
      <!-- 8 Students Pills Selector -->
      <div>
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pilih Siswa untuk Melihat Rapor Nilai Lengkap:</label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          ${students.map(s => {
            const isSelected = s.nisn === currentStudent.nisn;
            const sReport = calculateStudentReport(s.nisn, nilaiState.semester);
            const avg = sReport.overallAverage !== null ? sReport.overallAverage : '-';

            return `
              <button
                type="button"
                id="btn-select-nilai-student-${s.nisn}"
                data-nisn="${s.nisn}"
                class="btn-select-nilai-student p-3 text-left rounded-2xl border transition flex items-center justify-between gap-2 cursor-pointer ${isSelected ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'}"
              >
                <div class="flex items-center gap-2 truncate">
                  <span class="text-base">${s.avatar || '👦'}</span>
                  <div class="truncate">
                    <div class="font-bold text-xs truncate">${s.nama}</div>
                    <div class="text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-400'} font-mono">No. ${s.no}</div>
                  </div>
                </div>
                <div class="font-mono text-xs font-bold ${isSelected ? 'text-white' : 'text-emerald-700'} shrink-0">
                  ${avg}
                </div>
              </button>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Student Report Card Banner -->
      <div class="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div class="flex items-center gap-3">
          ${currentStudent.avatar && currentStudent.avatar.startsWith('data:image/') ? `<img src="${currentStudent.avatar}" class="w-12 h-12 rounded-2xl object-cover border border-white/40 shadow-sm" alt="" />` : `<span class="text-4xl">${currentStudent.avatar || '👦'}</span>`}
          <div>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/20 rounded-md text-[10px] font-bold text-amber-200 mb-1">
              Rapor Asesmen Siswa • Semester ${nilaiState.semester}
            </div>
            <h3 class="text-xl font-black">${currentStudent.nama}</h3>
            <p class="text-xs text-emerald-100 font-mono">NISN: ${currentStudent.nisn} • No. Urut ${currentStudent.no}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="px-4 py-2 bg-white/10 backdrop-blur-xs rounded-xl text-center border border-white/20">
            <div class="text-[10px] font-bold opacity-80 uppercase">Mapel Tuntas</div>
            <div class="font-mono font-bold text-sm text-white">${report.completedSubjectsCount} / ${report.totalSubjectsCount}</div>
          </div>
          <div class="px-5 py-2.5 bg-amber-400 text-amber-950 rounded-2xl shadow-sm text-right">
            <div class="text-[10px] font-bold uppercase tracking-wider">Rata-Rata Umum</div>
            <div class="font-mono font-black text-xl">${report.overallAverage !== null ? report.overallAverage : '-'}</div>
          </div>
        </div>
      </div>

      <!-- Report Card Subjects Table -->
      <div class="overflow-x-auto rounded-2xl border border-slate-200">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th class="py-3 px-3.5 text-center w-12">No</th>
              <th class="py-3 px-3.5 w-44">Mata Pelajaran</th>
              <th class="py-3 px-3 text-center w-16">KKM</th>
              <th class="py-3 px-3 text-center w-20">Harian (TP)</th>
              <th class="py-3 px-3 text-center w-20">Sumatif Bab</th>
              <th class="py-3 px-3 text-center w-16">ASTS</th>
              <th class="py-3 px-3 text-center w-16">ASAS</th>
              <th class="py-3 px-3 text-center w-24 bg-emerald-50 text-emerald-900 font-black">Nilai Akhir</th>
              <th class="py-3 px-4">Deskripsi Capaian Kompetensi (Kurikulum Merdeka)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            ${LIST_MAPEL_SEM1.map((mapelName, idx) => {
              const breakdown = report.subjects[mapelName] || calculateSubjectScoreBreakdown(currentStudent.nisn, mapelName, nilaiState.semester, allEntries, settings);
              const isBelow = breakdown.isBelowKKM;

              return `
                <tr class="hover:bg-slate-50 transition">
                  <td class="py-3 px-3.5 text-center font-bold text-slate-400">${idx + 1}</td>
                  <td class="py-3 px-3.5 font-bold text-slate-900">${mapelName}</td>
                  <td class="py-3 px-3 text-center font-mono font-semibold text-slate-500">${breakdown.kkm}</td>
                  <td class="py-3 px-3 text-center font-mono font-bold text-sky-800">${breakdown.harianAvg !== null ? breakdown.harianAvg : '-'}</td>
                  <td class="py-3 px-3 text-center font-mono font-bold text-teal-800">${breakdown.sumatifBabAvg !== null ? breakdown.sumatifBabAvg : '-'}</td>
                  <td class="py-3 px-3 text-center font-mono font-bold text-amber-800">${breakdown.astsScore !== null ? breakdown.astsScore : '-'}</td>
                  <td class="py-3 px-3 text-center font-mono font-bold text-purple-800">${breakdown.asasScore !== null ? breakdown.asasScore : '-'}</td>
                  <td class="py-3 px-3 text-center font-mono font-black text-sm bg-emerald-50/70 ${isBelow ? 'text-rose-700' : 'text-emerald-800'}">
                    ${breakdown.finalScore !== null ? breakdown.finalScore : '<span class="text-slate-400 font-normal text-xs">Belum ada</span>'}
                  </td>
                  <td class="py-3 px-4 text-slate-700 leading-relaxed text-[11px]">
                    ${breakdown.capaianDeskripsi}
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

function renderPengaturanView(settings: AssessmentSettings): string {
  return `
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-5">
        <div>
          <h3 class="text-base font-bold text-slate-800 flex items-center gap-2">
            <span>⚙️</span> Pengaturan Bobot & Kriteria Ketuntasan Minimal (KKM)
          </h3>
          <p class="text-xs text-slate-500 mt-1">
            Sesuaikan bobot komponen nilai akhir dan nilai KKM per mata pelajaran.
          </p>
        </div>

        <!-- Bobot Komponen -->
        <div class="space-y-3 pt-2 border-t border-slate-200">
          <label class="block font-bold text-xs text-slate-700 uppercase tracking-wider">Bobot Komponen Nilai Akhir (%)</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span class="block font-semibold text-slate-600 mb-1">Harian (TP) %</span>
              <input type="number" id="setting-bobot-harian" value="${settings.bobot.harian}" min="0" max="100" class="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-center">
            </div>
            <div>
              <span class="block font-semibold text-slate-600 mb-1">Sumatif Bab %</span>
              <input type="number" id="setting-bobot-sumatif" value="${settings.bobot.sumatifBab}" min="0" max="100" class="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-center">
            </div>
            <div>
              <span class="block font-semibold text-slate-600 mb-1">ASTS (ATS 1) %</span>
              <input type="number" id="setting-bobot-asts" value="${settings.bobot.asts}" min="0" max="100" class="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-center">
            </div>
            <div>
              <span class="block font-semibold text-slate-600 mb-1">ASAS (ASAS 1) %</span>
              <input type="number" id="setting-bobot-asas" value="${settings.bobot.asas}" min="0" max="100" class="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-center">
            </div>
          </div>
          <span class="text-[11px] text-slate-400 block">Total bobot bawaan: 40% + 20% + 20% + 20% = 100%. Komponen yang belum ada nilainya otomatis dikeluarkan dan bobot dinormalisasi.</span>
        </div>

        <!-- Remedial Option -->
        <div class="pt-3 border-t border-slate-200 space-y-3">
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" id="setting-use-remedial-max" ${settings.useRemedialMax ? 'checked' : ''} class="w-4 h-4 text-emerald-600 rounded">
            <span class="text-xs font-semibold text-slate-700">
              Gunakan Nilai Tertinggi antara Nilai Asli dan Nilai Setelah Remedial untuk Rata-rata
            </span>
          </label>
        </div>

        <!-- KKM Per Mapel -->
        <div class="space-y-3 pt-3 border-t border-slate-200">
          <label class="block font-bold text-xs text-slate-700 uppercase tracking-wider">Nilai KKM per Mata Pelajaran</label>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            ${LIST_MAPEL_SEM1.map(m => `
              <div class="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2">
                <span class="font-medium text-slate-800 truncate">${m}</span>
                <input type="number" id="setting-kkm-${m.toLowerCase().replace(/\\s+/g, '_')}" data-mapel="${m}" value="${settings.kkmPerMapel[m] || 70}" min="50" max="100" class="w-14 p-1 border border-slate-300 rounded-lg text-center font-bold font-mono">
              </div>
            `).join("")}
          </div>
        </div>

        <div class="pt-4 flex justify-end">
          <button id="btn-save-assessment-settings" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs">
            💾 Simpan Pengaturan Nilai
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderCatatanPerubahanView(logs: any[]): string {
  return `
    <div class="space-y-4">
      <div>
        <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
          <span>📜</span> Catatan Perubahan Nilai (Audit Log)
        </h3>
        <p class="text-xs text-slate-500">Seluruh riwayat penambahan, pengeditan, dan penghapusan nilai tercatat otomatis.</p>
      </div>

      <div class="overflow-x-auto rounded-2xl border border-slate-200">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th class="py-3 px-3.5 w-36">Waktu</th>
              <th class="py-3 px-3.5 w-24">Tindakan</th>
              <th class="py-3 px-3.5">Ringkasan Aktivitas</th>
              <th class="py-3 px-3.5">Rincian Data</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            ${logs.length === 0 ? `
              <tr>
                <td colspan="4" class="py-8 text-center text-slate-400 italic">Belum ada catatan perubahan nilai.</td>
              </tr>
            ` : logs.map(l => `
              <tr class="hover:bg-slate-50/70">
                <td class="py-3 px-3.5 font-mono text-slate-500">${l.timestamp}</td>
                <td class="py-3 px-3.5">
                  <span class="px-2 py-0.5 rounded text-[11px] font-semibold ${
                    l.action === 'tambah' ? 'bg-emerald-100 text-emerald-800' :
                    l.action === 'edit' ? 'bg-amber-100 text-amber-800' :
                    l.action === 'hapus' ? 'bg-rose-100 text-rose-800' : 'bg-teal-100 text-teal-800'
                  }">
                    ${l.action.toUpperCase()}
                  </span>
                </td>
                <td class="py-3 px-3.5 font-medium text-slate-800">${l.summary}</td>
                <td class="py-3 px-3.5 font-mono text-slate-600 text-[11px]">
                  ${l.before ? `Sebelum: ${l.before.score !== null ? l.before.score : 'Kosong'} → ` : ''}
                  ${l.after ? `Sesudah: ${l.after.score !== null ? l.after.score : 'Kosong'}` : ''}
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderKotakSampahView(trashList: any[]): string {
  return `
    <div class="space-y-4">
      <div>
        <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
          <span>🗑️</span> Kotak Sampah Nilai
        </h3>
        <p class="text-xs text-slate-500">Nilai yang telah dihapus dapat dipulihkan kembali ke daftar asesmen atau dihapus permanen.</p>
      </div>

      <div class="overflow-x-auto rounded-2xl border border-slate-200">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th class="py-3 px-3.5 w-36">Dihapus Pada</th>
              <th class="py-3 px-3.5">Siswa</th>
              <th class="py-3 px-3.5">Mata Pelajaran</th>
              <th class="py-3 px-3.5">Kategori / Cakupan</th>
              <th class="py-3 px-3.5 text-center w-20">Nilai</th>
              <th class="py-3 px-3.5 text-center w-40">Tindakan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            ${trashList.length === 0 ? `
              <tr>
                <td colspan="6" class="py-8 text-center text-slate-400 italic">Kotak sampah nilai kosong bersih.</td>
              </tr>
            ` : trashList.map(t => {
              const item = t.item as AssessmentEntry;
              return `
                <tr class="hover:bg-slate-50/70">
                  <td class="py-3 px-3.5 font-mono text-slate-500">${t.deletedAt}</td>
                  <td class="py-3 px-3.5 font-bold text-slate-900">${item.studentName}</td>
                  <td class="py-3 px-3.5 font-semibold text-slate-800">${item.mapel}</td>
                  <td class="py-3 px-3.5 text-slate-600">
                    <span class="font-bold text-emerald-800">${item.category.toUpperCase()}</span>:
                    ${item.subbab || item.bab || '-'}
                  </td>
                  <td class="py-3 px-3.5 text-center font-mono font-bold text-slate-900">
                    ${item.score !== null ? item.score : '-'}
                  </td>
                  <td class="py-3 px-3.5 text-center">
                    <div class="inline-flex items-center gap-1.5">
                      <button type="button" data-module="nilai" data-aksi="pulihkan" data-id="${t.id}" class="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-bold transition cursor-pointer" title="Pulihkan nilai ini">
                        ♻️ Pulihkan
                      </button>
                      <button type="button" data-module="nilai" data-aksi="hapus_permanen" data-id="${t.id}" class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-lg font-bold transition cursor-pointer" title="Hapus permanen nilai ini">
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
