import { generatePDFReport } from "../utils/generateReport";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Package, ShoppingBag, MessageSquare,
  BarChart3, LogOut, Star, TrendingUp, Eye, ChevronRight,
  ArrowUpRight, Clock, CheckCircle2, AlertCircle, XCircle,
  Truck, RefreshCw, Plus, Trash2, Filter, Activity
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import ImageUploader from "../components/ImageUploader";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Encomendas", icon: ShoppingBag },
  { id: "products", label: "Produtos", icon: Package },
  { id: "tickets", label: "Tickets", icon: MessageSquare },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "heatmap", label: "Heatmap", icon: Activity },
  { id: "abtests", label: "Testes A/B", icon: TrendingUp },
  { id: "satisfaction", label: "Satisfação", icon: Star },
];

const ORDER_STAGES = [
  { key: "confirmed", label: "Confirmado", emoji: "✅" },
  { key: "processing", label: "Em Preparação", emoji: "📦" },
  { key: "shipped", label: "Em Trânsito", emoji: "🚚" },
  { key: "out_for_delivery", label: "Para Entrega", emoji: "📍" },
  { key: "delivered", label: "Entregue", emoji: "🎉" },
];

const TICKET_STAGES = [
  { key: "open", label: "Aberto", color: "bg-orange-500" },
  { key: "in_progress", label: "Em Progresso", color: "bg-blue-500" },
  { key: "resolved", label: "Resolvido", color: "bg-green-500" },
  { key: "closed", label: "Fechado", color: "bg-gray-400" },
];

const statusColor = (s) => ({
  delivered: "bg-green-100 text-green-700 border-green-200",
  processing: "bg-blue-100 text-blue-700 border-blue-200",
  shipped: "bg-purple-100 text-purple-700 border-purple-200",
  out_for_delivery: "bg-indigo-100 text-indigo-700 border-indigo-200",
  confirmed: "bg-amber-100 text-amber-700 border-amber-200",
})[s] || "bg-gray-100 text-gray-600 border-gray-200";

const ticketColor = (s) => ({
  open: "bg-orange-100 text-orange-700 border-orange-200",
  in_progress: "bg-blue-100 text-blue-700 border-blue-200",
  resolved: "bg-green-100 text-green-700 border-green-200",
  closed: "bg-gray-100 text-gray-500 border-gray-200",
})[s] || "bg-gray-100 text-gray-600";

export default function Admin() {
  const [auth, setAuth] = useState({ email: "", password: "", loggedIn: false });
  const [tab, setTab] = useState("dashboard");
  const [data, setData] = useState({ stats: {}, orders: [], products: [], tickets: [], analytics: {}, ratings: [] });
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "", brand: "", stock: "", condition: "novo", image: "", description: "" });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const login = async () => {
    try {
      const res = await axios.post(`${API}/api/admin/login`, { email: auth.email, password: auth.password });
      localStorage.setItem("osotec_admin_token", res.data.token);
      setAuth((a) => ({ ...a, loggedIn: true }));
      loadAll();
    } catch { toast.error("Credenciais inválidas"); }
  };

  const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("osotec_admin_token")}` });

  const loadAll = async () => {
    setLoading(true);
    try {
      const [stats, orders, products, tickets, analytics, ratings, abtestsRes] = await Promise.all([
        axios.get(`${API}/api/admin/stats`, { headers: getHeaders() }),
        axios.get(`${API}/api/admin/orders`, { headers: getHeaders() }),
        axios.get(`${API}/api/products`),
        axios.get(`${API}/api/admin/tickets`, { headers: getHeaders() }),
        axios.get(`${API}/api/admin/analytics`, { headers: getHeaders() }),
        axios.get(`${API}/api/admin/ratings`, { headers: getHeaders() }),
        axios.get(`${API}/api/abtests`, { headers: getHeaders() }),
      ]);
      setData({ stats: stats.data, orders: orders.data, products: products.data.products, tickets: tickets.data, analytics: analytics.data, ratings: ratings.data });
      setAbTests(abtestsRes.data);
    } catch { toast.error("Erro ao carregar dados"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const token = localStorage.getItem("osotec_admin_token");
    if (token) { setAuth((a) => ({ ...a, loggedIn: true })); loadAll(); }
  }, []);
  const loadHeatmap = async (page) => {
    setHeatmapPage(page);
    setHeatmapLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/heatmap/data?page=${page}`, { headers: getHeaders() });
      setHeatmapData(data.clicks || []);
    } catch {
      setHeatmapData([]);
    } finally {
      setHeatmapLoading(false);
    }
  };


  useEffect(() => {
    if (tab === "heatmap") loadHeatmap(heatmapPage);
  }, [tab]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`${API}/api/admin/orders/${orderId}/status`, { status }, { headers: getHeaders() });
      toast.success("Estado actualizado!");
      loadAll();
    } catch { toast.error("Erro ao actualizar"); }
  };

  const updateTicketStatus = async (ticketId, status) => {
    try {
      await axios.put(`${API}/api/admin/tickets/${ticketId}/status`, { status }, { headers: getHeaders() });
      toast.success("Ticket actualizado!");
      loadAll();
    } catch { toast.error("Erro ao actualizar ticket"); }
  };

  const createProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) { toast.error("Preenche os campos obrigatórios"); return; }
    try {
      await axios.post(`${API}/api/products`, { ...newProduct, price: Number(newProduct.price), stock: Number(newProduct.stock) }, { headers: getHeaders() });
      toast.success("Produto criado!");
      setNewProduct({ name: "", price: "", category: "", brand: "", stock: "", condition: "novo", image: "", description: "" });
      loadAll();
    } catch { toast.error("Erro ao criar produto"); }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Tens a certeza?")) return;
    try {
      await axios.delete(`${API}/api/products/${id}`, { headers: getHeaders() });
      toast.success("Produto eliminado");
      loadAll();
    } catch { toast.error("Erro ao eliminar"); }
  };

  const formatPrice = (p) => new Intl.NumberFormat("pt-AO").format(p) + " Kz";
  const formatDate = (d) => new Date(d).toLocaleDateString("pt-AO", { day: "2-digit", month: "short", year: "numeric" });


  const [heatmapData, setHeatmapData] = useState([]);
  const [abTests, setAbTests] = useState([]);

  const [heatmapPage, setHeatmapPage] = useState("home");
  const [heatmapLoading, setHeatmapLoading] = useState(false);

  // ─── LOGIN ───────────────────────────────────────────────
  if (!auth.loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
        <div className="w-full max-w-md">
          {/* Glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-96 h-96 bg-blue-600 rounded-full opacity-10 blur-3xl" />
          </div>

          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
                <span className="text-white font-black text-xl">OS</span>
              </div>
              <h1 className="text-3xl font-black text-white">OSOTEC</h1>
              <p className="text-blue-300 text-sm mt-1 font-medium">Painel de Administração</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-blue-300 mb-1.5 block uppercase tracking-wider">Email</label>
                <input
                  type="email" placeholder="admin@osotec.ao"
                  value={auth.email}
                  onChange={(e) => setAuth({ ...auth, email: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-blue-300 mb-1.5 block uppercase tracking-wider">Senha</label>
                <input
                  type="password" placeholder="••••••••••"
                  value={auth.password}
                  onChange={(e) => setAuth({ ...auth, password: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && login()}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                />
              </div>
              <button
                onClick={login}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 mt-2"
              >
                Entrar no Painel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN LAYOUT ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} transition-all duration-300 bg-slate-900 fixed left-0 top-0 bottom-0 flex flex-col z-30 shadow-2xl`}>
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-600/30">
              <span className="text-white font-black text-xs">OS</span>
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-black text-white text-sm">OSOTEC</p>
                <p className="text-xs text-slate-400">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && <span>{t.label}</span>}
                {sidebarOpen && isActive && <ChevronRight size={14} className="ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => { localStorage.removeItem("osotec_admin_token"); setAuth({ email: "", password: "", loggedIn: false }); }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && "Sair"}
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className={`${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300 flex-1 min-h-screen`}>

        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-100 shadow-sm px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors">
              <div className="space-y-1">
                <div className="w-4 h-0.5 bg-slate-600" />
                <div className="w-4 h-0.5 bg-slate-600" />
                <div className="w-4 h-0.5 bg-slate-600" />
              </div>
            </button>
            <div>
              <h1 className="font-black text-slate-800 text-lg">{TABS.find(t => t.id === tab)?.label}</h1>
              <p className="text-xs text-slate-400">{new Date().toLocaleDateString("pt-AO", { weekday: "long", day: "numeric", month: "long" })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => generatePDFReport(data)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors text-sm"
            >
              Exportar Relatório
            </button>
            <button onClick={loadAll} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-xl hover:bg-blue-100 transition-colors text-sm">
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Actualizar
            </button>
          </div>
        </header>

        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* ── DASHBOARD ── */}
          {tab === "dashboard" && !loading && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { label: "Total de Vendas", value: formatPrice(data.stats.totalRevenue || 0), icon: TrendingUp, from: "from-emerald-500", to: "to-green-600", light: "bg-emerald-50 text-emerald-600", change: "+12%" },
                  { label: "Encomendas", value: data.stats.totalOrders || 0, icon: ShoppingBag, from: "from-blue-500", to: "to-blue-700", light: "bg-blue-50 text-blue-600", change: "+4" },
                  { label: "Tickets Abertos", value: data.stats.openTickets || 0, icon: MessageSquare, from: "from-orange-400", to: "to-orange-600", light: "bg-orange-50 text-orange-500", change: "Pendentes" },
                  { label: "Visitas Hoje", value: data.stats.todayVisits || 0, icon: Eye, from: "from-violet-500", to: "to-purple-700", light: "bg-violet-50 text-violet-600", change: "Sessões" },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.from} ${s.to} flex items-center justify-center shadow-lg`}>
                          <Icon size={20} className="text-white" />
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.light}`}>{s.change}</span>
                      </div>
                      <p className="text-2xl font-black text-slate-800 mb-1">{s.value}</p>
                      <p className="text-sm text-slate-400 font-medium">{s.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Recent Orders Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                  <h2 className="font-black text-slate-800">Últimas Encomendas</h2>
                  <button onClick={() => setTab("orders")} className="text-sm text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1">
                    Ver todas <ArrowUpRight size={14} />
                  </button>
                </div>
                <div className="divide-y divide-slate-50">
                  {data.orders.slice(0, 6).map((order) => (
                    <div key={order._id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                          <ShoppingBag size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{order.orderId}</p>
                          <p className="text-xs text-slate-400">{order.customer?.fullName} · {formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-3 py-1 rounded-full font-bold border ${statusColor(order.deliveryStatus || order.status)}`}>
                          {ORDER_STAGES.find(s => s.key === (order.deliveryStatus || order.status))?.label || order.status}
                        </span>
                        <p className="font-black text-blue-600 text-sm">{formatPrice(order.total)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {tab === "orders" && !loading && (
            <div className="space-y-4">
              {data.orders.map((order) => (
                <div key={order._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                        <Truck size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="font-black text-blue-600">{order.orderId}</p>
                        <p className="text-xs text-slate-400">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-xl text-slate-800">{formatPrice(order.total)}</p>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold border ${statusColor(order.deliveryStatus || order.status)}`}>
                        {ORDER_STAGES.find(s => s.key === (order.deliveryStatus || order.status))?.label || order.status}
                      </span>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="px-6 py-3 flex flex-wrap gap-4 text-sm border-b border-slate-50">
                    <div><span className="text-slate-400">Cliente: </span><span className="font-semibold text-slate-700">{order.customer?.fullName}</span></div>
                    <div><span className="text-slate-400">Tel: </span><span className="font-semibold text-slate-700">{order.customer?.phone}</span></div>
                    <div><span className="text-slate-400">Local: </span><span className="font-semibold text-slate-700">{order.customer?.province}, {order.customer?.municipality}</span></div>
                    <div><span className="text-slate-400">Pagamento: </span><span className="font-semibold text-slate-700">{order.payment?.method}</span></div>
                  </div>

                  {/* Stage Buttons */}
                  <div className="px-6 py-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Actualizar Fase de Entrega</p>
                    <div className="flex flex-wrap gap-2">
                      {ORDER_STAGES.map((s) => {
                        const isCurrent = (order.deliveryStatus || order.status) === s.key;
                        return (
                          <button
                            key={s.key}
                            onClick={() => updateOrderStatus(order._id, s.key)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isCurrent
                              ? "bg-blue-600 text-white shadow-md shadow-blue-200 scale-105"
                              : "bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                              }`}
                          >
                            {s.emoji} {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── PRODUCTS ── */}
          {tab === "products" && !loading && (
            <div className="space-y-6">
              {/* Add Product Form */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Plus size={18} className="text-white" />
                  </div>
                  <h2 className="font-black text-slate-800">Adicionar Novo Produto</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  {/* Image Upload */}
                  <div className="md:col-span-1">
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">
                      Foto do Produto
                    </label>
                    <ImageUploader
                      value={newProduct.image}
                      onChange={(url) => setNewProduct({ ...newProduct, image: url })}
                    />
                  </div>

                  {/* Fields */}
                  <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    {[
                      { key: "name", label: "Nome *", placeholder: "Nome do produto", span: true },
                      { key: "price", label: "Preço (Kz) *", placeholder: "Ex: 150000" },
                      { key: "brand", label: "Marca", placeholder: "Ex: Samsung" },
                      { key: "stock", label: "Stock", placeholder: "Ex: 10" },
                    ].map((f) => (
                      <div key={f.key} className={f.span ? "col-span-2" : ""}>
                        <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">{f.label}</label>
                        <input
                          type="text" placeholder={f.placeholder}
                          value={newProduct[f.key]}
                          onChange={(e) => setNewProduct({ ...newProduct, [f.key]: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Categoria *</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 bg-white"
                      >
                        <option value="">Selecionar...</option>
                        {["computadores", "phones", "acessorios", "componentes", "cameras", "impressoras", "redes", "energia"].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Estado</label>
                      <select
                        value={newProduct.condition}
                        onChange={(e) => setNewProduct({ ...newProduct, condition: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 bg-white"
                      >
                        <option value="novo">Novo</option>
                        <option value="recondicionado">Recondicionado</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Descrição</label>
                      <textarea
                        placeholder="Descrição do produto..."
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        rows={2}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 resize-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={createProduct}
                  className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 hover:-translate-y-0.5 text-sm flex items-center gap-2"
                >
                  <Plus size={16} /> Adicionar Produto
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {data.products?.map((p) => (
                  <div key={p._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 overflow-hidden group">
                    <div className="bg-slate-50 h-36 flex items-center justify-center p-3 relative">
                      <img src={p.image || "/placeholder.png"} alt={p.name} className="h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                      <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-bold ${p.condition === "novo" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                        {p.condition}
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-sm text-slate-800 mb-0.5 line-clamp-1">{p.name}</p>
                      <p className="text-xs text-slate-400 mb-1">{p.brand}</p>
                      <p className="text-blue-600 font-black text-sm mb-1">{formatPrice(p.price)}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-3 ${p.stock > 5 ? "bg-green-50 text-green-600" : p.stock > 0 ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600"}`}>
                        {p.stock > 0 ? `Stock: ${p.stock}` : "Esgotado"}
                      </span>
                      <button
                        onClick={() => deleteProduct(p._id)}
                        className="w-full py-1.5 bg-red-50 text-red-500 font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all text-xs flex items-center justify-center gap-1"
                      >
                        <Trash2 size={12} /> Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TICKETS ── */}
          {tab === "tickets" && !loading && (
            <div className="space-y-4">
              {data.tickets.length === 0 && (
                <div className="text-center py-20 text-slate-400">
                  <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">Sem tickets por enquanto</p>
                </div>
              )}
              {data.tickets.map((ticket) => (
                <div key={ticket._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-50 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${TICKET_STAGES.find(s => s.key === ticket.status)?.color || "bg-gray-400"}`} />
                      <div>
                        <span className="font-black text-blue-600 text-sm">{ticket.ticketId}</span>
                        <span className="text-slate-300 mx-2">·</span>
                        <span className="font-bold text-slate-700 text-sm">{ticket.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-3 py-1 rounded-full font-bold border ${ticketColor(ticket.status)}`}>
                        {TICKET_STAGES.find(s => s.key === ticket.status)?.label || ticket.status}
                      </span>
                      <span className="text-xs text-slate-400">{formatDate(ticket.createdAt)}</span>
                    </div>
                  </div>

                  <div className="px-6 py-3 border-b border-slate-50 flex flex-wrap gap-4 text-xs">
                    <span><span className="text-slate-400">Email: </span><span className="font-semibold text-slate-600">{ticket.email}</span></span>
                    <span><span className="text-slate-400">Categoria: </span><span className="font-semibold text-slate-600">{ticket.category}</span></span>
                    {ticket.orderId && <span><span className="text-slate-400">Encomenda: </span><span className="font-semibold text-blue-600">{ticket.orderId}</span></span>}
                  </div>

                  <div className="px-6 py-4">
                    <div className="bg-slate-50 rounded-xl p-4 mb-4 text-sm text-slate-600 leading-relaxed border-l-4 border-blue-200">
                      {ticket.message}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs font-bold text-slate-400 self-center mr-1">Mover para:</span>
                      {TICKET_STAGES.map((s) => (
                        <button
                          key={s.key}
                          onClick={() => updateTicketStatus(ticket._id, s.key)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${ticket.status === s.key
                            ? `${s.color} text-white shadow-md scale-105`
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>

                    {/* Timeline */}
                    {ticket.timeline?.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-50">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Histórico</p>
                        <div className="space-y-1.5">
                          {ticket.timeline.map((ev, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                              <span className="text-slate-500">{ev.action}</span>
                              <span className="text-slate-300 ml-auto flex-shrink-0">{new Date(ev.date).toLocaleString("pt-AO")}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {tab === "analytics" && !loading && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { label: "Visitas Totais", value: data.analytics.totalVisits || 0, icon: Eye, color: "from-violet-500 to-purple-600" },
                  { label: "Add to Cart", value: data.analytics.addToCart || 0, icon: ShoppingBag, color: "from-blue-500 to-blue-700" },
                  { label: "Checkouts", value: data.analytics.checkouts || 0, icon: CheckCircle2, color: "from-emerald-500 to-green-600" },
                  { label: "Taxa de Conversão", value: `${data.analytics.conversionRate || 0}%`, icon: TrendingUp, color: "from-orange-400 to-orange-600" },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-lg`}>
                        <Icon size={20} className="text-white" />
                      </div>
                      <p className="text-3xl font-black text-slate-800">{s.value}</p>
                      <p className="text-sm text-slate-400 mt-1 font-medium">{s.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Heatmap com fundo real */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-black text-slate-800 flex items-center gap-2">
                    <Activity size={18} className="text-blue-600" /> Mapa de Calor
                  </h2>
                  <select
                    value={heatmapPage}
                    onChange={(e) => loadHeatmap(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white"
                  >
                    {["home", "products", "checkout", "support", "tracking"].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-4 text-xs mb-3">
                  <span className="text-slate-500 font-medium">
                    Total de cliques registados: <strong>{heatmapData.reduce((a, c) => a + c.count, 0)}</strong>
                  </span>
                  <div className="flex items-center gap-3 ml-auto">
                    {[["#BFDBFE", "Baixo"], ["#F59E0B", "Médio"], ["#EF4444", "Alto"]].map(([color, label]) => (
                      <span key={label} className="flex items-center gap-1 font-medium text-slate-600">
                        <span className="w-3 h-3 rounded-full inline-block" style={{ background: color }} />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Container com imagem de fundo da página */}
                <div
                  className="relative w-full rounded-xl overflow-hidden border border-slate-100"
                  style={{ paddingBottom: "56.25%" }}
                >
                  {/* Screenshot da página como fundo */}
                  <iframe
                    src={`http://localhost:5173/${heatmapPage === "home" ? "" : heatmapPage}`}
                    className="absolute inset-0 w-full h-full"
                    style={{ pointerEvents: "none", opacity: 0.35, border: "none" }}
                    title="page preview"
                  />

                  {/* Overlay dos cliques */}
                  <div className="absolute inset-0">
                    {heatmapLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : heatmapData.map((point, i) => {
                      const maxCount = Math.max(...heatmapData.map(p => p.count), 1);
                      const intensity = point.count / maxCount;
                      const color = intensity > 0.7 ? "rgba(239,68,68,0.85)" : intensity > 0.35 ? "rgba(245,158,11,0.75)" : "rgba(191,219,254,0.65)";
                      const size = Math.max(24, Math.min(60, 24 + intensity * 36));
                      return (
                        <div
                          key={i}
                          title={`${point.count} clique(s)`}
                          style={{
                            position: "absolute",
                            left: `${point.x}%`,
                            top: `${point.y}%`,
                            width: size,
                            height: size,
                            background: color,
                            borderRadius: "50%",
                            transform: "translate(-50%, -50%)",
                            filter: "blur(10px)",
                            pointerEvents: "none",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Eventos por página */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <BarChart3 size={18} className="text-blue-600" /> Eventos por Página
                </h2>
                <div className="space-y-3">
                  {data.analytics.pageEvents?.map((e, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-slate-600 w-28 flex-shrink-0 capitalize">{e.page || "—"}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-700"
                          style={{ width: `${Math.min((e.count / Math.max(data.analytics.totalVisits, 1)) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-black text-slate-700 w-8 text-right">{e.count}</span>
                    </div>
                  ))}
                  {!data.analytics.pageEvents?.length && (
                    <p className="text-slate-400 text-sm text-center py-6">Sem dados suficientes ainda</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── HEATMAP ── */}
          {tab === "heatmap" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-black text-slate-800 flex items-center gap-2">
                    <Activity size={18} className="text-blue-600" /> Mapa de Calor
                  </h2>
                  <select
                    value={heatmapPage}
                    onChange={(e) => loadHeatmap(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white"
                  >
                    {["home", "products", "checkout", "support", "tracking"].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-500">
                    Total de cliques registados:{" "}
                    <strong className="text-slate-800">
                      {Array.isArray(heatmapData) ? heatmapData.reduce((a, c) => a + c.count, 0) : 0}
                    </strong>
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    {[["#BFDBFE", "Baixo"], ["#F59E0B", "Médio"], ["#EF4444", "Alto"]].map(([color, label]) => (
                      <span key={label} className="flex items-center gap-1 font-medium text-slate-600">
                        <span className="w-3 h-3 rounded-full inline-block" style={{ background: color }} />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Container com iframe da página como fundo */}
                <div className="relative w-full rounded-xl overflow-hidden border border-slate-100 bg-slate-50"
                  style={{ height: "560px" }}>

                  {/* Fundo: página real em iframe */}
                  <iframe
                    src={`http://localhost:5173/${heatmapPage === "home" ? "" : heatmapPage}`}
                    className="absolute inset-0 w-full h-full"
                    style={{ pointerEvents: "none", opacity: 0.4, border: "none" }}
                    title="page preview"
                  />

                  {/* Pontos de calor sobrepostos */}
                  <div className="absolute inset-0">
                    {heatmapLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : !Array.isArray(heatmapData) || heatmapData.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <Activity size={40} className="mb-3 opacity-30" />
                        <p className="font-semibold text-sm">Sem dados de cliques para esta página</p>
                        <p className="text-xs mt-1">Navega no site para gerar dados</p>
                      </div>
                    ) : (
                      <>
                        {heatmapData.map((point, i) => {
                          const maxCount = Math.max(...heatmapData.map(p => p.count), 1);
                          const intensity = point.count / maxCount;
                          const color = intensity > 0.7
                            ? `rgba(239,68,68,${0.5 + intensity * 0.4})`
                            : intensity > 0.35
                              ? `rgba(245,158,11,${0.5 + intensity * 0.3})`
                              : `rgba(96,165,250,${0.4 + intensity * 0.3})`;
                          const size = Math.max(30, Math.min(80, 30 + intensity * 50));
                          return (
                            <div
                              key={i}
                              style={{
                                position: "absolute",
                                left: `${point.x}%`,
                                top: `${point.y}%`,
                                width: size,
                                height: size,
                                background: color,
                                borderRadius: "50%",
                                transform: "translate(-50%, -50%)",
                                filter: "blur(12px)",
                                pointerEvents: "none",
                              }}
                            />
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TESTES A/B ── */}
          {tab === "abtests" && !loading && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-800">Testes A/B</h1>
              </div>

              {abTests.map((test) => {
                const totalViews = test.variants.reduce((a, v) => a + v.views, 0);
                const winner = test.variants.reduce((a, b) => {
                  const rateA = a.views > 0 ? a.conversions / a.views : 0;
                  const rateB = b.views > 0 ? b.conversions / b.views : 0;
                  return rateA >= rateB ? a : b;
                }, test.variants[0]);

                return (
                  <div key={test._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-50 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-black text-slate-800">{test.name}</p>
                        <p className="text-sm text-slate-500 mt-0.5">💡 {test.hypothesis}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${test.status === "running" ? "bg-green-100 text-green-700" :
                        test.status === "completed" ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-600"
                        }`}>{test.status === "running" ? "A decorrer" : test.status === "completed" ? "Concluído" : "Pausado"}</span>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        {test.variants.map((v) => {
                          const ctr = v.views > 0 ? ((v.clicks / v.views) * 100).toFixed(1) : "0.0";
                          const rate = v.views > 0 ? ((v.conversions / v.views) * 100).toFixed(1) : "0.0";
                          const isWinner = winner?.id === v.id && totalViews > 0;

                          return (
                            <div key={v.id} className={`rounded-xl border-2 p-4 ${isWinner ? "border-green-400 bg-green-50" : "border-slate-100"}`}>
                              <div className="flex items-center justify-between mb-3">
                                <span className="font-black text-lg text-slate-700">Variante {v.id}</span>
                                {isWinner && <span className="text-xs bg-green-500 text-white font-bold px-2 py-0.5 rounded-full">🏆 Vencedor</span>}
                              </div>
                              <p className="text-sm text-slate-600 mb-3 font-medium">{v.description || v.name}</p>
                              <div className="grid grid-cols-3 gap-2 text-center">
                                {[
                                  { label: "Vistas", value: v.views },
                                  { label: "CTR", value: `${ctr}%` },
                                  { label: "Conversões", value: `${rate}%` },
                                ].map((s, i) => (
                                  <div key={i} className="bg-white rounded-lg p-2 border border-slate-100">
                                    <p className="text-base font-black text-slate-800">{s.value}</p>
                                    <p className="text-xs text-slate-400">{s.label}</p>
                                  </div>
                                ))}
                              </div>
                              {v.views > 0 && (
                                <div className="mt-3">
                                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                                    <span>Taxa de conversão</span><span>{rate}%</span>
                                  </div>
                                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-2 rounded-full ${isWinner ? "bg-green-500" : "bg-blue-500"}`}
                                      style={{ width: `${Math.min(parseFloat(rate) * 5, 100)}%` }} />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500 flex flex-wrap gap-4">
                        <span>Total vistas: <strong className="text-slate-700">{totalViews}</strong></span>
                        <span>Início: <strong className="text-slate-700">{new Date(test.startDate).toLocaleDateString("pt-AO")}</strong></span>
                        {test.endDate && <span>Fim: <strong className="text-slate-700">{new Date(test.endDate).toLocaleDateString("pt-AO")}</strong></span>}
                      </div>
                    </div>
                  </div>
                );
              })}

              {abTests.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                  <TrendingUp size={36} className="mx-auto mb-3 text-slate-300" />
                  <p className="font-bold text-slate-500">Nenhum teste A/B criado ainda</p>
                  <p className="text-sm text-slate-400 mt-1">Os testes são criados automaticamente pelo sistema</p>
                </div>
              )}
            </div>
          )}

          {/* ── SATISFACTION ── */}
          {tab === "satisfaction" && !loading && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Média de Avaliação", value: data.analytics.avgRating || "—", suffix: "/ 5", color: "text-yellow-500" },
                  { label: "Total de Avaliações", value: data.ratings?.length || 0, suffix: "", color: "text-blue-600" },
                  { label: "NPS Score", value: data.analytics.nps || "—", suffix: "", color: "text-emerald-600" },
                ].map((s, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
                    <p className={`text-5xl font-black ${s.color} mb-1`}>{s.value}</p>
                    {s.suffix && <p className="text-slate-400 text-sm">{s.suffix}</p>}
                    <p className="text-slate-500 text-sm font-medium mt-2">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-black text-slate-800 mb-5 flex items-center gap-2">
                  <Star size={18} className="text-yellow-500 fill-yellow-500" /> Avaliações dos Clientes
                </h2>
                <div className="space-y-3">
                  {data.ratings.length === 0 && (
                    <p className="text-center text-slate-400 py-8">Ainda não há avaliações</p>
                  )}
                  {data.ratings.map((r, i) => (
                    <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={16} className={s <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"} />
                          ))}
                          <span className="text-xs font-bold text-slate-500 ml-1">{r.rating}/5</span>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">{formatDate(r.ratedAt || r.createdAt)}</span>
                      </div>
                      {r.ratingComment && (
                        <p className="text-sm text-slate-600 italic">"{r.ratingComment}"</p>
                      )}
                      {r.orderId && <p className="text-xs text-blue-500 font-semibold mt-1">{r.orderId}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}