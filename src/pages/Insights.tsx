import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { InsightsPanel } from '@/components/insights/InsightsPanel';
import MainNavigation from '@/components/navigation/MainNavigation';
import { FamilySelector } from '@/components/family/FamilySelector';

const Insights = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 space-y-6">
          <MainNavigation />
          <FamilySelector />
          <InsightsPanel />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Insights;