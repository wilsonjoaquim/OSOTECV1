import { useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function useHeatmap(page) {
  useEffect(() => {
    const clicks = [];
    const handler = (e) => {
      clicks.push({
        x: Math.round((e.clientX / window.innerWidth) * 100),
        y: Math.round((e.clientY / window.innerHeight) * 100),
        t: Date.now(),
      });
    };
    window.addEventListener("click", handler);

    const flush = () => {
      if (!clicks.length) return;
      fetch(`${API}/api/heatmap/record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, clicks: [...clicks] }),
        keepalive: true,
      }).catch(() => {});
      clicks.length = 0;
    };

    const interval = setInterval(flush, 5000);
    window.addEventListener("beforeunload", flush);

    return () => {
      clearInterval(interval);
      window.removeEventListener("click", handler);
      window.removeEventListener("beforeunload", flush);
      flush();
    };
  }, [page]);
}