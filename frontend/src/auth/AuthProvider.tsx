import { useState } from "react";

import { AuthContext } from "./AuthContext";

type Props = {

    children: React.ReactNode;

};

export default function AuthProvider({

    children,

}: Props) {

    const [token, setToken] =
    useState<string | null>(
        localStorage.getItem("token"),
    );

    function login(token: string) {

        console.log("Saving token:", token);

        localStorage.setItem("token", token);

        setToken(token);
    }

    function logout() {

        localStorage.removeItem(
            "token",
        );

        setToken(null);

    }

    return (

        <AuthContext.Provider

            value={{

                token,

                login,

                logout,

                isAuthenticated:
                    !!token,

            }}

        >

            {children}

        </AuthContext.Provider>

    );

}