import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export default function SplashScreen({ onFinish, duration = 5000, label }) {
  useEffect(() => {
    const timer = setTimeout(() => { onFinish?.(); }, duration);
    return () => clearTimeout(timer);
  }, [duration, onFinish]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 overflow-hidden">
      <motion.span
        className="absolute top-1/4 right-1/4 text-blue-300 text-xl"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >✦</motion.span>
      <motion.span
        className="absolute bottom-1/3 left-1/4 text-blue-400 text-lg"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      >✦</motion.span>

      <div className="relative w-44 h-44 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: 'conic-gradient(from 0deg, #1e3a8a, #3b82f6, #93c5fd, #1e3a8a)', filter: 'blur(2px)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-[6px] rounded-full bg-slate-950" />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: '0 0 40px 10px rgba(59,130,246,0.55)' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <TrendingUp className="w-14 h-14 text-blue-400 relative z-10" />
      </div>

      {label && <p className="mt-6 text-sm text-blue-200 font-medium tracking-wide">{label}</p>}
    </div>
  );
}
