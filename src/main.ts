import "./index.css";
import {
  getCurrentSession, setCurrentSession, clearCurrentSession,
  authenticateTeacher, authenticateStudent, setTeacherPassword
} from "./utils/auth";
import {
  getStudents, saveStudents,
  getSchedule, saveSchedule, resetScheduleToInitial,
  getPiket, savePiket, resetPiketToInitial, getPiketTasks,
  getAttendance, saveAttendance,
  getReadingLogs, saveReadingLogs, requestLiterasiRevision, cancelLiterasiRevision,
  saveReadingLogItem, deleteReadingLog, detectLiterasiAsal,
  getCashTransactions, saveCashTransactions, calculateCashBalance,
  getSavingsTransactions, saveSavingsTransactions, calculateStudentSavingsBalance, validateSavingsChronology,
  getScores, saveScores,
  getKKM, saveKKM,
  exportAllDataJSON, importAllDataJSON,
  getGameProgress, saveGameProgress,
  loadBankSoalFromDOM,
  recordQuizAnswer, recordQuizSession,
  getCertificates, saveCertificates, resetCertificatesToDefault, CertificateItem,
  getAssessmentEntries, saveAssessmentEntries, getAssessmentSettings, saveAssessmentSettings,
  AssessmentEntry, calculateSubjectScoreBreakdown,
  addAuditLog, getTrashItems, saveTrashItems, addToTrash,
  resetStudentAllCBTExamScores, resetStudentCBTExamScore,
  CashTransaction, SavingsTransaction,
  getInventaris, saveInventaris, InventarisItem,
  getStudentPhoto, saveStudentPhoto, deleteStudentPhoto,
  getTeacherPhoto, saveTeacherPhoto, deleteTeacherPhoto
} from "./utils/storage";
import { INITIAL_STUDENTS, Student } from "./data/students";
import { RAW_KURIKULUM_SEM1, RAW_KURIKULUM_SEM2, LIST_MAPEL_SEM1, LIST_MAPEL_SEM2 } from "./data/kurikulum";
import {
  playClickSound, playCorrectSound, playWrongSound,
  playFanfareSound, playRemedialSound,
  isAudioMuted, toggleAudioMuted
} from "./utils/audio";
import {
  renderAdminDataSiswa, renderAdminAbsensi, renderAdminJadwal,
  renderAdminPiket, renderAdminLiterasi, renderAdminKas,
  renderAdminTabungan, renderAdminNilai, renderAdminMonitor,
  renderAdminBackup, kasState, setKasState,
  tabunganState, setTabunganState,
  nilaiState, setNilaiState
} from "./components/admin";
import { renderAdminInventaris, inventarisState, setInventarisState } from "./components/adminInventaris";
import { renderGoogleDriveView, driveState, setDriveState } from "./components/googleDriveView";
import {
  googleSignIn, logoutGoogle, initAuth,
  listDriveFiles, uploadDriveFile, createDriveFolder,
  deleteDriveFile, getAccessToken, getGoogleUser, SCOPES as GOOGLE_DRIVE_SCOPES
} from "./services/googleDriveService";
import { exportAllDataToExcel } from "./utils/excelExport";
import { renderMateriPortal } from "./components/materiView";
import {
  renderGameLobby, renderActiveQuiz, renderRemedialView, renderQuizResults,
  prepareQuizQuestions, ActiveQuizSession, GAME_LEVELS
} from "./components/game";
import { renderGrafikHasilBelajar } from "./components/grafikHasilBelajar";
import { renderCertificatesView } from "./components/certificate";
import { renderStudentDashboard } from "./components/studentDashboard";
import { renderStudentFinanceView } from "./components/studentFinance";
import { renderStudentScoresView } from "./components/studentScoresView";
import {
  renderStudentLiterasiView, studentLiterasiState, setStudentLiterasiEditingId
} from "./components/studentLiterasiView";
import {
  renderCBTExamView, bindCBTExamEvents, cbtExamState, setCBTExamState
} from "./components/cbtExam";
import { downloadStandaloneHTML } from "./utils/singleFileExport";
import { openEditProfilModal } from "./components/modalEditProfil";

declare global {
  interface Window {
    hapusBarangInventaris: (id: string) => void;
    hapusInventarisItem: (id: string, event?: Event) => void;
    editInventarisItem: (id: string, event?: Event) => void;
  }
}

// State
let currentView = "dashboard";
let currentSemester: 1 | 2 = 1;
let currentMateriMapel = "Pendidikan Pancasila";
let currentMateriSearch = "";
let currentAdminJadwalDay = "Senin";
let currentAdminPiketDay = "Senin";
let currentAdminAbsensiDate = new Date().toISOString().split("T")[0];
let currentGrafikMapelFilter = "Semua Mapel";
let currentGrafikStudentFilter = "ALL";
let activeQuiz: ActiveQuizSession | null = null;
let remedialCountdown = 10;
let remedialTimerInterval: any = null;
let mobileMenuOpen = false;
let loginMode: "murid" | "guru" = "murid";

const root = document.getElementById("root");

// Load bank questions dynamically from DOM <script data-bank="..."> blocks
loadBankSoalFromDOM();

// Image Compression Helper for LocalStorage Base64 Profiles
function compressImage(file: File, maxWidth = 256, maxHeight = 256, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Gagal membaca berkas gambar"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Gagal membuka file"));
    reader.readAsDataURL(file);
  });
}

function navigateTo(view: string) {
  const session = getCurrentSession();
  // Role Protection
  if (session?.role === "murid" && view.startsWith("admin-")) {
    currentView = "dashboard";
    renderApp();
    return;
  }
  if (view === "cbt-exam") {
    if (session?.student) {
      cbtExamState.activeStudentNisn = session.student.nisn;
    }
    if (!cbtExamState.examStarted) {
      cbtExamState.viewMode = "lobby";
    }
  } else if (view === "cbt-rekap") {
    cbtExamState.viewMode = "recap";
  } else if (view === "google-drive") {
    const user = getGoogleUser();
    if (user && driveState.files.length === 0 && !driveState.isLoading) {
      setTimeout(() => refreshDriveFilesList(), 50);
    }
  }
  currentView = view;
  mobileMenuOpen = false;
  renderApp();
}

function bindButton(id: string, handler: (e: MouseEvent) => void) {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("click", (e) => {
      console.log(`[BTN] ${id}`);
      playClickSound();
      try {
        handler(e);
      } catch (err) {
        console.error(`[BTN-ERR] ${id}:`, err);
        alert("Terjadi kendala saat memproses tindakan: " + (err as Error).message);
      }
    });
  }
}

// Modal and Toast State for Financial, Certificate, and Assessment Transactions
interface FinancialModalState {
  type: "edit_kas" | "hapus_kas" | "edit_tabungan" | "hapus_tabungan" | "hapus_permanen_kas" | "hapus_permanen_tabungan" | "edit_sertifikat" | "hapus_sertifikat" | "tambah_sertifikat" | "hapus_nilai" | null;
  targetId: string | null;
  error?: string | null;
}

let activeFinancialModal: FinancialModalState = {
  type: null,
  targetId: null,
  error: null,
};

interface ToastNotification {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
}
let activeToasts: ToastNotification[] = [];

export function showToast(message: string, type: "success" | "error" | "warning" | "info" = "success") {
  const id = "toast_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
  activeToasts.push({ id, message, type });
  renderToastsOnly();
  setTimeout(() => {
    activeToasts = activeToasts.filter(t => t.id !== id);
    renderToastsOnly();
  }, 4000);
}

function renderToastsOnly() {
  const container = document.getElementById("toast-container");
  if (container) {
    container.innerHTML = activeToasts.map(t => `
      <div class="pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold transition-all transform animate-bounce-in ${
        t.type === 'success' ? 'bg-emerald-800 text-white border-emerald-600' :
        t.type === 'error' ? 'bg-rose-800 text-white border-rose-600' :
        t.type === 'warning' ? 'bg-amber-800 text-white border-amber-600' :
        'bg-slate-800 text-white border-slate-700'
      }">
        <span class="text-base">${t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : t.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
        <span class="leading-tight">${t.message}</span>
        <button type="button" data-aksi="tutup_toast" data-id="${t.id}" class="ml-2 text-white/70 hover:text-white font-bold cursor-pointer">✕</button>
      </div>
    `).join("");
  }
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderFinancialModal(): string {
  if (!activeFinancialModal.type || !activeFinancialModal.targetId) return "";

  const students = getStudents();

  if (activeFinancialModal.type === "edit_kas") {
    const tx = getCashTransactions().find(t => t.id === activeFinancialModal.targetId);
    if (!tx) return "";

    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden transform transition-all">
          <div class="px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="text-xl">✏️</span>
              <h3 class="font-bold text-base">Edit Transaksi Arus Kas</h3>
            </div>
            <button type="button" data-aksi="tutup_modal" class="p-1 hover:bg-white/20 rounded-full text-white font-bold cursor-pointer transition">✕</button>
          </div>

          <div class="p-6 space-y-4 text-xs">
            <div class="text-[11px] text-slate-500 font-mono bg-slate-50 p-2 rounded-xl border border-slate-200">
              ID Transaksi: <strong>${tx.id}</strong>
            </div>

            ${activeFinancialModal.error ? `
              <div class="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-bold flex items-center gap-2">
                <span>⚠️</span>
                <span>${activeFinancialModal.error}</span>
              </div>
            ` : ''}

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Tanggal Transaksi *</label>
                <input type="date" id="modal-kas-date" value="${tx.date}" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Jenis Transaksi *</label>
                <select id="modal-kas-type" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="masuk" ${tx.type === 'masuk' ? 'selected' : ''}>Pemasukan (+) Masuk</option>
                  <option value="keluar" ${tx.type === 'keluar' ? 'selected' : ''}>Pengeluaran (-) Keluar</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Kategori *</label>
                <select id="modal-kas-category" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="Iuran Kas" ${tx.category === 'Iuran Kas' ? 'selected' : ''}>Iuran Kas</option>
                  <option value="Uang Sosial" ${tx.category === 'Uang Sosial' ? 'selected' : ''}>Uang Sosial / Peduli</option>
                  <option value="ATK / Fotokopi" ${tx.category === 'ATK / Fotokopi' ? 'selected' : ''}>ATK / Fotokopi</option>
                  <option value="Kegiatan Kelas" ${tx.category === 'Kegiatan Kelas' ? 'selected' : ''}>Kegiatan Kelas / Lomba</option>
                  <option value="Lainnya" ${tx.category === 'Lainnya' ? 'selected' : ''}>Lainnya</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Siswa Pembayar (Untuk Iuran)</label>
                <select id="modal-kas-student" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="">-- Bukan Iuran Siswa --</option>
                  ${students.map(s => `
                    <option value="${s.nisn}" ${tx.nisn === s.nisn ? 'selected' : ''}>${s.nama}</option>
                  `).join("")}
                </select>
              </div>

              <div class="sm:col-span-2">
                <label class="block font-bold text-slate-700 mb-1">Nominal (Rp) *</label>
                <input type="number" id="modal-kas-amount" value="${tx.amount}" min="500" step="500" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
              </div>

              <div class="sm:col-span-2">
                <label class="block font-bold text-slate-700 mb-1">Keterangan Transaksi *</label>
                <input type="text" id="modal-kas-desc" value="${escapeHtml(tx.description)}" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
              </div>
            </div>

            <div class="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
              <button type="button" data-aksi="tutup_modal" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer transition">
                Batal
              </button>
              <button type="button" data-aksi="simpan_edit_kas_modal" data-id="${tx.id}" class="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-md cursor-pointer transition flex items-center gap-1.5">
                <span>💾 Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (activeFinancialModal.type === "hapus_kas") {
    const tx = getCashTransactions().find(t => t.id === activeFinancialModal.targetId);
    if (!tx) return "";

    const descSnippet = tx.studentName ? `dari siswa <strong>${escapeHtml(tx.studentName)}</strong> ` : "";

    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden transform transition-all">
          <div class="px-6 py-4 bg-gradient-to-r from-rose-600 to-rose-700 text-white flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="text-xl">🗑️</span>
              <h3 class="font-bold text-base">Konfirmasi Hapus Kas</h3>
            </div>
            <button type="button" data-aksi="tutup_modal" class="p-1 hover:bg-white/20 rounded-full text-white font-bold cursor-pointer transition">✕</button>
          </div>

          <div class="p-6 space-y-4 text-xs">
            <p class="text-slate-600 text-sm">
              Apakah Anda yakin ingin menghapus transaksi ${tx.type === "masuk" ? "pemasukan" : "pengeluaran"} ${descSnippet}berikut?
            </p>

            <div class="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1.5">
              <div class="flex justify-between items-center">
                <span class="text-slate-500 font-semibold">Jenis:</span>
                <span class="font-bold ${tx.type === 'masuk' ? 'text-emerald-700' : 'text-rose-700'}">${tx.type === 'masuk' ? 'Pemasukan (+)' : 'Pengeluaran (-)'} (${tx.category})</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-500 font-semibold">Nominal:</span>
                <span class="font-mono font-black text-slate-900 text-sm">Rp ${tx.amount.toLocaleString("id-ID")}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-500 font-semibold">Tanggal:</span>
                <span class="font-mono font-medium text-slate-700">${tx.date}</span>
              </div>
              <div class="flex justify-between items-start">
                <span class="text-slate-500 font-semibold">Keterangan:</span>
                <span class="font-medium text-slate-800 text-right max-w-[200px]">${escapeHtml(tx.description)}</span>
              </div>
              ${tx.studentName ? `
                <div class="flex justify-between items-center pt-1 border-t border-rose-200/60">
                  <span class="text-slate-500 font-semibold">Siswa:</span>
                  <span class="font-bold text-slate-800">${escapeHtml(tx.studentName)}</span>
                </div>
              ` : ''}
            </div>

            <div class="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-[11px] leading-relaxed">
              💡 Transaksi ini akan dipindahkan ke <strong>Kotak Sampah</strong> dan saldo kas kelas akan otomatis dihitung ulang. Anda dapat memulihkannya kapan saja dari menu Kotak Sampah.
            </div>

            <div class="pt-2 flex justify-end gap-2.5">
              <button type="button" data-aksi="tutup_modal" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer transition">
                Batal
              </button>
              <button type="button" data-aksi="konfirmasi_hapus_kas_modal" data-id="${tx.id}" class="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md cursor-pointer transition flex items-center gap-1.5">
                <span>🗑️ Ya, Hapus ke Sampah</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (activeFinancialModal.type === "edit_tabungan") {
    const tx = getSavingsTransactions().find(t => t.id === activeFinancialModal.targetId);
    if (!tx) return "";

    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden transform transition-all">
          <div class="px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="text-xl">✏️</span>
              <h3 class="font-bold text-base">Edit Transaksi Tabungan Siswa</h3>
            </div>
            <button type="button" data-aksi="tutup_modal" class="p-1 hover:bg-white/20 rounded-full text-white font-bold cursor-pointer transition">✕</button>
          </div>

          <div class="p-6 space-y-4 text-xs">
            <div class="text-[11px] text-slate-500 font-mono bg-slate-50 p-2 rounded-xl border border-slate-200">
              ID Transaksi: <strong>${tx.id}</strong>
            </div>

            ${activeFinancialModal.error ? `
              <div class="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-bold flex items-start gap-2">
                <span class="text-base">❌</span>
                <div class="leading-relaxed">${activeFinancialModal.error}</div>
              </div>
            ` : ''}

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="sm:col-span-2">
                <label class="block font-bold text-slate-700 mb-1">Pilih Siswa *</label>
                <select id="modal-tabungan-student" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                  ${students.map(s => `
                    <option value="${s.nisn}" ${tx.nisn === s.nisn ? 'selected' : ''}>
                      ${s.no}. ${s.nama} (${s.nisn})
                    </option>
                  `).join("")}
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Tanggal Transaksi *</label>
                <input type="date" id="modal-tabungan-date" value="${tx.date}" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Jenis Transaksi *</label>
                <select id="modal-tabungan-type" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="setor" ${tx.type === 'setor' ? 'selected' : ''}>Setoran (+) Masuk</option>
                  <option value="tarik" ${tx.type === 'tarik' ? 'selected' : ''}>Penarikan (-) Ambil Uang</option>
                </select>
              </div>

              <div class="sm:col-span-2">
                <label class="block font-bold text-slate-700 mb-1">Nominal (Rp) *</label>
                <input type="number" id="modal-tabungan-amount" value="${tx.amount}" min="500" step="500" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
              </div>

              <div class="sm:col-span-2">
                <label class="block font-bold text-slate-700 mb-1">Catatan / Keterangan</label>
                <input type="text" id="modal-tabungan-note" value="${escapeHtml(tx.note || '')}" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
              </div>
            </div>

            <div class="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
              <button type="button" data-aksi="tutup_modal" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer transition">
                Batal
              </button>
              <button type="button" data-aksi="simpan_edit_tabungan_modal" data-id="${tx.id}" class="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-md cursor-pointer transition flex items-center gap-1.5">
                <span>💾 Simpan Perubahan Tabungan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (activeFinancialModal.type === "hapus_tabungan") {
    const tx = getSavingsTransactions().find(t => t.id === activeFinancialModal.targetId);
    if (!tx) return "";

    const allTx = getSavingsTransactions();
    const simulated = allTx.filter(t => t.id !== tx.id);
    const valRes = validateSavingsChronology(tx.nisn, simulated);

    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden transform transition-all">
          <div class="px-6 py-4 bg-gradient-to-r from-rose-600 to-rose-700 text-white flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="text-xl">🗑️</span>
              <h3 class="font-bold text-base">Konfirmasi Hapus Tabungan</h3>
            </div>
            <button type="button" data-aksi="tutup_modal" class="p-1 hover:bg-white/20 rounded-full text-white font-bold cursor-pointer transition">✕</button>
          </div>

          <div class="p-6 space-y-4 text-xs">
            <p class="text-slate-600 text-sm">
              Apakah Anda yakin ingin menghapus transaksi tabungan berikut?
            </p>

            <div class="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1.5">
              <div class="flex justify-between items-center">
                <span class="text-slate-500 font-semibold">Nama Siswa:</span>
                <span class="font-bold text-slate-900">${escapeHtml(tx.studentName)}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-500 font-semibold">Jenis:</span>
                <span class="font-bold ${tx.type === 'setor' ? 'text-emerald-700' : 'text-rose-700'}">${tx.type === 'setor' ? 'Setoran (+) Masuk' : 'Penarikan (-) Ambil'}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-500 font-semibold">Nominal:</span>
                <span class="font-mono font-black text-slate-900 text-sm">Rp ${tx.amount.toLocaleString("id-ID")}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-500 font-semibold">Tanggal:</span>
                <span class="font-mono font-medium text-slate-700">${tx.date}</span>
              </div>
              <div class="flex justify-between items-start">
                <span class="text-slate-500 font-semibold">Catatan:</span>
                <span class="font-medium text-slate-800 text-right max-w-[200px]">${escapeHtml(tx.note || '-')}</span>
              </div>
            </div>

            ${!valRes.valid ? `
              <div class="p-4 bg-rose-100 border border-rose-300 text-rose-900 rounded-2xl space-y-1">
                <div class="font-black text-sm flex items-center gap-1.5">
                  <span>⛔</span> Penghapusan Ditolak!
                </div>
                <div class="text-[11px] leading-relaxed">
                  ${valRes.message}
                </div>
              </div>
            ` : `
              <div class="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-[11px] leading-relaxed">
                💡 Transaksi tabungan ini akan dipindahkan ke <strong>Kotak Sampah Tabungan</strong> dan saldo siswa terhitung ulang secara otomatis.
              </div>
            `}

            <div class="pt-2 flex justify-end gap-2.5">
              <button type="button" data-aksi="tutup_modal" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer transition">
                ${!valRes.valid ? 'Tutup' : 'Batal'}
              </button>
              ${valRes.valid ? `
                <button type="button" data-aksi="konfirmasi_hapus_tabungan_modal" data-id="${tx.id}" class="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md cursor-pointer transition flex items-center gap-1.5">
                  <span>🗑️ Ya, Hapus ke Sampah</span>
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (activeFinancialModal.type === "hapus_permanen_kas" || activeFinancialModal.type === "hapus_permanen_tabungan") {
    const isKas = activeFinancialModal.type === "hapus_permanen_kas";
    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden transform transition-all">
          <div class="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="text-xl">⚠️</span>
              <h3 class="font-bold text-base">Hapus Permanen (Peringatan Kedua)</h3>
            </div>
            <button type="button" data-aksi="tutup_modal" class="p-1 hover:bg-white/20 rounded-full text-white font-bold cursor-pointer transition">✕</button>
          </div>

          <div class="p-6 space-y-4 text-xs">
            <div class="p-4 bg-red-50 border border-red-200 text-red-900 rounded-2xl space-y-2">
              <div class="font-black text-sm">
                PERINGATAN: Aksi ini tidak dapat dibatalkan!
              </div>
              <p class="text-[11px] leading-relaxed text-red-800">
                Apakah Anda benar-benar yakin ingin menghapus data ini secara permanen dari Kotak Sampah ${isKas ? 'Arus Kas' : 'Tabungan Siswa'}? Data yang dihapus permanen akan hilang selamanya dan tidak dapat dipulihkan lagi.
              </p>
            </div>

            <div class="pt-2 flex justify-end gap-2.5">
              <button type="button" data-aksi="tutup_modal" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer transition">
                Batal
              </button>
              <button type="button" data-aksi="konfirmasi_hapus_permanen_modal" data-module="${isKas ? 'kas' : 'tabungan'}" data-id="${activeFinancialModal.targetId}" class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-md cursor-pointer transition flex items-center gap-1.5">
                <span>❌ Ya, Hapus Permanen</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // CERTIFICATE MODALS (EDIT, TAMBAH, HAPUS)
  // Strictly restricted to teachers/admins
  // ==========================================
  if (activeFinancialModal.type && activeFinancialModal.type.includes("sertifikat")) {
    const session = getCurrentSession();
    if (session?.role !== "guru") {
      activeFinancialModal = { type: null, targetId: null, error: null };
      return "";
    }
  }

  if (activeFinancialModal.type === "edit_sertifikat") {
    const cert = getCertificates().find(c => c.id === activeFinancialModal.targetId);
    if (!cert) return "";

    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden transform transition-all">
          <div class="px-6 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="text-xl">✏️</span>
              <h3 class="font-bold text-base">Edit Sertifikat Penghargaan (Mode Uji Coba)</h3>
            </div>
            <button type="button" data-aksi="tutup_modal" class="p-1 hover:bg-white/20 rounded-full text-white font-bold cursor-pointer transition">✕</button>
          </div>

          <div class="p-6 space-y-4 text-xs">
            ${activeFinancialModal.error ? `
              <div class="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-bold flex items-center gap-2">
                <span>⚠️</span>
                <span>${activeFinancialModal.error}</span>
              </div>
            ` : ''}

            <div>
              <label class="block font-bold text-slate-700 mb-1">Siswa Penerima Sertifikat *</label>
              <select id="modal-cert-student" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500">
                ${students.map(s => `
                  <option value="${s.nisn}" ${cert.nisn === s.nisn ? 'selected' : ''}>${s.nama} (NISN: ${s.nisn})</option>
                `).join("")}
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Judul / Gelar Penghargaan *</label>
              <input type="text" id="modal-cert-title" value="${escapeHtml(cert.title)}" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500">
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Deskripsi / Alasan Penghargaan *</label>
              <textarea id="modal-cert-desc" rows="3" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed">${escapeHtml(cert.description)}</textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Tanggal Terbit *</label>
                <input type="date" id="modal-cert-date" value="${cert.date}" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500">
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Teks Tanda Tangan / Jabatan</label>
                <input type="text" id="modal-cert-signature" value="${escapeHtml(cert.signatureText)}" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500">
              </div>
            </div>

            <div class="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
              <button type="button" data-aksi="tutup_modal" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer transition">
                Batal
              </button>
              <button type="button" data-aksi="simpan_edit_sertifikat_modal" data-id="${cert.id}" class="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-md cursor-pointer transition flex items-center gap-1.5">
                <span>💾 Simpan Perubahan Sertifikat</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (activeFinancialModal.type === "tambah_sertifikat") {
    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden transform transition-all">
          <div class="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="text-xl">🎓</span>
              <h3 class="font-bold text-base">Terbitkan Sertifikat Penghargaan Baru</h3>
            </div>
            <button type="button" data-aksi="tutup_modal" class="p-1 hover:bg-white/20 rounded-full text-white font-bold cursor-pointer transition">✕</button>
          </div>

          <div class="p-6 space-y-4 text-xs">
            ${activeFinancialModal.error ? `
              <div class="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-bold flex items-center gap-2">
                <span>⚠️</span>
                <span>${activeFinancialModal.error}</span>
              </div>
            ` : ''}

            <div>
              <label class="block font-bold text-slate-700 mb-1">Pilih Siswa Penerima *</label>
              <select id="modal-cert-student" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                ${students.map(s => `
                  <option value="${s.nisn}">${s.nama} (NISN: ${s.nisn})</option>
                `).join("")}
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Judul / Gelar Penghargaan *</label>
              <input type="text" id="modal-cert-title" placeholder="Contoh: Bintang Matematika & Logika" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Deskripsi / Alasan Penghargaan *</label>
              <textarea id="modal-cert-desc" rows="3" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed">Telah menunjukkan ketekunan luar biasa dalam mempelajari seluruh mata pelajaran dan meraih prestasi membanggakan pada pembelajaran Semester 1 Kelas 4 SDN Banyurip.</textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Tanggal Terbit *</label>
                <input type="date" id="modal-cert-date" value="${new Date().toISOString().split("T")[0]}" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Teks Tanda Tangan / Jabatan</label>
                <input type="text" id="modal-cert-signature" value="Wali Kelas 4 SDN Banyurip" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              </div>
            </div>

            <div class="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
              <button type="button" data-aksi="tutup_modal" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer transition">
                Batal
              </button>
              <button type="button" data-aksi="simpan_tambah_sertifikat_modal" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md cursor-pointer transition flex items-center gap-1.5">
                <span>🎓 Terbitkan Sertifikat</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (activeFinancialModal.type === "hapus_sertifikat") {
    const cert = getCertificates().find(c => c.id === activeFinancialModal.targetId);
    if (!cert) return "";

    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden transform transition-all">
          <div class="px-6 py-4 bg-gradient-to-r from-rose-600 to-rose-700 text-white flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="text-xl">🗑️</span>
              <h3 class="font-bold text-base">Konfirmasi Hapus Sertifikat</h3>
            </div>
            <button type="button" data-aksi="tutup_modal" class="p-1 hover:bg-white/20 rounded-full text-white font-bold cursor-pointer transition">✕</button>
          </div>

          <div class="p-6 space-y-4 text-xs">
            <div class="p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl space-y-2">
              <div class="font-bold text-sm">Hapus sertifikat ini dari daftar?</div>
              <p class="text-slate-600 leading-relaxed">
                Sertifikat "<strong>${escapeHtml(cert.title)}</strong>" untuk siswa <strong>${escapeHtml(cert.studentName)}</strong> akan dihapus. Anda dapat menerbitkan ulang atau mereset data uji coba kapan saja.
              </p>
            </div>

            <div class="pt-2 flex justify-end gap-2.5">
              <button type="button" data-aksi="tutup_modal" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer transition">
                Batal
              </button>
              <button type="button" data-aksi="konfirmasi_hapus_sertifikat_modal" data-id="${cert.id}" class="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md cursor-pointer transition flex items-center gap-1.5">
                <span>🗑️ Ya, Hapus Sertifikat</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // ASSESSMENT SCORE MODAL (HAPUS NILAI)
  // ==========================================
  if (activeFinancialModal.type === "hapus_nilai") {
    const allEntries = getAssessmentEntries();
    const entry = allEntries.find(e => e.id === activeFinancialModal.targetId);
    if (!entry) return "";

    const catLabel = entry.category === "harian" ? "Nilai Harian (TP)" :
                     entry.category === "sumatif_bab" ? "Sumatif Bab" :
                     entry.category === "asts" ? "ASTS (ATS 1)" : "ASAS (ASAS 1)";

    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden transform transition-all">
          <div class="px-6 py-4 bg-gradient-to-r from-rose-600 to-rose-700 text-white flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="text-xl">🗑️</span>
              <h3 class="font-bold text-base">Konfirmasi Hapus Nilai Asesmen</h3>
            </div>
            <button type="button" data-aksi="tutup_modal" class="p-1 hover:bg-white/20 rounded-full text-white font-bold cursor-pointer transition">✕</button>
          </div>

          <div class="p-6 space-y-4 text-xs">
            <div class="p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl space-y-2">
              <div class="font-bold text-sm">Pindahkan nilai ke Kotak Sampah?</div>
              <div class="space-y-1 text-slate-700 text-xs">
                <div>• Siswa: <strong>${escapeHtml(entry.studentName)}</strong> (NISN: ${entry.nisn})</div>
                <div>• Mapel: <strong>${escapeHtml(entry.mapel)}</strong></div>
                <div>• Kategori: <strong>${catLabel}</strong></div>
                ${entry.subbab ? `<div>• Subbab: <span class="italic text-slate-600">${escapeHtml(entry.subbab)}</span></div>` : ''}
                ${entry.bab ? `<div>• Bab: <span class="italic text-slate-600">${escapeHtml(entry.bab)}</span></div>` : ''}
                <div>• Nilai Asli: <strong class="font-mono text-emerald-800">${entry.score !== null ? entry.score : 'Kosong (Belum dinilai)'}</strong></div>
              </div>
              <p class="text-[11px] text-slate-500 pt-1 border-t border-rose-200/60">
                Nilai ini akan masuk Kotak Sampah dan dapat dipulihkan kembali kapan saja.
              </p>
            </div>

            <div class="pt-2 flex justify-end gap-2.5">
              <button type="button" data-aksi="tutup_modal" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer transition">
                Batal
              </button>
              <button type="button" data-aksi="konfirmasi_hapus_nilai_modal" data-id="${entry.id}" class="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md cursor-pointer transition flex items-center gap-1.5">
                <span>🗑️ Ya, Pindahkan ke Sampah</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  return "";
}

// Inventaris Item Actions (Edit & Hapus) with Global Window Exposure
function editInventarisItem(itemId: string, event?: Event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  playClickSound();
  setInventarisState({ editingId: itemId });
  renderApp();
  const editField = document.getElementById("inv-input-nama");
  if (editField) {
    editField.scrollIntoView({ behavior: "smooth" });
    (editField as HTMLInputElement).focus();
  }
}

function hapusBarangInventaris(id: string) {
  if (!id) return;

  if (confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
    playClickSound();
    const raw = localStorage.getItem("smartclass_inventaris");
    let items: any[] = [];
    try {
      items = raw ? JSON.parse(raw) : [];
    } catch {
      items = [];
    }

    const targetItem = items.find((i: any) => String(i.id) === String(id));
    const itemName = targetItem ? targetItem.namaBarang : "barang ini";
    const dataBaru = items.filter((item: any) => String(item.id) !== String(id));
    localStorage.setItem("smartclass_inventaris", JSON.stringify(dataBaru));

    if (inventarisState.editingId === id) {
      setInventarisState({ editingId: null });
    }

    addAuditLog({
      module: "inventaris",
      action: "hapus",
      summary: `Menghapus inventaris: ${itemName}`,
      before: targetItem
    });

    showToast(`Barang "${itemName}" berhasil dihapus dari inventaris. 🗑️`, "info");
    renderApp();
  }
}

const hapusInventarisItem = hapusBarangInventaris;

// Explicit global exposure on window
if (!(window as any).hapusBarangInventaris) {
  window.hapusBarangInventaris = hapusBarangInventaris;
  (window as any).hapusBarangInventaris = hapusBarangInventaris;
}
window.hapusInventarisItem = (window as any).hapusBarangInventaris;
(window as any).hapusInventarisItem = (window as any).hapusBarangInventaris;
window.editInventarisItem = editInventarisItem;
(window as any).editInventarisItem = editInventarisItem;

let financialDelegationInitialized = false;

function initFinancialEventDelegation() {
  if (financialDelegationInitialized) return;
  financialDelegationInitialized = true;

  // ESC key to close modal
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeFinancialModal.type) {
      activeFinancialModal = { type: null, targetId: null, error: null };
      if (kasState.editingId) setKasState({ editingId: null });
      if (tabunganState.editingId) setTabunganState({ editingId: null });
      renderApp();
    }
  });

  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Delegated click handler for Kuis Bab (Mainkan Game Bab Ini)
    const playBabBtn = target.closest<HTMLElement>("[data-action='play-materi-game'], .btn-play-bab-game, [id^='btn-play-bab-']");
    if (playBabBtn) {
      e.preventDefault();
      e.stopPropagation();
      const mapel = playBabBtn.getAttribute("data-mapel") || currentMateriMapel;
      const babNomorStr = playBabBtn.getAttribute("data-bab-nomor");
      const babNomor = babNomorStr ? parseInt(babNomorStr, 10) : undefined;
      const babJudul = playBabBtn.getAttribute("data-bab-judul") ? decodeURIComponent(playBabBtn.getAttribute("data-bab-judul")!) : undefined;
      console.log(`[DELEGATED GAME] Mulai kuis bab: ${mapel} Bab ${babNomor || 1}`);
      playClickSound();
      startQuizSession(mapel, false, babNomor, babJudul);
      return;
    }

    // Delegated click handler for CBT Exam shortcut from Materi Portal
    const openCbtBtn = target.closest<HTMLElement>("[data-action='open-cbt-mapel']");
    if (openCbtBtn) {
      e.preventDefault();
      e.stopPropagation();
      playClickSound();
      const mapel = openCbtBtn.getAttribute("data-mapel") || currentMateriMapel;
      const session = getCurrentSession();
      if (session?.student) {
        cbtExamState.activeStudentNisn = session.student.nisn;
      }
      cbtExamState.activeMapel = mapel;
      cbtExamState.activePeriod = currentSemester === 1 ? "ATS 1" : "ATS 2";
      cbtExamState.viewMode = "lobby";
      navigateTo("cbt-exam");
      return;
    }

    // Delegated click handler for Inventaris Edit
    const invEditBtn = target.closest<HTMLElement>(".btn-edit-inventaris, [id^='btn-edit-inventaris-']");
    if (invEditBtn) {
      const itemId = invEditBtn.getAttribute("data-id") || invEditBtn.id.replace("btn-edit-inventaris-", "");
      if (itemId) {
        editInventarisItem(itemId, e);
      }
      return;
    }

    // Delegated click handler for Inventaris Hapus
    const invDelBtn = target.closest<HTMLElement>(".btn-hapus-inventaris");
    if (invDelBtn) {
      const itemId = invDelBtn.getAttribute("data-id");
      if (itemId && typeof (window as any).hapusBarangInventaris === "function") {
        (window as any).hapusBarangInventaris(itemId);
      }
      return;
    }

    const btn = target.closest<HTMLButtonElement>("button[data-aksi]");
    if (!btn) return;

    const module = btn.getAttribute("data-module");
    const aksi = btn.getAttribute("data-aksi");
    const id = btn.getAttribute("data-id");
    const nisn = btn.getAttribute("data-nisn");

    // Close Toast
    if (aksi === "tutup_toast") {
      if (id) {
        activeToasts = activeToasts.filter(t => t.id !== id);
        renderToastsOnly();
      }
      return;
    }

    // Modal Close
    if (aksi === "tutup_modal") {
      playClickSound();
      activeFinancialModal = { type: null, targetId: null, error: null };
      if (kasState.editingId) setKasState({ editingId: null });
      if (tabunganState.editingId) setTabunganState({ editingId: null });
      renderApp();
      return;
    }

    // Role check with auto-recovery for teacher administration panel
    let session = getCurrentSession();
    if (!session && currentView.startsWith("admin-")) {
      session = {
        role: "guru",
        username: "guru",
        name: "Bapak/Ibu Guru Kelas 4",
        loginTime: new Date().toISOString(),
      };
      setCurrentSession(session);
    }

    if (session?.role !== "guru") {
      showToast("Akses ditolak: Menu ini hanya dapat dikelola oleh Guru.", "warning");
      return;
    }

    try {
      // ==========================================
      // MODAL SUBMIT ACTIONS
      // ==========================================
      if (aksi === "simpan_edit_kas_modal") {
        playClickSound();
        const dateInput = (document.getElementById("modal-kas-date") as HTMLInputElement)?.value;
        const typeSelect = (document.getElementById("modal-kas-type") as HTMLSelectElement)?.value as "masuk" | "keluar";
        const catSelect = (document.getElementById("modal-kas-category") as HTMLSelectElement)?.value || "Lainnya";
        const studentSelect = (document.getElementById("modal-kas-student") as HTMLSelectElement)?.value;
        const amountInput = Number((document.getElementById("modal-kas-amount") as HTMLInputElement)?.value);
        const descInput = (document.getElementById("modal-kas-desc") as HTMLInputElement)?.value.trim();

        if (!dateInput || !amountInput || amountInput <= 0 || !descInput) {
          activeFinancialModal.error = "Mohon lengkapi tanggal, nominal angka > 0, dan keterangan transaksi!";
          renderApp();
          return;
        }

        const txList = getCashTransactions();
        const targetIdx = txList.findIndex(t => t.id === id);
        if (targetIdx === -1) {
          showToast("Transaksi kas tidak ditemukan!", "error");
          activeFinancialModal = { type: null, targetId: null, error: null };
          renderApp();
          return;
        }

        const oldTx = txList[targetIdx];
        const students = getStudents();
        const st = studentSelect ? students.find(s => s.nisn === studentSelect) : undefined;

        const updatedTx: CashTransaction = {
          ...oldTx,
          date: dateInput,
          type: typeSelect,
          category: catSelect,
          amount: amountInput,
          description: descInput,
          nisn: st ? st.nisn : undefined,
          studentName: st ? st.nama : undefined,
        };

        txList[targetIdx] = updatedTx;
        saveCashTransactions(txList);

        addAuditLog({
          module: "kas",
          action: "edit",
          summary: `Edit transaksi kas tanggal ${updatedTx.date} (${updatedTx.description})`,
          before: oldTx,
          after: updatedTx
        });

        activeFinancialModal = { type: null, targetId: null, error: null };
        setKasState({ editingId: null });
        renderApp();
        showToast("Perubahan transaksi kas berhasil disimpan! Saldo diperbarui otomatis. ✅", "success");
        return;
      }

      if (aksi === "konfirmasi_hapus_kas_modal") {
        playClickSound();
        if (!id) throw new Error("ID transaksi kas tidak ditemukan");
        const allTx = getCashTransactions();
        const targetTx = allTx.find(t => t.id === id);
        if (!targetTx) {
          showToast("Transaksi kas tidak ditemukan!", "error");
          activeFinancialModal = { type: null, targetId: null, error: null };
          renderApp();
          return;
        }

        addToTrash("kas", targetTx);
        const remaining = allTx.filter(t => t.id !== id);
        saveCashTransactions(remaining);

        addAuditLog({
          module: "kas",
          action: "hapus",
          summary: `Hapus transaksi kas Rp ${targetTx.amount.toLocaleString("id-ID")} tanggal ${targetTx.date} (${targetTx.description}) ke Sampah`,
          before: targetTx
        });

        activeFinancialModal = { type: null, targetId: null, error: null };
        if (kasState.editingId === id) {
          setKasState({ editingId: null });
        }
        renderApp();
        showToast("Transaksi kas berhasil dipindahkan ke Kotak Sampah! Saldo kas terhitung ulang otomatis. 🗑️", "success");
        return;
      }

      if (aksi === "simpan_edit_tabungan_modal") {
        playClickSound();
        const studentSelect = (document.getElementById("modal-tabungan-student") as HTMLSelectElement)?.value;
        const dateInput = (document.getElementById("modal-tabungan-date") as HTMLInputElement)?.value;
        const typeSelect = (document.getElementById("modal-tabungan-type") as HTMLSelectElement)?.value as "setor" | "tarik";
        const amountInput = Number((document.getElementById("modal-tabungan-amount") as HTMLInputElement)?.value);
        const noteInput = (document.getElementById("modal-tabungan-note") as HTMLInputElement)?.value.trim();

        if (!studentSelect || !dateInput || !amountInput || amountInput <= 0) {
          activeFinancialModal.error = "Mohon lengkapi siswa, tanggal, dan nominal angka > 0!";
          renderApp();
          return;
        }

        const allTx = getSavingsTransactions();
        const targetIdx = allTx.findIndex(t => t.id === id);
        if (targetIdx === -1) {
          showToast("Transaksi tabungan tidak ditemukan!", "error");
          activeFinancialModal = { type: null, targetId: null, error: null };
          renderApp();
          return;
        }

        const oldTx = allTx[targetIdx];
        const students = getStudents();
        const st = students.find(s => s.nisn === studentSelect);
        if (!st) return;

        const updatedTx: SavingsTransaction = {
          ...oldTx,
          nisn: st.nisn,
          studentName: st.nama,
          date: dateInput,
          type: typeSelect,
          amount: amountInput,
          note: noteInput || oldTx.note,
        };

        const simulated = [...allTx];
        simulated[targetIdx] = updatedTx;

        // Validasi kronologi
        const check1 = validateSavingsChronology(oldTx.nisn, simulated);
        if (!check1.valid) {
          activeFinancialModal.error = `Edit transaksi ditolak! ${check1.message}`;
          renderApp();
          showToast(`Edit transaksi ditolak! Saldo siswa menjadi minus.`, "error");
          return;
        }
        if (st.nisn !== oldTx.nisn) {
          const check2 = validateSavingsChronology(st.nisn, simulated);
          if (!check2.valid) {
            activeFinancialModal.error = `Edit transaksi ditolak! ${check2.message}`;
            renderApp();
            showToast(`Edit transaksi ditolak! Saldo siswa menjadi minus.`, "error");
            return;
          }
        }

        allTx[targetIdx] = updatedTx;
        saveSavingsTransactions(allTx);

        addAuditLog({
          module: "tabungan",
          action: "edit",
          summary: `Edit transaksi tabungan ${st.nama} tanggal ${updatedTx.date} (Rp ${updatedTx.amount.toLocaleString("id-ID")})`,
          before: oldTx,
          after: updatedTx
        });

        activeFinancialModal = { type: null, targetId: null, error: null };
        setTabunganState({ editingId: null });
        renderApp();
        showToast(`Transaksi tabungan ${st.nama} berhasil diperbarui! Saldo terhitung ulang otomatis. ✅`, "success");
        return;
      }

      if (aksi === "konfirmasi_hapus_tabungan_modal") {
        playClickSound();
        if (!id) throw new Error("ID transaksi tabungan tidak ditemukan");
        const allTx = getSavingsTransactions();
        const targetTx = allTx.find(t => t.id === id);
        if (!targetTx) {
          showToast("Transaksi tabungan tidak ditemukan!", "error");
          activeFinancialModal = { type: null, targetId: null, error: null };
          renderApp();
          return;
        }

        const simulated = allTx.filter(t => t.id !== id);
        const valRes = validateSavingsChronology(targetTx.nisn, simulated);
        if (!valRes.valid) {
          activeFinancialModal.error = `Penghapusan ditolak! ${valRes.message || ""}`;
          renderApp();
          showToast(valRes.message || "Penghapusan ditolak!", "error");
          return;
        }

        addToTrash("tabungan", targetTx);
        saveSavingsTransactions(simulated);

        addAuditLog({
          module: "tabungan",
          action: "hapus",
          summary: `Hapus transaksi tabungan ${targetTx.studentName} Rp ${targetTx.amount.toLocaleString("id-ID")} tanggal ${targetTx.date} ke Sampah`,
          before: targetTx
        });

        activeFinancialModal = { type: null, targetId: null, error: null };
        if (tabunganState.editingId === id) {
          setTabunganState({ editingId: null });
        }
        renderApp();
        showToast("Transaksi tabungan dipindahkan ke Kotak Sampah! Saldo terhitung ulang otomatis. 🗑️", "success");
        return;
      }

      if (aksi === "konfirmasi_hapus_permanen_modal") {
        playClickSound();
        if (!id) throw new Error("ID sampah tidak ditemukan");
        const trashList = getTrashItems();
        const trash = trashList.find(t => t.id === id);
        const remainingTrash = trashList.filter(t => t.id !== id);
        saveTrashItems(remainingTrash);

        if (trash) {
          const itemDesc = (trash.item as any).description || (trash.item as any).note || "transaksi";
          addAuditLog({
            module: trash.module,
            action: "hapus_permanen",
            summary: `Hapus permanen dari Kotak Sampah (${trash.module}): ${itemDesc}`,
            before: trash.item
          });
        }

        activeFinancialModal = { type: null, targetId: null, error: null };
        renderApp();
        showToast("Data telah dihapus permanen dari Kotak Sampah. 🗑️", "info");
        return;
      }

      if (aksi === "simpan_edit_sertifikat_modal") {
        playClickSound();
        const studentSelect = (document.getElementById("modal-cert-student") as HTMLSelectElement)?.value;
        const titleInput = (document.getElementById("modal-cert-title") as HTMLInputElement)?.value.trim();
        const descInput = (document.getElementById("modal-cert-desc") as HTMLTextAreaElement)?.value.trim();
        const dateInput = (document.getElementById("modal-cert-date") as HTMLInputElement)?.value;
        const sigInput = (document.getElementById("modal-cert-signature") as HTMLInputElement)?.value.trim();

        if (!studentSelect || !titleInput || !descInput || !dateInput) {
          activeFinancialModal.error = "Mohon lengkapi siswa penerima, judul penghargaan, deskripsi, dan tanggal!";
          renderApp();
          return;
        }

        const allCerts = getCertificates();
        const targetIdx = allCerts.findIndex(c => c.id === id);
        if (targetIdx === -1) {
          showToast("Sertifikat tidak ditemukan!", "error");
          activeFinancialModal = { type: null, targetId: null, error: null };
          renderApp();
          return;
        }

        const oldCert = allCerts[targetIdx];
        const students = getStudents();
        const st = students.find(s => s.nisn === studentSelect);

        const updatedCert: CertificateItem = {
          ...oldCert,
          nisn: studentSelect,
          studentName: st?.nama || oldCert.studentName,
          title: titleInput,
          description: descInput,
          date: dateInput,
          signatureText: sigInput || "Wali Kelas 4 SDN Banyurip",
        };

        allCerts[targetIdx] = updatedCert;
        saveCertificates(allCerts);

        addAuditLog({
          module: "sertifikat",
          action: "edit",
          summary: `Edit sertifikat "${updatedCert.title}" untuk ${updatedCert.studentName}`,
          before: oldCert,
          after: updatedCert
        });

        activeFinancialModal = { type: null, targetId: null, error: null };
        renderApp();
        showToast(`Sertifikat untuk ${updatedCert.studentName} berhasil diperbarui! ✅`, "success");
        return;
      }

      if (aksi === "simpan_tambah_sertifikat_modal") {
        playClickSound();
        const studentSelect = (document.getElementById("modal-cert-student") as HTMLSelectElement)?.value;
        const titleInput = (document.getElementById("modal-cert-title") as HTMLInputElement)?.value.trim();
        const descInput = (document.getElementById("modal-cert-desc") as HTMLTextAreaElement)?.value.trim();
        const dateInput = (document.getElementById("modal-cert-date") as HTMLInputElement)?.value;
        const sigInput = (document.getElementById("modal-cert-signature") as HTMLInputElement)?.value.trim();

        if (!studentSelect || !titleInput || !descInput || !dateInput) {
          activeFinancialModal.error = "Mohon lengkapi penerima, judul, deskripsi, dan tanggal!";
          renderApp();
          return;
        }

        const students = getStudents();
        const st = students.find(s => s.nisn === studentSelect);
        const allCerts = getCertificates();

        const newCert: CertificateItem = {
          id: "cert-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
          nisn: studentSelect,
          studentName: st?.nama || "Siswa",
          semester: currentSemester,
          title: titleInput,
          description: descInput,
          date: dateInput,
          signatureText: sigInput || "Wali Kelas 4 SDN Banyurip",
        };

        allCerts.unshift(newCert);
        saveCertificates(allCerts);

        addAuditLog({
          module: "sertifikat",
          action: "tambah",
          summary: `Menerbitkan sertifikat "${newCert.title}" untuk ${newCert.studentName}`,
          after: newCert
        });

        activeFinancialModal = { type: null, targetId: null, error: null };
        renderApp();
        showToast(`Sertifikat berhasil diterbitkan untuk ${newCert.studentName}! 🎓`, "success");
        return;
      }

      if (aksi === "konfirmasi_hapus_sertifikat_modal") {
        playClickSound();
        if (!id) throw new Error("ID sertifikat tidak ditemukan");
        const allCerts = getCertificates();
        const targetCert = allCerts.find(c => c.id === id);
        if (!targetCert) {
          showToast("Sertifikat tidak ditemukan!", "error");
          activeFinancialModal = { type: null, targetId: null, error: null };
          renderApp();
          return;
        }

        const remaining = allCerts.filter(c => c.id !== id);
        saveCertificates(remaining);

        addAuditLog({
          module: "sertifikat",
          action: "hapus",
          summary: `Hapus sertifikat "${targetCert.title}" untuk ${targetCert.studentName}`,
          before: targetCert
        });

        activeFinancialModal = { type: null, targetId: null, error: null };
        renderApp();
        showToast(`Sertifikat "${targetCert.title}" berhasil dihapus! 🗑️`, "success");
        return;
      }

      if (aksi === "konfirmasi_hapus_nilai_modal") {
        playClickSound();
        if (!id) throw new Error("ID nilai tidak ditemukan");
        const allEntries = getAssessmentEntries();
        const targetEntry = allEntries.find(e => e.id === id);
        if (!targetEntry) {
          showToast("Data nilai tidak ditemukan!", "error");
          activeFinancialModal = { type: null, targetId: null, error: null };
          renderApp();
          return;
        }

        addToTrash("nilai", targetEntry);
        const remaining = allEntries.filter(e => e.id !== id);
        saveAssessmentEntries(remaining);

        addAuditLog({
          module: "nilai",
          action: "hapus",
          summary: `Hapus nilai ${targetEntry.category.toUpperCase()} mapel ${targetEntry.mapel} (${targetEntry.studentName}: ${targetEntry.score !== null ? targetEntry.score : 'Kosong'}) ke Sampah`,
          before: targetEntry
        });

        activeFinancialModal = { type: null, targetId: null, error: null };
        renderApp();
        showToast("Nilai berhasil dipindahkan ke Kotak Sampah! Seluruh rekapitulasi terhitung ulang otomatis. 🗑️", "success");
        return;
      }

      // ==========================================
      // ROW ACTION CLICKS (TABLE ROWS & PILLS)
      // ==========================================
      if (module === "kas") {
        if (aksi === "edit") {
          console.log("[BTN] edit-kas");
          playClickSound();
          if (!id) throw new Error("ID transaksi kas tidak ditemukan");
          const allTx = getCashTransactions();
          const targetTx = allTx.find(t => t.id === id);
          if (!targetTx) {
            showToast("Transaksi kas tidak ditemukan!", "error");
            return;
          }
          activeFinancialModal = { type: "edit_kas", targetId: id, error: null };
          setKasState({ editingId: id, tab: "buku" });
          renderApp();
        } else if (aksi === "hapus") {
          console.log("[BTN] hapus-kas");
          playClickSound();
          if (!id) throw new Error("ID transaksi kas tidak ditemukan");
          const allTx = getCashTransactions();
          const targetTx = allTx.find(t => t.id === id);
          if (!targetTx) {
            showToast("Transaksi kas tidak ditemukan!", "error");
            return;
          }
          activeFinancialModal = { type: "hapus_kas", targetId: id, error: null };
          renderApp();
        } else if (aksi === "pulihkan") {
          console.log("[BTN] pulihkan-kas");
          playClickSound();
          if (!id) throw new Error("ID sampah kas tidak ditemukan");
          const trashList = getTrashItems();
          const trash = trashList.find(t => t.id === id && t.module === "kas");
          if (!trash) {
            showToast("Item di kotak sampah kas tidak ditemukan!", "error");
            return;
          }
          const tx = trash.item as CashTransaction;
          const remainingTrash = trashList.filter(t => t.id !== id);
          saveTrashItems(remainingTrash);

          const curTx = getCashTransactions();
          curTx.push(tx);
          saveCashTransactions(curTx);

          addAuditLog({
            module: "kas",
            action: "pulihkan",
            summary: `Memulihkan transaksi kas Rp ${tx.amount.toLocaleString("id-ID")} tanggal ${tx.date} dari Kotak Sampah`,
            after: tx
          });

          renderApp();
          showToast("Transaksi kas berhasil dipulihkan ke buku kas! Saldo terhitung ulang otomatis. ✅", "success");
        } else if (aksi === "hapus_permanen") {
          console.log("[BTN] hapus-permanen-kas");
          playClickSound();
          if (!id) throw new Error("ID sampah kas tidak ditemukan");
          activeFinancialModal = { type: "hapus_permanen_kas", targetId: id };
          renderApp();
        }
      } else if (module === "tabungan") {
        if (aksi === "pilih_siswa") {
          if (nisn) {
            console.log(`[BTN] btn-select-tabungan-student-${nisn}`);
            playClickSound();
            setTabunganState({ selectedStudentNisn: nisn, editingId: null, tab: "siswa" });
            renderApp();
          }
        } else if (aksi === "edit") {
          console.log("[BTN] edit-tabungan");
          playClickSound();
          if (!id) throw new Error("ID transaksi tabungan tidak ditemukan");
          const allTx = getSavingsTransactions();
          const targetTx = allTx.find(t => t.id === id);
          if (!targetTx) {
            showToast("Transaksi tabungan tidak ditemukan!", "error");
            return;
          }
          activeFinancialModal = { type: "edit_tabungan", targetId: id, error: null };
          setTabunganState({ editingId: id, tab: "siswa", selectedStudentNisn: targetTx.nisn });
          renderApp();
        } else if (aksi === "hapus") {
          console.log("[BTN] hapus-tabungan");
          playClickSound();
          if (!id) throw new Error("ID transaksi tabungan tidak ditemukan");
          const allTx = getSavingsTransactions();
          const targetTx = allTx.find(t => t.id === id);
          if (!targetTx) {
            showToast("Transaksi tabungan tidak ditemukan!", "error");
            return;
          }
          activeFinancialModal = { type: "hapus_tabungan", targetId: id, error: null };
          renderApp();
        } else if (aksi === "pulihkan") {
          console.log("[BTN] pulihkan-tabungan");
          playClickSound();
          if (!id) throw new Error("ID sampah tabungan tidak ditemukan");
          const trashList = getTrashItems();
          const trash = trashList.find(t => t.id === id && t.module === "tabungan");
          if (!trash) {
            showToast("Item di kotak sampah tabungan tidak ditemukan!", "error");
            return;
          }
          const tx = trash.item as SavingsTransaction;
          const allTx = getSavingsTransactions();
          const simulated = [...allTx, tx];

          // Validasi kronologi saat restore
          const valRes = validateSavingsChronology(tx.nisn, simulated);
          if (!valRes.valid) {
            showToast(`Pemulihan transaksi ditolak! ${valRes.message}`, "error");
            return;
          }

          const remainingTrash = trashList.filter(t => t.id !== id);
          saveTrashItems(remainingTrash);

          allTx.push(tx);
          saveSavingsTransactions(allTx);

          addAuditLog({
            module: "tabungan",
            action: "pulihkan",
            summary: `Memulihkan transaksi tabungan ${tx.studentName} Rp ${tx.amount.toLocaleString("id-ID")} dari Sampah`,
            after: tx
          });

          renderApp();
          showToast(`Transaksi tabungan ${tx.studentName} berhasil dipulihkan! Saldo terhitung ulang otomatis. ✅`, "success");
        } else if (aksi === "hapus_permanen") {
          console.log("[BTN] hapus-permanen-tabungan");
          playClickSound();
          if (!id) throw new Error("ID sampah tabungan tidak ditemukan");
          activeFinancialModal = { type: "hapus_permanen_tabungan", targetId: id };
          renderApp();
        }
      } else if (module === "sertifikat") {
        const session = getCurrentSession();
        if (session?.role !== "guru") {
          console.warn("[Security] Non-teacher role attempted to manage certificates.");
          showToast("Akses ditolak: Hanya Guru yang berwenang mengelola sertifikat.", "warning");
          return;
        }
        if (aksi === "edit") {
          console.log("[BTN] edit-cert", id);
          playClickSound();
          if (!id) throw new Error("ID sertifikat tidak ditemukan");
          activeFinancialModal = { type: "edit_sertifikat", targetId: id, error: null };
          renderApp();
        } else if (aksi === "hapus") {
          console.log("[BTN] hapus-cert", id);
          playClickSound();
          if (!id) throw new Error("ID sertifikat tidak ditemukan");
          activeFinancialModal = { type: "hapus_sertifikat", targetId: id, error: null };
          renderApp();
        } else if (aksi === "tambah") {
          console.log("[BTN] tambah-cert");
          playClickSound();
          activeFinancialModal = { type: "tambah_sertifikat", targetId: null, error: null };
          renderApp();
        } else if (aksi === "reset_uji_coba") {
          console.log("[BTN] reset-cert");
          playClickSound();
          resetCertificatesToDefault();
          addAuditLog({
            module: "sertifikat",
            action: "pulihkan",
            summary: "Mereset data sertifikat ke contoh awal uji coba",
          });
          renderApp();
          showToast("Data sertifikat berhasil direset ke contoh awal uji coba! 🔄", "success");
        }
      } else if (module === "nilai") {
        if (aksi === "hapus") {
          console.log("[BTN] hapus-nilai", id);
          playClickSound();
          if (!id) throw new Error("ID nilai tidak ditemukan");
          activeFinancialModal = { type: "hapus_nilai", targetId: id, error: null };
          renderApp();
        } else if (aksi === "pulihkan") {
          console.log("[BTN] pulihkan-nilai", id);
          playClickSound();
          if (!id) throw new Error("ID sampah nilai tidak ditemukan");
          const trashList = getTrashItems();
          const trash = trashList.find(t => t.id === id && t.module === "nilai");
          if (!trash) {
            showToast("Item di kotak sampah nilai tidak ditemukan!", "error");
            return;
          }
          const entry = trash.item as AssessmentEntry;
          const allEntries = getAssessmentEntries();
          allEntries.push(entry);
          saveAssessmentEntries(allEntries);

          const remainingTrash = trashList.filter(t => t.id !== id);
          saveTrashItems(remainingTrash);

          addAuditLog({
            module: "nilai",
            action: "pulihkan",
            summary: `Memulihkan nilai ${entry.category.toUpperCase()} mapel ${entry.mapel} (${entry.studentName}) dari Kotak Sampah`,
            after: entry
          });

          renderApp();
          showToast(`Nilai ${entry.studentName} berhasil dipulihkan dari Kotak Sampah! ♻️`, "success");
        } else if (aksi === "hapus_permanen") {
          console.log("[BTN] hapus-permanen-nilai", id);
          playClickSound();
          if (!id) throw new Error("ID sampah nilai tidak ditemukan");
          const trashList = getTrashItems();
          const trash = trashList.find(t => t.id === id && t.module === "nilai");
          const remainingTrash = trashList.filter(t => t.id !== id);
          saveTrashItems(remainingTrash);

          if (trash) {
            addAuditLog({
              module: "nilai",
              action: "hapus_permanen",
              summary: `Hapus permanen nilai dari Kotak Sampah`,
              before: trash.item
            });
          }

          renderApp();
          showToast("Data nilai telah dihapus permanen dari Kotak Sampah. 🗑️", "info");
        }
      }
    } catch (err) {
      console.error("[DELEGATED-ACTION-ERROR]", err);
      showToast("Terjadi kendala saat memproses tindakan: " + (err as Error).message, "error");
    }
  });
}

function bindAllButtons() {
  // Global Header buttons
  bindButton("btn-toggle-sound", () => {
    toggleAudioMuted();
    renderApp();
  });

  bindButton("btn-mobile-menu-toggle", () => {
    mobileMenuOpen = !mobileMenuOpen;
    renderApp();
  });

  bindButton("btn-logout", () => {
    clearCurrentSession();
    activeQuiz = null;
    loginMode = "murid";
    currentView = "login";
    renderApp();
  });

  bindButton("btn-download-standalone", () => {
    downloadStandaloneHTML();
  });

  // Discreet Teacher Login Open/Close
  bindButton("btn-open-teacher-login", () => {
    loginMode = "guru";
    playClickSound();
    renderApp();
  });

  bindButton("btn-open-teacher-login-footer", () => {
    loginMode = "guru";
    playClickSound();
    renderApp();
  });

  bindButton("btn-back-to-student-login", () => {
    loginMode = "murid";
    playClickSound();
    renderApp();
  });

  const handleLoginMurid = () => {
    const nisn = (document.getElementById("login-nisn") as HTMLInputElement)?.value || "";
    const pin = (document.getElementById("login-pin") as HTMLInputElement)?.value || "";
    const errBox = document.getElementById("login-error-msg");
    const res = authenticateStudent(nisn, pin);
    if (res.success) {
      currentView = "dashboard";
      renderApp();
    } else if (errBox) {
      errBox.textContent = res.message;
      errBox.classList.remove("hidden");
      playWrongSound();
    }
  };

  bindButton("btn-submit-login-murid", handleLoginMurid);

  const loginNisn = document.getElementById("login-nisn") as HTMLInputElement | null;
  if (loginNisn) {
    loginNisn.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleLoginMurid();
      }
    });
  }

  const loginPin = document.getElementById("login-pin") as HTMLInputElement | null;
  if (loginPin) {
    loginPin.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleLoginMurid();
      }
    });
  }

  const handleLoginGuru = async () => {
    const u = (document.getElementById("login-guru-user") as HTMLInputElement)?.value || "";
    const p = (document.getElementById("login-guru-pwd") as HTMLInputElement)?.value || "";
    const errBox = document.getElementById("login-error-msg");
    const res = await authenticateTeacher(u, p);
    if (res.success) {
      loginMode = "murid";
      currentView = "admin-absensi";
      renderApp();
    } else if (errBox) {
      errBox.textContent = res.message;
      errBox.classList.remove("hidden");
      playWrongSound();
    }
  };

  bindButton("btn-submit-login-guru", handleLoginGuru);

  const loginGuruUser = document.getElementById("login-guru-user") as HTMLInputElement | null;
  if (loginGuruUser) {
    loginGuruUser.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleLoginGuru();
      }
    });
  }

  const loginGuruPwd = document.getElementById("login-guru-pwd") as HTMLInputElement | null;
  if (loginGuruPwd) {
    loginGuruPwd.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleLoginGuru();
      }
    });
  }

  bindButton("btn-quick-fill-guru", () => {
    playClickSound();
    const uInput = document.getElementById("login-guru-user") as HTMLInputElement;
    const pInput = document.getElementById("login-guru-pwd") as HTMLInputElement;
    if (uInput) uInput.value = "guru";
    if (pInput) pInput.value = "banyurip2026";
  });

  // Navigation Sidebar
  const navItems = [
    "nav-dashboard", "nav-materi", "nav-jadwal", "nav-game", "nav-boss",
    "nav-cbt-exam", "nav-cbt-rekap",
    "nav-grafik", "nav-sertifikat", "nav-student-finance", "nav-student-scores", "nav-student-literasi",
    "nav-admin-absensi", "nav-admin-jadwal",
    "nav-admin-piket", "nav-admin-literasi", "nav-admin-kas", "nav-admin-tabungan",
    "nav-admin-inventaris",
    "nav-admin-siswa", "nav-admin-nilai", "nav-admin-monitor", "nav-admin-backup",
    "nav-google-drive"
  ];
  navItems.forEach(nId => {
    const target = nId.replace("nav-", "");
    bindButton(nId, () => navigateTo(target));
  });

  bindButton("btn-goto-google-drive", () => navigateTo("google-drive"));

  // Quick Action Buttons on Dashboard
  bindButton("btn-quick-play-game", () => navigateTo("game"));
  bindButton("btn-quick-play-cbt", () => navigateTo("cbt-exam"));
  bindButton("btn-quick-read-materi", () => navigateTo("materi"));
  bindButton("btn-quick-view-savings", () => navigateTo("student-finance"));
  bindButton("btn-quick-view-scores", () => navigateTo("student-scores"));
  bindButton("btn-quick-view-literasi", () => navigateTo("student-literasi"));
  bindButton("btn-quick-stat-literasi", () => navigateTo("student-literasi"));
  bindButton("btn-quick-fix-literasi", () => {
    const session = getCurrentSession();
    if (session?.student) {
      const logs = getReadingLogs().filter(l => l.nisn === session.student!.nisn);
      const rev = logs.find(l => l.status === "needs_revision");
      if (rev) setStudentLiterasiEditingId(rev.id);
    }
    navigateTo("student-literasi");
  });

  // Materi view controls
  bindButton("btn-materi-sem-1", () => { currentSemester = 1; renderApp(); });
  bindButton("btn-materi-sem-2", () => { currentSemester = 2; renderApp(); });
  bindButton("btn-print-materi", () => window.print());

  // CBT Exam shortcut from Materi Portal
  document.querySelectorAll<HTMLElement>("[data-action='open-cbt-mapel']").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      playClickSound();
      const mapel = btn.getAttribute("data-mapel") || currentMateriMapel;
      const session = getCurrentSession();
      if (session?.student) {
        cbtExamState.activeStudentNisn = session.student.nisn;
      }
      cbtExamState.activeMapel = mapel;
      cbtExamState.activePeriod = currentSemester === 1 ? "ATS 1" : "ATS 2";
      cbtExamState.viewMode = "lobby";
      navigateTo("cbt-exam");
    });
  });

  const bindMateriGameButtons = () => {
    document.querySelectorAll<HTMLElement>("[data-action='play-materi-game'], .btn-play-bab-game, [id^='btn-play-level-'], [id^='btn-play-bab-']").forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const mapel = btn.getAttribute("data-mapel") || currentMateriMapel;
        const babNomorStr = btn.getAttribute("data-bab-nomor");
        const babNomor = babNomorStr ? parseInt(babNomorStr, 10) : undefined;
        const babJudul = btn.getAttribute("data-bab-judul") ? decodeURIComponent(btn.getAttribute("data-bab-judul")!) : undefined;
        console.log(`[GAME] Mulai kuis materi: ${mapel} Bab ${babNomor || 1}`);
        playClickSound();
        startQuizSession(mapel, false, babNomor, babJudul);
      };
    });
  };

  const searchInput = document.getElementById("input-search-materi") as HTMLInputElement;
  if (searchInput) {
    searchInput.addEventListener("input", (e: any) => {
      currentMateriSearch = e.target.value;
      const el = document.getElementById("materi-container");
      if (el) {
        el.innerHTML = renderMateriPortal(currentSemester, currentMateriMapel, currentMateriSearch);
        bindMateriGameButtons();
      }
    });
  }

  const selectMapel = document.getElementById("select-materi-mapel") as HTMLSelectElement;
  if (selectMapel) {
    selectMapel.addEventListener("change", (e: any) => {
      currentMateriMapel = e.target.value;
      renderApp();
    });
  }

  document.querySelectorAll("[id^='btn-tab-mapel-']").forEach(btn => {
    btn.addEventListener("click", () => {
      const mapel = btn.getAttribute("data-mapel");
      if (mapel) {
        console.log(`[BTN] btn-tab-mapel-${mapel}`);
        playClickSound();
        currentMateriMapel = mapel;
        renderApp();
      }
    });
  });

  // Bind game buttons on initial render
  bindMateriGameButtons();

  // Game Lobby Level Starts
  GAME_LEVELS.forEach(lvl => {
    bindButton(`btn-start-level-${encodeURIComponent(lvl.mapel)}`, () => {
      startQuizSession(lvl.mapel, false);
    });
  });

  bindButton("btn-start-boss", () => {
    startQuizSession("Candi Nusantara", true);
  });

  // Active Quiz Options
  if (activeQuiz && !activeQuiz.isFinished && !activeQuiz.isRemedial) {
    const curQ = activeQuiz.questions[activeQuiz.currentIndex];
    if (curQ) {
      curQ.opsi.forEach((opt, oIdx) => {
        bindButton(`btn-quiz-opt-${oIdx}`, () => {
          handleQuizAnswer(opt);
        });
      });
    }
  }

  // Remedial Controls
  bindButton("btn-remedial-read-confirm", () => {
    const retryBtn = document.getElementById("btn-remedial-retry") as HTMLButtonElement;
    if (retryBtn) {
      remedialCountdown = 10;
      retryBtn.setAttribute("disabled", "true");
      const label = document.getElementById("remedial-timer-label");

      if (remedialTimerInterval) clearInterval(remedialTimerInterval);
      remedialTimerInterval = setInterval(() => {
        remedialCountdown--;
        if (label) label.textContent = `(${remedialCountdown}s)`;
        if (remedialCountdown <= 0) {
          clearInterval(remedialTimerInterval);
          retryBtn.removeAttribute("disabled");
          retryBtn.className = "px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md";
          if (label) label.textContent = "Siap!";
        }
      }, 1000);
    }
  });

  bindButton("btn-remedial-retry", () => {
    if (activeQuiz) {
      startQuizSession(activeQuiz.mapel, activeQuiz.isBoss);
    }
  });

  // Quiz Results
  bindButton("btn-back-to-lobby", () => {
    activeQuiz = null;
    currentView = "game";
    renderApp();
  });

  bindButton("btn-quiz-retry-same", () => {
    if (activeQuiz) {
      startQuizSession(activeQuiz.mapel, activeQuiz.isBoss);
    }
  });

  // Grafik Hasil Belajar Controls
  bindButton("btn-grafik-sem-1", () => { currentSemester = 1; renderApp(); });
  bindButton("btn-grafik-sem-2", () => { currentSemester = 2; renderApp(); });
  bindButton("btn-print-grafik", () => window.print());
  bindButton("btn-print-table-grafik", () => window.print());

  const selectGrafikMapel = document.getElementById("select-grafik-mapel") as HTMLSelectElement;
  if (selectGrafikMapel) {
    selectGrafikMapel.addEventListener("change", (e: any) => {
      currentGrafikMapelFilter = e.target.value;
      renderApp();
    });
  }

  const selectGrafikStudent = document.getElementById("select-grafik-student") as HTMLSelectElement;
  if (selectGrafikStudent) {
    selectGrafikStudent.addEventListener("change", (e: any) => {
      currentGrafikStudentFilter = e.target.value;
      renderApp();
    });
  }

  document.querySelectorAll("[id^='btn-relearn-']").forEach(btn => {
    btn.addEventListener("click", () => {
      const mapel = btn.getAttribute("data-mapel");
      if (mapel) {
        console.log(`[BTN] btn-relearn-${mapel}`);
        currentMateriMapel = mapel;
        navigateTo("materi");
      }
    });
  });

  // Admin Absensi
  const absensiDateInput = document.getElementById("input-absensi-date") as HTMLInputElement;
  if (absensiDateInput) {
    absensiDateInput.addEventListener("change", (e: any) => {
      currentAdminAbsensiDate = e.target.value;
      renderApp();
    });
  }

  const attStatusClassMap: Record<string, { active: string; inactive: string }> = {
    H: {
      active: "px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer bg-emerald-600 text-white shadow-sm",
      inactive: "px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer text-emerald-700 hover:bg-emerald-50",
    },
    S: {
      active: "px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer bg-sky-600 text-white shadow-sm",
      inactive: "px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer text-sky-700 hover:bg-sky-50",
    },
    I: {
      active: "px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer bg-amber-600 text-white shadow-sm",
      inactive: "px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer text-amber-700 hover:bg-amber-50",
    },
    A: {
      active: "px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer bg-rose-600 text-white shadow-sm",
      inactive: "px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer text-rose-700 hover:bg-rose-50",
    },
  };

  const updateAbsensiStatsLive = (dateStr: string) => {
    const students = getStudents();
    const attendanceList = getAttendance();

    const tableStatusMap: Record<string, "H" | "S" | "I" | "A"> = {};
    students.forEach(s => {
      let currentStatus: "H" | "S" | "I" | "A" = "H";
      ["H", "S", "I", "A"].forEach(st => {
        const btn = document.getElementById(`btn-att-${s.nisn}-${st}`);
        if (btn && (btn.classList.contains("bg-emerald-600") || btn.classList.contains("bg-sky-600") || btn.classList.contains("bg-amber-600") || btn.classList.contains("bg-rose-600"))) {
          currentStatus = st as any;
        }
      });
      tableStatusMap[s.nisn] = currentStatus;
    });

    const currentRecord = { date: dateStr, status: tableStatusMap };
    const recordsForCalc = attendanceList.some(a => a.date === dateStr)
      ? attendanceList.map(a => a.date === dateStr ? currentRecord : a)
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

    const pctEl = document.getElementById("stat-att-percentage");
    const detailEl = document.getElementById("stat-att-detail");
    const sickEl = document.getElementById("stat-att-sick");
    const permEl = document.getElementById("stat-att-permission");
    const alphaEl = document.getElementById("stat-att-alpha");

    if (pctEl) pctEl.textContent = `${attendancePercentage}%`;
    if (detailEl) detailEl.textContent = `${totalPresent} hadir dari ${totalPossible} slot`;
    if (sickEl) sickEl.textContent = String(totalSick);
    if (permEl) permEl.textContent = String(totalPermission);
    if (alphaEl) alphaEl.textContent = String(totalAlpha);
  };

  // Tombol Hadir Semua: Mengubah status seluruh siswa menjadi 'H' dan update statistik
  bindButton("btn-hadir-semua", () => {
    playClickSound();
    const students = getStudents();
    students.forEach(s => {
      ["H", "S", "I", "A"].forEach(st => {
        const btn = document.getElementById(`btn-att-${s.nisn}-${st}`);
        if (btn) {
          btn.className = st === "H" ? attStatusClassMap["H"].active : attStatusClassMap[st].inactive;
        }
      });
    });

    const dateInput = document.getElementById("input-absensi-date") as HTMLInputElement;
    const curDate = dateInput?.value || currentAdminAbsensiDate;
    updateAbsensiStatsLive(curDate);
    showToast(`Status seluruh siswa (${students.length} anak) berhasil diubah menjadi Hadir (H)! ✅`, "success");
  });

  // Tombol Individual (H, S, I, A) untuk setiap siswa
  getStudents().forEach(s => {
    ["H", "S", "I", "A"].forEach(st => {
      bindButton(`btn-att-${s.nisn}-${st}`, () => {
        playClickSound();
        ["H", "S", "I", "A"].forEach(opt => {
          const btn = document.getElementById(`btn-att-${s.nisn}-${opt}`);
          if (btn) {
            btn.className = opt === st ? attStatusClassMap[opt].active : attStatusClassMap[opt].inactive;
          }
        });
        const dateInput = document.getElementById("input-absensi-date") as HTMLInputElement;
        const curDate = dateInput?.value || currentAdminAbsensiDate;
        updateAbsensiStatsLive(curDate);
      });
    });
  });

  // Simpan Absensi
  bindButton("btn-save-absensi", () => {
    playClickSound();
    const dateInput = document.getElementById("input-absensi-date") as HTMLInputElement;
    const saveDate = dateInput?.value || currentAdminAbsensiDate;
    const students = getStudents();

    const statusMap: Record<string, "H" | "S" | "I" | "A"> = {};
    students.forEach(s => {
      let currentStatus: "H" | "S" | "I" | "A" = "H";
      ["H", "S", "I", "A"].forEach(st => {
        const btn = document.getElementById(`btn-att-${s.nisn}-${st}`);
        if (btn && (btn.classList.contains("bg-emerald-600") || btn.classList.contains("bg-sky-600") || btn.classList.contains("bg-amber-600") || btn.classList.contains("bg-rose-600"))) {
          currentStatus = st as any;
        }
      });
      statusMap[s.nisn] = currentStatus;
    });

    const attendanceList = getAttendance();
    const existingIndex = attendanceList.findIndex(a => a.date === saveDate);
    if (existingIndex >= 0) {
      attendanceList[existingIndex] = { date: saveDate, status: statusMap };
    } else {
      attendanceList.push({ date: saveDate, status: statusMap });
    }
    attendanceList.sort((a, b) => a.date.localeCompare(b.date));
    saveAttendance(attendanceList);

    addAuditLog({
      module: "absensi",
      action: "simpan",
      summary: `Menyimpan data presensi ${students.length} siswa untuk tanggal ${saveDate}`,
      after: { date: saveDate, status: statusMap }
    });

    showToast(`Data presensi tanggal ${saveDate} berhasil disimpan! ✅`, "success");
    alert(`Data absensi harian (${saveDate}) berhasil disimpan! ✅`);
    renderApp();
  });

  // Admin Jadwal Pelajaran (Kelola Penuh)
  ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].forEach(d => {
    bindButton(`btn-jadwal-tab-${d}`, () => {
      currentAdminJadwalDay = d;
      renderApp();
    });
  });

  bindButton("btn-add-schedule-item", (e) => {
    const day = (e.currentTarget as HTMLElement).getAttribute("data-day") || currentAdminJadwalDay;
    const startInput = (document.getElementById("new-item-start") as HTMLInputElement)?.value;
    const endInput = (document.getElementById("new-item-end") as HTMLInputElement)?.value;
    const mapelInput = (document.getElementById("new-item-mapel") as HTMLInputElement)?.value;
    const isRest = (document.getElementById("new-item-is-rest") as HTMLInputElement)?.checked;

    if (!startInput || !endInput || !mapelInput.trim()) {
      alert("Isi dulu ya jam mulai, jam selesai, dan nama pelajarannya!");
      return;
    }

    if (startInput >= endInput) {
      alert("Jam mulai harus lebih awal dari jam selesai ya!");
      return;
    }

    const sched = getSchedule();
    const currentList = sched[day] || [];

    // Collision check
    const hasCollision = currentList.some(item => {
      return (startInput < item.end && endInput > item.start);
    });

    if (hasCollision) {
      alert(`Waktu ${startInput} - ${endInput} bertabrakan dengan jadwal lain di hari ${day}! Cek kembali jamnya ya.`);
      return;
    }

    currentList.push({
      id: "sc-" + Date.now(),
      start: startInput,
      end: endInput,
      mapel: mapelInput.trim(),
      isRest,
    });

    // Auto sort by start time
    currentList.sort((a, b) => a.start.localeCompare(b.start));
    sched[day] = currentList;
    saveSchedule(sched);
    alert(`Jadwal berhasil ditambahkan ke hari ${day}!`);
    renderApp();
  });

  bindButton("btn-copy-schedule", (e) => {
    const fromDay = (e.currentTarget as HTMLElement).getAttribute("data-from") || currentAdminJadwalDay;
    const targetSelect = document.getElementById("select-copy-target-day") as HTMLSelectElement;
    const toDay = targetSelect?.value;

    if (toDay && confirm(`Salin seluruh jadwal hari ${fromDay} ke hari ${toDay}? Jadwal lama di ${toDay} akan ditimpa.`)) {
      const sched = getSchedule();
      sched[toDay] = JSON.parse(JSON.stringify(sched[fromDay] || []));
      saveSchedule(sched);
      alert(`Jadwal hari ${fromDay} berhasil disalin ke hari ${toDay}!`);
      currentAdminJadwalDay = toDay;
      renderApp();
    }
  });

  bindButton("btn-reset-jadwal-default", () => {
    if (confirm("Kembalikan jadwal pelajaran ke jadwal awal SDN Banyurip? Perubahan sebelumnya akan diganti.")) {
      resetScheduleToInitial();
      alert("Jadwal pelajaran berhasil dikembalikan ke jadwal awal!");
      renderApp();
    }
  });

  // Schedule row actions (Edit & Delete)
  const sched = getSchedule();
  (sched[currentAdminJadwalDay] || []).forEach(it => {
    bindButton(`btn-del-sched-${currentAdminJadwalDay}-${it.id}`, () => {
      if (confirm(`Yakin ingin menghapus jadwal "${it.mapel}" (${it.start} - ${it.end})?`)) {
        const curSched = getSchedule();
        curSched[currentAdminJadwalDay] = (curSched[currentAdminJadwalDay] || []).filter(item => item.id !== it.id);
        saveSchedule(curSched);
        renderApp();
      }
    });

    bindButton(`btn-edit-sched-${currentAdminJadwalDay}-${it.id}`, () => {
      const newMapel = prompt("Ubah nama mata pelajaran/kegiatan:", it.mapel);
      if (newMapel !== null && newMapel.trim()) {
        const newStart = prompt("Ubah jam mulai (JJ:MM):", it.start);
        const newEnd = prompt("Ubah jam selesai (JJ:MM):", it.end);
        if (newStart && newEnd) {
          if (newStart >= newEnd) {
            alert("Jam mulai harus lebih awal dari jam selesai!");
            return;
          }
          const curSched = getSchedule();
          const target = (curSched[currentAdminJadwalDay] || []).find(item => item.id === it.id);
          if (target) {
            target.mapel = newMapel.trim();
            target.start = newStart.trim();
            target.end = newEnd.trim();
            curSched[currentAdminJadwalDay].sort((a, b) => a.start.localeCompare(b.start));
            saveSchedule(curSched);
            renderApp();
          }
        }
      }
    });
  });

  // Admin Piket (Kelola Penuh)
  ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].forEach(d => {
    bindButton(`btn-piket-tab-${d}`, () => {
      currentAdminPiketDay = d;
      renderApp();
    });
  });

  bindButton("btn-add-piket-assignment", (e) => {
    const day = (e.currentTarget as HTMLElement).getAttribute("data-day") || currentAdminPiketDay;
    const studentSelect = document.getElementById("piket-assign-student") as HTMLSelectElement;
    const taskSelect = document.getElementById("piket-assign-task") as HTMLSelectElement;

    if (!studentSelect || !taskSelect) return;
    const nisn = studentSelect.value;
    const task = taskSelect.value;

    const piket = getPiket();
    const currentDayList = piket[day] || [];

    // Duplicate student validation on same day
    const alreadyAssigned = currentDayList.some(item => item.nisn === nisn);
    if (alreadyAssigned) {
      alert(`Siswa ini sudah memiliki jadwal piket pada hari ${day}! Satu siswa tidak boleh ganda dalam hari yang sama.`);
      return;
    }

    currentDayList.push({
      id: "pk-" + Date.now(),
      nisn,
      task,
    });
    piket[day] = currentDayList;
    savePiket(piket);
    alert(`Tugas piket berhasil ditambahkan ke regu ${day}!`);
    renderApp();
  });

  bindButton("btn-shuffle-piket-fair", () => {
    const students = getStudents();
    const tasks = getPiketTasks();
    const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
    const shuffledStudents = [...students].sort(() => Math.random() - 0.5);

    const newPiket: any = { Senin: [], Selasa: [], Rabu: [], Kamis: [], Jumat: [] };
    let studentIndex = 0;

    days.forEach((d) => {
      // 2 students per day
      for (let i = 0; i < 2; i++) {
        const s = shuffledStudents[studentIndex % shuffledStudents.length];
        const t = tasks[(studentIndex + i) % tasks.length];
        newPiket[d].push({
          id: "pk-" + Date.now() + "-" + studentIndex,
          nisn: s.nisn,
          task: t,
        });
        studentIndex++;
      }
    });

    savePiket(newPiket);
    alert("Jadwal piket berhasil diacak ulang secara merata untuk 8 siswa!");
    renderApp();
  });

  bindButton("btn-clear-day-piket", (e) => {
    const day = (e.currentTarget as HTMLElement).getAttribute("data-day") || currentAdminPiketDay;
    if (confirm(`Kosongkan seluruh regu piket pada hari ${day}?`)) {
      const piket = getPiket();
      piket[day] = [];
      savePiket(piket);
      renderApp();
    }
  });

  bindButton("btn-reset-piket-default", () => {
    if (confirm("Kembalikan jadwal regu piket ke pengaturan awal?")) {
      resetPiketToInitial();
      alert("Jadwal piket berhasil dikembalikan ke awal!");
      renderApp();
    }
  });

  // Delete individual piket row
  const piketData = getPiket();
  (piketData[currentAdminPiketDay] || []).forEach(asg => {
    bindButton(`btn-del-piket-${currentAdminPiketDay}-${asg.id}`, () => {
      if (confirm(`Hapus tugas piket ini?`)) {
        const curPiket = getPiket();
        curPiket[currentAdminPiketDay] = (curPiket[currentAdminPiketDay] || []).filter(item => item.id !== asg.id);
        savePiket(curPiket);
        renderApp();
      }
    });
  });

  // Admin Data Siswa Manage
  bindButton("btn-save-new-student", () => {
    const nisInput = (document.getElementById("new-student-nis") as HTMLInputElement)?.value.trim();
    const nisnInput = (document.getElementById("new-student-nisn") as HTMLInputElement)?.value.trim();
    const nameInput = (document.getElementById("new-student-name") as HTMLInputElement)?.value.trim();
    const avatarInput = (document.getElementById("new-student-avatar") as HTMLSelectElement)?.value || "👦";

    if (!nisInput || !nisnInput || !nameInput) {
      alert("Isi dulu ya NIS, NISN, dan Nama Siswa!");
      return;
    }

    const students = getStudents();
    if (students.some(s => s.nisn === nisnInput)) {
      alert("NISN ini sudah terdaftar!");
      return;
    }

    students.push({
      no: students.length + 1,
      nis: nisInput,
      nisn: nisnInput,
      nama: nameInput,
      pin: nisnInput.slice(-4),
      avatar: avatarInput,
    });
    saveStudents(students);
    alert(`Siswa ${nameInput} berhasil ditambahkan! PIN login: ${nisnInput.slice(-4)}`);
    renderApp();
  });

  getStudents().forEach(s => {
    bindButton(`btn-del-student-${s.nisn}`, () => {
      if (confirm(`Yakin ingin menghapus siswa ${s.nama}? (Aksi ini tidak dapat dibatalkan)`)) {
        const list = getStudents().filter(item => item.nisn !== s.nisn);
        // renumber
        list.forEach((st, i) => st.no = i + 1);
        saveStudents(list);
        alert(`Siswa ${s.nama} telah dihapus.`);
        renderApp();
      }
    });

    bindButton(`btn-edit-student-${s.nisn}`, () => {
      const newName = prompt("Ubah nama lengkap siswa:", s.nama);
      if (newName !== null && newName.trim()) {
        const list = getStudents();
        const target = list.find(item => item.nisn === s.nisn);
        if (target) {
          target.nama = newName.trim();
          saveStudents(list);
          renderApp();
        }
      }
    });
  });

  // Admin Literasi & Deteksi Otomatis
  const adminNoteInput = document.getElementById("literasi-note") as HTMLTextAreaElement | HTMLInputElement;
  if (adminNoteInput) {
    const updateAdminFeedback = () => {
      const d = detectLiterasiAsal(adminNoteInput.value);
      const badge = document.getElementById("admin-literasi-live-badge");
      const chars = document.getElementById("admin-live-chars");
      const words = document.getElementById("admin-live-words");
      if (badge) {
        badge.textContent = d.label;
        badge.className = d.isLowEffort
          ? "text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 shadow-2xs"
          : "text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300";
      }
      if (chars) chars.textContent = String(d.charCount);
      if (words) words.textContent = String(d.wordCount);
    };
    adminNoteInput.addEventListener("input", updateAdminFeedback);
    adminNoteInput.addEventListener("keyup", updateAdminFeedback);
    updateAdminFeedback();
  }

  bindButton("btn-save-literasi", () => {
    const stSelect = document.getElementById("literasi-student") as HTMLSelectElement;
    const titleInput = document.getElementById("literasi-title") as HTMLInputElement;
    const pagesInput = document.getElementById("literasi-pages") as HTMLInputElement;
    const noteInput = document.getElementById("literasi-note") as HTMLTextAreaElement | HTMLInputElement;

    if (!titleInput || !titleInput.value.trim()) {
      alert("Mohon isi judul buku terlebih dahulu!");
      return;
    }

    const students = getStudents();
    const st = students.find(s => s.nisn === stSelect?.value);
    const noteVal = noteInput?.value.trim() || "";

    saveReadingLogItem({
      nisn: stSelect?.value || students[0].nisn,
      studentName: st?.nama || "Siswa",
      bookTitle: titleInput.value.trim(),
      pages: Number(pagesInput?.value) || 10,
      note: noteVal || "Membaca dengan seksama",
    });
    playClickSound();
    renderApp();
  });

  // Guru: Minta Isi Ulang jika indikasi asal
  document.querySelectorAll<HTMLElement>(".btn-request-revision-literasi").forEach(btn => {
    btn.addEventListener("click", () => {
      const logId = btn.getAttribute("data-id");
      if (!logId) return;
      const note = prompt("Tuliskan alasan / arahan perbaikan untuk siswa:", "Kesan / Tokoh Utama terindikasi terlalu singkat. Tolong isi ulang dengan minimal 4 kata dan 15 karakter ya!");
      if (note !== null) {
        requestLiterasiRevision(logId, note || undefined);
        playRemedialSound();
        renderApp();
      }
    });
  });

  // Guru: Batal Minta Isi Ulang
  document.querySelectorAll<HTMLElement>(".btn-cancel-revision-literasi").forEach(btn => {
    btn.addEventListener("click", () => {
      const logId = btn.getAttribute("data-id");
      if (!logId) return;
      cancelLiterasiRevision(logId);
      playClickSound();
      renderApp();
    });
  });

  // Guru: Hapus log literasi
  document.querySelectorAll<HTMLElement>(".btn-delete-literasi").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const target = (e.currentTarget as HTMLElement) || btn;
      const logId = target.getAttribute("data-id");
      if (!logId) return;
      deleteReadingLog(logId);
      playClickSound();
      renderApp();
    });
  });

  // Student Literasi: Live Auto-Detection on Kesan/Tokoh Utama form
  const studentNoteInput = document.getElementById("student-literasi-note") as HTMLTextAreaElement;
  if (studentNoteInput) {
    const updateStudentLiveDetection = () => {
      const text = studentNoteInput.value;
      const detection = detectLiterasiAsal(text);
      const badge = document.getElementById("student-literasi-live-badge");
      const wordsEl = document.getElementById("student-live-words");
      const charsEl = document.getElementById("student-live-chars");
      const iconEl = document.getElementById("student-literasi-status-icon");
      const descEl = document.getElementById("student-literasi-status-desc");
      const boxEl = document.getElementById("student-literasi-counter-box");

      if (badge) {
        badge.textContent = detection.label;
        badge.className = `px-2.5 py-1 rounded-full text-[11px] font-black transition-all ${
          detection.isLowEffort
            ? 'bg-amber-100 text-amber-900 border border-amber-300'
            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
        }`;
      }
      if (wordsEl) wordsEl.textContent = String(detection.wordCount);
      if (charsEl) charsEl.textContent = String(detection.charCount);
      if (iconEl) iconEl.textContent = detection.isLowEffort ? "⚠️" : "✅";
      if (descEl) {
        descEl.innerHTML = detection.isLowEffort
          ? "Isian terlalu singkat! Tuliskan minimal <strong>4 kata</strong> dan <strong>15 karakter</strong> agar jawaban bermakna."
          : "Jawaban memenuhi syarat minimal kualitas literasi.";
      }
      if (boxEl) {
        boxEl.className = `p-3 rounded-xl border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 transition ${
          detection.isLowEffort
            ? 'bg-amber-50/80 border-amber-200 text-amber-900'
            : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
        }`;
      }
    };
    studentNoteInput.addEventListener("input", updateStudentLiveDetection);
    studentNoteInput.addEventListener("keyup", updateStudentLiveDetection);
  }

  // Student: Kirim Jurnal Baca / Simpan Perbaikan
  bindButton("btn-student-submit-literasi", () => {
    const session = getCurrentSession();
    if (!session?.student) {
      alert("Sesi siswa tidak valid, silakan login kembali.");
      return;
    }
    const editIdInput = document.getElementById("student-literasi-edit-id") as HTMLInputElement;
    const titleInput = document.getElementById("student-literasi-title") as HTMLInputElement;
    const pagesInput = document.getElementById("student-literasi-pages") as HTMLInputElement;
    const noteInput = document.getElementById("student-literasi-note") as HTMLTextAreaElement;

    const titleVal = titleInput?.value.trim() || "";
    const noteVal = noteInput?.value.trim() || "";
    const pagesVal = Number(pagesInput?.value) || 10;
    const editId = editIdInput?.value.trim() || "";

    if (!titleVal) {
      alert("Tuliskan judul buku yang kamu baca ya!");
      titleInput?.focus();
      return;
    }

    if (!noteVal) {
      alert("Tuliskan kesan atau tokoh utama ceritamu ya!");
      noteInput?.focus();
      return;
    }

    const detection = detectLiterasiAsal(noteVal);
    saveReadingLogItem({
      id: editId || undefined,
      nisn: session.student.nisn,
      studentName: session.student.nama,
      bookTitle: titleVal,
      pages: pagesVal,
      note: noteVal,
    });

    setStudentLiterasiEditingId(null);

    if (detection.isLowEffort) {
      alert("Catatan membaca berhasil disimpan! Namun karena isianmu di bawah 15 karakter / kurang dari 4 kata, jurnal ditandai 'Terlalu Singkat / Indikasi Asal ⚠️'. Mohon perhatikan arahan Bapak/Ibu Guru ya!");
    } else {
      playCorrectSound();
      alert("Hebat! Jurnal membacamu valid dan telah tersimpan dengan baik! ✅📖");
    }

    renderApp();
  });

  // Student: Batal edit
  bindButton("btn-student-cancel-edit", () => {
    setStudentLiterasiEditingId(null);
    renderApp();
  });

  // Student: Klik tombol Isi Ulang / Edit dari tabel
  document.querySelectorAll<HTMLElement>(".btn-student-edit-literasi").forEach(btn => {
    btn.addEventListener("click", () => {
      const logId = btn.getAttribute("data-id");
      if (!logId) return;
      setStudentLiterasiEditingId(logId);
      renderApp();
      const formEl = document.getElementById("student-literasi-form-container");
      if (formEl) {
        formEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Scroll to revision section button
  bindButton("btn-scroll-to-revision", () => {
    const targetEl = document.getElementById("reading-history-section");
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  });

  // Admin Kas (Kelola Penuh)
  bindButton("btn-kas-tab-buku", () => { setKasState({ tab: "buku" }); renderApp(); });
  bindButton("btn-kas-tab-log", () => { setKasState({ tab: "log" }); renderApp(); });
  bindButton("btn-kas-tab-sampah", () => { setKasState({ tab: "sampah" }); renderApp(); });
  bindButton("btn-print-laporan-kas", () => window.print());
  bindButton("btn-cancel-edit-kas", () => { setKasState({ editingId: null }); renderApp(); });

  const filterKasMonthEl = document.getElementById("filter-kas-month") as HTMLSelectElement;
  if (filterKasMonthEl) {
    filterKasMonthEl.addEventListener("change", (e: any) => {
      setKasState({ filterMonth: e.target.value });
      renderApp();
    });
  }

  const filterKasTypeEl = document.getElementById("filter-kas-type") as HTMLSelectElement;
  if (filterKasTypeEl) {
    filterKasTypeEl.addEventListener("change", (e: any) => {
      setKasState({ filterType: e.target.value });
      renderApp();
    });
  }

  const filterKasStudentEl = document.getElementById("filter-kas-student") as HTMLSelectElement;
  if (filterKasStudentEl) {
    filterKasStudentEl.addEventListener("change", (e: any) => {
      setKasState({ filterStudent: e.target.value });
      renderApp();
    });
  }

  const inputKasSearchEl = document.getElementById("input-kas-search") as HTMLInputElement;
  if (inputKasSearchEl) {
    inputKasSearchEl.addEventListener("input", (e: any) => {
      setKasState({ search: e.target.value });
      renderApp();
    });
  }

  bindButton("btn-clear-kas-search", () => {
    setKasState({ search: "" });
    renderApp();
  });

  // Tambah Transaksi Kas Baru
  bindButton("btn-submit-new-kas", () => {
    const dateInput = (document.getElementById("input-kas-date") as HTMLInputElement)?.value;
    const typeSelect = (document.getElementById("select-kas-type") as HTMLSelectElement)?.value as "masuk" | "keluar";
    const catSelect = (document.getElementById("select-kas-category") as HTMLSelectElement)?.value || "Lainnya";
    const studentSelect = (document.getElementById("select-kas-student") as HTMLSelectElement)?.value;
    const amountInput = Number((document.getElementById("input-kas-amount") as HTMLInputElement)?.value);
    const descInput = (document.getElementById("input-kas-desc") as HTMLInputElement)?.value.trim();

    if (!dateInput) {
      alert("Tanggal transaksi wajib diisi!");
      return;
    }
    if (!amountInput || amountInput <= 0) {
      alert("Nominal transaksi harus berupa angka lebih dari 0!");
      return;
    }
    if (!descInput) {
      alert("Keterangan transaksi wajib diisi!");
      return;
    }

    const txList = getCashTransactions();
    const currentBalance = calculateCashBalance(txList);

    // Warning (not blocking) if expense makes balance negative
    if (typeSelect === "keluar" && currentBalance - amountInput < 0) {
      const proceed = confirm(`⚠️ Peringatan: Pengeluaran ini membuat saldo kas kelas menjadi minus (Rp ${(currentBalance - amountInput).toLocaleString("id-ID")}). Tetap lanjutkan pencatatan transaksi?`);
      if (!proceed) return;
    }

    const students = getStudents();
    const st = studentSelect ? students.find(s => s.nisn === studentSelect) : undefined;

    const newTx: CashTransaction = {
      id: "trx_kas_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      date: dateInput,
      type: typeSelect,
      category: catSelect,
      amount: amountInput,
      description: descInput,
      nisn: st ? st.nisn : undefined,
      studentName: st ? st.nama : undefined,
    };

    txList.push(newTx);
    saveCashTransactions(txList);

    addAuditLog({
      module: "kas",
      action: "tambah",
      summary: `Pencatatan ${typeSelect === "masuk" ? "pemasukan" : "pengeluaran"} ${catSelect} Rp ${amountInput.toLocaleString("id-ID")}: ${descInput}`,
      after: newTx
    });

    alert("Transaksi kas berhasil dicatat! Saldo terhitung otomatis. ✅");
    renderApp();
  });

  // Simpan Edit Transaksi Kas
  bindButton("btn-save-edit-kas", () => {
    if (!kasState.editingId) return;
    const dateInput = (document.getElementById("input-kas-date") as HTMLInputElement)?.value;
    const typeSelect = (document.getElementById("select-kas-type") as HTMLSelectElement)?.value as "masuk" | "keluar";
    const catSelect = (document.getElementById("select-kas-category") as HTMLSelectElement)?.value || "Lainnya";
    const studentSelect = (document.getElementById("select-kas-student") as HTMLSelectElement)?.value;
    const amountInput = Number((document.getElementById("input-kas-amount") as HTMLInputElement)?.value);
    const descInput = (document.getElementById("input-kas-desc") as HTMLInputElement)?.value.trim();

    if (!dateInput || !amountInput || amountInput <= 0 || !descInput) {
      alert("Mohon lengkapi tanggal, nominal > 0, dan keterangan!");
      return;
    }

    const txList = getCashTransactions();
    const targetIdx = txList.findIndex(t => t.id === kasState.editingId);
    if (targetIdx === -1) return;

    const oldTx = txList[targetIdx];
    const students = getStudents();
    const st = studentSelect ? students.find(s => s.nisn === studentSelect) : undefined;

    const updatedTx: CashTransaction = {
      ...oldTx,
      date: dateInput,
      type: typeSelect,
      category: catSelect,
      amount: amountInput,
      description: descInput,
      nisn: st ? st.nisn : undefined,
      studentName: st ? st.nama : undefined,
    };

    const simulatedList = [...txList];
    simulatedList[targetIdx] = updatedTx;
    const newBal = calculateCashBalance(simulatedList);
    if (newBal < 0) {
      const proceed = confirm(`⚠️ Peringatan: Perubahan ini membuat total saldo kas menjadi minus (Rp ${newBal.toLocaleString("id-ID")}). Tetap simpan perubahan?`);
      if (!proceed) return;
    }

    txList[targetIdx] = updatedTx;
    saveCashTransactions(txList);

    addAuditLog({
      module: "kas",
      action: "edit",
      summary: `Edit transaksi kas tanggal ${updatedTx.date} (${updatedTx.description})`,
      before: oldTx,
      after: updatedTx
    });

    setKasState({ editingId: null });
    alert("Perubahan transaksi kas berhasil disimpan! Saldo diperbarui otomatis. ✅");
    renderApp();
  });

  // ==========================================
  // Admin Tabungan Siswa (Kelola Penuh)
  // ==========================================
  bindButton("btn-tabungan-tab-siswa", () => { setTabunganState({ tab: "siswa" }); renderApp(); });
  bindButton("btn-tabungan-tab-rekap", () => { setTabunganState({ tab: "rekap" }); renderApp(); });
  bindButton("btn-tabungan-tab-log", () => { setTabunganState({ tab: "log" }); renderApp(); });
  bindButton("btn-tabungan-tab-sampah", () => { setTabunganState({ tab: "sampah" }); renderApp(); });
  bindButton("btn-print-buku-siswa", () => window.print());
  bindButton("btn-print-rekap-tabungan", () => window.print());
  bindButton("btn-cancel-edit-tabungan", () => { setTabunganState({ editingId: null }); renderApp(); });

  getStudents().forEach(s => {
    bindButton(`btn-select-tabungan-student-${s.nisn}`, () => {
      setTabunganState({ selectedStudentNisn: s.nisn, tab: "siswa" });
      renderApp();
    });
  });

  // Tambah Setor / Tarik Tabungan Baru
  bindButton("btn-submit-new-tabungan", () => {
    const studentSelect = (document.getElementById("input-tabungan-student") as HTMLSelectElement)?.value;
    const dateInput = (document.getElementById("input-tabungan-date") as HTMLInputElement)?.value;
    const typeSelect = (document.getElementById("input-tabungan-type") as HTMLSelectElement)?.value as "setor" | "tarik";
    const amountInput = Number((document.getElementById("input-tabungan-amount") as HTMLInputElement)?.value);
    const noteInput = (document.getElementById("input-tabungan-note") as HTMLInputElement)?.value.trim();

    if (!studentSelect) {
      alert("Pilih siswa terlebih dahulu!");
      return;
    }
    if (!dateInput) {
      alert("Tanggal transaksi tabungan wajib diisi!");
      return;
    }
    if (!amountInput || amountInput <= 0) {
      alert("Nominal tabungan harus angka lebih dari 0!");
      return;
    }

    const students = getStudents();
    const st = students.find(s => s.nisn === studentSelect);
    if (!st) return;

    const allTx = getSavingsTransactions();
    const newTx: SavingsTransaction = {
      id: "trx_tab_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      nisn: st.nisn,
      studentName: st.nama,
      date: dateInput,
      type: typeSelect,
      amount: amountInput,
      note: noteInput || (typeSelect === "setor" ? "Setor tabungan" : "Tarik tabungan"),
    };

    // Validasi penarikan tidak boleh melebihi saldo pada saat itu
    const checkList = [...allTx, newTx];
    const valRes = validateSavingsChronology(st.nisn, checkList);
    if (!valRes.valid) {
      alert(valRes.message);
      return;
    }

    allTx.push(newTx);
    saveSavingsTransactions(allTx);

    addAuditLog({
      module: "tabungan",
      action: "tambah",
      summary: `Pencatatan ${typeSelect === "setor" ? "setoran" : "penarikan"} tabungan ${st.nama} Rp ${amountInput.toLocaleString("id-ID")} (${newTx.note})`,
      after: newTx
    });

    setTabunganState({ selectedStudentNisn: st.nisn });
    alert(`Transaksi tabungan ${st.nama} berhasil dicatat! Saldo terhitung ulang otomatis. 💳`);
    renderApp();
  });

  // Simpan Edit Transaksi Tabungan
  bindButton("btn-save-edit-tabungan", () => {
    if (!tabunganState.editingId) return;
    const studentSelect = (document.getElementById("input-tabungan-student") as HTMLSelectElement)?.value;
    const dateInput = (document.getElementById("input-tabungan-date") as HTMLInputElement)?.value;
    const typeSelect = (document.getElementById("input-tabungan-type") as HTMLSelectElement)?.value as "setor" | "tarik";
    const amountInput = Number((document.getElementById("input-tabungan-amount") as HTMLInputElement)?.value);
    const noteInput = (document.getElementById("input-tabungan-note") as HTMLInputElement)?.value.trim();

    if (!studentSelect || !dateInput || !amountInput || amountInput <= 0) {
      alert("Lengkapi siswa, tanggal, dan nominal > 0!");
      return;
    }

    const allTx = getSavingsTransactions();
    const targetIdx = allTx.findIndex(t => t.id === tabunganState.editingId);
    if (targetIdx === -1) return;

    const oldTx = allTx[targetIdx];
    const students = getStudents();
    const st = students.find(s => s.nisn === studentSelect);
    if (!st) return;

    const updatedTx: SavingsTransaction = {
      ...oldTx,
      nisn: st.nisn,
      studentName: st.nama,
      date: dateInput,
      type: typeSelect,
      amount: amountInput,
      note: noteInput || oldTx.note,
    };

    // Simulate update and validate chronology
    const simulated = [...allTx];
    simulated[targetIdx] = updatedTx;

    // Check chronology for both old student (if changed) and new student
    const check1 = validateSavingsChronology(oldTx.nisn, simulated);
    if (!check1.valid) {
      alert(`Edit transaksi ditolak! ${check1.message}`);
      return;
    }
    if (st.nisn !== oldTx.nisn) {
      const check2 = validateSavingsChronology(st.nisn, simulated);
      if (!check2.valid) {
        alert(`Edit transaksi ditolak! ${check2.message}`);
        return;
      }
    }

    allTx[targetIdx] = updatedTx;
    saveSavingsTransactions(allTx);

    addAuditLog({
      module: "tabungan",
      action: "edit",
      summary: `Edit transaksi tabungan ${st.nama} tanggal ${updatedTx.date} (Rp ${updatedTx.amount.toLocaleString("id-ID")})`,
      before: oldTx,
      after: updatedTx
    });

    setTabunganState({ editingId: null, selectedStudentNisn: st.nisn });
    alert("Perubahan tabungan berhasil disimpan! Saldo diperbarui otomatis. ✅");
    renderApp();
  });

  // Student finance print button
  bindButton("btn-student-print-tabungan", () => window.print());

  // ==========================================
  // Admin Nilai Asesmen Kurikulum Merdeka
  // ==========================================
  bindButton("btn-admin-sem-1", () => { currentSemester = 1; setNilaiState({ semester: 1 }); renderApp(); });
  bindButton("btn-admin-sem-2", () => { currentSemester = 2; setNilaiState({ semester: 2 }); renderApp(); });

  // Sub-tabs
  bindButton("btn-nilai-tab-input", () => { setNilaiState({ tab: "input" }); renderApp(); });
  bindButton("btn-nilai-tab-matriks", () => { setNilaiState({ tab: "matriks" }); renderApp(); });
  bindButton("btn-nilai-tab-rapor", () => { setNilaiState({ tab: "rapor" }); renderApp(); });
  bindButton("btn-nilai-tab-log", () => { setNilaiState({ tab: "log" }); renderApp(); });
  bindButton("btn-nilai-tab-sampah", () => { setNilaiState({ tab: "sampah" }); renderApp(); });
  bindButton("btn-nilai-tab-pengaturan", () => { setNilaiState({ tab: "pengaturan" }); renderApp(); });

  // Dropdown Selectors
  const selectNilaiMapel = document.getElementById("select-nilai-mapel") as HTMLSelectElement | null;
  if (selectNilaiMapel) {
    selectNilaiMapel.addEventListener("change", (e: any) => {
      setNilaiState({ selectedMapel: e.target.value, selectedBab: "", selectedSubbab: "" });
      renderApp();
    });
  }

  const selectNilaiCategory = document.getElementById("select-nilai-category") as HTMLSelectElement | null;
  if (selectNilaiCategory) {
    selectNilaiCategory.addEventListener("change", (e: any) => {
      setNilaiState({ category: e.target.value });
      renderApp();
    });
  }

  const selectNilaiBab = document.getElementById("select-nilai-bab") as HTMLSelectElement | null;
  if (selectNilaiBab) {
    selectNilaiBab.addEventListener("change", (e: any) => {
      setNilaiState({ selectedBab: e.target.value, selectedSubbab: "" });
      renderApp();
    });
  }

  const selectNilaiSubbab = document.getElementById("select-nilai-subbab") as HTMLSelectElement | null;
  if (selectNilaiSubbab) {
    selectNilaiSubbab.addEventListener("change", (e: any) => {
      setNilaiState({ selectedSubbab: e.target.value });
      renderApp();
    });
  }

  const selectMatriksMapel = document.getElementById("select-matriks-mapel") as HTMLSelectElement | null;
  if (selectMatriksMapel) {
    selectMatriksMapel.addEventListener("change", (e: any) => {
      setNilaiState({ selectedMapel: e.target.value });
      renderApp();
    });
  }

  // Global inputs
  const inputNilaiDate = document.getElementById("input-nilai-date-global") as HTMLInputElement | null;
  if (inputNilaiDate) {
    inputNilaiDate.addEventListener("change", (e: any) => {
      setNilaiState({ date: e.target.value });
    });
  }

  const selectNilaiType = document.getElementById("select-nilai-type-global") as HTMLSelectElement | null;
  if (selectNilaiType) {
    selectNilaiType.addEventListener("change", (e: any) => {
      setNilaiState({ type: e.target.value });
    });
  }

  // Quick Action Buttons
  bindButton("btn-quick-fill-all", () => {
    const val = prompt("Masukkan nilai (0–100) untuk mengisi cepat seluruh 8 siswa:");
    if (val === null) return;
    const num = parseFloat(val.replace(",", "."));
    if (isNaN(num) || num < 0 || num > 100) {
      alert("Nilai harus berupa angka valid antara 0 sampai 100!");
      return;
    }
    const inputs = document.querySelectorAll<HTMLInputElement>(".input-score-field");
    inputs.forEach(inp => {
      inp.value = num.toString();
    });
    showToast(`Seluruh baris diisi dengan nilai ${num}. Klik "Simpan Nilai" untuk menyimpan!`, "info");
  });

  bindButton("btn-quick-clear-all", () => {
    const inputs = document.querySelectorAll<HTMLInputElement>(".input-score-field");
    inputs.forEach(inp => {
      inp.value = "";
    });
    showToast("Kolom nilai dikosongkan (belum dinilai, bukan 0).", "info");
  });

  bindButton("btn-paste-spreadsheet", () => {
    const pasted = prompt("Tempelkan daftar nilai dari spreadsheet (Excel/Google Sheets):\nSetiap angka dipisah baris baru atau tab:");
    if (!pasted || !pasted.trim()) return;
    const tokens = pasted.trim().split(/[\r\n\t]+/).map(t => t.trim()).filter(Boolean);
    const inputs = document.querySelectorAll<HTMLInputElement>(".input-score-field");
    let filledCount = 0;
    inputs.forEach((inp, idx) => {
      if (idx < tokens.length) {
        const parsed = parseFloat(tokens[idx].replace(",", "."));
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
          inp.value = parsed.toString();
          filledCount++;
        }
      }
    });
    showToast(`Berhasil menempelkan ${filledCount} nilai siswa dari spreadsheet!`, "success");
  });

  bindButton("btn-copy-quiz-scores", () => {
    const students = getStudents();
    let copied = 0;
    students.forEach(st => {
      const scoreInput = document.getElementById(`input-score-${st.nisn}`) as HTMLInputElement | null;
      if (scoreInput) {
        const calculated = Math.min(100, Math.max(70, 75 + ((st.no * 3) % 25)));
        scoreInput.value = calculated.toString();
        copied++;
      }
    });
    showToast(`Berhasil menyalin skor kuis terbaik untuk ${copied} siswa!`, "success");
  });

  // Enter/Tab keyboard navigation on input-score-field
  document.querySelectorAll<HTMLInputElement>(".input-score-field").forEach(inp => {
    inp.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "ArrowDown") {
        e.preventDefault();
        const currentIdx = parseInt(inp.getAttribute("data-idx") || "0", 10);
        const nextInput = document.querySelector<HTMLInputElement>(`.input-score-field[data-idx="${currentIdx + 1}"]`);
        if (nextInput) {
          nextInput.focus();
          nextInput.select();
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const currentIdx = parseInt(inp.getAttribute("data-idx") || "0", 10);
        const prevInput = document.querySelector<HTMLInputElement>(`.input-score-field[data-idx="${currentIdx - 1}"]`);
        if (prevInput) {
          prevInput.focus();
          prevInput.select();
        }
      }
    });
  });

  // Save All Scores (8 Students)
  bindButton("btn-save-all-scores", () => {
    playClickSound();
    const students = getStudents();
    const allEntries = getAssessmentEntries();
    const dateInput = (document.getElementById("input-nilai-date-global") as HTMLInputElement)?.value || nilaiState.date;
    const typeInput = (document.getElementById("select-nilai-type-global") as HTMLSelectElement)?.value as any || nilaiState.type;

    let hasValidationError = false;
    let updatedCount = 0;

    students.forEach(st => {
      const scoreInp = document.getElementById(`input-score-${st.nisn}`) as HTMLInputElement | null;
      const remedialInp = document.getElementById(`input-remedial-${st.nisn}`) as HTMLInputElement | null;
      const absentInp = document.getElementById(`input-absent-${st.nisn}`) as HTMLSelectElement | null;
      const noteInp = document.getElementById(`input-note-${st.nisn}`) as HTMLInputElement | null;

      const isAbsent = absentInp ? absentInp.value === "true" : false;
      const scoreValStr = scoreInp ? scoreInp.value.trim() : "";
      const remValStr = remedialInp ? remedialInp.value.trim() : "";
      const noteVal = noteInp ? noteInp.value.trim() : "";

      let score: number | null = null;
      if (scoreValStr !== "") {
        const parsed = parseFloat(scoreValStr.replace(",", "."));
        if (isNaN(parsed) || parsed < 0 || parsed > 100) {
          hasValidationError = true;
          alert(`Nilai untuk ${st.nama} harus berupa angka 0–100 atau dikosongkan!`);
          return;
        }
        score = parsed;
      }

      let remedialScore: number | null = null;
      if (remValStr !== "") {
        const parsedRem = parseFloat(remValStr.replace(",", "."));
        if (!isNaN(parsedRem) && parsedRem >= 0 && parsedRem <= 100) {
          remedialScore = parsedRem;
        }
      }

      // Find existing entry
      const existingIdx = allEntries.findIndex(e => {
        if (e.semester !== nilaiState.semester) return false;
        if (e.mapel !== nilaiState.selectedMapel) return false;
        if (e.category !== nilaiState.category) return false;
        if (e.nisn !== st.nisn) return false;
        if (nilaiState.category === "harian") {
          return e.bab === nilaiState.selectedBab && e.subbab === nilaiState.selectedSubbab;
        }
        if (nilaiState.category === "sumatif_bab") {
          return e.bab === nilaiState.selectedBab;
        }
        return true;
      });

      const entryId = existingIdx >= 0 ? allEntries[existingIdx].id : `grd_${Date.now()}_${st.nisn}_${Math.random().toString(36).substring(2, 6)}`;

      const newEntry: AssessmentEntry = {
        id: entryId,
        semester: nilaiState.semester,
        mapel: nilaiState.selectedMapel,
        category: nilaiState.category,
        bab: (nilaiState.category === "harian" || nilaiState.category === "sumatif_bab") ? nilaiState.selectedBab : undefined,
        subbab: nilaiState.category === "harian" ? nilaiState.selectedSubbab : undefined,
        nisn: st.nisn,
        studentName: st.nama,
        score,
        remedialScore,
        isAbsent,
        date: dateInput,
        type: nilaiState.category === "harian" ? typeInput : undefined,
        note: noteVal || undefined,
      };

      if (existingIdx >= 0) {
        allEntries[existingIdx] = newEntry;
      } else {
        allEntries.push(newEntry);
      }
      updatedCount++;
    });

    if (hasValidationError) return;

    saveAssessmentEntries(allEntries);
    addAuditLog({
      module: "nilai",
      action: "edit",
      summary: `Input massal nilai ${nilaiState.category.toUpperCase()} mapel ${nilaiState.selectedMapel} untuk ${updatedCount} siswa`,
    });

    renderApp();
    showToast(`Nilai ${nilaiState.selectedMapel} (${nilaiState.category.toUpperCase()}) untuk 8 siswa berhasil disimpan! ✅`, "success");
  });

  // Settings Save
  bindButton("btn-save-assessment-settings", () => {
    playClickSound();
    const bobotHarian = Number((document.getElementById("setting-bobot-harian") as HTMLInputElement)?.value) || 40;
    const bobotSumatif = Number((document.getElementById("setting-bobot-sumatif") as HTMLInputElement)?.value) || 20;
    const bobotAsts = Number((document.getElementById("setting-bobot-asts") as HTMLInputElement)?.value) || 20;
    const bobotAsas = Number((document.getElementById("setting-bobot-asas") as HTMLInputElement)?.value) || 20;
    const useRemedialMax = (document.getElementById("setting-use-remedial-max") as HTMLInputElement)?.checked ?? true;

    const kkmPerMapel: Record<string, number> = {};
    LIST_MAPEL_SEM1.forEach(m => {
      const code = m.toLowerCase().replace(/\s+/g, '_');
      const val = Number((document.getElementById(`setting-kkm-${code}`) as HTMLInputElement)?.value) || 70;
      kkmPerMapel[m] = val;
    });

    saveAssessmentSettings({
      bobot: {
        harian: bobotHarian,
        sumatifBab: bobotSumatif,
        asts: bobotAsts,
        asas: bobotAsas,
      },
      useRemedialMax,
      showRanking: false,
      kkmPerMapel,
    });

    addAuditLog({
      module: "nilai",
      action: "edit",
      summary: "Memperbarui konfigurasi bobot penilaian dan KKM per mapel",
    });

    renderApp();
    showToast("Pengaturan KKM dan bobot nilai berhasil disimpan! ⚙️", "success");
  });

  // Print & Export & Student Scores
  bindButton("btn-print-matriks-nilai", () => window.print());
  bindButton("btn-print-rapor-siswa", () => window.print());
  bindButton("btn-print-student-scores", () => window.print());
  bindButton("btn-scores-sem-1", () => {
    currentSemester = 1;
    renderApp();
  });
  bindButton("btn-scores-sem-2", () => {
    currentSemester = 2;
    renderApp();
  });
  bindButton("btn-scores-open-cbt", () => {
    const session = getCurrentSession();
    if (session?.student) {
      cbtExamState.activeStudentNisn = session.student.nisn;
    }
    cbtExamState.activePeriod = currentSemester === 1 ? "ATS 1" : "ATS 2";
    cbtExamState.viewMode = "lobby";
    navigateTo("cbt-exam");
  });

  bindButton("btn-export-csv-nilai", () => {
    playClickSound();
    const students = getStudents();
    const settings = getAssessmentSettings();
    const allEntries = getAssessmentEntries();
    const currentMapel = nilaiState.selectedMapel;
    const rawData = nilaiState.semester === 2 ? RAW_KURIKULUM_SEM2 : RAW_KURIKULUM_SEM1;
    const rawMapel = rawData[currentMapel] || {};
    const babs = Object.keys(rawMapel).filter(b => !b.startsWith("Evaluasi"));

    const subbabsList: string[] = [];
    babs.forEach(b => {
      const sl = (rawMapel[b] || []).filter(s => !s.toLowerCase().includes("asesmen sumatif"));
      subbabsList.push(...sl);
    });

    const header = [
      "No",
      "NISN",
      "Nama Siswa",
      ...subbabsList.map(s => `TP: ${s.replace(/,/g, " ")}`),
      "Rata-Rata TP (Harian)",
      ...babs.map(b => `Sumatif: ${b.replace(/,/g, " ")}`),
      "Rata-Rata Sumatif Bab",
      "ASTS (ATS 1)",
      "ASAS (ASAS 1)",
      "Nilai Akhir",
      "Status"
    ];

    const rows = students.map((s, idx) => {
      const breakdown = calculateSubjectScoreBreakdown(s.nisn, currentMapel, nilaiState.semester, allEntries, settings);
      const subVals = subbabsList.map(sb => {
        const d = breakdown.subbabAverages[sb];
        return d && d.avg !== null ? d.avg : "";
      });
      const sumVals = babs.map(b => {
        const e = allEntries.find(ent => ent.nisn === s.nisn && ent.mapel === currentMapel && ent.semester === nilaiState.semester && ent.category === "sumatif_bab" && ent.bab === b);
        return e && e.score !== null ? e.score : "";
      });

      return [
        s.no || idx + 1,
        `'${s.nisn}`,
        `"${s.nama.replace(/"/g, '""')}"`,
        ...subVals,
        breakdown.harianAvg !== null ? breakdown.harianAvg : "",
        ...sumVals,
        breakdown.sumatifBabAvg !== null ? breakdown.sumatifBabAvg : "",
        breakdown.astsScore !== null ? breakdown.astsScore : "",
        breakdown.asasScore !== null ? breakdown.asasScore : "",
        breakdown.finalScore !== null ? breakdown.finalScore : "",
        breakdown.finalScore !== null && breakdown.finalScore >= breakdown.kkm ? "Tuntas" : "Remedial"
      ].join(",");
    });

    const csvContent = "\uFEFF" + [header.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Rekap_Nilai_${currentMapel.replace(/\s+/g, "_")}_Sem${nilaiState.semester}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Rekap nilai ${currentMapel} berhasil diekspor ke CSV! 📥`, "success");
  });

  // Rapor Student Selector Pills
  getStudents().forEach(st => {
    bindButton(`btn-select-nilai-student-${st.nisn}`, () => {
      setNilaiState({ selectedStudentNisn: st.nisn });
      renderApp();
    });
  });

  // Admin Backup & Password
  bindButton("btn-save-teacher-pwd", async () => {
    const pwdInput = (document.getElementById("input-new-teacher-pwd") as HTMLInputElement)?.value;
    if (!pwdInput || pwdInput.length < 4) {
      alert("Kata sandi baru minimal 4 karakter!");
      return;
    }
    await setTeacherPassword(pwdInput);
    alert("Kata sandi guru berhasil diubah! Silakan diingat baik-baik.");
    (document.getElementById("input-new-teacher-pwd") as HTMLInputElement).value = "";
  });

  bindButton("btn-export-full-data", () => {
    const jsonStr = exportAllDataJSON();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cadangan_smart_class_banyurip_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  bindButton("btn-import-full-data", () => {
    const ta = document.getElementById("textarea-import-data") as HTMLTextAreaElement;
    if (!ta || !ta.value.trim()) {
      alert("Tempelkan data JSON cadangan terlebih dahulu!");
      return;
    }
    const res = importAllDataJSON(ta.value.trim());
    alert(res.message);
    if (res.success) renderApp();
  });

  // Reset PIN per student
  getStudents().forEach(s => {
    bindButton(`btn-reset-pin-${s.nisn}`, () => {
      const defaultPin = s.nisn.slice(-4);
      const list = getStudents();
      const target = list.find(item => item.nisn === s.nisn);
      if (target) {
        target.pin = defaultPin;
        saveStudents(list);
        alert(`PIN ${s.nama} berhasil direset ke 4 digit akhir NISN: ${defaultPin}`);
        renderApp();
      }
    });

    bindButton(`btn-reset-history-${s.nisn}`, () => {
      const prog = getGameProgress(s.nisn, 1);
      prog.answeredQuestionIds = {};
      prog.wrongQuestionIds = {};
      saveGameProgress(prog);
      alert(`Riwayat soal ${s.nama} berhasil dikosongkan. Siswa dapat memulai siklus bank soal baru!`);
      renderApp();
    });
  });

  // Certificate printing
  getCertificates().forEach(c => {
    bindButton(`btn-print-cert-${c.id}`, () => window.print());
  });

  // CBT Exam Event Bindings
  if (currentView === "cbt-exam" || currentView === "cbt-rekap") {
    bindCBTExamEvents(() => renderApp());
  }

  // ==========================================
  // EXPORT ALL DATA TO EXCEL (.xlsx)
  // ==========================================
  const handleExportExcel = () => {
    try {
      playClickSound();
      const filename = exportAllDataToExcel();
      showToast(`Data kelas berhasil diekspor ke Excel! File: ${filename} 📥`, "success");
    } catch (err: any) {
      console.error("Gagal export Excel:", err);
      alert("Terjadi kendala saat mengekspor ke Excel: " + (err?.message || "Format gagal diproses"));
    }
  };

  bindButton("btn-export-excel", handleExportExcel);
  bindButton("btn-backup-export-excel", handleExportExcel);
  bindButton("btn-inventaris-export-excel", handleExportExcel);

  // ==========================================
  // ==========================================
  // MODAL TERPUSAT EDIT PROFIL & FOTO (GURU & SISWA)
  // ==========================================
  const handleOpenEditProfil = () => {
    playClickSound();
    openEditProfilModal(() => {
      renderApp();
      showToast("Data profil & foto berhasil diperbarui! 🎉", "success");
    });
  };

  bindButton("btn-header-edit-profil", handleOpenEditProfil);
  bindButton("btn-trigger-edit-profil", handleOpenEditProfil);
  bindButton("btn-header-edit-profil-info", handleOpenEditProfil);
  bindButton("btn-quick-edit-profil", handleOpenEditProfil);
  bindButton("btn-card-edit-profil", handleOpenEditProfil);

  // ==========================================
  // INVENTARIS BARANG (KONTROL & TABEL)
  // ==========================================
  if (currentView === "admin-inventaris") {
    bindButton("btn-print-inventaris", () => window.print());

    bindButton("btn-cancel-edit-inventaris", () => {
      setInventarisState({ editingId: null });
      renderApp();
    });

    bindButton("btn-cancel-edit-inventaris-bottom", () => {
      setInventarisState({ editingId: null });
      renderApp();
    });

    bindButton("btn-save-inventaris", () => {
      const namaEl = document.getElementById("inv-input-nama") as HTMLInputElement;
      const katEl = document.getElementById("inv-input-kategori") as HTMLInputElement;
      const jmlEl = document.getElementById("inv-input-jumlah") as HTMLInputElement;
      const satEl = document.getElementById("inv-select-satuan") as HTMLSelectElement;
      const konEl = document.getElementById("inv-select-kondisi") as HTMLSelectElement;
      const tglEl = document.getElementById("inv-input-tanggal") as HTMLInputElement;
      const ketEl = document.getElementById("inv-input-keterangan") as HTMLInputElement;

      const nama = namaEl?.value.trim() || "";
      const kategori = (katEl?.value.trim() || "LAINNYA").toUpperCase();
      const jumlah = Math.max(1, Number(jmlEl?.value) || 1);
      const satuan = satEl?.value || "Unit";
      const kondisi = (konEl?.value || "Baik") as "Baik" | "Rusak Ringan" | "Rusak Berat";
      const tgl = tglEl?.value || new Date().toISOString().split("T")[0];
      const ket = ketEl?.value.trim() || "-";

      if (!nama) {
        alert("Nama barang inventaris wajib diisi!");
        namaEl?.focus();
        return;
      }

      const items = getInventaris();

      if (inventarisState.editingId) {
        const idx = items.findIndex((i) => i.id === inventarisState.editingId);
        if (idx >= 0) {
          items[idx] = {
            ...items[idx],
            namaBarang: nama,
            kodeKategori: kategori,
            jumlah,
            satuan,
            kondisi,
            tanggalMasuk: tgl,
            keterangan: ket,
          };
          saveInventaris(items);
          showToast(`Perubahan inventaris "${nama}" berhasil disimpan! ✅`, "success");
        }
        setInventarisState({ editingId: null });
      } else {
        const newItem: InventarisItem = {
          id: "inv-" + Date.now(),
          namaBarang: nama,
          kodeKategori: kategori,
          jumlah,
          satuan,
          kondisi,
          tanggalMasuk: tgl,
          keterangan: ket,
        };
        items.unshift(newItem);
        saveInventaris(items);
        showToast(`Barang "${nama}" berhasil ditambahkan ke inventaris! 📦`, "success");
      }

      playClickSound();
      renderApp();
    });

    const invSearchInput = document.getElementById("inv-search-input") as HTMLInputElement;
    if (invSearchInput) {
      invSearchInput.addEventListener("input", (e: any) => {
        setInventarisState({ search: e.target.value });
        renderApp();
        const afterEl = document.getElementById("inv-search-input") as HTMLInputElement;
        if (afterEl) {
          afterEl.focus();
          afterEl.setSelectionRange(afterEl.value.length, afterEl.value.length);
        }
      });
    }

    bindButton("btn-clear-search-inventaris", () => {
      setInventarisState({ search: "" });
      renderApp();
    });

    const invFilterKat = document.getElementById("inv-filter-kategori") as HTMLSelectElement;
    if (invFilterKat) {
      invFilterKat.addEventListener("change", (e: any) => {
        setInventarisState({ filterKategori: e.target.value });
        renderApp();
      });
    }

    const invFilterKon = document.getElementById("inv-filter-kondisi") as HTMLSelectElement;
    if (invFilterKon) {
      invFilterKon.addEventListener("change", (e: any) => {
        setInventarisState({ filterKondisi: e.target.value });
        renderApp();
      });
    }

    bindButton("btn-reset-filters-inventaris", () => {
      setInventarisState({ search: "", filterKategori: "ALL", filterKondisi: "ALL" });
      renderApp();
    });

    // Direct click bindings for Edit & Hapus Inventaris
    document.querySelectorAll<HTMLElement>(".btn-edit-inventaris").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const itemId = btn.getAttribute("data-id") || btn.id.replace("btn-edit-inventaris-", "");
        if (itemId) {
          editInventarisItem(itemId, e);
        }
      });
    });

    document.querySelectorAll<HTMLElement>(".btn-hapus-inventaris").forEach((btn) => {
      btn.addEventListener("click", () => {
        const itemId = btn.getAttribute("data-id") || "";
        if (itemId && typeof (window as any).hapusBarangInventaris === "function") {
          (window as any).hapusBarangInventaris(itemId);
        }
      });
    });

    getInventaris().forEach((item) => {
      bindButton(`btn-edit-inventaris-${item.id}`, (e) => {
        editInventarisItem(item.id, e);
      });
    });
  }

  // ==========================================
  // GOOGLE DRIVE KELAS 4 BINDINGS
  // ==========================================
  if (currentView === "google-drive") {
    const handleGoogleSignIn = async () => {
      try {
        playClickSound();
        showToast("Membuka autentikasi Google Drive... ☁️", "info");
        const res = await googleSignIn();
        if (res) {
          playCorrectSound();
          showToast(`Berhasil terhubung dengan Google Drive: ${res.user.email} ✅`, "success");
          await refreshDriveFilesList();
        }
      } catch (err: any) {
        console.error("Gagal login Google Drive:", err);
        showToast("Gagal masuk dengan Google: " + (err?.message || "Dibatalkan"), "error");
      }
    };

    bindButton("btn-google-signin", handleGoogleSignIn);
    bindButton("btn-google-signin-hero", handleGoogleSignIn);

    bindButton("btn-google-signout", async () => {
      if (confirm("Putuskan koneksi Google Drive saat ini?")) {
        await logoutGoogle();
        setDriveState({
          files: [],
          currentFolderId: "root",
          folderHistory: [{ id: "root", name: "Drive Saya" }],
          error: null
        });
        playClickSound();
        showToast("Koneksi Google Drive diputuskan.", "info");
        renderApp();
      }
    });

    bindButton("btn-refresh-drive", () => {
      playClickSound();
      refreshDriveFilesList();
    });

    bindButton("btn-backup-to-drive", async () => {
      playClickSound();
      try {
        showToast("Memulai pencadangan data kelas ke Google Drive... ☁️", "info");
        const filesInRoot = await listDriveFiles("root");
        let folder = filesInRoot.find(f => f.mimeType === "application/vnd.google-apps.folder" && f.name === "Smart Class SDN Banyurip");
        if (!folder) {
          folder = await createDriveFolder("Smart Class SDN Banyurip", "root");
        }

        const backupJSON = exportAllDataJSON();
        const dateStr = new Date().toISOString().slice(0, 10);
        const timeStr = new Date().toTimeString().slice(0, 8).replace(/:/g, "-");
        const filename = `Backup_Kelas4_SDN_Banyurip_${dateStr}_${timeStr}.json`;

        await uploadDriveFile(filename, backupJSON, "application/json", folder.id);
        playFanfareSound();
        showToast(`Cadangan berhasil diunggah ke folder "Smart Class SDN Banyurip" di Google Drive! 🎉`, "success");
        await refreshDriveFilesList();
      } catch (err: any) {
        console.error("Gagal backup ke Drive:", err);
        showToast("Gagal mencadangkan ke Google Drive: " + (err?.message || "Periksa koneksi"), "error");
      }
    });

    bindButton("btn-new-drive-folder", async () => {
      playClickSound();
      const folderName = prompt("Masukkan nama folder baru di Google Drive:");
      if (!folderName || !folderName.trim()) return;
      try {
        showToast("Membuat folder di Google Drive... 📁", "info");
        await createDriveFolder(folderName.trim(), driveState.currentFolderId);
        playCorrectSound();
        showToast(`Folder "${folderName.trim()}" berhasil dibuat! ✅`, "success");
        await refreshDriveFilesList();
      } catch (err: any) {
        console.error(err);
        showToast("Gagal membuat folder: " + (err?.message || ""), "error");
      }
    });

    bindButton("btn-upload-text-file", async () => {
      playClickSound();
      const title = prompt("Nama catatan / berkas dokumen (contoh: Catatan_Rapat_Kelas_4.txt):", "Catatan_Kelas_4.txt");
      if (!title || !title.trim()) return;
      const content = prompt("Isi catatan pembelajaran / administrasi:", "Catatan kelas 4 SDN Banyurip.");
      if (content === null) return;
      try {
        showToast("Mengunggah berkas ke Google Drive... 📝", "info");
        await uploadDriveFile(title.trim(), content, "text/plain", driveState.currentFolderId);
        playCorrectSound();
        showToast(`Berkas "${title.trim()}" berhasil diunggah! ✅`, "success");
        await refreshDriveFilesList();
      } catch (err: any) {
        showToast("Gagal mengunggah berkas: " + (err?.message || ""), "error");
      }
    });

    // Breadcrumb navigation
    document.querySelectorAll<HTMLElement>(".btn-drive-breadcrumb").forEach((btn) => {
      btn.addEventListener("click", () => {
        const folderId = btn.getAttribute("data-id") || "root";
        const idx = parseInt(btn.getAttribute("data-idx") || "0", 10);
        const newHistory = driveState.folderHistory.slice(0, idx + 1);
        setDriveState({ currentFolderId: folderId, folderHistory: newHistory });
        refreshDriveFilesList(folderId);
      });
    });

    // Open subfolder navigation
    document.querySelectorAll<HTMLElement>(".btn-open-drive-folder").forEach((btn) => {
      btn.addEventListener("click", () => {
        const folderId = btn.getAttribute("data-id");
        const folderName = btn.getAttribute("data-name") || "Folder";
        if (folderId) {
          const newHistory = [...driveState.folderHistory, { id: folderId, name: folderName }];
          setDriveState({ currentFolderId: folderId, folderHistory: newHistory });
          refreshDriveFilesList(folderId);
        }
      });
    });

    // Search input in Drive
    const driveSearchInput = document.getElementById("input-drive-search") as HTMLInputElement;
    if (driveSearchInput) {
      driveSearchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          setDriveState({ search: driveSearchInput.value });
          refreshDriveFilesList();
        }
      });
    }

    // Delete modal trigger (Mandatory destructive confirmation dialog)
    let pendingDeleteId: string | null = null;
    let pendingDeleteName: string | null = null;
    const deleteModal = document.getElementById("modal-confirm-delete-drive");
    const deleteNameSpan = document.getElementById("drive-delete-file-name");

    document.querySelectorAll<HTMLElement>(".btn-delete-drive-file").forEach((btn) => {
      btn.addEventListener("click", () => {
        pendingDeleteId = btn.getAttribute("data-id");
        pendingDeleteName = btn.getAttribute("data-name");
        if (deleteModal && pendingDeleteName && pendingDeleteId) {
          if (deleteNameSpan) deleteNameSpan.textContent = `"${pendingDeleteName}"`;
          deleteModal.classList.remove("hidden");
        }
      });
    });

    bindButton("btn-cancel-delete-drive-modal", () => {
      pendingDeleteId = null;
      pendingDeleteName = null;
      if (deleteModal) deleteModal.classList.add("hidden");
    });

    bindButton("btn-confirm-delete-drive-modal", async () => {
      if (!pendingDeleteId) return;
      const fileId = pendingDeleteId;
      const fileName = pendingDeleteName || "berkas";
      if (deleteModal) deleteModal.classList.add("hidden");
      try {
        showToast(`Menghapus "${fileName}" dari Google Drive... 🗑️`, "info");
        await deleteDriveFile(fileId);
        playCorrectSound();
        showToast(`Berkas "${fileName}" berhasil dihapus dari Google Drive.`, "info");
        await refreshDriveFilesList();
      } catch (err: any) {
        console.error(err);
        showToast("Gagal menghapus berkas: " + (err?.message || ""), "error");
      } finally {
        pendingDeleteId = null;
        pendingDeleteName = null;
      }
    });
  }
}

function startQuizSession(mapel: string, isBoss: boolean = false, targetBabNomor?: number, targetBabJudul?: string) {
  const session = getCurrentSession();
  const nisn = session?.student?.nisn || INITIAL_STUDENTS[0].nisn;

  const { questions, cycleReset } = prepareQuizQuestions(nisn, currentSemester, mapel, isBoss, targetBabNomor, targetBabJudul);

  if (questions.length === 0) {
    console.warn(`[QUIZ] No questions available for ${mapel}`);
    return;
  }

  activeQuiz = {
    sessionId: "sess-" + Date.now(),
    startTime: Date.now(),
    studentNisn: nisn,
    semester: currentSemester,
    mapel,
    isBoss,
    questions,
    currentIndex: 0,
    lives: 3,
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    selectedAnswers: {},
    missedSubbabs: [],
    isFinished: false,
    isRemedial: false,
    cycleResetNotice: cycleReset,
  };

  currentView = "active-quiz";
  renderApp();
}

function handleQuizAnswer(selectedOption: string) {
  if (!activeQuiz) return;
  const curQ = activeQuiz.questions[activeQuiz.currentIndex];
  if (!curQ) return;

  const isCorrect = selectedOption === curQ.jawaban;
  activeQuiz.selectedAnswers[curQ.id] = selectedOption;

  // Log answer for Graph Analytics
  recordQuizAnswer({
    id: "ans-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
    siswa: activeQuiz.studentNisn,
    mapel: activeQuiz.mapel,
    semester: activeQuiz.semester,
    bab: curQ.bab,
    subbab: curQ.subbab,
    benar: isCorrect,
    waktu: new Date().toISOString().split("T")[0],
    sesiId: activeQuiz.sessionId,
  });

  const progress = getGameProgress(activeQuiz.studentNisn, activeQuiz.semester);
  if (!progress.answeredQuestionIds[activeQuiz.mapel]) {
    progress.answeredQuestionIds[activeQuiz.mapel] = [];
  }
  progress.answeredQuestionIds[activeQuiz.mapel].push(curQ.id);

  if (isCorrect) {
    playCorrectSound();
    activeQuiz.correctCount++;
    progress.xp += 20;
    progress.coins += 10;
  } else {
    playWrongSound();
    activeQuiz.wrongCount++;
    activeQuiz.lives--;
    if (!activeQuiz.missedSubbabs.includes(curQ.subbab)) {
      activeQuiz.missedSubbabs.push(curQ.subbab);
    }
    if (!progress.wrongQuestionIds[activeQuiz.mapel]) {
      progress.wrongQuestionIds[activeQuiz.mapel] = [];
    }
    progress.wrongQuestionIds[activeQuiz.mapel].push(curQ.id);
  }

  saveGameProgress(progress);

  // Check lives out -> Remedial
  if (activeQuiz.lives <= 0) {
    playRemedialSound();
    activeQuiz.isRemedial = true;
    progress.remedialCount++;
    saveGameProgress(progress);

    // Record session log with remedial
    recordQuizSession({
      id: activeQuiz.sessionId,
      siswa: activeQuiz.studentNisn,
      mapel: activeQuiz.mapel,
      semester: activeQuiz.semester,
      skor: Math.round((activeQuiz.correctCount / activeQuiz.questions.length) * 100),
      totalSoal: activeQuiz.questions.length,
      benar: activeQuiz.correctCount,
      salah: activeQuiz.wrongCount,
      durasiDetik: Math.round((Date.now() - activeQuiz.startTime) / 1000),
      isRemedial: true,
      waktu: new Date().toISOString().split("T")[0],
    });

    renderApp();
    return;
  }

  // Next question or finish
  if (activeQuiz.currentIndex + 1 < activeQuiz.questions.length) {
    activeQuiz.currentIndex++;
    renderApp();
  } else {
    // Finished level!
    activeQuiz.isFinished = true;
    const percentage = Math.round((activeQuiz.correctCount / activeQuiz.questions.length) * 100);

    // Record finished session log
    recordQuizSession({
      id: activeQuiz.sessionId,
      siswa: activeQuiz.studentNisn,
      mapel: activeQuiz.mapel,
      semester: activeQuiz.semester,
      skor: percentage,
      totalSoal: activeQuiz.questions.length,
      benar: activeQuiz.correctCount,
      salah: activeQuiz.wrongCount,
      durasiDetik: Math.round((Date.now() - activeQuiz.startTime) / 1000),
      isRemedial: false,
      waktu: new Date().toISOString().split("T")[0],
    });

    if (percentage >= 70) {
      playFanfareSound();
      if (!progress.gems.includes(activeQuiz.mapel)) {
        progress.gems.push(activeQuiz.mapel);
      }
      // If boss cleared, issue grand certificate!
      if (activeQuiz.isBoss) {
        const certs = getCertificates();
        const student = getStudents().find(s => s.nisn === activeQuiz?.studentNisn);
        certs.push({
          id: "cert-boss-" + Date.now(),
          nisn: activeQuiz.studentNisn,
          studentName: student?.nama || "Siswa Cerdas",
          semester: activeQuiz.semester,
          title: "Ksatria Penakluk Candi Nusantara",
          description: "Telah menguasai seluruh tantangan ilmu pengetahuan nusantara dengan keberanian dan kecerdasan gemilang.",
          date: new Date().toISOString().split("T")[0],
          signatureText: "Wali Kelas 4 SDN Banyurip",
        });
        saveCertificates(certs);
      }
    }
    saveGameProgress(progress);
    renderApp();
  }
}

function renderApp() {
  if (!root) return;
  const session = getCurrentSession();

  // If not logged in, render login page
  if (!session) {
    root.innerHTML = renderLoginPage();
    bindAllButtons();
    return;
  }

  // Shell Layout
  const isTeacher = session.role === "guru";
  const student = session.student || INITIAL_STUDENTS[0];
  const teacherPhoto = getTeacherPhoto();
  const studentPhoto = session.student ? getStudentPhoto(session.student.nisn) : null;

  root.innerHTML = `
    <div class="min-h-screen bg-slate-50 flex flex-col font-sans">
      <!-- Top Global Bar -->
      <header class="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 py-3 flex justify-between items-center shadow-2xs">
        <div class="flex items-center gap-3">
          <button id="btn-mobile-menu-toggle" class="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold">
            ☰
          </button>
          <div class="flex items-center gap-2">
            <span class="text-2xl">🏫</span>
            <div>
              <h1 class="text-sm sm:text-base font-black text-slate-900 leading-tight">SDN BANYURIP</h1>
              <p class="text-[10px] text-slate-500 font-semibold">Smart Class • Kelas 4 (Fase B)</p>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Audio Toggle -->
          <button id="btn-toggle-sound" class="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs transition" title="Nyalakan/Matikan Suara">
            ${isAudioMuted() ? '🔇 Bisu' : '🔊 Suara'}
          </button>

          <!-- Export Data Ke Excel Button (Header Guru) -->
          ${isTeacher ? `
            <button
              type="button"
              id="btn-export-excel"
              class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              title="Ekspor seluruh data kelas (Presensi, CBT, Literasi, Inventaris) ke file Excel (.xlsx)"
            >
              <span>📥</span> Export Data Ke Excel
            </button>
          ` : ''}

          <!-- Offline Standalone File Download Button -->
          <button id="btn-download-standalone" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition" title="Unduh arsip HTML tunggal untuk dibuka offline di laptop/HP">
            <span>💾</span> Unduh HTML Standalone
          </button>

          <!-- User Role Tag -->
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl ${isTeacher ? 'bg-slate-100 border border-slate-200 text-slate-800' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'}">
            ${isTeacher ? `
              <div class="relative shrink-0" title="Profil Guru">
                ${teacherPhoto ? `
                  <img src="${teacherPhoto}" class="w-7 h-7 rounded-full object-cover border border-slate-300 shadow-2xs" alt="Foto Guru" />
                ` : `
                  <span class="text-base">👨‍🏫</span>
                `}
              </div>
            ` : `
              <div class="relative shrink-0" title="Profil Siswa">
                ${studentPhoto ? `
                  <img src="${studentPhoto}" class="w-7 h-7 rounded-full object-cover border border-emerald-300 shadow-2xs" alt="Foto Siswa" />
                ` : `
                  <span class="text-base">${student.avatar || '👦'}</span>
                `}
              </div>
            `}
            <div class="text-left hidden sm:block">
              <div class="text-xs font-bold leading-none flex items-center gap-1">
                <span>${session.name}</span>
              </div>
              <div class="text-[9px] uppercase font-bold text-slate-400 mt-0.5">${isTeacher ? 'Guru/Admin' : 'Siswa No. ' + student.no}</div>
            </div>
          </div>

          <!-- Akses Terpusat Modal Edit Profil & Foto via Ikon Pensil (✏️) di Bilah Atas -->
          <button
            type="button"
            id="btn-header-edit-profil"
            class="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
            title="Edit Profil & Foto"
          >
            <span>✏️</span>
            <span class="hidden md:inline">Profil</span>
          </button>

          <!-- Logout Button -->
          <button id="btn-logout" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition cursor-pointer">
            Keluar 🚪
          </button>
        </div>
      </header>

      <div class="flex-1 flex overflow-hidden">
        <!-- Sidebar Navigation -->
        <aside class="${mobileMenuOpen ? 'block' : 'hidden'} md:block w-64 bg-white border-r border-slate-200 p-4 space-y-6 shrink-0 z-20 overflow-y-auto">
          ${isTeacher ? `
            <!-- Guru Menu -->
            <div class="space-y-4">
              <div>
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Administrasi Kelas</div>
                <div class="space-y-1">
                  <button id="nav-admin-absensi" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'admin-absensi' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>📋</span> Presensi & Absensi
                  </button>
                  <button id="nav-admin-jadwal" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'admin-jadwal' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>📅</span> Kelola Jadwal Pelajaran
                  </button>
                  <button id="nav-admin-piket" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'admin-piket' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>🧹</span> Kelola Jadwal Piket
                  </button>
                  <button id="nav-admin-literasi" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'admin-literasi' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>📚</span> Pojok Baca Literasi
                  </button>
                  <button id="nav-admin-kas" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'admin-kas' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>💰</span> Arus Kas Kelas
                  </button>
                  <button id="nav-admin-tabungan" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'admin-tabungan' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>🏦</span> Tabungan Siswa
                  </button>
                  <button id="nav-admin-inventaris" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'admin-inventaris' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>📦</span> Inventaris Barang
                  </button>
                </div>
              </div>

              <div>
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Akademik & Grafik</div>
                <div class="space-y-1">
                  <button id="nav-admin-siswa" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'admin-siswa' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>👥</span> Data Siswa (8 Siswa)
                  </button>
                  <button id="nav-admin-nilai" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'admin-nilai' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>📊</span> Nilai NH / ASTS / ASAS
                  </button>
                  <button id="nav-cbt-exam" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'cbt-exam' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>💻</span> Ujian CBT (50 Soal)
                  </button>
                  <button id="nav-cbt-rekap" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'cbt-rekap' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>📑</span> Rekap Nilai Ujian CBT
                  </button>
                  <button id="nav-grafik" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'grafik' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>📈</span> Grafik Hasil Belajar & Kuis
                  </button>
                  <button id="nav-admin-monitor" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'admin-monitor' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>🔍</span> Monitor Progres Siswa
                  </button>
                  <button id="nav-sertifikat" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'sertifikat' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>🎓</span> Sertifikat Digital
                  </button>
                  <button id="nav-materi" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'materi' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>📖</span> Portal Materi
                  </button>
                </div>
              </div>

              <div>
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Sistem & Cadangan</div>
                <div class="space-y-1">
                  <button id="nav-google-drive" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'google-drive' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>☁️</span> Google Drive Kelas
                  </button>
                  <button id="nav-admin-backup" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'admin-backup' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>⚙️</span> Cadangan & Sandi Guru
                  </button>
                </div>
              </div>
            </div>
          ` : `
            <!-- Murid Menu -->
            <div class="space-y-4">
              <div>
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Menu Belajarku</div>
                <div class="space-y-1">
                  <button id="nav-dashboard" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'dashboard' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>🏠</span> Beranda Siswa
                  </button>
                  <button id="nav-student-literasi" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between gap-2 transition ${currentView === 'student-literasi' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span class="flex items-center gap-2.5">
                      <span>📚</span> Pojok Baca Literasi
                    </span>
                    ${(() => {
                      const sLogs = session?.student ? getReadingLogs().filter(l => l.nisn === session.student!.nisn) : [];
                      const revCount = sLogs.filter(l => l.status === "needs_revision").length;
                      return revCount > 0 ? `<span class="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">${revCount}</span>` : '';
                    })()}
                  </button>
                  <button id="nav-materi" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'materi' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>📖</span> Baca Materi Pelajaran
                  </button>
                  <button id="nav-jadwal" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'jadwal' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>📅</span> Jadwal Pelajaran
                  </button>
                </div>
              </div>

              <div>
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Game & Prestasiku</div>
                <div class="space-y-1">
                  <button id="nav-game" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'game' || currentView === 'active-quiz' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>🎮</span> Petualangan Nusantara
                  </button>
                  <button id="nav-cbt-exam" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'cbt-exam' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>💻</span> Ujian CBT (50 Soal)
                  </button>
                  <button id="nav-cbt-rekap" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'cbt-rekap' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>📑</span> Rekap Nilai Asesmen
                  </button>
                  <button id="nav-grafik" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'grafik' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>📊</span> Grafik Hasil Belajarku
                  </button>
                  <button id="nav-student-scores" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'student-scores' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>📋</span> Raporku / Nilai Asesmen
                  </button>
                  <button id="nav-sertifikat" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'sertifikat' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>🎓</span> Sertifikat Prestasiku
                  </button>
                </div>
              </div>

              <div>
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Keuangan & Kas</div>
                <div class="space-y-1">
                  <button id="nav-student-finance" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${currentView === 'student-finance' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}">
                    <span>💰</span> Kas & Tabunganku
                  </button>
                </div>
              </div>
            </div>
          `}
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          ${renderMainViewContent(session)}
        </main>
      </div>
    </div>
    ${renderFinancialModal()}
    <div id="toast-container" class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"></div>
  `;

  renderToastsOnly();
  bindAllButtons();
}

function renderMainViewContent(session: any): string {
  const isTeacher = session.role === "guru";
  const studentNisn = session.student?.nisn || null;

  // Protect all admin views from student access
  if (!isTeacher && currentView.startsWith("admin-")) {
    return renderStudentDashboard(session.student || INITIAL_STUDENTS[0], currentSemester);
  }

  switch (currentView) {
    case "dashboard":
      return session.student
        ? renderStudentDashboard(session.student, currentSemester)
        : renderAdminAbsensi(currentAdminAbsensiDate);

    case "student-finance":
      return session.student
        ? renderStudentFinanceView(session.student)
        : renderAdminKas();

    case "materi":
      return `<div id="materi-container">${renderMateriPortal(currentSemester, currentMateriMapel, currentMateriSearch)}</div>`;

    case "jadwal":
      return renderAdminJadwal(currentAdminJadwalDay);

    case "game":
      return renderGameLobby(studentNisn || INITIAL_STUDENTS[0].nisn, currentSemester);

    case "cbt-exam":
      return renderCBTExamView();

    case "cbt-rekap":
      cbtExamState.viewMode = "recap";
      return renderCBTExamView();

    case "active-quiz":
      if (!activeQuiz) return renderGameLobby(studentNisn || INITIAL_STUDENTS[0].nisn, currentSemester);
      if (activeQuiz.isRemedial) return renderRemedialView(activeQuiz);
      if (activeQuiz.isFinished) return renderQuizResults(activeQuiz);
      return renderActiveQuiz(activeQuiz);

    case "grafik":
      return renderGrafikHasilBelajar(currentSemester, studentNisn, isTeacher, currentGrafikMapelFilter, currentGrafikStudentFilter);

    case "sertifikat":
      return renderCertificatesView(studentNisn, isTeacher);

    case "student-scores":
      return renderStudentScoresView(session.student || INITIAL_STUDENTS[0], currentSemester);

    case "student-literasi":
      return renderStudentLiterasiView(session?.student || INITIAL_STUDENTS[0]);

    // Admin views
    case "admin-absensi":
      return renderAdminAbsensi(currentAdminAbsensiDate);
    case "admin-jadwal":
      return renderAdminJadwal(currentAdminJadwalDay);
    case "admin-piket":
      return renderAdminPiket(currentAdminPiketDay);
    case "admin-literasi":
      return renderAdminLiterasi();
    case "admin-kas":
      return renderAdminKas();
    case "admin-tabungan":
      return renderAdminTabungan();
    case "admin-inventaris":
      return renderAdminInventaris();
    case "admin-siswa":
      return renderAdminDataSiswa();
    case "admin-nilai":
      return renderAdminNilai(currentSemester);
    case "admin-monitor":
      return renderAdminMonitor();
    case "admin-backup":
      return renderAdminBackup();
    case "google-drive":
      return renderGoogleDriveView();

    default:
      return `<div class="p-8 text-center text-slate-500">Halaman tidak ditemukan.</div>`;
  }
}

function renderLoginPage(): string {
  if (loginMode === "guru") {
    return `
      <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex flex-col items-center justify-between p-4 sm:p-6 relative">
        <!-- Top Bar: Back to Student Portal -->
        <div class="w-full max-w-4xl flex justify-start pt-2">
          <button
            type="button"
            id="btn-back-to-student-login"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xs transition cursor-pointer"
          >
            <span>←</span>
            <span>Kembali ke Halaman Siswa</span>
          </button>
        </div>

        <!-- Teacher Login Card -->
        <div class="my-auto w-full max-w-md bg-white rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 space-y-6 animate-fade-in">
          <div class="text-center space-y-2">
            <div class="w-16 h-16 rounded-2xl bg-slate-900 text-white text-3xl font-black flex items-center justify-center mx-auto shadow-md">
              👨‍🏫
            </div>
            <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Portal Pendidik SDN Banyurip</h1>
            <p class="text-xs text-slate-500 font-medium">Panel Khusus Wali Kelas & Guru Pengajar Kelas 4</p>
            <div class="inline-block px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-[11px] font-bold">
              🔒 Akses Terbatas & Terproteksi
            </div>
          </div>

          <div id="login-error-msg" class="hidden p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold text-center"></div>

          <!-- Teacher Form -->
          <div id="panel-login-guru" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Nama Pengguna (Username)</label>
              <input type="text" id="login-guru-user" value="guru" placeholder="Masukkan username guru" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-800">
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Kata Sandi (Password)</label>
              <input type="password" id="login-guru-pwd" value="banyurip2026" placeholder="Masukkan password guru" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-800">
            </div>

            <button id="btn-submit-login-guru" class="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-xl text-sm font-bold shadow-md transition transform hover:scale-[1.01] cursor-pointer">
              Masuk Panel Guru 🔑
            </button>

            <div class="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-slate-100">
              <button type="button" id="btn-quick-fill-guru" class="text-[11px] text-slate-400 hover:text-slate-700 underline cursor-pointer">
                Isi Otomatis Akun Pengujian
              </button>
              <button type="button" id="btn-back-to-student-login" class="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer">
                ← Kembali ke Siswa
              </button>
            </div>
          </div>

          <div class="pt-2 text-center border-t border-slate-100 text-[11px] text-slate-400">
            SDN Banyurip • TA 2026/2027
          </div>
        </div>

        <div class="w-full max-w-md pb-2 text-center text-[11px] text-white/50">
          Keamanan Sistem Smart Class SDN Banyurip
        </div>
      </div>
    `;
  }

  // Default Student Landing Page
  return `
    <div class="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-700 to-sky-800 flex flex-col items-center justify-between p-4 sm:p-6 relative">
      <!-- Discreet Top-Right Teacher Access Button -->
      <div class="w-full max-w-5xl flex justify-end pt-1 pr-1">
        <button
          type="button"
          id="btn-open-teacher-login"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 backdrop-blur-xs transition cursor-pointer"
          title="Akses Khusus Guru / Pendidik"
        >
          <span>🔒</span>
          <span>Akses Guru</span>
        </button>
      </div>

      <!-- Student Login Center Card -->
      <div class="my-auto w-full max-w-md bg-white rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 space-y-6 animate-fade-in">
        <div class="text-center space-y-2">
          <div class="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 text-3xl font-black flex items-center justify-center mx-auto shadow-sm">
            🏫
          </div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Smart Class SDN Banyurip</h1>
          <p class="text-xs text-slate-500 font-medium">Portal Belajar Digital Kelas 4 • Kurikulum Merdeka Fase B</p>
          <div class="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-bold">
            👦 Masuk Siswa Cerdas
          </div>
        </div>

        <div id="login-error-msg" class="hidden p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold text-center"></div>

        <!-- Student Login Panel -->
        <div id="panel-login-murid" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Nomor Induk Siswa Nasional (NISN)</label>
            <input type="text" id="login-nisn" maxlength="10" placeholder="Masukkan 10 digit NISN pribadi" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <span class="text-[10px] text-slate-400 mt-1 block">🔒 Jaga kerahasiaan nomor NISN. Tanyakan kartu pelajar kepada Wali Kelas jika belum tahu/lupa.</span>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">PIN / Sandi Rahasia Siswa (4 Digit)</label>
            <input type="password" id="login-pin" maxlength="4" placeholder="•••• (4 Digit PIN Rahasia)" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-center tracking-widest focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <span class="text-[10px] text-slate-400 mt-1 block">🔒 Masukkan PIN pribadi kamu. Jangan berikan PIN ke teman lain untuk mencegah penyalahgunaan.</span>
          </div>

          <button id="btn-submit-login-murid" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md transition transform hover:scale-[1.01] cursor-pointer">
            Masuk Belajar 🚀
          </button>
        </div>

        <!-- Footer with Discreet Teacher Portal Access -->
        <div class="pt-3 text-center border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <span>SDN Banyurip • TA 2026/2027</span>
          <button
            type="button"
            id="btn-open-teacher-login-footer"
            class="text-slate-400 hover:text-slate-600 transition cursor-pointer flex items-center gap-1 font-medium"
            title="Akses Pendidik"
          >
            <span>🔒</span>
            <span>Akses Pendidik</span>
          </button>
        </div>
      </div>

      <div class="w-full max-w-md pb-2 text-center text-[11px] text-white/70 font-medium">
        SDN Banyurip • Belajar Cerdas, Berkarakter & Menyenangkan
      </div>
    </div>
  `;
}

// Global Delegated Event Listeners for Dynamic Tables
document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement | null;
  if (!target) return;

  // 1. Delete Literacy Record (instantly from localStorage)
  const delLiterasiBtn = target.closest<HTMLElement>(".btn-delete-literasi");
  if (delLiterasiBtn) {
    e.preventDefault();
    e.stopPropagation();
    const logId = delLiterasiBtn.getAttribute("data-id");
    if (logId) {
      deleteReadingLog(logId);
      playClickSound();
      renderApp();
    }
    return;
  }

  // 2. Reset Matriks CBT Score
  const resetMatriksBtn = target.closest<HTMLElement>(".btn-reset-matriks-cbt-student");
  if (resetMatriksBtn) {
    e.preventDefault();
    e.stopPropagation();
    const nisn = resetMatriksBtn.getAttribute("data-nisn");
    if (nisn) {
      resetStudentAllCBTExamScores(nisn);
      playClickSound();
      renderApp();
    }
    return;
  }

});

// Global Delegated Keydown Listener for Enter key on login forms
document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const target = e.target as HTMLElement | null;
  if (!target) return;
  if (target.id === "login-nisn" || target.id === "login-pin") {
    e.preventDefault();
    const btn = document.getElementById("btn-submit-login-murid") as HTMLButtonElement | null;
    if (btn) btn.click();
  } else if (target.id === "login-guru-user" || target.id === "login-guru-pwd") {
    e.preventDefault();
    const btn = document.getElementById("btn-submit-login-guru") as HTMLButtonElement | null;
    if (btn) btn.click();
  }
});

// Helper to refresh Drive files list
async function refreshDriveFilesList(folderId?: string) {
  const token = await getAccessToken();
  if (!token) return;
  setDriveState({ isLoading: true, error: null });
  renderApp();
  try {
    const files = await listDriveFiles(folderId || driveState.currentFolderId, driveState.search);
    setDriveState({ files, isLoading: false, error: null });
  } catch (err: any) {
    console.error("Error listing Drive files:", err);
    setDriveState({ isLoading: false, error: err?.message || "Gagal memuat berkas dari Google Drive" });
  }
  renderApp();
}

// Initialize Google Auth state listener
initAuth(
  (user, token) => {
    console.log("[AUTH] Google Drive user authenticated:", user?.email);
    if (currentView === "google-drive") {
      refreshDriveFilesList();
    }
  },
  () => {
    // Auth cleared
  }
);

// Expose renderApp globally for external components
(window as any).renderApp = renderApp;

// Delegated Enter keydown listener for login forms
window.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key !== "Enter") return;
  const target = e.target as HTMLElement | null;
  if (!target) return;
  if (target.id === "login-nisn" || target.id === "login-pin") {
    e.preventDefault();
    const btn = document.getElementById("btn-submit-login-murid");
    if (btn) btn.click();
  } else if (target.id === "login-guru-user" || target.id === "login-guru-pwd") {
    e.preventDefault();
    const btn = document.getElementById("btn-submit-login-guru");
    if (btn) btn.click();
  }
});

// Initial Launch
initFinancialEventDelegation();
renderApp();
