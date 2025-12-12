import { useState } from 'react';
import { User, Building2, Bell, Shield, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [companyName, setCompanyName] = useState(user?.user_metadata?.company_name as string || '');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const handleSaveProfile = () => {
    toast({
      title: 'Profil gespeichert',
      description: 'Deine Änderungen wurden erfolgreich gespeichert.',
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: 'Einstellungen gespeichert',
      description: 'Deine Benachrichtigungseinstellungen wurden aktualisiert.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Einstellungen</h1>
        <p className="text-muted-foreground mt-1">
          Verwalte dein Profil und Kontoeinstellungen.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Benachrichtigungen
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Sicherheit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Persönliche Informationen
              </CardTitle>
              <CardDescription>
                Aktualisiere deine persönlichen Daten.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail Adresse</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Die E-Mail Adresse kann nicht geändert werden.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Firmenname</Label>
                <Input
                  id="company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Dein Firmenname"
                />
              </div>

              <Button onClick={handleSaveProfile}>
                <Save className="mr-2 h-4 w-4" />
                Speichern
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Benachrichtigungseinstellungen
              </CardTitle>
              <CardDescription>
                Wähle aus welche Benachrichtigungen du erhalten möchtest.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>E-Mail Benachrichtigungen</Label>
                  <p className="text-sm text-muted-foreground">
                    Erhalte Updates zu deinem Account und Kampagnen.
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing E-Mails</Label>
                  <p className="text-sm text-muted-foreground">
                    Erhalte Neuigkeiten und Angebote.
                  </p>
                </div>
                <Switch
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                />
              </div>

              <Button onClick={handleSaveNotifications}>
                <Save className="mr-2 h-4 w-4" />
                Speichern
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sicherheit
              </CardTitle>
              <CardDescription>
                Verwalte deine Sicherheitseinstellungen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Passwort ändern</Label>
                <p className="text-sm text-muted-foreground">
                  Um dein Passwort zu ändern, nutze bitte die "Passwort vergessen" Funktion.
                </p>
                <Button variant="outline">
                  Passwort zurücksetzen
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
