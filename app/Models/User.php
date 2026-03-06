<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'avatar',
        'xp', 'level', 'streak_days', 'last_activity_date', 'title',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_activity_date' => 'date',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function badges(): BelongsToMany
    {
        return $this->belongsToMany(Badge::class, 'user_badges')->withPivot('earned_at');
    }

    public function lessonProgress(): HasMany
    {
        return $this->hasMany(LessonProgress::class);
    }

    public function courseProgress(): HasMany
    {
        return $this->hasMany(CourseProgress::class);
    }

    public function xpLogs(): HasMany
    {
        return $this->hasMany(XpLog::class);
    }

    public function challengeSubmissions(): HasMany
    {
        return $this->hasMany(ChallengeSubmission::class);
    }

    public function addXp(int $amount, string $sourceType, ?int $sourceId, string $description): void
    {
        $this->increment('xp', $amount);
        $this->xpLogs()->create([
            'amount' => $amount,
            'source_type' => $sourceType,
            'source_id' => $sourceId,
            'description' => $description,
        ]);

        $newLevel = $this->calculateLevel($this->xp);
        if ($newLevel > $this->level) {
            $this->update(['level' => $newLevel]);
        }
    }

    public function calculateLevel(int $xp): int
    {
        // Each level requires progressively more XP
        // Level 1: 0, Level 2: 100, Level 3: 250, Level 4: 450...
        $level = 1;
        $required = 0;
        $increment = 100;
        while ($xp >= $required + $increment) {
            $required += $increment;
            $level++;
            $increment = (int) ($increment * 1.2);
        }
        return $level;
    }

    public function xpForNextLevel(): int
    {
        $xp = 0;
        $increment = 100;
        for ($i = 1; $i < $this->level; $i++) {
            $xp += $increment;
            $increment = (int) ($increment * 1.2);
        }
        return $xp + $increment;
    }

    public function xpForCurrentLevel(): int
    {
        $xp = 0;
        $increment = 100;
        for ($i = 1; $i < $this->level; $i++) {
            $xp += $increment;
            $increment = (int) ($increment * 1.2);
        }
        return $xp;
    }
}
