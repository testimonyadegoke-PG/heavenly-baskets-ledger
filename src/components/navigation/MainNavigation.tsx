import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, PieChart, Sparkles, CreditCard, Palette, Target, Brain } from 'lucide-react';
import { MobileNavigation } from './MobileNavigation';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  description: string;
}

const MainNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      path: '/app',
      description: 'Overview and insights'
    },
    {
      id: 'budgets',
      label: 'Budgets',
      icon: <PieChart className="h-5 w-5" />,
      path: '/budgets',
      description: 'Manage monthly budgets'
    },
    {
      id: 'income',
      label: "Heaven's Blessings",
      icon: <Sparkles className="h-5 w-5" />,
      path: '/income',
      description: 'Track income sources'
    },
    {
      id: 'expenses',
      label: 'Expenses',
      icon: <CreditCard className="h-5 w-5" />,
      path: '/expenses',
      description: 'Monitor spending'
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: <Target className="h-5 w-5" />,
      path: '/budget-templates',
      description: 'Budget templates'
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: <Palette className="h-5 w-5" />,
      path: '/categories',
      description: 'Manage categories'
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: <Brain className="h-5 w-5" />,
      path: '/insights',
      description: 'AI insights'
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <MobileNavigation />
        <div className="hidden md:block">
          <NotificationCenter />
        </div>
      </div>
      
      <Card className="hidden md:block">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={isActive(item.path) ? "default" : "outline"}
                className={`h-auto p-3 flex-col gap-2 ${isActive(item.path) ? 'shadow-md' : 'hover:shadow-sm'}`}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <div className="text-center w-full">
                  <div className="font-medium text-xs truncate">{item.label}</div>
                  <div className="text-xs opacity-70 hidden lg:block truncate">{item.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainNavigation;