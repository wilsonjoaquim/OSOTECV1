import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  User, Package, LogOut, Edit3, CheckCircle, Eye, EyeOff,
  ShoppingBag, MapPin, Phone, Mail, ChevronRight, Clock
} from "lucide-react";
import { useApp } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATUS_LABEL = {
  confirmed:        { label: "Confirmado",    color: "bg-amber-100 text-amber-700",   dot: "bg-amber-500" },
  processing:       { label: "Em Preparação", color: "bg-blue-100 text-blue-700",     dot: "bg-blue-500" },
  shipped:          { label: "Em Trânsito",   color: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
  out_for_delivery: { label: "Para Entrega",  color: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-500" },
  delivered:        { label: "Entregue",      color: "bg-green-100 text-green-700",   dot: "bg-green-500" },
  cancelled:        { label: "Cancelado",     color: "bg-red-100 text-red-700",       dot: "bg-red-500" },
};

const DELIVERY_STAGES = [
  { key: "confirmed",        label: "Confirmado" },
  { key: "processing",       label: "Em Preparação" },
  { key: "shipped",          label: "Em Trânsito" },
  { key: "out_for_delivery", label: "Para Entrega" },
  { key: "delivered",        label: "Entregue" },
];

export default function Account() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, login, register, logout, getAuthHeader } = useApp();

  const [authTab, setAuthTab] = useState(searchParams.get("tab") === "register" ? "register" : "login");
  const [profileTab, setProfileTab] = useState(searchParams.get("tab") === "profile" ? "profile" : "orders");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const [loginForm, setLoginForm]       = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [profileForm, setProfileForm]   = useState({ name: "", phone: "", province: "", municipality: "", zone: "" });

  const formatPrice = (p) => new Intl.NumberFormat("pt-AO").format(p) + " Kz";
  const formatDate  = (d) => new Date(d).toLocaleDateString("pt-AO", { day: "2-digit", month: "short", year: "numeric" });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "", phone: user.phone || "",
        province: user.province || "", municipality: user.municipality || "", zone: user.zone || "",
      });
      loadOrders();
    }
  }, [user]);

  // Sincronizar tab de perfil com URL
  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "profile") setProfileTab("profile");
    if (t === "orders")  setProfileTab("orders");
  }, [searchParams]);

  const loadOrders = async () => {
    try {
      const { data } = await axios.get(`${API}/api/auth/me`, { headers: getAuthHeader() });
      setOrders(data.orders || []);
    } catch {}
  };

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) { toast.error("Preenche email e senha"); return; }
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      toast.success("Bem-vindo de volta! 👋");
      navigate("/"); // ← redireciona para página inicial
    } catch {
      toast.error("Email ou senha incorrectos");
    } finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      toast.error("Preenche todos os campos obrigatórios"); return;
    }
    if (registerForm.password.length < 6) { toast.error("Senha com mínimo 6 caracteres"); return; }
    setLoading(true);
    try {
      await register(registerForm.name, registerForm.email, registerForm.phone, registerForm.password);
      toast.success("Conta criada! Bem-vindo à OSOTEC 🎉");
      navigate("/"); // ← redireciona para página inicial
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao criar conta");
    } finally { setLoading(false); }
  };

  const handleUpdateProfile = async () => {
    try {
      await axios.put(`${API}/api/auth/me`, profileForm, { headers: getAuthHeader() });
      toast.success("Perfil actualizado!");
      setEditMode(false);
    } catch { toast.error("Erro ao actualizar perfil"); }
  };

  const getStageIndex = (status) => DELIVERY_STAGES.findIndex(s => s.key === status);

  // ── ECRÃ DE AUTENTICAÇÃO ──────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-slate-50 flex items-start justify-center">
        <div className="w-full max-w-md px-4 mt-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <User size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-800">A Minha Conta</h1>
            <p className="text-slate-500 text-sm mt-1">Acede ao teu histórico e gere as tuas encomendas</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-white rounded-2xl border border-slate-100 p-1 mb-5 shadow-sm">
            {[{ id: "login", label: "Iniciar Sessão" }, { id: "register", label: "Criar Conta" }].map((t) => (
              <button key={t.id} onClick={() => setAuthTab(t.id)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${authTab === t.id ? "bg-blue-600 text-white shadow" : "text-slate-500 hover:text-slate-700"}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7">
            {authTab === "login" ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Email</label>
                  <input type="email" placeholder="email@exemplo.com"
                    value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Senha</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} placeholder="••••••••"
                      value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 pr-11" />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button onClick={handleLogin} disabled={loading}
                  className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
                  {loading
                    ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : "Entrar na Minha Conta"}
                </button>
                <p className="text-center text-sm text-slate-400">
                  Ainda não tens conta?{" "}
                  <button onClick={() => setAuthTab("register")} className="text-blue-600 font-bold hover:underline">
                    Criar agora — é grátis
                  </button>
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { key: "name",     label: "Nome Completo *",  placeholder: "O teu nome completo", type: "text" },
                  { key: "email",    label: "Email *",           placeholder: "email@exemplo.com",   type: "email" },
                  { key: "phone",    label: "Telefone",          placeholder: "+244 9XX XXX XXX",    type: "text" },
                  { key: "password", label: "Senha *",           placeholder: "Mínimo 6 caracteres", type: "password" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder}
                      value={registerForm[f.key]} onChange={(e) => setRegisterForm({ ...registerForm, [f.key]: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50" />
                  </div>
                ))}
                <button onClick={handleRegister} disabled={loading}
                  className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
                  {loading
                    ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : "Criar Conta Grátis"}
                </button>
                <p className="text-center text-sm text-slate-400">
                  Já tens conta?{" "}
                  <button onClick={() => setAuthTab("login")} className="text-blue-600 font-bold hover:underline">
                    Entrar aqui
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── DASHBOARD DO UTILIZADOR ───────────────────────────────
  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header do perfil */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-3xl p-6 sm:p-8 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <User size={26} className="text-white" />
            </div>
            <div>
              <p className="font-black text-white text-xl">{user.name}</p>
              <p className="text-blue-100 text-sm">{user.email}</p>
              {user.phone && <p className="text-blue-200 text-xs mt-0.5">{user.phone}</p>}
            </div>
          </div>
          <button onClick={() => { logout(); navigate("/"); }}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm">
            <LogOut size={16} /> Sair
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-2xl border border-slate-100 p-1 mb-6 shadow-sm">
          {[
            { id: "orders",  label: "As Minhas Encomendas", icon: Package },
            { id: "profile", label: "Perfil",               icon: Edit3 },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setProfileTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${profileTab === t.id ? "bg-blue-600 text-white shadow" : "text-slate-500 hover:text-slate-700"}`}>
                <Icon size={15} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* ── ENCOMENDAS ── */}
        {profileTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <ShoppingBag size={40} className="mx-auto mb-3 text-slate-300" />
                <p className="font-bold text-slate-600">Ainda não fizeste nenhuma encomenda</p>
                <p className="text-sm text-slate-400 mt-1 mb-5">Os teus pedidos aparecerão aqui</p>
                <button onClick={() => navigate("/produtos")}
                  className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm">
                  Explorar Produtos
                </button>
              </div>
            ) : orders.map((order) => {
              const st = STATUS_LABEL[order.deliveryStatus || order.status] || STATUS_LABEL.confirmed;
              const stageIdx = getStageIndex(order.deliveryStatus || order.status);
              const isExpanded = expandedOrder === order._id;

              return (
                <div key={order._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  {/* Cabeçalho da encomenda */}
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                    className="w-full px-5 py-4 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${st.dot}`} />
                      <div>
                        <p className="font-black text-blue-600 text-sm">{order.orderId}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock size={11} /> {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${st.color}`}>{st.label}</span>
                      <p className="font-black text-slate-800 text-sm">{formatPrice(order.total)}</p>
                      <ChevronRight size={16} className={`text-slate-400 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </div>
                  </button>

                  {/* Detalhe expandido */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 px-5 py-5 space-y-5">

                      {/* Barra de progresso das fases */}
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Fase da Entrega</p>
                        <div className="relative">
                          <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-slate-100" />
                          <div
                            className="absolute top-3.5 left-0 h-0.5 bg-blue-500 transition-all duration-700"
                            style={{ width: stageIdx >= 0 ? `${(stageIdx / (DELIVERY_STAGES.length - 1)) * 100}%` : "0%" }}
                          />
                          <div className="relative flex justify-between">
                            {DELIVERY_STAGES.map((stage, i) => {
                              const done    = i <= stageIdx;
                              const current = i === stageIdx;
                              return (
                                <div key={stage.key} className="flex flex-col items-center gap-1.5">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 transition-all ${
                                    current ? "bg-blue-600 ring-4 ring-blue-100 shadow-lg" :
                                    done    ? "bg-blue-500" : "bg-slate-200"
                                  }`}>
                                    {done
                                      ? <CheckCircle size={14} className="text-white" />
                                      : <div className="w-2 h-2 rounded-full bg-slate-400" />}
                                  </div>
                                  <span className={`text-xs font-semibold text-center max-w-14 leading-tight ${
                                    current ? "text-blue-600" : done ? "text-slate-700" : "text-slate-400"
                                  }`}>{stage.label}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Itens da encomenda */}
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Produtos</p>
                        <div className="space-y-2">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                              <div>
                                <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                                <p className="text-xs text-slate-400">Qtd: {item.qty}</p>
                              </div>
                              <p className="font-bold text-slate-700 text-sm">{formatPrice(item.price * item.qty)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Info de entrega */}
                      <div className="bg-slate-50 rounded-xl p-4 flex flex-wrap gap-4 text-xs text-slate-600">
                        <span><span className="font-bold text-slate-400">Local: </span>{order.customer?.province}, {order.customer?.municipality}</span>
                        <span><span className="font-bold text-slate-400">Pagamento: </span>{order.payment?.method}</span>
                        <span className="font-black text-blue-600">Total: {formatPrice(order.total)}</span>
                      </div>

                      {/* Botão rastrear */}
                      <button
                        onClick={() => navigate(`/rastreamento?id=${order.orderId}`)}
                        className="w-full py-2.5 border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all text-sm flex items-center justify-center gap-2"
                      >
                        <Package size={16} /> Ver Rastreamento Completo
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── PERFIL ── */}
        {profileTab === "profile" && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-slate-800">Dados Pessoais</h2>
              <button onClick={() => setEditMode(!editMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                  editMode ? "bg-slate-100 text-slate-600" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                }`}>
                <Edit3 size={14} /> {editMode ? "Cancelar" : "Editar"}
              </button>
            </div>

            {editMode ? (
              <div className="space-y-4">
                {[
                  { key: "name",         label: "Nome Completo" },
                  { key: "phone",        label: "Telefone" },
                  { key: "province",     label: "Província" },
                  { key: "municipality", label: "Município" },
                  { key: "zone",         label: "Zona / Referência" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">{f.label}</label>
                    <input type="text" value={profileForm[f.key]}
                      onChange={(e) => setProfileForm({ ...profileForm, [f.key]: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500" />
                  </div>
                ))}
                <button onClick={handleUpdateProfile}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <CheckCircle size={16} /> Guardar Alterações
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { label: "Nome",       value: user.name,                         icon: User },
                  { label: "Email",      value: user.email,                        icon: Mail },
                  { label: "Telefone",   value: user.phone        || "Não definido", icon: Phone },
                  { label: "Província",  value: profileForm.province || "Não definida", icon: MapPin },
                  { label: "Município",  value: profileForm.municipality || "Não definido", icon: MapPin },
                ].map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
                      <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium">{f.label}</p>
                        <p className="font-semibold text-slate-800 text-sm">{f.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}