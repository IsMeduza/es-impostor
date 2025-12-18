import { useEffect, useState } from 'react';
import { translate } from '../i18n';
import type { Locale } from '../types';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

interface ConsentPreferences {
  ad_storage: boolean;
  ad_user_data: boolean;
  ad_personalization: boolean;
  analytics_storage: boolean;
}

interface ConsentBannerProps {
  locale?: Locale;
}

export function ConsentBanner({ locale = 'es' }: ConsentBannerProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showManagePanel, setShowManagePanel] = useState(false);
  const [consentGiven, setConsentGiven] = useState<boolean | null>(null);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    ad_storage: false,
    ad_user_data: false,
    ad_personalization: false,
    analytics_storage: false,
  });

  const t = (key: string) => translate(locale, key);

  useEffect(() => {
    // Verificar si ya hay consentimiento guardado
    const consent = localStorage.getItem('ads_consent');
    const savedPrefs = localStorage.getItem('ads_preferences');

    if (consent === 'granted') {
      setConsentGiven(true);
      if (savedPrefs) {
        try {
          setPreferences(JSON.parse(savedPrefs));
        } catch (e) {
          // Ignore
        }
      }
      updateConsent(true, savedPrefs ? JSON.parse(savedPrefs) : {
        ad_storage: true,
        ad_user_data: true,
        ad_personalization: true,
        analytics_storage: true,
      });
      return;
    } else if (consent === 'denied') {
      setConsentGiven(false);
      return;
    }

    // Mostrar banner después de un pequeño delay
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const updateConsent = (granted: boolean, prefs?: ConsentPreferences) => {
    const finalPrefs = prefs || preferences;

    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'ad_storage': granted && finalPrefs.ad_storage ? 'granted' : 'denied',
        'ad_user_data': granted && finalPrefs.ad_user_data ? 'granted' : 'denied',
        'ad_personalization': granted && finalPrefs.ad_personalization ? 'granted' : 'denied',
        'analytics_storage': granted && finalPrefs.analytics_storage ? 'granted' : 'denied',
      });
    }

    localStorage.setItem('ads_consent', granted ? 'granted' : 'denied');
    if (granted) {
      localStorage.setItem('ads_preferences', JSON.stringify(finalPrefs));
    }

    setConsentGiven(granted);

    // Animar cierre hacia abajo
    setIsClosing(true);
    setTimeout(() => {
      setShowBanner(false);
      setShowManagePanel(false);
      setIsClosing(false);
    }, 300);

    // Recargar anuncios si se dio consentimiento
    // No hacer push genérico - dejar que cada AdSlot se inicialice cuando esté listo
    if (granted) {
      // Forzar re-render de los componentes AdSlot esperando que detecten el cambio de consentimiento
      // Los AdSlots ya tienen su propia lógica de inicialización con verificación de tamaño
      setTimeout(() => {
        // Disparar un evento personalizado para que los AdSlots se re-inicialicen si es necesario
        window.dispatchEvent(new CustomEvent('adsense-consent-updated'));
      }, 500);
    }
  };

  const handleConsent = () => {
    updateConsent(true, {
      ad_storage: true,
      ad_user_data: true,
      ad_personalization: true,
      analytics_storage: true,
    });
  };

  const handleManage = () => {
    setShowManagePanel(true);
  };

  const handleSavePreferences = () => {
    const hasAnyEnabled = Object.values(preferences).some(v => v);
    updateConsent(hasAnyEnabled, preferences);
  };

  const handleDenyAll = () => {
    setPreferences({
      ad_storage: false,
      ad_user_data: false,
      ad_personalization: false,
      analytics_storage: false,
    });
    updateConsent(false);
  };

  const togglePreference = (key: keyof ConsentPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner || consentGiven !== null) return null;

  return (
    <>
      <div className={`consent-banner ${isClosing ? 'closing' : ''}`}>
        {!showManagePanel ? (
          <div className="consent-banner-content">
            <div className="consent-banner-text">
              <p>
                {t('consent.text')}
              </p>
            </div>
            <div className="consent-banner-actions">
              <button className="btn-consent-deny" onClick={handleDenyAll}>
                {t('consent.deny')}
              </button>
              <button className="btn-consent-accept" onClick={handleConsent}>
                {t('consent.accept')}
              </button>
              <button className="btn-consent-manage" onClick={handleManage}>
                {t('consent.manage')}
              </button>
            </div>
          </div>
        ) : (
          <div className="consent-manage-panel">
            <h3 className="consent-manage-title">{t('consent.manage.title')}</h3>
            <p className="consent-manage-desc">
              {t('consent.manage.desc')}
            </p>

            <div className="consent-preferences">
              <label className="consent-preference-item">
                <input
                  type="checkbox"
                  checked={preferences.ad_storage}
                  onChange={() => togglePreference('ad_storage')}
                />
                <div className="consent-preference-content">
                  <span className="consent-preference-name">{t('consent.pref.ad_storage')}</span>
                  <span className="consent-preference-desc">{t('consent.pref.ad_storage.desc')}</span>
                </div>
              </label>

              <label className="consent-preference-item">
                <input
                  type="checkbox"
                  checked={preferences.ad_user_data}
                  onChange={() => togglePreference('ad_user_data')}
                />
                <div className="consent-preference-content">
                  <span className="consent-preference-name">{t('consent.pref.ad_user_data')}</span>
                  <span className="consent-preference-desc">{t('consent.pref.ad_user_data.desc')}</span>
                </div>
              </label>

              <label className="consent-preference-item">
                <input
                  type="checkbox"
                  checked={preferences.ad_personalization}
                  onChange={() => togglePreference('ad_personalization')}
                />
                <div className="consent-preference-content">
                  <span className="consent-preference-name">{t('consent.pref.ad_personalization')}</span>
                  <span className="consent-preference-desc">{t('consent.pref.ad_personalization.desc')}</span>
                </div>
              </label>

              <label className="consent-preference-item">
                <input
                  type="checkbox"
                  checked={preferences.analytics_storage}
                  onChange={() => togglePreference('analytics_storage')}
                />
                <div className="consent-preference-content">
                  <span className="consent-preference-name">{t('consent.pref.analytics_storage')}</span>
                  <span className="consent-preference-desc">{t('consent.pref.analytics_storage.desc')}</span>
                </div>
              </label>
            </div>

            <div className="consent-manage-actions">
              <button className="btn-consent-deny" onClick={handleDenyAll}>
                {t('consent.denyAll')}
              </button>
              <button className="btn-consent-save" onClick={handleSavePreferences}>
                {t('consent.save')}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

