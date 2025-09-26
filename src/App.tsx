import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import BudgetDetail from "./pages/BudgetDetail";
import IncomeDetail from "./pages/IncomeDetail";
import ExpenseDetail from "./pages/ExpenseDetail";
import BudgetsList from "./pages/BudgetsList";
import IncomeList from "./pages/IncomeList";
import ExpensesList from "./pages/ExpensesList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/budgets" element={<BudgetsList />} />
            <Route path="/budgets/:id" element={<BudgetDetail />} />
            <Route path="/income" element={<IncomeList />} />
            <Route path="/income/:id" element={<IncomeDetail />} />
            <Route path="/expenses" element={<ExpensesList />} />
            <Route path="/expenses/:id" element={<ExpenseDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
