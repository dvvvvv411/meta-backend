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
import { useLanguage } from '@/contexts/LanguageContext';

export function ProfileSection() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error(t.settings.passwordMismatch);
      return;
    }
    if (passwords.new.length < 8) {
      toast.error(t.settings.passwordTooShort);
      return;
    }
    
    setIsPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      });
      
      if (error) throw error;
      
      setPasswords({ current: '', new: '', confirm: '' });
      toast.success(t.settings.passwordChanged);
    } catch (error) {
      toast.error(t.settings.passwordChangeError);
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
            {t.settings.emailLabel}
          </CardTitle>
          <CardDescription>
            {t.settings.emailDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="email">{t.auth.email}</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              {t.settings.emailCannotChange}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t.settings.changePassword}
          </CardTitle>
          <CardDescription>
            {t.settings.changePasswordDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">{t.settings.currentPassword}</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="newPassword">{t.settings.newPassword}</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              {t.settings.minChars}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t.settings.confirmPassword}</Label>
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
            {isPasswordLoading ? t.settings.changing : t.settings.changePassword}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
