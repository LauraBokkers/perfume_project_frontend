import { getColumns } from "./aromachemicals-columns";
import { DataTable } from "../generic-data-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import EditModal from "./edit-aromachemical-modal";
import { toast } from "react-toastify";
import AddModal from "./add-aromachemical-modal";
import DeleteModal from "../delete-modal";
import { API_BASE_URL } from "@/constants";
import {
  Aromachemical,
  fetchAromachemicals,
} from "@/data-services/fetch-aromachemicals";

// Function to post a new aromachemical to the API
async function postAromachemical(
  newAromachemical: Omit<Aromachemical, "id">
): Promise<void> {
  const { scent_category, ...aromachemical } = newAromachemical;

  const response = await fetch(`${API_BASE_URL}/api/aromachemicals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      aromachemical,
      scent_category,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to post aromachemical: ${response.statusText}`);
  }
}

async function deleteAromaChemical(
  idToBeDeleted: Aromachemical["id"]
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/aromachemicals/${idToBeDeleted}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete aromachemical: ${response.statusText}`);
  }
}

async function editAromaChemical({
  id,
  name,
  description,
  IFRA_limit,
  dilution_material,
  odor_strength,
  persistence,
  scent_category,
  supplier,
}: Aromachemical): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/aromachemicals/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      description,
      IFRA_limit,
      dilution_material,
      odor_strength,
      persistence,
      scent_category: {
        set: scent_category.map((element) => ({ id: element.id })),
      },
      supplier,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to edit aromachemical: ${response.statusText}`);
  }
}

export default function AromachemicalsTable() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [aromachemicalToDelete, setAromachemicalToDelete] =
    useState<null | Aromachemical>(null);
  const [aromachemicalToEdit, setAromachemicalToEdit] =
    useState<null | Aromachemical>(null);

  const queryClient = useQueryClient();

  const { data, error, isLoading, isError } = useQuery<Aromachemical[]>({
    queryKey: ["aromachemicals"],
    queryFn: () => fetchAromachemicals(),
  });

  const newAromaChemicalMutation = useMutation({
    mutationFn: (newAromachemical: Omit<Aromachemical, "id">) =>
      postAromachemical(newAromachemical),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aromachemicals"] });
      toast.success("Successfully added new aromachemical!");
    },
    onError: (error) => {
      console.error("Failed to add new aromachemical:", error);
      toast.error("Error adding new aromachemical");
    },
  });

  const editAromachemicalMutation = useMutation({
    mutationFn: (aromachemical: Aromachemical) =>
      editAromaChemical(aromachemical),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aromachemicals"] });
      toast.success("Successfully edited aromachemical.");
    },
    onError: (error) => {
      console.error("Failed to edit the aromachemical:", error);
      toast.error("Error editing the aromachemical");
    },
  });

  const deleteAromachemicalMutation = useMutation({
    mutationFn: (idToBeDeleted: Aromachemical["id"]) =>
      deleteAromaChemical(idToBeDeleted),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aromachemicals"] });
      setAromachemicalToDelete(null);
      toast.success("Successfully deleted aromachemical.");
    },
    onError: (error) => {
      console.error("Failed to delete the aromachemical:", error);
      toast.error("Error deleting the aromachemical");
    },
  });

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <pre>{JSON.stringify(error)}</pre>;

  return (
    <div className="p-10 bg-custom-table rounded-xl overflow-x-scroll">
      {data && (
        <DataTable
          columns={getColumns({
            handleDeleteAromachemical: setAromachemicalToDelete,
            handleEditAromachemical: setAromachemicalToEdit,
          })}
          data={data}
          searchField="name"
          handleClickAdd={() => setIsDialogOpen(true)}
          showAddButton
          initialVisibility={{
            id: false,
            name: true,
            description: true,
            scent_category: true,
            dilution_material: false,
            IFRA_limit: false,
            odor_strength: false,
            persistence: false,
            supplier: false,
          }}
        />
      )}

      {isDialogOpen && (
        <AddModal
          onAddAromachemical={newAromaChemicalMutation.mutate}
          isPending={newAromaChemicalMutation.isPending}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
      {aromachemicalToDelete && (
        <DeleteModal
          item={aromachemicalToDelete}
          onClose={() => setAromachemicalToDelete(null)}
          onConfirm={deleteAromachemicalMutation.mutate}
          itemType="aromachemical"
        />
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
  );
}
