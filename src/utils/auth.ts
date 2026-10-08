import { getStudents, getData, setData, getTeacherProfile } from "./storage";
import { Student } from "../data/students";

export interface UserSession {
  role: "guru" | "murid";
  username: string; // "guru" or student NISN
  name: string;
  student?: Student;
  loginTime: string;
}

const SESSION_KEY = "smartclass_session";
const LOCKOUT_KEY = "smartclass_lockout";
const TEACHER_PWD_HASH_KEY = "teacher_pwd_hash";

// SHA-256 helper
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function getTeacherPasswordHash(): Promise<string> {
  const stored = getData<string | null>(TEACHER_PWD_HASH_KEY, null);
  if (stored) return stored;
  // Default password "banyurip2026"
  const defaultHash = await sha256("banyurip2026");
  setData(TEACHER_PWD_HASH_KEY, defaultHash);
  return defaultHash;
}

export async function setTeacherPassword(newPlainPassword: string): Promise<void> {
  const hash = await sha256(newPlainPassword);
  setData(TEACHER_PWD_HASH_KEY, hash);
}

// Lockout helper for 5 failed attempts -> 30s
interface LockoutState {
  attempts: number;
  lockUntil: number; // timestamp ms
}

export function getLockoutState(): { locked: boolean; remainingSeconds: number } {
  try {
    const raw = sessionStorage.getItem(LOCKOUT_KEY);
    if (!raw) return { locked: false, remainingSeconds: 0 };
    const state: LockoutState = JSON.parse(raw);
    const now = Date.now();
    if (state.lockUntil > now) {
      return {
        locked: true,
        remainingSeconds: Math.ceil((state.lockUntil - now) / 1000),
      };
    }
    return { locked: false, remainingSeconds: 0 };
  } catch {
    return { locked: false, remainingSeconds: 0 };
  }
}

export function recordFailedAttempt(): { locked: boolean; remainingSeconds: number } {
  try {
    const raw = sessionStorage.getItem(LOCKOUT_KEY);
    let state: LockoutState = raw ? JSON.parse(raw) : { attempts: 0, lockUntil: 0 };
    state.attempts += 1;
    if (state.attempts >= 5) {
      state.lockUntil = Date.now() + 30000; // 30 seconds
      state.attempts = 0;
      sessionStorage.setItem(LOCKOUT_KEY, JSON.stringify(state));
      return { locked: true, remainingSeconds: 30 };
    }
    sessionStorage.setItem(LOCKOUT_KEY, JSON.stringify(state));
    return { locked: false, remainingSeconds: 0 };
  } catch {
    return { locked: false, remainingSeconds: 0 };
  }
}

export function resetFailedAttempts(): void {
  sessionStorage.removeItem(LOCKOUT_KEY);
}

// Session management
let inMemorySession: UserSession | null = null;

export function getCurrentSession(): UserSession | null {
  if (inMemorySession) return inMemorySession;
  try {
    const rawLocal = localStorage.getItem(SESSION_KEY);
    if (rawLocal) {
      inMemorySession = JSON.parse(rawLocal);
      return inMemorySession;
    }
  } catch {}
  try {
    const rawSession = sessionStorage.getItem(SESSION_KEY);
    if (rawSession) {
      inMemorySession = JSON.parse(rawSession);
      return inMemorySession;
    }
  } catch {}
  return null;
}

export function setCurrentSession(session: UserSession): void {
  inMemorySession = session;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {}
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {}
}

export function clearCurrentSession(): void {
  inMemorySession = null;
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

// Login verification
export async function authenticateTeacher(username: string, password: string): Promise<{ success: boolean; message: string; session?: UserSession }> {
  if (!username.trim() || !password.trim()) {
    return { success: false, message: "Isi dulu ya kolom username dan passwordnya!" };
  }

  const lockout = getLockoutState();
  if (lockout.locked) {
    return { success: false, message: `Terlalu banyak percobaan salah. Mohon tunggu ${lockout.remainingSeconds} detik lagi.` };
  }

  const expectedHash = await getTeacherPasswordHash();
  const inputHash = await sha256(password.trim());

  if (username.trim().toLowerCase() === "guru" && inputHash === expectedHash) {
    resetFailedAttempts();
    const teacherProf = getTeacherProfile();
    const session: UserSession = {
      role: "guru",
      username: "guru",
      name: teacherProf.nama || "Bapak/Ibu Guru Kelas 4",
      loginTime: new Date().toISOString(),
    };
    setCurrentSession(session);
    return { success: true, message: "Selamat datang kembali, Guru Hebat!", session };
  } else {
    const lock = recordFailedAttempt();
    if (lock.locked) {
      return { success: false, message: `Salah 5 kali. Sistem dikunci sementara. Mohon tunggu 30 detik ya.` };
    }
    return { success: false, message: "Username atau password guru kurang tepat. Coba periksa kembali ya!" };
  }
}

export function authenticateStudent(nisn: string, pin: string): { success: boolean; message: string; session?: UserSession } {
  if (!nisn.trim() || !pin.trim()) {
    return { success: false, message: "Isi dulu ya nomor NISN dan PIN 4 digitmu!" };
  }

  const lockout = getLockoutState();
  if (lockout.locked) {
    return { success: false, message: `Terlalu banyak percobaan. Tunggu ${lockout.remainingSeconds} detik lagi ya.` };
  }

  const students = getStudents();
  const found = students.find((s) => s.nisn.trim() === nisn.trim());

  if (found && found.pin === pin.trim()) {
    resetFailedAttempts();
    const session: UserSession = {
      role: "murid",
      username: found.nisn,
      name: found.nama,
      student: found,
      loginTime: new Date().toISOString(),
    };
    setCurrentSession(session);
    return { success: true, message: `Halo ${found.nama}, selamat datang di Smart Class! Siap belajar? 🚀`, session };
  } else {
    const lock = recordFailedAttempt();
    if (lock.locked) {
      return { success: false, message: `Salah 5 kali. Silakan tunggu 30 detik sebelum mencoba lagi ya.` };
    }
    return { success: false, message: "NISN atau PIN belum sesuai nih. Cek lagi kartumu atau tanyakan ke Guru ya!" };
  }
}
