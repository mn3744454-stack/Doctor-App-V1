import { Home, Calendar, Stethoscope, MessageCircle, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { conversations } from '@/data/mockData';

const navItems = [
  { icon: Home, label: 'الرئيسية', path: '/' },
  { icon: Calendar, label: 'المواعيد', path: '/appointments' },
  { icon: Stethoscope, label: 'الخيول', path: '/horses' },
  { icon: MessageCircle, label: 'الرسائل', path: '/messages' },
  { icon: User, label: 'حسابي', path: '/profile' },
];

export default function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const unreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const showBadge = item.path === '/messages' && unreadMessages > 0;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200 relative',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                <Icon className={cn('h-5 w-5 transition-transform duration-200', isActive && 'stroke-[2.5] scale-110')} />
                {showBadge && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium shadow-soft">
                    {unreadMessages}
                  </span>
                )}
              </div>
              <span className={cn(
                'text-[10px] font-medium transition-all duration-200',
                isActive && 'font-semibold'
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}