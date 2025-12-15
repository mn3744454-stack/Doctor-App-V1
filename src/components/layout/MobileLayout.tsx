import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import TopHeader from './TopHeader';

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  showNotifications?: boolean;
}

export default function MobileLayout({
  children,
  title,
  showBack = false,
  showNotifications = true,
}: MobileLayoutProps) {
  const location = useLocation();
  const hideNavRoutes = ['/login', '/onboarding'];
  const shouldShowNav = !hideNavRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <TopHeader 
        title={title} 
        showBack={showBack} 
        showNotifications={showNotifications && shouldShowNav} 
      />
      
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>
      
      {shouldShowNav && <BottomNavigation />}
    </div>
  );
}
