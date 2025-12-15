import { useState } from 'react';
import { Search, Filter, Eye, Edit, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { horseAccess, organizations } from '@/data/mockData';
import { cn } from '@/lib/utils';

const accessLevelLabels = {
  view: 'مشاهدة',
  edit: 'تعديل',
  full: 'كامل',
};

const accessLevelIcons = {
  view: Eye,
  edit: Edit,
  full: Shield,
};

const accessLevelColors = {
  view: 'bg-muted text-muted-foreground',
  edit: 'bg-accent/10 text-accent',
  full: 'bg-primary/10 text-primary',
};

export default function Horses() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

  const filteredHorses = horseAccess.filter(access => {
    const matchesSearch = access.horse?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOrg = selectedOrg ? access.horse?.organizationId === selectedOrg : true;
    return matchesSearch && matchesOrg;
  });

  const uniqueOrgs = [...new Set(horseAccess.map(a => a.horse?.organizationId))];
  const orgsList = organizations.filter(org => uniqueOrgs.includes(org.id));

  return (
    <MobileLayout title="الخيول">
      <div className="px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن حصان..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 bg-card border-0 shadow-card"
          />
        </div>

        {/* Organization Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          <Button
            variant={selectedOrg === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedOrg(null)}
            className="flex-shrink-0"
          >
            الكل
          </Button>
          {orgsList.map(org => (
            <Button
              key={org.id}
              variant={selectedOrg === org.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedOrg(org.id)}
              className="flex-shrink-0 gap-2"
            >
              <img 
                src={org.logo} 
                alt={org.name}
                className="h-4 w-4 rounded-full object-cover"
              />
              {org.name}
            </Button>
          ))}
        </div>

        {/* Horses List */}
        <div className="space-y-3">
          {filteredHorses.length === 0 ? (
            <Card className="border-0 shadow-card">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">لا توجد خيول</p>
              </CardContent>
            </Card>
          ) : (
            filteredHorses.map(access => {
              const AccessIcon = accessLevelIcons[access.accessLevel];
              
              return (
                <Card 
                  key={access.id}
                  className="border-0 shadow-card cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/horses/${access.horse?.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                        <img 
                          src={access.horse?.image} 
                          alt={access.horse?.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-foreground text-lg">
                            {access.horse?.name}
                          </h4>
                          <Badge className={cn('text-xs gap-1', accessLevelColors[access.accessLevel])}>
                            <AccessIcon className="h-3 w-3" />
                            {accessLevelLabels[access.accessLevel]}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {access.horse?.breed} • {access.horse?.age} سنوات
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <img 
                            src={access.horse?.organization?.logo}
                            alt={access.horse?.organization?.name}
                            className="h-5 w-5 rounded-full object-cover"
                          />
                          <span className="text-xs text-muted-foreground">
                            {access.horse?.organization?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
