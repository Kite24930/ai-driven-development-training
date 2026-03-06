<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\TechStack;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CourseManagementController extends Controller
{
    public function index(Request $request)
    {
        $courses = Course::with('category', 'techStack')
            ->withCount('lessons')
            ->when($request->search, fn ($q, $s) => $q->where('title', 'like', "%{$s}%"))
            ->when($request->category, fn ($q, $c) => $q->where('category_id', $c))
            ->orderBy('sort_order')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Courses/Index', [
            'courses' => $courses,
            'categories' => Category::orderBy('sort_order')->get(),
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Courses/Edit', [
            'course' => null,
            'categories' => Category::orderBy('sort_order')->get(),
            'techStacks' => TechStack::orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'tech_stack_id' => 'required|exists:tech_stacks,id',
            'description' => 'nullable|string',
            'objectives' => 'nullable|string',
            'difficulty' => 'required|in:beginner,intermediate,advanced',
            'estimated_hours' => 'required|integer|min:1',
            'xp_reward' => 'required|integer|min:0',
            'is_published' => 'boolean',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,gif,webp|max:2048',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(5);

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('thumbnails', 'public');
        }

        Course::create($validated);

        return redirect()->route('admin.courses.index')->with('success', 'コースを作成しました');
    }

    public function edit(Course $course)
    {
        return Inertia::render('Admin/Courses/Edit', [
            'course' => $course,
            'categories' => Category::orderBy('sort_order')->get(),
            'techStacks' => TechStack::orderBy('sort_order')->get(),
        ]);
    }

    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'tech_stack_id' => 'required|exists:tech_stacks,id',
            'description' => 'nullable|string',
            'objectives' => 'nullable|string',
            'difficulty' => 'required|in:beginner,intermediate,advanced',
            'estimated_hours' => 'required|integer|min:1',
            'xp_reward' => 'required|integer|min:0',
            'is_published' => 'boolean',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,gif,webp|max:2048',
        ]);

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('thumbnails', 'public');
        }

        $course->update($validated);

        return redirect()->route('admin.courses.index')->with('success', 'コースを更新しました');
    }

    public function destroy(Course $course)
    {
        $course->delete();
        return redirect()->route('admin.courses.index')->with('success', 'コースを削除しました');
    }
}
