import { DataTableSkeleton } from '../../../components/shared/data-table-skeleton';
import { DataTable } from '../../../components/data-table/DataTable';
import { CellActionModule } from '../../../components/data-table/module/CellActionModule';
import { DataTableColumnHeader } from '../../../components/data-table/DataTableColumnHeader';
import { useEffect, useState } from 'react';
import { useGetModules } from './queries/queries';
import { useSearchParams } from 'react-router-dom';
import PopupModal from '../../../components/shared/popup-modal';
import ModuleCreateForm from './ModuleCreateForm';
import PageHead from '../../../components/shared/page-head';
export default function ModulesList() {
  const [searchParams] = useSearchParams();
  const [modules, setModules] = useState([])
  const search = searchParams.get('search') || null;
  const { data, isLoading } = useGetModules(search);
  useEffect(() => {
    if (data) {
      setModules(data.data.modules)
    }

  }, [data])
  const onUpdateData = (data) => {
    setModules(data);
  }
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
    {
      id: 'actions',
      cell: ({ row }) => <CellActionModule onUpdateData={onUpdateData} modules={modules} data={row.original} />
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
            <PageHead title="Module Management - ExamBuilder" />

      <DataTable columns={ModulesColumns} data={modules} placeholder={'Search Module Here'} >
        <PopupModal
          renderModal={(onClose) => <ModuleCreateForm modules={modules} onUpdateData={onUpdateData} modalClose={onClose} />}
        />
      </DataTable>
    </div>
  );
}