import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Sparkles, BarChart3, Shield, Bell, ArrowRight, Sun, Moon, TrendingUp, Calendar, Smartphone, Star } from 'lucide-react';

const useDarkMode = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return { isDark, setIsDark };
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
    {children}
  </a>
);

const Landing = () => {
  const { isDark, setIsDark } = useDarkMode();
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTestimonialIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Family Expenses App</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#how">How It Works</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#testimonials">Testimonials</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </nav>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sun className="h-4 w-4" />
              <Switch checked={isDark} onCheckedChange={setIsDark} />
              <Moon className="h-4 w-4" />
            </div>
            <Link to="/auth">
              <Button>Get Started Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="grid md:grid-cols-2 items-center gap-10">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Take Control of Your Family Finances with Ease
              </h1>
              <p className="text-lg text-muted-foreground">
                Track budgets, expenses, and income while sharing financial records across your family—all in one app.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/auth">
                  <Button size="lg" className="group">
                    Get Started Free
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
                <a href="#how">
                  <Button size="lg" variant="outline">See How It Works</Button>
                </a>
              </div>
              <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Shield className="h-4 w-4" /> Secure & Private</div>
                <div className="flex items-center gap-2"><Smartphone className="h-4 w-4" /> Mobile-First</div>
                <div className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> AI Insights</div>
              </div>
            </div>
            <div className="relative">
              <div className="relative mx-auto w-full max-w-md rotate-0 md:rotate-[-2deg] transition-all">
                <div className="rounded-2xl border bg-card shadow-xl overflow-hidden">
                  <div className="p-4 border-b flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">Dashboard Overview</div>
                      <Badge variant="secondary">Family</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <Card className="hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="text-xs text-muted-foreground">Budget Used</div>
                          <div className="text-2xl font-bold">62%</div>
                        </CardContent>
                      </Card>
                      <Card className="hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="text-xs text-muted-foreground">Income</div>
                          <div className="text-2xl font-bold">$8,450</div>
                        </CardContent>
                      </Card>
                      <Card className="hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="text-xs text-muted-foreground">Expenses</div>
                          <div className="text-2xl font-bold">$5,230</div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Card className="hover:shadow-md transition-all">
                        <CardContent className="p-4 flex items-center gap-3">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          <div>
                            <div className="text-sm font-medium">Smart Tips</div>
                            <div className="text-xs text-muted-foreground">Reduce dining out by 10% to save $120/mo</div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="hover:shadow-md transition-all">
                        <CardContent className="p-4 flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <div className="text-sm font-medium">Monthly Snapshot</div>
                            <div className="text-xs text-muted-foreground">On track for this quarter</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything You Need to Succeed</h2>
          <p className="text-muted-foreground mt-2">Powerful tools with a delightful, modern experience.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="group hover:shadow-lg transition-all">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  {f.icon}
                </div>
                <CardTitle className="text-xl">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{f.desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How It Works</h2>
          <p className="text-muted-foreground mt-2">Get up and running in minutes.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {howItWorks.map((step, idx) => (
            <Card key={idx} className="relative overflow-hidden hover:shadow-lg transition-all">
              <span className="absolute -top-4 -left-4 h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">{idx + 1}</span>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  {step.icon} {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{step.desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="container mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Loved by Families Everywhere</h2>
          <p className="text-muted-foreground mt-2">Real stories from households improving finances together.</p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Card className="overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < testimonials[testimonialIndex].rating ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                ))}
              </div>
              <blockquote className="text-xl leading-relaxed">“{testimonials[testimonialIndex].quote}”</blockquote>
              <div className="mt-4 text-sm text-muted-foreground">— {testimonials[testimonialIndex].author}</div>
              <div className="mt-6 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">Swipe or wait to see more</div>
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Go to testimonial ${i + 1}`}
                      className={`h-2 w-2 rounded-full transition-colors ${i === testimonialIndex ? 'bg-primary' : 'bg-muted'}`}
                      onClick={() => setTestimonialIndex(i)}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground mt-2">Start free. Upgrade anytime.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {pricing.map((p) => (
            <Card key={p.name} className={`hover:shadow-lg transition-all ${p.popular ? 'border-primary/40' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{p.name}</CardTitle>
                  {p.popular && <Badge>Most Popular</Badge>}
                </div>
                <div className="text-3xl font-extrabold mt-2">{p.price}</div>
                <div className="text-sm text-muted-foreground">{p.caption}</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/auth">
                  <Button className="w-full">Choose {p.name}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-grid-slate-200/40 dark:bg-grid-slate-700/20" />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Start Managing Your Family Finances Smarter Today</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Join thousands of families building better habits with clarity, collaboration, and modern tools.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link to="/auth">
              <Button size="lg">Create Your Free Account</Button>
            </Link>
            <a href="#pricing">
              <Button size="lg" variant="outline">See Pricing</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t">
        <div className="container mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <span className="text-lg font-semibold">Family Expenses App</span>
            </div>
            <p className="text-sm text-muted-foreground">Built for families who value clarity, collaboration, and stewardship.</p>
          </div>

          <div>
            <div className="font-semibold mb-3">Resources</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a className="hover:underline" href="#">About</a></li>
              <li><a className="hover:underline" href="#">Blog</a></li>
              <li><a className="hover:underline" href="#">Privacy Policy</a></li>
              <li><a className="hover:underline" href="#">Terms</a></li>
              <li><a className="hover:underline" href="#">Support</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="font-semibold mb-3">Subscribe to our newsletter</div>
            <p className="text-sm text-muted-foreground mb-3">Get tips, product updates, and financial insights.</p>
            <form className="flex gap-2 max-w-md" onSubmit={(e) => e.preventDefault()}>
              <Input type="email" placeholder="Enter your email" required />
              <Button type="submit">Subscribe</Button>
            </form>
            <div className="mt-4 text-xs text-muted-foreground">We care about your data in our <a href="#" className="underline">privacy policy</a>.</div>
          </div>
        </div>
        <div className="border-t py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Family Expenses App. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    title: 'Budget vs Actual Tracking',
    desc: 'See real-time progress and get alerts when you’re over or under budget.',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: 'Shared Family Budgets',
    desc: 'Manage together while keeping individual control and privacy where needed.',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Smart Insights & Recommendations',
    desc: 'AI-driven tips to optimize your spending and savings strategies.',
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: 'Dynamic Filtering & Reports',
    desc: 'Filter by month, quarter, and year. Export and share insights with ease.',
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: 'Premium Design & Experience',
    desc: 'Polished, modern UI with mobile-first design and beautiful dark mode.',
    icon: <Smartphone className="h-5 w-5" />,
  },
  {
    title: 'Notifications & Alerts',
    desc: 'Stay informed about spending, overspending, or new invitations.',
    icon: <Bell className="h-5 w-5" />,
  },
];

const howItWorks = [
  {
    title: 'Sign up & Invite Family',
    desc: 'Create your account and invite family members to collaborate.',
    icon: <Users className="h-5 w-5 text-primary" />,
  },
  {
    title: 'Add Income & Budgets',
    desc: 'Set monthly income, create budgets, and assign categories.',
    icon: <BarChart3 className="h-5 w-5 text-primary" />,
  },
  {
    title: 'Track, Adjust, and Improve Together',
    desc: 'Monitor progress, make adjustments, and celebrate wins.',
    icon: <Sparkles className="h-5 w-5 text-primary" />,
  },
];

const testimonials = [
  { author: 'Amaka & Tunde, Lagos', rating: 5, quote: 'Our budgeting is finally in sync. This app made it so easy to plan and stick to our goals.' },
  { author: 'The Johnsons, London', rating: 5, quote: 'Beautiful design, powerful features. We love the shared budgets and alerts.' },
  { author: 'Chinwe, Abuja', rating: 4, quote: 'The insights helped me cut down on wasteful spending without stress.' },
];

const pricing = [
  {
    name: 'Free',
    price: '$0',
    caption: 'For individuals getting started',
    features: ['1 user', 'Unlimited categories', 'Basic insights', 'Email support'],
    popular: false,
  },
  {
    name: 'Family',
    price: '$8/mo',
    caption: 'For families collaborating together',
    features: ['Up to 5 users', 'Shared budgets', 'Advanced insights', 'Priority support'],
    popular: true,
  },
  {
    name: 'Premium',
    price: '$15/mo',
    caption: 'For power users & larger families',
    features: ['Unlimited users', 'Export & reports', 'Custom alerts', 'Early access features'],
    popular: false,
  },
];

export default Landing;
