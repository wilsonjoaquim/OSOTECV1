import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { usePixel } from "../hooks/usePixel";
import { useHeatmap } from "../hooks/useHeatmap";
import { useEffect, useState } from "react";
import {
  Monitor, Smartphone, Headphones, Cpu, Camera, Printer,
  Wifi, Battery, ChevronRight, Shield, Truck, HeadphonesIcon, Star
} from "lucide-react";
{/*Import das Notícias*/ }
import TechNews from "../components/TechNews";
import { useABTest } from "../hooks/useABTest";


const CATEGORIES = [
  { id: "computadores", label: "Computadores", icon: Monitor, color: "bg-blue-50 text-blue-600" },
  { id: "phones", label: "Smartphones", icon: Smartphone, color: "bg-purple-50 text-purple-600" },
  { id: "acessorios", label: "Acessórios", icon: Headphones, color: "bg-green-50 text-green-600" },
  { id: "componentes", label: "Componentes", icon: Cpu, color: "bg-orange-50 text-orange-600" },
  { id: "cameras", label: "Câmeras", icon: Camera, color: "bg-red-50 text-red-600" },
  { id: "impressoras", label: "Impressoras", icon: Printer, color: "bg-yellow-50 text-yellow-600" },
  { id: "redes", label: "Redes & Wi-Fi", icon: Wifi, color: "bg-indigo-50 text-indigo-600" },
  { id: "energia", label: "Energia", icon: Battery, color: "bg-teal-50 text-teal-600" },
];

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80",
  "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1600&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

export default function Home() {
  const navigate = useNavigate();
  const { setFilters } = useApp();
  const { track } = usePixel();
  useHeatmap("home");

  const { variant: heroVariant, trackClick: trackHeroClick } = useABTest("hero_cta");
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    track("page_view", { page: "home" });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToCategory = (cat) => {
    track("category_click", { category: cat });
    setFilters((f) => ({ ...f, category: cat }));
    navigate("/produtos");
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      {/* Hero Banner com Carrossel */}
      <section className="relative text-white py-20 px-4 mb-10 overflow-hidden h-[600px] flex items-center">
        {/* Imagens em camadas com fade */}
        {HERO_IMAGES.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url('${img}')`,
              opacity: i === currentImage ? 1 : 0,
            }}
          />
        ))}

        {/* Overlay azul para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/55 via-blue-700/45 to-blue-600/40" />

        <div className="relative max-w-4xl mx-auto text-center z-10 w-full">
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight drop-shadow-lg">
            Tecnologia de confiança<br />
            <span className="text-blue-200">ao teu alcance</span>
          </h1>
          <p className="text-blue-100 text-lg mb-8">
            Os melhores produtos tecnológicos de Angola, entregues na tua porta.
          </p>
          <button
            onClick={() => {
              trackHeroClick();
              navigate("/produtos");
            }}
            className={`font-bold px-8 py-3 rounded-xl transition-colors inline-flex items-center gap-2 ${heroVariant?.style || "bg-white text-blue-700"
              }`}
          >
            {heroVariant?.label || "Ver Produtos"} <ChevronRight size={18} />
          </button>

          {/* Indicadores do carrossel */}
          <div className="flex justify-center gap-2 mt-10">
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`h-1.5 rounded-full transition-all ${i === currentImage ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges — Ilustrativos */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Shield,
              title: "Compra Segura",
              desc: "Pagamento 100% protegido",
              image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80",
            },
            {
              icon: Truck,
              title: "Entrega Rápida",
              desc: "Rastreamento em tempo real",
              image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80",
            },
            {
              icon: HeadphonesIcon,
              title: "Suporte 24/7",
              desc: "Equipa sempre disponível",
              image: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=600&q=80",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="relative rounded-3xl overflow-hidden h-44 group cursor-default"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                {/* Overlay gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/50 to-blue-900/10" />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-end p-5">
                  <div className="w-11 h-11 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center mb-3">
                    <Icon size={20} className="text-white" />
                  </div>
                  <p className="font-bold text-white text-base">{item.title}</p>
                  <p className="text-sm text-blue-100">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {/* Noticias */}
      <TechNews />

      {/* Ticket Support CTA */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <h3 className="text-2xl font-black mb-2">Precisas de ajuda técnica?</h3>
            <p className="text-gray-400">Abre um ticket e a nossa equipa responde em minutos.</p>
          </div>
          <button
            onClick={() => navigate("/suporte")}
            className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Abrir Ticket
          </button>
        </div>
      </section>
    </div>
  );
}