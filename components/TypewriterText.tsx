
import React, { useState, useEffect, useRef } from 'react';
import { playSfx } from './AudioPlayer';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ text, speed = 25, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const index = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText("");
    index.current = 0;
    
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      if (index.current < text.length) {
        setDisplayedText(prev => prev + text.charAt(index.current));
        index.current++;
        
        // Play very subtle tick every 2 chars to not be annoying
        if (index.current % 2 === 0) {
            playSfx('TYPE'); // Quieter typing sound
        }
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, speed, onComplete]);

  return <span>{displayedText}</span>;
};
