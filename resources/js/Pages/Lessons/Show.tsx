import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Course, Lesson, LessonProgress, PageProps } from '@/types';
import { useState, useEffect } from 'react';

const typeIcons: Record<string, string> = {
    text: '📖',
    video: '🎥',
    quiz: '❓',
    challenge: '🎯',
};

export default function LessonShow({
    course,
    lesson,
    progress,
    allProgress,
    quizAlreadySubmitted,
}: PageProps<{
    course: Course;
    lesson: Lesson;
    progress: LessonProgress | null;
    allProgress: Record<number, LessonProgress>;
    quizAlreadySubmitted: boolean;
}>) {
    const { flash } = usePage<PageProps>().props;
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [quizSubmitted, setQuizSubmitted] = useState(quizAlreadySubmitted || false);
    const [showXpAnimation, setShowXpAnimation] = useState(false);

    const isCompleted = progress?.status === 'completed';
    const quizResult = flash?.quizResult;
    // Get correct answers from flash (after submission) or from quiz data (if already submitted before)
    const correctAnswers: Record<number, { correct_option: number; explanation: string }> =
        quizResult?.correctAnswers || {};

    useEffect(() => {
        if (quizResult) {
            setQuizSubmitted(true);
            setShowXpAnimation(true);
            setTimeout(() => setShowXpAnimation(false), 3000);
        }
    }, [quizResult]);

    const handleComplete = () => {
        router.post(`/courses/${course.slug}/lessons/${lesson.slug}/complete`, {}, {
            preserveScroll: true,
        });
    };

    const handleQuizSubmit = () => {
        router.post(`/courses/${course.slug}/lessons/${lesson.slug}/quiz`, {
            answers: quizAnswers,
        }, {
            preserveScroll: true,
        });
    };

    // Find prev/next lesson
    const lessons = course.lessons || [];
    const currentIdx = lessons.findIndex((l) => l.id === lesson.id);
    const prevLesson = currentIdx > 0 ? lessons[currentIdx - 1] : null;
    const nextLesson = currentIdx < lessons.length - 1 ? lessons[currentIdx + 1] : null;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">{lesson.title}</h2>}>
            <Head title={lesson.title} />

            {/* XP Animation */}
            {showXpAnimation && quizResult && (
                <div className="fixed top-20 right-8 z-50 animate-bounce">
                    <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-xl shadow-lg">
                        <div className="text-lg font-bold">+{quizResult.xpEarned} XP</div>
                        <div className="text-sm">{quizResult.correct}/{quizResult.total} 正解!</div>
                    </div>
                </div>
            )}

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                        <Link href={`/categories/${course.category?.slug}`} className="hover:text-gray-600">
                            {course.category?.name}
                        </Link>
                        <span>/</span>
                        <Link href={`/courses/${course.slug}`} className="hover:text-gray-600">
                            {course.title}
                        </Link>
                        <span>/</span>
                        <span className="text-gray-600">{lesson.title}</span>
                    </div>

                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Sidebar: Lesson list */}
                        <div className="lg:col-span-1 order-2 lg:order-1">
                            <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-8">
                                <h3 className="font-bold text-sm text-gray-500 mb-3">レッスン一覧</h3>
                                <div className="space-y-1">
                                    {lessons.map((l, idx) => {
                                        const lProgress = allProgress[l.id];
                                        const isCurrent = l.id === lesson.id;
                                        const lCompleted = lProgress?.status === 'completed';
                                        return (
                                            <Link
                                                key={l.id}
                                                href={`/courses/${course.slug}/lessons/${l.slug}`}
                                                className={`flex items-center gap-2 p-2 rounded-lg text-sm transition ${
                                                    isCurrent
                                                        ? 'bg-purple-50 text-purple-700 font-medium'
                                                        : lCompleted
                                                        ? 'text-green-600'
                                                        : 'text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                                    lCompleted
                                                        ? 'bg-green-500 text-white'
                                                        : isCurrent
                                                        ? 'bg-purple-500 text-white'
                                                        : 'bg-gray-200 text-gray-400'
                                                }`}>
                                                    {lCompleted ? '✓' : idx + 1}
                                                </span>
                                                <span className="truncate">{l.title}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3 order-1 lg:order-2">
                            <div className="bg-white rounded-2xl shadow-sm p-8">
                                {/* Lesson Header */}
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-2xl">{typeIcons[lesson.type]}</span>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
                                        <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                                            <span>{lesson.estimated_minutes}分</span>
                                            <span>{lesson.xp_reward} XP</span>
                                            {isCompleted && (
                                                <span className="text-green-500 font-medium">完了済み ✓</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Lesson Content */}
                                <div
                                    className="prose prose-lg max-w-none mb-8"
                                    dangerouslySetInnerHTML={{ __html: lesson.content || '<p class="text-gray-400">コンテンツがまだ作成されていません</p>' }}
                                />

                                {/* Quiz Section */}
                                {lesson.quizzes && lesson.quizzes.length > 0 && (
                                    <div className="border-t border-gray-100 pt-8 mt-8">
                                        <h2 className="text-xl font-bold mb-6">理解度チェック</h2>

                                        {quizResult && (
                                            <div className={`p-4 rounded-xl mb-6 ${
                                                quizResult.score >= 80
                                                    ? 'bg-green-50 border border-green-200'
                                                    : quizResult.score >= 50
                                                    ? 'bg-yellow-50 border border-yellow-200'
                                                    : 'bg-red-50 border border-red-200'
                                            }`}>
                                                <div className="font-bold text-lg">
                                                    スコア: {quizResult.score}% ({quizResult.correct}/{quizResult.total}問正解)
                                                </div>
                                                <div className="text-sm mt-1">獲得XP: +{quizResult.xpEarned}</div>
                                            </div>
                                        )}

                                        <div className="space-y-6">
                                            {lesson.quizzes.map((quiz, qIdx) => {
                                                // Use correct answer from flash data or from quiz (when pre-loaded for already-submitted)
                                                const ca = correctAnswers[quiz.id];
                                                const correctOpt = ca?.correct_option ?? quiz.correct_option;
                                                const explanation = ca?.explanation ?? quiz.explanation;

                                                return (
                                                    <div key={quiz.id} className="p-4 border border-gray-100 rounded-xl">
                                                        <div className="font-medium mb-3">
                                                            Q{qIdx + 1}. {quiz.question}
                                                        </div>
                                                        <div className="space-y-2">
                                                            {quiz.options.map((opt, oIdx) => {
                                                                const isSelected = quizAnswers[quiz.id] === oIdx;
                                                                const isCorrect = quizSubmitted && correctOpt !== undefined && oIdx === correctOpt;
                                                                const isWrong = quizSubmitted && isSelected && correctOpt !== undefined && oIdx !== correctOpt;

                                                                return (
                                                                    <button
                                                                        key={oIdx}
                                                                        onClick={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [quiz.id]: oIdx })}
                                                                        disabled={quizSubmitted}
                                                                        className={`w-full text-left p-3 rounded-lg border transition text-sm ${
                                                                            isCorrect
                                                                                ? 'border-green-500 bg-green-50 text-green-700'
                                                                                : isWrong
                                                                                ? 'border-red-500 bg-red-50 text-red-700'
                                                                                : isSelected
                                                                                ? 'border-purple-500 bg-purple-50'
                                                                                : 'border-gray-200 hover:border-gray-300'
                                                                        }`}
                                                                    >
                                                                        {opt}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                        {quizSubmitted && explanation && (
                                                            <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                                                                {explanation}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {!quizSubmitted && (
                                            <button
                                                onClick={handleQuizSubmit}
                                                disabled={Object.keys(quizAnswers).length < (lesson.quizzes?.length || 0)}
                                                className="mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50"
                                            >
                                                回答を送信
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Complete Button */}
                                {!isCompleted && (
                                    <div className="border-t border-gray-100 pt-6 mt-8">
                                        <button
                                            onClick={handleComplete}
                                            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-lg hover:opacity-90 transition"
                                        >
                                            このレッスンを完了する (+{lesson.xp_reward} XP)
                                        </button>
                                    </div>
                                )}

                                {/* Navigation */}
                                <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                                    {prevLesson ? (
                                        <Link
                                            href={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
                                            className="text-sm text-gray-500 hover:text-purple-500 transition"
                                        >
                                            ← {prevLesson.title}
                                        </Link>
                                    ) : <div />}
                                    {nextLesson ? (
                                        <Link
                                            href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
                                            className="text-sm text-purple-500 hover:text-purple-700 transition font-medium"
                                        >
                                            {nextLesson.title} →
                                        </Link>
                                    ) : (
                                        <Link
                                            href={`/courses/${course.slug}`}
                                            className="text-sm text-purple-500 hover:text-purple-700 transition font-medium"
                                        >
                                            コース一覧に戻る →
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
