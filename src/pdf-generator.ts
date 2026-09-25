import { jsPDF } from "jspdf";
import { profile, stats, brands, selectedWork, services, featuredPress, socials } from "./data";

// Brand palette (RGB)
const INK: [number, number, number] = [21, 18, 15];
const PARCH: [number, number, number] = [243, 237, 225];
const EMERALD: [number, number, number] = [31, 111, 92];
const GOLD: [number, number, number] = [201, 162, 39];
const BURGUNDY: [number, number, number] = [122, 35, 49];

export function generateMediaKitPDF() {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentW = pageW - margin * 2;
  let y = 0;

  const setFill = (c: [number, number, number]) => doc.setFillColor(c[0], c[1], c[2]);
  const setText = (c: [number, number, number]) => doc.setTextColor(c[0], c[1], c[2]);
  const setDraw = (c: [number, number, number]) => doc.setDrawColor(c[0], c[1], c[2]);

  const checkPage = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      // paper background
      setFill(PARCH);
      doc.rect(0, 0, pageW, pageH, "F");
      y = margin;
    }
  };

  const sectionTitle = (label: string) => {
    checkPage(48);
    y += 10;
    setDraw(GOLD);
    doc.setLineWidth(1.5);
    doc.line(margin, y, margin + 28, y);
    y += 16;
    setText(EMERALD);
    doc.setFont("times", "bold");
    doc.setFontSize(15);
    doc.text(label.toUpperCase(), margin, y);
    y += 18;
  };

  // ---- Page background ----
  setFill(PARCH);
  doc.rect(0, 0, pageW, pageH, "F");

  // ---- Header band ----
  setFill(INK);
  doc.rect(0, 0, pageW, 150, "F");

  setText(PARCH);
  doc.setFont("times", "italic");
  doc.setFontSize(11);
  doc.text("MEDIA KIT · CITYMAKOTI (PTY) LTD", margin, 44);

  doc.setFont("times", "bold");
  doc.setFontSize(34);
  doc.text(profile.name, margin, 84);

  setText(GOLD);
  doc.setFont("times", "italic");
  doc.setFontSize(16);
  doc.text('"The City Makoti"', margin, 108);

  setText(PARCH);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.text(profile.titles.join("  ·  "), margin, 130);

  // tagline chip on right
  setText([232, 169, 176]);
  doc.setFont("times", "italic");
  doc.setFontSize(13);
  doc.text(profile.tagline, pageW - margin, 84, { align: "right" });

  y = 178;

  // ---- Stats ----
  const colW = contentW / 3;
  stats.forEach((s, i) => {
    const x = margin + colW * i;
    setDraw(EMERALD);
    doc.setLineWidth(0.75);
    if (i > 0) doc.line(x, y - 4, x, y + 52);
    setText(BURGUNDY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(s.platform.toUpperCase(), x + 10, y + 6);
    setText(INK);
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    doc.text(s.primary, x + 10, y + 30);
    setText([90, 84, 76]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`${s.primaryLabel} · ${s.secondary} ${s.secondaryLabel}`, x + 10, y + 44);
  });
  y += 66;

  // ---- About ----
  sectionTitle("About");
  setText(INK);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const about =
    "Anika Dambuza is a South African content creator, entrepreneur, reality TV star and founder of CITYMAKOTI (Pty) Ltd. In an interracial, intercultural marriage, she blends her Afrikaans background with the Xhosa culture she married into. Her honest, funny storytelling explores marriage, motherhood and modern womanhood. She stars in The Real City Makoti on Mzansi Wethu (DStv 163) alongside her husband, Sihle Dambuza.";
  const aboutLines = doc.splitTextToSize(about, contentW);
  doc.text(aboutLines, margin, y);
  y += aboutLines.length * 13 + 6;

  // ---- Brand Partners ----
  sectionTitle("Selected Brand Partners");
  setText(INK);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  const perRow = 4;
  const bColW = contentW / perRow;
  brands.forEach((b, i) => {
    const row = Math.floor(i / perRow);
    const col = i % perRow;
    if (col === 0) checkPage(16);
    const bx = margin + col * bColW;
    const by = y + row * 15;
    setText(GOLD);
    doc.text("•", bx, by);
    setText(INK);
    doc.text(b, bx + 8, by);
  });
  y += Math.ceil(brands.length / perRow) * 15 + 8;

  // ---- Selected Work ----
  sectionTitle("Selected Work");
  selectedWork.forEach((w) => {
    checkPage(30);
    setText(INK);
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.text(w.title, margin, y);
    setText(EMERALD);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(w.type.toUpperCase(), pageW - margin, y, { align: "right" });
    y += 13;
    setText([90, 84, 76]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const wl = doc.splitTextToSize(w.note, contentW);
    doc.text(wl, margin, y);
    y += wl.length * 11 + 8;
  });

  // ---- Services ----
  sectionTitle("Services");
  services.forEach((s) => {
    checkPage(26);
    setText(INK);
    doc.setFont("times", "bold");
    doc.setFontSize(10.5);
    doc.text(s.title, margin, y);
    y += 12;
    setText([90, 84, 76]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const sl = doc.splitTextToSize(s.desc, contentW);
    doc.text(sl, margin, y);
    y += sl.length * 11 + 7;
  });

  // ---- Press ----
  sectionTitle("Selected Press");
  featuredPress.forEach((p) => {
    checkPage(26);
    setText(BURGUNDY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(p.outlet.toUpperCase(), margin, y);
    y += 11;
    setText(INK);
    doc.setFont("times", "italic");
    doc.setFontSize(10);
    const hl = doc.splitTextToSize(`"${p.headline}"`, contentW);
    doc.text(hl, margin, y);
    y += hl.length * 12 + 8;
  });

  // ---- Contact footer ----
  checkPage(90);
  y += 8;
  setFill(EMERALD);
  doc.rect(margin, y, contentW, 78, "F");
  setText(PARCH);
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.text("Let's build something together.", margin + 16, y + 26);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Brand & Partnerships / Press:  ${profile.email}`, margin + 16, y + 46);
  doc.setFontSize(8.5);
  setText([232, 169, 176]);
  doc.text(socials.map((s) => `${s.label}: ${s.handle}`).join("    ·    "), margin + 16, y + 64);

  doc.save("anika-dambuza-media-kit.pdf");
}
