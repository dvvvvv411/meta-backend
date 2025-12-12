import { Outlet } from 'react-router-dom';
import { AdvertiserSidebar } from './AdvertiserSidebar';
import { AdvertiserHeader } from './AdvertiserHeader';

export const AdvertiserLayout = () => {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AdvertiserSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdvertiserHeader />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
