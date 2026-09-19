'use client';

import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { addVisitingFacultyRequest } from '@/lib/data';
import { DEPARTMENTS } from '@/lib/types';

export default function AddFacultyForm() {
    const { user } = useUser();
    const [name, setName] = useState('');
    const [department, setDepartment] = useState('');
    const [designation, setDesignation] = useState('Visiting Faculty');
    const [email, setEmail] = useState('');
    const [qualifications, setQualifications] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.email || !name.trim() || !department) return;

        setIsSubmitting(true);
        setError('');

        try {
            const result = await addVisitingFacultyRequest(
                {
                    name: name.trim(),
                    designation: designation.trim() || 'Visiting Faculty',
                    department,
                    email: email.trim() || undefined,
                    qualifications: qualifications.trim() || undefined,
                },
                user.email
            );
            if (result) {
                setSubmitted(true);
                setName('');
                setDepartment('');
                setDesignation('Visiting Faculty');
                setEmail('');
                setQualifications('');
            } else {
                setError('Failed to submit request. Please try again.');
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
                className="p-6 text-center"
                style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-subtle)',
                }}
            >
                <svg
                    className="w-10 h-10 mx-auto mb-3"
                    style={{ color: 'var(--color-ink-3)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                </svg>
                <p className="text-sm mb-4" style={{ color: 'var(--color-ink-2)' }}>
                    Please log in with your student email to suggest a visiting faculty member.
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
                    Login with Student Email
                </a>
            </div>
        );
    }

    if (submitted) {
        return (
            <div
                className="p-6 text-center"
                style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-subtle)',
                }}
            >
                <p className="text-base font-bold mb-1" style={{ color: 'var(--color-green)' }}>
                    Request Submitted!
                </p>
                <p className="text-sm mb-1" style={{ color: 'var(--color-ink-2)' }}>
                    Your visiting faculty suggestion has been submitted for review.
                </p>
                <p className="text-xs mb-4" style={{ color: 'var(--color-ink-3)' }}>
                    An admin will review and approve it shortly.
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
        <form
            onSubmit={handleSubmit}
            className="p-6 space-y-4"
            style={{
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#fff',
            }}
        >
            <div className="pb-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <h2 className="text-base font-bold" style={{ color: 'var(--color-ink)' }}>
                    Faculty Details
                </h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-3)' }}>
                    Provide the details of the visiting faculty member you'd like to add.
                </p>
            </div>

            {/* Name */}
            <div>
                <label htmlFor="faculty-name" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-ink)' }}>
                    Full Name <span style={{ color: 'var(--color-red-low)' }}>*</span>
                </label>
                <input
                    id="faculty-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Ahmed Khan"
                    className="w-full px-3 py-2 text-sm outline-none transition-colors"
                    style={{
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#fff',
                        color: 'var(--color-ink)',
                    }}
                    required
                    maxLength={100}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-blue)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                />
            </div>

            {/* Department */}
            <div>
                <label htmlFor="faculty-department" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-ink)' }}>
                    Department <span style={{ color: 'var(--color-red-low)' }}>*</span>
                </label>
                <select
                    id="faculty-department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-sm outline-none transition-colors cursor-pointer"
                    style={{
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#fff',
                        color: department ? 'var(--color-ink)' : 'var(--color-ink-3)',
                    }}
                    required
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-blue)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                >
                    <option value="" disabled>Select department...</option>
                    {DEPARTMENTS.map((dept) => (
                        <option key={dept.id} value={dept.name} style={{ color: 'var(--color-ink)' }}>
                            {dept.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Designation */}
            <div>
                <label htmlFor="faculty-designation" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-ink)' }}>
                    Designation
                </label>
                <input
                    id="faculty-designation"
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Visiting Faculty, Adjunct Lecturer"
                    className="w-full px-3 py-2 text-sm outline-none transition-colors"
                    style={{
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#fff',
                        color: 'var(--color-ink)',
                    }}
                    maxLength={100}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-blue)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                />
            </div>

            {/* Email */}
            <div>
                <label htmlFor="faculty-email" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-ink)' }}>
                    Email <span className="font-normal" style={{ color: 'var(--color-ink-3)' }}>(optional)</span>
                </label>
                <input
                    id="faculty-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ahmed.khan@au.edu.pk"
                    className="w-full px-3 py-2 text-sm outline-none transition-colors"
                    style={{
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#fff',
                        color: 'var(--color-ink)',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-blue)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                />
            </div>

            {/* Qualifications */}
            <div>
                <label htmlFor="faculty-qualifications" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-ink)' }}>
                    Qualifications <span className="font-normal" style={{ color: 'var(--color-ink-3)' }}>(optional)</span>
                </label>
                <input
                    id="faculty-qualifications"
                    type="text"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    placeholder="e.g. PhD Computer Science, MS Software Engineering"
                    className="w-full px-3 py-2 text-sm outline-none transition-colors"
                    style={{
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#fff',
                        color: 'var(--color-ink)',
                    }}
                    maxLength={200}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-blue)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                />
            </div>

            {/* Info Note */}
            <div
                className="flex items-start gap-2.5 p-3"
                style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-bg-subtle)',
                }}
            >
                <svg
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    style={{ color: 'var(--color-blue)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <p className="text-xs" style={{ color: 'var(--color-ink-2)' }}>
                    Your request will be reviewed by an admin before the faculty member is added to the directory.
                </p>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    disabled={isSubmitting || !name.trim() || !department}
                    className="text-sm font-medium px-5 py-2.5 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                    style={{
                        backgroundColor: 'var(--color-blue)',
                        color: '#fff',
                        borderRadius: 'var(--radius-sm)',
                    }}
                >
                    {isSubmitting ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Submitting…
                        </>
                    ) : (
                        'Submit Request'
                    )}
                </button>
            </div>

            {error && (
                <p className="text-sm" style={{ color: 'var(--color-red-low)' }}>{error}</p>
            )}
        </form>
    );
}
