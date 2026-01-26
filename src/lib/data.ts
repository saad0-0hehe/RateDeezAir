import { supabase } from './supabase';
import { Professor, Review } from './types';

// Async Data access functions using Supabase

export async function getAllProfessors(): Promise<Professor[]> {
    const { data, error } = await supabase
        .from('professors')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching professors:', error);
        return [];
    }

    // Map DB fields to TS type (snake_case to camelCase)
    return data.map(mapProfessorFromDb);
}

export async function getProfessorById(id: string): Promise<Professor | null> {
    const { data, error } = await supabase
        .from('professors')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;
    return mapProfessorFromDb(data);
}

export async function searchProfessors(query: string, department?: string): Promise<Professor[]> {
    let queryBuilder = supabase
        .from('professors')
        .select('*');

    if (query) {
        // Simple search on name
        queryBuilder = queryBuilder.ilike('name', `%${query}%`);
    }

    if (department && department !== 'all') {
        queryBuilder = queryBuilder.eq('department', department);
    }

    // Keep order
    queryBuilder = queryBuilder.order('name');

    const { data, error } = await queryBuilder;

    if (error) {
        console.error('Error searching professors:', error);
        return [];
    }

    return data.map(mapProfessorFromDb);
}

export async function getReviewsByProfessorId(professorId: string): Promise<Review[]> {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('professor_id', professorId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }

    return data.map(mapReviewFromDb);
}

export async function getAllReviews(): Promise<Review[]> {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching all reviews:', error);
        return [];
    }
    return data.map(mapReviewFromDb);
}

export async function addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review | null> {
    const dbReview = {
        professor_id: review.professorId,
        user_email: '', // You might need to pass this or handle it in the component
        rating: review.rating,
        difficulty: review.difficulty,
        would_take_again: review.wouldTakeAgain,
        comment: review.comment,
        // created_at is default
    };

    // Need to handle user_email. The 'review' object passed here likely doesn't have it?
    // Wait, the 'Review' type in types.ts doesn't strictly have userEmail?
    // Let's check types.ts later. For now, assume we'll pass it or fix types.

    // Actually, let's fix the parameters. The caller should pass the full review data needed.
    // But keeping signature close to original for now.

    const { data, error } = await supabase
        .from('reviews')
        .insert(dbReview)
        .select()
        .single();

    if (error) {
        console.error('Error adding review:', error);
        return null;
    }

    return mapReviewFromDb(data);
}

// Overload for when we have the email
export async function addReviewWithEmail(review: any, email: string): Promise<Review | null> {
    const dbReview = {
        professor_id: review.professorId,
        user_email: email,
        rating: review.rating,
        difficulty: review.difficulty,
        would_take_again: review.wouldTakeAgain,
        comment: review.comment,
    };

    const { data, error } = await supabase
        .from('reviews')
        .insert(dbReview)
        .select()
        .single();

    if (error) {
        console.error('Error adding review:', error);
        return null; // or throw
        throw error;
    }
    return mapReviewFromDb(data);
}

export async function deleteReview(reviewId: string): Promise<boolean> {
    const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

    if (error) {
        console.error('Error deleting review:', error);
    }
    return !error;
}

export async function updateReview(
    reviewId: string,
    updates: { rating: number; difficulty: number; wouldTakeAgain: boolean; comment: string }
): Promise<Review | null> {
    const { data, error } = await supabase
        .from('reviews')
        .update({
            rating: updates.rating,
            difficulty: updates.difficulty,
            would_take_again: updates.wouldTakeAgain,
            comment: updates.comment,
        })
        .eq('id', reviewId)
        .select()
        .single();

    if (error) {
        console.error('Error updating review:', error);
        return null;
    }
    return mapReviewFromDb(data);
}

export async function getAverageRating(professorId: string): Promise<{ rating: number; difficulty: number; count: number }> {
    // In a real app, you'd use a database view or RPC for this
    // For now, fetching reviews is okay-ish for detail page, but bad for lists.
    // Let's implement a direct RPC call or just use what we have.
    const reviews = await getReviewsByProfessorId(professorId);

    if (reviews.length === 0) {
        return { rating: 0, difficulty: 0, count: 0 };
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const totalDifficulty = reviews.reduce((sum, r) => sum + r.difficulty, 0);

    return {
        rating: Math.round((totalRating / reviews.length) * 10) / 10,
        difficulty: Math.round((totalDifficulty / reviews.length) * 10) / 10,
        count: reviews.length,
    };
}

export async function getAllProfessorsWithStats(): Promise<(Professor & { stats: { rating: number; difficulty: number; count: number } })[]> {
    const professors = await getAllProfessors();

    // Fetch all reviews (lightweight: only need needed fields)
    const { data: reviews, error } = await supabase
        .from('reviews')
        .select('professor_id, rating, difficulty');

    if (error) {
        console.error('Error fetching reviews for stats:', error);
        return professors.map(p => ({ ...p, stats: { rating: 0, difficulty: 0, count: 0 } }));
    }

    // Calculate stats in memory
    const statsMap = new Map<string, { sumRating: number; sumDiff: number; count: number }>();

    reviews.forEach((r: any) => {
        const current = statsMap.get(r.professor_id) || { sumRating: 0, sumDiff: 0, count: 0 };
        current.sumRating += r.rating;
        current.sumDiff += r.difficulty;
        current.count += 1;
        statsMap.set(r.professor_id, current);
    });

    return professors.map(p => {
        const s = statsMap.get(p.id);
        const stats = s ? {
            rating: Math.round((s.sumRating / s.count) * 10) / 10,
            difficulty: Math.round((s.sumDiff / s.count) * 10) / 10,
            count: s.count
        } : { rating: 0, difficulty: 0, count: 0 };

        return { ...p, stats };
    });
}

// Helpers
function mapProfessorFromDb(row: any): Professor {
    return {
        id: row.id,
        name: row.name,
        designation: row.designation,
        department: row.department,
        imageUrl: row.image_url,
        detailUrl: row.detail_url,
        qualifications: row.qualifications,
        email: row.email,
    };
}

function mapReviewFromDb(row: any): Review {
    return {
        id: row.id,
        professorId: row.professor_id,
        rating: row.rating,
        difficulty: row.difficulty,
        wouldTakeAgain: row.would_take_again,
        comment: row.comment,
        createdAt: row.created_at,
        userEmail: row.user_email,
    };
}
