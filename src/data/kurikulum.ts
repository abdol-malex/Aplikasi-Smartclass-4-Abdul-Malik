export interface SubbabItem {
  id: string; // e.g. "PPKN-B1-S1"
  code: string; // e.g. "A"
  title: string;
  isSumatif?: boolean;
}

export interface BabItem {
  id: string; // e.g. "PPKN-B1"
  title: string;
  subbabs: SubbabItem[];
}

export interface MapelKurikulum {
  name: string;
  code: string;
  babs: BabItem[];
  evaluasi: string[]; // ["ATS 1", "ASAS 1"] or ["ATS 2", "ASAS 2"]
  defaultKKM: number;
}

// ==========================================
// SEMESTER 1 - KURIKULUM RESMI KELAS 4
// ==========================================
export const RAW_KURIKULUM_SEM1: Record<string, Record<string, string[]>> = {
  "Matematika": {
    "Bab 1: Bilangan Cacah sampai 10.000": [
      "A. Membaca & Menulis Bilangan Cacah",
      "B. Membandingkan & Mengurutkan Bilangan Cacah",
      "C. Komposisi & Dekomposisi Bilangan Cacah"
    ],
    "Bab 2: Operasi Bilangan Cacah sampai 1.000": [
      "A. Penjumlahan & Pengurangan",
      "B. Perkalian & Pembagian",
      "C. Faktor & Kelipatan"
    ],
    "Bab 3: Pecahan": [
      "A. Membandingkan & Mengurutkan Pecahan",
      "B. Pecahan Senilai",
      "C. Pecahan Desimal & Persen"
    ],
    "Bab 4: Pola Gambar dan Pola Bilangan": [
      "A. Pola Gambar",
      "B. Pola Bilangan"
    ],
    "Evaluasi": [
      "ATS 1",
      "ASAS 1"
    ]
  },
  "Bahasa Indonesia": {
    "Bab 1: Sudah Besar": [
      "A. Memaknai teks narasi & kosakata baru",
      "B. Kalimat transitif & intransitif",
      "C. Kamus KBBI",
      "D. Proyek kamus kartu"
    ],
    "Bab 2: Di Bawah Atap": [
      "A. Menceritakan kembali teks",
      "B. Kata homonim",
      "C. Imbuhan me-",
      "D. Paragraf deskripsi & kalimat majemuk setara"
    ],
    "Bab 3: Lihat Sekitar": [
      "A. Denah & rambu lalu lintas",
      "B. Teks argumentasi",
      "C. Imbuhan ber-",
      "D. Teks deskripsi perjalanan"
    ],
    "Bab 4: Meliuk dan Menerjang": [
      "A. Informasi olahraga/tarian daerah",
      "B. Majas personifikasi",
      "C. Wawancara",
      "D. Teks visual & laporan wawancara"
    ],
    "Evaluasi": [
      "ATS 1",
      "ASAS 1"
    ]
  },
  "Pendidikan Pancasila": {
    "Bab 1: Mengenal Lingkungan Sekitar": [
      "A. Identitas masyarakat sekitar",
      "B. Menghargai perbedaan identitas",
      "C. Perangkat desa & kelurahan",
      "D. Menjelajah lingkungan tempat tinggal"
    ],
    "Bab 2: Aku Anak Disiplin": [
      "A. Aturan di lingkungan sekitar & norma",
      "B. Membuat & melaksanakan aturan",
      "C. Hak dan Kewajiban anak di rumah dan sekolah"
    ],
    "Evaluasi": [
      "ATS 1",
      "ASAS 1"
    ]
  },
  "IPAS": {
    "Bab 1: Tumbuhan, Sumber Kehidupan di Bumi": [
      "A. Bagian tubuh tumbuhan & fungsi",
      "B. Fotosintesis",
      "C. Perkembangbiakan tumbuhan"
    ],
    "Bab 2: Wujud Zat dan Perubahannya": [
      "A. Materi & massa volume",
      "B. Wujud benda padat cair gas",
      "C. Perubahan wujud benda"
    ],
    "Bab 3: Gaya di Sekitar Kita": [
      "A. Pengaruh gaya terhadap benda",
      "B. Gaya otot & pegas",
      "C. Gaya magnet & gravitasi",
      "D. Gaya gesek"
    ],
    "Bab 4: Mengubah Bentuk Energi": [
      "A. Bentuk-bentuk energi",
      "B. Perubahan bentuk energi",
      "C. Energi potensial & kinetik"
    ],
    "Evaluasi": [
      "ATS 1",
      "ASAS 1"
    ]
  },
  "Bahasa Jawa": {
    "Pasinaon 1: Teks Geguritan lan Cerita Wayang": [
      "A. Teks Geguritan",
      "B. Maca Teks Geguritan",
      "C. Nentoake Piwulang Luhur",
      "D. Nentoake Pokok Wos Wacan",
      "E. Undha Usuk Basa Jawa"
    ],
    "Pasinaon 2: Tembang Gambuh": [
      "A. Titikane Tembang Gambuh",
      "B. Negesi Tembung"
    ],
    "Pasinaon 3: Teks Non Sastra (Tradisi)": [
      "A. Teks Non Sastra",
      "B. Nentoake Pokok Wos Wacan"
    ],
    "Evaluasi": [
      "ATS 1",
      "ASAS 1"
    ]
  },
  "Bahasa Inggris": {
    "Chapter 1: What Are You Doing?": [
      "A. Present Continuous tense activities",
      "B. Asking and answering questions"
    ],
    "Chapter 2: There Are 67 Pencils on the Table": [
      "A. Numbers 50-100",
      "B. Counting classroom objects"
    ],
    "Chapter 3: My Living Room is Beside the Kitchen": [
      "A. Parts of the house",
      "B. Prepositions of place"
    ],
    "Evaluasi": [
      "ATS 1",
      "ASAS 1"
    ]
  },
  "PAI": {
    "Bab 1: Mari Mengaji dan Mengkaji Surah al-Hujurat Ayat 10-11 & Hadis Mukmin Bersaudara": [
      "A. Membaca & Mengartikan Surah al-Hujurat Ayat 10-11",
      "B. Pesan Pokok & Menulis Surah al-Hujurat Ayat 10-11",
      "C. Menghafal & Mengkaji Hadis tentang Mukmin Bersaudara"
    ],
    "Bab 2: Teladan Mulia Asmaulhusna": [
      "A. Lima Asmaulhusna & Artinya",
      "B. Berakhlak dengan Lima Asmaulhusna"
    ],
    "Bab 3: Akhlakku terhadap Keluarga": [
      "A. Anggota Keluarga & Hubungan",
      "B. Berbakti & Sopan Santun kepada Keluarga"
    ],
    "Evaluasi": [
      "ATS 1",
      "ASAS 1"
    ]
  },
  "PJOK": {
    "Bab 1: Pola Gerak Dasar Lokomotor, Nonlokomotor, dan Manipulatif": [
      "A. Gerak Lokomotor",
      "B. Gerak Nonlokomotor",
      "C. Gerak Manipulatif"
    ],
    "Bab 2: Permainan Bola Besar & Bola Kecil": [
      "A. Variasi gerak sepak bola & bola voli",
      "B. Variasi gerak kasti & rounders"
    ],
    "Bab 3: Aktivitas Kebugaran Jasmani": [
      "A. Daya tahan & kekuatan otot",
      "B. Kelenturan & keseimbangan tubuh"
    ],
    "Evaluasi": [
      "ATS 1",
      "ASAS 1"
    ]
  },
  "Seni Budaya": {
    "Bab 1: Menggambar Sketsa & Bentuk": [
      "A. Tahapan membuat sketsa",
      "B. Bentuk geometris & organis"
    ],
    "Bab 2: Karakteristik Alat dan Bahan Seni Rupa": [
      "A. Alat dan bahan basah & kering",
      "B. Eksplorasi tekstur karya rupa"
    ],
    "Bab 3: Kriya Anyaman Sederhana": [
      "A. Pola anyaman tunggal",
      "B. Membuat anyaman dari kertas & bahan alam"
    ],
    "Evaluasi": [
      "ATS 1",
      "ASAS 1"
    ]
  }
};

// Aliases for SEMESTER 1 for backward compatibility
RAW_KURIKULUM_SEM1["PPKN"] = RAW_KURIKULUM_SEM1["Pendidikan Pancasila"];
RAW_KURIKULUM_SEM1["IPA"] = RAW_KURIKULUM_SEM1["IPAS"];
RAW_KURIKULUM_SEM1["Pendidikan Agama Islam"] = RAW_KURIKULUM_SEM1["PAI"];
RAW_KURIKULUM_SEM1["Pendidikan Agama"] = RAW_KURIKULUM_SEM1["PAI"];
RAW_KURIKULUM_SEM1["Seni dan Budaya"] = RAW_KURIKULUM_SEM1["Seni Budaya"];
RAW_KURIKULUM_SEM1["Seni Rupa"] = RAW_KURIKULUM_SEM1["Seni Budaya"];

// ==========================================
// SEMESTER 2 - KURIKULUM RESMI KELAS 4
// ==========================================
export const RAW_KURIKULUM_SEM2: Record<string, Record<string, string[]>> = {
  "Matematika": {
    "Bab 5: Pengukuran Luas dan Volume": [
      "A. Pengukuran Luas",
      "B. Pengukuran Volume"
    ],
    "Bab 6: Bangun Datar": [
      "A. Jenis-Jenis Bangun Datar",
      "B. Segi Banyak Beraturan & Tidak Beraturan",
      "C. Komposisi & Dekomposisi Bangun Datar"
    ],
    "Bab 7: Piktogram dan Diagram Batang": [
      "A. Piktogram",
      "B. Diagram Batang"
    ],
    "Evaluasi": [
      "ATS 2",
      "ASAS 2"
    ]
  },
  "Bahasa Indonesia": {
    "Bab 5: Bertukar atau Membayar": [
      "A. ADiKSiMBa & literasi keuangan",
      "B. Penulisan nilai uang Rp",
      "C. Teks prosedur & kata serapan",
      "D. Menyusun teks prosedur"
    ],
    "Bab 6: Satu Titik": [
      "A. Bentang alam khas Indonesia",
      "B. Puisi anak",
      "C. Majas metafora",
      "D. Laporan perjalanan"
    ],
    "Bab 7: Asal-Usul": [
      "A. Cerita rakyat & kebudayaan",
      "B. Rima puisi/lagu daerah",
      "C. Kata serapan",
      "D. Paragraf narasi kronologis"
    ],
    "Bab 8: Sehatlah Ragaku": [
      "A. Kalimat fakta vs opini",
      "B. Ide pokok deduktif & induktif",
      "C. Swasunting ejaan & tanda baca",
      "D. Teks narasi pengalaman"
    ],
    "Evaluasi": [
      "ATS 2",
      "ASAS 2"
    ]
  },
  "Pendidikan Pancasila": {
    "Bab 3: Kerja Sama di Lingkunganku": [
      "A. Esensi gotong royong",
      "B. Manfaat kerja sama",
      "C. Penerapan kerja sama",
      "D. Kearifan lokal/tradisi"
    ],
    "Bab 4: Pancasila dalam Diriku": [
      "A. Sejarah perumusan",
      "B. Makna simbol Garuda Pancasila",
      "C. Penerapan nilai",
      "D. Profil Pelajar Pancasila"
    ],
    "Evaluasi": [
      "ATS 2",
      "ASAS 2"
    ]
  },
  "IPAS": {
    "Bab 5: Cerita Tentang Daerahku": [
      "A. Asal-usul & sejarah lokal",
      "B. Peninggalan sejarah",
      "C. Perubahan mata pencaharian",
      "D. Pahlawan lokal"
    ],
    "Bab 6: Indonesiaku Kaya Budaya": [
      "A. Keragaman budaya",
      "B. Akulturasi",
      "C. Kearifan lokal",
      "D. Pelestarian budaya"
    ],
    "Bab 7: Bagaimana Mendapatkan Semua Kebutuhan Kita?": [
      "A. Kebutuhan vs Keinginan",
      "B. Sejarah uang & barter",
      "C. Produksi-Distribusi-Konsumsi",
      "D. Fungsi pasar"
    ],
    "Bab 8: Membangun Masyarakat yang Beradab": [
      "A. Peranan norma",
      "B. Sanksi aturan",
      "C. Ciri masyarakat beradab",
      "D. Sikap disiplin"
    ],
    "Evaluasi": [
      "ATS 2",
      "ASAS 2"
    ]
  },
  "Bahasa Jawa": {
    "Pasinaon 4: Cerita Rakyat / Legenda": [
      "A. Titikane legenda",
      "B. Ngringkes & nyritakake",
      "C. Pitutur luhur"
    ],
    "Pasinaon 5: Tembang Maskumambang": [
      "A. Paugeran",
      "B. Nembang & nggancarake"
    ],
    "Pasinaon 6: Sandhangan Aksara Jawa": [
      "A. Aksara Legena",
      "B. Sandhangan Swara",
      "C. Nulis/maca ukara prasaja"
    ],
    "Evaluasi": [
      "ATS 2",
      "ASAS 2"
    ]
  },
  "Bahasa Inggris": {
    "Chapter 4: My School Activities": [
      "A. School Rooms",
      "B. Activities and Subjects"
    ],
    "Chapter 5: My PE Class": [
      "A. Sports",
      "B. Movement Commands"
    ],
    "Chapter 6: My School Days": [
      "A. Days of the Week",
      "B. Weekly Schedule"
    ],
    "Evaluasi": [
      "ATS 2",
      "ASAS 2"
    ]
  },
  "PAI": {
    "Bab 4: Menyambut Usia Balig": [
      "A. Tanda-tanda balig menurut Ilmu Fikih",
      "B. Tanda-tanda balig dalam Ilmu Biologi",
      "C. Tanggung jawab setelah usia balig (mukalaf)"
    ],
    "Bab 5: Kisah Kerasulan Muhammad SAW di Makkah": [
      "A. Pengangkatan Muhammad SAW menjadi Rasul",
      "B. Awal Dakwah Nabi Muhammad SAW di Makkah",
      "C. Meneladani Kisah Dakwah Nabi Muhammad SAW"
    ],
    "Evaluasi": [
      "ATS 2",
      "ASAS 2"
    ]
  },
  "PJOK": {
    "Bab 4: Senam Lantai": [
      "A. Guling depan (Forward Roll)",
      "B. Guling belakang (Backward Roll)",
      "C. Keseimbangan sikap lilin"
    ],
    "Bab 5: Gerak Berirama": [
      "A. Langkah kaki berirama",
      "B. Ayunan lengan berirama"
    ],
    "Bab 6: Aktivitas Air dan Keselamatan Diri": [
      "A. Pengenalan air & mengapung",
      "B. Keselamatan diri dan teman di kolam renang",
      "C. Kebersihan alat reproduksi"
    ],
    "Evaluasi": [
      "ATS 2",
      "ASAS 2"
    ]
  },
  "Seni Budaya": {
    "Bab 4: Mengenal Ragam Hias Nusantara": [
      "A. Motif ragam hias flora, fauna, geometris",
      "B. Menggambar dan mewarnai ragam hias tradisional"
    ],
    "Bab 5: Membuat Wayang Kertas / Boneka": [
      "A. Eksplorasi karakter wayang dan boneka",
      "B. Membuat dan memainkan wayang kertas sederhana"
    ],
    "Bab 6: Pameran Karya Seni Kelas": [
      "A. Apresiasi karya seni teman sekelas",
      "B. Menata dan menyelenggarakan pameran karya seni kelas"
    ],
    "Evaluasi": [
      "ATS 2",
      "ASAS 2"
    ]
  }
};

// Aliases for SEMESTER 2 for backward compatibility
RAW_KURIKULUM_SEM2["PPKN"] = RAW_KURIKULUM_SEM2["Pendidikan Pancasila"];
RAW_KURIKULUM_SEM2["IPA"] = RAW_KURIKULUM_SEM2["IPAS"];
RAW_KURIKULUM_SEM2["Pendidikan Agama Islam"] = RAW_KURIKULUM_SEM2["PAI"];
RAW_KURIKULUM_SEM2["Pendidikan Agama"] = RAW_KURIKULUM_SEM2["PAI"];
RAW_KURIKULUM_SEM2["Seni dan Budaya"] = RAW_KURIKULUM_SEM2["Seni Budaya"];
RAW_KURIKULUM_SEM2["Seni Rupa"] = RAW_KURIKULUM_SEM2["Seni Budaya"];

export const LIST_MAPEL_SEM1: string[] = [
  "Matematika",
  "Bahasa Indonesia",
  "Pendidikan Pancasila",
  "IPAS",
  "Bahasa Jawa",
  "Bahasa Inggris",
  "PAI",
  "PJOK",
  "Seni Budaya"
];

export const LIST_MAPEL_SEM2: string[] = [
  "Matematika",
  "Bahasa Indonesia",
  "Pendidikan Pancasila",
  "IPAS",
  "Bahasa Jawa",
  "Bahasa Inggris",
  "PAI",
  "PJOK",
  "Seni Budaya"
];

// Helper to get raw mapel for semester
export function getRawKurikulum(semester: 1 | 2 = 1): Record<string, Record<string, string[]>> {
  return semester === 2 ? RAW_KURIKULUM_SEM2 : RAW_KURIKULUM_SEM1;
}

// Helper to get structured Mapel info for Semester 1 or Semester 2
export function getStructuredMapels(semester: 1 | 2 = 1): MapelKurikulum[] {
  const rawData = semester === 2 ? RAW_KURIKULUM_SEM2 : RAW_KURIKULUM_SEM1;
  const listMapel = semester === 2 ? LIST_MAPEL_SEM2 : LIST_MAPEL_SEM1;

  return listMapel.map((mapelName) => {
    const rawMapel = rawData[mapelName] || {};
    const babs: BabItem[] = [];
    let evaluasi: string[] = semester === 2 ? ["ATS 2", "ASAS 2"] : ["ATS 1", "ASAS 1"];

    Object.entries(rawMapel).forEach(([babTitle, subList], bIdx) => {
      if (babTitle.startsWith("Evaluasi")) {
        evaluasi = subList;
        return;
      }

      // Filter subbabs
      const subbabs: SubbabItem[] = subList
        .filter(subTitle => !subTitle.toLowerCase().includes("asesmen sumatif"))
        .map((subTitle, sIdx) => {
          const matchCode = subTitle.match(/^([A-Z])\.\s*(.+)$/);
          return {
            id: `${mapelName}-Sem${semester}-B${bIdx + 1}-S${sIdx + 1}`,
            code: matchCode ? matchCode[1] : `${sIdx + 1}`,
            title: matchCode ? matchCode[2].trim() : subTitle.trim(),
            isSumatif: false
          };
        });

      babs.push({
        id: `${mapelName}-Sem${semester}-B${bIdx + 1}`,
        title: babTitle.trim(),
        subbabs
      });
    });

    return {
      name: mapelName,
      code: mapelName.toLowerCase().replace(/\s+/g, "_"),
      babs,
      evaluasi,
      defaultKKM: 70
    };
  });
}
