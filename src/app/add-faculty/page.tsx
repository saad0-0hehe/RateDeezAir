import AddFacultyForm from '@/components/AddFacultyForm';

export const metadata = {
    title: 'Add Visiting Faculty - RateDeezAir',
    description: 'Suggest a visiting faculty member to be added to RateDeezAir',
};

export default function AddFacultyPage() {
    return (
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-ink)' }}>
                Add Visiting Faculty
            </h1>
            {/* Blue accent rule under heading */}
            <div
                style={{
                    width: '2.5rem',
                    height: '3px',
                    backgroundColor: 'var(--color-blue)',
                    marginTop: '0.5rem',
                    marginBottom: '1.25rem',
                    borderRadius: '1px',
                }}
            />

            <p className="text-sm mb-8" style={{ color: 'var(--color-ink-2)', lineHeight: '1.65' }}>
                Know a visiting faculty member who isn't listed? Help us grow our directory by submitting their details.
            </p>

            <AddFacultyForm />

            <div className="mt-8">
                <a
                    href="/faculty"
                    className="text-sm font-medium transition-opacity hover:opacity-70"
                    style={{ color: 'var(--color-blue)' }}
                >
                    ← Back to Faculty Directory
                </a>
            </div>
        </div>
    );
}
