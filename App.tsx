import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Sparkles, BrainCircuit, RefreshCw, Trophy, ArrowRight } from 'lucide-react';

import { INITIAL_LEVELS } from './constants';
import { LevelData, AtomComposition } from './types';
import MoleculeViewer from './components/MoleculeViewer';
import AtomCounter from './components/AtomCounter';
import SuccessAnimation from './components/SuccessAnimation';
import { generateNewLevel, getTutorHelp } from './services/geminiService';

const App: React.FC = () => {
  const [levels, setLevels] = useState<LevelData[]>(INITIAL_LEVELS);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  
  // Current working state of the level (coefficients modified by user)
  const [currentReactants, setCurrentReactants] = useState(levels[0].reactants);
  const [currentProducts, setCurrentProducts] = useState(levels[0].products);
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tutorMessage, setTutorMessage] = useState<string | null>(null);
  const [isTutorLoading, setIsTutorLoading] = useState(false);

  const currentLevel = levels[currentLevelIdx];

  // Reset state when level changes
  useEffect(() => {
    setCurrentReactants(levels[currentLevelIdx].reactants.map(r => ({ ...r, coefficient: 1 })));
    setCurrentProducts(levels[currentLevelIdx].products.map(p => ({ ...p, coefficient: 1 })));
    setIsSuccess(false);
    setTutorMessage(null);
  }, [currentLevelIdx, levels]);

  // Calculate totals
  const calculateTotals = (components: typeof currentReactants) => {
    const totals: AtomComposition = {};
    components.forEach(comp => {
      Object.entries(comp.composition).forEach(([el, val]) => {
        const count = val as number;
        if(count) {
           totals[el] = (totals[el] || 0) + (count * comp.coefficient);
        }
      });
    });
    return totals;
  };

  const reactantTotals = useMemo(() => calculateTotals(currentReactants), [currentReactants]);
  const productTotals = useMemo(() => calculateTotals(currentProducts), [currentProducts]);

  // Check for success
  useEffect(() => {
    const elements = new Set([...Object.keys(reactantTotals), ...Object.keys(productTotals)]);
    let balanced = true;
    elements.forEach(el => {
      if ((reactantTotals[el] || 0) !== (productTotals[el] || 0)) {
        balanced = false;
      }
    });

    if (balanced && !isSuccess) {
      setIsSuccess(true);
      setScore(s => s + 100);
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'); // Simple chime
      audio.volume = 0.5;
      audio.play().catch(() => {}); // Ignore autoplay errors
    } else if (!balanced && isSuccess) {
      setIsSuccess(false);
    }
  }, [reactantTotals, productTotals, isSuccess]);


  const handleCoefficientChange = (side: 'reactants' | 'products', idx: number, change: number) => {
    if (isSuccess) return; // Lock if won

    if (side === 'reactants') {
      const newR = [...currentReactants];
      newR[idx].coefficient = Math.max(1, newR[idx].coefficient + change);
      setCurrentReactants(newR);
    } else {
      const newP = [...currentProducts];
      newP[idx].coefficient = Math.max(1, newP[idx].coefficient + change);
      setCurrentProducts(newP);
    }
  };

  const handleNextLevel = async () => {
    setLoading(true);
    
    // Check if we need to generate a new level
    if (currentLevelIdx + 1 >= levels.length) {
      const newLevel = await generateNewLevel(levels.map(l => l.name));
      if (newLevel) {
        setLevels(prev => [...prev, newLevel]);
        setCurrentLevelIdx(prev => prev + 1);
      } else {
        // Fallback: Just loop or alert (for demo purposes, we loop to start if API fails)
        if (levels.length > INITIAL_LEVELS.length) {
             // We have some generated levels, move to next
             setCurrentLevelIdx(prev => prev + 1);
        } else {
             alert("Impossible de générer un nouveau niveau (API Key manquante ?). Retour au début !");
             setCurrentLevelIdx(0);
        }
      }
    } else {
      setCurrentLevelIdx(prev => prev + 1);
    }
    setLoading(false);
  };

  const handleTutor = async () => {
    setIsTutorLoading(true);
    const msg = await getTutorHelp({
        ...currentLevel,
        reactants: currentReactants,
        products: currentProducts
    });
    setTutorMessage(msg);
    setIsTutorLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 text-slate-800 font-sans pb-12 overflow-x-hidden relative">
      
      {/* Animation Layer */}
      <AnimatePresence>
        {isSuccess && <SuccessAnimation key="success-anim" />}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-indigo-100 shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <FlaskConical size={24} />
          </div>
          <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Chimie<span className="font-light">Équilibre</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="hidden md:flex flex-col items-end">
             <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Niveau</span>
             <span className="font-bold text-indigo-900">{currentLevelIdx + 1}</span>
           </div>
           <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-bold flex items-center gap-2 border border-amber-200">
             <Trophy size={18} />
             <span>{score}</span>
           </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex flex-col items-center relative z-10">
        
        {/* Level Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={currentLevel.id}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 w-full max-w-3xl text-center"
        >
          <div className="flex justify-center mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
              ${currentLevel.difficulty === 'Facile' ? 'bg-green-100 text-green-700' : 
                currentLevel.difficulty === 'Moyen' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
              {currentLevel.difficulty}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{currentLevel.name}</h2>
          <p className="text-slate-600 italic">{currentLevel.description}</p>
        </motion.div>

        {/* Game Area */}
        <div className="flex flex-col xl:flex-row items-center justify-center gap-8 w-full max-w-7xl">
          
          {/* Reactants */}
          <div className="flex flex-wrap justify-center gap-4 items-center">
            {currentReactants.map((r, i) => (
              <React.Fragment key={r.id}>
                <MoleculeViewer 
                  molecule={r} 
                  isProduct={false}
                  onIncrement={() => handleCoefficientChange('reactants', i, 1)}
                  onDecrement={() => handleCoefficientChange('reactants', i, -1)}
                  disabled={isSuccess || loading}
                />
                {i < currentReactants.length - 1 && (
                  <span className="text-4xl font-black text-slate-300 mx-2">+</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Arrow */}
          <div className="rotate-90 xl:rotate-0 text-slate-300">
            <ArrowRight size={48} strokeWidth={4} />
          </div>

          {/* Products */}
          <div className="flex flex-wrap justify-center gap-4 items-center">
            {currentProducts.map((p, i) => (
              <React.Fragment key={p.id}>
                <MoleculeViewer 
                  molecule={p} 
                  isProduct={true}
                  onIncrement={() => handleCoefficientChange('products', i, 1)}
                  onDecrement={() => handleCoefficientChange('products', i, -1)}
                  disabled={isSuccess || loading}
                />
                {i < currentProducts.length - 1 && (
                  <span className="text-4xl font-black text-slate-300 mx-2">+</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Visualizer (Scale) */}
        <AtomCounter reactantCounts={reactantTotals} productCounts={productTotals} />

        {/* Success Overlay / Actions */}
        <div className="mt-8 flex flex-col items-center gap-4 h-24">
            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="flex flex-col items-center gap-4 z-50"
                    >
                        {/* Replaced static text with the button directly, animation handles the text */}
                        <button
                            onClick={handleNextLevel}
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-70 ring-4 ring-indigo-200"
                        >
                            {loading ? <RefreshCw className="animate-spin" /> : "Niveau Suivant"}
                            {!loading && <ArrowRight size={20} />}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {!isSuccess && !loading && (
                 <div className="flex flex-col items-center gap-2">
                     <button 
                        onClick={handleTutor}
                        disabled={isTutorLoading}
                        className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-100 transition-colors"
                     >
                        <BrainCircuit size={18} />
                        {isTutorLoading ? "Réflexion..." : "Demander un indice à l'IA"}
                     </button>
                     {tutorMessage && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-slate-600 text-sm max-w-md text-center bg-white p-3 rounded-lg shadow-sm border border-slate-100"
                        >
                            {tutorMessage}
                        </motion.div>
                     )}
                 </div>
            )}
        </div>

      </main>
      
      {/* Footer Info */}
      <footer className="fixed bottom-0 w-full bg-white/50 backdrop-blur-sm border-t border-slate-200 py-2 text-center text-xs text-slate-400">
        ChimieÉquilibre - Application Pédagogique React + Gemini
      </footer>
    </div>
  );
};

export default App;