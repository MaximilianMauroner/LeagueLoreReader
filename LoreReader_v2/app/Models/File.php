<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    use HasFactory;

    protected $fillable = ['save_path', 'filename', 'story_id'];

    public function story()
    {
        return $this->hasOne(Story::class);
    }
}
