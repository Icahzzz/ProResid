import { jsPDF } from "jspdf";

// --- FUNCIÓN COMPARTIDA PARA LA FECHA ---
const obtenerFechaTexto = () => {
  const fechaActual = new Date();
  const dia = fechaActual.getDate();
  const anio = fechaActual.getFullYear();
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  return `Oaxaca de Juárez, Oaxaca, a ${dia} de ${meses[fechaActual.getMonth()]} de ${anio}`;
};

// --- DOCUMENTO 1: ASIGNACIÓN DE ASESOR ---
export const generarPDF = (datos) => {
  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "letter"
  });

  const marginX = 25;
  let y = 30;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(obtenerFechaTexto(), 105, y); 
  
  y += 5;
  doc.text(`OFICIO No. __________`, 138, y);
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.text(`ASUNTO:`, 130, y);
  doc.text(`Asignación de Asesor`, 147, y);
  y += 5;
  doc.text(`interno de Residencia Profesional.`, 130, y);

  y += 20;
  doc.setFontSize(11);
  doc.text(`C. ____________________________________`, marginX, y);
  y += 5;
  doc.text(`CATEDRÁTICO DEL I.T. DE OAXACA`, marginX, y);
  y += 5;
  doc.text(`P R E S E N T E.`, marginX, y);

  y += 15;
  doc.setFont("helvetica", "normal");
  const cuerpo = `Por este conducto informo a usted que ha sido asignado para fungir como Asesor Interno del Proyecto de Residencias Profesionales que a continuación se describe:`;
  doc.text(doc.splitTextToSize(cuerpo, 165), marginX, y);

  y += 15;
  const tableWidth = 165;
  const col1Width = 50;
  const rowHeight = 10;
  const tableData = [
    { label: "Nombre del Residente:", value: datos['NOMBRE COMPLETO:'] },
    { label: "Carrera:", value: datos['CARRERA:'] },
    { label: "Nombre del Proyecto:", value: datos['NOMBRE DEL PROYECTO:'] },
    { label: "Periodo de Realización", value: datos['PERIODO:'] },
    { label: "Empresa", value: datos['EMPRESA:'] }
  ];

  tableData.forEach((row) => {
    doc.rect(marginX, y, col1Width, rowHeight);
    doc.rect(marginX + col1Width, y, tableWidth - col1Width, rowHeight);
    doc.setFont("helvetica", "normal");
    doc.text(row.label, marginX + 2, y + 6);
    const valor = String(row.value || "");
    const valorCortado = doc.splitTextToSize(valor, tableWidth - col1Width - 4);
    doc.text(valorCortado, marginX + col1Width + 2, y + 6);
    y += rowHeight;
  });

  y += 15;
  const p1 = `Así mismo, le solicito dar el seguimiento pertinente a la realización del proyecto aplicando los lineamientos establecidos para ello, en el Procedimiento para Realizar y Acreditar la Residencia Profesional.`;
  doc.text(doc.splitTextToSize(p1, 165), marginX, y);

  y += 15;
  const p2 = `Agradezco de antemano su valioso apoyo en esta importante actividad para la formación profesional de nuestro estudiantado.`;
  doc.text(doc.splitTextToSize(p2, 165), marginX, y);

  y += 15;
  doc.setFont("helvetica", "normal");
  doc.text("A t e n t a m e n t e.", 105, y, { align: "center" });

  y += 20;
  doc.line(75, y, 145, y); 
  y += 5;
  doc.setFontSize(10);
  doc.text("Nombre y Firma del Jefe académico", 110, y, { align: "center" });

  y += 15; 
  doc.setFontSize(9); 
  doc.text("c.c.p. Coordinación de Carrera", marginX, y);
  y += 5;
  doc.text("c.c.p. Expediente", marginX, y);

  doc.save(`Oficio_Asignacion_${datos['NOMBRE COMPLETO:'] || 'Residente'}.pdf`);
};

// --- DOCUMENTO 2: ACEPTACIÓN DE REPORTE PRELIMINAR ---
export const generarAceptacionPDF = (datos) => {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "letter" });
  const marginX = 25;
  let y = 30;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(obtenerFechaTexto(), 105, y); // Llamada correcta a la función
  
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.text("ASUNTO: Aceptación del Reporte", 125, y);
  y += 5;
  doc.text("Preliminar Residencia Profesional.", 120, y);

  y += 15;
  doc.text(`C. ${datos['JEFE_DEP'] || '________________________'}`, marginX, y);
  y += 5;
  doc.text(`Jefe (a) del Departamento de ${datos['DEPARTAMENTO'] || '__________'}`, marginX, y);
  y += 5;
  doc.text("P R E S E N T E", marginX, y);

  y += 15;
  doc.setFont("helvetica", "normal");
  const textoCuerpo = `En respuesta al oficio XXXX, informo a usted que el Reporte Preliminar de Residencias Profesionales del estudiante de la carrera de ${datos['CARRERA:'] || '__________'},`;
  doc.text(doc.splitTextToSize(textoCuerpo, 165), marginX, y);

  y += 10;
  const colWidths = [25, 40, 50, 25, 25];
  const headers = ["No. Control", "Estudiante", "Título del Reporte", "F. inicio", "F. término"];
  const keys = ['CONTROL', 'NOMBRE COMPLETO:', 'PROYECTO', 'INICIO', 'TERMINO'];

  doc.setFontSize(9);
  let currentX = marginX;
  headers.forEach((h, i) => {
    doc.rect(currentX, y, colWidths[i], 8);
    doc.text(h, currentX + 2, y + 5);
    currentX += colWidths[i];
  });

  y += 8;
  currentX = marginX;
  keys.forEach((k, i) => {
    doc.rect(currentX, y, colWidths[i], 12);
    const val = doc.splitTextToSize(String(datos[k] || ""), colWidths[i] - 2);
    doc.text(val, currentX + 2, y + 5);
    currentX += colWidths[i];
  });

  y += 25;
  doc.text("Una vez que se ha revisado es considerado como:", marginX, y);
  y += 8;
  doc.text("Aprobado:", marginX, y);
  doc.rect(marginX + 20, y - 4, 6, 6);

  y += 15;
  doc.text("Comentarios u observaciones:", marginX, y);
  doc.line(marginX, y + 4, 190, y + 4);
  doc.line(marginX, y + 10, 190, y + 10);

  y += 35;
  doc.setFont("helvetica", "bold");
  doc.text("Atentamente", marginX, y);
  y += 25;
  doc.line(marginX, y, marginX + 70, y);
  y += 5;
  doc.text("Nombre y Firma del Asesor interno", marginX, y);

  y += 15;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("c.c.p. Jefatura de la División de Estudios Profesionales", marginX, y);
  y += 4;
  doc.text("c.c.p. Archivo", marginX, y);

  doc.save(`Aceptacion_Reporte_${datos['NOMBRE COMPLETO:'] || 'Residente'}.pdf`);
};