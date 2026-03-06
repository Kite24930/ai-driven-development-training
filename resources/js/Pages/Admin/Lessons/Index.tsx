import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Course, Lesson, PageProps } from '@/types';

export default function AdminLessonsIndex({
    course,
    lessons,
}: PageProps<{ course: Course; lessons: Lesson[] }>) {
    const handleDelete = (lesson: Lesson) => {
        if (confirm(`「${lesson.title}」を削除しますか？`)) {
            router.delete(`/admin/courses/${course.id}/lessons/${lesson.id}`);
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">レッスン管理</h2>}>
            <Head title={`${course.title} - レッスン管理`} />
            <div className="py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <Link href="/admin/courses" className="text-sm text-gray-400 hover:text-gray-600">
                                ← コース一覧
                            </Link>
                            <h1 className="text-2xl font-bold mt-1">{course.title}</h1>
                            <p className="text-sm text-gray-400">{course.category?.name} · {course.tech_stack?.name}</p>
                        </div>
                        <Link
                            href={`/admin/courses/${course.id}/lessons/create`}
                            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition"
                        >
                            + 新しいレッスン
                        </Link>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {lessons.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                まだレッスンがありません
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {lessons.map((lesson, idx) => (
                                    <div key={lesson.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                                        <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-400">
                                            {idx + 1}
                                        </span>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">{lesson.title}</div>
                                            <div className="text-xs text-gray-400">
                                                {lesson.type} · {lesson.estimated_minutes}分 · {lesson.xp_reward} XP
                                                {!lesson.is_published && <span className="ml-2 text-orange-500">(下書き)</span>}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/courses/${course.id}/lessons/${lesson.id}/edit`}
                                                className="px-3 py-1 text-sm text-purple-500 border border-purple-200 rounded-lg hover:bg-purple-50 transition"
                                            >
                                                編集
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(lesson)}
                                                className="px-3 py-1 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition"
                                            >
                                                削除
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
