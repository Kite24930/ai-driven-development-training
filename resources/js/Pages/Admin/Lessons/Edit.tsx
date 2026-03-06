import { Head, useForm, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Course, Lesson, PageProps, Quiz } from '@/types';
import { useState, useRef } from 'react';

interface QuizForm {
    question: string;
    options: string[];
    correct_option: number;
    explanation: string;
}

export default function AdminLessonEdit({
    course,
    lesson,
}: PageProps<{
    course: Course;
    lesson: Lesson | null;
}>) {
    const isNew = !lesson;
    const { data, setData, post, put, processing, errors } = useForm({
        title: lesson?.title || '',
        content: lesson?.content || '',
        type: lesson?.type || 'text',
        xp_reward: lesson?.xp_reward || 25,
        estimated_minutes: lesson?.estimated_minutes || 15,
        is_published: lesson?.is_published || false,
        quizzes: (lesson?.quizzes?.map((q) => ({
            question: q.question,
            options: q.options,
            correct_option: q.correct_option,
            explanation: q.explanation || '',
        })) || []) as QuizForm[],
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async () => {
        const file = fileInputRef.current?.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/admin/upload-image', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            const result = await response.json();
            if (result.url) {
                const imgTag = `<img src="${result.url}" alt="" class="max-w-full rounded-lg my-4" />`;
                setData('content', data.content + '\n' + imgTag);
            }
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    const addQuiz = () => {
        setData('quizzes', [
            ...data.quizzes,
            { question: '', options: ['', ''], correct_option: 0, explanation: '' },
        ]);
    };

    const removeQuiz = (index: number) => {
        setData('quizzes', data.quizzes.filter((_, i) => i !== index));
    };

    const updateQuiz = (index: number, field: keyof QuizForm, value: any) => {
        const updated = [...data.quizzes];
        updated[index] = { ...updated[index], [field]: value };
        setData('quizzes', updated);
    };

    const addOption = (quizIndex: number) => {
        const updated = [...data.quizzes];
        updated[quizIndex].options = [...updated[quizIndex].options, ''];
        setData('quizzes', updated);
    };

    const updateOption = (quizIndex: number, optionIndex: number, value: string) => {
        const updated = [...data.quizzes];
        updated[quizIndex].options = [...updated[quizIndex].options];
        updated[quizIndex].options[optionIndex] = value;
        setData('quizzes', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isNew) {
            post(`/admin/courses/${course.id}/lessons`);
        } else {
            put(`/admin/courses/${course.id}/lessons/${lesson.id}`);
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">{isNew ? 'レッスン作成' : 'レッスン編集'}</h2>}>
            <Head title={isNew ? 'レッスン作成' : 'レッスン編集'} />
            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href={`/admin/courses/${course.id}/lessons`} className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">
                        ← {course.title} のレッスン一覧
                    </Link>

                    <div className="bg-white rounded-xl shadow-sm p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">レッスン名</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2"
                                    required
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">タイプ</label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value as Lesson['type'])}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2"
                                    >
                                        <option value="text">テキスト</option>
                                        <option value="video">動画</option>
                                        <option value="quiz">クイズ</option>
                                        <option value="challenge">チャレンジ</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">所要時間(分)</label>
                                    <input
                                        type="number"
                                        value={data.estimated_minutes}
                                        onChange={(e) => setData('estimated_minutes', Number(e.target.value))}
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
                                <div className="flex items-end">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={data.is_published}
                                            onChange={(e) => setData('is_published', e.target.checked)}
                                            className="rounded border-gray-300"
                                        />
                                        <span className="text-sm text-gray-700">公開</span>
                                    </label>
                                </div>
                            </div>

                            {/* Content Editor */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-gray-700">コンテンツ (HTML)</label>
                                    <div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-sm text-purple-500 hover:underline"
                                        >
                                            画像を挿入
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 font-mono text-sm h-64"
                                    placeholder="HTMLでコンテンツを記述..."
                                />
                            </div>

                            {/* Quiz Builder */}
                            <div className="border-t border-gray-100 pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold">クイズ</h3>
                                    <button
                                        type="button"
                                        onClick={addQuiz}
                                        className="text-sm text-purple-500 hover:underline"
                                    >
                                        + クイズを追加
                                    </button>
                                </div>

                                {data.quizzes.map((quiz, qIdx) => (
                                    <div key={qIdx} className="p-4 border border-gray-200 rounded-xl mb-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-sm font-medium text-gray-500">Q{qIdx + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeQuiz(qIdx)}
                                                className="text-red-500 text-sm hover:underline"
                                            >
                                                削除
                                            </button>
                                        </div>

                                        <input
                                            type="text"
                                            value={quiz.question}
                                            onChange={(e) => updateQuiz(qIdx, 'question', e.target.value)}
                                            placeholder="質問文"
                                            className="w-full border border-gray-200 rounded-lg px-4 py-2 mb-3"
                                        />

                                        <div className="space-y-2 mb-3">
                                            {quiz.options.map((opt, oIdx) => (
                                                <div key={oIdx} className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name={`correct_${qIdx}`}
                                                        checked={quiz.correct_option === oIdx}
                                                        onChange={() => updateQuiz(qIdx, 'correct_option', oIdx)}
                                                        className="text-green-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={opt}
                                                        onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                                                        placeholder={`選択肢 ${oIdx + 1}`}
                                                        className="flex-1 border border-gray-200 rounded-lg px-3 py-1 text-sm"
                                                    />
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => addOption(qIdx)}
                                                className="text-xs text-gray-400 hover:text-gray-600"
                                            >
                                                + 選択肢を追加
                                            </button>
                                        </div>

                                        <input
                                            type="text"
                                            value={quiz.explanation}
                                            onChange={(e) => updateQuiz(qIdx, 'explanation', e.target.value)}
                                            placeholder="解説（オプション）"
                                            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between pt-4 border-t">
                                <Link href={`/admin/courses/${course.id}/lessons`} className="text-gray-500 hover:text-gray-700">
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
