import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Save, Stethoscope, Syringe, Scissors, Search, FileText } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { horseAccess } from '@/data/mockData';
import { toast } from 'sonner';

const recordTypes = [
  { id: 'checkup', icon: Search },
  { id: 'treatment', icon: Stethoscope },
  { id: 'surgery', icon: Scissors },
  { id: 'vaccination', icon: Syringe },
  { id: 'diagnosis', icon: FileText },
] as const;

export default function AddMedicalRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const access = horseAccess.find(a => a.horse?.id === id);
  const horse = access?.horse;

  const [formData, setFormData] = useState({
    type: '' as string,
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    treatment: '',
    notes: '',
  });

  if (!horse) {
    return (
      <MobileLayout title={t('medicalRecord.addTitle')} showBack>
        <div className="p-4 text-center text-muted-foreground">
          {t('horses.details.notFound')}
        </div>
      </MobileLayout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate saving
    toast.success(t('medicalRecord.success'));
    navigate(`/horses/${horse.id}`);
  };

  return (
    <MobileLayout title={t('medicalRecord.addTitle')} showBack>
      <div className="px-4 py-4 space-y-5">
        {/* Horse Info */}
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl overflow-hidden bg-sand shadow-soft">
              <img 
                src={horse.image} 
                alt={horse.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">{horse.name}</h3>
              <p className="text-sm text-muted-foreground">
                {horse.breed} • {horse.age} {t('horses.years')}
              </p>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Record Type */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-foreground">{t('medicalRecord.type')}</Label>
            <div className="grid grid-cols-3 gap-3">
              {recordTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.type === type.id;
                
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                      isSelected 
                        ? 'border-primary bg-primary/10 shadow-soft' 
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                  >
                    <Icon className={`h-6 w-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {t(`medicalRecord.types.${type.id}`)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-base font-semibold text-foreground">{t('medicalRecord.date')}</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="bg-card border-border text-foreground h-12 text-base"
            />
          </div>

          {/* Diagnosis */}
          <div className="space-y-2">
            <Label htmlFor="diagnosis" className="text-base font-semibold text-foreground">{t('medicalRecord.diagnosis')}</Label>
            <Input
              id="diagnosis"
              value={formData.diagnosis}
              onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
              placeholder={t('medicalRecord.diagnosisPlaceholder')}
              className="bg-card border-border text-foreground h-12 text-base placeholder:text-muted-foreground"
            />
          </div>

          {/* Treatment */}
          <div className="space-y-2">
            <Label htmlFor="treatment" className="text-base font-semibold text-foreground">{t('medicalRecord.treatment')}</Label>
            <Textarea
              id="treatment"
              value={formData.treatment}
              onChange={(e) => setFormData(prev => ({ ...prev, treatment: e.target.value }))}
              placeholder={t('medicalRecord.treatmentPlaceholder')}
              rows={3}
              className="bg-card border-border text-foreground text-base placeholder:text-muted-foreground resize-none"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-base font-semibold text-foreground">{t('medicalRecord.notes')}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder={t('medicalRecord.notesPlaceholder')}
              rows={3}
              className="bg-card border-border text-foreground text-base placeholder:text-muted-foreground resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-14 text-lg font-semibold gradient-hero gap-3"
            disabled={!formData.type}
          >
            <Save className="h-5 w-5" />
            {t('medicalRecord.save')}
          </Button>
        </form>
      </div>
    </MobileLayout>
  );
}