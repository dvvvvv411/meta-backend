import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Bell, CreditCard, Clock, MessageSquare, Mail } from 'lucide-react';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
}

export function NotificationsSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'payment_success',
      label: 'Erfolgreiche Zahlungen',
      description: 'Benachrichtigung bei erfolgreichen Einzahlungen und Zahlungen',
      enabled: true,
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      id: 'payment_failed',
      label: 'Fehlgeschlagene Zahlungen',
      description: 'Benachrichtigung wenn eine Zahlung fehlschlägt',
      enabled: true,
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      id: 'account_expiry_7d',
      label: 'Account läuft bald ab (7 Tage)',
      description: 'Erinnerung 7 Tage vor Ablauf Ihres Agency Accounts',
      enabled: true,
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: 'account_expiry_1d',
      label: 'Account läuft bald ab (1 Tag)',
      description: 'Erinnerung 1 Tag vor Ablauf Ihres Agency Accounts',
      enabled: true,
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: 'account_expired',
      label: 'Account abgelaufen',
      description: 'Benachrichtigung wenn Ihr Account abgelaufen ist',
      enabled: true,
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: 'ticket_reply',
      label: 'Support-Antworten',
      description: 'Benachrichtigung bei neuen Antworten auf Ihre Support-Tickets',
      enabled: true,
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      id: 'ticket_resolved',
      label: 'Ticket geschlossen',
      description: 'Benachrichtigung wenn ein Ticket als gelöst markiert wird',
      enabled: true,
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      id: 'marketing',
      label: 'Marketing & Newsletter',
      description: 'Neuigkeiten, Updates und Angebote per E-Mail',
      enabled: false,
      icon: <Mail className="h-4 w-4" />,
    },
  ]);

  const toggleNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n)
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    toast.success('Benachrichtigungseinstellungen gespeichert');
  };

  const groupedNotifications = {
    payments: notifications.filter(n => n.id.startsWith('payment')),
    account: notifications.filter(n => n.id.startsWith('account')),
    tickets: notifications.filter(n => n.id.startsWith('ticket')),
    marketing: notifications.filter(n => n.id === 'marketing'),
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            E-Mail-Benachrichtigungen
          </CardTitle>
          <CardDescription>
            Wählen Sie, welche E-Mail-Benachrichtigungen Sie erhalten möchten
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Zahlungen
            </h4>
            {groupedNotifications.payments.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor={notification.id}>{notification.label}</Label>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                </div>
                <Switch
                  id={notification.id}
                  checked={notification.enabled}
                  onCheckedChange={() => toggleNotification(notification.id)}
                />
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Account-Ablauf
            </h4>
            {groupedNotifications.account.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor={notification.id}>{notification.label}</Label>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                </div>
                <Switch
                  id={notification.id}
                  checked={notification.enabled}
                  onCheckedChange={() => toggleNotification(notification.id)}
                />
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Support-Tickets
            </h4>
            {groupedNotifications.tickets.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor={notification.id}>{notification.label}</Label>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                </div>
                <Switch
                  id={notification.id}
                  checked={notification.enabled}
                  onCheckedChange={() => toggleNotification(notification.id)}
                />
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Marketing
            </h4>
            {groupedNotifications.marketing.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor={notification.id}>{notification.label}</Label>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                </div>
                <Switch
                  id={notification.id}
                  checked={notification.enabled}
                  onCheckedChange={() => toggleNotification(notification.id)}
                />
              </div>
            ))}
          </div>

          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Speichern...' : 'Einstellungen speichern'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
