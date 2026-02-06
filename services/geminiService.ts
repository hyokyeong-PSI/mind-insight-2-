// app/api/gemini/route.ts  (Next.js App Router 기준: 서버에서만 실행)
// ✅ Vercel 배포에서 Gemini 호출은 반드시 여기(서버)에서 수행해야 합니다.
// ✅ Vercel 환경변수: GEMINI_API_KEY 를 사용하세요.

import { GoogleGenAI, Type } from "@google/genai";
import { Domain } from "@/types"; // 경로는 프로젝트에 맞게 수정하세요

export const runtime = "nodejs";

type Scores = Record<Domain, number>;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const scores: Scores | undefined = body?.scores;

    if (!scores) {
      return Response.json({ error: "Missing scores" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
당신은 심리학 전문가이며 NEO-PI-3 (Five Factor Model) 기반 성격 진단 해석 전문가입니다.
다음은 사용자의 각 요인별 점수(최소 12점 ~ 최대 60점, 요인당 12문항)입니다:
- 심리적 민감성: ${scores[Domain.Neuroticism]}
- 내향/외향성: ${scores[Domain.Extraversion]}
- 인지적 개방성: ${scores[Domain.Openness]}
- 대인 수용성: ${scores[Domain.Agreeableness]}
- 규범지향성: ${scores[Domain.Conscientiousness]}

이 데이터를 바탕으로 다음 요구사항을 충족하는 진단 리포트를 한국어로 작성해주세요:
1. 전체적인 성격 해석 코멘트: A4 용지 1/2 분량(한글 기준 약 800-1000자)으로 심도 있게 작성.
2. 일상 및 업무 상황에서의 성격상 강점 3개와 보완필요점 3개 각각 구체적으로 제시.
3. 성격 보완 및 스트레스 완화를 위한 활동 가이드:
   - '일주일 단위의 큰 목표'가 있고, 그 목표를 달성하기 위한 '7일간의 데일리 미션'으로 구성된 4주 분량의 계획을 생성하세요.
   - 각 미션은 구체적이고 실행 가능해야 하며, 수행 팁을 포함해야 합니다.

응답은 반드시 지정된 JSON 형식을 따라야 합니다.
`.trim();

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interpretation: { type: Type.STRING, description: "A4 1/2 분량의 상세 해석" },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "강점 3개" },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "보완점 3개" },
            weeklyPlans: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  week: { type: Type.NUMBER },
                  title: { type: Type.STRING, description: "주간 목표 제목" },
                  missions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        day: { type: Type.NUMBER },
                        task: { type: Type.STRING },
                        tip: { type: Type.STRING },
                      },
                      required: ["day", "task", "tip"],
                    },
                  },
                },
                required: ["week", "title", "missions"],
              },
            },
          },
          required: ["interpretation", "strengths", "weaknesses", "weeklyPlans"],
        },
      },
    });

    // SDK 응답 형태가 환경에 따라 달라질 수 있어 방어적으로 텍스트 추출
    const raw =
      (response as any)?.text ??
      (typeof (response as any)?.text === "function" ? (response as any).text() : undefined);

    const jsonText = typeof raw === "string" ? raw : String(raw ?? "");
    if (!jsonText.trim()) {
      return Response.json({ error: "Empty model response" }, { status: 502 });
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonText.trim());
    } catch {
      return Response.json(
        { error: "Model returned non-JSON", raw: jsonText.slice(0, 5000) },
        { status: 502 }
      );
    }

    // 프론트에서 필요하면 scores 포함해서 반환
    return Response.json({ ...parsed, scores });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return Response.json(
      { error: error?.message || "분석 리포트 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
