import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#EC4899'];

const SuccessAnimation: React.FC = () => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; color: string }>>([]);

  useEffect(() => {
    // Generate particles
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // random start X position percentage
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex justify-center items-center">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ 
            y: 0, 
            x: 0,
            scale: 0,
            opacity: 1 
          }}
          animate={{ 
            y: [0, (Math.random() - 0.5) * 800], // Explode outward/down
            x: [0, (Math.random() - 0.5) * 800],
            rotate: [0, Math.random() * 360 * 4],
            scale: [0, 1, 0],
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: 2 + Math.random(), 
            ease: "easeOut",
            times: [0, 0.2, 1]
          }}
          className="absolute w-4 h-4 rounded-sm"
          style={{ 
            backgroundColor: p.color,
            top: '50%',
            left: '50%'
          }}
        />
      ))}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="bg-white p-8 rounded-3xl shadow-2xl border-4 border-yellow-400 text-center relative z-50"
      >
        <div className="text-6xl mb-2">🎉</div>
        <h2 className="text-3xl font-black text-indigo-900">Bravo !</h2>
        <p className="text-slate-500 font-medium">Équilibre parfait !</p>
      </motion.div>
    </div>
  );
};

export default SuccessAnimation;