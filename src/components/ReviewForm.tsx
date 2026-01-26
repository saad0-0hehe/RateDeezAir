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

    return (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Write a Review</h3>

            {/* Rating */}
            <div className="mb-6">
                <label className="block text-slate-300 text-sm font-medium mb-3">
                    Overall Rating
                </label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setRating(value)}
                            className={`w-12 h-12 rounded-xl font-bold text-lg transition-all ${rating >= value
                                    ? 'bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/25'
                                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                }`}
                        >
                            {value}
                        </button>
                    ))}
                </div>
            </div>

            {/* Difficulty */}
            <div className="mb-6">
                <label className="block text-slate-300 text-sm font-medium mb-3">
                    Difficulty (1 = Easy, 5 = Hard)
                </label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setDifficulty(value)}
                            className={`w-12 h-12 rounded-xl font-bold text-lg transition-all ${difficulty >= value
                                    ? 'bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-lg shadow-amber-500/25'
                                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                }`}
                        >
                            {value}
                        </button>
                    ))}
                </div>
            </div>

            {/* Would Take Again */}
            <div className="mb-6">
                <label className="block text-slate-300 text-sm font-medium mb-3">
                    Would you take this professor again?
                </label>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setWouldTakeAgain(true)}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${wouldTakeAgain
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                            }`}
                    >
                        Yes
                    </button>
                    <button
                        type="button"
                        onClick={() => setWouldTakeAgain(false)}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${!wouldTakeAgain
                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                            }`}
                    >
                        No
                    </button>
                </div>
            </div>

            {/* Comment */}
            <div className="mb-6">
                <label className="block text-slate-300 text-sm font-medium mb-3">
                    Your Review
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this professor..."
                    className="w-full h-32 px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                    required
                />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || !comment.trim()}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-medium shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </div>
        </form>
    );
}
