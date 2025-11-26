
import React, { useState } from 'react';

interface InputFormProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length > 5) {
      onSubmit(text);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto flex flex-col gap-6 animate-fade-in">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-goldDim to-gold rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
          placeholder="Опишите вашу ситуацию, вопрос или душевное состояние..."
          className="relative w-full bg-void border border-goldDim/30 rounded-lg p-6 text-lg font-cormorant text-parchment placeholder-gray-600 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all min-h-[200px] resize-none leading-relaxed"
        />
      </div>

      <button
        type="submit"
        disabled={text.length <= 5 || isLoading}
        className={`
          w-full py-4 rounded-lg font-cinzel font-bold text-lg uppercase tracking-widest transition-all duration-500
          ${text.length > 5 && !isLoading
            ? 'bg-gradient-to-r from-goldDim to-gold text-void shadow-[0_0_20px_rgba(199,168,123,0.3)] hover:shadow-[0_0_30px_rgba(199,168,123,0.5)] transform hover:-translate-y-1'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        {isLoading ? (
          <span className="animate-pulse">Раскрываем Карты...</span>
        ) : (
          "Получить Толкование"
        )}
      </button>
    </form>
  );
};

export default InputForm;
