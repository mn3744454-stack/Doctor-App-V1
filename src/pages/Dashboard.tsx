import { Calendar, Building2, Stethoscope, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  currentUser, 
  appointments, 
  memberships, 
  horseAccess 
} from '@/data/mockData';
import { format, isToday, isTomorrow, formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const todayAppointments = appointments.filter(
    a => a.status === 'scheduled' && isToday(new Date(a.scheduledAt))
  );
  
  const upcomingAppointments = appointments
    .filter(a => a.status === 'scheduled' && new Date(a.scheduledAt) > new Date())
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 3);

  const stats = [
    { 
      icon: Building2, 
      label: 'الجهات', 
      value: memberships.length,
      color: 'text-primary bg-primary/10',
      onClick: () => navigate('/organizations')
    },
    { 
      icon: Stethoscope, 
      label: 'الخيول', 
      value: horseAccess.length,
      color: 'text-forest bg-forest/10',
      onClick: () => navigate('/horses')
    },
    { 
      icon: Calendar, 
      label: 'اليوم', 
      value: todayAppointments.length,
      color: 'text-amber bg-amber/10',
      onClick: () => navigate('/appointments')
    },
  ];

  const getTimeLabel = (date: Date) => {
    if (isToday(date)) {
      return formatDistanceToNow(date, { locale: ar, addSuffix: true });
    }
    if (isTomorrow(date)) {
      return `غداً ${format(date, 'HH:mm', { locale: ar })}`;
    }
    return format(date, 'EEEE HH:mm', { locale: ar });
  };

  return (
    <MobileLayout>
      <div className="px-4 py-4 space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center gap-4 animate-fade-in">
          <Avatar className="h-14 w-14 ring-2 ring-primary/20 shadow-soft">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {currentUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-muted-foreground text-sm">مرحباً بك</p>
            <h2 className="text-xl font-bold text-foreground">{currentUser.name}</h2>
            <p className="text-xs text-muted-foreground">{currentUser.specialization}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-elevated transition-all duration-300 border-0 shadow-soft gradient-card"
              onClick={stat.onClick}
            >
              <CardContent className="p-4 flex flex-col items-center gap-2">
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming Appointments */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">المواعيد القادمة</h3>
            <button 
              onClick={() => navigate('/appointments')}
              className="text-sm text-primary font-medium hover:text-primary/80 transition-colors"
            >
              عرض الكل
            </button>
          </div>

          {upcomingAppointments.length === 0 ? (
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6 text-center">
                <Calendar className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground text-sm">لا توجد مواعيد قادمة</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((appointment, index) => (
                <Card 
                  key={appointment.id} 
                  className="border-0 shadow-soft cursor-pointer hover:shadow-elevated transition-all duration-300"
                  onClick={() => navigate(`/appointments/${appointment.id}`)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-sand flex-shrink-0">
                        <img 
                          src={appointment.horse?.image} 
                          alt={appointment.horse?.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-foreground truncate">
                              {appointment.title}
                            </h4>
                            <p className="text-sm text-muted-foreground truncate">
                              {appointment.horse?.name} • {appointment.organization?.name}
                            </p>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className="text-xs flex-shrink-0 bg-amber/10 text-amber-foreground border-amber/20"
                          >
                            {appointment.duration} د
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{getTimeLabel(new Date(appointment.scheduledAt))}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Organizations Quick Access */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">الجهات المرتبطة</h3>
            <button 
              onClick={() => navigate('/organizations')}
              className="text-sm text-primary font-medium hover:text-primary/80 transition-colors"
            >
              عرض الكل
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {memberships.map((membership) => (
              <Card 
                key={membership.id}
                className="flex-shrink-0 w-32 border-0 shadow-soft cursor-pointer hover:shadow-elevated transition-all duration-300"
                onClick={() => navigate(`/organizations/${membership.organizationId}`)}
              >
                <CardContent className="p-3 flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-sand shadow-soft">
                    <img 
                      src={membership.organization?.logo}
                      alt={membership.organization?.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="text-xs font-medium text-foreground text-center truncate w-full">
                    {membership.organization?.name}
                  </p>
                  <Badge 
                    variant="outline" 
                    className={`text-[10px] ${
                      membership.employmentType === 'employee' 
                        ? 'border-primary/30 text-primary bg-primary/5' 
                        : 'border-forest/30 text-forest bg-forest/5'
                    }`}
                  >
                    {membership.employmentType === 'employee' ? 'موظف' : 'مستقل'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}