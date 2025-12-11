
import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { GamePhase } from '../types';
import { AUDIO_URLS } from '../constants';

interface AudioPlayerProps {
  phase: GamePhase;
}

// --- SYNTHESIZER FOR SFX (Guaranteed to work) ---
const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
let audioCtx: AudioContext | null = null;

const getAudioCtx = () => {
  if (!audioCtx) audioCtx = new AudioContextClass();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
};

export const playSfx = (type: 'SELECT' | 'ERROR' | 'LOOP' | 'WIN' | 'START' | 'TYPE') => {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case 'TYPE':
        // Very subtle, deep click (mechanical keyboard feel)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        gainNode.gain.setValueAtTime(0.05, now); // Very quiet
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;

      case 'SELECT':
        // High blip
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      
      case 'START':
        // Power up
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.3);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;

      case 'ERROR':
        // Low buzz
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.2);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;

      case 'LOOP':
        // Magical sweep
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 1);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.5);
        gainNode.gain.linearRampToValueAtTime(0, now + 1.5);
        osc.start(now);
        osc.stop(now + 1.5);
        break;
        
      case 'WIN':
        // Major arpeggio
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.4); // C6
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
        break;
    }
  } catch (e) {
    console.error("Audio synth error", e);
  }
};

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ phase }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const currentUrlRef = useRef<string>("");

  const getTrackForPhase = (p: GamePhase): string => {
    switch (p) {
      case GamePhase.START_MENU:
        return AUDIO_URLS.MUSIC.MENU;
      case GamePhase.INTRO:
      case GamePhase.CH1_CHOICE:
      case GamePhase.GEAR_SELECTION:
        return AUDIO_URLS.MUSIC.EXPLORE;
      case GamePhase.HIKING_GAME:
        return AUDIO_URLS.MUSIC.HIKING;
      case GamePhase.CH1_RESOLUTION:
      case GamePhase.CH2_RESOLUTION:
      case GamePhase.ENDING_FAIL:
        return AUDIO_URLS.MUSIC.DANGER;
      case GamePhase.ETHER_LOOP:
      case GamePhase.CH3_REFLECTION:
      case GamePhase.ETHER_PACKAGE:
        return AUDIO_URLS.MUSIC.ETHER;
      case GamePhase.ENDING_WIN:
        return AUDIO_URLS.MUSIC.WIN;
      default:
        return AUDIO_URLS.MUSIC.EXPLORE;
    }
  };

  useEffect(() => {
    const targetUrl = getTrackForPhase(phase);
    
    // Always update if the URL is different
    if (currentUrlRef.current !== targetUrl) {
      currentUrlRef.current = targetUrl;
      audioRef.current.src = targetUrl;
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
      
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => console.log("Playback interrupted", e));
        }
      }
    }
  }, [phase, isPlaying]);

  // Handle global unlock
  useEffect(() => {
    const handleInteract = () => {
       if (!isPlaying) {
         setIsPlaying(true);
         getAudioCtx(); // Wake up AudioContext
         const playPromise = audioRef.current.play();
         if (playPromise !== undefined) {
             playPromise.catch(e => console.log("Autoplay caught on interaction", e));
         }
       }
    };

    window.addEventListener('click', handleInteract, { once: true });
    window.addEventListener('keydown', handleInteract, { once: true });
    return () => {
      window.removeEventListener('click', handleInteract);
      window.removeEventListener('keydown', handleInteract);
    };
  }, [isPlaying]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      getAudioCtx();
    }
  };

  return (
    <button 
      onClick={toggleMute}
      className={`absolute top-4 right-4 z-50 p-2 rounded-full border-2 transition-all ${
        isPlaying 
        ? 'bg-emerald-900/50 border-emerald-500 text-emerald-300' 
        : 'bg-red-900/50 border-red-500 text-red-300'
      } backdrop-blur-sm hover:scale-110`}
      title={isPlaying ? "Mute Music" : "Enable Music"}
    >
      {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
    </button>
  );
};
