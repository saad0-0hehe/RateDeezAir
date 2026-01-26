'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getAllProfessors, getAllReviews, deleteReview } from '@/lib/data';
import { Professor, Review } from '@/lib/types';
import ReviewCard from '@/components/ReviewCard';
import Link from 'next/link';

interface ProfessorWithReviews extends Professor {
    reviews: Review[];
}

export default function AdminPage() {
    const { user, isLoading } = useUser();
    const [professorsWithReviews, setProfessorsWithReviews] = useState<ProfessorWithReviews[]>([]);
    const [selectedProfessor, setSelectedProfessor] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user]);

    const loadData = async () => {
        const [professors, reviews] = await Promise.all([
            getAllProfessors(),
            getAllReviews()
        ]);

        const withReviews = professors.map((p) => ({
            ...p,
            reviews: reviews.filter(r => r.professorId === p.id),
        })).filter((p) => p.reviews.length > 0);

        setProfessorsWithReviews(withReviews);
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (confirm('Are you sure you want to delete this review?')) {
            await deleteReview(reviewId);
            loadData();
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-slate-400 mt-4">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-4">Admin Access Required</h1>
                <p className="text-slate-400 mb-6">Please login to access the admin panel.</p>
                <a
                    href="/auth/login"
                    className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-medium shadow-lg shadow-sky-500/25 transition-all"
                >
                    Login
                </a>
            </div>
        );
    }

    const totalReviews = professorsWithReviews.reduce((sum, p) => sum + p.reviews.length, 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
                <p className="text-slate-400">Manage and moderate reviews</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
                    <p className="text-slate-400 text-sm">Total Reviews</p>
                    <p className="text-3xl font-bold text-white mt-1">{totalReviews}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
                    <p className="text-slate-400 text-sm">Professors with Reviews</p>
                    <p className="text-3xl font-bold text-white mt-1">{professorsWithReviews.length}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
                    <p className="text-slate-400 text-sm">Logged in as</p>
                    <p className="text-lg font-medium text-white mt-1 truncate">{user.email}</p>
                </div>
            </div>

            {/* Reviews by Professor */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Reviews by Professor</h2>

                {professorsWithReviews.length > 0 ? (
                    <div className="space-y-4">
                        {professorsWithReviews.map((professor) => (
                            <div key={professor.id} className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
                                {/* Professor Header */}
                                <button
                                    onClick={() => setSelectedProfessor(selectedProfessor === professor.id ? null : professor.id)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                                            <span className="text-white font-bold">
                                                {professor.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                                            </span>
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-white font-medium">{professor.name}</h3>
                                            <p className="text-slate-400 text-sm">{professor.department}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 text-sm font-medium">
                                            {professor.reviews.length} reviews
                                        </span>
                                        <svg
                                            className={`w-5 h-5 text-slate-400 transition-transform ${selectedProfessor === professor.id ? 'rotate-180' : ''
                                                }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>

                                {/* Reviews */}
                                {selectedProfessor === professor.id && (
                                    <div className="p-4 pt-0 space-y-4">
                                        {professor.reviews.map((review) => (
                                            <ReviewCard
                                                key={review.id}
                                                review={review}
                                                showDelete
                                                onDelete={handleDeleteReview}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-8 text-center">
                        <p className="text-slate-400">No reviews to moderate yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
