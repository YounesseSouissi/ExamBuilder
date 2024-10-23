import { Button } from '../../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from '../../ui/dropdown-menu';
import { CheckCircle, MoreHorizontal, Trash, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { AlertModal } from '../../shared/alert-modal';
import AdminApi from '../../../service/AdminApi';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog';
import { useUserContext } from '../../../context/UserContext';


export const CellActionQuestionNonConfirme = ({ questions, data, onUpdateData }) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { NumberQuestions,setNumberQuestions } = useUserContext()
    const onDelete = () => {
        const deletingLoader = toast.loading('Deleting in progress.')
        setLoading(true)
        AdminApi.deleteQuestion(data.id).then((response) => {
            if (response.status == 200) {
                setLoading(false)
                setNumberQuestions(NumberQuestions-1)
                onUpdateData(questions.filter(question => question.id !== data.id))
                toast.dismiss(deletingLoader)
                toast.success('Question deleted', {
                    description: response.data.message,
                    icon: <Trash2Icon />
                })
            }
        })
    };
    const onConfirm = () => {
        const confirmingLoader = toast.loading('Confirming in progress.')
        setLoading(true)
        AdminApi.confimeQuestion(data.id).then((response) => {
            if (response.status == 200) {
                setLoading(false)
                setNumberQuestions(NumberQuestions-1)
                onUpdateData(questions.filter(question => question.id !== data.id))
                toast.dismiss(confirmingLoader)
                toast.success('Question Confirmed', {
                    description: response.data.message,
                })
            }
        })    };
    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
                title={`Are you absolutely sure to delete ${data.question_text}?`}
            />
            <Dialog open={isOpen} onOpenChange={()=>setIsOpen(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='py-3 leading-6'>Are you absolutely sure to confirme the question {data.user_name} added?</DialogTitle>
                        <DialogDescription>Are you sure you want to continue?</DialogDescription>
                    </DialogHeader>
                    <div className="flex w-full items-center justify-end space-x-2 pt-6">
                        <Button disabled={loading} variant="outline" onClick={()=>setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button disabled={loading} className='bg-green-500 hover:bg-green-400' onClick={onConfirm}>
                            Confirme
                        </Button>
                    </div>                
                    </DialogContent>
            </Dialog>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem className='cursor-pointer'  onClick={() => setIsOpen(true)} >
                        <CheckCircle className="mr-2 h-4 w-4" /> Confirme
                    </DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer'  onClick={() => setOpen(true)} >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
