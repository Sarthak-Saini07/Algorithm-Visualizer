import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Lightbulb, Code2, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AIPanel: React.FC = () => {
  return (
    <div className="w-80 border-l border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl h-screen sticky top-0 flex flex-col hidden lg:flex">
      <div className="h-16 flex items-center px-4 border-b border-white/5 gap-2 text-primary">
        <BrainCircuit className="w-5 h-5" />
        <span className="font-semibold tracking-tight">AI Copilot</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 rounded-xl glass bg-primary/5 border-primary/20 space-y-3 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
          <div className="flex items-center gap-2 text-primary font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Current Step Analysis</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The algorithm is currently comparing the element at index 2 with the element at index 3. 
            Since 45 {'>'} 23, a swap will occur in the next step to maintain ascending order.
          </p>
        </motion.div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-foreground font-medium px-1">
            <Lightbulb className="w-4 h-4 text-warning" />
            <span>Complexity Insights</span>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-black/40 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time (Worst)</span>
              <span className="font-mono text-warning">O(n²)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time (Best)</span>
              <span className="font-mono text-success">O(n)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Space</span>
              <span className="font-mono text-success">O(1)</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-foreground font-medium px-1">
            <Code2 className="w-4 h-4 text-accent" />
            <span>Pseudocode</span>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-black/40 overflow-x-auto">
            <pre className="text-xs font-mono leading-loose text-muted-foreground">
              <code className="text-accent">for</code> i <span className="text-primary">=</span> 0 <code className="text-accent">to</code> n-1<br/>
              &nbsp;&nbsp;<code className="text-accent">for</code> j <span className="text-primary">=</span> 0 <code className="text-accent">to</code> n-i-1<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<code className="text-accent">if</code> arr[j] &gt; arr[j+1]<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-primary">swap</span>(arr[j], arr[j+1])
            </pre>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/5">
        <Button variant="outline" className="w-full gap-2 text-xs h-9 border-white/10 hover:bg-white/5">
          <AlertCircle className="w-3 h-3" /> Report Issue
        </Button>
      </div>
    </div>
  );
};
