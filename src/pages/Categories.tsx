import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { CategoryManager } from '@/components/categories/CategoryManager';

const Categories = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <CategoryManager />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Categories;