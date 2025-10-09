import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHeavensBlessings } from '@/hooks/useHeavensBlessings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import HeavensBlessingsForm from '@/components/forms/HeavensBlessingsForm';
import MonthSelector from '@/components/navigation/MonthSelector';
import { Plus, ArrowLeft, Sparkles, Calendar, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const IncomeList = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  
  const { data: heavensBlessings = [] } = useHeavensBlessings(selectedMonth, selectedYear);

  const handleMonthChange = (month: string, year: number) => {
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth() + 1;
    setSelectedMonth(monthIndex);
    setSelectedYear(year);
  };

  const totalIncome = heavensBlessings.reduce((sum, blessing) => sum + blessing.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/app')}> 
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Heaven's Blessings
              </h1>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Income
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Heaven's Blessing</DialogTitle>
              </DialogHeader>
              <HeavensBlessingsForm />
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <MonthSelector 
            currentMonth={new Date(selectedYear, selectedMonth - 1).toLocaleDateString('default', { month: 'long' })}
            currentYear={selectedYear}
            onMonthChange={handleMonthChange}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Heaven's Blessings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">₦{totalIncome.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Income Records</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{heavensBlessings.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Average Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ₦{heavensBlessings.length > 0 ? (totalIncome / heavensBlessings.length).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {heavensBlessings.map((blessing) => (
            <Card 
              key={blessing.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/income/${blessing.id}`)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  {blessing.source}
                </CardTitle>
                <Badge variant="secondary">
                  {new Date(blessing.date).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Amount</span>
                  <span className="text-lg font-bold text-primary">₦{blessing.amount.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Date
                  </span>
                  <span className="text-sm font-medium">
                    {new Date(blessing.date).toLocaleDateString('default', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>

                {blessing.notes && (
                  <div className="pt-2 border-t">
                    <div className="flex items-start gap-1">
                      <FileText className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <p className="text-xs text-muted-foreground line-clamp-2">{blessing.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {heavensBlessings.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary/50" />
              <p className="text-muted-foreground mb-4">No Heaven's Blessings recorded for this month yet.</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Income
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Heaven's Blessing</DialogTitle>
                  </DialogHeader>
                  <HeavensBlessingsForm />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default IncomeList;