import { Home, Calendar, Stethoscope, MessageCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { conversations } from '@/data/mockData';

const navItems = [
  { icon: Home, labelKey: 'nav.home', path: '/' },
  { icon: Calendar, labelKey: 'nav.appointments', path: '/appointments' },
  { icon: Stethoscope, labelKey: 'nav.horses', path: '/horses' },
  { icon: MessageCircle, labelKey: 'nav.messages', path: '/messages' },
];

export default function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const unreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/98 backdrop-blur-xl border-t border-border safe-area-inset-bottom shadow-soft">
      <div className="flex items-center justify-around h-20 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const showBadge = item.path === '/messages' && unreadMessages > 0;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center gap-1.5 flex-1 h-full transition-all duration-200 relative',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                <Icon className={cn('h-7 w-7 transition-transform duration-200', isActive && 'scale-110')} strokeWidth={isActive ? 2.5 : 2} />
                {showBadge && (
                  <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold shadow-soft">
                    {unreadMessages}
                  </span>
                )}
              </div>
              <span className={cn(
                'text-sm transition-all duration-200',
                isActive ? 'font-bold' : 'font-semibold'
              )}>
                {t(item.labelKey)}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
