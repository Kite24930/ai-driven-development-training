import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Badge, CourseProgress, LessonProgress, PageProps, User } from '@/types';

interface DashboardProps {
    stats: {
        xp: number;
        level: number;
        xpForNext: number;
        xpForCurrent: number;
        streakDays: number;
        badgeCount: number;
        completedLessons: number;
        completedCourses: number;
    };
    recentProgress: (LessonProgress & { lesson: { title: string; course: { title: string; slug: string; category: { name: string; slug: string } } } })[];
    courseProgress: (CourseProgress & { course: { title: string; slug: string; category: { name: string }; tech_stack: { name: string } } })[];
    badges: Badge[];
    leaderboard: User[];
}

const rarityColors: Record<string, string> = {
    common: 'border-gray-400 bg-gray-400/10',
    rare: 'border-blue-400 bg-blue-400/10',
    epic: 'border-purple-400 bg-purple-400/10',
    legendary: 'border-yellow-400 bg-yellow-400/10',
};

export default function Dashboard({ stats, recentProgress, courseProgress, badges, leaderboard }: PageProps<DashboardProps>) {
    const { auth } = usePage<PageProps>().props;
    const xpProgress = stats.xpForNext > stats.xpForCurrent
        ? ((stats.xp - stats.xpForCurrent) / (stats.xpForNext - stats.xpForCurrent)) * 100
        : 100;

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">ダッシュボード</h2>}
        >
            <Head title="ダッシュボード" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white">
                            <div className="text-3xl font-bold">{stats.level}</div>
                            <div className="text-cyan-100 text-sm">レベル</div>
                            <div className="mt-3 bg-white/20 rounded-full h-2">
                                <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${xpProgress}%` }} />
                            </div>
                            <div className="text-xs text-cyan-100 mt-1">{stats.xp} / {stats.xpForNext} XP</div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
                            <div className="text-3xl font-bold">{stats.streakDays}</div>
                            <div className="text-orange-100 text-sm">連続学習日数</div>
                            <div className="text-2xl mt-2">🔥</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                            <div className="text-3xl font-bold">{stats.badgeCount}</div>
                            <div className="text-purple-100 text-sm">獲得バッジ</div>
                            <div className="text-2xl mt-2">🏆</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                            <div className="text-3xl font-bold">{stats.completedLessons}</div>
                            <div className="text-green-100 text-sm">完了レッスン</div>
                            <div className="text-xs text-green-100 mt-2">{stats.completedCourses} コース完了</div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Course Progress */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h3 className="text-lg font-bold mb-4">学習中のコース</h3>
                                {courseProgress.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400">
                                        <p className="text-lg mb-2">まだコースを開始していません</p>
                                        <Link href="/categories" className="text-cyan-500 hover:underline">
                                            コースを探す →
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {courseProgress.map((cp) => (
                                            <Link
                                                key={cp.id}
                                                href={`/courses/${cp.course.slug}`}
                                                className="block p-4 border border-gray-100 rounded-xl hover:border-purple-200 transition"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <span className="text-xs text-purple-500 font-medium">{cp.course.category?.name}</span>
                                                        <h4 className="font-semibold">{cp.course.title}</h4>
                                                    </div>
                                                    <span className="text-sm text-gray-500">{cp.progress_percentage}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full h-2 transition-all"
                                                        style={{ width: `${cp.progress_percentage}%` }}
                                                    />
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">{cp.course.tech_stack?.name}</div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h3 className="text-lg font-bold mb-4">最近の学習</h3>
                                {recentProgress.length === 0 ? (
                                    <p className="text-gray-400 text-center py-4">まだ学習記録がありません</p>
                                ) : (
                                    <div className="space-y-3">
                                        {recentProgress.map((rp) => (
                                            <div key={rp.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-500">
                                                    ✓
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium text-sm">{rp.lesson?.title}</div>
                                                    <div className="text-xs text-gray-400">{rp.lesson?.course?.title}</div>
                                                </div>
                                                <div className="text-xs text-cyan-500 font-medium">+{rp.xp_earned} XP</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Badges */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h3 className="text-lg font-bold mb-4">獲得バッジ</h3>
                                {badges.length === 0 ? (
                                    <p className="text-gray-400 text-sm text-center py-4">まだバッジを獲得していません</p>
                                ) : (
                                    <div className="grid grid-cols-4 gap-2">
                                        {badges.map((badge) => (
                                            <div
                                                key={badge.id}
                                                className={`p-2 rounded-lg border-2 text-center ${rarityColors[badge.rarity]}`}
                                                title={badge.description}
                                            >
                                                <div className="text-2xl">{badge.icon}</div>
                                                <div className="text-xs mt-1 truncate">{badge.name}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Leaderboard */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold">ランキング</h3>
                                    <Link href="/leaderboard" className="text-sm text-cyan-500 hover:underline">
                                        全て見る
                                    </Link>
                                </div>
                                <div className="space-y-2">
                                    {leaderboard.slice(0, 5).map((user, i) => (
                                        <div key={user.id} className="flex items-center gap-3 p-2">
                                            <span className={`w-6 text-center font-bold ${i < 3 ? 'text-yellow-500' : 'text-gray-400'}`}>
                                                {i + 1}
                                            </span>
                                            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium">{user.name}</div>
                                                <div className="text-xs text-gray-400">Lv.{user.level}</div>
                                            </div>
                                            <div className="text-sm text-cyan-500 font-medium">{user.xp} XP</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h3 className="text-lg font-bold mb-4">クイックアクセス</h3>
                                <div className="space-y-2">
                                    <Link href="/categories" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-sm">
                                        📚 カテゴリ一覧
                                    </Link>
                                    <Link href="/skill-tree" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-sm">
                                        🌳 スキルツリー
                                    </Link>
                                    <Link href="/leaderboard" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-sm">
                                        🏆 ランキング
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
