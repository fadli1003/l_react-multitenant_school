import ModalKonfirmasi from '@/components/tambahan/confirm-modal';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import {
    Dialog,
    DialogHeader,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { Eye, Loader2, PenBox, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Student',
        href: route('student.index'),
    },
];

interface Tenant {
    id: number;
    school_name: string;
}
interface Student {
    id: number;
    nama_lengkap: string;
    panggilan: string;
    grade: string;
    tenant_id: string;
    tenant: Tenant | null;
}

const emptyForm = { nama_lengkap: '', panggilan: '', grade: '', tenant_id: '' };
type FormState = typeof emptyForm & { id?: number };

export default function Index() {
    const { students, tenants } = usePage<{
        students?: Student[];
        tenants?: Tenant[];
    }>().props;
    const studentsList = students ?? [];

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [open, setOpen] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const [confirm, setConfirm] = useState(false);

    const form = useForm<FormState>(emptyForm);

    const handleOpenAdd = () => {
        setOpen(true);
        setIsAdd(true);
        setIsEdit(false);
        setIsShow(false);
        form.setData(emptyForm);
    };
    const handleOpenShow = (student: Student) => {
        form.setData({
            id: student.id,
            nama_lengkap: student.nama_lengkap,
            panggilan: student.panggilan,
            grade: student.grade,
            tenant_id: student.tenant_id,
        });
        setOpen(true);
        setIsAdd(false);
        setIsEdit(false);
        setIsShow(true);
    };

    const handleOpenEdit = (student: Student) => {
        form.setData({
            id: student.id,
            nama_lengkap: student.nama_lengkap,
            panggilan: student.panggilan,
            grade: student.grade,
            tenant_id: student.tenant_id,
        });
        setOpen(true);
        setIsAdd(false);
        setIsEdit(true);
        setIsShow(false);
    };

    const handleClose = () => {
        setOpen(false);
        form.reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && form.data.id) {
            form.put(route('student.update', form.data.id),{
                onSuccess: handleClose
            });
        } else if (isAdd) {
            form.post(route('student.store'),{
                onSuccess: handleClose
            });
        }
    };

    const handleDelete = (id: number) => {
        setSelectedId(id);
        setConfirm(true);
    };

    const confirmDelete = () => {
        if (selectedId) {
            form.delete(route('student.destroy', selectedId));
        }
        setConfirm(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Students" />
            <Card className="relative h-full overflow-hidden rounded-t-none border-t-0 p-6">
                <CardHeader className="mt-2 mb-4 flex flex-row justify-between px-0">
                    <h2 className="pt-2 text-xl font-semibold">
                        Students Table
                    </h2>
                    <Button onClick={handleOpenAdd} className="cursor-pointer">
                        <PlusCircle />
                        Add Student
                    </Button>
                </CardHeader>
                <div className="table-wrapper overflow-auto rounded-md border">
                    <table className="tabel sticky top-0">
                        <thead className="uppercase">
                            <tr>
                                <th>ID</th>
                                <th>Full Name</th>
                                <th>Nickname</th>
                                <th>Grade</th>
                                <th>School name</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentsList.map((student) => (
                                <tr key={student.id}>
                                    <td>{student.id}</td>
                                    <td>{student.nama_lengkap}</td>
                                    <td>{student.panggilan}</td>
                                    <td>{student.grade}</td>
                                    <td>{student.tenant?.school_name}</td>
                                    <td>
                                        <div className="flex justify-center gap-3">
                                            <Eye
                                                size={30}
                                                onClick={() => handleOpenShow(student)}
                                                className="cursor-pointer rounded-md bg-slate-200 p-1 hover:bg-slate-300 dark:bg-slate-800 hover:dark:bg-slate-700 duration-200"
                                                />
                                            <PenBox
                                                size={30}
                                                onClick={() => handleOpenEdit(student)}
                                                className="cursor-pointer rounded-md bg-green-300 p-1 text-gray-800 duration-200 hover:bg-green-400"
                                                />
                                            <Trash2
                                                size={30}
                                                onClick={() => handleDelete(student.id)}
                                                className="cursor-pointer rounded-md bg-red-600 p-1 text-gray-100 duration-200 hover:bg-red-700"
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
                <DialogContent className="fixed inset-0 flex h-full w-full items-center justify-center backdrop-blur-[2px]">
                    <div className="w-[clamp(300px,400px,100%)] rounded-md border bg-background px-8 py-6">
                        <DialogHeader className="mb-5">
                            <DialogTitle className="text-center text-lg font-semibold">
                                {isAdd
                                    ? 'Add a new student data'
                                    : isEdit
                                      ? "Edit Student's Information"
                                      : isShow
                                        ? `Information of ${form.data.nama_lengkap || 'Unknown'}`
                                        : ''}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-5 form">
                            <div className="mt-2 flex flex-col space-y-3">
                                <Label htmlFor="nama_lengkap">
                                    Student's Full Name
                                </Label>
                                <Input
                                    id="nama_lengkap"
                                    name="nama_lengkap"
                                    value={form.data.nama_lengkap}
                                    onChange={(e) =>
                                        form.setData(
                                            'nama_lengkap',
                                            e.target.value,
                                        )
                                    }
                                    readOnly={isShow}
                                    disabled={isShow}
                                />
                                {form.errors.nama_lengkap && <div className='text-red-500 text-sm mt-1'>{form.errors.nama_lengkap}</div>}
                            </div>
                            <div className="flex flex-col space-y-3">
                                <Label htmlFor="panggilan">
                                    Student's Nickname
                                </Label>
                                <Input
                                    id="panggilan"
                                    name="panggilan"
                                    value={form.data.panggilan}
                                    onChange={(e) =>
                                        form.setData(
                                            'panggilan',
                                            e.target.value,
                                        )
                                    }
                                    readOnly={isShow}
                                    disabled={isShow}
                                />
                                {form.errors.panggilan && <div className='text-red-500 text-sm mt-1'>{form.errors.panggilan}</div>}
                            </div>
                            <div className="flex flex-col space-y-3">
                                <Label htmlFor="grade">Student's Grade</Label>
                                <Input
                                    id="grade"
                                    name="grade"
                                    value={form.data.grade}
                                    onChange={(e) =>
                                        form.setData('grade', e.target.value)
                                    }
                                    readOnly={isShow}
                                    disabled={isShow}
                                />
                                {form.errors.grade && <div className='text-red-500 text-sm mt-1'>{form.errors.grade}</div>}
                            </div>
                            <div className="flex flex-col space-y-3">
                                <Label htmlFor="tenant_id">School Name</Label>
                                <select
                                    name="tenant_id"
                                    id="tenant_id"
                                    value={form.data.tenant_id}
                                    onChange={(e) =>
                                        form.setData(
                                            'tenant_id',
                                            e.target.value,
                                        )
                                    }
                                    disabled={isShow}
                                    className="cursor-pointer rounded-md border border-neutral-800 px-3 py-2 text-sm focus:outline-0 accent-accent dark:bg-neutral-950"
                                    >
                                    {!isEdit && <option value="">Pilih sekolah</option>}
                                    {tenants?.map((tenant) => (
                                        <option
                                        className="text-sm"
                                        key={tenant.id}
                                        value={String(tenant.id)}
                                        >
                                            {tenant.school_name}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.tenant_id && <div className='text-red-500 text-sm mt-1'>{form.errors.tenant_id}</div>}
                            </div>
                            <div className="flex justify-end gap-3">
                                {(isEdit || isAdd)
                                    && (
                                        <Button
                                            type="submit"
                                            disabled={form.processing}
                                            className="cursor-pointer"
                                        >
                                            {form.processing
                                                ? isEdit
                                                ? 'Updating...'
                                                : 'Saving...'
                                                : isEdit
                                                ? 'Update'
                                                : 'Add'}
                                            {form.processing && (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            )}
                                        </Button>
                                    )}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                    disabled={form.processing}
                                    className="cursor-pointer"
                                >
                                    {isEdit ? 'Cancel' : 'Close'}
                                </Button>
                            </div>
                        </form>
                    </div>
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
