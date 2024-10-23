import React, { useEffect, useState } from 'react'
import ExamenForm from '../../../components/form/ExamenForm'
import AdminApi from '../../../service/AdminApi';
import { Modal } from '../../../components/ui/modal';
import { ScrollArea } from '../../../components/ui/scroll-area';
import Examen from '../../../components/shared/Examen';
import { generateAnswersPDF, generateQuestionsPDF } from '../../pdf/downloadPDFs';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { useGetModules } from '../modules/queries/queries';
import { useGetChapitresByModule } from '../questions/queries/queries';
import { useRouter } from '../../../routes/hooks/use-router';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog'
import { Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import PageHead from '../../../components/shared/page-head';

const ExamenFormSchema = z.object({
  title: z.string().min(1),
  filiere: z.string().min(1),
  niveau: z.string().min(1),
  duree: z.string().min(1)

});
export default function ExamenCreate() {
  const form = useForm({
    resolver: zodResolver(ExamenFormSchema),
    defaultValues: { title: '', filiere: '', niveau: '', duree: '' }
  });
  const router = useRouter()
  const [examen, setExamen] = useState([])
  const [chapitresIds, setChapitresIds] = useState([])
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ids, setIds] = useState([])
  const [modules, setModules] = useState([]);
  const [chapitres, setChapitres] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const [isDownload, setIsDownload] = useState(false);

  const onClose = () => {
    setIsOpen(false)
    setIds([])
  };
  const onChange = (open) => {
    if (!open) {
      setOpen(false);
    }
  }
  const { data } = useGetModules(null);

  useEffect(() => {
    if (data) {
      setModules(data.data.modules);
    }
  }, [data]);

  const response = useGetChapitresByModule(inputValue);

  useEffect(() => {
    if (response.data) {
      setChapitres(response.data.data.chapitres.map(chapitre => ({ label: chapitre.title, value: chapitre.id.toString() })));
    }
  }, [response.data]);

  const onSubmit = async (values) => {
    setChapitresIds(values.chapitres)
    return AdminApi.generateExam(values)
  };
  const handleUpdate = async () => {
    const idsExist = examen.map(q => q.question_id)
    try {
      if (ids.length > 0) {
        setIsLoading(true)
        await AdminApi.updateExam(ids, chapitresIds, idsExist)
        const { data } = await AdminApi.getExam()
        setExamen(data.examen)
        setIsLoading(false)
        toast.success('Examen Updated', {
          description: "Examen Updated successfuly",
        })
        setIds([])
      }
    } catch ({ response }) {
      toast.error(response.data.error)
      setIsLoading(false)
    }
  };
  const today = new Date();
  const yyyy = today.getFullYear();
  const previosYear = today.getFullYear() - 1;
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  const formattedToday = dd + '/' + mm + '/' + yyyy;
  const annee = previosYear + '-' + yyyy
  const module = modules.find(module => module.id === parseInt(inputValue))
  const download = async (values) => {
    setIsDownload(true)
    setTimeout(async () => {
      const data = { ...values, module: module.name, date: formattedToday, annee }
      try {
        setIsDownload(false)
        const examInfo = data
        const questionsData = examen
        const answersData = examen
        const questionsPDF = generateQuestionsPDF(questionsData, examInfo);
        const answersPDF = generateAnswersPDF(answersData, examInfo);
        await AdminApi.deleteExam()

        const questionsBlob = await pdf(questionsPDF).toBlob();
        saveAs(questionsBlob, 'Examen.pdf')

        const answersBlob = await pdf(answersPDF).toBlob();
        saveAs(answersBlob, 'Correction.pdf')

        toast.success('Examen Dowloaded', {
          description: "Examen Dowloaded successfuly",
        })
        setIsOpen(false)
        setExamen([])
        setIds([])
        router.reload()
        setIsDownload(false)
      } catch (error) {
        console.log(error);
        toast.error('Error downloading PDF', {
          description: "An error occurred while downloading the PDF",
        });
      }
    }, 3000);

  }
  const renderModal = (onClose, examen, ids, setIds, handleUpdate, isLoading, setOpen) => {
    return <Examen examen={examen} ids={ids} setIds={setIds}
      handleUpdate={handleUpdate}
      modalClose={onClose} isLoading={isLoading} setOpen={setOpen} />
  }
  useEffect(() => {
    if (examen.length > 0) {
      setIsOpen(true)
    }
  }, [examen])
  return (
    <div>
      <PageHead title="Exam Generate - ExamBuilder" />

      <ExamenForm Submit={onSubmit} modules={modules} chapitres={chapitres}
        setInputValue={setInputValue} response={response}
        setExamen={setExamen} />

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className={'!bg-background !px-1'}
      >
        <ScrollArea className="h-[80dvh] px-6  ">
          {renderModal(onClose, examen, ids, setIds, handleUpdate, isLoading, setOpen)}
        </ScrollArea>
      </Modal>
      <Dialog open={open} onOpenChange={onChange} >
        <DialogContent >
          <DialogHeader>
            <DialogTitle className='py-3 leading-6 text-center'>Exam Information</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(download)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Exam Title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="filiere"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Filière</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Filière"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="niveau"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niveau</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Level to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={'TS'}>{'TS'}</SelectItem>
                        <SelectItem value={'T'}>{'T'}</SelectItem>
                        <SelectItem value={'Q'}>{'Q'}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Durée"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-end gap-2 mt-10  sm:space-x-0">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isDownload}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button className="ml-auto " type="submit" disabled={isDownload}>
                  <Download className={`mr-2  ${isDownload && 'animate-pulse'}`} /> Download
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
