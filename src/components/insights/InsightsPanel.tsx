import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInsights, useGenerateInsights } from '@/hooks/useInsights';
import { useFamilyContext } from '@/contexts/FamilyContext';
import { Brain, TrendingUp, PiggyBank, Target, DollarSign, Lightbulb, RefreshCw } from 'lucide-react';

const getInsightIcon = (type: string) => {
  switch (type) {
    case 'budgeting':
      return <Target className="h-4 w-4" />;
    case 'spending':
      return <DollarSign className="h-4 w-4" />;
    case 'savings':
      return <PiggyBank className="h-4 w-4" />;
    case 'investment':
      return <TrendingUp className="h-4 w-4" />;
    default:
      return <Lightbulb className="h-4 w-4" />;
  }
};

const getConfidenceColor = (score: number) => {
  if (score >= 0.8) return 'text-green-600';
  if (score >= 0.6) return 'text-yellow-600';
  return 'text-red-600';
};

export const InsightsPanel = () => {
  const { selectedFamilyId, contextType } = useFamilyContext();
  const { data: insights = [], isLoading } = useInsights(selectedFamilyId);
  const generateInsights = useGenerateInsights();
  const [activeTab, setActiveTab] = useState('all');

  const handleGenerateInsights = () => {
    generateInsights.mutate({
      familyId: contextType === 'family' ? selectedFamilyId || undefined : undefined,
      analysisType: 'comprehensive'
    });
  };

  const filteredInsights = activeTab === 'all' 
    ? insights 
    : insights.filter(insight => insight.type === activeTab);

  const insightsByType = {
    budgeting: insights.filter(i => i.type === 'budgeting').length,
    spending: insights.filter(i => i.type === 'spending').length,
    savings: insights.filter(i => i.type === 'savings').length,
    investment: insights.filter(i => i.type === 'investment').length,
  };

  if (isLoading) {
    return <div>Loading insights...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Financial Intelligence</h2>
        </div>
        <Button 
          onClick={handleGenerateInsights}
          disabled={generateInsights.isPending}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${generateInsights.isPending ? 'animate-spin' : ''}`} />
          {generateInsights.isPending ? 'Analyzing...' : 'Generate Insights'}
        </Button>
      </div>

      {insights.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Brain className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Insights Available</h3>
            <p className="text-muted-foreground mb-4">
              Generate AI-powered financial insights based on your spending patterns and financial data.
            </p>
            <Button onClick={handleGenerateInsights} disabled={generateInsights.isPending}>
              <Brain className="h-4 w-4 mr-2" />
              Generate Your First Insights
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Budgeting</span>
                </div>
                <p className="text-2xl font-bold">{insightsByType.budgeting}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Spending</span>
                </div>
                <p className="text-2xl font-bold">{insightsByType.spending}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <PiggyBank className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Savings</span>
                </div>
                <p className="text-2xl font-bold">{insightsByType.savings}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Investment</span>
                </div>
                <p className="text-2xl font-bold">{insightsByType.investment}</p>
              </CardContent>
            </Card>
          </div>

          {/* Insights Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Insights</TabsTrigger>
              <TabsTrigger value="budgeting">Budgeting</TabsTrigger>
              <TabsTrigger value="spending">Spending</TabsTrigger>
              <TabsTrigger value="savings">Savings</TabsTrigger>
              <TabsTrigger value="investment">Investment</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredInsights.map((insight) => (
                <Card key={insight.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getInsightIcon(insight.type)}
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        <Badge variant="outline" className="capitalize">
                          {insight.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Confidence:</span>
                        <span className={`text-sm font-medium ${getConfidenceColor(insight.confidence_score)}`}>
                          {(insight.confidence_score * 100).toFixed(0)}%
                        </span>
                        <Progress 
                          value={insight.confidence_score * 100} 
                          className="w-16 h-2"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {insight.description}
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Recommendations:</h4>
                      <ul className="space-y-1">
                        {insight.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-primary mt-1">•</span>
                            <span>{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                      <p>
                        Analysis period: {new Date(insight.data_period_start).toLocaleDateString()} - {new Date(insight.data_period_end).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};