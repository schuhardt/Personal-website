import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import QuoteScramble from '../components/QuoteScramble';
import FabricNetting from '../components/FabricNetting';

const LandingPage: React.FC = () => {
  const [rainbowMode, setRainbowMode] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const nettingResetRef = useRef<{ reset: () => void } | undefined>();
  const [cursorMode, setCursorMode] = useState('default');
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseDown = () => setCursorMode('scissor');
    const handleMouseUp = () => setCursorMode('default');
    
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const playClickSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 400;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.03, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    } catch (error) {
      console.log('Click sound not supported');
    }
  };

  const handleQuoteClick = () => {
    const newRainbowMode = !rainbowMode;
    setRainbowMode(newRainbowMode);
    if (nettingResetRef.current) {
      nettingResetRef.current.reset();
    }
    playClickSound();
  };

  const handleEnterClick = () => {
    playClickSound();
    setIsTransitioning(true);
    
    // Animate transition
    setTimeout(() => {
      navigate('/home');
    }, 1000);
  };

  const quote = "One must still have chaos in oneself to be able to give birth to a dancing star";

  return (
    <div className={`homepage-3d no-select relative min-h-screen overflow-hidden black-background ${
      cursorMode === 'scissor' ? 'cursor-scissor' : 'cursor-default'
    }`}>
      {/* Fabric Netting Background */}
      {!isTransitioning && (
        <FabricNetting 
          isActive={true} 
          onReset={nettingResetRef}
          rainbowMode={rainbowMode}
        />
      )}
      
      {/* Transition Overlay */}
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-white z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-20 h-20 border-4 border-black"
          />
        </motion.div>
      )}
      
      {/* Quote Overlay */}
      <div className={`quote-overlay transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <blockquote
          onClick={() => {
            if (nettingResetRef.current) {
              nettingResetRef.current.reset();
            }
            playClickSound();
          }}
          className="quote-3d quote-text neobrutalist-text text-white leading-tight max-w-2xl cursor-pointer hover:text-yellow-300 transition-colors"
        >
          <QuoteScramble text={quote} />
        </blockquote>
        <cite 
          className="block mt-4 text-lg text-white/80 neobrutalist-text cursor-pointer hover:text-yellow-300 transition-colors"
          onClick={handleQuoteClick}
        >
          — FRIEDRICH NIETZSCHE
        </cite>
      </div>
      
      {/* Enter Button */}
      <div className={`enter-text-floating transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEnterClick}
          className="enter-text-3d enter-text-small neobrutalist-text text-white cursor-pointer bg-transparent border-none outline-none hover:text-yellow-300 transition-colors"
        >
          enter
        </motion.button>
      </div>
    </div>
  );
};

export default LandingPage;