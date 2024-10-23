import { DataTableSkeleton } from '../../../components/shared/data-table-skeleton';
import { DataTable } from '../../../components/data-table/DataTable';
import { DataTableColumnHeader } from '../../../components/data-table/DataTableColumnHeader';
import { useEffect, useState } from 'react';
import { useGetChapitres } from './queries/queries';
import { useSearchParams } from 'react-router-dom';
import PageHead from '../../../components/shared/page-head';

export default function ListChapitres() {
  const [searchParams] = useSearchParams();
  const [chapitres, setChapitres] = useState([])
  const search = searchParams.get('search') || null;
  const { data, isLoading } = useGetChapitres(search);
  useEffect(() => {
    if (data) {
      setChapitres(data.data.chapitres)
    }

  }, [data])
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
            <PageHead title="Chapitre - ExamBuilder" />
      <DataTable columns={ChapitresColumns} data={chapitres} placeholder={'Search Chapitre Here'} />
    </div>
  );
}