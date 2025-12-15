import { 
  User, 
  Mail, 
  Phone, 
  Award, 
  Building2, 
  Settings, 
  LogOut,
  ChevronLeft,
  Moon,
  Bell,
  Shield,
  HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { currentUser, memberships } from '@/data/mockData';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const menuItems = [
  { icon: Bell, label: 'الإشعارات', path: '/settings/notifications' },
  { icon: Shield, label: 'الخصوصية والأمان', path: '/settings/privacy' },
  { icon: Moon, label: 'المظهر', path: '/settings/appearance' },
  { icon: HelpCircle, label: 'المساعدة والدعم', path: '/settings/help' },
];

export default function Profile() {
  const navigate = useNavigate();

  return (
    <MobileLayout title="حسابي">
      <div className="px-4 py-4 space-y-4">
        {/* Profile Card */}
        <Card className="border-0 shadow-card overflow-hidden">
          <div className="h-20 gradient-primary" />
          <CardContent className="p-4 -mt-10">
            <div className="flex items-end gap-4 mb-4">
              <Avatar className="h-20 w-20 ring-4 ring-background">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {currentUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 pb-1">
                <h2 className="text-xl font-bold text-foreground">{currentUser.name}</h2>
                <p className="text-sm text-muted-foreground">{currentUser.specialization}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground" dir="ltr">{currentUser.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">رخصة رقم: {currentUser.licenseNumber}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Summary */}
        <Card className="border-0 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">ملخص العمل</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {memberships.filter(m => m.employmentType === 'employee').length}
                </p>
                <p className="text-xs text-muted-foreground">وظائف دائمة</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-accent">
                  {memberships.filter(m => m.employmentType === 'freelancer').length}
                </p>
                <p className="text-xs text-muted-foreground">عملاء مستقلين</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              عضو منذ {format(new Date(currentUser.createdAt), 'MMMM yyyy', { locale: ar })}
            </p>
          </CardContent>
        </Card>

        {/* Settings Menu */}
        <Card className="border-0 shadow-card">
          <CardContent className="p-2">
            {menuItems.map((item, index) => (
              <div key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="flex-1 text-right text-foreground">{item.label}</span>
                  <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                </button>
                {index < menuItems.length - 1 && <Separator className="my-1" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="border-0 shadow-card">
          <CardContent className="p-2">
            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center gap-3 p-3 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
            >
              <LogOut className="h-5 w-5" />
              <span className="flex-1 text-right">تسجيل الخروج</span>
            </button>
          </CardContent>
        </Card>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground">
          VetConnect v1.0.0
        </p>
      </div>
    </MobileLayout>
  );
}
