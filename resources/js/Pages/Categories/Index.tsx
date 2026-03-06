import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Category, PageProps } from '@/types';

const categoryIcons: Record<string, string> = {
    cursor: '🖱️',
    antigravity: '🚀',
    'claude-code': '🤖',
    security: '🛡️',
};

const categoryDescriptions: Record<string, string> = {
    cursor: 'AI-powered IDEの決定版。Tab補完からComposerまで、Cursorの全機能を使いこなしてインベーダーゲームを開発。',
    antigravity: 'Googleのエージェント駆動IDE。Gemini 3 Proによる並列エージェントワークフローでゲーム開発を加速。',
    'claude-code': 'AnthropicのCLIコーディングアシスタント。ターミナルから直接AIの力を借りてゲーム開発を行う方法を学習。',
    security: 'AI駆動開発特有のセキュリティリスクと対策。プロンプトインジェクション、コード品質、依存関係管理を学ぶ。',
};

export default function CategoriesIndex({ categories }: PageProps<{ categories: Category[] }>) {
    return (
        <AppLayout header={<h2 className="text-xl font-semibold text-gray-800">学習カテゴリ</h2>}>
            <Head title="カテゴリ一覧" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">学習カテゴリ</h1>
                        <p className="text-gray-500 mt-2">AI駆動開発ツールごとの専門コースを選択してください</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/categories/${cat.slug}`}
                                className="group block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-purple-200 transition-all"
                            >
                                <div
                                    className="h-2"
                                    style={{ backgroundColor: cat.color }}
                                />
                                <div className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="text-4xl">{categoryIcons[cat.slug] || '📚'}</div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition">
                                                {cat.name}
                                            </h3>
                                            <p className="text-gray-500 text-sm mt-2">
                                                {categoryDescriptions[cat.slug] || cat.description}
                                            </p>
                                            <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                                                <span>{cat.courses_count || 0} コース</span>
                                                <span className="text-purple-400 group-hover:translate-x-1 transition-transform">
                                                    学習を始める →
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
