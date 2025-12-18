import { Locale } from '../types';
import { translate } from '../i18n';

interface FooterProps {
  locale: Locale;
  onLegalClick: (page: 'privacy' | 'terms' | 'cookies' | 'legal') => void;
}

export function Footer({ locale, onLegalClick }: FooterProps) {
  const t = (key: string) => translate(locale, key);

  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <div className="footer-left">
          <a href="#" onClick={(e) => { e.preventDefault(); onLegalClick('privacy'); }} className="footer-link">
            {t('footer.privacy')}
          </a>
          <span className="footer-separator">·</span>
          <a href="#" onClick={(e) => { e.preventDefault(); onLegalClick('terms'); }} className="footer-link">
            {t('footer.terms')}
          </a>
          <span className="footer-separator">·</span>
          <a href="#" onClick={(e) => { e.preventDefault(); onLegalClick('cookies'); }} className="footer-link">
            {t('footer.cookies')}
          </a>
          <span className="footer-separator">·</span>
          <a href="#" onClick={(e) => { e.preventDefault(); onLegalClick('legal'); }} className="footer-link">
            {t('footer.legal')}
          </a>
        </div>
        <div className="footer-right">
          <span className="footer-credits">{t('footer.credits')}</span>
        </div>
      </div>
    </footer>
  );
}

