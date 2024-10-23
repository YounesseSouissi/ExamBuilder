import React from 'react'
import { Button } from '../ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useUserContext } from '../../context/UserContext';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
const formSchema = z.object({
    email: z.string().email({ message: 'Enter a valid email address' }),
});


export default function ForgotPasswordForm() {
    const { forgotPassword, } = useUserContext()
    const defaultValues = {
        email: '',
    };
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues
    });
    const { formState: { isSubmitting } } = form
    const onSubmit = async (values) => {
        try {
            const { data, status } = await forgotPassword(values)

            if (status == 200) {
                toast.success(data.status);
            }
        } catch ({ response }) {
            if (response.status == 422) {
                Object.entries(response.data.errors).forEach(([key, value]) => {
                    form.setError(key, {
                        message: value
                    })
                })
            }
        }
    };

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-2"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Enter your email..."
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button disabled={isSubmitting} className="ml-auto w-full" type="submit">
                        {isSubmitting && <Loader className={'mx-2 my-2 animate-spin'} />} Send Password Reset Link
                    </Button>
                </form>
            </Form>
        </>
    );
} 
