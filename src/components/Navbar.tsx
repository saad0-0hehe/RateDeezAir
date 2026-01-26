'use client';

import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Navbar() {
    const { user, isLoading } = useUser();

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
                        {user && (
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
                                    href="/api/auth/logout"
                                    className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors"
                                >
                                    Logout
                                </a>
                            </div>
                        ) : (
                            <a
                                href="/api/auth/login"
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
