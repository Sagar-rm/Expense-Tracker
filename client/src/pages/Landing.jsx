import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    TrendingUp,
    ShieldCheck,
    Zap,
    PieChart,
    ArrowRight,
    BrainCircuit,
    ChevronRight,
    Wallet,
    Activity,
    Layers,
    Menu,
    X
} from 'lucide-react';

const Landing = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'How it Works', href: '#how-it-works' },
        { name: 'Security', href: '#security' },
    ];

    return (
        <div className="min-h-screen bg-[#0a0b0f] text-[#e8eaf0] overflow-hidden selection:bg-primary/30">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center glow-primary transition-transform group-hover:scale-110">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight font-display gradient-text">FinTrack AI</span>
                    </div>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
                        {navLinks.map((link) => (
                            <a key={link.name} href={link.href} className="hover:text-primary transition-colors">
                                {link.name}
                            </a>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/login" className="px-5 py-2 text-sm font-medium hover:text-primary transition-colors">
                            Log in
                        </Link>
                        <Link to="/register" className="btn-primary flex items-center gap-2">
                            Get Started <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 text-text-primary hover:text-primary transition-colors"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={`md:hidden absolute top-20 left-0 w-full glass border-b border-white/5 transition-all duration-300 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
                    <div className="px-6 py-8 flex flex-col gap-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-lg font-medium text-text-secondary hover:text-primary transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                        <hr className="border-white/5" />
                        <div className="flex flex-col gap-4">
                            <Link to="/login" className="px-4 py-2 text-center text-lg font-medium text-text-secondary border border-white/10 rounded-xl">
                                Log in
                            </Link>
                            <Link to="/register" className="btn-primary text-center text-lg py-3 flex items-center justify-center gap-2">
                                Get Started <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 md:pt-48 md:pb-32 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse-glow" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] -z-10" />

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 animate-fade-in-up text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary uppercase tracking-wider animate-bounce-in">
                            <Zap className="w-3 h-3" /> Next-Gen Expense Tracking
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] font-display">
                            Master Your Money with <span className="gradient-text">Precision.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-xl mx-auto lg:mx-0">
                            FinTrack AI uses advanced machine learning to predict spending, detect trends, and automate your finances. Stop tracking, start optimizing.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/register" className="btn-primary text-lg !px-8 !py-4 flex items-center justify-center gap-3 glow-primary">
                                Start Your Journey <ChevronRight className="w-5 h-5" />
                            </Link>
                            <a href="#features" className="btn-secondary text-lg !px-8 !py-4 flex items-center justify-center gap-3">
                                See Features
                            </a>
                        </div>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-sm text-text-muted">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-success" /> End-to-end Encrypted
                            </div>
                            <div className="flex items-center gap-2">
                                <BrainCircuit className="w-5 h-5 text-accent" /> AI-Powered
                            </div>
                        </div>
                    </div>

                    <div className="relative animate-fade-in-up mt-12 lg:mt-0" style={{ animationDelay: '0.2s' }}>
                        <div className="relative z-10 glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl skew-y-1 transform hover:skew-y-0 transition-transform duration-700 max-w-md mx-auto lg:max-w-none">
                            <img
                                src="/hero-mockup.png"
                                alt="App Illustration"
                                className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity"
                            />
                        </div>

                        {/* Decors - Hide on small screens for better performance */}
                        <div className="hidden lg:block absolute -top-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse" />
                        <div className="hidden lg:block absolute -bottom-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-surface/50 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
                    <div>
                        <div className="text-3xl md:text-4xl font-bold font-display gradient-text mb-2 animate-fade-in">99%</div>
                        <div className="text-xs md:text-sm text-text-muted uppercase tracking-widest">Accuracy</div>
                    </div>
                    <div>
                        <div className="text-3xl md:text-4xl font-bold font-display gradient-text mb-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>10k+</div>
                        <div className="text-xs md:text-sm text-text-muted uppercase tracking-widest">Users</div>
                    </div>
                    <div>
                        <div className="text-3xl md:text-4xl font-bold font-display gradient-text mb-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>$2M+</div>
                        <div className="text-xs md:text-sm text-text-muted uppercase tracking-widest">Saved Yearly</div>
                    </div>
                    <div>
                        <div className="text-3xl md:text-4xl font-bold font-display gradient-text mb-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>24/7</div>
                        <div className="text-xs md:text-sm text-text-muted uppercase tracking-widest">AI Monitoring</div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 md:py-32 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 md:mb-20 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold font-display">How <span className="gradient-text">FinTrack AI</span> Works</h2>
                        <p className="text-text-secondary max-w-2xl mx-auto">Three simple steps to total financial clarity.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-16 md:gap-12 relative">
                        {/* Connecting Line - Hide on mobile */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 -translate-y-1/2 -z-10" />

                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-16 h-16 bg-surface rounded-full border-2 border-primary flex items-center justify-center text-2xl font-bold text-primary glow-primary relative z-10 transition-transform hover:scale-110">1</div>
                            <h3 className="text-xl font-bold font-display text-text-primary">Create Your Account</h3>
                            <p className="text-text-secondary max-w-xs">Join in seconds. Our encrypted onboarding ensures your data starts safe and stays safe.</p>
                        </div>

                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-16 h-16 bg-surface rounded-full border-2 border-secondary flex items-center justify-center text-2xl font-bold text-secondary relative z-10 transition-transform hover:scale-110">2</div>
                            <h3 className="text-xl font-bold font-display text-text-primary">Log Your Expenses</h3>
                            <p className="text-text-secondary max-w-xs">Add spending via our beautiful interface. Our AI automatically classifies every transaction instantly.</p>
                        </div>

                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-16 h-16 bg-surface rounded-full border-2 border-accent flex items-center justify-center text-2xl font-bold text-accent relative z-10 transition-transform hover:scale-110">3</div>
                            <h3 className="text-xl font-bold font-display text-text-primary">Get AI Insights</h3>
                            <p className="text-text-secondary max-w-xs">Watch as ML models predict your future spending and alert you to potential budget risks.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 md:py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 md:mb-20 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold font-display">Smarter Features for <span className="gradient-text">Serious</span> Wealth</h2>
                        <p className="text-text-secondary max-w-2xl mx-auto">Everything you need to manage your personal economy in one beautiful, high-performance interface.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Feature 1 */}
                        <div className="card group">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <BrainCircuit className="w-7 h-7 text-primary group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-display">AI Auto-Categorization</h3>
                            <p className="text-text-secondary leading-relaxed">
                                Our proprietary ML model automatically categorizes your expenses. Swiggy? Food. Uber? Transport. No more manual sorting.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="card group">
                            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                                <TrendingUp className="w-7 h-7 text-accent group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-display">Predictive Insights</h3>
                            <p className="text-text-secondary leading-relaxed">
                                Know where your money is going before it's gone. Linear regression models predict next month's spending with high accuracy.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="card group">
                            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                                <Activity className="w-7 h-7 text-secondary group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-display">Risk Alert System</h3>
                            <p className="text-text-secondary leading-relaxed">
                                Receive real-time notifications if your spending patterns deviate from the norm. Stay ahead of potential budget overflows.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="card group">
                            <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-success group-hover:text-white transition-all duration-300">
                                <PieChart className="w-7 h-7 text-success group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-display">Advanced Analytics</h3>
                            <p className="text-text-secondary leading-relaxed">
                                Beautiful, interactive charts powered by Recharts. Visualize trends, category breakdowns, and monthly growth at a glance.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="card group">
                            <div className="w-14 h-14 bg-warning/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-warning group-hover:text-white transition-all duration-300">
                                <Layers className="w-7 h-7 text-warning group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-display">Unified Dashboard</h3>
                            <p className="text-text-secondary leading-relaxed">
                                A single control center for your entire financial life. Glassmorphic design that looks as good as it performs.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div id="security" className="card group">
                            <div className="w-14 h-14 bg-info/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-info group-hover:text-white transition-all duration-300">
                                <ShieldCheck className="w-7 h-7 text-info group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-display">Privacy First</h3>
                            <p className="text-text-secondary leading-relaxed">
                                Your financial data is yours alone. We use JWT authentication and bcrypt hashing to keep your records secure.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 md:py-32 px-6">
                <div className="max-w-5xl mx-auto glass rounded-[32px] p-8 md:p-20 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/10 rounded-full blur-[100px] -z-10" />

                    <h2 className="text-3xl md:text-5xl font-bold font-display mb-8">Ready to transform your <span className="gradient-text">relationship</span> with money?</h2>
                    <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-2xl mx-auto">
                        Join thousands of smart spenders using FinTrack AI to build their financial future today.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link to="/register" className="btn-primary !px-10 !py-4 text-lg md:text-xl glow-primary w-full sm:w-auto">
                            Get Started for Free
                        </Link>
                        <Link to="/login" className="btn-secondary !px-10 !py-4 text-lg md:text-xl w-full sm:w-auto">
                            Sign In
                        </Link>
                    </div>

                    <p className="mt-8 text-sm text-text-muted">No credit card required. Cancel anytime.</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12 md:gap-8">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                                <Wallet className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold font-display">FinTrack AI</span>
                        </div>
                        <p className="text-sm text-text-secondary">Master your money with precision.</p>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-6 md:gap-4">
                        <div className="flex gap-8 text-sm text-text-muted">
                            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
                            <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
                            <a href="#" className="hover:text-primary transition-colors">GitHub</a>
                        </div>
                        <div className="text-sm text-text-muted flex flex-col items-center md:items-end gap-1">
                            <span>© 2026 FinTrack AI. All rights reserved.</span>
                            <span className="flex items-center gap-1.5 pt-2 text-center md:text-right">
                                Created with <span className="text-danger">❤</span> by <span className="text-primary font-semibold hover:underline cursor-pointer">Sagar-rm</span>
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;

