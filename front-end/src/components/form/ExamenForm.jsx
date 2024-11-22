import React, { useState } from 'react';
import Heading from '../shared/heading';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { MultipleSelector } from '../ui/multiple-selector';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Loader } from 'lucide-react';

const ExamenFormSchema = z.object({
    module: z.string().min(1, 'Please select a module'),
    chapitres: z.array(z.string()).min(1, 'Please select at least one chapter'),
    facile: z.coerce.number().min(0),
    moyen: z.coerce.number().min(0),
    difficile: z.coerce.number().min(0),
});

export default function ExamenForm({ Submit, modules, chapitres, setInputValue, setExamen, response }) {
    const form = useForm({
        resolver: zodResolver(ExamenFormSchema),
        defaultValues: { module: '', chapitres: [], facile: 0, moyen: 0, difficile: 0 }
    });
    const [isLoading, setIsLoading] = useState(false);
    const onSubmit = async (values) => {
        try {
            setIsLoading(true)
            const response = await Submit(values)
            if (response.status == 200) {
                setExamen(response.data.examen);
                setIsLoading(false)
            }

        } catch ({ response }) {
            setIsLoading(false)
            Object.entries(response.data.errors).forEach(([key, value]) => {
                form.setError(key, {
                    message: value
                })
            })
        }
    };
    return (
        <div className="p-5  md:w-2/4 sm:w-full mx-auto">
            <Heading
                title={'Generate New Exam'}
                className="space-y-2 py-4 text-center"
            />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="module"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Module</FormLabel>
                                <Select onValueChange={(value) => { setInputValue(value), field.onChange(value) }} defaultValue={field.value.toString()}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a Module to display" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {modules.map(module =>
                                            <SelectItem key={module.id} value={module.id.toString()}>{module.name}</SelectItem>
                                        )
                                        }
                                    </SelectContent>

                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="chapitres"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Chapitre</FormLabel>
                                {(chapitres.length > 0 && !response.isFetching) &&
                                    <MultipleSelector
                                        defaultOptions={chapitres}
                                        options={chapitres}
                                        placeholder={"Select chapitre you like..."}
                                        hidePlaceholderWhenSelected={true}
                                        onChange={field.onChange}
                                        emptyIndicator={
                                            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                                no results found.
                                            </p>
                                        }
                                    />
                                }
                                {(!chapitres.length > 0 || response.isFetching) &&
                                    <MultipleSelector
                                        disabled={response.isFetching}
                                        placeholder={response.isFetching ? "Chargement en cours..." : "Select chapitre you like..."}
                                        onChange={field.onChange}
                                        emptyIndicator={
                                            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                                no results found.
                                            </p>
                                        }
                                    />
                                }
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div>
                        <Label> Questions Number</Label>
                        <div className="grid grid-cols-3 gap-x-2 gap-y-4">
                            <FormField
                                control={form.control}
                                name="facile"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Facile</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter your facile..."
                                                {...field}
                                                min={0}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="moyen"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Moyen</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter your moyen..."
                                                {...field}
                                                min={0}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="difficile"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Difficile</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter your difficile.."
                                                {...field}
                                                min={0}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <Button disabled={isLoading} className="ml-auto " type="submit">
                        {isLoading ?
                            <>
                                <Loader className={'mx-2 my-2 animate-spin'} /> Generating...
                            </>
                            : <>Generate</>
                        }
                    </Button>
                </form>
            </Form>
        </div>
    );
}
