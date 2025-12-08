import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Login failed. Please check your credentials and server connection.");
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center px-4 py-10">
            <div className="max-w-5xl w-full grid gap-8 lg:grid-cols-2 items-center">

                {/* Left: white card */}
                <div className="bg-white rounded-2xl p-10 shadow-lg border border-gray-200">
                    <div className="mb-8">
                        <p className="text-xs font-semibold tracking-wide text-green-600 mb-1 uppercase">
                            DocuMind
                        </p>

                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                            Welcome back
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Sign in to your document intelligence hub.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 rounded-lg bg-red-100 text-red-700 text-sm font-medium border border-red-300 px-3 py-2">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-11 bg-gray-100 border-gray-300 text-gray-900"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <Input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-11 bg-gray-100 border-gray-300 text-gray-900"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 text-base bg-green-600 text-white hover:bg-green-700 shadow-md"
                        >
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-500">Don't have an account? </span>
                        <Link
                            to="/signup"
                            className="font-semibold text-green-600 hover:text-green-700"
                        >
                            Create account
                        </Link>
                    </div>
                </div>

                {/* Right: colorful gradient hero (light version) */}
                <div className="hidden lg:flex items-center justify-center">
                    <div className="w-full h-[420px] rounded-2xl bg-gradient-to-br from-purple-400 via-blue-500 to-green-400 shadow-xl flex items-center justify-center p-10">
                        <div className="text-white max-w-md">
                            <h2 className="text-3xl font-bold mb-4">
                                Unlock the power of your documents
                            </h2>
                            <p className="text-white/90 leading-relaxed">
                                Ask questions in natural language and let DocuMind surface the
                                most relevant insights from your PDFs, notes, and reports —
                                instantly.
                            </p>
                            <h2 className="font-bold mt-4">
                                - Developed By Jagan Tripuragiri
                            </h2>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
