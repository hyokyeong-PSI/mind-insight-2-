
import React, { useState, useMemo } from 'react';
import { NEO_QUESTIONS } from '../constants';
import { Domain, DiagnosisResult } from '../types';
import { generateInterpretation } from '../services/geminiService';

interface DiagnosisProps {
  onComplete: (result: DiagnosisResult) => void;
}

const Diagnosis: React.FC<DiagnosisProps> = ({ onComplete }) => {
  const shuffledQuestions = useMemo(() => {
    return [...NEO_QUESTIONS].sort(() => Math.random() - 0.5);
  }, []);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const totalQuestions = shuffledQuestions.length;
  const currentQuestion = shuffledQuestions[currentStep];

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    if (currentStep < totalQuestions - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 250);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const calculateResults = async () => {
    setIsAnalyzing(true);
    try {
      const domainScores: Record<string, number> = {
        [Domain.Negative Sensitivity]: 0,
        [Domain.Extraversion]: 0,
        [Domain.Openness to Experience]: 0,
        [Domain.Agreeableness]: 0,
        [Domain.Conscientiousness]: 0,
      };

      NEO_QUESTIONS.forEach(q => {
        let score = answers[q.id] || 3;
        if (q.reverse) {
          score = 6 - score;
        }
        domainScores[q.domain] += score;
      });

      const result = await generateInterpretation(domainScores as any);
      // 진단 완료 시점 기록
      onComplete({
        ...result,
        createdAt: Date.now()
      });
    } catch (error) {
      console.error("Diagnosis error:", error);
      alert("분석 도중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-8 animate-fadeIn">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-[#84a98c]/20 border-t-[#84a98c] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-[#84a98c]">
             <i className="fas fa-leaf animate-pulse"></i>
          </div>
        </div>
        <div className="text-center space-y-3">
          <h3 className="text-2xl font-bold text-[#292524]">당신의 마음을 깊이 읽고 있습니다...</h3>
          <p className="text-[#78716c] font-light">모든 답변을 바탕으로 정밀한 분석 리포트를 생성 중입니다.</p>
        </div>
      </div>
    );
  }

  const progress = ((currentStep + 1) / totalQuestions) * 100;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8 animate-slideUp">
      <div className="px-6">
        <div className="flex justify-between items-center text-sm font-medium text-[#a8a29e] mb-4">
          <span className="bg-white px-3 py-1 rounded-full shadow-sm">문항 {currentStep + 1} / {totalQuestions}</span>
          <span className="text-[#84a98c] font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-[#e7e5e4] h-1.5 rounded-full overflow-hidden shadow-inner">
          <div 
            className="bg-[#84a98c] h-full transition-all duration-500 ease-out rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-sm border border-[#f5f5f4] flex flex-col min-h-[480px]">
        <div className="flex-grow">
          <div className="h-4 mb-6"></div> 
          
          <h2 className="text-2xl md:text-3xl font-medium text-[#292524] leading-relaxed mb-12">
            {currentQuestion.text}
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {[
              { label: '전혀 그렇지 않다', value: 1 },
              { label: '그렇지 않다', value: 2 },
              { label: '보통이다', value: 3 },
              { label: '그렇다', value: 4 },
              { label: '매우 그렇다', value: 5 },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full py-4 px-8 rounded-2xl border-2 text-left transition-all duration-200 group flex items-center justify-between ${
                  answers[currentQuestion.id] === option.value
                    ? 'border-[#84a98c] bg-[#f0f3f0] text-[#425a46] font-bold shadow-md shadow-[#84a98c]/10'
                    : 'border-[#f5f5f4] hover:border-[#e7e5e4] hover:bg-[#fafaf9] text-[#78716c]'
                }`}
              >
                <span className="text-lg">{option.label}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                   answers[currentQuestion.id] === option.value ? 'bg-[#84a98c] border-[#84a98c]' : 'border-[#e7e5e4] group-hover:border-[#d6d3d1]'
                }`}>
                   {answers[currentQuestion.id] === option.value && <i className="fas fa-check text-white text-[10px]"></i>}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-50 flex flex-col items-center gap-6">
          <div className="flex w-full justify-between items-center">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
                currentStep === 0 
                ? 'text-stone-300 cursor-not-allowed opacity-0' 
                : 'text-[#a8a29e] hover:text-[#84a98c] hover:bg-[#f0f3f0] active:scale-95'
              }`}
            >
              <i className="fas fa-chevron-left"></i> 이전 문항으로 돌아가기
            </button>
            
            {currentStep === totalQuestions - 1 && answers[currentQuestion.id] && (
              <button
                onClick={calculateResults}
                className="px-10 py-4 bg-[#84a98c] text-white rounded-full font-bold shadow-xl shadow-[#84a98c]/30 hover:bg-[#6b8e23] transform transition hover:-translate-y-1 active:scale-95 animate-bounce"
              >
                모든 답변 분석 완료 <i className="fas fa-sparkles ml-2"></i>
              </button>
            )}
          </div>
          <p className="text-[#a8a29e] text-[11px] font-light">나의 솔직한 모습에 가장 가까운 것을 선택해 주세요.</p>
        </div>
      </div>
    </div>
  );
};

export default Diagnosis;
