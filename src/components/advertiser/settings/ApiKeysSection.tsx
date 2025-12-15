import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Key, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  ExternalLink, 
  Shield, 
  Clock,
  Globe,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useApiKeys } from '@/hooks/useApiKeys';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ApiKeysSection() {
  const { apiKeys, isLoading, createKey, revokeKey } = useApiKeys();
  const [newKeyName, setNewKeyName] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Bitte geben Sie einen Namen für den API Key ein');
      return;
    }

    try {
      const fullKey = await createKey.mutateAsync(newKeyName.trim());
      setNewlyCreatedKey(fullKey);
      setNewKeyName('');
      toast.success('API Key erfolgreich erstellt');
    } catch (error) {
      toast.error('Fehler beim Erstellen des API Keys');
    }
  };

  const handleCopyKey = async (key: string) => {
    await navigator.clipboard.writeText(key);
    setCopied(true);
    toast.success('API Key kopiert');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevokeKey = async (id: string) => {
    try {
      await revokeKey.mutateAsync(id);
      toast.success('API Key widerrufen');
    } catch (error) {
      toast.error('Fehler beim Widerrufen des API Keys');
    }
  };

  const dismissNewKey = () => {
    setNewlyCreatedKey(null);
  };

  return (
    <div className="space-y-6">
      {/* New Key Alert */}
      {newlyCreatedKey && (
        <Alert className="bg-green-50 border-green-200">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="space-y-3">
              <p className="font-medium">
                Ihr neuer API Key wurde erstellt. Kopieren Sie ihn jetzt – er wird nur einmal angezeigt.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-green-100 px-3 py-2 rounded text-sm font-mono break-all">
                  {newlyCreatedKey}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopyKey(newlyCreatedKey)}
                  className="shrink-0"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Button size="sm" variant="ghost" onClick={dismissNewKey}>
                Verstanden, Key gesichert
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Generate New Key */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Neuen API Key erstellen
          </CardTitle>
          <CardDescription>
            Erstellen Sie einen neuen API Key für den programmatischen Zugriff
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Key-Name (z.B. Production, Development)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleGenerateKey} 
              className="shrink-0"
              disabled={createKey.isPending}
            >
              {createKey.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Key className="h-4 w-4 mr-2" />
              )}
              Generieren
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Keys Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Ihre API Keys
          </CardTitle>
          <CardDescription>
            Verwalten Sie Ihre aktiven API Keys
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">Lade API Keys...</p>
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Key className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Noch keine API Keys erstellt</p>
              <p className="text-sm">Erstellen Sie Ihren ersten Key oben</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Erstellt am</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium">{apiKey.name}</TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {apiKey.key_prefix}
                      </code>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(apiKey.created_at).toLocaleDateString('de-DE')}
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>API Key widerrufen?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Der Key "{apiKey.name}" wird sofort ungültig. 
                              Alle Anwendungen, die diesen Key verwenden, verlieren den Zugriff.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleRevokeKey(apiKey.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Widerrufen
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Base URL</h4>
                <code className="text-xs bg-muted px-2 py-1 rounded block mt-1">
                  https://api.metanetwork.agency/v1
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Rate Limits</h4>
                <p className="text-sm text-muted-foreground">120 Requests / Minute</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ExternalLink className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Dokumentation</h4>
                <Link 
                  to="/advertiser/api" 
                  className="text-sm text-primary hover:underline"
                >
                  API Docs öffnen →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Warning */}
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Sicherheitshinweis:</strong> Teilen Sie Ihre API Keys niemals öffentlich. 
          Speichern Sie sie sicher und rotieren Sie sie regelmäßig.
        </AlertDescription>
      </Alert>
    </div>
  );
}
