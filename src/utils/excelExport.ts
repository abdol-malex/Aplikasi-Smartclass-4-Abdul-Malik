import * as XLSX from "xlsx";
import {
  getStudents,
  getAttendance,
  getAssessmentEntries,
  getReadingLogs,
  getInventaris,
  getScores
} from "./storage";

/**
 * Calculates optimal column widths for SheetJS worksheets based on cell contents.
 */
function autoFitColumns(rows: Record<string, any>[]): { wch: number }[] {
  if (!rows || rows.length === 0) return [];
  const keys = Object.keys(rows[0]);
  return keys.map((key) => {
    let maxLen = key.length;
    rows.forEach((row) => {
      const val = row[key];
      if (val !== undefined && val !== null) {
        const strLen = String(val).length;
        if (strLen > maxLen) maxLen = strLen;
      }
    });
    return { wch: Math.min(Math.max(maxLen + 3, 10), 60) };
  });
}

/**
 * Exports all core Smart Class data into an Excel file (.xlsx) with 4 designated sheets:
 * 1. Presensi & Kehadiran Siswa
 * 2. Rekap Nilai CBT
 * 3. Catatan Pojok Baca Literasi
 * 4. Data Inventaris Barang
 */
export function exportAllDataToExcel(): string {
  const xlsxLib = (typeof window !== "undefined" && (window as any).XLSX) ? (window as any).XLSX : XLSX;

  const students = getStudents();
  const attendanceList = getAttendance();
  const assessmentEntries = getAssessmentEntries();
  const readingLogs = getReadingLogs();
  const inventaris = getInventaris();

  // ----------------------------------------------------
  // SHEET 1: PRESENSI & KEHADIRAN SISWA
  // ----------------------------------------------------
  const totalRecordedDays = attendanceList.length;
  const sheet1Data = students.map((s, idx) => {
    let hCount = 0;
    let sCount = 0;
    let iCount = 0;
    let aCount = 0;

    attendanceList.forEach((att) => {
      const status = att.status[s.nisn];
      if (status === "H") hCount++;
      else if (status === "S") sCount++;
      else if (status === "I") iCount++;
      else if (status === "A") aCount++;
    });

    const activeDays = totalRecordedDays > 0 ? totalRecordedDays : 1;
    const percentage = totalRecordedDays > 0 ? Math.round((hCount / activeDays) * 100) : 100;

    return {
      "No": idx + 1,
      "NIS": s.nis,
      "NISN": s.nisn,
      "Nama Siswa": s.nama,
      "Hadir (H)": hCount,
      "Sakit (S)": sCount,
      "Izin (I)": iCount,
      "Alpa (A)": aCount,
      "Total Hari Rekap": totalRecordedDays,
      "Persentase Kehadiran": `${percentage}%`,
      "Keterangan": percentage >= 90 ? "Sangat Baik" : percentage >= 75 ? "Baik" : "Perlu Bimbingan",
    };
  });

  // ----------------------------------------------------
  // SHEET 2: REKAP NILAI CBT
  // ----------------------------------------------------
  // Include ASTS and ASAS CBT assessments for all students and subjects
  const cbtEntries = assessmentEntries.filter(
    (e) => e.category === "asts" || e.category === "asas" || e.id.startsWith("cbt_") || (Boolean(e.note) && e.note!.includes("CBT"))
  );

  let sheet2Data: Record<string, any>[] = [];
  if (cbtEntries.length > 0) {
    sheet2Data = cbtEntries.map((e, idx) => {
      const isPassed = e.score !== null ? e.score >= 70 : false;
      const periodLabel = e.category === "asts" ? (e.semester === 1 ? "ATS 1" : "ATS 2") : (e.semester === 1 ? "ASAS 1" : "ASAS 2");
      return {
        "No": idx + 1,
        "NISN": e.nisn,
        "Nama Siswa": e.studentName,
        "Mata Pelajaran": e.mapel,
        "Semester": e.semester,
        "Periode CBT": periodLabel,
        "Nilai CBT": e.score !== null ? e.score : "Belum Ujian",
        "KKM": 70,
        "Status Kelulusan": e.score === null ? "Belum Mengikuti" : isPassed ? "Tuntas" : "Remedial",
        "Tanggal Ujian": e.date || "-",
        "Keterangan": e.note || "Ujian Komputer Berbasis Teks",
      };
    });
  } else {
    // Fallback if no entries found: build from student list & subjects
    const mapels = ["Pendidikan Pancasila", "Bahasa Indonesia", "Matematika", "IPAS", "Bahasa Inggris", "Seni dan Budaya", "Bahasa Jawa", "Pendidikan Agama", "PJOK", "Komputer"];
    let counter = 1;
    students.forEach((st) => {
      mapels.forEach((m) => {
        sheet2Data.push({
          "No": counter++,
          "NISN": st.nisn,
          "Nama Siswa": st.nama,
          "Mata Pelajaran": m,
          "Semester": 1,
          "Periode CBT": "ATS 1",
          "Nilai CBT": "Belum Ujian",
          "KKM": 70,
          "Status Kelulusan": "Belum Mengikuti",
          "Tanggal Ujian": "-",
          "Keterangan": "Belum ada rekaman CBT",
        });
      });
    });
  }

  // ----------------------------------------------------
  // SHEET 3: CATATAN POJOK BACA LITERASI
  // ----------------------------------------------------
  const sheet3Data = readingLogs.length > 0
    ? readingLogs.map((l, idx) => ({
        "No": idx + 1,
        "Tanggal": l.date,
        "NISN": l.nisn,
        "Nama Siswa": l.studentName,
        "Judul Buku": l.bookTitle,
        "Halaman Dibaca": l.pages,
        "Kesan / Tokoh Utama": l.note,
        "Status Kualitas": l.status === "needs_revision"
          ? "Perlu Revisi Guru ⚠️"
          : l.status === "flagged"
          ? "Terlalu Singkat ⚠️"
          : "Valid ✅",
        "Catatan Guru": l.teacherNote || "-",
      }))
    : [
        {
          "No": 1,
          "Tanggal": new Date().toISOString().split("T")[0],
          "NISN": students[0]?.nisn || "3174825699",
          "Nama Siswa": students[0]?.nama || "Siswa Kelas 4",
          "Judul Buku": "Si Kancil dan Buaya Cerdik",
          "Halaman Dibaca": 15,
          "Kesan / Tokoh Utama": "Kancil yang cerdik menyeberangi sungai dengan melompati punggung buaya.",
          "Status Kualitas": "Valid ✅",
          "Catatan Guru": "Contoh jurnal literasi",
        }
      ];

  // ----------------------------------------------------
  // SHEET 4: DATA INVENTARIS BARANG
  // ----------------------------------------------------
  const sheet4Data = inventaris.map((item, idx) => ({
    "No": idx + 1,
    "Kode / Kategori": item.kodeKategori,
    "Nama Barang": item.namaBarang,
    "Jumlah": item.jumlah,
    "Satuan": item.satuan || "Unit",
    "Kondisi": item.kondisi,
    "Tanggal Masuk": item.tanggalMasuk,
    "Keterangan": item.keterangan,
  }));

  // Create Workbook
  const wb = xlsxLib.utils.book_new();

  // Create Worksheets and apply column formatting
  const ws1 = xlsxLib.utils.json_to_sheet(sheet1Data);
  ws1["!cols"] = autoFitColumns(sheet1Data);
  xlsxLib.utils.book_append_sheet(wb, ws1, "Presensi & Kehadiran");

  const ws2 = xlsxLib.utils.json_to_sheet(sheet2Data);
  ws2["!cols"] = autoFitColumns(sheet2Data);
  xlsxLib.utils.book_append_sheet(wb, ws2, "Rekap Nilai CBT");

  const ws3 = xlsxLib.utils.json_to_sheet(sheet3Data);
  ws3["!cols"] = autoFitColumns(sheet3Data);
  xlsxLib.utils.book_append_sheet(wb, ws3, "Pojok Baca Literasi");

  const ws4 = xlsxLib.utils.json_to_sheet(sheet4Data);
  ws4["!cols"] = autoFitColumns(sheet4Data);
  xlsxLib.utils.book_append_sheet(wb, ws4, "Inventaris Barang");

  // Output filename
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const filename = `SmartClass_SDN_Banyurip_Rekap_Kelas4_${dateStr}.xlsx`;

  // Write and trigger download
  xlsxLib.writeFile(wb, filename);

  return filename;
}
