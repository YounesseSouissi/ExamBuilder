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
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import AdminApi from '../../../service/AdminApi';
import { toast } from 'sonner';
import { Loader, PlusCircle, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { useGetModules } from '../modules/queries/queries';
import { useGetChapitresByModule } from './queries/queries';
const QuestionFormSchema = z.object({
    question_text: z.string().min(8),
    difficulty: z.enum(['Facile', 'Moyen', 'Difficile']),
    module_id: z.string().min(1, 'Please select an module to display'),
    chapitre_id: z.string().min(1, 'Please select at least one chapter'),
    reponses: z.array(
        z.object({
            reponse_text: z.string().min(4),
            correcte: z.boolean().optional(),
        })
    ),
    type: z.enum(['single', 'multiple'])
})
const QuestionCreateForm = ({ questions, onUpdateData, modalClose }) => {
    const defaultValues = {
        question_text: '',
        difficulty: '',
        module_id: '',
        chapitre_id: '',
        reponses: []
    }
    const [checkedIndex, setCheckedIndex] = useState();
    const DifficultyOptions = ['Facile', 'Moyen', 'Difficile']
    const form = useForm({
        resolver: zodResolver(QuestionFormSchema),
        defaultValues
    });
    const [type, setType] = useState('')
    const [reponsesError, setReponsesError] = useState('')
    let { fields, prepend, remove } = useFieldArray({
        control: form.control,
        name: 'reponses',
    });
    const [modules, setModules] = useState([])
    const [chapitres, setChapitres] = useState([])
    const [inputValue, setInputValue] = useState()
    const { data } = useGetModules(null)
    useEffect(() => {
        if (data) {
            setModules(data.data.modules)

        }
    }, [data])
    const response = useGetChapitresByModule(inputValue)
    useEffect(() => {
        if (response.data) {
            setChapitres(response.data.data.chapitres)
        }
    }, [response.data])
    const handleAddFields = () => {
        prepend({ reponse_text: '', correcte: false });
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
            question_text: form.getValues().question_text,
            difficulty: form.getValues().difficulty,
            chapitre_id: form.getValues().chapitre_id.toString(),
            module_id: form.getValues().module_id.toString(),
            reponses: [],
            type: value
        });
        // Ajouter de nouveaux champs en fonction du type sélectionné
        if (value === 'single') {
            console.log(value);

            prepend({ reponse_text: 'True', correcte: false });
            prepend({ reponse_text: 'False', correcte: false });
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
        const creatingLoader = toast.loading('Creating in progress.')
        try {
            const response = await AdminApi.createQuestion(values);
            if (response.status == 200) {
                onUpdateData([response.data.question, ...questions]);
                toast.dismiss(creatingLoader)
                toast.success('Question Created', {
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
                    setReponsesError(key == 'reponses' && value);
                })
            };
            toast.dismiss(creatingLoader)
        }
    };

    return (
        <div className="px-2 py-2">
            <Heading
                title={'Create New Question'}
                className="space-y-2 py-4 text-center"
            />
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
                                <Select onValueChange={(value) => { setInputValue(value); field.onChange(value) }} defaultValue={field.value}>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={response.isFetching} >
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
                                                    <FormLabel  >Correcte</FormLabel>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
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
                        <div className='flex gap-10 mx-2 '>
                            {fields.map((value, index) => (
                                <div key={value.id} className='flex mt-2  items-center '>
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
                    <div className="flex items-center justify-end gap-2 pt-2 sm:space-x-0 ">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={modalClose}
                            disabled={form.formState.isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <Loader className={'mx-2 animate-spin'} />}  Submit
                        </Button>
                    </div>
                </form>
            </Form>
        </div >
    );
};

export default QuestionCreateForm;
