import React, { useState, useEffect } from 'react';

interface InputFormProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

// Type definition for Web Speech API
interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
    const SpeechRecognitionApi = SpeechRecognition || webkitSpeechRecognition;

    if (SpeechRecognitionApi) {
      const recognitionInstance = new SpeechRecognitionApi();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'ru-RU';

      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setText(prev => {
            const separator = prev && !prev.endsWith(' ') ? ' ' : '';
            return prev + separator + finalTranscript;
          });
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length > 5) {
      onSubmit(text);
    }
  };

  const toggleRecording = () => {
    if (!recognition) {
      alert("Ваш браузер не поддерживает голосовой ввод.");
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  const isDisabled = isLoading;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto flex flex-col gap-6 animate-fade-in">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-goldDim to-gold rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isDisabled}
          placeholder={isRecording ? "Слушаю вас..." : "Опишите вашу ситуацию, вопрос или душевное состояние..."}
          className={`relative w-full bg-void border border-goldDim/30 rounded-lg p-6 text-lg font-cormorant text-parchment placeholder-gray-600 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all min-h-[200px] resize-none leading-relaxed ${isRecording ? 'border-red-500/50' : ''}`}
        />
        
        {/* Microphone Button */}
        <button
          type="button"
          onClick={toggleRecording}
          disabled={isDisabled}
          className={`absolute bottom-4 right-4 p-3 rounded-full transition-all duration-300 z-10 
            ${isRecording 
              ? 'bg-red-900/80 text-red-200 animate-pulse border border-red-500' 
              : 'bg-goldDim/20 text-gold hover:bg-gold hover:text-void border border-gold/30'
            }
            ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          title={isRecording ? "Остановить запись" : "Голосовой ввод"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isRecording ? (
              <>
                <rect x="9" y="9" width="6" height="6" />
              </>
            ) : (
              <>
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </>
            )}
          </svg>
        </button>
      </div>

      <button
        type="submit"
        disabled={text.length <= 5 || isDisabled}
        className={`
          w-full py-4 rounded-lg font-cinzel font-bold text-lg uppercase tracking-widest transition-all duration-500
          ${text.length > 5 && !isDisabled
            ? 'bg-gradient-to-r from-goldDim to-gold text-void shadow-[0_0_20px_rgba(199,168,123,0.3)] hover:shadow-[0_0_30px_rgba(199,168,123,0.5)] transform hover:-translate-y-1'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-pulse">Раскрываем Карты...</span>
          </span>
        ) : (
          "Получить Толкование"
        )}
      </button>
    </form>
  );
};

export default InputForm;
