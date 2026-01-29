import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from './api';

interface Customer {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    customAddress: string;
    fullUSAAddress: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    country?: string;
}

interface AuthState {
    customer: Customer | null;
    token: string | null;
    isAuthenticated: boolean;
    _hasHydrated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    setCustomer: (customer: Customer) => void;
    setHasHydrated: (state: boolean) => void;
}

export const useAuth = create<AuthState>()(
    persist(
        (set, get) => ({
            customer: null,
            token: null,
            isAuthenticated: false,
            _hasHydrated: false,

            login: async (email: string, password: string) => {
                const data = await api.login(email, password);
                set({
                    customer: data.user, // Backend returns 'user', not 'customer'
                    token: data.access_token,
                    isAuthenticated: true,
                });
            },

            logout: () => {
                api.clearToken();
                set({
                    customer: null,
                    token: null,
                    isAuthenticated: false,
                });
            },

            setCustomer: (customer: Customer) => {
                set({ customer });
            },

            setHasHydrated: (state: boolean) => {
                set({ _hasHydrated: state });
            },
        }),
        {
            name: 'customer-auth',
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
