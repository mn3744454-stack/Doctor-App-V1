import { useState } from 'react';
import { Calendar, Clock, MapPin, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { appointments } from '@/data/mockData';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const statusLabels = {
  scheduled: 'مجدول',
  in_progress: 'جاري',
  completed: 'مكتمل',
  cancelled: 'ملغي',
};

const statusColors = {
  scheduled: 'bg-primary/10 text-primary',
  in_progress: 'bg-warning/10 text-warning',
  completed: 'bg-green-500/10 text-green-600',
  cancelled: 'bg-destructive/10 text-destructive',
};

export default function Appointments() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingAppointments = appointments
    .filter(a => a.status === 'scheduled' && !isPast(new Date(a.scheduledAt)))
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  const pastAppointments = appointments
    .filter(a => a.status === 'completed' || isPast(new Date(a.scheduledAt)))
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'اليوم';
    if (isTomorrow(date)) return 'غداً';
    return format(date, 'EEEE d MMMM', { locale: ar });
  };

  const AppointmentCard = ({ appointment }: { appointment: typeof appointments[0] }) => (
    <Card 
      className="border-0 shadow-card cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/appointments/${appointment.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-14 w-14 rounded-xl overflow-hidden bg-muted flex-shrink-0">
            <img 
              src={appointment.horse?.image} 
              alt={appointment.horse?.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-semibold text-foreground">
                {appointment.title}
              </h4>
              <Badge className={cn('text-xs', statusColors[appointment.status])}>
                {statusLabels[appointment.status]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {appointment.horse?.name}
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{format(new Date(appointment.scheduledAt), 'HH:mm')}</span>
                <span className="text-muted-foreground/50">•</span>
                <span>{appointment.duration} دقيقة</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
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
    <MobileLayout title="المواعيد">
      <div className="px-4 py-4 space-y-4">
        {/* Filter Button */}
        <div className="flex justify-end">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            تصفية
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="upcoming">القادمة</TabsTrigger>
            <TabsTrigger value="past">السابقة</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-4 space-y-4">
            {upcomingAppointments.length === 0 ? (
              <Card className="border-0 shadow-card">
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">لا توجد مواعيد قادمة</p>
                </CardContent>
              </Card>
            ) : (
              Object.entries(groupAppointmentsByDate(upcomingAppointments)).map(([dateKey, apts]) => (
                <div key={dateKey} className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground sticky top-0 bg-background py-1">
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
              <Card className="border-0 shadow-card">
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">لا توجد مواعيد سابقة</p>
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
