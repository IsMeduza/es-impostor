export const CONFIG = {
  // ============================================
  // ADS (Google AdSense)
  // Pega tus valores aquí o vía variables VITE_*
  // ============================================
  ADSENSE_CLIENT: 'ca-pub-7845247617561167',

  ADSENSE_SLOTS: {
    sidebarLeft: import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR_LEFT ?? '1111111111',
    sidebarRight: import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR_RIGHT ?? '2222222222',
    desktopBottom: import.meta.env.VITE_ADSENSE_SLOT_DESKTOP_BOTTOM ?? '5555555555',
    stickyMobile: import.meta.env.VITE_ADSENSE_SLOT_STICKY_MOBILE ?? '3333333333',
    interstitial: import.meta.env.VITE_ADSENSE_SLOT_INTERSTITIAL ?? '4444444444',
  },

  // ============================================
  // Game Defaults
  // ============================================
  AD_DURATION: 8, // Segundos mínimos para interstitial (permite que el anuncio se cargue)

  // ============================================
  // API (Cloudflare Worker)
  // - Dev: `wrangler dev` (por defecto 8787)
  // - Prod: pon tu URL real o define VITE_API_URL
  // ============================================
  API_URL:
    import.meta.env.VITE_API_URL ??
    (import.meta.env.PROD
      ? 'https://es-impostor-api.maxsm.workers.dev'
      : 'http://localhost:8787'),
};
