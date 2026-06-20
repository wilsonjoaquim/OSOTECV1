const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"OSOTEC" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Email error:", err.message);
  }
};

const templates = {
  newOrder: (order) => ({
    to: process.env.ADMIN_EMAIL,
    subject: `Nova Encomenda ${order.orderId}`,
    html: `
      <div style="font-family:Arial;max-width:600px;margin:auto;">
        <h1 style="color:#1D4ED8">Nova Encomenda — ${order.orderId}</h1>
        <p><strong>Cliente:</strong> ${order.customer.fullName}</p>
        <p><strong>Telefone:</strong> ${order.customer.phone}</p>
        <p><strong>Província:</strong> ${order.customer.province}</p>
        <p><strong>Total:</strong> ${new Intl.NumberFormat("pt-AO").format(order.total)} Kz</p>
        <p><strong>Pagamento:</strong> ${order.payment.method}</p>
        <h3>Produtos:</h3>
        <ul>${order.items.map(i => `<li>${i.name} × ${i.qty}</li>`).join("")}</ul>
      </div>
    `,
  }),
  
  orderConfirmation: (order) => ({
    to: order.customer.email || process.env.ADMIN_EMAIL,
    subject: `Encomenda Confirmada — ${order.orderId}`,
    html: `
      <div style="font-family:Arial;max-width:600px;margin:auto;">
        <h1 style="color:#1D4ED8">Obrigado, ${order.customer.fullName}!</h1>
        <p>A tua encomenda <strong>${order.orderId}</strong> foi confirmada.</p>
        <p>Total: <strong>${new Intl.NumberFormat("pt-AO").format(order.total)} Kz</strong></p>
        <p>Podes rastrear a tua encomenda em: ${process.env.FRONTEND_URL}/rastreamento</p>
      </div>
    `,
  }),

  newTicket: (ticket) => ({
    to: process.env.ADMIN_EMAIL,
    subject: `[TICKET] ${ticket.ticketId} — ${ticket.category}`,
    html: `
      <div style="font-family:Arial;max-width:600px;margin:auto;">
        <h1 style="color:#1D4ED8">Novo Ticket de Suporte</h1>
        <p><strong>ID:</strong> ${ticket.ticketId}</p>
        <p><strong>De:</strong> ${ticket.name} (${ticket.email})</p>
        <p><strong>Categoria:</strong> ${ticket.category}</p>
        <p><strong>Encomenda:</strong> ${ticket.orderId || "N/A"}</p>
        <div style="background:#f5f5f5;padding:15px;border-radius:8px;">
          <p>${ticket.message}</p>
        </div>
        <p>Acede ao painel admin para responder.</p>
      </div>
    `,
  }),

  ticketUpdate: (ticket, newStatus) => ({
    to: ticket.email,
    subject: `Actualização do Ticket ${ticket.ticketId}`,
    html: `
      <div style="font-family:Arial;max-width:600px;margin:auto;">
        <h1 style="color:#1D4ED8">O teu ticket foi actualizado</h1>
        <p>Ticket <strong>${ticket.ticketId}</strong> — Estado: <strong>${newStatus}</strong></p>
        <p>Podes verificar o estado em: ${process.env.FRONTEND_URL}/suporte</p>
      </div>
    `,
  }),
};

module.exports = { sendMail, templates };