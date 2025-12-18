import { useState, useEffect } from 'react';
import { Locale } from '../types';
import { translate } from '../i18n';

interface LegalPageProps {
  locale: Locale;
  page: 'privacy' | 'terms' | 'cookies' | 'legal';
  onClose: () => void;
}

export function LegalPage({ locale, page, onClose }: LegalPageProps) {
  const [isClosing, setIsClosing] = useState(false);
  const t = (key: string) => translate(locale, key);

  const getContent = () => {
    const key = `legal.${page}.content`;
    return t(key);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Duración de la animación
  };

  useEffect(() => {
    // Reset closing state when page changes
    setIsClosing(false);
  }, [page]);

  return (
    <div 
      className={`legal-page-overlay ${isClosing ? 'closing' : ''}`} 
      onClick={handleClose}
    >
      <div 
        className={`legal-page-content ${isClosing ? 'closing' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="legal-page-header">
          <h1 className="legal-page-title">{t(`legal.${page}.title`)}</h1>
          <button className="legal-page-close" onClick={handleClose} aria-label="Cerrar">
            ×
          </button>
        </div>
        <div className="legal-page-body">
          <div className="legal-page-text" dangerouslySetInnerHTML={{ __html: getContent() }} />
        </div>
      </div>
    </div>
  );
}

