export interface Student {
  no: number;
  nis: string;
  nisn: string;
  nama: string;
  pin: string; // 4 digits, default 4 digits last of NISN
  avatar: string;
  namaPanggilan?: string;
  kontak?: string;
}

export const INITIAL_STUDENTS: Student[] = [
  { no: 1, nis: "1764", nisn: "3174825699", nama: "Anang Janu Kurniawan", pin: "5699", avatar: "👦" },
  { no: 2, nis: "1765", nisn: "3164156323", nama: "Bintang Krisna Mukti", pin: "6323", avatar: "🧒" },
  { no: 3, nis: "1766", nisn: "3160371126", nama: "Candra Dwi Saputra", pin: "1126", avatar: "👦" },
  { no: 4, nis: "1767", nisn: "3163061042", nama: "Cinta Adibah Fatekah Sari", pin: "1042", avatar: "👧" },
  { no: 5, nis: "1768", nisn: "3179753223", nama: "Krisna Oemar Abdi Negara", pin: "3223", avatar: "👦" },
  { no: 6, nis: "1769", nisn: "3161250761", nama: "Raihan Aditya Pratama", pin: "0761", avatar: "🧒" },
  { no: 7, nis: "1780", nisn: "3157482420", nama: "Rafa Achmad Anshori", pin: "2420", avatar: "👦" },
  { no: 8, nis: "1781", nisn: "3157679187", nama: "Rafi Achmad Anshori", pin: "9187", avatar: "👦" },
];
