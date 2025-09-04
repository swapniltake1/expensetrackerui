import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, TrendingDown, AlertCircle, Lightbulb, RefreshCw, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { authAPI } from '@/lib/auth';
import axios from 'axios';

interface SpendingTrend {
  category: string;
  trend: 'increase' | 'decrease';
  percentage: number;
  insight: string;
}

interface Recommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface BudgetAlert {
  message: string;
  severity: 'warning' | 'alert';
}

interface SavingOpportunity {
  category: string;
  potential: number;
  suggestion: string;
}

interface AIInsightsData {
  spendingTrends: SpendingTrend[];
  recommendations: Recommendation[];
  budgetAlerts: BudgetAlert[];
  savingOpportunities: SavingOpportunity[];
}

const AIInsights: React.FC = () => {
  const [data, setData] = useState<AIInsightsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [userId, setUserId] = useState<number | null>(null);

  // Fetch logged-in user info
  const fetchUser = async () => {
    try {
      const user = await authAPI.getProfile();
      setUserId(user.id);
    } catch (error) {
      console.error('Failed to fetch logged-in user:', error);
    }
  };

  const refreshInsights = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await axios.get<AIInsightsData>(
        `http://localhost:8080/api/ai/test/insights/${userId}`
      );
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch AI insights:', error);
      setData(null);
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) refreshInsights();
  }, [userId]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted';
    }
  };

  const getSeverityIcon = (severity: string) => severity === 'alert' ? AlertCircle : TrendingUp;
  const getSeverityColor = (severity: string) => severity === 'alert' ? 'text-destructive' : 'text-warning';

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" /> AI Insights
          </h1>
          <p className="text-muted-foreground">Personalized financial insights powered by AI</p>
        </div>
        <Button onClick={refreshInsights} disabled={loading} variant="outline" className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Insights
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleString()}</div>

      {/* Budget Alerts */}
      {data?.budgetAlerts?.length ? (
        <Card className="finance-card border-warning/20 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertCircle className="h-5 w-5" /> Budget Alerts
            </CardTitle>
            <CardDescription>Important notifications about your spending</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.budgetAlerts.map((alert, idx) => {
              const Icon = getSeverityIcon(alert.severity);
              return (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                  <Icon className={`h-5 w-5 ${getSeverityColor(alert.severity)}`} />
                  <span className="text-sm">{alert.message}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ) : null}

      {/* Spending Trends */}
      {data?.spendingTrends?.length ? (
        <Card className="finance-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" /> Spending Trends
            </CardTitle>
            <CardDescription>AI-detected patterns in your spending behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.spendingTrends.map((trend, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-lg bg-muted/50">
                <div className={`p-2 rounded-full ${trend.trend === 'increase' ? 'bg-destructive/10' : 'bg-success/10'}`}>
                  {trend.trend === 'increase' ? (
                    <TrendingUp className="h-4 w-4 text-destructive" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-success" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{trend.category}</span>
                    <Badge variant="outline" className={trend.trend === 'increase' ? 'border-destructive/20 text-destructive' : 'border-success/20 text-success'}>
                      {trend.trend === 'increase' ? '+' : '-'}{trend.percentage}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{trend.insight}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recommendations */}
        {data?.recommendations?.length ? (
          <Card className="finance-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" /> Smart Recommendations
              </CardTitle>
              <CardDescription>AI-generated suggestions to optimize your spending</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading recommendations...</p>
              ) : (
                data.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-4 rounded-lg border bg-card/50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm">{rec.title}</span>
                      <Badge className={getPriorityColor(rec.priority)}>{rec.priority}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{rec.description}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ) : null}

        {/* Saving Opportunities */}
        {data?.savingOpportunities?.length ? (
          <Card className="finance-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" /> Saving Opportunities
              </CardTitle>
              <CardDescription>Potential monthly savings identified by AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.savingOpportunities.map((saving, idx) => (
                <div key={idx} className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 rounded-lg bg-success/5 border border-success/20">
                  <div>
                    <div className="font-semibold text-sm text-success">${saving.potential}/month</div>
                    <div className="text-xs text-muted-foreground">{saving.category}</div>
                  </div>
                  <div className="text-xs text-muted-foreground max-w-40 mt-2 md:mt-0">{saving.suggestion}</div>
                </div>
              ))}
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Potential Savings:</span>
                  <span className="font-bold text-success text-lg">
                    ${data.savingOpportunities.reduce((sum, s) => sum + s.potential, 0)}/month
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default AIInsights;
