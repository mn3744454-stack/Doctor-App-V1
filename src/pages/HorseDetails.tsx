import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, 
  FileText, 
  Plus, 
  Activity,
  Dna,
  Palette
} from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { horseAccess, medicalRecords, appointments } from '@/data/mockData';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import i18n from '@/i18n';

const recordTypeColors = {
  checkup: 'bg-primary/15 text-primary border-primary/30',
  treatment: 'bg-amber/15 text-stable-brown border-amber/30',
  surgery: 'bg-destructive/15 text-destructive border-destructive/30',
  vaccination: 'bg-forest/15 text-forest border-forest/30',
  diagnosis: 'bg-amber/15 text-stable-brown border-amber/30',
};

export default function HorseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const dateLocale = i18n.language === 'ar' || i18n.language === 'ur' ? ar : enUS;
  
  const access = horseAccess.find(a => a.horse?.id === id);
  const horse = access?.horse;
  
  if (!horse) {
    return (
      <MobileLayout title={t('horses.details.title')} showBack>
        <div className="p-4 text-center text-muted-foreground text-base font-medium">
          {t('horses.details.notFound')}
        </div>
      </MobileLayout>
    );
  }

  const horseMedicalRecords = medicalRecords.filter(r => r.horseId === horse.id);
  const horseAppointments = appointments.filter(a => a.horseId === horse.id);

  const canEdit = access?.accessLevel === 'edit' || access?.accessLevel === 'full';

  const infoItems = [
    { icon: Dna, labelKey: 'horses.details.breed', value: horse.breed },
    { icon: Calendar, labelKey: 'horses.details.age', value: `${horse.age} ${t('horses.years')}` },
    { icon: Palette, labelKey: 'horses.details.color', value: horse.color },
    { icon: Activity, labelKey: 'horses.details.gender', value: horse.gender === 'male' ? t('horses.details.male') : t('horses.details.female') },
  ];

  return (
    <MobileLayout title={horse.name} showBack>
      <div className="pb-4">
        {/* Hero Section */}
        <div className="relative h-56 bg-sand">
          <img 
            src={horse.image}
            alt={horse.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute bottom-4 right-4 left-4">
            <h1 className="text-2xl font-bold text-foreground mb-1">{horse.name}</h1>
            <div className="flex items-center gap-2">
              <img 
                src={horse.organization?.logo}
                alt={horse.organization?.name}
                className="h-6 w-6 rounded-full object-cover shadow-soft"
              />
              <span className="text-base text-muted-foreground font-medium">
                {horse.organization?.name}
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 space-y-4 -mt-2">
          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-3">
            {infoItems.map((item, index) => (
              <Card key={index} className="border-0 shadow-soft gradient-card">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2.5 rounded-full bg-primary/15 text-primary">
                    <item.icon className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{t(item.labelKey)}</p>
                    <p className="text-base font-bold text-foreground">{item.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Microchip ID */}
          {horse.microchipId && (
            <Card className="border-0 shadow-soft">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{t('horses.details.chipNumber')}</p>
                  <p className="text-base font-mono font-bold text-foreground">
                    {horse.microchipId}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs */}
          <Tabs defaultValue="records" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 h-12">
              <TabsTrigger value="records" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-base font-semibold">
                <FileText className="h-5 w-5" strokeWidth={2.5} />
                {t('horses.details.records')}
              </TabsTrigger>
              <TabsTrigger value="appointments" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-base font-semibold">
                <Calendar className="h-5 w-5" strokeWidth={2.5} />
                {t('horses.details.appointments')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="records" className="mt-4 space-y-3">
              {canEdit && (
                <Button 
                  className="w-full gap-2 gradient-hero h-12 text-base font-bold"
                  onClick={() => navigate(`/horses/${horse.id}/add-record`)}
                >
                  <Plus className="h-5 w-5" strokeWidth={2.5} />
                  {t('horses.details.addRecord')}
                </Button>
              )}

              {horseMedicalRecords.length === 0 ? (
                <Card className="border-0 shadow-soft">
                  <CardContent className="p-6 text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground/40 mb-2" />
                    <p className="text-muted-foreground text-base font-medium">{t('horses.details.noRecords')}</p>
                  </CardContent>
                </Card>
              ) : (
                horseMedicalRecords.map(record => (
                  <Card 
                    key={record.id} 
                    className="border-0 shadow-soft cursor-pointer hover:shadow-elevated transition-all duration-300"
                    onClick={() => navigate(`/records/${record.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant="outline" className={`text-sm font-semibold ${recordTypeColors[record.type]}`}>
                          {t(`medicalRecord.types.${record.type}`)}
                        </Badge>
                        <span className="text-sm text-muted-foreground font-medium">
                          {format(new Date(record.date), 'd MMMM yyyy', { locale: dateLocale })}
                        </span>
                      </div>
                      {record.diagnosis && (
                        <p className="text-base font-bold text-foreground mb-1">
                          {record.diagnosis}
                        </p>
                      )}
                      {record.treatment && (
                        <p className="text-sm text-muted-foreground font-medium line-clamp-2">
                          {record.treatment}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="appointments" className="mt-4 space-y-3">
              {horseAppointments.length === 0 ? (
                <Card className="border-0 shadow-soft">
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground/40 mb-2" />
                    <p className="text-muted-foreground text-base font-medium">{t('horses.details.noAppointments')}</p>
                  </CardContent>
                </Card>
              ) : (
                horseAppointments.map(apt => (
                  <Card 
                    key={apt.id} 
                    className="border-0 shadow-soft cursor-pointer hover:shadow-elevated transition-all duration-300"
                    onClick={() => navigate(`/appointments/${apt.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-foreground text-base">{apt.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={`font-semibold ${apt.status === 'completed' 
                            ? 'border-forest/30 text-forest bg-forest/10' 
                            : 'border-primary/30 text-primary bg-primary/10'
                          }`}
                        >
                          {t(`appointments.status.${apt.status}`)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">
                        {format(new Date(apt.scheduledAt), 'EEEE d MMMM - HH:mm', { locale: dateLocale })}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MobileLayout>
  );
}