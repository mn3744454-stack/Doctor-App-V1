import { useParams, useNavigate } from 'react-router-dom';
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
import { ar } from 'date-fns/locale';

const recordTypeLabels = {
  checkup: 'فحص',
  treatment: 'علاج',
  surgery: 'جراحة',
  vaccination: 'تطعيم',
  diagnosis: 'تشخيص',
};

const recordTypeColors = {
  checkup: 'bg-primary/10 text-primary border-primary/20',
  treatment: 'bg-amber/10 text-amber border-amber/20',
  surgery: 'bg-destructive/10 text-destructive border-destructive/20',
  vaccination: 'bg-forest/10 text-forest border-forest/20',
  diagnosis: 'bg-amber/10 text-amber border-amber/20',
};

export default function HorseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const access = horseAccess.find(a => a.horse?.id === id);
  const horse = access?.horse;
  
  if (!horse) {
    return (
      <MobileLayout title="تفاصيل الحصان" showBack>
        <div className="p-4 text-center text-muted-foreground">
          الحصان غير موجود
        </div>
      </MobileLayout>
    );
  }

  const horseMedicalRecords = medicalRecords.filter(r => r.horseId === horse.id);
  const horseAppointments = appointments.filter(a => a.horseId === horse.id);

  const canEdit = access?.accessLevel === 'edit' || access?.accessLevel === 'full';

  const infoItems = [
    { icon: Dna, label: 'السلالة', value: horse.breed },
    { icon: Calendar, label: 'العمر', value: `${horse.age} سنوات` },
    { icon: Palette, label: 'اللون', value: horse.color },
    { icon: Activity, label: 'الجنس', value: horse.gender === 'male' ? 'ذكر' : 'أنثى' },
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
                className="h-5 w-5 rounded-full object-cover shadow-soft"
              />
              <span className="text-sm text-muted-foreground">
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
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-semibold text-foreground">{item.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Microchip ID */}
          {horse.microchipId && (
            <Card className="border-0 shadow-soft">
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">رقم الشريحة</p>
                  <p className="text-sm font-mono font-semibold text-foreground">
                    {horse.microchipId}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs */}
          <Tabs defaultValue="records" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-sand/50">
              <TabsTrigger value="records" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <FileText className="h-4 w-4" />
                السجلات
              </TabsTrigger>
              <TabsTrigger value="appointments" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Calendar className="h-4 w-4" />
                المواعيد
              </TabsTrigger>
            </TabsList>

            <TabsContent value="records" className="mt-4 space-y-3">
              {canEdit && (
                <Button 
                  className="w-full gap-2 gradient-hero"
                  onClick={() => navigate(`/horses/${horse.id}/add-record`)}
                >
                  <Plus className="h-4 w-4" />
                  إضافة سجل طبي
                </Button>
              )}

              {horseMedicalRecords.length === 0 ? (
                <Card className="border-0 shadow-soft">
                  <CardContent className="p-6 text-center">
                    <FileText className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-muted-foreground text-sm">لا توجد سجلات طبية</p>
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
                        <Badge variant="outline" className={recordTypeColors[record.type]}>
                          {recordTypeLabels[record.type]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(record.date), 'd MMMM yyyy', { locale: ar })}
                        </span>
                      </div>
                      {record.diagnosis && (
                        <p className="text-sm font-medium text-foreground mb-1">
                          {record.diagnosis}
                        </p>
                      )}
                      {record.treatment && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
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
                    <Calendar className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-muted-foreground text-sm">لا توجد مواعيد</p>
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
                        <h4 className="font-semibold text-foreground">{apt.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={apt.status === 'completed' 
                            ? 'border-forest/20 text-forest bg-forest/5' 
                            : 'border-primary/20 text-primary bg-primary/5'
                          }
                        >
                          {apt.status === 'completed' ? 'مكتمل' : 'مجدول'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(apt.scheduledAt), 'EEEE d MMMM - HH:mm', { locale: ar })}
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