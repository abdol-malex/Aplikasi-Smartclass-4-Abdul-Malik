import {
  getCurrentSession,
  setCurrentSession,
  setTeacherPassword,
  UserSession,
} from "../utils/auth";
import {
  getStudentPhoto,
  saveStudentPhoto,
  deleteStudentPhoto,
  getTeacherPhoto,
  saveTeacherPhoto,
  deleteTeacherPhoto,
  getTeacherProfile,
  saveTeacherProfile,
  updateStudentProfile,
  getStudents,
} from "../utils/storage";

export function compressImageFile(
  file: File,
  maxWidth = 256,
  maxHeight = 256,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Gagal membaca gambar"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Gagal membuka file"));
    reader.readAsDataURL(file);
  });
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function openEditProfilModal(onUpdateSuccess?: () => void): void {
  const existing = document.getElementById("modal-edit-profil-container");
  if (existing) existing.remove();

  const session = getCurrentSession();
  if (!session) return;

  const isTeacher = session.role === "guru";
  const student = session.student
    ? (getStudents().find((s) => s.nisn === session.student?.nisn) || session.student)
    : null;

  let currentPhoto = isTeacher
    ? getTeacherPhoto()
    : student
    ? getStudentPhoto(student.nisn)
    : null;

  const teacherProfile = isTeacher ? getTeacherProfile() : null;

  const modal = document.createElement("div");
  modal.id = "modal-edit-profil-container";
  modal.className =
    "fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in";

  if (isTeacher) {
    const namaGuru = teacherProfile?.nama || session.name || "Bapak/Ibu Guru Kelas 4";
    const namaPanggilanGuru = teacherProfile?.namaPanggilan || "Guru Kelas 4";
    const kontakGuru = teacherProfile?.kontak || "";

    modal.innerHTML = `
      <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 sm:p-7 relative my-8 transform transition-all">
        <!-- Close button -->
        <button type="button" id="btn-close-edit-profil" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-sm transition cursor-pointer">
          ✕
        </button>

        <div class="text-center mb-5">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 text-2xl mb-2 shadow-xs border border-slate-200">
            👨‍🏫
          </div>
          <h3 class="text-lg font-black text-slate-900 tracking-tight">Edit Profil Pendidik</h3>
          <p class="text-xs text-slate-500 mt-0.5">Perbarui nama, kontak, kata sandi, dan foto profil guru</p>
        </div>

        <div id="profil-modal-alert" class="hidden mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold text-center"></div>

        <!-- Foto Profil Guru -->
        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4 flex items-center gap-4">
          <div class="relative shrink-0">
            <div id="preview-foto-wrapper" class="w-16 h-16 rounded-2xl bg-white border-2 border-slate-300 shadow-sm overflow-hidden flex items-center justify-center">
              ${
                currentPhoto
                  ? `<img id="img-preview-foto" src="${currentPhoto}" alt="Foto Guru" class="w-full h-full object-cover" />`
                  : `<span id="emoji-preview-foto" class="text-3xl">👨‍🏫</span>`
              }
            </div>
          </div>
          <div class="flex-1 space-y-1.5">
            <div class="text-xs font-bold text-slate-800">Foto Profil Pendidik</div>
            <div class="flex flex-wrap items-center gap-2">
              <label for="input-profil-upload-foto" class="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-[11px] font-bold rounded-xl transition cursor-pointer flex items-center gap-1 shadow-xs">
                <span>📷</span>
                <span>Unggah Foto</span>
              </label>
              <input type="file" id="input-profil-upload-foto" accept="image/*" class="hidden" />
              <button type="button" id="btn-profil-hapus-foto" class="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold rounded-xl transition cursor-pointer ${
                currentPhoto ? "" : "hidden"
              }">
                ✕ Hapus
              </button>
            </div>
            <p class="text-[10px] text-slate-400">Format JPG/PNG, ukuran otomatis disesuaikan.</p>
          </div>
        </div>

        <!-- Form Guru -->
        <div class="space-y-3.5">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap & Gelar <span class="text-rose-500">*</span></label>
            <input type="text" id="input-edit-nama-guru" value="${escapeHtml(
              namaGuru
            )}" placeholder="Contoh: Budi Santoso, S.Pd." class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-800" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Nama Panggilan / Sapaan</label>
            <input type="text" id="input-edit-panggilan-guru" value="${escapeHtml(
              namaPanggilanGuru
            )}" placeholder="Contoh: Pak Budi" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-800" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Kontak / No. Telepon / WhatsApp</label>
            <input type="tel" id="input-edit-kontak-guru" value="${escapeHtml(
              kontakGuru
            )}" placeholder="Contoh: 0812-3456-7890" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-800" />
          </div>

          <div class="pt-2 border-t border-slate-100">
            <label class="block text-xs font-bold text-slate-700 mb-1">Ganti Kata Sandi (Password Baru)</label>
            <input type="password" id="input-edit-pwd-guru" placeholder="Kosongkan jika tidak ingin mengganti" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-800" />
            <p class="text-[10px] text-slate-400 mt-1">Kosongkan kolom sandi jika tetap menggunakan sandi saat ini.</p>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Konfirmasi Kata Sandi Baru</label>
            <input type="password" id="input-edit-pwd2-guru" placeholder="Ulangi kata sandi baru" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-800" />
          </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button type="button" id="btn-cancel-edit-profil" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer">
            Batal
          </button>
          <button type="button" id="btn-save-edit-profil" class="px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer flex items-center gap-1.5">
            <span>💾</span>
            <span>Simpan Profil</span>
          </button>
        </div>
      </div>
    `;
  } else {
    // Siswa Mode
    if (!student) return;
    const namaSiswa = student.nama || "";
    const namaPanggilanSiswa = student.namaPanggilan || student.nama.split(" ")[0] || "";
    const kontakSiswa = student.kontak || "";
    const pinSiswa = student.pin || "";

    modal.innerHTML = `
      <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 sm:p-7 relative my-8 transform transition-all">
        <!-- Close button -->
        <button type="button" id="btn-close-edit-profil" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-sm transition cursor-pointer">
          ✕
        </button>

        <div class="text-center mb-5">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 text-2xl mb-2 shadow-xs border border-emerald-200">
            👦
          </div>
          <h3 class="text-lg font-black text-slate-900 tracking-tight">Edit Profil Siswa</h3>
          <p class="text-xs text-slate-500 mt-0.5">Perbarui nama, kontak, PIN masuk, dan foto profilmu</p>
        </div>

        <div id="profil-modal-alert" class="hidden mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold text-center"></div>

        <!-- Foto Profil Siswa -->
        <div class="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 mb-4 flex items-center gap-4">
          <div class="relative shrink-0">
            <div id="preview-foto-wrapper" class="w-16 h-16 rounded-2xl bg-white border-2 border-emerald-300 shadow-sm overflow-hidden flex items-center justify-center">
              ${
                currentPhoto
                  ? `<img id="img-preview-foto" src="${currentPhoto}" alt="Foto Siswa" class="w-full h-full object-cover" />`
                  : `<span id="emoji-preview-foto" class="text-3xl">${student.avatar || "👦"}</span>`
              }
            </div>
          </div>
          <div class="flex-1 space-y-1.5">
            <div class="text-xs font-bold text-slate-800">Foto Profil Kamu</div>
            <div class="flex flex-wrap items-center gap-2">
              <label for="input-profil-upload-foto" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl transition cursor-pointer flex items-center gap-1 shadow-xs">
                <span>📷</span>
                <span>Unggah Foto</span>
              </label>
              <input type="file" id="input-profil-upload-foto" accept="image/*" class="hidden" />
              <button type="button" id="btn-profil-hapus-foto" class="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold rounded-xl transition cursor-pointer ${
                currentPhoto ? "" : "hidden"
              }">
                ✕ Hapus
              </button>
            </div>
            <p class="text-[10px] text-slate-400">Pilih foto terbaikmu dari galeri atau kamera.</p>
          </div>
        </div>

        <!-- Form Siswa -->
        <div class="space-y-3.5">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">NISN</label>
              <input type="text" disabled value="${student.nisn}" class="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 text-slate-500 rounded-xl text-xs font-mono cursor-not-allowed" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">No. Presensi</label>
              <input type="text" disabled value="Nomor ${student.no}" class="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 text-slate-500 rounded-xl text-xs cursor-not-allowed" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Siswa <span class="text-rose-500">*</span></label>
            <input type="text" id="input-edit-nama-siswa" value="${escapeHtml(
              namaSiswa
            )}" placeholder="Nama lengkap siswa" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Nama Panggilan</label>
            <input type="text" id="input-edit-panggilan-siswa" value="${escapeHtml(
              namaPanggilanSiswa
            )}" placeholder="Nama akrab di kelas" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Kontak / No. WhatsApp Siswa atau Orang Tua</label>
            <input type="tel" id="input-edit-kontak-siswa" value="${escapeHtml(
              kontakSiswa
            )}" placeholder="Contoh: 0812-3456-7890" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div class="pt-2 border-t border-slate-100">
            <label class="block text-xs font-bold text-slate-700 mb-1">PIN Rahasia Siswa (4 Digit Angka) <span class="text-rose-500">*</span></label>
            <input type="password" id="input-edit-pin-siswa" maxlength="4" value="${escapeHtml(
              pinSiswa
            )}" placeholder="•••• (4 Digit Angka)" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-center tracking-widest focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <p class="text-[10px] text-slate-400 mt-1">Gunakan 4 digit angka rahasia untuk keamanan akun belajarmu.</p>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button type="button" id="btn-cancel-edit-profil" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer">
            Batal
          </button>
          <button type="button" id="btn-save-edit-profil" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer flex items-center gap-1.5">
            <span>💾</span>
            <span>Simpan Profil</span>
          </button>
        </div>
      </div>
    `;
  }

  document.body.appendChild(modal);

  // Close handlers
  const closeModal = () => modal.remove();
  modal.querySelector("#btn-close-edit-profil")?.addEventListener("click", closeModal);
  modal.querySelector("#btn-cancel-edit-profil")?.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  const alertBox = modal.querySelector("#profil-modal-alert") as HTMLElement;
  const showAlert = (msg: string) => {
    if (alertBox) {
      alertBox.textContent = msg;
      alertBox.classList.remove("hidden");
    }
  };

  // Photo handlers
  const photoFileInput = modal.querySelector("#input-profil-upload-foto") as HTMLInputElement;
  const btnHapusFoto = modal.querySelector("#btn-profil-hapus-foto") as HTMLButtonElement;
  const previewWrapper = modal.querySelector("#preview-foto-wrapper") as HTMLElement;

  if (photoFileInput) {
    photoFileInput.addEventListener("change", async (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      try {
        const compressed = await compressImageFile(file, 256, 256, 0.85);
        currentPhoto = compressed;
        if (isTeacher) {
          saveTeacherPhoto(compressed);
        } else if (student) {
          saveStudentPhoto(student.nisn, compressed);
          student.avatar = compressed;
        }

        // Update preview
        if (previewWrapper) {
          previewWrapper.innerHTML = `<img id="img-preview-foto" src="${compressed}" alt="Foto Profil" class="w-full h-full object-cover" />`;
        }
        if (btnHapusFoto) {
          btnHapusFoto.classList.remove("hidden");
        }
      } catch (err: any) {
        showAlert("Gagal memproses berkas foto: " + (err?.message || "Format tidak didukung"));
      }
    });
  }

  if (btnHapusFoto) {
    btnHapusFoto.addEventListener("click", () => {
      currentPhoto = null;
      if (isTeacher) {
        deleteTeacherPhoto();
        if (previewWrapper) {
          previewWrapper.innerHTML = `<span id="emoji-preview-foto" class="text-3xl">👨‍🏫</span>`;
        }
      } else if (student) {
        deleteStudentPhoto(student.nisn, "👦");
        student.avatar = "👦";
        if (previewWrapper) {
          previewWrapper.innerHTML = `<span id="emoji-preview-foto" class="text-3xl">👦</span>`;
        }
      }
      btnHapusFoto.classList.add("hidden");
    });
  }

  // Save handler
  const btnSave = modal.querySelector("#btn-save-edit-profil") as HTMLButtonElement;
  if (btnSave) {
    btnSave.addEventListener("click", async () => {
      btnSave.disabled = true;
      btnSave.textContent = "Menyimpan...";

      if (isTeacher) {
        const namaInput = (modal.querySelector("#input-edit-nama-guru") as HTMLInputElement)?.value.trim() || "";
        const panggilanInput = (modal.querySelector("#input-edit-panggilan-guru") as HTMLInputElement)?.value.trim() || "";
        const kontakInput = (modal.querySelector("#input-edit-kontak-guru") as HTMLInputElement)?.value.trim() || "";
        const pwdInput = (modal.querySelector("#input-edit-pwd-guru") as HTMLInputElement)?.value || "";
        const pwd2Input = (modal.querySelector("#input-edit-pwd2-guru") as HTMLInputElement)?.value || "";

        if (!namaInput) {
          showAlert("Nama lengkap pendidik tidak boleh kosong!");
          btnSave.disabled = false;
          btnSave.textContent = "Simpan Profil";
          return;
        }

        if (pwdInput) {
          if (pwdInput.length < 4) {
            showAlert("Kata sandi baru minimal 4 karakter!");
            btnSave.disabled = false;
            btnSave.textContent = "Simpan Profil";
            return;
          }
          if (pwdInput !== pwd2Input) {
            showAlert("Konfirmasi kata sandi baru tidak sesuai!");
            btnSave.disabled = false;
            btnSave.textContent = "Simpan Profil";
            return;
          }
          await setTeacherPassword(pwdInput);
        }

        saveTeacherProfile({
          nama: namaInput,
          namaPanggilan: panggilanInput,
          kontak: kontakInput,
        });

        const cur = getCurrentSession();
        if (cur) {
          cur.name = namaInput;
          setCurrentSession(cur);
        }

        closeModal();
        if (onUpdateSuccess) onUpdateSuccess();
      } else if (student) {
        const namaInput = (modal.querySelector("#input-edit-nama-siswa") as HTMLInputElement)?.value.trim() || "";
        const panggilanInput = (modal.querySelector("#input-edit-panggilan-siswa") as HTMLInputElement)?.value.trim() || "";
        const kontakInput = (modal.querySelector("#input-edit-kontak-siswa") as HTMLInputElement)?.value.trim() || "";
        const pinInput = (modal.querySelector("#input-edit-pin-siswa") as HTMLInputElement)?.value.trim() || "";

        if (!namaInput) {
          showAlert("Nama lengkap siswa tidak boleh kosong!");
          btnSave.disabled = false;
          btnSave.textContent = "Simpan Profil";
          return;
        }

        if (!/^\d{4}$/.test(pinInput)) {
          showAlert("PIN rahasia siswa wajib 4 digit angka!");
          btnSave.disabled = false;
          btnSave.textContent = "Simpan Profil";
          return;
        }

        const updated = updateStudentProfile(student.nisn, {
          nama: namaInput,
          namaPanggilan: panggilanInput,
          kontak: kontakInput,
          pin: pinInput,
        });

        const cur = getCurrentSession();
        if (cur && cur.student) {
          cur.name = namaInput;
          if (updated) {
            cur.student = updated;
          } else {
            cur.student.nama = namaInput;
            cur.student.namaPanggilan = panggilanInput;
            cur.student.kontak = kontakInput;
            cur.student.pin = pinInput;
          }
          setCurrentSession(cur);
        }

        closeModal();
        if (onUpdateSuccess) onUpdateSuccess();
      }
    });
  }
}
