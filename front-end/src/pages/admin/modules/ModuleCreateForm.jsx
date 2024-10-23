import Heading from '../../../components/shared/heading';
import { Button } from '../../../components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AdminApi from '../../../service/AdminApi';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
const ModuleFormSchema = z
    .object({
        name: z.string().min(8),
        description: z.string().min(1),
    })



const ModuleCreateForm = ({ modules, onUpdateData, modalClose }) => {
    const form = useForm({
        resolver: zodResolver(ModuleFormSchema),
        defaultValues: {
            name: '',
            description: ''
        }
    });

    const onSubmit = async (values) => {
        const creatingLoader = toast.loading('Creating in progress.')
        try {
            const response = await AdminApi.createModule(values);
            if (response.status == 200) {
                onUpdateData([response.data.module, ...modules]);
                toast.dismiss(creatingLoader)
                toast.success('Module Created', {
                    description: response.data.message,
                })
                modalClose()
            }

        } catch ({ response }) {
            if (response.status == 422) {
                Object.entries(response.data.errors).forEach(([key, value]) => {
                    form.setError(key, {
                        message: value
                    })
                })
            };
            toast.dismiss(creatingLoader)
        }
    };

    return (
        <div className="px-2">
            <Heading
                name={'Create New Module'}
                className="space-y-2 py-4 text-center"
            />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your description"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center justify-end gap-2 pt-2 sm:space-x-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={modalClose}
                            disabled={form.formState.isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.formState.isSubmitting} >
                            {form.formState.isSubmitting && <Loader className={'mx-2 animate-spin'} />}  Submit
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default ModuleCreateForm;