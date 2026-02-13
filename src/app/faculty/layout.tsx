import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Faculty Directory - RateDeezAir',
    description: 'Browse and rate professors at Air University Islamabad. Search by name or department, and read student reviews.',
    keywords: ['Air University faculty', 'professor directory', 'Air University professors', 'faculty ratings'],
};

export default function FacultyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            {children}
        </Suspense>
    );
}
