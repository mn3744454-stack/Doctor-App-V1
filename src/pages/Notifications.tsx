import { 
  Bell, 
  Calendar, 
  Shield, 
  MessageCircle, 
  Clock,
  Settings
} from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { notifications } from '@/data/mockData';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const notificationIcons = {
  appointment: Calendar,
  access_granted: Shield,
  message: MessageCircle,
  reminder: Clock,
  system: Settings,
};

const notificationColors = {
  appointment: 'bg-primary/10 text-primary',
  access_granted: 'bg-forest/10 text-forest',
  message: 'bg-amber/10 text-amber',
  reminder: 'bg-amber/10 text-amber',
  system: 'bg-sand text-stable-brown',
};

export default function Notifications() {
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const unreadNotifications = sortedNotifications.filter(n => !n.isRead);
  const readNotifications = sortedNotifications.filter(n => n.isRead);

  return (
    <MobileLayout title="الإشعارات" showBack>
      <div className="px-4 py-4 space-y-4">
        {sortedNotifications.length === 0 ? (
          <Card className="border-0 shadow-soft">
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">لا توجد إشعارات</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {unreadNotifications.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-primary">جديد</h3>
                {unreadNotifications.map((notification, index) => {
                  const Icon = notificationIcons[notification.type];
                  
                  return (
                    <Card 
                      key={notification.id}
                      className="border-0 shadow-soft bg-primary/5 border border-primary/10 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "p-2 rounded-full flex-shrink-0",
                            notificationColors[notification.type]
                          )}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground mb-0.5">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                locale: ar,
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {readNotifications.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">سابق</h3>
                {readNotifications.map((notification, index) => {
                  const Icon = notificationIcons[notification.type];
                  
                  return (
                    <Card 
                      key={notification.id}
                      className="border-0 shadow-soft animate-fade-in"
                      style={{ animationDelay: `${(unreadNotifications.length + index) * 50}ms` }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "p-2 rounded-full flex-shrink-0 opacity-60",
                            notificationColors[notification.type]
                          )}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground mb-0.5">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                locale: ar,
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </MobileLayout>
  );
}