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
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
const formSchema = z.object({
    firstname: z.string().min(2, {
        message: "First name is required",
    }).max(50),
    lastname: z.string().min(2, {
        message: "Last name is required",
    }).max(50),
    email: z.string().email({ message: 'Enter a valid email address' }),
    password: z.string().min(8, { message: 'Password is required' }).max(50),
    password_confirmation: z
        .string()
        .min(8, { message: 'Confirm Password is required' }).max(50)

}).refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords must match',
    path: ['password_confirmation']
});
export default function RegisterForm() {
    const { register } = useUserContext()
    const navigate = useNavigate()
    const defaultValues = {
        firstname: '',
        lastname: '',
        email: '',
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
            const { data, status } = await register(values)
            if (status == 200) {
                navigate('/login')
                toast.success(data.message)
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
                    <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                        <FormField
                            control={form.control}
                            name="firstname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First name</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="First name"
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
                            name="lastname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last name</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Last name"
                                            disabled={isSubmitting}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Email"
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
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Password"
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
                    <Button disabled={isSubmitting} className="ml-auto w-full" type="submit">
                        {isSubmitting && <Loader className={'mx-2 my-2 animate-spin'} />}Create an account
                    </Button>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link to={'/login'} className="underline">
                            Sign in
                        </Link>
                    </div>
                </form>
            </Form>
        </>
    );
} 
