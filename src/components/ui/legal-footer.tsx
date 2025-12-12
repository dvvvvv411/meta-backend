import { Link } from 'react-router-dom';

interface LegalFooterProps {
  className?: string;
}

export const LegalFooter = ({ className = '' }: LegalFooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`border-t border-border py-4 mt-auto ${className}`}>
      <nav 
        aria-label="Rechtliche Links" 
        className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-sm text-muted-foreground px-4"
      >
        <Link 
          to="/datenschutz" 
          className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
        >
          Datenschutz
        </Link>
        <span aria-hidden="true">•</span>
        <Link 
          to="/impressum" 
          className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
        >
          Impressum
        </Link>
        <span aria-hidden="true">•</span>
        <span>© {currentYear} MetaNetwork</span>
      </nav>
    </footer>
  );
};
