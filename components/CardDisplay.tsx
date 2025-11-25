import React, { useState } from 'react';
import { TarotCard } from '../types';
import { CARD_BACK_URL } from '../constants';

interface CardDisplayProps {
  card: TarotCard;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ card }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  return (
    <div className="flex flex-col items-center justify-center mb-8 animate-slide-up">
      <div className="relative w-64 h-96 md:w-72 md:h-[450px] rounded-xl overflow-hidden border-2 border-gold shadow-[0_0_30px_rgba(199,168,123,0.15)] bg-gray-900 group">
        
        {/* Placeholder / Back of Card / Loading State */}
        {(!loaded || error) && (
          <div className="absolute inset-0 z-10">
            <img 
              src={CARD_BACK_URL} 
              alt="Рубашка карты" 
              className="w-full h-full object-cover opacity-80"
            />
            {!error && (
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        )}

        {/* Main Image */}
        {!error && (
          <img
            src={card.imageUrl}
            alt={card.name}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(true)}
            onError={() => {
              console.error(`Failed to load image: ${card.imageUrl}`);
              setError(true);
              setLoaded(true);
            }}
          />
        )}

        {/* Error State Fallback (if even back fails, or just to show text on top of back) */}
        {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4 text-center z-20">
               <span className="font-cinzel text-4xl text-gold/50 mb-4">{card.id}</span>
               <h3 className="font-cinzel text-xl text-gold mb-2">{card.name}</h3>
               <p className="font-cormorant text-parchment/60 italic text-sm">Изображение недоступно</p>
            </div>
        )}

        {/* Overlay info - only show if image loaded successfully */}
        {loaded && !error && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none px-4">
                <p className="font-cinzel text-gold text-2xl tracking-widest drop-shadow-lg">{card.name}</p>
                <div className="h-px w-12 bg-gold/50 mx-auto my-2"></div>
                <p className="font-cormorant text-parchment/90 italic text-lg">{card.archetype}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CardDisplay;