'use client';

import { useState } from 'react';

interface ReviewFormProps {
    professorId: string;
    onSubmit: (review: {
        rating: number;
        difficulty: number;
        wouldTakeAgain: boolean;
        comment: string;
    }) => void;
    onCancel: () => void;
}

export default function ReviewForm({ professorId, onSubmit, onCancel }: ReviewFormProps) {
    const [rating, setRating] = useState(5);
    const [difficulty, setDifficulty] = useState(3);
    const [wouldTakeAgain, setWouldTakeAgain] = useState(true);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setIsSubmitting(true);
        await onSubmit({ rating, difficulty, wouldTakeAgain, comment });
        setIsSubmitting(false);
    };

    const fieldLabel = (text: string) => (
        <span className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>
            {text}
        </span>
    );

    const ratingButtonStyle = (active: boolean, type: 'rating' | 'difficulty') => ({
        width: '2.5rem',
        height: '2.5rem',
        border: `1px solid ${active ? (type === 'rating' ? 'var(--color-green)' : 'var(--color-amber)') : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-sm)',
        backgroundColor: active ? (type === 'rating' ? 'var(--color-green-light)' : 'var(--color-amber-light)') : 'var(--color-surface)',
        color: active ? (type === 'rating' ? 'var(--color-green)' : 'var(--color-amber)') : 'var(--color-ink-3)',
        fontWeight: active ? '700' : '400',
        fontSize: '0.875rem',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
    });

    return (
        <form
            onSubmit={handleSubmit}
            className="p-5"
            style={{
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-subtle)',
            }}
        >
            <h3 className="text-base font-bold mb-5" style={{ color: 'var(--color-ink)' }}>
                Write a Review
            </h3>

            {/* Rating */}
            <div className="mb-5">
                {fieldLabel('Overall Rating')}
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setRating(value)}
                            style={ratingButtonStyle(rating >= value, 'rating')}
                        >
                            {value}
                        </button>
                    ))}
                </div>
            </div>

            {/* Difficulty */}
            <div className="mb-5">
                {fieldLabel('Difficulty (1 = Easy, 5 = Hard)')}
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setDifficulty(value)}
                            style={ratingButtonStyle(difficulty >= value, 'difficulty')}
                        >
                            {value}
                        </button>
                    ))}
                </div>
            </div>

            {/* Would Take Again */}
            <div className="mb-5">
                {fieldLabel('Would you take this professor again?')}
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setWouldTakeAgain(true)}
                        className="px-5 py-2 text-sm font-medium transition-all"
                        style={{
                            border: `1px solid ${wouldTakeAgain ? 'var(--color-green)' : 'var(--color-border)'}`,
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: wouldTakeAgain ? 'var(--color-blue-light)' : 'var(--color-surface)',
                            color: wouldTakeAgain ? 'var(--color-green)' : 'var(--color-ink-2)',
                        }}
                    >
                        Yes
                    </button>
                    <button
                        type="button"
                        onClick={() => setWouldTakeAgain(false)}
                        className="px-5 py-2 text-sm font-medium transition-all"
                        style={{
                            border: `1px solid ${!wouldTakeAgain ? 'var(--color-red-low)' : 'var(--color-border)'}`,
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: !wouldTakeAgain ? 'var(--color-red-light)' : 'var(--color-surface)',
                            color: !wouldTakeAgain ? 'var(--color-red-low)' : 'var(--color-ink-2)',
                        }}
                    >
                        No
                    </button>
                </div>
            </div>

            {/* Comment */}
            <div className="mb-5">
                {fieldLabel('Your Review')}
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this professor…"
                    className="w-full px-3 py-2.5 text-sm outline-none resize-none transition-colors"
                    style={{
                        height: '7rem',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-ink)',
                    }}
                    required
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-blue)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-2.5 text-sm font-medium transition-colors"
                    style={{
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-ink-2)',
                        backgroundColor: 'var(--color-surface)',
                    }}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || !comment.trim()}
                    className="flex-1 py-2.5 text-sm font-medium transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                        backgroundColor: 'var(--color-blue)',
                        color: '#fff',
                        borderRadius: 'var(--radius-sm)',
                    }}
                >
                    {isSubmitting ? 'Submitting…' : 'Submit Review'}
                </button>
            </div>
        </form>
    );
}
