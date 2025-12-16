import { useState } from 'react';
import { Calendar, Clock, MapPin, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { appointments } from '@/data/mockData';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import i18n from '@/i18n';

const statusColors = {
  scheduled: 'bg-primary/15 text-primary border-primary/30',
  in_progress: 'bg-amber/15 text-stable-brown border-amber/30',
  completed: 'bg-forest/15 text-forest border-forest/30',
  cancelled: 'bg-destructive/15 text-destructive border-destructive/30',
};

export default function Appointments() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('upcoming');

  const dateLocale = i18n.language === 'ar' || i18n.language === 'ur' ? ar : enUS;

  const upcomingAppointments = appointments
    .filter(a => a.status === 'scheduled' && !isPast(new Date(a.scheduledAt)))
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  const pastAppointments = appointments
    .filter(a => a.status === 'completed' || isPast(new Date(a.scheduledAt)))
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return t('appointments.today');
    if (isTomorrow(date)) return t('appointments.tomorrow');
    return format(date, 'EEEE d MMMM', { locale: dateLocale });
  };

  const AppointmentCard = ({ appointment }: { appointment: typeof appointments[0] }) => (
    <Card 
      className="border-0 shadow-soft cursor-pointer hover:shadow-elevated transition-all duration-300"
      onClick={() => navigate(`/appointments/${appointment.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-16 w-16 rounded-xl overflow-hidden bg-sand flex-shrink-0 shadow-soft">
            <img 
              src={appointment.horse?.image} 
              alt={appointment.horse?.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-bold text-foreground text-base">
                {appointment.title}
              </h4>
              <Badge variant="outline" className={cn('text-sm font-semibold', statusColors[appointment.status])}>
                {t(`appointments.status.${appointment.status}`)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground font-medium mb-2">
              {appointment.horse?.name}
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" strokeWidth={2.5} />
                <span>{format(new Date(appointment.scheduledAt), 'HH:mm')}</span>
                <span className="text-muted-foreground/50">•</span>
                <span>{appointment.duration} {t('appointments.minutes')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" strokeWidth={2.5} />
                <span className="truncate">{appointment.location}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const groupAppointmentsByDate = (appointmentsList: typeof appointments) => {
    const groups: Record<string, typeof appointments> = {};
    
    appointmentsList.forEach(apt => {
      const dateKey = format(new Date(apt.scheduledAt), 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(apt);
    });
    
    return groups;
  };

  return (
    <MobileLayout title={t('appointments.title')}>
      <div className="px-4 py-4 space-y-4">
        {/* Filter Button */}
        <div className="flex justify-end">
          <Button variant="outline" size="sm" className="gap-2 border-border bg-card hover:bg-muted font-semibold">
            <Filter className="h-4 w-4" strokeWidth={2.5} />
            {t('appointments.filter')}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 h-12">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-base font-semibold">
              {t('appointments.upcoming')}
            </TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-base font-semibold">
              {t('appointments.past')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-4 space-y-4">
            {upcomingAppointments.length === 0 ? (
              <Card className="border-0 shadow-soft">
                <CardContent className="p-8 text-center">
                  <Calendar className="h-14 w-14 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="text-muted-foreground text-base font-medium">{t('appointments.noUpcoming')}</p>
                </CardContent>
              </Card>
            ) : (
              Object.entries(groupAppointmentsByDate(upcomingAppointments)).map(([dateKey, apts]) => (
                <div key={dateKey} className="space-y-3">
                  <h3 className="text-base font-bold text-primary sticky top-0 bg-background py-1">
                    {getDateLabel(new Date(dateKey))}
                  </h3>
                  <div className="space-y-3">
                    {apts.map(apt => (
                      <AppointmentCard key={apt.id} appointment={apt} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-4 space-y-3">
            {pastAppointments.length === 0 ? (
              <Card className="border-0 shadow-soft">
                <CardContent className="p-8 text-center">
                  <Calendar className="h-14 w-14 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="text-muted-foreground text-base font-medium">{t('appointments.noPast')}</p>
                </CardContent>
              </Card>
            ) : (
              pastAppointments.map(apt => (
                <AppointmentCard key={apt.id} appointment={apt} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
}