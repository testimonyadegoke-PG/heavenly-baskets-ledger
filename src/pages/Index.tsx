import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { 
  TrendingUp, 
  Users, 
  Brain, 
  Filter, 
  Moon, 
  Sun, 
  Menu, 
  X,
  ArrowRight,
  Check,
  ChevronRight,
  Sparkles,
  Target,
  BarChart3,
  Bell,
  Shield,
  Zap
} from 'lucide-react';
import { useTheme } from 'next-themes';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (user) {
      navigate('/dashboard');
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user, navigate]);

  const features = [
    {
      icon: Target,
      title: 'Budget vs Actual Tracking',
      description: 'Real-time alerts when you exceed budgets. Stay in control with instant notifications.',
      color: 'text-primary'
    },
    {
      icon: Users,
      title: 'Shared Family Budgets',
      description: 'Manage finances together while maintaining individual control and privacy.',
      color: 'text-accent'
    },
    {
      icon: Brain,
      title: 'Smart Insights & AI Tips',
      description: 'Get AI-driven financial recommendations based on your spending patterns.',
      color: 'text-success'
    },
    {
      icon: Filter,
      title: 'Dynamic Reports',
      description: 'Filter by date range, quarter, or year. Visualize trends with beautiful charts.',
      color: 'text-warning'
    },
    {
      icon: Sparkles,
      title: 'Premium Design',
      description: 'Modern, mobile-first interface with smooth light/dark mode transitions.',
      color: 'text-primary'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Stay informed about spending alerts, invitations, and budget updates.',
      color: 'text-destructive'
    }
  ];

  const steps = [
    { number: 1, title: 'Sign Up & Invite', description: 'Create your account and invite family members' },
    { number: 2, title: 'Add Income & Budgets', description: 'Set up your financial goals and categories' },
    { number: 3, title: 'Track & Improve', description: 'Monitor spending and optimize together' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Parent of 3',
      content: 'This app transformed how our family handles money. The shared budgets keep everyone accountable!',
      avatar: '👩'
    },
    {
      name: 'Michael Chen',
      role: 'Financial Advisor',
      content: 'The AI insights are incredibly accurate. My clients love the real-time budget tracking features.',
      avatar: '👨'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Small Business Owner',
      content: 'Perfect for both personal and family finances. The interface is beautiful and intuitive.',
      avatar: '👩‍💼'
    }
  ];

  const pricing = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      features: ['1 Family', 'Basic Categories', 'Monthly Reports', 'Email Support'],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Family',
      price: '$9.99',
      description: 'Most popular for families',
      features: ['Unlimited Families', 'Custom Categories', 'AI Insights', 'Priority Support', 'Advanced Reports', 'Export Data'],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Premium',
      price: '$19.99',
      description: 'For power users',
      features: ['Everything in Family', 'Financial Coaching', 'Custom Integrations', '24/7 Phone Support', 'Dedicated Account Manager'],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-lg border-b' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl">💰</div>
            <span className="font-bold text-xl">Family Blessings</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm hover:text-primary transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm hover:text-primary transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm hover:text-primary transition-colors">Testimonials</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hidden md:flex"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button onClick={() => navigate('/auth')} className="hidden md:flex">
              Get Started Free
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur-lg">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm hover:text-primary transition-colors">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-sm hover:text-primary transition-colors">How It Works</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-sm hover:text-primary transition-colors">Pricing</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-sm hover:text-primary transition-colors">Testimonials</a>
              <Button onClick={() => navigate('/auth')} className="w-full">Get Started Free</Button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <Badge className="mx-auto" variant="secondary">
            <Sparkles className="h-3 w-3 mr-1" />
            Faith-Based Family Finance Tracker
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Take Control of Your Family Finances with{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Ease
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track budgets, expenses, and income while sharing financial records across your family—all in one beautiful app.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')} className="gap-2 hover-scale">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
              See How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">Powerful Features</h2>
            <p className="text-xl text-muted-foreground">Everything you need to manage family finances</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="hover-scale border-2 transition-all duration-300 hover:shadow-elevated"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">How It Works</h2>
            <p className="text-xl text-muted-foreground">Get started in 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="hover-scale h-full">
                  <CardContent className="p-6 space-y-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-muted-foreground h-8 w-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">What Our Users Say</h2>
            <p className="text-xl text-muted-foreground">Join thousands of happy families</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-scale">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">Simple Pricing</h2>
            <p className="text-xl text-muted-foreground">Choose the plan that fits your family</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pricing.map((plan, index) => (
              <Card 
                key={index} 
                className={`hover-scale ${plan.popular ? 'border-primary border-2 shadow-elevated' : ''} relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-primary to-accent">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm">{plan.description}</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => navigate('/auth')}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">
            Start Managing Your Family Finances Smarter Today
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of families who trust us with their financial journey
          </p>
          <Button size="lg" onClick={() => navigate('/auth')} className="gap-2 hover-scale">
            Create Your Free Account
            <Zap className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t mt-20">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="text-2xl">💰</div>
              <span className="font-bold">Family Blessings</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Faith-based family expense tracking made simple and beautiful.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          © 2025 Family Blessings. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
