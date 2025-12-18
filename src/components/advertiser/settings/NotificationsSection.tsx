import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Bell, CreditCard, Clock, MessageSquare, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface NotificationSetting {
  id: string;
  labelKey: keyof typeof import('@/lib/translations/de').de.settings;
  descKey: keyof typeof import('@/lib/translations/de').de.settings;
  enabled: boolean;
  icon: React.ReactNode;
}

export function NotificationsSection() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'payment_success',
      labelKey: 'successfulPayments',
      descKey: 'successfulPaymentsDesc',
      enabled: true,
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      id: 'payment_failed',
      labelKey: 'failedPayments',
      descKey: 'failedPaymentsDesc',
      enabled: true,
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      id: 'account_expiry_7d',
      labelKey: 'accountExpiry7d',
      descKey: 'accountExpiry7dDesc',
      enabled: true,
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: 'account_expiry_1d',
      labelKey: 'accountExpiry1d',
      descKey: 'accountExpiry1dDesc',
      enabled: true,
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: 'account_expired',
      labelKey: 'accountExpired',
      descKey: 'accountExpiredDesc',
      enabled: true,
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: 'ticket_reply',
      labelKey: 'ticketReply',
      descKey: 'ticketReplyDesc',
      enabled: true,
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      id: 'ticket_resolved',
      labelKey: 'ticketResolved',
      descKey: 'ticketResolvedDesc',
      enabled: true,
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      id: 'marketing',
      labelKey: 'marketingNewsletter',
      descKey: 'marketingNewsletterDesc',
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
    toast.success(t.settings.settingsSaved);
  };

  const groupedNotifications = {
    payments: notifications.filter(n => n.id.startsWith('payment')),
    account: notifications.filter(n => n.id.startsWith('account')),
    tickets: notifications.filter(n => n.id.startsWith('ticket')),
    marketing: notifications.filter(n => n.id === 'marketing'),
  };

  const getLabel = (key: keyof typeof t.settings) => {
    return (t.settings as Record<string, string>)[key] || key;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t.settings.notificationsTitle}
          </CardTitle>
          <CardDescription>
            {t.settings.notificationsDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              {t.settings.payments}
            </h4>
            {groupedNotifications.payments.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor={notification.id}>{getLabel(notification.labelKey)}</Label>
                  <p className="text-sm text-muted-foreground">{getLabel(notification.descKey)}</p>
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
              {t.settings.accountExpiry}
            </h4>
            {groupedNotifications.account.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor={notification.id}>{getLabel(notification.labelKey)}</Label>
                  <p className="text-sm text-muted-foreground">{getLabel(notification.descKey)}</p>
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
              {t.settings.supportTickets}
            </h4>
            {groupedNotifications.tickets.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor={notification.id}>{getLabel(notification.labelKey)}</Label>
                  <p className="text-sm text-muted-foreground">{getLabel(notification.descKey)}</p>
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
              {t.settings.marketing}
            </h4>
            {groupedNotifications.marketing.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor={notification.id}>{getLabel(notification.labelKey)}</Label>
                  <p className="text-sm text-muted-foreground">{getLabel(notification.descKey)}</p>
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
            {isLoading ? t.settings.saving : t.settings.saveSettings}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
