import { Building2, MapPin, Phone, Mail, Users, Briefcase } from 'lucide-react';
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
  stable: 'bg-primary/10 text-primary',
  clinic: 'bg-accent/10 text-accent',
  lab: 'bg-warning/10 text-warning',
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
          <Card className="border-0 shadow-card">
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
          <Card className="border-0 shadow-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-accent/10 text-accent">
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
          
          {memberships.map(membership => {
            const org = membership.organization;
            if (!org) return null;

            const horsesCount = getHorsesCount(org.id);

            return (
              <Card 
                key={membership.id}
                className="border-0 shadow-card cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/organizations/${org.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-xl overflow-hidden bg-muted flex-shrink-0">
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
                        <Badge className={orgTypeColors[org.type]}>
                          {orgTypeLabels[org.type]}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            membership.employmentType === 'employee' 
                              ? 'border-primary/30 text-primary' 
                              : 'border-accent/30 text-accent'
                          }`}
                        >
                          {membership.employmentType === 'employee' ? 'موظف' : 'مستقل'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {horsesCount} خيول مفوضة
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
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
