"use client";

import { useState } from "react";
import Link from "next/link";

import api from "@/lib/api";
import socket from "@/lib/socket";


export default function LoginPage() {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    // handle input changes
    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;


        setFormData(
            (previousData) => ({
                ...previousData,
                [name]: value,
            })
        );
    };


    // handle login
    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setLoading(true);


        try {

            // send login request
            const response = await api.post(
                "/auth/login",
                formData
            );


            const {
                token,
                user,
            } = response.data;


            // save authentication data
            localStorage.setItem(
                "linkup_token",
                token
            );

            localStorage.setItem(
                "linkup_user",
                JSON.stringify(user)
            );


            // connect socket using jwt
            socket.auth = {
                token,
            };

            socket.connect();


            // open chat with full page navigation
            window.location.href =
                "/chat";

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">

                <h1 className="text-3xl font-bold text-center mb-2">
                    LinkUp
                </h1>

                <p className="text-gray-500 text-center mb-8">
                    Sign in to continue
                </p>


                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>

                        <label className="block mb-2 font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full border rounded-lg px-4 py-3 outline-none"
                            required
                        />

                    </div>


                    <div>

                        <label className="block mb-2 font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="w-full border rounded-lg px-4 py-3 outline-none"
                            required
                        />

                    </div>


                    {error && (

                        <p className="text-red-500 text-sm">
                            {error}
                        </p>

                    )}


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white rounded-lg py-3 font-medium disabled:opacity-50"
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign In"
                        }
                    </button>

                </form>


                <p className="text-center text-sm text-gray-500 mt-6">

                    New to LinkUp?{" "}

                    <Link
                        href="/register"
                        className="text-black font-semibold hover:underline"
                    >
                        Create an account
                    </Link>

                </p>

            </div>

        </main>
    );
}