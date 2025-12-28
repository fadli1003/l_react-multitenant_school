import { usePage } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Flash {
    message: string;
    error: string;
    success: string;
}

export const FlashMessage = () => {
    const { errors } = usePage<{ errors?: string }>().props;
    const { flash } = usePage<{ flash: Flash }>().props;
    const [isInvisible, setIsInvisible] = useState(false);

    useEffect(() => {
        if (flash.message || flash.error || flash.success) {
            setIsInvisible(true);
            const timer = setTimeout(() => {
                setIsInvisible(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash.message, flash.error, flash.success, errors]);

    if (!isInvisible) return null;

    return (
        <div
            className={`fixed top-5 right-6 z-100 min-w-fit ${flash.error ? 'text-red-500' : flash.success ? 'text-green-500' : 'text-gray-800 dark:text-gray-300'}`}
        >
            <span className="text-sm dark:bg-white-200/20 relative mb-0.5 rounded-md bg-black/10 px-3 py-1.5 dark:bg-white/10">
                {flash.message || flash.error || flash.success}
                <X
                    size={16}
                    onClick={() => setIsInvisible(false)}
                    className="absolute -top-2 -right-2 rounded-sm border border-gray-400 bg-gray-200 p-0.5 dark:bg-gray-700 cursor-pointer"
                />
            </span>
            {/* {errors
                ? (
                    <span>{errors}</span>
                ) : (
                    <span>{errors}</span>
                )
            } */}
        </div>
    );
};
