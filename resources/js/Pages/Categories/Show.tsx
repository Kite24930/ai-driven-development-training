import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Category, Course, CourseProgress, PageProps, TechStack } from '@/types';
import { useState } from 'react';

const difficultyLabel: Record<string, { text: string; color: string }> = {
    beginner: { text: '初級', color: 'bg-green-100 text-green-700' },
    intermediate: { text: '中級', color: 'bg-yellow-100 text-yellow-700' },
    advanced: { text: '上級', color: 'bg-red-100 text-red-700' },
};

export default function CategoryShow({
    category,
    courses,
    techStacks,
    courseProgress,
}: PageProps<{
    category: Category;
    courses: Course[];
    techStacks: TechStack[];
    courseProgress: Record<number, CourseProgress>;
}>) {
    const [selectedStack, setSelectedStack] = useState<number | null>(null);

    const filteredCourses = selectedStack
        ? courses.filter((c) => c.tech_stack_id === selectedStack)
        : courses;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">{category.name}</h2>}>
            <Head title={category.name} />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Category Header */}
                    <div className="bg-white rounded-2xl shadow-sm p-8 mb-8" style={{ borderTop: `4px solid ${category.color}` }}>
                        <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
                        <p className="text-gray-500 mt-2 text-lg">{category.description}</p>
                    </div>

                    {/* Tech Stack Filter */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => setSelectedStack(null)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                !selectedStack
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            すべて
                        </button>
                        {techStacks.map((stack) => (
                            <button
                                key={stack.id}
                                onClick={() => setSelectedStack(stack.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                    selectedStack === stack.id
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {stack.name}
                            </button>
                        ))}
                    </div>

                    {/* Course Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => {
                            const progress = courseProgress[course.id];
                            const diff = difficultyLabel[course.difficulty];
                            return (
                                <Link
                                    key={course.id}
                                    href={`/courses/${course.slug}`}
                                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-purple-200 transition-all"
                                >
                                    <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                        {course.thumbnail ? (
                                            <img src={`/storage/${course.thumbnail}`} alt={course.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-5xl opacity-30">🎮</span>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${diff.color}`}>
                                                {diff.text}
                                            </span>
                                            <span className="text-xs text-gray-400">{course.tech_stack?.name}</span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition mb-2">
                                            {course.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{course.description}</p>
                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                            <span>{course.lessons_count || 0} レッスン</span>
                                            <span>{course.estimated_hours}時間</span>
                                            <span className="text-cyan-500">{course.xp_reward} XP</span>
                                        </div>
                                        {progress && (
                                            <div className="mt-3">
                                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                    <div
                                                        className="bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full h-1.5"
                                                        style={{ width: `${progress.progress_percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-400 mt-1">{progress.progress_percentage}% 完了</span>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {filteredCourses.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            このフィルタに該当するコースはありません
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
