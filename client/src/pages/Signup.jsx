import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Registration failed. Please check your connection.");
        }
    };

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">Create an account</h1>
                        <p className="mt-2 text-muted-foreground">
                            Start your journey with DocuMind today.
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Full Name</label>
                            <Input
                                type="text"
                                placeholder="John Doe"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-11 bg-secondary/50 border-border focus-visible:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-11 bg-secondary/50 border-border focus-visible:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                            <Input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-11 bg-secondary/50 border-border focus-visible:ring-primary"
                            />
                        </div>
                        <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                            Sign Up
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">Already have an account? </span>
                        <Link to="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Branding/Gradient */}
            <div className="hidden lg:flex w-1/2 bg-muted relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-bl from-blue-900 via-purple-700 to-primary opacity-90" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20" />

                <div className="relative z-10 p-12 text-white max-w-lg text-right">
                    <div className="flex justify-end mb-6">
                        <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Smart Document Intelligence</h2>
                    <p className="text-sm text-white/80 leading-relaxed">
                        a full stack application using the MERN stack that allows users to upload documents, extract content from them, and search through the information using an AI question answering feature </p>

                    <h4 className="text-lg font-semibold mt-4">- Developed By Jagan Tripuragiri</h4>

                </div>
            </div>
        </div>
    );
};

export default Signup;
