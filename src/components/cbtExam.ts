import { QuestionItem } from "../data/questions";
import {
  getQuestions, getMaterials, getStudents, recordCBTExamScore,
  AssessmentEntry, getAssessmentEntries, calculateSubjectScoreBreakdown,
  getAssessmentSettings, resetStudentCBTExamScore, resetAllCBTExamScores
} from "../utils/storage";
import { getCurrentSession } from "../utils/auth";
import { RAW_KURIKULUM_SEM1, RAW_KURIKULUM_SEM2, LIST_MAPEL_SEM1, LIST_MAPEL_SEM2 } from "../data/kurikulum";
import { playClickSound, playCorrectSound, playWrongSound, playFanfareSound } from "../utils/audio";
import { matchMapel } from "./game";

export type CBTExamPeriod = "ATS 1" | "ASAS 1" | "ATS 2" | "ASAS 2";

export interface CBTQuestionItem {
  id: string;
  nomor: number;
  mapel: string;
  semester: 1 | 2;
  bab: string;
  subbab: string;
  soal: string;
  opsi: string[]; // 4 options A, B, C, D
  jawaban: string;
  penjelasan: string;
}

export interface CBTExamState {
  activePeriod: CBTExamPeriod;
  activeMapel: string;
  activeStudentNisn: string;
  examStarted: boolean;
  examFinished: boolean;
  questions: CBTQuestionItem[];
  currentIndex: number;
  answers: Record<string, string>; // questionId -> selected answer
  flags: Record<string, boolean>; // questionId -> is ragu-ragu
  remainingSeconds: number; // e.g. 90 minutes = 5400s
  totalSeconds: number;
  startTime: number;
  endTime?: number;
  showConfirmSubmitModal: boolean;
  viewMode: "lobby" | "exam" | "result" | "recap";
  isTeacherTrialMode?: boolean;
  result?: {
    score: number;
    total: number;
    correct: number;
    wrong: number;
    unanswered: number;
    kkm: number;
    isPassed: boolean;
    savedAt: string;
    period: CBTExamPeriod;
    mapel: string;
    studentName: string;
    nisn: string;
    durationMinutes: number;
  };
}

// Initial default state
export let cbtExamState: CBTExamState = {
  activePeriod: "ATS 1",
  activeMapel: "Matematika",
  activeStudentNisn: "3174825699", // Anang Janu Kurniawan
  examStarted: false,
  examFinished: false,
  questions: [],
  currentIndex: 0,
  answers: {},
  flags: {},
  remainingSeconds: 5400, // 90 menit
  totalSeconds: 5400,
  startTime: 0,
  showConfirmSubmitModal: false,
  viewMode: "lobby",
  isTeacherTrialMode: false
};

export function setCBTExamState(partial: Partial<CBTExamState>): void {
  cbtExamState = { ...cbtExamState, ...partial };
}

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Determine target chapter numbers based on subject & period
export function getTargetChaptersForPeriod(mapel: string, period: CBTExamPeriod): { semester: 1 | 2; chapterNumbers: number[] } {
  const isSem1 = period === "ATS 1" || period === "ASAS 1";
  const semester: 1 | 2 = isSem1 ? 1 : 2;

  if (period === "ATS 1") {
    // Bab 1 and 2
    return { semester: 1, chapterNumbers: mapel === "Pendidikan Pancasila" ? [1] : [1, 2] };
  }
  if (period === "ASAS 1") {
    // All Semester 1 chapters
    if (mapel === "Pendidikan Pancasila") return { semester: 1, chapterNumbers: [1, 2] };
    if (mapel === "Bahasa Jawa" || mapel === "PAI" || mapel === "PJOK" || mapel === "Seni Budaya") return { semester: 1, chapterNumbers: [1, 2, 3] };
    return { semester: 1, chapterNumbers: [1, 2, 3, 4] };
  }
  if (period === "ATS 2") {
    // First 2 chapters of Semester 2
    if (mapel === "Matematika") return { semester: 2, chapterNumbers: [5, 6] };
    if (mapel === "Bahasa Indonesia" || mapel === "IPAS") return { semester: 2, chapterNumbers: [5, 6] };
    if (mapel === "Pendidikan Pancasila") return { semester: 2, chapterNumbers: [3] };
    if (mapel === "Bahasa Jawa") return { semester: 2, chapterNumbers: [4, 5] };
    if (mapel === "Bahasa Inggris") return { semester: 2, chapterNumbers: [4, 5] };
    if (mapel === "PAI") return { semester: 2, chapterNumbers: [4] };
    if (mapel === "PJOK" || mapel === "Seni Budaya") return { semester: 2, chapterNumbers: [4, 5] };
    return { semester: 2, chapterNumbers: [5, 6] };
  }
  // ASAS 2: All Semester 2 chapters
  if (mapel === "Matematika") return { semester: 2, chapterNumbers: [5, 6, 7] };
  if (mapel === "Bahasa Indonesia" || mapel === "IPAS") return { semester: 2, chapterNumbers: [5, 6, 7, 8] };
  if (mapel === "Pendidikan Pancasila") return { semester: 2, chapterNumbers: [3, 4] };
  if (mapel === "Bahasa Jawa") return { semester: 2, chapterNumbers: [4, 5, 6] };
  if (mapel === "Bahasa Inggris") return { semester: 2, chapterNumbers: [4, 5, 6] };
  if (mapel === "PAI") return { semester: 2, chapterNumbers: [4, 5] };
  if (mapel === "PJOK" || mapel === "Seni Budaya") return { semester: 2, chapterNumbers: [4, 5, 6] };
  return { semester: 2, chapterNumbers: [5, 6, 7] };
}

// Generate EXACTLY 50 CBT questions for any subject and period
export function generate50CBTQuestions(mapel: string, period: CBTExamPeriod): CBTQuestionItem[] {
  const { semester, chapterNumbers } = getTargetChaptersForPeriod(mapel, period);
  const materials = getMaterials();
  const mapelKey = Object.keys(materials).find(k => matchMapel(k, mapel)) || mapel;
  const mapelData = materials[mapelKey];
  const allManualQuestions = getQuestions().filter(q => q.semester === semester && matchMapel(q.mapel, mapel));

  // Collect raw question candidates grouped by chapter number
  const chapterBuckets: Record<number, CBTQuestionItem[]> = {};
  chapterNumbers.forEach(num => {
    chapterBuckets[num] = [];
  });

  // Helper to parse chapter number
  const parseBabNum = (babStr: string): number => {
    const m = babStr.match(/(?:Bab|Pasinaon|Chapter)\s*(\d+)/i);
    return m ? parseInt(m[1], 10) : 1;
  };

  // 1. Ingest manual questions into buckets
  allManualQuestions.forEach(q => {
    const babNum = parseBabNum(q.bab);
    if (chapterBuckets[babNum]) {
      // Ensure 4 distinct options
      let opts = q.opsi || [];
      if (opts.length < 4) {
        opts = Array.from(new Set([...opts, "Semua jawaban benar", "Tidak ada jawaban yang tepat", "Hanya berlaku di situasi tertentu"])).slice(0, 4);
      }
      chapterBuckets[babNum].push({
        id: q.id,
        nomor: 0,
        mapel,
        semester,
        bab: q.bab,
        subbab: q.subbab || "Materi Pokok",
        soal: q.soal,
        opsi: shuffle(opts),
        jawaban: q.jawaban,
        penjelasan: q.penjelasan || "Pembahasan materi asesmen Kurikulum Merdeka."
      });
    }
  });

  // 2. Ingest questions from curriculum materials (contohSoal & ringkasan)
  if (mapelData && mapelData.semesters[semester]) {
    mapelData.semesters[semester].forEach(b => {
      const babNum = b.nomor;
      if (chapterBuckets[babNum]) {
        b.subbab.forEach((sb, sIdx) => {
          // Contoh soal
          sb.contohSoal.forEach((cq, cIdx) => {
            const siblingAnswers = b.subbab.flatMap(s => s.contohSoal.map(c => c.jawab)).filter(j => j !== cq.jawab);
            const distractors = [
              ...siblingAnswers,
              "Konsep ini belum tepat",
              "Semua jawaban salah",
              "Hanya berlaku pada contoh khusus"
            ].slice(0, 3);
            const opts = shuffle(Array.from(new Set([cq.jawab, ...distractors])).slice(0, 4));

            chapterBuckets[babNum].push({
              id: `cbt-mat-${mapel.toLowerCase().slice(0, 3)}-s${semester}-b${babNum}-s${sIdx + 1}-q${cIdx + 1}`,
              nomor: 0,
              mapel,
              semester,
              bab: `Bab ${babNum}: ${b.judul}`,
              subbab: sb.judul,
              soal: cq.tanya,
              opsi: opts,
              jawaban: cq.jawab,
              penjelasan: cq.penjelasan || `Konsep ini dibahas pada ${b.judul} (${sb.judul}).`
            });
          });

          // Summary conceptual question
          if (sb.ringkasan && sb.ringkasan.length > 25) {
            const trueAnswer = sb.ringkasan.length > 80 ? sb.ringkasan.slice(0, 75) + "..." : sb.ringkasan;
            chapterBuckets[babNum].push({
              id: `cbt-sum-${mapel.toLowerCase().slice(0, 3)}-s${semester}-b${babNum}-s${sIdx + 1}`,
              nomor: 0,
              mapel,
              semester,
              bab: `Bab ${babNum}: ${b.judul}`,
              subbab: sb.judul,
              soal: `Pernyataan manakah yang paling sesuai dengan intisari "${sb.judul}"?`,
              opsi: shuffle([
                trueAnswer,
                "Konsep ini tidak memiliki manfaat dalam kehidupan praktis.",
                "Hanya diajarkan pada jenjang pendidikan tingkat atas.",
                "Pernyataan di atas tidak ada yang benar."
              ]),
              jawaban: trueAnswer,
              penjelasan: `Dapat dipelajari kembali pada ringkasan materi ${sb.judul}.`
            });
          }
        });
      }
    });
  }

  // 3. Fallback generator: ensure each bucket has abundant questions (at least 30 questions per chapter)
  chapterNumbers.forEach(num => {
    const bucket = chapterBuckets[num];
    const babsInSem = mapelData?.semesters[semester] || [];
    const thisBab = babsInSem.find(b => b.nomor === num);
    const babTitle = thisBab ? thisBab.judul : `Bab ${num}`;
    const subbabs = thisBab?.subbab || [];

    let seed = 1;
    while (bucket.length < 35) {
      const sb = subbabs[(seed - 1) % Math.max(1, subbabs.length)];
      const sbTitle = sb ? sb.judul : `Subbab ${seed}`;

      const templates = [
        {
          soal: `Dalam mempelajari "${sbTitle}" pada ${babTitle}, langkah pertama yang penting dilakukan adalah...`,
          jawab: "Memahami konsep dasar serta mengenali contoh penerapannya dalam kehidupan sehari-hari.",
          distractors: [
            "Menghafal rumus tanpa memahami maknanya.",
            "Mengabaikan penjelasan guru dan langsung mengerjakan ujian.",
            "Menyerahkan seluruh tugas kepada teman sekelompok."
          ],
          ulasan: `Langkah utama belajar bermakna adalah memahami konsep dasar materi ${sbTitle}.`
        },
        {
          soal: `Manakah contoh penerapan nyata dari materi "${sbTitle}" di lingkungan SDN Banyurip?`,
          jawab: sb?.contoh || "Siswa menerapkan prinsip gotong royong dan ketelitian saat belajar bersama di kelas.",
          distractors: [
            "Membuang sampah di sembarang tempat saat jam istirahat.",
            "Tidak mematuhi rambu dan tata tertib sekolah.",
            "Berbicara sendiri saat guru memberikan instruksi."
          ],
          ulasan: `Penerapan kontekstual materi ${sbTitle} melatih kepedulian dan keterampilan siswa.`
        },
        {
          soal: `Tujuan utama penguasaan materi "${sbTitle}" pada asesmen ${period} adalah agar siswa mampu...`,
          jawab: "Menyelesaikan permasalahan sehari-hari dengan bernalar kritis dan mandiri.",
          distractors: [
            "Mendapatkan pujian tanpa harus belajar dengan sungguh-sungguh.",
            "Menyalin jawaban teman saat evaluasi berlangsung.",
            "Menghindari kegiatan praktik dan diskusi kelas."
          ],
          ulasan: `Tujuan Profil Pelajar Pancasila adalah membentuk pribadi yang bernalar kritis dan mandiri.`
        },
        {
          soal: `Sikap yang mencerminkan pemahaman mendalam tentang "${sbTitle}" adalah...`,
          jawab: "Teliti, percaya diri, dan selalu mengecek kembali hasil pekerjaan.",
          distractors: [
            "Tergesa-gesa mengumpulkan tugas tanpa diperiksa.",
            "Mudah putus asa saat menemukan soal yang menantang.",
            "Hanya belajar jika diawasi oleh orang tua atau guru."
          ],
          ulasan: `Sikap teliti dan percaya diri merupakan kunci keberhasilan belajar.`
        },
        {
          soal: `Manfaat dari mempelajari "${sbTitle}" pada mata pelajaran ${mapel} adalah...`,
          jawab: "Memperluas wawasan keilmuan dan membentuk karakter berdaya cipta.",
          distractors: [
            "Memperoleh nilai tinggi tanpa perlu memahami materi.",
            "Meninggalkan tugas kelas jika dirasa sulit.",
            "Mengurangi waktu berinteraksi secara sehat dengan teman."
          ],
          ulasan: `Setiap materi di kelas 4 dirancang untuk memperluas wawasan dan karakter siswa.`
        }
      ];

      const tmpl = templates[(seed - 1) % templates.length];
      bucket.push({
        id: `cbt-gen-${mapel.toLowerCase().slice(0, 3)}-p${period.toLowerCase().replace(/\s+/g, '_')}-b${num}-q${seed}`,
        nomor: 0,
        mapel,
        semester,
        bab: `Bab ${num}: ${babTitle}`,
        subbab: sbTitle,
        soal: tmpl.soal,
        opsi: shuffle([tmpl.jawab, ...tmpl.distractors]),
        jawaban: tmpl.jawab,
        penjelasan: tmpl.ulasan
      });
      seed++;
    }
  });

  // 4. Distribute 50 questions proportionately across target chapters
  const numChapters = chapterNumbers.length;
  const basePerChapter = Math.floor(50 / numChapters);
  const remainder = 50 % numChapters;

  const selected50: CBTQuestionItem[] = [];

  chapterNumbers.forEach((num, idx) => {
    const quota = basePerChapter + (idx < remainder ? 1 : 0);
    const bucket = shuffle(chapterBuckets[num]);
    const picked = bucket.slice(0, quota);
    selected50.push(...picked);
  });

  // If still slightly off 50 due to edge case, top up from pooled chapters
  if (selected50.length < 50) {
    const allRemaining = shuffle(chapterNumbers.flatMap(num => chapterBuckets[num]));
    for (const q of allRemaining) {
      if (selected50.length >= 50) break;
      if (!selected50.some(s => s.id === q.id)) {
        selected50.push(q);
      }
    }
  }

  // Final slice to guaranteed 50 questions
  const finalPool = shuffle(selected50).slice(0, 50);

  // Assign numbers 1 to 50 and re-shuffle options
  return finalPool.map((q, idx) => ({
    ...q,
    nomor: idx + 1,
    opsi: shuffle(q.opsi)
  }));
}

// Start exam helper
export function startCBTExam(mapel: string, period: CBTExamPeriod, nisn: string): void {
  const questions = generate50CBTQuestions(mapel, period);
  const students = getStudents();
  const st = students.find(s => s.nisn === nisn);
  const studentNisn = st?.nisn || nisn;
  const isTrial = Boolean(cbtExamState.isTeacherTrialMode);

  cbtExamState = {
    activePeriod: period,
    activeMapel: mapel,
    activeStudentNisn: studentNisn,
    examStarted: true,
    examFinished: false,
    questions,
    currentIndex: 0,
    answers: {},
    flags: {},
    remainingSeconds: 5400, // 90 menit
    totalSeconds: 5400,
    startTime: Date.now(),
    showConfirmSubmitModal: false,
    viewMode: "exam",
    isTeacherTrialMode: isTrial
  };
}

// Select an answer
export function selectCBTAnswer(questionId: string, answer: string): void {
  cbtExamState.answers[questionId] = answer;
}

// Toggle ragu-ragu flag
export function toggleCBTFlag(questionId: string): void {
  cbtExamState.flags[questionId] = !cbtExamState.flags[questionId];
}

// Submit CBT Exam and record score
export function submitCBTExam(): void {
  if (cbtExamState.examFinished) return;

  const total = cbtExamState.questions.length;
  let correct = 0;
  let wrong = 0;
  let unanswered = 0;

  cbtExamState.questions.forEach(q => {
    const userAns = cbtExamState.answers[q.id];
    if (!userAns) {
      unanswered++;
    } else if (userAns === q.jawaban) {
      correct++;
    } else {
      wrong++;
    }
  });

  const finalScore = total > 0 ? Math.round((correct / total) * 100) : 0;
  const settings = getAssessmentSettings();
  const kkm = settings.kkmPerMapel[cbtExamState.activeMapel] || 70;
  const isPassed = finalScore >= kkm;

  const students = getStudents();
  const student = students.find(s => s.nisn === cbtExamState.activeStudentNisn);
  const studentName = student?.nama || "Siswa SDN Banyurip";

  const semester: 1 | 2 = (cbtExamState.activePeriod === "ATS 1" || cbtExamState.activePeriod === "ASAS 1") ? 1 : 2;
  const durationMs = Date.now() - cbtExamState.startTime;
  const durationMinutes = Math.max(1, Math.round(durationMs / 60000));

  // Automatically record to Assessment Book & Student Report only if NOT in Teacher Trial Mode
  if (!cbtExamState.isTeacherTrialMode) {
    recordCBTExamScore({
      nisn: cbtExamState.activeStudentNisn,
      studentName,
      semester,
      mapel: cbtExamState.activeMapel,
      period: cbtExamState.activePeriod,
      score: finalScore,
      totalQuestions: total,
      correctCount: correct,
      wrongCount: wrong
    });
  }

  cbtExamState.examFinished = true;
  cbtExamState.examStarted = false;
  cbtExamState.showConfirmSubmitModal = false;
  cbtExamState.viewMode = "result";
  cbtExamState.endTime = Date.now();

  cbtExamState.result = {
    score: finalScore,
    total,
    correct,
    wrong,
    unanswered,
    kkm,
    isPassed,
    savedAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    period: cbtExamState.activePeriod,
    mapel: cbtExamState.activeMapel,
    studentName,
    nisn: cbtExamState.activeStudentNisn,
    durationMinutes
  };

  if (isPassed) {
    playFanfareSound();
  } else {
    playWrongSound();
  }
}

// ----------------------------------------------------
// UI RENDERING FUNCTIONS
// ----------------------------------------------------

export function renderCBTExamView(): string {
  if (cbtExamState.viewMode === "recap") {
    return renderCBTExamRecap();
  }
  if (cbtExamState.viewMode === "result" && cbtExamState.result) {
    return renderCBTExamResult();
  }
  if (cbtExamState.viewMode === "exam" && cbtExamState.questions.length > 0) {
    return renderCBTExamActive();
  }
  return renderCBTExamLobby();
}

// 1. CBT EXAM LOBBY VIEW
export function renderCBTExamLobby(): string {
  const students = getStudents();
  const allEntries = getAssessmentEntries();
  const currentStudent = students.find(s => s.nisn === cbtExamState.activeStudentNisn) || students[0];

  const periods: CBTExamPeriod[] = ["ATS 1", "ASAS 1", "ATS 2", "ASAS 2"];
  const mapels = (cbtExamState.activePeriod === "ATS 2" || cbtExamState.activePeriod === "ASAS 2")
    ? LIST_MAPEL_SEM2
    : LIST_MAPEL_SEM1;

  return `
    <div class="space-y-6 animate-fade-in">
      <!-- Hero Banner -->
      <div class="bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div class="relative z-10 max-w-3xl space-y-3">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-bold text-amber-200">
            <span>💻</span> Asesmen CBT Berstandar Nasional • 50 Soal Proporsional
          </div>
          <h2 class="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Sistem Ujian CBT & Rekapitulasi Nilai Otomatis
          </h2>
          <p class="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Pilihlah Asesmen Periodik (<strong>ATS 1, ASAS 1, ATS 2, ASAS 2</strong>) dan mata pelajaran. Sistem akan mengacak 50 butir soal secara proporsional dari bab-bab terkait dan mengacak opsi jawaban. Setelah diselesaikan, skor otomatis tersimpan ke <strong>Buku Nilai Guru</strong> dan <strong>Rapor Siswa</strong>!
          </p>

          <div class="pt-2 flex flex-wrap items-center gap-3">
            <button id="btn-cbt-open-recap" class="px-4 py-2.5 bg-white text-blue-900 hover:bg-blue-50 rounded-xl text-xs font-black shadow-md transition flex items-center gap-2 cursor-pointer">
              <span>📊</span> Lihat Rekapitulasi Nilai Asesmen (8 Siswa)
            </button>
            <span class="text-xs text-blue-200 font-semibold">
              Waktu Ujian: <strong>90 Menit</strong> • Soal Acak Anti-Contek
            </span>
          </div>
        </div>

        <div class="hidden lg:flex absolute right-6 bottom-4 items-center gap-3 opacity-90 pointer-events-none">
          <div class="text-8xl">📝</div>
        </div>
      </div>

      <!-- Teacher Trial Mode Toggle (Only visible if teacher) -->
      ${(() => {
        const session = getCurrentSession();
        if (session?.role !== "guru") return "";
        return `
          <div class="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs">
            <div class="flex items-center gap-3">
              <span class="text-3xl">🔬</span>
              <div>
                <div class="font-black text-amber-950 flex items-center gap-2">
                  <span class="text-sm">Mode Uji Coba Guru (Simulasi Ujian)</span>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black ${cbtExamState.isTeacherTrialMode ? 'bg-amber-600 text-white shadow-2xs' : 'bg-slate-200 text-slate-700'}">
                    ${cbtExamState.isTeacherTrialMode ? 'AKTIF (SKOR TIDAK DISIMPAN)' : 'NONAKTIF'}
                  </span>
                </div>
                <p class="text-[11px] text-amber-900/90 mt-0.5">
                  ${cbtExamState.isTeacherTrialMode
                    ? 'Mode aktif: Guru dapat mencoba 50 butir soal CBT tanpa khawatir nilainya merusak atau tercatat ke buku nilai siswa.'
                    : 'Aktifkan mode ini saat guru sedang menguji butir soal, agar skor tes tidak masuk ke rekap nilai siswa.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              id="btn-toggle-cbt-trial-mode"
              class="px-4 py-2.5 rounded-xl text-xs font-black transition shadow-xs cursor-pointer shrink-0 ${
                cbtExamState.isTeacherTrialMode
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
              }"
            >
              ${cbtExamState.isTeacherTrialMode ? '✅ Mode Uji Coba Aktif' : '🔬 Aktifkan Mode Uji Coba'}
            </button>
          </div>
        `;
      })()}

      <!-- Student Selector Ribbon -->
      <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 class="text-sm font-black text-slate-800 flex items-center gap-2">
              <span>👤</span> Peserta Ujian Aktif:
            </h3>
            <p class="text-xs text-slate-500">Pilih salah satu dari 8 siswa resmi SDN Banyurip untuk mengerjakan ujian</p>
          </div>
          <span class="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold font-mono">
            NISN: ${currentStudent.nisn}
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          ${students.map(s => {
            const isSel = s.nisn === currentStudent.nisn;
            return `
              <button 
                type="button"
                data-select-cbt-student="${s.nisn}"
                class="p-2.5 rounded-2xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                  isSel
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-300'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }"
              >
                <div class="w-8 h-8 rounded-xl ${isSel ? 'bg-white/20' : 'bg-slate-200'} flex items-center justify-center font-bold text-xs shrink-0">
                  ${s.no}
                </div>
                <div class="min-w-0">
                  <div class="text-xs font-bold truncate leading-tight">${s.nama}</div>
                  <div class="text-[10px] ${isSel ? 'text-emerald-100' : 'text-slate-400'} font-mono truncate">NIS: ${s.nis}</div>
                </div>
              </button>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Exam Period Selector Tabs -->
      <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 class="text-sm font-black text-slate-800 flex items-center gap-2">
            <span>🗓️</span> Pilih Periode Asesmen:
          </h3>
          <p class="text-xs text-slate-500">Pilih semester dan jenis asesmen yang akan diujikan</p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          ${periods.map(p => {
            const isSel = p === cbtExamState.activePeriod;
            const subtitle = p === "ATS 1" ? "Semester 1 (Bab 1–2)"
              : p === "ASAS 1" ? "Semester 1 (Bab 1–4)"
              : p === "ATS 2" ? "Semester 2 (Bab 5–6)"
              : "Semester 2 (Semua Bab)";
            return `
              <button
                type="button"
                data-select-cbt-period="${p}"
                class="p-4 rounded-2xl border text-left transition relative cursor-pointer ${
                  isSel
                    ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-300'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }"
              >
                <div class="flex justify-between items-start">
                  <span class="text-xl">${p.startsWith("ATS") ? '📝' : '🏆'}</span>
                  ${isSel ? '<span class="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">Aktif</span>' : ''}
                </div>
                <div class="mt-2">
                  <div class="font-black text-sm sm:text-base">${p}</div>
                  <div class="text-[11px] ${isSel ? 'text-blue-100' : 'text-slate-500'} mt-0.5">${subtitle}</div>
                </div>
              </button>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Subjects Grid (9 Mapels) -->
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-black text-slate-800 flex items-center gap-2">
              <span>📚</span> Daftar Mata Pelajaran Ujian CBT (50 Soal)
            </h3>
            <p class="text-xs text-slate-500">Pilihlah salah satu mata pelajaran untuk memulai ujian 50 butir soal</p>
          </div>
          <span class="text-xs font-bold text-slate-400">
            9 Mata Pelajaran Lengkap
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${mapels.map((m, idx) => {
            const sem: 1 | 2 = (cbtExamState.activePeriod === "ATS 1" || cbtExamState.activePeriod === "ASAS 1") ? 1 : 2;
            const category: "asts" | "asas" = (cbtExamState.activePeriod === "ATS 1" || cbtExamState.activePeriod === "ATS 2") ? "asts" : "asas";

            // Find existing score for this student, mapel, semester, category
            const existing = allEntries.find(e =>
              e.nisn === currentStudent.nisn &&
              e.semester === sem &&
              matchMapel(e.mapel, m) &&
              e.category === category
            );

            const hasScore = existing && existing.score !== null;
            const scoreVal = existing?.score || 0;
            const isPassed = scoreVal >= 70;

            const icon = m === "Matematika" ? "📐"
              : m === "Bahasa Indonesia" ? "📖"
              : m === "Pendidikan Pancasila" ? "🇮🇩"
              : m === "IPAS" ? "🔬"
              : m === "Bahasa Jawa" ? "🏛️"
              : m === "Bahasa Inggris" ? "🇬🇧"
              : m === "PAI" ? "🕌"
              : m === "PJOK" ? "🏃"
              : "🎨";

            return `
              <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4">
                <div class="space-y-3">
                  <div class="flex justify-between items-start">
                    <div class="w-12 h-12 rounded-2xl bg-slate-100 text-2xl flex items-center justify-center shrink-0">
                      ${icon}
                    </div>
                    ${hasScore ? `
                      <div class="text-right">
                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }">
                          <span>${isPassed ? '✅' : '⚠️'}</span>
                          <span>Skor: ${scoreVal}/100</span>
                        </span>
                        <div class="text-[10px] text-slate-400 mt-0.5">${isPassed ? 'Tuntas (Lulus)' : 'Perlu Bimbingan'}</div>
                      </div>
                    ` : `
                      <span class="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-semibold">
                        Belum Diambil
                      </span>
                    `}
                  </div>

                  <div>
                    <h4 class="font-black text-slate-800 text-base leading-snug">${m}</h4>
                    <p class="text-xs text-slate-500 mt-0.5">
                      ${cbtExamState.activePeriod} • Kurikulum Merdeka Kelas 4
                    </p>
                  </div>

                  <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
                    <div class="font-bold text-slate-700 flex items-center gap-1">
                      <span>🎯</span> Format Ujian:
                    </div>
                    <ul class="text-[11px] text-slate-500 list-disc list-inside space-y-0.5">
                      <li>50 Soal Pilihan Ganda (A, B, C, D)</li>
                      <li>Distribusi proporsional bab & anti-contek</li>
                      <li>Durasi 90 menit dengan navigasi fleksibel</li>
                    </ul>
                  </div>
                </div>

                <div class="pt-2">
                  <button
                    type="button"
                    data-start-cbt-exam="${encodeURIComponent(m)}"
                    class="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
                  >
                    <span>${hasScore ? 'Ulangi Ujian (50 Soal)' : 'Mulai Ujian 50 Soal'}</span>
                    <span>🚀</span>
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </div>
  `;
}

// 2. ACTIVE CBT EXAM VIEW
export function renderCBTExamActive(): string {
  const q = cbtExamState.questions[cbtExamState.currentIndex];
  if (!q) {
    return `<div class="p-12 text-center text-slate-500">Soal ujian tidak ditemukan.</div>`;
  }

  const students = getStudents();
  const student = students.find(s => s.nisn === cbtExamState.activeStudentNisn) || students[0];

  const total = cbtExamState.questions.length;
  const currentNum = cbtExamState.currentIndex + 1;
  const answeredCount = Object.keys(cbtExamState.answers).length;
  const flaggedCount = Object.values(cbtExamState.flags).filter(Boolean).length;
  const currentAnswer = cbtExamState.answers[q.id];
  const isFlagged = Boolean(cbtExamState.flags[q.id]);

  // Format timer MM:SS
  const mins = Math.floor(cbtExamState.remainingSeconds / 60);
  const secs = cbtExamState.remainingSeconds % 60;
  const timerStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const isLowTime = cbtExamState.remainingSeconds < 300; // < 5 mins

  return `
    <div class="space-y-5 animate-fade-in max-w-5xl mx-auto">
      ${cbtExamState.isTeacherTrialMode ? `
        <div class="p-3.5 bg-amber-500 text-white rounded-2xl flex items-center justify-between shadow-sm text-xs font-bold animate-pulse">
          <div class="flex items-center gap-2">
            <span class="text-lg">🔬</span>
            <span>MODE UJI COBA GURU AKTIF: Anda sedang menguji 50 soal CBT. Skor akhir TIDAK akan disimpan ke buku rekap siswa.</span>
          </div>
          <span class="px-2.5 py-1 bg-amber-700 text-white rounded-xl text-[10px] font-black shrink-0">
            Simulasi Guru
          </span>
        </div>
      ` : ''}

      <!-- Exam Control Bar -->
      <div class="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-2.5 py-1 bg-blue-100 text-blue-900 rounded-lg text-xs font-black font-mono">
              ${cbtExamState.activePeriod}
            </span>
            <span class="font-black text-slate-800 text-sm sm:text-base">${cbtExamState.activeMapel}</span>
            <span class="text-xs text-slate-400">•</span>
            <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              👤 ${student.nama} (${student.nisn})
            </span>
          </div>
          <div class="text-xs text-slate-500 mt-1 flex items-center gap-3">
            <span>Terjawab: <strong class="text-emerald-600 font-mono">${answeredCount}</strong> / ${total}</span>
            <span>Ragu: <strong class="text-amber-600 font-mono">${flaggedCount}</strong></span>
          </div>
        </div>

        <div class="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <!-- Timer -->
          <div class="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border font-mono font-black text-sm sm:text-base ${
            isLowTime ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse' : 'bg-slate-50 text-slate-800 border-slate-200'
          }">
            <span>⏱️</span>
            <span>${timerStr}</span>
          </div>

          <button
            type="button"
            id="btn-cbt-open-submit-modal"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>🏁</span>
            <span>Selesaikan Ujian</span>
          </button>
        </div>
      </div>

      <!-- Main Layout: Question (Left/Top) + Number Palette (Right/Sidebar) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <!-- Question Pane -->
        <div class="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <!-- Question Header -->
          <div class="flex flex-wrap justify-between items-center gap-2 pb-4 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 bg-slate-900 text-white rounded-xl font-mono font-black text-xs">
                Soal No. ${currentNum}
              </span>
              <span class="text-xs text-slate-400 font-medium">dari ${total} soal</span>
            </div>

            <!-- Chapter Tag -->
            <span class="text-[11px] font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg">
              ${q.bab}
            </span>
          </div>

          <!-- Question Body -->
          <div class="space-y-3">
            <div class="text-sm text-slate-400 font-semibold text-[11px]">
              Topik: ${q.subbab}
            </div>
            <p class="text-slate-900 text-sm sm:text-base font-semibold leading-relaxed">
              ${q.soal}
            </p>
          </div>

          <!-- Answer Options (A, B, C, D) -->
          <div class="space-y-3 pt-2">
            ${q.opsi.map((opt, oIdx) => {
              const letter = ["A", "B", "C", "D"][oIdx] || `${oIdx + 1}`;
              const isSelected = currentAnswer === opt;
              return `
                <button
                  type="button"
                  data-cbt-select-option="${encodeURIComponent(opt)}"
                  class="w-full text-left p-4 rounded-2xl border transition flex items-start gap-3.5 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 shadow-xs ring-2 ring-blue-200 text-blue-900'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }"
                >
                  <div class="w-8 h-8 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }">
                    ${letter}
                  </div>
                  <div class="flex-1 pt-1 text-xs sm:text-sm font-medium leading-relaxed">
                    ${opt}
                  </div>
                  ${isSelected ? '<span class="text-blue-600 text-base">✓</span>' : ''}
                </button>
              `;
            }).join("")}
          </div>

          <!-- Bottom Action Buttons: Prev, Flag Ragu, Next -->
          <div class="flex flex-wrap justify-between items-center gap-3 pt-5 border-t border-slate-100">
            <button
              type="button"
              id="btn-cbt-prev"
              ${cbtExamState.currentIndex === 0 ? 'disabled' : ''}
              class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                cbtExamState.currentIndex === 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer'
              }"
            >
              <span>⬅️</span>
              <span>Sebelumnya</span>
            </button>

            <!-- Ragu-ragu Button -->
            <button
              type="button"
              id="btn-cbt-toggle-flag"
              class="px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                isFlagged
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300'
              }"
            >
              <span>${isFlagged ? '🚩' : '🟡'}</span>
              <span>${isFlagged ? 'Ditandai Ragu-Ragu' : 'Tandai Ragu-Ragu'}</span>
            </button>

            ${cbtExamState.currentIndex === total - 1 ? `
              <button
                type="button"
                id="btn-cbt-finish-direct"
                class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Selesai</span>
                <span>🏁</span>
              </button>
            ` : `
              <button
                type="button"
                id="btn-cbt-next"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Selanjutnya</span>
                <span>➡️</span>
              </button>
            `}
          </div>
        </div>

        <!-- Right Pane: Navigation Palette (1–50) -->
        <div class="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div class="flex justify-between items-center pb-2 border-b border-slate-100">
            <h4 class="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>🔢</span> Navigasi Soal (1–50)
            </h4>
            <span class="text-[11px] font-mono font-bold text-slate-400">
              ${answeredCount}/50 Terjawab
            </span>
          </div>

          <!-- Color Legend -->
          <div class="grid grid-cols-3 gap-2 text-[10px] font-semibold text-slate-600 pb-2">
            <div class="flex items-center gap-1.5">
              <span class="w-3.5 h-3.5 rounded-md bg-emerald-600 shrink-0"></span>
              <span>Terjawab</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3.5 h-3.5 rounded-md bg-amber-400 shrink-0"></span>
              <span>Ragu-Ragu</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3.5 h-3.5 rounded-md bg-slate-100 border border-slate-300 shrink-0"></span>
              <span>Belum</span>
            </div>
          </div>

          <!-- 50 Buttons Grid -->
          <div class="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-5 gap-2 max-h-[360px] overflow-y-auto p-1 scrollbar-none">
            ${cbtExamState.questions.map((item, idx) => {
              const isCur = idx === cbtExamState.currentIndex;
              const hasAnswer = Boolean(cbtExamState.answers[item.id]);
              const isFlag = Boolean(cbtExamState.flags[item.id]);

              let btnStyle = "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200";
              if (hasAnswer) {
                btnStyle = "bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-700 font-black";
              }
              if (isFlag) {
                btnStyle = "bg-amber-400 text-slate-900 hover:bg-amber-500 border-amber-500 font-black";
              }
              if (isCur) {
                btnStyle += " ring-3 ring-blue-500 ring-offset-1";
              }

              return `
                <button
                  type="button"
                  data-cbt-jump-index="${idx}"
                  class="h-9 rounded-xl border text-xs font-mono transition flex items-center justify-center relative cursor-pointer ${btnStyle}"
                  title="Soal No. ${idx + 1} (${hasAnswer ? 'Sudah dijawab' : 'Belum dijawab'})"
                >
                  <span>${idx + 1}</span>
                  ${isFlag ? '<span class="absolute -top-1 -right-1 text-[9px]">🟡</span>' : ''}
                </button>
              `;
            }).join("")}
          </div>

          <!-- Quick Return / Cancel Option -->
          <div class="pt-2 border-t border-slate-100">
            <button
              type="button"
              id="btn-cbt-exit-to-lobby"
              class="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>↩️</span>
              <span>Kembali ke Beranda Ujian</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Confirmation Submit Modal -->
      ${cbtExamState.showConfirmSubmitModal ? `
        <div class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-scale-up">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 text-2xl flex items-center justify-center shrink-0">
                🏁
              </div>
              <div>
                <h3 class="font-black text-slate-900 text-base">Konfirmasi Selesai Ujian</h3>
                <p class="text-xs text-slate-500">Periksa ringkasan jawaban sebelum mengirimkan ujian</p>
              </div>
            </div>

            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div class="flex justify-between items-center text-slate-700">
                <span>Total Soal:</span>
                <strong class="font-mono font-bold">${total} Soal</strong>
              </div>
              <div class="flex justify-between items-center text-emerald-700">
                <span>Sudah Dijawab:</span>
                <strong class="font-mono font-bold">${answeredCount} Soal</strong>
              </div>
              <div class="flex justify-between items-center text-amber-700">
                <span>Masih Ragu-Ragu:</span>
                <strong class="font-mono font-bold">${flaggedCount} Soal</strong>
              </div>
              <div class="flex justify-between items-center text-rose-700">
                <span>Belum Dijawab:</span>
                <strong class="font-mono font-bold">${total - answeredCount} Soal</strong>
              </div>
            </div>

            <p class="text-xs text-slate-600 leading-relaxed">
              Setelah dikirim, nilai akan dihitung secara otomatis dan langsung dicatat ke <strong>Buku Nilai Asesmen Guru</strong> serta <strong>Rapor Digital Siswa</strong>.
            </p>

            <div class="flex items-center gap-3 pt-2">
              <button
                type="button"
                id="btn-cbt-cancel-submit"
                class="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                Periksa Lagi ✏️
              </button>
              <button
                type="button"
                id="btn-cbt-confirm-submit"
                class="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs shadow-md transition cursor-pointer"
              >
                Kirim Sekarang 🚀
              </button>
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// 3. CBT EXAM RESULT VIEW
export function renderCBTExamResult(): string {
  const res = cbtExamState.result;
  if (!res) {
    return `<div class="p-8 text-center text-slate-500">Hasil ujian tidak tersedia.</div>`;
  }

  const isPassed = res.isPassed;

  return `
    <div class="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <!-- Result Banner Card -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center space-y-5">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl ${
          isPassed ? 'bg-emerald-100 text-emerald-700 text-4xl shadow-inner' : 'bg-amber-100 text-amber-700 text-4xl shadow-inner'
        }">
          ${isPassed ? '🏆' : '📚'}
        </div>

        <div class="space-y-1">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
            isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }">
            <span>${isPassed ? '✅ TUNTAS / LULUS' : '⚠️ PERLU BIMBINGAN'}</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 pt-1">
            Hasil Ujian CBT: ${res.mapel}
          </h2>
          <p class="text-xs sm:text-sm text-slate-500">
            ${res.period} • Peserta: <strong>${res.studentName}</strong> (NISN: ${res.nisn})
          </p>
        </div>

        <!-- Big Score Display -->
        <div class="py-4">
          <div class="text-6xl sm:text-7xl font-black font-mono tracking-tight ${
            isPassed ? 'text-emerald-600' : 'text-amber-600'
          }">
            ${res.score}
          </div>
          <div class="text-xs font-bold text-slate-400 mt-1">
            SKOR AKHIR (SKALA 0–100) • KKM: ${res.kkm}
          </div>
        </div>

        <!-- Auto-Sync Confirmation Banner -->
        ${cbtExamState.isTeacherTrialMode ? `
          <div class="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-center justify-center gap-3 text-xs text-amber-950 font-bold max-w-lg mx-auto">
            <span class="text-2xl">🔬</span>
            <span>
              Mode Uji Coba Guru Selesai: Nilai <strong>${res.score}</strong> dihitung untuk simulasi evaluasi soal dan <strong>TIDAK disimpan</strong> ke rekap nilai siswa.
            </span>
          </div>
        ` : `
          <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center gap-3 text-xs text-emerald-900 font-semibold max-w-lg mx-auto">
            <span class="text-xl">💾</span>
            <span>
              Nilai <strong>${res.score}</strong> telah <strong>otomatis disimpan</strong> ke Buku Nilai Asesmen Guru dan Rapor Digital Siswa SDN Banyurip.
            </span>
          </div>
        `}

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 max-w-2xl mx-auto">
          <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div class="text-xs text-slate-500">Benar</div>
            <div class="text-xl font-black text-emerald-600 font-mono">${res.correct}</div>
          </div>
          <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div class="text-xs text-slate-500">Salah</div>
            <div class="text-xl font-black text-rose-600 font-mono">${res.wrong}</div>
          </div>
          <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div class="text-xs text-slate-500">Kosong</div>
            <div class="text-xl font-black text-slate-600 font-mono">${res.unanswered}</div>
          </div>
          <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div class="text-xs text-slate-500">Durasi</div>
            <div class="text-xl font-black text-blue-600 font-mono">${res.durationMinutes} mnt</div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button
            type="button"
            id="btn-cbt-back-lobby"
            class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <span>📝</span>
            <span>Ujian CBT Lainnya</span>
          </button>

          <button
            type="button"
            id="btn-cbt-open-recap"
            class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
          >
            <span>📊</span>
            <span>Rekap Nilai Siswa</span>
          </button>

          <button
            type="button"
            id="btn-cbt-print-result"
            class="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>🖨️</span>
            <span>Cetak Bukti</span>
          </button>
        </div>
      </div>

      <!-- Question Review Section (All 50 Questions) -->
      <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div class="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-black text-slate-900 text-base flex items-center gap-2">
              <span>🔍</span> Pembahasan 50 Butir Soal Ujian
            </h3>
            <p class="text-xs text-slate-500">Periksa kunci jawaban dan ulasan materi untuk evaluasi belajar</p>
          </div>
          <span class="text-xs font-bold text-slate-400">
            50 Soal Lengkap
          </span>
        </div>

        <div class="space-y-4">
          ${cbtExamState.questions.map((item, idx) => {
            const userAns = cbtExamState.answers[item.id];
            const isCorrect = userAns === item.jawaban;
            const isUnanswered = !userAns;

            return `
              <div class="p-4 rounded-2xl border text-xs space-y-2.5 ${
                isCorrect ? 'bg-emerald-50/50 border-emerald-200'
                  : isUnanswered ? 'bg-slate-50 border-slate-200'
                  : 'bg-rose-50/50 border-rose-200'
              }">
                <div class="flex justify-between items-start gap-2">
                  <div class="font-bold text-slate-800 flex items-center gap-2">
                    <span class="w-6 h-6 rounded-lg ${isCorrect ? 'bg-emerald-600 text-white' : isUnanswered ? 'bg-slate-400 text-white' : 'bg-rose-600 text-white'} flex items-center justify-center font-mono text-[11px]">
                      ${idx + 1}
                    </span>
                    <span>${item.soal}</span>
                  </div>
                  <span class="font-bold shrink-0 px-2 py-0.5 rounded text-[10px] ${
                    isCorrect ? 'bg-emerald-100 text-emerald-800' : isUnanswered ? 'bg-slate-200 text-slate-600' : 'bg-rose-100 text-rose-800'
                  }">
                    ${isCorrect ? 'BENAR ✓' : isUnanswered ? 'KOSONG ⚪' : 'SALAH ✕'}
                  </span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                  <div class="p-2 rounded-xl bg-white/80 border border-slate-200">
                    <span class="text-slate-500 font-medium">Jawabanmu:</span>
                    <strong class="${isCorrect ? 'text-emerald-700' : 'text-rose-700'} ml-1">
                      ${userAns || '(Tidak dijawab)'}
                    </strong>
                  </div>
                  <div class="p-2 rounded-xl bg-white/80 border border-slate-200">
                    <span class="text-slate-500 font-medium">Kunci Jawaban:</span>
                    <strong class="text-emerald-800 ml-1">${item.jawaban}</strong>
                  </div>
                </div>

                <div class="text-[11px] text-slate-600 bg-white/60 p-2.5 rounded-xl border border-slate-100">
                  <strong class="text-slate-800">Ulasan Materi:</strong> ${item.penjelasan}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </div>
  `;
}

// 4. CBT EXAM RECAP MATRIX VIEW
export function renderCBTExamRecap(): string {
  const students = getStudents();
  const allEntries = getAssessmentEntries();

  const periods: CBTExamPeriod[] = ["ATS 1", "ASAS 1", "ATS 2", "ASAS 2"];
  const mapels = (cbtExamState.activePeriod === "ATS 2" || cbtExamState.activePeriod === "ASAS 2")
    ? LIST_MAPEL_SEM2
    : LIST_MAPEL_SEM1;

  const currentPeriod = cbtExamState.activePeriod;
  const sem: 1 | 2 = (currentPeriod === "ATS 1" || currentPeriod === "ASAS 1") ? 1 : 2;
  const category: "asts" | "asas" = (currentPeriod === "ATS 1" || currentPeriod === "ATS 2") ? "asts" : "asas";

  return `
    <div class="space-y-6 animate-fade-in">
      <!-- Header -->
      <div class="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-2xl">📊</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900">Rekapitulasi Nilai Asesmen Ujian CBT</h2>
          </div>
          <p class="text-xs text-slate-500 mt-1">
            Data rekap nilai ujian 50 butir soal untuk 8 siswa resmi Kelas 4 SDN Banyurip.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <!-- Switch Period Tabs -->
          <div class="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            ${periods.map(p => `
              <button
                type="button"
                data-recap-period="${p}"
                class="px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                  p === currentPeriod ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }"
              >
                ${p}
              </button>
            `).join("")}
          </div>

          <button
            type="button"
            id="btn-cbt-back-lobby"
            class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <span>↩️</span>
            <span>Kembali ke Ujian</span>
          </button>

          <button
            type="button"
            id="btn-cbt-print-recap"
            class="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1 cursor-pointer"
          >
            <span>🖨️</span>
            <span>Cetak Rekap</span>
          </button>

          ${(() => {
            const session = getCurrentSession();
            if (session?.role !== "guru") return "";
            return `
              <button
                type="button"
                id="btn-toggle-cbt-trial-mode-recap"
                class="px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                  cbtExamState.isTeacherTrialMode
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
                }"
                title="Aktifkan/nonaktifkan mode simulasi uji coba guru agar nilai tes tidak tersimpan ke data rekap siswa"
              >
                <span>🔬</span>
                <span>Mode Uji Coba: ${cbtExamState.isTeacherTrialMode ? 'AKTIF' : 'NONAKTIF'}</span>
              </button>

              <button
                type="button"
                id="btn-reset-all-cbt-recap"
                class="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 rounded-xl text-xs font-black transition flex items-center gap-1 cursor-pointer"
                title="Reset seluruh nilai ujian siswa untuk periode ${currentPeriod}"
              >
                <span>🗑️</span>
                <span>Reset Semua Siswa</span>
              </button>
            `;
          })()}
        </div>
      </div>

      <!-- Matrix Table -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div class="font-black text-xs text-slate-800 flex items-center gap-2">
            <span>📋</span> Tabel Nilai ${currentPeriod} (${sem === 1 ? 'Semester 1' : 'Semester 2'})
          </div>
          <span class="text-[11px] text-slate-500">KKM Standar: <strong>70</strong></span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th class="py-3 px-3.5 w-10 text-center">No</th>
                <th class="py-3 px-3.5 min-w-[150px]">Nama Siswa</th>
                <th class="py-3 px-3.5 font-mono text-center w-28">NISN</th>
                ${mapels.map(m => `
                  <th class="py-3 px-2 text-center min-w-[70px] whitespace-nowrap" title="${m}">
                    ${m.length > 8 ? m.slice(0, 7) + '..' : m}
                  </th>
                `).join("")}
                <th class="py-3 px-3 text-center w-20 font-black">Rata-Rata</th>
                <th class="py-3 px-3 text-center w-24 font-black">Status</th>
                ${getCurrentSession()?.role === "guru" ? '<th class="py-3 px-3 text-center w-28">Aksi Guru</th>' : ''}
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
              ${students.map(s => {
                let totalScore = 0;
                let count = 0;
                let allPassed = true;

                const scoreCells = mapels.map(m => {
                  const entry = allEntries.find(e =>
                    e.nisn === s.nisn &&
                    e.semester === sem &&
                    matchMapel(e.mapel, m) &&
                    e.category === category
                  );
                  if (entry && entry.score !== null) {
                    totalScore += entry.score;
                    count++;
                    if (entry.score < 70) allPassed = false;
                    return `
                      <td class="py-2.5 px-2 text-center font-mono font-bold ${
                        entry.score >= 70 ? 'text-emerald-700 bg-emerald-50/30' : 'text-rose-700 bg-rose-50/30'
                      }">
                        ${entry.score}
                      </td>
                    `;
                  }
                  return `<td class="py-2.5 px-2 text-center text-slate-300 font-mono">-</td>`;
                });

                const avg = count > 0 ? Math.round((totalScore / count) * 10) / 10 : null;
                const statusBadge = count === 0 ? '<span class="text-slate-400">Belum Ada</span>'
                  : allPassed ? '<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">LULUS</span>'
                  : '<span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">REMEDIAL</span>';

                const isTeacherUser = getCurrentSession()?.role === "guru";

                return `
                  <tr class="hover:bg-slate-50 transition">
                    <td class="py-2.5 px-3.5 text-center font-bold text-slate-500">${s.no}</td>
                    <td class="py-2.5 px-3.5 font-bold text-slate-900">${s.nama}</td>
                    <td class="py-2.5 px-3.5 font-mono text-center text-slate-500 text-[11px]">${s.nisn}</td>
                    ${scoreCells.join("")}
                    <td class="py-2.5 px-3 text-center font-mono font-black text-slate-900 ${
                      avg !== null && avg >= 70 ? 'text-emerald-700' : 'text-slate-700'
                    }">
                      ${avg !== null ? avg : '-'}
                    </td>
                    <td class="py-2.5 px-3 text-center">${statusBadge}</td>
                    ${isTeacherUser ? `
                      <td class="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          class="btn-reset-student-cbt-score px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 mx-auto cursor-pointer"
                          data-nisn="${s.nisn}"
                          data-period="${currentPeriod}"
                          data-name="${s.nama}"
                          title="Reset / Kosongkan nilai ${currentPeriod} untuk ${s.nama}"
                        >
                          <span>🗑️</span>
                          <span>Reset</span>
                        </button>
                      </td>
                    ` : ''}
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

// ----------------------------------------------------
// EVENT BINDINGS & TIMER
// ----------------------------------------------------
let cbtTimerInterval: any = null;

export function stopCBTTimer(): void {
  if (cbtTimerInterval) {
    clearInterval(cbtTimerInterval);
    cbtTimerInterval = null;
  }
}

export function startCBTTimer(onTick: () => void): void {
  stopCBTTimer();
  cbtTimerInterval = setInterval(() => {
    if (cbtExamState.viewMode === "exam" && cbtExamState.examStarted && !cbtExamState.examFinished) {
      if (cbtExamState.remainingSeconds > 0) {
        cbtExamState.remainingSeconds--;
        onTick();
      } else {
        // Time is up! Automatically submit!
        stopCBTTimer();
        submitCBTExam();
        onTick();
      }
    }
  }, 1000);
}

export function bindCBTExamEvents(onUpdate: () => void): void {
  // 1. Select student in lobby
  document.querySelectorAll<HTMLElement>("[data-select-cbt-student]").forEach(btn => {
    btn.addEventListener("click", () => {
      playClickSound();
      const nisn = btn.getAttribute("data-select-cbt-student");
      if (nisn) {
        cbtExamState.activeStudentNisn = nisn;
        onUpdate();
      }
    });
  });

  // 2. Select period in lobby
  document.querySelectorAll<HTMLElement>("[data-select-cbt-period]").forEach(btn => {
    btn.addEventListener("click", () => {
      playClickSound();
      const p = btn.getAttribute("data-select-cbt-period") as CBTExamPeriod;
      if (p) {
        cbtExamState.activePeriod = p;
        onUpdate();
      }
    });
  });

  // 3. Start Exam button
  document.querySelectorAll<HTMLElement>("[data-start-cbt-exam]").forEach(btn => {
    btn.addEventListener("click", () => {
      playClickSound();
      const mapelEncoded = btn.getAttribute("data-start-cbt-exam");
      const mapel = mapelEncoded ? decodeURIComponent(mapelEncoded) : "Matematika";
      startCBTExam(mapel, cbtExamState.activePeriod, cbtExamState.activeStudentNisn);
      startCBTTimer(onUpdate);
      onUpdate();
    });
  });

  // 4. Select answer option
  document.querySelectorAll<HTMLElement>("[data-cbt-select-option]").forEach(btn => {
    btn.addEventListener("click", () => {
      playClickSound();
      const optEncoded = btn.getAttribute("data-cbt-select-option");
      const q = cbtExamState.questions[cbtExamState.currentIndex];
      if (optEncoded && q) {
        const opt = decodeURIComponent(optEncoded);
        selectCBTAnswer(q.id, opt);
        onUpdate();
      }
    });
  });

  // 5. Toggle flag (ragu-ragu)
  const flagBtn = document.getElementById("btn-cbt-toggle-flag");
  if (flagBtn) {
    flagBtn.addEventListener("click", () => {
      playClickSound();
      const q = cbtExamState.questions[cbtExamState.currentIndex];
      if (q) {
        toggleCBTFlag(q.id);
        onUpdate();
      }
    });
  }

  // 6. Navigation: Next & Prev
  const prevBtn = document.getElementById("btn-cbt-prev");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      playClickSound();
      if (cbtExamState.currentIndex > 0) {
        cbtExamState.currentIndex--;
        onUpdate();
      }
    });
  }

  const nextBtn = document.getElementById("btn-cbt-next");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      playClickSound();
      if (cbtExamState.currentIndex < cbtExamState.questions.length - 1) {
        cbtExamState.currentIndex++;
        onUpdate();
      }
    });
  }

  // 7. Jump directly to question index
  document.querySelectorAll<HTMLElement>("[data-cbt-jump-index]").forEach(btn => {
    btn.addEventListener("click", () => {
      playClickSound();
      const idxStr = btn.getAttribute("data-cbt-jump-index");
      if (idxStr !== null) {
        const idx = parseInt(idxStr, 10);
        if (idx >= 0 && idx < cbtExamState.questions.length) {
          cbtExamState.currentIndex = idx;
          onUpdate();
        }
      }
    });
  });

  // 8. Open submit confirmation modal
  const openSubmitBtn = document.getElementById("btn-cbt-open-submit-modal");
  if (openSubmitBtn) {
    openSubmitBtn.addEventListener("click", () => {
      playClickSound();
      cbtExamState.showConfirmSubmitModal = true;
      onUpdate();
    });
  }

  const directFinishBtn = document.getElementById("btn-cbt-finish-direct");
  if (directFinishBtn) {
    directFinishBtn.addEventListener("click", () => {
      playClickSound();
      cbtExamState.showConfirmSubmitModal = true;
      onUpdate();
    });
  }

  // 9. Cancel submit modal
  const cancelSubmitBtn = document.getElementById("btn-cbt-cancel-submit");
  if (cancelSubmitBtn) {
    cancelSubmitBtn.addEventListener("click", () => {
      playClickSound();
      cbtExamState.showConfirmSubmitModal = false;
      onUpdate();
    });
  }

  // 10. Confirm submit
  const confirmSubmitBtn = document.getElementById("btn-cbt-confirm-submit");
  if (confirmSubmitBtn) {
    confirmSubmitBtn.addEventListener("click", () => {
      stopCBTTimer();
      submitCBTExam();
      onUpdate();
    });
  }

  // 11. Return to lobby / exit
  const backLobbyBtns = ["btn-cbt-back-lobby", "btn-cbt-exit-to-lobby"];
  backLobbyBtns.forEach(bId => {
    const btn = document.getElementById(bId);
    if (btn) {
      btn.addEventListener("click", () => {
        playClickSound();
        stopCBTTimer();
        cbtExamState.viewMode = "lobby";
        cbtExamState.examStarted = false;
        cbtExamState.examFinished = false;
        onUpdate();
      });
    }
  });

  // 12. Open Recap
  const openRecapBtns = ["btn-cbt-open-recap"];
  openRecapBtns.forEach(bId => {
    const btn = document.getElementById(bId);
    if (btn) {
      btn.addEventListener("click", () => {
        playClickSound();
        cbtExamState.viewMode = "recap";
        onUpdate();
      });
    }
  });

  // 13. Recap period selector
  document.querySelectorAll<HTMLElement>("[data-recap-period]").forEach(btn => {
    btn.addEventListener("click", () => {
      playClickSound();
      const p = btn.getAttribute("data-recap-period") as CBTExamPeriod;
      if (p) {
        cbtExamState.activePeriod = p;
        onUpdate();
      }
    });
  });

  // 14. Print buttons
  const printResultBtn = document.getElementById("btn-cbt-print-result");
  if (printResultBtn) {
    printResultBtn.addEventListener("click", () => window.print());
  }

  const printRecapBtn = document.getElementById("btn-cbt-print-recap");
  if (printRecapBtn) {
    printRecapBtn.addEventListener("click", () => window.print());
  }

  // 15. Toggle Teacher Trial Mode
  const toggleTrialBtn = document.getElementById("btn-toggle-cbt-trial-mode");
  if (toggleTrialBtn) {
    toggleTrialBtn.addEventListener("click", () => {
      cbtExamState.isTeacherTrialMode = !cbtExamState.isTeacherTrialMode;
      playClickSound();
      onUpdate();
    });
  }

  const toggleTrialRecapBtn = document.getElementById("btn-toggle-cbt-trial-mode-recap");
  if (toggleTrialRecapBtn) {
    toggleTrialRecapBtn.addEventListener("click", () => {
      cbtExamState.isTeacherTrialMode = !cbtExamState.isTeacherTrialMode;
      playClickSound();
      onUpdate();
    });
  }

  // 16. Reset Individual Student CBT Score
  document.querySelectorAll<HTMLElement>(".btn-reset-student-cbt-score").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const target = (e.currentTarget as HTMLElement) || btn;
      const nisn = target.getAttribute("data-nisn");
      const period = target.getAttribute("data-period") as CBTExamPeriod;
      if (nisn && period) {
        resetStudentCBTExamScore(nisn, period);
        playClickSound();
        onUpdate();
      }
    });
  });

  // 17. Reset All Students CBT Scores for current period
  const resetAllRecapBtn = document.getElementById("btn-reset-all-cbt-recap");
  if (resetAllRecapBtn) {
    resetAllRecapBtn.addEventListener("click", () => {
      resetAllCBTExamScores(cbtExamState.activePeriod);
      playClickSound();
      onUpdate();
    });
  }
}
