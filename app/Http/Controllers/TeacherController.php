<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function index()
    {
        return Inertia::render('Teacher/Index', [
            'teachers' => Teacher::with(['tenant:id,school_name'])
                                ->get(['id', 'nama_lengkap', 'panggilan', 'subject',  'tenant_id']),
            'tenants' => Tenant::get(['id', 'school_name']),
        ]);
    }

    public function create()
    {
        return inertia('Teacher/Create', [
            'tenants' => Tenant::get(['id', 'school_name']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_lengkap' => 'required|string|max:50|unique:teachers,nama_lengkap',
            'panggilan' => 'nullable|string|max:30',
            'tenant_id' => 'required|numeric|exists:tenants,id',
            'subject' => 'required|string|max:100'
        ]);
        $guru = new Teacher();
        $guru->nama_lengkap = $request->nama_lengkap;
        $guru->panggilan = $request->panggilan;
        $guru->subject = $request->subject;
        $guru->tenant_id = $request->tenant_id;
        $guru->save();

        $validator = Validator::make($request);
        if ($request->validated())

        return redirect()->route('teacher.index')->with('sukses', 'Teacher added succesfully.');
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
        $request->validate([
            'nama_lengkap' => 'required|string|max:50|unique:teachers,nama_lengkap,'.$id,
            'panggilan' => 'nullable|string|max:30',
            'tenant_id' => 'required|numeric|exists:tenants,id',
            'subject' => 'required|string|max:100'
        ]);
        $guru = Teacher::findOrFail($id);
        $guru->nama_lengkap = $request->nama_lengkap;
        $guru->panggilan = $request->panggilan;
        $guru->subject = $request->subject;
        $guru->tenant_id = $request->tenant_id;
        $guru->update();

        return redirect()->route('teacher.index')->with('sukses', 'Teacher added succesfully.');
    }

    public function destroy(string $id)
    {
        Teacher::find($id)->delete();
        return redirect()->route('teacher.index')->with('sukses', 'Teacher deleted succesfully.');
    }
}
