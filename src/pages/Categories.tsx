import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { SimplifiedCategoryManager } from '@/components/categories/SimplifiedCategoryManager';

const Categories = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <SimplifiedCategoryManager />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Categories;