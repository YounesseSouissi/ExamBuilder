import React from 'react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../../components/ui/button';
import UserApi from '../../service/UserApi';
import { toast } from 'sonner';
const formSchema = z.object({
    current_password: z.string().min(8, { message: 'Password is required' }).max(50),
    password: z.string().min(8, { message: 'Password is required' }).max(50),
    password_confirmation: z
        .string()
        .min(8, { message: 'Confirm Password is required' }).max(50)

}).refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords must match',
    path: ['password_confirmation']
});
export default function Password() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {}
    });
    const { formState: { isSubmitting } } = form

    const onSubmit = async (values) => {
        try {
            const response = await UserApi.updatePassword(values)
            if (response.status == 200) {
                form.setValue('password', '')
                form.setValue('password_confirmation', '')
                form.setValue('current_password', '')
                toast.success(response.data.message)
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
            <div>
                <h3 className="font-sm text-muted-foreground mb-2">
                    Change Password
                </h3>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-2"
                    >

                        <FormField
                            control={form.control}
                            name="current_password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Current Password"
                                            disabled={isSubmitting}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="New Password"
                                            disabled={isSubmitting}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password_confirmation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password Confirmation</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Password Confirmation"
                                            disabled={isSubmitting}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center justify-end gap-2 pt-2 sm:space-x-0">
                            <Button type="submit " disabled={isSubmitting} >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    )
}
