import jsPDF from "jspdf";
import "jspdf-autotable";

interface InformeData {
  resumen_ejecutivo: string;
  analisis_mercado: string;
  valoracion_estimada: string;
  factores_positivos: string[];
  factores_negativos: string[];
  recomendaciones: string[];
  metodologia: string;
  disclaimer: string;
}

interface InmuebleData {
  tipo: string;
  ubicacion: string;
  superficie?: string;
  superficieTerreno?: string;
  habitaciones?: string;
  banos?: string;
  antiguedad?: string;
  estado?: string;
}

export function exportInformePdf(informe: InformeData, inmueble: InmuebleData) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const primaryColor: [number, number, number] = [37, 99, 235];
  const darkColor: [number, number, number] = [15, 23, 42];
  const mutedColor: [number, number, number] = [100, 116, 139];
  const greenColor: [number, number, number] = [22, 163, 74];
  const redColor: [number, number, number] = [220, 38, 38];

  const checkPage = (needed: number) => {
    if (y + needed > 270) {
      doc.addPage();
      y = 20;
    }
  };

  const addSection = (title: string, color: [number, number, number] = primaryColor) => {
    checkPage(20);
    doc.setFillColor(...color);
    doc.rect(margin, y, contentWidth, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(title, margin + 4, y + 5.5);
    y += 12;
  };

  const addParagraph = (text: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...darkColor);
    const lines = doc.splitTextToSize(text, contentWidth);
    checkPage(lines.length * 4.5);
    doc.text(lines, margin, y);
    y += lines.length * 4.5 + 4;
  };

  const addBulletList = (items: string[], bulletColor: [number, number, number] = primaryColor, bulletChar = "•") => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    items.forEach((item) => {
      const lines = doc.splitTextToSize(item, contentWidth - 8);
      checkPage(lines.length * 4.5 + 2);
      doc.setTextColor(...bulletColor);
      doc.text(bulletChar, margin + 2, y);
      doc.setTextColor(...darkColor);
      doc.text(lines, margin + 8, y);
      y += lines.length * 4.5 + 1.5;
    });
    y += 2;
  };

  // === HEADER ===
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("INFORME DE VALORACIÓN", margin, 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("INMOBILIARIA", margin, 26);
  doc.setFontSize(8);
  doc.text(`Fecha: ${new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}`, pageWidth - margin - 50, 18);
  doc.text("Generado por Pynmo Tools", pageWidth - margin - 50, 24);
  y = 48;

  // === PROPERTY DATA TABLE ===
  const tableData = [
    ["Tipo", inmueble.tipo || "—"],
    ["Ubicación", inmueble.ubicacion || "—"],
    ["Sup. construida", inmueble.superficie ? `${inmueble.superficie} m²` : "—"],
    ["Sup. terreno", inmueble.superficieTerreno ? `${inmueble.superficieTerreno} m²` : "—"],
    ["Habitaciones", inmueble.habitaciones || "—"],
    ["Baños", inmueble.banos || "—"],
    ["Antigüedad", inmueble.antiguedad ? `${inmueble.antiguedad} años` : "—"],
    ["Estado", inmueble.estado || "—"],
  ];

  (doc as any).autoTable({
    startY: y,
    head: [["Característica", "Valor"]],
    body: tableData,
    margin: { left: margin, right: margin },
    headStyles: { fillColor: primaryColor, fontSize: 9, font: "helvetica" },
    bodyStyles: { fontSize: 9, font: "helvetica", textColor: darkColor },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 45 } },
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  // === SECTIONS ===
  addSection("RESUMEN EJECUTIVO");
  addParagraph(informe.resumen_ejecutivo);

  addSection("VALORACIÓN ESTIMADA", [22, 163, 74]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...darkColor);
  const valLines = doc.splitTextToSize(informe.valoracion_estimada, contentWidth);
  checkPage(valLines.length * 5);
  doc.text(valLines, margin, y);
  y += valLines.length * 5 + 6;

  addSection("ANÁLISIS DE MERCADO");
  addParagraph(informe.analisis_mercado);

  addSection("FACTORES POSITIVOS", greenColor);
  addBulletList(informe.factores_positivos, greenColor, "✓");

  addSection("FACTORES NEGATIVOS", redColor);
  addBulletList(informe.factores_negativos, redColor, "✗");

  addSection("RECOMENDACIONES");
  addBulletList(informe.recomendaciones, primaryColor, "→");

  addSection("METODOLOGÍA", mutedColor);
  doc.setFontSize(8);
  doc.setTextColor(...mutedColor);
  const methLines = doc.splitTextToSize(informe.metodologia, contentWidth);
  checkPage(methLines.length * 3.5);
  doc.text(methLines, margin, y);
  y += methLines.length * 3.5 + 6;

  // === DISCLAIMER ===
  checkPage(20);
  doc.setFillColor(245, 247, 250);
  const disclaimerLines = doc.splitTextToSize(informe.disclaimer, contentWidth - 8);
  const disclaimerHeight = disclaimerLines.length * 3.5 + 8;
  doc.rect(margin, y, contentWidth, disclaimerHeight, "F");
  doc.setFontSize(7);
  doc.setTextColor(...mutedColor);
  doc.text(disclaimerLines, margin + 4, y + 5);
  y += disclaimerHeight + 4;

  // === FOOTER on every page ===
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(...mutedColor);
    doc.text(`Pynmo Tools — Informe de Valoración`, margin, 290);
    doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin - 25, 290);
  }

  doc.save(`informe-valoracion-${Date.now()}.pdf`);
}
