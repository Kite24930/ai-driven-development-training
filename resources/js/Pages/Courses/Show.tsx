import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Course, CourseProgress, LessonProgress, PageProps } from '@/types';

const typeIcons: Record<string, string> = {
    text: '📖',
    video: '🎥',
    quiz: '❓',
    challenge: '🎯',
};

const difficultyLabel: Record<string, { text: string; color: string }> = {
    beginner: { text: '初級', color: 'bg-green-100 text-green-700' },
    intermediate: { text: '中級', color: 'bg-yellow-100 text-yellow-700' },
    advanced: { text: '上級', color: 'bg-red-100 text-red-700' },
};

export default function CourseShow({
    course,
    lessonProgress,
    courseProgress,
}: PageProps<{
    course: Course;
    lessonProgress: Record<number, LessonProgress>;
    courseProgress: CourseProgress | null;
}>) {
    const diff = difficultyLabel[course.difficulty];
    const completedCount = Object.values(lessonProgress).filter((p) => p.status === 'completed').length;
    const totalLessons = course.lessons?.length || 0;

    return (
        <AppLayout header={<h2 className="text-xl font-semibold text-gray-800">{course.title}</h2>}>
            <Head title={course.title} />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                        <Link href="/categories" className="hover:text-gray-600">カテゴリ</Link>
                        <span>/</span>
                        <Link href={`/categories/${course.category?.slug}`} className="hover:text-gray-600">
                            {course.category?.name}
                        </Link>
                        <span>/</span>
                        <span className="text-gray-600">{course.title}</span>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${diff.color}`}>
                                        {diff.text}
                                    </span>
                                    <span className="text-sm text-gray-400">{course.tech_stack?.name}</span>
                                    <span className="text-sm text-cyan-500 font-medium">{course.xp_reward} XP</span>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
                                <p className="text-gray-600 text-lg leading-relaxed">{course.description}</p>

                                {course.objectives && (
                                    <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                                        <h3 className="font-bold text-gray-700 mb-2">学習目標</h3>
                                        <p className="text-gray-600 text-sm whitespace-pre-line">{course.objectives}</p>
                                    </div>
                                )}
                            </div>

                            {/* Lesson List */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-4">レッスン一覧</h2>
                                <div className="space-y-2">
                                    {course.lessons?.map((lesson, idx) => {
                                        const progress = lessonProgress[lesson.id];
                                        const isCompleted = progress?.status === 'completed';
                                        const isInProgress = progress?.status === 'in_progress';

                                        return (
                                            <Link
                                                key={lesson.id}
                                                href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                                                className={`flex items-center gap-4 p-4 rounded-xl border transition hover:shadow-sm ${
                                                    isCompleted
                                                        ? 'border-green-200 bg-green-50'
                                                        : isInProgress
                                                        ? 'border-cyan-200 bg-cyan-50'
                                                        : 'border-gray-100 hover:border-purple-200'
                                                }`}
                                            >
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                                    isCompleted
                                                        ? 'bg-green-500 text-white'
                                                        : isInProgress
                                                        ? 'bg-cyan-500 text-white'
                                                        : 'bg-gray-100 text-gray-400'
                                                }`}>
                                                    {isCompleted ? '✓' : idx + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span>{typeIcons[lesson.type]}</span>
                                                        <span className="font-medium text-gray-900">{lesson.title}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {lesson.estimated_minutes}分 · {lesson.xp_reward} XP
                                                    </div>
                                                </div>
                                                {isCompleted && progress?.quiz_score !== null && progress?.quiz_score !== undefined && (
                                                    <span className="text-sm text-green-600 font-medium">
                                                        クイズ: {progress.quiz_score}%
                                                    </span>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h3 className="font-bold mb-4">コース情報</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">レッスン数</span>
                                        <span className="font-medium">{totalLessons}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">所要時間</span>
                                        <span className="font-medium">{course.estimated_hours}時間</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">難易度</span>
                                        <span className="font-medium">{diff.text}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">獲得XP</span>
                                        <span className="font-medium text-cyan-500">{course.xp_reward} XP</span>
                                    </div>
                                </div>
                            </div>

                            {courseProgress && (
                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <h3 className="font-bold mb-4">あなたの進捗</h3>
                                    <div className="text-center mb-4">
                                        <div className="text-4xl font-bold text-purple-500">{courseProgress.progress_percentage}%</div>
                                        <div className="text-sm text-gray-400">{completedCount}/{totalLessons} レッスン完了</div>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full h-3 transition-all"
                                            style={{ width: `${courseProgress.progress_percentage}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {course.lessons && course.lessons.length > 0 && (
                                <Link
                                    href={`/courses/${course.slug}/lessons/${course.lessons[0].slug}`}
                                    className="block w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-bold text-center hover:opacity-90 transition"
                                >
                                    {courseProgress ? '学習を続ける' : '学習を始める'}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
