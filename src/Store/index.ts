import { create } from 'zustand';
import { useStore } from './user';
import type{pet, RegisterData, User} from './types';

interface StoreState{
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (credentials: any) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
    updateProfile: (profile: Partial<User>) => Promise<void>;
    checkAuth: () => Promise<void>;

    //pet 
    pet: pet[];
    currentPet: pet | null;
    plantsLoading: boolean;
    fetchPet: (petId: string) => Promise<void>;

}