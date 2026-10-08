import { MapelMateri } from "./materials";

export const EXTRA_MATERIALS: Record<string, MapelMateri> = {
  "Matematika": {
    mapel: "Matematika",
    icon: "📐",
    warna: "amber",
    semesters: {
      1: [
        {
          id: "mat-s1-b1",
          nomor: 1,
          judul: "Bilangan Cacah Sampai 10.000",
          subbab: [
            {
              id: "mat-s1-b1-1",
              judul: "Nilai Tempat Ribuan, Ratusan, Puluhan, Satuan",
              ringkasan: "Bilangan cacah sampai 10.000 memiliki empat sampai lima nilai tempat. Angka pada posisi paling kiri menentukan nilai ribuan atau puluh ribuan. Misalnya pada bilangan 4.752, angka 4 bernilai 4.000, 7 bernilai 700, 5 bernilai 50, dan 2 bernilai 2. Memahami nilai tempat memudahkan kita menjumlahkan dan mengurangkan angka besar.",
              contoh: "Jumlah tabungan kas kelas 4 minggu ini mencapai Rp 8.450.",
              contohSoal: [
                { tanya: "Berapa nilai tempat angka 6 pada bilangan 6.320?", jawab: "Ribuan (bernilai 6.000).", penjelasan: "Angka 6 berada di posisi ke-4 dari kanan." },
                { tanya: "Tuliskan lambang bilangan dari 'Tujuh ribu lima ratus dua puluh lima'!", jawab: "7.525", penjelasan: "7 ribuan, 5 ratusan, 2 puluhan, 5 satuan." }
              ]
            },
            {
              id: "mat-s1-b1-2",
              judul: "Membandingkan dan Mengurutkan Bilangan",
              ringkasan: "Untuk membandingkan dua bilangan ribuan, kita bandingkan terlebih dahulu angka pada nilai tempat ribuan. Jika angka ribuannya sama, kita bandingkan angka ratusan, lalu puluhan, dan akhirnya satuan. Tanda '>' berarti lebih besar, '<' lebih kecil, dan '=' sama dengan. Mengurutkan bilangan bisa dimulai dari yang terkecil atau terbesar.",
              contoh: "Membandingkan jarak rumah Raihan 3.250 meter dengan rumah Krisna 3.400 meter (3.250 < 3.400).",
              contohSoal: [
                { tanya: "Beri tanda yang tepat: 5.670 ... 5.607", jawab: "> (lebih besar)", penjelasan: "Puluhan 7 pada 5.670 lebih besar dari puluhan 0 pada 5.607." },
                { tanya: "Urutkan dari yang terkecil: 2.100, 1.950, 2.300!", jawab: "1.950, 2.100, 2.300.", penjelasan: "1.950 adalah nilai terkecil karena angka ribuannya 1." }
              ]
            }
          ]
        },
        {
          id: "mat-s1-b2",
          nomor: 2,
          judul: "Operasi Hitung Penjumlahan dan Pengurangan Bersusun",
          subbab: [
            {
              id: "mat-s1-b2-1",
              judul: "Penjumlahan dengan Teknik Menyimpan",
              ringkasan: "Penjumlahan bersusun pendek dilakukan dari nilai tempat satuan paling kanan. Jika hasil penjumlahan satuan menghasilkan puluhan (10 ke atas), kita tulis satuannya dan simpan puluhannya di atas kolom puluhan. Lanjutkan ke kolom puluhan, ratusan, dan ribuan. Ketelitian meletakkan angka sejajar sangat menentukan kebenaran hasil.",
              contoh: "2.458 + 1.365 = 3.823.",
              contohSoal: [
                { tanya: "Hitunglah hasil dari 3.245 + 1.482!", jawab: "4.727", penjelasan: "5+2=7, 4+8=12 (tulis 2 simpan 1), 1+2+4=7, 3+1=4." },
                { tanya: "Di perpustakaan ada 1.250 buku cerita dan 2.180 buku pelajaran. Berapa jumlah semua buku?", jawab: "3.430 buku.", penjelasan: "1.250 + 2.180 = 3.430." }
              ]
            },
            {
              id: "mat-s1-b2-2",
              judul: "Pengurangan dengan Teknik Meminjam",
              ringkasan: "Pengurangan bersusun juga dimulai dari kolom satuan. Bila angka di atas lebih kecil daripada angka di bawah, kita harus meminjam 1 puluhan (bernilai 10) dari kolom sebelah kirinya. Setelah meminjam, angka yang dipinjam berkurang 1. Lakukan langkah ini secara bertahap hingga kolom ribuan.",
              contoh: "Saldo kas 5.000 dikurangi beli spidol 2.350 tersisa 2.650.",
              contohSoal: [
                { tanya: "Berapa hasil dari 4.520 - 1.280?", jawab: "3.240", penjelasan: "0-0=0, 2 pinjam 1 jadi 12-8=4, 5 sisa 4-2=2, 4-1=3." },
                { tanya: "Rafi memiliki 1.500 kelereng, diberikan ke temannya 650 butir. Berapa sisa kelereng Rafi?", jawab: "850 butir.", penjelasan: "1.500 - 650 = 850." }
              ]
            }
          ]
        },
        {
          id: "mat-s1-b3",
          nomor: 3,
          judul: "Kelipatan dan Faktor Bilangan",
          subbab: [
            {
              id: "mat-s1-b3-1",
              judul: "Menentukan Kelipatan Bilangan",
              ringkasan: "Kelipatan suatu bilangan diperoleh dengan mengalikan bilangan tersebut dengan bilangan asli secara berurutan (1, 2, 3, 4, dst). Misalnya kelipatan 4 adalah 4, 8, 12, 16, 20. Kelipatan persekutuan adalah kelipatan yang sama dari dua bilangan atau lebih. Konsep kelipatan sangat berguna saat menyamakan penyebut pecahan.",
              contoh: "Jadwal piket Candra setiap 3 hari sekali (hari ke-3, 6, 9, 12...).",
              contohSoal: [
                { tanya: "Sebutkan 4 kelipatan pertama dari angka 6!", jawab: "6, 12, 18, 24.", penjelasan: "6x1, 6x2, 6x3, 6x4." },
                { tanya: "Kelipatan persekutuan terkecil (KPK) dari 3 dan 4 adalah?", jawab: "12", penjelasan: "Kelipatan 3: 3,6,9,12... Kelipatan 4: 4,8,12... angka sama terkecil adalah 12." }
              ]
            },
            {
              id: "mat-s1-b3-2",
              judul: "Faktor Bilangan dan Faktor Persekutuan",
              ringkasan: "Faktor adalah bilangan-bilangan yang dapat membagi habis suatu bilangan tanpa sisa. Bilangan 12 memiliki faktor 1, 2, 3, 4, 6, dan 12 karena semua membagi habis 12. Faktor persekutuan terbesar (FPB) adalah faktor terbesar yang sama dari dua bilangan. FPB berguna saat kita membagi permen atau hadiah secara adil.",
              contoh: "Membagi 12 apel dan 18 jeruk ke dalam kantong dalam jumlah yang sama rata.",
              contohSoal: [
                { tanya: "Sebutkan semua faktor dari bilangan 10!", jawab: "1, 2, 5, 10.", penjelasan: "1x10=10 dan 2x5=10." },
                { tanya: "Berapa FPB dari 8 dan 12?", jawab: "4", penjelasan: "Faktor 8: 1,2,4,8. Faktor 12: 1,2,3,4,6,12. Faktor sekutu terbesar adalah 4." }
              ]
            }
          ]
        }
      ],
      2: [
        {
          id: "mat-s2-b1",
          nomor: 1,
          judul: "Pecahan Senilai dan Operasi Pecahan Sederhana",
          subbab: [
            {
              id: "mat-s2-b1-1",
              judul: "Mengenal Pecahan Senilai",
              ringkasan: "Pecahan terdiri dari pembilang (di atas) dan penyebut (di bawah). Pecahan senilai adalah pecahan yang memiliki nilai sama meski lambang bilangannya berbeda. Pecahan senilai dapat diperoleh dengan mengalikan atau membagi pembilang dan penyebut dengan angka yang sama. Gambar lingkaran atau persegi yang dipotong dapat membuktikan kesetaraannya.",
              contoh: "1/2 loyang martabak sama besarnya dengan 2/4 loyang martabak.",
              contohSoal: [
                { tanya: "Tentukan pecahan yang senilai dengan 2/3 bila dikalikan 2!", jawab: "4/6", penjelasan: "(2x2)/(3x2) = 4/6." },
                { tanya: "Sederhanakan pecahan 6/10 menjadi pecahan paling sederhana!", jawab: "3/5", penjelasan: "Bagi pembilang dan penyebut dengan 2: (6:2)/(10:2) = 3/5." }
              ]
            },
            {
              id: "mat-s2-b1-2",
              judul: "Penjumlahan Pecahan Berpenyebut Sama",
              ringkasan: "Jika dua pecahan memiliki penyebut yang sama, kita hanya perlu menjumlahkan pembilangnya saja. Penyebutnya tetap dan tidak boleh dijumlahkan. Setelah itu periksalah apakah hasilnya bisa disederhanakan. Cara ini sangat mudah dipahami dengan membayangkan potongan pizza atau kue lapis.",
              contoh: "1/4 kue + 2/4 kue = 3/4 kue.",
              contohSoal: [
                { tanya: "Berapa hasil dari 2/7 + 3/7?", jawab: "5/7", penjelasan: "Penyebut 7 tetap, jumlahkan 2 + 3 = 5." },
                { tanya: "Hitunglah pengurangan: 5/8 - 2/8!", jawab: "3/8", penjelasan: "Penyebut 8 tetap, 5 - 2 = 3." }
              ]
            }
          ]
        },
        {
          id: "mat-s2-b2",
          nomor: 2,
          judul: "Keliling dan Luas Bangun Datar (Persegi & Persegi Panjang)",
          subbab: [
            {
              id: "mat-s2-b2-1",
              judul: "Menghitung Keliling Persegi dan Persegi Panjang",
              ringkasan: "Keliling adalah panjang total garis pembatas di sekeliling bangun datar. Persegi memiliki 4 sisi sama panjang, sehingga rumusnya adalah Keliling = 4 x sisi. Persegi panjang memiliki sepasang panjang dan sepasang lebar, rumusnya Keliling = 2 x (panjang + lebar). Satuan keliling sama dengan satuan panjang (cm atau m).",
              contoh: "Mengukur keliling meja guru yang panjangnya 120 cm dan lebarnya 60 cm.",
              contohSoal: [
                { tanya: "Sebuah saputangan berbentuk persegi memiliki panjang sisi 15 cm. Berapa kelilingnya?", jawab: "60 cm.", penjelasan: "Keliling = 4 x 15 = 60 cm." },
                { tanya: "Lapangan bulu tangkis panjangnya 10 meter dan lebarnya 5 meter. Berapa kelilingnya?", jawab: "30 meter.", penjelasan: "Keliling = 2 x (10 + 5) = 2 x 15 = 30 meter." }
              ]
            },
            {
              id: "mat-s2-b2-2",
              judul: "Menghitung Luas Persegi dan Persegi Panjang",
              ringkasan: "Luas adalah besar daerah yang tertutup oleh permukaan bangun datar tersebut. Luas persegi dihitung dengan rumus Luas = sisi x sisi. Luas persegi panjang dihitung dengan Luas = panjang x lebar. Satuan luas dinyatakan dalam satuan persegi seperti cm² atau m².",
              contoh: "Lantai ruang kelas 4 yang dilapisi ubin berukuran 40 cm x 40 cm.",
              contohSoal: [
                { tanya: "Berapa luas ubin persegi dengan panjang sisi 20 cm?", jawab: "400 cm².", penjelasan: "Luas = 20 x 20 = 400 cm²." },
                { tanya: "Kertas gambar berukuran panjang 30 cm dan lebar 20 cm. Hitung luas kertas tersebut!", jawab: "600 cm².", penjelasan: "Luas = 30 x 20 = 600 cm²." }
              ]
            }
          ]
        },
        {
          id: "mat-s2-b3",
          nomor: 3,
          judul: "Pengukuran Sudut dan Penyajian Data Diagram Batang",
          subbab: [
            {
              id: "mat-s2-b3-1",
              judul: "Jenis-Jenis Sudut dan Busur Derajat",
              ringkasan: "Sudut terbentuk dari dua garis lurus yang berpotongan pada satu titik sudut. Sudut siku-siku besarnya tepat 90 derajat seperti sudut pojok buku. Sudut lancip besarnya kurang dari 90 derajat. Sudut tumpul besarnya lebih dari 90 derajat tetapi kurang dari 180 derajat. Busur derajat digunakan untuk mengukur besar sudut secara akurat.",
              contoh: "Sudut jarum jam pada pukul 03.00 membentuk sudut siku-siku 90°.",
              contohSoal: [
                { tanya: "Berapa besar sudut siku-siku?", jawab: "90 derajat.", penjelasan: "Dua garis tegak lurus membentuk sudut tepat 90°." },
                { tanya: "Sudut yang besarnya 45 derajat termasuk jenis sudut apa?", jawab: "Sudut lancip.", penjelasan: "Karena besarnya kurang dari 90 derajat." }
              ]
            },
            {
              id: "mat-s2-b3-2",
              judul: "Membaca dan Membuat Diagram Batang",
              ringkasan: "Diagram batang menyajikan data dalam bentuk batang-batang tegak atau mendatar yang terpisah. Tinggi batang menunjukkan jumlah frekuensi data tersebut. Sumbu mendatar biasanya berisi kategori atau nama data, sedangkan sumbu tegak berisi angka frekuensi. Diagram batang memudahkan kita melihat data yang paling banyak dan paling sedikit.",
              contoh: "Diagram batang data buah kesukaan 8 siswa kelas 4 SDN Banyurip.",
              contohSoal: [
                { tanya: "Jika batang warna merah paling tinggi di diagram, apa artinya?", jawab: "Kategori warna merah adalah yang paling banyak dipilih atau paling tinggi jumlahnya.", penjelasan: "Tinggi batang sebanding dengan nilai frekuensi data." },
                { tanya: "Sebutkan 2 jenis sumbu pada diagram batang tegak!", jawab: "Sumbu mendatar (horizontal) dan sumbu tegak (vertikal).", penjelasan: "Sumbu horizontal untuk kategori, vertikal untuk skala angka." }
              ]
            }
          ]
        }
      ]
    }
  },
  "IPAS": {
    mapel: "IPAS",
    icon: "🌱",
    warna: "emerald",
    semesters: {
      1: [
        {
          id: "ipas-s1-b1",
          nomor: 1,
          judul: "Tumbuhan Sumber Kehidupan di Bumi",
          subbab: [
            {
              id: "ipas-s1-b1-1",
              judul: "Bagian Tubuh Tumbuhan dan Fungsinya",
              ringkasan: "Tumbuhan tersusun dari akar, batang, daun, bunga, buah, dan biji. Akar berfungsi menyerap air dan zat hara dari dalam tanah serta menopang tumbuhan. Batang mengalirkan air ke daun dan menyokong tubuh tumbuhan. Daun menjadi tempat memasak makanan melalui fotosintesis dengan bantuan klorofil.",
              contoh: "Pohon mangga di halaman SDN Banyurip yang berakar tunggang kuat mencengkeram tanah.",
              contohSoal: [
                { tanya: "Bagian tumbuhan manakah yang berfungsi sebagai tempat fotosintesis?", jawab: "Daun.", penjelasan: "Daun mengandung zat hijau daun (klorofil) untuk memasak makanan." },
                { tanya: "Apa fungsi utama akar bagi tumbuhan?", jawab: "Menyerap air dan zat hara dari dalam tanah serta memperkokoh tanaman.", penjelasan: "Akar menancap di dalam tanah untuk menopang tanaman." }
              ]
            },
            {
              id: "ipas-s1-b1-2",
              judul: "Proses Fotosintesis yang Ajaib",
              ringkasan: "Fotosintesis adalah proses tumbuhan hijau membuat makanannya sendiri. Bahan yang dibutuhkan adalah air dari tanah, gas karbon dioksida dari udara, dan cahaya matahari yang diserap klorofil. Proses ini menghasilkan glukosa (gula) sebagai makanan tumbuhan serta gas oksigen yang kita hirup setiap saat. Oleh karena itu, kita harus rajin menanam pohon.",
              contoh: "Di siang hari yang terik, duduk di bawah pohon terasa sejuk karena tumbuhan mengeluarkan oksigen.",
              contohSoal: [
                { tanya: "Gas apa yang dihasilkan oleh tumbuhan saat fotosintesis dan berguna bagi manusia?", jawab: "Gas Oksigen (O2).", penjelasan: "Oksigen dihirup manusia dan hewan untuk bernapas." },
                { tanya: "Apa zat hijau pada daun yang menangkap sinar matahari?", jawab: "Klorofil.", penjelasan: "Klorofil adalah pigmen hijau penangkap energi cahaya matahari." }
              ]
            }
          ]
        },
        {
          id: "ipas-s1-b2",
          nomor: 2,
          judul: "Wujud Zat dan Perubahannya",
          subbab: [
            {
              id: "ipas-s1-b2-1",
              judul: "Tiga Wujud Zat: Padat, Cair, dan Gas",
              ringkasan: "Semua benda di sekitar kita tergolong ke dalam zat padat, cair, atau gas. Benda padat memiliki bentuk dan volume yang tetap meski dipindahkan. Benda cair bentuknya berubah mengikuti wadahnya, tetapi volumenya tetap. Benda gas mengisi seluruh ruangan dan bentuk serta volumenya berubah-ubah.",
              contoh: "Pensil (padat), air minum di botol (cair), dan udara di dalam balon (gas).",
              contohSoal: [
                { tanya: "Bagaimana bentuk zat cair jika dituangkan ke dalam mangkuk?", jawab: "Bentuknya akan berubah menyerupai mangkuk.", penjelasan: "Zat cair memiliki sifat mengalir dan menyesuaikan bentuk wadahnya." },
                { tanya: "Apakah batu akan berubah bentuk jika dipindahkan ke atas meja?", jawab: "Tidak berubah, karena batu adalah benda padat.", penjelasan: "Benda padat memiliki bentuk dan volume yang tetap." }
              ]
            },
            {
              id: "ipas-s1-b2-2",
              judul: "Peristiwa Perubahan Wujud Zat",
              ringkasan: "Zat dapat berubah wujud karena menerima atau melepaskan panas (kalor). Mencair adalah perubahan padat menjadi cair, sedangkan membeku adalah cair menjadi padat. Menguap terjadi saat cair menjadi gas, dan mengembun adalah gas menjadi cair. Ada juga menyublim yaitu perubahan padat menjadi gas tanpa mencair terlebih dahulu.",
              contoh: "Es batu di dalam gelas yang mencair terkena udara hangat atau kapur barus di lemari yang menyublim.",
              contohSoal: [
                { tanya: "Perubahan wujud dari air menjadi es batu di freezer disebut apa?", jawab: "Membeku.", penjelasan: "Air melepaskan kalor sehingga berubah menjadi zat padat es." },
                { tanya: "Mengapa dinding luar gelas yang berisi es menjadi basah?", jawab: "Terjadi peristiwa pengembunan uap air di udara.", penjelasan: "Uap air di udara sekitar gelas melepaskan kalor ke dinding dingin gelas." }
              ]
            }
          ]
        },
        {
          id: "ipas-s1-b3",
          nomor: 3,
          judul: "Gaya di Sekitar Kita",
          subbab: [
            {
              id: "ipas-s1-b3-1",
              judul: "Mengenal Berbagai Macam Gaya",
              ringkasan: "Gaya adalah tarikan atau dorongan yang diberikan pada suatu benda. Ada gaya otot yang berasal dari tubuh kita, gaya gesek antara dua permukaan, gaya gravitasi bumi, dan gaya magnet. Gaya dapat membuat benda diam menjadi bergerak atau mengubah arah gerak benda. Gaya juga bisa mengubah bentuk benda seperti saat kita menekan plastisin.",
              contoh: "Mendorong meja kelas menggunakan gaya otot tangan.",
              contohSoal: [
                { tanya: "Gaya apa yang bekerja saat kita menendang bola sepak?", jawab: "Gaya otot kaki.", penjelasan: "Otot kaki mendorong bola hingga meluncur ke depan." },
                { tanya: "Mengapa buah mangga yang matang selalu jatuh ke bawah?", jawab: "Karena adanya gaya gravitasi bumi.", penjelasan: "Gravitasi bumi menarik semua benda menuju pusat bumi." }
              ]
            },
            {
              id: "ipas-s1-b3-2",
              judul: "Manfaat Gaya Gesek dalam Kehidupan Sehari-hari",
              ringkasan: "Gaya gesek terjadi ketika dua permukaan benda saling bersentuhan dan bergesekan. Gaya gesek arahnya selalu berlawanan dengan arah gerak benda. Manfaatnya sangat besar, seperti mencegah kita terpeleset saat berjalan dan membantu rem sepeda menghentikan roda. Permukaan yang kasar memiliki gaya gesek lebih besar daripada permukaan licin.",
              contoh: "Alur sol sepatu Anang yang bertekstur agar tidak licin saat bermain lari di lapangan.",
              contohSoal: [
                { tanya: "Mengapa ban sepeda motor diberi alur atau kembangan?", jawab: "Untuk memperbesar gaya gesek agar ban tidak selip di jalanan basah.", penjelasan: "Alur ban mencengkeram aspal dengan lebih kuat." },
                { tanya: "Apakah lantai yang terkena tumpahan sabun memiliki gaya gesek besar atau kecil?", jawab: "Gaya geseknya menjadi sangat kecil sehingga licin.", penjelasan: "Pelumas atau sabun mengurangi gesekan antar permukaan." }
              ]
            }
          ]
        }
      ],
      2: [
        {
          id: "ipas-s2-b1",
          nomor: 1,
          judul: "Mengubah Bentuk Energi",
          subbab: [
            {
              id: "ipas-s2-b1-1",
              judul: "Energi dan Bentuk-Bentuknya",
              ringkasan: "Energi adalah kemampuan untuk melakukan usaha atau kerja. Ada banyak bentuk energi di alam, seperti energi kinetik (gerak), energi potensial, energi panas, cahaya, dan listrik. Energi tidak dapat diciptakan atau dimusnahkan oleh manusia. Energi hanya dapat berubah bentuk dari satu energi ke energi lainnya.",
              contoh: "Matahari memancarkan energi panas dan cahaya yang menerangi sawah Banyurip.",
              contohSoal: [
                { tanya: "Apakah manusia bisa memusnahkan energi?", jawab: "Tidak bisa, energi hanya dapat berubah bentuk.", penjelasan: "Hal ini sesuai dengan Hukum Kekekalan Energi." },
                { tanya: "Sebutkan sumber energi terbesar bagi bumi kita!", jawab: "Matahari.", penjelasan: "Matahari menyediakan panas dan cahaya untuk seluruh makhluk hidup." }
              ]
            },
            {
              id: "ipas-s2-b1-2",
              judul: "Transformasi Energi di Sekitar Kita",
              ringkasan: "Transformasi energi adalah perubahan bentuk energi ke bentuk lain untuk membantu pekerjaan kita. Pada lampu listrik, energi listrik diubah menjadi energi cahaya dan panas. Pada kipas angin atau mixer, energi listrik diubah menjadi energi gerak. Saat kita makan, energi kimia makanan diubah menjadi energi gerak tubuh untuk belajar dan bermain.",
              contoh: "Menyetrika seragam sekolah: energi listrik berubah menjadi energi panas.",
              contohSoal: [
                { tanya: "Perubahan energi apa yang terjadi pada radio yang menyala?", jawab: "Energi listrik berubah menjadi energi bunyi.", penjelasan: "Aliran listrik memutar speaker menghasilkan getaran suara." },
                { tanya: "Saat kita berolahraga lari, perubahan energi apa yang terjadi pada tubuh?", jawab: "Energi kimia dari makanan berubah menjadi energi gerak dan panas tubuh.", penjelasan: "Kalori makanan dibakar otot untuk menghasilkan tenaga lari." }
              ]
            }
          ]
        },
        {
          id: "ipas-s2-b2",
          nomor: 2,
          judul: "Cerita tentang Daerahku dan Kearifan Lokal",
          subbab: [
            {
              id: "ipas-s2-b2-1",
              judul: "Mengenal Bentang Alam dan Kenampakan Buatan",
              ringkasan: "Daerah tempat tinggal kita tersusun dari kenampakan alam dan kenampakan buatan. Kenampakan alam terbentuk alami oleh Sang Pencipta, seperti gunung, sungai, danau, dan pantai. Kenampakan buatan dibuat oleh manusia untuk kebutuhan hidup, seperti waduk, jalan raya, jembatan, dan gedung sekolah. Kita wajib merawat kenampakan alam agar terhindar dari bencana banjir.",
              contoh: "Sungai jernih dekat desa Banyurip dan jembatan beton yang dibangun warga.",
              contohSoal: [
                { tanya: "Sebutkan contoh kenampakan buatan yang ada di sekitar sekolah!", jawab: "Jalan aspal, jembatan, sawah beririgasi, dan gedung sekolah.", penjelasan: "Semua fasilitas itu dibuat dengan rancangan tenaga manusia." },
                { tanya: "Apa manfaat waduk atau bendungan bagi masyarakat sekitar?", jawab: "Mengairi sawah, mencegah banjir, dan menghasilkan listrik.", penjelasan: "Waduk menampung air hujan dalam jumlah besar secara teratur." }
              ]
            },
            {
              id: "ipas-s2-b2-2",
              judul: "Kearifan Lokal Menjaga Lingkungan",
              ringkasan: "Kearifan lokal adalah nilai-nilai bijak warisan leluhur yang ditaati warga setempat untuk menjaga keselarasan alam. Contohnya adalah tradisi bersih desa, larangan menebang pohon keramat di mata air, dan aturan menanam padi serentak. Kearifan lokal mengajarkan kita agar tidak serakah mengambil hasil bumi. Alam yang dirawat dengan cinta akan memberi berkah berlimpah.",
              contoh: "Warga desa Banyurip tidak membuang sampah ke sungai demi menjaga air tetap bersih.",
              contohSoal: [
                { tanya: "Mengapa kita tidak boleh membuang sampah plastik ke sungai?", jawab: "Karena menyumbat aliran air, meracuni ikan, dan menyebabkan banjir.", penjelasan: "Plastik tidak mudah hancur dan merusak ekosistem perairan." },
                { tanya: "Apa tujuan masyarakat mengadakan tradisi bersih desa?", jawab: "Wujud syukur, menjaga kebersihan lingkungan bersama, dan mempererat kerukunan.", penjelasan: "Tradisi leluhur memadukan nilai kebersihan dan kebersamaan." }
              ]
            }
          ]
        },
        {
          id: "ipas-s2-b3",
          nomor: 3,
          judul: "Kebutuhan Manusia dan Kegiatan Ekonomi",
          subbab: [
            {
              id: "ipas-s2-b3-1",
              judul: "Membedakan Kebutuhan dan Keinginan",
              ringkasan: "Kebutuhan adalah segala sesuatu yang wajib dipenuhi manusia untuk mempertahankan hidupnya. Kebutuhan pokok meliputi sandang (pakaian), pangan (makanan), dan papan (tempat tinggal). Keinginan adalah tambahan yang jika tidak terpenuhi kita masih bisa hidup dengan baik. Anak yang cerdas selalu mendahulukan kebutuhan sekolah daripada membeli mainan mahal.",
              contoh: "Membeli buku tulis dan pensil adalah kebutuhan, sedangkan membeli kaset game baru adalah keinginan.",
              contohSoal: [
                { tanya: "Apa yang termasuk 3 kebutuhan primer (pokok) manusia?", jawab: "Sandang, pangan, dan papan.", penjelasan: "Pakaian, makanan sehat, dan tempat tinggal aman." },
                { tanya: "Jika uang saku terbatas, apa yang sebaiknya didahulukan?", jawab: "Membeli kebutuhan pokok atau menabungnya.", penjelasan: "Kebutuhan penting untuk kelangsungan hidup dan masa depan." }
              ]
            },
            {
              id: "ipas-s2-b3-2",
              judul: "Tiga Kegiatan Ekonomi: Produksi, Distribusi, Konsumsi",
              ringkasan: "Kegiatan ekonomi dilakukan manusia untuk memenuhi berbagai kebutuhan hidupnya. Produksi adalah kegiatan menghasilkan barang atau jasa, orangnya disebut produsen. Distribusi adalah kegiatan menyalurkan barang dari produsen ke pemakai, orangnya disebut distributor. Konsumsi adalah kegiatan memakai atau menghabiskan barang, orangnya disebut konsumen.",
              contoh: "Petani menanam padi (produksi), sopir truk mengantar beras ke pasar (distribusi), keluarga kita memasak nasi (konsumsi).",
              contohSoal: [
                { tanya: "Apa sebutan bagi orang atau pihak yang memakai barang hasil produksi?", jawab: "Konsumen.", penjelasan: "Konsumen melakukan kegiatan konsumsi untuk mencukupi kebutuhan." },
                { tanya: "Pabrik sepatu yang membuat sepatu olahraga termasuk pelaku kegiatan apa?", jawab: "Produksi (produsen).", penjelasan: "Karena menghasilkan barang jadi dari bahan baku kulit atau kain." }
              ]
            }
          ]
        }
      ]
    }
  },
  "Bahasa Inggris": {
    mapel: "Bahasa Inggris",
    icon: "🌏",
    warna: "sky",
    semesters: {
      1: [
        {
          id: "ing-s1-b1",
          nomor: 1,
          judul: "What Are You Doing? (Present Continuous Tense)",
          subbab: [
            {
              id: "ing-s1-b1-1",
              judul: "Using Verb-ing for Current Activities",
              ringkasan: "When we want to talk about activities happening right now, we use Verb-ing with to be (am, is, are). 'I am reading', 'She is writing', and 'They are playing'. Adding '-ing' to the base verb shows the action is in progress. It is easy and fun to practice with your classmates every day.",
              contoh: "Look at Anang! He is reading a story book in the classroom.",
              contohSoal: [
                { tanya: "What is the -ing form of the verb 'play'?", jawab: "Playing.", penjelasan: "We simply add '-ing' to 'play' -> playing." },
                { tanya: "Complete the sentence: 'Tara ... (eat) an apple.'", jawab: "is eating", penjelasan: "Subject 'Tara' (she) takes the to be 'is'." }
              ]
            },
            {
              id: "ing-s1-b1-2",
              judul: "Asking 'What Are You Doing?'",
              ringkasan: "To ask someone about their current activity, say: 'What are you doing?'. The polite answer begins with 'I am ...'. If we ask about friends, we say 'What are they doing?' and answer 'They are ...'. Smiling while speaking English makes you sound friendly and confident.",
              contoh: "Raihan asks: 'What are you doing, Bintang?' Bintang answers: 'I am drawing a car.'",
              contohSoal: [
                { tanya: "How do you reply to 'What are you doing?' if you are studying?", jawab: "I am studying.", penjelasan: "'I' pairs with 'am' followed by the verb-ing." },
                { tanya: "Translate to English: 'Mereka sedang berenang.'", jawab: "They are swimming.", penjelasan: "'They' pairs with 'are' and swim becomes swimming." }
              ]
            }
          ]
        },
        {
          id: "ing-s1-b2",
          nomor: 2,
          judul: "Numbers and Counting in the Market",
          subbab: [
            {
              id: "ing-s1-b2-1",
              judul: "Numbers 50 to 100",
              ringkasan: "In Grade 4, students learn numbers up to 100 in English. Remember that '-ty' sounds mean tens, like fifty (50), sixty (60), seventy (70), eighty (80), ninety (90), and one hundred (100). Do not confuse 'fifteen' (15) with 'fifty' (50). Practicing pronunciation helps people understand your prices clearly.",
              contoh: "The story book costs seventy-five (75) thousand rupiahs.",
              contohSoal: [
                { tanya: "What is the English word for number 80?", jawab: "Eighty.", penjelasan: "Eight + ty = eighty." },
                { tanya: "Write in numbers: 'ninety-four'!", jawab: "94", penjelasan: "Ninety (90) + four (4) = 94." }
              ]
            },
            {
              id: "ing-s1-b2-2",
              judul: "Asking Prices: 'How Much Is It?'",
              ringkasan: "When shopping at the school canteen or market, ask: 'How much is this pencil?'. The seller answers: 'It is two thousand rupiahs'. If there are many items, ask: 'How much are these apples?' and answer 'They are ...'. Polite shoppers always say 'Thank you' after buying.",
              contoh: "'Excuse me, how much is this eraser?' - 'It is one thousand rupiahs.'",
              contohSoal: [
                { tanya: "Which question is used to ask for the price of an item?", jawab: "How much is it?", penjelasan: "'How much' is used to inquire about price and quantity." },
                { tanya: "What do you say after receiving your change and item?", jawab: "Thank you!", penjelasan: "Saying thank you shows politeness." }
              ]
            }
          ]
        },
        {
          id: "ing-s1-b3",
          nomor: 3,
          judul: "My Living Room and Bedroom",
          subbab: [
            {
              id: "ing-s1-b3-1",
              judul: "Things in the Living Room",
              ringkasan: "The living room is a comfortable place where family gathers together. Common furniture includes a sofa, table, television, bookcase, and beautiful clock on the wall. We use prepositions like 'on', 'in', and 'under' to tell where things are located. Keeping the living room tidy makes our home peaceful.",
              contoh: "The television is on the table, and the books are in the bookcase.",
              contohSoal: [
                { tanya: "What is 'sofa' in Indonesian?", jawab: "Sofa / kursi malas empuk.", penjelasan: "Sofa is a soft comfortable seat for two or more people." },
                { tanya: "Translate: 'Buku itu ada di atas meja.'", jawab: "The book is on the table.", penjelasan: "'On' means touching the surface above something." }
              ]
            },
            {
              id: "ing-s1-b3-2",
              judul: "Prepositions of Place: On, In, Under, Beside",
              ringkasan: "Prepositions of place describe the position of objects accurately. 'In' means inside a box or room, 'on' means on top of a surface, 'under' means beneath an object, and 'beside' means next to it. Using these words helps you describe your neat bedroom clearly. Practice pointing at classroom objects and saying their positions.",
              contoh: "The cat is sleeping under the wooden chair.",
              contohSoal: [
                { tanya: "Where is the ball if it is beneath the bed?", jawab: "It is under the bed.", penjelasan: "'Under' means below or beneath." },
                { tanya: "What does 'beside' mean in Indonesian?", jawab: "Di sebelah / di samping.", penjelasan: "Beside indicates sitting or being next to something." }
              ]
            }
          ]
        }
      ],
      2: [
        {
          id: "ing-s2-b1",
          nomor: 1,
          judul: "Can You Cook? (Expressing Ability)",
          subbab: [
            {
              id: "ing-s2-b1-1",
              judul: "Using 'Can' and 'Cannot' (Can't)",
              ringkasan: "We use 'can' when we have the ability to do something, and 'cannot' or 'can't' when we are unable. For example, 'I can ride a bicycle', but 'I cannot drive a car'. The verb after 'can' is always in its basic simple form. Everyone has special talents and abilities that they can practice.",
              contoh: "Cinta can sing traditional songs very well.",
              contohSoal: [
                { tanya: "How do you say 'Saya bisa berenang' in English?", jawab: "I can swim.", penjelasan: "Subject 'I' + modal 'can' + base verb 'swim'." },
                { tanya: "What is the short form of 'cannot'?", jawab: "Can't.", penjelasan: "Contraction of cannot is can't." }
              ]
            },
            {
              id: "ing-s2-b1-2",
              judul: "Asking 'Can you ...?' with Politeness",
              ringkasan: "To ask about a friend's skill or request polite help, ask: 'Can you dance?' or 'Can you help me?'. If you can do it, answer cheerfully: 'Yes, I can!'. If you cannot, say politely: 'No, I can't, sorry'. Helping your friends in English makes learning joyful.",
              contoh: "'Can you open the door, please?' - 'Sure, I can!'",
              contohSoal: [
                { tanya: "How do you answer 'Can you play football?' if you are able to play?", jawab: "Yes, I can.", penjelasan: "Short positive response for can-questions." },
                { tanya: "Is the sentence 'Can you singing?' correct or incorrect?", jawab: "Incorrect. The correct one is 'Can you sing?'.", penjelasan: "After 'can', the verb must be in base form without -ing." }
              ]
            }
          ]
        },
        {
          id: "ing-s2-b2",
          nomor: 2,
          judul: "My Daily Routine (Simple Present Tense)",
          subbab: [
            {
              id: "ing-s2-b2-1",
              judul: "Morning Activities from Waking Up to School",
              ringkasan: "A daily routine describes what we do regularly every day. In the morning, students wake up at 05.00, take a bath, brush their teeth, eat breakfast, and go to school. For 'He' and 'She', we add '-s' or '-es' to the verb, like 'He walks to school'. Being punctual is a wonderful habit.",
              contoh: "Krisna wakes up early at five o'clock and prays with his family.",
              contohSoal: [
                { tanya: "Translate: 'Saya mandi setiap pagi.'", jawab: "I take a bath every morning.", penjelasan: "Simple present tense for habitual daily action." },
                { tanya: "Fill in the blank: 'He ... (wash) his bicycle on Sunday.'", jawab: "washes", penjelasan: "For third-person singular (He), add '-es' after sh." }
              ]
            },
            {
              id: "ing-s2-b2-2",
              judul: "Telling the Time: O'clock and Half Past",
              ringkasan: "Telling time helps us follow our school timetable properly. When the long minute hand points to 12, we say 'o'clock', such as seven o'clock (07:00). When it points to 6, we say 'half past', such as half past six (06:30). SDN Banyurip lessons start at seven o'clock sharp.",
              contoh: "The morning bell rings at seven o'clock (07:00).",
              contohSoal: [
                { tanya: "What time is 08:00 in English?", jawab: "Eight o'clock.", penjelasan: "Minute hand on 12 means o'clock." },
                { tanya: "What time is 'half past seven' in numbers?", jawab: "07:30", penjelasan: "Half past means thirty minutes past the hour." }
              ]
            }
          ]
        },
        {
          id: "ing-s2-b3",
          nomor: 3,
          judul: "Vehicles and Means of Transportation",
          subbab: [
            {
              id: "ing-s2-b3-1",
              judul: "Land, Water, and Air Transportation",
              ringkasan: "Vehicles carry people and goods across long distances. Land vehicles include cars, buses, trains, motorcycles, and bicycles. Water transportation includes boats, ferries, and big ships sailing the Indonesian archipelago. Air transportation includes airplanes and helicopters flying fast through the clouds.",
              contoh: "Rafa goes to school by bicycle every morning.",
              contohSoal: [
                { tanya: "Which vehicle flies in the sky: boat, airplane, or train?", jawab: "Airplane.", penjelasan: "An airplane is an air transport vehicle." },
                { tanya: "What preposition is used with vehicles: 'He goes to school ... bus'?", jawab: "by", penjelasan: "We use 'by' for means of transportation (by bus, by car)." }
              ]
            },
            {
              id: "ing-s2-b3-2",
              judul: "Traffic Signs and Safe Walking",
              ringkasan: "Traffic signs keep pedestrians and drivers safe on public roads. A red traffic light means 'Stop', yellow means 'Get ready', and green means 'Go'. Always cross the busy street on the zebra crossing or pedestrian bridge. Look left, right, and left again before stepping onto the road.",
              contoh: "Wait on the sidewalk until the green pedestrian light turns on.",
              contohSoal: [
                { tanya: "What does the red traffic light mean?", jawab: "Stop.", penjelasan: "Red is the universal signal to stop moving." },
                { tanya: "Where should students cross the street safely?", jawab: "On the zebra crossing.", penjelasan: "Zebra crossing is a designated safe area for pedestrians." }
              ]
            }
          ]
        }
      ]
    }
  },
  "Seni dan Budaya": {
    mapel: "Seni dan Budaya",
    icon: "🎨",
    warna: "purple",
    semesters: {
      1: [
        {
          id: "sb-s1-b1",
          nomor: 1,
          judul: "Menggambar Rumah Tetangga dan Garis Rupa",
          subbab: [
            {
              id: "sb-s1-b1-1",
              judul: "Mengenal Unsur Garis, Bidang, dan Warna",
              ringkasan: "Seni rupa dimulai dari unsur dasar yaitu titik, garis, bidang, bentuk, warna, dan tekstur. Garis lurus memberi kesan tegas dan kokoh, sedangkan garis lengkung memberi kesan luwes dan lembut. Bidang terbentuk dari pertemuan ujung-ujung garis seperti segitiga dan persegi. Memadukan warna primer (merah, kuning, biru) menghasilkan warna sekunder yang indah.",
              contoh: "Menggambar atap rumah tetangga berbentuk segitiga dengan garis lurus tegas.",
              contohSoal: [
                { tanya: "Campuran warna merah dan kuning akan menghasilkan warna apa?", jawab: "Warna jingga (oranye).", penjelasan: "Jingga adalah warna sekunder hasil perpaduan dua warna primer." },
                { tanya: "Kesan apakah yang dihasilkan dari penggunaan garis lengkung?", jawab: "Kesan luwes, dinamis, dan lembut.", penjelasan: "Garis lengkung mengalir tanpa sudut tajam." }
              ]
            },
            {
              id: "sb-s1-b1-2",
              judul: "Perspektif Sederhana Menggambar Lingkungan",
              ringkasan: "Saat kita memandang rumah tetangga di sepanjang jalan, benda yang dekat terlihat lebih besar dan jelas. Benda yang letaknya jauh terlihat lebih kecil dan samar. Ini disebut dengan prinsip perspektif pandangan mata. Menerapkan prinsip ini membuat gambar pemandangan kita terlihat memiliki ruang dan kedalaman nyata.",
              contoh: "Pohon di dekat pintu gerbang digambar tinggi besar, pohon di ujung desa digambar kecil.",
              contohSoal: [
                { tanya: "Mengapa benda yang jauh digambar lebih kecil daripada benda yang dekat?", jawab: "Untuk memberikan ilusi kedalaman ruang dan jarak (perspektif).", penjelasan: "Sesuai cara mata manusia melihat objek di alam." },
                { tanya: "Apa garis khayal pertemuan antara langit dan bumi dalam gambar?", jawab: "Garis cakrawala (horizon).", penjelasan: "Garis horizon membatasi pandangan mata terhadap daratan dan langit." }
              ]
            }
          ]
        },
        {
          id: "sb-s1-b2",
          nomor: 2,
          judul: "Seni Kolase dan Daur Ulang Plastik",
          subbab: [
            {
              id: "sb-s1-b2-1",
              judul: "Teknik Menempel Karya Kolase",
              ringkasan: "Kolase adalah karya seni rupa dua dimensi yang dibuat dengan menempelkan berbagai bahan pada permukaan gambar. Bahan kolase bisa berupa bahan alam seperti biji-bijian, daun kering, dan cangkang telur. Kita juga bisa memanfaatkan potongan kertas origami atau kain perca warna-warni. Kunci kolase yang rapi adalah kesabaran dan pemilihan lem yang kuat.",
              contoh: "Membuat kolase burung garuda menggunakan tempelan biji jagung dan kacang hijau.",
              contohSoal: [
                { tanya: "Apa perbedaan utama kolase dengan lukisan cat air?", jawab: "Kolase dibuat dengan menempelkan potongan bahan, sedangkan lukisan memakai sapuan kuas cat.", penjelasan: "Kolase memanfaatkan tekstur nyata dari material yang ditempel." },
                { tanya: "Sebutkan 2 contoh bahan alam yang bagus untuk membuat kolase!", jawab: "Biji-bijian (jagung, kedelai) dan daun kering.", penjelasan: "Bahan alam mudah didapat di sekitar pekarangan rumah." }
              ]
            },
            {
              id: "sb-s1-b2-2",
              judul: "Membuat Kerajinan dari Sampah Plastik",
              ringkasan: "Sampah plastik membutuhkan waktu ratusan tahun untuk terurai di dalam tanah. Sebagai pelajar berkarakter peduli lingkungan, kita bisa menyulap botol plastik bekas menjadi pot bunga gantung yang cantik. Tutup botol warna-warni dapat dirangkai menjadi hiasan dinding yang memukau. Berkreasi seni sekaligus menyelamatkan bumi tercinta.",
              contoh: "Pot bunga gantung dari botol air mineral bekas yang dicat motif kelinci lucu.",
              contohSoal: [
                { tanya: "Mengapa memanfaatkan botol plastik bekas termasuk tindakan ramah lingkungan?", jawab: "Karena mengurangi volume sampah plastik dan menerapkan prinsip daur ulang (recycle).", penjelasan: "Mengubah barang bekas menjadi benda berdaya guna dan bernilai seni." },
                { tanya: "Cat jenis apa yang cocok menempel kuat pada permukaan botol plastik?", jawab: "Cat akrilik.", penjelasan: "Cat akrilik tahan air dan melekat baik pada permukaan plastik." }
              ]
            }
          ]
        },
        {
          id: "sb-s1-b3",
          nomor: 3,
          judul: "Mengenal Alat Musik Ritmis dan Melodis",
          subbab: [
            {
              id: "sb-s1-b3-1",
              judul: "Perbedaan Alat Musik Ritmis dan Melodis",
              ringkasan: "Alat musik ritmis adalah alat musik yang tidak bernada, berfungsi mengatur ketukan dan tempo lagu. Contohnya kendang, rebana, tamborin, dan marakas. Sedangkan alat musik melodis adalah alat musik yang memiliki nada (do, re, mi) dan memainkan melodi lagu. Contohnya pianika, seruling, dan rekorder. Keduanya berpadu menghasilkan alunan musik yang harmonis.",
              contoh: "Candra memukul rebana mengikuti ketukan, sementara Raihan meniup pianika menyanyikan lagu Indonesia Pusaka.",
              contohSoal: [
                { tanya: "Apakah drum dan tamborin termasuk alat musik bernada?", jawab: "Tidak, keduanya adalah alat musik ritmis (tidak bernada).", penjelasan: "Alat ritmis hanya menghasilkan ketukan tanpa tangga nada tetap." },
                { tanya: "Alat musik tiup apa yang biasa dimainkan siswa SD bernada melodis?", jawab: "Pianika atau rekorder.", penjelasan: "Pianika memiliki tuts berurutan untuk memainkan not angka do-re-mi." }
              ]
            },
            {
              id: "sb-s1-b3-2",
              judul: "Bermain Pola Ketukan Birama 4/4",
              ringkasan: "Birama 4/4 berarti dalam setiap ruas birama terdapat 4 ketukan. Ketukan pertama biasanya merupakan ketukan terkuat, diikuti ketukan kedua, ketiga, dan keempat yang lebih ringan. Kita bisa melatih birama 4/4 dengan tepuk tangan atau hentakan kaki berirama. Irama yang teratur membuat lagu terasa mantap dan enak didengar.",
              contoh: "Tepuk tangan: Prok (kuat) - prok - prok - prok mengiringi lagu 'Halo-Halo Bandung'.",
              contohSoal: [
                { tanya: "Berapa jumlah ketukan dalam satu ruas birama 4/4?", jawab: "4 ketukan.", penjelasan: "Angka atas pada 4/4 menunjukkan terdapat 4 ketuk per birama." },
                { tanya: "Ketukan ke berapakah yang bertekanan paling kuat pada birama 4/4?", jawab: "Ketukan pertama.", penjelasan: "Ketukan awal birama adalah aksen utama irama lagu." }
              ]
            }
          ]
        }
      ],
      2: [
        {
          id: "sb-s2-b1",
          nomor: 1,
          judul: "Ragam Motif Batik Nusantara",
          subbab: [
            {
              id: "sb-s2-b1-1",
              judul: "Mengenal Motif Batik Kawung dan Parang",
              ringkasan: "Batik adalah warisan budaya takbenda Indonesia yang diakui oleh UNESCO. Motif Kawung berbentuk bulatan lonjong menyerupai buah kolang-kaling yang tersusun rapi geometris. Motif ini melambangkan ketulusan hati dan kesucian diri. Motif Parang menyerupai ombak laut yang berkesinambungan tanpa putus, melambangkan semangat pantang menyerah.",
              contoh: "Kain batik Kawung yang dipakai guru saat perayaan Hari Batik Nasional.",
              contohSoal: [
                { tanya: "Organisasi dunia manakah yang menetapkan batik sebagai warisan budaya dunia?", jawab: "UNESCO.", penjelasan: "UNESCO mengakui batik Indonesia sejak tanggal 2 Oktober 2009." },
                { tanya: "Bentuk apakah yang mendasari pola motif batik Kawung?", jawab: "Buah aren / kolang-kaling yang dibelah empat.", penjelasan: "Pola geometris empat elips bersilangan simetris." }
              ]
            },
            {
              id: "sb-s2-b1-2",
              judul: "Membuat Desain Batik Sederhana di Buku Gambar",
              ringkasan: "Siswa kelas 4 dapat berlatih merancang pola batik dengan membuat kotak-kotak grid terlebih dahulu. Gambarlah motif tanaman, bunga, atau bentuk geometris secara berulang dan teratur di setiap kotak. Warnailah dengan kombinasi warna tanah seperti cokelat sogan, hitam, dan krem. Kerapian dan ketelatenan menghasilkan karya desain batik yang anggun.",
              contoh: "Menggambar pola bunga berulang menggunakan penggaris dan pensil warna cokelat.",
              contohSoal: [
                { tanya: "Apa fungsi membuat garis bantu kotak (grid) saat mendesain pola batik?", jawab: "Agar motif yang digambar berulang memiliki ukuran simetris dan rapi.", penjelasan: "Grid menjaga keteraturan jarak antar ornamen." },
                { tanya: "Warna cokelat khas pada batik tradisional Jawa sering disebut apa?", jawab: "Warna sogan.", penjelasan: "Sogan adalah pewarna alami dari kulit pohon soga berwarna cokelat hangat." }
              ]
            }
          ]
        },
        {
          id: "sb-s2-b2",
          nomor: 2,
          judul: "Gerak Tari Daerah dan Pola Lantai",
          subbab: [
            {
              id: "sb-s2-b2-1",
              judul: "Gerak Dasar Tari Tradisional",
              ringkasan: "Tari daerah mengekspresikan perasaan manusia melalui gerak tubuh yang indah selaras dengan iringan musik gamelan. Gerak tari meliputi gerak kepala (seperti toleh dan pacak gulu), gerak tangan (seperti ngrayung dan nyempurit), serta langkah kaki yang mantap. Menari melatih kelenturan tubuh dan rasa percaya diri anak di panggung pertunjukan.",
              contoh: "Posisi jari tangan ngrayung: empat jari tegak lurus dan ibu jari ditekuk ke dalam.",
              contohSoal: [
                { tanya: "Apa sebutan sikap telapak tangan di mana 4 jari tegak dan jempol menempel telapak?", jawab: "Ngrayung.", penjelasan: "Sikap dasar jari tangan pada tari gaya Surakarta/Yogyakarta." },
                { tanya: "Apa alat musik pengiring utama tari-tarian tradisional di Jawa?", jawab: "Gamelan.", penjelasan: "Gamelan menghasilkan perpaduan bunyi gong, kendang, dan saron yang ritmis." }
              ]
            },
            {
              id: "sb-s2-b2-2",
              judul: "Pola Lantai Garis Lurus dan Lengkung",
              ringkasan: "Pola lantai adalah lintasan atau formasi yang dilalui oleh penari saat berpindah tempat di atas panggung. Pola garis lurus meliputi garis horizontal, vertikal, dan diagonal yang memberi kesan kuat dan sederhana. Pola lantai garis lengkung meliputi lingkaran dan angka delapan yang memberi kesan manis dan lemah lembut. Formasi yang kompak membuat tarian kelompok memukau penonton.",
              contoh: "Delapan penari membentuk formasi huruf V lalu berputar menjadi lingkaran besar.",
              contohSoal: [
                { tanya: "Pola lantai apa yang memberi kesan kelembutan dan keluwesan?", jawab: "Pola lantai garis lengkung (seperti lingkaran).", penjelasan: "Garis melengkung memberi kesan manis, hangat, dan dinamis." },
                { tanya: "Mengapa penari kelompok perlu menguasai pola lantai dengan kompak?", jawab: "Agar formasi tarian terlihat teratur, indah, dan penari tidak saling bertabrakan.", penjelasan: "Pola lantai mengatur ruang gerak panggung." }
              ]
            }
          ]
        },
        {
          id: "sb-s2-b3",
          nomor: 3,
          judul: "Bermain Peran dan Pantomim Anak",
          subbab: [
            {
              id: "sb-s2-b3-1",
              judul: "Seni Pantomim yang Jenaka",
              ringkasan: "Pantomim adalah seni pertunjukan teater yang menyampaikan pesan hanya melalui gerak tubuh dan ekspresi wajah tanpa mengeluarkan kata-kata suara. Wajah pemain pantomim biasanya dirias bedak putih tebal dengan garis bibir atau alis hitam yang tegas. Pemain pantomim bisa berpura-pura meniup balon raksasa atau berjalan melawan angin kencang. Menonton pantomim sangat menghibur dan memancing tawa gembira.",
              contoh: "Krisna berakting seolah-olah sedang memegang dinding kaca tak terlihat.",
              contohSoal: [
                { tanya: "Apakah pemain pantomim boleh berbicara mengeluarkan suara saat pentas?", jawab: "Tidak boleh, pantomim murni seni gerak bisu dan mimik wajah.", penjelasan: "Kekuatan pantomim ada pada gerak gestur dan ekspresi." },
                { tanya: "Apa ciri khas riasan wajah pada pertunjukan pantomim?", jawab: "Riasan wajah dominan putih dengan penegasan garis mata dan bibir.", penjelasan: "Bedak putih memperjelas ekspresi mimik wajah dari kejauhan." }
              ]
            },
            {
              id: "sb-s2-b3-2",
              judul: "Mengekspresikan Karakter Tokoh dalam Drama Kelas",
              ringkasan: "Dalam drama kelas, setiap siswa belajar memerankan tokoh dengan sifat yang berbeda-beda, seperti tokoh bijaksana, periang, atau penolong. Kita harus menghayati dialog dan intonasi suara sesuai watak tokoh tersebut. Bekerja sama dalam drama melatih kekompakan tim dan rasa saling menghargai. Di panggung, semua peran itu penting untuk kesuksesan cerita.",
              contoh: "Cinta berperan menjadi burung merpati yang membawakan surat kabar perdamaian.",
              contohSoal: [
                { tanya: "Apa yang dimaksud dengan tokoh protagonis?", jawab: "Tokoh utama yang memiliki watak baik, jujur, dan berbudi luhur.", penjelasan: "Protagonis menjadi panutan penonton dalam jalan cerita." },
                { tanya: "Mengapa kita harus melatih intonasi suara saat membaca dialog drama?", jawab: "Agar emosi dan karakter tokoh dapat dirasakan dengan nyata oleh penonton.", penjelasan: "Intonasi menghidupkan dialog naskah teater." }
              ]
            }
          ]
        }
      ]
    }
  },
  "Bahasa Jawa": {
    mapel: "Bahasa Jawa",
    icon: "🌾",
    warna: "yellow",
    semesters: {
      1: [
        {
          id: "bj-s1-b1",
          nomor: 1,
          judul: "Unggah-Ungguh Basa Jawa (Ngoko lan Krama)",
          subbab: [
            {
              id: "bj-s1-b1-1",
              judul: "Basa Ngoko kanggo Kanca Saumuran",
              ringkasan: "Basa Jawa nduweni tatakrama utawa unggah-ungguh basa sing luhur. Basa Ngoko digunakake nalika guneman marang kanca saumuran utawa marang wong sing luwih enom. Senadyan nganggo basa ngoko, panyuwunan tetep kudu nganggo tembung sing sopan lan ora oleh nggunakake tembung kasar. Bocah sing pinter tansah njaga lambe lan tindak-tanduk.",
              contoh: "Anang matur marang Bintang: 'Kowe sesuk apa sida mlebu sekolah bareng aku?'.",
              contohSoal: [
                { tanya: "Basa ngoko iku trep digunakake marang sapa?", jawab: "Marang kanca sakelas utawa wong sing luwih enom.", penjelasan: "Ngoko kanggo sesrawungan kanca akrab saumuran." },
                { tanya: "Basa ngokone tembung 'makan' yaiku apa?", jawab: "Mangan.", penjelasan: "Mangan (ngoko), nedha (krama madya), dhahar (krama alus)." }
              ]
            },
            {
              id: "bj-s1-b1-2",
              judul: "Basa Krama marang Wong Tuwa lan Bapak/Ibu Guru",
              ringkasan: "Nalika matur marang wong tuwa utawa bapak ibu guru, bocah kelas 4 kudu nggunakake basa Krama Alus. Basa krama ngajeni wong sing luwih sepuh kanthi rasa urmat. Contone, tembung 'aku lunga' diowahi dadi 'kula tindak' utawa 'kula kesah'. Ngurmati wong tuwa liwat basa ndadekake urip berkah lan disenengi kanca.",
              contoh: "Raihan nyuwun pirsa marang Pak Guru: 'Nyuwun sewu Pak, punapa dinten menika wonten tugas?'.",
              contohSoal: [
                { tanya: "Basa kramane tembung 'turu' kanggo bapak guru yaiku?", jawab: "Sare.", penjelasan: "Sare minangka tembung krama alus kanggo pakurmatan." },
                { tanya: "Nalika mlaku ing ngarepe wong tuwa, becike ngucapake tembung apa?", jawab: "'Nyuwun sewu' utawa 'ndherek langkung' sinambi mbungkukake awak.", penjelasan: "Sikap subasita lan unggah-ungguh luhur wong Jawa." }
              ]
            }
          ]
        },
        {
          id: "bj-s1-b2",
          nomor: 2,
          judul: "Cerita Pandhawa Lima lan Watake",
          subbab: [
            {
              id: "bj-s1-b2-1",
              judul: "Urutan lan Asmane Para Pandhawa",
              ringkasan: "Pandhawa iku cacahe ana lima, putrane Prabu Pandu Dewanata. Pambarepe yaiku Raden Puntadewa (Yudhistira) sing watake sabar lan jujur. Panenggahe Raden Werkudara (Bima) sing gagah lan setya, penengahe Raden Janaka (Arjuna) sing bagus lan sekti. Dene kembarane yaiku Raden Nakula lan Raden Sadewa sing pinter lan setya tuhu.",
              contoh: "Siswa kelas 4 nonton wayang kulit kanthi lakon Pandhawa Bangkit.",
              contohSoal: [
                { tanya: "Sapa asmane pambarepe (anak mbarep) Pandhawa Lima?", jawab: "Raden Puntadewa (Yudhistira).", penjelasan: "Puntadewa ratu ing Ngamarta sing ora tau goroh." },
                { tanya: "Sapa loro ksatria Pandhawa sing lair kembar?", jawab: "Raden Nakula lan Raden Sadewa.", penjelasan: "Kekalihe putra saka Dewi Madrim." }
              ]
            },
            {
              id: "bj-s1-b2-2",
              judul: "Nyonto Watak Becik Para Satriya Pandhawa",
              ringkasan: "Para satriya Pandhawa nduweni watak luhur sing pantes ditiru dening kabeh bocah sekolah. Raden Puntadewa ora nate goroh utawa ngapusi marang sapa wae. Raden Werkudara tansah mbela kanca sing ringkih lan ora seneng pilih kasih. Raden Arjuna sregep sinau lan ngudi kawruh kanthi temenan.",
              contoh: "Candra jujur ngakoni salah nalika ora sengaja mecahake pot kembang kelas.",
              contohSoal: [
                { tanya: "Watak jujur lan ora tau goroh iku tuladhane satriya ngendi?", jawab: "Raden Puntadewa.", penjelasan: "Puntadewa kondhang minangka getih putih jalaran suci atine." },
                { tanya: "Gaman utawa pusakane Raden Werkudara sing arupa kuku lancip arane apa?", jawab: "Kuku Pancanaka.", penjelasan: "Pusaka ampuh ing driji jempol astane Raden Bima." }
              ]
            }
          ]
        },
        {
          id: "bj-s1-b3",
          nomor: 3,
          judul: "Tembang Dolanan Padhang Wulan lan Gundhul Pacul",
          subbab: [
            {
              id: "bj-s1-b3-1",
              judul: "Nembang Padhang Wulan lan Piwulange",
              ringkasan: "Tembang dolanan yaiku tembang Jawa sing dinyanyekake bocah-bocah sinambi dolanan bareng ing latar. Tembang 'Padhang Wulan' ngajak bocah dolan ing latar amarga rembulane sumunar padhang kaya awan. Piwulang tembang iki ngelingake manungsa supaya ora turu sore-sore lan tansah syukur marang Gusti Kang Akarya Jagad. Guyub rukun ndadekake ati seneng.",
              contoh: "Syair: 'Yo pra kanca dolanan ing njaba / Padhang wulan padhange kaya rina...'.",
              contohSoal: [
                { tanya: "Ing tembang Padhang Wulan, rembulane ngelingake supaya apa?", jawab: "Aja turu sore-sore lan tansah eling marang Gusti Kang Maha Kuwasa.", penjelasan: "Syair: 'Rembulane sing awe-awe / Ngelingake aja padha turu sore'." },
                { tanya: "Ing wayah apa tembang Padhang Wulan biasane ditembangake?", jawab: "Ing wayah wengi nalika rembulan purnama padhang sumunar.", penjelasan: "Bocah-bocah jaman biyen dolanan ing latar padhang bulan." }
              ]
            },
            {
              id: "bj-s1-b3-2",
              judul: "Makna Luhur Tembang Gundhul-Gundhul Pacul",
              ringkasan: "Tembang 'Gundhul-Gundhul Pacul' dianggit dening Sunan Kalijaga kanthi piwulang kepemimpinan sing jero. 'Pacul' iku pirantine wong cilik (petani) sing nyambut gawe ing sawah. Pemimpin ora oleh gembelengan utawa gumede sombong. Yen sembrana nyekel amanah, 'wakul ngglimpang segane dadi sak latar', tegese kabeh bakal bubrah lan muspra.",
              contoh: "Ketua kelas sing ngayomi kabeh kanca kanthi lembah manah.",
              contohSoal: [
                { tanya: "Apa tegese tembung 'gembelengan' ing tembang Gundhul Pacul?", jawab: "Sembrana, umuk, utawa sombong ora tanggung jawab.", penjelasan: "Sikap sembrana bakal ngrusak amanah rakyat utawa kelas." },
                { tanya: "Sapa Sunan Wali Songo sing ngripta tembang Gundhul Pacul?", jawab: "Sunan Kalijaga.", penjelasan: "Sunan Kalijaga dakwah nggunakake tembang lan wayang." }
              ]
            }
          ]
        }
      ],
      2: [
        {
          id: "bj-s2-b1",
          nomor: 1,
          judul: "Nulis Aksara Jawa Legena (Ha Na Ca Ra Ka)",
          subbab: [
            {
              id: "bj-s2-b1-1",
              judul: "Mengenal 20 Aksara Jawa Nglegena",
              ringkasan: "Aksara Jawa cacahe ana rong puluh (20) sing durung kawuwuhan sandhangan, diarani aksara Nglegena. Urut-urutane yaiku: Ha, Na, Ca, Ra, Ka, Da, Ta, Sa, Wa, La, Pa, Dha, Ja, Ya, Nya, Ma, Ga, Ba, Tha, Nga. Aksara iki ngemu crita prang tandhing antarane abdi Dora lan Sembada sing padha-padha sektine lan setya ngugemi dhawuhe bendarane.",
              contoh: "Nulis tembung 'Bata' nggunakake aksara Ba lan Ta.",
              contohSoal: [
                { tanya: "Pira cacahe aksara Jawa legena kabeh?", jawab: "Ana 20 aksara.", penjelasan: "Ha na ca ra ka nganti ma ga ba tha nga." },
                { tanya: "Aksara kapisan ing urutan aksara Jawa yaiku aksara apa?", jawab: "Aksara Ha.", penjelasan: "Aksara Ha unine bisa ha utawa a." }
              ]
            },
            {
              id: "bj-s2-b1-2",
              judul: "Sandhangan Swara Wulu, Suku, Pepet, Taling",
              ringkasan: "Supaya aksara Jawa bisa muni vokal liyane (i, u, e, o), aksara Jawa kudu diwenehi sandhangan swara. Wulu (wujude bunder cilik ing dhuwur) unine 'i'. Suku (wujude lancip ing ngisor) unine 'u'. Pepet (wujude setengah bunderan gedhe) unine 'e' kaya ing tembung sega. Taling unine 'e' kaya ing tembung lele. Taling tarung unine 'o'.",
              contoh: "Aksara Ka diwenehi wulu muni 'Ki', diwenehi suku muni 'Ku'.",
              contohSoal: [
                { tanya: "Sandhangan swara apa sing ngowahi swara dadi 'u'?", jawab: "Sandhangan Suku.", penjelasan: "Suku manggon ana ing sikil ngisore aksara." },
                { tanya: "Apa jenenge sandhangan sing munine 'i'?", jawab: "Wulu.", penjelasan: "Wulu wujud bunder cilik ing sandhuwure aksara." }
              ]
            }
          ]
        },
        {
          id: "bj-s2-b2",
          nomor: 2,
          judul: "Dongeng Kancil lan Baya (Fabel Jawa)",
          subbab: [
            {
              id: "bj-s2-b2-1",
              judul: "Nyemak Alur Crita Kancil Nyebrang Kali",
              ringkasan: "Dongeng kewan diarani dongeng Fabel. Ing sawijining dina, Kancil kepengin nyebrang kali amarga weruh wit timun ing sebrang sing woh-wohane seger banget. Kali kasebut kebak baya sing galak lan luwe. Kancil nggunakake kapinterane kanthi mbujuk baya-baya jejer-jejer arep dietung kanggo diparingi daging dening Kanjeng Nabi Sulaiman. Kancil banjur mlumpat kanthi slamet.",
              contoh: "Kancil ngetung baya siji mbaka siji: 'Siji, loro, telu, papat...' sinambi mlumpat ing geger baya.",
              contohSoal: [
                { tanya: "Apa jinis dongeng sing paraga utamane arupa kewan?", jawab: "Dongeng Fabel.", penjelasan: "Fabel yaiku crita fiksi nggunakake paraga kewan sing bisa celathu." },
                { tanya: "Nalika nyebrang kali, Kancil mlumpat ing sadhuwure awake sapa?", jawab: "Gegere baya-baya.", penjelasan: "Baya dijejerake kaya kreteg dening Kancil." }
              ]
            },
            {
              id: "bj-s2-b2-2",
              judul: "Njupuk Pitutur Becik saka Dongeng Kancil",
              ringkasan: "Saka dongeng Kancil lan Baya, awake dhewe sinau manawa akal lan kapinteran bisa ngatasi masalah sing angel. Nanging, awake dhewe ora kena nggunakake akal pinter kanggo ngapusi kanca utawa gawe cilakane liyan. Kapinteran kudu digunakake kanggo nulung sesama lan tumindak becik. Bocah sing pinter lan jujur bakal diasihi Gusti.",
              contoh: "Nggunakake kapinteran IT kanggo sinau daring, dudu kanggo dolanan game nganti lali wektu.",
              contohSoal: [
                { tanya: "Bolehkah kita ngapusi kanca kaya tumindake Kancil marang baya?", jawab: "Ora oleh, amarga ngapusi iku tumindak ala sing ngrugekake wong liya.", penjelasan: "Kudu njupuk akal pintere, nanging nyingkiri tumindak goroh utawa culikane." },
                { tanya: "Sifat apa sing kudu diduweni bocah sekolah saliyane pinter?", jawab: "Jujur lan berbudi pekerti luhur.", penjelasan: "Pinter tanpa kejujuran bakal mbilaheni tumrap bebrayan agung." }
              ]
            }
          ]
        },
        {
          id: "bj-s2-b3",
          nomor: 3,
          judul: "Cangkriman lan Parikan Bocah SD",
          subbab: [
            {
              id: "bj-s2-b3-1",
              judul: "Tebak-Tebakan Cangkriman sing Lucu",
              ringkasan: "Cangkriman yaiku unen-unen sing kudu dibatang utawa dibedhek tegese. Ana cangkriman wancahan (cekakan), contone 'Burnaskopen' tegese 'bubur panas kokopen'. Ana uga cangkriman blenderan utawa plesetan sing gawe ngguyu. Dolanan cangkriman bareng kanca nambahi guyub lan ngasah landhepe pikir bocah.",
              contoh: "Cangkriman: 'Bocah cilik nggendhong omah, batangane apa?' - Batangane: 'Bekicot'.",
              contohSoal: [
                { tanya: "Apa batangane cangkriman: 'Dikuliti kok malah amba'?", jawab: "Gendheng utawa terpal.", penjelasan: "Yen dikuliti (dijupuk genthenge) omahe dadi amba bukakan langit." },
                { tanya: "Apa tegese cekakan cangkriman 'Pakbomba'?", jawab: "Tapak kebo amba.", penjelasan: "Cangkriman wancah ngringkes tembung dadi gampang dieling." }
              ]
            },
            {
              id: "bj-s2-b3-2",
              judul: "Nggawe Parikan (Pantun Jawa) 2 Gatra",
              ringkasan: "Parikan yaiku pantun Jawa sing dumadi saka rong gatra (baris) utawa patang gatra. Gatra kapisan minangka purwaka utawa sampiran, dene gatra kapindho minangka isine. Swara wekasan ing gatra siji lan loro kudu nduweni rima sing runtut (tibaning swara padha). Parikan asring digunakake kanggo guyon lan pitutur santun.",
              contoh: "Parikan: 'Wajik klethik gula jawa / Luwih becik sing prasaja'.",
              contohSoal: [
                { tanya: "Lanjutna parikan iki: 'Manuk emprit mencok pager / Dadi murid kudu ...'?", jawab: "Pinter lan pinter / sregep sinau.", penjelasan: "Purwakanthi rima 'ger' - 'sregep sinau ben pinter'." },
                { tanya: "Pira cacahe gatra ing parikan rong gatra?", jawab: "Rong gatra (dua baris).", penjelasan: "Gatra 1 sampiran, gatra 2 isi." }
              ]
            }
          ]
        }
      ]
    }
  },
  "Pendidikan Agama": {
    mapel: "Pendidikan Agama",
    icon: "🕌",
    warna: "teal",
    semesters: {
      1: [
        {
          id: "pa-s1-b1",
          nomor: 1,
          judul: "Membaca dan Memahami Surah Al-Hujurat Ayat 13",
          subbab: [
            {
              id: "pa-s1-b1-1",
              judul: "Pesan Keragaman dan Saling Mengenal (Lita'arafu)",
              ringkasan: "Surah Al-Hujurat ayat 13 mengajarkan bahwa Allah menciptakan manusia dari seorang laki-laki dan perempuan, serta menjadikannya berbangsa-bangsa dan bersuku-suku agar saling mengenal (lita'arafu). Orang yang paling mulia di sisi Allah bukanlah yang paling kaya atau berkuasa, melainkan yang paling bertakwa. Perbedaan adalah anugerah indah untuk saling melengkapi.",
              contoh: "Siswa SDN Banyurip bermain rukun bersama teman dari berbagai suku dan latar belakang.",
              contohSoal: [
                { tanya: "Apakah arti dari kata 'lita'arafu' dalam surah Al-Hujurat ayat 13?", jawab: "Agar kamu saling mengenal.", penjelasan: "Allah menciptakan keberagaman untuk saling kenal dan tolong-menolong." },
                { tanya: "Siapakah orang yang paling mulia di sisi Allah SWT?", jawab: "Orang yang paling bertakwa di antara kalian.", penjelasan: "Kemuliaan sejati diukur dari ketakwaan hati dan amal perbuatan." }
              ]
            },
            {
              id: "pa-s1-b1-2",
              judul: "Membaca Al-Qur'an dengan Tartil dan Tajwid",
              ringkasan: "Membaca Al-Qur'an harus dengan tartil yaitu tenang, jelas makhraj hurufnya, dan benar hukum tajwidnya. Pada kelas 4, siswa belajar hukum bacaan nun sukun/tanwin seperti idzhar halqi (dibaca jelas) dan idgham bighunnah (dengung). Setiap huruf Al-Qur'an yang dibaca mendatangkan sepuluh kebaikan pahala dari Allah SWT.",
              contoh: "Membaca huruf nun mati bertemu huruf 'ain secara jelas tanpa mendengung pada bacaan idzhar.",
              contohSoal: [
                { tanya: "Bagaimana cara membaca hukum bacaan Idzhar Halqi?", jawab: "Dibaca jelas, tegas, dan tidak berdengung.", penjelasan: "Idzhar artinya jelas saat nun sukun/tanwin bertemu salah satu dari 6 huruf halqi." },
                { tanya: "Sebutkan salah satu huruf Idgham Bighunnah!", jawab: "Huruf Ya, Nun, Mim, atau Waw (Ya-Nu-Mi-Wa).", penjelasan: "Ada empat huruf idgham bighunnah yang dibaca melebur dengan dengung." }
              ]
            }
          ]
        },
        {
          id: "pa-s1-b2",
          nomor: 2,
          judul: "Mengenal Asmaulhusna (Al-Malik, Al-Quddus, As-Salam)",
          subbab: [
            {
              id: "pa-s1-b2-1",
              judul: "Makna Al-Malik, Al-Quddus, As-Salam, Al-Mu'min, Al-'Aziz",
              ringkasan: "Asmaulhusna adalah nama-nama terbaik dan terindah milik Allah SWT. Al-Malik artinya Allah Maha Merajai seluruh alam semesta. Al-Quddus artinya Allah Maha Suci dari segala kekurangan. As-Salam artinya Allah Maha Pemberi Kesejahteraan dan Kedamaian bagi para hamba-Nya. Meneladani Asmaulhusna membuat hati kita tenang dan penuh kasih.",
              contoh: "Menjaga kebersihan hati dan badan sebelum menghadap Allah dalam sholat mencerminkan sifat Al-Quddus.",
              contohSoal: [
                { tanya: "Apakah arti dari Asmaulhusna 'As-Salam'?", jawab: "Maha Pemberi Kesejahteraan / Maha Menyelamatkan.", penjelasan: "As-Salam menyebarkan kedamaian bagi seluruh makhluk." },
                { tanya: "Bagaimana cara meneladani nama Allah 'Al-Quddus' di sekolah?", jawab: "Menjaga kebersihan badan, pakaian, ruang kelas, dan tutur kata yang suci dari kata kotor.", penjelasan: "Al-Quddus mencintai kesucian lahir dan batin." }
              ]
            },
            {
              id: "pa-s1-b2-2",
              judul: "Meneladani As-Salam dalam Pergaulan Sehari-hari",
              ringkasan: "Sebagai hamba Allah, kita harus menebarkan salam dan kedamaian di mana pun berada. Rasulullah SAW menganjurkan kita menyapa sesama Muslim dengan ucapan: 'Assalamu'alaikum warahmatullahi wabarakatuh'. Ucapan salam adalah doa kebaikan dan keselamatan. Jangan pernah menciptakan pertengkaran atau menyakiti perasaan teman.",
              contoh: "Menyapa teman kelas dengan senyum ceria dan ucapan salam di depan gerbang sekolah.",
              contohSoal: [
                { tanya: "Apa hukum mengucap salam dan apa hukum menjawab salam?", jawab: "Mengucap salam hukumnya sunnah muakkad, menjawab salam hukumnya fardhu kifayah (wajib).", penjelasan: "Menjawab doa salam teman adalah kewajiban sesama muslim." },
                { tanya: "Sebutkan arti dari ucapan salam 'Assalamu'alaikum'!", jawab: "Semoga keselamatan dan kedamaian tercurah kepadamu.", penjelasan: "Salam adalah doa persaudaraan yang indah." }
              ]
            }
          ]
        },
        {
          id: "pa-s1-b3",
          nomor: 3,
          judul: "Indahnya Saling Menghargai dalam Keragaman",
          subbab: [
            {
              id: "pa-s1-b3-1",
              judul: "Toleransi Antarumat Beragama (Lakum Dinukum Waliyadin)",
              ringkasan: "Islam adalah agama rahmatan lil 'alamin yang membawa kasih sayang bagi seluruh semesta. Kita diwajibkan bersikap toleran dan menghargai teman atau tetangga yang berbeda keyakinan. Prinsip toleransi dalam Islam tertuang dalam surah Al-Kafirun: 'Untukmu agamamu, dan untukku agamaku'. Kita tidak boleh memaksakan keyakinan kepada orang lain.",
              contoh: "Menghormati teman yang sedang beribadah di rumah ibadahnya tanpa membuat gaduh.",
              contohSoal: [
                { tanya: "Apakah kita boleh mengganggu teman lain agama yang sedang menjalankan ibadahnya?", jawab: "Tidak boleh, kita wajib menghormati dan menjaga ketenangan mereka.", penjelasan: "Toleransi beragama menjamin ketentraman hidup bersama." },
                { tanya: "Di surah apakah terdapat ayat 'Lakum diinukum waliyadiin'?", jawab: "Surah Al-Kafirun ayat 6.", penjelasan: "Menegaskan batasan toleransi tanpa mencampuradukkan aqidah." }
              ]
            },
            {
              id: "pa-s1-b3-2",
              judul: "Berbuat Baik kepada Semua Makhluk Hidup",
              ringkasan: "Kasih sayang seorang muslim tidak hanya ditujukan kepada manusia, tetapi juga kepada hewan dan tumbuhan. Memberi makan kucing jalanan, menyirami bunga di taman kelas, dan tidak menyiksa binatang adalah amal sholeh yang dicintai Allah. Rasulullah menceritakan seorang wanita diampuni dosanya karena memberi minum anjing yang kehausan.",
              contoh: "Rafi memberi remah roti kepada burung merpati di pekarangan madrasah.",
              contohSoal: [
                { tanya: "Bolehkah kita memetik bunga tanaman sekolah lalu merusaknya secara sia-sia?", jawab: "Tidak boleh, karena merusak alam perbuatan tercela.", penjelasan: "Tumbuhan berdzikir dan memberi manfaat bagi bumi." },
                { tanya: "Apa sebutan ajaran Islam yang membawa rahmat dan kedamaian bagi seluruh alam?", jawab: "Rahmatan lil 'Alamin.", penjelasan: "Menjadi pelindung dan penebar kedamaian semesta." }
              ]
            }
          ]
        }
      ],
      2: [
        {
          id: "pa-s2-b1",
          nomor: 1,
          judul: "Menyambut Usia Baligh dengan Tanggung Jawab",
          subbab: [
            {
              id: "pa-s2-b1-1",
              judul: "Tanda-Tanda Baligh Menurut Pandangan Ilmu Fikih",
              ringkasan: "Baligh secara bahasa artinya sampai atau telah mencapai kedewasaan. Bagi anak laki-laki tanda baligh di antaranya adalah mengalami mimpi basah (ihtilam) atau genap berumur 15 tahun Hijriah. Bagi anak perempuan tandanya adalah mengalami menstruasi (haid) atau usia 15 tahun. Masuk usia baligh berarti seorang muslim menjadi mukallaf yang bertanggung jawab penuh atas segala amalnya.",
              contoh: "Siswa kelas 4 mulai belajar menjaga batas aurat dan tata cara bersuci mandi wajib.",
              contohSoal: [
                { tanya: "Apa sebutan bagi orang yang sudah baligh dan dikenai kewajiban syariat Islam?", jawab: "Mukallaf.", penjelasan: "Mukallaf wajib menjalankan perintah seperti sholat 5 waktu dan puasa." },
                { tanya: "Berapa umur maksimal tanda baligh jika anak belum mengalami tanda fisik?", jawab: "15 tahun (menurut perhitungan kalender Hijriah).", penjelasan: "Batas usia kedewasaan hukum Islam." }
              ]
            },
            {
              id: "pa-s2-b1-2",
              judul: "Kewajiban Setelah Memasuki Usia Baligh",
              ringkasan: "Setelah baligh, sholat lima waktu, puasa Ramadhan, dan menutup aurat menjadi kewajiban fardhu 'ain yang berdosa bila ditinggalkan. Setiap catatan kebaikan dan keburukan mulai dicatat sendiri oleh malaikat Raqib dan Atid. Anak baligh harus menjaga pergaulan, menghormati orang tua, dan rajin menuntut ilmu agama. Kedewasaan diiringi dengan akhlak yang terpuji.",
              contoh: "Anang membiasakan sholat subuh tepat waktu tanpa harus dibangunkan berulang kali.",
              contohSoal: [
                { tanya: "Siapakah malaikat yang bertugas mencatat amal kebaikan manusia?", jawab: "Malaikat Raqib.", penjelasan: "Malaikat Raqib di sebelah kanan, Atid di sebelah kiri." },
                { tanya: "Apakah sholat fardhu boleh ditinggalkan oleh orang yang sudah baligh?", jawab: "Tidak boleh, sholat fardhu adalah tiang agama yang wajib didirikan.", penjelasan: "Sholat adalah amalan pertama yang akan dihisab di akhirat." }
              ]
            }
          ]
        },
        {
          id: "pa-s2-b2",
          nomor: 2,
          judul: "Kisah Teladan Hijrah Nabi Muhammad SAW ke Madinah",
          subbab: [
            {
              id: "pa-s2-b2-1",
              judul: "Sebab dan Perjalanan Hijrah Menuju Madinah",
              ringkasan: "Kaum kafir Quraisy di Makkah semakin kejam menindas kaum muslimin dan bahkan merencanakan pembunuhan Rasulullah SAW. Allah kemudian memerintahkan Nabi Muhammad SAW untuk berhijrah ke kota Yatsrib (yang kemudian dinamai Madinah Munawwarah). Nabi ditemani oleh sahabat setia Abu Bakar Ash-Shiddiq dan sempat bersembunyi di Gua Tsur dari kejaran musuh.",
              contoh: "Mempelajari keteguhan hati Nabi saat bersembunyi di Gua Tsur dan dilindungi jaring laba-laba.",
              contohSoal: [
                { tanya: "Siapakah sahabat nabi yang menemani perjalanan hijrah ke Madinah?", jawab: "Sahabat Abu Bakar Ash-Shiddiq r.a.", penjelasan: "Abu Bakar adalah sahabat karib dan setia Rasulullah." },
                { tanya: "Di gua manakah Rasulullah dan Abu Bakar bersembunyi selama 3 hari dari kafir Quraisy?", jawab: "Gua Tsur.", penjelasan: "Terletak di sebelah selatan kota Makkah." }
              ]
            },
            {
              id: "pa-s2-b2-2",
              judul: "Persaudaraan Kaum Muhajirin dan Kaum Anshar",
              ringkasan: "Kaum Muhajirin adalah kaum muslimin yang hijrah dari Makkah dengan meninggalkan harta benda mereka. Kaum Anshar adalah penduduk asli Madinah yang menyambut dan menolong saudara Muhajirin dengan penuh keikhlasan. Nabi Muhammad SAW mempersaudarakan mereka sehingga ikatan ukhuwah Islamiyah menjadi sangat kokoh. Kebaikan kaum Anshar diabadikan di dalam Al-Qur'an.",
              contoh: "Bintang berbagi bekal roti dengan Anang yang kelupaan membawa uang saku.",
              contohSoal: [
                { tanya: "Apakah sebutan bagi kaum muslimin yang ikut hijrah dari Makkah ke Madinah?", jawab: "Kaum Muhajirin.", penjelasan: "Muhajirin berasal dari kata hijrah (orang yang berhijrah)." },
                { tanya: "Siapakah kaum Anshar itu?", jawab: "Penduduk muslim Madinah yang menolong kaum Muhajirin.", penjelasan: "Anshar artinya para penolong." }
              ]
            }
          ]
        },
        {
          id: "pa-s2-b3",
          nomor: 3,
          judul: "Adab Berbakti kepada Orang Tua dan Guru",
          subbab: [
            {
              id: "pa-s2-b3-1",
              judul: "Birrul Walidain (Berbakti kepada Ibu dan Bapak)",
              ringkasan: "Ibu telah mengandung kita selama sembilan bulan dan menyusui dengan penuh pengorbanan. Ayah bekerja keras membanting tulang mencari nafkah halal demi keluarga. Berbakti kepada orang tua (birrul walidain) adalah amal paling dicintai Allah setelah sholat tepat waktu. Ridho Allah bergantung pada ridho kedua orang tua. Jangan pernah berkata 'ah' atau membantah nasihat baik mereka.",
              contoh: "Mencium tangan ibu dan ayah sebelum melangkah berangkat ke sekolah.",
              contohSoal: [
                { tanya: "Bagaimana bunyi hadits tentang letak surga yang berkaitan dengan ibu?", jawab: "'Surga itu berada di bawah telapak kaki ibu.'", penjelasan: "Menegaskan penghormatan tertinggi seorang anak kepada ibunya." },
                { tanya: "Apakah boleh kita membentak kedua orang tua saat dimintai tolong?", jawab: "Sangat tidak boleh (haram), Al-Qur'an melarang berkata 'ah' atau 'cih'.", penjelasan: "Berkata sopan dan penuh kelemahlembutan kepada orang tua." }
              ]
            },
            {
              id: "pa-s2-b3-2",
              judul: "Menghormati Guru sebagai Pahlawan Ilmu",
              ringkasan: "Guru adalah orang tua kita di sekolah yang membimbing kita dari tidak tahu menjadi berilmu. Menghormati guru mendatangkan keberkahan pada ilmu yang kita pelajari. Dengarkanlah penjelasan guru dengan saksama dan kerjakan tugas dengan jujur. Murid yang taat dan memuliakan gurunya akan dimudahkan jalannya meraih cita-cita mulia.",
              contoh: "Mengucapkan terima kasih kepada Bapak/Ibu guru seusai pelajaran jam terakhir selesai.",
              contohSoal: [
                { tanya: "Mengapa kita harus mendoakan bapak dan ibu guru setiap selesai sholat?", jawab: "Sebagai wujud terima kasih atas ilmu dan bimbingan sabar yang diberikan.", penjelasan: "Doa murid untuk guru mengalirkan pahala kebaikan." },
                { tanya: "Sebutkan satu adab saat guru sedang menjelaskan materi di depan kelas!", jawab: "Memperhatikan dengan tenang dan tidak bermain sendiri.", penjelasan: "Adab menuntut ilmu adalah menyimak penjelasan guru." }
              ]
            }
          ]
        }
      ]
    }
  },
  "PJOK": {
    mapel: "PJOK",
    icon: "⚽",
    warna: "orange",
    semesters: {
      1: [
        {
          id: "pj-s1-b1",
          nomor: 1,
          judul: "Gerak Dasar Lokomotor, Non-Lokomotor, dan Manipulatif",
          subbab: [
            {
              id: "pj-s1-b1-1",
              judul: "Perbedaan Tiga Gerak Dasar Olahraga",
              ringkasan: "Gerak lokomotor adalah gerak berpindah tempat dari satu titik ke titik lain, seperti berlari, berjalan, dan melompat. Gerak non-lokomotor adalah gerak di tempat tanpa berpindah, seperti membungkuk, memutar badan, dan mengayun tangan. Gerak manipulatif adalah gerak yang melibatkan penguasaan benda atau alat, seperti menendang, melempar, dan menangkap bola. Ketiganya merupakan fondasi seluruh cabang olahraga.",
              contoh: "Berlari mengejar bola (lokomotor), menekuk lutut bersiap melompat (non-lokomotor), dan menyundul bola (manipulatif).",
              contohSoal: [
                { tanya: "Berlari santai mengelilingi lapangan termasuk gerak dasar apa?", jawab: "Gerak Lokomotor.", penjelasan: "Karena menyebabkan perpindahan tubuh dari satu tempat ke tempat lain." },
                { tanya: "Sebutkan contoh gerak manipulatif dalam permainan kasti!", jawab: "Melempar bola kasti, memukul bola dengan tongkat, dan menangkap bola.", penjelasan: "Gerak manipulatif melibatkan objek bola dan pemukul." }
              ]
            },
            {
              id: "pj-s1-b1-2",
              judul: "Pemanasan dan Pendinginan saat Olahraga",
              ringkasan: "Sebelum berolahraga kita wajib melakukan pemanasan (warming up) selama 5-10 menit. Pemanasan meningkatkan suhu tubuh, melenturkan otot, dan mencegah terjadinya cedera atau kram otot. Seusai olahraga, lakukanlah pendinginan (cooling down) untuk mengembalikan detak jantung ke ritme normal. Jangan langsung minum air es setelah berlari kencang.",
              contoh: "Senam peregangan leher, lengan, dan paha bersama guru PJOK di pagi Rabu ceria.",
              contohSoal: [
                { tanya: "Mengapa pemanasan sangat penting dilakukan sebelum berolahraga?", jawab: "Untuk menyiapkan otot tubuh dan mencegah risiko cedera atau kram.", penjelasan: "Otot menjadi elastis dan siap menerima beban kerja fisik." },
                { tanya: "Kapan gerakan pendinginan dilakukan?", jawab: "Setelah selesai melakukan aktivitas inti olahraga.", penjelasan: "Pendinginan meredakan ketegangan otot." }
              ]
            }
          ]
        },
        {
          id: "pj-s1-b2",
          nomor: 2,
          judul: "Permainan Bola Besar (Sepak Bola & Bola Voli Mini)",
          subbab: [
            {
              id: "pj-s1-b2-1",
              judul: "Teknik Menendang dan Menggiring Bola Sepak",
              ringkasan: "Sepak bola dimainkan oleh dua tim yang berusaha memasukkan bola ke gawang lawan. Teknik menendang bola dapat menggunakan kaki bagian dalam, punggung kaki, atau kaki bagian luar. Menggiring bola (dribbling) berguna untuk melewati hadangan lawan sambil menjaga bola tetap dekat dengan kaki. Bermain sepak bola melatih kerja sama tim dan sportivitas tinggi.",
              contoh: "Raihan mengoper bola datar dengan kaki bagian dalam tepat ke arah Anang.",
              contohSoal: [
                { tanya: "Bagian kaki manakah yang paling akurat untuk mengoper bola jarak pendek?", jawab: "Kaki bagian dalam.", penjelasan: "Permukaannya luas sehingga arah bola mudah dikontrol." },
                { tanya: "Apa sebutan sikap jujur dan mengakui keunggulan lawan dalam olahraga?", jawab: "Sportif (sportivitas).", penjelasan: "Menerima kemenangan dengan rendah hati dan kekalahan dengan lapang dada." }
              ]
            },
            {
              id: "pj-s1-b2-2",
              judul: "Passing Bawah pada Permainan Bola Voli Mini",
              ringkasan: "Bola voli mini dimainkan oleh 4 pemain di setiap regu di lapangan yang lebih kecil. Passing bawah dilakukan dengan merapatkan kedua telapak tangan dan meluruskan kedua siku. Lutut sedikit ditekuk lalu diluruskan saat perkenaan bola di lengan bawah. Passing yang sempurna menghasilkan bola lambung yang empuk untuk diumpan teman.",
              contoh: "Cinta dan Tara berpasangan mempraktikkan passing bawah bola voli busa.",
              contohSoal: [
                { tanya: "Berapa jumlah pemain tiap regu dalam permainan bola voli mini untuk anak SD?", jawab: "4 orang pemain.", penjelasan: "Standar voli mini SD fase B menggunakan 4 pemain per tim." },
                { tanya: "Di bagian manakah posisi bola seharusnya mengenai tangan saat passing bawah?", jawab: "Di atas pergelangan tangan pada lengan bagian bawah.", penjelasan: "Agar pantulan bola terarah dan tidak sakit di jari." }
              ]
            }
          ]
        },
        {
          id: "pj-s1-b3",
          nomor: 3,
          judul: "Kebugaran Jasmani dan Lari Cepat (Sprint)",
          subbab: [
            {
              id: "pj-s1-b3-1",
              judul: "Latihan Daya Tahan dan Kekuatan Otot",
              ringkasan: "Kebugaran jasmani adalah kesanggupan tubuh melakukan aktivitas sehari-hari tanpa merasakan lelah yang berlebihan. Kekuatan otot perut dapat dilatih dengan sit-up ringan. Otot lengan dan dada dilatih dengan push-up bertumpu lutut. Lari bolak-balik (shuttle run) memindahkan balok kayu melatih kelincahan dan kecepatan reaksi tubuh.",
              contoh: "Lomba memindahkan 5 buah bola kecil bolak-balik sejauh 10 meter.",
              contohSoal: [
                { tanya: "Latihan sit-up berguna untuk menguatkan otot bagian mana?", jawab: "Otot perut.", penjelasan: "Gerakan mengangkat punggung dari lantai mengontraksi otot perut." },
                { tanya: "Apa manfaat memiliki tubuh yang bugar bagi siswa kelas 4?", jawab: "Tidak mudah mengantuk saat belajar di kelas dan jarang sakit.", penjelasan: "Kebugaran meningkatkan konsentrasi dan stamina belajar." }
              ]
            },
            {
              id: "pj-s1-b3-2",
              judul: "Teknik Lari Cepat Jarak Pendek (Sprint 50 Meter)",
              ringkasan: "Lari cepat (sprint) mengutamakan kecepatan maksimal dari garis start hingga finis. Start yang digunakan adalah start jongkok dengan aba-aba: 'Bersedia, Siap, Ya!'. Badan condong ke depan, langkah kaki lebar dan cepat, serta ayunan lengan bertenaga seirama langkah. Jangan menoleh ke belakang saat mendekati garis finis.",
              contoh: "Lomba lari 50 meter di lintasan atletik SDN Banyurip.",
              contohSoal: [
                { tanya: "Start apa yang digunakan dalam perlombaan lari cepat jarak pendek?", jawab: "Start jongkok (crouch start).", penjelasan: "Start jongkok memberi daya tolak awal yang kuat." },
                { tanya: "Bagaimana posisi badan yang baik saat berlari sprint?", jawab: "Condong ke depan dengan pandangan lurus ke garis finis.", penjelasan: "Posisi condong membelah hambatan angin dan mempercepat tolakan." }
              ]
            }
          ]
        }
      ],
      2: [
        {
          id: "pj-s2-b1",
          nomor: 1,
          judul: "Senam Lantai dan Keseimbangan Tubuh",
          subbab: [
            {
              id: "pj-s2-b1-1",
              judul: "Sikap Lilin dan Gerak Bertumpu",
              ringkasan: "Sikap lilin adalah gerakan senam lantai dengan posisi tidur telentang lalu mengangkat kedua kaki lurus rapat ke atas. Pinggang ditopang oleh kedua telapak tangan dengan siku menempel matras. Gerakan ini melatih kekuatan otot perut dan keseimbangan tubuh. Selalu lakukan latihan senam di atas matras empuk dengan pengawasan guru.",
              contoh: "Melakukan sikap lilin selama hitungan 10 detik di atas matras kelas.",
              contohSoal: [
                { tanya: "Alat pengaman apa yang wajib digunakan saat melakukan senam lantai?", jawab: "Matras senam.", penjelasan: "Matras meredam benturan tubuh dan mencegah cedera kepala/tulang belakang." },
                { tanya: "Bagian tubuh mana yang menopang pinggang saat melakukan sikap lilin?", jawab: "Kedua telapak tangan dengan siku bertumpu di lantai.", penjelasan: "Tangan menahan berat panggul agar kaki tetap tegak." }
              ]
            },
            {
              id: "pj-s2-b1-2",
              judul: "Guling Depan (Forward Roll) yang Benar",
              ringkasan: "Guling depan diawali dengan posisi jongkok menghadap matras, kedua tangan diletakkan di matras selebar bahu. Masukkan kepala ke dalam hingga dagu menempel rapat di dada. Gulingkan badan ke depan dengan tengkuk (leher belakang) menyentuh matras terlebih dahulu, bukan puncak kepala. Akhiri dengan sikap jongkok berdiri tegak.",
              contoh: "Rafa melakukan guling depan dengan dagu menempel dada dan mendarat sempurna.",
              contohSoal: [
                { tanya: "Bagian tubuh mana yang pertama kali menyentuh matras saat guling depan?", jawab: "Tengkuk (leher bagian belakang).", penjelasan: "Bukan dahi atau ubun-ubun kepala agar leher tidak terkilir." },
                { tanya: "Mengapa dagu harus ditempelkan rapat ke dada saat mengguling?", jawab: "Untuk membulatkan punggung dan melindungi leher dari cedera.", penjelasan: "Punggung bulat memudahkan putaran guling yang mulus." }
              ]
            }
          ]
        },
        {
          id: "pj-s2-b2",
          nomor: 2,
          judul: "Pola Hidup Bersih, Sehat, dan Gizi Seimbang",
          subbab: [
            {
              id: "pj-s2-b2-1",
              judul: "Piring Makanku: Gizi Seimbang",
              ringkasan: "Tubuh anak kelas 4 membutuhkan asupan gizi seimbang untuk tumbuh tinggi dan pintar. Konsep 'Piring Makanku' membagi piring makan menjadi: 1/3 makanan pokok (nasi/umbi), 1/3 sayuran hijau, 1/6 lauk pauk sumber protein (ikan/tempe/telur), dan 1/6 buah-buahan manis segar. Minumlah air putih minimal 8 gelas sehari dan kurangi jajan sembarangan.",
              contoh: "Membawa bekal nasi, telur dadar, tumis bayam, dan potongan pisang dari rumah.",
              contohSoal: [
                { tanya: "Sebutkan zat gizi yang berfungsi sebagai zat pembangun dan memperbaiki sel tubuh!", jawab: "Protein (ditemukan pada ikan, telur, tahu, tempe, daging).", penjelasan: "Protein sangat penting untuk pertumbuhan masa anak-anak." },
                { tanya: "Berapa gelas air putih yang dianjurkan untuk diminum setiap hari?", jawab: "Minimal 8 gelas per hari (sekitar 2 liter).", penjelasan: "Mencegah dehidrasi dan menjaga kinerja ginjal." }
              ]
            },
            {
              id: "pj-s2-b2-2",
              judul: "Mencegah Penyakit Menular dan Menjaga Kebersihan Diri",
              ringkasan: "Kuman dan virus mudah menular jika kita tidak menjaga kebersihan diri. Biasakan mencuci tangan dengan sabun di air mengalir sebelum makan dan sesudah buang air kecil/besar. Potong kuku tangan secara teratur agar tidak menjadi sarang telur cacing. Gantilah pakaian dalam dan seragam yang kotor oleh keringat agar kulit bebas dari gatal-gatal.",
              contoh: "Mencuci tangan 6 langkah menggunakan sabun di wastafel sekolah.",
              contohSoal: [
                { tanya: "Kapan waktu paling penting kita wajib mencuci tangan memakai sabun?", jawab: "Sebelum makan dan setelah dari toilet/kamar mandi.", penjelasan: "Mencegah kuman diare masuk ke saluran pencernaan." },
                { tanya: "Mengapa kita tidak boleh meminjamkan sikat gigi kepada teman?", jawab: "Karena dapat menularkan kuman dan bakteri mulut/gusi.", penjelasan: "Sikat gigi adalah peralatan kebersihan pribadi." }
              ]
            }
          ]
        },
        {
          id: "pj-s2-b3",
          nomor: 3,
          judul: "Keselamatan di Kolam Renang dan Aktivitas Air",
          subbab: [
            {
              id: "pj-s2-b3-1",
              judul: "Tata Tertib Keselamatan di Kolam Renang",
              ringkasan: "Bermain air dan berenang sangat menyenangkan namun memiliki risiko bahaya jika kita ceroboh. Jangan pernah berlari-lari di tepi kolam karena lantainya sangat licin dan bisa terpeleset. Siswa yang belum mahir berenang wajib berada di kolam dangkal dan menggunakan pelampung. Patuhi selalu instruksi peluit guru dan penjaga kolam (lifeguard).",
              contoh: "Berjalan hati-hati di pinggir kolam dan menggunakan papan pelampung busa.",
              contohSoal: [
                { tanya: "Mengapa kita dilarang berlari di tepi kolam renang?", jawab: "Karena lantai tepi kolam basah dan licin sehingga rawan jatuh cedera.", penjelasan: "Bahaya benturan kepala pada lantai keramik kolam." },
                { tanya: "Bagi pemula, di kolam bagian mana sebaiknya belajar berenang?", jawab: "Di kolam yang dangkal (air sebatas dada anak).", penjelasan: "Kaki masih bisa menjejak lantai kolam dengan aman." }
              ]
            },
            {
              id: "pj-s2-b3-2",
              judul: "Gerak Meluncur dan Bernapas di Air",
              ringkasan: "Gerak meluncur adalah gerakan dasar meluncurkan tubuh lurus sejajar di permukaan air tanpa menggerakkan kaki. Tolakkan kedua kaki kuat-kuat pada dinding kolam, rentangkan kedua tangan lurus ke depan menjepit telinga. Menghirup udara dilakukan lewat mulut saat kepala muncul di atas air, dan membuang napas lewat hidung/mulut di dalam air (membentuk gelembung udara).",
              contoh: "Meluncur sejauh 5 meter di kolam renang anak.",
              contohSoal: [
                { tanya: "Lewat organ manakah kita mengambil napas saat berenang?", jawab: "Lewat mulut saat kepala terangkat di atas permukaan air.", penjelasan: "Menghirup lewat mulut dapat mengambil volume udara banyak dengan cepat." },
                { tanya: "Bagaimana posisi tubuh yang baik saat melakukan gerakan meluncur?", jawab: "Streamline (lurus horizontal sejajar dengan permukaan air).", penjelasan: "Posisi streamline meminimalkan tahanan air." }
              ]
            }
          ]
        }
      ]
    }
  },
  "Komputer": {
    mapel: "Komputer",
    icon: "💻",
    warna: "indigo",
    semesters: {
      1: [
        {
          id: "kom-s1-b1",
          nomor: 1,
          judul: "Mengenal Perangkat Keras Komputer (Hardware)",
          subbab: [
            {
              id: "kom-s1-b1-1",
              judul: "Bagian Utama: Monitor, CPU, Keyboard, dan Mouse",
              ringkasan: "Komputer tersusun dari perangkat keras (hardware) yang bisa kita lihat dan sentuh. Monitor berfungsi menampilkan gambar visual dan teks. CPU (Central Processing Unit) adalah otak komputer yang memproses semua perintah. Keyboard digunakan untuk mengetik huruf, angka, dan simbol. Mouse digunakan untuk menggerakkan kursor panah dan memilih menu di layar.",
              contoh: "Di laboratorium komputer SDN Banyurip, terdapat 15 unit PC lengkap dengan headset.",
              contohSoal: [
                { tanya: "Bagian komputer manakah yang sering disebut sebagai otak komputer?", jawab: "CPU (Central Processing Unit) / Prosesor.", penjelasan: "CPU mengolah seluruh perhitungan dan instruksi program." },
                { tanya: "Apa fungsi tombol spasi panjang pada keyboard?", jawab: "Memberi jarak kosong antar kata yang diketik.", penjelasan: "Spasi memisahkan kata agar teks rapi dan terbaca." }
              ]
            },
            {
              id: "kom-s1-b1-2",
              judul: "Perangkat Masukan (Input) dan Keluaran (Output)",
              ringkasan: "Perangkat masukan (input device) memasukkan data ke komputer, seperti keyboard, mouse, scanner, dan mikrofon. Perangkat keluaran (output device) menampilkan atau mengeluarkan hasil olahan data, seperti monitor, speaker suara, dan printer pencetak kertas. Ada juga media penyimpan data seperti Flashdisk yang praktis dibawa ke mana-mana.",
              contoh: "Menghubungkan flashdisk ke port USB laptop untuk menyalin file tugas rangkuman.",
              contohSoal: [
                { tanya: "Printer termasuk perangkat masukan (input) atau keluaran (output)?", jawab: "Perangkat keluaran (output device).", penjelasan: "Printer mencetak data digital menjadi bentuk fisik kertas." },
                { tanya: "Alat apa yang kita gunakan untuk merekam suara kita ke dalam komputer?", jawab: "Mikrofon (microphone).", penjelasan: "Mikrofon mengubah getaran suara menjadi sinyal digital input." }
              ]
            }
          ]
        },
        {
          id: "kom-s1-b2",
          nomor: 2,
          judul: "Mengetik Dokumen Ceria dengan Word Processor",
          subbab: [
            {
              id: "kom-s1-b2-1",
              judul: "Mengatur Huruf: Bold, Italic, Underline, dan Warna",
              ringkasan: "Program pengolah kata (seperti Microsoft Word atau Google Docs) memudahkan kita mengetik cerita dan tugas sekolah. Ikon Bold (tebal) digunakan untuk menegaskan judul. Ikon Italic (miring) digunakan untuk kata asing atau istilah khusus. Ikon Underline (garis bawah) memberi garis di bawah teks. Kita juga bisa mengganti jenis font dan mewarnai tulisan sesuai selera.",
              contoh: "Mengetik judul karangan: 'Pengalaman Liburanku' dengan huruf Arial ukuran 18 warna biru tua tebal.",
              contohSoal: [
                { tanya: "Kombinasi tombol keyboard (shortcut) apa untuk menebalkan teks yang dipilih?", jawab: "Ctrl + B (Bold).", penjelasan: "Ctrl + B adalah pintasan cepat menebalkan tulisan." },
                { tanya: "Apa fungsi ikon 'Font Size' pada menu program pengolah kata?", jawab: "Mengubah besar atau kecilnya ukuran huruf teks.", penjelasan: "Angka ukuran semakin besar menghasilkan huruf semakin besar." }
              ]
            },
            {
              id: "kom-s1-b2-2",
              judul: "Menyimpan File dan Membuka Kembali (Save & Open)",
              ringkasan: "Setelah selesai mengetik, kita wajib menyimpan file pekerjaan kita agar tidak hilang saat komputer dimatikan. Klik menu File lalu pilih Save atau tekan tombol Ctrl + S. Berilah nama file yang jelas dan simpan di folder dokumen kelas. Bila ingin melanjutkan mengetik di lain waktu, klik menu Open dan cari nama file tersebut.",
              contoh: "Menyimpan file tugas dengan nama: 'Puisi_Krisna_Kelas4.docx'.",
              contohSoal: [
                { tanya: "Apa tombol pintas cepat (shortcut) untuk menyimpan dokumen di komputer?", jawab: "Ctrl + S (Save).", penjelasan: "Save menyimpan perubahan file ke media penyimpanan." },
                { tanya: "Mengapa nama file sebaiknya diberi nama yang jelas dan sesuai isi dokumen?", jawab: "Agar mudah dicari kembali saat dibutuhkan di kemudian hari.", penjelasan: "Pemberian nama file teratur adalah manajemen data yang baik." }
              ]
            }
          ]
        },
        {
          id: "kom-s1-b3",
          nomor: 3,
          judul: "Menggambar Digital dengan Paint dan Bentuk Vektor",
          subbab: [
            {
              id: "kom-s1-b3-1",
              judul: "Menggunakan Alat Kuas, Pensil, dan Cat Tumpah (Fill)",
              ringkasan: "Aplikasi Paint adalah sarana belajar melukis digital yang sangat asyik bagi anak SD. Alat Brush (kuas) memiliki berbagai macam ujung goresan, mulai dari krayon, cat air, hingga spidol. Alat Fill with color (kaleng cat tumpah) mewarnai seluruh bidang tertutup dengan sekali klik. Bila garis gambar bocor, warna cat akan meluber ke mana-mana, maka pastikan garisnya rapat.",
              contoh: "Menggambar pemandangan gunung dan mewarnai langit biru dengan alat Fill with color.",
              contohSoal: [
                { tanya: "Apa yang terjadi jika kita menggunakan alat Fill with color pada gambar yang garisnya bocor (tidak tertutup rapat)?", jawab: "Warnanya akan meluber memenuhi seluruh kanvas gambar.", penjelasan: "Alat fill mengalir ke seluruh area yang terhubung tanpa sekat batas." },
                { tanya: "Tombol pintas apa yang digunakan untuk membatalkan kesalahan gambar terakhir (Undo)?", jawab: "Ctrl + Z.", penjelasan: "Undo mengembalikan kanvas ke kondisi satu langkah sebelumnya." }
              ]
            },
            {
              id: "kom-s1-b3-2",
              judul: "Membuat Gambar Rumah Menggunakan Tool Shapes",
              ringkasan: "Tool Shapes menyediakan berbagai bentuk geometri otomatis seperti kotak persegi, lingkaran, segitiga, dan bintang. Kita bisa membuat rumah yang rapi dengan memadukan segitiga sebagai atap dan persegi panjang sebagai dinding dan pintu. Tahan tombol Shift pada keyboard saat menggambar agar lingkaran atau perseginya terbentuk simetris sempurna.",
              contoh: "Membuat bendera merah putih menggunakan dua balok shapes persegi panjang berdampingan.",
              contohSoal: [
                { tanya: "Tombol keyboard apa yang ditahan agar gambar lingkaran di Paint bulat sempurna?", jawab: "Tombol Shift.", penjelasan: "Menahan Shift mengunci rasio tinggi dan lebar objek agar proporsional." },
                { tanya: "Bentuk dasar apa pada menu shapes yang paling cocok untuk gambar roda mobil?", jawab: "Lingkaran / Oval.", penjelasan: "Bentuk oval dengan rasio sama menghasilkan lingkaran bulat." }
              ]
            }
          ]
        }
      ],
      2: [
        {
          id: "kom-s2-b1",
          nomor: 1,
          judul: "Internet Sehat, Aman, dan Bersahabat (Insan Cerdas)",
          subbab: [
            {
              id: "kom-s2-b1-1",
              judul: "Aturan Aman Berselancar di Dunia Maya",
              ringkasan: "Internet menghubungkan komputer di seluruh dunia dan membuka jendela ilmu pengetahuan yang luas. Namun anak-anak harus berhati-hati saat berselancar di internet. Jangan pernah membagikan informasi pribadi seperti alamat rumah, nomor HP orang tua, atau password akun kepada orang yang tidak dikenal. Selalu mintalah pendampingan orang tua atau bapak/ibu guru saat mencari informasi.",
              contoh: "Mencari materi tentang daur hidup kupu-kupu di situs edukasi bersama guru di kelas.",
              contohSoal: [
                { tanya: "Bolehkah kita memberikan kata sandi (password) akun belajar kita kepada orang asing di internet?", jawab: "Sangat tidak boleh, password adalah rahasia pribadi.", penjelasan: "Menghindari pencurian akun dan penyalahgunaan data." },
                { tanya: "Apa yang harus dilakukan jika melihat konten yang menakutkan atau tidak pantas di internet?", jawab: "Segera tutup layar dan laporkan kepada orang tua atau guru.", penjelasan: "Orang dewasa dapat memblokir situs berbahaya tersebut." }
              ]
            },
            {
              id: "kom-s2-b1-2",
              judul: "Etika Bertutur Kata di Media Sosial (Netiket)",
              ringkasan: "Netiket adalah sopan santun dalam berkomunikasi melalui internet dan media sosial. Kita harus selalu menggunakan bahasa yang santun, ramah, dan tidak boleh mengejek atau merundung teman (cyberbullying). Jangan menyebarkan berita bohong (hoaks) yang belum tentu kebenarannya. Jadilah anak bangsa yang menebarkan semangat positif dan persahabatan di dunia maya.",
              contoh: "Menulis komentar pujian: 'Gambarmu bagus sekali Cinta!' pada forum karya kelas.",
              contohSoal: [
                { tanya: "Apakah arti dari istilah 'cyberbullying'?", jawab: "Perundungan, ejekan, atau intimidasi yang dilakukan melalui media digital/internet.", penjelasan: "Cyberbullying melukai hati teman dan melanggar hukum serta etika." },
                { tanya: "Apa yang harus kita lakukan sebelum membagikan sebuah kabar di grup kelas?", jawab: "Memeriksa kebenarannya terlebih dahulu (saring sebelum sharing).", penjelasan: "Mencegah tersebarnya hoaks yang merugikan banyak orang." }
              ]
            }
          ]
        },
        {
          id: "kom-s2-b2",
          nomor: 2,
          judul: "Pengenalan Berpikir Komputasional dan Algoritma Sederhana",
          subbab: [
            {
              id: "kom-s2-b2-1",
              judul: "Apa itu Algoritma dan Dekomposisi?",
              ringkasan: "Berpikir komputasional adalah cara memecahkan masalah besar secara logis, runtut, dan terstruktur. Dekomposisi adalah memecah masalah besar menjadi bagian-bagian kecil yang lebih mudah dikerjakan. Algoritma adalah urutan langkah-langkah logis dan teratur untuk menyelesaikan suatu pekerjaan dari awal sampai akhir. Komputer bekerja menjalankan algoritma yang kita berikan.",
              contoh: "Algoritma menyikat gigi: 1. Ambil sikat, 2. Beri pasta gigi, 3. Gosok gigi memutar, 4. Kumur air bersih.",
              contohSoal: [
                { tanya: "Apakah sebutan untuk urutan langkah-langkah logis dalam memecahkan masalah?", jawab: "Algoritma.", penjelasan: "Algoritma memandu proses kerja secara runtut." },
                { tanya: "Mengapa masalah besar perlu dipecah menjadi bagian-bagian kecil (dekomposisi)?", jawab: "Agar masalah lebih mudah dipahami dan diselesaikan langkah demi langkah.", penjelasan: "Dekomposisi adalah pilar berpikir komputasional." }
              ]
            },
            {
              id: "kom-s2-b2-2",
              judul: "Mengenal Pola (Pattern Recognition) dalam Permainan",
              ringkasan: "Pengenalan pola adalah kemampuan menemukan kesamaan atau pola berulang dari beberapa masalah. Misalnya mengenali pola lampu lalu lintas yang selalu berputar: Merah - Hijau - Kuning - Merah. Dengan mengenali pola, kita bisa memprediksi kejadian berikutnya dan membuat solusi yang cerdas secara otomatis. Ini adalah bekal berharga untuk menjadi programmer masa depan.",
              contoh: "Menyelesaikan teka-teki susun balok warna: Merah, Biru, Merah, Biru, ... maka berikutnya pasti Merah.",
              contohSoal: [
                { tanya: "Lanjutkan pola angka ini: 2, 4, 6, 8, ...?", jawab: "10", penjelasan: "Polanya adalah kelipatan / ditambah 2 setiap langkah." },
                { tanya: "Apa keuntungan menemukan pola saat mengerjakan soal latihan matematika?", jawab: "Dapat menyelesaikan soal sejenis dengan cepat menggunakan rumus yang sama.", penjelasan: "Pola mempermudah penemuan rumus penyelesaian." }
              ]
            }
          ]
        },
        {
          id: "kom-s2-b3",
          nomor: 3,
          judul: "Belajar Coding Blok Visual (Kucing Menari)",
          subbab: [
            {
              id: "kom-s2-b3-1",
              judul: "Mengenal Sprite dan Blok Kode Gerak",
              ringkasan: "Belajar pemrograman untuk anak SD tidak perlu mengetik kode yang rumit, melainkan cukup menyusun balok-balok visual (seperti Scratch). Tokoh atau karakter dalam program disebut sebagai Sprite. Blok 'Move 10 steps' memerintahkan sprite melangkah maju. Blok 'Say Hello' membuat sprite berbicara dengan balon teks di layar. Menyusun balok seperti bermain lego yang mengasyikkan.",
              contoh: "Membuat sprite maskot Nusa bergerak maju 20 langkah saat bendera hijau diklik.",
              contohSoal: [
                { tanya: "Apakah sebutan bagi karakter atau objek gambar di dalam aplikasi pemrograman blok visual?", jawab: "Sprite.", penjelasan: "Sprite adalah objek visual yang dapat diprogram gerak dan suaranya." },
                { tanya: "Blok kode apa yang biasanya dipakai untuk memulai jalannya animasi?", jawab: "Blok 'When green flag clicked' (Ketika bendera hijau diklik).", penjelasan: "Bendera hijau adalah pemicu awal event eksekusi program." }
              ]
            },
            {
              id: "kom-s2-b3-2",
              judul: "Menggunakan Blok Pengulangan (Loop / Repeat)",
              ringkasan: "Jika kita ingin sprite melangkah maju mundur sebanyak 10 kali, kita tidak perlu memasang 10 blok yang sama berulang-ulang. Kita cukup memasukkan blok perintah tersebut ke dalam balok pengulangan 'Repeat 10'. Komputer akan mengulanginya secara otomatis tanpa pernah lelah. Pengulangan ini membuat kode program kita menjadi ringkas, cerdas, dan efisien.",
              contoh: "Membuat animasi lampu kelap-kelip dengan blok 'Repeat 5 times': nyala 1 detik, mati 1 detik.",
              contohSoal: [
                { tanya: "Apa fungsi blok 'Repeat' dalam pemrograman komputer?", jawab: "Mengulang perintah kode di dalamnya sejumlah kali secara otomatis.", penjelasan: "Looping menghemat baris kode dan mengotomatiskan aksi." },
                { tanya: "Mengapa belajar coding sangat bermanfaat bagi siswa sejak dini?", jawab: "Melatih logika berpikir, kreativitas, pemecahan masalah, dan ketekunan.", penjelasan: "Coding mengasah keterampilan abad ke-21." }
              ]
            }
          ]
        }
      ]
    }
  }
};
