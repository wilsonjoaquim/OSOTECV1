import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Testes activos configurados aqui
const AB_TESTS = {
  hero_cta: {
    testId: "hero_cta_001",
    variants: [
      { id: "A", label: "Ver Produtos",        style: "bg-white text-blue-700" },
      { id: "B", label: "Comprar Agora — Oferta", style: "bg-yellow-400 text-slate-900" },
    ],
  },
  product_button: {
    testId: "product_btn_001",
    variants: [
      { id: "A", label: "Adicionar",          style: "bg-blue-600 text-white" },
      { id: "B", label: "Adicionar ao Cesto", style: "bg-emerald-600 text-white" },
    ],
  },
};

export function useABTest(testKey) {
  const test = AB_TESTS[testKey];
  const [variant, setVariant] = useState(null);

  useEffect(() => {
    if (!test) return;

    // Manter a mesma variante por sessão
    const stored = sessionStorage.getItem(`ab_${testKey}`);
    let chosen;

    if (stored) {
      chosen = test.variants.find(v => v.id === stored) || test.variants[0];
    } else {
      // Distribuição aleatória 50/50
      chosen = test.variants[Math.floor(Math.random() * test.variants.length)];
      sessionStorage.setItem(`ab_${testKey}`, chosen.id);

      // Registar view
      fetch(`${API}/api/abtests/${test.testId}/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId: chosen.id, event: "view" }),
      }).catch(() => {});
    }

    setVariant(chosen);
  }, [testKey]);

  const trackClick = () => {
    if (!test || !variant) return;
    fetch(`${API}/api/abtests/${test.testId}/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId: variant.id, event: "click" }),
    }).catch(() => {});
  };

  const trackConversion = () => {
    if (!test || !variant) return;
    fetch(`${API}/api/abtests/${test.testId}/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId: variant.id, event: "conversion" }),
    }).catch(() => {});
  };

  return { variant, trackClick, trackConversion };
}