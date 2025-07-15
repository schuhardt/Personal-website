import React, { useState, useEffect } from 'react';

interface QuoteScrambleProps {
  text: string;
  className?: string;
}

const QuoteScramble: React.FC<QuoteScrambleProps> = ({ text, className = '' }) => {
  const [scrambledText, setScrambledText] = useState(text);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?~`';

  useEffect(() => {
    if (hoveredIndex === null) {
      setScrambledText(text);
      return;
    }

    const interval = setInterval(() => {
      setScrambledText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index === hoveredIndex) {
              return specialChars[Math.floor(Math.random() * specialChars.length)];
            }
            return char;
          })
          .join('')
      );
    }, 100);

    return () => clearInterval(interval);
  }, [hoveredIndex, text]);

  return (
    <span className={`quote-scramble ${className}`}>
      {scrambledText.split(' ').map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block">
          {word.split('').map((char, charIndex) => {
            const globalIndex = scrambledText.substring(0, scrambledText.indexOf(word) + charIndex).length;
            return (
              <span
                key={charIndex}
                onMouseEnter={() => setHoveredIndex(globalIndex)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ display: 'inline-block' }}
              >
                {char}
              </span>
            );
          })}
          {wordIndex < scrambledText.split(' ').length - 1 && (
            <span style={{ display: 'inline-block', width: '0.5em' }}>&nbsp;</span>
          )}
        </span>
      ))}
    </span>
  );
};

export default QuoteScramble;