import { INITIAL_STUDENTS, Student } from "../data/students";
import { INITIAL_SCHEDULE, WeekSchedule } from "../data/schedule";
import { ALL_INITIAL_MATERIALS } from "../data/allMaterials";
import { MapelMateri } from "../data/materials";
import { INITIAL_QUESTIONS_SEM1, QuestionItem } from "../data/questions";
import { RAW_KURIKULUM_SEM1, RAW_KURIKULUM_SEM2, LIST_MAPEL_SEM1, LIST_MAPEL_SEM2 } from "../data/kurikulum";

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  status: Record<string, "H" | "S" | "I" | "A">; // nisn -> status
}

export interface PiketAssignment {
  id: string;
  nisn: string;
  task: string;
}

export type PiketScheduleFull = Record<string, PiketAssignment[]>;

export const DEFAULT_PIKET_TASKS = [
  "Menyapu Ruang Kelas",
  "Menghapus Papan Tulis",
  "Menyiram Tanaman Kelas",
  "Merapikan Meja Guru & Buku",
  "Membuang Sampah ke Bak",
];

export const INITIAL_PIKET_FULL: PiketScheduleFull = {
  Senin: [
    { id: "pk-1", nisn: "3174825699", task: "Menyapu Ruang Kelas" },
    { id: "pk-2", nisn: "3164156323", task: "Menghapus Papan Tulis" },
  ],
  Selasa: [
    { id: "pk-3", nisn: "3160371126", task: "Menyapu Ruang Kelas" },
    { id: "pk-4", nisn: "3163061042", task: "Merapikan Meja Guru & Buku" },
  ],
  Rabu: [
    { id: "pk-5", nisn: "3179753223", task: "Menyiram Tanaman Kelas" },
    { id: "pk-6", nisn: "3161250761", task: "Menyapu Ruang Kelas" },
  ],
  Kamis: [
    { id: "pk-7", nisn: "3157482420", task: "Menyapu Ruang Kelas" },
    { id: "pk-8", nisn: "3157679187", task: "Membuang Sampah ke Bak" },
  ],
  Jumat: [
    { id: "pk-9", nisn: "3174825699", task: "Menyapu Ruang Kelas" },
    { id: "pk-10", nisn: "3163061042", task: "Menghapus Papan Tulis" },
  ],
};

export interface AutoDetectionResult {
  isLowEffort: boolean;
  charCount: number;
  wordCount: number;
  label: "Terlalu Singkat / Indikasi Asal ⚠️" | "Valid ✅";
  reason: string;
}

export function detectLiterasiAsal(text: string): AutoDetectionResult {
  const trimmed = (text || "").trim();
  const charCount = trimmed.length;
  const words = trimmed.length > 0 ? trimmed.split(/\s+/).filter(w => w.length > 0) : [];
  const wordCount = words.length;

  // Rule: Di bawah 15 karakter ATAU kurang dari 4 kata -> Indikasi Asal ⚠️
  // Memenuhi syarat: Minimal 4 kata DAN minimal 15 karakter -> Valid ✅
  const isLowEffort = charCount < 15 || wordCount < 4;

  if (isLowEffort) {
    let reason = "Isian terlalu singkat";
    if (charCount < 15 && wordCount < 4) {
      reason = `Hanya ${wordCount} kata & ${charCount} karakter (minimal 4 kata & 15 karakter)`;
    } else if (charCount < 15) {
      reason = `Hanya ${charCount} karakter (minimal 15 karakter)`;
    } else {
      reason = `Hanya ${wordCount} kata (minimal 4 kata)`;
    }
    return {
      isLowEffort: true,
      charCount,
      wordCount,
      label: "Terlalu Singkat / Indikasi Asal ⚠️",
      reason
    };
  }

  return {
    isLowEffort: false,
    charCount,
    wordCount,
    label: "Valid ✅",
    reason: `Memenuhi syarat (${wordCount} kata, ${charCount} karakter)`
  };
}

export interface ReadingLog {
  id: string;
  nisn: string;
  studentName: string;
  date: string;
  bookTitle: string;
  pages: number;
  note: string; // Kesan / Tokoh Utama
  status?: "valid" | "flagged" | "needs_revision" | "approved";
  flagLabel?: "Terlalu Singkat / Indikasi Asal ⚠️" | "Valid ✅";
  flagReason?: string;
  teacherNote?: string;
  updatedAt?: string;
}

export interface CashTransaction {
  id: string;
  date: string;
  type: "masuk" | "keluar";
  category: string;
  amount: number;
  description: string;
  nisn?: string;
  studentName?: string;
}

export interface SavingsTransaction {
  id: string;
  nisn: string;
  studentName: string;
  date: string;
  type: "setor" | "tarik";
  amount: number;
  note: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  module: "kas" | "tabungan" | "nilai" | "sertifikat" | "absensi" | "inventaris";
  action: "tambah" | "edit" | "hapus" | "pulihkan" | "hapus_permanen" | "simpan";
  summary: string;
  before?: any;
  after?: any;
}

export interface AssessmentEntry {
  id: string;
  semester: 1 | 2;
  mapel: string;
  category: "harian" | "sumatif_bab" | "asts" | "asas";
  bab?: string; // e.g. "Bab 1: Mengenal Lingkungan Sekitar"
  subbab?: string; // e.g. "A. Identitas masyarakat di lingkungan tempat tinggal"
  nisn: string;
  studentName: string;
  score: number | null; // 0-100 or null (null = belum dinilai, not zero)
  remedialScore?: number | null; // nilai setelah remedial jika di bawah KKM
  isAbsent?: boolean; // tidak ikut (absen)
  date: string;
  type?: "Tugas" | "Kuis" | "Praktik" | "Keaktifan" | "Lainnya";
  note?: string;
}

export interface AssessmentSettings {
  kkmPerMapel: Record<string, number>;
  bobot: {
    harian: number; // default 40
    sumatifBab: number; // default 20
    asts: number; // default 20
    asas: number; // default 20
  };
  useRemedialMax: boolean; // default true
  showRanking: boolean; // default false
}

export interface TrashItem {
  id: string;
  deletedAt: string;
  module: "kas" | "tabungan" | "nilai" | "sertifikat";
  item: CashTransaction | SavingsTransaction | AssessmentEntry | CertificateItem;
}

export interface StudentScore {
  nisn: string;
  mapel: string;
  semester: 1 | 2;
  nh: number;   // Nilai Harian
  asts: number | null; // Nilai ASTS (null bila belum ujian CBT)
  asas: number | null; // Nilai ASAS (null bila belum ujian CBT)
}

export interface QuizAnswerLog {
  id: string;
  siswa: string; // nisn
  mapel: string;
  semester: 1 | 2;
  bab: string;
  subbab: string;
  benar: boolean;
  waktu: string;
  sesiId: string;
}

export interface QuizSessionLog {
  id: string;
  siswa: string; // nisn
  mapel: string;
  semester: 1 | 2;
  skor: number; // 0 - 100
  totalSoal: number;
  benar: number;
  salah: number;
  durasiDetik: number;
  isRemedial: boolean;
  waktu: string;
}

export interface GameProgress {
  nisn: string;
  semester: 1 | 2;
  xp: number;
  coins: number;
  gems: string[];
  achievements: string[];
  answeredQuestionIds: Record<string, string[]>;
  wrongQuestionIds: Record<string, string[]>;
  remedialCount: number;
  lastPlayed: string;
}

export interface CertificateItem {
  id: string;
  nisn: string;
  studentName: string;
  semester: 1 | 2;
  title: string;
  description: string;
  date: string;
  signatureText: string;
}

const STORAGE_PREFIX = "smartclass_banyurip_";

export function getData<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

export function setData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

// Students
export function getStudents(): Student[] {
  return getData<Student[]>("students", INITIAL_STUDENTS);
}

export function saveStudents(students: Student[]): void {
  setData("students", students);
}

// Schedule
export function getSchedule(): WeekSchedule {
  return getData<WeekSchedule>("schedule", INITIAL_SCHEDULE);
}

export function saveSchedule(schedule: WeekSchedule): void {
  setData("schedule", schedule);
}

export function resetScheduleToInitial(): WeekSchedule {
  setData("schedule", INITIAL_SCHEDULE);
  return INITIAL_SCHEDULE;
}

// Piket
export function getPiket(): PiketScheduleFull {
  return getData<PiketScheduleFull>("piket_full", INITIAL_PIKET_FULL);
}

export function savePiket(piket: PiketScheduleFull): void {
  setData("piket_full", piket);
}

export function resetPiketToInitial(): PiketScheduleFull {
  setData("piket_full", INITIAL_PIKET_FULL);
  return INITIAL_PIKET_FULL;
}

export function getPiketTasks(): string[] {
  return getData<string[]>("piket_task_list", DEFAULT_PIKET_TASKS);
}

export function savePiketTasks(tasks: string[]): void {
  setData("piket_task_list", tasks);
}

// Materials
const MATERIALS_VERSION_KEY = "materials_v2026_nentoake";
export function getMaterials(): Record<string, MapelMateri> {
  const version = getData<string>("materials_version", "");
  if (version !== MATERIALS_VERSION_KEY) {
    setData("materials", ALL_INITIAL_MATERIALS);
    setData("materials_version", MATERIALS_VERSION_KEY);
    return ALL_INITIAL_MATERIALS;
  }
  return getData<Record<string, MapelMateri>>("materials", ALL_INITIAL_MATERIALS);
}

export function saveMaterials(materials: Record<string, MapelMateri>): void {
  setData("materials", materials);
}

// Mapel code mapping
export const MAPEL_CODE_MAP: Record<string, string> = {
  "PANC": "Pendidikan Pancasila",
  "BIND": "Bahasa Indonesia",
  "MTK": "Matematika",
  "IPAS": "IPAS",
  "BING": "Bahasa Inggris",
  "SENI": "Seni dan Budaya",
  "BJAW": "Bahasa Jawa",
  "PAI": "Pendidikan Agama",
  "PJOK": "PJOK",
  "KOMP": "Komputer",
};

export const REVERSE_MAPEL_CODE: Record<string, string> = Object.entries(MAPEL_CODE_MAP).reduce((acc, [k, v]) => ({ ...acc, [v]: k }), {});

// Bank Soal loader that automatically reads DOM <script data-bank="..."> blocks
export function loadBankSoalFromDOM(): QuestionItem[] {
  if (typeof document === "undefined") return INITIAL_QUESTIONS_SEM1;
  const scriptTags = document.querySelectorAll<HTMLScriptElement>("script[data-bank]");
  if (scriptTags.length === 0) {
    return getData<QuestionItem[]>("questions", INITIAL_QUESTIONS_SEM1);
  }

  // We read each script block and replace questions for that specific mapel + semester
  let storedQuestions = getData<QuestionItem[]>("questions", INITIAL_QUESTIONS_SEM1);

  scriptTags.forEach((st) => {
    const bankKey = st.getAttribute("data-bank"); // e.g. "PANC-S1" or "MTK-S1"
    if (!bankKey) return;
    try {
      const parsed: QuestionItem[] = JSON.parse(st.textContent || "[]");
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Extract mapel and semester from key or first question
        const parts = bankKey.split("-");
        const code = parts[0];
        const sem = parts[1] === "S2" ? 2 : 1;
        const mapelName = MAPEL_CODE_MAP[code] || parsed[0].mapel;

        // Filter out old questions of this mapel + semester (REPLACE, not duplicate)
        storedQuestions = storedQuestions.filter(q => !(q.mapel === mapelName && q.semester === sem));
        // Append new questions
        storedQuestions.push(...parsed);
      }
    } catch (e) {
      console.warn(`Gagal mem-parsing blok data-bank="${bankKey}":`, e);
    }
  });

  setData("questions", storedQuestions);
  return storedQuestions;
}

export function getQuestions(): QuestionItem[] {
  return getData<QuestionItem[]>("questions", INITIAL_QUESTIONS_SEM1);
}

export function saveQuestions(questions: QuestionItem[]): void {
  setData("questions", questions);
}

// Attendance
export function getAttendance(): AttendanceRecord[] {
  return getData<AttendanceRecord[]>("attendance", []);
}

export function saveAttendance(att: AttendanceRecord[]): void {
  setData("attendance", att);
}

// Literacy Logs (Pojok Baca)
export const INITIAL_LITERASI_LOGS: ReadingLog[] = [];
export const INITIAL_READING_LOGS: ReadingLog[] = [];
const READING_LOGS_SEED_VERSION = "reading_logs_v5_clean_empty_2026";

export function getReadingLogs(): ReadingLog[] {
  const defaultLogs: ReadingLog[] = [];

  const curVer = getData<string>("reading_logs_ver", "");
  if (curVer !== READING_LOGS_SEED_VERSION) {
    // Kosongkan data dummy literasi_logs agar tabel Pojok Baca Literasi tampil bersih saat awal dibuka
    setData("reading_logs", []);
    setData("literasi_logs", []);
    setData("reading_logs_ver", READING_LOGS_SEED_VERSION);
    try {
      localStorage.setItem("reading_logs", "[]");
      localStorage.setItem("literasi_logs", "[]");
      localStorage.setItem(STORAGE_PREFIX + "reading_logs", "[]");
      localStorage.setItem(STORAGE_PREFIX + "literasi_logs", "[]");
    } catch {}
    return [];
  }

  let list = getData<ReadingLog[]>("reading_logs", defaultLogs);
  if (!Array.isArray(list) || list.length === 0) {
    list = getData<ReadingLog[]>("literasi_logs", defaultLogs);
  }
  if (!Array.isArray(list)) list = [];
  return list;
}

export function saveReadingLogs(logs: ReadingLog[]): void {
  const cleanLogs = Array.isArray(logs) ? logs : [];
  setData("reading_logs", cleanLogs);
  setData("literasi_logs", cleanLogs);
  try {
    localStorage.setItem("reading_logs", JSON.stringify(cleanLogs));
    localStorage.setItem("literasi_logs", JSON.stringify(cleanLogs));
    localStorage.setItem(STORAGE_PREFIX + "reading_logs", JSON.stringify(cleanLogs));
    localStorage.setItem(STORAGE_PREFIX + "literasi_logs", JSON.stringify(cleanLogs));
  } catch (e) {
    console.warn("Gagal menyimpan literasi_logs ke localStorage:", e);
  }
}

export function requestLiterasiRevision(logId: string, teacherNote?: string): boolean {
  const logs = getReadingLogs();
  const item = logs.find(l => l.id === logId);
  if (!item) return false;

  item.status = "needs_revision";
  item.teacherNote = teacherNote || "Kesan / Tokoh Utama terindikasi terlalu singkat atau asal. Mohon diisi ulang dengan penjelasan minimal 4 kata dan 15 karakter.";
  item.updatedAt = new Date().toISOString();
  saveReadingLogs(logs);
  return true;
}

export function cancelLiterasiRevision(logId: string): boolean {
  const logs = getReadingLogs();
  const item = logs.find(l => l.id === logId);
  if (!item) return false;

  const detection = detectLiterasiAsal(item.note);
  item.status = detection.isLowEffort ? "flagged" : "valid";
  item.teacherNote = undefined;
  item.updatedAt = new Date().toISOString();
  saveReadingLogs(logs);
  return true;
}

export function saveReadingLogItem(log: Omit<ReadingLog, "id" | "date"> & { id?: string; date?: string }): ReadingLog {
  const logs = getReadingLogs();
  const detection = detectLiterasiAsal(log.note);
  const nowStr = new Date().toISOString().split("T")[0];

  if (log.id) {
    const idx = logs.findIndex(l => l.id === log.id);
    if (idx >= 0) {
      const existing = logs[idx];
      const updatedStatus = detection.isLowEffort ? "flagged" : "valid";
      logs[idx] = {
        ...existing,
        ...log,
        id: log.id,
        status: updatedStatus,
        flagLabel: detection.label,
        flagReason: detection.isLowEffort ? detection.reason : undefined,
        teacherNote: detection.isLowEffort ? existing.teacherNote : undefined,
        updatedAt: new Date().toISOString()
      };
      saveReadingLogs(logs);
      return logs[idx];
    }
  }

  const newLog: ReadingLog = {
    id: "log_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    nisn: log.nisn,
    studentName: log.studentName,
    date: log.date || nowStr,
    bookTitle: log.bookTitle,
    pages: Number(log.pages) || 5,
    note: log.note,
    status: detection.isLowEffort ? "flagged" : "valid",
    flagLabel: detection.label,
    flagReason: detection.isLowEffort ? detection.reason : undefined,
    updatedAt: new Date().toISOString()
  };
  logs.unshift(newLog);
  saveReadingLogs(logs);
  return newLog;
}

export function deleteReadingLog(logId: string): boolean {
  const logs = getReadingLogs();
  const filtered = logs.filter(l => l.id !== logId);
  if (filtered.length !== logs.length) {
    saveReadingLogs(filtered);
    return true;
  }
  return false;
}

// Cash
export function getCashTransactions(): CashTransaction[] {
  const defaultTx: CashTransaction[] = [
    { id: "trx_kas_init_1", date: "2026-07-15", type: "masuk", category: "Iuran Kas", amount: 10000, description: "Iuran kas Juli minggu ke-1", nisn: "3174825699", studentName: "Anang Janu Kurniawan" },
    { id: "trx_kas_init_2", date: "2026-07-15", type: "masuk", category: "Iuran Kas", amount: 10000, description: "Iuran kas Juli minggu ke-1", nisn: "3164156323", studentName: "Bintang Krisna Mukti" },
    { id: "trx_kas_init_3", date: "2026-07-16", type: "masuk", category: "Iuran Kas", amount: 10000, description: "Iuran kas Juli minggu ke-1", nisn: "3160371126", studentName: "Candra Dwi Saputra" },
    { id: "trx_kas_init_4", date: "2026-07-16", type: "masuk", category: "Iuran Kas", amount: 10000, description: "Iuran kas Juli minggu ke-1", nisn: "3163061042", studentName: "Cinta Adibah Fatekah Sari" },
    { id: "trx_kas_init_5", date: "2026-07-20", type: "keluar", category: "ATK / Fotokopi", amount: 25000, description: "Beli 2 spidol whiteboard & 1 penghapus papan tulis" },
    { id: "trx_kas_init_6", date: "2026-08-01", type: "masuk", category: "Iuran Kas", amount: 10000, description: "Iuran kas Agustus minggu ke-1", nisn: "3179753223", studentName: "Krisna Oemar Abdi Negara" },
    { id: "trx_kas_init_7", date: "2026-08-01", type: "masuk", category: "Iuran Kas", amount: 10000, description: "Iuran kas Agustus minggu ke-1", nisn: "3161250761", studentName: "Raihan Aditya Pratama" },
    { id: "trx_kas_init_8", date: "2026-08-10", type: "masuk", category: "Uang Sosial", amount: 50000, description: "Sumbangan sukarela dana sosial kelas peduli teman" },
    { id: "trx_kas_init_9", date: "2026-08-14", type: "keluar", category: "Kegiatan Kelas", amount: 35000, description: "Kertas karton & pita hiasan kemerdekaan kelas" },
  ];
  const list = getData<CashTransaction[]>("cash_tx", defaultTx);
  let changed = false;
  const migrated = list.map((t, idx) => {
    if (!t.id || typeof t.id !== "string" || t.id.trim() === "") {
      changed = true;
      return { ...t, id: "trx_kas_" + Date.now() + "_" + idx + "_" + Math.random().toString(36).substring(2, 8) };
    }
    return t;
  });
  if (changed) {
    setData("cash_tx", migrated);
  }
  return migrated;
}

export function saveCashTransactions(tx: CashTransaction[]): void {
  setData("cash_tx", tx);
}

export function calculateCashBalance(txList?: CashTransaction[]): number {
  const list = txList || getCashTransactions();
  return list.reduce((acc, t) => t.type === "masuk" ? acc + t.amount : acc - t.amount, 0);
}

// Savings
export function getSavingsTransactions(): SavingsTransaction[] {
  const defaultSavings: SavingsTransaction[] = [
    { id: "trx_tab_init_1", nisn: "3174825699", studentName: "Anang Janu Kurniawan", date: "2026-07-18", type: "setor", amount: 25000, note: "Setoran awal tahun ajaran baru" },
    { id: "trx_tab_init_2", nisn: "3174825699", studentName: "Anang Janu Kurniawan", date: "2026-08-05", type: "setor", amount: 15000, note: "Sisa uang saku mingguan" },
    { id: "trx_tab_init_3", nisn: "3164156323", studentName: "Bintang Krisna Mukti", date: "2026-07-18", type: "setor", amount: 20000, note: "Setoran awal" },
    { id: "trx_tab_init_4", nisn: "3164156323", studentName: "Bintang Krisna Mukti", date: "2026-08-12", type: "setor", amount: 10000, note: "Tabungan rutin" },
    { id: "trx_tab_init_5", nisn: "3160371126", studentName: "Candra Dwi Saputra", date: "2026-07-18", type: "setor", amount: 30000, note: "Setoran awal" },
    { id: "trx_tab_init_6", nisn: "3160371126", studentName: "Candra Dwi Saputra", date: "2026-08-18", type: "tarik", amount: 10000, note: "Beli buku gambar dan krayon" },
    { id: "trx_tab_init_7", nisn: "3163061042", studentName: "Cinta Adibah Fatekah Sari", date: "2026-07-18", type: "setor", amount: 35000, note: "Setoran awal" },
    { id: "trx_tab_init_8", nisn: "3163061042", studentName: "Cinta Adibah Fatekah Sari", date: "2026-08-02", type: "setor", amount: 20000, note: "Hadiah prestasi belajar" },
    { id: "trx_tab_init_9", nisn: "3179753223", studentName: "Krisna Oemar Abdi Negara", date: "2026-07-18", type: "setor", amount: 20000, note: "Setoran awal" },
    { id: "trx_tab_init_10", nisn: "3161250761", studentName: "Raihan Aditya Pratama", date: "2026-07-18", type: "setor", amount: 25000, note: "Setoran awal" },
    { id: "trx_tab_init_11", nisn: "3161250761", studentName: "Raihan Aditya Pratama", date: "2026-08-10", type: "setor", amount: 15000, note: "Tabungan minggu ke-2" },
    { id: "trx_tab_init_12", nisn: "3157482420", studentName: "Rafa Achmad Anshori", date: "2026-07-18", type: "setor", amount: 20000, note: "Setoran awal" },
    { id: "trx_tab_init_13", nisn: "3157679187", studentName: "Rafi Achmad Anshori", date: "2026-07-18", type: "setor", amount: 20000, note: "Setoran awal" },
  ];
  const list = getData<SavingsTransaction[]>("savings_tx", defaultSavings);
  let changed = false;
  const migrated = list.map((t, idx) => {
    if (!t.id || typeof t.id !== "string" || t.id.trim() === "") {
      changed = true;
      return { ...t, id: "trx_tab_" + Date.now() + "_" + idx + "_" + Math.random().toString(36).substring(2, 8) };
    }
    return t;
  });
  if (changed) {
    setData("savings_tx", migrated);
  }
  return migrated;
}

export function saveSavingsTransactions(tx: SavingsTransaction[]): void {
  setData("savings_tx", tx);
}

export function calculateStudentSavingsBalance(nisn: string, txList?: SavingsTransaction[]): number {
  const list = (txList || getSavingsTransactions()).filter(t => t.nisn === nisn);
  return list.reduce((acc, t) => t.type === "setor" ? acc + t.amount : acc - t.amount, 0);
}

/**
 * Validates that at no point in chronological time does a student's savings balance become negative.
 * Returns valid: false and problem description if any running deficit is encountered.
 */
export function validateSavingsChronology(nisn: string, proposedList: SavingsTransaction[]): { valid: boolean; message?: string; problemTx?: SavingsTransaction } {
  const studentTx = proposedList
    .filter(t => t.nisn === nisn)
    .sort((a, b) => a.date.localeCompare(b.date));

  let running = 0;
  for (let i = 0; i < studentTx.length; i++) {
    const t = studentTx[i];
    if (t.type === "setor") {
      running += t.amount;
    } else {
      running -= t.amount;
      if (running < 0) {
        return {
          valid: false,
          problemTx: t,
          message: `Transaksi ditolak! Pada transaksi tanggal ${t.date} (${t.note || "Penarikan"}), saldo siswa menjadi minus (Rp ${running.toLocaleString("id-ID")}). Penarikan tidak boleh melebihi saldo tabungan berjalan.`,
        };
      }
    }
  }
  return { valid: true };
}

// Audit Logs (Catatan Perubahan)
export function getAuditLogs(): AuditLog[] {
  const defaultLogs: AuditLog[] = [
    {
      id: "log-init-1",
      timestamp: "2026-07-15 08:30:00",
      module: "kas",
      action: "tambah",
      summary: "Pencatatan saldo awal kas kelas semester 1",
      before: null,
      after: { amount: 20000, description: "Iuran kas awal" }
    }
  ];
  return getData<AuditLog[]>("audit_logs", defaultLogs);
}

export function saveAuditLogs(logs: AuditLog[]): void {
  setData("audit_logs", logs);
}

export function addAuditLog(entry: Omit<AuditLog, "id" | "timestamp">): void {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const logs = getAuditLogs();
  logs.unshift({
    id: "audit-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
    timestamp: timeStr,
    ...entry
  });
  // Keep last 100 entries
  if (logs.length > 100) logs.pop();
  saveAuditLogs(logs);
}

// Trash (Sampah)
export function getTrashItems(): TrashItem[] {
  const list = getData<TrashItem[]>("trash_items", []);
  let changed = false;
  const migrated = list.map((t, idx) => {
    let item = t.item;
    if (!item || !item.id) {
      changed = true;
      item = { ...item, id: `trx_${t.module}_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 7)}` };
    }
    if (!t.id) {
      changed = true;
      return { ...t, id: `trash_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 7)}`, item };
    }
    return { ...t, item };
  });
  if (changed) {
    setData("trash_items", migrated);
  }
  return migrated;
}

export function saveTrashItems(items: TrashItem[]): void {
  setData("trash_items", items);
}

export function addToTrash(
  module: "kas" | "tabungan" | "nilai" | "sertifikat",
  item: CashTransaction | SavingsTransaction | AssessmentEntry | CertificateItem
): void {
  const trash = getTrashItems();
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  trash.unshift({
    id: "trash-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
    deletedAt: dateStr,
    module,
    item
  });
  saveTrashItems(trash);
}

// Scores
const CBT_SCORES_VERSION_KEY = "cbt_scores_null_v2026_v3_clean";

export function getScores(): StudentScore[] {
  const mapels = ["Pendidikan Pancasila", "Bahasa Indonesia", "Matematika", "IPAS", "Bahasa Inggris", "Seni dan Budaya", "Bahasa Jawa", "Pendidikan Agama", "PJOK", "Komputer"];
  const students = INITIAL_STUDENTS;
  const defaults: StudentScore[] = [];

  students.forEach((st, idx) => {
    mapels.forEach((m) => {
      const base = 74 + ((idx * 3 + m.length * 2) % 20);
      defaults.push({
        nisn: st.nisn,
        mapel: m,
        semester: 1,
        nh: Math.min(98, base + (idx % 2 === 0 ? 4 : -2)),
        asts: null,
        asas: null,
      });
      defaults.push({
        nisn: st.nisn,
        mapel: m,
        semester: 2,
        nh: Math.min(98, base + 3),
        asts: null,
        asas: null,
      });
    });
  });

  let list = getData<StudentScore[]>("scores", defaults);

  // Auto-migration to ensure ASTS & ASAS default to null until CBT exam is completed
  const curVer = getData<string>("cbt_scores_version", "");
  if (curVer !== CBT_SCORES_VERSION_KEY) {
    list = list.map(item => ({
      ...item,
      asts: null,
      asas: null,
    }));
    setData("scores", list);
    setData("cbt_scores_version", CBT_SCORES_VERSION_KEY);
  }

  return list;
}

export function saveScores(scores: StudentScore[]): void {
  setData("scores", scores);
}

// ==========================================
// ASSESSMENT (NILAI KURIKULUM MERDEKA)
// ==========================================
export const DEFAULT_ASSESSMENT_SETTINGS: AssessmentSettings = {
  kkmPerMapel: {
    "PPKN": 70,
    "Bahasa Indonesia": 70,
    "Matematika": 70,
    "IPA": 70,
    "Bahasa Inggris": 70,
    "Seni Budaya": 70,
    "Bahasa Jawa": 70,
    "Pendidikan Agama Islam": 70,
    "PJOK": 70,
    "Komputer": 70,
  },
  bobot: {
    harian: 40,
    sumatifBab: 20,
    asts: 20,
    asas: 20,
  },
  useRemedialMax: true,
  showRanking: false,
};

export function getAssessmentSettings(): AssessmentSettings {
  return getData<AssessmentSettings>("assessment_settings", DEFAULT_ASSESSMENT_SETTINGS);
}

export function saveAssessmentSettings(settings: AssessmentSettings): void {
  setData("assessment_settings", settings);
}

// Generate realistic initial assessment seeds for 8 students
// ATS 1, ASAS 1, ATS 2, ASAS 2 default to null until CBT exam is taken!
function generateInitialAssessmentSeeds(): AssessmentEntry[] {
  const seeds: AssessmentEntry[] = [];
  const students = INITIAL_STUDENTS;

  // Semester 1 mapels
  LIST_MAPEL_SEM1.forEach((mapelName, mIdx) => {
    const rawMapel = RAW_KURIKULUM_SEM1[mapelName] || {};

    students.forEach((st, sIdx) => {
      const baseScore = 74 + ((sIdx * 3 + mIdx * 4) % 21); // 74 - 94

      // Harian per subbab and Sumatif per bab
      Object.entries(rawMapel).forEach(([babTitle, subList], bIdx) => {
        if (babTitle.startsWith("Evaluasi")) return;

        // Sumatif Bab
        const babScore = Math.min(98, Math.max(68, baseScore + ((bIdx % 2 === 0 ? 3 : -2))));
        seeds.push({
          id: `grd_sum_${sIdx}_${mIdx}_${bIdx}_${st.nisn}`,
          semester: 1,
          mapel: mapelName,
          category: "sumatif_bab",
          bab: babTitle,
          nisn: st.nisn,
          studentName: st.nama,
          score: babScore,
          remedialScore: babScore < 70 ? 75 : null,
          isAbsent: false,
          date: `2026-08-${10 + (bIdx * 5)}`,
          note: `Sumatif Lingkup Materi ${babTitle.split(":")[0]}`
        });

        // Subbabs (Harian)
        subList.forEach((subTitle, subIdx) => {
          if (subTitle.toLowerCase().includes("asesmen sumatif")) return;

          const hScore = Math.min(99, Math.max(65, baseScore + ((subIdx % 3 === 0 ? 4 : -1))));
          seeds.push({
            id: `grd_har_${sIdx}_${mIdx}_${bIdx}_${subIdx}_${st.nisn}`,
            semester: 1,
            mapel: mapelName,
            category: "harian",
            bab: babTitle,
            subbab: subTitle,
            nisn: st.nisn,
            studentName: st.nama,
            score: hScore,
            remedialScore: hScore < 70 ? 74 : null,
            isAbsent: false,
            date: `2026-08-${12 + (subIdx * 3)}`,
            type: subIdx % 3 === 0 ? "Tugas" : subIdx % 3 === 1 ? "Praktik" : "Kuis",
            note: "Penilaian Harian TP"
          });
        });
      });

      // ASTS (ATS 1) - Initial null (empty until student submits CBT)
      seeds.push({
        id: `grd_asts_${sIdx}_${mIdx}_${st.nisn}`,
        semester: 1,
        mapel: mapelName,
        category: "asts",
        nisn: st.nisn,
        studentName: st.nama,
        score: null,
        isAbsent: false,
        date: "2026-09-22",
        note: "Asesmen Tengah Semester 1"
      });

      // ASAS (ASAS 1) - Initial null (empty until student submits CBT)
      seeds.push({
        id: `grd_asas_${sIdx}_${mIdx}_${st.nisn}`,
        semester: 1,
        mapel: mapelName,
        category: "asas",
        nisn: st.nisn,
        studentName: st.nama,
        score: null,
        isAbsent: false,
        date: "2026-11-28",
        note: "Asesmen Sumatif Akhir Semester 1"
      });
    });
  });

  // Semester 2 mapels - ASTS (ATS 2) & ASAS (ASAS 2) - Initial null
  LIST_MAPEL_SEM2.forEach((mapelName, mIdx) => {
    students.forEach((st, sIdx) => {
      // ASTS (ATS 2) - Initial null
      seeds.push({
        id: `grd_asts2_${sIdx}_${mIdx}_${st.nisn}`,
        semester: 2,
        mapel: mapelName,
        category: "asts",
        nisn: st.nisn,
        studentName: st.nama,
        score: null,
        isAbsent: false,
        date: "2027-03-20",
        note: "Asesmen Tengah Semester 2"
      });

      // ASAS (ASAS 2) - Initial null
      seeds.push({
        id: `grd_asas2_${sIdx}_${mIdx}_${st.nisn}`,
        semester: 2,
        mapel: mapelName,
        category: "asas",
        nisn: st.nisn,
        studentName: st.nama,
        score: null,
        isAbsent: false,
        date: "2027-06-15",
        note: "Asesmen Sumatif Akhir Semester 2"
      });
    });
  });

  return seeds;
}

const CBT_ASSESSMENT_VERSION_KEY = "cbt_assessment_null_v2026_v3_clean";

export function getAssessmentEntries(): AssessmentEntry[] {
  const seeds = generateInitialAssessmentSeeds();
  let list = getData<AssessmentEntry[]>("assessment_entries", seeds);

  // Storage migration: ensure default dummy numbers for ATS 1, ASAS 1, ATS 2, ASAS 2 are cleared to null
  // (Preserves real student CBT exam submissions where id starts with "cbt_" or note starts with "Ujian CBT")
  const curVer = getData<string>("cbt_assessment_version", "");
  if (curVer !== CBT_ASSESSMENT_VERSION_KEY) {
    list = list.map(item => {
      const isRealCbt = item.id.startsWith("cbt_") || (Boolean(item.note) && item.note!.startsWith("Ujian CBT"));
      if ((item.category === "asts" || item.category === "asas") && !isRealCbt) {
        return {
          ...item,
          score: null,
          remedialScore: null
        };
      }
      return item;
    });

    // Make sure semester 2 placeholder seeds exist in list
    seeds.filter(s => s.semester === 2).forEach(s2Seed => {
      const exists = list.some(e => e.nisn === s2Seed.nisn && e.mapel === s2Seed.mapel && e.semester === 2 && e.category === s2Seed.category);
      if (!exists) {
        list.push(s2Seed);
      }
    });

    setData("assessment_entries", list);
    setData("cbt_assessment_version", CBT_ASSESSMENT_VERSION_KEY);
  }

  let changed = false;

  // Ensure unique ID migration
  const migrated = list.map((item, idx) => {
    if (!item.id || typeof item.id !== "string" || item.id.trim() === "") {
      changed = true;
      return {
        ...item,
        id: "grd_" + Date.now() + "_" + idx + "_" + Math.random().toString(36).substring(2, 7)
      };
    }
    return item;
  });

  if (changed) {
    saveAssessmentEntries(migrated);
  }
  return migrated;
}

export function saveAssessmentEntries(entries: AssessmentEntry[]): void {
  setData("assessment_entries", entries);
}

// Effective score helper (handles remedial max and absent)
export function getEffectiveScore(entry: AssessmentEntry, useRemedialMax: boolean = true): number | null {
  if (entry.isAbsent || entry.score === null || entry.score === undefined) return null;
  if (entry.remedialScore !== null && entry.remedialScore !== undefined && useRemedialMax) {
    return Math.max(entry.score, entry.remedialScore);
  }
  return entry.score;
}

export interface SubjectScoreBreakdown {
  mapel: string;
  semester: 1 | 2;
  nisn: string;
  studentName: string;
  subbabAverages: Record<string, { avg: number | null; count: number; entries: AssessmentEntry[] }>;
  harianAvg: number | null;
  sumatifBabAvg: number | null;
  astsScore: number | null;
  asasScore: number | null;
  finalScore: number | null;
  isComplete: boolean;
  kkm: number;
  isBelowKKM: boolean;
  highestSubbab?: { title: string; score: number } | null;
  lowestSubbab?: { title: string; score: number } | null;
  capaianDeskripsi: string;
}

export function calculateSubjectScoreBreakdown(
  nisn: string,
  mapel: string,
  semester: 1 | 2 = 1,
  entriesList?: AssessmentEntry[],
  settingsParam?: AssessmentSettings
): SubjectScoreBreakdown {
  const allEntries = entriesList || getAssessmentEntries();
  const settings = settingsParam || getAssessmentSettings();
  const students = getStudents();
  const student = students.find(s => s.nisn === nisn);
  const studentName = student?.nama || "Siswa";
  const kkm = settings.kkmPerMapel[mapel] || 70;

  // Filter entries for this student, mapel, semester
  const entries = allEntries.filter(e => e.nisn === nisn && e.mapel === mapel && e.semester === semester);

  // Subbab breakdown (Harian)
  const harianEntries = entries.filter(e => e.category === "harian" && e.subbab);
  const subbabMap: Record<string, { sum: number; count: number; entries: AssessmentEntry[] }> = {};

  harianEntries.forEach(e => {
    if (!e.subbab) return;
    if (!subbabMap[e.subbab]) {
      subbabMap[e.subbab] = { sum: 0, count: 0, entries: [] };
    }
    subbabMap[e.subbab].entries.push(e);
    const eff = getEffectiveScore(e, settings.useRemedialMax);
    if (eff !== null) {
      subbabMap[e.subbab].sum += eff;
      subbabMap[e.subbab].count += 1;
    }
  });

  const subbabAverages: Record<string, { avg: number | null; count: number; entries: AssessmentEntry[] }> = {};
  let totalHarian = 0;
  let subbabCount = 0;
  let highestSubbab: { title: string; score: number } | null = null;
  let lowestSubbab: { title: string; score: number } | null = null;

  for (const [subbabTitle, data] of Object.entries(subbabMap)) {
    const avg = data.count > 0 ? Math.round((data.sum / data.count) * 10) / 10 : null;
    subbabAverages[subbabTitle] = {
      avg,
      count: data.count,
      entries: data.entries
    };
    if (avg !== null) {
      totalHarian += avg;
      subbabCount += 1;
      if (!highestSubbab || avg > highestSubbab.score) {
        highestSubbab = { title: subbabTitle, score: avg };
      }
      if (!lowestSubbab || avg < lowestSubbab.score) {
        lowestSubbab = { title: subbabTitle, score: avg };
      }
    }
  }

  const harianAvg = subbabCount > 0 ? Math.round((totalHarian / subbabCount) * 10) / 10 : null;

  // Sumatif Bab breakdown
  const sumatifBabEntries = entries.filter(e => e.category === "sumatif_bab");
  let sumBabTotal = 0;
  let sumBabCount = 0;
  sumatifBabEntries.forEach(e => {
    const eff = getEffectiveScore(e, settings.useRemedialMax);
    if (eff !== null) {
      sumBabTotal += eff;
      sumBabCount += 1;
    }
  });
  const sumatifBabAvg = sumBabCount > 0 ? Math.round((sumBabTotal / sumBabCount) * 10) / 10 : null;

  // ASTS
  const astsEntry = entries.find(e => e.category === "asts");
  const astsScore = astsEntry ? getEffectiveScore(astsEntry, settings.useRemedialMax) : null;

  // ASAS
  const asasEntry = entries.find(e => e.category === "asas");
  const asasScore = asasEntry ? getEffectiveScore(asasEntry, settings.useRemedialMax) : null;

  // Calculate Weighted Final Score
  // Default weights: harian 40%, sumatifBab 20%, asts 20%, asas 20%
  const components: { score: number | null; weight: number }[] = [
    { score: harianAvg, weight: settings.bobot.harian },
    { score: sumatifBabAvg, weight: settings.bobot.sumatifBab },
    { score: astsScore, weight: settings.bobot.asts },
    { score: asasScore, weight: settings.bobot.asas },
  ];

  const availableComponents = components.filter(c => c.score !== null);
  const isComplete = availableComponents.length === components.length;

  let finalScore: number | null = null;
  if (availableComponents.length > 0) {
    const totalWeight = availableComponents.reduce((acc, c) => acc + c.weight, 0);
    const weightedSum = availableComponents.reduce((acc, c) => acc + (c.score! * c.weight), 0);
    finalScore = totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 10) / 10 : null;
  }

  const isBelowKKM = finalScore !== null ? finalScore < kkm : false;

  // Generate Positive Capaian Description
  let capaianDeskripsi = "";
  if (highestSubbab && finalScore !== null) {
    const cleanHighTitle = highestSubbab.title.replace(/^[A-Z]\.\s*/, "");
    capaianDeskripsi = `Menunjukkan pemahaman yang sangat baik dalam materi ${cleanHighTitle}.`;
    if (lowestSubbab && lowestSubbab.title !== highestSubbab.title && lowestSubbab.score < 80) {
      const cleanLowTitle = lowestSubbab.title.replace(/^[A-Z]\.\s*/, "");
      capaianDeskripsi += ` Perlu bimbingan dan peningkatan latihan mandiri pada materi ${cleanLowTitle}.`;
    } else {
      capaianDeskripsi += ` Mampu mempertahankan capaian belajar dengan konsisten dan bertanggung jawab.`;
    }
  } else {
    capaianDeskripsi = "Penilaian kompetensi masih dalam proses kelengkapan oleh guru.";
  }

  return {
    mapel,
    semester,
    nisn,
    studentName,
    subbabAverages,
    harianAvg,
    sumatifBabAvg,
    astsScore,
    asasScore,
    finalScore,
    isComplete,
    kkm,
    isBelowKKM,
    highestSubbab,
    lowestSubbab,
    capaianDeskripsi,
  };
}

export interface StudentReportSummary {
  nisn: string;
  studentName: string;
  semester: 1 | 2;
  subjects: Record<string, SubjectScoreBreakdown>;
  overallAverage: number | null;
  completedSubjectsCount: number;
  totalSubjectsCount: number;
}

export function calculateStudentReport(nisn: string, semester: 1 | 2 = 1): StudentReportSummary {
  const students = getStudents();
  const student = students.find(s => s.nisn === nisn);
  const studentName = student?.nama || "Siswa";
  const allEntries = getAssessmentEntries();
  const settings = getAssessmentSettings();

  const subjects: Record<string, SubjectScoreBreakdown> = {};
  let totalScore = 0;
  let countScore = 0;
  let completedCount = 0;

  const mapelList = semester === 2 ? LIST_MAPEL_SEM2 : LIST_MAPEL_SEM1;

  mapelList.forEach(m => {
    const breakdown = calculateSubjectScoreBreakdown(nisn, m, semester, allEntries, settings);
    subjects[m] = breakdown;
    if (breakdown.finalScore !== null) {
      totalScore += breakdown.finalScore;
      countScore += 1;
    }
    if (breakdown.isComplete) {
      completedCount += 1;
    }
  });

  const overallAverage = countScore > 0 ? Math.round((totalScore / countScore) * 10) / 10 : null;

  return {
    nisn,
    studentName,
    semester,
    subjects,
    overallAverage,
    completedSubjectsCount: completedCount,
    totalSubjectsCount: mapelList.length,
  };
}

export function recordCBTExamScore(params: {
  nisn: string;
  studentName?: string;
  semester: 1 | 2;
  mapel: string;
  period: "ATS 1" | "ASAS 1" | "ATS 2" | "ASAS 2";
  score: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
}): { success: boolean; entry: AssessmentEntry; previousScore?: number | null } {
  const students = getStudents();
  const st = students.find(s => s.nisn === params.nisn);
  const studentName = params.studentName || st?.nama || "Siswa";
  const category: "asts" | "asas" = (params.period === "ATS 1" || params.period === "ATS 2") ? "asts" : "asas";

  const allEntries = getAssessmentEntries();
  const existingIdx = allEntries.findIndex(e =>
    e.nisn === params.nisn &&
    e.semester === params.semester &&
    (e.mapel === params.mapel || params.mapel.includes(e.mapel) || e.mapel.includes(params.mapel)) &&
    e.category === category
  );

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  let previousScore: number | null = null;
  let savedEntry: AssessmentEntry;

  if (existingIdx >= 0) {
    previousScore = allEntries[existingIdx].score;
    allEntries[existingIdx].score = params.score;
    allEntries[existingIdx].date = dateStr;
    allEntries[existingIdx].isAbsent = false;
    allEntries[existingIdx].note = `Ujian CBT ${params.period} (${params.correctCount}/${params.totalQuestions} Benar)`;
    savedEntry = allEntries[existingIdx];
  } else {
    savedEntry = {
      id: "cbt_" + params.period.toLowerCase().replace(/\s+/g, "_") + "_" + params.nisn + "_" + Date.now(),
      semester: params.semester,
      mapel: params.mapel,
      category,
      nisn: params.nisn,
      studentName,
      score: params.score,
      isAbsent: false,
      date: dateStr,
      note: `Ujian CBT ${params.period} (${params.correctCount}/${params.totalQuestions} Benar)`
    };
    allEntries.push(savedEntry);
  }

  saveAssessmentEntries(allEntries);

  // Sync to scores table for immediate reflection in dashboards
  try {
    const scores = getScores();
    let scoreObj = scores.find(s =>
      s.nisn === params.nisn &&
      s.semester === params.semester &&
      (s.mapel === params.mapel || params.mapel.includes(s.mapel) || s.mapel.includes(params.mapel))
    );
    if (!scoreObj) {
      scoreObj = {
        nisn: params.nisn,
        mapel: params.mapel,
        semester: params.semester,
        nh: params.score,
        asts: category === "asts" ? params.score : null,
        asas: category === "asas" ? params.score : null
      };
      scores.push(scoreObj);
    } else {
      if (category === "asts") scoreObj.asts = params.score;
      if (category === "asas") scoreObj.asas = params.score;
    }
    saveScores(scores);
  } catch (err) {
    console.warn("Failed to sync CBT score to scores table", err);
  }

  // Audit log
  addAuditLog({
    module: "nilai",
    action: existingIdx >= 0 ? "edit" : "tambah",
    summary: `Ujian CBT ${params.period} ${params.mapel} (${params.score}/100) diselesaikan oleh ${studentName}`,
    before: previousScore !== null ? { score: previousScore } : null,
    after: { score: params.score, correct: params.correctCount, total: params.totalQuestions }
  });

  return { success: true, entry: savedEntry, previousScore };
}

export function resetStudentCBTExamScore(nisn: string, period: "ATS 1" | "ASAS 1" | "ATS 2" | "ASAS 2"): boolean {
  const sem: 1 | 2 = (period === "ATS 1" || period === "ASAS 1") ? 1 : 2;
  const category: "asts" | "asas" = (period === "ATS 1" || period === "ATS 2") ? "asts" : "asas";

  const allEntries = getAssessmentEntries();
  let changed = false;

  allEntries.forEach(e => {
    if (e.nisn === nisn && e.semester === sem && e.category === category) {
      e.score = null;
      e.remedialScore = null;
      e.note = `Dikosongkan / Reset oleh Guru (${period})`;
      changed = true;
    }
  });

  if (changed) {
    saveAssessmentEntries(allEntries);
  }

  // Also clear asts or asas in scores table
  try {
    const scores = getScores();
    let scoreChanged = false;
    scores.forEach(s => {
      if (s.nisn === nisn && s.semester === sem) {
        if (category === "asts") s.asts = null;
        if (category === "asas") s.asas = null;
        scoreChanged = true;
      }
    });
    if (scoreChanged) {
      saveScores(scores);
    }
  } catch (err) {
    console.warn("Failed to reset score in scores table", err);
  }

  const students = getStudents();
  const st = students.find(s => s.nisn === nisn);
  addAuditLog({
    module: "nilai",
    action: "hapus",
    summary: `Reset / Pengosongan nilai ujian CBT ${period} untuk siswa ${st?.nama || nisn}`,
    before: null,
    after: null
  });

  return true;
}

export function resetStudentAllCBTExamScores(nisn: string): boolean {
  resetStudentCBTExamScore(nisn, "ATS 1");
  resetStudentCBTExamScore(nisn, "ASAS 1");
  resetStudentCBTExamScore(nisn, "ATS 2");
  resetStudentCBTExamScore(nisn, "ASAS 2");
  return true;
}

export function resetAllCBTExamScores(period: "ATS 1" | "ASAS 1" | "ATS 2" | "ASAS 2"): boolean {
  const sem: 1 | 2 = (period === "ATS 1" || period === "ASAS 1") ? 1 : 2;
  const category: "asts" | "asas" = (period === "ATS 1" || period === "ATS 2") ? "asts" : "asas";

  const allEntries = getAssessmentEntries();
  allEntries.forEach(e => {
    if (e.semester === sem && e.category === category) {
      e.score = null;
      e.remedialScore = null;
      e.note = `Dikosongkan / Reset oleh Guru (${period})`;
    }
  });
  saveAssessmentEntries(allEntries);

  try {
    const scores = getScores();
    scores.forEach(s => {
      if (s.semester === sem) {
        if (category === "asts") s.asts = null;
        if (category === "asas") s.asas = null;
      }
    });
    saveScores(scores);
  } catch (err) {
    console.warn("Failed to reset all scores in scores table", err);
  }

  addAuditLog({
    module: "nilai",
    action: "hapus",
    summary: `Reset / Pengosongan seluruh nilai ujian CBT ${period} untuk semua siswa kelas`,
    before: null,
    after: null
  });

  return true;
}

// Quiz Logging (Answer Logs & Session Logs)
export function getQuizAnswerLogs(): QuizAnswerLog[] {
  // provide initial realistic seeds so charts are populated beautifully immediately
  const seeds: QuizAnswerLog[] = [];
  const mapels = ["Pendidikan Pancasila", "Bahasa Indonesia", "Matematika", "IPAS", "Bahasa Inggris"];
  INITIAL_STUDENTS.forEach((st, sIdx) => {
    mapels.forEach((m, mIdx) => {
      for (let i = 0; i < 5; i++) {
        seeds.push({
          id: `ans-seed-${sIdx}-${mIdx}-${i}`,
          siswa: st.nisn,
          mapel: m,
          semester: 1,
          bab: "Bab 1",
          subbab: "Subbab 1",
          benar: (i + sIdx + mIdx) % 4 !== 0,
          waktu: `2026-08-${10 + i}`,
          sesiId: `sess-seed-${sIdx}-${mIdx}`,
        });
      }
    });
  });
  return getData<QuizAnswerLog[]>("quiz_answer_logs", seeds);
}

export function saveQuizAnswerLogs(logs: QuizAnswerLog[]): void {
  setData("quiz_answer_logs", logs);
}

export function recordQuizAnswer(log: QuizAnswerLog): void {
  const list = getQuizAnswerLogs();
  list.push(log);
  saveQuizAnswerLogs(list);
}

export function getQuizSessionLogs(): QuizSessionLog[] {
  const seeds: QuizSessionLog[] = [];
  const mapels = ["Pendidikan Pancasila", "Bahasa Indonesia", "Matematika", "IPAS", "Bahasa Inggris"];
  INITIAL_STUDENTS.forEach((st, sIdx) => {
    mapels.forEach((m, mIdx) => {
      seeds.push({
        id: `sess-seed-${sIdx}-${mIdx}-1`,
        siswa: st.nisn,
        mapel: m,
        semester: 1,
        skor: 70 + ((sIdx * 5 + mIdx * 7) % 30),
        totalSoal: 10,
        benar: 7 + ((sIdx + mIdx) % 3),
        salah: 3 - ((sIdx + mIdx) % 3),
        durasiDetik: 240,
        isRemedial: false,
        waktu: "2026-08-15",
      });
      seeds.push({
        id: `sess-seed-${sIdx}-${mIdx}-2`,
        siswa: st.nisn,
        mapel: m,
        semester: 1,
        skor: 80 + ((sIdx * 4 + mIdx * 5) % 21),
        totalSoal: 10,
        benar: 8 + ((sIdx + mIdx) % 2),
        salah: 2 - ((sIdx + mIdx) % 2),
        durasiDetik: 210,
        isRemedial: false,
        waktu: "2026-09-02",
      });
    });
  });
  return getData<QuizSessionLog[]>("quiz_session_logs", seeds);
}

export function saveQuizSessionLogs(logs: QuizSessionLog[]): void {
  setData("quiz_session_logs", logs);
}

export function recordQuizSession(sess: QuizSessionLog): void {
  const list = getQuizSessionLogs();
  list.push(sess);
  saveQuizSessionLogs(list);
}

// Game Progress
export function getGameProgress(nisn: string, semester: 1 | 2): GameProgress {
  const key = `game_progress_${nisn}_s${semester}`;
  const def: GameProgress = {
    nisn,
    semester,
    xp: 80,
    coins: 50,
    gems: ["Pendidikan Pancasila"],
    achievements: ["langkah_pertama"],
    answeredQuestionIds: {},
    wrongQuestionIds: {},
    remedialCount: 0,
    lastPlayed: new Date().toISOString(),
  };
  return getData<GameProgress>(key, def);
}

export function saveGameProgress(progress: GameProgress): void {
  const key = `game_progress_${progress.nisn}_s${progress.semester}`;
  setData(key, progress);
}

// Certificates
export const DEFAULT_CERTIFICATES: CertificateItem[] = [
  {
    id: "cert-init-1",
    nisn: "3174825699",
    studentName: "Anang Janu Kurniawan",
    semester: 1,
    title: "Penjelajah Nusantara Berbakat",
    description: "Telah menunjukkan ketekunan luar biasa dalam mempelajari seluruh mata pelajaran dan meraih prestasi membanggakan pada Petualangan Nusantara Ilmu.",
    date: "2026-09-20",
    signatureText: "Wali Kelas 4 SDN Banyurip",
  },
  {
    id: "cert-init-2",
    nisn: "3174825700",
    studentName: "Budi Santoso",
    semester: 1,
    title: "Bintang Keaktifan & Sains",
    description: "Berhasil menyelesaikan seluruh tantangan materi dan aktif dalam pembelajaran Kurikulum Merdeka Fase B SDN Banyurip.",
    date: "2026-09-25",
    signatureText: "Wali Kelas 4 SDN Banyurip",
  }
];

export function getCertificates(): CertificateItem[] {
  return getData<CertificateItem[]>("certificates", DEFAULT_CERTIFICATES);
}

export function saveCertificates(certs: CertificateItem[]): void {
  setData("certificates", certs);
}

export function resetCertificatesToDefault(): CertificateItem[] {
  setData("certificates", DEFAULT_CERTIFICATES);
  return DEFAULT_CERTIFICATES;
}

// KKM
export function getKKM(): number {
  return getData<number>("kkm_score", 70);
}

export function saveKKM(kkm: number): void {
  setData("kkm_score", kkm);
}

// Full Export / Import JSON
export function exportAllDataJSON(): string {
  const data = {
    exportedAt: new Date().toISOString(),
    version: "2.0",
    school: "SDN Banyurip - Kelas 4",
    students: getStudents(),
    schedule: getSchedule(),
    piket: getPiket(),
    piketTasks: getPiketTasks(),
    materials: getMaterials(),
    questions: getQuestions(),
    attendance: getAttendance(),
    readingLogs: getReadingLogs(),
    cashTransactions: getCashTransactions(),
    savingsTransactions: getSavingsTransactions(),
    scores: getScores(),
    quizAnswerLogs: getQuizAnswerLogs(),
    quizSessionLogs: getQuizSessionLogs(),
    certificates: getCertificates(),
    kkm: getKKM(),
    assessmentEntries: getAssessmentEntries(),
    assessmentSettings: getAssessmentSettings(),
    auditLogs: getAuditLogs(),
    trashItems: getTrashItems(),
    inventaris: getInventaris(),
  };
  return JSON.stringify(data, null, 2);
}

export function importAllDataJSON(jsonStr: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(jsonStr);
    if (!data.students || !Array.isArray(data.students)) {
      return { success: false, message: "Format JSON tidak valid: data siswa tidak ditemukan." };
    }
    if (data.students) saveStudents(data.students);
    if (data.schedule) saveSchedule(data.schedule);
    if (data.piket) savePiket(data.piket);
    if (data.piketTasks) savePiketTasks(data.piketTasks);
    if (data.materials) saveMaterials(data.materials);
    if (data.questions) saveQuestions(data.questions);
    if (data.attendance) saveAttendance(data.attendance);
    if (data.readingLogs) saveReadingLogs(data.readingLogs);
    if (data.cashTransactions) saveCashTransactions(data.cashTransactions);
    if (data.savingsTransactions) saveSavingsTransactions(data.savingsTransactions);
    if (data.scores) saveScores(data.scores);
    if (data.assessmentEntries) saveAssessmentEntries(data.assessmentEntries);
    if (data.assessmentSettings) saveAssessmentSettings(data.assessmentSettings);
    if (data.quizAnswerLogs) saveQuizAnswerLogs(data.quizAnswerLogs);
    if (data.quizSessionLogs) saveQuizSessionLogs(data.quizSessionLogs);
    if (data.certificates) saveCertificates(data.certificates);
    if (data.inventaris) saveInventaris(data.inventaris);
    if (data.kkm) saveKKM(Number(data.kkm));
    if (data.auditLogs) saveAuditLogs(data.auditLogs);
    if (data.trashItems) saveTrashItems(data.trashItems);
    return { success: true, message: "Seluruh data berhasil dipulihkan dari cadangan!" };
  } catch (e: any) {
    return { success: false, message: "Gagal memproses file JSON: " + (e?.message || "Format salah") };
  }
}

// Question Import Validation
export interface QuestionImportReport {
  successCount: number;
  failedCount: number;
  errors: string[];
  countByMapel: Record<string, number>;
}

export function importQuestionsJSON(jsonStr: string): QuestionImportReport {
  const report: QuestionImportReport = {
    successCount: 0,
    failedCount: 0,
    errors: [],
    countByMapel: {},
  };

  try {
    const parsed = JSON.parse(jsonStr);
    const list: any[] = Array.isArray(parsed) ? parsed : (parsed.questions || []);

    if (!Array.isArray(list) || list.length === 0) {
      report.errors.push("Data soal tidak berupa array atau kosong.");
      return report;
    }

    const currentQuestions = getQuestions();
    const existingIds = new Set(currentQuestions.map(q => q.id));
    const validQuestions: QuestionItem[] = [];

    list.forEach((item, idx) => {
      const num = idx + 1;
      if (!item.id || typeof item.id !== "string") {
        report.failedCount++;
        report.errors.push(`Soal #${num}: ID soal kosong atau tidak valid.`);
        return;
      }
      if (existingIds.has(item.id)) {
        report.failedCount++;
        report.errors.push(`Soal #${num} (ID: ${item.id}): ID ganda sudah ada dalam bank soal.`);
        return;
      }
      if (!item.mapel || !item.soal || !item.jawaban) {
        report.failedCount++;
        report.errors.push(`Soal #${num} (ID: ${item.id}): Mapel, soal, atau jawaban tidak boleh kosong.`);
        return;
      }
      if (!Array.isArray(item.opsi) || item.opsi.length < 2) {
        report.failedCount++;
        report.errors.push(`Soal #${num} (ID: ${item.id}): Opsi jawaban harus berupa pilihan minimal 2 opsi.`);
        return;
      }
      if (!item.opsi.includes(item.jawaban)) {
        report.failedCount++;
        report.errors.push(`Soal #${num} (ID: ${item.id}): Kunci jawaban "${item.jawaban}" tidak ditemukan di dalam pilihan opsi.`);
        return;
      }

      const qItem: QuestionItem = {
        id: item.id.trim(),
        semester: item.semester === 2 ? 2 : 1,
        mapel: item.mapel.trim(),
        bab: item.bab ? item.bab.trim() : "Bab Umum",
        subbab: item.subbab ? item.subbab.trim() : "Subbab Umum",
        tipe: item.tipe || "pilihan_ganda",
        level: item.level || "sedang",
        soal: item.soal.trim(),
        opsi: item.opsi.map((o: any) => String(o).trim()),
        jawaban: item.jawaban.trim(),
        penjelasan: item.penjelasan ? item.penjelasan.trim() : "Jawaban sudah tepat.",
      };

      validQuestions.push(qItem);
      existingIds.add(qItem.id);
      report.successCount++;

      const key = `${qItem.mapel} (S${qItem.semester})`;
      report.countByMapel[key] = (report.countByMapel[key] || 0) + 1;
    });

    if (validQuestions.length > 0) {
      saveQuestions([...currentQuestions, ...validQuestions]);
    }
  } catch (e: any) {
    report.errors.push("Gagal membaca sintaks JSON: " + (e?.message || "Format salah"));
  }

  return report;
}

// ==========================================
// INVENTARIS BARANG KELAS (localStorage: 'smartclass_inventaris')
// ==========================================
export interface InventarisItem {
  id: string;
  namaBarang: string;
  kodeKategori: string;
  jumlah: number;
  satuan?: string;
  kondisi: "Baik" | "Rusak Ringan" | "Rusak Berat";
  tanggalMasuk: string;
  keterangan: string;
}

export const INITIAL_INVENTARIS: InventarisItem[] = [
  {
    id: "inv-1",
    namaBarang: "Proyektor LCD Epson",
    kodeKategori: "ELEKTRONIK",
    jumlah: 1,
    satuan: "Unit",
    kondisi: "Baik",
    tanggalMasuk: "2024-01-15",
    keterangan: "Inventaris kelas 4 untuk media pembelajaran visual interaktif"
  },
  {
    id: "inv-2",
    namaBarang: "Meja Guru Kayu Jati",
    kodeKategori: "MEBELEIR",
    jumlah: 1,
    satuan: "Buah",
    kondisi: "Baik",
    tanggalMasuk: "2023-07-10",
    keterangan: "Meja kerja dan administrasi wali kelas 4"
  },
  {
    id: "inv-3",
    namaBarang: "Kursi Guru Busa",
    kodeKategori: "MEBELEIR",
    jumlah: 1,
    satuan: "Buah",
    kondisi: "Baik",
    tanggalMasuk: "2023-07-10",
    keterangan: "Kursi putar kerja wali kelas"
  },
  {
    id: "inv-4",
    namaBarang: "Meja Belajar Siswa Ganda",
    kodeKategori: "MEBELEIR",
    jumlah: 4,
    satuan: "Unit",
    kondisi: "Baik",
    tanggalMasuk: "2023-07-10",
    keterangan: "Meja belajar kapasitas 8 siswa kelas 4"
  },
  {
    id: "inv-5",
    namaBarang: "Kursi Belajar Siswa Kayu",
    kodeKategori: "MEBELEIR",
    jumlah: 8,
    satuan: "Buah",
    kondisi: "Baik",
    tanggalMasuk: "2023-07-10",
    keterangan: "Kursi duduk 8 siswa kelas 4"
  },
  {
    id: "inv-6",
    namaBarang: "Papan Tulis Whiteboard 120x240",
    kodeKategori: "PERLENGKAPAN",
    jumlah: 1,
    satuan: "Buah",
    kondisi: "Baik",
    tanggalMasuk: "2023-08-01",
    keterangan: "Whiteboard gantung dinding depan kelas"
  },
  {
    id: "inv-7",
    namaBarang: "Lemari Arsip & Buku Kelas",
    kodeKategori: "MEBELEIR",
    jumlah: 1,
    satuan: "Unit",
    kondisi: "Baik",
    tanggalMasuk: "2023-07-15",
    keterangan: "Penyimpanan buku pelajaran dan dokumen rapor"
  },
  {
    id: "inv-8",
    namaBarang: "Rak Pojok Baca Literasi",
    kodeKategori: "MEBELEIR",
    jumlah: 1,
    satuan: "Unit",
    kondisi: "Baik",
    tanggalMasuk: "2024-02-01",
    keterangan: "Rak kayu display buku cerita dan modul literasi"
  },
  {
    id: "inv-9",
    namaBarang: "Speaker Aktif Portabel Bluetooth",
    kodeKategori: "ELEKTRONIK",
    jumlah: 1,
    satuan: "Unit",
    kondisi: "Rusak Ringan",
    tanggalMasuk: "2024-03-12",
    keterangan: "Baterai cepat habis, harus dicolok kabel listrik saat dipakai"
  },
  {
    id: "inv-10",
    namaBarang: "Kipas Angin Dinding Cosmos",
    kodeKategori: "ELEKTRONIK",
    jumlah: 2,
    satuan: "Unit",
    kondisi: "Baik",
    tanggalMasuk: "2023-08-20",
    keterangan: "Kipas angin dinding ventilasi ruang kelas"
  },
  {
    id: "inv-11",
    namaBarang: "Globe Bola Dunia Geografi",
    kodeKategori: "ALAT PERAGA",
    jumlah: 1,
    satuan: "Buah",
    kondisi: "Baik",
    tanggalMasuk: "2024-01-20",
    keterangan: "Media peraga pembelajaran IPAS peta dunia"
  },
  {
    id: "inv-12",
    namaBarang: "Jam Dinding Analog Seiko",
    kodeKategori: "PERLENGKAPAN",
    jumlah: 1,
    satuan: "Buah",
    kondisi: "Baik",
    tanggalMasuk: "2024-01-10",
    keterangan: "Penunjuk waktu belajar kelas 4"
  }
];

export function getInventaris(): InventarisItem[] {
  try {
    const raw = localStorage.getItem("smartclass_inventaris");
    if (!raw) {
      localStorage.setItem("smartclass_inventaris", JSON.stringify(INITIAL_INVENTARIS));
      return INITIAL_INVENTARIS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem("smartclass_inventaris", JSON.stringify(INITIAL_INVENTARIS));
      return INITIAL_INVENTARIS;
    }
    return parsed;
  } catch (e) {
    console.error("Gagal membaca smartclass_inventaris:", e);
    return INITIAL_INVENTARIS;
  }
}

export function saveInventaris(items: InventarisItem[]): void {
  try {
    localStorage.setItem("smartclass_inventaris", JSON.stringify(items));
  } catch (e) {
    console.error("Gagal menyimpan smartclass_inventaris:", e);
  }
}

// ==========================================
// FOTO PROFIL MANDIRI (SISWA & GURU)
// ==========================================
export function getStudentPhoto(nisn: string): string | null {
  try {
    const photo = localStorage.getItem("smartclass_avatar_" + nisn);
    if (photo && photo.startsWith("data:image/")) return photo;
    const students = getStudents();
    const s = students.find(item => item.nisn === nisn);
    if (s && s.avatar && s.avatar.startsWith("data:image/")) return s.avatar;
  } catch {}
  return null;
}

export function saveStudentPhoto(nisn: string, base64Image: string): void {
  try {
    localStorage.setItem("smartclass_avatar_" + nisn, base64Image);
    const students = getStudents();
    const target = students.find(s => s.nisn === nisn);
    if (target) {
      target.avatar = base64Image;
      saveStudents(students);
    }
  } catch (e) {
    console.error("Gagal menyimpan foto siswa:", e);
  }
}

export function deleteStudentPhoto(nisn: string, defaultAvatar: string = "👦"): void {
  try {
    localStorage.removeItem("smartclass_avatar_" + nisn);
    const students = getStudents();
    const target = students.find(s => s.nisn === nisn);
    if (target) {
      target.avatar = defaultAvatar;
      saveStudents(students);
    }
  } catch (e) {
    console.error("Gagal menghapus foto siswa:", e);
  }
}

export function getTeacherPhoto(): string | null {
  try {
    const photo = localStorage.getItem("smartclass_teacher_avatar");
    if (photo && photo.startsWith("data:image/")) return photo;
  } catch {}
  return null;
}

export function saveTeacherPhoto(base64Image: string): void {
  try {
    localStorage.setItem("smartclass_teacher_avatar", base64Image);
  } catch (e) {
    console.error("Gagal menyimpan foto guru:", e);
  }
}

export function deleteTeacherPhoto(): void {
  try {
    localStorage.removeItem("smartclass_teacher_avatar");
  } catch (e) {
    console.error("Gagal menghapus foto guru:", e);
  }
}

export interface TeacherProfile {
  nama: string;
  namaPanggilan: string;
  kontak: string;
}

export function getTeacherProfile(): TeacherProfile {
  return getData<TeacherProfile>("teacher_profile", {
    nama: "Bapak/Ibu Guru Kelas 4",
    namaPanggilan: "Guru Kelas 4",
    kontak: "081234567890",
  });
}

export function saveTeacherProfile(profile: Partial<TeacherProfile>): void {
  const current = getTeacherProfile();
  const updated: TeacherProfile = {
    nama: (profile.nama !== undefined ? profile.nama : current.nama).trim() || "Bapak/Ibu Guru Kelas 4",
    namaPanggilan: (profile.namaPanggilan !== undefined ? profile.namaPanggilan : current.namaPanggilan).trim() || "Guru Kelas 4",
    kontak: (profile.kontak !== undefined ? profile.kontak : current.kontak).trim() || "",
  };
  setData("teacher_profile", updated);
}

export function updateStudentProfile(nisn: string, updates: { nama?: string; namaPanggilan?: string; kontak?: string; pin?: string }): Student | null {
  const students = getStudents();
  const target = students.find((s) => s.nisn === nisn);
  if (!target) return null;

  if (updates.nama !== undefined && updates.nama.trim()) {
    target.nama = updates.nama.trim();
  }
  if (updates.namaPanggilan !== undefined) {
    target.namaPanggilan = updates.namaPanggilan.trim();
  }
  if (updates.kontak !== undefined) {
    target.kontak = updates.kontak.trim();
  }
  if (updates.pin !== undefined && updates.pin.trim().length === 4) {
    target.pin = updates.pin.trim();
  }

  saveStudents(students);
  return target;
}
