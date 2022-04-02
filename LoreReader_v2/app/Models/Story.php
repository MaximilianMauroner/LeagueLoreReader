<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Story extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'text_id', 'story', 'html_story', 'image_url'];

    public function type()
    {
        return $this->belongsTo(Type::class);
    }

    public function champions()
    {
        return $this->belongsToMany(Champion::class)->withTimestamps();
    }

    public function file()
    {
        return $this->hasOne(File::class);
    }
}
