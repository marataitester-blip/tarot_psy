import React, { useState } from 'react';
import { TarotCard } from '../types';
import CardDisplay from './CardDisplay';
import { generateSpeech } from '../services/geminiService';

interface ResultViewProps {
  card: TarotCard;
  interpretation: string;
  onReset: () => void;
}

// Helper to decode Base64
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to decode PCM to AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const ResultView: React.FC<ResultViewProps> = ({ card, interpretation, onReset }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const handlePlayAudio = async () => {
    if (isPlaying) return;
    setIsLoadingAudio(true);

    try {
      const base64Audio = await generateSpeech(interpretation);
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(
        decode(base64Audio),
        audioContext,
        24000,
        1
      );

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      
      source.onended = () => {
        setIsPlaying(false);
      };

      source.start();
      setIsPlaying(true);
    } catch (error) {
      console.error("Audio playback error:", error);
      alert("Не удалось воспроизвести аудио.");
    } finally {
      setIsLoadingAudio(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center animate-fade-in pb-12">
      <CardDisplay card={card} />

      <div className="w-full bg-void/50 border-t border-b border-goldDim/30 py-8 px-4 md:px-12 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-cinzel text-3xl text-gold text-center flex-1">Психологический Портрет</h2>
          
          <button
            onClick={handlePlayAudio}
            disabled={isPlaying || isLoadingAudio}
            className={`
              ml-4 p-3 rounded-full border border-gold/40 transition-all duration-300
              ${isPlaying 
                ? 'text-gold animate-pulse bg-gold/10' 
                : 'text-goldDim hover:text-gold hover:border-gold hover:bg-goldDim/10'
              }
              ${isLoadingAudio ? 'opacity-50 cursor-wait' : ''}
            `}
            title="Прослушать толкование"
          >
            {isLoadingAudio ? (
              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isPlaying ? (
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