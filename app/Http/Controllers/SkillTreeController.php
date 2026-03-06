<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SkillTreeController extends Controller
{
    public function index(Request $request)
    {
        $skills = Skill::with('category', 'children')
            ->whereNull('parent_skill_id')
            ->orderBy('sort_order')
            ->get();

        $user = $request->user();
        $userSkills = [];
        if ($user) {
            $userSkills = \DB::table('user_skills')
                ->where('user_id', $user->id)
                ->get()
                ->keyBy('skill_id');
        }

        return Inertia::render('SkillTree/Index', [
            'skills' => $skills,
            'userSkills' => $userSkills,
        ]);
    }
}
