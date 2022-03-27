<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;


    protected $fillable = ['title', 'slug', 'description', 'url', 'image_url'];

    public function champions()
    {
        return $this->hasMany(Champion::class);
    }
}
