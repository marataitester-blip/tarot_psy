import React, { useState } from 'react';
import { AppState } from './types';
import { analyzeSituation } from './services/geminiService';
import InputForm from './components/InputForm';
import ResultView from './components/ResultView';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [resultData, setResultData] = useState<{cardName: string, interpretation: string, imageUrl: string} | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalysis = async (text: string) => {
    setAppState(AppState.ANALYZING);
    setErrorMsg(null);

    try {
      const result = await analyzeSituation(text);
      setResultData(result);
      setAppState(AppState.RESULT);
    } catch (err: any) {
      console.error(err);
      setAppState(AppState.ERROR);
      setErrorMsg("Связь с бессознательным прервана. Попробуйте еще раз.");
    }
  };

  const resetApp = () => {
    setAppState(AppState.IDLE);
    setResultData(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-void flex flex-col selection:bg-gold/30 selection:text-white">
      {/* Decorative Header */}
      <header className="w-full py-8 md:py-12 border-b border-goldDim/20 bg-black/20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="font-cinzel text-4xl md:text-5xl text-gold mb-2 tracking-widest">ТАРО ПСИХЕЯ</h1>
          <p className="font-cormorant text-parchment/60 text-lg md:text-xl italic">
            Зеркало Души • Llama 3 • Pollinations
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        
        {appState === AppState.IDLE && (
          <div className="w-full max-w-3xl flex flex-col items-center">
             <div className="mb-8 text-center max-w-lg">
                <p className="font-cormorant text-xl text-parchment/80 leading-relaxed">
                  Опишите вашу ситуацию. Экзистенциальный ИИ подберет архетип и создаст уникальный образ вашего состояния.
                </p>
             </div>
             <InputForm onSubmit={handleAnalysis} isLoading={false} />
          </div>
        )}

        {appState === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center gap-6 animate-pulse-gold p-12 rounded-full border border-gold/10">
            <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="font-cinzel text-gold text-xl animate-pulse">Анализ Архетипов...</p>
          </div>
        )}

        {appState === AppState.RESULT && resultData && (
          <ResultView 
            cardName={resultData.cardName}
            imageUrl={resultData.imageUrl}
            interpretation={resultData.interpretation} 
            onReset={resetApp} 
          />
        )}

        {appState === AppState.ERROR && (
          <div className="text-center animate-fade-in max-w-md">
            <p className="font-cinzel text-red-400 text-2xl mb-4">Ошибка</p>
            <p className="font-cormorant text-parchment mb-8">{errorMsg}</p>
            <button
              onClick={resetApp}
              className="px-6 py-2 border border-gold text-gold font-cinzel hover:bg-gold hover:text-void transition-colors"
            >
              Попробовать Снова
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-goldDim/20 text-center">
        <p className="font-cormorant text-parchment/40 text-sm">
          Powered by OpenRouter & Pollinations AI
        </p>
      </footer>
    </div>
  );
};

export default App;