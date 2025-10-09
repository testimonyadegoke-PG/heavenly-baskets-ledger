import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { SimplifiedCategoryManager } from '@/components/categories/SimplifiedCategoryManager';
import { AppShell } from '@/components/layout/AppShell';

const Categories = () => {
  return (
    <ProtectedRoute>
      <AppShell>
        <div className="container mx-auto px-4 py-6">
          <SimplifiedCategoryManager />
        </div>
      </AppShell>
    </ProtectedRoute>
  );
};

export default Categories;