<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\TechStack;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('is_active', true)
            ->withCount('courses')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function show(Category $category)
    {
        $techStacks = TechStack::orderBy('sort_order')->get();

        $courses = $category->courses()
            ->where('is_published', true)
            ->with('techStack')
            ->withCount('lessons')
            ->orderBy('sort_order')
            ->get();

        $user = auth()->user();
        $courseProgress = [];
        if ($user) {
            $courseProgress = $user->courseProgress()
                ->whereIn('course_id', $courses->pluck('id'))
                ->get()
                ->keyBy('course_id');
        }

        return Inertia::render('Categories/Show', [
            'category' => $category,
            'courses' => $courses,
            'techStacks' => $techStacks,
            'courseProgress' => $courseProgress,
        ]);
    }
}
