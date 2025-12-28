<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function index()
    {
        $tenantId = Auth::user()->tenant_id;
        if(Auth::user()->role === 'super admin'){
            $teachers = Teacher::with(['tenant:id,school_name'])
                                ->get(['id', 'nama_lengkap', 'panggilan', 'subject',  'tenant_id']);
            $tenants = Tenant::get(['id', 'school_name']);
        }else {
            $teachers = Teacher::where('tenant_id', $tenantId)
                                ->with(['tenant:id,school_name'])
                                ->get(['id', 'nama_lengkap', 'panggilan', 'subject',  'tenant_id']);
            $tenants = Tenant::where('id', $tenantId)->get(['id', 'school_name']);
        }
        return Inertia::render('Teacher/Index', [
            'teachers' => $teachers,
            'tenants' => $tenants,
        ]);
    }

    public function create()
    {
        if(Auth::user()->role === 'super admin'){
            $tenants = Tenant::get(['id', 'school_name']);
        }else {
            $tenants = Tenant::where('id', Auth::user()->tenant_id)
                                ->get(['id', 'school_name']);
        }
        return inertia('Teacher/Create', [
            'tenants' => $tenants
        ]);
    }

    public function store(Request $request)
    {
        $tenantId = Auth::user()->tenant_id;
        $guru = new Teacher();
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:50|unique:teachers,nama_lengkap,'.!$guru->tenant_id,
            'panggilan' => 'nullable|string|max:30',
            'tenant_id' => 'required|numeric|exists:tenants,id',
            'subject' => 'required|string|max:100'
        ]);
        $validated['tenant_id'] = $tenantId;
        $guru->nama_lengkap = $request->nama_lengkap;
        $guru->panggilan = $request->panggilan;
        $guru->subject = $request->subject;
        $guru->tenant_id = $request->tenant_id;
        $guru->save();

        // $validator = Validator::make($request);
        // if ($request->validated())

        return redirect()->route('teacher.index')->with('success', 'Teacher added succesfully.');
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
        $guru = Teacher::findOrFail($id);
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:50|unique:teachers,nama_lengkap,'.$id.',id,tenant_id,'.!$guru->tenant_id,
            'panggilan' => 'nullable|string|max:30',
            'tenant_id' => 'required|numeric|exists:tenants,id',
            'subject' => 'required|string|max:100'
        ]);
        if(!Auth::user()->role === 'super admin'){
            $validated['tenant_id'] = Auth::user()->tenant_id;
        }
        // $guru->nama_lengkap = $request->nama_lengkap;
        // $guru->panggilan = $request->panggilan;
        // $guru->subject = $request->subject;
        // $guru->tenant_id = $request->tenant_id;
        $guru->update($validated);

        return redirect()->route('teacher.index')->with('success', 'Teacher updated succesfully.');
    }

    public function destroy(string $id)
    {
        Teacher::find($id)->delete();
        return redirect()->route('teacher.index')->with('success', 'Teacher deleted succesfully.');
    }
}
