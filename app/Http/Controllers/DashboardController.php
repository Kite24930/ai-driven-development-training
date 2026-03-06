<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Course;
use App\Models\CourseProgress;
use App\Models\LessonProgress;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $recentProgress = LessonProgress::where('user_id', $user->id)
            ->where('status', 'completed')
            ->with('lesson.course.category')
            ->orderByDesc('completed_at')
            ->limit(5)
            ->get();

        $courseProgress = CourseProgress::where('user_id', $user->id)
            ->where('status', 'in_progress')
            ->with('course.category', 'course.techStack')
            ->get();

        $badges = $user->badges()->orderByPivot('earned_at', 'desc')->limit(8)->get();

        $xpForNext = $user->xpForNextLevel();
        $xpForCurrent = $user->xpForCurrentLevel();

        $leaderboard = User::where('role', 'learner')
            ->orderByDesc('xp')
            ->limit(10)
            ->get(['id', 'name', 'avatar', 'xp', 'level', 'title']);

        return Inertia::render('Dashboard', [
            'stats' => [
                'xp' => $user->xp,
                'level' => $user->level,
                'xpForNext' => $xpForNext,
                'xpForCurrent' => $xpForCurrent,
                'streakDays' => $user->streak_days,
                'badgeCount' => $user->badges()->count(),
                'completedLessons' => $user->lessonProgress()->where('status', 'completed')->count(),
                'completedCourses' => $user->courseProgress()->where('status', 'completed')->count(),
            ],
            'recentProgress' => $recentProgress,
            'courseProgress' => $courseProgress,
            'badges' => $badges,
            'leaderboard' => $leaderboard,
        ]);
    }
}
