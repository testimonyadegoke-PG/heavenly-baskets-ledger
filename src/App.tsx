import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { FamilyProvider } from "./contexts/FamilyContext";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import BudgetDetail from "./pages/BudgetDetail";
import IncomeDetail from "./pages/IncomeDetail";
import BudgetsList from "./pages/BudgetsList";
import IncomeList from "./pages/IncomeList";
import ExpensesList from "./pages/ExpensesList";
import ExpenseDetail from "./pages/ExpenseDetail";
import Categories from "@/pages/Categories";
import BudgetTemplates from "@/pages/BudgetTemplates";
import Insights from "@/pages/Insights";
import Landing from "@/pages/Landing";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <FamilyProvider>
            <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/app" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/budgets" element={<ProtectedRoute><BudgetsList /></ProtectedRoute>} />
            <Route path="/budgets/:id" element={<ProtectedRoute><BudgetDetail /></ProtectedRoute>} />
            <Route path="/income" element={<ProtectedRoute><IncomeList /></ProtectedRoute>} />
            <Route path="/income/:id" element={<ProtectedRoute><IncomeDetail /></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute><ExpensesList /></ProtectedRoute>} />
            <Route path="/expenses/:id" element={<ProtectedRoute><ExpenseDetail /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
            <Route path="/budget-templates" element={<ProtectedRoute><BudgetTemplates /></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </FamilyProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
