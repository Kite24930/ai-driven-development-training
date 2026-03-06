<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'learner'])->default('learner')->after('email');
            $table->string('avatar')->nullable()->after('role');
            $table->integer('xp')->default(0)->after('avatar');
            $table->integer('level')->default(1)->after('xp');
            $table->integer('streak_days')->default(0)->after('level');
            $table->date('last_activity_date')->nullable()->after('streak_days');
            $table->string('title')->nullable()->after('last_activity_date');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'avatar', 'xp', 'level', 'streak_days', 'last_activity_date', 'title']);
        });
    }
};
