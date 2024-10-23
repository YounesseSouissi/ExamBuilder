import { Button } from '../../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from '../../ui/dropdown-menu';
import { Edit, MoreHorizontal, Trash, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { AlertModal } from '../../shared/alert-modal';
import AdminApi from '../../../service/AdminApi';
import { toast } from 'sonner';
import { ModuleEditForm } from '../../../pages/admin/modules/ModuleEditForm';


export const CellActionModule = ({modules, data, onUpdateData }) => {
    const [loading,setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const onConfirm = () => {
        const deletingLoader = toast.loading('Deleting in progress.')
        setLoading(true)
        AdminApi.deleteModule(data.id).then((response) => {
            if (response.status == 200) {
                setLoading(false)
                onUpdateData(modules.filter(module=>module.id!==data.id))
                toast.dismiss(deletingLoader)
                toast.success('Module deleted', {
                    description: response.data.message,
                    icon: <Trash2Icon />
                })
            }
        })
    };
    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onConfirm}
                loading={loading}
                title={`Are you absolutely sure to delete ${data.title}?`}
            />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem className='cursor-pointer' onClick={() =>setIsOpen(true) }>
                        <Edit className="mr-2 h-4 w-4 " /> Update
                    </DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer' onClick={() => setOpen(true)} >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <ModuleEditForm isOpen={isOpen} setIsOpen={setIsOpen} data={data} modules={modules} onUpdateData={onUpdateData}/>
        </>
    );
};
