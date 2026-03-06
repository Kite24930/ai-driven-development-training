import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Category, Course, PageProps } from '@/types';
import { useState } from 'react';

interface PaginatedCourses {
    data: (Course & { lessons_count: number })[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export default function AdminCoursesIndex({
    courses,
    categories,
    filters,
}: PageProps<{
    courses: PaginatedCourses;
    categories: Category[];
    filters: { search?: string; category?: string };
}>) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/courses', { search, category: filters.category }, { preserveState: true });
    };

    const handleDelete = (course: Course) => {
        if (confirm(`「${course.title}」を削除しますか？`)) {
            router.delete(`/admin/courses/${course.id}`);
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">コース管理</h2>}>
            <Head title="コース管理" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">コース管理</h1>
                        <Link
                            href="/admin/courses/create"
                            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition"
                        >
                            + 新しいコース
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="コースを検索..."
                                className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm"
                            />
                            <select
                                value={filters.category || ''}
                                onChange={(e) => router.get('/admin/courses', { search, category: e.target.value || undefined }, { preserveState: true })}
                                className="border border-gray-200 rounded-lg px-4 py-2 text-sm"
                            >
                                <option value="">すべてのカテゴリ</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            <button type="submit" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                                検索
                            </button>
                        </form>
                    </div>

                    {/* Course List */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left p-4 font-medium text-gray-500">コース名</th>
                                    <th className="text-left p-4 font-medium text-gray-500">カテゴリ</th>
                                    <th className="text-left p-4 font-medium text-gray-500">技術スタック</th>
                                    <th className="text-center p-4 font-medium text-gray-500">レッスン数</th>
                                    <th className="text-center p-4 font-medium text-gray-500">状態</th>
                                    <th className="text-right p-4 font-medium text-gray-500">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {courses.data.map((course) => (
                                    <tr key={course.id} className="hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="font-medium text-gray-900">{course.title}</div>
                                            <div className="text-xs text-gray-400">{course.difficulty}</div>
                                        </td>
                                        <td className="p-4 text-gray-500">{course.category?.name}</td>
                                        <td className="p-4 text-gray-500">{course.tech_stack?.name}</td>
                                        <td className="p-4 text-center">{course.lessons_count}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                course.is_published
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                {course.is_published ? '公開' : '下書き'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/courses/${course.id}/lessons`} className="text-cyan-500 hover:underline">
                                                    レッスン
                                                </Link>
                                                <Link href={`/admin/courses/${course.id}/edit`} className="text-purple-500 hover:underline">
                                                    編集
                                                </Link>
                                                <button onClick={() => handleDelete(course)} className="text-red-500 hover:underline">
                                                    削除
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {courses.last_page > 1 && (
                        <div className="flex justify-center gap-1 mt-6">
                            {courses.links.map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    className={`px-3 py-2 rounded text-sm ${
                                        link.active
                                            ? 'bg-purple-500 text-white'
                                            : link.url
                                            ? 'bg-gray-100 hover:bg-gray-200'
                                            : 'text-gray-300'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
