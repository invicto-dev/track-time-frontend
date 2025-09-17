// src/utils/pdfGenerator.ts

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { TimeEntry, TimeRecord, User } from "../types";

// Mapeamento para traduzir os tipos de entrada
const entryTypeTranslations: Record<TimeEntry["type"], string> = {
  CLOCK_IN: "Entrada",
  CLOCK_OUT: "Saída",
  BREAK_IN: "Retorno do Intervalo",
  BREAK_OUT: "Saída para Intervalo",
};

/**
 * Gera um PDF com o histórico de ponto de um funcionário.
 * @param employee - O objeto com os dados do funcionário.
 * @param records - Um array com os registros de ponto diários.
 * @param month - O nome do mês.
 */
export const generateTimeRecordPDF = (
  employee: User,
  records: TimeRecord[],
  month: string
): void => {
  // 1. Inicializa o documento PDF
  const doc = new jsPDF({
    orientation: "p", // p = portrait (retrato)
    unit: "mm",
    format: "a4",
  });

  // --- Cabeçalho do Documento ---
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Relatório de Espelho de Ponto", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Funcionário(a): ${employee.name}`, 14, 35);
  doc.text(`Cargo: ${employee.position}`, 14, 42);
  doc.text(`Email: ${employee.email}`, 14, 49);

  // Linha divisória
  doc.setLineWidth(0.5);
  doc.line(14, 55, 196, 55);

  let currentY = 65; // Posição Y inicial para o conteúdo dos registros

  // 2. Itera sobre cada registro diário para criar as seções
  records.forEach((record, index) => {
    // Formata a data para o padrão brasileiro
    const recordDate = new Date(record.createdAt);
    const formattedDate = recordDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Adiciona uma nova página se não houver espaço suficiente
    if (currentY > 250) {
      // Margem inferior de segurança
      doc.addPage();
      currentY = 20;
    }

    // --- Cabeçalho do Dia ---
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Data: ${formattedDate}`, 14, currentY);
    currentY += 8;

    // --- Resumo do Dia ---
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Horas Totais: ${record.totalHours.toFixed(2)}h`, 14, currentY);
    doc.text(`Horas Extras: ${record.overtimeHours.toFixed(2)}h`, 60, currentY);
    doc.text(`Status: ${record.status}`, 110, currentY);
    currentY += 10;

    // 3. Monta os dados para a tabela de marcações
    const tableHead = [["Tipo", "Horário", "Atraso?"]];
    const tableBody = record.entries.map((entry) => [
      entryTypeTranslations[entry.type] || entry.type,
      new Date(entry.timestamp).toLocaleTimeString("pt-BR"),
      entry.isLate ? "Sim" : "Não",
    ]);

    // 4. Gera a tabela usando jspdf-autotable
    autoTable(doc, {
      head: tableHead,
      body: tableBody,
      startY: currentY,
      theme: "striped", // 'striped', 'grid', 'plain'
      headStyles: {
        fillColor: [41, 128, 185], // Cor de fundo do cabeçalho (azul)
        textColor: [255, 255, 255], // Cor do texto (branco)
        fontStyle: "bold",
      },
      margin: { top: 10, right: 14, bottom: 10, left: 14 },
    });

    // Atualiza a posição Y para depois da tabela
    currentY = (doc as any).lastAutoTable.finalY + 10;

    // Adiciona justificativa se houver
    if (record.justification) {
      doc.setFont("helvetica", "bold");
      doc.text("Justificativa:", 14, currentY);
      doc.setFont("helvetica", "normal");
      // A função splitTextToSize quebra o texto longo em várias linhas para caber na largura da página
      const justificationLines = doc.splitTextToSize(record.justification, 182); // 196 (largura A4) - 14 (margem)
      doc.text(justificationLines, 14, currentY + 5);
      currentY += 5 + justificationLines.length * 5; // Incrementa Y baseado no número de linhas
    }

    // Adiciona um espaço entre os dias
    currentY += 5;
    if (index < records.length - 1) {
      doc.setDrawColor(200); // Cor cinza claro para a linha
      doc.line(14, currentY, 196, currentY);
      currentY += 10;
    }
  });

  // --- Rodapé ---
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Página ${i} de ${pageCount}`, 196, 285, { align: "right" });
    doc.text(`Emitido em: ${new Date().toLocaleString("pt-BR")}`, 14, 285);
  }

  // 5. Salva o arquivo PDF
  const fileName = `relatorio_ponto_${month}_${employee.name.replace(
    /\s+/g,
    "_"
  )}.pdf`;
  doc.save(fileName);
};
