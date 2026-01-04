import {create} from 'zustand';
import { User } from '@/types/user';

interface AuthStore{
    user: User | null;
    setUser: (user: User) => void;
    isAuthenticated: boolean;
    clearIsAuthenticated: () => void;
}

export const useAuthStore=create<AuthStore>()((set)=>({
     isAuthenticated: false,
    user: null,
    setUser: (user) => set ({ user: user, isAuthenticated: true }),
  
    clearIsAuthenticated: () => set ({user: null, isAuthenticated: false }),
}));