import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage} from '@inertiajs/react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Courses',
        href: route('course.index'),
    },
    {
        title: 'Create New Course',
        href: route('course.create'),
    },
];
interface Tenant {
    id: number
    school_name: string
}
interface Teacher {
    id: number
    nama_lengkap: string
}

export default function Create() {

    const { tenants, teachers } = usePage<{ tenants: Tenant[] ,teachers?: Teacher[]}>().props
    const {data, setData, errors, post, processing, reset } = useForm({
        id: '',
        course_name: '',
        tenant_id: '',
        teacher_id: '',
    })
    function submit(e: React.FormEvent){
        e.preventDefault();
        post(route('course.store'), {
            onSuccess: () => reset()
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create New Course" />
                <div className='py-3 px-5'>
                    <h2 className='font-semibold text-xl'>Create New Course</h2>
                </div>
                <div className='p-5 pt-0'>
                    <form onSubmit={submit} >
                        <div className='grid md:grid-cols-2 gap-x-5'>
                            <div className='mb-3 flex flex-col space-y-1'>
                                <label className='pl-1'>Course Name</label>
                                <input
                                type='text'
                                id='course_name'
                                name='course_name'
                                value={data.course_name}
                                onChange={(e) => setData('course_name', e.target.value)}
                                className='w-full py-1.5 px-3 rounded-md broder-border border-1 ring-0 focus:ring-0 focus:outline-1 focus:outline-gray-300 text-sm'
                                />
                                {errors.course_name && <div className='text-red-500 text-sm mt-1'>{errors.course_name}</div>}
                            </div>
                            <div className='mb-3 flex flex-col space-y-1'>
                                <label htmlFor='tenat_id' className='pl-1'>School Name</label>
                                <select
                                    id='tenant_id'
                                    name='tenant_id'
                                    value={data.tenant_id}
                                    onChange={(e) => setData('tenant_id', e.target.value)}
                                    className='w-full py-1.5 px-3 rounded-md broder-border bg-background border-1 ring-0 focus:ring-0 focus:outline-1 focus:outline-gray-300 text-sm'
                                >
                                    <option value=''>Choose School Name</option>
                                    {tenants?.map((tenant) => (
                                        <option key={tenant.id} value={String(tenant.id)}>{tenant.school_name}</option>
                                    ))}
                                </select>
                                {errors.tenant_id && <div className='text-red-500 text-sm mt-1'>{errors.tenant_id}</div>}
                            </div>
                            <div className='mb-3 flex flex-col space-y-1'>
                                <label className='pl-1'>Teacher's Name</label>
                                <select
                                    id='teacher_id'
                                    name='teacher_id'
                                    value={data.teacher_id}
                                    onChange={(e) => setData('teacher_id', e.target.value)}
                                    autoComplete='none'
                                    className='w-full py-1.5 px-3 rounded-md bg-background broder-border border-1 ring-0 focus:ring-0 focus:outline-1 focus:outline-gray-300 text-sm'
                                >
                                    <option value="">Choose Teacher's Name</option>
                                    {teachers?.map((teacher) => (
                                        <option key={teacher.id} value={String(teacher.id)}>{teacher.nama_lengkap}</option>
                                    ))}
                                </select>
                                {errors.teacher_id && <div className='text-red-500 text-sm mt-1'>{errors.teacher_id}</div>}
                            </div>
                        </div>
                        <Button className='cursor-pointer mt-2'>
                            {processing
                                ? (
                                    <>
                                        Saving...
                                        <Spinner/>
                                    </>
                                )
                                : 'Save'
                            }
                        </Button>
                    </form>
                </div>
        </AppLayout>
    );
}
