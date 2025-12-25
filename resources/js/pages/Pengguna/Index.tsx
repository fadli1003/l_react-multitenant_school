import ModalKonfirmasi from '@/components/tambahan/confirm-modal';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Dialog, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { Eye, PenBox, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengguna',
        href: '/pengguna',
    },
];

interface Pengguna {
    id: number;
    name: string;
    email: string;
    pw: string;
}
const emptyForm = {name: '', email: '', pw: '' };
type FormState = typeof emptyForm & { id?: number };

export default function Index(
    // { pengguna }: { pengguna: Pengguna[] }
) {
    const { pengguna } = usePage<{ pengguna?: Pengguna[] }>().props;
    const penggunaList = pengguna ?? [];
    const [form, setForm] = useState<FormState>(emptyForm);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const [confirm, setConfirm] = useState(false);

    const handleOpenShow = (pengguna: Pengguna) => {
        setForm({
            id: pengguna.id,
            name: pengguna.name,
            email: pengguna.email,
            pw: pengguna.pw,
        });
        setOpen(true);
        setIsEdit(false);
        setIsShow(true);
    };
    const handleOpenEdit = (pengguna: Pengguna) => {
        setForm({
            id: pengguna.id,
            name: pengguna.name,
            email: pengguna.email,
            pw: pengguna.pw,
        });
        setOpen(true);
        setIsEdit(true);
        setIsShow(false);
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleClose = () => {
        setOpen(false);
        setForm(emptyForm);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && form.id) {
            router.put(route('pengguna.update', form.id), form, { onSuccess: handleClose });
            alert('Informasi berhasil diperbarui');
        } else {
            alert('Terjadi kesalahan saat update data, coba ulangi lagi!');
        }
        console.log(form)
    }

    function handelDelete(id: number) {
        setSelectedId(id)
        setConfirm(true)
    }
    const confirmDelete = () => {
    if (selectedId) {
        router.delete(route('pengguna.destroy', (selectedId)));
    }
        setConfirm(false)
    }

    const { props } = usePage();
    const { sukses } = props as { sukses?: string };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengguna" />
            <Card className="relative h-full overflow-hidden rounded-t-none border-t-0 p-6">
                <CardHeader className="mt-2 mb-4 flex flex-row justify-between px-0">
                    <h2 className="pt-2 text-xl font-semibold">
                        Tabel Pengguna
                    </h2>
                    <div className="">
                        {sukses && (
                            <div className="text-sm text-green-400">
                                {sukses}
                            </div>
                        )}
                    </div>
                    <Link href={route('pengguna.create')}>
                        <Button className="cursor-pointer">
                            <PlusCircle />
                            Tambah Pengguna
                        </Button>
                    </Link>
                </CardHeader>
                <div className="table-wrapper overflow-auto rounded-md border">
                    <table className="tabel sticky top-0">
                        <thead className="uppercase">
                            <tr>
                                <th>id</th>
                                <th>nama</th>
                                <th>email</th>
                                <th>alamat</th>
                                <th>status</th>
                                <th className="text-center">aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {penggunaList.map((pengguna, i) => (
                                <tr key={i}>
                                    <td>{pengguna.id}</td>
                                    <td>{pengguna.name}</td>
                                    <td>{pengguna.email}</td>
                                    <td>alamat</td>
                                    <td>role</td>
                                    <td>
                                        <div className="flex justify-center gap-3">
                                            <span
                                                className="cursor-pointer rounded-md p-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 hover:dark:bg-slate-700"
                                                onClick={() =>
                                                    handleOpenShow(pengguna)
                                                }
                                            >
                                                <Eye />
                                            </span>
                                            <span
                                                onClick={() => handleOpenEdit(pengguna)}
                                                className="cursor-pointer rounded-md bg-green-300 p-1 text-gray-800 duration-200 hover:bg-green-400"
                                            >
                                                <PenBox />
                                            </span>
                                            <span
                                                onClick={() =>
                                                    handelDelete(pengguna.id)
                                                }
                                                className="cursor-pointer rounded-md bg-red-600 p-1 text-gray-100 duration-200 hover:bg-red-700"
                                            >
                                                <Trash2 />
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent aria-describedby={undefined} className="absolute flex h-full w-full items-center justify-center backdrop-blur-[2px]" >
                        <div className="max-[768px] w-[400px] min-w-[300px] translate-y-[-50px] rounded-md border bg-background py-6 px-8">
                            <DialogHeader>
                                <DialogTitle className="text-center font-semibold">
                                   {isEdit ? 'Edit Informasi User' : 'Informasi User'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="mt-2 flex flex-col space-y-3">
                                    <Label htmlFor="name">Nama User</Label>
                                    <Input
                                        id="name"
                                        name="nama"
                                        value={form.name}
                                        onChange={handleChange}
                                        readOnly={isShow}
                                        required={isEdit}
                                        />
                                </div>
                                <div className="flex flex-col space-y-3">
                                    <Label htmlFor="email">Email User</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        readOnly={isShow}
                                        required={isEdit}
                                        />
                                </div>
                                {isEdit &&
                                    <div className="flex flex-col space-y-3">
                                        <Label htmlFor="pw">User Password</Label>
                                        <Input
                                            id="pw"
                                            name="pw"
                                            value={form.pw}
                                            onChange={handleChange}
                                            readOnly={isShow}
                                            required={isEdit}
                                        />
                                    </div>
                                }
                                <div className="flex justify-end gap-3">
                                    {isEdit && (<Button type='submit' className='cursor-pointer'>Update</Button>)}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleClose}
                                        className="cursor-pointer"
                                    >
                                       {isEdit ? 'Cancel' : 'Tutup'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>
            </Card>
            <ModalKonfirmasi open={confirm} onConfirm={confirmDelete} onClose={() => setConfirm(false)} />
        </AppLayout>
    );
}
