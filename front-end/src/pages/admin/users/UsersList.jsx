import { DataTableSkeleton } from '../../../components/shared/data-table-skeleton';
import { DataTable } from '../../../components/data-table/DataTable';
import { CellActionUser } from '../../../components/data-table/user/CellActionUser';
import { DataTableColumnHeader } from '../../../components/data-table/DataTableColumnHeader';
import { useEffect, useState } from 'react';
import { useGetUsers } from './queries/queries';
import { useSearchParams } from 'react-router-dom';
import PageHead from '../../../components/shared/page-head';

export default function UserList() {
    const [searchParams] = useSearchParams();
    const [users, setUsers] = useState([])
    const search = searchParams.get('search') || null;
    const { data, isLoading } = useGetUsers(search);
    useEffect(() => {
        if (data) {
            setUsers(data.data.users)
        }

    }, [data])
    const onUpdateData = (data) => {
        console.log();
        setUsers(data);
    }
    const UserColumns = [
        {
            accessorKey: "id",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="ID" />
            },
        },
        {
            accessorKey: "firstname",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="First Name" />

            },
        },
        {
            accessorKey: "lastname",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Last Name" />

            },
        },
        {
            accessorKey: "date_of_birth",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Date Of Birth" />

            },
        },
        {
            accessorKey: "gender",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Gender" />
            },
            cell: ({ row }) => {
                const gender = row.original.gender
                return (
                    <>
                        {
                            gender === "m" ? (
                                'Male'
                            ) : (
                                'Female'
                            )
                        }
                    </>
                )
            },
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Email" />
            },
        },
        {
            accessorKey: "phone",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Phone" />

            },
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Created at" />

            },
        },
        {
            id: 'actions',
            cell: ({ row }) => <CellActionUser users={users} onUpdateData={onUpdateData} data={row.original} />
        }


    ]
    if (isLoading) {
        return (
            <div className="p-5">
                <DataTableSkeleton
                    columnCount={10}
                    filterableColumnCount={0}
                    searchableColumnCount={1}
                />
            </div>
        );
    }

    return (
        <div className="p-5">
            <PageHead title="User Management - ExamBuilder" />
            <DataTable columns={UserColumns} data={users} placeholder={'Search User Here'} />
        </div>
    );
}