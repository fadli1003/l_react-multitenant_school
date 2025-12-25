<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Teacher;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Http\Responses\RedirectAsIntended;

class CourseController extends Controller
{
    public function index()
    {
        return inertia('Course/Index', [
            'tenants' => Tenant::get(['id', 'school_name']),
            'courses' => Course::with(['tenant:id,school_name', 'teacher:id,nama_lengkap'])->get(['id', 'tenant_id', 'teacher_id', 'course_name']),
            'teachers' => Teacher::get(['id', 'nama_lengkap']),
        ]);
    }

    public function create()
    {
        return inertia('Course/Create', [
            'tenants' => Tenant::get(['id', 'school_name']),
            'teachers' => Teacher::get(['id', 'nama_lengkap']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_name' => 'required|string|max:100',
            'tenant_id' => 'required|numeric|exists:tenants,id',
            'teacher_id' => 'required|numeric|exists:teachers,id',
        ]);
        Course::create($validated);
        // return redirect()->route('course.index')->with('success', 'Course added successfully');
        return redirect()->intended(route('course.index'))->with('success', 'Course added successfully');
    }

    public function show(string $id)
    {
        return inertia('Course/Show', [
            'courses' => Course::findOrFail($id)->with(['tenant:id,school_name', 'teacher:id,nama_lengkap']),
        ]);
    }

    public function edit(string $id)
    {
        return inertia('Course/Index', [
            'tenants' => Tenant::get(['id', 'school_name']),
            'teachers' => Teacher::get(['id', 'nama_lengkap']),
            'openEditModal' => 'true',
        ]);
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'tenant_id' => 'required|numeric|exists:tenants,id',
            'teacher_id' => 'required|numeric|exists:teachers,id',
            'course_name' => 'required|string|max:100',
        ]);
        $course = Course::findOrFail($id);
        $course->update($validated);

        // if($course->update->fail()){
        //     return session()->flash('error', 'Something wrong when updating course data, please try again.');
        // }
        return session()->flash('success', 'Course updated successfully.');
    }

    public function destroy(Request $request, string $id)
    {
        Course::findOrfail($id)->delete();
        return session()->flash('success', 'Course deleted successfully');
    }
}
