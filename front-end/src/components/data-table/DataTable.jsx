import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table"
import { useState } from "react"
import { DataTableViewOptions } from "./DataTableViewOptions "
import { DataTablePagination } from "./DataTablePagination"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import TableSearchInput from "../shared/table-search-input"

export function DataTable({
    data,
    columns,
    children,
    placeholder,
}) {

    const [sorting, setSorting] = useState([])
    const [columnFilters, setColumnFilters] = useState([])
    const [columnVisibility, setColumnVisibility] = useState({})
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting,
            columnFilters,
            columnVisibility
        }
    })

    return (
        <>
            <div className="flex items-center justify-between py-5 gap-4">
                <div className="flex flex-1 gap-4">
                    <TableSearchInput placeholder={placeholder} />
                </div>
                <div className="flex gap-3">
                    {children}
                    <DataTableViewOptions table={table} />

                </div>
            </div>
            <div>
                <ScrollArea className="h-[calc(90vh-220px)] rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
            <div className="mt-4">
                <DataTablePagination table={table} />
            </div>
        </ >
    )
}