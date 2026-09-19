import Link from 'next/link';
import { Professor } from '@/lib/types';

interface FacultyCardProps {
    professor: Professor;
    stats?: { rating: number; difficulty: number; count: number };
}

// Deterministic avatar background from professor id — no gradients
function getAvatarColor(id: string): string {
    const palette = ['#D9EAF4', '#D6EAE0', '#F4EDD9', '#EAD9F4', '#F4D9D9', '#D9F4F0'];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff;
    }
    return palette[Math.abs(hash) % palette.length];
}

function getAvatarTextColor(bg: string): string {
    // All palette colors are light, so dark ink is always fine
    return 'var(--color-ink-2)';
}

function getRatingStyle(rating: number): { color: string } {
    if (rating >= 4) return { color: 'var(--color-green)' };
    if (rating >= 3) return { color: 'var(--color-amber)' };
    if (rating >= 1) return { color: 'var(--color-red-low)' };
    return { color: 'var(--color-ink-3)' };
}

export default function FacultyCard({ professor, stats = { rating: 0, difficulty: 0, count: 0 } }: FacultyCardProps) {
    const avatarBg = getAvatarColor(professor.id);
    const avatarText = getAvatarTextColor(avatarBg);
    const initials = professor.name.split(' ').map(n => n[0]).join('').slice(0, 2);

    return (
        <Link href={`/faculty/${professor.id}`} className="block group">
            <div className="rda-card-row flex items-center gap-4 px-4 py-3.5">

                {/* Avatar — solid hash-based color, no gradient */}
                <div
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-sm font-bold overflow-hidden"
                    style={{ borderRadius: 'var(--radius-full)', backgroundColor: avatarBg, color: avatarText }}
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

                {/* Name + designation + dept */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--color-ink)' }}>
                        {professor.name}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--color-ink-3)' }}>
                        {professor.designation && `${professor.designation} · `}{professor.department}
                    </p>
                </div>

                {/* Rating + review count */}
                {stats.count > 0 ? (
                    <div className="flex-shrink-0 text-right">
                        <p className="text-sm font-bold" style={getRatingStyle(stats.rating)}>
                            {stats.rating}
                            <span className="font-normal text-xs ml-0.5" style={{ color: 'var(--color-ink-3)' }}>/5</span>
                        </p>
                        <p className="text-xs" style={{ color: 'var(--color-ink-3)' }}>
                            {stats.count} {stats.count === 1 ? 'review' : 'reviews'}
                        </p>
                    </div>
                ) : (
                    <span className="flex-shrink-0 text-xs" style={{ color: 'var(--color-ink-3)' }}>
                        No reviews
                    </span>
                )}
            </div>
        </Link>
    );
}
