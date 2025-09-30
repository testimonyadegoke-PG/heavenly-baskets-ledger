import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CategorySelect } from '@/components/shared/CategorySelect';
import { Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddExpenseFormProps {
  onAddExpense: (expense: {
    amount: number;
    category: string;
    description: string;
    date: string;
  }) => void;
}

export default function AddExpenseForm({ onAddExpense }: AddExpenseFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    onAddExpense({
      amount,
      category: formData.category,
      description: formData.description,
      date: formData.date,
    });

    // Reset form
    setFormData({
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setIsOpen(false);

    toast({
      title: "Expense Added",
      description: `₦${amount.toLocaleString()} added successfully`,
    });
  };

  if (!isOpen) {
    return (
      <Card className="shadow-gentle">
        <CardContent className="p-6">
          <Button 
            onClick={() => setIsOpen(true)} 
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Expense
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-elevated">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">Add New Expense</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsOpen(false)}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <CategorySelect
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              placeholder="Select a category"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="What was this expense for?"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-gradient-primary hover:opacity-90">
              Add Expense
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}