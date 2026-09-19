'use client';

import { useState } from 'react';
import { Review } from '@/lib/types';

interface ReviewCardProps {
    review: Review;
    currentUserEmail?: string;
    isAdmin?: boolean;
    onDelete?: (id: string) => void;
    onEdit?: (id: string, updates: { rating: number; difficulty: number; wouldTakeAgain: boolean; comment: string }) => void;
}

export default function ReviewCard({ review, currentUserEmail, isAdmin, onDelete, onEdit }: ReviewCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editRating, setEditRating] = useState(review.rating);
    const [editDifficulty, setEditDifficulty] = useState(review.difficulty);
    const [editWouldTakeAgain, setEditWouldTakeAgain] = useState(review.wouldTakeAgain);
    const [editComment, setEditComment] = useState(review.comment);

    const isOwner = currentUserEmail && review.userEmail === currentUserEmail;
    const canDelete = isAdmin || isOwner;
    const canEdit = isOwner;

    const getRatingColor = (rating: number): string => {
        if (rating >= 4) return 'var(--color-green)';
        if (rating >= 3) return 'var(--color-amber)';
        if (rating >= 1) return 'var(--color-red-low)';
        return 'var(--color-ink-3)';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleSaveEdit = () => {
        if (onEdit) {
            onEdit(review.id, {
                rating: editRating,
                difficulty: editDifficulty,
                wouldTakeAgain: editWouldTakeAgain,
                comment: editComment,
            });
        }
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditRating(review.rating);
        setEditDifficulty(review.difficulty);
        setEditWouldTakeAgain(review.wouldTakeAgain);
        setEditComment(review.comment);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div
                className="p-5"
                style={{
                    border: '1px solid var(--color-blue)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-blue-light)',
                }}
            >
                <h4 className="text-sm font-bold mb-4" style={{ color: 'var(--color-ink)' }}>
                    Edit Your Review
                </h4>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-ink-2)' }}>
                            Rating (1–5)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={editRating}
                            onChange={(e) => setEditRating(Number(e.target.value))}
                            className="w-full px-3 py-2 text-sm outline-none"
                            style={{
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: '#fff',
                                color: 'var(--color-ink)',
                            }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-blue)'; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-ink-2)' }}>
                            Difficulty (1–5)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={editDifficulty}
                            onChange={(e) => setEditDifficulty(Number(e.target.value))}
                            className="w-full px-3 py-2 text-sm outline-none"
                            style={{
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: '#fff',
                                color: 'var(--color-ink)',
                            }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-blue)'; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer" style={{ color: 'var(--color-ink-2)' }}>
                        <input
                            type="checkbox"
                            checked={editWouldTakeAgain}
                            onChange={(e) => setEditWouldTakeAgain(e.target.checked)}
                            className="rounded"
                            style={{ accentColor: 'var(--color-blue)' }}
                        />
                        Would take again
                    </label>
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-ink-2)' }}>
                        Comment
                    </label>
                    <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 text-sm outline-none resize-none"
                        style={{
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: '#fff',
                            color: 'var(--color-ink)',
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-blue)'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleSaveEdit}
                        className="text-sm font-medium px-4 py-2 transition-colors"
                        style={{
                            backgroundColor: 'var(--color-blue)',
                            color: '#fff',
                            borderRadius: 'var(--radius-sm)',
                        }}
                    >
                        Save
                    </button>
                    <button
                        onClick={handleCancelEdit}
                        className="text-sm font-medium px-4 py-2 transition-colors"
                        style={{
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--color-ink-2)',
                            backgroundColor: '#fff',
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="p-5 transition-colors"
            style={{
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#fff',
            }}
        >
            <div className="flex items-start justify-between gap-4">
                {/* Ratings */}
                <div className="flex items-center gap-4">
                    {/* Overall rating — plain number in semantic color */}
                    <div>
                        <span
                            className="text-2xl font-bold"
                            style={{ color: getRatingColor(review.rating) }}
                        >
                            {review.rating}
                        </span>
                        <span className="text-xs ml-0.5" style={{ color: 'var(--color-ink-3)' }}>/5</span>
                    </div>
                    <div>
                        <p className="text-xs" style={{ color: 'var(--color-ink-3)' }}>
                            Difficulty:{' '}
                            <span className="font-medium" style={{ color: 'var(--color-ink-2)' }}>
                                {review.difficulty}/5
                            </span>
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-3)' }}>
                            Would take again:{' '}
                            <span
                                className="font-medium"
                                style={{ color: review.wouldTakeAgain ? 'var(--color-green)' : 'var(--color-red-low)' }}
                            >
                                {review.wouldTakeAgain ? 'Yes' : 'No'}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Date & Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs" style={{ color: 'var(--color-ink-3)' }}>
                        {formatDate(review.createdAt)}
                    </span>

                    {canEdit && onEdit && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-1.5 transition-colors"
                            style={{ color: 'var(--color-ink-3)', borderRadius: 'var(--radius-sm)' }}
                            title="Edit review"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                    )}

                    {canDelete && onDelete && (
                        <button
                            onClick={() => onDelete(review.id)}
                            className="p-1.5 transition-colors"
                            style={{ color: 'var(--color-red-low)', borderRadius: 'var(--radius-sm)' }}
                            title="Delete review"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Comment */}
            <p className="text-sm mt-4 leading-relaxed" style={{ color: 'var(--color-ink-2)' }}>
                {review.comment}
            </p>

            {/* Owner indicator */}
            {isOwner && (
                <p className="mt-3 text-xs font-medium" style={{ color: 'var(--color-blue)' }}>
                    Your review
                </p>
            )}
        </div>
    );
}
