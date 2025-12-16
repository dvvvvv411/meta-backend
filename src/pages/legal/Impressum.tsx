import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Impressum = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container max-w-3xl py-12 px-4">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Zurück
          </Link>
        </Button>

        <article>
          <h1 className="text-3xl font-bold text-foreground mb-8">Impressum</h1>

          <section className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Angaben gemäß § 5 TMG</h2>
              <address className="not-italic">
                <p className="font-medium text-foreground">MetaNetwork GmbH</p>
                <p>Musterstraße 123</p>
                <p>10115 Berlin</p>
                <p>Deutschland</p>
              </address>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Kontakt</h2>
              <p>Telefon: +49 (0) 30 123456789</p>
              <p>E-Mail: info@metanetwork.de</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Vertreten durch</h2>
              <p>Geschäftsführer: Max Mustermann</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Registereintrag</h2>
              <p>Eintragung im Handelsregister</p>
              <p>Registergericht: Amtsgericht Berlin-Charlottenburg</p>
              <p>Registernummer: HRB 123456 B</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Umsatzsteuer-ID</h2>
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
                DE123456789
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
              <p>Max Mustermann</p>
              <p>Musterstraße 123</p>
              <p>10115 Berlin</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Streitschlichtung</h2>
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                <a 
                  href="https://ec.europa.eu/consumers/odr/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p className="mt-2">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>

            <p className="text-sm mt-8 pt-4 border-t border-border">
              Stand: Dezember 2024
            </p>
          </section>
        </article>
      </main>
    </div>
  );
};

export default Impressum;
