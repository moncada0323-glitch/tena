if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Evita re-registrar si ya está
    navigator.serviceWorker.getRegistrations().then(regs => {
      const already = regs.some(r => (r.scope || "").includes("/"));
      if (!already) {
        navigator.serviceWorker
          .register("/service-worker.js")
          .catch((err) => console.error("SW registration failed:", err));
      }
    }).catch(() => {
      // Fallback simple
      navigator.serviceWorker
        .register("/service-worker.js")
        .catch((err) => console.error("SW registration failed:", err));
    });
  });
}
