import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useFamilyContext } from '@/contexts/FamilyContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { FamilySelector } from '@/components/family/FamilySelector';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { Home, PieChart, Sparkles, CreditCard, Palette, Target, Brain, LogOut, User } from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
}

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
    id: 'categories',
    label: 'Categories',
    icon: Palette,
    path: '/categories',
    description: 'Manage categories'
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: Brain,
    path: '/insights',
    description: 'AI insights'
  }
];

export function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { contextType } = useFamilyContext();
  const isMobile = useIsMobile();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Mobile: show sidebar
  if (isMobile) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <Sidebar collapsible="icon" className="border-r">
            <SidebarHeader className="border-b p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Heavenly Baskets</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {contextType === 'family' ? 'Family Finance' : 'Personal Finance'}
                  </span>
                </div>
              </div>
            </SidebarHeader>

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
                          tooltip={item.label}
                        >
                          <button
                            onClick={() => navigate(item.path)}
                            className="flex items-center gap-3 w-full"
                          >
                            <item.icon className="h-4 w-4" />
                            <div className="flex flex-col items-start flex-1">
                              <span className="font-medium text-sm">{item.label}</span>
                              <span className="text-xs text-muted-foreground">{item.description}</span>
                            </div>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel>Family</SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="p-2">
                    <FamilySelector />
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.email?.split('@')[0]}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={signOut}
                  className="h-8 w-8 shrink-0"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset className="flex-1">
            <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
              <SidebarTrigger className="md:hidden" />
              <div className="flex-1" />
              <NotificationBell />
            </header>
            <main className="flex-1">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  // Desktop & Tablet: keep page-level navigation (no sidebar)
  return (
    <div className="min-h-screen flex w-full">
      <main className="flex-1">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
          <div className="flex-1" />
          <NotificationBell />
        </header>
        <main className="flex-1">
          {children}
        </main>
      </main>
    </div>
  );
}
