import AddFacultyForm from '@/components/AddFacultyForm';

export const metadata = {
    title: 'Add Visiting Faculty - RateDeezAir',
    description: 'Suggest a visiting faculty member to be added to RateDeezAir',
};

export default function AddFacultyPage() {
    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span className="text-purple-400 text-sm font-medium">Community Contribution</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Add Visiting Faculty</h1>
                <p className="text-slate-400">
                    Know a visiting faculty member who isn't listed? Help us grow our directory by submitting their details.
                </p>
            </div>

            <AddFacultyForm />

            <div className="mt-8 text-center">
                <a
                    href="/faculty"
                    className="text-sky-400 hover:text-sky-300 transition-colors"
                >
                    ← Back to Faculty Directory
                </a>
            </div>
        </div>
    );
}
