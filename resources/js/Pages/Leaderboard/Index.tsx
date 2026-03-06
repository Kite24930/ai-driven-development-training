import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps, User } from '@/types';

export default function LeaderboardIndex({ leaderboard }: PageProps<{ leaderboard: User[] }>) {
    const { auth } = usePage<PageProps>().props;

    return (
        <AppLayout header={<h2 className="text-xl font-semibold text-gray-800">ランキング</h2>}>
            <Head title="ランキング" />
            <div className="py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-6 text-white text-center">
                            <h1 className="text-2xl font-bold">ランキング</h1>
                            <p className="text-cyan-100 mt-1">XP獲得量トップ50</p>
                        </div>

                        {/* Top 3 */}
                        {leaderboard.length >= 3 && (
                            <div className="flex justify-center items-end gap-4 py-8 bg-gray-50">
                                {[leaderboard[1], leaderboard[0], leaderboard[2]].map((user, i) => {
                                    const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
                                    const sizes = { 1: 'w-20 h-20', 2: 'w-16 h-16', 3: 'w-16 h-16' };
                                    const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
                                    return (
                                        <div key={user.id} className={`text-center ${rank === 1 ? '-mt-4' : ''}`}>
                                            <div className="text-2xl mb-1">{medals[rank as 1 | 2 | 3]}</div>
                                            <div className={`${sizes[rank as 1 | 2 | 3]} mx-auto bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2`}>
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="font-bold text-sm">{user.name}</div>
                                            <div className="text-xs text-gray-400">Lv.{user.level}</div>
                                            <div className="text-sm text-cyan-500 font-bold">{user.xp} XP</div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Full list */}
                        <div className="divide-y divide-gray-50">
                            {leaderboard.map((user, i) => (
                                <div
                                    key={user.id}
                                    className={`flex items-center gap-4 p-4 ${
                                        auth.user?.id === user.id ? 'bg-purple-50' : ''
                                    }`}
                                >
                                    <span className={`w-8 text-center font-bold ${
                                        i < 3 ? 'text-yellow-500 text-lg' : 'text-gray-400'
                                    }`}>
                                        {i + 1}
                                    </span>
                                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">
                                            {user.name}
                                            {auth.user?.id === user.id && (
                                                <span className="text-xs text-purple-500 ml-2">(あなた)</span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            Lv.{user.level} {user.title && `· ${user.title}`}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-cyan-500">{user.xp} XP</div>
                                        {user.streak_days > 0 && (
                                            <div className="text-xs text-orange-400">🔥 {user.streak_days}日</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
