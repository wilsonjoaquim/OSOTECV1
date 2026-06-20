import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, CreditCard, Smartphone, Banknote, CheckCircle, Star, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { usePixel } from "../hooks/usePixel";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PROVINCES = [
  "Luanda", "Benguela", "Huambo", "Bié", "Malanje", "Cabinda",
  "Cunene", "Huíla", "Kwanza Norte", "Kwanza Sul", "Lunda Norte",
  "Lunda Sul", "Moxico", "Namibe", "Uíge", "Zaire",
];

const PAYMENT_METHODS = [
  { id: "multicaixa", label: "Cartão Multicaixa / TPA", icon: CreditCard, desc: "Pague com cartão no acto da entrega" },
  { id: "transferencia", label: "Transferência Bancária", icon: Smartphone, desc: "Transfira antes da entrega" },
  { id: "entrega", label: "Pagamento na Entrega", icon: Banknote, desc: "Pague em dinheiro quando receber" },
];

export default function Checkout() {
  const { cart, updateQty, removeFromCart, cartTotal, clearCart, user } = useApp();
  const { track } = usePixel();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "", nif: "", phone: "", province: "", municipality: "", zone: "",
  });
  const [payment, setPayment] = useState("");
  const [cardData, setCardData] = useState({ number: "", expiry: "", cvv: "", holder: "" });
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const formatPrice = (p) => new Intl.NumberFormat("pt-AO").format(p) + " Kz";

  const handleSubmit = async () => {
    if (!form.fullName || !form.phone || !form.province || !payment) {
      toast.error("Preenche todos os campos obrigatórios");
      return;
    }
    if (payment === "multicaixa" && (!cardData.number || !cardData.expiry || !cardData.cvv)) {
      toast.error("Preenche os dados do cartão");
      return;
    }
    if (cart.length === 0) {
      toast.error("Carrinho vazio!");
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        items: cart.map((i) => ({
          product: i._id,
          name: i.name,
          qty: i.qty,
          price: i.price,
        })),
        customer: { userId: user?._id || null, 
          ...form, 
        },
        payment: {
          method: payment,
          ...(payment === "multicaixa" ? {
            cardLast4: cardData.number.slice(-4),
          } : {}),
        },
        total: cartTotal,
      };

      const { data } = await axios.post(`${API}/api/orders`, orderPayload);
      setOrderId(data.orderId);
      track("purchase", { orderId: data.orderId, total: cartTotal, items: cart.length });
      clearCart();
      setShowConfirm(true);
    } catch (err) {
      toast.error("Erro ao processar encomenda. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async () => {
    try {
      await axios.post(`${API}/api/orders/${orderId}/rating`, { rating, comment });
      setRatingSubmitted(true);
      toast.success("Obrigado pela tua avaliação!");
      setTimeout(() => {
        setShowConfirm(false);
        navigate("/");
      }, 2000);
    } catch {
      toast.error("Erro ao enviar avaliação");
    }
  };

  const formatCard = (val) => {
    const clean = val.replace(/\D/g, "").slice(0, 16);
    return clean.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val) => {
    const clean = val.replace(/\D/g, "").slice(0, 4);
    return clean.length > 2 ? clean.slice(0, 2) + "/" + clean.slice(2) : clean;
  };

  if (cart.length === 0 && !showConfirm) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">Carrinho Vazio</h2>
        <p className="text-gray-500 mb-6">Adiciona produtos para continuar</p>
        <button
          onClick={() => navigate("/produtos")}
          className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Ver Produtos
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-gray-800 mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section 1: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-black text-gray-800 mb-4">Resumo da Encomenda</h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-contain bg-gray-50 border border-gray-100 p-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{formatPrice(item.price)} × {item.qty}</p>
                      <p className="text-sm font-black text-blue-600">{formatPrice(item.price * item.qty)}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                        <button onClick={() => updateQty(item._id, item.qty - 1)} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item._id, item.qty + 1)} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Total</span>
                  <span className="text-2xl font-black text-blue-600">{formatPrice(cartTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 + 3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Data */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-black text-gray-800 mb-5">Dados Pessoais</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "fullName", label: "Nome Completo *", placeholder: "Ex: João Manuel" },
                  { key: "nif", label: "NIF", placeholder: "Número de Identificação Fiscal" },
                  { key: "phone", label: "Telefone *", placeholder: "+244 9XX XXX XXX" },
                ].map((field) => (
                  <div key={field.key} className={field.key === "fullName" ? "sm:col-span-2" : ""}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{field.label}</label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={form[field.key]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Província *</label>
                  <select
                    value={form.province}
                    onChange={(e) => setForm({ ...form, province: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="">Selecionar...</option>
                    {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Município</label>
                  <input
                    type="text"
                    placeholder="Ex: Talatona"
                    value={form.municipality}
                    onChange={(e) => setForm({ ...form, municipality: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Zona / Referência</label>
                  <input
                    type="text"
                    placeholder="Ex: Próximo ao Continente Shopping"
                    value={form.zone}
                    onChange={(e) => setForm({ ...form, zone: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-black text-gray-800 mb-5">Forma de Pagamento</h2>

              <div className="space-y-3 mb-5">
                {PAYMENT_METHODS.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setPayment(m.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                        payment === m.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-100 hover:border-blue-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        payment === m.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
                      }`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{m.label}</p>
                        <p className="text-xs text-gray-500">{m.desc}</p>
                      </div>
                      {payment === m.id && <CheckCircle size={20} className="ml-auto text-blue-600" />}
                    </button>
                  );
                })}
              </div>

              {/* Card Fields */}
              {payment === "multicaixa" && (
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 mb-5">
                  <p className="text-white text-xs font-semibold mb-4 opacity-75">DADOS DO CARTÃO</p>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Titular do Cartão"
                      value={cardData.holder}
                      onChange={(e) => setCardData({ ...cardData, holder: e.target.value })}
                      className="w-full bg-white/20 text-white placeholder-white/50 border border-white/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-white"
                    />
                    <input
                      type="text"
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: formatCard(e.target.value) })}
                      maxLength={19}
                      className="w-full bg-white/20 text-white placeholder-white/50 border border-white/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-white tracking-widest"
                    />
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                        maxLength={5}
                        className="flex-1 bg-white/20 text-white placeholder-white/50 border border-white/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-white"
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.slice(0, 3) })}
                        maxLength={3}
                        className="w-24 bg-white/20 text-white placeholder-white/50 border border-white/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Transfer Info */}
              {payment === "transferencia" && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-5">
                  <p className="font-bold text-green-800 mb-3">Dados Bancários</p>
                  <div className="space-y-2 text-sm text-green-700">
                    <p><strong>Banco:</strong> BFA – Banco de Fomento Angola</p>
                    <p><strong>IBAN:</strong> AO06 0040 0000 1234 5678 9012 3</p>
                    <p><strong>Nome:</strong> OSOTEC LDA</p>
                    <p className="text-xs text-green-600 mt-3">⚠️ Envie o comprovativo para o número de suporte após transferir.</p>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white font-black text-lg rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-blue-200"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle size={22} />
                    Confirmar e Finalizar Compra
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Encomenda Confirmada!</h2>
            <p className="text-gray-500 mb-1 text-sm">Nº de Pedido</p>
            <p className="font-black text-blue-600 text-lg mb-4">{orderId}</p>
            <p className="text-gray-600 text-sm mb-6">
              Receberás uma confirmação. Podes acompanhar a entrega na secção de rastreamento.
            </p>

            {!ratingSubmitted ? (
              <>
                <div className="bg-gray-50 rounded-2xl p-5 mb-4">
                  <p className="font-bold text-gray-800 mb-3">Como foi a tua experiência?</p>
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setRating(s)}>
                        <Star
                          size={32}
                          className={`transition-colors ${s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    placeholder="Comentário opcional..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
                  />
                </div>
                <button
                  onClick={submitRating}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Enviar Avaliação
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="w-full mt-2 py-3 text-gray-400 text-sm hover:text-gray-600 transition-colors"
                >
                  Saltar
                </button>
              </>
            ) : (
              <p className="text-green-600 font-bold">Obrigado pelo teu feedback! 🎉</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}