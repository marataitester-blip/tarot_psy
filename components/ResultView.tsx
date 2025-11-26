
import React from 'react';
import { TarotCard } from '../types';
import CardDisplay from './CardDisplay';

interface ResultViewProps {
  card: TarotCard;
  interpretation: string;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ card, interpretation, onReset }) => {
  // Function to render markdown-like text safely
  const renderContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Handle Bold headers like "**Text**"
      if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
        return (
          <h3 key={index} className="font-cinzel text-xl text-gold mt-6 mb-2 block">
            {line.replace(/\*\*/g, '')}
          </h3>
        );
      }
      // Handle Bold segments inside text "word **bold** word"
      const parts = line.split(/(\*\*.*?\*\*)/g);
      
      if (line.trim() === '') return <div key={index} className="h-4"></div>;

      return (
        <p key={index} className="font-cormorant text-xl text-parchment/90 leading-relaxed mb-4 text-justify">
          {parts.map((part, i) => {
             if (part.startsWith('**') && part.endsWith('**')) {
               return <span key={i} className="text-gold font-semibold">{part.replace(/\*\*/g, '')}</span>;
             }
             return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center animate-fade-in pb-12">
      <CardDisplay card={card} />

      <div className="w-full bg-void/50 border-t border-b border-goldDim/30 py-8 px-4 md:px-12 backdrop-blur-sm rounded-lg mt-8">
        <div className="mb-8 text-center border-b border-goldDim/10 pb-4">
          <h2 className="font-cinzel text-3xl text-gold mb-2">Психологический Портрет</h2>
          <p className="font-cormorant text-parchment/50 italic">Глубинный анализ архетипа</p>
        </div>

        <div className="prose prose-invert max-w-none">
           {renderContent(interpretation)}
        </div>
      </div>

      <button
        onClick={onReset}
        className="mt-12 px-8 py-3 border border-goldDim text-goldDim font-cinzel text-sm hover:text-gold hover:border-gold hover:bg-gold/10 transition-all duration-300 tracking-widest uppercase rounded"
      >
        Задать другой вопрос
      </button>
    </div>
  );
};

export default ResultView;
