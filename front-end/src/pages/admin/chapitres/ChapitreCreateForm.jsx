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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { useGetModules } from '../modules/queries/queries';
const ChapitreFormSchema = z
    .object({
        title: z.string().min(8),
        module_id:z.string().min(1, 'Please select an module to display')
    })



const ChapitreCreateForm = ({ chapitres, onUpdateData, modalClose }) => {
    const form = useForm({
        resolver: zodResolver(ChapitreFormSchema),
        defaultValues: {
            title: '',
            module_id: '',
        }
    });
    const { data } = useGetModules(null);
    const onSubmit = async (values) => {
        const creatingLoader = toast.loading('Creating in progress.')
        try {
            const response = await AdminApi.createChapitre(values);
            if (response.status == 200) {
                onUpdateData([response.data.chapitre, ...chapitres]);
                toast.dismiss(creatingLoader)
                toast.success('Chapitre Created', {
                    description: response.data.message,
                })
                modalClose()
            }

        } catch ({response}) {
            if (response.status == 422) {
                Object.entries(response.data.errors).forEach(([key, value]) => {
                    form.setError(key, {
                        message: value
                    })
                })};
            toast.dismiss(creatingLoader)
            }
    };
    return (
        <div className="px-2">
            <Heading
                title={'Create New Chapitre'}
                className="space-y-2 py-4 text-center"
            />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your title"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="module_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Module</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a Module to display" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {data?.data.modules.map(module =>
                                            <SelectItem key={module.id} value={module.id.toString()}>{module.name}</SelectItem>
                                        )
                                        }
                                    </SelectContent>

                                </Select>
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

export default ChapitreCreateForm;
