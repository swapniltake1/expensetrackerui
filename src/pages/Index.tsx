import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Shield, Brain } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: DollarSign,
      title: 'Expense Tracking',
      description: 'Track every expense with detailed categorization and filtering options.'
    },
    {
      icon: TrendingUp,
      title: 'Budget Management', 
      description: 'Set monthly budgets and monitor your spending progress in real-time.'
    },
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Get personalized recommendations and spending insights powered by AI.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and stored securely with enterprise-grade protection.'
    }
  ];

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="p-6">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg glow-primary">
              <DollarSign className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ExpenseTracker</span>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')}
              className="hover:bg-white/10"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => navigate('/register')}
              className="btn-gradient-primary"
            >
              Get Started
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Take Control of Your Finances
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The intelligent expense tracker that helps you understand your spending, 
            set smarter budgets, and achieve your financial goals with AI-powered insights.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="btn-gradient-primary text-lg px-8 py-6"
            >
              Start Tracking Free
            </Button>
            <Button
              size="lg" 
              variant="outline"
              onClick={() => navigate('/login')}
              className="text-lg px-8 py-6 hover:bg-white/10"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="finance-card glow-card">
                <CardHeader>
                  <div className="p-3 bg-gradient-primary rounded-lg w-fit glow-primary">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <Card className="finance-card glow-card text-center p-8">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to transform your finances?</CardTitle>
            <CardDescription className="text-lg">
              Join thousands of users who've taken control of their spending with ExpenseTracker.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="btn-gradient-primary text-lg px-8 py-6"
            >
              Get Started Today
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
