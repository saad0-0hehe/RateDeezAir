'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

const ALLOWED_DOMAIN = '@students.au.edu.pk';

export default function Navbar() {
    const { user, isLoading } = useUser();
    const [invalidEmail, setInvalidEmail] = useState(false);

    // Auto-logout users who sign in with non-student emails
    useEffect(() => {
        if (!isLoading && user && user.email) {
            const email = user.email as string;
            if (!email.endsWith(ALLOWED_DOMAIN)) {
                setInvalidEmail(true);
                // Give a brief moment for the user to see the message, then redirect to logout
                const timer = setTimeout(() => {
                    window.location.href = '/auth/logout';
                }, 2500);
                return () => clearTimeout(timer);
            }
        }
    }, [user, isLoading]);

    // Show a full-screen overlay when an invalid email is detected
    if (invalidEmail) {
        return (
            <>
                <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 backdrop-blur-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                                    <img src="/logo.png" alt="RateDeezAir Logo" className="w-full h-full object-cover" />
                                </div>
                                <div className="hidden sm:block">
                                    <span className="text-white font-semibold text-lg">RateDeezAir</span>
                                    <span className="text-sky-400 text-xs block -mt-1">Rate Your Professors</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </nav>
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-sm">
                    <div className="bg-slate-800 rounded-2xl border border-red-500/30 p-8 max-w-md mx-4 text-center animate-fade-in">
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Student Email Required</h2>
                        <p className="text-slate-400 mb-2">
                            Only <span className="text-sky-400 font-medium">@students.au.edu.pk</span> emails are allowed.
                        </p>
                        <p className="text-slate-500 text-sm mb-4">
                            You signed in with <span className="text-red-400">{user?.email}</span>
                        </p>
                        <p className="text-slate-500 text-sm">Logging you out automatically...</p>
                        <div className="mt-4">
                            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500 rounded-full animate-progress" style={{
                                    animation: 'progress 2.5s linear forwards'
                                }} />
                            </div>
                        </div>
                        <a
                            href="/auth/logout"
                            className="inline-block mt-4 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm font-medium transition-colors"
                        >
                            Logout Now
                        </a>
                    </div>
                </div>
                <style jsx>{`
                    @keyframes progress {
                        from { width: 0%; }
                        to { width: 100%; }
                    }
                `}</style>
            </>
        );
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 backdrop-blur-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                            <img
                                src="/logo.png"
                                alt="RateDeezAir Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-white font-semibold text-lg">RateDeezAir</span>
                            <span className="text-sky-400 text-xs block -mt-1">Rate Your Professors</span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-slate-300 hover:text-white transition-colors">
                            Home
                        </Link>
                        <Link href="/faculty" className="text-slate-300 hover:text-white transition-colors">
                            Faculty
                        </Link>
                        <Link href="/feedback" className="text-slate-300 hover:text-white transition-colors">
                            Feedback
                        </Link>
                        {user && (
                            <Link href="/add-faculty" className="text-slate-300 hover:text-white transition-colors">
                                Add Faculty
                            </Link>
                        )}
                        {user && user.email === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '242885@students.au.edu.pk') && (
                            <Link href="/admin" className="text-slate-300 hover:text-white transition-colors">
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Auth Section */}
                    <div className="flex items-center gap-4">
                        {isLoading ? (
                            <div className="w-8 h-8 rounded-full bg-slate-700 animate-pulse" />
                        ) : user ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm text-white font-medium">{user.name}</p>
                                    <p className="text-xs text-slate-400">{user.email}</p>
                                </div>
                                <a
                                    href="/auth/logout"
                                    className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors"
                                >
                                    Logout
                                </a>
                            </div>
                        ) : (
                            <a
                                href="/auth/login"
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-sm font-medium shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all"
                            >
                                Login with Student Email
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

