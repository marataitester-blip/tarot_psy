import React, { useState } from 'react';
import { CARD_BACK_URL } from '../constants';

interface CardDisplayProps {
  cardName: string;
  imageUrl: string;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ cardName, imageUrl }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  return (
    <div className="flex flex-col items-center justify-center mb-8 animate-slide-up">
      <div className="relative w-64 h-96 md:w-80 md:h-[500px] rounded-xl overflow-hidden border-2 border-gold shadow-[0_0_30px_rgba(199,168,123,0.15)] bg-gray-900 group">
        
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
            src={imageUrl}
            alt={cardName}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(true)}
            onError={() => {
              console.error(`Failed to load image: ${imageUrl}`);
              setError(true);
              setLoaded(true);
            }}
          />
        )}

        {/* Error State Fallback */}
        {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4 text-center z-20">
               <h3 className="font-cinzel text-xl text-gold mb-2">{cardName}</h3>
               <p className="font-cormorant text-parchment/60 italic text-sm">Образ недоступен</p>
            </div>
        )}

        {/* Overlay info */}
        {loaded && !error && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none px-4">
                <p className="font-cinzel text-gold text-2xl tracking-widest drop-shadow-lg">{cardName}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CardDisplay;