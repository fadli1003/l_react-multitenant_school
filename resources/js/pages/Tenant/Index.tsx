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
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import tenant from '@/routes/tenant';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Eye, PenBox, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tenant',
        href: tenant.index().url,
    },
];
interface Tenant {
    id: number;
    school_name: string;
    address: string;
    school_email: string;
}

const emptyForm = { school_name: '', address: '', school_email: '' };

type FormState = typeof emptyForm & { id?: number };

export default function Index() {
    const { tenants } = usePage<{ tenants?: Tenant[]}>().props;
    const tenantList = tenants ?? [];

    const [open, setOpen] = useState(false);
    const form = useForm<FormState>(emptyForm);
    const [isAdd, setIsAdd] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);


    const handleOpenAdd = () => {
        form.setData(emptyForm);
        setIsAdd(true);
        setIsEdit(false);
        setOpen(true);
    };

    // useEffect (() => {
    //     if (isOpen && isOpen === true){
    //         handleOpenAdd()
    //     }
    // })

    const handleOpenEdit = (tenant: Tenant) => {
        form.setData({
            id: tenant.id,
            school_name: tenant.school_name,
            address: tenant.address,
            school_email: tenant.school_email,
        });
        setOpen(true);
        setSelectedId(tenant.id);
        setIsEdit(true);
        setIsAdd(false);
        setIsShow(false);
    };

    const handleOpenShow = (tenant: Tenant) => {
        form.setData({
            id: tenant.id,
            school_name: tenant.school_name,
            address: tenant.address,
            school_email: tenant.school_email,
        });
        setOpen(true);
        setIsShow(true);
        setSelectedId(tenant.id);
        setIsAdd(false);
        setIsEdit(false);
    };

    const handleClose = () => {
        setOpen(false);
        form.setData(emptyForm);
        setIsEdit(false);
        setSelectedId(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && selectedId) {
            form.put(route('tenant.update', selectedId), {
                onSuccess: handleClose,
            });
        } else if(isAdd){
            form.post(route('tenant.store', form.data), {
                onSuccess: handleClose
            });
        }
    };

    function handelDelete(id: number) {
        setSelectedId(id)
        setConfirm(true)
    }
    function confirmDelete() {
        if (selectedId) {
            form.delete(route('tenant.destroy', selectedId))
        }
        setConfirm(false)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tenant" />
            <Card className="mt-6 p-6">
                <div className="mb-4 flex items-center justify-between">
                    <Button onClick={handleOpenAdd} className="cursor-pointer">
                        Add Tenant
                    </Button>
                </div>
                <div className="overflow-x-auto rounded-md">
                    <table className="tabel">
                        <thead className="uppercase">
                            <tr>
                                <th>id</th>
                                <th>school name</th>
                                <th>address</th>
                                <th>school_email</th>
                                <th>aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenantList.map((tenant) => (
                                <tr
                                    key={tenant.id}
                                    className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700"
                                >
                                    <td>{tenant.id}</td>
                                    <td>{tenant.school_name}</td>
                                    <td>{tenant.address}</td>
                                    <td>{tenant.school_email}</td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <Eye
                                                className="size-[32px] cursor-pointer rounded-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 hover:dark:bg-gray-700 p-1 text-gray-800 dark:text-gray-200"
                                                onClick={() =>
                                                    handleOpenShow(tenant)
                                                }
                                            />
                                            <PenBox
                                                className="size-[32px] cursor-pointer rounded-sm bg-green-300 p-1 text-gray-800"
                                                onClick={() =>
                                                    handleOpenEdit(tenant)
                                                }
                                            />
                                            <Trash2
                                                className="size-[32px] cursor-pointer rounded-sm bg-red-600 p-1 text-gray-800"
                                                onClick={() =>
                                                    handelDelete(tenant.id)
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? 'Update Tenant' : 'Add Tenant'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="mt-2 flex flex-col space-y-3">
                            <Label htmlFor="school_name">School Name</Label>
                            <Input
                                id="school_name"
                                name="school_name"
                                value={form.data.school_name}
                                onChange={(e) => form.setData('school_name', e.target.value)}
                                disabled={isShow}
                                />
                            {form.errors && <div className='text-sm text-red-500'>{form.errors.school_name}</div>}
                        </div>
                        <div className="flex flex-col space-y-3">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                name="address"
                                value={form.data.address}
                                onChange={(e) =>
                                    form.setData('address', e.target.value)
                                }
                                disabled={isShow}
                                />
                            {form.errors && <div className='text-sm text-red-500'>{form.errors.address}</div>}
                        </div>
                        <div className="flex flex-col space-y-3">
                            <Label htmlFor="school_email">School Email</Label>
                            <Input
                                id="school_email"
                                name="school_email"
                                value={form.data.school_email}
                                onChange={(e) =>
                                    form.setData('school_email', e.target.value)
                                }
                                disabled={isShow}
                            />
                            {form.errors && <div className='text-sm text-red-500'>{form.errors.school_email}</div>}
                        </div>
                        <div className="flex justify-end gap-3">
                            {(isEdit || isAdd) && (
                                <Button type="submit" className="cursor-pointer">
                                    {form.processing ?
                                        isEdit
                                            ? 'Updating...' : 'saving...'
                                        : isEdit ? 'Update' : 'Add'
                                    }
                                    {form.processing && <Spinner />}
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
            <ModalKonfirmasi open={confirm} onConfirm={confirmDelete} onClose={() => setConfirm(false)} />
        </AppLayout>
    );
}
