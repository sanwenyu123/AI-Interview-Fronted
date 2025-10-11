import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // 用户状态
      user: null,
      isAuthenticated: false,
      
      // 设置状态
      language: 'zh-CN',
      voice: 'default',
      
      // 面试状态
      currentInterview: null,
      interviewHistory: [],
      
      // 用户操作
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
      
      // 设置操作
      setLanguage: (language) => set({ language }),
      setVoice: (voice) => set({ voice }),
      
      // 面试操作
      setCurrentInterview: (interview) => set({ currentInterview: interview }),
      addInterviewRecord: (record) => set((state) => ({
        interviewHistory: [...state.interviewHistory, record]
      })),
      clearInterviewHistory: () => set({ interviewHistory: [] }),
    }),
    {
      name: 'interview-app-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        language: state.language,
        voice: state.voice,
        interviewHistory: state.interviewHistory,
      }),
    }
  )
);

export default useStore;
