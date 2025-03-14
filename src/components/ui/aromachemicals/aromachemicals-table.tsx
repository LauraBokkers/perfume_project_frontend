import { getColumns } from "./aromachemicals-columns";
import { DataTable } from "../generic-data-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from 'zod';
import { useState } from 'react';
import DeleteModal from "./delete-aromachemical-modal";
import EditModal from "./edit-aromachemical-modal";
import { toast } from "react-toastify";
import AddModal from "./add-aromachemical-modal";



// Define Enums
const OdorStrengthEnum = z.enum(["Very_weak", "Weak", "Medium", "Strong", "Very_strong"]);
const SupplierEnum = z.enum(["IFF", "Firmenich", "Symrise", "Givaudan", "Hekserij"]);
const PersistenceEnum = z.enum(["Top", "High", "Middle", "Bottom", "Base"]);
const SolventEnum = z.enum(["DPG", "Perfumers_alcohol", "IPM"]);

// Define ScentCategory Schema
const ScentCategorySchema = z.object({
    category: z.string()
});


// Define Aromachemical Schema
export const AromachemicalSchema = z.object({
    id: z.number(),
    name: z.string().min(3, "Naam moet minimaal 3 karakters hebben.").max(50, "Naam mag niet langer zijn dan 50 karakters."),
    scent_category: z.array(ScentCategorySchema),
    odor_strength: OdorStrengthEnum.nullable(),
    persistence: PersistenceEnum.nullable(),
    dilution_material: SolventEnum.nullable(),
    description: z.string().max(1000, "Beschrijving mag niet langer zijn dan 1000 karakters.").nullable(),
    IFRA_limit: z.string().nullable(),
    supplier: SupplierEnum.nullable(),
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
        console.log(data);

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

export default function AromachemicalsTable() {
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
            setAromachemicalToDelete(null);
            toast.success("Successfully deleted aromachemical.");
        },
        onError: (error) => {
            console.error('Failed to delete the aromachemical:', error);
            toast.error('Error deleting the aromachemical');
        },
    })

    if (isLoading) return <h1>Loading...</h1>
    if (isError) return <pre>{JSON.stringify(error)}</pre>

    return (
        <div className="p-10 bg-custom-table rounded-xl">
            {data && <DataTable
                columns={getColumns({ handleDeleteAromachemical: setAromachemicalToDelete, handleEditAromachemical: setAromachemicalToEdit })}
                data={data}
                searchField='name'
                handleClickAdd={() => setIsDialogOpen(true)}
                showAddButton />}

            {isDialogOpen && <AddModal
                onAddAromachemical={newAromaChemicalMutation.mutate}
                isPending={newAromaChemicalMutation.isPending}
                onClose={() => setIsDialogOpen(false)} />}
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



