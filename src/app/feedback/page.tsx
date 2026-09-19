import FeedbackForm from '@/components/FeedbackForm';

export const metadata = {
    title: 'Feedback - RateDeezAir',
    description: 'Send us your feedback about RateDeezAir',
};

export default function FeedbackPage() {
    return (
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-ink)' }}>
                Send Feedback
            </h1>
            {/* Blue accent rule under heading */}
            <div className="rda-section-rule" />

            <p className="text-sm mb-8" style={{ color: 'var(--color-ink-2)', lineHeight: '1.65' }}>
                Have suggestions, found a bug, or want to share your thoughts? We'd love to hear from you.
            </p>

            <FeedbackForm />

            <div className="mt-8">
                <a
                    href="/"
                    className="text-sm font-medium transition-opacity hover:opacity-70"
                    style={{ color: 'var(--color-blue)' }}
                >
                    ← Back to Home
                </a>
            </div>
        </div>
    );
}
