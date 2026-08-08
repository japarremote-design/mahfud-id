// Markdown-lite: cukup buat kebutuhan artikel Gagasan, tanpa nambah
// dependency berat (TipTap/Quill dll). Support: **bold**, *italic*,
// # / ## heading, - list, > quote, [teks](url), paragraf otomatis
// dari baris kosong.
export function markdownToHtml(src: string): string {
  if (!src) return "";
  const escaped = src
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const lines = escaped.split("\n");
  const out: string[] = [];
  let inList = false;

  const inline = (t: string) =>
    t
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-brand underline">$1</a>');

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^-\s+/.test(line)) {
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push(`<li>${inline(line.replace(/^-\s+/, ""))}</li>`);
      continue;
    }
    if (inList) { out.push("</ul>"); inList = false; }

    if (/^##\s+/.test(line)) out.push(`<h3>${inline(line.replace(/^##\s+/, ""))}</h3>`);
    else if (/^#\s+/.test(line)) out.push(`<h2>${inline(line.replace(/^#\s+/, ""))}</h2>`);
    else if (/^>\s+/.test(line)) out.push(`<blockquote>${inline(line.replace(/^>\s+/, ""))}</blockquote>`);
    else if (line.trim() === "") out.push("");
    else out.push(`<p>${inline(line)}</p>`);
  }
  if (inList) out.push("</ul>");

  return out.filter((l) => l !== "").join("\n");
}
