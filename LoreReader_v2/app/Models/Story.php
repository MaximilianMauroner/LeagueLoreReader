<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Story extends Model
{
    use HasFactory;

    protected $fillable = ['text_id', 'story'];

    public function type()
    {
        return $this->belongsTo(Type::class);
    }
    public function champions(){
        return $this->belongsToMany(Champion::class);
    }
    public function file(){
        return $this->hasOne(File::class);
    }
}
