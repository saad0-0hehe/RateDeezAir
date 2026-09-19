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
            <div
                className="p-5 text-center"
                style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-subtle)',
                }}
            >
                <p className="text-sm mb-4" style={{ color: 'var(--color-ink-2)' }}>
                    Please log in with your student email to submit feedback.
                </p>
                <a
                    href="/auth/login"
                    className="inline-block text-sm font-medium px-4 py-2 transition-colors"
                    style={{
                        color: '#fff',
                        backgroundColor: 'var(--color-blue)',
                        borderRadius: 'var(--radius-sm)',
                    }}
                >
                    Login
                </a>
            </div>
        );
    }

    if (submitted) {
        return (
            <div
                className="p-5 text-center"
                style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-subtle)',
                }}
            >
                <p className="text-base font-bold mb-1" style={{ color: 'var(--color-green)' }}>
                    Thank you!
                </p>
                <p className="text-sm mb-4" style={{ color: 'var(--color-ink-2)' }}>
                    Your feedback has been submitted successfully.
                </p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="text-sm font-medium px-4 py-2 transition-colors"
                    style={{
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-ink-2)',
                        backgroundColor: '#fff',
                    }}
                >
                    Submit Another
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            {/* Label */}
            <label
                htmlFor="feedback-message"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-ink)' }}
            >
                Your message
            </label>

            {/* Textarea */}
            <textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Suggestions, bugs, anything…"
                rows={5}
                className="w-full px-3 py-2.5 text-sm outline-none resize-none transition-colors"
                style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#fff',
                    color: 'var(--color-ink)',
                }}
                required
                maxLength={1000}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-blue)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
            />

            {/* Count + submit */}
            <div className="flex items-center justify-between mt-3">
                <span className="text-xs" style={{ color: 'var(--color-ink-3)' }}>
                    {message.length}/1000
                </span>
                <button
                    type="submit"
                    disabled={isSubmitting || !message.trim()}
                    className="text-sm font-medium px-5 py-2 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                        backgroundColor: 'var(--color-blue)',
                        color: '#fff',
                        borderRadius: 'var(--radius-sm)',
                    }}
                >
                    {isSubmitting ? 'Sending…' : 'Send Feedback'}
                </button>
            </div>

            {error && (
                <p className="mt-3 text-sm" style={{ color: 'var(--color-red-low)' }}>{error}</p>
            )}
        </form>
    );
}
