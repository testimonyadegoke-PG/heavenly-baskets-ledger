import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { BudgetTemplateManager } from '@/components/budget/BudgetTemplateManager';

const BudgetTemplates = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <BudgetTemplateManager />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default BudgetTemplates;