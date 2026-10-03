"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import api from "@/lib/api";


export default function RegisterPage() {

    const router = useRouter();

    const [formData, setFormData] = useState({
        displayName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    // handle input changes
    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };


    // handle registration
    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        // check password confirmation
        if (formData.password !== formData.confirmPassword) {

            setError("Passwords do not match");

            return;
        }


        setLoading(true);

        try {

            // create account
            await api.post(
                "/auth/register",
                {
                    displayName: formData.displayName,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                }
            );


            // redirect to login
            router.push("/login");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Registration failed"
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">

            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">

                <h1 className="text-3xl font-bold text-center mb-2">
                    LinkUp
                </h1>

                <p className="text-gray-500 text-center mb-8">
                    Create your account
                </p>


                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>

                        <label className="block mb-2 font-medium">
                            Display Name
                        </label>

                        <input
                            type="text"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                            placeholder="Nabil Khan"
                            className="w-full border rounded-lg px-4 py-3 outline-none"
                            required
                        />

                    </div>


                    <div>

                        <label className="block mb-2 font-medium">
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="nabil"
                            className="w-full border rounded-lg px-4 py-3 outline-none"
                            required
                        />

                    </div>


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


                    <div>

                        <label className="block mb-2 font-medium">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
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
                            ? "Creating account..."
                            : "Create Account"
                        }
                    </button>

                </form>


                <p className="text-center text-sm text-gray-500 mt-6">

                    Already have an account?{" "}

                    <Link
                        href="/login"
                        className="text-black font-semibold"
                    >
                        Sign in
                    </Link>

                </p>

            </div>

        </main>
    );
}