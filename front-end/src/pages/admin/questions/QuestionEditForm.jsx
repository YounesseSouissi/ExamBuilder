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
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader, PlusCircle, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { useGetModules } from '../modules/queries/queries';
import { useGetChapitresByModule, useGetModuleByChapitre } from './queries/queries';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../../../components/ui/sheet';
import AdminApi from '../../../service/AdminApi';
import { v4 as uuidv4 } from 'uuid';
import * as ScrollArea from '@radix-ui/react-scroll-area';

const QuestionFormSchema = z.object({
    question_text: z.string().min(8),
    difficulty: z.enum(['Facile', 'Moyen', 'Difficile']),
    chapitre_id: z.string().min(1, 'Please select at least one chapter'),
    reponses: z.array(
        z.object({
            id: z.string(),
            reponse_text: z.string().min(4),
            correcte: z.boolean().default(false).optional(),
        })
    ), // Au moins deux réponses
    type: z.enum(['single', 'multiple']), // Ajoutez le type de question
})
export function QuestionEditForm({ isOpen, setIsOpen, data, questions, onUpdateData }) {
    const [checkedIndex, setCheckedIndex] = useState(data.reponses.findIndex(response => response.correcte));
    const [type, setType] = useState(data.type)
    const [modules, setModules] = useState([])
    const [chapitres, setChapitres] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [reponsesError, setReponsesError] = useState('')
    const DifficultyOptions = ['Facile', 'Moyen', 'Difficile']
    const form = useForm({
        resolver: zodResolver(QuestionFormSchema),
        defaultValues: {
            question_text: data.question_text,
            difficulty: data.difficulty,
            chapitre_id: data.chapitre_id.toString(),
            reponses: data.reponses,
            type: data.type
        }
    });

    let { fields, prepend, remove } = useFieldArray({
        control: form.control,
        name: 'reponses',
    });
    const res = useGetModules(null)
    useEffect(() => {
        if (res.data) {
            setModules(res.data.data.modules)
        }
    }, [res.data])
    const resultat = useGetModuleByChapitre(data.chapitre_id)
    useEffect(() => {
        if (resultat.data) {
            setInputValue(resultat.data.data.module.id)
        }
    }, [resultat.data])

    const response = useGetChapitresByModule(inputValue)
    useEffect(() => {
        if (response.data) {
            setChapitres(response.data.data.chapitres)
        }
    }, [response.data])
    const handleAddFields = () => {
        prepend({ id: uuidv4(), reponse_text: '', correcte: false });
    };
    const handleDelete = (index) => {
        remove(index)
    }
    useEffect(() => {
        setReponsesError()
        form.setError('reponses', '')
    }, [fields])
    const handleChange = (value) => {
        setType(value);
        setCheckedIndex(null)
        setReponsesError()
        // Réinitialiser l'array fields avec un tableau vide
        form.reset({
            reponses: [],
            type: value
        });
        // Ajouter de nouveaux champs en fonction du type sélectionné
        if (value === 'single') {
            prepend({ id: uuidv4(), reponse_text: 'True', correcte: false });
            prepend({ id: uuidv4(), reponse_text: 'False', correcte: false });
        }
    };
    const handleRadioChange = (index) => {
        setCheckedIndex(index);
        setReponsesError()
        const updatedFields = fields.map((field, i) => ({
            ...field,
            correcte: i === index
        }));
        // Mettre à jour les valeurs des champs radio
        updatedFields.forEach((updatedField, i) => {
            form.setValue(`reponses[${i}].correcte`, updatedField.correcte);
        });
    };
    const onSubmit = async (values) => {
        const updatingLoader = toast.loading('Updating in progress.')
        try {
            const response = await AdminApi.updateQuestion({ id: data.id, data: values })
            if (response.status == 200) {
                onUpdateData(questions.map(question => question.id == response.data.question.id ? response.data.question : question));
                toast.dismiss(updatingLoader)
                toast.success('Question Updated', {
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
                    setReponsesError(key == 'reponses' && value);
                })
            };
            toast.dismiss(updatingLoader)
        }
    };
    return (
        <div className="grid grid-cols-3 gap-2">
            <Sheet open={isOpen} onOpenChange={() => setIsOpen(false)} >
                <SheetContent className="w-[400px] sm:w-[540px]  ">
                    <SheetHeader>
                        <SheetTitle>Edit Question</SheetTitle>
                        <SheetDescription>
                            {/* Make changes to your profile here. Click save when you're done. */}
                        </SheetDescription>
                    </SheetHeader>
                    <ScrollArea.Root className="h-[80vh] rounded overflow-hidden  ">
                        <ScrollArea.Viewport className="w-full h-full rounded">
                            <div className='relative '>
                                {(inputValue == '' || !chapitres.length > 0) &&
                                    <div className="absolute bg-background opacity-70  z-10 h-full w-full flex items-center justify-center">
                                        <div className="flex items-center">
                                            <Loader className="mx-2 my-2 size-10 animate-spin" />
                                        </div>
                                    </div>
                                }
                                <div className="py-[15px] pl-4 pr-1">
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="question_text"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Question</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Enter your question"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="difficulty"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Difficulty</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select a Difficulty to display" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {DifficultyOptions.map((opt, index) =>
                                                                    <SelectItem key={index} value={opt}>{opt}</SelectItem>
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
                                                name="module_id"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Module</FormLabel>
                                                        <Select onValueChange={(value) => { setInputValue(value); field.onChange(value) }} value={inputValue.toString()}>
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
                                                name="chapitre_id"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Chapitre</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value.toString()} disabled={response.isFetching} >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    {!response.isFetching ?
                                                                        <SelectValue placeholder="Select a Chapitre to display" />
                                                                        : <SelectValue placeholder="Chargement en cours..." />
                                                                    }
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent >
                                                                {chapitres.map(chapitre =>
                                                                    <SelectItem key={chapitre.id} value={chapitre.id.toString()}>{chapitre.title}</SelectItem>
                                                                )
                                                                }
                                                            </SelectContent>

                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className='flex justify-end mb-4'>
                                                <FormField
                                                    control={form.control}
                                                    name='type'
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-3">
                                                            <FormControl>
                                                                <RadioGroup defaultValue={field.value} onValueChange={(value) => { handleChange(value), field.onChange(value) }} className="flex">
                                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                                        <FormControl>
                                                                            <div className="flex items-center space-x-2">
                                                                                <RadioGroupItem value="multiple" id="multiple" />
                                                                                <Label htmlFor="multiple">Multiple</Label>
                                                                            </div>
                                                                        </FormControl>
                                                                    </FormItem>
                                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                                        <FormControl>
                                                                            <div className="flex items-center space-x-2">
                                                                                <RadioGroupItem value="single" id="single" />
                                                                                <Label htmlFor="single">Single</Label>
                                                                            </div>
                                                                        </FormControl>
                                                                    </FormItem>
                                                                </RadioGroup>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            {type == 'multiple' &&
                                                <div className='mt-4'>
                                                    <div className='flex justify-end'>
                                                        <PlusCircle className='me-3 cursor-pointer' onClick={handleAddFields} />
                                                    </div>
                                                    <div className="my-3">
                                                        {fields.map((field, index) => (
                                                            <div key={field.id} className="flex space-x-2 mx-2  mb-3">
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`reponses[${index}].id`}
                                                                    render={({ field }) => (
                                                                        <FormItem >
                                                                            <FormControl>
                                                                                <Input
                                                                                    placeholder="Enter your answer"
                                                                                    {...field}
                                                                                    type='hidden'
                                                                                />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`reponses[${index}].reponse_text`}  // Use dynamic field name with index
                                                                    render={({ field }) => (
                                                                        <FormItem className='basis-full'>
                                                                            <FormLabel>Reponse {index + 1}</FormLabel>
                                                                            <FormControl>
                                                                                <Input
                                                                                    placeholder="Enter your answer"
                                                                                    {...field}
                                                                                    className=" h-8  px-4 py-2 "
                                                                                />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`reponses[${index}].correcte`}
                                                                    render={({ field }) => (
                                                                        <FormItem className="basis-1/4">
                                                                            <FormLabel >Correcte</FormLabel>
                                                                            <FormControl>
                                                                                <Switch
                                                                                    checked={field.value}
                                                                                    onCheckedChange={field.onChange}
                                                                                />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                <div className='pt-7 '>
                                                                    <Trash2 className='text-red-500 size-7 cursor-pointer' onClick={() => handleDelete(index)} />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            }
                                            {type === 'single' && (
                                                <div className='flex gap-10  mx-2'>
                                                    {fields.map((value, index) => (
                                                        <div key={value.id} className='flex mt-4  items-center '>
                                                            <FormField
                                                                control={form.control}
                                                                name={`reponses[${index}].correcte`}
                                                                render={({ field }) => (
                                                                    <FormItem className="space-y-3">
                                                                        <FormControl>
                                                                            <RadioGroup
                                                                                defaultValue={field.value}
                                                                                checked={value.correcte}
                                                                            >
                                                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                                                    <FormControl>
                                                                                        <RadioGroupItem
                                                                                            checked={checkedIndex === index} // Utilisez checked au lieu de defaultValue
                                                                                            value={true}
                                                                                            id={index}
                                                                                            onClick={() => handleRadioChange(index)} // Ajoutez ceci
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormLabel className="font-normal">
                                                                                        {value.reponse_text}
                                                                                    </FormLabel>
                                                                                </FormItem>
                                                                            </RadioGroup>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {reponsesError && (
                                                <div className="text-red-500 text-sm ml-2">{reponsesError}</div>
                                            )}
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
                                </div>
                            </div>
                        </ScrollArea.Viewport>
                        <ScrollArea.Scrollbar
                            className="flex select-none touch-none p-0.5 bg-blackA3 transition-colors duration-[160ms] ease-out hover:bg-blackA5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
                            orientation="vertical"
                        >
                            <ScrollArea.Thumb className="flex-1 bg-mauve10 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
                        </ScrollArea.Scrollbar>
                        <ScrollArea.Scrollbar
                            className="flex select-none touch-none p-0.5 bg-blackA3 transition-colors duration-[160ms] ease-out hover:bg-blackA5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
                            orientation="horizontal"
                        >
                            <ScrollArea.Thumb className="flex-1 bg-mauve10 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
                        </ScrollArea.Scrollbar>
                        <ScrollArea.Corner className="bg-blackA5" />
                    </ScrollArea.Root>
                </SheetContent>
            </Sheet>
        </div>
    );
};
