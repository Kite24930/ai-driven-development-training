<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\CourseManagementController;
use App\Http\Controllers\Admin\ImageUploadController;
use App\Http\Controllers\Admin\LessonManagementController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SkillTreeController;
use App\Models\Category;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public: Landing page
Route::get('/', function () {
    $categories = Category::where('is_active', true)
        ->withCount('courses')
        ->orderBy('sort_order')
        ->get();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'categories' => $categories,
    ]);
})->name('home');

// Public: Categories & Courses browsing
Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('/categories/{category:slug}', [CategoryController::class, 'show'])->name('categories.show');
Route::get('/courses/{course:slug}', [CourseController::class, 'show'])->name('courses.show');
Route::get('/leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard');

// Auth required
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/skill-tree', [SkillTreeController::class, 'index'])->name('skill-tree');

    Route::get('/courses/{course:slug}/lessons/{lesson:slug}', [LessonController::class, 'show'])->name('lessons.show');
    Route::post('/courses/{course:slug}/lessons/{lesson:slug}/complete', [LessonController::class, 'complete'])->name('lessons.complete');
    Route::post('/courses/{course:slug}/lessons/{lesson:slug}/quiz', [LessonController::class, 'submitQuiz'])->name('lessons.quiz');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin routes
Route::middleware(['auth', \App\Http\Middleware\AdminMiddleware::class])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

        Route::resource('courses', CourseManagementController::class)->except(['show']);
        Route::resource('courses.lessons', LessonManagementController::class)->except(['show']);
        Route::post('courses/{course}/lessons/reorder', [LessonManagementController::class, 'reorder'])->name('courses.lessons.reorder');

        Route::post('upload-image', [ImageUploadController::class, 'store'])->name('upload-image');
    });

require __DIR__.'/auth.php';
