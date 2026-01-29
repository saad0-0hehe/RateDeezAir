import FeedbackForm from '@/components/FeedbackForm';

export const metadata = {
    title: 'Feedback - RateDeezAir',
    description: 'Send us your feedback about RateDeezAir',
};

export default function FeedbackPage() {
    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Send Feedback</h1>
                <p className="text-slate-400">
                    Have suggestions, found a bug, or want to share your thoughts? We'd love to hear from you!
                </p>
            </div>

            <FeedbackForm />

            <div className="mt-8 text-center">
                <a
                    href="/"
                    className="text-sky-400 hover:text-sky-300 transition-colors"
                >
                    ← Back to Home
                </a>
            </div>
        </div>
    );
}
