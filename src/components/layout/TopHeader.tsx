import { Bell, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { notifications } from '@/data/mockData';

interface TopHeaderProps {
  title?: string;
  showBack?: boolean;
  showNotifications?: boolean;
}

export default function TopHeader({ 
  title, 
  showBack = false, 
  showNotifications = true 
}: TopHeaderProps) {
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border safe-area-inset-top">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-9 w-9"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
          {title && (
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          )}
        </div>
        
        {showNotifications && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/notifications')}
            className="h-9 w-9 relative"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">
                {unreadCount}
              </span>
            )}
          </Button>
        )}
      </div>
    </header>
  );
}
