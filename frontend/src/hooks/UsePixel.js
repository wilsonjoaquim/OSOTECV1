const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function usePixel() {
  const track = async (event, data = {}) => {
    try {
      const payload = {
        event,
        data,
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screen: `${window.screen.width}x${window.screen.height}`,
        timestamp: new Date().toISOString(),
        sessionId: getSession(),
      };
      await fetch(`${API}/api/pixel/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } catch (_) {}
  };

  return { track };
}

function getSession() {
  let s = sessionStorage.getItem("osotec_sid");
  if (!s) {
    s = Math.random().toString(36).slice(2) + Date.now();
    sessionStorage.setItem("osotec_sid", s);
  }
  return s;
}