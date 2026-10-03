"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/api";
import socket from "@/lib/socket";


export default function useAuth() {

    const router = useRouter();

    const [currentUser, setCurrentUser] =
        useState(null);

    const [authLoading, setAuthLoading] =
        useState(true);


    // get stored jwt
    const getToken = useCallback(() => {

        if (typeof window === "undefined") {
            return null;
        }

        return localStorage.getItem(
            "linkup_token"
        );

    }, []);


    // clear local authentication data
    const clearAuth = useCallback(() => {

        localStorage.removeItem(
            "linkup_token"
        );

        localStorage.removeItem(
            "linkup_user"
        );

    }, []);


    // load authenticated user
    useEffect(() => {

        const loadUser = async () => {

            const token = getToken();


            if (!token) {

                setAuthLoading(false);

                router.replace("/login");

                return;
            }


            try {

                const response = await api.get(
                    "/auth/me",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


                setCurrentUser(
                    response.data.user
                );

            } catch (error) {

                clearAuth();

                setCurrentUser(null);

                router.replace("/login");

            } finally {

                setAuthLoading(false);
            }
        };


        loadUser();

    }, [
        router,
        getToken,
        clearAuth,
    ]);


    // logout current user
    const logout = useCallback(() => {

        socket.disconnect();

        clearAuth();

        setCurrentUser(null);

        router.replace("/login");

    }, [
        router,
        clearAuth,
    ]);


    return {
        currentUser,
        authLoading,
        getToken,
        logout,
    };
}