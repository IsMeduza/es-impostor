import { useEffect, useRef } from 'react';

interface AdSlotProps {
  client: string;
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  style?: React.CSSProperties;
  label?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

let adsenseScriptPromise: Promise<void> | null = null;

function ensureAdSenseScript(client: string): Promise<void> {
  if (!client || client.includes('XXXX')) return Promise.resolve();
  if (adsenseScriptPromise) return adsenseScriptPromise;

  adsenseScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-adsense="true"]'
    );
    if (existing) {
      if ((existing as any)._adsenseLoaded) return resolve();
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('AdSense script failed')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
      client
    )}`;
    script.crossOrigin = 'anonymous';
    script.dataset.adsense = 'true';
    script.addEventListener('load', () => {
      (script as any)._adsenseLoaded = true;
      resolve();
    }, { once: true });
    script.addEventListener('error', () => reject(new Error('AdSense script failed')), { once: true });
    document.head.appendChild(script);
  });

  return adsenseScriptPromise;
}

export function AdSlot({ client, slot, format = 'auto', style, label = 'Publicidad' }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isTest = !client || client.includes('XXXX');
  const initialized = useRef(false);

  useEffect(() => {
    // Escuchar evento de actualización de consentimiento
    const handleConsentUpdate = () => {
      if (!isTest && initialized.current && adRef.current) {
        // Resetear inicialización para permitir re-inicialización después del consentimiento
        initialized.current = false;
      }
    };

    window.addEventListener('adsense-consent-updated', handleConsentUpdate);

    return () => {
      window.removeEventListener('adsense-consent-updated', handleConsentUpdate);
    };
  }, [isTest]);

  useEffect(() => {
    if (isTest || initialized.current || !adRef.current || !containerRef.current) return;

    let retryCount = 0;
    const maxRetries = 10;
    const retryDelay = 200;

    const checkAndInitialize = () => {
      if (initialized.current || !adRef.current || !containerRef.current) return;

      // Verificar dimensiones del contenedor
      const containerRect = containerRef.current.getBoundingClientRect();
      if (!containerRect || containerRect.width === 0 || containerRect.height === 0) {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(checkAndInitialize, retryDelay);
        }
        return;
      }

      // Verificar dimensiones del elemento ins
      const rect = adRef.current.getBoundingClientRect();
      if (!rect || rect.width === 0 || rect.height === 0) {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(checkAndInitialize, retryDelay);
        }
        return;
      }

      // Asegurar un tamaño mínimo antes de inicializar
      const minWidth = format === 'horizontal' ? 320 : format === 'rectangle' ? 300 : 160;
      if (rect.width < minWidth) {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(checkAndInitialize, retryDelay);
        }
        return;
      }

      // Verificar que el elemento esté visible en el viewport
      if (rect.top < 0 || rect.left < 0 || rect.bottom > window.innerHeight + 100 || rect.right > window.innerWidth + 100) {
        // Usar IntersectionObserver si está fuera del viewport
        const observer = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && !initialized.current) {
              initializeAdSense();
              observer.disconnect();
            }
          },
          {
            rootMargin: '50px',
            threshold: 0.1
          }
        );
        observer.observe(containerRef.current);
        return;
      }

      initializeAdSense();
    };

    const initializeAdSense = () => {
      if (initialized.current || !adRef.current) return;

      initialized.current = true;

      void ensureAdSenseScript(client)
        .then(() => {
          if (!adRef.current) return;

          // Verificar una última vez las dimensiones antes de inicializar
          const rect = adRef.current.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) {
            initialized.current = false;
            return;
          }

          try {
            const adsbygoogle = window.adsbygoogle || [];
            window.adsbygoogle = adsbygoogle;
            adsbygoogle.push({});
          } catch (e) {
            console.error('AdSense error:', e);
            initialized.current = false;
          }
        })
        .catch((e) => {
          console.error('AdSense script error:', e);
          initialized.current = false;
        });
    };

    // Esperar un frame para que el DOM se renderice completamente
    requestAnimationFrame(() => {
      setTimeout(checkAndInitialize, 100);
    });
  }, [isTest, client, format]);

  // Wrapper style for consistent spacing
  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    ...style
  };

  // En modo test, mostrar placeholder
  if (isTest) {
    return (
      <div className="ad-slot-wrapper" style={wrapperStyle}>
        <div className="ad-label">{label}</div>
        <div className="ad-slot test-mode" style={{ minHeight: format === 'horizontal' ? '50px' : format === 'rectangle' ? '300px' : '600px' }}>
          <div className="ad-slot-content">
            <span className="ad-placeholder">AD SPACE<br />{format}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ad-slot-wrapper" style={wrapperStyle} ref={containerRef}>
      <div className="ad-label">{label}</div>
      <div className="ad-slot">
        <div className="ad-slot-content">
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{
              display: 'block',
              width: '100%',
              minWidth: format === 'horizontal' ? '320px' : format === 'rectangle' ? '300px' : '160px',
              minHeight: format === 'horizontal' ? '50px' : format === 'rectangle' ? '300px' : '600px'
            }}
            data-ad-client={client}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </div>
  );
}
