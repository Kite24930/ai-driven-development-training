import { Category, PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

// Mini Space Invader game for the hero section
function MiniInvaderGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        let animId: number;
        const stars: { x: number; y: number; s: number; v: number }[] = [];
        const invaders: { x: number; y: number; w: number; h: number; alive: boolean }[] = [];
        const bullets: { x: number; y: number }[] = [];
        let player = { x: canvas.width / 2 - 15, y: canvas.height - 40, w: 30, h: 20 };
        let localScore = 0;
        let dx = 0;

        for (let i = 0; i < 60; i++) {
            stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, s: Math.random() * 2, v: 0.2 + Math.random() * 0.5 });
        }

        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 8; c++) {
                invaders.push({ x: 30 + c * 45, y: 20 + r * 30, w: 24, h: 16, alive: true });
            }
        }

        let invaderDir = 1;
        let invaderSpeed = 0.3;
        let shootTimer = 0;

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') dx = -3;
            if (e.key === 'ArrowRight') dx = 3;
            if (e.key === ' ') {
                e.preventDefault();
                bullets.push({ x: player.x + player.w / 2, y: player.y });
            }
        };
        const handleKeyUp = () => { dx = 0; };

        canvas.tabIndex = 0;
        canvas.addEventListener('keydown', handleKey);
        canvas.addEventListener('keyup', handleKeyUp);

        function draw() {
            ctx!.fillStyle = '#0a0a1a';
            ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

            // Stars
            stars.forEach(s => {
                s.y += s.v;
                if (s.y > canvas!.height) { s.y = 0; s.x = Math.random() * canvas!.width; }
                ctx!.fillStyle = `rgba(255,255,255,${0.3 + s.s * 0.3})`;
                ctx!.fillRect(s.x, s.y, s.s, s.s);
            });

            // Player
            player.x += dx;
            player.x = Math.max(0, Math.min(canvas!.width - player.w, player.x));
            ctx!.fillStyle = '#22d3ee';
            ctx!.fillRect(player.x, player.y, player.w, player.h);
            ctx!.fillRect(player.x + player.w / 2 - 3, player.y - 6, 6, 6);

            // Bullets
            bullets.forEach((b, i) => {
                b.y -= 4;
                if (b.y < 0) { bullets.splice(i, 1); return; }
                ctx!.fillStyle = '#facc15';
                ctx!.fillRect(b.x - 1, b.y, 2, 8);
            });

            // Invaders
            let hitEdge = false;
            invaders.forEach(inv => {
                if (!inv.alive) return;
                inv.x += invaderSpeed * invaderDir;
                if (inv.x <= 0 || inv.x + inv.w >= canvas!.width) hitEdge = true;

                ctx!.fillStyle = '#a855f7';
                ctx!.fillRect(inv.x, inv.y, inv.w, inv.h);
                ctx!.fillStyle = '#c084fc';
                ctx!.fillRect(inv.x + 4, inv.y + 4, 6, 4);
                ctx!.fillRect(inv.x + inv.w - 10, inv.y + 4, 6, 4);

                // Collision
                bullets.forEach((b, bi) => {
                    if (b.x >= inv.x && b.x <= inv.x + inv.w && b.y >= inv.y && b.y <= inv.y + inv.h) {
                        inv.alive = false;
                        bullets.splice(bi, 1);
                        localScore += 10;
                        setScore(localScore);
                    }
                });
            });

            if (hitEdge) {
                invaderDir *= -1;
                invaders.forEach(inv => { if (inv.alive) inv.y += 8; });
            }

            // Respawn if all dead
            if (!invaders.some(i => i.alive)) {
                invaders.forEach((inv, idx) => {
                    const r = Math.floor(idx / 8);
                    const c = idx % 8;
                    inv.x = 30 + c * 45;
                    inv.y = 20 + r * 30;
                    inv.alive = true;
                });
                invaderSpeed += 0.1;
            }

            // Score display
            ctx!.fillStyle = '#22d3ee';
            ctx!.font = '12px monospace';
            ctx!.fillText(`SCORE: ${localScore}`, 8, 14);

            animId = requestAnimationFrame(draw);
        }

        draw();
        return () => {
            cancelAnimationFrame(animId);
            canvas.removeEventListener('keydown', handleKey);
            canvas.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return (
        <div className="relative">
            <canvas
                ref={canvasRef}
                className="w-full h-64 rounded-xl border border-purple-500/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400"
                onClick={(e) => e.currentTarget.focus()}
            />
            <p className="text-xs text-gray-400 mt-2 text-center">
                Click to focus, then use arrow keys + space to play!
            </p>
        </div>
    );
}

const categoryIcons: Record<string, string> = {
    cursor: '🖱️',
    antigravity: '🚀',
    'claude-code': '🤖',
    security: '🛡️',
};

const difficultyColors: Record<string, string> = {
    beginner: 'from-green-500 to-emerald-500',
    intermediate: 'from-yellow-500 to-orange-500',
    advanced: 'from-red-500 to-pink-500',
};

export default function Welcome({
    auth,
    categories,
}: PageProps<{ categories: Category[] }>) {
    return (
        <>
            <Head title="AI駆動開発トレーニング" />
            <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
                {/* Header */}
                <header className="border-b border-gray-800">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center font-bold text-lg">
                                AI
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                AI駆動開発トレーニング
                            </span>
                        </Link>
                        <nav className="flex items-center gap-4">
                            <Link href="/categories" className="text-gray-300 hover:text-white transition">
                                カテゴリ
                            </Link>
                            <Link href="/leaderboard" className="text-gray-300 hover:text-white transition">
                                ランキング
                            </Link>
                            {auth.user ? (
                                <Link
                                    href="/dashboard"
                                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition"
                                >
                                    ダッシュボード
                                </Link>
                            ) : (
                                <div className="flex gap-2">
                                    <Link
                                        href="/login"
                                        className="px-4 py-2 border border-gray-600 rounded-lg hover:border-gray-400 transition"
                                    >
                                        ログイン
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition"
                                    >
                                        無料で始める
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-6 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm mb-6">
                                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                                インベーダーゲーム開発で学ぶ
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    AI駆動開発
                                </span>
                                <br />
                                マスターへの道
                            </h1>
                            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                Cursor・Google Antigravity・Claude Codeを使って、
                                インベーダーゲームのTOPページから実装まで
                                ハンズオン形式で学びましょう。
                                <br />
                                MCP・スキル・プラグインの活用も含めた実践的なカリキュラムです。
                            </p>
                            <div className="flex gap-4">
                                {auth.user ? (
                                    <Link
                                        href="/dashboard"
                                        className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-bold text-lg hover:opacity-90 transition shadow-lg shadow-purple-500/25"
                                    >
                                        学習を続ける
                                    </Link>
                                ) : (
                                    <Link
                                        href="/register"
                                        className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-bold text-lg hover:opacity-90 transition shadow-lg shadow-purple-500/25"
                                    >
                                        無料で始める
                                    </Link>
                                )}
                                <Link
                                    href="/categories"
                                    className="px-8 py-4 border border-gray-600 rounded-xl font-bold text-lg hover:border-gray-400 transition"
                                >
                                    カリキュラムを見る
                                </Link>
                            </div>
                        </div>
                        <div>
                            <MiniInvaderGame />
                        </div>
                    </div>
                </section>

                {/* Tech Stacks */}
                <section className="border-y border-gray-800 bg-gray-900/50">
                    <div className="max-w-7xl mx-auto px-6 py-12">
                        <p className="text-center text-gray-400 mb-8">対応技術スタック</p>
                        <div className="flex flex-wrap justify-center gap-8 text-gray-300">
                            {['Laravel + Inertia + React', 'Next.js', 'Swift', 'React Native', 'Unity'].map((tech) => (
                                <div key={tech} className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
                                    <span className="font-medium">{tech}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className="max-w-7xl mx-auto px-6 py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">学習カテゴリ</h2>
                        <p className="text-gray-400 text-lg">
                            4つの専門カテゴリで体系的に学習
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/categories/${cat.slug}`}
                                className="group p-6 bg-gray-800/50 border border-gray-700 rounded-2xl hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                            >
                                <div className="text-4xl mb-4">{categoryIcons[cat.slug] || '📚'}</div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-300 transition">
                                    {cat.name}
                                </h3>
                                <p className="text-gray-400 text-sm mb-4">{cat.description}</p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">{cat.courses_count || 0} コース</span>
                                    <span className="text-purple-400 group-hover:translate-x-1 transition-transform">
                                        →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Features: Gamification */}
                <section className="bg-gray-900/50 border-y border-gray-800">
                    <div className="max-w-7xl mx-auto px-6 py-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">ゲーミフィケーションで楽しく学習</h2>
                            <p className="text-gray-400 text-lg">ゲーム要素で学習モチベーションを維持</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { icon: '⚡', title: 'XP & レベルアップ', desc: 'レッスン完了やクイズ正解でXPを獲得。レベルが上がると新しいコンテンツが解放されます。' },
                                { icon: '🏆', title: 'バッジ & アチーブメント', desc: 'Common/Rare/Epic/Legendaryの4段階のバッジを集めましょう。特定の条件を達成すると獲得できます。' },
                                { icon: '🔥', title: 'ストリーク & ランキング', desc: '毎日の学習ストリークを維持してボーナスXPを獲得。ランキングで他の学習者と競い合おう。' },
                                { icon: '🌳', title: 'スキルツリー', desc: '各カテゴリごとのスキルツリーで自分の成長を可視化。スキルをアンロックして専門性を深めよう。' },
                                { icon: '🎯', title: 'コーディングチャレンジ', desc: '実践的なチャレンジに挑戦してスキルを証明。制限時間内にお題をクリアしてXPを獲得。' },
                                { icon: '📊', title: '進捗ダッシュボード', desc: '学習の進捗を一目で確認。コース完了率、獲得XP、スキルの成長を包括的に管理。' },
                            ].map((f) => (
                                <div key={f.title} className="p-6 bg-gray-800/30 rounded-2xl border border-gray-700/50">
                                    <div className="text-3xl mb-3">{f.icon}</div>
                                    <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                                    <p className="text-gray-400 text-sm">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="max-w-7xl mx-auto px-6 py-20 text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        今すぐAI駆動開発を始めよう
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                        実務エンジニア向けの実践的なカリキュラムで、
                        AIコーディングツールを使いこなすスキルを身につけましょう。
                    </p>
                    {!auth.user && (
                        <Link
                            href="/register"
                            className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-bold text-lg hover:opacity-90 transition shadow-lg shadow-purple-500/25"
                        >
                            無料アカウントを作成
                        </Link>
                    )}
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-800 py-8">
                    <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
                        AI駆動開発トレーニング - インベーダーゲーム開発で学ぶ次世代の開発手法
                    </div>
                </footer>
            </div>
        </>
    );
}
