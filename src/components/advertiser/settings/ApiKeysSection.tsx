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
import { useLanguage } from '@/contexts/LanguageContext';

export function ApiKeysSection() {
  const { t, language } = useLanguage();
  const { apiKeys, isLoading, createKey, revokeKey } = useApiKeys();
  const [newKeyName, setNewKeyName] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error(t.settings.keyNameRequired);
      return;
    }

    try {
      const fullKey = await createKey.mutateAsync(newKeyName.trim());
      setNewlyCreatedKey(fullKey);
      setNewKeyName('');
      toast.success(t.settings.keyCreatedSuccess);
    } catch (error) {
      toast.error(t.settings.keyCreatedError);
    }
  };

  const handleCopyKey = async (key: string) => {
    await navigator.clipboard.writeText(key);
    setCopied(true);
    toast.success(t.settings.keyCopied);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevokeKey = async (id: string) => {
    try {
      await revokeKey.mutateAsync(id);
      toast.success(t.settings.keyRevoked);
    } catch (error) {
      toast.error(t.settings.keyRevokedError);
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
                {t.settings.keyCreatedAlert}
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
                {t.settings.keySecured}
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
            {t.settings.createApiKey}
          </CardTitle>
          <CardDescription>
            {t.settings.createApiKeyDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder={t.settings.keyNamePlaceholder}
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
              {t.common.generate}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Keys Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            {t.settings.yourApiKeys}
          </CardTitle>
          <CardDescription>
            {t.settings.manageApiKeys}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">{t.settings.loadingKeys}</p>
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Key className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{t.settings.noKeysYet}</p>
              <p className="text-sm">{t.settings.createFirstKey}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.settings.keyName}</TableHead>
                  <TableHead>{t.settings.key}</TableHead>
                  <TableHead>{t.settings.createdOn}</TableHead>
                  <TableHead className="text-right">{t.common.actions}</TableHead>
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
                      {new Date(apiKey.created_at).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US')}
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
                            <AlertDialogTitle>{t.settings.revokeKey}</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{apiKey.name}" {t.settings.revokeKeyDesc}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t.settings.revokeKeyCancel}</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleRevokeKey(apiKey.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {t.settings.revokeKeyConfirm}
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
                <h4 className="font-medium mb-1">{t.settings.baseUrl}</h4>
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
                <h4 className="font-medium mb-1">{t.settings.rateLimits}</h4>
                <p className="text-sm text-muted-foreground">120 {t.settings.requestsPerMinute}</p>
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
                <h4 className="font-medium mb-1">{t.settings.documentation}</h4>
                <Link 
                  to="/advertiser/api" 
                  className="text-sm text-primary hover:underline"
                >
                  {t.settings.openDocs}
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
          <strong>{t.settings.securityWarning}:</strong> {t.settings.securityWarningText}
        </AlertDescription>
      </Alert>
    </div>
  );
}
