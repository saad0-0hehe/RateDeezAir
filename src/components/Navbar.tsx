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
                <nav
                    style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}
                    className="fixed top-0 left-0 right-0 z-50"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="w-10 h-10 overflow-hidden" style={{ borderRadius: 'var(--radius-md)' }}>
                                    <img src="/logo.png" alt="RateDeezAir Logo" className="w-full h-full object-cover" />
                                </div>
                                <span className="hidden sm:block font-bold text-lg" style={{ color: 'var(--color-ink)' }}>
                                    RateDeezAir
                                </span>
                            </Link>
                        </div>
                    </div>
                </nav>
                {/* Invalid email overlay */}
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(245,242,238,0.97)' }}
                >
                    <div
                        className="p-8 max-w-md mx-4 text-center animate-fade-in"
                        style={{
                            backgroundColor: 'var(--color-bg)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                        }}
                    >
                        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-ink)' }}>
                            Student Email Required
                        </h2>
                        <p className="text-sm mb-1" style={{ color: 'var(--color-ink-2)' }}>
                            Only{' '}
                            <span style={{ color: 'var(--color-blue)', fontWeight: 500 }}>
                                @students.au.edu.pk
                            </span>{' '}
                            emails are allowed.
                        </p>
                        <p className="text-sm mb-4" style={{ color: 'var(--color-ink-3)' }}>
                            You signed in with{' '}
                            <span style={{ color: 'var(--color-red-low)' }}>{user?.email}</span>
                        </p>
                        <p className="text-sm mb-4" style={{ color: 'var(--color-ink-3)' }}>
                            Logging you out automatically…
                        </p>
                        <div
                            className="h-1 overflow-hidden mb-4"
                            style={{ backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-full)' }}
                        >
                            <div
                                className="h-full"
                                style={{
                                    backgroundColor: 'var(--color-red-low)',
                                    animation: 'progress 2.5s linear forwards',
                                    borderRadius: 'var(--radius-full)',
                                }}
                            />
                        </div>
                        <a
                            href="/auth/logout"
                            className="inline-block text-sm font-medium px-4 py-2 transition-colors"
                            style={{
                                color: 'var(--color-red-low)',
                                border: '1px solid var(--color-red-low)',
                                borderRadius: 'var(--radius-sm)',
                            }}
                        >
                            Logout Now
                        </a>
                    </div>
                </div>
            </>
        );
    }

    return (
        <nav
            style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}
            className="fixed top-0 left-0 right-0 z-50"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden flex-shrink-0" style={{ borderRadius: 'var(--radius-md)' }}>
                            <img
                                src="/logo.png"
                                alt="RateDeezAir Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="hidden sm:block">
                            <span className="font-bold text-base" style={{ color: 'var(--color-ink)' }}>
                                RateDeezAir
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-7">
                        <Link
                            href="/"
                            className="text-sm font-medium transition-colors hover:opacity-70"
                            style={{ color: 'var(--color-ink-2)' }}
                        >
                            Home
                        </Link>
                        <Link
                            href="/faculty"
                            className="text-sm font-medium transition-colors hover:opacity-70"
                            style={{ color: 'var(--color-ink-2)' }}
                        >
                            Faculty
                        </Link>
                        <Link
                            href="/feedback"
                            className="text-sm font-medium transition-colors hover:opacity-70"
                            style={{ color: 'var(--color-ink-2)' }}
                        >
                            Feedback
                        </Link>
                        {user && (
                            <Link
                                href="/add-faculty"
                                className="text-sm font-medium transition-colors hover:opacity-70"
                                style={{ color: 'var(--color-ink-2)' }}
                            >
                                Add Faculty
                            </Link>
                        )}
                        {user && user.email === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '242885@students.au.edu.pk') && (
                            <Link
                                href="/admin"
                                className="text-sm font-medium transition-colors hover:opacity-70"
                                style={{ color: 'var(--color-ink-2)' }}
                            >
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Auth Section */}
                    <div className="flex items-center gap-3">
                        {isLoading ? (
                            <div
                                className="w-8 h-8 animate-pulse"
                                style={{ backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-full)' }}
                            />
                        ) : user ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                                        {user.name}
                                    </p>
                                    <p className="text-xs" style={{ color: 'var(--color-ink-3)' }}>
                                        {user.email}
                                    </p>
                                </div>
                                <a
                                    href="/auth/logout"
                                    className="text-sm font-medium px-4 py-1.5 transition-colors"
                                    style={{
                                        color: 'var(--color-ink-2)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-sm)',
                                    }}
                                >
                                    Logout
                                </a>
                            </div>
                        ) : (
                            <a
                                href="/auth/login"
                                className="text-sm font-medium px-4 py-1.5 transition-colors"
                                style={{
                                    color: 'var(--color-blue)',
                                    border: '1px solid var(--color-blue)',
                                    borderRadius: 'var(--radius-full)',
                                }}
                            >
                                Student Login
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
