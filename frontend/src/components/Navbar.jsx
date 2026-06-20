import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart, User, Search, SlidersHorizontal, X,
  Truck, MessageSquare, Menu, LogIn, UserPlus,
  Package, LogOut, ChevronDown, Settings
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { cartCount, filters, setFilters, user, logout } = useApp();
  const [showFilters, setShowFilters] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchText, setSearchText] = useState(filters.search || "");
  const [tempFilters, setTempFilters] = useState({ ...filters });
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, search: searchText }));
    navigate("/produtos");
    setShowMenu(false);
  };

  const applyFilters = () => {
    setFilters({ ...tempFilters, search: searchText });
    setShowFilters(false);
    navigate("/produtos");
  };

  const clearFilters = () => {
    const reset = { category: "", search: "", minPrice: 0, maxPrice: 9999999, brand: "", condition: "" };
    setTempFilters(reset);
    setFilters(reset);
    setSearchText("");
  };

  const navLinks = [
    { to: "/produtos", label: "Produtos" },
    { to: "/rastreamento", label: "Rastrear", icon: Truck },
    { to: "/suporte", label: "Suporte", icon: MessageSquare },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <span className="text-2xl font-black text-blue-700 tracking-tight">OSOTEC</span>
        </Link>

        {/* Nav Links — desktop */}
        <div className="hidden md:flex items-center gap-1 flex-shrink-0">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${location.pathname === link.to
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {link.icon && <link.icon size={15} />}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 flex items-center relative">
          <div className="flex items-center w-full border border-gray-200 rounded-xl overflow-hidden bg-gray-50 hover:border-blue-400 transition-colors">
            <Search className="ml-3 text-gray-400 flex-shrink-0" size={18} />
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-transparent text-sm outline-none min-w-0"
            />
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 px-3 py-2.5 border-l border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium flex-shrink-0"
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">Filtros</span>
            </button>
          </div>

          {/* Filter Dropdown */}
          {showFilters && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Filtros Avançados</h3>
                <button onClick={() => setShowFilters(false)}><X size={18} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">Faixa de Preço (Kz)</label>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Mín"
                      value={tempFilters.minPrice || ""}
                      onChange={(e) => setTempFilters({ ...tempFilters, minPrice: Number(e.target.value) })}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                    />
                    <input type="number" placeholder="Máx"
                      value={tempFilters.maxPrice === 9999999 ? "" : tempFilters.maxPrice}
                      onChange={(e) => setTempFilters({ ...tempFilters, maxPrice: Number(e.target.value) || 9999999 })}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">Marca</label>
                  <input type="text" placeholder="Ex: Samsung, Dell..."
                    value={tempFilters.brand}
                    onChange={(e) => setTempFilters({ ...tempFilters, brand: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">Estado</label>
                  <select
                    value={tempFilters.condition}
                    onChange={(e) => setTempFilters({ ...tempFilters, condition: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white"
                  >
                    <option value="">Todos</option>
                    <option value="novo">Novo</option>
                    <option value="recondicionado">Recondicionado</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={clearFilters}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  Limpar
                </button>
                <button onClick={applyFilters}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
                  Aplicar Filtros
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Icons */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* ── USER DROPDOWN ── */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-1.5 p-2 rounded-xl hover:bg-gray-100 transition-colors relative"
            >
              <div className="relative">
                <User size={22} className={user ? "text-blue-600" : "text-gray-600"} />
                {user && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              {user && (
                <span className="hidden sm:block text-sm font-semibold text-slate-700 max-w-20 truncate">
                  {user.name.split(" ")[0]}
                </span>
              )}
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${showUserDropdown ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Panel */}
            {showUserDropdown && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                {/* Seta decorativa */}
                <div className="absolute -top-2 right-5 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45" />

                {!user ? (
                  <>
                    {/* Cabeçalho */}
                    <div className="px-5 pt-5 pb-4 border-b border-gray-50">
                      <p className="font-black text-slate-800 text-base">Escolha uma opção</p>
                      <p className="text-xs text-slate-400 mt-0.5">Acede à tua conta OSOTEC</p>
                    </div>

                    {/* Opções */}
                    <div className="p-3 space-y-1">
                      <button
                        onClick={() => { setShowUserDropdown(false); navigate("/conta?tab=login"); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition-colors text-left group"
                      >
                        <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                          <LogIn size={17} className="text-blue-600 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">Entrar com email e senha</p>
                          <p className="text-xs text-slate-400">Já tens conta? Entra aqui</p>
                        </div>
                      </button>

                      <button
                        onClick={() => { setShowUserDropdown(false); navigate("/conta?tab=register"); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                      >
                        <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                          <UserPlus size={17} className="text-slate-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">Criar conta gratuita</p>
                          <p className="text-xs text-slate-400">Guarda as tuas encomendas</p>
                        </div>
                      </button>
                    </div>

                    {/* Footer do dropdown */}
                    <div className="px-5 py-3 bg-slate-50 border-t border-gray-100">
                      <p className="text-xs text-slate-400 text-center">
                        Admin?{" "}
                        <a href="/admin" target="_blank" rel="noreferrer"
                          className="text-blue-600 font-bold hover:underline">
                          Painel de Administração
                        </a>
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Utilizador logado */}
                    <div className="px-5 pt-5 pb-4 bg-gradient-to-r from-blue-600 to-blue-700">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                          <User size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="font-black text-white text-sm">{user.name}</p>
                          <p className="text-blue-100 text-xs truncate max-w-40">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 space-y-1">
                      <button
                        onClick={() => { setShowUserDropdown(false); navigate("/conta"); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition-colors text-left"
                      >
                        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                          <Package size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">As Minhas Encomendas</p>
                          <p className="text-xs text-slate-400">Ver histórico completo</p>
                        </div>
                      </button>

                      <button
                        onClick={() => { setShowUserDropdown(false); navigate("/conta?tab=profile"); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                      >
                        <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
                          <Settings size={16} className="text-slate-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">Gerir Perfil</p>
                          <p className="text-xs text-slate-400">Editar dados pessoais</p>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setShowUserDropdown(false);
                          navigate("/");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-left group"
                      >
                        <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
                          <LogOut size={16} className="text-red-500" />
                        </div>
                        <p className="font-bold text-red-500 text-sm">Terminar Sessão</p>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/checkout" className="p-2 rounded-xl hover:bg-blue-50 transition-colors relative">
            <ShoppingCart size={22} className="text-blue-600" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Menu size={22} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setShowMenu(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${location.pathname === link.to ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {link.icon && <link.icon size={16} />}
              {link.label}
            </Link>
          ))}
          {!user ? (
            <Link to="/conta" onClick={() => setShowMenu(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
              <LogIn size={16} /> Entrar / Criar Conta
            </Link>
          ) : (
            <button onClick={() => { logout(); setShowMenu(false); navigate("/"); }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors w-full text-left">
              <LogOut size={16} /> Terminar Sessão
            </button>
          )}
        </div>
      )}
    </nav>
  );
}