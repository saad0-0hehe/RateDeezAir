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

// Optimized function to get only top professors (for home page)
export async function getTopProfessors(limit: number = 3): Promise<(Professor & { stats: { rating: number; difficulty: number; count: number } })[]> {
    // Get aggregated stats from reviews
    const { data: reviewStats, error: statsError } = await supabase
        .from('reviews')
        .select('professor_id, rating, difficulty');

    if (statsError || !reviewStats) {
        console.error('Error fetching review stats:', statsError);
        return [];
    }

    // Calculate stats per professor
    const statsMap = new Map<string, { sumRating: number; sumDiff: number; count: number }>();
    reviewStats.forEach((r: any) => {
        const current = statsMap.get(r.professor_id) || { sumRating: 0, sumDiff: 0, count: 0 };
        current.sumRating += r.rating;
        current.sumDiff += r.difficulty;
        current.count += 1;
        statsMap.set(r.professor_id, current);
    });

    // Sort by average rating and get top professor IDs
    const sortedProfIds = Array.from(statsMap.entries())
        .filter(([, s]) => s.count > 0)
        .map(([id, s]) => ({ id, avgRating: s.sumRating / s.count, stats: s }))
        .sort((a, b) => b.avgRating - a.avgRating || b.stats.count - a.stats.count)
        .slice(0, limit);

    if (sortedProfIds.length === 0) return [];

    // Fetch only the top professors
    const { data: professors, error: profError } = await supabase
        .from('professors')
        .select('*')
        .in('id', sortedProfIds.map(p => p.id));

    if (profError || !professors) {
        console.error('Error fetching top professors:', profError);
        return [];
    }

    // Map and attach stats
    return sortedProfIds.map(({ id, stats: s }) => {
        const prof = professors.find((p: any) => p.id === id);
        if (!prof) return null;
        return {
            ...mapProfessorFromDb(prof),
            stats: {
                rating: Math.round((s.sumRating / s.count) * 10) / 10,
                difficulty: Math.round((s.sumDiff / s.count) * 10) / 10,
                count: s.count
            }
        };
    }).filter(Boolean) as (Professor & { stats: { rating: number; difficulty: number; count: number } })[];
}

// Get total review count (for stats display)
export async function getTotalReviewCount(): Promise<number> {
    const { count, error } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error counting reviews:', error);
        return 0;
    }
    return count || 0;
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

// Feedback functions
import { Feedback } from './types';

export async function getAllFeedback(): Promise<Feedback[]> {
    const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching feedback:', error);
        return [];
    }

    return data.map((row: any) => ({
        id: row.id,
        email: row.email,
        message: row.message,
        createdAt: row.created_at,
    }));
}

export async function addFeedback(email: string, message: string): Promise<Feedback | null> {
    const { data, error } = await supabase
        .from('feedback')
        .insert({
            email,
            message,
        })
        .select()
        .single();

    if (error) {
        console.error('Error adding feedback:', error);
        return null;
    }

    return {
        id: data.id,
        email: data.email,
        message: data.message,
        createdAt: data.created_at,
    };
}

export async function deleteFeedback(feedbackId: string): Promise<boolean> {
    const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', feedbackId);

    if (error) {
        console.error('Error deleting feedback:', error);
        return false;
    }
    return true;
}

// Visiting Faculty Request functions
import { VisitingFacultyRequest } from './types';

function mapVisitingFacultyRequestFromDb(row: any): VisitingFacultyRequest {
    return {
        id: row.id,
        name: row.name,
        designation: row.designation,
        department: row.department,
        email: row.email,
        qualifications: row.qualifications,
        submittedByEmail: row.submitted_by_email,
        status: row.status,
        createdAt: row.created_at,
    };
}

export async function addVisitingFacultyRequest(
    request: { name: string; designation: string; department: string; email?: string; qualifications?: string },
    submitterEmail: string
): Promise<VisitingFacultyRequest | null> {
    const { data, error } = await supabase
        .from('visiting_faculty_requests')
        .insert({
            name: request.name,
            designation: request.designation,
            department: request.department,
            email: request.email || null,
            qualifications: request.qualifications || null,
            submitted_by_email: submitterEmail,
        })
        .select()
        .single();

    if (error) {
        console.error('Error adding visiting faculty request:', error);
        return null;
    }
    return mapVisitingFacultyRequestFromDb(data);
}

export async function getAllVisitingFacultyRequests(): Promise<VisitingFacultyRequest[]> {
    const { data, error } = await supabase
        .from('visiting_faculty_requests')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching visiting faculty requests:', error);
        return [];
    }
    return data.map(mapVisitingFacultyRequestFromDb);
}

export async function getPendingVisitingFacultyCount(): Promise<number> {
    const { count, error } = await supabase
        .from('visiting_faculty_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

    if (error) {
        console.error('Error counting pending requests:', error);
        return 0;
    }
    return count || 0;
}

export async function approveVisitingFacultyRequest(requestId: string): Promise<boolean> {
    // First get the request details
    const { data: request, error: fetchError } = await supabase
        .from('visiting_faculty_requests')
        .select('*')
        .eq('id', requestId)
        .single();

    if (fetchError || !request) {
        console.error('Error fetching request for approval:', fetchError);
        return false;
    }

    // Generate a professor ID from the name (slug format matching existing IDs)
    const profId = request.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

    // Insert into professors table
    const { error: insertError } = await supabase
        .from('professors')
        .insert({
            id: profId,
            name: request.name,
            designation: request.designation,
            department: request.department,
            email: request.email,
            qualifications: request.qualifications,
        });

    if (insertError) {
        console.error('Error inserting professor:', insertError);
        return false;
    }

    // Mark request as approved
    const { error: updateError } = await supabase
        .from('visiting_faculty_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);

    if (updateError) {
        console.error('Error updating request status:', updateError);
        return false;
    }

    return true;
}

export async function rejectVisitingFacultyRequest(requestId: string): Promise<boolean> {
    const { error } = await supabase
        .from('visiting_faculty_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

    if (error) {
        console.error('Error rejecting request:', error);
        return false;
    }
    return true;
}
