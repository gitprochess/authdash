import React, { useState } from 'react';
import { ArrowRight, MessageSquare, Zap, Globe, Server, Database, Shield, CheckCircle, Clock, Code, Rocket, Terminal, Sparkles, Play, Bot, Gauge, Lock, Container } from 'lucide-react';
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
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Grid Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(124, 58, 237, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 58, 237, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)'
        }}></div>
      </div>

      {/* Gradient Overlays */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-purple-600/30 via-blue-600/20 to-transparent rounded-full blur-3xl"></div>
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
        <section className="px-6 py-24 md:py-32 relative overflow-hidden">
          {/* Floating Elements Background */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Animated Code Snippets */}
            <div className="absolute top-20 left-[10%] animate-float-slow opacity-20">
              <div className="glass rounded-lg px-4 py-2 text-xs font-mono text-purple-400 border border-purple-500/30">
                npm run deploy
              </div>
            </div>
            <div className="absolute top-40 right-[15%] animate-float-delayed opacity-20">
              <div className="glass rounded-lg px-4 py-2 text-xs font-mono text-cyan-400 border border-cyan-500/30">
                docker build -t app
              </div>
            </div>
            <div className="absolute bottom-40 left-[20%] animate-float opacity-20">
              <div className="glass rounded-lg px-4 py-2 text-xs font-mono text-blue-400 border border-blue-500/30">
                kubectl apply -f
              </div>
            </div>

            {/* Orbiting Icons */}
            <div className="absolute top-1/2 left-[5%] -translate-y-1/2 animate-orbit opacity-30">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm flex items-center justify-center border border-purple-500/30">
                <Database className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div className="absolute top-1/3 right-[8%] animate-orbit-reverse opacity-30">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 backdrop-blur-sm flex items-center justify-center border border-cyan-500/30">
                <Server className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div className="absolute bottom-1/3 right-[10%] animate-orbit-slow opacity-30">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm flex items-center justify-center border border-blue-500/30">
                <Globe className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm mb-8 group hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                <Sparkles className="w-4 h-4 mr-2 text-purple-400 animate-pulse" />
                <span className="text-sm font-medium text-purple-300">AI-Powered Deployment Platform</span>
                <div className="ml-2 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
              </div>

              {/* Main Heading with typing effect */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent inline-block animate-fade-in">
                  Deploy Applications
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent inline-block animate-gradient-x">
                  Through AI Conversations
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-xl md:text-2xl text-gray-400 mb-8 leading-relaxed max-w-3xl mx-auto animate-fade-in-up">
                Cyaphire AI X transforms natural language into production-ready deployments.
                Just describe what you want, and our AI handles the entire DevOps pipeline.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="group px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 backdrop-blur-sm hover:scale-105 transition-transform">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-300 font-medium">3min Deploy</span>
                  </div>
                </div>
                <div className="group px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm hover:scale-105 transition-transform">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-3 h-3 text-blue-400" />
                    <span className="text-sm text-blue-300 font-medium">Auto SSL</span>
                  </div>
                </div>
                <div className="group px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm hover:scale-105 transition-transform">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    <span className="text-sm text-cyan-300 font-medium">Auto Scale</span>
                  </div>
                </div>
                <div className="group px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm hover:scale-105 transition-transform">
                  <div className="flex items-center space-x-2">
                    <Database className="w-3 h-3 text-purple-400" />
                    <span className="text-sm text-purple-300 font-medium">DB Included</span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <button
                  onClick={() => setCurrentStep('signup')}
                  className="group px-8 py-4 futuristic-btn text-white rounded-lg text-lg font-semibold flex items-center space-x-3 shadow-2xl shadow-purple-900/50 hover:scale-105 transition-transform"
                >
                  <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Start Deploying with AI</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 border border-white/20 text-white rounded-lg text-lg font-medium hover:bg-white/5 transition-all duration-200 backdrop-blur-sm flex items-center space-x-2 group">
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Tech Stack Logos Carousel */}
              <div className="mb-20 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <p className="text-xs text-gray-600 uppercase tracking-wider mb-4">Supports all major technologies</p>
                <div className="flex flex-wrap items-center justify-center gap-6 opacity-60">
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <Code className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm text-gray-300 font-medium">React</span>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <Terminal className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-gray-300 font-medium">Node.js</span>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <Server className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-gray-300 font-medium">Docker</span>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <Database className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-gray-300 font-medium">PostgreSQL</span>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <Code className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm text-gray-300 font-medium">Python</span>
                  </div>
                </div>
              </div>

              {/* Animated Conversation Demo */}
              <div className="glass rounded-2xl p-8 vision-glow max-w-3xl mx-auto hover:scale-[1.02] transition-transform duration-500 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                <div className="flex items-center space-x-2 mb-6">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-medium text-gray-400">Live AI Deployment</span>
                  <div className="ml-auto flex space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>

                <div className="space-y-4 font-mono text-sm">
                  <div className="flex items-start space-x-3 animate-in" style={{ animationDelay: '0.5s' }}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">YOU</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl rounded-tl-none px-4 py-3 flex-1">
                      <p className="text-gray-300">Deploy a React frontend with Node.js backend and PostgreSQL database</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 animate-in" style={{ animationDelay: '1s' }}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl rounded-tl-none px-4 py-3 flex-1">
                      <p className="text-gray-300 mb-3">I'll deploy that for you right now!</p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-xs">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          <span className="text-gray-400">Analyzing React application structure...</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          <span className="text-gray-400">Containerizing Node.js backend...</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          <span className="text-gray-400">Provisioning PostgreSQL database...</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          <span className="text-gray-400">Configuring SSL & DNS...</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs pt-2 border-t border-white/10">
                          <Rocket className="w-3 h-3 text-cyan-400" />
                          <span className="text-cyan-400 font-semibold">Live at: https://your-app.cyaphire.live</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Capabilities Section */}
        <section className="px-6 py-24 md:py-32 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Powered by Advanced AI
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Our AI understands infrastructure, security, scaling, and best practices.
                It's like having a senior DevOps engineer on demand.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* Natural Language Understanding */}
              <div className="glass-strong rounded-2xl p-8 group hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Natural Language Processing</h3>
                </div>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Simply describe your application in plain English. Our AI interprets your requirements,
                  understands technical context, and translates them into production-ready infrastructure.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                    <span>Understands frameworks, databases, and services</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                    <span>Detects dependencies and requirements</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                    <span>Suggests optimizations and best practices</span>
                  </div>
                </div>
              </div>

              {/* Intelligent Infrastructure */}
              <div className="glass-strong rounded-2xl p-8 group hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Server className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Intelligent Infrastructure</h3>
                </div>
                <p className="text-gray-400 leading-relaxed mb-4">
                  AI automatically provisions optimal infrastructure based on your application's needs.
                  From containers to databases, everything is configured with enterprise-grade security.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    <span>Auto-scaling based on traffic patterns</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    <span>Load balancing and failover handling</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    <span>SSL certificates and DNS configuration</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  &lt;3min
                </div>
                <div className="text-sm text-gray-500 font-medium">Average Deploy Time</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  99.9%
                </div>
                <div className="text-sm text-gray-500 font-medium">Uptime SLA</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  10K+
                </div>
                <div className="text-sm text-gray-500 font-medium">Apps Deployed</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  24/7
                </div>
                <div className="text-sm text-gray-500 font-medium">AI Monitoring</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Detailed */}
        <section className="px-6 py-24 md:py-32 bg-gradient-to-b from-transparent to-white/[0.01]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  How Cyaphire AI Works
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                From conversation to production in minutes. Zero DevOps knowledge required.
              </p>
            </div>

            <div className="space-y-24">
              {/* Step 1 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 mb-4">
                    <span className="text-sm font-mono text-purple-400">Step 01</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Chat with AI Assistant</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    Simply describe your application in natural language. Tell Cyaphire AI X what you're building,
                    what frameworks you're using, and any specific requirements. The AI understands technical context
                    and can answer questions, suggest improvements, and clarify any ambiguities.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="text-gray-300">Supports all major frameworks and languages</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="text-gray-300">AI suggests optimal architecture patterns</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="text-gray-300">Real-time clarifications and recommendations</span>
                    </div>
                  </div>
                </div>
                <div className="glass-strong rounded-2xl p-6">
                  <div className="space-y-4 font-mono text-xs">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold">U</span>
                      </div>
                      <div className="bg-white/5 rounded-lg px-3 py-2 flex-1">
                        <p className="text-gray-300">I need to deploy a React app with authentication</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3 h-3" />
                      </div>
                      <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg px-3 py-2 flex-1">
                        <p className="text-gray-300 mb-2">Great! I can help with that. Would you like me to:</p>
                        <ul className="text-gray-400 space-y-1 text-[10px]">
                          <li>• Set up OAuth (Google, GitHub) or email/password auth?</li>
                          <li>• Include a PostgreSQL database for user data?</li>
                          <li>• Add JWT token management?</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 glass-strong rounded-2xl p-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                      </div>
                      <span className="text-gray-400">Analyzing codebase structure...</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-400">Building Docker containers</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-400">Setting up environment variables</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-400">Provisioning PostgreSQL database</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-400">Configuring load balancers</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-400">Generating SSL certificates</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                      </div>
                      <span className="text-gray-400">Deploying to cloud infrastructure...</span>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 mb-4">
                    <span className="text-sm font-mono text-blue-400">Step 02</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">AI Builds & Configures</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    Our AI automatically handles all the complex DevOps tasks. It analyzes your code, creates
                    optimized Docker containers, provisions databases, configures networking, sets up SSL,
                    and deploys everything to production-grade infrastructure.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Container className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-gray-300">Automatic containerization and orchestration</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Database className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-gray-300">Database provisioning with automated backups</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-gray-300">Enterprise security and compliance built-in</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4">
                    <span className="text-sm font-mono text-cyan-400">Step 03</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Monitor & Scale with AI</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    Once deployed, Cyaphire AI continuously monitors your application's health, performance,
                    and traffic patterns. It automatically scales resources, optimizes costs, detects anomalies,
                    and provides intelligent insights to keep your app running smoothly.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <Gauge className="w-4 h-4 text-cyan-400" />
                      </div>
                      <span className="text-gray-300">Real-time performance monitoring</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-4 h-4 text-cyan-400" />
                      </div>
                      <span className="text-gray-300">Intelligent auto-scaling based on demand</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <Globe className="w-4 h-4 text-cyan-400" />
                      </div>
                      <span className="text-gray-300">Global CDN and edge optimization</span>
                    </div>
                  </div>
                </div>
                <div className="glass-strong rounded-2xl p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Application Status</span>
                      <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="text-xs text-green-400 font-medium">Healthy</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-2xl font-bold text-white mb-1">1.2K</div>
                        <div className="text-xs text-gray-500">Requests/min</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-2xl font-bold text-white mb-1">45ms</div>
                        <div className="text-xs text-gray-500">Avg Response</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-2xl font-bold text-white mb-1">99.9%</div>
                        <div className="text-xs text-gray-500">Uptime</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-2xl font-bold text-white mb-1">3</div>
                        <div className="text-xs text-gray-500">Active Instances</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
