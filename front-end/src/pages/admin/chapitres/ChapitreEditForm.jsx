import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../../../components/ui/sheet"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '../../../components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AdminApi from '../../../service/AdminApi';
import { toast } from 'sonner';
import { Loader } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { useGetModules } from "../modules/queries/queries";
const ChapitreFormSchema = z
    .object({
        title: z.string().min(8),
        module_id:z.string().min(1, 'Please select an module to display')

    })

export function ChapitreEditForm({ isOpen, setIsOpen, data, chapitres, onUpdateData, }) {

    const form = useForm({
        resolver: zodResolver(ChapitreFormSchema),
        defaultValues: {
            title: data.title,
            module_id: data.module_id.toString()
        }
    });
    const onSubmit = async (values) => {
        const updatingLoader = toast.loading('Updating in progress.')
        try {
            const response = await AdminApi.updateChapitre({ id: data.id, data: values })
            if (response.status == 200) {
                onUpdateData(chapitres.map(chapitre => chapitre.id == response.data.chapitre.id ? response.data.chapitre : chapitre));
                toast.dismiss(updatingLoader)
                toast.success('Module Updated', {
                    description: response.data.message,
                })
                setIsOpen(false)
            }

        } catch ({response}) {
            if (response.status == 422) {
                Object.entries(response.data.errors).forEach(([key, value]) => {
                    form.setError(key, {
                        message: value
                    })
                })};
            toast.dismiss(updatingLoader)
            }
    };

    return (
        <div className="grid grid-cols-2 gap-2">
            <Sheet open={isOpen} onOpenChange={() => setIsOpen(false)}>
                <SheetContent className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                        <SheetTitle>Edit Module</SheetTitle>
                        <SheetDescription>
                            {/* Make changes to your profile here. Click save when you're done. */}
                        </SheetDescription>
                    </SheetHeader>
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a Module to display" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {useGetModules(null).data?.data.modules.map(module =>
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
                                    onClick={() => setIsOpen(false)}
                                    disabled={form.formState.isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit"disabled={form.formState.isSubmitting} >
                                    {form.formState.isSubmitting && <Loader className={'mx-2 animate-spin'} />}  Save
                                </Button>
                            </div>
                        </form>
                    </Form>
                </SheetContent>
            </Sheet>

        </div>
    )
}
