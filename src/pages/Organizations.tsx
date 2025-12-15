import { Building2, MapPin, Users, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { memberships, horseAccess } from '@/data/mockData';

const orgTypeLabels = {
  stable: 'اسطبل',
  clinic: 'عيادة',
  lab: 'مختبر',
};

const orgTypeColors = {
  stable: 'bg-primary/10 text-primary border-primary/20',
  clinic: 'bg-forest/10 text-forest border-forest/20',
  lab: 'bg-amber/10 text-amber border-amber/20',
};

export default function Organizations() {
  const navigate = useNavigate();

  const getHorsesCount = (orgId: string) => {
    return horseAccess.filter(a => a.horse?.organizationId === orgId).length;
  };

  return (
    <MobileLayout title="الجهات المرتبطة">
      <div className="px-4 py-4 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-0 shadow-soft gradient-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {memberships.filter(m => m.employmentType === 'employee').length}
                </p>
                <p className="text-xs text-muted-foreground">وظيفة دائمة</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-soft gradient-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-forest/10 text-forest">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {memberships.filter(m => m.employmentType === 'freelancer').length}
                </p>
                <p className="text-xs text-muted-foreground">عمل حر</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Organizations List */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">جهاتك</h3>
          
          {memberships.map((membership, index) => {
            const org = membership.organization;
            if (!org) return null;

            const horsesCount = getHorsesCount(org.id);

            return (
              <Card 
                key={membership.id}
                className="border-0 shadow-soft cursor-pointer hover:shadow-elevated transition-all duration-300 animate-fade-in"
                onClick={() => navigate(`/organizations/${org.id}`)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-xl overflow-hidden bg-sand flex-shrink-0 shadow-soft">
                      <img 
                        src={org.logo}
                        alt={org.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">
                          {org.name}
                        </h4>
                        <Badge variant="outline" className={orgTypeColors[org.type]}>
                          {orgTypeLabels[org.type]}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            membership.employmentType === 'employee' 
                              ? 'border-primary/30 text-primary bg-primary/5' 
                              : 'border-forest/30 text-forest bg-forest/5'
                          }`}
                        >
                          {membership.employmentType === 'employee' ? 'موظف' : 'مستقل'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {horsesCount} خيول مفوضة
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <span className="truncate">{org.address}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MobileLayout>
  );
}