<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    public function index()
    {
        $leaderboard = User::where('role', 'learner')
            ->orderByDesc('xp')
            ->limit(50)
            ->get(['id', 'name', 'avatar', 'xp', 'level', 'title', 'streak_days']);

        return Inertia::render('Leaderboard/Index', [
            'leaderboard' => $leaderboard,
        ]);
    }
}
