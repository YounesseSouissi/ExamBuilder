import React from 'react'
import { Button } from '../../components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '../../components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import FileUpload from '../../components/shared/fileupload';
import UserApi from '../../service/UserApi';
import { toast } from 'sonner';
import { useUserContext } from '../../context/UserContext';
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const maxFileSize = 1 * 1024 * 1024 * 1024;
const FormSchema = z
    .object({
        photo: z
            .custom()
            .refine((fileList) => fileList?.length === 1, 'Expected file')
            .transform((file) => file[0])
            .refine((file) => {
                return file?.size <= maxFileSize;
            }, `File size should be less than 1gb.`)
            .refine(
                (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
                'Only these types are allowed .jpg, .jpeg and .png'
            )
    })
export default function Photo({ setEditPhoto }) {
    const { user, setUser } = useUserContext();
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: { photo: '' }
    });
    const { formState: { isSubmitting } } = form
    const onSubmit = async (values) => {

        try {
            const formData = new FormData();
            formData.append('photo', values.photo);
            const response = await UserApi.updatePhoto(formData)
            if (response.status == 200) {
                setUser(response.data.user);
                toast.success(response.data.message)
                setEditPhoto(false)
            }
        } catch ({ response }) {
            if (response.status == 422) {
                Object.entries(response.data.errors).forEach(([key, value]) => {
                    form.setError(key, {
                        message: value
                    })
                })
            };
        }
    }

    return (
        <>
            <div className="rounded-sm border border-stroke bg-muted/30 shadow-default dark:border-strokedark ">
                <div
                    className="border-b border-stroke px-7 py-3 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Profile
                    </h3>
                </div>
                <div className="px-4 py-3 ">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="photo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload onChange={field.onChange} value={field.value} photo={user.photo} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center justify-end gap-2 pt-1 sm:space-x-0">
                                <Button variant='ghost' onClick={() => setEditPhoto(false)} >
                                    Cancel
                                </Button>
                                <Button type="submit " disabled={isSubmitting} >
                                    Save
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    )
};