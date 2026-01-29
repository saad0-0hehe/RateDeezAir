'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getAllProfessors, getAllReviews, deleteReview, getAllFeedback, deleteFeedback } from '@/lib/data';
import { Professor, Review, Feedback } from '@/lib/types';
import ReviewCard from '@/components/ReviewCard';
import Link from 'next/link';

interface ProfessorWithReviews extends Professor {
    reviews: Review[];
}

export default function AdminPage() {
    const { user, isLoading } = useUser();
    const [professorsWithReviews, setProfessorsWithReviews] = useState<ProfessorWithReviews[]>([]);
    const [selectedProfessor, setSelectedProfessor] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'reviews' | 'feedback'>('reviews');
    const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);

    useEffect(() => {
        if (user) {
            loadData();
            loadFeedback();
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

    const loadFeedback = async () => {
        const feedback = await getAllFeedback();
        setFeedbackList(feedback);
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (confirm('Are you sure you want to delete this review?')) {
            await deleteReview(reviewId);
            loadData();
        }
    };

    const handleDeleteFeedback = async (feedbackId: string) => {
        if (confirm('Are you sure you want to delete this feedback?')) {
            await deleteFeedback(feedbackId);
            loadFeedback();
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

    // Check if user is admin
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || '242885@students.au.edu.pk';
    const isAdmin = user.email === adminEmail;

    if (!isAdmin) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-red-900/50 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
                <p className="text-slate-400 mb-6">You don't have permission to access the admin panel.</p>
                <a
                    href="/"
                    className="inline-block px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition-all"
                >
                    Go Home
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
                <p className="text-slate-400">Manage reviews and feedback</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
                    <p className="text-slate-400 text-sm">Total Reviews</p>
                    <p className="text-3xl font-bold text-white mt-1">{totalReviews}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
                    <p className="text-slate-400 text-sm">Professors with Reviews</p>
                    <p className="text-3xl font-bold text-white mt-1">{professorsWithReviews.length}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
                    <p className="text-slate-400 text-sm">Feedback Messages</p>
                    <p className="text-3xl font-bold text-white mt-1">{feedbackList.length}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
                    <p className="text-slate-400 text-sm">Logged in as</p>
                    <p className="text-lg font-medium text-white mt-1 truncate">{user.email}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('reviews')}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all ${activeTab === 'reviews'
                            ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                            : 'bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50'
                        }`}
                >
                    Reviews
                </button>
                <button
                    onClick={() => setActiveTab('feedback')}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all ${activeTab === 'feedback'
                            ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                            : 'bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50'
                        }`}
                >
                    Feedback ({feedbackList.length})
                </button>
            </div>

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
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
                                                    isAdmin={true}
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
            )}

            {/* Feedback Tab */}
            {activeTab === 'feedback' && (
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-white">User Feedback</h2>

                    {feedbackList.length > 0 ? (
                        <div className="space-y-4">
                            {feedbackList.map((feedback) => (
                                <div key={feedback.id} className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-sky-400 text-sm font-medium truncate">{feedback.email}</span>
                                                <span className="text-slate-500 text-xs">
                                                    {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                            <p className="text-white whitespace-pre-wrap">{feedback.message}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteFeedback(feedback.id)}
                                            className="p-2 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-colors flex-shrink-0"
                                            title="Delete feedback"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-8 text-center">
                            <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <p className="text-slate-400">No feedback received yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

