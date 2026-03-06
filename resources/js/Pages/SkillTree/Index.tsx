import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

interface SkillNode {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon?: string;
    category?: { name: string; color: string };
    required_xp: number;
    children: SkillNode[];
}

interface UserSkill {
    skill_id: number;
    current_xp: number;
    is_unlocked: boolean;
}

export default function SkillTreeIndex({
    skills,
    userSkills,
}: PageProps<{ skills: SkillNode[]; userSkills: Record<number, UserSkill> }>) {
    const renderSkill = (skill: SkillNode, depth = 0) => {
        const us = userSkills[skill.id];
        const isUnlocked = us?.is_unlocked;
        const progress = us ? Math.min((us.current_xp / skill.required_xp) * 100, 100) : 0;

        return (
            <div key={skill.id} className={`${depth > 0 ? 'ml-8 mt-4' : ''}`}>
                <div
                    className={`p-4 rounded-xl border-2 transition ${
                        isUnlocked
                            ? 'border-green-400 bg-green-50'
                            : progress > 0
                            ? 'border-cyan-300 bg-cyan-50'
                            : 'border-gray-200 bg-gray-50'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                            isUnlocked
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-400'
                        }`}>
                            {skill.icon || (isUnlocked ? '✓' : '🔒')}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{skill.name}</h3>
                            <p className="text-xs text-gray-400">{skill.description}</p>
                            {skill.category && (
                                <span className="text-xs font-medium" style={{ color: skill.category.color }}>
                                    {skill.category.name}
                                </span>
                            )}
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-400">{skill.required_xp} XP必要</div>
                            {us && !isUnlocked && (
                                <div className="text-xs text-cyan-500">{us.current_xp}/{skill.required_xp}</div>
                            )}
                        </div>
                    </div>
                    {us && !isUnlocked && (
                        <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                            <div
                                className="bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full h-1.5"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}
                </div>
                {skill.children?.length > 0 && (
                    <div className="border-l-2 border-gray-200 ml-6">
                        {skill.children.map((child) => renderSkill(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">スキルツリー</h2>}>
            <Head title="スキルツリー" />
            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">スキルツリー</h1>
                        <p className="text-gray-500 mt-2">学習を進めてスキルをアンロックしよう</p>
                    </div>

                    <div className="space-y-6">
                        {skills.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                スキルツリーはまだ準備中です
                            </div>
                        ) : (
                            skills.map((skill) => renderSkill(skill))
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
