import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm} from '@inertiajs/react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tenant',
        href: route('tenant.index'),
    },
    {
        title: 'Create New Tenant',
        href: route('tenant.create'),
    },
];

export default function Create() {
    const {data, setData, errors, post, processing, reset } = useForm({
        id: '',
        school_name: '',
        address: '',
        school_email: '',
    })
    function submit(e: React.FormEvent){
        e.preventDefault();
        post(route('tenant.store'), {
            onSuccess: () => reset()
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Tenant" />
                <div className='py-3 px-5'>
                    <h2 className='font-semibold text-xl'>Create New Tenant</h2>
                </div>
                <div className='p-5 pt-0'>
                    <form onSubmit={submit} >
                        <div className='grid md:grid-cols-2 gap-x-5'>
                            <div className='mb-3 flex flex-col space-y-1'>
                                <label className='pl-1'>School Name</label>
                                <input
                                type='text'
                                id='school_name'
                                name='school_name'
                                value={data.school_name}
                                onChange={(e) => setData('school_name', e.target.value)}
                                className='w-full py-1.5 px-3 rounded-md broder-border border-1 ring-0 focus:ring-0 focus:outline-1 focus:outline-gray-300 text-sm'
                                />
                                {errors.school_name && <div className='text-red-500 text-sm mt-1'>{errors.school_name}</div>}
                            </div>
                            <div className='mb-3 flex flex-col space-y-1'>
                                <label className='pl-1'>Address</label>
                                <input
                                type='text'
                                id='address'
                                name='address'
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className='w-full py-1.5 px-3 rounded-md broder-border border-1 ring-0 focus:ring-0 focus:outline-1 focus:outline-gray-300 text-sm'
                                />
                                {errors.address && <div className='text-red-500 text-sm mt-1'>{errors.address}</div>}
                            </div>
                            <div className='mb-3 flex flex-col space-y-1'>
                                <label className='pl-1'>School Email</label>
                                <input
                                type='text'
                                id='school_email'
                                name='school_email'
                                value={data.school_email}
                                onChange={(e) => setData('school_email', e.target.value)}
                                className='w-full py-1.5 px-3 rounded-md broder-border border-1 ring-0 focus:ring-0 focus:outline-1 focus:outline-gray-300 text-sm'
                                />
                                {errors.school_email && <div className='text-red-500 text-sm mt-1'>{errors.school_email}</div>}
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
