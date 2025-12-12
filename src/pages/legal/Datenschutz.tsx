import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LegalFooter } from '@/components/ui/legal-footer';

const Datenschutz = () => {
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
          <h1 className="text-3xl font-bold text-foreground mb-8">Datenschutzerklärung</h1>

          <section className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Datenschutz auf einen Blick</h2>
              <h3 className="text-lg font-medium text-foreground mb-2">Allgemeine Hinweise</h3>
              <p>
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen 
                Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen 
                Sie persönlich identifiziert werden können.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Datenerfassung auf dieser Website</h2>
              <h3 className="text-lg font-medium text-foreground mb-2">Wer ist verantwortlich für die Datenerfassung?</h3>
              <p>
                Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten 
                können Sie dem Impressum dieser Website entnehmen.
              </p>
              <h3 className="text-lg font-medium text-foreground mb-2 mt-4">Wie erfassen wir Ihre Daten?</h3>
              <p>
                Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. 
                um Daten handeln, die Sie in ein Kontaktformular eingeben. Andere Daten werden automatisch oder nach 
                Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Ihre Rechte</h2>
              <p>
                Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer 
                gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung 
                oder Löschung dieser Daten zu verlangen. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz 
                können Sie sich jederzeit an uns wenden.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Analyse-Tools und Cookies</h2>
              <p>
                Beim Besuch unserer Website kann Ihr Surf-Verhalten statistisch ausgewertet werden. Das geschieht 
                vor allem mit sogenannten Analyseprogrammen. Detaillierte Informationen zu diesen Analyseprogrammen 
                finden Sie in der folgenden Datenschutzerklärung.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Hosting</h2>
              <p>
                Wir hosten die Inhalte unserer Website bei externen Anbietern (Hoster). Die personenbezogenen Daten, 
                die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert.
              </p>
            </div>

            <p className="text-sm mt-8 pt-4 border-t border-border">
              Stand: Dezember 2024
            </p>
          </section>
        </article>
      </main>
      
      <LegalFooter />
    </div>
  );
};

export default Datenschutz;
