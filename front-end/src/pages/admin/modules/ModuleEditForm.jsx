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

const ModuleFormSchema = z
    .object({
        name: z.string().min(8),
        description: z.string().min(1),
    })
export function ModuleEditForm({ isOpen, setIsOpen, data, modules, onUpdateData, }) {

    const form = useForm({
        resolver: zodResolver(ModuleFormSchema),
        defaultValues: data
    });

    const onSubmit = async (values) => {
        const updatingLoader = toast.loading('Updating in progress.')
        try {
            const response = await AdminApi.updateModule({ id: data.id, data: values })
            if (response.status == 200) {
                onUpdateData(modules.map(module => module.id == response.data.module.id ? response.data.module : module));
                toast.dismiss(updatingLoader)
                toast.success('Module Updated', {
                    description: response.data.message,
                })
                setIsOpen(false)
            }

        } catch ({ response }) {
            if (response.status == 422) {
                Object.entries(response.data.errors).forEach(([key, value]) => {
                    form.setError(key, {
                        message: value
                    })
                })
            };
            toast.dismiss(updatingLoader)
        }
    };
    return (
        <div className="grid grid-cols-2 gap-2">
            <Sheet open={isOpen} onOpenChange={() => setIsOpen(false)}>
                <SheetContent className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                        <SheetTitle>Edit Chapitre</SheetTitle>
                        <SheetDescription>
                            {/* Make changes to your profile here. Click save when you're done. */}
                        </SheetDescription>
                    </SheetHeader>
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
                                    onClick={() => setIsOpen(false)}
                                    disabled={form.formState.isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={form.formState.isSubmitting} >
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
