<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Student;
use App\Models\Tenant;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Enrollment/Index', [
            'enrollments' => Enrollment::with(['tenant:id,school_name', 'student:id,nama_lengkap', 'course:id,course_name'])->get(),
            'tenants' => Tenant::get(['id', 'school_name']),
            'students' => Student::get(['id', 'nama_lengkap']),
            'courses' => Course::get(['id', 'course_name']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validate = $request->validate([
            'tenant_id' => 'required|numeric|exists:tenants,id',
            'student_id' => 'required|numeric|exists:students,id',
            'course_id' => 'required|numeric|exists:courses,id',
            'enrollment_date' => 'date'
        ]);
        Enrollment::create($validate);
        return session()->flash('success', 'Enrollment added succesfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validate = $request->validate([
            'tenant_id' => 'required|numeric|exists:tenants,id',
            'student_id' => 'required|numeric|exists:students,id',
            'course_id' => 'required|numeric|exists:courses,id',
            'enrollment_date' => 'date'
        ]);
        Enrollment::find($id)->update($validate);
        return session()->flash('success', 'Enrollment updated succesfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
