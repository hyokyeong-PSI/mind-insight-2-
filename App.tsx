
import React, { useState } from 'react';
import Intro from './components/Intro';
import Diagnosis from './components/Diagnosis';
import Report from './components/Report';
import { DiagnosisResult, ViewType } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('intro');
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const handleStartDiagnosis = () => {
    setResult(null);
    setView('diagnosis');
  };

  const handleDiagnosisComplete = (data: DiagnosisResult) => {
    setResult(data);
    setView('report');
  };

  const handleReset = () => {
    if (confirm('진단 결과가 사라집니다. 새로 시작하시겠습니까?')) {
      setResult(null);
      setView('intro');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col text-[#44403c]">
      <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-lg border-b border-[#e7e5e4]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('intro')}>
            <div className="w-10 h-10 bg-[#84a98c] rounded-[1.2rem] flex items-center justify-center text-white shadow-md shadow-[#84a98c]/20 transition-transform group-hover:scale-110">
              <i className="fas fa-seedling"></i>
            </div>
            <span className="font-bold text-xl tracking-tight text-[#292524]">
              MindInsight <span className="text-[#84a98c]">NEO</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {view !== 'intro' && (
              <button 
                onClick={handleReset}
                className="text-sm font-medium text-[#78716c] hover:text-[#84a98c] transition-colors"
              >
                <i className="fas fa-redo-alt mr-2"></i>새로 진단하기
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4">
          {view === 'intro' && <Intro onStartDiagnosis={handleStartDiagnosis} />}
          {view === 'diagnosis' && <Diagnosis onComplete={handleDiagnosisComplete} />}
          {view === 'report' && result && <Report result={result} />}
        </div>
      </main>

      <footer className="bg-[#44403c] text-[#a8a29e] py-12 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <a 
              href="https://www.psicompass.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-bold text-lg text-stone-200 hover:text-white transition-colors"
            >
              PSI COMPASS
            </a>
          </div>
          <p className="text-xs font-light">본 서비스는 별도의 데이터를 저장하지 않는 일회성 심리 진단 도구입니다.</p>
          <p className="text-xs font-light">© 2024 PSI COMPASS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
