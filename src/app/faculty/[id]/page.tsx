'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { getProfessorById, getReviewsByProfessorId, getAverageRating, addReviewWithEmail } from '@/lib/data';
import { Professor, Review } from '@/lib/types';
import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';

export default function ProfessorDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useUser();
    const [professor, setProfessor] = useState<Professor | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [stats, setStats] = useState({ rating: 0, difficulty: 0, count: 0 });

    const professorId = params.id as string;

    useEffect(() => {
        async function loadData() {
            try {
                const prof = await getProfessorById(professorId);
                if (prof) {
                    setProfessor(prof);
                    const profReviews = await getReviewsByProfessorId(professorId);
                    setReviews(profReviews);
                    const profStats = await getAverageRating(professorId);
                    setStats(profStats);
                }
            } catch (error) {
                console.error("Failed to load professor data:", error);
            }
        }
        if (professorId) {
            loadData();
        }
    }, [professorId]);

    const handleSubmitReview = async (reviewData: {
        rating: number;
        difficulty: number;
        wouldTakeAgain: boolean;
        comment: string;
    }) => {
        if (!user || !user.email) {
            alert("Please login with email to submit a review.");
            return;
        }

        try {
            const newReview = await addReviewWithEmail({
                professorId,
                ...reviewData,
            }, user.email);

            if (newReview) {
                setReviews([newReview, ...reviews]);
                const newStats = await getAverageRating(professorId);
                setStats(newStats);
                setShowReviewForm(false);
            }
        } catch (error) {
            console.error("Failed to submit review:", error);
            alert("Failed to submit review. Please try again.");
        }
    };

    if (!professor) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h1 className="text-2xl font-bold text-white mb-4">Loading...</h1>
                <Link href="/faculty" className="text-sky-400 hover:underline">
                    ← Back to Faculty
                </Link>
            </div>
        );
    }

    const getRatingColor = (rating: number) => {
        if (rating >= 4) return 'from-emerald-500 to-green-600';
        if (rating >= 3) return 'from-yellow-500 to-amber-600';
        if (rating >= 2) return 'from-orange-500 to-red-500';
        return 'from-slate-500 to-slate-600';
    };

    const wouldTakeAgainPercent = reviews.length > 0
        ? Math.round((reviews.filter((r) => r.wouldTakeAgain).length / reviews.length) * 100)
        : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Link */}
            <Link href="/faculty" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Faculty
            </Link>

            {/* Professor Header */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 p-6 md:p-8 mb-8">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20 overflow-hidden">
                        {professor.imageUrl ? (
                            <img
                                src={professor.imageUrl}
                                alt={professor.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                        ) : null}
                        <span className={`text-white font-bold text-3xl ${professor.imageUrl ? 'hidden' : ''}`}>
                            {professor.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{professor.name}</h1>
                        <p className="text-slate-400">{professor.designation}</p>
                        <p className="text-sky-400 font-medium">{professor.department}</p>
                        {professor.qualifications && (
                            <p className="text-slate-500 text-sm mt-2">{professor.qualifications}</p>
                        )}
                        {professor.detailUrl && (
                            <a href={professor.detailUrl} target="_blank" rel="noopener noreferrer" className="text-sky-500 text-sm mt-2 inline-block hover:underline">
                                View University Profile ↗
                            </a>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 md:gap-6">
                        {stats.count > 0 ? (
                            <>
                                <div className="text-center">
                                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getRatingColor(stats.rating)} flex items-center justify-center shadow-lg mb-2`}>
                                        <span className="text-white font-bold text-3xl">{stats.rating}</span>
                                    </div>
                                    <p className="text-slate-400 text-sm">Rating</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-20 h-20 rounded-2xl bg-slate-700 flex items-center justify-center mb-2">
                                        <span className="text-white font-bold text-3xl">{stats.difficulty}</span>
                                    </div>
                                    <p className="text-slate-400 text-sm">Difficulty</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-20 h-20 rounded-2xl bg-slate-700 flex items-center justify-center mb-2">
                                        <span className="text-white font-bold text-2xl">{wouldTakeAgainPercent}%</span>
                                    </div>
                                    <p className="text-slate-400 text-sm">Would Retake</p>
                                </div>
                            </>
                        ) : (
                            <div className="text-center px-6 py-4 bg-slate-700/50 rounded-2xl">
                                <p className="text-slate-400">No ratings yet</p>
                                <p className="text-white font-medium mt-1">Be the first to review!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">
                            Reviews ({reviews.length})
                        </h2>
                        {!showReviewForm && (
                            user ? (
                                <button
                                    onClick={() => setShowReviewForm(true)}
                                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-sm font-medium shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all"
                                >
                                    Write a Review
                                </button>
                            ) : (
                                <a
                                    href="/api/auth/login"
                                    className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors"
                                >
                                    Login to Review
                                </a>
                            )
                        )}
                    </div>

                    {showReviewForm && (
                        <ReviewForm
                            professorId={professorId}
                            onSubmit={handleSubmitReview}
                            onCancel={() => setShowReviewForm(false)}
                        />
                    )}

                    {reviews.length > 0 ? (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                            </div>
                            <p className="text-slate-400 mb-4">No reviews yet for this professor.</p>
                            {user ? (
                                <button
                                    onClick={() => setShowReviewForm(true)}
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-medium shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all"
                                >
                                    Be the first to review
                                </button>
                            ) : (
                                <a
                                    href="/api/auth/login"
                                    className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-medium shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all"
                                >
                                    Login to add a review
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Rating Distribution */}
                    {reviews.length > 0 && (
                        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Rating Distribution</h3>
                            <div className="space-y-3">
                                {[5, 4, 3, 2, 1].map((rating) => {
                                    const count = reviews.filter((r) => r.rating === rating).length;
                                    const percent = (count / reviews.length) * 100;
                                    return (
                                        <div key={rating} className="flex items-center gap-3">
                                            <span className="text-slate-400 text-sm w-4">{rating}</span>
                                            <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full transition-all"
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                            <span className="text-slate-500 text-sm w-8">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Quick Stats */}
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Total Reviews</span>
                                <span className="text-white font-medium">{reviews.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Department</span>
                                <span className="text-white font-medium">{professor.department}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Designation</span>
                                <span className="text-white font-medium">{professor.designation}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
