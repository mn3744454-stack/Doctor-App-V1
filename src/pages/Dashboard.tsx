import { Calendar, Building2, Stethoscope, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { ar, enUS } from 'date-fns/locale';
import i18n from '@/i18n';

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const dateLocale = i18n.language === 'ar' || i18n.language === 'ur' ? ar : enUS;
  
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
      labelKey: 'dashboard.stats.organizations', 
      value: memberships.length,
      color: 'text-primary bg-primary/15',
      onClick: () => navigate('/organizations')
    },
    { 
      icon: Stethoscope, 
      labelKey: 'dashboard.stats.horses', 
      value: horseAccess.length,
      color: 'text-forest bg-forest/15',
      onClick: () => navigate('/horses')
    },
    { 
      icon: Calendar, 
      labelKey: 'dashboard.stats.today', 
      value: todayAppointments.length,
      color: 'text-amber bg-amber/15',
      onClick: () => navigate('/appointments')
    },
  ];

  const getTimeLabel = (date: Date) => {
    if (isToday(date)) {
      return formatDistanceToNow(date, { locale: dateLocale, addSuffix: true });
    }
    if (isTomorrow(date)) {
      return `${t('dashboard.tomorrow')} ${format(date, 'HH:mm', { locale: dateLocale })}`;
    }
    return format(date, 'EEEE HH:mm', { locale: dateLocale });
  };

  return (
    <MobileLayout>
      <div className="px-4 py-4 space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center gap-4 animate-fade-in">
          <Avatar className="h-16 w-16 ring-2 ring-primary/30 shadow-soft">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
              {currentUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-muted-foreground text-base">{t('dashboard.welcome')}</p>
            <h2 className="text-2xl font-bold text-foreground">{currentUser.name}</h2>
            <p className="text-sm text-muted-foreground font-medium">{currentUser.specialization}</p>
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
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6" strokeWidth={2.5} />
                </div>
                <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                <span className="text-sm font-medium text-muted-foreground">{t(stat.labelKey)}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming Appointments */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">{t('dashboard.upcomingAppointments')}</h3>
            <button 
              onClick={() => navigate('/appointments')}
              className="text-base text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              {t('dashboard.viewAll')}
            </button>
          </div>

          {upcomingAppointments.length === 0 ? (
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground text-base">{t('dashboard.noAppointments')}</p>
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
                      <div className="h-14 w-14 rounded-xl overflow-hidden bg-sand flex-shrink-0 shadow-soft">
                        <img 
                          src={appointment.horse?.image} 
                          alt={appointment.horse?.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-foreground text-base truncate">
                              {appointment.title}
                            </h4>
                            <p className="text-sm text-muted-foreground font-medium truncate">
                              {appointment.horse?.name} • {appointment.organization?.name}
                            </p>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className="text-sm flex-shrink-0 bg-amber/15 text-stable-brown border-amber/30 font-semibold"
                          >
                            {appointment.duration} {t('dashboard.minutes')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground font-medium">
                          <Clock className="h-4 w-4 text-primary" strokeWidth={2.5} />
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
            <h3 className="text-lg font-bold text-foreground">{t('dashboard.linkedOrganizations')}</h3>
            <button 
              onClick={() => navigate('/organizations')}
              className="text-base text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              {t('dashboard.viewAll')}
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {memberships.map((membership) => (
              <Card 
                key={membership.id}
                className="flex-shrink-0 w-36 border-0 shadow-soft cursor-pointer hover:shadow-elevated transition-all duration-300"
                onClick={() => navigate(`/organizations/${membership.organizationId}`)}
              >
                <CardContent className="p-4 flex flex-col items-center gap-2">
                  <div className="h-14 w-14 rounded-full overflow-hidden bg-sand shadow-soft">
                    <img 
                      src={membership.organization?.logo}
                      alt={membership.organization?.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="text-sm font-semibold text-foreground text-center truncate w-full">
                    {membership.organization?.name}
                  </p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs font-semibold ${
                      membership.employmentType === 'employee' 
                        ? 'border-primary/40 text-primary bg-primary/10' 
                        : 'border-forest/40 text-forest bg-forest/10'
                    }`}
                  >
                    {t(`organizations.relationship.${membership.employmentType}`)}
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