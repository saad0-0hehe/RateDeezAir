import Link from 'next/link';
import { Professor } from '@/lib/types';
interface FacultyCardProps {
    professor: Professor;
    stats?: { rating: number; difficulty: number; count: number };
}

export default function FacultyCard({ professor, stats = { rating: 0, difficulty: 0, count: 0 } }: FacultyCardProps) {
    // const stats = getAverageRating(professor.id); // Removed

    const getRatingColor = (rating: number) => {
        if (rating >= 4) return 'from-emerald-500 to-green-600';
        if (rating >= 3) return 'from-yellow-500 to-amber-600';
        if (rating >= 2) return 'from-orange-500 to-red-500';
        return 'from-slate-500 to-slate-600';
    };

    return (
        <Link href={`/faculty/${professor.id}`}>
            <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 p-6 hover:border-sky-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1">
                {/* Rating Badge */}
                {stats.count > 0 && (
                    <div className={`absolute -top-3 -right-3 w-14 h-14 rounded-xl bg-gradient-to-br ${getRatingColor(stats.rating)} flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-bold text-lg">{stats.rating}</span>
                    </div>
                )}

                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-sky-500/20 overflow-hidden">
                    {professor.imageUrl ? (
                        <img
                            src={professor.imageUrl}
                            alt={professor.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Fallback to initials on error
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                    ) : null}
                    <span className={`text-white font-bold text-xl ${professor.imageUrl ? 'hidden' : ''}`}>
                        {professor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                </div>

                {/* Info */}
                <h3 className="text-lg font-semibold text-white group-hover:text-sky-400 transition-colors">
                    {professor.name}
                </h3>
                <p className="text-slate-400 text-sm mt-1">{professor.designation}</p>
                <p className="text-sky-400 text-sm font-medium mt-1">{professor.department}</p>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700/50">
                    {stats.count > 0 ? (
                        <>
                            <div className="text-center">
                                <p className="text-lg font-semibold text-white">{stats.rating}</p>
                                <p className="text-xs text-slate-500">Rating</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-semibold text-white">{stats.difficulty}</p>
                                <p className="text-xs text-slate-500">Difficulty</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-semibold text-white">{stats.count}</p>
                                <p className="text-xs text-slate-500">Reviews</p>
                            </div>
                        </>
                    ) : (
                        <p className="text-slate-500 text-sm">No reviews yet</p>
                    )}
                </div>
            </div>
        </Link>
    );
}
