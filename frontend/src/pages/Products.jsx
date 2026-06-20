import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Search } from "lucide-react";
import { useApp } from "../context/AppContext";
import { usePixel } from "../hooks/usePixel";
import { useHeatmap } from "../hooks/useHeatmap";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CATEGORIES = [
  { id: "", label: "Todos" },
  { id: "computadores", label: "Computadores" },
  { id: "phones", label: "Smartphones" },
  { id: "acessorios", label: "Acessórios" },
  { id: "componentes", label: "Componentes" },
  { id: "cameras", label: "Câmeras" },
  { id: "impressoras", label: "Impressoras" },
  { id: "redes", label: "Redes" },
  { id: "energia", label: "Energia" },
];

export default function Products() {
  const { cart, addToCart, updateQty, cartCount, cartTotal, filters, setFilters } = useApp();
  const { track } = usePixel();
  const navigate = useNavigate();
  useHeatmap("products");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localQty, setLocalQty] = useState({});

  useEffect(() => {
    track("page_view", { page: "products" });
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        category: filters.category,
        search: filters.search,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        brand: filters.brand,
        condition: filters.condition,
      };
      const { data } = await axios.get(`${API}/api/products`, { params });
      setProducts(data.products || []);
    } catch {
      toast.error("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  const getCartQty = (id) => {
    const item = cart.find((i) => i._id === id);
    return item ? item.qty : localQty[id] || 0;
  };

  const handleAdd = (product) => {
    const qty = localQty[product._id] || 1;
    addToCart(product, qty);
    track("add_to_cart", { productId: product._id, name: product.name, price: product.price });
    toast.success(`${product.name} adicionado!`);
  };

  const formatPrice = (p) => new Intl.NumberFormat("pt-AO").format(p) + " Kz";

  return (
    <div className="min-h-screen pt-20 pb-32">
      {/* Category Tabs */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilters((f) => ({ ...f, category: cat.id }))}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                filters.category === cat.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-72" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Search size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-semibold">Nenhum produto encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => {
              const cartQty = getCartQty(product._id);
              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all overflow-hidden group"
                >
                  <div className="relative overflow-hidden bg-gray-50 h-44">
                    <img
                      src={product.image || "/placeholder.png"}
                      alt={product.name}
                      className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.condition === "recondicionado" && (
                      <span className="absolute top-2 left-2 bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">
                        Recond.
                      </span>
                    )}
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="absolute top-2 right-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                        Últimas {product.stock}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-400 font-medium mb-1">{product.brand}</p>
                    <h3 className="font-bold text-gray-800 text-sm leading-tight mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-blue-600 font-black text-base mb-3">
                      {formatPrice(product.price)}
                    </p>

                    {cartQty > 0 ? (
                      <div className="flex items-center justify-between bg-blue-50 rounded-xl p-1">
                        <button
                          onClick={() => updateQty(product._id, cartQty - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-red-50 transition-colors"
                        >
                          <Minus size={14} className="text-gray-600" />
                        </button>
                        <span className="font-bold text-blue-700">{cartQty}</span>
                        <button
                          onClick={() => updateQty(product._id, cartQty + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                        >
                          <Plus size={14} className="text-white" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAdd(product)}
                        className="w-full py-2 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={15} />
                        Adicionar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-2xl px-4 py-3 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">{cartCount} iten{cartCount !== 1 ? "s" : ""} no carrinho</p>
              <p className="font-black text-gray-800 text-lg">{formatPrice(cartTotal)}</p>
            </div>
            <button
              onClick={() => {
                track("checkout_start");
                navigate("/checkout");
              }}
              className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
            >
              <ShoppingCart size={16} />
              Fechar Carrinho e Encomendar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}