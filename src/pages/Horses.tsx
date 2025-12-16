import { useState } from 'react';
import { Search, Eye, Edit, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { horseAccess, organizations } from '@/data/mockData';
import { cn } from '@/lib/utils';

const accessLevelIcons = {
  view: Eye,
  edit: Edit,
  full: Shield,
};

const accessLevelColors = {
  view: 'bg-muted text-muted-foreground border-border',
  edit: 'bg-amber/15 text-stable-brown border-amber/30',
  full: 'bg-forest/15 text-forest border-forest/30',
};

export default function Horses() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
    <MobileLayout title={t('horses.title')}>
      <div className="px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" strokeWidth={2.5} />
          <Input
            placeholder={t('horses.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-11 bg-card border-border focus:border-primary h-12 text-base font-medium"
          />
        </div>

        {/* Organization Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          <Button
            variant={selectedOrg === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedOrg(null)}
            className={cn(
              "flex-shrink-0 h-10 px-4 text-base font-semibold",
              selectedOrg === null ? "gradient-hero" : "border-border bg-card"
            )}
          >
            {t('horses.all')}
          </Button>
          {orgsList.map(org => (
            <Button
              key={org.id}
              variant={selectedOrg === org.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedOrg(org.id)}
              className={cn(
                "flex-shrink-0 gap-2 h-10 px-4 text-base font-semibold",
                selectedOrg === org.id ? "gradient-hero" : "border-border bg-card"
              )}
            >
              <img 
                src={org.logo} 
                alt={org.name}
                className="h-5 w-5 rounded-full object-cover"
              />
              {org.name}
            </Button>
          ))}
        </div>

        {/* Horses List */}
        <div className="space-y-3">
          {filteredHorses.length === 0 ? (
            <Card className="border-0 shadow-soft">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground text-base font-medium">{t('horses.noHorses')}</p>
              </CardContent>
            </Card>
          ) : (
            filteredHorses.map((access, index) => {
              const AccessIcon = accessLevelIcons[access.accessLevel];
              
              return (
                <Card 
                  key={access.id}
                  className="border-0 shadow-soft cursor-pointer hover:shadow-elevated transition-all duration-300 animate-fade-in"
                  onClick={() => navigate(`/horses/${access.horse?.id}`)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-18 w-18 rounded-xl overflow-hidden bg-sand flex-shrink-0 shadow-soft">
                        <img 
                          src={access.horse?.image} 
                          alt={access.horse?.name}
                          className="h-full w-full object-cover"
                          style={{ width: '72px', height: '72px' }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-bold text-foreground text-lg">
                            {access.horse?.name}
                          </h4>
                          <Badge variant="outline" className={cn('text-sm gap-1.5 font-semibold', accessLevelColors[access.accessLevel])}>
                            <AccessIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                            {t(`horses.accessLevel.${access.accessLevel}`)}
                          </Badge>
                        </div>
                        <p className="text-base text-muted-foreground font-medium">
                          {access.horse?.breed} • {access.horse?.age} {t('horses.years')}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <img 
                            src={access.horse?.organization?.logo}
                            alt={access.horse?.organization?.name}
                            className="h-6 w-6 rounded-full object-cover shadow-soft"
                          />
                          <span className="text-sm text-muted-foreground font-medium">
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