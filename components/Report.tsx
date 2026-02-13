import React, { useRef, useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { DiagnosisResult, Domain } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ReportProps {
  result: DiagnosisResult;
}

const Report: React.FC<ReportProps> = ({ result }) => {
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const chartData = [
    { subject: '심리적 민감성', A: result.scores[Domain.NegativeSensitivity], fullMark: 30 },
    { subject: '내향/외향성', A: result.scores[Domain.Extraversion], fullMark: 30 },
    { subject: '인지적 개방성', A: result.scores[Domain.OpennessToExperience], fullMark: 30 },
    { subject: '대인 수용성', A: result.scores[Domain.Agreeableness], fullMark: 30 },
    { subject: '규범지향성', A: result.scores[Domain.Conscientiousness], fullMark: 30 },
  ];

  const renderCustomTick = (props: any) => {
    const { x, y, payload, textAnchor } = props;
    const value = payload.value;
    let lines = [value];
    if (value === '심리적 민감성') lines = ['심리적', '민감성'];
    else if (value === '내향/외향성') lines = ['내향/', '외향성'];
    else if (value === '인지적 개방성') lines = ['인지적', '개방성'];
    else if (value === '대인 수용성') lines = ['대인', '수용성'];
    else if (value === '규범지향성') lines = ['규범', '지향성'];

    return (
      <text x={x} y={y} textAnchor={textAnchor} fill="#78716c" fontSize={11} fontWeight={600}>
        {lines.map((line: string, i: number) => (
          <tspan x={x} dy={i === 0 ? -5 : 14} key={i}>
            {line}
          </tspan>
        ))}
      </text>
    );
  };

  const capture = async (el: HTMLElement) => {
    // 캡처 안정화: 스크롤/뷰포트 영향을 최소화
    return await html2canvas(el, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight,
      scrollX: 0,
      scrollY: -window.scrollY,
    });
  };

  const handleSave = async () => {
    if (!page1Ref.current || !page2Ref.current) return;
    setIsExporting(true);
    window.scrollTo(0, 0);

    try {
      // 1) 1페이지 / 2페이지 캡처를 각각 수행
      const canvas1 = await capture(page1Ref.current);
      const canvas2 = await capture(page2Ref.current);

      const img1 = canvas1.toDataURL('image/png');
      const img2 = canvas2.toDataURL('image/png');

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();   // 210
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297

      // ✅ 인쇄 여백(mm)
      const marginTop = 12;
      const marginBottom = 12;
      const marginLeft = 12;
      const marginRight = 12;

      const usableWidth = pageWidth - marginLeft - marginRight;
      const usableHeight = pageHeight - marginTop - marginBottom;

      const paintPageBgWhite = () => {
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      };

      // ---- PAGE 1: 차트 + 강점/보완점 (무조건 1페이지에) ----
      paintPageBgWhite();

      const img1Height = (canvas1.height * usableWidth) / canvas1.width;

      // 1페이지는 “한 페이지에 맞도록” 축소해서 넣는 전략
      // (내용이 많아서 1페이지를 넘기면 레이아웃 목표가 깨지므로, 여기서 자동 축소)
      const scale1 = Math.min(1, usableHeight / img1Height);
      const drawW1 = usableWidth * scale1;
      const drawH1 = img1Height * scale1;

      // 가운데 정렬(좌우는 marginLeft 기준, 위는 marginTop 기준)
      pdf.addImage(img1, 'PNG', marginLeft, marginTop, drawW1, drawH1);

      // ---- PAGE 2+: 심층 해석 (길면 3,4페이지로 자동 분할) ----
      pdf.addPage();
      paintPageBgWhite();

      const img2Height = (canvas2.height * usableWidth) / canvas2.width;
      let heightLeft = img2Height;

      // 첫 해석 페이지
      pdf.addImage(img2, 'PNG', marginLeft, marginTop, usableWidth, img2Height);
      heightLeft -= usableHeight;

      // 이어지는 페이지들
      while (heightLeft > 0) {
        pdf.addPage();
        paintPageBgWhite();

        const position = marginTop - (img2Height - heightLeft);
        pdf.addImage(img2, 'PNG', marginLeft, position, usableWidth, img2Height);

        heightLeft -= usableHeight;
      }

      pdf.save(`마음리포트_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('PDF 생성 중 오류:', error);
      alert('리포트를 저장하는 중에 문제가 발생했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  // ✅ breakInside: avoid (캡처 단계에서 “카드 단위 잘림” 완화)
  const avoidBreakStyle: React.CSSProperties = {
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
  };

  // ✅ A4 페이지 컨테이너 공통(웹 화면에서도 예쁘고, 캡처에 안정적)
  const a4PageStyle: React.CSSProperties = {
    width: '210mm',
    minHeight: '297mm',
    padding: '18mm',
    boxSizing: 'border-box',
    background: '#ffffff',
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-10 animate-fadeIn relative">
      <div className="flex justify-end sticky top-24 z-20">
        <button
          onClick={handleSave}
          disabled={isExporting}
          className="bg-[#84a98c] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-[#6b8e23] flex items-center gap-2 transition-all active:scale-95"
        >
          {isExporting ? (
            <>
              <i className="fas fa-circle-notch animate-spin"></i> 저장 중...
            </>
          ) : (
            <>
              <i className="fas fa-download"></i> PDF 리포트 저장
            </>
          )}
        </button>
      </div>

      <div className="space-y-16">
        {/* =========================
            PDF PAGE 1 (캡처 대상)
           ========================= */}
        <div ref={page1Ref} className="mx-auto" style={a4PageStyle}>
          <div className="space-y-12">
            <div className="text-center space-y-4" style={avoidBreakStyle}>
              <h2 className="text-4xl font-bold text-[#292524]">성격 분석 리포트</h2>
              <p className="text-[#78716c] font-light">당신의 내면을 비추는 30가지 질문의 결과입니다.</p>
            </div>

            {/* 요인별 점수 및 차트 */}
            <div
              className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-[#f5f5f4] grid md:grid-cols-2 gap-12 items-center"
              style={avoidBreakStyle}
            >
              <div className="h-80 w-full min-w-0 overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={chartData} margin={{top: 12, right: 50, bottom: 12, left: 50}} outerRadius="70%">
                    <PolarGrid stroke="#e7e5e4" />
                    <PolarAngleAxis dataKey="subject" tick={renderCustomTick} />
                    <PolarRadiusAxis domain={[0, 30]} tick={false} axisLine={false} />
                    <Radar dataKey="A" stroke="#84a98c" fill="#84a98c" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-5 min-w-0 relative" style={avoidBreakStyle}>
                {chartData.map((item) => (
                  <div key={item.subject} className="space-y-1" style={avoidBreakStyle}>
                    <div className="flex justify-between text-xs font-bold">
                      <span>{item.subject}</span>
                      <span>{item.A} / 30</span>
                    </div>
                    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#84a98c]" style={{ width: `${(item.A / 30) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 강점 및 보완점 */}
            <div className="grid md:grid-cols-2 gap-8" style={avoidBreakStyle}>
              <div className="bg-[#f0f3f0] p-10 rounded-[3rem] space-y-6" style={avoidBreakStyle}>
                <h4 className="font-bold text-[#425a46] flex items-center gap-2">
                  <i className="fas fa-star text-amber-500"></i> 주요 강점
                </h4>
                <ul className="space-y-4" style={avoidBreakStyle}>
                  {result.strengths.map((s, i) => (
                    <li key={i} className="text-sm flex gap-3 text-[#57534e]" style={avoidBreakStyle}>
                      <span className="text-[#84a98c] font-bold">{i + 1}.</span> {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#fff7ed] p-10 rounded-[3rem] space-y-6" style={avoidBreakStyle}>
                <h4 className="font-bold text-[#9a3412] flex items-center gap-2">
                  <i className="fas fa-compass text-orange-400"></i> 보완 필요점
                </h4>
                <ul className="space-y-4" style={avoidBreakStyle}>
                  {result.weaknesses.map((w, i) => (
                    <li key={i} className="text-sm flex gap-3 text-[#57534e]" style={avoidBreakStyle}>
                      <span className="text-orange-400 font-bold">{i + 1}.</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            PDF PAGE 2+ (캡처 대상)
           ========================= */}
        <div ref={page2Ref} className="mx-auto" style={a4PageStyle}>
          <div
            className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-[#f5f5f4] space-y-8"
            style={avoidBreakStyle}
          >
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <i className="fas fa-file-alt text-[#84a98c]"></i> 심층 해석
            </h3>
            <p className="text-[#57534e] leading-relaxed whitespace-pre-line text-lg font-light">
              {result.interpretation}
            </p>
          </div>
        </div>

        {/* (PDF 제외) 4주 케어 플랜 */}
        <div className="bg-[#44403c] text-white p-12 rounded-[4rem] space-y-8 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">나를 위한 4주 케어 플랜</h3>
            <p className="text-stone-400 font-light text-sm">진단 결과에 기반하여 설계된 주간별 성장 목표입니다.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {result.weeklyPlans.map((wp, i) => (
              <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <div className="text-[#84a98c] text-[10px] font-bold mb-1 uppercase tracking-widest">
                  WEEK {i + 1}
                </div>
                <div className="font-bold text-sm mb-2">{wp.title}</div>
                <div className="text-xs text-stone-400 line-clamp-2">7일간의 맞춤형 데일리 미션 포함</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
