// Types for the application

export interface Professor {
    id: string;
    name: string;
    designation: string;
    department: string;
    imageUrl?: string;
    email?: string;
    qualifications?: string;
    detailUrl?: string;
}

export interface Review {
    id: string;
    professorId: string;
    rating: number; // 1-5
    difficulty: number; // 1-5
    wouldTakeAgain: boolean;
    comment: string;
    createdAt: string;
    userEmail?: string; // For ownership checks (edit/delete own review)
}

export interface Department {
    id: string;
    name: string;
    faculty: string;
}

// Department list for Air University
export const DEPARTMENTS: Department[] = [
    { id: 'cs', name: 'Computer Science', faculty: 'Computing & AI' },
    { id: 'se', name: 'Software Engineering', faculty: 'Computing & AI' },
    { id: 'ai', name: 'Artificial Intelligence', faculty: 'Computing & AI' },
    { id: 'ds', name: 'Data Science', faculty: 'Computing & AI' },
    { id: 'ee', name: 'Electrical Engineering', faculty: 'Engineering' },
    { id: 'me', name: 'Mechanical Engineering', faculty: 'Engineering' },
    { id: 'ae', name: 'Aerospace Engineering', faculty: 'Aerospace' },
    { id: 'avionics', name: 'Avionics', faculty: 'Aerospace' },
    { id: 'mba', name: 'Business Administration', faculty: 'Management' },
    { id: 'psychology', name: 'Psychology', faculty: 'Social Sciences' },
    { id: 'math', name: 'Mathematics', faculty: 'Basic Sciences' },
    { id: 'physics', name: 'Physics', faculty: 'Basic Sciences' },
];
