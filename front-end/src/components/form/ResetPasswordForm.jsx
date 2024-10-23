import React, { useEffect, useState } from 'react'
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
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
const formSchema = z.object({
    password: z.string().min(8).max(50),
    password_confirmation: z.string().min(8).max(50),
});


export default function ResetPassword() {
    const { resetPassword } = useUserContext()
    const [email, setEmail] = useState('')
    const navigate = useNavigate()
    const [serchParams] = useSearchParams()
    const { token } = useParams()
    useEffect(() => {
        setEmail(serchParams.get('email'))
    }, [])
    const defaultValues = {
        password: '',
        password_confirmation: '',
    };
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues
    });
    const { formState: { isSubmitting } } = form
    const onSubmit = async (values) => {
        try {
            const { data, status } = await resetPassword({ email, token, ...values })
            if (status == 200) {
                navigate('/login')
                toast.success(data.status)
            }
        } catch ({ response }) {
            if (response.status == 422) {
                Object.entries(response.data.errors).forEach(([key, value]) => {
                    form.setError(key, {
                        message: value
                    })
                    toast.error(key == 'email' && value)
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
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Enter your password..."
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
                                        placeholder="Enter your password confirmation..."
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button disabled={isSubmitting} className="ml-auto w-full" type="submit">
                        {isSubmitting && <Loader className={'mx-2 my-2 animate-spin'} />} Reset Password
                    </Button>
                </form>
            </Form>
        </>
    );
} 
