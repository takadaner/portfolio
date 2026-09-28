export type ConciergeLanguage = "en" | "ro";

const scenarios = {
  "late-checkin": {
    en: {
      guestMessage: "I’ll arrive after midnight. Is that okay?",
      reply: "Of course. I’ve noted your late arrival. The night entrance is beside the main doors—your room key will be waiting in the secure lockbox. Want the step-by-step directions?",
    },
    ro: {
      guestMessage: "Voi ajunge după miezul nopții. Este în regulă?",
      reply: "Desigur. Am notat sosirea târzie. Intrarea de noapte este lângă ușa principală, iar cheia te așteaptă în cutia securizată. Vrei instrucțiunile pas cu pas?",
    },
  },
  breakfast: {
    en: {
      guestMessage: "Do you have a good breakfast option for vegans?",
      reply: "The garden café serves a plant-based breakfast from 7:00 to 10:30. I can also flag your preference for the team so they can share today’s specials when you arrive.",
    },
    ro: {
      guestMessage: "Aveți o opțiune bună de mic dejun vegan?",
      reply: "Cafeneaua din grădină servește mic dejun vegetal între 7:00 și 10:30. Pot nota preferința pentru echipă, ca să-ți poată prezenta specialitățile zilei când ajungi.",
    },
  },
  "local-guide": {
    en: {
      guestMessage: "I have two hours free. What should I see nearby?",
      reply: "For two easy hours: walk the old harbour, stop for coffee at Atelier 12, then follow the seafront path back. I’ve put the route together—would you prefer a quieter walk or a livelier evening?",
    },
    ro: {
      guestMessage: "Am două ore libere. Ce pot vedea prin apropiere?",
      reply: "Pentru două ore lejere: plimbă-te prin portul vechi, oprește-te la o cafea la Atelier 12, apoi întoarce-te pe promenadă. Am pregătit traseul—preferi o plimbare liniștită sau o seară mai animată?",
    },
  },
} as const;

export type ConciergeScenarioId = keyof typeof scenarios;

export function getConciergeScenario(
  id: string,
  language: ConciergeLanguage,
) {
  if (!Object.hasOwn(scenarios, id)) return null;
  return scenarios[id as ConciergeScenarioId][language];
}
