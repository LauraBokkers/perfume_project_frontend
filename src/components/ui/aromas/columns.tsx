
import { ColumnDef } from "@tanstack/react-table"
import { type Aromachemical } from "./page"
import { Button } from "@/components/ui/button"
import { type Dispatch, type SetStateAction } from "react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type ColumnProps = {
    handleDeleteRow: Dispatch<SetStateAction<Aromachemical | null>>;
    handleEditAromachemical: Dispatch<SetStateAction<Aromachemical | null>>;
}


export function getColumns({ handleDeleteRow, handleEditAromachemical }: ColumnProps) {


    const columns: ColumnDef<Aromachemical>[] = [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "description",
            header: "Description",
        },
        {
            accessorKey: "delete",
            header: "",
            cell: ({ cell }) => {
                return (
                    <Button onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRow(cell.row.original)
                    }}>
                        Delete
                    </Button>
                )
            }
        },
        {
            accessorKey: "edit",
            header: "",
            cell: ({ cell }) => {
                return (
                    <Button onClick={(e) => {
                        e.stopPropagation();
                        handleEditAromachemical(cell.row.original)
                    }}>
                        Edit
                    </Button>
                )
            }
        }
    ]
    return columns
}