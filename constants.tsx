
import { Domain, Question } from './types';

export const NEO_QUESTIONS: Question[] = [
  // 심리적 민감성 (Neuroticism) - 12문항
  { id: 1, text: "나는 사소한 일에도 걱정이 많다.", domain: Domain.Neuroticism, reverse: false },
  { id: 2, text: "나는 종종 기분이 우울해지거나 가라앉는다.", domain: Domain.Neuroticism, reverse: false },
  { id: 3, text: "나는 스트레스를 받으면 쉽게 당황한다.", domain: Domain.Neuroticism, reverse: false },
  { id: 4, text: "나는 감정의 기복이 심한 편이다.", domain: Domain.Neuroticism, reverse: false },
  { id: 5, text: "나는 화가 나면 감정을 조절하기 힘들 때가 있다.", domain: Domain.Neuroticism, reverse: false },
  { id: 6, text: "나는 내가 한 일에 대해 종종 후회하곤 한다.", domain: Domain.Neuroticism, reverse: false },
  { id: 7, text: "나는 가끔 이유 없이 불안감을 느낀다.", domain: Domain.Neuroticism, reverse: false },
  { id: 8, text: "나는 비판을 받으면 쉽게 상처를 입는다.", domain: Domain.Neuroticism, reverse: false },
  { id: 9, text: "나는 긴박한 상황에서 평정을 유지하기 힘들다.", domain: Domain.Neuroticism, reverse: false },
  { id: 10, text: "나는 열등감을 느낄 때가 자주 있다.", domain: Domain.Neuroticism, reverse: false },
  { id: 51, text: "나는 가끔 작은 실패에도 큰 좌절감을 느낀다.", domain: Domain.Neuroticism, reverse: false },
  { id: 52, text: "나는 주변 사람들의 시선을 많이 의식하고 긴장한다.", domain: Domain.Neuroticism, reverse: false },
  
  // 내향/외향성 (Extraversion) - 12문항
  { id: 11, text: "나는 낯선 사람들과 대화하는 것을 즐긴다.", domain: Domain.Extraversion, reverse: false },
  { id: 12, text: "나는 에너지가 넘치고 활동적인 편이다.", domain: Domain.Extraversion, reverse: false },
  { id: 13, text: "나는 모임에서 주도적인 역할을 하는 경우가 많다.", domain: Domain.Extraversion, reverse: false },
  { id: 14, text: "나는 혼자 있는 것보다 사람들과 함께 있는 것을 선호한다.", domain: Domain.Extraversion, reverse: false },
  { id: 15, text: "나는 나의 감정을 겉으로 활발하게 표현한다.", domain: Domain.Extraversion, reverse: false },
  { id: 16, text: "나는 떠들썩하고 활기찬 분위기를 좋아한다.", domain: Domain.Extraversion, reverse: false },
  { id: 17, text: "나는 쉽게 친구를 사귀는 편이다.", domain: Domain.Extraversion, reverse: false },
  { id: 18, text: "나는 웃음이 많고 긍정적인 에너지를 가지고 있다.", domain: Domain.Extraversion, reverse: false },
  { id: 19, text: "나는 새로운 사람들을 만나는 것이 전혀 두렵지 않다.", domain: Domain.Extraversion, reverse: false },
  { id: 20, text: "나는 조용히 있기보다는 무언가 활동을 하는 것이 좋다.", domain: Domain.Extraversion, reverse: false },
  { id: 53, text: "나는 새로운 활동을 시작할 때 설렘과 에너지를 느낀다.", domain: Domain.Extraversion, reverse: false },
  { id: 54, text: "나는 침묵이 흐르는 상황을 견디기 힘들어 말을 먼저 거는 편이다.", domain: Domain.Extraversion, reverse: false },

  // 인지적 개방성 (Openness) - 12문항
  { id: 21, text: "나는 새로운 아이디어나 이론을 접하는 것을 좋아한다.", domain: Domain.Openness, reverse: false },
  { id: 22, text: "나는 상상력이 풍부하고 창의적인 일을 즐긴다.", domain: Domain.Openness, reverse: false },
  { id: 23, text: "나는 예술이나 미적 가치에 관심이 많다.", domain: Domain.Openness, reverse: false },
  { id: 24, text: "나는 변화보다는 익숙한 방식이 더 편하다.", domain: Domain.Openness, reverse: true },
  { id: 25, text: "나는 추상적인 문제에 대해 생각하는 것을 좋아한다.", domain: Domain.Openness, reverse: false },
  { id: 26, text: "나는 새로운 장소에 가보는 것을 무척 좋아한다.", domain: Domain.Openness, reverse: false },
  { id: 27, text: "나는 사물에 대해 다양한 시각으로 바라보려고 노력한다.", domain: Domain.Openness, reverse: false },
  { id: 28, text: "나는 시나 소설 같은 문학 작품을 읽으며 깊이 감동하곤 한다.", domain: Domain.Openness, reverse: false },
  { id: 29, text: "나는 고정관념에 얽매이는 것을 싫어한다.", domain: Domain.Openness, reverse: false },
  { id: 30, text: "나는 철학적인 대화를 나누는 것에 흥미를 느낀다.", domain: Domain.Openness, reverse: false },
  { id: 55, text: "나는 가보지 않은 길이나 새로운 경험을 시도하는 것을 즐긴다.", domain: Domain.Openness, reverse: false },
  { id: 56, text: "나는 전통적인 방식보다는 나만의 독창적인 방식을 찾는 것을 좋아한다.", domain: Domain.Openness, reverse: false },

  // 대인 수용성 (Agreeableness) - 12문항
  { id: 31, text: "나는 다른 사람들의 감정에 잘 공감하는 편이다.", domain: Domain.Agreeableness, reverse: false },
  { id: 32, text: "나는 다른 사람을 돕는 일에서 보람을 느낀다.", domain: Domain.Agreeableness, reverse: false },
  { id: 33, text: "나는 다른 사람들을 기본적으로 신뢰한다.", domain: Domain.Agreeableness, reverse: false },
  { id: 34, text: "나는 다른 사람과 의견이 충돌할 때 양보하는 편이다.", domain: Domain.Agreeableness, reverse: false },
  { id: 35, text: "나는 가끔 다른 사람의 의도를 의심할 때가 있다.", domain: Domain.Agreeableness, reverse: true },
  { id: 36, text: "나는 주변 사람들에게 친절하고 예의 바르게 행동한다.", domain: Domain.Agreeableness, reverse: false },
  { id: 37, text: "나는 타인의 잘못을 쉽게 용서해주는 편이다.", domain: Domain.Agreeableness, reverse: false },
  { id: 38, text: "나는 경쟁보다는 협력을 통해 문제를 해결하는 것을 선호한다.", domain: Domain.Agreeableness, reverse: false },
  { id: 39, text: "나는 다른 사람들의 의견을 경청하고 존중한다.", domain: Domain.Agreeableness, reverse: false },
  { id: 40, text: "나는 타인의 성공을 진심으로 축하해준다.", domain: Domain.Agreeableness, reverse: false },
  { id: 57, text: "나는 타인의 고통을 보면 마치 내 일처럼 마음이 아프다.", domain: Domain.Agreeableness, reverse: false },
  { id: 58, text: "나는 공동의 이익을 위해서라면 내 개인적인 이익을 양보할 수 있다.", domain: Domain.Agreeableness, reverse: false },

  // 규범지향성 (Conscientiousness) - 12문항
  { id: 41, text: "나는 일을 시작하면 끝까지 완수하려고 노력한다.", domain: Domain.Conscientiousness, reverse: false },
  { id: 42, text: "나는 계획을 세우고 그에 맞춰 행동하는 것을 좋아한다.", domain: Domain.Conscientiousness, reverse: false },
  { id: 43, text: "나는 주변을 항상 깨끗하게 정리정돈한다.", domain: Domain.Conscientiousness, reverse: false },
  { id: 44, text: "나는 가끔 약속 시간을 지키지 못할 때가 있다.", domain: Domain.Conscientiousness, reverse: true },
  { id: 45, text: "나는 어떠한 일에도 신중하게 결정하는 편이다.", domain: Domain.Conscientiousness, reverse: false },
  { id: 46, text: "나는 목표를 달성하기 위해 스스로를 잘 통제한다.", domain: Domain.Conscientiousness, reverse: false },
  { id: 47, text: "나는 맡은 일에 대해 강한 책임감을 느낀다.", domain: Domain.Conscientiousness, reverse: false },
  { id: 48, text: "나는 효율적으로 시간을 관리하기 위해 노력한다.", domain: Domain.Conscientiousness, reverse: false },
  { id: 49, text: "나는 세부적인 사항까지 꼼꼼하게 챙기는 편이다.", domain: Domain.Conscientiousness, reverse: false },
  { id: 50, text: "나는 어려운 상황에서도 끈기 있게 목표를 밀고 나간다.", domain: Domain.Conscientiousness, reverse: false },
  { id: 59, text: "나는 일의 우선순위를 정하고 체계적으로 접근하는 편이다.", domain: Domain.Conscientiousness, reverse: false },
  { id: 60, text: "나는 주변 환경이 어질러져 있으면 집중하기가 어렵다.", domain: Domain.Conscientiousness, reverse: false },
];
