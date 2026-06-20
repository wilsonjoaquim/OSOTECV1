import { useState, useEffect } from "react";
import { Newspaper, ExternalLink, Clock } from "lucide-react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function TechNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get(`${API}/api/news`)
      .then((res) => setNews(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => {
    const date = new Date(d);
    const diffHours = Math.floor((Date.now() - date) / (1000 * 60 * 60));
    if (diffHours < 1) return "Há minutos";
    if (diffHours < 24) return `Há ${diffHours}h`;
    return date.toLocaleDateString("pt-AO", { day: "2-digit", month: "short" });
  };

  if (error || (!loading && news.length === 0)) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
          <Newspaper size={18} className="text-white" />
        </div>
        <div>
          <p className="text-blue-600 font-bold text-xs uppercase tracking-wider">Mantém-te Actualizado</p>
          <h2 className="text-xl font-black text-slate-800">Notícias de Tecnologia</h2>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-slate-100 rounded-2xl h-64" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {news.slice(0, 6).map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
            >
              <div className="h-36 bg-slate-100 overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Newspaper size={28} className="text-slate-300" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-600">{item.source}</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={11} /> {formatDate(item.publishedAt)}
                  </span>
                </div>
                <p className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </p>
                <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-1 text-xs text-blue-500 font-semibold mt-3">
                  Ler notícia completa <ExternalLink size={11} />
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}