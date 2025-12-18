import { useState, useEffect } from 'react';
import { Locale } from '../types';
import { translate } from '../i18n';

interface RulesPageProps {
  locale: Locale;
  onClose: () => void;
}

export function RulesPage({ locale, onClose }: RulesPageProps) {
  const [isClosing, setIsClosing] = useState(false);
  const t = (key: string) => translate(locale, key);

  const getContent = () => {
    return t('rules.content');
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Duración de la animación
  };

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
          <h1 className="legal-page-title">{t('rules.title')}</h1>
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


