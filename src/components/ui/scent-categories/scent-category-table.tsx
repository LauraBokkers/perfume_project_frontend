import { z } from 'zod';
import { getColumns } from "./scent-categories-columns";
import { DataTable } from "../generic-data-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from 'react';
import { toast } from "react-toastify";
import AddScentCategoryModal from './add-scent-category-modal';
import DeleteModal from '../delete-modal';
import EditScentCategoryModal from './edit-scent-category-modal';
import { API_BASE_URL } from '@/constants';


// Define the Zod schema for the Formula type
export const ScentCategoriesSchema = z.object({
    id: z.number(),
    category: z.string(),
    key: z.string(),
});

export type ScentCategory = z.infer<typeof ScentCategoriesSchema>


async function fetchScentCategories(): Promise<ScentCategory[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/scent-categories`);

        // Check if the response is OK (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        // Parse the response as JSON
        const data = await response.json();

        // Validate the response with Zod
        const validatedData = ScentCategoriesSchema.array().parse(data);

        return validatedData;
    } catch (error) {
        console.error('Failed to fetch scent categories:', error);
        throw error;
    }
}

async function postScentCategory(category: string): Promise<void> {
    const formattedKey = category.replace(/\s+/g, '').toLowerCase();

    const payload = {
        category,
        key: formattedKey,
    };

    const response = await fetch(`${API_BASE_URL}/api/scent-categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Failed to post scent category: ${response.statusText}`);
    }
}

async function deleteScentCategory(idToBeDeleted: ScentCategory["id"]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/scent-categ/${idToBeDeleted}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`Failed to delete scent category: ${response.statusText}`);
    }
}

async function editScentCategory(scentCategoryId: ScentCategory['id'], updatedScentCategory: ScentCategory["category"]): Promise<void> {
    const formattedKey = updatedScentCategory.replace(/\s+/g, '').toLowerCase();

    const response = await fetch(`${API_BASE_URL}/api/scent-categories/${scentCategoryId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            category: updatedScentCategory,
            key: formattedKey,
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to edit scent category: ${response.statusText}`);
    }
}

export default function ScentCategoriesTable() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [scentCategoryToDelete, setScentCategoryToDelete] = useState<null | ScentCategory>(null);
    const [scentCategoryToEdit, setScentCategoryToEdit] = useState<null | ScentCategory>(null);

    const queryClient = useQueryClient()

    const { data } = useQuery({
        queryKey: ["scent-categories"],
        queryFn: () => fetchScentCategories(),
    })

    const newScentCategoryMutation = useMutation({
        mutationFn: (category: string) => postScentCategory(category),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scent-categories"] });
            toast.success("Successfully added new scent category!")
        },
        onError: (error) => {
            console.error('Failed to add new scent category:', error);
            toast.error('Error adding new scent category');
        },
    });

    const deleteScentCategoryMutation = useMutation({
        mutationFn: (idToBeDeleted: ScentCategory['id']) => deleteScentCategory(idToBeDeleted),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scent-categories"] });
            setScentCategoryToDelete(null);
            toast.success("Successfully deleted scent category.");
        },
        onError: (error) => {
            console.error('Failed to delete the scent category:', error);
            toast.error('Error deleting the scent category.');
        },
    })

    const editScentCategoryMutation = useMutation({
        mutationFn: ({ id, category }: { id: ScentCategory['id'], category: ScentCategory["category"] }) => editScentCategory(id, category),
        onSuccess: () => {
            setScentCategoryToEdit(null)
            queryClient.invalidateQueries({ queryKey: ["scent-categories"] });
            toast.success("Successfully edited scent category.");
        },
        onError: (error) => {
            console.error('Failed to edit the scent category:', error);
            toast.error('Error editing the scent category');
        },
    })

    return (
        <div className="p-10 bg-custom-table rounded-xl">
            {data && <DataTable
                columns={getColumns({ handleDeleteScentCategory: setScentCategoryToDelete, handleEditScentCategory: setScentCategoryToEdit })}
                data={data}
                handleClickAdd={() => setIsDialogOpen(true)}
                showAddButton
                searchField='category' />}

            {isDialogOpen && <AddScentCategoryModal
                handleSubmit={newScentCategoryMutation.mutate}
                isPending={newScentCategoryMutation.isPending}
                onClose={() => setIsDialogOpen(false)} />}
            {scentCategoryToDelete && (
                <DeleteModal
                    item={scentCategoryToDelete}
                    onClose={() => setScentCategoryToDelete(null)}
                    onConfirm={deleteScentCategoryMutation.mutate}
                    itemType="scent category" />
            )}
            {scentCategoryToEdit && (
                <EditScentCategoryModal
                    onClose={() => setScentCategoryToEdit(null)}
                    handleSubmit={editScentCategoryMutation.mutate}
                    scentCategory={scentCategoryToEdit}
                />
            )}

        </div>

    )
}