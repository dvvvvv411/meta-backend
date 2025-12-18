import { User, Bell, Key, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileSection } from '@/components/advertiser/settings/ProfileSection';
import { NotificationsSection } from '@/components/advertiser/settings/NotificationsSection';
import { ApiKeysSection } from '@/components/advertiser/settings/ApiKeysSection';
import { DangerZoneSection } from '@/components/advertiser/settings/DangerZoneSection';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SettingsPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t.settings.pageTitle}</h1>
        <p className="text-muted-foreground mt-1">
          {t.settings.pageSubtitle}
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{t.settings.profileTitle}</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">{t.settings.notificationsTitle}</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">API</span>
          </TabsTrigger>
          <TabsTrigger 
            value="danger" 
            className="flex items-center gap-2 data-[state=active]:bg-destructive/10 data-[state=active]:text-destructive"
          >
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">{t.settings.dangerZone}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileSection />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <NotificationsSection />
        </TabsContent>

        <TabsContent value="api" className="mt-6">
          <ApiKeysSection />
        </TabsContent>

        <TabsContent value="danger" className="mt-6">
          <DangerZoneSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
