// ui/formulations/add-formulation/aromachemicals-formulation-table.tsx

import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DataTable } from "../../generic-data-table";

import {
  Aromachemical,
  fetchAromachemicals,
  persistenceValues,
} from "@/data-services/fetch-aromachemicals";

import { getFormulationSelectColumns } from "./aromachemicals-formulations-columns";
import { ScentCategoriesFilter } from "./scent-categories-filter";
import { PersistenceFilter } from "./persistence-filter";

interface AromachemicalsFormulationsTablePropType {
  onCancel: () => void;
  onNext: (selected: Aromachemical[]) => void;
  initialSelectedIds?: number[];
}

export default function AromachemicalsFormulationTable({
  onCancel,
  onNext,
  initialSelectedIds = [],
}: AromachemicalsFormulationsTablePropType) {
  // ------------ DATA ------------
  const { data, error, isLoading, isError } = useQuery<Aromachemical[]>({
    queryKey: ["aromachemicals", "for-formulation"],
    queryFn: () => fetchAromachemicals(),
  });

  // Alle unieke scent categories uit de data
  const allScentCategories = React.useMemo(() => {
    const set = new Set<string>();

    (data ?? []).forEach((aroma) => {
      aroma.scent_category?.forEach((cat) => {
        set.add(cat.category);
      });
    });

    return Array.from(set);
  }, [data]);

  // ------------ STATE ------------

  // geselecteerde rijen (ids)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    () => new Set(initialSelectedIds)
  );

  useEffect(() => {
    setSelectedIds(new Set(initialSelectedIds));
  }, [initialSelectedIds]);

  // geselecteerde scent categories (AND-filter)
  const [selectedScentCategories, setSelectedScentCategories] = useState<
    Set<string>
  >(() => new Set());

  // geselecteerde persistence
  const [selectedPersistence, setSelectedPersistence] = React.useState<
    Set<string>
  >(new Set());

  // ------------ FILTER LOGICA ------------

  const filteredData = React.useMemo(() => {
    let rows = data ?? [];

    // filter op scent categories (AND)
    if (selectedScentCategories.size > 0) {
      rows = rows.filter((aroma) => {
        const aromaCats = aroma.scent_category?.map((c) => c.category) ?? [];
        return Array.from(selectedScentCategories).every((selectedCat) =>
          aromaCats.includes(selectedCat)
        );
      });
    }

    // filter op persistence (AND)
    if (selectedPersistence.size > 0) {
      rows = rows.filter((aroma) =>
        selectedPersistence.has(aroma.persistence ?? "")
      );
    }

    return rows;
  }, [data, selectedScentCategories, selectedPersistence]);

  // Gefilterde data sorteren zodat gelesecteerde items bovenaan komen //
  const sortedData = useMemo(() => {
    const rows = (filteredData ?? []).slice();
    rows.sort((a, b) => {
      const aSel = selectedIds.has(a.id);
      const bSel = selectedIds.has(b.id);
      if (aSel === bSel) return 0;
      return aSel ? -1 : 1; // geselecteerde eerst
    });
    return rows;
  }, [filteredData, selectedIds]);

  // centrale toggle-functie (voor checkbox én rij-click)
  const toggleSelect = React.useCallback((item: Aromachemical) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
      return next;
    });
  }, []);

  // ------------ TABEL KOLOMMEN ------------

  const columns = React.useMemo(
    () =>
      getFormulationSelectColumns({
        selectedIds,
        onToggleSelect: toggleSelect,
      }),
    [selectedIds, toggleSelect]
  );

  // ------------ NAVIGATIE / BUTTONS ------------

  const handleNext = () => {
    const all = data ?? [];
    const selected = all.filter((a) => selectedIds.has(a.id));
    onNext(selected);
  };

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <pre>{JSON.stringify(error)}</pre>;

  return (
    <div className="max-w-[700px] max-h-[500px] overflow-auto p-4 rounded-xl bg-custom-table space-y-4">
      <h2 className="text-lg font-medium">Select aromachemicals</h2>
      {data && (
        <DataTable<Aromachemical>
          columns={columns}
          data={sortedData}
          searchField="name"
          handleClickAdd={() => {}}
          showAddButton={false}
          initialVisibility={{
            name: true,
            persistence: true,
            scent_category: true,
          }}
          // extra header boven de standaard toolbar
          headerExtras={
            <div className="flex gap-4">
              <PersistenceFilter
                persistenceValues={persistenceValues}
                selectedPersistence={selectedPersistence}
                setSelectedPersistence={setSelectedPersistence}
              />
              <ScentCategoriesFilter
                allScentCategories={allScentCategories}
                selectedScentCategories={selectedScentCategories}
                setSelectedScentCategories={setSelectedScentCategories}
              />
            </div>
          }
          highlightRowsOnHover
          onRowClick={toggleSelect}
          isRowSelected={(row) => selectedIds.has(row.id)}
        />
      )}

      {/* onder de tabel: knoppen + aantal geselecteerd */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-sm opacity-80">
          Selected aromachemicals: {selectedIds.size}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onCancel}
            className="rounded-xl justify-center hover:bg-red-600 hover:bg-opacity-60 w-[100px]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleNext}
            disabled={selectedIds.size === 0}
            className="rounded-xl justify-center hover:bg-custom-accentLight/60 w-[100px]"
          >
            Next ({selectedIds.size})
          </Button>
        </div>
      </div>
    </div>
  );
}
