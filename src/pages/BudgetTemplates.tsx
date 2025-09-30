import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ImprovedBudgetTemplateManager } from '@/components/budget/ImprovedBudgetTemplateManager';

const BudgetTemplates = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <ImprovedBudgetTemplateManager />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default BudgetTemplates;