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

    const getRatingColor = (rating: number) => {
        if (rating >= 4) return 'bg-emerald-500';
        if (rating >= 3) return 'bg-yellow-500';
        if (rating >= 2) return 'bg-orange-500';
        return 'bg-red-500';
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
            <div className="bg-slate-800/50 rounded-xl border border-sky-500/50 p-5">
                <h4 className="text-white font-medium mb-4">Edit Your Review</h4>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Rating (1-5)</label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={editRating}
                            onChange={(e) => setEditRating(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-sky-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Difficulty (1-5)</label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={editDifficulty}
                            onChange={(e) => setEditDifficulty(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-sky-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="flex items-center gap-2 text-slate-400 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={editWouldTakeAgain}
                            onChange={(e) => setEditWouldTakeAgain(e.target.checked)}
                            className="rounded"
                        />
                        Would take again
                    </label>
                </div>

                <div className="mb-4">
                    <label className="block text-slate-400 text-sm mb-1">Comment</label>
                    <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-sky-500 focus:outline-none resize-none"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleSaveEdit}
                        className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium transition-colors"
                    >
                        Save
                    </button>
                    <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5 hover:border-slate-600/50 transition-colors">
            <div className="flex items-start justify-between gap-4">
                {/* Rating Badges */}
                <div className="flex items-center gap-3">
                    <div className={`${getRatingColor(review.rating)} w-12 h-12 rounded-xl flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-bold text-lg">{review.rating}</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-slate-400">Difficulty:</span>
                            <span className="text-white font-medium">{review.difficulty}/5</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm mt-1">
                            <span className="text-slate-400">Would take again:</span>
                            <span className={review.wouldTakeAgain ? 'text-emerald-400' : 'text-red-400'}>
                                {review.wouldTakeAgain ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Date & Actions */}
                <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-sm">{formatDate(review.createdAt)}</span>

                    {canEdit && onEdit && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 transition-colors"
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
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
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
            <p className="text-slate-300 mt-4 leading-relaxed">{review.comment}</p>

            {/* Owner indicator */}
            {isOwner && (
                <div className="mt-3 text-xs text-sky-400">Your review</div>
            )}
        </div>
    );
}
