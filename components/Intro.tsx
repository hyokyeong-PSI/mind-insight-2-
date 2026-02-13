
import React from 'react';

interface IntroProps {
  onStartDiagnosis: () => void;
}

const Intro: React.FC<IntroProps> = ({ onStartDiagnosis }) => {
  return (
    <div className="max-w-5xl mx-auto py-16 px-6 space-y-24 animate-fadeIn">
      <section className="text-center space-y-8">
        <div className="inline-block px-4 py-1.5 bg-[#f0f3f0] text-[#84a98c] rounded-full text-xs font-bold tracking-wider mb-2">
          GENTLE SELF-DISCOVERY
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-[#292524] leading-[1.12] tracking-tight">
          잠시 멈춰,
          <span className="block mt-2">
          <span className="text-[#84a98c]">나의 마음</span>과 마주하세요
          </span>
        </h1>
        <p className="text-lg md:text-xl text-[#78716c] max-w-2xl mx-auto leading-[1.6] font-normal">
          로그인 없이 바로 시작하는 정밀 성격 진단. <br/>
          과학적인 진단을 통해 평온한 일상을 위한 나만의 템포를 찾아보세요.
        </p>
        <div className="relative pt-12 group">
          <div className="absolute inset-0 bg-gradient-to-t from-[#fafaf9] via-transparent to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200&h=500" 
            alt="Forest Sunlight" 
            className="rounded-[3rem] shadow-sm w-full object-cover h-80 md:h-96 transition-all group-hover:brightness-90" 
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center pt-12">
            <button 
              onClick={onStartDiagnosis}
              className="bg-[#84a98c] text-white px-10 py-4 rounded-full text-lg font-bold shadow-2xl hover:bg-[#6b8e23] transition-all transform hover:scale-105 active:scale-95"
            >
              내 마음 진단하기 <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-[#292524]">신뢰할 수 있는 <br/>마음 지표, Big5</h2>
          <p className="text-[#78716c] leading-relaxed font-light text-lg">
            성격 심리학의 글로벌 표준인 Big Five 모델을 기반으로 합니다. 
            단순한 성향 파악을 넘어, 강점과 보완점을 정밀하게 분석하여 당신의 성장을 돕습니다.
          </p>
          <div className="space-y-4 pt-4">
            {[
              { icon: 'fa-leaf', text: '50년 이상의 연구로 검증된 모델' },
              { icon: 'fa-user-check', text: '별도의 가입 절차 없는 즉시 진단' },
              { icon: 'fa-file-pdf', text: '상세 분석 리포트 PDF 저장 제공' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 text-[#84a98c]">
                <div className="w-6 text-center"><i className={`fas ${item.icon}`}></i></div>
                <span className="text-[#57534e] font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-[#f5f5f4]">
          <div className="space-y-5">
            {[
              { title: '심리적 민감성', desc: '부정적 감정 조절과 회복 탄력성' },
              { title: '내향/외향성', desc: '상호작용 및 사회적 적응 방식' },
              { title: '인지적 개방성', desc: '새로운 생각과 경험에 대한 포용' },
              { title: '대인 수용성', desc: '함께 살아가는 따뜻함' },
              { title: '규범지향성', desc: '나를 다스리는 힘' },
            ].map((item) => (
              <div key={item.title} className="grid grid-cols-[130px_1fr] items-center gap-6">
  <div className="bg-[#f0f3f0] text-[#84a98c] px-3 py-1 rounded-full font-bold text-xs text-center">
    {item.title}
  </div>
  <p className="text-[#78716c] text-sm font-normal leading-relaxed">
    {item.desc}
  </p>
</div>

            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Intro;
