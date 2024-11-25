import React, { useEffect } from 'react'
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
import { redirectToDashboard } from '../../routes';
import { toast } from 'sonner';
import { Label } from '../ui/label';
const formSchema = z.object({
    email: z.string().email({ message: 'Enter a valid email address' }),
    password: z.string().min(8).max(50),
});


export default function LoginForm() {
    const { login, token,setToken, setUser } = useUserContext()
    const navigate = useNavigate()
    const defaultValues = {
        email: '',
        password: '',
    };
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues
    });
    useEffect(()=>{
        if (token) {
            setToken()
        }
    },[])
    const { formState: { isSubmitting } } = form
    const onSubmit = async (values) => {
        try {
            const { data, status } = await login(values)
            setToken(data.token)
            setUser(data.data);
            if (status == 200) {
                navigate(redirectToDashboard(data.data.role))
                toast.success(data.message)
                window.dispatchEvent(new Event('storage'));
            }
        } catch ({ response }) {
            if (response.status == 422) {
                Object.entries(response.data.errors).forEach(([key, value]) => {
                    form.setError(key, {
                        message: value
                    })
                })
            }else{
                toast.error("Something went wrong")
            }
        }
    };

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-4"
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
                                        placeholder="example@email.com"
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                to="/forgot-password"
                                className="ml-auto inline-block text-sm underline"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
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
                    </div>


                    <Button disabled={isSubmitting} className="ml-auto w-full" type="submit">
                        {isSubmitting && <Loader className={'mx-2 my-2 animate-spin'} />} Sign In
                    </Button>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link to={'/register'} className="underline">
                            Sign up
                        </Link>
                    </div>
                </form>
            </Form>
        </>
    );
} 
