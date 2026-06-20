import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function generateInsights(data) {
  const insights = [];
  const recommendations = [];

  const convRate = parseFloat(data.analytics?.conversionRate || 0);
  const totalVisits = data.analytics?.totalVisits || 0;
  const totalOrders = data.stats?.totalOrders || 0;
  const openTickets = data.stats?.openTickets || 0;
  const avgRating = parseFloat(data.analytics?.avgRating || 0);
  const addToCart = data.analytics?.addToCart || 0;
  const checkouts = data.analytics?.checkouts || 0;

  // Conversão
  if (convRate < 2) {
    insights.push(`Taxa de conversão baixa (${convRate}%) — poucos visitantes estão a comprar.`);
    recommendations.push("Melhorar a visibilidade dos botões de compra e simplificar o processo de checkout.");
    recommendations.push("Considerar promoções ou descontos para incentivar a primeira compra.");
  } else if (convRate >= 2 && convRate < 5) {
    insights.push(`Taxa de conversão moderada (${convRate}%) — há espaço para crescimento.`);
    recommendations.push("Adicionar avaliações de clientes nos cards de produto para aumentar a confiança.");
  } else {
    insights.push(`Taxa de conversão excelente (${convRate}%) — o funil de vendas está optimizado.`);
    recommendations.push("Manter a qualidade do checkout e expandir o catálogo de produtos.");
  }

  // Carrinho vs Checkout
  if (addToCart > 0 && checkouts < addToCart * 0.5) {
    insights.push(`Alto abandono de carrinho — ${addToCart} adições ao carrinho mas só ${checkouts} chegaram ao checkout.`);
    recommendations.push("Implementar emails de recuperação de carrinho abandonado.");
    recommendations.push("Adicionar barra de progresso no checkout para reduzir ansiedade do utilizador.");
  }

  // Tickets
  if (openTickets > 5) {
    insights.push(`Volume elevado de tickets abertos (${openTickets}) — equipa de suporte sob pressão.`);
    recommendations.push("Expandir a secção de FAQ com as dúvidas mais frequentes nos tickets.");
    recommendations.push("Considerar um chatbot para respostas automáticas a perguntas comuns.");
  } else if (openTickets === 0) {
    insights.push("Nenhum ticket em aberto — excelente gestão de suporte ao cliente.");
  }

  // Satisfação
  if (avgRating > 0 && avgRating < 3.5) {
    insights.push(`Satisfação do cliente abaixo do esperado (média ${avgRating}/5).`);
    recommendations.push("Analisar os comentários negativos e identificar padrões de insatisfação.");
    recommendations.push("Implementar contacto proactivo com clientes insatisfeitos.");
  } else if (avgRating >= 4) {
    insights.push(`Satisfação do cliente muito positiva (média ${avgRating}/5).`);
    recommendations.push("Solicitar testemunhos a clientes satisfeitos para usar como prova social.");
  }

  // Visitas
  if (totalVisits > 0 && totalOrders === 0) {
    insights.push("Visitas registadas mas sem encomendas — possível problema de confiança ou preços.");
    recommendations.push("Verificar se os preços estão competitivos no mercado angolano.");
    recommendations.push("Adicionar selos de segurança e garantia mais visíveis na página principal.");
  }

  if (insights.length === 0) {
    insights.push("Sistema a funcionar normalmente. Continue a monitorizar os indicadores.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Manter a qualidade actual e continuar a recolher dados para análise futura.");
  }

  return { insights, recommendations };
}

export function generatePDFReport(data) {
  const doc = new jsPDF("p", "mm", "a4");
  const W = 210;
  const margin = 18;
  let y = 0;

  const colors = {
    blue: [29, 78, 216],
    darkBlue: [15, 42, 110],
    white: [255, 255, 255],
    lightGray: [248, 250, 252],
    gray: [100, 116, 139],
    dark: [15, 23, 42],
    green: [16, 185, 129],
    orange: [245, 158, 11],
    red: [239, 68, 68],
  };

  const formatPrice = (p) => new Intl.NumberFormat("pt-AO").format(p || 0) + " Kz";
  const today = new Date().toLocaleDateString("pt-AO", { day: "2-digit", month: "long", year: "numeric" });

  // ── CAPA ──
  doc.setFillColor(...colors.darkBlue);
  doc.rect(0, 0, W, 297, "F");

  // Padrão de pontos decorativos
  doc.setFillColor(255, 255, 255, 0.05);
  for (let i = 0; i < 8; i++) {
    doc.setFillColor(29, 78, 216);
    doc.circle(170 + i * 5, 30 + i * 8, 20, "F");
  }

  doc.setFillColor(29, 78, 216);
  doc.roundedRect(margin, 60, W - margin * 2, 3, 1.5, 1.5, "F");

  doc.setTextColor(...colors.white);
  doc.setFontSize(42);
  doc.setFont("helvetica", "bold");
  doc.text("OSOTEC", margin, 100);

  doc.setFontSize(18);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(147, 197, 253);
  doc.text("Relatório de Desempenho", margin, 115);
  doc.text("& Análise de Dados", margin, 127);

  doc.setFillColor(...colors.blue);
  doc.roundedRect(margin, 145, W - margin * 2, 3, 1.5, 1.5, "F");

  doc.setFontSize(11);
  doc.setTextColor(...colors.white);
  doc.text(`Gerado em: ${today}`, margin, 165);
  doc.text("Sistema de Comércio Electrónico · Angola", margin, 175);

  // Métricas na capa
  const coverStats = [
    { label: "Total de Vendas", value: formatPrice(data.stats?.totalRevenue) },
    { label: "Encomendas", value: String(data.stats?.totalOrders || 0) },
    { label: "Satisfação", value: data.analytics?.avgRating ? `${data.analytics.avgRating}/5 ⭐` : "N/A" },
    { label: "Visitas Totais", value: String(data.analytics?.totalVisits || 0) },
  ];

  coverStats.forEach((s, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const bx = margin + col * 88;
    const by = 200 + row * 35;
    doc.setFillColor(255, 255, 255, 0.1);
    doc.setFillColor(20, 50, 120);
    doc.roundedRect(bx, by, 82, 28, 4, 4, "F");
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.white);
    doc.text(s.value, bx + 8, by + 13);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(147, 197, 253);
    doc.text(s.label.toUpperCase(), bx + 8, by + 22);
  });

  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("Confidencial · OSOTEC © " + new Date().getFullYear(), margin, 285);
  doc.text(`Página 1 de 5`, W - margin - 20, 285);

  // ── PÁGINA 2: VISÃO GERAL ──
  doc.addPage();
  y = margin;

  // Header da página
  doc.setFillColor(...colors.blue);
  doc.rect(0, 0, W, 22, "F");
  doc.setTextColor(...colors.white);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("OSOTEC · RELATÓRIO DE DESEMPENHO", margin, 14);
  doc.text(`${today} · Pág. 2`, W - margin - 30, 14);

  y = 35;
  doc.setTextColor(...colors.dark);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Visão Geral do Sistema", margin, y);
  y += 6;

  doc.setFillColor(...colors.blue);
  doc.rect(margin, y, 40, 1.5, "F");
  y += 12;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.gray);
  const intro = `Este relatório apresenta uma análise detalhada do desempenho da plataforma OSOTEC, incluindo métricas de vendas, comportamento dos utilizadores, satisfação do cliente e recomendações estratégicas baseadas nos dados recolhidos.`;
  const introLines = doc.splitTextToSize(intro, W - margin * 2);
  doc.text(introLines, margin, y);
  y += introLines.length * 5 + 10;

  // KPIs em cards
  const kpis = [
    { label: "Total de Vendas", value: formatPrice(data.stats?.totalRevenue), icon: "💰", color: colors.green },
    { label: "Encomendas", value: String(data.stats?.totalOrders || 0), icon: "📦", color: colors.blue },
    { label: "Visitas Totais", value: String(data.analytics?.totalVisits || 0), icon: "👁", color: [139, 92, 246] },
    { label: "Taxa de Conversão", value: `${data.analytics?.conversionRate || 0}%`, icon: "📈", color: colors.orange },
    { label: "Tickets Abertos", value: String(data.stats?.openTickets || 0), icon: "🎫", color: colors.red },
    { label: "Avaliação Média", value: data.analytics?.avgRating ? `${data.analytics.avgRating}/5` : "N/A", icon: "⭐", color: colors.orange },
  ];

  kpis.forEach((kpi, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const bx = margin + col * 58;
    const by = y + row * 38;

    doc.setFillColor(...colors.lightGray);
    doc.roundedRect(bx, by, 54, 32, 3, 3, "F");
    doc.setFillColor(...kpi.color);
    doc.roundedRect(bx, by, 4, 32, 2, 2, "F");

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.dark);
    doc.text(kpi.value, bx + 8, by + 14);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colors.gray);
    doc.text(kpi.label.toUpperCase(), bx + 8, by + 24);
  });

  y += 90;

  // Funil de conversão
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.dark);
  doc.text("Funil de Conversão", margin, y);
  y += 10;

  const funnelSteps = [
    { label: "Visitas", value: data.analytics?.totalVisits || 0, color: colors.blue },
    { label: "Add to Cart", value: data.analytics?.addToCart || 0, color: [139, 92, 246] },
    { label: "Checkout", value: data.analytics?.checkouts || 0, color: colors.orange },
    { label: "Compras", value: data.stats?.totalOrders || 0, color: colors.green },
  ];

  const maxVal = Math.max(...funnelSteps.map(s => s.value), 1);

  funnelSteps.forEach((step, i) => {
    const barW = Math.max(10, (step.value / maxVal) * (W - margin * 2 - 50));
    doc.setFillColor(...colors.lightGray);
    doc.roundedRect(margin + 45, y + i * 12, W - margin * 2 - 45, 8, 2, 2, "F");
    doc.setFillColor(...step.color);
    doc.roundedRect(margin + 45, y + i * 12, barW, 8, 2, 2, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.dark);
    doc.text(step.label, margin, y + i * 12 + 6);
    doc.setTextColor(...colors.gray);
    doc.text(String(step.value), margin + 45 + barW + 3, y + i * 12 + 6);
  });

  y += funnelSteps.length * 12 + 15;

  // Footer
  doc.setFillColor(...colors.lightGray);
  doc.rect(0, 282, W, 15, "F");
  doc.setFontSize(7);
  doc.setTextColor(...colors.gray);
  doc.text("OSOTEC · Relatório de Desempenho · Confidencial", margin, 291);
  doc.text("Página 2 de 5", W - margin - 20, 291);

  // ── PÁGINA 3: VENDAS & ENCOMENDAS ──
  doc.addPage();
  doc.setFillColor(...colors.blue);
  doc.rect(0, 0, W, 22, "F");
  doc.setTextColor(...colors.white);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("OSOTEC · RELATÓRIO DE DESEMPENHO", margin, 14);
  doc.text(`${today} · Pág. 3`, W - margin - 30, 14);

  y = 35;
  doc.setTextColor(...colors.dark);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Vendas & Encomendas", margin, y);
  y += 6;
  doc.setFillColor(...colors.blue);
  doc.rect(margin, y, 40, 1.5, "F");
  y += 14;

  if (data.orders && data.orders.length > 0) {
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Nº Encomenda", "Cliente", "Província", "Pagamento", "Estado", "Total"]],
      body: data.orders.slice(0, 15).map(o => [
        o.orderId,
        o.customer?.fullName || "-",
        o.customer?.province || "-",
        o.payment?.method || "-",
        o.deliveryStatus || o.status || "-",
        formatPrice(o.total),
      ]),
      headStyles: {
        fillColor: colors.blue,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
      },
      bodyStyles: { fontSize: 7.5, textColor: colors.dark },
      alternateRowStyles: { fillColor: colors.lightGray },
      columnStyles: {
        0: { cellWidth: 28 },
        1: { cellWidth: 35 },
        2: { cellWidth: 25 },
        3: { cellWidth: 28 },
        4: { cellWidth: 25 },
        5: { cellWidth: 28, fontStyle: "bold", textColor: colors.blue },
      },
    });
    y = (doc.lastAutoTable?.finalY ?? y) + 12;
  }

  // Distribuição por estado
  const statusCounts = {};
  (data.orders || []).forEach(o => {
    const s = o.deliveryStatus || o.status || "unknown";
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });

  if (Object.keys(statusCounts).length > 0) {
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.dark);
    doc.text("Distribuição por Estado", margin, y);
    y += 10;

    Object.entries(statusCounts).forEach(([status, count], i) => {
      const pct = Math.round((count / (data.orders?.length || 1)) * 100);
      const barW = (pct / 100) * (W - margin * 2 - 60);
      const statusColors = {
        delivered: colors.green, processing: colors.blue,
        shipped: [139, 92, 246], confirmed: colors.orange, cancelled: colors.red,
      };
      const col = statusColors[status] || colors.gray;

      doc.setFillColor(...colors.lightGray);
      doc.roundedRect(margin + 50, y + i * 11, W - margin * 2 - 60, 7, 2, 2, "F");
      doc.setFillColor(...col);
      doc.roundedRect(margin + 50, y + i * 11, Math.max(5, barW), 7, 2, 2, "F");
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...colors.dark);
      doc.text(status, margin, y + i * 11 + 5.5);
      doc.text(`${count} (${pct}%)`, margin + 50 + barW + 4, y + i * 11 + 5.5);
    });
  }

  doc.setFillColor(...colors.lightGray);
  doc.rect(0, 282, W, 15, "F");
  doc.setFontSize(7);
  doc.setTextColor(...colors.gray);
  doc.text("OSOTEC · Relatório de Desempenho · Confidencial", margin, 291);
  doc.text("Página 3 de 5", W - margin - 20, 291);

  // ── PÁGINA 4: SATISFAÇÃO & SUPORTE ──
  doc.addPage();
  doc.setFillColor(...colors.blue);
  doc.rect(0, 0, W, 22, "F");
  doc.setTextColor(...colors.white);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("OSOTEC · RELATÓRIO DE DESEMPENHO", margin, 14);
  doc.text(`${today} · Pág. 4`, W - margin - 30, 14);

  y = 35;
  doc.setTextColor(...colors.dark);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Satisfação & Suporte", margin, y);
  y += 6;
  doc.setFillColor(...colors.blue);
  doc.rect(margin, y, 40, 1.5, "F");
  y += 14;

  // Caixas de métricas de satisfação
  const satMetrics = [
    { label: "Avaliação Média", value: data.analytics?.avgRating || "N/A", sub: "em 5 estrelas" },
    { label: "Total Avaliações", value: String(data.ratings?.length || 0), sub: "respostas" },
    { label: "Tickets Abertos", value: String(data.stats?.openTickets || 0), sub: "pendentes" },
  ];

  satMetrics.forEach((m, i) => {
    const bx = margin + i * 60;
    doc.setFillColor(...colors.lightGray);
    doc.roundedRect(bx, y, 55, 32, 3, 3, "F");
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.blue);
    doc.text(String(m.value), bx + 6, y + 16);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colors.gray);
    doc.text(m.label.toUpperCase(), bx + 6, y + 24);
    doc.text(m.sub, bx + 6, y + 29);
  });
  y += 44;

  // Avaliações recentes
  if (data.ratings && data.ratings.length > 0) {
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.dark);
    doc.text("Últimas Avaliações dos Clientes", margin, y);
    y += 10;

    data.ratings.slice(0, 8).forEach((r) => {
      const stars = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);
      doc.setFillColor(...colors.lightGray);
      doc.roundedRect(margin, y, W - margin * 2, r.ratingComment ? 20 : 14, 3, 3, "F");
      doc.setFillColor(r.rating >= 4 ? colors.green[0] : r.rating >= 3 ? colors.orange[0] : colors.red[0],
        r.rating >= 4 ? colors.green[1] : r.rating >= 3 ? colors.orange[1] : colors.red[1],
        r.rating >= 4 ? colors.green[2] : r.rating >= 3 ? colors.orange[2] : colors.red[2]);
      doc.roundedRect(margin, y, 3, r.ratingComment ? 20 : 14, 1.5, 1.5, "F");

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(245, 158, 11);
      doc.text(stars, margin + 7, y + 8);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...colors.gray);
      const dateStr = r.ratedAt ? new Date(r.ratedAt).toLocaleDateString("pt-AO") : "";
      doc.text(dateStr, W - margin - 20, y + 8);

      if (r.ratingComment) {
        doc.setFontSize(8);
        doc.setTextColor(...colors.dark);
        const commentLines = doc.splitTextToSize(`"${r.ratingComment}"`, W - margin * 2 - 15);
        doc.text(commentLines[0], margin + 7, y + 15);
        y += 22;
      } else {
        y += 16;
      }
    });
  }

  // Tickets
  if (data.tickets && data.tickets.length > 0) {
    y += 5;
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.dark);
    doc.text("Tickets de Suporte Recentes", margin, y);
    y += 8;

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["ID", "Cliente", "Categoria", "Estado", "Data"]],
      body: data.tickets.slice(0, 8).map(t => [
        t.ticketId, t.name, t.category, t.status,
        new Date(t.createdAt).toLocaleDateString("pt-AO"),
      ]),
      headStyles: { fillColor: colors.blue, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
      bodyStyles: { fontSize: 7.5 },
      alternateRowStyles: { fillColor: colors.lightGray },
    });
  }

  doc.setFillColor(...colors.lightGray);
  doc.rect(0, 282, W, 15, "F");
  doc.setFontSize(7);
  doc.setTextColor(...colors.gray);
  doc.text("OSOTEC · Relatório de Desempenho · Confidencial", margin, 291);
  doc.text("Página 4 de 5", W - margin - 20, 291);

  // ── PÁGINA 5: ANÁLISE & RECOMENDAÇÕES ──
  doc.addPage();
  doc.setFillColor(...colors.blue);
  doc.rect(0, 0, W, 22, "F");
  doc.setTextColor(...colors.white);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("OSOTEC · RELATÓRIO DE DESEMPENHO", margin, 14);
  doc.text(`${today} · Pág. 5`, W - margin - 30, 14);

  y = 35;
  doc.setTextColor(...colors.dark);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Análise & Recomendações", margin, y);
  y += 6;
  doc.setFillColor(...colors.blue);
  doc.rect(margin, y, 40, 1.5, "F");
  y += 14;

  const { insights, recommendations } = generateInsights(data);

  // Insights
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.dark);
  doc.text("🔍 Insights Identificados", margin, y);
  y += 10;

  insights.forEach((insight, i) => {
    doc.setFillColor(239, 246, 255);
    const insightLines = doc.splitTextToSize(insight, W - margin * 2 - 16);
    const boxH = insightLines.length * 5 + 10;
    doc.roundedRect(margin, y, W - margin * 2, boxH, 3, 3, "F");
    doc.setFillColor(...colors.blue);
    doc.roundedRect(margin, y, 3, boxH, 1.5, 1.5, "F");
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colors.dark);
    doc.text(insightLines, margin + 8, y + 7);
    y += boxH + 5;
  });

  y += 8;

  // Recomendações
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.dark);
  doc.text("✅ Recomendações Estratégicas", margin, y);
  y += 10;

  recommendations.forEach((rec, i) => {
    const recLines = doc.splitTextToSize(`${i + 1}. ${rec}`, W - margin * 2 - 16);
    const boxH = recLines.length * 5 + 10;
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, y, W - margin * 2, boxH, 3, 3, "F");
    doc.setFillColor(...colors.green);
    doc.roundedRect(margin, y, 3, boxH, 1.5, 1.5, "F");
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colors.dark);
    doc.text(recLines, margin + 8, y + 7);
    y += boxH + 5;
  });

  y += 8;

  // Nota final
  doc.setFillColor(...colors.darkBlue);
  doc.roundedRect(margin, y, W - margin * 2, 28, 4, 4, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.white);
  doc.text("Próximos Passos", margin + 8, y + 10);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(147, 197, 253);
  const nextSteps = "Reveja este relatório com a equipa, priorize as recomendações por impacto e implemente as acções mais críticas nas próximas 2 semanas. Gere um novo relatório após 30 dias para medir o progresso.";
  const nsLines = doc.splitTextToSize(nextSteps, W - margin * 2 - 16);
  doc.text(nsLines, margin + 8, y + 18);

  // Footer final
  doc.setFillColor(...colors.darkBlue);
  doc.rect(0, 282, W, 15, "F");
  doc.setFontSize(7);
  doc.setTextColor(147, 197, 253);
  doc.text("OSOTEC · Relatório de Desempenho · Confidencial", margin, 291);
  doc.text("Página 5 de 5", W - margin - 20, 291);

  const filename = `OSOTEC_Relatorio_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}