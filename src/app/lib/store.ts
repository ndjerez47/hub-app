import { create } from 'zustand';
import { User } from '@/app/types/user';

interface AuthState {
  user: Omit<User, 'password'> | null;
  token: string | null;
  setUser: (user: Omit<User, 'password'> | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
}));