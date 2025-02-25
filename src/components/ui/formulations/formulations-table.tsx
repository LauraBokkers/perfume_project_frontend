import { z } from 'zod';
import { getColumns } from "./formulations-columns";
import { DataTable } from "../generic-data-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../button";
import { useState } from 'react';
import AddModal from "./add-formulation-modal";
import { toast } from "react-toastify";
import DeleteModal from './delete-formulation-modal';
import EditModal from './edit-formulation-modal';
import ViewModal from './view-formulation-modal';




// Define the Zod schema for the Formula type
export const FormulaSchema = z.object({
    id: z.number(),
    title: z.string(),
    formula_line: z.array(
        z.object({
            aroma_chemical: z.object({
                name: z.string()
            }),
            quantity: z.number()
        })
    ).optional()

});

export type Formulation = z.infer<typeof FormulaSchema>



// Function to fetch formulas from the API
async function fetchFormulations(): Promise<Formulation[]> {
    try {
        const response = await fetch('http://localhost:3000/api/formulas');

        // Check if the response is OK (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        // Parse the response as JSON
        const data = await response.json();

        // Validate the response with Zod
        const validatedData = FormulaSchema.array().parse(data);

        return validatedData;
    } catch (error) {
        console.error('Failed to fetch formulas:', error);
        throw error; // re-throw the error for further handling if needed
    }
}



// Function to post a new formula to the API
async function postFormulation(newFormula: Omit<Formulation, 'id'>): Promise<void> {
    const response = await fetch('http://localhost:3000/api/formulas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFormula),
    });

    if (!response.ok) {
        throw new Error(`Failed to post formula: ${response.statusText}`);
    }
}


async function deleteFormulation(idToBeDeleted: Formulation["id"]): Promise<void> {
    const response = await fetch(`http://localhost:3000/api/formulas/${idToBeDeleted}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`Failed to delete formula: ${response.statusText}`);
    }
}


async function editFormulation({ id, title, formula_line }: Formulation): Promise<void> {
    const response = await fetch(`http://localhost:3000/api/formulas/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title,
            formula_line: formula_line?.map(line => ({
                quantity: line.quantity
            }))

        })
    });

    if (!response.ok) {
        throw new Error(`Failed to edit formula: ${response.statusText}`);
    }
}





export default function FormulationsTable() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formulationToDelete, setFormulationToDelete] = useState<null | Formulation>(null);
    const [formulationToEdit, setFormulationToEdit] = useState<null | Formulation>(null);
    const [formulationId, setFormulationId] = useState<null | Formulation['id']>(null);

    const queryClient = useQueryClient()

    const { data, error, isLoading, isError } = useQuery({
        queryKey: ["formulations"],
        queryFn: () => fetchFormulations(),
    })

    const newFormulationMutation = useMutation({
        mutationFn: (newFormulation: Omit<Formulation, 'id'>) => postFormulation(newFormulation),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["formulations"] });
            toast.success("Successfully added new formulation!")
        },
        onError: (error) => {
            console.error('Failed to add new formulation:', error);
            toast.error('Error adding new formulation');
        },
    });

    const deleteFormulationMutation = useMutation({
        mutationFn: (idToBeDeleted: Formulation['id']) => deleteFormulation(idToBeDeleted),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["formulations"] });
            setFormulationToDelete(null);
            toast.success("Successfully deleted formulation.");
        },
        onError: (error) => {
            console.error('Failed to delete the formulation:', error);
            toast.error('Error deleting the formulation');
        },
    })

    const editFormulationMutation = useMutation({
        mutationFn: (formulation: Formulation) => editFormulation(formulation),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["formulation"] });
        },
        onError: (error) => {
            console.error('Failed to edit the formulation:', error);
            toast.error('Error editing the formulation');
        },
    })


    return (
        <div className="p-10 bg-custom-table rounded-xl">
            {data && <DataTable
                columns={getColumns({ handleDeleteFormulation: setFormulationToDelete, handleViewFormulation: setFormulationId, handleEditFormulation: setFormulationToEdit })}
                data={data}
                handleClickAdd={() => setIsDialogOpen(true)}
                showAddButton
                searchField='title' />}

            {isDialogOpen && <AddModal
                handleSubmit={newFormulationMutation.mutate}
                isPending={newFormulationMutation.isPending}
                onClose={() => setIsDialogOpen(false)} />}
            {formulationToDelete && (
                <DeleteModal
                    formulation={formulationToDelete}
                    onClose={() => setFormulationToDelete(null)}
                    onConfirm={deleteFormulationMutation.mutate} />
            )}

            {formulationId && (
                <ViewModal
                    formulationId={formulationId}
                    onClose={() => setFormulationId(null)}
                />
            )}

            {formulationToEdit && (
                <EditModal
                    formulation={formulationToEdit}
                    onClose={() => setFormulationToEdit(null)}
                    handleSubmit={editFormulationMutation.mutate}
                    isPending={editFormulationMutation.isPending}
                />
            )}

        </div>

    )
}