<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class LessonManagementController extends Controller
{
    public function index(Course $course)
    {
        $lessons = $course->lessons()->orderBy('sort_order')->get();

        return Inertia::render('Admin/Lessons/Index', [
            'course' => $course->load('category', 'techStack'),
            'lessons' => $lessons,
        ]);
    }

    public function create(Course $course)
    {
        return Inertia::render('Admin/Lessons/Edit', [
            'course' => $course,
            'lesson' => null,
        ]);
    }

    public function store(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'type' => 'required|in:text,video,quiz,challenge',
            'xp_reward' => 'required|integer|min:0',
            'estimated_minutes' => 'required|integer|min:1',
            'is_published' => 'boolean',
            'quizzes' => 'nullable|array',
            'quizzes.*.question' => 'required_with:quizzes|string',
            'quizzes.*.options' => 'required_with:quizzes|array|min:2',
            'quizzes.*.correct_option' => 'required_with:quizzes|integer',
            'quizzes.*.explanation' => 'nullable|string',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(5);
        $validated['sort_order'] = $course->lessons()->count();

        $lesson = $course->lessons()->create(collect($validated)->except('quizzes')->toArray());

        if (!empty($validated['quizzes'])) {
            foreach ($validated['quizzes'] as $i => $quiz) {
                $lesson->quizzes()->create([
                    'question' => $quiz['question'],
                    'options' => $quiz['options'],
                    'correct_option' => $quiz['correct_option'],
                    'explanation' => $quiz['explanation'] ?? null,
                    'sort_order' => $i,
                ]);
            }
        }

        return redirect()->route('admin.courses.lessons.index', $course)
            ->with('success', 'レッスンを作成しました');
    }

    public function edit(Course $course, Lesson $lesson)
    {
        $lesson->load('quizzes');

        return Inertia::render('Admin/Lessons/Edit', [
            'course' => $course,
            'lesson' => $lesson,
        ]);
    }

    public function update(Request $request, Course $course, Lesson $lesson)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'type' => 'required|in:text,video,quiz,challenge',
            'xp_reward' => 'required|integer|min:0',
            'estimated_minutes' => 'required|integer|min:1',
            'is_published' => 'boolean',
            'quizzes' => 'nullable|array',
            'quizzes.*.question' => 'required_with:quizzes|string',
            'quizzes.*.options' => 'required_with:quizzes|array|min:2',
            'quizzes.*.correct_option' => 'required_with:quizzes|integer',
            'quizzes.*.explanation' => 'nullable|string',
        ]);

        $lesson->update(collect($validated)->except('quizzes')->toArray());

        if (isset($validated['quizzes'])) {
            $lesson->quizzes()->delete();
            foreach ($validated['quizzes'] as $i => $quiz) {
                $lesson->quizzes()->create([
                    'question' => $quiz['question'],
                    'options' => $quiz['options'],
                    'correct_option' => $quiz['correct_option'],
                    'explanation' => $quiz['explanation'] ?? null,
                    'sort_order' => $i,
                ]);
            }
        }

        return redirect()->route('admin.courses.lessons.index', $course)
            ->with('success', 'レッスンを更新しました');
    }

    public function destroy(Course $course, Lesson $lesson)
    {
        $lesson->delete();
        return redirect()->route('admin.courses.lessons.index', $course)
            ->with('success', 'レッスンを削除しました');
    }

    public function reorder(Request $request, Course $course)
    {
        $validated = $request->validate([
            'lessons' => 'required|array',
            'lessons.*.id' => 'required|exists:lessons,id',
            'lessons.*.sort_order' => 'required|integer',
        ]);

        foreach ($validated['lessons'] as $item) {
            Lesson::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return back()->with('success', '順序を更新しました');
    }
}
