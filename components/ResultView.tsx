import React, { useState, useEffect } from 'react';
import { TarotCard } from '../types';
import CardDisplay from './CardDisplay';

interface ResultViewProps {
  card: TarotCard;
  interpretation: string;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ card, interpretation, onReset }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Stop speaking when unmounting or changing
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handlePlayAudio = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const u = new SpeechSynthesisUtterance(interpretation);
    u.lang = 'ru-RU';
    u.rate = 0.9; // Slightly slower for dramatic effect

    // Try to find a male voice if available (Russian)
    const voices = window.speechSynthesis.getVoices();
    const russianVoice = voices.find(v => v.lang.includes('ru') && v.name.toLowerCase().includes('male')) 
                      || voices.find(v => v.lang.includes('ru'));
    
    if (russianVoice) {
      u.voice = russianVoice;
    }

    u.onend = () => {
      setIsPlaying(false);
    };

    u.onerror = () => {
      setIsPlaying(false);
    };

    setUtterance(u);
    window.speechSynthesis.speak(u);
    setIsPlaying(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center animate-fade-in pb-12">
      <CardDisplay card={card} />

      <div className="w-full bg-void/50 border-t border-b border-goldDim/30 py-8 px-4 md:px-12 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-cinzel text-3xl text-gold text-center flex-1">Психологический Портрет</h2>
          
          <button
            onClick={handlePlayAudio}
            className={`
              ml-4 p-3 rounded-full border border-gold/40 transition-all duration-300
              ${isPlaying 
                ? 'text-gold animate-pulse bg-gold/10' 
                : 'text-goldDim hover:text-gold hover:border-gold hover:bg-goldDim/10'
              }
            `}
            title={isPlaying ? "Остановить" : "Прослушать толкование"}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </button>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="font-cormorant text-xl md:text-2xl leading-relaxed text-parchment text-justify first-letter:text-5xl first-letter:text-gold first-letter:mr-3 first-letter:float-left first-letter:font-cinzel">
            {interpretation}
          </p>
        </div>
      </div>

      <button
        onClick={onReset}
        className="mt-12 px-8 py-2 border border-goldDim text-goldDim font-cinzel text-sm hover:text-gold hover:border-gold transition-colors duration-300 tracking-widest uppercase"
      >
        Задать другой вопрос
      </button>
    </div>
  );
};

export default ResultView;
