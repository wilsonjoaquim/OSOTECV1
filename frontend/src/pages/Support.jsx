import { useState } from "react";
import { MessageSquare, Send, CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { usePixel } from "../hooks/usePixel";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CATEGORIES = [
  "Problema com encomenda",
  "Pagamento",
  "Produto com defeito",
  "Cancelamento",
  "Informação de produto",
  "Entrega / Rastreamento",
  "Outro",
];

const TICKET_STATUSES = {
  open: { label: "Aberto", icon: AlertCircle, color: "text-orange-500 bg-orange-50" },
  in_progress: { label: "Em Progresso", icon: Clock, color: "text-blue-500 bg-blue-50" },
  resolved: { label: "Resolvido", icon: CheckCircle, color: "text-green-500 bg-green-50" },
  closed: { label: "Fechado", icon: XCircle, color: "text-gray-500 bg-gray-50" },
};

export default function Support() {
  const { track } = usePixel();
  const [tab, setTab] = useState("new");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", orderId: "", category: "", message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [trackId, setTrackId] = useState("");
  const [trackedTicket, setTrackedTicket] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.category || !form.message) {
      toast.error("Preenche todos os campos obrigatórios");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/tickets`, form);
      setTicketId(data.ticketId);
      track("ticket_created", { ticketId: data.ticketId, category: form.category });
      setSubmitted(true);
    } catch {
      toast.error("Erro ao criar ticket. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async () => {
    if (!trackId.trim()) return;
    setTrackLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/tickets/${trackId}`);
      setTrackedTicket(data);
    } catch {
      toast.error("Ticket não encontrado");
      setTrackedTicket(null);
    } finally {
      setTrackLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-10 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={30} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-800">Centro de Suporte</h1>
          <p className="text-gray-500 mt-2">A nossa equipa responde em menos de 2 horas</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-2xl border border-gray-100 p-1 mb-6">
          <button
            onClick={() => setTab("new")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === "new" ? "bg-blue-600 text-white shadow" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Novo Ticket
          </button>
          <button
            onClick={() => setTab("track")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === "track" ? "bg-blue-600 text-white shadow" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Acompanhar Ticket
          </button>
        </div>

        {tab === "new" && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-black text-gray-800 mb-2">Ticket Criado!</h2>
                <p className="text-gray-500 mb-2">O teu número de ticket é:</p>
                <p className="text-2xl font-black text-blue-600 mb-4">{ticketId}</p>
                <p className="text-sm text-gray-500">Guarda este número para acompanhar o teu pedido.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", orderId: "", category: "", message: "" }); }}
                  className="mt-5 text-blue-600 font-semibold hover:underline text-sm"
                >
                  Criar outro ticket
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "name", label: "Nome *", placeholder: "Teu nome completo" },
                    { key: "email", label: "Email *", placeholder: "email@exemplo.com" },
                    { key: "phone", label: "Telefone", placeholder: "+244 9XX XXX XXX" },
                    { key: "orderId", label: "Nº de Encomenda", placeholder: "Ex: ORD-1234" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{f.label}</label>
                      <input
                        type="text"
                        placeholder={f.placeholder}
                        value={form[f.key]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Categoria *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="">Selecionar assunto...</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mensagem *</label>
                  <textarea
                    placeholder="Descreve o teu problema com o máximo de detalhe..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send size={18} /> Enviar Ticket</>}
                </button>
              </div>
            )}
          </div>
        )}

        {tab === "track" && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                placeholder="Insere o número do teu ticket (ex: TKT-1234)"
                value={trackId}
                onChange={(e) => setTrackId(e.target.value.toUpperCase())}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
              <button
                onClick={handleTrack}
                disabled={trackLoading}
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {trackLoading ? "..." : "Pesquisar"}
              </button>
            </div>

            {trackedTicket && (
              <div>
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl mb-4 ${TICKET_STATUSES[trackedTicket.status]?.color}`}>
                  {(() => {
                    const StatusIcon = TICKET_STATUSES[trackedTicket.status]?.icon;
                    return StatusIcon ? <StatusIcon size={18} /> : null;
                  })()}
                  <span className="font-bold">{TICKET_STATUSES[trackedTicket.status]?.label}</span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Ticket</span>
                    <span className="font-bold text-blue-600">{trackedTicket.ticketId}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Categoria</span>
                    <span className="font-semibold">{trackedTicket.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Criado em</span>
                    <span className="font-semibold">{new Date(trackedTicket.createdAt).toLocaleDateString("pt-AO")}</span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mt-5">
                  <h3 className="font-bold text-gray-800 mb-3">Histórico</h3>
                  <div className="space-y-3">
                    {trackedTicket.timeline?.map((event, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-gray-700">{event.action}</p>
                          <p className="text-xs text-gray-400">{new Date(event.date).toLocaleString("pt-AO")}</p>
                          {event.note && <p className="text-xs text-gray-500 mt-1 bg-gray-50 rounded-lg px-3 py-2">{event.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}