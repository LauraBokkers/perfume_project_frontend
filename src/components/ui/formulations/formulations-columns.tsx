
import { ColumnDef } from "@tanstack/react-table"
import { type Formulation } from "./formulations-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { type Dispatch, type SetStateAction } from "react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type ColumnProps = {
    handleDeleteFormulation: Dispatch<SetStateAction<Formulation | null>>;
    handleViewFormulation: Dispatch<SetStateAction<Formulation["id"] | null>>;
    handleEditFormulation: Dispatch<SetStateAction<Formulation | null>>;
}


export function getColumns({ handleDeleteFormulation, handleViewFormulation, handleEditFormulation }: ColumnProps) {


    const columns: ColumnDef<Formulation>[] = [
        {
            accessorKey: "title",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            size: 500,
            minSize: 200,
            maxSize: 500
        },
        {
            accessorKey: "delete",
            header: "",
            cell: ({ cell }) => {
                return (
                    <Button className="bg-red-600 bg-opacity-60 rounded-2xl" onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFormulation(cell.row.original)
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </Button>
                )
            },
            size: 10,
            minSize: 10,
            maxSize: 50,
        },
        {
            accessorKey: "view",
            header: "",
            cell: ({ cell }) => {
                return (
                    <Button className="bg-custom-accentLight bg-opacity-60 rounded-2xl" onClick={(e) => {
                        e.stopPropagation();
                        handleViewFormulation(cell.row.original.id)
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                    </Button>
                )
            },
            size: 10,
            minSize: 10,
            maxSize: 50,
        },
        {
            accessorKey: "edit",
            header: "",
            cell: ({ cell }) => {
                return (
                    <Button className="bg-custom-accentLight bg-opacity-70 rounded-2xl" onClick={(e) => {
                        e.stopPropagation();
                        handleEditFormulation(cell.row.original)
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                    </Button>
                )
            },
            size: 10,
            minSize: 10,
            maxSize: 50,
        }
    ]
    return columns
}





