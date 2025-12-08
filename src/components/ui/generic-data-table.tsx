import { useState } from "react";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchField?: string;
  showAddButton?: boolean;
  handleClickAdd: () => void;
  initialVisibility?: VisibilityState;
  headerExtras?: React.ReactNode;
  /** extra classes voor table rows – optioneel */
  highlightRowsOnHover?: boolean;
  onRowClick?: (row: TData) => void;
  isRowSelected?: (row: TData) => boolean;
}

export function DataTable<TData, TValue = unknown>({
  columns,
  data,
  searchField,
  showAddButton = false,
  handleClickAdd,
  initialVisibility,
  headerExtras,
  highlightRowsOnHover = false,
  onRowClick,
  isRowSelected,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialVisibility ?? {});

  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    columnResizeMode: "onChange",
    enableColumnResizing: true,
  });

  const handlePageSizeChange = (size: number) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: size,
    }));
  };

  return (
    <div className="w-full">
      {/* TOOLBAR */}
      <div className="flex gap-4 items-center py-4">
        {searchField && (
          <Input
            placeholder="Filter names..."
            value={
              (table.getColumn(searchField)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchField)?.setFilterValue(event.target.value)
            }
            className="max-w-[282px] rounded-xl border-black border-opacity-50"
          />
        )}
        {showAddButton && (
          <Button
            className="rounded-xl hover:bg-custom-accentLight/60"
            onClick={handleClickAdd}
          >
            {" "}
            Add
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </Button>
        )}

        {/* Page Size Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-xl justify-center w-[155px] hover:bg-custom-accentLight/60">{`Page size (${pagination.pageSize})`}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white rounded-xl ">
            {[10, 20, 30, 40, 50].map((size) => (
              <DropdownMenuItem
                className="cursor-pointer text-sm hover:bg-custom-accentLight/60 focus:bg-custom-accentLight/60 z-20"
                key={size}
                onClick={() => handlePageSizeChange(size)}
              >
                {size}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-xl justify-center w-[155px] hover:bg-custom-accentLight/60">
              Show/hide columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white rounded-xl">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize cursor-pointer text-sm hover:bg-custom-accentLight/60 focus:bg-custom-accentLight/60 z-10"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {headerExtras && (
        <div className="flex justify-end pb-2">{headerExtras}</div>
      )}

      {/* bovenste pagination */}
      <div className="w-full flex items-center justify-center my-4">
        <div className="flex flex-row justify-evenly w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-none rounded-full h-8 w-8 bg-gray-500 bg-opacity-5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-none rounded-full h-8 w-8 bg-gray-500 bg-opacity-5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </Button>
        </div>
      </div>

      <div className="border-custom-background border-2 rounded-xl border-opacity-80 overflow-hidden w-full">
        <Table className="mx-auto w-full table-fixed">
          <TableHeader className="bg-custom-accentLight">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="border-2 border-custom-background"
                      style={{
                        width: header.column.getSize()
                          ? `${header.column.getSize()}px`
                          : "auto",
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
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
                  className={cn(
                    highlightRowsOnHover &&
                      "hover:bg-custom-accentLight/60 cursor-pointer transition-colors",
                    isRowSelected?.(row.original) && "bg-custom-accentLight/60"
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* onderste pagination */}
      <div className="w-full flex items-center justify-center my-4">
        <div className="flex flex-row justify-evenly w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-none rounded-full h-8 w-8 bg-gray-500 bg-opacity-5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-none rounded-full h-8 w-8 bg-gray-500 bg-opacity-5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
