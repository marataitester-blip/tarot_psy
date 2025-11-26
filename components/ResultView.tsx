
import React from 'react';
import { TarotCard } from '../types';
import CardDisplay from './CardDisplay';

interface ResultViewProps {
  card: TarotCard;
  interpretation: string;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ card, interpretation, onReset }) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center animate-fade-in pb-12">
      <CardDisplay card={card} />

      <div className="w-full bg-void/50 border-t border-b border-goldDim/30 py-8 px-4 md:px-12 backdrop-blur-sm">
        <div className="mb-6 text-center">
          <h2 className="font-cinzel text-3xl text-gold">Психологический Портрет</h2>
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
