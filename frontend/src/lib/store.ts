import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SurveyState {
 responseId: string | null;
 currentSection: number;
 answers: Record<string, string>;
 setResponseId: (id: string) => void;
 setCurrentSection: (section: number) => void;
 setAnswer: (questionId: string, value: string) => void;
 setAnswers: (answers: Record<string, string>) => void;
 resetSurvey: () => void;
}

export const useSurveyStore = create<SurveyState>()(
 persist(
  (set) => ({
   responseId: null,
   currentSection: 0,
   answers: {},
   setResponseId: (id) => set({ responseId: id }),
   setCurrentSection: (section) => set({ currentSection: section }),
   setAnswer: (questionId, value) =>
    set((state) => ({
     answers: { ...state.answers, [questionId]: value },
    })),
   setAnswers: (answers) => set({ answers }),
   resetSurvey: () =>
    set({
     responseId: null,
     currentSection: 0,
     answers: {},
    }),
  }),
  {
   name: 'survey-storage',
  },
 ),
);
