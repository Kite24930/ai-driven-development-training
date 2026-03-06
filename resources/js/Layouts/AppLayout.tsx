import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';
import { PageProps } from '@/types';

export default function AppLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth } = usePage<PageProps>().props;
    const user = auth?.user;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex items-center gap-6">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center font-bold text-white text-xs">
                                    AI
                                </div>
                                <span className="font-bold text-gray-800">AI駆動開発トレーニング</span>
                            </Link>
                            <div className="hidden sm:flex items-center gap-4">
                                <Link href="/categories" className="text-sm text-gray-500 hover:text-gray-700">
                                    カテゴリ
                                </Link>
                                <Link href="/leaderboard" className="text-sm text-gray-500 hover:text-gray-700">
                                    ランキング
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {user ? (
                                <>
                                    <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
                                        ダッシュボード
                                    </Link>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="text-sm text-gray-500 hover:text-gray-700"
                                    >
                                        ログアウト
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">
                                        ログイン
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="text-sm px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:opacity-90"
                                    >
                                        無料登録
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
