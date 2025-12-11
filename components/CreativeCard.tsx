import React from 'react';
import { Creative } from '../types';
import { DownloadIcon, RefreshIcon, TrashIcon } from './Icons';

interface CreativeCardProps {
  creative: Creative;
  onDelete: (id: string) => void;
  onRegenerate: (id: string) => void;
}

const CreativeCard: React.FC<CreativeCardProps> = ({ creative, onDelete, onRegenerate }) => {
  const handleDownload = () => {
    if (creative.imageUrl) {
      const link = document.createElement('a');
      link.href = creative.imageUrl;
      link.download = `ad-creative-${creative.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="group relative w-full aspect-square bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Content Area */}
      <div className="w-full h-full flex items-center justify-center bg-slate-50">
        {creative.status === 'loading' && (
          <div className="flex flex-col items-center justify-center space-y-3 p-4 text-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 font-medium animate-pulse">Criando arte com IA...</p>
            <span className="text-xs text-primary-600 font-semibold bg-primary-50 px-2 py-1 rounded-full">
              {creative.marketingAngle}
            </span>
          </div>
        )}

        {creative.status === 'error' && (
          <div className="flex flex-col items-center p-6 text-center">
            <p className="text-red-500 text-sm mb-3">Falha ao gerar imagem.</p>
            <button
              onClick={() => onRegenerate(creative.id)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-semibold transition-colors"
            >
              <RefreshIcon className="w-4 h-4" /> Tentar Novamente
            </button>
          </div>
        )}

        {creative.status === 'success' && creative.imageUrl && (
          <>
            <img
              src={creative.imageUrl}
              alt="Generated Creative"
              className="w-full h-full object-cover"
            />
            {/* Tag Overlay */}
            <div className="absolute top-3 left-3">
               <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/20 uppercase tracking-wider">
                {creative.marketingAngle}
               </span>
            </div>
            
            {/* Hover Actions Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4">
              <button
                onClick={handleDownload}
                className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 bg-white text-slate-900 hover:bg-primary-50 hover:text-primary-600 font-semibold py-2 px-6 rounded-full flex items-center gap-2 shadow-lg"
              >
                <DownloadIcon /> Baixar
              </button>
              
              <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                <button
                  onClick={() => onRegenerate(creative.id)}
                  className="bg-slate-800/80 hover:bg-primary-600 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
                  title="Gerar Novamente"
                >
                  <RefreshIcon />
                </button>
                <button
                  onClick={() => onDelete(creative.id)}
                  className="bg-slate-800/80 hover:bg-red-500 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
                  title="Excluir"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreativeCard;