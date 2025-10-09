import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Home, PieChart, Sparkles, CreditCard, Palette, Target, X, Brain } from 'lucide-react';

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/app',
    description: 'Overview and insights'
  },
  {
    id: 'budgets',
    label: 'Budgets',
    icon: PieChart,
    path: '/budgets',
    description: 'Manage monthly budgets'
  },
  {
    id: 'income',
    label: "Heaven's Blessings",
    icon: Sparkles,
    path: '/income',
    description: 'Track income sources'
  },
  {
    id: 'expenses',
    label: 'Expenses',
    icon: CreditCard,
    path: '/expenses',
    description: 'Monitor spending'
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: Target,
    path: '/budget-templates',
    description: 'Budget templates'
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: Brain,
    path: '/insights',
    description: 'AI insights'
  }
];

export const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Navigation</h2>
        </div>
        <SidebarProvider>
          <Sidebar className="border-0">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.path)}
                          onClick={() => handleNavigate(item.path)}
                          className="hover:bg-accent"
                        >
                          <button className="flex items-center gap-3 w-full p-3 text-foreground">
                            <item.icon className="h-5 w-5 shrink-0" />
                            <div className="text-left flex-1">
                              <div className="font-medium text-sm">{item.label}</div>
                              <div className="text-xs text-muted-foreground">{item.description}</div>
                            </div>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      </SheetContent>
    </Sheet>
  );
};