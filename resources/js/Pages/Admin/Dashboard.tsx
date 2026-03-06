import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, User } from '@/types';

interface AdminDashboardProps {
    stats: {
        totalUsers: number;
        totalCourses: number;
        totalLessons: number;
        publishedCourses: number;
    };
    recentUsers: (User & { created_at: string })[];
}

export default function AdminDashboard({ stats, recentUsers }: PageProps<AdminDashboardProps>) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">管理者ダッシュボード</h2>}>
            <Head title="管理者ダッシュボード" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
                            <div className="text-sm text-gray-400">学習者数</div>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="text-3xl font-bold text-gray-900">{stats.totalCourses}</div>
                            <div className="text-sm text-gray-400">総コース数</div>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="text-3xl font-bold text-gray-900">{stats.totalLessons}</div>
                            <div className="text-sm text-gray-400">総レッスン数</div>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="text-3xl font-bold text-gray-900">{stats.publishedCourses}</div>
                            <div className="text-sm text-gray-400">公開済みコース</div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold">コース管理</h3>
                                <Link href="/admin/courses" className="text-sm text-cyan-500 hover:underline">
                                    すべて見る →
                                </Link>
                            </div>
                            <div className="space-y-2">
                                <Link href="/admin/courses/create" className="block p-3 bg-purple-50 rounded-lg text-purple-600 font-medium hover:bg-purple-100 transition">
                                    + 新しいコースを作成
                                </Link>
                                <Link href="/admin/courses" className="block p-3 bg-gray-50 rounded-lg text-gray-600 hover:bg-gray-100 transition">
                                    コース一覧・編集
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-bold mb-4">最近の登録者</h3>
                            <div className="space-y-3">
                                {recentUsers.map((user) => (
                                    <div key={user.id} className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium">{user.name}</div>
                                            <div className="text-xs text-gray-400">{user.email}</div>
                                        </div>
                                        <div className="text-xs text-gray-400">Lv.{user.level}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
