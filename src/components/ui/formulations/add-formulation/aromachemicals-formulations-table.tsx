import React, { useState, useMemo } from "react";
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
  selectedAromas: Aromachemical[];
  setSelectedAromas: React.Dispatch<React.SetStateAction<Aromachemical[]>>;
}

export default function AromachemicalsFormulationTable({
  onCancel,
  onNext,
  selectedAromas,
  setSelectedAromas,
}: AromachemicalsFormulationsTablePropType) {
  // ------------ DATA ------------
  const { data, error, isLoading, isError } = useQuery<Aromachemical[]>({
    queryKey: ["aromachemicals", "for-formulation"],
    queryFn: () => fetchAromachemicals(),
  });

  // Verzamel alle unieke scent categories voor het filter
  const allScentCategories = useMemo(() => {
    const set = new Set<string>();
    (data ?? []).forEach((aroma) => {
      aroma.scent_category?.forEach((cat) => set.add(cat.category));
    });
    return Array.from(set);
  }, [data]);

  // ------------ FILTER STATE ------------

  const [selectedScentCategories, setSelectedScentCategories] = useState<
    Set<string>
  >(new Set());

  const [selectedPersistence, setSelectedPersistence] = useState<Set<string>>(
    new Set()
  );

  // ------------ FILTER LOGICA ------------

  const filteredData = useMemo(() => {
    let rows = data ?? [];

    if (selectedScentCategories.size > 0) {
      rows = rows.filter((aroma) => {
        const aromaCats = aroma.scent_category?.map((c) => c.category) ?? [];
        return Array.from(selectedScentCategories).every((selectedCat) =>
          aromaCats.includes(selectedCat)
        );
      });
    }

    if (selectedPersistence.size > 0) {
      rows = rows.filter((aroma) =>
        selectedPersistence.has(aroma.persistence ?? "")
      );
    }

    return rows;
  }, [data, selectedScentCategories, selectedPersistence]);

  // ------------ SORTERING (geselecteerde eerst) ------------

  const sortedData = useMemo(() => {
    const rows = [...(filteredData ?? [])];
    rows.sort((a, b) => {
      const aSel = selectedAromas.some((x) => x.id === a.id);
      const bSel = selectedAromas.some((x) => x.id === b.id);
      if (aSel === bSel) return 0;
      return aSel ? -1 : 1;
    });
    return rows;
  }, [filteredData, selectedAromas]);

  // ------------ SELECTIE LOGICA ------------

  const toggleSelect = (item: Aromachemical) => {
    setSelectedAromas((prev) => {
      const exists = prev.some((x) => x.id === item.id);
      if (exists) return prev.filter((x) => x.id !== item.id);
      return [...prev, item];
    });
  };

  const isSelected = (id: number) => selectedAromas.some((x) => x.id === id);

  // ------------ TABEL KOLOMMEN ------------

  const columns = useMemo(
    () =>
      getFormulationSelectColumns({
        selectedIds: new Set(selectedAromas.map((a) => a.id)),
        onToggleSelect: toggleSelect,
      }),
    [selectedAromas]
  );

  // ------------ NAVIGATIE ------------

  const handleNext = () => {
    onNext(selectedAromas);
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
          isRowSelected={(row) => isSelected(row.id)}
        />
      )}

      <div className="flex items-center justify-between pt-2">
        <div
          className={`text-sm ${
            selectedAromas.length === 0
              ? "text-red-600"
              : "text-black opacity-80"
          }`}
        >
          {selectedAromas.length === 0
            ? "No aromachemicals selected."
            : `Selected aromachemicals: ${selectedAromas.length}`}
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
            disabled={selectedAromas.length === 0}
            className="rounded-xl justify-center hover:bg-custom-accentLight/60 w-[100px]"
          >
            Next ({selectedAromas.length})
          </Button>
        </div>
      </div>
    </div>
  );
}
