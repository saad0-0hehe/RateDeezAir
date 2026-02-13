import { Metadata } from 'next';

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
    return <>{children}</>;
}
