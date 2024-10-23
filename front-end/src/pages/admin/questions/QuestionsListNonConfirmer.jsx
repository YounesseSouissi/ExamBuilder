import { DataTableSkeleton } from '../../../components/shared/data-table-skeleton';
import { DataTable } from '../../../components/data-table/DataTable';
import { CellActionQuestionNonConfirme } from '../../../components/data-table/question/CellActionQuestionNonConfirme';
import { DataTableColumnHeader } from '../../../components/data-table/DataTableColumnHeader';
import { useEffect, useState } from 'react';
import { useGetQuestionsNonConfirme } from './queries/queries';
import { useSearchParams } from 'react-router-dom';
import { Badge } from '../../../components/ui/badge';
import { CircleCheckBigIcon, CircleXIcon } from 'lucide-react';
import PageHead from '../../../components/shared/page-head';

export default function QuestionsListNonConfirmer() {
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState([])
  const search = searchParams.get('search') || null;
  const { data, isLoading } = useGetQuestionsNonConfirme(search);
  useEffect(() => {
    if (data) {
      setQuestions(data.data.questions)
    }

  }, [data])
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
      accessorKey: "user_name",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Added By" />
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
              confirme ? <CircleCheckBigIcon className='text-green-500'/>: <CircleXIcon className='text-red-500'/>
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
      cell: ({ row }) => <CellActionQuestionNonConfirme onUpdateData={onUpdateData} questions={questions} data={row.original} />
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
      <DataTable columns={QuestionsColumns} 
        data={questions} placeholder={'Search Question Here'} >
      </DataTable>
    </div>
  );
}