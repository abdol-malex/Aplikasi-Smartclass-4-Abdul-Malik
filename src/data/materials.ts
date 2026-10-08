export interface PracticeQuestion {
  tanya: string;
  jawab: string;
  penjelasan: string;
}

export interface SubBab {
  id: string;
  judul: string;
  ringkasan: string; // 3-5 kalimat
  contoh: string;    // 1 contoh kontekstual
  contohSoal: PracticeQuestion[]; // 2 contoh soal
}

export interface Bab {
  id: string;
  nomor: number;
  judul: string;
  subbab: SubBab[];
}

export interface MapelMateri {
  mapel: string;
  icon: string;
  warna: string;
  semesters: {
    1: Bab[];
    2: Bab[];
  };
}

export const INITIAL_MATERIALS: Record<string, MapelMateri> = {
  "Pendidikan Pancasila": {
    mapel: "Pendidikan Pancasila",
    icon: "🇮🇩",
    warna: "red",
    semesters: {
      1: [
        {
          id: "pp-s1-b1",
          nomor: 1,
          judul: "Mengenal Simbol dan Nilai Pancasila",
          subbab: [
            {
              id: "pp-s1-b1-1",
              judul: "Makna Lambang Garuda Pancasila",
              ringkasan: "Garuda Pancasila adalah lambang negara Republik Indonesia yang gagah perkasa. Pada dada burung Garuda terdapat perisai yang memuat lima simbol sila Pancasila. Di cengkeraman kakinya terdapat pita bertuliskan semboyan Bhinneka Tunggal Ika. Semboyan ini mengingatkan kita untuk selalu rukun meski berbeda suku dan agama.",
              contoh: "Di dinding ruang kelas 4 SDN Banyurip, terpasang gambar Garuda Pancasila diapit foto Presiden dan Wakil Presiden.",
              contohSoal: [
                {
                  tanya: "Apa arti semboyan Bhinneka Tunggal Ika?",
                  jawab: "Berbeda-beda tetapi tetap satu jua.",
                  penjelasan: "Semboyan ini diambil dari Kitab Sutasoma karangan Mpu Tantular."
                },
                {
                  tanya: "Sila pertama dilambangkan dengan simbol apa?",
                  jawab: "Bintang emas berlatar hitam.",
                  penjelasan: "Bintang melambangkan cahaya rohani dari Tuhan Yang Maha Esa bagi setiap manusia."
                }
              ]
            },
            {
              id: "pp-s1-b1-2",
              judul: "Penerapan Sila Pancasila di Rumah dan Sekolah",
              ringkasan: "Pancasila bukan hanya untuk dihafal saat upacara, tetapi wajib diamalkan setiap hari. Sila pertama mengajarkan kita berdoa sebelum belajar dan menghormati teman beribadah. Sila kedua mengajak kita tolong-menolong tanpa membeda-bedakan. Dengan mengamalkan Pancasila, suasana sekolah dan rumah menjadi damai.",
              contoh: "Anang membantu Bintang meminjamkan pensil saat pelajaran berlangsung.",
              contohSoal: [
                {
                  tanya: "Berdoa bersama sebelum pelajaran dimulai adalah contoh pengamalan sila ke berapa?",
                  jawab: "Sila Pertama (Ketuhanan Yang Maha Esa).",
                  penjelasan: "Berdoa merupakan wujud ketaatan kepada Tuhan Yang Maha Esa."
                },
                {
                  tanya: "Menghargai hasil karya gambar teman sekelas termasuk cerminan sila ke berapa?",
                  jawab: "Sila Kedua dan Kelima.",
                  penjelasan: "Menghargai sesama manusia dan hasil karya orang lain mencerminkan kemanusiaan dan keadilan."
                }
              ]
            }
          ]
        },
        {
          id: "pp-s1-b2",
          nomor: 2,
          judul: "Hak dan Kewajiban sebagai Warga Sekolah",
          subbab: [
            {
              id: "pp-s1-b2-1",
              judul: "Kewajiban Anak di Sekolah",
              ringkasan: "Kewajiban adalah sesuatu yang harus kita laksanakan dengan penuh tanggung jawab. Di sekolah, murid berkewajiban mematuhi tata tertib, mendengarkan guru, dan menjaga kebersihan kelas. Sebelum menuntut hak, kita harus menunaikan kewajiban terlebih dahulu. Siswa yang tertib akan belajar dengan tenang dan nyaman.",
              contoh: "Melaksanakan piket kebersihan kelas bersama teman regu di pagi hari sebelum bel berbunyi.",
              contohSoal: [
                {
                  tanya: "Apa yang harus didahulukan antara hak dan kewajiban?",
                  jawab: "Kewajiban harus didahulukan daripada hak.",
                  penjelasan: "Keseimbangan hak dan kewajiban tercapai jika tanggung jawab dijalankan terlebih dahulu."
                },
                {
                  tanya: "Sebutkan satu kewajiban murid saat guru sedang menjelaskan materi!",
                  jawab: "Mendengarkan dengan tenang dan tidak mengobrol.",
                  penjelasan: "Mendengarkan guru adalah bentuk penghormatan dan tanggung jawab belajar."
                }
              ]
            },
            {
              id: "pp-s1-b2-2",
              judul: "Hak Anak di Sekolah",
              ringkasan: "Hak adalah segala sesuatu yang patut kita terima setelah menjalankan kewajiban. Setiap siswa di SDN Banyurip berhak mendapatkan bimbingan guru dan fasilitas belajar yang bersih. Siswa juga berhak menyampaikan pendapat dengan santun. Hak dinikmati bersama dengan tetap menghormati hak teman lain.",
              contoh: "Cinta berhak meminjam buku cerita di pojok baca perpustakaan sekolah.",
              contohSoal: [
                {
                  tanya: "Apakah murid berhak bertanya jika belum memahami materi?",
                  jawab: "Ya, berhak.",
                  penjelasan: "Mendapatkan bimbingan dan penjelasan guru adalah hak setiap siswa."
                },
                {
                  tanya: "Kapan siswa boleh menikmati jam istirahat sekolah?",
                  jawab: "Saat bel tanda istirahat berbunyi sesuai jadwal.",
                  penjelasan: "Waktu istirahat adalah hak siswa untuk melepas lelah dan makan bekal sehat."
                }
              ]
            }
          ]
        },
        {
          id: "pp-s1-b3",
          nomor: 3,
          judul: "Musyawarah dan Mufakat dalam Kehidupan Sehari-hari",
          subbab: [
            {
              id: "pp-s1-b3-1",
              judul: "Prinsip Musyawarah untuk Mufakat",
              ringkasan: "Musyawarah adalah kegiatan membicarakan suatu masalah bersama untuk mencapai keputusan bersama atau mufakat. Sila keempat Pancasila mengajarkan kita untuk tidak memaksakan kehendak sendiri. Setiap anak boleh berbicara santun mengutarakan idenya. Bila kata mufakat tercapai, semua warga kelas wajib melaksanakannya dengan ikhlas.",
              contoh: "Pemilihan ketua kelas 4 SDN Banyurip secara demokratis dan penuh kekeluargaan.",
              contohSoal: [
                {
                  tanya: "Apa yang dimaksud dengan mufakat?",
                  jawab: "Kesepakatan bersama yang disetujui semua peserta musyawarah.",
                  penjelasan: "Mufakat dicapai setelah mendengarkan dan mempertimbangkan berbagai pendapat."
                },
                {
                  tanya: "Bagaimana sikap kita bila usulan kita tidak terpilih dalam musyawarah?",
                  jawab: "Menerima dengan lapang dada dan tetap mendukung keputusan bersama.",
                  penjelasan: "Kepentingan bersama lebih utama daripada pendapat pribadi."
                }
              ]
            },
            {
              id: "pp-s1-b3-2",
              judul: "Menghargai Keberagaman Pendapat",
              ringkasan: "Di kelas 4, setiap teman bisa memiliki pendapat atau usulan yang berbeda. Perbedaan pendapat bukan alasan untuk bermusuhan, melainkan memperkaya solusi. Kita harus mendengarkan teman yang sedang berbicara sampai selesai tanpa memotongnya. Sikap saling menghargai membuat kelas kita rukun dan hangat.",
              contoh: "Mendengarkan ide Candra tentang rute jalan sehat tanpa langsung mencelanya.",
              contohSoal: [
                {
                  tanya: "Bolehkah kita memotong pembicaraan teman yang sedang menyampaikan usulan?",
                  jawab: "Tidak boleh, tunggu sampai teman selesai bicara.",
                  penjelasan: "Menghargai giliran bicara adalah adab berdiskusi yang santun."
                },
                {
                  tanya: "Sila Pancasila manakah yang mengutamakan musyawarah?",
                  jawab: "Sila Keempat.",
                  penjelasan: "Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan."
                }
              ]
            }
          ]
        }
      ],
      2: [
        {
          id: "pp-s2-b1",
          nomor: 1,
          judul: "Keragaman Budaya Negeriku",
          subbab: [
            {
              id: "pp-s2-b1-1",
              judul: "Suku dan Rumah Adat di Indonesia",
              ringkasan: "Indonesia memiliki lebih dari 300 kelompok suku bangsa dari Sabang sampai Merauke. Setiap suku memiliki pakaian adat, tarian tradisional, dan rumah adat yang unik. Keanekaragaman ini merupakan kekayaan bangsa yang harus kita banggakan. Kita harus saling menghormati tradisi teman yang berbeda asal daerahnya.",
              contoh: "Rumah Joglo di Jawa Tengah, Rumah Gadang di Minangkabau, dan Honai di Papua.",
              contohSoal: [
                {
                  tanya: "Sebutkan nama rumah adat khas Minangkabau!",
                  jawab: "Rumah Gadang.",
                  penjelasan: "Rumah Gadang berciri atap melengkung runcing seperti tanduk kerbau."
                },
                {
                  tanya: "Bagaimana sikap yang baik saat melihat teman memakai pakaian adat daerah lain?",
                  jawab: "Memuji dan menghargai keindahan pakaian tersebut.",
                  penjelasan: "Keragaman busana adat adalah kekayaan warisan leluhur bangsa kita."
                }
              ]
            },
            {
              id: "pp-s2-b1-2",
              judul: "Menghargai Bahasa Daerah",
              ringkasan: "Selain Bahasa Indonesia sebagai bahasa persatuan, kita memiliki ratusan bahasa daerah. Di Jawa Tengah, siswa belajar Bahasa Jawa dengan unggah-ungguh yang sopan. Menghargai bahasa daerah teman dari suku lain mempererat persaudaraan. Bahasa daerah mencerminkan budi pekerti luhur bangsa.",
              contoh: "Menyapa guru dengan 'Sugeng Enjang' dan teman baru dengan ramah.",
              contohSoal: [
                {
                  tanya: "Apa fungsi Bahasa Indonesia dalam kehidupan berbangsa?",
                  jawab: "Sebagai bahasa nasional dan bahasa persatuan antarsuku.",
                  penjelasan: "Bahasa Indonesia menyatukan komunikasi seluruh rakyat dari berbagai suku."
                },
                {
                  tanya: "Apakah kita boleh mengejek logat bicara teman yang baru pindah dari daerah lain?",
                  jawab: "Tidak boleh, kita harus menghargainya.",
                  penjelasan: "Setiap logat daerah memiliki keunikan budaya masing-masing."
                }
              ]
            }
          ]
        },
        {
          id: "pp-s2-b2",
          nomor: 2,
          judul: "Keutuhan Negara Kesatuan Republik Indonesia (NKRI)",
          subbab: [
            {
              id: "pp-s2-b2-1",
              judul: "Cinta Tanah Air dan Bangga Produk Lokal",
              ringkasan: "Cinta tanah air dimulai dari hal-hal sederhana di sekitar kita. Membeli makanan khas lokal dan produk buatan Indonesia membantu pedagang di sekitar kita makmur. Menjaga kelestarian lingkungan sekolah juga wujud cinta pada bumi pertiwi. Sikap bangga berbangsa Indonesia membuat kita semakin bersatu.",
              contoh: "Membeli jajanan getuk dan onde-onde buatan warga desa Banyurip.",
              contohSoal: [
                {
                  tanya: "Sebutkan contoh cinta tanah air di lingkungan sekolah!",
                  jawab: "Mengikuti upacara bendera dengan khidmat dan menjaga kebersihan.",
                  penjelasan: "Sikap disiplin dan merawat lingkungan membuktikan rasa cinta pada negeri."
                },
                {
                  tanya: "Mengapa kita perlu mencintai produk dalam negeri?",
                  jawab: "Agar pengrajin dan pelaku usaha Indonesia semakin maju dan mandiri.",
                  penjelasan: "Memakai karya bangsa sendiri memperkuat ekonomi Indonesia."
                }
              ]
            },
            {
              id: "pp-s2-b2-2",
              judul: "Bela Negara untuk Anak SD",
              ringkasan: "Bela negara bagi anak kelas 4 bukanlah mengangkat senjata atau berperang. Anak SD membela negara dengan cara belajar sungguh-sungguh, menaati aturan, dan menjaga persatuan. Menghindari perkelahian dan saling melindungi antar teman adalah wujud bela negara di sekolah. Murid yang cerdas dan berkarakter adalah masa depan bangsa.",
              contoh: "Raihan dan Krisna rukun belajar kelompok tanpa bertengkar.",
              contohSoal: [
                {
                  tanya: "Bagaimana cara siswa kelas 4 ikut serta dalam bela negara?",
                  jawab: "Belajar dengan rajin, mematuhi tata tertib, dan menjaga kerukunan.",
                  penjelasan: "Menjadi murid pintar dan berbudi luhur adalah sumbangsih nyata bagi bangsa."
                },
                {
                  tanya: "Apakah menjauhi sikap mengejek teman termasuk menjaga keutuhan kelas?",
                  jawab: "Ya, karena mencegah perpecahan dan menciptakan kedamaian.",
                  penjelasan: "Kerukunan kelas mencerminkan kerukunan berbangsa."
                }
              ]
            }
          ]
        },
        {
          id: "pp-s2-b3",
          nomor: 3,
          judul: "Gotong Royong dalam Kehidupan Bermasyarakat",
          subbab: [
            {
              id: "pp-s2-b3-1",
              judul: "Tradisi Gotong Royong di Indonesia",
              ringkasan: "Gotong royong adalah warisan luhur nenek moyang bangsa Indonesia yang mendunia. Pekerjaan yang berat akan terasa ringan jika dikerjakan bersama-sama secara sukarela. Dengan gotong royong, pekerjaan cepat selesai dan persaudaraan semakin erat. Nilai gotong royong adalah intisari dari sila-sila Pancasila.",
              contoh: "Kerja bakti membersihkan saluran air dan halaman sekolah bersama guru dan murid.",
              contohSoal: [
                {
                  tanya: "Apa manfaat utama melakukan kegiatan gotong royong?",
                  jawab: "Pekerjaan cepat selesai, terasa ringan, dan mempererat tali silaturahmi.",
                  penjelasan: "Kerja sama menghasilkan kekuatan yang jauh lebih besar daripada bekerja sendiri."
                },
                {
                  tanya: "Apakah dalam gotong royong kita mengharapkan upah uang?",
                  jawab: "Tidak, gotong royong dilakukan secara ikhlas demi kebaikan bersama.",
                  penjelasan: "Gotong royong didasari rasa kekeluargaan dan kepedulian tulus."
                }
              ]
            },
            {
              id: "pp-s2-b3-2",
              judul: "Penerapan Gotong Royong di Kelas 4",
              ringkasan: "Di dalam kelas 4 SDN Banyurip, semangat gotong royong diterapkan setiap hari. Misalnya saat menata meja kursi, menghias mading kelas, atau membantu teman yang sakit. Rasa empati dan peduli membuat tidak ada siswa yang merasa sendirian. Kelas yang kompak akan selalu menjadi kelas yang juara dan bahagia.",
              contoh: "Rafa dan Rafi bersama-sama mengangkat papan tulis ke tempat yang lebih terang.",
              contohSoal: [
                {
                  tanya: "Apa yang harus kita lakukan bila melihat teman membawa tumpukan buku yang berat?",
                  jawab: "Menawarkan bantuan untuk membawakan sebagian buku tersebut.",
                  penjelasan: "Membantu sesama teman adalah perwujudan tolong-menolong tanpa pamrih."
                },
                {
                  tanya: "Mengapa jadwal piket kelas harus dikerjakan bersama?",
                  jawab: "Agar ruang kelas bersih, rapi, dan nyaman untuk belajar semua orang.",
                  penjelasan: "Menjaga kebersihan bersama adalah tanggung jawab seluruh warga kelas."
                }
              ]
            }
          ]
        }
      ]
    }
  },
  "Bahasa Indonesia": {
    mapel: "Bahasa Indonesia",
    icon: "📖",
    warna: "blue",
    semesters: {
      1: [
        {
          id: "bi-s1-b1",
          nomor: 1,
          judul: "Menyimak Cerita dan Kalimat Transitif-Intransitif",
          subbab: [
            {
              id: "bi-s1-b1-1",
              judul: "Kalimat Transitif dan Intransitif",
              ringkasan: "Kalimat dalam bahasa Indonesia tersusun dari unsur Subjek, Predikat, Objek, dan Keterangan. Kalimat transitif adalah kalimat yang memerlukan objek setelah predikatnya. Sebaliknya, kalimat intransitif adalah kalimat yang tidak memerlukan objek. Memahami kedua jenis kalimat ini membuat karangan kita lebih rapi dan jelas.",
              contoh: "Transitif: 'Bintang membaca buku cerita.' (Buku = objek). Intransitif: 'Anang tertawa terbahak-bahak.'",
              contohSoal: [
                {
                  tanya: "Tentukan apakah kalimat 'Raihan menyapu halaman' termasuk transitif atau intransitif!",
                  jawab: "Transitif.",
                  penjelasan: "Karena kata 'halaman' berfungsi sebagai objek yang dikenai perbuatan menyapu."
                },
                {
                  tanya: "Sebutkan predikat pada kalimat 'Adik tidur nyenyak di kamar'!",
                  jawab: "Tidur.",
                  penjelasan: "Tidur adalah kata kerja tindakan yang menjelaskan apa yang dilakukan Subjek (Adik)."
                }
              ]
            },
            {
              id: "bi-s1-b1-2",
              judul: "Menemukan Gagasan Pokok Paragraf",
              ringkasan: "Setiap paragraf memiliki satu gagasan pokok atau ide utama yang mendasari tulisan. Gagasan pokok biasanya terdapat di kalimat utama pada awal, akhir, atau campuran keduanya. Kalimat lain dalam paragraf disebut sebagai kalimat penjelas. Dengan menemukan gagasan pokok, kita bisa cepat mengerti isi cerita.",
              contoh: "Membaca teks tentang kebiasaan membaca di pagi hari lalu menemukan inti bacaannya.",
              contohSoal: [
                {
                  tanya: "Di mana letak gagasan pokok pada paragraf deduktif?",
                  jawab: "Di awal paragraf.",
                  penjelasan: "Paragraf deduktif menempatkan kalimat utama di bagian pembuka."
                },
                {
                  tanya: "Apa fungsi kalimat penjelas dalam sebuah paragraf?",
                  jawab: "Menjelaskan atau menguraikan gagasan pokok secara lebih rinci.",
                  penjelasan: "Kalimat penjelas memberi contoh, bukti, atau uraian tambahan."
                }
              ]
            }
          ]
        },
        {
          id: "bi-s1-b2",
          nomor: 2,
          judul: "Kata Berimbuhan me- dan Kosakata Baru",
          subbab: [
            {
              id: "bi-s1-b2-1",
              judul: "Aturan Peluluhan Imbuhan me-",
              ringkasan: "Awalan me- dapat berubah bentuk menjadi men-, mem-, meng-, meny-, atau menge- tergantung huruf awal kata dasarnya. Huruf K, T, S, dan P akan luluh bila kata dasarnya berawalan huruf tersebut dan diikuti huruf vokal. Mengenal aturan ini membantu kita menulis ejaan yang baku dan benar. Berlatihlah membuka Kamus Besar Bahasa Indonesia (KBBI).",
              contoh: "me- + tulis menjadi 'menulis' (huruf t luluh), me- + sapu menjadi 'menyapu' (huruf s luluh).",
              contohSoal: [
                {
                  tanya: "Apakah bentuk kata berimbuhan dari awalan 'me-' + 'kunci'?",
                  jawab: "Mengunci (huruf k luluh menjadi ng).",
                  penjelasan: "Huruf K pada kata dasar berkonsonan tunggal luluh saat bertemu awalan me-."
                },
                {
                  tanya: "Ubah kata dasar 'bantu' dengan awalan me-!",
                  jawab: "Membantu.",
                  penjelasan: "Huruf b tidak luluh, awalan me- berubah menjadi mem-."
                }
              ]
            },
            {
              id: "bi-s1-b2-2",
              judul: "Menggunakan Kamus Besar Bahasa Indonesia (KBBI)",
              ringkasan: "Saat menemukan kosakata baru yang sulit di buku bacaan, jangan ragu mencarinya di kamus. Untuk mencari kata di kamus, cari berdasarkan kata dasarnya terlebih dahulu. Kamus menyusun kata urut menurut abjad dari A sampai Z. Rajin membaca kamus membuat perbendaharaan kata kita semakin luas.",
              contoh: "Mencari kata 'melompat' di kamus di bawah abjad L pada kata dasar 'lompat'.",
              contohSoal: [
                {
                  tanya: "Jika ingin mencari arti kata 'berkelahi' di kamus, kata apa yang dicari?",
                  jawab: "Kalah atau kelahi (kata dasarnya: kelahi).",
                  penjelasan: "Entri kamus disusun berdasarkan kata dasar, bukan kata jadian."
                },
                {
                  tanya: "Apa arti kata 'fabel' yang sering kita temukan di pelajaran cerita anak?",
                  jawab: "Cerita fiksi yang tokoh utamanya adalah hewan yang bertingkah laku seperti manusia.",
                  penjelasan: "Contoh fabel adalah dongeng kancil dan kura-kura."
                }
              ]
            }
          ]
        },
        {
          id: "bi-s1-b3",
          nomor: 3,
          judul: "Teks Petunjuk dan Wawancara Sederhana",
          subbab: [
            {
              id: "bi-s1-b3-1",
              judul: "Menulis dan Memahami Teks Petunjuk",
              ringkasan: "Teks petunjuk berisi langkah-langkah untuk melakukan atau membuat sesuatu secara runtut. Bahasa yang digunakan dalam teks petunjuk harus singkat, jelas, dan menggunakan kalimat perintah santun. Urutan langkah harus logis dari awal hingga selesai agar tidak terjadi kesalahan. Contohnya adalah petunjuk menyalakan laptop atau membuat puding.",
              contoh: "Langkah mencuci tangan: 1. Basahi tangan, 2. Gunakan sabun, 3. Gosok 20 detik, 4. Bilas air bersih.",
              contohSoal: [
                {
                  tanya: "Mengapa langkah dalam teks petunjuk harus ditulis secara berurutan?",
                  jawab: "Agar orang yang membaca tidak bingung dan hasil yang diinginkan berhasil baik.",
                  penjelasan: "Urutan yang keliru bisa merusak hasil atau membahayakan pengguna."
                },
                {
                  tanya: "Buatlah satu contoh kalimat petunjuk menggunakan kata kerja perintah!",
                  jawab: "'Tekan tombol daya selama 3 detik untuk menyalakan perangkat.'",
                  penjelasan: "Kalimat menggunakan kata perintah yang tegas dan lugas."
                }
              ]
            },
            {
              id: "bi-s1-b3-2",
              judul: "Melakukan Wawancara Ramah Anak",
              ringkasan: "Wawancara adalah kegiatan tanya jawab untuk memperoleh informasi dari seorang narasumber. Sebelum wawancara, susunlah daftar pertanyaan menggunakan kata tanya ADiKSiMBa (Apa, Di mana, Kapan, Siapa, Mengapa, Bagaimana). Sapalah narasumber dengan salam dan sopan santun. Catatlah jawaban narasumber dengan teliti di buku catatan.",
              contoh: "Candra mewawancarai penjaga perpustakaan tentang cara merawat buku agar awet.",
              contohSoal: [
                {
                  tanya: "Kata tanya apa yang dipakai untuk menanyakan tempat kejadian?",
                  jawab: "Di mana.",
                  penjelasan: "Kata 'di mana' digunakan untuk menanyakan lokasi atau tempat."
                },
                {
                  tanya: "Apa sebutan bagi orang yang memberikan informasi dalam wawancara?",
                  jawab: "Narasumber.",
                  penjelasan: "Narasumber adalah narasumber ahli atau pihak yang diwawancarai."
                }
              ]
            }
          ]
        }
      ],
      2: [
        {
          id: "bi-s2-b1",
          nomor: 1,
          judul: "Menulis Puisi Anak dan Majas Personifikasi",
          subbab: [
            {
              id: "bi-s2-b1-1",
              judul: "Mengenal Ciri Puisi Anak",
              ringkasan: "Puisi adalah karya sastra yang diungkapkan dengan pilihan kata yang indah dan bermakna. Puisi anak biasanya bertema alam, kasih sayang keluarga, atau cita-cita. Puisi tersusun atas bait-bait dan baris-baris berirama. Membaca puisi dengan ekspresi dan intonasi yang tepat membuat pendengar tersentuh.",
              contoh: "Bait puisi: 'Mentari pagi bersinar cerah / Membakar semangat langkah kakiku ke sekolah.'",
              contohSoal: [
                {
                  tanya: "Apa sebutan untuk kumpulan baris dalam sebuah puisi?",
                  jawab: "Bait.",
                  penjelasan: "Beberapa baris puisi membentuk satu kesatuan bait."
                },
                {
                  tanya: "Apa yang harus diperhatikan saat mendeklamasikan puisi di depan kelas?",
                  jawab: "Lafal, intonasi suara, dan ekspresi wajah yang sesuai isi puisi.",
                  penjelasan: "Penjiwaan membuat pesan puisi sampai ke hati pendengar."
                }
              ]
            },
            {
              id: "bi-s2-b1-2",
              judul: "Majas Personifikasi dalam Puisi",
              ringkasan: "Majas personifikasi adalah gaya bahasa yang menggambarkan benda mati seolah-olah memiliki sifat seperti manusia. Benda mati bisa digambarkan berlari, bernyanyi, tersenyum, atau menangis. Majas ini membuat tulisan puisi kita menjadi lebih hidup dan memikat imajinasi pembaca. Pengarang hebat sering menggunakan personifikasi.",
              contoh: "'Angin malam berbisik lembut menyapa dahan pohon jambu.'",
              contohSoal: [
                {
                  tanya: "Pada kalimat 'Nyiur melambai di tepi pantai', gaya bahasa apa yang digunakan?",
                  jawab: "Majas personifikasi.",
                  penjelasan: "Pohon kelapa (nyiur) digambarkan seolah bertangan melambai seperti manusia."
                },
                {
                  tanya: "Jelaskan mengapa majas personifikasi disukai anak-anak!",
                  jawab: "Karena membuat benda-benda sekitar seolah menjadi sahabat yang hidup.",
                  penjelasan: "Majas ini memicu daya khayal dan kreativitas berbahasa."
                }
              ]
            }
          ]
        },
        {
          id: "bi-s2-b2",
          nomor: 2,
          judul: "Surat Pribadi dan Surel (Email) Sederhana",
          subbab: [
            {
              id: "bi-s2-b2-1",
              judul: "Menulis Surat Pribadi",
              ringkasan: "Surat pribadi adalah surat yang dikirimkan kepada teman, orang tua, atau saudara untuk keperluan pribadi. Bagian surat pribadi meliputi tempat dan tanggal pembuatan, salam pembuka, isi surat, salam penutup, dan tanda tangan pengirim. Bahasanya boleh santai namun tetap sopan dan ramah. Surat pribadi bisa mempererat rasa rindu antar sahabat.",
              contoh: "Surat Krisna untuk sepupunya di Surabaya menanyakan kabar liburan sekolah.",
              contohSoal: [
                {
                  tanya: "Apakah surat untuk sahabat karib wajib menggunakan kop surat resmi?",
                  jawab: "Tidak, karena surat pribadi bersifat tidak resmi.",
                  penjelasan: "Kop surat resmi hanya dipakai pada surat dinas/lembaga."
                },
                {
                  tanya: "Sebutkan contoh salam pembuka untuk teman sebaya!",
                  jawab: "'Halo kawan baikku' atau 'Salam manis sahabatku'.",
                  penjelasan: "Salam pembuka surat pribadi mencerminkan keakraban bersahabat."
                }
              ]
            },
            {
              id: "bi-s2-b2-2",
              judul: "Etika Mengirim Pesan Digital (Surel & Chat)",
              ringkasan: "Di zaman modern, kita sering berkomunikasi melalui surat elektronik (email) atau pesan digital. Walau cepat dan praktis, adab berkomunikasi tetap harus kita junjung tinggi. Jangan mengetik dengan huruf kapital semua karena terlihat seperti berteriak. Ucapkan salam, sebutkan nama diri, dan sampaikan maksud dengan santun.",
              contoh: "Mengirim surel tugas gambar ke Pak Guru dengan subjek: 'Tugas Seni - Anang Kelas 4'.",
              contohSoal: [
                {
                  tanya: "Apa arti penulisan kalimat DENGAN SEMUA HURUF KAPITAL dalam pesan chat?",
                  jawab: "Bisa ditafsirkan sebagai nada membentak atau berteriak.",
                  penjelasan: "Gunakan huruf kapital secara wajar sesuai aturan PUEBI/EYD."
                },
                {
                  tanya: "Mengapa kita harus menyebutkan nama saat mengirim pesan kepada bapak/ibu guru?",
                  jawab: "Agar guru mengetahui dengan jelas siapa murid yang mengirim pesan.",
                  penjelasan: "Mengenalkan identitas diri adalah sopan santun dasar berkirim pesan."
                }
              ]
            }
          ]
        },
        {
          id: "bi-s2-b3",
          nomor: 3,
          judul: "Membaca Peta Pikiran (Mind Map) dan Ringkasan",
          subbab: [
            {
              id: "bi-s2-b3-1",
              judul: "Membuat Peta Pikiran Kreatif",
              ringkasan: "Peta pikiran adalah cara mencatat kreatif yang memetakan cabang gagasan dari satu ide sentral. Di bagian tengah ditulis tema utama, lalu ditarik cabang-cabang penting menggunakan warna dan gambar. Cara ini memudahkan otak mengingat pelajaran yang panjang. Belajar jadi lebih menyenangkan dan tidak membosankan.",
              contoh: "Membuat mind map bertema 'Jenis Hewan Berdasarkan Makanannya' berhias gambar daun dan daging.",
              contohSoal: [
                {
                  tanya: "Apa yang diletakkan di bagian paling tengah peta pikiran?",
                  jawab: "Topik atau ide utama.",
                  penjelasan: "Topik utama menjadi pusat dari seluruh cabang gagasan yang diuraikan."
                },
                {
                  tanya: "Apa manfaat memakai spidol warna-warni pada peta pikiran?",
                  jawab: "Membantu mata membedakan kelompok topik dan meningkatkan daya ingat visual.",
                  penjelasan: "Warna merangsang kinerja otak kanan agar lebih mudah mengingat."
                }
              ]
            },
            {
              id: "bi-s2-b3-2",
              judul: "Membuat Ringkasan Teks yang Tepat",
              ringkasan: "Meringkas adalah menyajikan kembali teks bacaan yang panjang menjadi lebih pendek tanpa mengubah makna aslinya. Langkahnya adalah membaca keseluruhan teks, mencatat gagasan pokok, lalu merangkainya menjadi paragraf baru. Jangan memasukkan pendapat pribadi ke dalam ringkasan. Ringkasan yang baik adalah yang padat dan informatif.",
              contoh: "Meringkas bacaan 3 halaman tentang asal-usul Candi Prambanan menjadi satu paragraf.",
              contohSoal: [
                {
                  tanya: "Bolehkah kita mengubah urutan alur cerita saat meringkas teks?",
                  jawab: "Tidak boleh, urutan alur harus tetap dipertahankan sesuai naskah asli.",
                  penjelasan: "Ringkasan harus setia pada kerangka tulisan pengarang asli."
                },
                {
                  tanya: "Apa keuntungan anak yang pandai membuat ringkasan bacaan?",
                  jawab: "Mudah mengulang materi saat persiapan asesmen atau ujian.",
                  penjelasan: "Catatan ringkas menghemat waktu belajar sebelum ujian."
                }
              ]
            }
          ]
        }
      ]
    }
  }
};
