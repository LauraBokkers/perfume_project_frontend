
import { ColumnDef } from "@tanstack/react-table"
import { type Aromachemical } from "./aromachemicals-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { type Dispatch, type SetStateAction } from "react";
import { useState } from "react";


type ColumnProps = {
    handleDeleteAromachemical: Dispatch<SetStateAction<Aromachemical | null>>;
    handleEditAromachemical: Dispatch<SetStateAction<Aromachemical | null>>;
}


export function getColumns({ handleDeleteAromachemical, handleEditAromachemical }: ColumnProps) {


    const columns: ColumnDef<Aromachemical>[] = [
        {
            accessorKey: "name",
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
            cell: ({ row }) => {
                const [isExpanded, setIsExpanded] = useState(false);
                return (
                    <div
                        className={`cursor-pointer ${isExpanded ? "whitespace-normal" : "truncate"}`}
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {row.original.name}
                    </div>
                );
            },
            maxSize: 50,

        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => <div>{row.original.description}</div>,
        },
        {
            accessorKey: "scent_category",
            header: "Scent Category",
            cell: ({ row }) => <div>{row.original.scent_category.map(c => c.category).join(", ")}</div>,
            maxSize: 80,
            size: 50
        },
        {
            accessorKey: "odor_strength",
            header: "Odor Strength",
            cell: ({ row }) => <div>{row.original.odor_strength}</div>,
            maxSize: 50,
            size: 40
        },
        {
            accessorKey: "persistence",
            header: "Persistence",
            cell: ({ row }) => <div>{row.original.persistence}</div>,
            maxSize: 50,
            size: 40
        },
        {
            accessorKey: "supplier",
            header: "Supplier",
            cell: ({ row }) => <div>{row.original.supplier}</div>,
            maxSize: 50,
            size: 40
        },
        {
            accessorKey: "dilution_material",
            header: "Dilution Material",
            cell: ({ row }) => <div>{row.original.dilution_material}</div>,
            maxSize: 50,
            size: 45
        },
        {
            accessorKey: "IFRA_limit",
            header: "IFRA Limit",
            cell: ({ row }) => <div>{row.original.IFRA_limit}</div>,
            maxSize: 50,
            size: 50
        },
        {
            accessorKey: "delete",
            header: "",
            cell: ({ cell }) => {
                return (
                    <div className="w-full flex items-center justify-center">
                        <Button className="bg-red-600 bg-opacity-60 rounded-2xl" onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAromachemical(cell.row.original)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>

                        </Button>
                    </div>
                )
            },
            maxSize: 50,
            size: 40
        },
        {
            accessorKey: "edit",
            header: "",
            cell: ({ cell }) => {
                return (
                    <div className="w-full flex items-center justify-center">
                        <Button className="bg-custom-accentLight bg-opacity-70 rounded-2xl" onClick={(e) => {
                            e.stopPropagation();
                            handleEditAromachemical(cell.row.original)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                        </Button>
                    </div>
                )
            },
            maxSize: 50,
            size: 40
        }
    ]
    return columns
}