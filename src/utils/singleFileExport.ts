export function downloadStandaloneHTML(): void {
  // Grab all bank soal script elements
  const bankScripts = Array.from(document.querySelectorAll("script[data-bank]"))
    .map(s => s.outerHTML)
    .join("\n    ");

  const htmlContent = `<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Smart Class SDN Banyurip - Kelas 4</title>
  <style>
    /* Standalone Offline Styling */
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; color: #1e293b; }
    @media print {
      header, aside, .no-print, button { display: none !important; }
      main { padding: 0 !important; margin: 0 !important; }
      body { background: white !important; }
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-800">
  <div id="root">
    ${document.getElementById("root")?.innerHTML || "<div>Smart Class SDN Banyurip</div>"}
  </div>

  <!-- ===== MULAI BANK SOAL ===== -->
  ${bankScripts}
  <!-- ===== AKHIR BANK SOAL ===== -->
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "smart_class_sdn_banyurip_kelas4.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
