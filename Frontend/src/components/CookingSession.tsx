import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Timer, Play, Pause, RotateCcw, Check } from "lucide-react";

interface CookingSessionProps {
  steps: string[];
  onExit: () => void;
}

export default function CookingSession({ steps, onExit }: CookingSessionProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Parse time from current step
  useEffect(() => {
    const currentStep = steps[stepIndex];
    // Regex to find "X minutes" or "X min"
    const match = currentStep.match(/(\d+)\s*(min|minutes|minute)/i);
    
    if (match) {
        // Only set timer if we haven't set one for this step yet
        // Ideally we might want to allow resetting, but for now auto-detect is valid hint
        // We won't auto-start, just offer it.
    }
    // Cleanup timer on step change
    setTimeLeft(null);
    setIsTimerRunning(false);
  }, [stepIndex, steps]);

  // Timer Tick
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      // Could play a sound here
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const handleTimerStart = () => {
    if (timeLeft === null) {
        // Detect time again to initialize
        const currentStep = steps[stepIndex];
        const match = currentStep.match(/(\d+)\s*(min|minutes|minute)/i);
        if (match) {
            setTimeLeft(parseInt(match[1]) * 60);
            setIsTimerRunning(true);
        }
    } else {
        setIsTimerRunning(true);
    }
  };

  const currentStep = steps[stepIndex];
  const hasTimer = currentStep.match(/(\d+)\s*(min|minutes|minute)/i);
  const progress = ((stepIndex + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-ink bg-opacity-90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-paper w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-golden bg-opacity-10 p-6 flex items-center justify-between border-b border-golden border-opacity-20">
            <div className="flex items-center gap-4">
                <span className="font-serif font-bold text-2xl text-ink">Step {stepIndex + 1}</span>
                <span className="text-ink text-opacity-50 text-lg">of {steps.length}</span>
            </div>
            <button 
                onClick={onExit}
                className="p-2 hover:bg-black hover:bg-opacity-5 rounded-full transition-colors text-ink"
            >
                <X size={28} />
            </button>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-200 w-full">
            <motion.div 
                className="h-full bg-clay"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
            />
        </div>

        {/* Content */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center items-center text-center overflow-y-auto">
            <motion.p 
                key={stepIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-2xl md:text-4xl font-serif text-ink leading-relaxed mb-12"
            >
                {currentStep}
            </motion.p>

            {/* Timer Section */}
            {hasTimer && (
                <div className="mb-8 p-6 bg-parchment rounded-2xl border-2 border-golden border-opacity-30 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-3 text-clay">
                        <Timer size={32} />
                        <span className="text-3xl font-bold font-mono">
                            {timeLeft !== null 
                                ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`
                                : `${hasTimer[1]}:00`
                            }
                        </span>
                    </div>
                    
                    <div className="flex gap-3">
                        {!isTimerRunning && timeLeft === 0 ? (
                             <div className="flex items-center gap-2 text-green-600 font-bold text-xl animate-bounce">
                                <Check size={24} /> Done!
                             </div>
                        ) : (
                            <>
                                {!isTimerRunning ? (
                                    <button 
                                        onClick={handleTimerStart}
                                        className="flex items-center gap-2 bg-clay text-white px-6 py-2 rounded-full font-bold hover:bg-opacity-90 transition-colors"
                                    >
                                        <Play size={20} /> {timeLeft !== null ? 'Resume' : 'Start Timer'}
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => setIsTimerRunning(false)}
                                        className="flex items-center gap-2 bg-golden text-ink px-6 py-2 rounded-full font-bold hover:bg-opacity-90 transition-colors"
                                    >
                                        <Pause size={20} /> Pause
                                    </button>
                                )}
                            </>
                        )}
                        
                        {(timeLeft !== null || isTimerRunning) && (
                            <button 
                                onClick={() => { setIsTimerRunning(false); setTimeLeft(null); }}
                                className="p-2 text-ink opacity-50 hover:opacity-100 hover:bg-black hover:bg-opacity-5 rounded-full"
                                title="Reset Timer"
                            >
                                <RotateCcw size={20} />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>

        {/* Footer Controls */}
        <div className="p-4 md:p-8 border-t border-golden border-opacity-20 flex flex-col-reverse md:flex-row justify-between items-center bg-parchment gap-4">
            <button 
                onClick={() => setStepIndex(i => i - 1)}
                disabled={stepIndex === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-lg transition-all w-full md:w-auto justify-center ${
                    stepIndex === 0 
                        ? 'opacity-30 cursor-not-allowed text-ink' 
                        : 'hover:bg-black hover:bg-opacity-5 text-ink'
                }`}
            >
                <ChevronLeft size={24} /> Previous
            </button>

            {stepIndex === steps.length - 1 ? (
                <button 
                    onClick={onExit}
                    className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-green-700 hover:scale-105 transition-all shadow-lg w-full md:w-auto justify-center"
                >
                    Finish Cooking <Check size={24} />
                </button>
            ) : (
                <button 
                    onClick={() => setStepIndex(i => i + 1)}
                    className="flex items-center gap-2 bg-clay text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-opacity-90 hover:scale-105 transition-all shadow-lg w-full md:w-auto justify-center"
                >
                    Next Step <ChevronRight size={24} />
                </button>
            )}
        </div>
      </motion.div>
    </div>
  );
}
