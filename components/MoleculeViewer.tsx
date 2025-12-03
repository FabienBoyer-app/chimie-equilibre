import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChemicalComponent } from '../types';
import { ATOM_COLORS } from '../constants';

interface MoleculeViewerProps {
  molecule: ChemicalComponent;
  isProduct: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled: boolean;
}

const MoleculeViewer: React.FC<MoleculeViewerProps> = ({ 
  molecule, 
  onIncrement, 
  onDecrement,
  disabled 
}) => {
  
  // Helper to generate visual atoms based on composition and coefficient
  const renderAtoms = () => {
    const atoms: React.ReactElement[] = [];
    let keyCounter = 0;

    // We only show one molecule visually, but multiply by coefficient number visually?
    // A better approach for balancing: Show ONE molecule large, and X badges for coefficient.
    // Or show multiple groups. For clarity on mobile, let's show one detailed group 
    // and just the big number multiplier.

    Object.entries(molecule.composition).forEach(([element, val]) => {
      const count = val as number;
      if(!count) return;
      const color = ATOM_COLORS[element] || ATOM_COLORS.default;
      
      for (let i = 0; i < count; i++) {
        atoms.push(
          <div
            key={`${element}-${keyCounter++}`}
            className={`w-8 h-8 rounded-full ${color.bg} ${color.border} border-2 flex items-center justify-center shadow-sm -ml-2 first:ml-0 relative z-10`}
            title={element}
          >
            <span className={`text-xs font-bold ${color.text}`}>{element}</span>
          </div>
        );
      }
    });

    return atoms;
  };

  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-2xl shadow-lg border border-slate-100 min-w-[140px]">
      {/* Molecule Visualization */}
      <div className="flex items-center justify-center h-16 mb-2 px-2 bg-slate-50 rounded-xl w-full overflow-hidden">
        <div className="flex flex-wrap justify-center items-center">
          {renderAtoms()}
        </div>
      </div>

      {/* Formula */}
      <div className="font-bold text-slate-700 text-lg mb-3 tracking-wider">
        {molecule.formula}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onDecrement}
          disabled={disabled || molecule.coefficient <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-xl"
          aria-label="Diminuer"
        >
          -
        </button>
        
        <AnimatePresence mode="wait">
          <motion.span 
            key={molecule.coefficient}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="text-2xl font-black text-indigo-600 w-8 text-center"
          >
            {molecule.coefficient}
          </motion.span>
        </AnimatePresence>

        <button
          onClick={onIncrement}
          disabled={disabled || molecule.coefficient >= 9} // Limit to keep sanity
          className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-xl"
          aria-label="Augmenter"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default MoleculeViewer;