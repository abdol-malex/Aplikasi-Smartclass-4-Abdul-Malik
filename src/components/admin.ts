import {
  getStudents, saveStudents,
  getAttendance, saveAttendance,
  getSchedule, saveSchedule, resetScheduleToInitial,
  getPiket, savePiket, resetPiketToInitial,
  getPiketTasks, savePiketTasks,
  getReadingLogs, saveReadingLogs, detectLiterasiAsal,
  getCashTransactions, saveCashTransactions,
  getSavingsTransactions, saveSavingsTransactions,
  getScores, saveScores,
  getKKM, saveKKM,
  exportAllDataJSON, importAllDataJSON,
  getQuestions,
  getGameProgress, saveGameProgress,
  PiketScheduleFull,
  getTeacherPhoto
} from "../utils/storage";
import { Student } from "../data/students";
import { getCurrentDayName, WeekSchedule, ScheduleItem } from "../data/schedule";
import { setTeacherPassword } from "../utils/auth";
import { playClickSound } from "../utils/audio";

export function renderAdminDataSiswa(): string {
  const students = getStudents();
  return `
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>👥</span> Kelola Data Siswa Kelas 4
          </h2>
          <p class="text-xs text-slate-500">Tahun Ajaran 2026/2027 • Urutan presensi resmi SDN Banyurip</p>
        </div>
      </div>

      <!-- Form Tambah Siswa Baru -->
      <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
        <div>
          <label class="block font-semibold text-slate-700 mb-1">NIS (4 Digit)</label>
          <input type="text" id="new-student-nis" placeholder="1782" class="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono">
        </div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1">NISN (10 Digit)</label>
          <input type="text" id="new-student-nisn" placeholder="3169876543" class="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono">
        </div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Nama Lengkap Siswa</label>
          <input type="text" id="new-student-name" placeholder="Nama Lengkap" class="w-full p-2 bg-white border border-slate-300 rounded-lg">
        </div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Avatar Emoji</label>
          <select id="new-student-avatar" class="w-full p-2 bg-white border border-slate-300 rounded-lg">
            <option value="👦">👦 Laki-laki 1</option>
            <option value="🧒">🧒 Laki-laki 2</option>
            <option value="👧">👧 Perempuan 1</option>
            <option value="👩‍🦰">👩‍🦰 Perempuan 2</option>
          </select>
        </div>
        <div class="flex items-end">
          <button id="btn-save-new-student" class="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition">
            ➕ Tambah Siswa
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
              <th class="py-3 px-3 w-12 text-center">No</th>
              <th class="py-3 px-3">NIS</th>
              <th class="py-3 px-3">NISN</th>
              <th class="py-3 px-3">Nama Lengkap</th>
              <th class="py-3 px-3">PIN Login</th>
              <th class="py-3 px-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-600">
            ${students.map((s, idx) => `
              <tr class="hover:bg-slate-50/80 transition-colors">
                <td class="py-3 px-3 text-center font-bold text-slate-700">${s.no || idx + 1}</td>
                <td class="py-3 px-3 font-mono">${s.nis}</td>
                <td class="py-3 px-3 font-mono text-emerald-700 font-medium">${s.nisn}</td>
                <td class="py-3 px-3 font-semibold text-slate-800 flex items-center gap-2">
                  ${s.avatar && s.avatar.startsWith('data:image/') ? `<img src="${s.avatar}" class="w-6 h-6 rounded-full object-cover border border-slate-300 inline-block" alt="" />` : `<span class="text-lg">${s.avatar || "👦"}</span>`} ${s.nama}
                </td>
                <td class="py-3 px-3">
                  <span class="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md font-mono text-xs font-bold">
                    ${s.pin}
                  </span>
                </td>
                <td class="py-3 px-3 text-center">
                  <div class="inline-flex items-center gap-1">
                    <button id="btn-reset-pin-${s.nisn}" class="px-2 py-1 bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 rounded text-xs transition" title="Reset PIN ke 4 digit akhir NISN">
                      🔄 Reset PIN
                    </button>
                    <button id="btn-edit-student-${s.nisn}" class="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded text-xs transition">
                      ✏️ Edit
                    </button>
                    <button id="btn-del-student-${s.nisn}" class="px-2 py-1 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded text-xs transition">
                      🗑️
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

export function renderAdminAbsensi(selectedDate?: string): string {
  const students = getStudents();
  const today = selectedDate || new Date().toISOString().split("T")[0];
  const attendanceList = getAttendance();
  const currentRecord = attendanceList.find(a => a.date === today) || {
    date: today,
    status: students.reduce((acc, s) => ({ ...acc, [s.nisn]: "H" }), {} as Record<string, "H" | "S" | "I" | "A">)
  };

  const recordsForCalc = attendanceList.some(a => a.date === today)
    ? attendanceList.map(a => a.date === today ? currentRecord : a)
    : [...attendanceList, currentRecord];

  const totalDays = recordsForCalc.length || 1;
  let totalPresent = 0;
  let totalSick = 0;
  let totalPermission = 0;
  let totalAlpha = 0;

  recordsForCalc.forEach(rec => {
    Object.values(rec.status).forEach(st => {
      if (st === "H") totalPresent++;
      else if (st === "S") totalSick++;
      else if (st === "I") totalPermission++;
      else if (st === "A") totalAlpha++;
    });
  });

  const totalPossible = totalDays * (students.length || 1);
  const attendancePercentage = totalPossible > 0 ? Math.round((totalPresent / totalPossible) * 100) : 100;

  return `
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📋</span> Presensi & Rekap Kehadiran
          </h2>
          <p class="text-xs text-slate-500">Catat kehadiran harian H (Hadir), S (Sakit), I (Izin), A (Alpa)</p>
        </div>
        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
          <label class="text-xs font-semibold text-slate-600">Pilih Tanggal:</label>
          <input type="date" id="input-absensi-date" value="${today}" class="px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-slate-50 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none">
          <button id="btn-hadir-semua" class="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-lg text-sm font-semibold transition shadow-xs flex items-center gap-1.5 cursor-pointer" title="Ubah status semua siswa menjadi Hadir">
            ✅ Hadir Semua
          </button>
          <button id="btn-save-absensi" class="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-sm font-semibold transition shadow-xs flex items-center gap-1.5 cursor-pointer">
            💾 Simpan Absensi
          </button>
        </div>
      </div>

      <!-- Quick Stats Card -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
          <div class="text-xs font-semibold text-emerald-700">Tingkat Kehadiran</div>
          <div class="text-2xl font-black text-emerald-800" id="stat-att-percentage">${attendancePercentage}%</div>
          <div class="text-[10px] text-emerald-600" id="stat-att-detail">${totalPresent} hadir dari ${totalPossible} slot</div>
        </div>
        <div class="p-3 bg-sky-50 border border-sky-200 rounded-xl text-center">
          <div class="text-xs font-semibold text-sky-700">Sakit (S)</div>
          <div class="text-2xl font-black text-sky-800" id="stat-att-sick">${totalSick}</div>
          <div class="text-[10px] text-sky-600">Total hari sakit</div>
        </div>
        <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
          <div class="text-xs font-semibold text-amber-700">Izin (I)</div>
          <div class="text-2xl font-black text-amber-800" id="stat-att-permission">${totalPermission}</div>
          <div class="text-[10px] text-amber-600">Total hari izin</div>
        </div>
        <div class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center">
          <div class="text-xs font-semibold text-rose-700">Alpa (A)</div>
          <div class="text-2xl font-black text-rose-800" id="stat-att-alpha">${totalAlpha}</div>
          <div class="text-[10px] text-rose-600">Tanpa keterangan</div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
              <th class="py-3 px-3 text-center w-12">No</th>
              <th class="py-3 px-3">Nama Siswa</th>
              <th class="py-3 px-3">NISN</th>
              <th class="py-3 px-3 text-center">Status Kehadiran Hari Ini</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100" id="table-absensi-body">
            ${students.map((s, idx) => {
              const currentStatus = currentRecord.status[s.nisn] || "H";
              return `
                <tr class="hover:bg-slate-50/70 transition" data-student-nisn="${s.nisn}">
                  <td class="py-3 px-3 text-center font-bold text-slate-600">${idx + 1}</td>
                  <td class="py-3 px-3 font-semibold text-slate-800 flex items-center gap-2">
                    <span>${s.avatar || "👦"}</span> ${s.nama}
                  </td>
                  <td class="py-3 px-3 font-mono text-xs text-slate-500">${s.nisn}</td>
                  <td class="py-3 px-3 text-center">
                    <div class="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200" id="status-group-${s.nisn}">
                      ${["H", "S", "I", "A"].map((st) => {
                        const isSelected = currentStatus === st;
                        const colorMap: Record<string, string> = {
                          H: isSelected ? "bg-emerald-600 text-white shadow-sm" : "text-emerald-700 hover:bg-emerald-50",
                          S: isSelected ? "bg-sky-600 text-white shadow-sm" : "text-sky-700 hover:bg-sky-50",
                          I: isSelected ? "bg-amber-600 text-white shadow-sm" : "text-amber-700 hover:bg-amber-50",
                          A: isSelected ? "bg-rose-600 text-white shadow-sm" : "text-rose-700 hover:bg-rose-50",
                        };
                        return `
                          <button id="btn-att-${s.nisn}-${st}" data-nisn="${s.nisn}" data-status="${st}" class="btn-att-status px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${colorMap[st]}">
                            ${st}
                          </button>
                        `;
                      }).join("")}
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

// JADWAL PELAJARAN (Kelola Penuh)
export function renderAdminJadwal(selectedDay: string = "Senin"): string {
  const schedule = getSchedule();
  const currentDay = getCurrentDayName();
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
  const dayItems = schedule[selectedDay] || [];

  return `
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📅</span> Kelola Jadwal Pelajaran (Penuh)
          </h2>
          <p class="text-xs text-slate-500">
            Tambah, edit, hapus, urutkan otomatis, dan salin jadwal antar hari.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button id="btn-reset-jadwal-default" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition">
            🔄 Kembalikan ke Jadwal Awal
          </button>
          <button id="btn-print-jadwal" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition no-print">
            🖨️ Cetak
          </button>
        </div>
      </div>

      <!-- Day Selector Tabs -->
      <div class="flex items-center justify-between border-b border-slate-200 pb-2">
        <div class="flex gap-2 overflow-x-auto">
          ${days.map(d => `
            <button id="btn-jadwal-tab-${d}" data-day="${d}" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${d === selectedDay ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
              <span>${d}</span>
              ${d === currentDay ? '<span class="text-[9px] bg-white text-emerald-800 px-1 rounded-full font-black">HARI INI</span>' : ''}
            </button>
          `).join("")}
        </div>

        <!-- Copy Day Schedule Form -->
        <div class="hidden sm:flex items-center gap-2 text-xs">
          <span class="text-slate-500 font-semibold">Salin ke:</span>
          <select id="select-copy-target-day" class="p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold">
            ${days.filter(d => d !== selectedDay).map(d => `<option value="${d}">${d}</option>`).join("")}
          </select>
          <button id="btn-copy-schedule" data-from="${selectedDay}" class="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-xs transition">
            Salin Jadwal 📋
          </button>
        </div>
      </div>

      <!-- Form Tambah Baris Jadwal Baru -->
      <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
        <div class="font-bold text-xs text-slate-700 flex items-center gap-1.5">
          <span>➕</span> Tambah Mata Pelajaran ke Hari <strong>${selectedDay}</strong>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <label class="block font-semibold text-slate-600 mb-1">Jam Mulai</label>
            <input type="time" id="new-item-start" value="07:35" class="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono">
          </div>
          <div>
            <label class="block font-semibold text-slate-600 mb-1">Jam Selesai</label>
            <input type="time" id="new-item-end" value="09:20" class="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono">
          </div>
          <div class="sm:col-span-2">
            <label class="block font-semibold text-slate-600 mb-1">Nama Mata Pelajaran / Kegiatan</label>
            <input type="text" id="new-item-mapel" placeholder="Contoh: Matematika" class="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold">
          </div>
          <div class="flex items-end gap-2">
            <label class="flex items-center gap-1 text-xs text-slate-600 pb-2">
              <input type="checkbox" id="new-item-is-rest" class="rounded">
              <span>Waktu Istirahat</span>
            </label>
            <button id="btn-add-schedule-item" data-day="${selectedDay}" class="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition">
              Simpan 💾
            </button>
          </div>
        </div>
      </div>

      <!-- Schedule Table for Selected Day -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <th class="py-2.5 px-3 w-12 text-center">Urutan</th>
              <th class="py-2.5 px-3">Jam Pelajaran</th>
              <th class="py-2.5 px-3">Mata Pelajaran / Aktivitas</th>
              <th class="py-2.5 px-3 text-center">Kategori</th>
              <th class="py-2.5 px-3 text-center">Aksi Kelola</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            ${dayItems.length === 0 ? `
              <tr>
                <td colspan="5" class="py-8 text-center text-slate-400 italic">
                  Belum ada jadwal untuk hari ${selectedDay}. Tambahkan baris jadwal di atas!
                </td>
              </tr>
            ` : dayItems.map((it, idx) => `
              <tr class="hover:bg-slate-50">
                <td class="py-2.5 px-3 text-center font-mono font-bold text-slate-500">${idx + 1}</td>
                <td class="py-2.5 px-3 font-mono font-bold text-slate-800">${it.start} – ${it.end}</td>
                <td class="py-2.5 px-3 font-semibold text-slate-800">${it.mapel}</td>
                <td class="py-2.5 px-3 text-center">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${it.isRest ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}">
                    ${it.isRest ? 'Istirahat' : 'Pelajaran'}
                  </span>
                </td>
                <td class="py-2.5 px-3 text-center">
                  <div class="inline-flex items-center gap-1.5">
                    <button id="btn-edit-sched-${selectedDay}-${it.id}" data-day="${selectedDay}" data-id="${it.id}" class="px-2 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded text-xs transition">
                      ✏️ Edit
                    </button>
                    <button id="btn-del-sched-${selectedDay}-${it.id}" data-day="${selectedDay}" data-id="${it.id}" class="px-2 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded text-xs transition">
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

// JADWAL PIKET (Kelola Penuh)
export function renderAdminPiket(selectedDay: string = "Senin"): string {
  const students = getStudents();
  const piket = getPiket();
  const tasks = getPiketTasks();
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
  const assignments = piket[selectedDay] || [];
  const studentMap = new Map(students.map(s => [s.nisn, s]));

  return `
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>🧹</span> Kelola Jadwal Piket Siswa (Penuh)
          </h2>
          <p class="text-xs text-slate-500">
            Atur pembagian siswa dan tugas kebersihan kelas untuk Senin hingga Jumat.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button id="btn-shuffle-piket-fair" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition">
            🎲 Acak Ulang Adil
          </button>
          <button id="btn-clear-day-piket" data-day="${selectedDay}" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition">
            🗑️ Kosongkan Hari
          </button>
          <button id="btn-reset-piket-default" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition">
            🔄 Kembalikan ke Awal
          </button>
        </div>
      </div>

      <!-- Day Tabs -->
      <div class="flex gap-2 overflow-x-auto border-b border-slate-200 pb-2">
        ${days.map(d => {
          const count = (piket[d] || []).length;
          return `
            <button id="btn-piket-tab-${d}" data-day="${d}" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${d === selectedDay ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
              <span>${d}</span>
              <span class="px-1.5 py-0.2 rounded-full text-[10px] ${d === selectedDay ? 'bg-white text-emerald-800 font-black' : 'bg-slate-200 text-slate-600 font-bold'}">${count} Siswa</span>
            </button>
          `;
        }).join("")}
      </div>

      <!-- Form Tambah Siswa & Tugas ke Hari Ini -->
      <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
        <div class="font-bold text-xs text-slate-700 flex items-center gap-1.5">
          <span>➕</span> Tugaskan Siswa ke Hari <strong>${selectedDay}</strong>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label class="block font-semibold text-slate-600 mb-1">Pilih Siswa</label>
            <select id="piket-assign-student" class="w-full p-2 bg-white border border-slate-300 rounded-lg">
              ${students.map(s => `<option value="${s.nisn}">${s.avatar || "👦"} ${s.nama}</option>`).join("")}
            </select>
          </div>
          <div>
            <label class="block font-semibold text-slate-600 mb-1">Pilih Tugas Piket</label>
            <select id="piket-assign-task" class="w-full p-2 bg-white border border-slate-300 rounded-lg">
              ${tasks.map(t => `<option value="${t}">${t}</option>`).join("")}
            </select>
          </div>
          <div class="flex items-end">
            <button id="btn-add-piket-assignment" data-day="${selectedDay}" class="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition">
              ➕ Tambahkan ke Regu ${selectedDay}
            </button>
          </div>
        </div>
      </div>

      <!-- Current Day Piket Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <th class="py-2.5 px-3 w-12 text-center">No</th>
              <th class="py-2.5 px-3">Nama Siswa</th>
              <th class="py-2.5 px-3">NISN</th>
              <th class="py-2.5 px-3">Tugas Piket Kebersihan</th>
              <th class="py-2.5 px-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            ${assignments.length === 0 ? `
              <tr>
                <td colspan="5" class="py-8 text-center text-slate-400 italic">
                  Belum ada siswa yang ditugaskan piket pada hari ${selectedDay}.
                </td>
              </tr>
            ` : assignments.map((asg, idx) => {
              const st = studentMap.get(asg.nisn);
              return `
                <tr class="hover:bg-slate-50">
                  <td class="py-2.5 px-3 text-center font-bold text-slate-500">${idx + 1}</td>
                  <td class="py-2.5 px-3 font-semibold text-slate-800 flex items-center gap-2">
                    <span>${st?.avatar || "👦"}</span>
                    <span>${st?.nama || asg.nisn}</span>
                  </td>
                  <td class="py-2.5 px-3 font-mono text-slate-500">${asg.nisn}</td>
                  <td class="py-2.5 px-3 font-semibold text-emerald-800">
                    🧹 ${asg.task}
                  </td>
                  <td class="py-2.5 px-3 text-center">
                    <button id="btn-del-piket-${selectedDay}-${asg.id}" data-day="${selectedDay}" data-id="${asg.id}" class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-xs transition">
                      🗑️ Hapus
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

export function renderAdminLiterasi(): string {
  const students = getStudents();
  const logs = getReadingLogs();

  let validCount = 0;
  let flaggedCount = 0;
  let revisionCount = 0;

  logs.forEach(l => {
    const d = detectLiterasiAsal(l.note);
    if (l.status === "needs_revision") {
      revisionCount++;
    } else if (d.isLowEffort) {
      flaggedCount++;
    } else {
      validCount++;
    }
  });

  return `
    <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-bold text-amber-800 mb-2">
            <span>🛡️</span> Sistem Auto-Detection Literasi Aktif
          </div>
          <h2 class="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <span>📚</span> Pojok Baca Literasi Siswa
          </h2>
          <p class="text-xs text-slate-500 mt-1">
            Monitoring riwayat membaca dan deteksi otomatis kualitas isian Kesan / Tokoh Utama siswa (Anti-Jawaban Asal).
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            onclick="window.print()"
            class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>🖨️</span> Cetak Jurnal
          </button>
        </div>
      </div>

      <!-- Highlight Metric Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
          <div class="text-2xl font-black text-slate-800 font-mono">${logs.length}</div>
          <div class="text-[11px] font-bold text-slate-500 mt-0.5">Total Jurnal Buku</div>
        </div>

        <div class="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center">
          <div class="text-2xl font-black text-emerald-700 font-mono">${validCount}</div>
          <div class="text-[11px] font-bold text-emerald-800 mt-0.5">Valid & Bermakna ✅</div>
        </div>

        <div class="bg-amber-50 p-4 rounded-2xl border border-amber-300 text-center">
          <div class="text-2xl font-black text-amber-700 font-mono">${flaggedCount}</div>
          <div class="text-[11px] font-bold text-amber-900 mt-0.5">Indikasi Asal ⚠️</div>
        </div>

        <div class="bg-rose-50 p-4 rounded-2xl border border-rose-300 text-center">
          <div class="text-2xl font-black text-rose-700 font-mono">${revisionCount}</div>
          <div class="text-[11px] font-bold text-rose-900 mt-0.5">Perlu Diperbaiki 🔄</div>
        </div>
      </div>

      <!-- Input Form with Live Auto-Detection -->
      <div class="bg-gradient-to-br from-slate-50 to-sky-50/40 border border-slate-200 rounded-2xl p-5 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <h3 class="font-black text-xs sm:text-sm text-slate-800 flex items-center gap-2">
            <span>➕</span> Tambah / Catat Jurnal Membaca Siswa
          </h3>
          <span class="text-[11px] text-slate-500">Syarat minimal: <strong>4 kata</strong> & <strong>15 karakter</strong></span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          <div class="sm:col-span-3">
            <label class="block font-bold text-slate-700 mb-1">Pilih Siswa</label>
            <select id="literasi-student" class="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none">
              ${students.map(s => `<option value="${s.nisn}">${s.nama} (${s.nisn})</option>`).join("")}
            </select>
          </div>

          <div class="sm:col-span-4">
            <label class="block font-bold text-slate-700 mb-1">Judul Buku</label>
            <input type="text" id="literasi-title" placeholder="Contoh: Petualangan Si Kancil Cerdik" class="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none">
          </div>

          <div class="sm:col-span-2">
            <label class="block font-bold text-slate-700 mb-1">Halaman Dibaca</label>
            <input type="number" id="literasi-pages" value="12" min="1" max="1000" class="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none">
          </div>

          <div class="sm:col-span-3 flex items-end">
            <button id="btn-save-literasi" type="button" class="w-full py-2.5 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-black rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer">
              <span>💾</span> Simpan Jurnal Baca
            </button>
          </div>

          <div class="sm:col-span-12">
            <label class="block font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Kesan / Tokoh Utama Cerita:</span>
              <span id="admin-literasi-live-badge" class="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                Terlalu Singkat / Indikasi Asal ⚠️
              </span>
            </label>
            <textarea
              id="literasi-note"
              rows="2"
              placeholder="Tuliskan tokoh utama dan kesan ceritamu (contoh: Tokoh kancil sangat cerdik dan suka membantu kura-kura mencari makanan)."
              class="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
            ></textarea>
            <div id="admin-literasi-live-counter" class="mt-1 text-[11px] text-slate-500">
              Panjang teks: <strong id="admin-live-chars">0</strong> karakter, <strong id="admin-live-words">0</strong> kata. (Minimal 4 kata & 15 karakter).
            </div>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="overflow-hidden rounded-2xl border border-slate-200">
        <div class="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div class="font-black text-xs text-slate-800 flex items-center gap-2">
            <span>📋</span> Tabel Riwayat Pojok Baca & Deteksi Kualitas Jawaban
          </div>
          <div class="text-[11px] text-slate-500">
            Total terdata: <strong>${logs.length}</strong> catatan
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th class="py-3 px-3 w-10 text-center">No</th>
                <th class="py-3 px-3 w-24">Tanggal</th>
                <th class="py-3 px-3 min-w-[140px]">Nama Siswa</th>
                <th class="py-3 px-3 min-w-[140px]">Judul Buku</th>
                <th class="py-3 px-2 text-center w-16">Hal</th>
                <th class="py-3 px-3 min-w-[200px]">Kesan / Tokoh Utama</th>
                <th class="py-3 px-3 min-w-[170px] text-center">Deteksi Otomatis & Status</th>
                <th class="py-3 px-3 min-w-[150px] text-center">Tindakan Guru</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-600">
              ${logs.length === 0 ? `
                <tr>
                  <td colspan="8" class="py-10 text-center text-slate-400 italic">
                    Belum ada catatan buku yang dibaca. Ayo mulai mencatat bacaan siswa! 📖
                  </td>
                </tr>
              ` : logs.map((l, idx) => {
                const detection = detectLiterasiAsal(l.note);
                const isNeedsRevision = l.status === "needs_revision";
                const isLowEffort = detection.isLowEffort;

                return `
                  <tr class="hover:bg-slate-50/80 transition ${isNeedsRevision ? 'bg-rose-50/40' : isLowEffort ? 'bg-amber-50/30' : ''}">
                    <td class="py-3 px-3 text-center font-bold text-slate-400">${idx + 1}</td>
                    <td class="py-3 px-3 font-mono text-slate-600 whitespace-nowrap text-[11px]">${l.date}</td>
                    <td class="py-3 px-3">
                      <div class="font-bold text-slate-900">${l.studentName}</div>
                      <div class="font-mono text-[10px] text-slate-400">${l.nisn}</div>
                    </td>
                    <td class="py-3 px-3">
                      <div class="font-semibold text-sky-800">📖 ${l.bookTitle}</div>
                    </td>
                    <td class="py-3 px-2 text-center font-bold font-mono text-slate-700">${l.pages}</td>
                    <td class="py-3 px-3">
                      <div class="text-slate-700 font-medium leading-relaxed bg-white/70 p-2 rounded-lg border border-slate-200/80 text-[11px]">
                        "${l.note}"
                      </div>
                    </td>
                    <td class="py-3 px-3 text-center">
                      ${isNeedsRevision ? `
                        <div class="inline-flex flex-col items-center gap-1">
                          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                            ⚠️ Indikasi Asal
                          </span>
                          <span class="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-600 text-white shadow-2xs">
                            Status Siswa: "Perlu Diperbaiki"
                          </span>
                          <span class="text-[10px] text-slate-500 italic max-w-[180px] truncate" title="${l.teacherNote || ''}">
                            ${l.teacherNote || 'Diminta Isi Ulang'}
                          </span>
                        </div>
                      ` : isLowEffort ? `
                        <div class="inline-flex flex-col items-center gap-1">
                          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                            ⚠️ Indikasi Asal
                          </span>
                          <span class="text-[10px] font-semibold text-amber-700">
                            ${detection.reason}
                          </span>
                        </div>
                      ` : `
                        <div class="inline-flex flex-col items-center gap-1">
                          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Valid ✅
                          </span>
                          <span class="text-[10px] text-emerald-600">
                            ${detection.wordCount} kata • ${detection.charCount} karakter
                          </span>
                        </div>
                      `}
                    </td>
                    <td class="py-3 px-3 text-center">
                      <div class="flex items-center justify-center gap-1.5 flex-wrap">
                        ${isNeedsRevision ? `
                          <button
                            type="button"
                            class="btn-cancel-revision-literasi px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                            data-id="${l.id}"
                            title="Batalkan permintaan isi ulang"
                          >
                            Batal Tolak
                          </button>
                        ` : isLowEffort ? `
                          <button
                            type="button"
                            class="btn-request-revision-literasi px-3 py-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1 cursor-pointer"
                            data-id="${l.id}"
                            title="Tolak isian ini dan minta siswa untuk mengisi ulang dengan lebih lengkap"
                          >
                            <span>🔄</span>
                            <span>Minta Isi Ulang</span>
                          </button>
                        ` : `
                          <span class="text-emerald-700 font-bold text-xs inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded-lg border border-emerald-200">
                            <span>✓</span> <span>Diterima</span>
                          </span>
                        `}
                        <button
                          type="button"
                          class="btn-delete-literasi p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                          data-id="${l.id}"
                          title="Hapus riwayat bacaan"
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
    </div>
  `;
}

export { renderAdminKas, kasState, setKasState } from "./adminKas";
export { renderAdminTabungan, tabunganState, setTabunganState } from "./adminTabungan";
export { renderAdminNilai, nilaiState, setNilaiState } from "./adminNilai";

export function renderAdminMonitor(): string {
  const students = getStudents();

  return `
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📈</span> Monitor Progres Belajar & Game Siswa
          </h2>
          <p class="text-xs text-slate-500">Pantau XP ⭐, Koin 🪙, Permata Ilmu 💎, Kejadian Remedial, dan Riwayat Soal</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${students.map(s => {
          const progS1 = getGameProgress(s.nisn, 1);
          const answeredCount = Object.values(progS1.answeredQuestionIds).reduce((acc, arr) => acc + arr.length, 0);

          return `
            <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/70 space-y-3">
              <div class="flex justify-between items-start">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">${s.avatar || "👦"}</span>
                  <div>
                    <h3 class="font-bold text-slate-800 text-sm">${s.nama}</h3>
                    <p class="text-[11px] font-mono text-slate-500">NISN: ${s.nisn}</p>
                  </div>
                </div>
                <button id="btn-reset-history-${s.nisn}" class="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-lg text-xs font-semibold transition" title="Kosongkan riwayat agar siswa bisa memulai bank soal baru">
                  🔄 Reset Riwayat Soal
                </button>
              </div>

              <div class="grid grid-cols-4 gap-2 text-center">
                <div class="p-2 bg-white rounded-lg border border-slate-200">
                  <div class="text-[10px] text-slate-400">Total XP</div>
                  <div class="font-black text-amber-600 text-sm font-mono">⭐ ${progS1.xp}</div>
                </div>
                <div class="p-2 bg-white rounded-lg border border-slate-200">
                  <div class="text-[10px] text-slate-400">Koin</div>
                  <div class="font-black text-yellow-600 text-sm font-mono">🪙 ${progS1.coins}</div>
                </div>
                <div class="p-2 bg-white rounded-lg border border-slate-200">
                  <div class="text-[10px] text-slate-400">Permata</div>
                  <div class="font-black text-emerald-600 text-sm font-mono">💎 ${progS1.gems.length}/10</div>
                </div>
                <div class="p-2 bg-white rounded-lg border border-slate-200">
                  <div class="text-[10px] text-slate-400">Remedial</div>
                  <div class="font-black text-rose-600 text-sm font-mono">${progS1.remedialCount}x</div>
                </div>
              </div>

              <div class="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 flex justify-between items-center">
                <span>Soal telah dijawab: <strong>${answeredCount}</strong> soal</span>
                <span class="text-[11px] text-slate-400">Status: Aktif</span>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

export function renderAdminBackup(): string {
  const teacherPhoto = getTeacherPhoto();

  return `
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div class="pb-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>⚙️</span> Pengaturan Sistem & Cadangan Data
          </h2>
          <p class="text-xs text-slate-500">Ekspor data Excel/JSON, Google Drive, dan pencadangan sistem kelas</p>
        </div>
        <button
          type="button"
          id="btn-backup-export-excel"
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <span>📥</span> Export Semua Data Ke Excel
        </button>
      </div>

      <!-- Ganti Password Guru -->
      <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
          <span>🔑</span> Ganti Kata Sandi Akun Guru
        </h3>
        <p class="text-xs text-slate-500">Kata sandi baru akan dienkripsi dengan standar aman SHA-256 (Web Cryptography API).</p>
        <div class="flex flex-col sm:flex-row gap-3 max-w-md">
          <input type="password" id="input-new-teacher-pwd" placeholder="Masukkan password baru..." class="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm flex-1">
          <button id="btn-save-teacher-pwd" class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-bold transition">
            Simpan Sandi Baru
          </button>
        </div>
      </div>

      <!-- Ekspor & Impor Cadangan Lengkap -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3">
          <h3 class="font-bold text-emerald-900 text-sm flex items-center gap-2">
            <span>💾</span> Cadangkan Seluruh Data (Ekspor JSON)
          </h3>
          <p class="text-xs text-emerald-700 leading-relaxed">
            Unduh seluruh arsip data kelas (siswa, absensi, jadwal, piket, kas, tabungan, nilai, materi, bank soal, hasil grafik) ke dalam format file JSON.
          </p>
          <button id="btn-export-full-data" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition">
            ⬇️ Unduh File Cadangan (JSON)
          </button>
        </div>

        <div class="p-4 bg-sky-50/70 border border-sky-200 rounded-xl space-y-3 md:col-span-2">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 class="font-bold text-sky-950 text-sm flex items-center gap-2">
                <span>☁️</span> Google Drive Terpadu Kelas 4
              </h3>
              <p class="text-xs text-sky-800 leading-relaxed mt-0.5">
                Sinkronkan dan cadangkan seluruh arsip dokumen, nilai, rekap administrasi, dan inventaris langsung ke Google Drive awan SDN Banyurip.
              </p>
            </div>
            <button
              type="button"
              id="btn-goto-google-drive"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
            >
              <span>📂</span> Buka Google Drive Kelas 4
            </button>
          </div>
        </div>

        <div class="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-3">
          <h3 class="font-bold text-amber-900 text-sm flex items-center gap-2">
            <span>📥</span> Pulihkan Data dari Cadangan (Impor JSON)
          </h3>
          <p class="text-xs text-amber-700 leading-relaxed">
            Tempelkan isi file cadangan JSON atau unggah file untuk memulihkan seluruh data aplikasi.
          </p>
          <textarea id="textarea-import-data" rows="3" placeholder="Tempelkan kode JSON di sini..." class="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs font-mono"></textarea>
          <button id="btn-import-full-data" class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold transition">
            Pulihkan Data
          </button>
        </div>
      </div>
    </div>
  `;
}
