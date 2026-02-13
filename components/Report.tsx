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
  // ✅ PDF 전용 DOM ref (화면에는 숨김)
  const pdfPage1Ref = useRef<HTMLDivElement>(null);
  const pdfPage2Ref = useRef<HTMLDivElement>(null);

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

  // ✅ PDF 캡처 안정화 버전
  const capture = async (el: HTMLElement) => {
    try {
      // @ts-ignore
      await document.fonts?.ready;
    } catch (_) {}
    await new Promise((r) => requestAnimationFrame(() => r(null)));

    return await html2canvas(el, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight,
    });
  };

  const handleSave = async () => {
    if (!pdfPage1Ref.current || !pdfPage2Ref.current) return;

    setIsExporting(true);
    await new Promise((r) => setTimeout(r, 0));

    try {
      const canvas1 = await capture(pdfPage1Ref.current);
      const canvas2 = await capture(pdfPage2Ref.current);

      const img1 = canvas1.toDataURL('image/png');
      const img2 = canvas2.toDataURL('image/png');

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

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

      // ---- PAGE 1 ----
      paintPageBgWhite();

      const img1Height = (canvas1.height * usableWidth) / canvas1.width;
      const scale1 = Math.min(1, usableHeight / img1Height);
      const drawW1 = usableWidth * scale1;
      const drawH1 = img1Height * scale1;

      pdf.addImage(img1, 'PNG', marginLeft, marginTop, drawW1, drawH1);

      // ---- PAGE 2+ ----
      pdf.addPage();
      paintPageBgWhite();

      const img2Height = (canvas2.height * usableWidth) / canvas2.width;
      let heightLeft = img2Height;

      pdf.addImage(img2, 'PNG', marginLeft, marginTop, usableWidth, img2Height);
      heightLeft -= usableHeight;

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

  // ✅ breakInside: avoid
  const avoidBreakStyle: React.CSSProperties = {
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
  };

  // ✅ PDF(A4) 컨테이너 스타일 (숨겨진 PDF DOM에서만 사용)
  const pdfA4PageStyle: React.CSSProperties = {
    width: '210mm',
    minHeight: '297mm',
    padding: '18mm',
    boxSizing: 'border-box',
    background: '#ffffff',
    overflow: 'visible',
  };

  // ✅ 공백 없는 긴 문자열/URL 때문에 가로 overflow 나는 것 방지
  const safeTextStyle: React.CSSProperties = {
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
  };

  return (
    <>
      {/* =========================
          SCREEN VIEW (모바일/웹)
          - 가로 overflow 방지: overflow-x-hidden + max-w-full
         ========================= */}
      <div className="w-full max-w-full overflow-x-hidden">
        <div
          className="max-w-4xl mx-auto px-4 pt-16 pb-24 md:py-12 space-y-10 animate-fadeIn relative"
          style={{
            paddingTop: 'calc(4rem + env(safe-area-inset-top))',
            paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))',
          }}
        >
          {/* ✅ md 이상에서만 sticky */}
          <div className="flex justify-end md:sticky md:top-24 z-20">
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

          {/* 화면에서 보기 좋은 구성 */}
          <div className="space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-[#292524]">성격 분석 리포트</h2>
              <p className="text-[#78716c] font-light">
                당신의 내면을 비추는 30가지 질문의 결과입니다.
              </p>

              {/* ✅ 추가 멘트(화면에도 보이게) */}
              <div className="mt-4 text-sm text-[#44403c] leading-relaxed max-w-2xl mx-auto bg-[#f5f5f4] border border-[#e7e5e4] rounded-xl px-4 py-3">
                단, 본 결과는 Big5 진단 문항 256개 중 일부 문항에 대한 응답을 기반으로 산출된 참고용 결과입니다. <br />
                보다 타당하고 신뢰도 높은 정식 진단 결과를 원하실 경우, <br />
                PSI COMPASS 홈페이지를 통해 전문 진단을 문의해주시기 바랍니다.
              </div>
            </div>

            {/* ✅ 모바일 1열 / md 2열 + 가로 넘침 방지: min-w-0 */}
            <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm border border-[#f5f5f4] grid grid-cols-1 md:grid-cols-[1.2fr_0.9fr] gap-10 items-center min-w-0">
              <div className="h-[320px] md:h-[380px] w-full min-w-0 overflow-visible flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    data={chartData}
                    margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
                    outerRadius="82%"
                  >
                    <PolarGrid stroke="#e7e5e4" />
                    <PolarAngleAxis dataKey="subject" tick={renderCustomTick} />
                    <PolarRadiusAxis domain={[0, 30]} tick={false} axisLine={false} />
                    <Radar dataKey="A" stroke="#84a98c" fill="#84a98c" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-5 min-w-0 relative">
                {chartData.map((item) => (
                  <div key={item.subject} className="space-y-1 min-w-0">
                    <div className="flex justify-between text-xs font-bold min-w-0">
                      <span className="min-w-0 truncate">{item.subject}</span>
                      <span className="shrink-0">{item.A} / 30</span>
                    </div>
                    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#84a98c]" style={{ width: `${(item.A / 30) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-w-0">
              <div className="bg-[#f0f3f0] p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] space-y-6 min-w-0">
                <h4 className="font-bold text-[#425a46] flex items-center gap-2">
                  <i className="fas fa-star text-amber-500"></i> 주요 강점
                </h4>
                <ul className="space-y-4 min-w-0">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="text-sm flex gap-3 text-[#57534e] min-w-0" style={safeTextStyle}>
                      <span className="text-[#84a98c] font-bold shrink-0">{i + 1}.</span>
                      <span className="min-w-0" style={safeTextStyle}>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#fff7ed] p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] space-y-6 min-w-0">
                <h4 className="font-bold text-[#9a3412] flex items-center gap-2">
                  <i className="fas fa-compass text-orange-400"></i> 보완 필요점
                </h4>
                <ul className="space-y-4 min-w-0">
                  {result.weaknesses.map((w, i) => (
                    <li key={i} className="text-sm flex gap-3 text-[#57534e] min-w-0" style={safeTextStyle}>
                      <span className="text-orange-400 font-bold shrink-0">{i + 1}.</span>
                      <span className="min-w-0" style={safeTextStyle}>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 화면에서도 심층해석은 보여주되 가로 overflow 방지 */}
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm border border-[#f5f5f4] space-y-6 min-w-0">
              <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <i className="fas fa-file-alt text-[#84a98c]"></i> 심층 해석
              </h3>
              <p
                className="text-[#57534e] leading-relaxed whitespace-pre-line text-base md:text-lg font-light min-w-0"
                style={safeTextStyle}
              >
                {result.interpretation}
              </p>
            </div>

            {/* (PDF 제외) 4주 케어 플랜 - 가로 overflow 방지 */}
            <div className="bg-[#44403c] text-white p-10 md:p-12 rounded-[3rem] md:rounded-[4rem] space-y-8 shadow-sm w-full max-w-full overflow-hidden min-w-0">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">나를 위한 4주 케어 플랜</h3>
                <p className="text-stone-400 font-light text-sm">
                  진단 결과에 기반하여 설계된 주간별 성장 목표입니다.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
                {result.weeklyPlans.map((wp, i) => (
                  <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/10 min-w-0">
                    <div className="text-[#84a98c] text-[10px] font-bold mb-1 uppercase tracking-widest">
                      WEEK {i + 1}
                    </div>
                    <div className="font-bold text-sm mb-2 min-w-0" style={safeTextStyle}>
                      {wp.title}
                    </div>
                    <div className="text-xs text-stone-400 line-clamp-2">7일간의 맞춤형 데일리 미션 포함</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ 하단 Safari UI에 덮일 여지를 더 줄이기 위한 스페이서 */}
            <div className="h-8" />
          </div>
        </div>
      </div>

      {/* =========================
          PDF VIEW (A4 전용, 화면 밖 숨김)
          ✅ left:-99999px 대신 transform 숨김 (iOS에서 body 폭 커지는 문제 예방)
         ========================= */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          transform: 'translateX(-120vw)',
          width: '210mm',
          background: '#ffffff',
          opacity: 1,
          pointerEvents: 'none',
        }}
        aria-hidden
      >
        {/* PDF PAGE 1 */}
        <div ref={pdfPage1Ref} style={pdfA4PageStyle}>
          <div className="space-y-12">
            <div className="text-center space-y-4" style={avoidBreakStyle}>
              <h2 className="text-4xl font-bold text-[#292524]">성격 분석 리포트</h2>
              <p className="text-[#78716c] font-light">
                당신의 내면을 비추는 30가지 질문의 결과입니다.
              </p>
            </div>

            <div
              className="mt-4 text-sm text-[#44403c] leading-relaxed max-w-2xl mx-auto bg-[#f5f5f4] border border-[#e7e5e4] rounded-xl px-4 py-3"
              style={avoidBreakStyle}
            >
              단, 본 결과는 Big5 진단 문항 256개 중 일부 문항에 대한 응답을 기반으로 산출된 참고용 결과입니다. <br />
              보다 타당하고 신뢰도 높은 정식 진단 결과를 원하실 경우, <br />
              PSI COMPASS 홈페이지를 통해 전문 진단을 문의해주시기 바랍니다.
            </div>

            <div
              className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-[#f5f5f4] grid grid-cols-[1.2fr_0.9fr] gap-12 items-center"
              style={avoidBreakStyle}
            >
              <div className="h-[380px] w-full min-w-0 overflow-visible flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    data={chartData}
                    margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
                    outerRadius="82%"
                  >
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

            <div className="grid grid-cols-2 gap-8" style={avoidBreakStyle}>
              <div className="bg-[#f0f3f0] p-10 rounded-[3rem] space-y-6" style={avoidBreakStyle}>
                <h4 className="font-bold text-[#425a46] flex items-center gap-2">
                  <i className="fas fa-star text-amber-500"></i> 주요 강점
                </h4>
                <ul className="space-y-4" style={avoidBreakStyle}>
                  {result.strengths.map((s, i) => (
                    <li
                      key={i}
                      className="text-sm flex gap-3 text-[#57534e]"
                      style={{ ...avoidBreakStyle, ...safeTextStyle }}
                    >
                      <span className="text-[#84a98c] font-bold shrink-0">{i + 1}.</span>
                      <span style={safeTextStyle}>{s}</span>
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
                    <li
                      key={i}
                      className="text-sm flex gap-3 text-[#57534e]"
                      style={{ ...avoidBreakStyle, ...safeTextStyle }}
                    >
                      <span className="text-orange-400 font-bold shrink-0">{i + 1}.</span>
                      <span style={safeTextStyle}>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* PDF PAGE 2+ */}
        <div ref={pdfPage2Ref} style={pdfA4PageStyle}>
          <div
            className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-[#f5f5f4] space-y-8"
            style={avoidBreakStyle}
          >
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <i className="fas fa-file-alt text-[#84a98c]"></i> 심층 해석
            </h3>
            <p
              className="text-[#57534e] leading-relaxed whitespace-pre-line text-lg font-light"
              style={safeTextStyle}
            >
              {result.interpretation}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Report;
