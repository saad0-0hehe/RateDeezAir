import { Review } from '@/lib/types';

interface ReviewCardProps {
    review: Review;
    onDelete?: (id: string) => void;
    showDelete?: boolean;
}

export default function ReviewCard({ review, onDelete, showDelete }: ReviewCardProps) {
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

                {/* Date & Delete */}
                <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-sm">{formatDate(review.createdAt)}</span>
                    {showDelete && onDelete && (
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
        </div>
    );
}
