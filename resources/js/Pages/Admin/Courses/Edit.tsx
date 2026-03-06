import { Head, useForm, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Category, Course, PageProps, TechStack } from '@/types';

export default function AdminCourseEdit({
    course,
    categories,
    techStacks,
}: PageProps<{
    course: Course | null;
    categories: Category[];
    techStacks: TechStack[];
}>) {
    const isNew = !course;
    const { data, setData, processing, errors } = useForm({
        title: course?.title || '',
        category_id: course?.category_id || (categories[0]?.id || ''),
        tech_stack_id: course?.tech_stack_id || (techStacks[0]?.id || ''),
        description: course?.description || '',
        objectives: course?.objectives || '',
        difficulty: course?.difficulty || 'beginner',
        estimated_hours: course?.estimated_hours || 1,
        xp_reward: course?.xp_reward || 100,
        is_published: course?.is_published || false,
        thumbnail: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (key === 'is_published') {
                    formData.append(key, value ? '1' : '0');
                } else if (value instanceof File) {
                    formData.append(key, value);
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        if (isNew) {
            router.post('/admin/courses', formData);
        } else {
            formData.append('_method', 'PUT');
            router.post(`/admin/courses/${course.id}`, formData);
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">{isNew ? 'コース作成' : 'コース編集'}</h2>}>
            <Head title={isNew ? 'コース作成' : 'コース編集'} />
            <div className="py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-sm p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">コース名</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2"
                                    required
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
                                    <select
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', Number(e.target.value))}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">技術スタック</label>
                                    <select
                                        value={data.tech_stack_id}
                                        onChange={(e) => setData('tech_stack_id', Number(e.target.value))}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2"
                                    >
                                        {techStacks.map((ts) => (
                                            <option key={ts.id} value={ts.id}>{ts.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 h-24"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">学習目標</label>
                                <textarea
                                    value={data.objectives}
                                    onChange={(e) => setData('objectives', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 h-24"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">難易度</label>
                                    <select
                                        value={data.difficulty}
                                        onChange={(e) => setData('difficulty', e.target.value as Course['difficulty'])}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2"
                                    >
                                        <option value="beginner">初級</option>
                                        <option value="intermediate">中級</option>
                                        <option value="advanced">上級</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">所要時間(時間)</label>
                                    <input
                                        type="number"
                                        value={data.estimated_hours}
                                        onChange={(e) => setData('estimated_hours', Number(e.target.value))}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2"
                                        min={1}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">XP報酬</label>
                                    <input
                                        type="number"
                                        value={data.xp_reward}
                                        onChange={(e) => setData('xp_reward', Number(e.target.value))}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2"
                                        min={0}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">サムネイル画像</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('thumbnail', e.target.files?.[0] || null)}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_published"
                                    checked={data.is_published}
                                    onChange={(e) => setData('is_published', e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                <label htmlFor="is_published" className="text-sm text-gray-700">公開する</label>
                            </div>

                            <div className="flex justify-between pt-4 border-t">
                                <Link href="/admin/courses" className="text-gray-500 hover:text-gray-700">
                                    ← 戻る
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
                                >
                                    {processing ? '保存中...' : isNew ? '作成' : '更新'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
