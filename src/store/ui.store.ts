import { create } from "zustand";

interface UiState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  roleSwitcherOpen: boolean;
  setRoleSwitcherOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  roleSwitcherOpen: false,
  setRoleSwitcherOpen: (open: boolean) => set({ roleSwitcherOpen: open }),
}));
