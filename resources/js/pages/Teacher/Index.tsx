import ModalKonfirmasi from '@/components/tambahan/confirm-modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Eye, PenBox, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Teacher',
        href: route('teacher.index'),
    },
];
interface Tenant {
    id: number;
    school_name: string;
}
interface Teacher {
    id: number;
    tenant_id: string;
    nama_lengkap: string;
    panggilan: string;
    subject: string;
    tenant: Tenant | null;
}
interface FormErrors {
    nama_lengkap?: string;
    panggilan?: string;
    subject?: string;
    tenant_id?: string;
}
const emptyForm = {
    nama_lengkap: '',
    panggilan: '',
    subject: '',
    tenant_id: '',
};
type FormState = typeof emptyForm & { id?: number };

export default function Index() {
    const { teachers, tenants, errors } = usePage<{
        teachers?: Teacher[];
        tenants?: Tenant[];
        sukses?: string;
        errors?: FormErrors[];
    }>().props;
    const teacherList = teachers ?? [];

    // const [errors, setErrors] = useState<FormErrors>({});
    const [form, setForm] = useState<FormState>(emptyForm);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [open, setOpen] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const [confirm, setConfirm] = useState(false);

    const handleOpenAdd = () => {
        setForm(emptyForm);
        setIsEdit(false);
        setOpen(true);
        setIsAdd(true);
        setIsShow(false);
    };

    const handleOpenEdit = (teacher: Teacher) => {
        setForm({
            id: teacher.id,
            nama_lengkap: teacher.nama_lengkap,
            panggilan: teacher.panggilan,
            subject: teacher.subject,
            tenant_id: teacher.tenant_id,
        });
        setIsEdit(true);
        setOpen(true);
        setIsShow(false)
    };

    const handleShow = (teacher: Teacher) => {
        setForm({
            id: teacher.id,
            nama_lengkap: teacher.nama_lengkap,
            panggilan: teacher.panggilan,
            subject: teacher.subject,
            tenant_id: teacher.tenant_id,
        });
        setOpen(true);
        setIsShow(true);
        setIsAdd(false);
        setIsEdit(false);
    }
    const handleClose = () => {
        setOpen(false);
        setForm(emptyForm);
        setIsEdit(false);
        setIsShow(false);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        // Opsional: hapus error saat user mulai mengetik
        // if (errors[name as keyof FormErrors]) {
        //     setErrors({ ...errors, [name]: undefined });
        // }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && form.id) {
            router.put(route('teacher.update', form.id), form, {
                onSuccess: handleClose,
                preserveScroll : true //to make scroll position base on page before request run
            });
        } else {
            router.post(route('teacher.store'), form, {
                onSuccess: handleClose,
            });
        }
        // setErrors({}); // reset error
    };

    function handelDelete(id: number) {
        setSelectedId(id);
        setConfirm(true);
    }

    const confirmDelete = () => {
        if (selectedId) {
            router.delete(route('teacher.destroy', selectedId));
        }
        setConfirm(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teacher" />
            <Card className="h-full rounded-t-none border-t-0 py-5 px-7">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold max-sm:text-center">
                        Teachers List
                    </h2>
                    <Button onClick={handleOpenAdd} className="cursor-pointer">
                        <PlusCircle />
                        Add Teacher
                    </Button>
                </div>
                <div className="overflow-x-auto rounded-md">
                    <table className="tabel">
                        <thead className="uppercase">
                            <tr>
                                <th>id</th>
                                <th>Full name</th>
                                <th>nickname</th>
                                <th>subject</th>
                                <th>School name</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teacherList.map((teacher, i) => (
                                <tr
                                    key={i}
                                    className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700 capitalize"
                                >
                                    <td>{teacher.id}</td>
                                    <td>{teacher.nama_lengkap}</td>
                                    <td>{teacher.panggilan}</td>
                                    <td>{teacher.subject}</td>
                                    <td>{teacher.tenant?.school_name}</td>
                                    <td>
                                        <div className="flex items-center justify-center gap-3">
                                            <Eye
                                                className="size-8 cursor-pointer rounded-md bg-slate-200 p-1 hover:bg-slate-300 dark:bg-slate-800 hover:dark:bg-slate-700"
                                                onClick={() => handleShow(teacher)}
                                            />
                                            <PenBox
                                                className="size-8 cursor-pointer rounded-sm bg-green-300 p-1 text-gray-800 hover:bg-green-400"
                                                onClick={() =>
                                                    handleOpenEdit(teacher)
                                                }
                                            />
                                            <Trash2
                                                className="size-[32px] cursor-pointer rounded-sm bg-red-600 p-1 text-gray-100 hover:bg-red-700"
                                                onClick={() =>
                                                    handelDelete(teacher.id)
                                                }
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent aria-describedby={undefined}>
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? 'Update Teacher' : 'Add Teacher'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4.5">
                        <div className="mt-2 flex flex-col space-y-3">
                            <Label htmlFor="nama_lengkap">Nama lengkap</Label>
                            <Input
                                id="nama_lengkap"
                                name="nama_lengkap"
                                value={form.nama_lengkap}
                                onChange={handleChange}
                                className='capitalize'
                                disabled={isShow}
                            />
                            {errors.nama_lengkap && (
                                <div className="mt-1 text-sm text-red-500">
                                    {errors.nama_lengkap}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col space-y-3">
                            <Label htmlFor="panggilan">Nama panggilan</Label>
                            <Input
                                id="panggilan"
                                name="panggilan"
                                value={form.panggilan}
                                onChange={handleChange}
                                disabled={isShow}
                                className='capitalize'
                            />
                            {errors.panggilan && (
                                <div className="mt-1 text-sm text-red-500">
                                    {errors.panggilan}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col space-y-3">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                className='capitalize'
                                disabled={isShow}
                            />
                            {errors.subject && (
                                <div className="mt-1 text-sm text-red-500">
                                    {errors.subject}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col space-y-3">
                            <Label htmlFor="tenant_id">Nama Sekolah</Label>
                            <select
                                id="tenant_id"
                                name="tenant_id"
                                value={form.tenant_id}
                                onChange={handleChange}
                                disabled={isShow}
                                className="w-full cursor-pointer rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-1 dark:border-neutral-800 dark:bg-neutral-950 capitalize disabled:text-muted-foreground disabled:cursor-auto"
                            >
                                {!isEdit && <option value=''>--Choose School--</option>}
                                {tenants?.map((tenant) => (
                                    <option key={tenant.id} value={tenant.id}>
                                        {tenant.school_name}
                                    </option>
                                )) || null}
                            </select>
                            {errors.tenant_id && (
                                <div className="mt-1 text-sm text-red-500">
                                    {errors.tenant_id}
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-3">
                            {(isEdit || isAdd) && (
                                <Button type="submit" className="cursor-pointer">
                                    {isEdit ? 'Update' : 'Add'}
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                className="cursor-pointer"
                            >
                                {isShow ? 'Close' : 'Cancel'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
            <ModalKonfirmasi
                open={confirm}
                onConfirm={confirmDelete}
                onClose={() => setConfirm(false)}
            />
        </AppLayout>
    );
}
