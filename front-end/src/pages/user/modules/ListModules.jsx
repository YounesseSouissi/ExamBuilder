import { DataTableSkeleton } from '../../../components/shared/data-table-skeleton';
import { DataTable } from '../../../components/data-table/DataTable';
import { DataTableColumnHeader } from '../../../components/data-table/DataTableColumnHeader';
import { useEffect, useState } from 'react';
import { useGetModules } from './queries/queries';
import { useSearchParams } from 'react-router-dom';
import PageHead from '../../../components/shared/page-head';

export default function ListModules() {
  const [searchParams] = useSearchParams();
  const [modules, setModules] = useState([])
  const search = searchParams.get('search') || null;
  const { data, isLoading } = useGetModules(search);
  useEffect(() => {
    if (data) {
      setModules(data.data.modules)
    }

  }, [data])
  const ModulesColumns = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="ID" />
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Name" />

      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Description" />

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
      <PageHead title="Module - ExamBuilder" />
      <DataTable columns={ModulesColumns} data={modules} placeholder={'Search Module Here'} />
    </div>
  );
}