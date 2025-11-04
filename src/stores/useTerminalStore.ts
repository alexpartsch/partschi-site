import { create } from 'zustand';
import type { TerminalHistory } from '../types/filesystem';

interface TerminalStore {
  history: TerminalHistory[];
  sessionStartTime: Date;
  showImprintModal: boolean;
  showWhoamiModal: boolean;
  blogPanelOpen: boolean;
  currentBlogContent: string | null;
  currentBlogTitle: string | null;
  addHistory: (command: string, output: string, isError?: boolean) => void;
  clearHistory: () => void;
  setShowImprintModal: (show: boolean) => void;
  setShowWhoamiModal: (show: boolean) => void;
  openBlogPanel: (content: string, title: string) => void;
  closeBlogPanel: () => void;
}

export const useTerminalStore = create<TerminalStore>((set) => ({
  history: [],
  sessionStartTime: new Date(),
  showImprintModal: false,
  showWhoamiModal: false,
  blogPanelOpen: false,
  currentBlogContent: null,
  currentBlogTitle: null,

  addHistory: (command: string, output: string, isError = false) => {
    set((state) => ({
      history: [
        ...state.history,
        {
          command,
          output,
          timestamp: new Date(),
          isError,
        },
      ],
    }));
  },

  clearHistory: () => {
    set({ history: [] });
  },

  setShowImprintModal: (show: boolean) => {
    set({ showImprintModal: show });
  },

  setShowWhoamiModal: (show: boolean) => {
    set({ showWhoamiModal: show });
  },

  openBlogPanel: (content: string, title: string) => {
    set({
      blogPanelOpen: true,
      currentBlogContent: content,
      currentBlogTitle: title,
    });
  },

  closeBlogPanel: () => {
    set({
      blogPanelOpen: false,
      currentBlogContent: null,
      currentBlogTitle: null,
    });
  },
}));
