import { useState } from 'react';
import { Search, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { conversations } from '@/data/mockData';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function Messages() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.organization?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MobileLayout title="الرسائل">
      <div className="px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث في المحادثات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 bg-cream/50 border-sand focus:border-primary"
          />
        </div>

        {/* Conversations List */}
        <div className="space-y-3">
          {filteredConversations.length === 0 ? (
            <Card className="border-0 shadow-soft">
              <CardContent className="p-8 text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">لا توجد محادثات</p>
              </CardContent>
            </Card>
          ) : (
            filteredConversations.map((conv, index) => (
              <Card 
                key={conv.id}
                className={cn(
                  "border-0 shadow-soft cursor-pointer hover:shadow-elevated transition-all duration-300 animate-fade-in",
                  conv.unreadCount > 0 && "bg-primary/5 border border-primary/10"
                )}
                onClick={() => navigate(`/messages/${conv.id}`)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-sand flex-shrink-0 shadow-soft">
                        <img 
                          src={conv.organization?.logo}
                          alt={conv.organization?.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium shadow-soft">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className={cn(
                          "font-medium text-foreground truncate",
                          conv.unreadCount > 0 && "font-semibold"
                        )}>
                          {conv.organization?.name}
                        </h4>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {conv.lastMessage && formatDistanceToNow(
                            new Date(conv.lastMessage.createdAt), 
                            { locale: ar, addSuffix: true }
                          )}
                        </span>
                      </div>
                      <p className={cn(
                        "text-sm truncate",
                        conv.unreadCount > 0 
                          ? "text-foreground font-medium" 
                          : "text-muted-foreground"
                      )}>
                        {conv.lastMessage?.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </MobileLayout>
  );
}