import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ImprovedBudgetTemplateManager } from '@/components/budget/ImprovedBudgetTemplateManager';
import { AppShell } from '@/components/layout/AppShell';

const BudgetTemplates = () => {
  return (
    <ProtectedRoute>
      <AppShell>
        <div className="container mx-auto px-4 py-6">
          <ImprovedBudgetTemplateManager />
        </div>
      </AppShell>
    </ProtectedRoute>
  );
};

export default BudgetTemplates;