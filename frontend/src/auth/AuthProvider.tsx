import { useEffect, useState } from "react";

import { AuthContext } from "./AuthContext";
import { getMe, type UserProfile } from "../api/users";

type Props = {
    children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token"),
    );

    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (!token) {
            setUser(null);
            return;
        }

        let cancelled = false;

        getMe()
            .then((profile) => {
                if (!cancelled) setUser(profile);
            })
            .catch(() => {
                // A failed profile fetch will also trigger the 401
                // interceptor in api/client.ts if the token was
                // actually invalid, which redirects to /login --
                // nothing extra to do here.
            });

        return () => {
            cancelled = true;
        };
    }, [token]);

    function login(newToken: string) {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    }

    function logout() {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                login,
                logout,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
