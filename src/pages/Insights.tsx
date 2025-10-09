import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { InsightsPanel } from '@/components/insights/InsightsPanel';
import MainNavigation from '@/components/navigation/MainNavigation';
import { FamilySelector } from '@/components/family/FamilySelector';
import { AppShell } from '@/components/layout/AppShell';

const Insights = () => {
  return (
    <ProtectedRoute>
      <AppShell>
        <div className="container mx-auto px-4 py-6 space-y-6">
          <MainNavigation />
          <FamilySelector />
          <InsightsPanel />
        </div>
      </AppShell>
    </ProtectedRoute>
  );
};

export default Insights;