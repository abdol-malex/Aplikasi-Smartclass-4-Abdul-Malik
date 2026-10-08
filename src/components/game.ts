import {
  getQuestions,
  getGameProgress, saveGameProgress,
  getMaterials,
  getCertificates, saveCertificates
} from "../utils/storage";
import { QuestionItem } from "../data/questions";
import {
  playCorrectSound, playWrongSound, playFanfareSound,
  playRemedialSound, playClickSound
} from "../utils/audio";

export interface GameLevelDef {
  id: string;
  name: string;
  mapel: string;
  location: string;
  icon: string;
  badge: string;
  bgGradient: string;
}

export const GAME_LEVELS: GameLevelDef[] = [
  { id: "lvl-pp", name: "Desa Harmoni", mapel: "Pendidikan Pancasila", location: "Desa Harmoni", icon: "🇮🇩", badge: "Permata Pancasila", bgGradient: "from-red-500 to-rose-600" },
  { id: "lvl-bi", name: "Rumah Ceria", mapel: "Bahasa Indonesia", location: "Rumah Ceria", icon: "📖", badge: "Permata Bahasa", bgGradient: "from-blue-500 to-indigo-600" },
  { id: "lvl-mat", name: "Pasar Angka", mapel: "Matematika", location: "Pasar Angka", icon: "📐", badge: "Permata Berhitung", bgGradient: "from-amber-500 to-orange-600" },
  { id: "lvl-ipas", name: "Hutan Energi", mapel: "IPAS", location: "Hutan Energi", icon: "🌱", badge: "Permata Sains", bgGradient: "from-emerald-500 to-teal-600" },
  { id: "lvl-ing", name: "Kota Bahasa", mapel: "Bahasa Inggris", location: "Kota Bahasa", icon: "🌏", badge: "Permata Global", bgGradient: "from-sky-500 to-cyan-600" },
  { id: "lvl-sb", name: "Galeri Seni", mapel: "Seni dan Budaya", location: "Galeri Seni", icon: "🎨", badge: "Permata Budaya", bgGradient: "from-purple-500 to-fuchsia-600" },
  { id: "lvl-bj", name: "Panggung Budaya", mapel: "Bahasa Jawa", location: "Panggung Budaya", icon: "🌾", badge: "Permata Jawa", bgGradient: "from-yellow-500 to-amber-600" },
  { id: "lvl-pa", name: "Masjid Ilmu", mapel: "Pendidikan Agama", location: "Masjid Ilmu", icon: "🕌", badge: "Permata Taqwa", bgGradient: "from-teal-500 to-green-600" },
  { id: "lvl-pj", name: "Lapangan Sehat", mapel: "PJOK", location: "Lapangan Sehat", icon: "⚽", badge: "Permata Sehat", bgGradient: "from-orange-500 to-red-600" },
  { id: "lvl-kom", name: "Menara Digital", mapel: "Komputer", location: "Menara Digital", icon: "💻", badge: "Permata Teknologi", bgGradient: "from-indigo-500 to-blue-700" },
];

export interface ActiveQuizSession {
  sessionId: string;
  startTime: number;
  studentNisn: string;
  semester: 1 | 2;
  mapel: string;
  isBoss: boolean;
  questions: QuestionItem[];
  currentIndex: number;
  lives: number; // starts at 3
  score: number;
  correctCount: number;
  wrongCount: number;
  selectedAnswers: Record<string, string>;
  missedSubbabs: string[]; // for targeted remedial
  isFinished: boolean;
  isRemedial: boolean;
  cycleResetNotice?: boolean;
}

// Utility: Fisher-Yates shuffle
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Helper to match mapel names across aliases
export function matchMapel(qMapel: string, targetMapel: string): boolean {
  if (!qMapel || !targetMapel) return false;
  if (qMapel === targetMapel) return true;
  const qNorm = qMapel.toLowerCase().trim();
  const tNorm = targetMapel.toLowerCase().trim();
  if (qNorm === tNorm) return true;
  if ((qNorm.includes("pancasila") || qNorm.includes("ppkn") || qNorm === "panc") && (tNorm.includes("pancasila") || tNorm.includes("ppkn") || tNorm === "panc")) return true;
  if ((qNorm.includes("agama") || qNorm.includes("pai")) && (tNorm.includes("agama") || tNorm.includes("pai"))) return true;
  if (qNorm.includes("seni") && tNorm.includes("seni")) return true;
  if ((qNorm.includes("ipas") || qNorm.includes("ipa")) && (tNorm.includes("ipas") || tNorm.includes("ipa"))) return true;
  if (qNorm.includes("matematika") && tNorm.includes("matematika")) return true;
  if (qNorm.includes("indonesia") && tNorm.includes("indonesia")) return true;
  if (qNorm.includes("jawa") && tNorm.includes("jawa")) return true;
  if (qNorm.includes("inggris") && tNorm.includes("inggris")) return true;
  if (qNorm.includes("pjok") && tNorm.includes("pjok")) return true;
  return false;
}

// Generate fallback questions directly from materials data
function generateQuestionsFromMaterials(mapel: string, semester: 1 | 2, targetBabNomor?: number): QuestionItem[] {
  const materials = getMaterials();
  const mapelKey = Object.keys(materials).find(k => matchMapel(k, mapel)) || mapel;
  const mapelData = materials[mapelKey];
  if (!mapelData) return [];

  const babs = mapelData.semesters[semester] || [];
  const targetBabs = targetBabNomor ? babs.filter(b => b.nomor === targetBabNomor) : babs;
  const babsToUse = targetBabs.length > 0 ? targetBabs : babs;

  const generated: QuestionItem[] = [];

  babsToUse.forEach(bab => {
    bab.subbab.forEach((sb, sIdx) => {
      // 1. Use contohSoal if available
      if (sb.contohSoal && sb.contohSoal.length > 0) {
        sb.contohSoal.forEach((cq, cIdx) => {
          const otherAnswers = bab.subbab.flatMap(s => (s.contohSoal || []).map(c => c.jawab)).filter(j => j !== cq.jawab);
          const distractors = [
            ...otherAnswers,
            "Membutuhkan kajian lanjutan",
            "Semua jawaban salah",
            "Hanya berlaku pada kasus tertentu",
            "Materi ini tidak berkaitan dengan kehidupan nyata"
          ].slice(0, 3);

          const options = Array.from(new Set([cq.jawab, ...distractors])).slice(0, 4);

          generated.push({
            id: `gen-${mapel.toLowerCase().replace(/\s+/g, '_')}-s${semester}-b${bab.nomor}-s${sIdx + 1}-q${cIdx + 1}`,
            semester,
            mapel: mapelData.mapel,
            bab: `Bab ${bab.nomor}: ${bab.judul}`,
            subbab: sb.judul,
            tipe: "pilihan_ganda",
            level: "sedang",
            soal: cq.tanya,
            opsi: shuffleArray(options),
            jawaban: cq.jawab,
            penjelasan: cq.penjelasan || `Konsep ini dibahas pada ${bab.judul} (${sb.judul}).`
          });
        });
      }

      // 2. Question from summary
      if (sb.ringkasan && sb.ringkasan.length > 20) {
        const correctSummary = sb.ringkasan.length > 85 ? sb.ringkasan.slice(0, 80) + "..." : sb.ringkasan;
        generated.push({
          id: `gen-sum-${mapel.toLowerCase().replace(/\s+/g, '_')}-s${semester}-b${bab.nomor}-s${sIdx + 1}`,
          semester,
          mapel: mapelData.mapel,
          bab: `Bab ${bab.nomor}: ${bab.judul}`,
          subbab: sb.judul,
          tipe: "pilihan_ganda",
          level: "mudah",
          soal: `Pernyataan yang paling tepat mengenai "${sb.judul}" adalah...`,
          opsi: shuffleArray([
            correctSummary,
            "Materi ini tidak berkaitan dengan kehidupan sehari-hari.",
            "Konsep ini hanya berlaku untuk siswa sekolah menengah.",
            "Hanya dipelajari untuk tugas kelompok semata."
          ]),
          jawaban: correctSummary,
          penjelasan: `Dapat dipelajari kembali pada rangkuman materi ${sb.judul}.`
        });
      }

      // 3. Question from contextual example
      if (sb.contoh && sb.contoh.length > 15) {
        generated.push({
          id: `gen-con-${mapel.toLowerCase().replace(/\s+/g, '_')}-s${semester}-b${bab.nomor}-s${sIdx + 1}`,
          semester,
          mapel: mapelData.mapel,
          bab: `Bab ${bab.nomor}: ${bab.judul}`,
          subbab: sb.judul,
          tipe: "pilihan_ganda",
          level: "sedang",
          soal: `Berikut ini yang merupakan contoh penerapan nyata dari "${sb.judul}" adalah...`,
          opsi: shuffleArray([
            sb.contoh,
            "Mengabaikan tata tertib dan rambu-rambu di sekitar sekolah.",
            "Meninggalkan tugas kelas tanpa menyelesaikannya secara tuntas.",
            "Meniru jawaban teman tanpa berusaha memahami materi."
          ]),
          jawaban: sb.contoh,
          penjelasan: `Penerapan nyata ini dibahas pada materi ${sb.judul}.`
        });
      }
    });

    // 4. If this bab still has fewer than 5 questions, add conceptual template questions
    let seed = 1;
    while (generated.filter(q => q.bab.includes(`Bab ${bab.nomor}:`)).length < 6) {
      const sb = bab.subbab[(seed - 1) % Math.max(1, bab.subbab.length)];
      const sbJudul = sb ? sb.judul : bab.judul;
      generated.push({
        id: `gen-tmpl-${mapel.toLowerCase().replace(/\s+/g, '_')}-s${semester}-b${bab.nomor}-q${seed}`,
        semester,
        mapel: mapelData.mapel,
        bab: `Bab ${bab.nomor}: ${bab.judul}`,
        subbab: sbJudul,
        tipe: "pilihan_ganda",
        level: "mudah",
        soal: `Apa tujuan utama mempelajari "${sbJudul}" pada ${bab.judul}?`,
        opsi: shuffleArray([
          "Memahami konsep dasar dan mampu menerapkannya dalam kehidupan sehari-hari.",
          "Hanya untuk menyelesaikan ulangan tanpa perlu memahami maknanya.",
          "Menghindari kegiatan praktik dan diskusi kelompok di kelas.",
          "Materi ini tidak memiliki manfaat dalam kehidupan nyata."
        ]),
        jawaban: "Memahami konsep dasar dan mampu menerapkannya dalam kehidupan sehari-hari.",
        penjelasan: `Pembelajaran ${bab.judul} melatih pemahaman dan penerapan nyata siswa kelas 4 SD.`
      });
      seed++;
    }
  });

  return generated;
}

// Prepare 5-10 questions respecting the "Soal Tidak Boleh Berulang" rule
export function prepareQuizQuestions(
  studentNisn: string,
  semester: 1 | 2,
  mapel: string,
  isBoss: boolean = false,
  targetBabNomor?: number,
  targetBabJudul?: string
): { questions: QuestionItem[]; cycleReset: boolean } {
  const allBank = getQuestions().filter(q => q.semester === semester);
  let pool = isBoss ? allBank : allBank.filter(q => matchMapel(q.mapel, mapel));

  // If specific bab requested, prioritize questions from that bab
  if (targetBabNomor && !isBoss) {
    const babPool = pool.filter(q => {
      const matchNum = q.bab.match(/(?:Bab|Pasinaon|Chapter)\s*(\d+)/i);
      if (matchNum && parseInt(matchNum[1], 10) === targetBabNomor) return true;
      if (targetBabJudul && q.bab.toLowerCase().includes(targetBabJudul.toLowerCase())) return true;
      return false;
    });

    const generatedForBab = generateQuestionsFromMaterials(mapel, semester, targetBabNomor);
    pool = [...babPool, ...generatedForBab];
  } else if (pool.length < 5 && !isBoss) {
    const fallbackQuestions = generateQuestionsFromMaterials(mapel, semester);
    if (fallbackQuestions.length > 0) {
      pool = [...pool, ...fallbackQuestions];
    }
  }

  // Final fallback: if still empty, take from any available semester 1 bank for this mapel or generate
  if (pool.length === 0 && !isBoss) {
    const sem1Fallback = getQuestions().filter(q => matchMapel(q.mapel, mapel));
    if (sem1Fallback.length > 0) {
      pool = sem1Fallback;
    } else {
      pool = generateQuestionsFromMaterials(mapel, semester, targetBabNomor);
    }
  }

  // Emergency safety guard
  if (pool.length === 0) {
    pool = [
      {
        id: `emergency-${Date.now()}-1`,
        semester,
        mapel,
        bab: `Bab ${targetBabNomor || 1}`,
        subbab: "Latihan Konsep Dasar",
        tipe: "pilihan_ganda",
        level: "mudah",
        soal: `Apa kunci utama keberhasilan belajar ${mapel} di kelas 4 SD?`,
        opsi: shuffleArray([
          "Belajar secara tekun, memahami konsep, dan aktif berlatih.",
          "Menghafal tanpa memahami arti materi.",
          "Hanya belajar saat akan diadakan ujian.",
          "Menyalin tugas milik teman."
        ]),
        jawaban: "Belajar secara tekun, memahami konsep, dan aktif berlatih.",
        penjelasan: `Belajar tekun dan aktif berlatih membentuk pemahaman mendalam.`
      }
    ];
  }

  const progress = getGameProgress(studentNisn, semester);
  const answeredSet = new Set(progress.answeredQuestionIds[mapel] || []);
  const wrongSet = new Set(progress.wrongQuestionIds[mapel] || []);

  // Filter questions not yet answered in current cycle
  let available = pool.filter(q => !answeredSet.has(q.id));
  let cycleReset = false;

  // If all questions exhausted, reset cycle!
  if (available.length === 0) {
    cycleReset = true;
    // Clear answered history for this mapel, but keep wrong questions prioritized
    progress.answeredQuestionIds[mapel] = [];
    saveGameProgress(progress);

    // Prioritize previously wrong questions first
    const previouslyWrong = pool.filter(q => wrongSet.has(q.id));
    const others = pool.filter(q => !wrongSet.has(q.id));
    available = [...shuffleArray(previouslyWrong), ...shuffleArray(others)];
  }

  // Shuffle available pool
  const shuffledPool = shuffleArray(available);
  const sessionCount = Math.min(10, Math.max(5, shuffledPool.length));
  const selected = shuffledPool.slice(0, sessionCount);

  // Also shuffle options for each question so correct answers distribute nicely
  const prepared = selected.map(q => {
    return {
      ...q,
      opsi: shuffleArray(q.opsi),
    };
  });

  return { questions: prepared, cycleReset };
}

export function renderGameLobby(studentNisn: string, semester: 1 | 2 = 1): string {
  const progress = getGameProgress(studentNisn, semester);
  const gemCount = progress.gems.length;
  const isBossUnlocked = gemCount >= 7;

  return `
    <div class="space-y-6">
      <!-- Game Banner & Mascot Intro -->
      <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div class="max-w-2xl space-y-3 z-10 relative">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-bold text-amber-200">
            <span>✨</span> Petualangan Nusantara Ilmu • Semester ${semester}
          </div>
          <h2 class="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Jelajahi Nusantara, Kumpulkan 10 Permata Ilmu!
          </h2>
          <p class="text-xs sm:text-sm text-emerald-50 leading-relaxed">
            Bersama <strong>Nusa dan Tara</strong>, taklukkan tantangan di setiap pos pulau Indonesia. Raih skor minimal 70 untuk membebaskan Permata Ilmu dan buka gerbang rahasia Candi Nusantara!
          </p>

          <div class="flex flex-wrap items-center gap-3 pt-2">
            <div class="px-4 py-2 bg-white/20 backdrop-blur-xs rounded-xl flex items-center gap-2 text-xs font-bold">
              <span>⭐ XP:</span> <span class="font-mono text-amber-300 text-sm">${progress.xp}</span>
            </div>
            <div class="px-4 py-2 bg-white/20 backdrop-blur-xs rounded-xl flex items-center gap-2 text-xs font-bold">
              <span>🪙 Koin:</span> <span class="font-mono text-yellow-300 text-sm">${progress.coins}</span>
            </div>
            <div class="px-4 py-2 bg-white/20 backdrop-blur-xs rounded-xl flex items-center gap-2 text-xs font-bold">
              <span>💎 Permata:</span> <span class="font-mono text-emerald-200 text-sm">${gemCount}/10</span>
            </div>
          </div>
        </div>

        <!-- Decorative Mascot graphic -->
        <div class="hidden md:flex absolute right-6 bottom-4 items-center gap-3 opacity-90">
          <div class="text-7xl">🧒</div>
          <div class="text-7xl">👧</div>
        </div>
      </div>

      <!-- Boss Gate Status Banner -->
      <div class="p-4 rounded-2xl border ${isBossUnlocked ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-slate-100 border-slate-200 text-slate-600'} flex flex-col sm:flex-row justify-between items-center gap-3">
        <div class="flex items-center gap-3">
          <span class="text-3xl">${isBossUnlocked ? '🏛️' : '🔒'}</span>
          <div>
            <h4 class="font-bold text-sm">Final Boss: Candi Nusantara</h4>
            <p class="text-xs ${isBossUnlocked ? 'text-amber-800 font-semibold' : 'text-slate-500'}">
              ${isBossUnlocked ? '🎉 Selamat! 7+ Permata Ilmu terkumpul! Pintu Candi Nusantara sudah TERBUKA!' : `Kumpulkan minimal 7 Permata Ilmu untuk membuka Final Boss (${gemCount}/7 Permata).`}
            </p>
          </div>
        </div>
        ${isBossUnlocked ? `
          <button id="btn-start-boss" class="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-extrabold shadow-md transition transform hover:scale-105">
            ⚔️ Lawan Boss Candi Nusantara!
          </button>
        ` : `
          <span class="px-3 py-1.5 bg-slate-200 text-slate-500 rounded-lg text-xs font-bold">
            Terkunci
          </span>
        `}
      </div>

      <!-- Level Cards Grid -->
      <div>
        <h3 class="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
          <span>🗺️</span> Pilih Level Pos Petualangan:
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${GAME_LEVELS.map((lvl, idx) => {
            const hasGem = progress.gems.includes(lvl.mapel);
            return `
              <div class="bg-white rounded-2xl border ${hasGem ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'} shadow-2xs hover:shadow-md transition overflow-hidden flex flex-col justify-between">
                <div class="p-5 space-y-3">
                  <div class="flex justify-between items-start">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-br ${lvl.bgGradient} text-white flex items-center justify-center text-2xl shadow-sm">
                      ${lvl.icon}
                    </div>
                    ${hasGem ? `
                      <span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold flex items-center gap-1">
                        <span>💎</span> Selesai
                      </span>
                    ` : `
                      <span class="text-xs font-bold text-slate-400 font-mono">Pos ${idx + 1}</span>
                    `}
                  </div>

                  <div>
                    <h4 class="font-bold text-slate-800 text-base">${lvl.location}</h4>
                    <p class="text-xs text-slate-500">${lvl.mapel}</p>
                  </div>

                  <p class="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    Hadiah: <strong>${lvl.badge}</strong> • 3 Nyawa ❤️
                  </p>
                </div>

                <div class="p-4 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center">
                  <span class="text-xs font-semibold text-slate-500">10 Soal Acak</span>
                  <button id="btn-start-level-${encodeURIComponent(lvl.mapel)}" data-mapel="${lvl.mapel}" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition">
                    <span>Mulai</span> <span>🚀</span>
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

export function renderActiveQuiz(session: ActiveQuizSession): string {
  const q = session.questions[session.currentIndex];
  if (!q) {
    return `<div class="p-8 text-center">Soal tidak ditemukan.</div>`;
  }

  const questionNum = session.currentIndex + 1;
  const totalQuestions = session.questions.length;

  return `
    <div class="max-w-2xl mx-auto space-y-6">
      <!-- Quiz Top Bar -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 flex justify-between items-center gap-4">
        <div>
          <span class="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold font-mono">
            Soal ${questionNum} / ${totalQuestions}
          </span>
          <span class="ml-2 text-xs font-semibold text-slate-500">${session.mapel}</span>
        </div>

        <!-- Lives ❤️ Indicator -->
        <div class="flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
          <span class="text-xs font-bold text-rose-700 mr-1">Nyawa:</span>
          ${[1, 2, 3].map(i => `
            <span class="text-lg transition-transform ${i <= session.lives ? 'opacity-100 scale-100' : 'opacity-20 scale-75'}">
              ❤️
            </span>
          `).join("")}
        </div>
      </div>

      <!-- Notice if cycle was reset -->
      ${session.cycleResetNotice ? `
        <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <span>🌟</span>
          <span>Hebat! Kamu sudah menyelesaikan semua soal di bank mapel ini. Sekarang kita ulang dengan variasi baru!</span>
        </div>
      ` : ''}

      <!-- Question Card -->
      <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
        <div>
          <div class="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-2">
            ${q.bab} • ${q.subbab}
          </div>
          <h3 class="text-base sm:text-lg font-bold text-slate-800 leading-snug">
            ${q.soal}
          </h3>
        </div>

        <!-- Options Buttons -->
        <div class="space-y-3" id="quiz-options-container">
          ${q.opsi.map((opt, oIdx) => {
            const letter = String.fromCharCode(65 + oIdx); // A, B, C, D
            return `
              <button id="btn-quiz-opt-${oIdx}" data-option="${encodeURIComponent(opt)}" class="w-full text-left p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 bg-white transition flex items-center gap-3.5 group">
                <span class="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-700 font-bold font-mono text-sm flex items-center justify-center shrink-0 transition">
                  ${letter}
                </span>
                <span class="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-emerald-950">
                  ${opt}
                </span>
              </button>
            `;
          }).join("")}
        </div>
      </div>
    </div>
  `;
}

export function renderRemedialView(session: ActiveQuizSession): string {
  const materials = getMaterials();
  const mapelData = materials[session.mapel];
  // Determine the most missed bab/subbab
  const missedSubbabName = session.missedSubbabs[0] || "";

  // Find subbab data in materials
  let foundSubbab: any = null;
  let foundBabJudul = "";

  if (mapelData) {
    const babs = mapelData.semesters[session.semester] || [];
    for (const b of babs) {
      const match = b.subbab.find(sb => sb.judul === missedSubbabName);
      if (match) {
        foundSubbab = match;
        foundBabJudul = b.judul;
        break;
      }
    }
  }

  return `
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-center space-y-3">
        <div class="text-5xl">💔</div>
        <h2 class="text-xl font-black text-rose-900">Nyawa Kamu Habis, Tetap Semangat!</h2>
        <p class="text-xs text-rose-700 max-w-md mx-auto">
          Tidak apa-apa berbuat salah, karena dari situlah kita belajar! Mari kita baca ringkasan materi di bawah ini sebelum mencoba lagi ya.
        </p>
      </div>

      <!-- Remedial Reading Card -->
      <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-5">
        <div class="border-b border-slate-100 pb-3">
          <span class="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-md text-xs font-bold">
            Pos Remedial Terarah
          </span>
          <h3 class="text-base font-bold text-slate-800 mt-2">
            ${foundBabJudul || session.mapel}: ${foundSubbab?.judul || missedSubbabName || "Penguatan Materi"}
          </h3>
        </div>

        <div class="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs text-slate-700 leading-relaxed space-y-2">
          <div class="font-bold text-emerald-800 flex items-center gap-1.5">
            <span>📖</span> Ringkasan Materi yang Perlu Diperkuat
          </div>
          <p>${foundSubbab?.ringkasan || "Pelajarilah kembali konsep dasar mengenai materi ini. Teliti sebelum memilih jawaban dan jangan terburu-buru."}</p>
        </div>

        ${foundSubbab?.contoh ? `
          <div class="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 text-xs text-slate-700 space-y-1">
            <div class="font-bold text-amber-800 flex items-center gap-1">
              <span>💡</span> Contoh Nyata:
            </div>
            <p class="italic text-slate-600">${foundSubbab.contoh}</p>
          </div>
        ` : ''}

        <!-- 10s Timer & Sudah Baca Check -->
        <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button id="btn-remedial-read-confirm" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition">
            <span>✅</span> <span>Saya Sudah Membaca</span>
          </button>

          <button id="btn-remedial-retry" disabled class="px-6 py-2.5 bg-slate-300 text-slate-500 rounded-xl text-xs font-bold cursor-not-allowed transition flex items-center gap-2">
            <span>Coba Lagi Sesi Baru</span>
            <span id="remedial-timer-label" class="font-mono bg-black/10 px-1.5 py-0.5 rounded text-[10px]">(10s)</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function renderQuizResults(session: ActiveQuizSession): string {
  const percentage = Math.round((session.correctCount / session.questions.length) * 100);
  const isPassed = percentage >= 70;

  return `
    <div class="max-w-xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 text-center space-y-6 relative overflow-hidden">
      <!-- Fireworks Canvas for Victory -->
      ${isPassed ? `<canvas id="canvas-fireworks" class="absolute inset-0 pointer-events-none z-10 w-full h-full"></canvas>` : ''}

      <div class="space-y-3 z-20 relative">
        <div class="text-6xl">${isPassed ? '🏆' : '🌱'}</div>
        <h2 class="text-2xl font-black text-slate-800">
          ${isPassed ? 'Luar Biasa! Level Terselesaikan!' : 'Latihan Selesai, Ayo Tingkatkan Lagi!'}
        </h2>
        <p class="text-xs text-slate-500">
          ${session.mapel} • Semester ${session.semester}
        </p>
      </div>

      <!-- Score Ring Display -->
      <div class="py-4 z-20 relative">
        <div class="inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border-8 ${isPassed ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-amber-400 bg-amber-50 text-amber-700'}">
          <div class="text-3xl font-black font-mono">${percentage}</div>
          <div class="text-[11px] font-bold uppercase tracking-wider">Skor Akhir</div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-3 gap-3 text-xs z-20 relative">
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div class="text-slate-400 text-[10px]">Benar</div>
          <div class="font-bold text-emerald-600 text-base">${session.correctCount}</div>
        </div>
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div class="text-slate-400 text-[10px]">Salah</div>
          <div class="font-bold text-rose-600 text-base">${session.wrongCount}</div>
        </div>
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div class="text-slate-400 text-[10px]">Bonus XP</div>
          <div class="font-bold text-amber-600 text-base">+${session.correctCount * 20}</div>
        </div>
      </div>

      ${isPassed ? `
        <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-center gap-2 z-20 relative">
          <span>💎</span>
          <span>Selamat! Kamu berhasil memenangkan <strong>Permata Ilmu ${session.mapel}</strong>!</span>
        </div>
      ` : ''}

      <!-- Actions -->
      <div class="pt-2 flex flex-col sm:flex-row gap-3 justify-center z-20 relative">
        <button id="btn-back-to-lobby" class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition">
          🗺️ Peta Petualangan
        </button>
        <button id="btn-quiz-retry-same" data-mapel="${session.mapel}" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition">
          🔄 Main Lagi Soal Baru
        </button>
      </div>
    </div>
  `;
}
