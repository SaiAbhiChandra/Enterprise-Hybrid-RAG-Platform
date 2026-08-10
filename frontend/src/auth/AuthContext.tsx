import { createContext } from "react";
import type { UserProfile } from "../api/users";

export interface AuthContextType {
    token: string | null;

    user: UserProfile | null;

    login: (token: string) => void;

    logout: () => void;

    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    token: null,

    user: null,

    login: () => {},

    logout: () => {},

    isAuthenticated: false,
});
