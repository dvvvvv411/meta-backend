import { useState } from 'react';
import { 
  BookOpen, 
  Key, 
  Globe, 
  Building2, 
  Megaphone, 
  Wallet, 
  BarChart3, 
  Webhook, 
  AlertCircle, 
  Clock, 
  Package,
  Copy,
  Check,
  Info,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

const sections = [
  { id: 'introduction', label: 'Einführung', icon: BookOpen },
  { id: 'authentication', label: 'Authentifizierung', icon: Key },
  { id: 'base-url', label: 'Base URL & Versioning', icon: Globe },
  { id: 'agency-accounts', label: 'Agency Accounts', icon: Building2 },
  { id: 'campaigns', label: 'Kampagnen', icon: Megaphone },
  { id: 'wallet', label: 'Budget & Top-Up', icon: Wallet },
  { id: 'statistics', label: 'Statistiken & Reporting', icon: BarChart3 },
  { id: 'webhooks', label: 'Webhooks', icon: Webhook },
  { id: 'errors', label: 'Fehlercodes', icon: AlertCircle },
  { id: 'rate-limits', label: 'Rate Limits', icon: Clock },
  { id: 'sdks', label: 'SDKs & Libraries', icon: Package },
];

interface CodeBlockProps {
  code: string;
  title?: string;
  language?: string;
}

const CodeBlock = ({ code, title }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {title && (
        <div className="bg-muted/50 px-4 py-2 border-b border-border text-sm font-medium flex items-center justify-between">
          <span>{title}</span>
          <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-7 px-2">
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>
      )}
      <pre className="bg-slate-950 text-slate-50 p-4 overflow-x-auto text-sm font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
};

interface EndpointCardProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  request?: string;
  response?: string;
}

const EndpointCard = ({ method, path, description, request, response }: EndpointCardProps) => {
  const methodColors = {
    GET: 'bg-green-100 text-green-700 border-green-200',
    POST: 'bg-blue-100 text-blue-700 border-blue-200',
    PUT: 'bg-amber-100 text-amber-700 border-amber-200',
    DELETE: 'bg-red-100 text-red-700 border-red-200',
    PATCH: 'bg-purple-100 text-purple-700 border-purple-200',
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="bg-muted/30 px-4 py-3 flex items-center gap-3 border-b border-border">
        <Badge className={cn('font-mono text-xs', methodColors[method])}>
          {method}
        </Badge>
        <code className="text-sm font-mono text-foreground">{path}</code>
      </div>
      <div className="p-4 space-y-4">
        <p className="text-muted-foreground">{description}</p>
        {request && <CodeBlock title="Request Body" code={request} />}
        {response && <CodeBlock title="Response" code={response} />}
      </div>
    </div>
  );
};

const ApiDocsPage = () => {
  const [activeSection, setActiveSection] = useState('introduction');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Left Navigation - Desktop (Fixed) */}
      <aside className="hidden lg:flex fixed left-0 top-0 w-64 h-screen border-r border-border/50 bg-card/50 backdrop-blur-sm flex-col z-30">
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-2 text-primary">
            <Globe className="h-4 w-4" />
            <span className="text-sm font-mono">api.metanetwork.agency</span>
          </div>
        </div>
        
        <ScrollArea className="flex-1 p-2">
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors",
                    activeSection === section.id 
                      ? "bg-blue-50 text-blue-600" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => scrollToSection(section.id)}
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-border/50">
          <div className="text-xs text-muted-foreground">
            Version 1.0.0
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Mobile Navigation */}
        <div className="lg:hidden p-4 border-b border-border sticky top-0 bg-background z-10">
          <Select value={activeSection} onValueChange={scrollToSection}>
            <SelectTrigger>
              <SelectValue placeholder="Sektion wählen" />
            </SelectTrigger>
            <SelectContent>
              {sections.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
          {/* Introduction */}
          <section id="introduction" className="scroll-mt-20">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-foreground">MetaNetwork Advertiser API</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Die MetaNetwork API ermöglicht Werbetreibenden und Agenturen, Kampagnen, Budgets, 
                Accounts und Statistiken programmatisch zu verwalten. Alle Endpoints sind REST-basiert 
                und liefern JSON-Responses.
              </p>
              
              <div className="grid gap-4 sm:grid-cols-3 mt-8">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">Schnell</h3>
                    <p className="text-sm text-muted-foreground mt-1">Durchschnittliche Latenz &lt;100ms</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">Sicher</h3>
                    <p className="text-sm text-muted-foreground mt-1">TLS 1.3 & OAuth 2.0</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">RESTful</h3>
                    <p className="text-sm text-muted-foreground mt-1">Standardisierte JSON Responses</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Authentication */}
          <section id="authentication" className="scroll-mt-20 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Authentifizierung</h2>
            <p className="text-muted-foreground">
              Alle API-Requests erfordern einen Bearer Token im Authorization Header. 
              API Keys können im Dashboard unter Einstellungen → API generiert werden.
            </p>
            
            <CodeBlock 
              title="Authorization Header"
              code="Authorization: Bearer YOUR_API_KEY"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    API Keys
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Generiere API Keys in deinem Dashboard. Jeder Key hat individuelle Berechtigungen 
                  und kann jederzeit widerrufen werden.
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Sicherheit
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Alle Requests müssen über HTTPS erfolgen. HTTP-Requests werden automatisch 
                  abgelehnt. API Keys niemals client-seitig speichern.
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Base URL */}
          <section id="base-url" className="scroll-mt-20 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Base URL & Versioning</h2>
            <p className="text-muted-foreground">
              Alle API-Requests verwenden die folgende Base URL. Die API ist versioniert, 
              um Abwärtskompatibilität zu gewährleisten.
            </p>
            
            <CodeBlock 
              title="Base URL"
              code="https://api.metanetwork.agency/v1"
            />

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Die aktuelle stabile Version ist <code className="bg-muted px-1 rounded">v1</code>. 
                Breaking Changes werden nur in neuen Major-Versionen eingeführt.
              </AlertDescription>
            </Alert>
          </section>

          {/* Agency Accounts */}
          <section id="agency-accounts" className="scroll-mt-20 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Agency Accounts</h2>
            <p className="text-muted-foreground">
              Verwalte deine Agency Accounts programmatisch. Rufe Account-Details ab, 
              prüfe den Status und verwalte Ausgabenlimits.
            </p>

            <EndpointCard
              method="GET"
              path="/v1/agency-accounts"
              description="Liste aller aktiven Agency Accounts abrufen, inklusive Status und Budgetinformationen."
              response={`{
  "data": [
    {
      "id": "acc_7x8kL9mN2pQ3",
      "name": "Main Agency Account",
      "status": "active",
      "spend_limit": 50000,
      "spent_today": 1250.50,
      "currency": "EUR",
      "created_at": "2025-01-12T10:30:00Z",
      "expires_at": "2025-02-11T10:30:00Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "per_page": 20
  }
}`}
            />

            <EndpointCard
              method="GET"
              path="/v1/agency-accounts/:id"
              description="Details eines spezifischen Agency Accounts abrufen."
              response={`{
  "data": {
    "id": "acc_7x8kL9mN2pQ3",
    "name": "Main Agency Account",
    "status": "active",
    "spend_limit": 50000,
    "spent_today": 1250.50,
    "spent_total": 45320.00,
    "currency": "EUR",
    "auto_renew": true,
    "created_at": "2025-01-12T10:30:00Z",
    "expires_at": "2025-02-11T10:30:00Z"
  }
}`}
            />

            <EndpointCard
              method="PATCH"
              path="/v1/agency-accounts/:id"
              description="Agency Account Einstellungen aktualisieren (z.B. Name, Auto-Renewal)."
              request={`{
  "name": "Updated Account Name",
  "auto_renew": false
}`}
              response={`{
  "data": {
    "id": "acc_7x8kL9mN2pQ3",
    "name": "Updated Account Name",
    "auto_renew": false,
    "updated_at": "2025-01-15T14:22:00Z"
  }
}`}
            />
          </section>

          {/* Campaigns */}
          <section id="campaigns" className="scroll-mt-20 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Kampagnen</h2>
            <p className="text-muted-foreground">
              Erstelle und verwalte Werbekampagnen. Definiere Budgets, Zielgruppen und 
              Optimierungsziele programmatisch.
            </p>

            <EndpointCard
              method="GET"
              path="/v1/campaigns"
              description="Liste aller Kampagnen mit Filtern nach Status, Account und Datumsbereich."
              response={`{
  "data": [
    {
      "id": "cmp_4a5bC6dE7f8g",
      "name": "Scaling Campaign EU",
      "status": "active",
      "objective": "conversions",
      "daily_budget": 500,
      "spent_today": 487.32,
      "account_id": "acc_7x8kL9mN2pQ3",
      "created_at": "2025-01-15T09:00:00Z"
    }
  ],
  "meta": {
    "total": 12,
    "page": 1,
    "per_page": 20
  }
}`}
            />

            <EndpointCard
              method="POST"
              path="/v1/campaigns"
              description="Neue Werbekampagne erstellen. Erfordert einen aktiven Agency Account."
              request={`{
  "name": "Scaling Campaign EU",
  "account_id": "acc_7x8kL9mN2pQ3",
  "objective": "conversions",
  "daily_budget": 500,
  "countries": ["DE", "AT", "CH"],
  "start_date": "2025-01-20"
}`}
              response={`{
  "data": {
    "id": "cmp_9h0iJ1kL2mN3",
    "name": "Scaling Campaign EU",
    "status": "pending_review",
    "objective": "conversions",
    "daily_budget": 500,
    "created_at": "2025-01-15T14:30:00Z"
  }
}`}
            />

            <EndpointCard
              method="PUT"
              path="/v1/campaigns/:id/status"
              description="Kampagnenstatus ändern (aktivieren, pausieren, archivieren)."
              request={`{
  "status": "paused"
}`}
              response={`{
  "data": {
    "id": "cmp_4a5bC6dE7f8g",
    "status": "paused",
    "updated_at": "2025-01-15T15:00:00Z"
  }
}`}
            />
          </section>

          {/* Wallet / Top-Up */}
          <section id="wallet" className="scroll-mt-20 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Budget & Top-Up</h2>
            <p className="text-muted-foreground">
              Verwalte dein Guthaben und führe Top-Ups durch. Unterstützt werden 
              Kryptowährungen (USDT, USDC, BTC, ETH) mit automatischer Konvertierung.
            </p>

            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Auf alle Top-Ups wird eine Gebühr von 2% erhoben, die automatisch abgezogen wird.
              </AlertDescription>
            </Alert>

            <EndpointCard
              method="GET"
              path="/v1/wallet/balance"
              description="Aktuelles Guthaben und verfügbares Budget abrufen."
              response={`{
  "data": {
    "balance": 4250.00,
    "currency": "EUR",
    "pending_deposits": 0,
    "last_top_up": "2025-01-10T12:00:00Z"
  }
}`}
            />

            <EndpointCard
              method="POST"
              path="/v1/wallet/topup"
              description="Neuen Top-Up via Kryptowährung initiieren. Gibt Wallet-Adresse für die Zahlung zurück."
              request={`{
  "amount": 500,
  "currency": "EUR",
  "pay_currency": "USDT_TRC20"
}`}
              response={`{
  "data": {
    "id": "txn_3o4pQ5rS6tU7",
    "amount": 500,
    "fee": 10,
    "net_amount": 490,
    "pay_amount": 545.23,
    "pay_currency": "USDT",
    "pay_address": "TYDzsYUEpvnYmQk4zGP9sWWcTEd2MiAtW6",
    "expires_at": "2025-01-15T16:30:00Z",
    "status": "pending"
  }
}`}
            />

            <EndpointCard
              method="GET"
              path="/v1/wallet/transactions"
              description="Transaktionshistorie mit Filtern nach Typ und Zeitraum."
              response={`{
  "data": [
    {
      "id": "txn_3o4pQ5rS6tU7",
      "type": "deposit",
      "amount": 490,
      "gross_amount": 500,
      "fee": 10,
      "status": "completed",
      "created_at": "2025-01-10T12:00:00Z"
    },
    {
      "id": "txn_8v9wX0yZ1aB2",
      "type": "rental",
      "amount": -150,
      "description": "Agency Account - 30 Tage",
      "status": "completed",
      "created_at": "2025-01-12T10:30:00Z"
    }
  ],
  "meta": {
    "total": 24,
    "page": 1,
    "per_page": 20
  }
}`}
            />
          </section>

          {/* Statistics */}
          <section id="statistics" className="scroll-mt-20 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Statistiken & Reporting</h2>
            <p className="text-muted-foreground">
              Greife auf detaillierte Performance-Daten zu. Abrufe KPIs, Tageswerte 
              und aggregierte Statistiken für deine Kampagnen.
            </p>

            <EndpointCard
              method="GET"
              path="/v1/stats"
              description="Aggregierte Statistiken für alle Kampagnen oder gefiltert nach Kampagne/Account."
              response={`{
  "data": {
    "period": {
      "start": "2025-01-01",
      "end": "2025-01-15"
    },
    "metrics": {
      "spend": 12450.00,
      "impressions": 2450000,
      "clicks": 48500,
      "ctr": 1.98,
      "cpc": 0.26,
      "conversions": 1250,
      "cpa": 9.96,
      "roas": 4.2
    }
  }
}`}
            />

            <EndpointCard
              method="GET"
              path="/v1/stats/daily"
              description="Tägliche Performance-Daten für detaillierte Analysen und Trends."
              response={`{
  "data": [
    {
      "date": "2025-01-15",
      "spend": 850.00,
      "impressions": 175000,
      "clicks": 3500,
      "conversions": 95
    },
    {
      "date": "2025-01-14",
      "spend": 920.00,
      "impressions": 182000,
      "clicks": 3680,
      "conversions": 102
    }
  ]
}`}
            />
          </section>

          {/* Webhooks */}
          <section id="webhooks" className="scroll-mt-20 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Webhooks</h2>
            <p className="text-muted-foreground">
              Erhalte Echtzeit-Benachrichtigungen über wichtige Events. Konfiguriere 
              Webhook-Endpoints in deinem Dashboard.
            </p>

            <div className="space-y-3">
              {[
                { event: 'campaign.started', desc: 'Kampagne wurde erfolgreich aktiviert' },
                { event: 'campaign.paused', desc: 'Kampagne wurde pausiert (manuell oder automatisch)' },
                { event: 'campaign.budget_depleted', desc: 'Tagesbudget wurde aufgebraucht' },
                { event: 'spend.limit_reached', desc: 'Ausgabenlimit des Accounts erreicht' },
                { event: 'account.expiring', desc: 'Agency Account läuft in 3 Tagen ab' },
                { event: 'account.expired', desc: 'Agency Account ist abgelaufen' },
                { event: 'payment.completed', desc: 'Zahlung wurde erfolgreich verarbeitet' },
              ].map((webhook) => (
                <div key={webhook.event} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                  <Badge variant="outline" className="font-mono text-xs">{webhook.event}</Badge>
                  <span className="text-sm text-muted-foreground">{webhook.desc}</span>
                </div>
              ))}
            </div>
            
            <CodeBlock 
              title="Webhook Payload Beispiel"
              code={`{
  "id": "evt_1a2B3c4D5e6F",
  "event": "campaign.started",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": {
    "campaign_id": "cmp_4a5bC6dE7f8g",
    "name": "Scaling Campaign EU",
    "account_id": "acc_7x8kL9mN2pQ3"
  }
}`}
            />

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Webhooks werden mit einer HMAC-SHA256 Signatur im <code className="bg-muted px-1 rounded">X-Signature</code> Header 
                gesendet. Verifiziere diese Signatur, um die Authentizität zu gewährleisten.
              </AlertDescription>
            </Alert>
          </section>

          {/* Error Codes */}
          <section id="errors" className="scroll-mt-20 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Fehlercodes</h2>
            <p className="text-muted-foreground">
              Die API verwendet standardisierte HTTP Status Codes. Fehlerresponses 
              enthalten zusätzliche Informationen im JSON Body.
            </p>

            <div className="border border-border rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="w-24">Code</TableHead>
                    <TableHead className="w-40">Status</TableHead>
                    <TableHead>Beschreibung</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { code: 200, status: 'OK', desc: 'Erfolgreiche Anfrage', color: 'bg-green-100 text-green-700' },
                    { code: 201, status: 'Created', desc: 'Ressource erfolgreich erstellt', color: 'bg-green-100 text-green-700' },
                    { code: 400, status: 'Bad Request', desc: 'Ungültige Request-Parameter', color: 'bg-amber-100 text-amber-700' },
                    { code: 401, status: 'Unauthorized', desc: 'Fehlender oder ungültiger API Key', color: 'bg-red-100 text-red-700' },
                    { code: 403, status: 'Forbidden', desc: 'Keine Berechtigung für diese Aktion', color: 'bg-red-100 text-red-700' },
                    { code: 404, status: 'Not Found', desc: 'Ressource nicht gefunden', color: 'bg-amber-100 text-amber-700' },
                    { code: 429, status: 'Too Many Requests', desc: 'Rate Limit überschritten', color: 'bg-amber-100 text-amber-700' },
                    { code: 500, status: 'Internal Server Error', desc: 'Serverfehler, bitte später erneut versuchen', color: 'bg-red-100 text-red-700' },
                  ].map((error) => (
                    <TableRow key={error.code}>
                      <TableCell>
                        <Badge className={cn('font-mono', error.color)}>{error.code}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{error.status}</TableCell>
                      <TableCell className="text-muted-foreground">{error.desc}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <CodeBlock 
              title="Fehler Response Beispiel"
              code={`{
  "error": {
    "code": "invalid_api_key",
    "message": "The provided API key is invalid or has been revoked.",
    "doc_url": "https://docs.metanetwork.agency/errors/invalid_api_key"
  }
}`}
            />
          </section>

          {/* Rate Limits */}
          <section id="rate-limits" className="scroll-mt-20 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Rate Limits</h2>
            <p className="text-muted-foreground">
              Die API hat Anfragelimits, um faire Nutzung und Stabilität zu gewährleisten. 
              Limits werden pro API Key berechnet.
            </p>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-primary">120</div>
                  <p className="text-sm text-muted-foreground mt-1">Requests pro Minute</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-primary">10,000</div>
                  <p className="text-sm text-muted-foreground mt-1">Requests pro Tag</p>
                </CardContent>
              </Card>
            </div>
            
            <Alert>
              <ShieldCheck className="h-4 w-4" />
              <AlertDescription>
                Bei Überschreitung der Limits erhältst du einen <code className="bg-muted px-1 rounded">429 Too Many Requests</code> Status Code. 
                Burst Protection ist aktiviert – kurzfristige Spitzen werden toleriert.
              </AlertDescription>
            </Alert>

            <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
              <h4 className="font-semibold mb-2">Rate Limit Headers</h4>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">X-RateLimit-Limit:</span>
                  <span>120</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">X-RateLimit-Remaining:</span>
                  <span>115</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">X-RateLimit-Reset:</span>
                  <span>1705330800</span>
                </div>
              </div>
            </div>
          </section>

          {/* SDKs */}
          <section id="sdks" className="scroll-mt-20 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">SDKs & Libraries</h2>
            <p className="text-muted-foreground">
              Offizielle SDKs für gängige Programmiersprachen sind in Entwicklung. 
              Die REST API kann direkt mit jeder HTTP-Library verwendet werden.
            </p>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-yellow-600">JS</span>
                  </div>
                  <h3 className="font-semibold">JavaScript SDK</h3>
                  <p className="text-xs text-muted-foreground mt-1">Node.js & Browser</p>
                  <Badge variant="secondary" className="mt-3">Coming Soon</Badge>
                </CardContent>
              </Card>
              
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-blue-600">PY</span>
                  </div>
                  <h3 className="font-semibold">Python SDK</h3>
                  <p className="text-xs text-muted-foreground mt-1">Python 3.8+</p>
                  <Badge variant="secondary" className="mt-3">Coming Soon</Badge>
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-purple-600">PHP</span>
                  </div>
                  <h3 className="font-semibold">PHP SDK</h3>
                  <p className="text-xs text-muted-foreground mt-1">PHP 8.0+</p>
                  <Badge variant="secondary" className="mt-3">Coming Soon</Badge>
                </CardContent>
              </Card>
            </div>

            <CodeBlock 
              title="cURL Beispiel"
              code={`curl -X GET "https://api.metanetwork.agency/v1/agency-accounts" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
            />
          </section>

          {/* Footer */}
          <footer className="border-t border-border pt-8 mt-16 text-center">
            <p className="text-muted-foreground">
              MetaNetwork API – Built for scalable advertising infrastructure.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Version 1.0.0 • © 2025 MetaNetwork
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default ApiDocsPage;
