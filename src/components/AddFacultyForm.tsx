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
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 text-center">
                <svg className="w-12 h-12 text-slate-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <p className="text-slate-400 mb-4">Please login to suggest a visiting faculty member.</p>
                <a
                    href="/auth/login"
                    className="inline-block px-6 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-medium shadow-lg shadow-sky-500/25 transition-all"
                >
                    Login with Student Email
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
                <h3 className="text-lg font-semibold text-white mb-2">Request Submitted!</h3>
                <p className="text-slate-400 mb-1">Your visiting faculty suggestion has been submitted for review.</p>
                <p className="text-slate-500 text-sm mb-4">An admin will review and approve it shortly.</p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
                >
                    Submit Another
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 space-y-5">
            <div>
                <h3 className="text-lg font-semibold text-white mb-1">Faculty Details</h3>
                <p className="text-slate-400 text-sm">
                    Provide the details of the visiting faculty member you'd like to add.
                </p>
            </div>

            {/* Name */}
            <div>
                <label htmlFor="faculty-name" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                </label>
                <input
                    id="faculty-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Ahmed Khan"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50"
                    required
                    maxLength={100}
                />
            </div>

            {/* Department */}
            <div>
                <label htmlFor="faculty-department" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Department <span className="text-red-400">*</span>
                </label>
                <select
                    id="faculty-department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 appearance-none cursor-pointer"
                    required
                >
                    <option value="" disabled>Select department...</option>
                    {DEPARTMENTS.map((dept) => (
                        <option key={dept.id} value={dept.name}>
                            {dept.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Designation */}
            <div>
                <label htmlFor="faculty-designation" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Designation
                </label>
                <input
                    id="faculty-designation"
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Visiting Faculty, Adjunct Lecturer"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50"
                    maxLength={100}
                />
            </div>

            {/* Email */}
            <div>
                <label htmlFor="faculty-email" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Email <span className="text-slate-500">(optional)</span>
                </label>
                <input
                    id="faculty-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ahmed.khan@au.edu.pk"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50"
                />
            </div>

            {/* Qualifications */}
            <div>
                <label htmlFor="faculty-qualifications" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Qualifications <span className="text-slate-500">(optional)</span>
                </label>
                <input
                    id="faculty-qualifications"
                    type="text"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    placeholder="e.g. PhD Computer Science, MS Software Engineering"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50"
                    maxLength={200}
                />
            </div>

            {/* Info Note */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-sky-500/10 border border-sky-500/20">
                <svg className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sky-300 text-sm">
                    Your request will be reviewed by an admin before the faculty member is added to the directory.
                </p>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting || !name.trim() || !department}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-medium shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Submitting...
                        </span>
                    ) : (
                        'Submit Request'
                    )}
                </button>
            </div>

            {error && (
                <p className="text-red-400 text-sm">{error}</p>
            )}
        </form>
    );
}
