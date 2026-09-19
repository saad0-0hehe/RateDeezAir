import Link from 'next/link';
import { getTopProfessors, getTotalReviewCount, getAllProfessors } from '@/lib/data';

// Force dynamic rendering to always show fresh top professors
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Optimized: fetch only top 3 professors and counts
  const [topProfessors, reviewCount, professors] = await Promise.all([
    getTopProfessors(3),
    getTotalReviewCount(),
    getAllProfessors(),
  ]);

  return (
    <div className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        style={{ borderBottom: '1px solid var(--color-border)' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28"
      >
        {/* Left-aligned layout */}
        <div className="max-w-2xl">
          <p className="text-sm font-medium mb-3" style={{ color: 'var(--color-blue)' }}>
            Air University Islamabad
          </p>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--color-ink)' }}>
            Rate your professors.<br />Help your batchmates.
          </h1>

          <p className="text-base mb-8" style={{ color: 'var(--color-ink-2)', lineHeight: '1.6' }}>
            Anonymous reviews by students, for students. Make informed decisions about your courses at Air University.
          </p>

          {/* Search bar — links to /faculty */}
          <Link href="/faculty" className="block max-w-lg">
            <div className="rda-search-bar flex items-center gap-3 px-4 py-3" style={{ cursor: 'pointer' }}>
              <svg
                style={{ color: 'var(--color-ink-3)', flexShrink: 0 }}
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm" style={{ color: 'var(--color-ink-3)' }}>
                Search for a professor or department…
              </span>
            </div>
          </Link>

          {/* Stats row — inline text, separated by rules */}
          <div className="flex items-center gap-0 mt-10">
            <div className="pr-6">
              <span className="text-2xl font-bold" style={{ color: 'var(--color-ink)' }}>{professors.length}+</span>
              <span className="text-sm ml-1.5" style={{ color: 'var(--color-ink-3)' }}>Professors</span>
            </div>
            <div
              className="self-stretch"
              style={{ width: '1px', backgroundColor: 'var(--color-border)' }}
            />
            <div className="px-6">
              <span className="text-2xl font-bold" style={{ color: 'var(--color-ink)' }}>{reviewCount}+</span>
              <span className="text-sm ml-1.5" style={{ color: 'var(--color-ink-3)' }}>Reviews</span>
            </div>
            <div
              className="self-stretch"
              style={{ width: '1px', backgroundColor: 'var(--color-border)' }}
            />
            <div className="pl-6">
              <span className="text-2xl font-bold" style={{ color: 'var(--color-ink)' }}>1,000+</span>
              <span className="text-sm ml-1.5" style={{ color: 'var(--color-ink-3)' }}>Students</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Top Rated Professors ─────────────────────────────────── */}
      {topProfessors.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-ink)' }}>
              Top Rated Professors
            </h2>
            <Link
              href="/faculty"
              className="text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: 'var(--color-blue)' }}
            >
              View all →
            </Link>
          </div>

          {/* Ranked list — not a card grid */}
          <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
            {topProfessors.map((professor, index) => (
              <Link key={professor.id} href={`/faculty/${professor.id}`} className="block">
                <div
                  className="rda-list-row flex items-center gap-4 px-5 py-4"
                  style={{
                    borderBottom: index < topProfessors.length - 1 ? '1px solid var(--color-border)' : 'none',
                  }}
                >
                  {/* Ordinal rank */}
                  <span
                    className="text-base font-bold w-6 flex-shrink-0 text-right"
                    style={{ color: index === 0 ? 'var(--color-blue)' : 'var(--color-ink-3)', fontVariantNumeric: 'tabular-nums' }}
                  >
                    {index + 1}
                  </span>

                  {/* Initials avatar */}
                  <div
                    className="w-9 h-9 flex-shrink-0 flex items-center justify-center text-xs font-bold"
                    style={{
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: index === 0 ? 'var(--color-blue-light)' : 'var(--color-bg-subtle)',
                      color: index === 0 ? 'var(--color-blue)' : 'var(--color-ink-2)',
                    }}
                  >
                    {professor.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>

                  {/* Name + dept */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--color-ink)' }}>
                      {professor.name}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--color-ink-3)' }}>
                      {professor.department}
                    </p>
                  </div>

                  {/* Rating + count — right-aligned metadata */}
                  <div className="flex items-center gap-3 flex-shrink-0 text-right">
                    <span className="text-base font-bold" style={{ color: 'var(--color-ink)' }}>
                      {professor.stats.rating}
                      <span className="text-xs font-normal ml-0.5" style={{ color: 'var(--color-ink-3)' }}>/5</span>
                    </span>
                    <span className="text-xs" style={{ color: 'var(--color-ink-3)' }}>
                      {professor.stats.count} {professor.stats.count === 1 ? 'review' : 'reviews'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section
        style={{ backgroundColor: 'var(--color-bg-subtle)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}
        className="py-14"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-ink)' }}>
            Help your fellow students
          </h2>
          <p className="text-sm mb-5 max-w-lg" style={{ color: 'var(--color-ink-2)', lineHeight: '1.6' }}>
            Share your experience with professors. Your anonymous review could help someone make a better decision about their courses.
          </p>
          <Link
            href="/faculty"
            className="inline-block text-sm font-medium px-5 py-2.5 transition-colors"
            style={{
              backgroundColor: 'var(--color-blue)',
              color: '#fff',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            Browse Faculty
          </Link>
        </div>
      </section>

    </div>
  );
}
