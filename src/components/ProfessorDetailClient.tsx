'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { getProfessorById, getReviewsByProfessorId, getAverageRating, addReviewWithEmail, deleteReview, updateReview } from '@/lib/data';
import { Professor, Review } from '@/lib/types';
import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';

interface ProfessorDetailClientProps {
    professorId: string;
}

// Avatar bg — only shown when photo is absent (initials fallback)
function getAvatarBg(): string {
    return 'var(--color-bg-subtle)';
}

function getRatingColor(rating: number): string {
    if (rating >= 4) return 'var(--color-green)';
    if (rating >= 3) return 'var(--color-amber)';
    if (rating >= 1) return 'var(--color-red-low)';
    return 'var(--color-ink-3)';
}

export default function ProfessorDetailClient({ professorId }: ProfessorDetailClientProps) {
    const { user } = useUser();
    const [professor, setProfessor] = useState<Professor | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [stats, setStats] = useState({ rating: 0, difficulty: 0, count: 0 });
    const [copied, setCopied] = useState(false);

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

    const handleDeleteReview = async (reviewId: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        const success = await deleteReview(reviewId);
        if (success) {
            setReviews(reviews.filter(r => r.id !== reviewId));
            const newStats = await getAverageRating(professorId);
            setStats(newStats);
        } else {
            alert('Failed to delete review.');
        }
    };

    const handleEditReview = async (
        reviewId: string,
        updates: { rating: number; difficulty: number; wouldTakeAgain: boolean; comment: string }
    ) => {
        const updated = await updateReview(reviewId, updates);
        if (updated) {
            setReviews(reviews.map(r => r.id === reviewId ? updated : r));
            const newStats = await getAverageRating(professorId);
            setStats(newStats);
        } else {
            alert('Failed to update review.');
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!professor) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <p className="text-sm" style={{ color: 'var(--color-ink-3)' }}>Loading…</p>
                <Link
                    href="/faculty"
                    className="text-sm font-medium mt-2 inline-block transition-opacity hover:opacity-70"
                    style={{ color: 'var(--color-blue)' }}
                >
                    ← Back to Faculty
                </Link>
            </div>
        );
    }

    const initials = professor.name.split(' ').map((n) => n[0]).join('').slice(0, 2);

    const wouldTakeAgainPercent = reviews.length > 0
        ? Math.round((reviews.filter((r) => r.wouldTakeAgain).length / reviews.length) * 100)
        : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* Back + Share row */}
            <div className="flex items-center justify-between mb-8">
                <Link
                    href="/faculty"
                    className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
                    style={{ color: 'var(--color-ink-2)' }}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Faculty Directory
                </Link>

                <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 transition-colors"
                    style={{
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        color: copied ? 'var(--color-green)' : 'var(--color-ink-2)',
                        backgroundColor: 'var(--color-surface)',
                    }}
                >
                    {copied ? (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Link Copied
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            Share
                        </>
                    )}
                </button>
            </div>

            {/* Professor header */}
            <div
                className="flex flex-col sm:flex-row gap-6 p-6 mb-8"
                style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-subtle)',
                }}
            >
                {/* Avatar — bg shown only for initials fallback; photo shows without colored bg */}
                <div
                    className="w-16 h-16 flex-shrink-0 flex items-center justify-center text-xl font-bold overflow-hidden"
                    style={{ borderRadius: 'var(--radius-full)', backgroundColor: professor.imageUrl ? 'transparent' : getAvatarBg(), color: 'var(--color-ink-2)' }}
                >
                    {professor.imageUrl ? (
                        <img
                            src={professor.imageUrl}
                            alt={professor.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const sibling = e.currentTarget.nextElementSibling as HTMLElement | null;
                                if (sibling) sibling.style.display = 'flex';
                            }}
                        />
                    ) : null}
                    <span style={{ display: professor.imageUrl ? 'none' : 'flex' }}>{initials}</span>
                </div>

                {/* Info */}
                <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-0.5" style={{ color: 'var(--color-ink)' }}>
                        {professor.name}
                    </h1>
                    <p className="text-sm" style={{ color: 'var(--color-ink-2)' }}>{professor.designation}</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-blue)' }}>
                        {professor.department}
                    </p>
                    {professor.qualifications && (
                        <p className="text-xs mt-1.5" style={{ color: 'var(--color-ink-3)' }}>
                            {professor.qualifications}
                        </p>
                    )}
                    {professor.detailUrl && (
                        <a
                            href={professor.detailUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs mt-2 inline-block hover:underline"
                            style={{ color: 'var(--color-blue)' }}
                        >
                            University Profile ↗
                        </a>
                    )}
                </div>

                {/* Stats — inline row, no boxes */}
                <div className="flex items-center gap-0 sm:gap-0 flex-shrink-0 self-start sm:self-center">
                    {stats.count > 0 ? (
                        <>
                            <div className="pr-5 text-center">
                                <p className="text-3xl font-bold" style={{ color: getRatingColor(stats.rating) }}>
                                    {stats.rating}
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-3)' }}>Rating</p>
                            </div>
                            <div
                                className="self-stretch"
                                style={{ width: '1px', backgroundColor: 'var(--color-border)' }}
                            />
                            <div className="px-5 text-center">
                                <p className="text-3xl font-bold" style={{ color: 'var(--color-ink)' }}>
                                    {stats.difficulty}
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-3)' }}>Difficulty</p>
                            </div>
                            <div
                                className="self-stretch"
                                style={{ width: '1px', backgroundColor: 'var(--color-border)' }}
                            />
                            <div className="pl-5 text-center">
                                <p className="text-3xl font-bold" style={{ color: 'var(--color-ink)' }}>
                                    {wouldTakeAgainPercent}%
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-3)' }}>Would Retake</p>
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <p className="text-sm" style={{ color: 'var(--color-ink-3)' }}>No ratings yet</p>
                            <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--color-ink-2)' }}>
                                Be the first!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Reviews Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Reviews list */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold" style={{ color: 'var(--color-ink)' }}>
                            Reviews ({reviews.length})
                        </h2>
                        {!showReviewForm && (
                            user ? (
                                <button
                                    onClick={() => setShowReviewForm(true)}
                                    className="text-sm font-medium px-4 py-2 transition-colors"
                                    style={{
                                        backgroundColor: 'var(--color-blue)',
                                        color: '#fff',
                                        borderRadius: 'var(--radius-sm)',
                                    }}
                                >
                                    Write a Review
                                </button>
                            ) : (
                                <a
                                    href="/auth/login"
                                    className="text-sm font-medium px-4 py-2 transition-colors"
                                    style={{
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        color: 'var(--color-ink-2)',
                                        backgroundColor: 'var(--color-surface)',
                                    }}
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
                        <div className="space-y-3">
                            {reviews.map((review) => (
                                <ReviewCard
                                    key={review.id}
                                    review={review}
                                    currentUserEmail={user?.email || undefined}
                                    onDelete={handleDeleteReview}
                                    onEdit={handleEditReview}
                                />
                            ))}
                        </div>
                    ) : (
                        <div
                            className="py-10 text-center"
                            style={{
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: 'var(--color-bg-subtle)',
                            }}
                        >
                            <p className="text-sm mb-4" style={{ color: 'var(--color-ink-3)' }}>
                                No reviews yet for this professor.
                            </p>
                            {user ? (
                                <button
                                    onClick={() => setShowReviewForm(true)}
                                    className="text-sm font-medium px-4 py-2 transition-colors"
                                    style={{
                                        backgroundColor: 'var(--color-blue)',
                                        color: '#fff',
                                        borderRadius: 'var(--radius-sm)',
                                    }}
                                >
                                    Be the first to review
                                </button>
                            ) : (
                                <a
                                    href="/auth/login"
                                    className="inline-block text-sm font-medium px-4 py-2 transition-colors"
                                    style={{
                                        backgroundColor: 'var(--color-blue)',
                                        color: '#fff',
                                        borderRadius: 'var(--radius-sm)',
                                    }}
                                >
                                    Login to add a review
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Rating Distribution */}
                    {reviews.length > 0 && (
                        <div
                            className="p-5"
                            style={{
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: 'var(--color-surface)',
                            }}
                        >
                            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--color-ink)' }}>
                                Rating Distribution
                            </h3>
                            <div className="space-y-2">
                                {[5, 4, 3, 2, 1].map((rating) => {
                                    const count = reviews.filter((r) => r.rating === rating).length;
                                    const percent = (count / reviews.length) * 100;
                                    return (
                                        <div key={rating} className="flex items-center gap-3">
                                            <span className="text-xs w-3 text-right" style={{ color: 'var(--color-ink-3)' }}>
                                                {rating}
                                            </span>
                                            <div
                                                className="flex-1 overflow-hidden"
                                                style={{
                                                    height: '6px',
                                                    backgroundColor: 'var(--color-border)',
                                                    borderRadius: 'var(--radius-full)',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: `${percent}%`,
                                                        height: '100%',
                                                        backgroundColor: getRatingColor(rating),
                                                        borderRadius: 'var(--radius-full)',
                                                        transition: 'width 0.3s ease',
                                                    }}
                                                />
                                            </div>
                                            <span className="text-xs w-4 text-right" style={{ color: 'var(--color-ink-3)' }}>
                                                {count}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Quick Stats */}
                    <div
                        className="p-5"
                        style={{
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--color-surface)',
                        }}
                    >
                        <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--color-ink)' }}>
                            Quick Stats
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm" style={{ color: 'var(--color-ink-3)' }}>Total Reviews</span>
                                <span className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                                    {reviews.length}
                                </span>
                            </div>
                            <div
                                style={{ height: '1px', backgroundColor: 'var(--color-border)' }}
                            />
                            <div className="flex justify-between">
                                <span className="text-sm" style={{ color: 'var(--color-ink-3)' }}>Department</span>
                                <span className="text-sm font-medium text-right max-w-[60%]" style={{ color: 'var(--color-ink)' }}>
                                    {professor.department}
                                </span>
                            </div>
                            <div
                                style={{ height: '1px', backgroundColor: 'var(--color-border)' }}
                            />
                            <div className="flex justify-between">
                                <span className="text-sm" style={{ color: 'var(--color-ink-3)' }}>Designation</span>
                                <span className="text-sm font-medium text-right max-w-[60%]" style={{ color: 'var(--color-ink)' }}>
                                    {professor.designation}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
