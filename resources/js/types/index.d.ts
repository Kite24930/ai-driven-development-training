export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: 'admin' | 'learner';
    avatar?: string;
    xp: number;
    level: number;
    streak_days: number;
    last_activity_date?: string;
    title?: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    color: string;
    image?: string;
    sort_order: number;
    is_active: boolean;
    courses_count?: number;
}

export interface TechStack {
    id: number;
    name: string;
    slug: string;
    icon?: string;
    color: string;
    sort_order: number;
}

export interface Course {
    id: number;
    category_id: number;
    tech_stack_id: number;
    title: string;
    slug: string;
    description?: string;
    objectives?: string;
    thumbnail?: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimated_hours: number;
    xp_reward: number;
    sort_order: number;
    is_published: boolean;
    category?: Category;
    tech_stack?: TechStack;
    lessons?: Lesson[];
    lessons_count?: number;
}

export interface Lesson {
    id: number;
    course_id: number;
    title: string;
    slug: string;
    content?: string;
    type: 'text' | 'video' | 'quiz' | 'challenge';
    xp_reward: number;
    sort_order: number;
    estimated_minutes: number;
    is_published: boolean;
    quizzes?: Quiz[];
    course?: Course;
}

export interface Quiz {
    id: number;
    lesson_id: number;
    question: string;
    options: string[];
    correct_option: number;
    explanation?: string;
    xp_reward: number;
    sort_order: number;
}

export interface Badge {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    color: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    pivot?: { earned_at: string };
}

export interface LessonProgress {
    id: number;
    user_id: number;
    lesson_id: number;
    status: 'not_started' | 'in_progress' | 'completed';
    xp_earned: number;
    quiz_score?: number;
    started_at?: string;
    completed_at?: string;
}

export interface CourseProgress {
    id: number;
    user_id: number;
    course_id: number;
    progress_percentage: number;
    status: 'not_started' | 'in_progress' | 'completed';
    started_at?: string;
    completed_at?: string;
}

export type PageProps<T = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        quizResult?: {
            correct: number;
            total: number;
            score: number;
            xpEarned: number;
        };
    };
};
