import {
  DriveFileItem,
  getGoogleUser,
  getAccessToken,
} from "../services/googleDriveService";

export interface GoogleDriveState {
  search: string;
  currentFolderId: string;
  folderHistory: Array<{ id: string; name: string }>;
  files: DriveFileItem[];
  isLoading: boolean;
  error: string | null;
  deletingFile: DriveFileItem | null;
}

export let driveState: GoogleDriveState = {
  search: "",
  currentFolderId: "root",
  folderHistory: [{ id: "root", name: "Drive Saya" }],
  files: [],
  isLoading: false,
  error: null,
  deletingFile: null,
};

export function setDriveState(partial: Partial<GoogleDriveState>) {
  driveState = { ...driveState, ...partial };
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

function formatBytes(bytes?: string): string {
  if (!bytes) return "-";
  const num = parseInt(bytes, 10);
  if (isNaN(num)) return "-";
  if (num < 1024) return num + " B";
  if (num < 1024 * 1024) return (num / 1024).toFixed(1) + " KB";
  return (num / (1024 * 1024)).toFixed(1) + " MB";
}

function getMimeIcon(mimeType: string): string {
  if (mimeType === "application/vnd.google-apps.folder") return "📁";
  if (mimeType.includes("spreadsheet") || mimeType.includes("sheet")) return "📊";
  if (mimeType.includes("document") || mimeType.includes("word")) return "📄";
  if (mimeType.includes("presentation") || mimeType.includes("slide")) return "📑";
  if (mimeType.includes("pdf")) return "📕";
  if (mimeType.includes("image")) return "🖼️";
  if (mimeType.includes("json")) return "⚙️";
  if (mimeType.includes("zip") || mimeType.includes("tar")) return "📦";
  return "📝";
}

export function renderGoogleDriveView(): string {
  const user = getGoogleUser();
  const tokenPromise = getAccessToken();
  const isConnected = !!user;

  return `
    <div class="space-y-6 animate-fade-in">
      <!-- Header Banner -->
      <div class="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div class="absolute -right-8 -bottom-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30">
              <svg class="w-8 h-8" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
                <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba02"/>
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-xl md:text-2xl font-black tracking-tight">Google Drive Kelas 4</h1>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isConnected ? 'bg-emerald-400 text-emerald-950' : 'bg-amber-400 text-amber-950'}">
                  ${isConnected ? 'Terhubung' : 'Belum Terhubung'}
                </span>
              </div>
              <p class="text-xs text-sky-100 mt-1 max-w-xl leading-relaxed">
                Penyimpanan awan terpadu untuk pencadangan otomatis dokumen, berkas administrasi wali kelas, nilai rapor, dan modul ajar Kurikulum Merdeka SDN Banyurip.
              </p>
            </div>
          </div>

          <!-- Account Area -->
          <div class="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20">
            ${isConnected && user ? `
              <div class="flex items-center gap-3">
                ${user.photoURL ? `
                  <img src="${user.photoURL}" alt="${escapeHtml(user.displayName || '')}" class="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" />
                ` : `
                  <div class="w-10 h-10 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-sm border-2 border-white">
                    ${(user.displayName || user.email || "G")[0].toUpperCase()}
                  </div>
                `}
                <div class="text-left text-xs pr-1">
                  <div class="font-bold text-white truncate max-w-[140px]">${escapeHtml(user.displayName || "Pengguna Google")}</div>
                  <div class="text-[10px] text-sky-200 truncate max-w-[140px]">${escapeHtml(user.email || "")}</div>
                </div>
                <button
                  type="button"
                  id="btn-google-signout"
                  class="p-2 bg-white/20 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  title="Putuskan Hubungan Google Drive"
                >
                  🚪 Keluar
                </button>
              </div>
            ` : `
              <!-- Official Sign In With Google Button Style -->
              <button
                type="button"
                id="btn-google-signin"
                class="flex items-center gap-3 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs shadow-md transition cursor-pointer border border-slate-200"
              >
                <svg class="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span>Masuk dengan Akun Google</span>
              </button>
            `}
          </div>
        </div>
      </div>

      ${!isConnected ? `
        <!-- Not Connected Callout -->
        <div class="bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm">
          <div class="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
            ☁️
          </div>
          <h2 class="text-base md:text-lg font-black text-slate-800">Hubungkan Google Drive Kelas</h2>
          <p class="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
            Klik tombol <strong>"Masuk dengan Akun Google"</strong> di atas untuk mengaktifkan akses Google Drive. Anda akan dapat mencadangkan seluruh data kelas secara aman dan membuka berkas secara langsung.
          </p>
          <div class="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              id="btn-google-signin-hero"
              class="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-2"
            >
              <svg class="w-4 h-4" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <span>Hubungkan Sekarang</span>
            </button>
          </div>
        </div>
      ` : `
        <!-- Connected Toolbar & Actions -->
        <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                id="btn-backup-to-drive"
                class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-2"
                title="Cadangkan seluruh data administrasi kelas ke Google Drive"
              >
                <span>💾</span> Cadangkan Data Kelas ke Drive
              </button>

              <button
                type="button"
                id="btn-new-drive-folder"
                class="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <span>📁</span> Folder Baru
              </button>

              <button
                type="button"
                id="btn-upload-text-file"
                class="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <span>📝</span> Unggah Catatan Kelas
              </button>

              <button
                type="button"
                id="btn-refresh-drive"
                class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1"
                title="Segarkan daftar berkas"
              >
                <span>🔄</span> Segarkan
              </button>
            </div>

            <!-- Search Field -->
            <div class="w-full sm:w-64">
              <div class="relative">
                <input
                  type="text"
                  id="input-drive-search"
                  placeholder="Cari berkas di Drive..."
                  value="${escapeHtml(driveState.search)}"
                  class="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
                />
                <span class="absolute left-2.5 top-2.5 text-xs text-slate-400">🔍</span>
              </div>
            </div>
          </div>

          <!-- Breadcrumbs Folder Navigation -->
          <div class="flex items-center gap-1 text-xs text-slate-600 pt-2 border-t border-slate-100 overflow-x-auto">
            <span class="text-slate-400">Lokasi:</span>
            ${driveState.folderHistory.map((folder, idx) => `
              <button
                type="button"
                class="btn-drive-breadcrumb px-2 py-1 hover:bg-slate-100 rounded-lg font-bold text-blue-700 transition cursor-pointer flex items-center gap-1"
                data-id="${folder.id}"
                data-idx="${idx}"
              >
                ${idx === 0 ? '🏠 ' : ''}${escapeHtml(folder.name)}
              </button>
              ${idx < driveState.folderHistory.length - 1 ? `<span class="text-slate-300">/</span>` : ''}
            `).join("")}
          </div>
        </div>

        <!-- Files List Table -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
            <div class="text-xs font-bold text-slate-700">
              Daftar Berkas & Folder Google Drive
              <span class="text-slate-400 font-normal">(${driveState.files.length} item)</span>
            </div>
            ${driveState.isLoading ? `
              <div class="flex items-center gap-2 text-xs text-blue-600 font-bold">
                <span class="animate-spin">⏳</span> Memuat berkas...
              </div>
            ` : ''}
          </div>

          ${driveState.error ? `
            <div class="p-6 text-center text-xs text-rose-600 bg-rose-50/50">
              ⚠️ ${escapeHtml(driveState.error)}
            </div>
          ` : driveState.files.length === 0 ? `
            <div class="p-12 text-center text-xs text-slate-400 space-y-2">
              <div class="text-4xl">📂</div>
              <div class="font-bold text-slate-600">Tidak ada berkas di lokasi ini.</div>
              <div>Klik <strong>"Cadangkan Data Kelas ke Drive"</strong> atau <strong>"Folder Baru"</strong> untuk mulai menyimpan.</div>
            </div>
          ` : `
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="bg-slate-50/80 text-slate-500 border-b border-slate-100 uppercase text-[10px] tracking-wider">
                    <th class="py-3 px-4 font-bold">Nama Berkas</th>
                    <th class="py-3 px-3 font-bold">Jenis</th>
                    <th class="py-3 px-3 font-bold text-center">Ukuran</th>
                    <th class="py-3 px-3 font-bold">Terakhir Diubah</th>
                    <th class="py-3 px-4 font-bold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                  ${driveState.files.map((file) => {
                    const isFolder = file.mimeType === "application/vnd.google-apps.folder";
                    const icon = getMimeIcon(file.mimeType);
                    const modified = file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    }) : "-";

                    return `
                      <tr class="hover:bg-slate-50/80 transition group">
                        <td class="py-3 px-4 font-medium text-slate-900">
                          <div class="flex items-center gap-2.5">
                            <span class="text-lg">${icon}</span>
                            ${isFolder ? `
                              <button
                                type="button"
                                class="btn-open-drive-folder text-blue-600 hover:text-blue-800 hover:underline font-bold text-left cursor-pointer"
                                data-id="${file.id}"
                                data-name="${escapeHtml(file.name)}"
                              >
                                ${escapeHtml(file.name)}
                              </button>
                            ` : `
                              <span class="truncate max-w-xs md:max-w-md font-semibold text-slate-800" title="${escapeHtml(file.name)}">
                                ${escapeHtml(file.name)}
                              </span>
                            `}
                          </div>
                        </td>
                        <td class="py-3 px-3 text-[11px] text-slate-500 font-mono">
                          ${isFolder ? '<span class="text-blue-600 font-bold">Folder</span>' : escapeHtml(file.mimeType.split(".").pop() || "Berkas")}
                        </td>
                        <td class="py-3 px-3 text-center text-slate-500 font-mono text-[11px]">
                          ${isFolder ? '-' : formatBytes(file.size)}
                        </td>
                        <td class="py-3 px-3 text-slate-500 text-[11px]">
                          ${modified}
                        </td>
                        <td class="py-3 px-4 text-center">
                          <div class="inline-flex items-center gap-1.5">
                            ${file.webViewLink ? `
                              <a
                                href="${file.webViewLink}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                                title="Buka di Google Drive"
                              >
                                <span>↗</span> Buka
                              </a>
                            ` : ''}

                            <button
                              type="button"
                              class="btn-delete-drive-file px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold transition cursor-pointer"
                              data-id="${file.id}"
                              data-name="${escapeHtml(file.name)}"
                              title="Hapus Berkas dari Google Drive"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          `}
        </div>
      `}
    </div>

    <!-- Mandatory Destructive Confirmation Modal for Google Drive -->
    <div id="modal-confirm-delete-drive" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-center transform transition-all">
        <div class="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto mb-3 text-3xl shadow-sm">
          🗑️
        </div>
        <h3 class="text-base font-bold text-slate-800 mb-1">Hapus Berkas dari Google Drive?</h3>
        <p class="text-xs text-slate-600 mb-6 leading-relaxed">
          Apakah Anda yakin ingin menghapus berkas <strong id="drive-delete-file-name" class="text-rose-700"></strong> dari Google Drive Anda? Tindakan ini akan memindahkan berkas ke kotak sampah Google Drive.
        </p>
        <div class="flex items-center justify-center gap-3">
          <button
            type="button"
            id="btn-cancel-delete-drive-modal"
            class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            id="btn-confirm-delete-drive-modal"
            class="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
          >
            <span>🗑️ Ya, Hapus Berkas</span>
          </button>
        </div>
      </div>
    </div>
  `;
}
