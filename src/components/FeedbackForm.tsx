'use client';

import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { addFeedback } from '@/lib/data';

export default function FeedbackForm() {
    const { user } = useUser();
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.email || !message.trim()) return;

        setIsSubmitting(true);
        setError('');

        try {
            const result = await addFeedback(user.email, message.trim());
            if (result) {
                setSubmitted(true);
                setMessage('');
            } else {
                setError('Failed to submit feedback. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 text-center">
                <p className="text-slate-400">Please login to submit feedback.</p>
                <a
                    href="/auth/login"
                    className="inline-block mt-4 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-medium transition-colors"
                >
                    Login
                </a>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="bg-green-900/30 rounded-xl border border-green-700/50 p-6 text-center">
                <svg className="w-12 h-12 text-green-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-lg font-semibold text-white mb-2">Thank You!</h3>
                <p className="text-slate-400">Your feedback has been submitted successfully.</p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
                >
                    Submit Another
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Send Feedback</h3>
            <p className="text-slate-400 text-sm mb-4">
                Have suggestions or found a bug? Let us know!
            </p>

            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your feedback..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 resize-none"
                required
                maxLength={1000}
            />

            <div className="flex items-center justify-between mt-4">
                <span className="text-slate-500 text-sm">{message.length}/1000</span>
                <button
                    type="submit"
                    disabled={isSubmitting || !message.trim()}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-medium shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isSubmitting ? 'Sending...' : 'Send Feedback'}
                </button>
            </div>

            {error && (
                <p className="mt-3 text-red-400 text-sm">{error}</p>
            )}
        </form>
    );
}
