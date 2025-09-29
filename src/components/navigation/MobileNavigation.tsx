import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Home, PieChart, Sparkles, CreditCard, Palette, Target, X } from 'lucide-react';

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/',
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
    id: 'categories',
    label: 'Categories',
    icon: Palette,
    path: '/categories',
    description: 'Manage categories'
  }
];

export const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
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
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
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
                      >
                        <button className="flex items-center gap-3 w-full">
                          <item.icon className="h-4 w-4" />
                          <div className="text-left">
                            <div className="font-medium">{item.label}</div>
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
      </SheetContent>
    </Sheet>
  );
};