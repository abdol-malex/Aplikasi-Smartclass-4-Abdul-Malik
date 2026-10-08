import { getCertificates } from "../utils/storage";

export function renderCertificatesView(currentNisn: string | null = null, isTeacher: boolean = false): string {
  const allCerts = getCertificates();
  // Guru can see all certificates. Students ONLY see certificates issued to their personal NISN!
  const visibleCerts = isTeacher
    ? allCerts
    : (currentNisn ? allCerts.filter(c => c.nisn === currentNisn) : []);

  return `
    <div class="space-y-6">
      <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-2xl">🎓</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900">
              ${isTeacher ? 'Sertifikat Digital Prestasi Siswa' : 'Sertifikat Prestasiku'}
            </h2>
            ${isTeacher ? `
              <span class="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">Kelola Guru (Uji Coba)</span>
            ` : `
              <span class="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">Siswa Resmi</span>
            `}
          </div>
          <p class="text-xs text-slate-500 mt-1">
            ${isTeacher
              ? 'Kelola, terbitkan, edit, atau hapus sertifikat penghargaan resmi siswa Kelas 4 SDN Banyurip.'
              : 'Penghargaan resmi atas ketekunan, karakter baik, dan keberhasilan belajarmu di Kelas 4 SDN Banyurip.'
            }
          </p>
        </div>

        ${isTeacher ? `
          <div class="flex flex-wrap items-center gap-2.5">
            <button type="button" id="btn-issue-cert-modal" data-module="sertifikat" data-aksi="tambah" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs">
              <span>➕</span> Terbitkan Sertifikat Baru
            </button>
            <button type="button" id="btn-reset-test-certs" data-module="sertifikat" data-aksi="reset_uji_coba" class="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer" title="Kembalikan sertifikat contoh uji coba awal">
              <span>🔄</span> Reset Uji Coba
            </button>
          </div>
        ` : ''}
      </div>

      <!-- Certificates List -->
      ${visibleCerts.length === 0 ? `
        <div class="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
          <div class="text-5xl">📜</div>
          <h3 class="font-bold text-slate-700 text-base">Belum Ada Sertifikat Digital</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">
            ${isTeacher
              ? 'Semua sertifikat telah terhapus atau belum ada yang diterbitkan. Anda dapat menerbitkan sertifikat baru atau mereset data contoh uji coba.'
              : 'Selesaikan tantangan di Game Petualangan Nusantara Ilmu atau raih prestasi belajarmu untuk membuka sertifikat digital pertamamu! 🌟'
            }
          </p>
          ${isTeacher ? `
            <div class="pt-2 flex justify-center gap-3">
              <button type="button" data-module="sertifikat" data-aksi="tambah" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer">
                ➕ Terbitkan Sertifikat Baru
              </button>
              <button type="button" data-module="sertifikat" data-aksi="reset_uji_coba" class="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold transition cursor-pointer">
                🔄 Kembalikan Contoh Uji Coba
              </button>
            </div>
          ` : ''}
        </div>
      ` : `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${visibleCerts.map(cert => `
            <div class="bg-gradient-to-br from-amber-50/60 via-white to-amber-50/30 rounded-3xl border-4 border-amber-300 p-6 sm:p-8 shadow-sm space-y-5 relative overflow-hidden flex flex-col justify-between">
              <!-- Corner Ornaments -->
              <div class="absolute top-2 left-2 text-amber-400 text-xs font-serif">✤</div>
              <div class="absolute top-2 right-2 text-amber-400 text-xs font-serif">✤</div>
              <div class="absolute bottom-2 left-2 text-amber-400 text-xs font-serif">✤</div>
              <div class="absolute bottom-2 right-2 text-amber-400 text-xs font-serif">✤</div>

              <div class="text-center space-y-3">
                <div class="text-3xl">🇮🇩</div>
                <div class="text-[11px] font-black uppercase tracking-widest text-amber-800">
                  SDN BANYURIP • KELAS 4
                </div>
                <h3 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-serif uppercase">
                  Sertifikat Penghargaan
                </h3>
                <p class="text-xs text-slate-500 italic">Diberikan dengan bangga kepada:</p>
                <div class="py-2 border-b-2 border-amber-400 max-w-xs mx-auto">
                  <span class="text-base sm:text-lg font-bold text-slate-800">${cert.studentName}</span>
                </div>
              </div>

              <div class="text-center space-y-2 text-xs text-slate-700 px-4 leading-relaxed">
                <div class="font-bold text-amber-900 text-sm">${cert.title}</div>
                <p class="italic text-slate-600">${cert.description}</p>
              </div>

              <div class="pt-4 border-t border-amber-200/80 flex justify-between items-end text-xs text-slate-600">
                <div class="space-y-0.5">
                  <div class="text-[10px] text-slate-400">Tanggal Terbit</div>
                  <div class="font-mono font-bold text-slate-700">${cert.date}</div>
                </div>
                <div class="text-right space-y-1">
                  <div class="font-signature text-sm font-bold text-emerald-800 underline">Abdul Malik, S.Pd.</div>
                  <div class="text-[10px] text-slate-500">${cert.signatureText}</div>
                </div>
              </div>

              <!-- Action Buttons: Students only get Print/Download. Teachers get Print, Edit, and Delete -->
              <div class="pt-3 flex flex-wrap items-center justify-center gap-2 no-print border-t border-amber-200/50">
                <button type="button" id="btn-print-cert-${cert.id}" data-id="${cert.id}" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer shadow-xs">
                  <span>🖨️</span> Cetak / Unduh PDF
                </button>
                ${isTeacher ? `
                  <button type="button" id="btn-edit-cert-${cert.id}" data-module="sertifikat" data-aksi="edit" data-id="${cert.id}" class="px-3.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 rounded-xl text-xs font-bold inline-flex items-center gap-1 transition cursor-pointer" title="Edit sertifikat penghargaan ini">
                    <span>✏️</span> Edit
                  </button>
                  <button type="button" id="btn-del-cert-${cert.id}" data-module="sertifikat" data-aksi="hapus" data-id="${cert.id}" class="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold inline-flex items-center gap-1 transition cursor-pointer" title="Hapus sertifikat ini">
                    <span>🗑️</span> Hapus
                  </button>
                ` : ''}
              </div>
            </div>
          `).join("")}
        </div>
      `}
    </div>
  `;
}
