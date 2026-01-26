import Link from 'next/link';
import { getAllProfessorsWithStats } from '@/lib/data';

export default async function Home() {
  const professors = await getAllProfessorsWithStats();
  const topProfessors = professors
    .filter((p) => p.stats.count > 0)
    .sort((a, b) => b.stats.rating - a.stats.rating)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-purple-500/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span className="text-sky-400 text-sm font-medium">RateDeezAir</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Rate Your <span className="gradient-text">Professors</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              Anonymous reviews by students, for students. Make informed decisions about your courses at Air University Islamabad.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <Link href="/faculty" className="block">
                <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-800/80 border border-slate-700/50 hover:border-sky-500/50 transition-colors cursor-pointer group">
                  <svg className="w-6 h-6 text-slate-400 group-hover:text-sky-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Search for a professor...</span>
                </div>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 md:gap-16 mt-16">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">{professors.length}+</p>
                <p className="text-slate-500 text-sm mt-1">Professors</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">500+</p>
                <p className="text-slate-500 text-sm mt-1">Reviews</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">1000+</p>
                <p className="text-slate-500 text-sm mt-1">Students</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Section */}
      {topProfessors.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-white mb-8">Top Rated Professors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topProfessors.map((professor, index) => (
              <Link key={professor.id} href={`/faculty/${professor.id}`}>
                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 p-6 hover:border-sky-500/50 transition-all hover:shadow-xl hover:shadow-sky-500/10">
                  {/* Rank Badge */}
                  <div className={`absolute -top-3 -left-3 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-600' :
                    index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500' :
                      'bg-gradient-to-br from-amber-600 to-amber-800'
                    }`}>
                    #{index + 1}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {professor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{professor.name}</h3>
                      <p className="text-sky-400 text-sm">{professor.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-white">{professor.stats.rating}</span>
                      <span className="text-slate-500 text-sm">/ 5</span>
                    </div>
                    <span className="text-slate-500 text-sm">({professor.stats.count} reviews)</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative bg-gradient-to-r from-sky-500/10 to-purple-500/10 rounded-3xl border border-slate-700/50 p-8 md:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Help Your Fellow Students
            </h2>
            <p className="text-slate-400 max-w-xl mb-6">
              Share your experience with professors. Your anonymous review could help someone make a better decision.
            </p>
            <Link
              href="/faculty"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-medium shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all"
            >
              Browse Faculty
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
