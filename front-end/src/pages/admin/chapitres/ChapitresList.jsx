import { DataTableSkeleton } from '../../../components/shared/data-table-skeleton';
import { DataTable } from '../../../components/data-table/DataTable';
import { CellActionChapitre } from '../../../components/data-table/chapitre/CellActionChapitre';
import { DataTableColumnHeader } from '../../../components/data-table/DataTableColumnHeader';
import { useEffect, useState } from 'react';
import { useGetChapitres } from './queries/queries';
import { useSearchParams } from 'react-router-dom';
import PopupModal from '../../../components/shared/popup-modal';
import ChapitreCreateForm from './ChapitreCreateForm';
import PageHead from '../../../components/shared/page-head';

export default function ChapitresList() {
  const [searchParams] = useSearchParams();
  const [chapitres, setChapitres] = useState([])
  const search = searchParams.get('search') || null;
  const { data, isLoading } = useGetChapitres(search);
  useEffect(() => {
    if (data) {
      setChapitres(data.data.chapitres)
    }

  }, [data])
  const onUpdateData = (data) => {
    setChapitres(data);
  }
  const ChapitresColumns = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="ID" />
      },
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="title" />
      },
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

      },
    },
    {
      id: 'actions',
      cell: ({ row }) => <CellActionChapitre onUpdateData={onUpdateData} chapitres={chapitres} data={row.original} />
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
            <PageHead title="Chapitre Management - ExamBuilder" />

      <DataTable columns={ChapitresColumns} data={chapitres} placeholder={'Search Chapitre Here'} >
        <PopupModal
          renderModal={(onClose) => <ChapitreCreateForm chapitres={chapitres} onUpdateData={onUpdateData} modalClose={onClose} />}
        />
      </DataTable>
    </div>
  );
}