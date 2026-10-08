export interface ScheduleItem {
  id: string;
  start: string; // e.g. "07:00"
  end: string;   // e.g. "07:35"
  mapel: string;
  isRest?: boolean;
}

export type WeekSchedule = Record<string, ScheduleItem[]>;

export const INITIAL_SCHEDULE: WeekSchedule = {
  Senin: [
    { id: "s1", start: "07:00", end: "07:35", mapel: "Upacara Bendera" },
    { id: "s2", start: "07:35", end: "09:20", mapel: "Pendidikan Pancasila" },
    { id: "s3", start: "09:20", end: "09:35", mapel: "Istirahat", isRest: true },
    { id: "s4", start: "09:35", end: "11:20", mapel: "Bahasa Indonesia" },
    { id: "s5", start: "11:20", end: "12:05", mapel: "Istirahat & Sholat", isRest: true },
    { id: "s6", start: "12:05", end: "13:15", mapel: "Bahasa Inggris" },
  ],
  Selasa: [
    { id: "sl1", start: "07:00", end: "07:35", mapel: "Pagi Ceria & Literasi" },
    { id: "sl2", start: "07:35", end: "09:20", mapel: "Matematika" },
    { id: "sl3", start: "09:20", end: "09:35", mapel: "Istirahat", isRest: true },
    { id: "sl4", start: "09:35", end: "10:45", mapel: "Pendidikan Pancasila" },
    { id: "sl5", start: "10:45", end: "11:20", mapel: "Seni dan Budaya" },
    { id: "sl6", start: "11:20", end: "12:05", mapel: "Istirahat & Sholat", isRest: true },
    { id: "sl7", start: "12:05", end: "13:15", mapel: "Seni dan Budaya" },
  ],
  Rabu: [
    { id: "r1", start: "07:00", end: "07:35", mapel: "Rabu Religi" },
    { id: "r2", start: "07:35", end: "09:20", mapel: "PJOK" },
    { id: "r3", start: "09:20", end: "09:35", mapel: "Istirahat", isRest: true },
    { id: "r4", start: "09:35", end: "11:20", mapel: "IPAS" },
    { id: "r5", start: "11:20", end: "12:05", mapel: "Istirahat & Sholat", isRest: true },
    { id: "r6", start: "12:05", end: "13:15", mapel: "Kokurikuler P5" },
  ],
  Kamis: [
    { id: "k1", start: "07:00", end: "07:35", mapel: "Kamis Berbudaya" },
    { id: "k2", start: "07:35", end: "08:45", mapel: "Matematika" },
    { id: "k3", start: "08:45", end: "09:20", mapel: "IPAS" },
    { id: "k4", start: "09:20", end: "09:35", mapel: "Istirahat", isRest: true },
    { id: "k5", start: "09:35", end: "10:10", mapel: "IPAS" },
    { id: "k6", start: "10:10", end: "11:20", mapel: "Bahasa Jawa" },
    { id: "k7", start: "11:20", end: "12:05", mapel: "Istirahat & Sholat", isRest: true },
    { id: "k8", start: "12:05", end: "13:15", mapel: "Komputer" },
  ],
  Jumat: [
    { id: "j1", start: "07:00", end: "07:35", mapel: "Pagi Ceria" },
    { id: "j2", start: "07:35", end: "09:20", mapel: "Bahasa Indonesia" },
    { id: "j3", start: "09:20", end: "09:35", mapel: "Istirahat", isRest: true },
    { id: "j4", start: "09:35", end: "10:45", mapel: "Pendidikan Agama" },
    { id: "j5", start: "10:45", end: "11:20", mapel: "Pendidikan Agama" },
    { id: "j6", start: "11:20", end: "12:05", mapel: "Istirahat & Sholat Jumat", isRest: true },
    { id: "j7", start: "12:05", end: "13:15", mapel: "Ekstra Pramuka" },
  ],
};

export function getCurrentDayName(date = new Date()): string {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  return days[date.getDay()];
}

export function getCurrentAndNextLesson(schedule: WeekSchedule, date = new Date()) {
  const dayName = getCurrentDayName(date);
  const items = schedule[dayName] || [];
  if (items.length === 0) {
    return {
      current: "Libur Sekolah",
      next: "Belajar Mandiri di Rumah",
      timeNow: `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`,
      dayName,
    };
  }

  const currentMinutes = date.getHours() * 60 + date.getMinutes();

  let currentLesson = "Belum mulai / Waktu istirahat";
  let nextLesson = "Selesai untuk hari ini";

  for (let i = 0; i < items.length; i++) {
    const [startH, startM] = items[i].start.split(":").map(Number);
    const [endH, endM] = items[i].end.split(":").map(Number);
    const startMin = startH * 60 + startM;
    const endMin = endH * 60 + endM;

    if (currentMinutes >= startMin && currentMinutes < endMin) {
      currentLesson = items[i].mapel;
      if (i + 1 < items.length) {
        nextLesson = `${items[i + 1].mapel} (${items[i + 1].start})`;
      } else {
        nextLesson = "Bel pulang sekolah 🎉";
      }
      break;
    } else if (currentMinutes < startMin) {
      currentLesson = "Persiapan Belajar";
      nextLesson = `${items[i].mapel} (${items[i].start})`;
      break;
    }
  }

  return {
    current: currentLesson,
    next: nextLesson,
    timeNow: `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`,
    dayName,
  };
}
