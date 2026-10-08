import {
  getStudents, getScores, getKKM,
  getQuizAnswerLogs, getQuizSessionLogs,
  getGameProgress, getAttendance
} from "../utils/storage";

export function renderGrafikHasilBelajar(
  selectedSemester: 1 | 2 = 1,
  currentNisn: string | null = null,
  isTeacher: boolean = false,
  selectedMapelFilter: string = "Semua Mapel",
  selectedStudentNisnFilter: string = "ALL" // for teacher mode
): string {
  const students = getStudents();
  const allScores = getScores();
  const kkm = getKKM();
  const answerLogs = getQuizAnswerLogs();
  const sessionLogs = getQuizSessionLogs();
  const attendance = getAttendance();

  const mapels = [
    "Pendidikan Pancasila", "Bahasa Indonesia", "Matematika", "IPAS",
    "Bahasa Inggris", "Seni dan Budaya", "Bahasa Jawa", "Pendidikan Agama",
    "PJOK", "Komputer"
  ];

  // Effective student for student mode
  const activeStudentNisn = isTeacher
    ? (selectedStudentNisnFilter === "ALL" ? null : selectedStudentNisnFilter)
    : currentNisn;

  const currentStudent = students.find(s => s.nisn === activeStudentNisn) || (isTeacher ? null : students[0]);

  // Attendance rate calculation
  const totalDays = attendance.length || 1;
  let presentDays = 0;
  if (currentStudent) {
    attendance.forEach(att => {
      if (att.status[currentStudent.nisn] === "H") presentDays++;
    });
  }
  const attendancePercent = currentStudent ? Math.round((presentDays / totalDays) * 100) : 100;

  // Student game progress
  const gameProg = currentStudent ? getGameProgress(currentStudent.nisn, selectedSemester) : null;

  // Calculate Mapel stats for current student vs class
  const mapelStats = mapels.map(m => {
    // Student score
    const studentScore = currentStudent
      ? allScores.find(sc => sc.nisn === currentStudent.nisn && sc.mapel === m && sc.semester === selectedSemester)
      : null;
    const studentAvg = studentScore
      ? Math.round((studentScore.nh + (studentScore.asts ?? studentScore.nh) + (studentScore.asas ?? studentScore.nh)) / 3)
      : 75;

    // Class average
    const classScoresForMapel = allScores.filter(sc => sc.mapel === m && sc.semester === selectedSemester);
    const classAvg = classScoresForMapel.length > 0
      ? Math.round(classScoresForMapel.reduce((sum, item) => sum + ((item.nh + (item.asts ?? item.nh) + (item.asas ?? item.nh)) / 3), 0) / classScoresForMapel.length)
      : 78;

    // Quiz Accuracy
    const relevantAnswers = answerLogs.filter(a =>
      a.mapel === m && a.semester === selectedSemester &&
      (!currentStudent || a.siswa === currentStudent.nisn)
    );
    const totalAns = relevantAnswers.length;
    const correctAns = relevantAnswers.filter(a => a.benar).length;
    const quizAccuracy = totalAns > 0 ? Math.round((correctAns / totalAns) * 100) : 80;

    // Mastery calculation: 60% Academic Average + 40% Quiz Accuracy
    const masteryPercent = Math.min(100, Math.round(0.6 * studentAvg + 0.4 * quizAccuracy));

    return {
      mapel: m,
      studentAvg,
      classAvg,
      quizAccuracy,
      masteryPercent,
      nh: studentScore?.nh || 75,
      asts: studentScore?.asts !== undefined ? studentScore.asts : null,
      asas: studentScore?.asas !== undefined ? studentScore.asas : null,
    };
  });

  // Filtered Mapel Stats if a specific mapel is chosen
  const displayedMapelStats = selectedMapelFilter === "Semua Mapel"
    ? mapelStats
    : mapelStats.filter(ms => ms.mapel === selectedMapelFilter);

  // Subbab strengths and weaknesses (for student)
  const studentAnswers = answerLogs.filter(a =>
    (!currentStudent || a.siswa === currentStudent.nisn) && a.semester === selectedSemester
  );
  const subbabMap: Record<string, { total: number; correct: number; mapel: string; bab: string; subbab: string }> = {};

  studentAnswers.forEach(a => {
    const key = `${a.mapel} - ${a.bab}: ${a.subbab}`;
    if (!subbabMap[key]) {
      subbabMap[key] = { total: 0, correct: 0, mapel: a.mapel, bab: a.bab, subbab: a.subbab };
    }
    subbabMap[key].total++;
    if (a.benar) subbabMap[key].correct++;
  });

  const subbabList = Object.values(subbabMap).map(item => ({
    ...item,
    accuracy: item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0,
  }));

  const strongSubbabs = subbabList.filter(s => s.accuracy >= 75).slice(0, 4);
  const weakSubbabs = subbabList.filter(s => s.accuracy < 75).slice(0, 4);

  // Quiz score trends
  const relevantSessions = sessionLogs
    .filter(s => (!currentStudent || s.siswa === currentStudent.nisn) && s.semester === selectedSemester)
    .sort((a, b) => a.waktu.localeCompare(b.waktu));

  // Hardest chapters in class (for teacher mode)
  const classAnswers = answerLogs.filter(a => a.semester === selectedSemester);
  const classSubbabMap: Record<string, { total: number; wrong: number; mapel: string; bab: string; subbab: string }> = {};
  classAnswers.forEach(a => {
    const key = `${a.mapel} - ${a.subbab}`;
    if (!classSubbabMap[key]) {
      classSubbabMap[key] = { total: 0, wrong: 0, mapel: a.mapel, bab: a.bab, subbab: a.subbab };
    }
    classSubbabMap[key].total++;
    if (!a.benar) classSubbabMap[key].wrong++;
  });

  const hardestChapters = Object.values(classSubbabMap)
    .map(c => ({
      ...c,
      errorRate: c.total > 0 ? Math.round((c.wrong / c.total) * 100) : 0,
    }))
    .sort((a, b) => b.errorRate - a.errorRate)
    .slice(0, 5);

  // Students needing attention (for teacher mode)
  const studentsNeedingAttention = students.map(s => {
    const sScores = allScores.filter(sc => sc.nisn === s.nisn && sc.semester === selectedSemester);
    const avg = sScores.length > 0
      ? Math.round(sScores.reduce((sum, item) => sum + ((item.nh + (item.asts ?? item.nh) + (item.asas ?? item.nh)) / 3), 0) / sScores.length)
      : 75;
    const prog = getGameProgress(s.nisn, selectedSemester);
    return {
      student: s,
      average: avg,
      remedialCount: prog.remedialCount,
      belowKKM: avg < kkm,
    };
  }).filter(s => s.belowKKM || s.remedialCount >= 2);

  return `
    <div class="space-y-6">
      <!-- Header Controls -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span>📊</span> Grafik Hasil Belajar dan Kuis
            </h2>
            <p class="text-xs text-slate-500">
              Analisis performa asesmen berkala, akurasi latihan kuis, dan penguasaan per mata pelajaran
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <!-- Semester Switcher -->
            <div class="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button id="btn-grafik-sem-1" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${selectedSemester === 1 ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
                Semester 1
              </button>
              <button id="btn-grafik-sem-2" class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${selectedSemester === 2 ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
                Semester 2
              </button>
            </div>

            <!-- Subject Filter Dropdown -->
            <select id="select-grafik-mapel" class="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700">
              <option value="Semua Mapel" ${selectedMapelFilter === "Semua Mapel" ? "selected" : ""}>Semua Mapel</option>
              ${mapels.map(m => `
                <option value="${m}" ${selectedMapelFilter === m ? "selected" : ""}>${m}</option>
              `).join("")}
            </select>

            ${isTeacher ? `
              <!-- Teacher Student Picker -->
              <select id="select-grafik-student" class="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700">
                <option value="ALL" ${selectedStudentNisnFilter === "ALL" ? "selected" : ""}>👥 Seluruh Kelas (Rata-rata)</option>
                ${students.map(s => `
                  <option value="${s.nisn}" ${selectedStudentNisnFilter === s.nisn ? "selected" : ""}>${s.avatar || "👦"} ${s.nama}</option>
                `).join("")}
              </select>

              <button id="btn-print-grafik" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition no-print">
                <span>🖨️</span> Cetak / PDF
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Formula Banner -->
        <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-emerald-900">
          <div class="flex items-center gap-2">
            <span>📐</span>
            <span><strong>Rumus Indeks Penguasaan Materi:</strong> (60% × Rata-rata Nilai Asesmen) + (40% × Akurasi Sesi Kuis)</span>
          </div>
          <span class="text-[11px] bg-emerald-100 px-2 py-0.5 rounded font-mono font-bold text-emerald-800">Batas KKM: ${kkm}</span>
        </div>
      </div>

      <!-- Quick Summary Cards (Student Mode) -->
      ${currentStudent ? `
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
            <div class="text-xs text-slate-500 font-semibold">Total Pengalaman</div>
            <div class="text-2xl font-black text-amber-600 font-mono">⭐ ${gameProg?.xp || 0}</div>
            <div class="text-[10px] text-slate-400">XP Belajar</div>
          </div>
          <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
            <div class="text-xs text-slate-500 font-semibold">Permata Ilmu</div>
            <div class="text-2xl font-black text-emerald-600 font-mono">💎 ${gameProg?.gems.length || 0}/10</div>
            <div class="text-[10px] text-slate-400">Mapel Dituntaskan</div>
          </div>
          <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
            <div class="text-xs text-slate-500 font-semibold">Kehadiran Kelas</div>
            <div class="text-2xl font-black text-sky-700 font-mono">${attendancePercent}%</div>
            <div class="text-[10px] text-slate-400">${presentDays} dari ${totalDays} hari</div>
          </div>
          <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
            <div class="text-xs text-slate-500 font-semibold">Remedial Dilakukan</div>
            <div class="text-2xl font-black text-rose-600 font-mono">${gameProg?.remedialCount || 0}x</div>
            <div class="text-[10px] text-slate-400">Kesempatan Belajar Ulang</div>
          </div>
        </div>
      ` : ''}

      <!-- Charts Grid 1: Bar Chart Comparison & Mastery -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Chart 1: Bar Chart - Nilai Siswa vs Rata-Rata Kelas -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                <span>📊</span> Perbandingan Nilai Siswa vs Rata-rata Kelas
              </h3>
              <p class="text-[11px] text-slate-500">Nilai rata-rata per mata pelajaran (${selectedSemester === 1 ? 'Semester 1' : 'Semester 2'})</p>
            </div>
            <div class="flex items-center gap-3 text-[10px] font-bold">
              <span class="flex items-center gap-1 text-emerald-700"><span class="w-3 h-3 bg-emerald-500 rounded"></span> ${isTeacher && selectedStudentNisnFilter === "ALL" ? "Rata-rata Kelas" : "Nilai Kamu"}</span>
              ${!isTeacher || selectedStudentNisnFilter !== "ALL" ? `<span class="flex items-center gap-1 text-slate-500"><span class="w-3 h-3 bg-slate-300 rounded"></span> Rata-rata Kelas</span>` : ''}
            </div>
          </div>

          <!-- SVG Bar Chart -->
          <div class="w-full overflow-x-auto pt-2">
            <svg class="w-full min-w-[340px] h-64" viewBox="0 0 500 240">
              <!-- Grid lines -->
              <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" stroke-width="1" />
              <line x1="40" y1="70" x2="480" y2="70" stroke="#f1f5f9" stroke-width="1" />
              <line x1="40" y1="120" x2="480" y2="120" stroke="#f1f5f9" stroke-width="1" />
              <line x1="40" y1="170" x2="480" y2="170" stroke="#f1f5f9" stroke-width="1" />
              <line x1="40" y1="200" x2="480" y2="200" stroke="#cbd5e1" stroke-width="1.5" />

              <!-- Y-Axis labels -->
              <text x="32" y="24" font-size="9" fill="#94a3b8" text-anchor="end">100</text>
              <text x="32" y="74" font-size="9" fill="#94a3b8" text-anchor="end">75</text>
              <text x="32" y="124" font-size="9" fill="#94a3b8" text-anchor="end">50</text>
              <text x="32" y="174" font-size="9" fill="#94a3b8" text-anchor="end">25</text>
              <text x="32" y="204" font-size="9" fill="#94a3b8" text-anchor="end">0</text>

              <!-- KKM Line -->
              <line x1="40" y1="${200 - (kkm * 1.8)}" x2="480" y2="${200 - (kkm * 1.8)}" stroke="#f43f5e" stroke-width="1" stroke-dasharray="4" />
              <text x="475" y="${196 - (kkm * 1.8)}" font-size="8" fill="#e11d48" font-weight="bold" text-anchor="end">KKM (${kkm})</text>

              <!-- Bars -->
              ${displayedMapelStats.map((ms, idx) => {
                const groupWidth = 440 / displayedMapelStats.length;
                const xBase = 45 + idx * groupWidth;
                const barWidth = Math.min(16, (groupWidth - 8) / 2);

                const studentBarHeight = (ms.studentAvg / 100) * 180;
                const classBarHeight = (ms.classAvg / 100) * 180;
                const studentY = 200 - studentBarHeight;
                const classY = 200 - classBarHeight;

                const isBelowKKM = ms.studentAvg < kkm;
                const fillColor = isBelowKKM ? "#f43f5e" : (ms.studentAvg >= 85 ? "#10b981" : "#0ea5e9");

                const shortName = ms.mapel.length > 7 ? ms.mapel.substring(0, 6) + ".." : ms.mapel;

                return `
                  <!-- Student Bar -->
                  <rect x="${xBase}" y="${studentY}" width="${barWidth}" height="${studentBarHeight}" rx="3" fill="${fillColor}">
                    <title>${ms.mapel} - Siswa: ${ms.studentAvg}</title>
                  </rect>
                  <text x="${xBase + barWidth / 2}" y="${studentY - 3}" font-size="8" font-weight="bold" fill="${fillColor}" text-anchor="middle">${ms.studentAvg}</text>

                  <!-- Class Bar -->
                  <rect x="${xBase + barWidth + 2}" y="${classY}" width="${barWidth}" height="${classBarHeight}" rx="3" fill="#cbd5e1">
                    <title>${ms.mapel} - Rata-rata Kelas: ${ms.classAvg}</title>
                  </rect>

                  <!-- X-Label -->
                  <text x="${xBase + barWidth}" y="216" font-size="8" font-weight="bold" fill="#64748b" text-anchor="middle">${shortName}</text>
                `;
              }).join("")}
            </svg>
          </div>
        </div>

        <!-- Chart 2: Penguasaan per Mapel (Tingkat Ketuntasan 60% Nilai + 40% Kuis) -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                <span>🎯</span> Indeks Penguasaan per Mapel
              </h3>
              <p class="text-[11px] text-slate-500">Kombinasi 60% Asesmen Sekolah + 40% Akurasi Kuis Nusantara</p>
            </div>
            <span class="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold font-mono">
              Target: ≥ 70%
            </span>
          </div>

          <div class="space-y-3 pt-1">
            ${displayedMapelStats.map(ms => {
              const p = ms.masteryPercent;
              const isGood = p >= 75;
              const isMedium = p >= kkm && p < 75;
              const colorClass = isGood ? "bg-emerald-500" : (isMedium ? "bg-amber-500" : "bg-rose-500");
              const textClass = isGood ? "text-emerald-700" : (isMedium ? "text-amber-700" : "text-rose-700");
              const icon = isGood ? "🌟" : (isMedium ? "👍" : "💪");

              return `
                <div class="space-y-1">
                  <div class="flex justify-between items-center text-xs">
                    <span class="font-semibold text-slate-700 flex items-center gap-1.5">
                      <span>${icon}</span>
                      <span>${ms.mapel}</span>
                    </span>
                    <span class="font-bold font-mono ${textClass}">${p}%</span>
                  </div>
                  <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div class="${colorClass} h-full rounded-full transition-all duration-700" style="width: ${p}%"></div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </div>

      <!-- Charts Grid 2: Line Charts (Tren Nilai & Tren Skor Kuis) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Chart 3: Tren Nilai Harian, ASTS, ASAS -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                <span>📈</span> Tren Nilai Asesmen (NH, ASTS, ASAS)
              </h3>
              <p class="text-[11px] text-slate-500">Perkembangan nilai harian hingga sumatif akhir</p>
            </div>
            <div class="flex items-center gap-2 text-[10px] font-bold">
              <span class="text-sky-600">● NH</span>
              <span class="text-amber-600">● ASTS</span>
              <span class="text-emerald-600">● ASAS</span>
            </div>
          </div>

          <!-- SVG Line Chart for Assessment Trend -->
          <div class="w-full overflow-x-auto pt-2">
            <svg class="w-full min-w-[340px] h-52" viewBox="0 0 500 200">
              <!-- Grid lines -->
              <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" stroke-width="1" />
              <line x1="40" y1="65" x2="480" y2="65" stroke="#f1f5f9" stroke-width="1" />
              <line x1="40" y1="110" x2="480" y2="110" stroke="#f1f5f9" stroke-width="1" />
              <line x1="40" y1="155" x2="480" y2="155" stroke="#f1f5f9" stroke-width="1" />
              <line x1="40" y1="175" x2="480" y2="175" stroke="#cbd5e1" stroke-width="1.5" />

              <text x="32" y="24" font-size="8" fill="#94a3b8" text-anchor="end">100</text>
              <text x="32" y="69" font-size="8" fill="#94a3b8" text-anchor="end">75</text>
              <text x="32" y="114" font-size="8" fill="#94a3b8" text-anchor="end">50</text>
              <text x="32" y="179" font-size="8" fill="#94a3b8" text-anchor="end">0</text>

              <!-- Points and connecting lines -->
              ${(() => {
                const sample = displayedMapelStats[0] || mapelStats[0];
                const astsVal = sample.asts !== null ? sample.asts : sample.nh;
                const asasVal = sample.asas !== null ? sample.asas : sample.nh;
                const pts = [
                  { label: "Nilai Harian (NH)", val: sample.nh, display: String(sample.nh), x: 100 },
                  { label: "Asesmen Tengah (ASTS)", val: astsVal, display: sample.asts !== null ? String(sample.asts) : "-", x: 260 },
                  { label: "Asesmen Akhir (ASAS)", val: asasVal, display: sample.asas !== null ? String(sample.asas) : "-", x: 420 },
                ];

                const y1 = 175 - (pts[0].val / 100) * 155;
                const y2 = 175 - (pts[1].val / 100) * 155;
                const y3 = 175 - (pts[2].val / 100) * 155;

                return `
                  <!-- Path connecting assessment types -->
                  <path d="M ${pts[0].x} ${y1} L ${pts[1].x} ${y2} L ${pts[2].x} ${y3}" fill="none" stroke="#0ea5e9" stroke-width="3" stroke-linecap="round" />

                  <!-- Dots and values -->
                  ${pts.map((pt, i) => {
                    const y = 175 - (pt.val / 100) * 155;
                    const c = i === 0 ? "#0284c7" : (i === 1 ? "#d97706" : "#059669");
                    return `
                      <circle cx="${pt.x}" cy="${y}" r="6" fill="${c}" stroke="#fff" stroke-width="2" />
                      <text x="${pt.x}" y="${y - 10}" font-size="10" font-weight="bold" fill="${c}" text-anchor="middle">${pt.display}</text>
                      <text x="${pt.x}" y="192" font-size="9" font-weight="bold" fill="#64748b" text-anchor="middle">${pt.label}</text>
                    `;
                  }).join("")}
                `;
              })()}
            </svg>
          </div>
          <div class="text-[11px] text-slate-500 text-center italic">
            Menampilkan data untuk: <strong>${displayedMapelStats[0]?.mapel || "Pendidikan Pancasila"}</strong>
          </div>
        </div>

        <!-- Chart 4: Tren Skor Sesi Kuis Petualangan -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                <span>🎮</span> Tren Skor Sesi Kuis Petualangan
              </h3>
              <p class="text-[11px] text-slate-500">Perkembangan skor kuis dari sesi ke sesi</p>
            </div>
            <span class="text-xs font-bold text-emerald-700 font-mono">${relevantSessions.length} Sesi Tercatat</span>
          </div>

          <!-- SVG Line Chart for Quiz Sessions -->
          <div class="w-full overflow-x-auto pt-2">
            ${relevantSessions.length === 0 ? `
              <div class="py-12 text-center text-xs text-slate-400">
                Belum ada data kuis yang tercatat. Yuk mainkan game petualangan! 🚀
              </div>
            ` : `
              <svg class="w-full min-w-[340px] h-52" viewBox="0 0 500 200">
                <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" stroke-width="1" />
                <line x1="40" y1="95" x2="480" y2="95" stroke="#f1f5f9" stroke-width="1" />
                <line x1="40" y1="170" x2="480" y2="170" stroke="#cbd5e1" stroke-width="1.5" />

                <!-- KKM Reference -->
                <line x1="40" y1="${170 - (kkm * 1.5)}" x2="480" y2="${170 - (kkm * 1.5)}" stroke="#f43f5e" stroke-width="1" stroke-dasharray="3" />

                ${(() => {
                  const points = relevantSessions.map((sess, idx) => {
                    const step = 420 / Math.max(1, relevantSessions.length - 1);
                    const x = 50 + idx * step;
                    const y = 170 - (sess.skor / 100) * 150;
                    return { x, y, skor: sess.skor, waktu: sess.waktu, mapel: sess.mapel };
                  });

                  const pathStr = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(" ");

                  return `
                    <path d="${pathStr}" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" />
                    ${points.map((p, i) => `
                      <circle cx="${p.x}" cy="${p.y}" r="5" fill="#10b981" stroke="#fff" stroke-width="2">
                        <title>Sesi ${i + 1} (${p.mapel}): ${p.skor} (${p.waktu})</title>
                      </circle>
                      <text x="${p.x}" y="${p.y - 8}" font-size="9" font-weight="bold" fill="#047857" text-anchor="middle">${p.skor}</text>
                      <text x="${p.x}" y="185" font-size="8" fill="#94a3b8" text-anchor="middle">S${i + 1}</text>
                    `).join("")}
                  `;
                })()}
              </svg>
            `}
          </div>
        </div>
      </div>

      <!-- Strengths and Needs Reinforcement (Student View) -->
      ${!isTeacher || selectedStudentNisnFilter !== "ALL" ? `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Bab yang sudah kuat -->
          <div class="bg-white rounded-2xl shadow-sm border border-emerald-200 p-6 space-y-4">
            <div class="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <span class="text-xl">🌟</span>
              <h3>Bab yang Sudah Sangat Kamu Kuasai</h3>
            </div>
            <p class="text-xs text-slate-500">Materi dengan akurasi kuis tinggi. Pertahankan prestasimu!</p>

            <div class="space-y-2.5">
              ${strongSubbabs.length === 0 ? `
                <div class="text-xs text-slate-400 italic py-4">Belum ada data materi yang selesai kuis.</div>
              ` : strongSubbabs.map(sb => `
                <div class="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex justify-between items-center text-xs">
                  <div>
                    <div class="font-bold text-slate-800">${sb.mapel}: ${sb.subbab}</div>
                    <div class="text-[10px] text-emerald-700 font-semibold">${sb.bab}</div>
                  </div>
                  <span class="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded font-mono font-bold text-xs">
                    ${sb.accuracy}% Benar
                  </span>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Bab yang perlu diperkuat -->
          <div class="bg-white rounded-2xl shadow-sm border border-amber-200 p-6 space-y-4">
            <div class="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <span class="text-xl">💡</span>
              <h3>Bab yang Perlu Diperkuat Kembali</h3>
            </div>
            <p class="text-xs text-slate-500">Jangan khawatir, kamu bisa membaca kembali ringkasan materinya!</p>

            <div class="space-y-2.5">
              ${weakSubbabs.length === 0 ? `
                <div class="text-xs text-emerald-600 font-semibold py-4">Hebat! Semua bab yang dikerjakan sudah melampaui batas KKM! 👏</div>
              ` : weakSubbabs.map(wb => `
                <div class="p-3 bg-amber-50/60 rounded-xl border border-amber-200 flex justify-between items-center text-xs">
                  <div>
                    <div class="font-bold text-slate-800">${wb.mapel}: ${wb.subbab}</div>
                    <div class="text-[10px] text-amber-700 font-semibold">${wb.bab} (${wb.accuracy}% benar)</div>
                  </div>
                  <button id="btn-relearn-${encodeURIComponent(wb.mapel)}" data-mapel="${wb.mapel}" class="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs transition">
                    📖 Belajar Lagi
                  </button>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Teacher-Specific Advanced Analytics -->
      ${isTeacher ? `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <!-- Bab Tersulit di Kelas -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
              <span>⚠️</span> Bab Tersulit di Kelas 4 (Tingkat Kesalahan Tertinggi)
            </h3>
            <p class="text-xs text-slate-500">Materi yang paling sering keliru dijawab oleh siswa di kelas</p>

            <div class="space-y-2">
              ${hardestChapters.length === 0 ? `
                <div class="text-xs text-slate-400 py-4">Belum ada data kuis kelas.</div>
              ` : hardestChapters.map(hc => `
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <div class="font-semibold text-slate-800">${hc.mapel}</div>
                    <div class="text-[10px] text-slate-500">${hc.subbab}</div>
                  </div>
                  <div class="text-right">
                    <span class="font-mono font-bold text-rose-600">${hc.errorRate}% Salah</span>
                    <div class="text-[10px] text-slate-400">${hc.wrong} dari ${hc.total} percobaan</div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Siswa yang Perlu Perhatian Khusus -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
              <span>🤝</span> Siswa yang Perlu Bimbingan Tambahan
            </h3>
            <p class="text-xs text-slate-500">Siswa dengan nilai di bawah KKM (${kkm}) atau frekuensi remedial tinggi</p>

            <div class="space-y-2">
              ${studentsNeedingAttention.length === 0 ? `
                <div class="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold">
                  Semua siswa sudah mencapai batas KKM dan tuntas kuis dengan baik! 🎉
                </div>
              ` : studentsNeedingAttention.map(st => `
                <div class="p-3 bg-rose-50/60 rounded-xl border border-rose-200 flex justify-between items-center text-xs">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">${st.student.avatar || "👦"}</span>
                    <div>
                      <div class="font-bold text-slate-800">${st.student.nama}</div>
                      <div class="text-[10px] text-slate-500">Rata-rata: ${st.average} • Remedial: ${st.remedialCount}x</div>
                    </div>
                  </div>
                  <span class="px-2 py-1 bg-rose-100 text-rose-800 rounded font-semibold text-[11px]">
                    Perlu Pendampingan
                  </span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <!-- Full Detailed Numbers Table for Teacher -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
              <span>📋</span> Tabel Rincian Angka Lengkap (Data Nilai & Kuis Kelas)
            </h3>
            <button id="btn-print-table-grafik" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold no-print">
              🖨️ Cetak Tabel
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th class="py-2.5 px-3">Mata Pelajaran</th>
                  <th class="py-2.5 px-3 text-center">Nilai Harian (NH)</th>
                  <th class="py-2.5 px-3 text-center">Asesmen Tengah (ASTS)</th>
                  <th class="py-2.5 px-3 text-center">Asesmen Akhir (ASAS)</th>
                  <th class="py-2.5 px-3 text-center font-bold text-slate-800">Rata-rata Nilai</th>
                  <th class="py-2.5 px-3 text-center">Akurasi Kuis</th>
                  <th class="py-2.5 px-3 text-center font-black text-emerald-700">Indeks Penguasaan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                ${mapelStats.map(ms => `
                  <tr class="hover:bg-slate-50">
                    <td class="py-2 px-3 font-semibold text-slate-800">${ms.mapel}</td>
                    <td class="py-2 px-3 text-center font-mono">${ms.nh}</td>
                    <td class="py-2 px-3 text-center font-mono">${ms.asts !== null ? ms.asts : "-"}</td>
                    <td class="py-2 px-3 text-center font-mono">${ms.asas !== null ? ms.asas : "-"}</td>
                    <td class="py-2 px-3 text-center font-mono font-bold ${ms.studentAvg < kkm ? 'text-rose-600' : 'text-slate-800'}">${ms.studentAvg}</td>
                    <td class="py-2 px-3 text-center font-mono text-sky-700">${ms.quizAccuracy}%</td>
                    <td class="py-2 px-3 text-center font-mono font-black text-emerald-700">${ms.masteryPercent}%</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}
