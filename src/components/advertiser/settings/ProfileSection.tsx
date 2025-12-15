import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Lock, Mail } from 'lucide-react';

export function ProfileSection() {
  const { user } = useAuth();
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error('Passwörter stimmen nicht überein');
      return;
    }
    if (passwords.new.length < 8) {
      toast.error('Passwort muss mindestens 8 Zeichen haben');
      return;
    }
    
    setIsPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      });
      
      if (error) throw error;
      
      setPasswords({ current: '', new: '', confirm: '' });
      toast.success('Passwort erfolgreich geändert');
    } catch (error) {
      toast.error('Fehler beim Ändern des Passworts');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const isPasswordValid = passwords.new.length >= 8 && passwords.new === passwords.confirm;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            E-Mail-Adresse
          </CardTitle>
          <CardDescription>
            Ihre registrierte E-Mail-Adresse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Die E-Mail-Adresse kann nicht geändert werden
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Passwort ändern
          </CardTitle>
          <CardDescription>
            Aktualisieren Sie Ihr Passwort für mehr Sicherheit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="newPassword">Neues Passwort</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Mindestens 8 Zeichen
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            />
          </div>
          
          <Button 
            onClick={handlePasswordChange} 
            disabled={isPasswordLoading || !isPasswordValid}
          >
            {isPasswordLoading ? 'Ändern...' : 'Passwort ändern'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
