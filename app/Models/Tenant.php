<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    protected $fillable = [
        'school_name',
        'address',
        'school_email',
    ];

    public function teachers()
    {
        return $this->hasMany(Teacher::class);
    }
    public function students()
    {
        return $this->hasMany(Student::class);
    }
    public function courses()
    {
        return $this->hasMany(Course::class);
    }
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
