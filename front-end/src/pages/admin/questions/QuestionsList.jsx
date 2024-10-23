import { DataTableSkeleton } from '../../../components/shared/data-table-skeleton';
import { DataTable } from '../../../components/data-table/DataTable';
import { CellActionQuestion } from '../../../components/data-table/question/CellActionQuestion';
import { DataTableColumnHeader } from '../../../components/data-table/DataTableColumnHeader';
import { useEffect, useState } from 'react';
import { useGetChapitresByModule, useGetQuestions } from './queries/queries';
import { useSearchParams } from 'react-router-dom';
import PopupModal from '../../../components/shared/popup-modal';
import QuestionCreateForm from './QuestionCreateForm';
import { Badge } from '../../../components/ui/badge';
import { CircleCheckBigIcon, CircleXIcon } from 'lucide-react';
import { TableFilter } from '../../../components/shared/table-filter';
import { useGetModulesFiltre } from '../modules/queries/queries';
import PageHead from '../../../components/shared/page-head';

export default function QuestionsList() {
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState([])
  const [modules, setModules] = useState([])
  const [chapitres, setChapitres] = useState([])
  const [chapitresSelect, setChapitresSelect] = useState([])
  const search = searchParams.get('search') || null;
  const module = searchParams.get('module') || null;
  const { data, isLoading } = useGetQuestions(search, module, JSON.stringify(chapitresSelect));
  useEffect(() => {
    if (data) {
      setQuestions(data.data.questions)
    }

  }, [data])
  const response = useGetModulesFiltre()
  useEffect(() => {
    if (response.data) {
      setModules(response.data.data.modules.map(module => ({ label: module.name, value: module.id })));
    }
  }, [response.data]);
  const result = useGetChapitresByModule(module);

  useEffect(() => {
    if (result.data) {
      setChapitres(result.data.data.chapitres.map(chapitre => ({ label: chapitre.title, value: chapitre.id.toString() })));
    }
  }, [result.data]);
  const onUpdateData = (data) => {
    setQuestions(data);
  }
  const QuestionsColumns = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="ID" />
      },
    },
    {
      accessorKey: "question_text",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Question Text" />
      },
    },
    {
      accessorKey: "difficulty",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Difficulty" />
      },
      cell: ({ row }) => {
        const difficulty = row.original.difficulty
        return (
          <>
            {
              difficulty === "Facile" ? (
                <Badge className="bg-green-500 hover:bg-green-400">{difficulty}</Badge>
              ) : difficulty === "Moyen" ? (
                <Badge className="bg-orange-500 hover:bg-orange-400">{difficulty}</Badge>

              ) : (
                <Badge className="bg-red-500 hover:bg-red-400">{difficulty}</Badge>
              )
            }
          </>
        )
      },
    },
    {
      accessorKey: "confirme",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Confirme" />
      },
      cell: ({ row }) => {
        const confirme = row.original.confirme
        return (
          <>
            {
              confirme ? <CircleCheckBigIcon className='text-green-500' /> : <CircleXIcon className='text-red-500' />
            }
          </>
        )
      }
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Created at" />

      },
    },
    {
      accessorKey: "updated_at",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Updated at" />
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => <CellActionQuestion onUpdateData={onUpdateData} questions={questions} data={row.original} />
    }


  ]
  if (isLoading) {
    return (
      <div className="p-5">
        <DataTableSkeleton
          columnCount={10}
          filterableColumnCount={0}
          searchableColumnCount={1}
          showAddNew={true}
        />
      </div>
    );
  }
  return (
    <div className="p-5">
      <PageHead title="Question Management - ExamBuilder" />
      <TableFilter modules={modules} chapitres={chapitres} setChapitres={setChapitres} result={result} chapitresSelect={chapitresSelect} setChapitresSelect={setChapitresSelect} />
      <DataTable columns={QuestionsColumns}
        data={questions} placeholder={'Search Question Here'} >
        <PopupModal
          renderModal={(onClose) => <QuestionCreateForm questions={questions} onUpdateData={onUpdateData} modalClose={onClose} />}
        />
      </DataTable>
    </div>
  );
}