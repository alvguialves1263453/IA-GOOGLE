import React, { useState, useCallback } from 'react';
import { Creative, MARKETING_ANGLES } from './types';
import { generateCreativeImage } from './services/geminiService';
import CreativeCard from './components/CreativeCard';
import { SparklesIcon } from './components/Icons';

const App: React.FC = () => {
  const [productDescription, setProductDescription] = useState('');
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  const handleGenerateAll = async () => {
    if (!productDescription.trim()) return;

    setIsGeneratingAll(true);
    
    // Create placeholders
    const newCreatives: Creative[] = MARKETING_ANGLES.map((angle, index) => ({
      id: Date.now().toString() + index,
      status: 'loading',
      productDescription: productDescription,
      marketingAngle: angle,
    }));

    setCreatives(newCreatives);

    // Trigger generations in parallel, but handle state updates individually
    // This allows images to pop in as they finish
    MARKETING_ANGLES.forEach((angle, index) => {
       const creativeId = newCreatives[index].id;
       generateCreativeImage(productDescription, angle)
        .then((imageUrl) => {
          setCreatives(prev => prev.map(c => 
            c.id === creativeId ? { ...c, status: 'success', imageUrl } : c
          ));
        })
        .catch(() => {
          setCreatives(prev => prev.map(c => 
            c.id === creativeId ? { ...c, status: 'error' } : c
          ));
        });
    });

    setIsGeneratingAll(false);
  };

  const handleRegenerateOne = useCallback(async (id: string) => {
    const creativeToRegen = creatives.find(c => c.id === id);
    if (!creativeToRegen) return;

    // Set to loading
    setCreatives(prev => prev.map(c => c.id === id ? { ...c, status: 'loading' } : c));

    try {
      const imageUrl = await generateCreativeImage(creativeToRegen.productDescription, creativeToRegen.marketingAngle);
      setCreatives(prev => prev.map(c => c.id === id ? { ...c, status: 'success', imageUrl } : c));
    } catch (error) {
      setCreatives(prev => prev.map(c => c.id === id ? { ...c, status: 'error' } : c));
    }
  }, [creatives]);

  const handleDelete = useCallback((id: string) => {
    setCreatives(prev => prev.filter(c => c.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-200 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-primary-600 to-indigo-700 rounded-lg text-white">
             <SparklesIcon />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            AdGenius<span className="text-primary-600">AI</span>
          </h1>
        </div>
        <div className="hidden md:block text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
           v2.5 Flash Powered
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 max-w-6xl">
        
        {/* Input Section */}
        <section className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Crie anúncios que <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">convertem</span> em segundos.
          </h2>
          <p className="text-slate-500 mb-8 text-lg">
            Descreva seu produto e nossa IA gerará 4 variações visuais otimizadas para Facebook Ads.
          </p>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
            <div className="relative bg-white p-2 rounded-2xl shadow-xl">
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Ex: Tênis de corrida ultraleve cor neon, solado de alta performance, ideal para maratonas..."
                className="w-full min-h-[100px] p-4 text-base text-slate-800 placeholder:text-slate-400 bg-transparent border-none outline-none resize-none focus:ring-0"
              />
              <div className="flex justify-between items-center px-2 pb-2 mt-2 border-t border-slate-100 pt-3">
                <span className="text-xs text-slate-400 font-medium ml-2">
                  {productDescription.length} caracteres
                </span>
                <button
                  onClick={handleGenerateAll}
                  disabled={!productDescription.trim() || isGeneratingAll}
                  className={`
                    px-8 py-3 rounded-xl font-bold text-white transition-all duration-200 shadow-md flex items-center gap-2
                    ${!productDescription.trim() || isGeneratingAll 
                      ? 'bg-slate-300 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-primary-600 to-indigo-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'}
                  `}
                >
                  {isGeneratingAll ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Gerando...
                    </>
                  ) : (
                    <>
                      <SparklesIcon /> Gerar Criativos
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Results Grid */}
        <section>
          {creatives.length > 0 && (
             <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-slate-400 text-sm font-medium uppercase tracking-widest">Resultados</span>
                <div className="h-px bg-slate-200 flex-1"></div>
             </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {creatives.map((creative) => (
              <CreativeCard
                key={creative.id}
                creative={creative}
                onDelete={handleDelete}
                onRegenerate={handleRegenerateOne}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-200 bg-white">
        <p>Criado automaticamente por IA — 2025</p>
      </footer>
    </div>
  );
};

export default App;