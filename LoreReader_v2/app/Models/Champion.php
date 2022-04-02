<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Champion extends Model
{
    use HasFactory;

    protected $fillable = ['name','title' , 'slug', 'release_date', 'url', 'image_url', 'location_id'];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function stories()
    {
        return $this->belongsToMany(Story::class)->withTimestamps();
    }
}

