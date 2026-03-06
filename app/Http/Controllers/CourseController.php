<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function show(Course $course)
    {
        $course->load(['category', 'techStack', 'lessons' => function ($q) {
            $q->where('is_published', true)->orderBy('sort_order');
        }]);

        $user = auth()->user();
        $lessonProgress = [];
        $courseProgress = null;

        if ($user) {
            $lessonProgress = $user->lessonProgress()
                ->whereIn('lesson_id', $course->lessons->pluck('id'))
                ->get()
                ->keyBy('lesson_id');

            $courseProgress = $user->courseProgress()
                ->where('course_id', $course->id)
                ->first();
        }

        return Inertia::render('Courses/Show', [
            'course' => $course,
            'lessonProgress' => $lessonProgress,
            'courseProgress' => $courseProgress,
        ]);
    }
}
