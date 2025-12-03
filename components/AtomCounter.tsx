import React from 'react';
import { motion } from 'framer-motion';
import { ATOM_COLORS } from '../constants';
import { AtomComposition } from '../types';

interface AtomCounterProps {
  reactantCounts: AtomComposition;
  productCounts: AtomComposition;
}

const AtomCounter: React.FC<AtomCounterProps> = ({ reactantCounts, productCounts }) => {
  // Get all unique elements present in the reaction
  const allElements = Array.from(new Set([
    ...Object.keys(reactantCounts),
    ...Object.keys(productCounts)
  ]));

  return (
    <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-200 mt-6">
      <h3 className="text-center text-slate-500 font-bold uppercase tracking-widest text-sm mb-4">
        Balance des Atomes
      </h3>
      
      <div className="grid gap-6">
        {allElements.map((element) => {
          const rCount = reactantCounts[element] || 0;
          const pCount = productCounts[element] || 0;
          const isBalanced = rCount === pCount;
          const color = ATOM_COLORS[element] || ATOM_COLORS.default;
          
          // Calculate max for scale (min 5 for visual consistency)
          const maxVal = Math.max(rCount, pCount, 5);

          return (
            <div key={element} className="flex items-center gap-4">
              {/* Reactant Bar (Left, flowing right to center) */}
              <div className="flex-1 flex justify-end items-center gap-2">
                <span className="font-bold text-slate-600 w-6 text-right">{rCount}</span>
                <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden flex justify-end">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${(rCount / maxVal) * 100}%` }}
                     transition={{ type: "spring", stiffness: 100 }}
                     className={`h-full ${color.bg}`}
                   />
                </div>
              </div>

              {/* Atom Symbol Center */}
              <div className={`w-10 h-10 shrink-0 rounded-full ${color.bg} ${color.border} border-4 flex items-center justify-center relative z-10 transition-transform ${isBalanced ? 'scale-110 shadow-lg ring-2 ring-green-400' : 'scale-100'}`}>
                <span className={`font-black ${color.text}`}>{element}</span>
                {isBalanced && (
                   <motion.div 
                     initial={{ scale: 0 }} 
                     animate={{ scale: 1 }}
                     className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                   </motion.div>
                )}
              </div>

              {/* Product Bar (Right, flowing left to center) */}
              <div className="flex-1 flex justify-start items-center gap-2">
                <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden flex justify-start">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${(pCount / maxVal) * 100}%` }}
                     transition={{ type: "spring", stiffness: 100 }}
                     className={`h-full ${color.bg}`}
                   />
                </div>
                <span className="font-bold text-slate-600 w-6">{pCount}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AtomCounter;