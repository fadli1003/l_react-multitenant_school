<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Tenant;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tenantId = Auth::user()->tenant_id;
        // $students = [];
        if(Auth::user()->role === 'super admin'){
            $students = Student::with(['tenant:id,school_name'])
                                ->get(['id', 'nama_lengkap', 'panggilan', 'grade', 'tenant_id']);
            $tenants = Tenant::get(['id', 'school_name']);
        } else {
            $students = Student::where('tenant_id', $tenantId)
                                    ->with(['tenant:id,school_name'])
                                    ->get(['id', 'nama_lengkap', 'panggilan', 'grade', 'tenant_id']);
            $tenants = Tenant::where('id', $tenantId)->get(['id', 'school_name']);
        }

        return inertia('Student/Index', [
            'tenants' => $tenants,
            'students' => $students
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
        $student = new Student();
        $request->validate([
            'nama_lengkap' => 'required|string|max:50|unique:students,nama_lengkap,'.!$student->tenant_id,
            'panggilan' => 'required|string|max:25',
            'grade' => 'required|string|max:50',
            'tenant_id' => 'required|numeric|exists:tenants,id',
        ]);
        $validated['tenant_id'] = Auth::user()->tenant_id;
        $student->nama_lengkap = $request->nama_lengkap;
        $student->panggilan = $request->panggilan;
        $student->grade = $request->grade;
        $student->tenant_id = $request->tenant_id;
        $student->save();
        // if(Validator::fails()){
        //     return back()->withErrors(['Terjadi kesalahan saat input data'])->withInput();
        // }

        return redirect()->route('student.index')->with('success', 'Student added successfully');
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
        $student = Student::findOrFail($id);
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:50|unique:students,nama_lengkap,'.$id,
            'panggilan' => 'required|string|max:25',
            'grade' => 'required|string|max:50',
            'tenant_id' => 'required|numeric|exists:tenants,id',
        ]);
        $validated['tenant_id'] = Auth::user()->tenant_id;
        $student->nama_lengkap = $request->nama_lengkap;
        $student->panggilan = $request->panggilan;
        $student->grade = $request->grade;
        $student->tenant_id = $request->tenant_id;
        $student->update();

        return session()->flash('success', 'Student data updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Student::findOrFail($id)->delete();
        return redirect()->route('student.index')->with('success', "Student's data deleted successfully.");
    }
}
