import { MapelMateri, Bab, SubBab } from "./materials";
import { RAW_KURIKULUM_SEM1, RAW_KURIKULUM_SEM2 } from "./kurikulum";

// Detailed custom data for curated subbabs with pedagogical richness
interface SubbabContent {
  ringkasan: string;
  contoh: string;
  tanya1: string;
  jawab1: string;
  penjelasan1: string;
  tanya2: string;
  jawab2: string;
  penjelasan2: string;
}

const CONTENT_REGISTRY: Record<string, SubbabContent> = {
  // --- MATEMATIKA SEMESTER 1 ---
  "Matematika-S1-B1-S1": {
    ringkasan: "Bilangan cacah adalah himpunan bilangan bulat tak negatif mulai dari 0, 1, 2, 3 sampai tak terhingga. Di kelas 4, kita belajar membaca dan menulis bilangan cacah hingga 10.000 dengan memahami nilai ribuan, ratusan, puluhan, dan satuan. Menuliskan angka dengan simbol maupun huruf membantu kita bertransaksi dan mencatat data dengan tepat.",
    contoh: "Jumlah buku bacaan di perpustakaan SDN Banyurip berjumlah 2.450 buku (dibaca: dua ribu empat ratus lima puluh).",
    tanya1: "Bagaimana cara menuliskan lambang bilangan 'tujuh ribu delapan ratus lima'?",
    jawab1: "7.805",
    penjelasan1: "Nilai ribuan adalah 7, ratusan adalah 8, puluhan adalah 0, dan satuan adalah 5.",
    tanya2: "Pada bilangan 4.672, berapakah nilai tempat angka 6?",
    jawab2: "Ratusan (bernilai 600).",
    penjelasan2: "Angka 6 berada di posisi ratusan sehingga bernilai 600."
  },
  "Matematika-S1-B1-S2": {
    ringkasan: "Membandingkan dua bilangan cacah dilakukan dengan melihat nilai tempat dari yang tertinggi (ribuan). Tanda pembanding yang digunakan adalah lebih besar (>), lebih kecil (<), atau sama dengan (=). Mengurutkan bilangan dapat dimulai dari yang terkecil ke terbesar (naik) atau terbesar ke terkecil (turun).",
    contoh: "Anang memiliki 1.750 poin dan Bintang memiliki 1.820 poin kuis, maka 1.750 < 1.820.",
    tanya1: "Bandingkan bilangan 5.340 dan 5.304 menggunakan tanda yang tepat!",
    jawab1: "5.340 > 5.304",
    penjelasan1: "Angka ribuan dan ratusan sama, namun pada puluhan angka 4 lebih besar daripada 0.",
    tanya2: "Urutkan bilangan berikut dari yang terkecil: 3.250, 3.150, 3.500!",
    jawab2: "3.150, 3.250, 3.500",
    penjelasan2: "Perbandingan dilihat dari nilai ratusan: 100 < 250 < 500."
  },
  "Matematika-S1-B1-S3": {
    ringkasan: "Komposisi bilangan adalah menyusun bilangan dari nilai-nilai tempatnya, sedangkan dekomposisi adalah menguraikan bilangan menjadi bentuk panjang nilai ribuan, ratusan, puluhan, dan satuan. Pemahaman ini sangat penting sebagai dasar menghitung operasi bersusun.",
    contoh: "Uang kas kelas Rp8.750 didekomposisi menjadi 8.000 + 700 + 50 + 0 rupiah.",
    tanya1: "Uraikan bilangan 6.429 dalam bentuk dekomposisi panjang!",
    jawab1: "6.000 + 400 + 20 + 9",
    penjelasan1: "6 menempati ribuan (6.000), 4 ratusan (400), 2 puluhan (20), dan 9 satuan (9).",
    tanya2: "Berapa bilangan yang terbentuk dari 5 ribuan + 0 ratusan + 8 puluhan + 3 satuan?",
    jawab2: "5.083",
    penjelasan2: "Karena ratusan bernilai 0, posisi ratusan ditulis dengan angka 0."
  },
  "Matematika-S1-B2-S1": {
    ringkasan: "Penjumlahan dan pengurangan bilangan cacah bersusun dilakukan dengan meluruskan nilai tempat satuan, puluhan, dan ratusan. Pada penjumlahan gunakan teknik menyimpan jika hasil penjumlahan melebihi 9, sedangkan pada pengurangan gunakan teknik meminjam jika angka atas lebih kecil dari angka bawah.",
    contoh: "Anang mengumpulkan 425 lembar kertas dan Candra mengumpulkan 380 lembar. Totalnya adalah 425 + 380 = 805 lembar.",
    tanya1: "Berapakah hasil dari 576 + 285?",
    jawab1: "861",
    penjelasan1: "6+5=11 (tulis 1 simpan 1), 7+8+1=16 (tulis 6 simpan 1), 5+2+1=8. Hasil 861.",
    tanya2: "Hitunglah 752 - 389!",
    jawab2: "363",
    penjelasan2: "Gunakan teknik meminjam: 12-9=3, 14-8=6, 6-3=3. Hasil 363."
  },
  "Matematika-S1-B2-S2": {
    ringkasan: "Perkalian adalah penjumlahan berulang, sedangkan pembagian adalah pengurangan berulang hingga nol. Di kelas 4 kita menggunakan cara bersusun panjang dan cara porogapit (pembagian bersusun) untuk membagi bilangan ratusan dengan puluhan.",
    contoh: "Pak Guru membagikan 120 buku cerita secara merata kepada 8 siswa, masing-masing mendapat 120 ÷ 8 = 15 buku.",
    tanya1: "Berapakah hasil perkalian 24 × 15?",
    jawab1: "360",
    penjelasan1: "24 × 10 = 240, 24 × 5 = 120, total = 360.",
    tanya2: "Selesaikan pembagian porogapit 144 ÷ 6!",
    jawab2: "24",
    penjelasan2: "14 dibagi 6 dapat 2 sisa 2, turunkan 4 menjadi 24, 24 dibagi 6 dapat 4. Hasil 24."
  },
  "Matematika-S1-B2-S3": {
    ringkasan: "Faktor suatu bilangan adalah bilangan-bilangan yang dapat membagi habis bilangan tersebut tanpa sisa. Kelipatan bilangan adalah hasil kali bilangan tersebut dengan bilangan bulat positif. Konsep ini berguna untuk menentukan KPK dan FPB dalam membagi kelompok belajar.",
    contoh: "Kelipatan 4 adalah 4, 8, 12, 16, 20, 24. Faktor dari 12 adalah 1, 2, 3, 4, 6, 12.",
    tanya1: "Sebutkan semua faktor dari bilangan 18!",
    jawab1: "1, 2, 3, 6, 9, 18",
    penjelasan1: "Semua bilangan tersebut membagi habis 18 tanpa ada sisa.",
    tanya2: "Tentukan 4 kelipatan pertama dari bilangan 7!",
    jawab2: "7, 14, 21, 28",
    penjelasan2: "Dihitung dari 7×1, 7×2, 7×3, 7×4."
  },
  "Matematika-S1-B3-S1": {
    ringkasan: "Pecahan menunjukkan bagian dari suatu keseluruhan, dinyatakan dalam a/b dengan 'a' sebagai pembilang dan 'b' sebagai penyebut. Jika penyebutnya sama, pecahan yang pembilangnya lebih besar memiliki nilai lebih besar. Jika penyebut berbeda, samakan penyebut terlebih dahulu.",
    contoh: "Raihan memakan 2/8 potong kue dan Krisna memakan 3/8 potong kue, maka Krisna memakan lebih banyak bagian.",
    tanya1: "Bandingkan pecahan 3/5 dan 4/5!",
    jawab1: "3/5 < 4/5",
    penjelasan1: "Penyebutnya sama (5), sehingga kita membandingkan pembilang 3 < 4.",
    tanya2: "Urutkan dari terkecil: 5/7, 2/7, 4/7!",
    jawab2: "2/7, 4/7, 5/7",
    penjelasan2: "Urutan pembilang dari terkecil adalah 2, 4, 5."
  },
  "Matematika-S1-B3-S2": {
    ringkasan: "Pecahan senilai adalah pecahan yang memiliki nilai sama meskipun ditulis dengan pembilang dan penyebut berbeda. Pecahan senilai dapat diperoleh dengan mengalikan atau membagi pembilang dan penyebut dengan bilangan yang sama (bukan nol).",
    contoh: "Pecahan 1/2 potong martabak sama luasnya dengan 2/4 atau 4/8 potong martabak.",
    tanya1: "Tentukan pecahan yang senilai dengan 2/3 jika pembilangnya dikalikan 4!",
    jawab1: "8/12",
    penjelasan1: "Pembilang 2×4=8, penyebut 3×4=12, sehingga 2/3 senilai dengan 8/12.",
    tanya2: "Sederhanakan pecahan 10/15 menjadi pecahan senilai paling sederhana!",
    jawab2: "2/3",
    penjelasan2: "Bagi pembilang dan penyebut dengan FPB-nya yaitu 5: 10÷5=2 dan 15÷5=3."
  },
  "Matematika-S1-B3-S3": {
    ringkasan: "Pecahan desimal adalah pecahan dengan penyebut 10, 100, 1.000 yang ditulis menggunakan tanda koma. Persen berarti per seratus yang dilambangkan dengan simbol %. Mengubah pecahan biasa ke desimal dan persen mempermudah penghitungan nilai dan diskon.",
    contoh: "Diskon pensil 50% sama dengan pecahan 1/2 atau desimal 0,5.",
    tanya1: "Ubahlah pecahan 3/4 ke dalam bentuk desimal!",
    jawab1: "0,75",
    penjelasan1: "3/4 = (3×25)/(4×25) = 75/100 = 0,75.",
    tanya2: "Berapa bentuk persen dari pecahan 7/10?",
    jawab2: "70%",
    penjelasan2: "7/10 × 100% = 70%."
  },
  "Matematika-S1-B4-S1": {
    ringkasan: "Pola gambar adalah susunan gambar yang berulang secara teratur mengikuti aturan tertentu, seperti penambahan bentuk, perubahan arah, atau rotasi. Menemukan pola gambar melatih kemampuan logika dan penalaran spasial siswa.",
    contoh: "Pola segitiga: 1 segitiga, 3 segitiga, 5 segitiga, maka gambar berikutnya memiliki 7 segitiga (bertambah 2).",
    tanya1: "Pola kotak: 2, 4, 6 kotak. Berapa banyak kotak pada susunan ke-4?",
    jawab1: "8 kotak",
    penjelasan1: "Aturan pola adalah bertambah 2 kotak di setiap langkah berikutnya.",
    tanya2: "Jika pola lingkaran bertambah 3 di setiap langkah (1, 4, 7), tentukan suku berikutnya!",
    jawab2: "10 lingkaran",
    penjelasan2: "7 + 3 = 10 lingkaran."
  },
  "Matematika-S1-B4-S2": {
    ringkasan: "Pola bilangan adalah barisan bilangan yang memiliki pola aturan tetap dari satu bilangan ke bilangan berikutnya. Pola bilangan bisa berupa penjumlahan konstan, pengurangan konstan, atau perkalian. Kita bisa menentukan bilangan berikutnya dengan mencari selisih antar suku.",
    contoh: "Jadwal menabung Anang: hari ke-1 Rp2.000, ke-2 Rp4.000, ke-3 Rp6.000 (aturan +2.000).",
    tanya1: "Tentukan angka selanjutnya pada barisan: 3, 7, 11, 15, ...!",
    jawab1: "19",
    penjelasan1: "Selisih antar suku adalah +4 (15 + 4 = 19).",
    tanya2: "Pada pola bilangan turun 40, 35, 30, ..., berapakah dua angka berikutnya?",
    jawab2: "25 dan 20",
    penjelasan2: "Aturan polanya adalah dikurangi 5 setiap langkah."
  },

  // --- MATEMATIKA SEMESTER 2 ---
  "Matematika-S2-B5-S1": {
    ringkasan: "Pengukuran luas adalah menghitung besarnya daerah yang dibatasi oleh batas bidang datar. Pada kelas 4, pengukuran luas diawali menggunakan satuan tidak baku (bujur sangkar satuan) lalu dilanjutkan satuan baku cm² dan m² dengan rumus panjang kali lebar untuk persegi panjang.",
    contoh: "Meja belajar di kelas 4 SDN Banyurip memiliki panjang 60 cm dan lebar 40 cm, luasnya adalah 2.400 cm².",
    tanya1: "Sebuah persegi memiliki sisi 8 cm. Berapakah luas persegi tersebut?",
    jawab1: "64 cm²",
    penjelasan1: "Luas persegi = sisi × sisi = 8 cm × 8 cm = 64 cm².",
    tanya2: "Berapa luas lapangan berbentuk persegi panjang dengan panjang 12 m dan lebar 6 m?",
    jawab2: "72 m²",
    penjelasan2: "Luas = panjang × lebar = 12 m × 6 m = 72 m²."
  },
  "Matematika-S2-B5-S2": {
    ringkasan: "Pengukuran volume adalah menentukan daya tampung atau ruang yang dapat diisi oleh benda tiga dimensi. Volume diukur dengan kubus satuan atau satuan baku mililiter (mL) dan liter (L). Mengetahui volume membantu kita mengukur isi air minum dan wadah lainnya.",
    contoh: "Botol minum bekal Rafa berkapasitas 500 mL, jika diisi 2 botol maka volumenya 1 Liter.",
    tanya1: "Berapa kubus satuan yang dibutuhkan untuk mengisi kotak berukuran panjang 4 kubus, lebar 3 kubus, dan tinggi 2 kubus?",
    jawab1: "24 kubus satuan",
    penjelasan1: "Volume balok = panjang × lebar × tinggi = 4 × 3 × 2 = 24 kubus satuan.",
    tanya2: "Jika 1 liter sama dengan 1.000 mL, berapa mililiter dalam 2,5 liter air?",
    jawab2: "2.500 mL",
    penjelasan2: "2,5 × 1.000 mL = 2.500 mL."
  },
  "Matematika-S2-B6-S1": {
    ringkasan: "Bangun datar adalah objek dua dimensi yang memiliki panjang dan lebar. Jenis-jenis bangun datar meliputi segitiga (sama sisi, sama kaki, siku-siku, sembarang) dan segi empat (persegi, persegi panjang, jajar genjang, trapesium, layang-layang, belah ketupat). Setiap jenis bangun datar memiliki karakteristik sudut dan sisi yang berbeda.",
    contoh: "Papan tulis kelas berbentuk persegi panjang, sedangkan penggaris segitiga berbentuk segitiga siku-siku.",
    tanya1: "Sebutkan ciri utama segitiga sama sisi!",
    jawab1: "Ketiga sisinya sama panjang dan ketiga sudutnya sama besar yaitu 60°.",
    penjelasan1: "Segitiga sama sisi memiliki simetri lipat dan simetri putar sebanyak 3.",
    tanya2: "Bangun datar segi empat yang memiliki 4 sisi sama panjang dan 4 sudut siku-siku adalah?",
    jawab2: "Persegi (bujur sangkar)",
    penjelasan2: "Persegi memiliki 4 sisi kongruen dan 4 sudut 90°."
  },
  "Matematika-S2-B6-S2": {
    ringkasan: "Segi banyak adalah kurva tertutup sederhana yang dibentuk oleh segmen-segmen garis. Segi banyak beraturan memiliki semua sisi sama panjang dan semua sudut sama besar (seperti pentagon beraturan dan heksagon beraturan), sedangkan segi banyak tidak beraturan sisi dan sudutnya bervariasi.",
    contoh: "Rambu lalu lintas 'STOP' berbentuk segi delapan beraturan (oktagon beraturan).",
    tanya1: "Apa syarat sebuah bangun datar dinamakan segi banyak beraturan?",
    jawab1: "Semua sisinya sama panjang dan semua sudutnya sama besar.",
    penjelasan1: "Contoh segi banyak beraturan adalah segitiga sama sisi dan persegi.",
    tanya2: "Apakah persegi panjang termasuk segi banyak beraturan? Jelaskan!",
    jawab2: "Bukan, persegi panjang adalah segi banyak tidak beraturan.",
    penjelasan2: "Meskipun keempat sudutnya sama besar (90°), sisi-sisinya tidak semuanya sama panjang."
  },
  "Matematika-S2-B6-S3": {
    ringkasan: "Komposisi bangun datar adalah menggabungkan beberapa bangun datar untuk membentuk bangun baru. Dekomposisi adalah memotong atau menguraikan bangun datar yang rumit menjadi bangun-bangun datar yang lebih sederhana untuk mempermudah perhitungan luas.",
    contoh: "Rumah tampak depan dapat didekomposisi menjadi segitiga (atap) dan persegi panjang (dinding).",
    tanya1: "Bangun apa saja yang dapat membentuk layang-layang jika didekomposisi?",
    jawab1: "Dua pasang segitiga siku-siku yang kongruen.",
    penjelasan1: "Garis diagonal layang-layang membaginya menjadi 4 segitiga siku-siku.",
    tanya2: "Jika trapesium dipotong tegak lurus dari sudut atas, bangun apa yang dihasilkan?",
    jawab2: "Satu persegi panjang dan dua segitiga siku-siku.",
    penjelasan2: "Ini adalah cara termudah menghitung luas trapesium dengan menjumlahkan luas bangun penyusunnya."
  },
  "Matematika-S2-B7-S1": {
    ringkasan: "Piktogram adalah diagram yang menampilkan data menggunakan gambar atau simbol representatif. Setiap gambar mewakili sejumlah data tertentu yang dijelaskan pada bagian legenda atau keterangan diagram.",
    contoh: "Satu gambar buku mewakili 5 buku yang dipinjam murid kelas 4 dari pojok baca SDN Banyurip.",
    tanya1: "Jika 1 simbol bintang mewakili 4 poin prestasi, berapa poin yang diwakili oleh 6 simbol bintang?",
    jawab1: "24 poin",
    penjelasan1: "6 × 4 = 24 poin.",
    tanya2: "Jika data siswa yang suka apel ada 20 anak dan 1 gambar mewakili 5 anak, berapa gambar apel yang harus digambar?",
    jawab2: "4 gambar apel",
    penjelasan2: "20 ÷ 5 = 4 gambar."
  },
  "Matematika-S2-B7-S2": {
    ringkasan: "Diagram batang adalah penyajian data menggunakan batang tegak atau mendatar yang panjangnya sesuai dengan nilai data. Sumbu mendatar biasanya berisi kategori data dan sumbu tegak berisi frekuensi atau jumlah data.",
    contoh: "Diagram batang absensi kehadiran kelas 4 selama 5 hari dari Senin sampai Jumat.",
    tanya1: "Apa fungsi sumbu tegak pada diagram batang vertikal?",
    jawab1: "Menunjukkan frekuensi atau jumlah data.",
    penjelasan1: "Tinggi batang menunjukkan nilai besaran dari masing-masing kategori.",
    tanya2: "Jika tinggi batang hari Senin menunjuk angka 8 dan hari Selasa menunjuk angka 6, hari manakah yang memiliki data lebih banyak?",
    jawab2: "Hari Senin",
    penjelasan2: "8 lebih besar daripada 6 dengan selisih 2 data."
  },

  // --- BAHASA INDONESIA SEMESTER 1 ---
  "Bahasa Indonesia-S1-B1-S1": {
    ringkasan: "Teks narasi adalah karangan yang menceritakan urutan peristiwa atau kisah secara runtut. Dalam menyimak narasi 'Sudah Besar', siswa belajar mengenali alur cerita, tokoh, latar, dan menemukan kosakata baru untuk memperluas perbendaharaan kata.",
    contoh: "Kisah Lala yang belajar merawat adik dan membagi barang kesayangan dengan bijaksana.",
    tanya1: "Apa yang dimaksud dengan teks narasi?",
    jawab1: "Teks yang menceritakan suatu peristiwa atau kejadian secara kronologis (berurutan).",
    penjelasan1: "Ciri narasi memiliki tokoh, latar waktu/tempat, dan alur cerita dari awal hingga akhir.",
    tanya2: "Sebutkan unsur-unsur penting dalam cerita narasi!",
    jawab2: "Tema, tokoh, alur, latar tempat/waktu, dan amanat.",
    penjelasan2: "Unsur intrinsik ini membangun keutuhan cerita anak."
  },
  "Bahasa Indonesia-S1-B1-S2": {
    ringkasan: "Kalimat transitif adalah kalimat yang membutuhkan objek agar maknanya utuh dan jelas. Sebaliknya, kalimat intransitif tidak membutuhkan objek langsung untuk melengkapi artinya.",
    contoh: "Transitif: Anang menyiram bunga (S-P-O). Intransitif: Bintang bernyanyi gembira (S-P-K).",
    tanya1: "Manakah kalimat berikut yang merupakan kalimat transitif: 'Cinta membaca buku' atau 'Cinta tersenyum manis'?",
    jawab1: "Cinta membaca buku",
    penjelasan1: "'Buku' adalah objek yang dikenai perbuatan membaca.",
    tanya2: "Ubah kalimat 'Raihan tidur pulas' ke dalam jenis transitif!",
    jawab2: "Raihan membaca buku cerita di kamar.",
    penjelasan2: "Menambahkan objek (buku cerita) mengubah predikat menjadi butuh objek."
  },
  "Bahasa Indonesia-S1-B1-S3": {
    ringkasan: "Kamus Besar Bahasa Indonesia (KBBI) adalah rujukan resmi untuk mencari arti kata, ejaan baku, dan kelas kata. Mencari kata di kamus dilakukan dengan mencari bentuk kata dasarnya sesuai urutan alfabetis dari A sampai Z.",
    contoh: "Untuk mencari arti kata 'menari', kita mencari huruf awal 'T' pada kata dasar 'tari'.",
    tanya1: "Bagaimana cara mencari arti kata 'berlari' di kamus KBBI?",
    jawab1: "Mencari kata dasarnya yaitu 'lari' di bawah huruf L.",
    penjelasan1: "Kamus menyusun kata berdasarkan kata dasar, bukan kata berimbuhan.",
    tanya2: "Apa fungsi kamus bahasa bagi siswa sekolah dasar?",
    jawab2: "Untuk mengetahui arti kata asing/baru dan cara penulisan ejaan yang benar.",
    penjelasan2: "Kamus melatih kecermatan literasi membaca dan menulis kata baku."
  },
  "Bahasa Indonesia-S1-B1-S4": {
    ringkasan: "Proyek kamus kartu adalah kegiatan kreatif membuat kumpulan kartu kosakata baru berukuran kecil yang berisi kata, arti kata, contoh kalimat, dan gambar ilustrasi. Proyek ini melatih kemandirian dan rasa percaya diri siswa dalam berbahasa.",
    contoh: "Kartu kosakata 'Fobia': ketakutan berlebihan terhadap suatu benda atau keadaan.",
    tanya1: "Informasi apa saja yang wajib ditulis pada sebuah kartu kamus kata?",
    jawab1: "Kata baru, kelas kata, arti kata menurut kamus, dan contoh kalimatnya.",
    penjelasan1: "Komponen ini membantu siswa mengingat dan menggunakan kata tersebut dalam percakapan.",
    tanya2: "Apa manfaat menambahkan gambar ilustrasi pada kartu kamus kata?",
    jawab2: "Mempermudah mengingat makna kata secara visual dan menyenangkan.",
    penjelasan2: "Asosiasi visual memperkuat daya ingat anak sekolah dasar."
  },

  // --- BAHASA INDONESIA SEMESTER 2 ---
  "Bahasa Indonesia-S2-B5-S1": {
    ringkasan: "Literasi keuangan mengajarkan anak memahami sejarah uang dari masa barter hingga uang elektronik, serta membedakan kebutuhan pokok dan keinginan. Konsep ADiKSiMBa (Apa, Di mana, Kapan, Siapa, Mengapa, Bagaimana) digunakan untuk menggali informasi penting dari bacaan keuangan.",
    contoh: "Menggunakan uang saku untuk membeli buku tulis (kebutuhan) daripada membeli mainan baru (keinginan).",
    tanya1: "Apa kepanjangan dari singkatan ADiKSiMBa?",
    jawab1: "Apa, Di mana, Kapan, Siapa, Mengapa, Bagaimana.",
    penjelasan1: "Ini adalah padanan bahasa Indonesia untuk unsur 5W+1H dalam menganalisis informasi.",
    tanya2: "Sebutkan perbedaan antara kebutuhan dan keinginan!",
    jawab2: "Kebutuhan harus dipenuhi untuk bertahan hidup, sedangkan keinginan sifatnya tambahan yang bisa ditunda.",
    penjelasan2: "Kebutuhan contohnya makan dan sekolah, keinginan contohnya mainan mahal."
  },
  "Bahasa Indonesia-S2-B5-S2": {
    ringkasan: "Penulisan nilai uang rupiah (Rp) yang baku menurut aturan bahasa Indonesia adalah tanpa spasi antara simbol Rp dan angka, tanpa tanda titik setelah Rp, menggunakan titik pemisah ribuan, dan diakhiri dengan ',00' untuk menunjukkan nilai bulat.",
    contoh: "Penulisan baku: Rp15.000,00 (lima belas ribu rupiah).",
    tanya1: "Bagaimana penulisan baku uang sepuluh ribu rupiah?",
    jawab1: "Rp10.000,00",
    penjelasan1: "Lambang Rp ditulis tanpa spasi dan tanda titik di tengah, ribuan dipisah titik, diakhiri koma nol nol.",
    tanya2: "Manakah yang benar: 'Rp. 5000' atau 'Rp5.000,00'?",
    jawab2: "Rp5.000,00",
    penjelasan2: "Setelah Rp tidak menggunakan titik, angka ribuan diberi titik dan desimal ,00."
  },
  "Bahasa Indonesia-S2-B5-S3": {
    ringkasan: "Teks prosedur adalah teks yang berisi petunjuk, panduan, atau langkah-langkah membuat atau melakukan sesuatu secara urut. Teks prosedur menggunakan kalimat perintah (imperatif), kata kerja aktif, dan konjungsi urutan seperti pertama, lalu, kemudian, dan akhirnya.",
    contoh: "Petunjuk menabung uang di celengan atau membuka rekening simpanan pelajar di bank.",
    tanya1: "Sebutkan struktur umum dalam teks prosedur!",
    jawab1: "Tujuan, alat dan bahan, serta langkah-langkah kerja berurutan.",
    penjelasan1: "Struktur ini memudahkan pembaca mempraktikkan isi petunjuk dengan tepat.",
    tanya2: "Berikan satu contoh kalimat perintah dalam teks prosedur membuat celengan daur ulang!",
    jawab2: "Lubangilah bagian atas kaleng bekas menggunakan gunting dengan hati-hati!",
    penjelasan2: "Kalimat perintah berakhiran -lah/-kan dan menyampaikan instruksi tindakan langsung."
  },
  "Bahasa Indonesia-S2-B5-S4": {
    ringkasan: "Menyusun teks prosedur menuntut ketelitian dalam merangkai langkah kerja secara kronologis tanpa ada langkah yang tertukar. Siswa dilatih menyusun prosedur sederhana dengan bahasa yang jelas, lugas, dan mudah dipahami orang lain.",
    contoh: "Menyusun langkah menyiram tanaman di taman sekolah SDN Banyurip menggunakan air tampungan hujan.",
    tanya1: "Mengapa urutan langkah dalam teks prosedur tidak boleh tertukar?",
    jawab1: "Agar hasil kerja sesuai tujuan dan tidak menimbulkan kegagalan atau bahaya.",
    penjelasan1: "Urutan kerja yang tertukar membuat petunjuk tidak dapat dijalankan dengan baik.",
    tanya2: "Kata penghubung apa saja yang sering digunakan untuk menghubungkan langkah prosedur?",
    jawab2: "Pertama, kedua, lalu, kemudian, setelah itu, terakhir.",
    penjelasan2: "Konjungsi urutan waktu memandu alur proses dari awal hingga selesai."
  },

  // --- PENDIDIKAN PANCASILA SEMESTER 1 ---
  "Pendidikan Pancasila-S1-B1-S1": {
    ringkasan: "Setiap masyarakat di lingkungan tempat tinggal memiliki identitas yang beragam, mencakup suku bangsa, bahasa daerah, agama, dan mata pencaharian. Mengenal identitas tetangga sekitar membangun kerukunan hidup bertetangga.",
    contoh: "Di Desa Banyurip, warga ada yang bekerja sebagai petani, pedagang, dan guru yang saling tolong-menolong.",
    tanya1: "Sebutkan dua contoh identitas sosial yang ada di lingkungan RT/RW tempat tinggalmu!",
    jawab1: "Suku bangsa dan agama/tempat ibadah.",
    penjelasan1: "Perbedaan ini merupakan kekayaan bangsa yang harus dihormati bersama.",
    tanya2: "Bagaimana sikap kita saat tetangga sedang merayakan hari raya keagamaan mereka?",
    jawab2: "Menghormati dengan menjaga ketenangan dan memberikan ucapan selamat.",
    penjelasan2: "Sikap toleransi menjaga kedamaian hidup bermasyarakat."
  },
  "Pendidikan Pancasila-S1-B1-S2": {
    ringkasan: "Perbedaan identitas bukanlah alasan untuk bermusuhan, melainkan anugerah Tuhan yang mempersatukan kita sesuai semboyan Bhinneka Tunggal Ika. Sikap saling menghormati dan toleransi menciptakan rasa aman dan tenteram di masyarakat.",
    contoh: "Siswa kelas 4 SDN Banyurip bermain bersama tanpa membeda-bedakan asal-usul keluarga.",
    tanya1: "Apa arti semboyan Bhinneka Tunggal Ika?",
    jawab1: "Berbeda-beda tetapi tetap satu jua.",
    penjelasan1: "Semboyan ini menjadi tali pengikat persatuan seluruh rakyat Indonesia.",
    tanya2: "Apa yang terjadi jika warga tidak menghargai perbedaan di sekitarnya?",
    jawab2: "Akan timbul perselisihan, pertengkaran, dan perpecahan warga.",
    penjelasan2: "Tanpa toleransi, kerukunan hidup tidak akan terwujud."
  },
  "Pendidikan Pancasila-S1-B1-S3": {
    ringkasan: "Perangkat desa dan kelurahan bertugas melayani kebutuhan administrasi warga dan menjaga ketertiban. Struktur pemerintahan desa dipimpin oleh Kepala Desa yang dibantu oleh Sekretaris Desa, Kepala Seksi, dan Kepala Dusun.",
    contoh: "Warga mengurus surat keterangan domisili dan kartu keluarga di kantor Balai Desa.",
    tanya1: "Siapa pemimpin pemerintahan di tingkat desa?",
    jawab1: "Kepala Desa (Kades).",
    penjelasan1: "Kepala desa dipilih secara langsung oleh masyarakat desa melalui Pilkades.",
    tanya2: "Apa tugas utama dari perangkat desa?",
    jawab2: "Melayani kebutuhan administrasi warga dan memajukan kesejahteraan desa.",
    penjelasan2: "Perangkat desa membantu kepala desa menjalankan pelayanan publik."
  },
  "Pendidikan Pancasila-S1-B1-S4": {
    ringkasan: "Menjelajah lingkungan tempat tinggal membantu siswa memahami batas-batas wilayah RT, RW, desa, serta letak fasilitas umum seperti posyandu, balai desa, sekolah, dan tempat ibadah melalui pembuatan denah sederhana.",
    contoh: "Anang membuat denah jalan dari rumahnya menuju SDN Banyurip.",
    tanya1: "Apa manfaat membuat denah lingkungan tempat tinggal?",
    jawab1: "Mempermudah menemukan lokasi rumah dan fasilitas umum di sekitar kita.",
    penjelasan1: "Denah berfungsi sebagai panduan penunjuk arah mata angin sederhana.",
    tanya2: "Arah mata angin utama yang selalu menunjuk ke atas pada peta adalah?",
    jawab2: "Arah Utara.",
    penjelasan2: "Standar orientasi peta dan denah selalu meletakkan utara di arah atas."
  },

  // --- PENDIDIKAN PANCASILA SEMESTER 2 ---
  "Pendidikan Pancasila-S2-B3-S1": {
    ringkasan: "Gotong royong adalah bekerja bersama-sama secara sukarela untuk kepentingan bersama tanpa mengharapkan imbalan materi. Esensi gotong royong merupakan ciri khas dan kepribadian luhur bangsa Indonesia yang diwariskan turun-temurun.",
    contoh: "Warga desa Banyurip bergotong royong membersihkan selokan desa menjelang musim hujan.",
    tanya1: "Apa nilai utama yang terkandung dalam kegiatan gotong royong?",
    jawab1: "Kebersamaan, kekeluargaan, kerelaan berkorban, dan persatuan.",
    penjelasan1: "Gotong royong mengutamakan kepentingan umum di atas kepentingan pribadi.",
    tanya2: "Mengapa gotong royong membuat pekerjaan berat terasa lebih ringan?",
    jawab2: "Karena dikerjakan bersama-sama oleh banyak orang dengan saling tolong-menolong.",
    penjelasan2: "Beban kerja terbagi sehingga selesai lebih cepat dan mudah."
  },
  "Pendidikan Pancasila-S2-B3-S2": {
    ringkasan: "Manfaat kerja sama sangat besar, antara lain mempererat tali silaturahmi, menumbuhkan rasa persaudaraan, menciptakan lingkungan yang bersih dan nyaman, serta menghemat waktu dan tenaga dalam menyelesaikan masalah.",
    contoh: "Siswa kelas 4 piket bersama sehingga kelas bersih hanya dalam 10 menit.",
    tanya1: "Sebutkan dua manfaat kerja sama dalam regu piket kelas!",
    jawab1: "Kelas menjadi cepat bersih dan terjalin kerukunan antar teman sekelas.",
    penjelasan1: "Piket bersama menumbuhkan rasa tanggung jawab bersama.",
    tanya2: "Apa akibat jika seseorang enggan bekerja sama di lingkungannya?",
    jawab2: "Pekerjaan menjadi terbengkalai dan orang tersebut dijauhi teman.",
    penjelasan2: "Kerja sama adalah kunci keharmonisan kehidupan kelompok."
  },
  "Pendidikan Pancasila-S2-B4-S1": {
    ringkasan: "Pancasila dirumuskan oleh para pendiri bangsa dalam sidang BPUPKI tahun 1945, melibatkan tokoh-tokoh besar seperti Ir. Soekarno, Drs. Moh. Hatta, dan Mr. Mohammad Yamin. Pancasila disahkan sebagai dasar negara pada 18 Agustus 1945 oleh PPKI.",
    contoh: "Memperingati Hari Lahir Pancasila setiap tanggal 1 Juni dengan upacara bendera di sekolah.",
    tanya1: "Siapakah tokoh yang mengusulkan nama Pancasila pada tanggal 1 Juni 1945?",
    jawab1: "Ir. Soekarno.",
    penjelasan1: "Pidato Ir. Soekarno pada 1 Juni 1945 menjadi tonggak lahirnya istilah Pancasila.",
    tanya2: "Kapan Pancasila resmi disahkan sebagai dasar negara Republik Indonesia?",
    jawab2: "18 Agustus 1945.",
    penjelasan2: "Disahkan oleh PPKI bersamaan dengan penetapan UUD 1945."
  },
  "Pendidikan Pancasila-S2-B4-S2": {
    ringkasan: "Garuda Pancasila memiliki perisai dengan 5 simbol sila: Bintang (Sila 1), Rantai Emas (Sila 2), Pohon Beringin (Sila 3), Kepala Banteng (Sila 4), dan Padi & Kapas (Sila 5). Setiap simbol mengandung cita-cita luhur kemerdekaan bangsa.",
    contoh: "Pohon beringin melambangkan tempat berteduh dan persatuan seluruh suku bangsa Indonesia.",
    tanya1: "Sebutkan simbol sila ke-4 Pancasila!",
    jawab1: "Kepala Banteng.",
    penjelasan1: "Banteng hewan sosial yang suka berkumpul, melambangkan musyawarah rakyat.",
    tanya2: "Apa makna simbol padi dan kapas pada sila ke-5?",
    jawab2: "Kebutuhan pokok pangan (padi) dan sandang (kapas) untuk mencapai kemakmuran adil.",
    penjelasan2: "Melambangkan keadilan sosial dan kecukupan hidup bagi seluruh rakyat."
  },

  // --- IPAS SEMESTER 1 ---
  "IPAS-S1-B1-S1": {
    ringkasan: "Tumbuhan memiliki bagian utama: akar (menyerap air & mineral serta menopang tanaman), batang (menyalurkan zat hara), daun (tempat fotosintesis), bunga (alat perkembangbiakan), serta buah dan biji (menyimpan cadangan makanan).",
    contoh: "Pohon mangga di pekarangan SDN Banyurip menyerap air tanah menggunakan akar serabut dan tunggang.",
    tanya1: "Bagian tumbuhan manakah yang berfungsi sebagai tempat memasak makanan sendiri?",
    jawab1: "Daun (karena mengandung klorofil).",
    penjelasan1: "Klorofil pada daun menyerap cahaya matahari untuk fotosintesis.",
    tanya2: "Apa fungsi utama batang pada tumbuhan berkayu?",
    jawab2: "Menopang tanaman dan menyalurkan air dari akar ke seluruh daun.",
    penjelasan2: "Batang memiliki pembuluh xilem dan floem untuk transportasi zat hara."
  },
  "IPAS-S1-B1-S2": {
    ringkasan: "Fotosintesis adalah proses tumbuhan hijau membuat makanannya sendiri dengan bantuan cahaya matahari, air (H2O), dan karbon dioksida (CO2). Proses ini menghasilkan karbohidrat (glukosa) sebagai sumber energi tumbuhan dan melepaskan oksigen (O2) bagi makhluk hidup.",
    contoh: "Udara di sekitar pohon rindang sekolah terasa segar karena fotosintesis melepaskan oksigen.",
    tanya1: "Zat hijau daun yang berperan menangkap cahaya matahari disebut?",
    jawab1: "Klorofil.",
    penjelasan1: "Klorofil menyerap spektrum cahaya matahari untuk memicu reaksi fotosintesis.",
    tanya2: "Gas apa yang dihasilkan oleh proses fotosintesis dan dihirup oleh manusia?",
    jawab2: "Gas Oksigen (O2).",
    penjelasan2: "Fotosintesis menyerap karbon dioksida dan mengeluarkan oksigen ke udara."
  },

  // --- IPAS SEMESTER 2 ---
  "IPAS-S2-B5-S1": {
    ringkasan: "Setiap daerah memiliki cerita sejarah lokal, asal-usul penamaan desa, dan tokoh pendiri yang berjasa. Mengetahui sejarah Banyurip menumbuhkan rasa cinta tanah air dan kebanggaan pada kearifan lokal daerah sendiri.",
    contoh: "Mencari tahu asal nama Desa Banyurip dari cerita sesepuh desa setempat.",
    tanya1: "Mengapa kita perlu mempelajari sejarah asal-usul daerah tempat tinggal kita?",
    jawab1: "Untuk menghargai jasa pendahulu dan menumbuhkan rasa bangga serta cinta kampung halaman.",
    penjelasan1: "Sejarah lokal mengajarkan nilai-nilai perjuangan para pendiri daerah.",
    tanya2: "Bagaimana cara kita mencari informasi sejarah daerah tempo dulu?",
    jawab2: "Wawancara dengan tokoh masyarakat/sesepuh dan mengunjungi museum atau situs sejarah.",
    penjelasan2: "Narasumber lokal menyimpan riwayat cerita tutur daerah."
  },
  "IPAS-S2-B6-S1": {
    ringkasan: "Indonesia adalah negara kepulauan yang sangat kaya akan keragaman suku, bahasa daerah, pakaian adat, rumah adat, tarian tradisional, dan senjata tradisional. Keragaman ini dipersatukan oleh semboyan Bhinneka Tunggal Ika.",
    contoh: "Pameran busana adat kebaya Jawa Timur dan blangkon pada peringatan Hari Kartini di sekolah.",
    tanya1: "Sebutkan nama rumah adat khas dari Jawa Timur dan Jawa Tengah!",
    jawab1: "Rumah Joglo.",
    penjelasan1: "Rumah Joglo memiliki ciri khas atap tajuk bertiang soko guru.",
    tanya2: "Apa yang harus kita lakukan agar keragaman budaya bangsa tidak punah?",
    jawab2: "Mempelajari dan melestarikan tarian, lagu daerah, dan kesenian tradisional.",
    penjelasan2: "Generasi muda berperan aktif menjaga warisan leluhur nusantara."
  },
  "IPAS-S2-B7-S1": {
    ringkasan: "Kebutuhan adalah segala sesuatu yang mutlak dibutuhkan manusia untuk bertahan hidup (sandang, pangan, papan). Keinginan adalah hasrat tambahan untuk meningkatkan kenyamanan. Manusia memenuhi kebutuhannya melalui kegiatan ekonomi produksi, distribusi, dan konsumsi.",
    contoh: "Membeli seragam sekolah baru adalah kebutuhan pokok, membeli sepatu bermerek mahal adalah keinginan.",
    tanya1: "Sebutkan tiga jenis kebutuhan pokok manusia (primer)!",
    jawab1: "Pangan (makanan), sandang (pakaian), dan papan (tempat tinggal).",
    penjelasan1: "Kebutuhan primer wajib dipenuhi sebelum kebutuhan sekunder dan tersier.",
    tanya2: "Sebutkan tiga pelaku kegiatan ekonomi!",
    jawab2: "Produsen (pembuat), distributor (penyalur), dan konsumen (pemakai).",
    penjelasan2: "Rantai kegiatan ekonomi menghubungkan penghasil barang hingga sampai ke tangan pembeli."
  }
};

// Generic fallback content builder for subbabs without handcrafted entry
function buildFallbackContent(mapel: string, sem: number, babJudul: string, subJudul: string): SubbabContent {
  const cleanSub = subJudul.replace(/^[A-Z]\.\s*/, "").trim();
  const cleanBab = babJudul.replace(/^Bab\s*\d+:\s*|^Pasinaon\s*\d+:\s*|^Chapter\s*\d+:\s*/, "").trim();

  return {
    ringkasan: `Materi ${cleanSub} pada ${cleanBab} (${mapel} Semester ${sem}) melatih pemahaman konsep inti dan keterampilan berpikir kritis siswa kelas 4 SD. Topik ini diajarkan secara kontekstual agar mudah dipahami anak dan langsung relevan dengan kehidupan sehari-hari di rumah maupun sekolah SDN Banyurip. Siswa diajak untuk aktif mengamati, mencoba, dan menyimpulkan materi secara bermakna.`,
    contoh: `Penerapan konsep ${cleanSub} terlihat jelas saat siswa kelas 4 SDN Banyurip melaksanakan tugas praktik dan mengamati fenomena sekitar.`,
    tanya1: `Apa konsep utama yang dipelajari pada topik ${cleanSub}?`,
    jawab1: `Memahami pengertian dasar dan langkah praktis penerapan ${cleanSub} dalam kegiatan sehari-hari.`,
    penjelasan1: `Pemahaman konsep dasar mempermudah siswa menghubungkan teori dengan penerapan nyata di lingkungan sekitar.`,
    tanya2: `Bagaimana siswa menerapkan pembelajaran ${cleanSub} secara baik?`,
    jawab2: `Dengan rajin berlatih, berdiskusi dengan teman sekelas, dan mencatat hal-hal penting.`,
    penjelasan2: `Belajar aktif dan kolaboratif membantu penguasaan materi secara mendalam.`
  };
}

// Build complete Bab list from Raw Kurikulum
function buildSemesterBabs(mapelKey: string, sem: 1 | 2): Bab[] {
  const rawData = sem === 2 ? RAW_KURIKULUM_SEM2 : RAW_KURIKULUM_SEM1;
  const rawMapel = rawData[mapelKey] || {};

  const babs: Bab[] = [];
  let babCounter = sem === 2 ? (mapelKey === "Matematika" ? 5 : (mapelKey === "Bahasa Indonesia" ? 5 : (mapelKey === "IPAS" ? 5 : (mapelKey === "Bahasa Jawa" ? 4 : (mapelKey === "Bahasa Inggris" ? 4 : (mapelKey === "PAI" ? 4 : (mapelKey === "PJOK" ? 4 : (mapelKey === "Seni Budaya" ? 4 : 3)))))))) : 1;

  Object.entries(rawMapel).forEach(([babTitle, subList], bIdx) => {
    if (babTitle.startsWith("Evaluasi")) return;

    // Detect existing bab number from title e.g. "Bab 5: ...", "Pasinaon 2: ...", "Chapter 1: ..."
    const numMatch = babTitle.match(/(?:Bab|Pasinaon|Chapter)\s*(\d+)/i);
    const nomor = numMatch ? parseInt(numMatch[1], 10) : (babCounter + bIdx);

    const cleanBabTitle = babTitle.replace(/^(?:Bab|Pasinaon|Chapter)\s*\d+:\s*/i, "").trim();

    const subbabs: SubBab[] = subList
      .filter(s => !s.toLowerCase().includes("asesmen sumatif"))
      .map((subTitle, sIdx) => {
        const cleanSubTitle = subTitle.replace(/^[A-Z]\.\s*/, "").trim();
        const registryKey = `${mapelKey}-S${sem}-B${nomor}-S${sIdx + 1}`;
        const content = CONTENT_REGISTRY[registryKey] || buildFallbackContent(mapelKey, sem, cleanBabTitle, cleanSubTitle);

        return {
          id: `${mapelKey.toLowerCase().replace(/\s+/g, "_")}-s${sem}-b${nomor}-${sIdx + 1}`,
          judul: `${subTitle.trim()}`,
          ringkasan: content.ringkasan,
          contoh: content.contoh,
          contohSoal: [
            {
              tanya: content.tanya1,
              jawab: content.jawab1,
              penjelasan: content.penjelasan1
            },
            {
              tanya: content.tanya2,
              jawab: content.jawab2,
              penjelasan: content.penjelasan2
            }
          ]
        };
      });

    babs.push({
      id: `${mapelKey.toLowerCase().replace(/\s+/g, "_")}-s${sem}-b${nomor}`,
      nomor,
      judul: cleanBabTitle,
      subbab: subbabs
    });
  });

  return babs;
}

export const OFFICIAL_MAPELS_METADATA: Record<string, { icon: string; warna: string; displayName: string }> = {
  "Matematika": { icon: "📐", warna: "blue", displayName: "Matematika" },
  "Bahasa Indonesia": { icon: "📖", warna: "amber", displayName: "Bahasa Indonesia" },
  "Pendidikan Pancasila": { icon: "🇮🇩", warna: "red", displayName: "Pendidikan Pancasila" },
  "IPAS": { icon: "🔬", warna: "emerald", displayName: "IPAS" },
  "Bahasa Jawa": { icon: "🏛️", warna: "teal", displayName: "Bahasa Jawa" },
  "Bahasa Inggris": { icon: "🇬🇧", warna: "indigo", displayName: "Bahasa Inggris" },
  "PAI": { icon: "🕌", warna: "green", displayName: "PAI" },
  "PJOK": { icon: "🏃", warna: "orange", displayName: "PJOK" },
  "Seni Budaya": { icon: "🎨", warna: "purple", displayName: "Seni Budaya" }
};

export function generateAllOfficialMaterials(): Record<string, MapelMateri> {
  const result: Record<string, MapelMateri> = {};

  Object.entries(OFFICIAL_MAPELS_METADATA).forEach(([mapelKey, meta]) => {
    const sem1Babs = buildSemesterBabs(mapelKey, 1);
    const sem2Babs = buildSemesterBabs(mapelKey, 2);

    result[mapelKey] = {
      mapel: meta.displayName,
      icon: meta.icon,
      warna: meta.warna,
      semesters: {
        1: sem1Babs,
        2: sem2Babs
      }
    };
  });

  // Provide aliases for backwards compatibility
  result["PPKN"] = result["Pendidikan Pancasila"];
  result["IPA"] = result["IPAS"];
  result["Pendidikan Agama Islam"] = result["PAI"];
  result["Pendidikan Agama"] = result["PAI"];
  result["Seni dan Budaya"] = result["Seni Budaya"];
  result["Seni Rupa"] = result["Seni Budaya"];

  return result;
}

export const ALL_OFFICIAL_MATERIALS = generateAllOfficialMaterials();
