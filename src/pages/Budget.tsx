import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Target, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { budgetAPI, expenseAPI, Budget } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const BudgetPage: React.FC = () => {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);

  const currentMonth = format(new Date(), 'yyyy-MM');
  const currentMonthName = format(new Date(), 'MMMM yyyy');

  const loadBudgetData = async () => {
    try {
      setLoading(true);
      
      // Load budget for current month
      try {
        const budgetData = await budgetAPI.get(currentMonth);
        setBudget(budgetData);
        setNewBudgetAmount(budgetData.amount.toString());
      } catch (error) {
        // Budget not set for this month
        setBudget(null);
        setNewBudgetAmount('');
      }

      // Load expenses for current month
      const startOfMonth = `${currentMonth}-01`;
      const endOfMonth = format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd');
      
      const expenses = await expenseAPI.getAll({
        start: startOfMonth,
        end: endOfMonth,
      });

      const total = expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);
      setMonthlyExpenses(total);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load budget data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgetData();
  }, []);

  const handleSaveBudget = async () => {
    const amount = parseFloat(newBudgetAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid budget amount",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      await budgetAPI.set({ month: currentMonth, amount });
      
      toast({
        title: "Success",
        description: "Budget updated successfully",
      });
      
      loadBudgetData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update budget",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const progressPercentage = budget ? Math.min((monthlyExpenses / budget.amount) * 100, 100) : 0;
  const remainingBudget = budget ? budget.amount - monthlyExpenses : 0;
  const isOverBudget = budget && monthlyExpenses > budget.amount;

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budget Management</h1>
        <p className="text-muted-foreground">
          Set and track your monthly budget for {currentMonthName}
        </p>
      </div>

      {/* Budget Setup */}
      <Card className="finance-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Monthly Budget
          </CardTitle>
          <CardDescription>
            Set your spending limit for {currentMonthName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="budget-amount">Budget Amount ($)</Label>
              <Input
                id="budget-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter your monthly budget"
                value={newBudgetAmount}
                onChange={(e) => setNewBudgetAmount(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleSaveBudget}
                disabled={saving || !newBudgetAmount}
                className="btn-gradient-primary"
              >
                {saving ? 'Saving...' : 'Set Budget'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Overview */}
      {budget && (
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="finance-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Amount</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${budget.amount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Monthly budget limit</p>
            </CardContent>
          </Card>

          <Card className="finance-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Spent This Month</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isOverBudget ? 'text-destructive' : ''}`}>
                ${monthlyExpenses.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {progressPercentage.toFixed(1)}% of budget used
              </p>
            </CardContent>
          </Card>

          <Card className="finance-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isOverBudget ? 'Over Budget' : 'Remaining'}
              </CardTitle>
              {isOverBudget ? (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              ) : (
                <TrendingUp className="h-4 w-4 text-success" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isOverBudget ? 'text-destructive' : 'text-success'}`}>
                ${Math.abs(remainingBudget).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {isOverBudget ? 'Amount over budget' : 'Left to spend'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Budget Progress */}
      {budget && (
        <Card className="finance-card">
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
            <CardDescription>
              Your spending progress for {currentMonthName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{progressPercentage.toFixed(1)}%</span>
              </div>
              <Progress 
                value={progressPercentage} 
                className={`w-full ${isOverBudget ? 'bg-destructive/20' : ''}`}
              />
            </div>
            
            {isOverBudget && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-semibold">Budget Exceeded</span>
                </div>
                <p className="text-sm text-destructive/80 mt-1">
                  You've spent ${(monthlyExpenses - budget.amount).toFixed(2)} more than your budget this month.
                </p>
              </div>
            )}

            {!isOverBudget && remainingBudget > 0 && (
              <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-success">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-semibold">On Track</span>
                </div>
                <p className="text-sm text-success/80 mt-1">
                  You have ${remainingBudget.toFixed(2)} remaining in your budget this month.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BudgetPage;