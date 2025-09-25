import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MonthlyData } from '@/types/expenses';

interface ExpenseChartsProps {
  currentData: MonthlyData;
  historicalData?: MonthlyData[];
}

export default function ExpenseCharts({ currentData, historicalData = [] }: ExpenseChartsProps) {
  // Pie chart data - only categories with spending
  const pieData = currentData.categories
    .filter(cat => cat.spent > 0)
    .map(cat => ({
      name: cat.name,
      value: cat.spent,
      color: cat.color,
    }));

  // Bar chart data - budget vs actual
  const barData = currentData.categories.map(cat => ({
    name: cat.name.split(' ')[0], // Shortened names for mobile
    budget: cat.budgetAmount,
    spent: cat.spent,
    color: cat.color,
  }));

  // Line chart data for historical trends
  const allMonths = [...historicalData, currentData].reverse();
  const trendData = allMonths.map(month => ({
    month: `${month.month.slice(0, 3)} ${month.year}`,
    blessings: month.heavensBlessings,
    spent: month.totalSpent,
    baskets: month.twelveBaskets,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 rounded-lg shadow-elevated border">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === 'blessings' ? "Heaven's Blessings" : 
               entry.dataKey === 'baskets' ? '12 Baskets' : 
               entry.name}: ₦{entry.value?.toLocaleString() || 0}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0];
      return (
        <div className="bg-card p-3 rounded-lg shadow-elevated border">
          <p className="font-medium">{data.name}</p>
          <p style={{ color: data.color }}>
            Amount: ₦{data.value?.toLocaleString() || 0}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Expense Distribution Pie Chart */}
      <Card className="shadow-gentle">
        <CardHeader>
          <CardTitle className="text-lg">Expense Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Budget vs Actual Bar Chart */}
      <Card className="shadow-gentle">
        <CardHeader>
          <CardTitle className="text-lg">Budget vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="budget" fill="hsl(var(--muted))" name="Budget" />
              <Bar dataKey="spent" fill="hsl(var(--primary))" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Historical Trend Line Chart */}
      {historicalData.length > 0 && (
        <Card className="shadow-gentle lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="blessings" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={3}
                  name="Heaven's Blessings"
                />
                <Line 
                  type="monotone" 
                  dataKey="spent" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  name="Total Spent"
                />
                <Line 
                  type="monotone" 
                  dataKey="baskets" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={3}
                  name="12 Baskets"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}