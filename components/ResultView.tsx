import React from 'react';
import CardDisplay from './CardDisplay';

interface ResultViewProps {
  cardName: string;
  imageUrl: string;
  interpretation: string;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ cardName, imageUrl, interpretation, onReset }) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center animate-fade-in pb-12">
      <CardDisplay cardName={cardName} imageUrl={imageUrl} />

      <div className="w-full bg-void/50 border-t border-b border-goldDim/30 py-8 px-4 md:px-12 backdrop-blur-sm rounded-lg mt-8">
        <div className="mb-8 text-center border-b border-goldDim/10 pb-4">
          <h2 className="font-cinzel text-3xl text-gold mb-2">Архетип: {cardName}</h2>
          <p className="font-cormorant text-parchment/50 italic">Экзистенциальный Анализ</p>
        </div>

        <div className="prose prose-invert max-w-none">
           <p className="font-cormorant text-xl text-parchment/90 leading-relaxed text-justify whitespace-pre-line">
             {interpretation}
           </p>
        </div>
      </div>

      <button
        onClick={onReset}
        className="mt-12 px-8 py-3 border border-goldDim text-goldDim font-cinzel text-sm hover:text-gold hover:border-gold hover:bg-gold/10 transition-all duration-300 tracking-widest uppercase rounded"
      >
        Новый Анализ
      </button>
    </div>
  );
};

export default ResultView;