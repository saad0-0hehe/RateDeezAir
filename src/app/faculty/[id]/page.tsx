import { Metadata } from 'next';
import { getProfessorById, getAverageRating } from '@/lib/data';
import ProfessorDetailClient from '@/components/ProfessorDetailClient';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://rate-deez-air.vercel.app';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const professor = await getProfessorById(id);

    if (!professor) {
        return {
            title: 'Professor Not Found - RateDeezAir',
        };
    }

    const stats = await getAverageRating(id);
    const ratingText = stats.count > 0
        ? `⭐ ${stats.rating}/5 (${stats.count} reviews)`
        : 'No reviews yet';
    const description = `${professor.name} - ${professor.designation} at ${professor.department}, Air University. ${ratingText}. Read reviews and rate on RateDeezAir.`;

    return {
        title: `${professor.name} - ${professor.department} | RateDeezAir`,
        description,
        keywords: [professor.name, professor.department, 'Air University', 'professor rating', 'RateDeezAir', 'review'],
        openGraph: {
            title: `${professor.name} | RateDeezAir`,
            description,
            url: `${BASE_URL}/faculty/${id}`,
            siteName: 'RateDeezAir',
            type: 'profile',
            images: [
                {
                    url: `${BASE_URL}/api/og?name=${encodeURIComponent(professor.name)}&dept=${encodeURIComponent(professor.department)}&rating=${stats.rating}&count=${stats.count}&designation=${encodeURIComponent(professor.designation)}`,
                    width: 1200,
                    height: 630,
                    alt: `${professor.name} - ${professor.department}`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${professor.name} | RateDeezAir`,
            description,
            images: [`${BASE_URL}/api/og?name=${encodeURIComponent(professor.name)}&dept=${encodeURIComponent(professor.department)}&rating=${stats.rating}&count=${stats.count}&designation=${encodeURIComponent(professor.designation)}`],
        },
    };
}

export default async function ProfessorDetailPage({ params }: PageProps) {
    const { id } = await params;
    return <ProfessorDetailClient professorId={id} />;
}
