<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Http\Request;

class TenantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Tenant/Index', [
            'tenants' => Tenant::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // session()->flash('isOpen', true);
        // return redirect()->route('tenant.index')->with('tenants', Tenant::all());
        return inertia('Tenant/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'school_name' => 'required|string|max:100|unique:tenants,school_name',
            'address' => 'required|string|max:255',
            'school_email' => 'required|email|unique:tenants,school_email',
        ]);
        Tenant::create($validated);
        return session()->flash('success', 'Tenant added successfully.');
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
            'school_name' => 'required|string|max:100|unique:tenants,school_name,{$id}',
            'address' => 'required|string|max:255',
            'school_email' => 'required|email|unique:tenants,school_email,{$id}',
        ]);
        Tenant::findOrFail($id)->update();
        return session()->flash('success', 'Tenant edited successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Tenant::findOrFail($id)->delete();
        return session()->flash('success', 'Tenant deleted successfully.');
    }
}
