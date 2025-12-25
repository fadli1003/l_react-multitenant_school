import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { route } from 'ziggy-js';
import { Eye, PenBox, Trash2 } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import ModalKonfirmasi from '@/components/tambahan/confirm-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Enrollment',
        href: route('enrollment.index'),
    },
];
interface Enrollment {
        id: number;
        tenant_id: number;
        student_id: number;
        course_id: number;
        tenant?: Tenant;
        student?: Student;
        course?: Course;
        enrollment_date: string;
    }
interface Tenant {
    id: number;
    school_name: string;
}
interface Student {
    id: number;
    nama_lengkap: string;
}
interface Course {
    id: number;
    course_name: string;
}

interface FormState {
    id?: number
    tenant_id?: number
    student_id?: number
    course_id?: number
    name?: string
    enrollment_date?: string
}
const emptyForm: FormState = {
    id: undefined,
    tenant_id: undefined,
    student_id: undefined,
    course_id: undefined,
    enrollment_date: ''
}

export default function Index() {
    const { enrollments, students, courses, tenants } = usePage<{
        enrollments?: Enrollment[];
        students?: Student[];
        tenants?: Tenant[];
        courses?: Course[];
    }>().props;
    const enrollmentList = enrollments ?? [];

    const [open, setOpen] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isConfirm, setIsConfirm ] = useState(false);
    const form = useForm<FormState>(emptyForm)

    const normalizeDate = (date?: string) => {
        if(!date) return ''
        return date.split('T')[0].split(' ')[0]
    }
    const handleOpenAdd = () => {
        form.reset();
        setIsAdd(true);
        setIsEdit(false);
        setIsShow(false);
        setOpen(true);
    }

    const handleOpenEdit = (enrollment: Enrollment) => {
        form.setData({
            id: enrollment.id,
            tenant_id: enrollment.tenant_id,
            student_id: enrollment.student_id,
            course_id: enrollment.course_id,
            enrollment_date: normalizeDate(enrollment.enrollment_date),
        });
        setIsEdit(true);
        setOpen(true);
        setIsShow(false);
    }

    const handleOpenShow = (enrollment: Enrollment) => {
        form.setData({
            id: enrollment.id,
            tenant_id: enrollment.tenant_id,
            student_id: enrollment.student_id,
            course_id: enrollment.course_id,
            enrollment_date: normalizeDate(enrollment.enrollment_date),
        });
        setOpen(true);
        setIsShow(true);
        setIsAdd(false);
        setIsEdit(false);
    }

    const handleClose = () => {
        setOpen(false);
        form.reset();
        setIsEdit(false);
        setIsShow(false);
        setIsAdd(false);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && form.data.id) {
            form.put(route('enrollment.update', form.data.id), {
                onSuccess: () => (handleClose(), form.reset())
            });
        } else if (isAdd) {
            form.post(route('enrollment.store'), {
                onSuccess : () => (handleClose ())
            });
        }
    }


    function handelDelete(id: number) {
        setSelectedId(id);
        setIsConfirm(true)
    }
    function confirmDelete () {
        if (selectedId) {
            form.delete(route('enrollment.destroy', selectedId), {
                onSuccess: () => setSelectedId(null)
            })
        }
        setIsConfirm(false)
    }
    console.log(form.data)

    return (
        <AppLayout breadcrumbs={breadcrumbs} >
            <Head title="Enrollment" />
            <Card className='p-6 mt-6'>
                <div className='flex items-center justify-between mb-4'>
                    <Button onClick={handleOpenAdd} className='cursor-pointer'>Add enrollment</Button>
                </div>
                <div className="overflow-x-auto rounded-md">
                    <table className='tabel'>
                        <thead className='uppercase'>
                            <tr>
                                <th>id</th>
                                <th>tenant_id</th>
                                <th>student_id</th>
                                <th>course_id</th>
                                <th>enrollment_date</th>
                                <th>aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrollmentList.map((enrollment) => (
                                <tr key={enrollment.id} className='border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700'>
                                    <td>{enrollment.id}</td>
                                    <td>{enrollment.tenant?.school_name}</td>
                                    <td>{enrollment.student?.nama_lengkap}</td>
                                    <td>{enrollment.course?.course_name}</td>
                                    <td>{normalizeDate(enrollment.enrollment_date)}</td>
                                    <td>
                                        <div className='flex gap-3 items-center'>
                                            <Eye
                                                className='size-[32px] cursor-pointer bg-gray-300 dark:bg-gray-700 dark:text-gray-200 text-gray-800 p-1 rounded-sm'
                                                onClick={() => handleOpenShow(enrollment)}
                                            />
                                            <PenBox className='size-[32px] cursor-pointer bg-green-300 text-gray-800 p-1 rounded-sm' onClick={() => handleOpenEdit(enrollment)} />
                                            <Trash2 className='size-[32px] cursor-pointer bg-red-600 text-gray-800 p-1 rounded-sm' onClick={() => handelDelete(enrollment.id)} />
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
                        <DialogTitle className='text-center'>
                            {isEdit ? 'Update Enrollment' : isAdd ? 'Add Enrollment' : 'Enrollment Information'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div className='space-y-3 flex flex-col'>
                            <Label htmlFor='tenant_id'>School Name</Label>
                            <select
                                id='tenant_id'
                                name='tenant_id'
                                value={form.data.tenant_id}
                                onChange={(e) => form.setData('tenant_id', Number(e.target.value))}
                                disabled={isShow}
                                className='disabled:text-muted-foreground'
                            >
                                {!isEdit && <option value=''>Choose School</option>}
                                {tenants?.map((t, i) => (
                                    <option key={i} value={t.id}>{t.school_name}</option>
                                ))}
                            </select>
                            {form.errors.tenant_id && <div className='text-red-500 text-sm mt-1'>{form.errors.tenant_id}</div>}
                        </div>
                        <div className='space-y-3 flex flex-col'>
                            <Label htmlFor='student_id'>Student Name</Label>
                            <select
                                id='student_id'
                                name='student_id'
                                value={form.data.student_id}
                                onChange={(e) => form.setData('student_id', Number(e.target.value))}
                                disabled={isShow}
                                className='disabled:text-muted-foreground'
                            >
                                {!isEdit && <option value=''>Choose Student Name</option>}
                                {students?.map((student, i) => (
                                    <option key={i} value={student.id}>{student.nama_lengkap}</option>
                                ))}
                            </select>
                            {form.errors.student_id && <div className='text-red-500 text-sm mt-1'>{form.errors.student_id}</div>}
                        </div>
                        <div className='space-y-3 flex flex-col'>
                            <Label htmlFor='course_id'>Course Name</Label>
                            <select
                                id='course_id'
                                name='course_id'
                                value={form.data.course_id}
                                onChange={(e) => form.setData('course_id', Number(e.target.value))}
                                disabled={isShow}
                                className='disabled:text-muted-foreground'
                            >
                                {!isEdit && <option value=''>Choose Course Name</option>}
                                {courses?.map((course, i) => (
                                    <option key={i} value={course.id}>{course.course_name}</option>
                                ))}
                            </select>
                            {form.errors.course_id && <div className='text-red-500 text-sm mt-1'>{form.errors.course_id}</div>}
                        </div>
                        <div>
                            <Label htmlFor='enrollment_date'>Enrollment Date</Label>
                            <Input
                                id='enrollment_date'
                                name='enrollment_date'
                                type='date'
                                value={form.data.enrollment_date}
                                onChange={(e) => form.setData('enrollment_date', e.target.value)}
                                disabled={isShow}
                            />
                            {form.errors.enrollment_date && <div className='text-red-500 text-sm mt-1'>{form.errors.enrollment_date}</div>}
                        </div>
                        <div className="flex justify-end gap-3">
                            {!isShow &&
                                <Button
                                    type='submit'
                                    className='cursor-pointer'
                                    disabled={form.processing}
                                >
                                    {form.processing
                                        ? (<>
                                                {isEdit ? 'Updating...' : 'Saving...'}
                                                    <Spinner />
                                            </>)
                                        : isEdit ? 'Update' : 'Add'
                                    }
                                </Button>
                            }
                            <Button
                                type='button'
                                variant='outline'
                                onClick={handleClose}
                                className='cursor-pointer'
                            >{isShow ? 'Close' : 'Cancel'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
            <ModalKonfirmasi
                open={isConfirm}
                onConfirm={confirmDelete}
                onClose={() => setIsConfirm(false)}
            />
        </AppLayout>
    );
}
