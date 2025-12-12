import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8" aria-label="MetaNetwork Startseite">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center" aria-hidden="true">
            <span className="text-primary-foreground font-bold text-lg">AD</span>
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent gradient-bg">
            MetaNetwork
          </span>
        </Link>
        
        {/* Card */}
        <div className="glass rounded-2xl p-8 shadow-xl border border-border/50">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>
          
          {children}
        </div>
        
        {/* Footer */}
        <footer className="text-center text-muted-foreground text-sm mt-6">
          <nav aria-label="Rechtliche Links" className="flex items-center justify-center gap-2 mb-2">
            <Link to="/datenschutz" className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
              Datenschutz
            </Link>
            <span aria-hidden="true">•</span>
            <Link to="/impressum" className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
              Impressum
            </Link>
          </nav>
          <p>© {currentYear} MetaNetwork. Alle Rechte vorbehalten.</p>
        </footer>
      </div>
    </div>
  );
};

export default AuthLayout;
