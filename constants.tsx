
import { Domain, Question } from './types';

export const NEO_QUESTIONS: Question[] = [
  // 심리적 민감성 (NegativeSensitivity) - 6문항
  { id: 1, text: "나는 일이 잘못되지 않을까 걱정할 때가 있다.", domain: Domain.NegativeSensitivity, reverse: false },
  { id: 2, text: "사람들은 내가 화를 쉽게 내고 성질이 급하다고 한다.", domain: Domain.NegativeSensitivity, reverse: false },
  { id: 3, text: "나는 스트레스 상황에서 의기소침해진다.", domain: Domain.NegativeSensitivity, reverse: false },
  { id: 4, text: "사람들에게 둘러싸여 있을 때, 바보스럽게 보일까봐 걱정이 된다.", domain: Domain.NegativeSensitivity, reverse: false },
  { id: 5, text: "나는 일이 잘못되었을 때 자책하는 경향이 있다.", domain: Domain.NegativeSensitivity, reverse: false },
  { id: 6, text: "나는 충동적으로 어떤 일을 하고 나중에 후회하곤 한다.", domain: Domain.NegativeSensitivity, reverse: false },
  
  // 내향/외향성 (Extraversion) - 6문항
  { id: 7, text: "나는 명랑하고 활력이 넘치는 사람이다.", domain: Domain.Extraversion, reverse: false },
  { id: 8, text: "나는 혼자 있는 것보다는 다른 사람들과 함께 있는 것이 좋다.", domain: Domain.Extraversion, reverse: false },
  { id: 9, text: "나는 화려하고 생동감 있는 곳에 가는 것을 좋아한다.", domain: Domain.Extraversion, reverse: false },
  { id: 10, text: "나와 함께 일하는 사람들에게 관심을 기울인다.", domain: Domain.Extraversion, reverse: false },
  { id: 11, text: "반대가 있더라도 주장할 것은 주장한다.", domain: Domain.Extraversion, reverse: false },
  { id: 12, text: "나는 늘 부지런하고 바쁘게 지낸다.", domain: Domain.Extraversion, reverse: false },

  // 인지적 개방성 (Openness to Experience) - 6문항
  { id: 13, text: "우리가 가지고 있는 옳고 그름에 대한 기준이 세상의 모든 사람들에게 똑같이 적용되지 않는다.", domain: Domain.OpennessToExperience, reverse: false },
  { id: 14, text: "무엇이든 그것에 대한 나의 느낌과 감정을 중요하게 생각한다. ", domain: Domain.OpennessToExperience, reverse: false },
  { id: 15, text: "나는 복잡하게 얽힌 퀴즈를 푸는 것을 즐긴다.", domain: Domain.OpennessToExperience, reverse: false },
  { id: 16, text: "나는 상상의 나래를 한껏 펼쳐 나가는 것을 좋아한다.", domain: Domain.OpennessToExperience, reverse: true },
  { id: 17, text: "나는 자연이나 예술작품에 흥미가 있다. ", domain: Domain.OpennessToExperience, reverse: false },
  { id: 18, text: "나는 새로운 취미를 배우고 개발하는 데 흥미가 있다.", domain: Domain.OpennessToExperience, reverse: false },

  // 대인 수용성 (Agreeableness) - 6문항
  { id: 19, text: "내 자신이나 나의 성취에 대해 자랑 삼아 이야기 하지 않는다.", domain: Domain.Agreeableness, reverse: false },
  { id: 20, text: "불리함을 당하더라도 거짓말은 하지 않는다.", domain: Domain.Agreeableness, reverse: false },
  { id: 21, text: "나는 다른 사람들과 경쟁하기 보다는 협력을 하는 편이다.", domain: Domain.Agreeableness, reverse: false },
  { id: 22, text: "대부분의 사람들은 기본적으로 선한 품성을 가지고 있다고 믿는다.", domain: Domain.Agreeableness, reverse: false },
  { id: 23, text: "어려운 상황에 처한 사람의 일이 마치 내 일처럼 느껴질 때가 있다.", domain: Domain.Agreeableness, reverse: true },
  { id: 24, text: "나는 가능한 다른 사람들을 돕기 위해 노력한다.", domain: Domain.Agreeableness, reverse: false },



  // 규범지향성 (Conscientiousness) - 6문항
  { id: 25, text: "나는 목표 달성을 위해 열심히 일한다.", domain: Domain.Conscientiousness, reverse: false },
  { id: 26, text: "나는 내게 맡겨진 모든 일들을 성실하게 수행하기 위해 노력한다.", domain: Domain.Conscientiousness, reverse: false },
  { id: 27, text: "나는 깊이 생각한 후에야 결정을 내린다.", domain: Domain.Conscientiousness, reverse: false },
  { id: 28, text: "나는 대체로 현명하게 판단을 내린다.", domain: Domain.Conscientiousness, reverse: true },
  { id: 29, text: "나는 일단 시작한 일은 항상 끝마친다.", domain: Domain.Conscientiousness, reverse: false },
  { id: 30, text: "나는 내 물건들을 깔끔하게 정돈해 둔다.", domain: Domain.Conscientiousness, reverse: false },
];
