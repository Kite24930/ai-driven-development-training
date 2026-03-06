<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\User;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => User::where('role', 'learner')->count(),
                'totalCourses' => Course::count(),
                'totalLessons' => Lesson::count(),
                'publishedCourses' => Course::where('is_published', true)->count(),
            ],
            'recentUsers' => User::where('role', 'learner')
                ->latest()
                ->limit(5)
                ->get(['id', 'name', 'email', 'created_at', 'xp', 'level']),
        ]);
    }
}
