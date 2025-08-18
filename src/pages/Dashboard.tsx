import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Target } from 'lucide-react';
import ExpenseTrendChart from '@/components/charts/ExpenseTrendChart';
import CategoryPieChart from '@/components/charts/CategoryPieChart';
import { expenseAPI, budgetAPI } from '@/lib/api';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalExpenses: 0,
    monthlyExpenses: 0,
    budgetProgress: 0,
    expenseChange: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const currentMonth = format(new Date(), 'yyyy-MM');
        const startOfMonth = `${currentMonth}-01`;
        const endOfMonth = format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd');

        // Get current month expenses
        const monthlyExpenses = await expenseAPI.getAll({
          start: startOfMonth,
          end: endOfMonth,
        });

        // Get all expenses for total
        const allExpenses = await expenseAPI.getAll();

        // Get budget for current month
        let budget = null;
        try {
          budget = await budgetAPI.get(currentMonth);
        } catch (error) {
          // Budget not set
        }

        const monthlyTotal = monthlyExpenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);
        const totalAmount = allExpenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);
        
        setStats({
          totalExpenses: totalAmount,
          monthlyExpenses: monthlyTotal,
          budgetProgress: budget ? (monthlyTotal / budget.amount) * 100 : 0,
          expenseChange: 12.5, // Mock data - would calculate from previous month
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, description }: any) => (
    <Card className="finance-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${value.toLocaleString()}</div>
        {trend && (
          <p className={`text-xs flex items-center gap-1 ${trend === 'up' ? 'text-destructive' : 'text-success'}`}>
            {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trendValue}% from last month
          </p>
        )}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );

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
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your financial activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Expenses"
          value={stats.totalExpenses}
          icon={DollarSign}
          trend="up"
          trendValue={stats.expenseChange}
        />
        <StatCard
          title="This Month"
          value={stats.monthlyExpenses}
          icon={TrendingUp}
          description="Current month spending"
        />
        <StatCard
          title="Budget Progress"
          value={stats.budgetProgress}
          icon={Target}
          description={`${Math.round(stats.budgetProgress)}% of monthly budget used`}
        />
        <StatCard
          title="Avg. Daily"
          value={Math.round(stats.monthlyExpenses / new Date().getDate())}
          icon={DollarSign}
          description="Average daily spending this month"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="finance-card">
          <CardHeader>
            <CardTitle>Expense Trend</CardTitle>
            <CardDescription>Your spending over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseTrendChart />
          </CardContent>
        </Card>

        <Card className="finance-card">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Breakdown of your expenses by category</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryPieChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;