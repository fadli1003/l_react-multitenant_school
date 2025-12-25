<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    // public $timestamps = false; //making the timestamps not auto increments
    protected $fillable = [
        'course_name',
        'tenant_id',
        'teacher_id',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
}
