import React, { useState } from 'react';
import { ArrowRight, MessageSquare, Zap, Globe, Server, Database, Shield, CheckCircle, Clock, Code, Rocket, Terminal, Sparkles, Play, Bot, Gauge, Lock } from 'lucide-react';
import { CyaphireLogo } from '../UI/CyaphireLogo';
import { LoginForm } from '../Auth/LoginForm';
import { SignupForm } from '../Auth/SignupForm';
import { OTPForm } from '../Auth/OTPForm';

type AuthStep = 'landing' | 'login' | 'signup' | 'otp';

interface LandingPageProps {
  onAuthSuccess: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onAuthSuccess }) => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('landing');
  const [signupEmail, setSignupEmail] = useState('');

  const handleSignupSuccess = (email: string) => {
    setSignupEmail(email);
    setCurrentStep('otp');
  };

  const handleOTPSuccess = () => {
    setCurrentStep('login');
  };

  const handleBackToLanding = () => {
    setCurrentStep('landing');
  };

  if (currentStep === 'login') {
    return (
      <div className="min-h-screen bg-bolt-dark-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={handleBackToLanding}
              className="text-bolt-dark-400 hover:text-bolt-accent-blue transition-colors duration-200 mb-4"
            >
              ← Back to Home
            </button>
            <CyaphireLogo size="lg" />
          </div>

          <LoginForm />

          <div className="text-center mt-6">
            <button
              onClick={() => setCurrentStep('signup')}
              className="text-bolt-dark-400 hover:text-bolt-accent-blue transition-colors duration-200"
            >
              Don't have an account? <span className="font-semibold text-bolt-accent-blue">Sign up</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'signup') {
    return (
      <div className="min-h-screen bg-bolt-dark-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={handleBackToLanding}
              className="text-bolt-dark-400 hover:text-bolt-accent-blue transition-colors duration-200 mb-4"
            >
              ← Back to Home
            </button>
            <CyaphireLogo size="lg" />
          </div>

          <SignupForm onSignupSuccess={handleSignupSuccess} />

          <div className="text-center mt-6">
            <button
              onClick={() => setCurrentStep('login')}
              className="text-bolt-dark-400 hover:text-bolt-accent-blue transition-colors duration-200"
            >
              Already have an account? <span className="font-semibold text-bolt-accent-blue">Sign in</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'otp') {
    return (
      <div className="min-h-screen bg-bolt-dark-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <OTPForm
            email={signupEmail}
            onVerifySuccess={handleOTPSuccess}
            onBack={() => setCurrentStep('signup')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Gradient Overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-blue-900/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-xl bg-black/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <CyaphireLogo size="sm" />
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentStep('login')}
                  className="px-4 py-2 text-bolt-dark-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setCurrentStep('signup')}
                  className="px-6 py-2 futuristic-btn text-white rounded-lg text-sm font-medium shadow-lg shadow-purple-900/50"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-6 py-24 md:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm mb-8 group hover:border-purple-500/50 transition-all duration-300">
                <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">AI-Powered Deployment Platform</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                  Deploy Applications
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Through Conversations
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-xl md:text-2xl text-bolt-dark-200 mb-12 leading-relaxed max-w-3xl mx-auto">
                Skip weeks of DevOps setup. Deploy full-stack applications with databases in under 3 minutes using natural language.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <button
                  onClick={() => setCurrentStep('signup')}
                  className="group px-8 py-4 futuristic-btn text-white rounded-lg text-lg font-semibold flex items-center space-x-3 shadow-2xl shadow-purple-900/50 hover:shadow-purple-700/50"
                >
                  <span>Start Deploying Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 border border-white/20 text-white rounded-lg text-lg font-medium hover:bg-white/5 transition-all duration-200 backdrop-blur-sm">
                  Watch Demo
                </button>
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
                <span className="text-bolt-dark-400">Supports:</span>
                {['React', 'Node.js', 'Python', 'Docker', 'PostgreSQL', 'MongoDB'].map((tech) => (
                  <span key={tech} className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-bolt-dark-300 backdrop-blur-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="px-6 py-12 border-y border-white/10 bg-white/[0.02] backdrop-blur-xl">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  &lt;3min
                </div>
                <div className="text-sm text-bolt-dark-400 font-medium">Deploy Time</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  99.9%
                </div>
                <div className="text-sm text-bolt-dark-400 font-medium">Uptime SLA</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  10K+
                </div>
                <div className="text-sm text-bolt-dark-400 font-medium">Apps Deployed</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  24/7
                </div>
                <div className="text-sm text-bolt-dark-400 font-medium">AI Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-6 py-24 md:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-bolt-dark-300 bg-clip-text text-transparent">
                  Three Steps to Production
                </span>
              </h2>
              <p className="text-xl text-bolt-dark-300 max-w-2xl mx-auto">
                No YAML. No scripts. No complexity. Just conversation.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  icon: MessageSquare,
                  title: 'Describe Your App',
                  description: 'Tell our AI what you want to deploy in plain English',
                  color: 'from-purple-500 to-purple-600'
                },
                {
                  step: '02',
                  icon: Bot,
                  title: 'AI Configures Everything',
                  description: 'Automated setup of Docker, servers, databases, and SSL',
                  color: 'from-blue-500 to-blue-600'
                },
                {
                  step: '03',
                  icon: Rocket,
                  title: 'Go Live Instantly',
                  description: 'Production-ready with HTTPS URL in under 3 minutes',
                  color: 'from-cyan-500 to-cyan-600'
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm hover:border-white/20 transition-all duration-300">
                      <div className="text-sm font-mono text-bolt-dark-500 mb-4">{item.step}</div>
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                      <p className="text-bolt-dark-300 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-6 py-24 md:py-32 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-bolt-dark-300 bg-clip-text text-transparent">
                  Enterprise-Grade Platform
                </span>
              </h2>
              <p className="text-xl text-bolt-dark-300">
                Production-ready infrastructure with zero configuration
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: 'Lightning Fast', description: 'Deploy in under 3 minutes with optimized infrastructure', color: 'text-yellow-400' },
                { icon: Shield, title: 'Secure by Default', description: 'Auto SSL, DDoS protection, and SOC2 compliance', color: 'text-green-400' },
                { icon: Globe, title: 'Global CDN', description: 'Automatic worldwide content delivery and edge caching', color: 'text-blue-400' },
                { icon: Database, title: 'Database Management', description: 'Automated provisioning, backups, and scaling', color: 'text-purple-400' },
                { icon: Gauge, title: 'Real-time Monitoring', description: 'Built-in dashboards, logs, and performance metrics', color: 'text-cyan-400' },
                { icon: Code, title: 'All Frameworks', description: 'React, Vue, Node.js, Python, and more supported', color: 'text-pink-400' }
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="group p-6 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300">
                    <Icon className={`w-10 h-10 ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`} />
                    <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
                    <p className="text-sm text-bolt-dark-300 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Code Demo */}
        <section className="px-6 py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-bolt-dark-300 bg-clip-text text-transparent">
                  See It In Action
                </span>
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl overflow-hidden shadow-2xl">
              <div className="flex items-center space-x-2 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-bolt-dark-400 ml-4 font-mono">Terminal</span>
              </div>

              <div className="p-6 font-mono text-sm space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-cyan-400">you@local:</span>
                  <span className="text-bolt-dark-200">Deploy my React app with Node.js backend and PostgreSQL</span>
                </div>

                <div className="space-y-2 text-bolt-dark-300">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Analyzing React application...</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Building Docker containers...</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Provisioning PostgreSQL database...</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Configuring SSL and domain...</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-400 font-semibold pt-2">
                    <Rocket className="w-4 h-4" />
                    <span>Deployed: https://my-app.cyaphire.live</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => setCurrentStep('signup')}
                className="px-8 py-4 futuristic-btn text-white rounded-lg text-lg font-semibold inline-flex items-center space-x-2 shadow-2xl shadow-purple-900/50"
              >
                <Play className="w-5 h-5" />
                <span>Try It Free</span>
              </button>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-12 md:p-16 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 animate-pulse"></div>

              <div className="relative">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                    Ready to Deploy?
                  </span>
                </h2>
                <p className="text-xl text-bolt-dark-200 mb-10 max-w-2xl mx-auto">
                  Join thousands of developers deploying applications through AI conversations
                </p>

                <button
                  onClick={() => setCurrentStep('signup')}
                  className="px-10 py-5 futuristic-btn text-white rounded-lg text-xl font-bold inline-flex items-center space-x-3 shadow-2xl shadow-purple-900/50 hover:shadow-purple-700/50 mb-8"
                >
                  <Clock className="w-6 h-6" />
                  <span>Start Free in 3 Minutes</span>
                  <ArrowRight className="w-6 h-6" />
                </button>

                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-bolt-dark-400">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span>SOC2 Compliant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-purple-400" />
                    <span>Enterprise Security</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-12 border-t border-white/10 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <div className="mb-6 md:mb-0 text-center md:text-left">
                <CyaphireLogo size="sm" />
                <p className="text-bolt-dark-400 text-sm mt-3">
                  Deploy applications through AI conversations
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-bolt-dark-400">
                <a href="#" className="hover:text-white transition-colors">About</a>
                <a href="#" className="hover:text-white transition-colors">Docs</a>
                <a href="#" className="hover:text-white transition-colors">Pricing</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 text-center text-sm text-bolt-dark-500">
              <p>© 2024 Cyaphire AI X. Powered by DeploidX. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
