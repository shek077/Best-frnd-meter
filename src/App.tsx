import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Star, Users, RefreshCcw, Smile, HeartHandshake, Coffee, Gift, PartyPopper, Share2, Settings2, X, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

type ResultLevel = 'Stranger' | 'Casual' | 'Good Friends' | 'Besties' | 'Soulmates' | 'Inseparable';

interface ResultData {
  score: number;
  level: ResultLevel;
  message: string;
  icon: JSX.Element;
  color: string;
}

const DEFAULT_LEVELS: Record<ResultLevel, { message: string; icon: JSX.Element; color: string }> = {
  'Stranger': {
    message: "Who? I think you just met in the elevator. 🏢",
    icon: <Smile className="w-8 h-8 text-pink-600" />,
    color: 'bg-white/30'
  },
  'Casual': {
    message: "A polite 'hello' and maybe a shared meme. 📱",
    icon: <Coffee className="w-8 h-8 text-pink-600" />,
    color: 'bg-white/40'
  },
  'Good Friends': {
    message: "You guys actually hang out! Pizza plan soon? 🍕",
    icon: <Users className="w-8 h-8 text-pink-600" />,
    color: 'bg-white/50'
  },
  'Besties': {
    message: "Secret handshakes and knowing each other's passwords. 🔐",
    icon: <HeartHandshake className="w-8 h-8 text-pink-600" />,
    color: 'bg-white/60'
  },
  'Soulmates': {
    message: "You finish each other's... sandwiches! 🥪",
    icon: <Gift className="w-8 h-8 text-pink-600" />,
    color: 'bg-white/70'
  },
  'Inseparable': {
    message: "Two bodies, one chaotic brain. Legendary! 🌈",
    icon: <PartyPopper className="w-8 h-8 text-pink-600" />,
    color: 'bg-white/80'
  }
};

export default function App() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [hasShared, setHasShared] = useState(false);
  const [showBonus, setShowBonus] = useState(false);
  const [customMessages, setCustomMessages] = useState<Record<ResultLevel, string>>({
    'Stranger': DEFAULT_LEVELS['Stranger'].message,
    'Casual': DEFAULT_LEVELS['Casual'].message,
    'Good Friends': DEFAULT_LEVELS['Good Friends'].message,
    'Besties': DEFAULT_LEVELS['Besties'].message,
    'Soulmates': DEFAULT_LEVELS['Soulmates'].message,
    'Inseparable': DEFAULT_LEVELS['Inseparable'].message,
  });

  // Auto-share effect: trigger share when result is first set
  useEffect(() => {
    if (result && !hasShared) {
      const timer = setTimeout(() => {
        handleShare(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const calculateFriendship = () => {
    if (!name1 || !name2) return;

    setIsCalculating(true);
    setResult(null);
    setHasShared(false);
    setShowBonus(false);

    // Simulated calculation delay for "aesthetic" feel
    setTimeout(() => {
      const combinedNames = (name1.toLowerCase().trim() + name2.toLowerCase().trim()).split('').sort().join('');
      let hash = 0;
      for (let i = 0; i < combinedNames.length; i++) {
        hash = combinedNames.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      const score = Math.abs(hash % 101); // 0-100
      
      let level: ResultLevel = 'Stranger';
      if (score > 90) level = 'Inseparable';
      else if (score > 75) level = 'Soulmates';
      else if (score > 55) level = 'Besties';
      else if (score > 35) level = 'Good Friends';
      else if (score > 15) level = 'Casual';

      if (level === 'Inseparable' || level === 'Soulmates') {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F472B6', '#E11D48', '#FFD700', '#60A5FA']
        });
      }

      setResult({
        score,
        level,
        message: customMessages[level],
        icon: DEFAULT_LEVELS[level].icon,
        color: DEFAULT_LEVELS[level].color
      });
      setIsCalculating(false);
    }, 2000);
  };

  const handleShare = async (isAuto = false) => {
    if (!result) return;
    
    const shareText = `OMG! My friendship with ${name2} is ${result.score}% (${result.level})! ${result.message} ✨ Test your bond here: ${window.location.href}`;
    
    // Set shared state to unlock bonus
    setHasShared(true);

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BFF Meter Results',
          text: shareText,
          url: window.location.href,
        });
        
        if (!isAuto) {
          confetti({
            particleCount: 50,
            scalar: 2,
            shapes: ['circle'],
            colors: ['#F472B6']
          });
        }
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else if (!isAuto) {
      // For auto-share, we don't want to spam alerts or open new tabs if the native share isn't available
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Results copied to clipboard! Share them to unlock a secret bonus! ✨');
      } catch (err) {
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');
      }
    }
  };

  const reset = () => {
    setName1('');
    setName2('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-[#fef2f2] font-sans text-slate-800 p-4 md:p-8 flex flex-col items-center justify-center overflow-x-hidden relative">
      {/* Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-200 rounded-full blur-[120px] opacity-60 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-200 rounded-full blur-[120px] opacity-50 pointer-events-none"></div>
      <div className="fixed top-[20%] right-[15%] w-[300px] h-[300px] bg-yellow-100 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>

      {/* Decorative Floating Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <FloatingIcon icon={<span className="text-3xl opacity-80">✨</span>} delay={0} top="10%" left="5%" />
        <FloatingIcon icon={<span className="text-3xl opacity-80">🧸</span>} delay={1} top="12%" left="85%" />
        <FloatingIcon icon={<span className="text-3xl opacity-80">🍭</span>} delay={2} top="80%" left="10%" />
        <FloatingIcon icon={<span className="text-3xl opacity-80">🌈</span>} delay={1.5} top="75%" left="90%" />
        <FloatingIcon icon={<Smile className="text-pink-300" />} delay={0.5} top="40%" left="5%" />
        <FloatingIcon icon={<Heart className="text-rose-200 fill-rose-100" />} delay={2.5} top="50%" left="92%" />
        
        <FloatingIcon 
          icon={
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40 text-yellow-300 fill-yellow-100">
              <path d="M20 40C20 30 30 20 50 20C70 20 80 30 80 40V70C80 80 70 90 50 90C30 90 20 80 20 70V40Z" fill="currentColor" />
              <circle cx="35" cy="50" r="3" fill="#000" />
              <circle cx="65" cy="50" r="3" fill="#000" />
              <path d="M45 65C45 65 50 70 55 65" stroke="#000" strokeWidth="2" strokeLinecap="round" />
            </svg>
          } 
          delay={3} top="25%" left="15%" 
        />
      </div>

      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white/40 backdrop-blur-xl border border-white/60 rounded-[48px] shadow-2xl p-8 md:p-12 relative z-10"
      >
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="absolute top-8 right-8 p-3 bg-white/50 hover:bg-white/80 rounded-2xl text-pink-500 transition-all cursor-pointer z-20"
        >
          {showSettings ? <X className="w-6 h-6" /> : <Settings2 className="w-6 h-6" />}
        </button>

        <AnimatePresence mode="wait">
          {showSettings ? (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-pink-600 mb-2">Customize Vibes</h2>
                <p className="text-pink-400 font-medium italic">Make the meter speak your language ✨</p>
              </div>

              <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {(Object.keys(DEFAULT_LEVELS) as ResultLevel[]).map((level) => (
                  <div key={level} className="bg-white/60 p-4 rounded-3xl border border-white/40 shadow-sm transition-all focus-within:ring-2 ring-pink-200">
                    <label className="text-[10px] uppercase font-black text-pink-400 tracking-widest block mb-2 px-1">
                      {level} Message
                    </label>
                    <textarea
                      value={customMessages[level]}
                      onChange={(e) => setCustomMessages(prev => ({ ...prev, [level]: e.target.value }))}
                      className="w-full bg-transparent border-none outline-none text-slate-700 font-medium resize-none text-sm placeholder:text-pink-100 italic"
                      rows={2}
                      placeholder={`What to say for ${level}...`}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowSettings(false);
                  confetti({
                    particleCount: 40,
                    spread: 60,
                    origin: { y: 0.8 },
                    colors: ['#F472B6']
                  });
                }}
                className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-black shadow-lg shadow-pink-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-5 h-5" />
                Apply My Vibes
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="main"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="text-center mb-10">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="inline-block p-5 bg-pink-100/50 rounded-full mb-6"
                >
                  <HeartHandshake className="w-16 h-16 text-pink-600" />
                </motion.div>
                <h1 className="text-5xl font-extrabold text-pink-600 mb-2 tracking-tight italic font-serif text-center w-full">Bestie Bond-O-Meter</h1>
                <p className="text-pink-400 font-medium text-lg italic text-center w-full">The ultimate vibe check 🍕</p>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative">
                    <label className="block text-xs uppercase tracking-widest text-pink-500 font-bold mb-3 ml-4">Your Name</label>
                    <input
                      type="text"
                      value={name1}
                      onChange={(e) => setName1(e.target.value)}
                      placeholder="e.g. Sarah"
                      className="w-full px-6 py-5 bg-white/70 border-none rounded-2xl shadow-sm focus:ring-4 ring-pink-200 outline-none transition-all text-xl text-pink-700 placeholder:text-pink-200"
                    />
                  </div>
                  
                  <div className="relative">
                    <label className="block text-xs uppercase tracking-widest text-pink-500 font-bold mb-3 ml-4">BFF's Name</label>
                    <input
                      type="text"
                      value={name2}
                      onChange={(e) => setName2(e.target.value)}
                      placeholder="e.g. Chloe"
                      className="w-full px-6 py-5 bg-white/70 border-none rounded-2xl shadow-sm focus:ring-4 ring-pink-200 outline-none transition-all text-xl text-pink-700 placeholder:text-pink-200"
                    />
                  </div>
                </div>

                <button
                  onClick={calculateFriendship}
                  disabled={!name1 || !name2 || isCalculating}
                  className="w-full py-5 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white rounded-2xl text-xl font-black shadow-lg shadow-pink-200 transition-all transform active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none cursor-pointer flex items-center justify-center gap-3"
                >
                  {isCalculating ? (
                    <>
                      <RefreshCcw className="animate-spin w-6 h-6" />
                      Consulting the chaos...
                    </>
                  ) : (
                    "Measure Our Bond!"
                  )}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    className="mt-12 pt-10 border-t border-white/40 text-center"
                  >
                    <div className="w-full bg-white/50 rounded-[2.5rem] p-8 md:p-10 border border-white/40 shadow-xl shadow-pink-100/20 mb-8 overflow-hidden">
                      <div className="flex justify-between items-end mb-6 px-2">
                        <span className="text-pink-400 text-sm font-bold uppercase tracking-wider">Stranger</span>
                        <motion.div 
                          key={result.score}
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex flex-col items-center"
                        >
                          <span className="text-pink-600 text-6xl font-black leading-none drop-shadow-sm">
                            {result.score}%
                          </span>
                        </motion.div>
                        <span className="text-pink-400 text-sm font-bold uppercase tracking-wider text-right">Inseparable</span>
                      </div>

                      <div className="w-full h-12 bg-pink-100/50 rounded-full overflow-hidden p-2 shadow-inner border border-white/20 relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${result.score}%`,
                            boxShadow: result.score > 50 ? `0 0 30px rgba(244, 114, 182, ${result.score / 100})` : 'none'
                          }}
                          transition={{ duration: 1.8, ease: "circOut" }}
                          className="h-full bg-gradient-to-r from-pink-300 via-pink-400 to-rose-400 rounded-full flex justify-end items-center px-1"
                        >
                          <motion.div 
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-8 h-8 bg-white rounded-full shadow-lg ring-4 ring-white/30"
                          />
                        </motion.div>
                      </div>

                      <div className={`mt-10 p-8 rounded-3xl ${result.color} backdrop-blur-md border border-white/40 shadow-sm relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 blur-[1px]">
                          <Sparkles className="w-20 h-20" />
                        </div>
                        <div className="flex justify-center mb-4 relative">
                          <motion.div
                            animate={{ 
                              y: [0, -12, 0],
                              rotate: [0, 10, -10, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className="p-5 bg-white/80 rounded-2xl shadow-sm border border-white"
                          >
                            {result.icon}
                          </motion.div>
                        </div>
                        <h3 className="text-3xl font-black text-pink-700 mb-3 uppercase italic tracking-tighter">{result.level}</h3>
                        <p className="text-pink-900 font-semibold text-xl italic bg-white/40 p-5 rounded-2xl leading-relaxed border border-white/20 shadow-inner">
                          "{result.message}"
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <button
                        onClick={() => handleShare(false)}
                        className={`px-10 py-4 bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black shadow-lg shadow-blue-200 transition-all transform active:scale-95 flex items-center justify-center gap-3 cursor-pointer w-full sm:w-auto ${!hasShared ? 'animate-pulse' : ''}`}
                      >
                        <Share2 className="w-5 h-5" />
                        {hasShared ? 'Shared!' : 'Brag & Unlock Secret!'}
                      </button>
                      
                      <button
                        onClick={reset}
                        className="px-10 py-4 bg-white/40 border-2 border-pink-200 text-pink-600 rounded-2xl font-black hover:bg-white/60 transition-all transform active:scale-95 flex items-center justify-center gap-3 cursor-pointer w-full sm:w-auto"
                      >
                        <RefreshCcw className="w-5 h-5" />
                        Test Another!
                      </button>
                    </div>

                    <AnimatePresence>
                      {hasShared && !showBonus && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-8 overflow-hidden"
                        >
                          <button
                            onClick={() => {
                              setShowBonus(true);
                              confetti({
                                particleCount: 150,
                                spread: 100,
                                origin: { y: 1 },
                                colors: ['#FFD700', '#F472B6']
                              });
                            }}
                            className="group relative w-full p-6 bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-dashed border-amber-300 rounded-[2rem] text-amber-700 font-black flex items-center justify-center gap-4 hover:bg-amber-200 transition-all cursor-pointer overflow-hidden"
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                              className="absolute inset-0 opacity-10"
                            >
                              <Sparkles className="w-full h-full p-2" />
                            </motion.div>
                            <Star className="w-8 h-8 fill-amber-400 text-amber-500 animate-bounce" />
                            <span className="text-xl italic uppercase tracking-tighter">Claim Your Friendship Destiny ✨</span>
                            <Star className="w-8 h-8 fill-amber-400 text-amber-500 animate-bounce" />
                          </button>
                        </motion.div>
                      )}

                      {showBonus && (
                        <motion.div
                          initial={{ opacity: 0, y: 50, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className="mt-10 p-10 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden ring-8 ring-indigo-500/30"
                        >
                          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                            {[...Array(20)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: Math.random() * 5 + 2, delay: Math.random() * 5 }}
                                className="absolute bg-white rounded-full"
                                style={{
                                  width: Math.random() * 4 + 1,
                                  height: Math.random() * 4 + 1,
                                  top: `${Math.random() * 100}%`,
                                  left: `${Math.random() * 100}%`,
                                }}
                              />
                            ))}
                          </div>

                          <div className="relative z-10 text-center">
                            <div className="inline-block p-4 bg-white/10 rounded-full mb-6">
                              <Sparkles className="w-12 h-12 text-yellow-300" />
                            </div>
                            <h4 className="text-2xl font-black text-yellow-300 mb-6 uppercase tracking-[0.2em] italic">The Secret Bond Prophecy</h4>
                            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 shadow-inner">
                              <p className="text-2xl font-medium leading-relaxed italic text-indigo-100">
                                {result.level === 'Inseparable' || result.level === 'Soulmates' 
                                  ? "Your frequencies are synced across the multiverse. In every lifetime, you are destined to find each other and share a large fries. 🍟🌌"
                                  : result.level === 'Besties' || result.level === 'Good Friends'
                                  ? "A thousand years ago, you probably fought side-by-side in a battle over the last slice of cake. The legend continues! ⚔️🍰"
                                  : "The stars say you're a work in progress. One more shared pizza could shift the entire cosmic alignment. Get eating! 🍕✨"}
                              </p>
                            </div>
                            <div className="mt-8 flex justify-center gap-6">
                              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>🪐</motion.div>
                              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}>🌜</motion.div>
                              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 1 }}>🔮</motion.div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="mt-8 flex flex-wrap justify-center gap-3 text-pink-400 opacity-60">
                      <span className="px-4 py-1 bg-white/40 rounded-full text-xs font-bold uppercase tracking-widest">#BFFVibes</span>
                      <span className="px-4 py-1 bg-white/40 rounded-full text-xs font-bold uppercase tracking-widest">#Soulmates</span>
                      <span className="px-4 py-1 bg-white/40 rounded-full text-xs font-bold uppercase tracking-widest">#BondTested</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 text-pink-400 text-[10px] font-bold uppercase tracking-widest text-center max-w-sm relative z-10 opacity-70"
      >
        * Our algorithms are powered by shared snacks and inside jokes.
      </motion.p>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(244, 114, 182, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(244, 114, 182, 0.5);
        }
      `}</style>
    </div>
  );
}

function FloatingIcon({ icon, delay, top, left }: { icon: JSX.Element; delay: number; top: string; left: string }) {
  return (
    <motion.div
      className="absolute"
      style={{ top, left }}
      animate={{
        y: [0, -25, 0],
        x: [0, 15, 0],
        rotate: [0, 15, -15, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      {icon}
    </motion.div>
  );
}
