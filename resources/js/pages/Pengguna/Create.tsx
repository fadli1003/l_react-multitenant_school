import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm} from '@inertiajs/react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengguna',
        href: route('pengguna.index'),
    },
    {
        title: 'Buat Pengguna',
        href: route('pengguna.create'),
    },
];

export default function Create() {

    const {data, setData, errors, post} = useForm({
        id: '',
        nama: '',
        email: '',
        pw: '',
    });
    function submit(e: React.FormEvent){
        e.preventDefault();
        post(route('pengguna.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Pengguna" />
                <div className='py-3 px-5'>
                    <h2 className='font-semibold text-xl'>Tambah pengguna</h2>
                </div>
                <div className='p-5 pt-0'>
                    <form onSubmit={submit} >
                        <div className='grid md:grid-cols-2 space-x-2'>
                            <div className='mb-3 flex flex-col space-y-1'>
                                <label className='pl-1'>Nama</label>
                                <input
                                type='text'
                                id='nama'
                                name='nama'
                                placeholder='Masukkan nama lengkap'
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                className='w-full py-1.5 px-3 rounded-md broder-border border-1 ring-0 focus:ring-0 focus:outline-1 focus:outline-gray-300'
                                />
                                {errors.nama && <div className='text-red-500 text-sm mt-1'>{errors.nama}</div>}
                            </div>
                            <div className='mb-3 flex flex-col space-y-1'>
                                <label className='pl-1'>Email</label>
                                <input type='email'
                                id='email'
                                name='email'
                                placeholder='Masukkan Email'
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className='w-full py-1.5 px-3 rounded-md broder-border border-1 ring-0 focus:ring-0 focus:outline-1 focus:outline-gray-300'
                                />
                                {errors.email && <div className='text-red-500 text-sm mt-1'>{errors.email}</div>}
                            </div>
                            <div className='mb-3 flex flex-col space-y-1'>
                                <label className='pl-1'>Password</label>
                                <input type='password' id='password' name='password'
                                placeholder='Masukkan password pengguna'
                                value={data.pw}
                                onChange={(e) => setData('pw', e.target.value)}
                                autoComplete='none'
                                className='w-full py-1.5 px-3 rounded-md broder-border border-1 ring-0 focus:ring-0 focus:outline-1 focus:outline-gray-300'
                                />
                                {errors.pw && <div className='text-red-500 text-sm mt-1'>{errors.pw}</div>}
                            </div>
                        </div>
                        <Button className='cursor-pointer mt-2'>Simpan</Button>
                    </form>
                </div>
        </AppLayout>
    );
}
