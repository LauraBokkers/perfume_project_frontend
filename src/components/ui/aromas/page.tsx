import { getColumns } from "./columns";
import { DataTable } from "./data-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from 'zod';
import { useState } from 'react';
import DeleteModal from "../delete-modal";
import EditModal from "../edit-modal";
import { toast } from "react-toastify";
import { Button } from "../button";
import AddModal from "../add-modal";


// Define the Zod schema for the Aromachemical type
const AromachemicalSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
});

export type Aromachemical = z.infer<typeof AromachemicalSchema>

// Function to fetch aromachemicals from the API
async function fetchAromachemicals(): Promise<Aromachemical[]> {
    try {
        const response = await fetch('http://localhost:3000/api/aromachemicals');

        // Check if the response is OK (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        // Parse the response as JSON
        const data = await response.json();

        // Validate the response with Zod
        const validatedData = AromachemicalSchema.array().parse(data);

        return validatedData;
    } catch (error) {
        console.error('Failed to fetch aromachemicals:', error);
        throw error; // re-throw the error for further handling if needed
    }
}

// Function to post a new aromachemical to the API
async function postAromachemical(newAromachemical: Omit<Aromachemical, 'id'>): Promise<void> {
    const response = await fetch('http://localhost:3000/api/aromachemicals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAromachemical),
    });

    if (!response.ok) {
        throw new Error(`Failed to post aromachemical: ${response.statusText}`);
    }
}

async function deleteAromaChemical(idToBeDeleted: Aromachemical["id"]): Promise<void> {
    const response = await fetch(`http://localhost:3000/api/aromachemicals/${idToBeDeleted}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`Failed to delete aromachemical: ${response.statusText}`);
    }
}

async function editAromaChemical({ id, name, description }: Aromachemical): Promise<void> {
    const response = await fetch(`http://localhost:3000/api/aromachemicals/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            description
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to edit aromachemical: ${response.statusText}`);
    }
}

export default function TablePage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [aromachemicalToDelete, setAromachemicalToDelete] = useState<null | Aromachemical>(null);
    const [aromachemicalToEdit, setAromachemicalToEdit] = useState<null | Aromachemical>(null);

    const queryClient = useQueryClient()

    const { data, error, isLoading, isError } = useQuery({
        queryKey: ["aromachemicals"],
        queryFn: () => fetchAromachemicals(),
    })

    const newAromaChemicalMutation = useMutation({
        mutationFn: (newAromachemical: Omit<Aromachemical, 'id'>) => postAromachemical(newAromachemical),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["aromachemicals"] });
            toast.success("Successfully added new aromachemical!")
        },
        onError: (error) => {
            console.error('Failed to add new aromachemical:', error);
            toast.error('Error adding new aromachemical');
        },
    });

    const editAromachemicalMutation = useMutation({
        mutationFn: (aromachemical: Aromachemical) => editAromaChemical(aromachemical),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["aromachemicals"] });
        },
        onError: (error) => {
            console.error('Failed to edit the aromachemical:', error);
            toast.error('Error editing the aromachemical');
        },
    })

    const deleteAromachemicalMutation = useMutation({
        mutationFn: (idToBeDeleted: Aromachemical['id']) => deleteAromaChemical(idToBeDeleted),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["aromachemicals"] });
        },
        onError: (error) => {
            console.error('Failed to delete the aromachemical:', error);
            toast.error('Error deleting the aromachemical');
        },
    })

    if (isLoading) return <h1>Loading...</h1>
    if (isError) return <pre>{JSON.stringify(error)}</pre>

    return (
        <div className="container mx-auto py-10">
            {data && <DataTable columns={getColumns({ handleDeleteRow: setAromachemicalToDelete, handleEditAromachemical: setAromachemicalToEdit })}
                data={data} />}
            <Button onClick={() => setIsDialogOpen(true)}>Add new</Button>
            {isDialogOpen && <AddModal handleSubmit={newAromaChemicalMutation.mutate} isPending={newAromaChemicalMutation.isPending} onClose={() => setIsDialogOpen(false)} />}
            {aromachemicalToDelete && (
                <DeleteModal
                    aromachemical={aromachemicalToDelete}
                    onClose={() => setAromachemicalToDelete(null)}
                    onConfirm={deleteAromachemicalMutation.mutate} />
            )}

            {aromachemicalToEdit && (
                <EditModal
                    aromachemical={aromachemicalToEdit}
                    onClose={() => setAromachemicalToEdit(null)}
                    handleSubmit={editAromachemicalMutation.mutate}
                    isPending={editAromachemicalMutation.isPending}
                />

            )}

        </div>
    )
}



