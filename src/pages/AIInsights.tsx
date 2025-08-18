import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, TrendingDown, AlertCircle, Lightbulb, RefreshCw, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock AI insights - in real app, this would come from an AI service
const mockInsights = {
  spendingTrends: [
    {
      category: 'Food',
      trend: 'increase',
      percentage: 15,
      insight: 'Your food expenses have increased by 15% this month. Consider meal planning to reduce costs.',
    },
    {
      category: 'Transportation',
      trend: 'decrease', 
      percentage: 8,
      insight: 'Great job! Your transportation costs decreased by 8%. Keep using public transport.',
    },
  ],
  recommendations: [
    {
      title: 'Set up automated savings',
      description: 'Based on your spending patterns, you could save $200/month by automating transfers to savings.',
      priority: 'high',
    },
    {
      title: 'Review subscription services',
      description: 'You have recurring charges totaling $89/month. Review and cancel unused subscriptions.',
      priority: 'medium',
    },
    {
      title: 'Optimize grocery shopping',
      description: 'Shopping at different stores could save you approximately $45/month on groceries.',
      priority: 'low',
    },
  ],
  budgetAlerts: [
    {
      message: 'You\'re 85% through your monthly food budget with 10 days left.',
      severity: 'warning',
    },
    {
      message: 'Entertainment spending is 120% over your typical monthly average.',
      severity: 'alert',
    },
  ],
  savingOpportunities: [
    {
      category: 'Subscriptions',
      potential: 45,
      suggestion: 'Cancel unused streaming services',
    },
    {
      category: 'Dining Out',
      potential: 120,
      suggestion: 'Cook at home 2 more days per week',
    },
    {
      category: 'Transportation',
      potential: 60,
      suggestion: 'Use carpool or public transport',
    },
  ],
};

const AIInsights: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refreshInsights = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setLastUpdated(new Date());
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted';
    }
  };

  const getSeverityIcon = (severity: string) => {
    return severity === 'alert' ? AlertCircle : TrendingUp;
  };

  const getSeverityColor = (severity: string) => {
    return severity === 'alert' ? 'text-destructive' : 'text-warning';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            AI Insights
          </h1>
          <p className="text-muted-foreground">
            Personalized financial insights powered by AI
          </p>
        </div>
        <Button
          onClick={refreshInsights}
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Insights
        </Button>
      </div>

      {/* Last Updated */}
      <div className="text-sm text-muted-foreground">
        Last updated: {lastUpdated.toLocaleString()}
      </div>

      {/* Budget Alerts */}
      {mockInsights.budgetAlerts.length > 0 && (
        <Card className="finance-card border-warning/20 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertCircle className="h-5 w-5" />
              Budget Alerts
            </CardTitle>
            <CardDescription>Important notifications about your spending</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockInsights.budgetAlerts.map((alert, index) => {
              const Icon = getSeverityIcon(alert.severity);
              return (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                  <Icon className={`h-5 w-5 ${getSeverityColor(alert.severity)}`} />
                  <span className="text-sm">{alert.message}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Spending Trends */}
      <Card className="finance-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Spending Trends
          </CardTitle>
          <CardDescription>AI-detected patterns in your spending behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockInsights.spendingTrends.map((trend, index) => (
            <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
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

      <div className="grid gap-6 md:grid-cols-2">
        {/* AI Recommendations */}
        <Card className="finance-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Smart Recommendations
            </CardTitle>
            <CardDescription>Personalized suggestions to improve your finances</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockInsights.recommendations.map((rec, index) => (
              <div key={index} className="p-4 rounded-lg border bg-card/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-sm">{rec.title}</span>
                  <Badge className={getPriorityColor(rec.priority)}>
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{rec.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Saving Opportunities */}
        <Card className="finance-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Saving Opportunities
            </CardTitle>
            <CardDescription>Potential monthly savings identified by AI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockInsights.savingOpportunities.map((saving, index) => (
              <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-success/5 border border-success/20">
                <div>
                  <div className="font-semibold text-sm text-success">${saving.potential}/month</div>
                  <div className="text-xs text-muted-foreground">{saving.category}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground max-w-40">{saving.suggestion}</div>
                </div>
              </div>
            ))}
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Potential Savings:</span>
                <span className="font-bold text-success text-lg">
                  ${mockInsights.savingOpportunities.reduce((sum, saving) => sum + saving.potential, 0)}/month
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIInsights;