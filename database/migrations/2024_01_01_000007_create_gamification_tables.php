<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Badges
        Schema::create('badges', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('icon');
            $table->string('color', 7)->default('#f59e0b');
            $table->enum('rarity', ['common', 'rare', 'epic', 'legendary'])->default('common');
            $table->string('requirement_type');
            $table->integer('requirement_value')->default(1);
            $table->integer('xp_reward')->default(50);
            $table->timestamps();
        });

        // User badges
        Schema::create('user_badges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('badge_id')->constrained()->cascadeOnDelete();
            $table->timestamp('earned_at');
            $table->unique(['user_id', 'badge_id']);
        });

        // Skills (skill tree)
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('icon')->nullable();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('parent_skill_id')->nullable()->constrained('skills')->nullOnDelete();
            $table->integer('required_xp')->default(100);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // User skills
        Schema::create('user_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('skill_id')->constrained()->cascadeOnDelete();
            $table->integer('current_xp')->default(0);
            $table->boolean('is_unlocked')->default(false);
            $table->timestamp('unlocked_at')->nullable();
            $table->unique(['user_id', 'skill_id']);
        });

        // User lesson progress
        Schema::create('lesson_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lesson_id')->constrained()->cascadeOnDelete();
            $table->enum('status', ['not_started', 'in_progress', 'completed'])->default('not_started');
            $table->integer('xp_earned')->default(0);
            $table->integer('quiz_score')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->unique(['user_id', 'lesson_id']);
        });

        // User course progress
        Schema::create('course_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->integer('progress_percentage')->default(0);
            $table->enum('status', ['not_started', 'in_progress', 'completed'])->default('not_started');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->unique(['user_id', 'course_id']);
        });

        // XP history / activity log
        Schema::create('xp_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->integer('amount');
            $table->string('source_type');
            $table->unsignedBigInteger('source_id')->nullable();
            $table->string('description');
            $table->timestamps();
        });

        // Challenges
        Schema::create('challenges', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->longText('instructions')->nullable();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('tech_stack_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('difficulty', ['beginner', 'intermediate', 'advanced'])->default('intermediate');
            $table->integer('xp_reward')->default(200);
            $table->integer('time_limit_minutes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // User challenge submissions
        Schema::create('challenge_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('challenge_id')->constrained()->cascadeOnDelete();
            $table->longText('submission_content')->nullable();
            $table->string('submission_url')->nullable();
            $table->enum('status', ['submitted', 'reviewing', 'approved', 'rejected'])->default('submitted');
            $table->text('feedback')->nullable();
            $table->integer('xp_earned')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('challenge_submissions');
        Schema::dropIfExists('challenges');
        Schema::dropIfExists('xp_logs');
        Schema::dropIfExists('course_progress');
        Schema::dropIfExists('lesson_progress');
        Schema::dropIfExists('user_skills');
        Schema::dropIfExists('skills');
        Schema::dropIfExists('user_badges');
        Schema::dropIfExists('badges');
    }
};
