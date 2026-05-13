import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Code2, BrainCircuit, Activity, ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FeatureCard = ({ icon: Icon, title, description, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="p-6 rounded-2xl glass hover:bg-card/80 transition-all cursor-pointer group"
  >
    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6 text-primary glow-primary" />
    </div>
    <h3 className="text-xl font-semibold mb-3 tracking-tight">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
);

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030712] text-foreground selection:bg-primary/30 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-accent/20 rounded-full blur-[100px] pointer-events-none opacity-30" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <Activity className="w-6 h-6 text-primary" />
            <span>Algo<span className="text-primary">Viz</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#algorithms" className="hover:text-foreground transition-colors">Algorithms</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#docs" className="hover:text-foreground transition-colors">Docs</a>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
            <Button onClick={() => navigate('/app')} className="gap-2 glow-primary bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-16 px-6">
        {/* Hero Section */}
        <div className="container mx-auto text-center max-w-5xl pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20">
              <Zap className="w-4 h-4" />
              <span className="animate-pulse">v2.0 is now live</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Visualize Algorithms <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-accent">
                Like Never Before.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              Master Data Structures & Algorithms through real-time interactive animations, performance insights, and AI-powered explanations. Built for the modern developer.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/app')}
                className="h-14 px-8 text-lg gap-2 glow-primary w-full sm:w-auto"
              >
                <Play className="w-5 h-5 fill-current" />
                Start Visualizing
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-8 text-lg gap-2 w-full sm:w-auto border-white/10 hover:bg-white/5"
              >
                <Code2 className="w-5 h-5" />
                View Documentation
              </Button>
            </div>
          </motion.div>

          {/* Abstract Mockup / Preview Graphic */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-24 relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-2xl p-4 shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent z-10 pointer-events-none" />
            <div className="w-full h-[400px] md:h-[600px] rounded-xl border border-white/5 bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
              {/* Fake UI for visualizer */}
              <div className="absolute top-0 left-0 w-full h-12 border-b border-white/5 bg-white/5 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
              </div>
              <div className="flex items-end gap-2 h-64 mt-12">
                {[40, 70, 45, 90, 60, 30, 80, 50, 100, 20].map((h, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [`${h}%`, `${h+20}%`, `${h}%`] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                    className={`w-8 md:w-12 rounded-t-sm ${i === 3 || i === 4 ? 'bg-primary glow-primary' : 'bg-white/10'}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div id="features" className="container mx-auto py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Production-Grade Analysis</h2>
            <p className="text-lg text-muted-foreground">Everything you need to understand complex algorithmic behaviors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Activity}
              title="Real-time Visualization"
              description="Watch algorithms execute step-by-step with smooth 60fps animations and state tracking."
              delay={0}
            />
            <FeatureCard 
              icon={BrainCircuit}
              title="AI Copilot"
              description="Get step-by-step explanations, complexity analysis, and pseudocode generated on the fly."
              delay={0.1}
            />
            <FeatureCard 
              icon={Code2}
              title="Performance Profiling"
              description="Compare multiple algorithms simultaneously with detailed Big O benchmarks."
              delay={0.2}
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto py-24 border-t border-white/10">
          <div className="flex flex-col items-center text-center p-12 rounded-3xl bg-gradient-to-b from-primary/10 to-transparent border border-primary/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-20" />
            <h2 className="text-4xl font-bold tracking-tight mb-6 z-10">Ready to level up?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mb-8 z-10">
              Join thousands of developers and students mastering algorithms with the most advanced visualizer ever built.
            </p>
            <Button size="lg" onClick={() => navigate('/app')} className="z-10 gap-2 h-14 px-8 text-lg glow-primary">
              Launch Visualizer <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/40 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Activity className="w-5 h-5 text-primary" />
            <span>Algo<span className="text-primary">Viz</span></span>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AlgoViz Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
