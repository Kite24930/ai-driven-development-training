<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\CourseProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LessonController extends Controller
{
    public function show(Course $course, Lesson $lesson)
    {
        $lesson->load('quizzes');
        $course->load(['category', 'techStack', 'lessons' => function ($q) {
            $q->where('is_published', true)->orderBy('sort_order')->select('id', 'course_id', 'title', 'slug', 'type', 'sort_order', 'estimated_minutes');
        }]);

        $user = auth()->user();
        $progress = null;
        $allProgress = [];

        if ($user) {
            $progress = LessonProgress::firstOrCreate(
                ['user_id' => $user->id, 'lesson_id' => $lesson->id],
                ['status' => 'in_progress', 'started_at' => now()]
            );

            if ($progress->status === 'not_started') {
                $progress->update(['status' => 'in_progress', 'started_at' => now()]);
            }

            $allProgress = $user->lessonProgress()
                ->whereIn('lesson_id', $course->lessons->pluck('id'))
                ->get()
                ->keyBy('lesson_id');

            // Ensure course progress exists
            CourseProgress::firstOrCreate(
                ['user_id' => $user->id, 'course_id' => $course->id],
                ['status' => 'in_progress', 'started_at' => now()]
            );
        }

        return Inertia::render('Lessons/Show', [
            'course' => $course,
            'lesson' => $lesson,
            'progress' => $progress,
            'allProgress' => $allProgress,
        ]);
    }

    public function complete(Request $request, Course $course, Lesson $lesson)
    {
        $user = $request->user();

        $progress = LessonProgress::firstOrCreate(
            ['user_id' => $user->id, 'lesson_id' => $lesson->id],
            ['status' => 'not_started']
        );

        if ($progress->status !== 'completed') {
            $progress->update([
                'status' => 'completed',
                'completed_at' => now(),
                'xp_earned' => $lesson->xp_reward,
            ]);

            $user->addXp($lesson->xp_reward, 'lesson', $lesson->id, "レッスン「{$lesson->title}」を完了");

            // Update course progress
            $totalLessons = $course->lessons()->where('is_published', true)->count();
            $completedLessons = $user->lessonProgress()
                ->whereIn('lesson_id', $course->lessons->pluck('id'))
                ->where('status', 'completed')
                ->count();

            $percentage = $totalLessons > 0 ? (int) (($completedLessons / $totalLessons) * 100) : 0;

            $courseProgress = CourseProgress::firstOrCreate(
                ['user_id' => $user->id, 'course_id' => $course->id],
                ['status' => 'in_progress', 'started_at' => now()]
            );

            $courseProgress->update([
                'progress_percentage' => $percentage,
                'status' => $percentage >= 100 ? 'completed' : 'in_progress',
                'completed_at' => $percentage >= 100 ? now() : null,
            ]);

            if ($percentage >= 100) {
                $user->addXp($course->xp_reward, 'course', $course->id, "コース「{$course->title}」を完了");
            }

            // Update streak
            $today = now()->toDateString();
            if ($user->last_activity_date !== $today) {
                $yesterday = now()->subDay()->toDateString();
                $streak = ($user->last_activity_date && $user->last_activity_date->toDateString() === $yesterday)
                    ? $user->streak_days + 1
                    : 1;
                $user->update([
                    'streak_days' => $streak,
                    'last_activity_date' => $today,
                ]);
            }
        }

        return back()->with('success', 'レッスンを完了しました！');
    }

    public function submitQuiz(Request $request, Course $course, Lesson $lesson)
    {
        $validated = $request->validate([
            'answers' => 'required|array',
        ]);

        $user = $request->user();
        $quizzes = $lesson->quizzes;
        $correct = 0;
        $total = $quizzes->count();

        foreach ($quizzes as $quiz) {
            if (isset($validated['answers'][$quiz->id]) && (int) $validated['answers'][$quiz->id] === $quiz->correct_option) {
                $correct++;
            }
        }

        $score = $total > 0 ? (int) (($correct / $total) * 100) : 0;
        $xpEarned = $correct * 10;

        $progress = LessonProgress::firstOrCreate(
            ['user_id' => $user->id, 'lesson_id' => $lesson->id],
            ['status' => 'in_progress', 'started_at' => now()]
        );

        $progress->update(['quiz_score' => $score]);

        if ($xpEarned > 0) {
            $user->addXp($xpEarned, 'quiz', $lesson->id, "クイズで{$correct}/{$total}問正解");
        }

        return back()->with([
            'quizResult' => [
                'correct' => $correct,
                'total' => $total,
                'score' => $score,
                'xpEarned' => $xpEarned,
            ],
        ]);
    }
}
