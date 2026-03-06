<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Skill extends Model
{
    protected $fillable = [
        'name', 'slug', 'description', 'icon', 'category_id',
        'parent_skill_id', 'required_xp', 'sort_order',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Skill::class, 'parent_skill_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Skill::class, 'parent_skill_id')->with('children', 'category');
    }
}
