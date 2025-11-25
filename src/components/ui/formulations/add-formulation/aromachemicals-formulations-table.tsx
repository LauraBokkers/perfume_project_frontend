// ui/formulations/add-formulation/aromachemicals-formulation-table.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DataTable } from "../../generic-data-table";
import {
  Aromachemical,
  fetchAromachemicals,
} from "@/data-services/fetch-aromachemicals";
import { getFormulationSelectColumns } from "./aromachemicals-formulations-columns";
import React from "react";
import { ScentCategoriesFilter } from "./scent-categories-filter";

interface AromachemicalsFormulationsTablePropType {
  onCancel: () => void;
  onNext: (selected: Aromachemical[]) => void;
  initialSelectedIds?: number[]; // 👈 optie B
}

export default function AromachemicalsFormulationTable({
  onCancel,
  onNext,
  initialSelectedIds = [],
}: AromachemicalsFormulationsTablePropType) {
  const { data, error, isLoading, isError } = useQuery<Aromachemical[]>({
    queryKey: ["aromachemicals", "for-formulation"],
    queryFn: () => fetchAromachemicals(),
  });

  const allScentCategories = React.useMemo(() => {
    const set = new Set<string>();

    (data ?? []).forEach((aroma) => {
      aroma.scent_category?.forEach((cat) => {
        set.add(cat.category);
      });
    });

    // 2. Set → Array
    return Array.from(set);
  }, [data]);

  const [selectedScentCategories, setSelectedScentCategories] = useState<
    Set<string>
  >(() => new Set());

  // Selectie van rijen (ids van aromachemicals)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    () => new Set(initialSelectedIds)
  );

  const toggleSelect = (item: Aromachemical) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
      return next;
    });
  };

  const handleNext = () => {
    const all = data ?? [];
    const selected = all.filter((a) => selectedIds.has(a.id));
    onNext(selected);
  };

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <pre>{JSON.stringify(error)}</pre>;

  return (
    <div className="max-w-[700px] max-h-[500px] overflow-auto p-4 rounded-xl bg-custom-table space-y-4">
      {allScentCategories && (
        <ScentCategoriesFilter
          allScentCategories={allScentCategories}
          selectedScentCategories={selectedScentCategories}
          setSelectedScentCategories={setSelectedScentCategories}
        />
      )}

      {data && (
        <DataTable<Aromachemical>
          columns={getFormulationSelectColumns({
            selectedIds,
            onToggleSelect: toggleSelect,
          })}
          data={data}
          searchField="name"
          handleClickAdd={() => {}}
          showAddButton={false}
          initialVisibility={{
            name: true,
            persistence: true,
            scent_category: true,
          }}
        />
      )}

      {/* onder de tabel: knoppen + aantal geselecteerd */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-sm opacity-80">
          Selected aromachemicals: {selectedIds.size}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="rounded-xl">
            Annuleren
          </Button>
          <Button
            onClick={handleNext}
            disabled={selectedIds.size === 0}
            className="rounded-xl"
          >
            Volgende ({selectedIds.size})
          </Button>
        </div>
      </div>
    </div>
  );
}
