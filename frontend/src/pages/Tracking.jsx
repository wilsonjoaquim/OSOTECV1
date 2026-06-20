import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Package, MapPin, Truck, CheckCircle, Clock, Search } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const STAGES = [
  { key: "confirmed", label: "Confirmado", icon: CheckCircle, desc: "Encomenda registada no sistema" },
  { key: "processing", label: "Em Preparação", icon: Package, desc: "A equipa está a preparar o teu pedido" },
  { key: "shipped", label: "Em Trânsito", icon: Truck, desc: "A encomenda está a caminho" },
  { key: "out_for_delivery", label: "Para Entrega", icon: MapPin, desc: "O estafeta está na tua direção" },
  { key: "delivered", label: "Entregue", icon: CheckCircle, desc: "Entrega concluída com sucesso!" },
];

export default function Tracking() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("id") || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

   // Auto-pesquisar se veio com ?id=
  useEffect(() => {
    if (searchParams.get("id")) {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    if (!orderId.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/orders/track/${orderId}`);
      setOrder(data);
    } catch {
      toast.error("Encomenda não encontrada");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const currentStageIndex = order ? STAGES.findIndex((s) => s.key === order.deliveryStatus) : -1;

  const formatPrice = (p) => new Intl.NumberFormat("pt-AO").format(p) + " Kz";

  return (
    <div className="min-h-screen pt-24 pb-10 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Truck size={30} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-800">Rastrear Encomenda</h1>
          <p className="text-gray-500 mt-2">Introduz o teu número de pedido para ver o estado</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Ex: ORD-ABC123"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 font-mono"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              <Search size={16} />
              {loading ? "..." : "Rastrear"}
            </button>
          </div>
        </div>

        {order && (
          <div className="space-y-5">
            {/* Order Info */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Nº DE PEDIDO</p>
                  <p className="text-xl font-black text-blue-600">{order.orderId}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-medium">TOTAL</p>
                  <p className="text-lg font-black text-gray-800">{formatPrice(order.total)}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>Destinatário:</strong> {order.customer?.fullName}</p>
                <p><strong>Endereço:</strong> {order.customer?.province}, {order.customer?.municipality}</p>
              </div>
            </div>

            {/* Delivery Timeline - Futuristic UI */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-black text-gray-800 mb-6">Trajeto da Encomenda</h2>

              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gray-100">
                  <div
                    className="bg-blue-500 transition-all duration-700"
                    style={{
                      height: `${currentStageIndex >= 0 ? (currentStageIndex / (STAGES.length - 1)) * 100 : 0}%`,
                    }}
                  />
                </div>

                <div className="space-y-6">
                  {STAGES.map((stage, i) => {
                    const Icon = stage.icon;
                    const isDone = i <= currentStageIndex;
                    const isCurrent = i === currentStageIndex;

                    return (
                      <div key={stage.key} className="flex items-start gap-4 relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                          isCurrent
                            ? "bg-blue-600 ring-4 ring-blue-100 shadow-lg shadow-blue-200"
                            : isDone
                            ? "bg-blue-500"
                            : "bg-gray-100"
                        }`}>
                          <Icon size={18} className={isDone ? "text-white" : "text-gray-400"} />
                        </div>
                        <div className={`flex-1 pb-2 ${!isDone ? "opacity-40" : ""}`}>
                          <div className="flex items-center justify-between">
                            <p className={`font-bold ${isCurrent ? "text-blue-600" : isDone ? "text-gray-800" : "text-gray-400"}`}>
                              {stage.label}
                            </p>
                            {isCurrent && (
                              <span className="text-xs bg-blue-100 text-blue-600 font-bold px-2 py-0.5 rounded-full animate-pulse">
                                Agora
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">{stage.desc}</p>
                          {order.timeline?.[stage.key] && (
                            <p className="text-xs text-blue-400 font-medium mt-1 flex items-center gap-1">
                              <Clock size={11} />
                              {new Date(order.timeline[stage.key]).toLocaleString("pt-AO")}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-black text-gray-800 mb-4">Itens da Encomenda</h2>
              <div className="space-y-3">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400">Qtd: {item.qty}</p>
                    </div>
                    <p className="font-bold text-gray-700">{formatPrice(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}