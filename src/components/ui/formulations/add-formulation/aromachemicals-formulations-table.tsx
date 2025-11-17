// ui/formulations/add-formulation/aromachemicals-formulation-table.tsx
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "../../generic-data-table";

import { getFormulationSelectColumns } from "./aromachemicals-formulations-columns";
import {
  Aromachemical,
  fetchAromachemicals,
} from "@/data-services/fetch-aromachemicals";

// ---- Types voor filters ----
type PersistenceValue =
  | "Top"
  | "Middle"
  | "Base"
  | "High"
  | "Bottom"
  | "Undefined"
  | (string & {});
type Category = { id: number; category: string };

// ---- Props ----
type Props = {
  // modal controls
  onCancel: () => void;
  onNext: (selected: Aromachemical[]) => void;

  // optioneel: bestaande selectie (bv. wanneer user teruggaat naar stap 1)
  initialSelectedIds?: number[];
};

export default function AromachemicalsFormulationTable({
  onCancel,
  onNext,
  initialSelectedIds = [],
}: Props) {
  // Data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["aromachemicals", "for-formulation"],
    queryFn: fetchAromachemicals,
  });

  // UI state (client-side filters & selectie)
  const [search, setSearch] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<Set<number>>(
    new Set(initialSelectedIds)
  );
  const [persistenceFilter, setPersistenceFilter] = React.useState<
    Set<PersistenceValue>
  >(new Set());
  const [categoryFilter, setCategoryFilter] = React.useState<Set<number>>(
    new Set()
  );

  // Unieke categorieën uit de data (voor filterchips of checklist)
  const categories: Category[] = React.useMemo(() => {
    const map = new Map<number, string>();
    (data ?? []).forEach((a) => {
      a.scent_category?.forEach((c) => {
        if (!map.has(c.id)) map.set(c.id, c.category);
      });
    });
    return Array.from(map.entries()).map(([id, category]) => ({
      id,
      category,
    }));
  }, [data]);

  // Toggle helpers
  const toggleSelect = (item: Aromachemical) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
      return next;
    });
  };

  const togglePersistence = (value: PersistenceValue) => {
    setPersistenceFilter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const toggleCategory = (id: number) => {
    setCategoryFilter((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filtered data (client-side)
  const filteredData = React.useMemo(() => {
    let rows = data ?? [];

    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((r) => r.name.toLowerCase().includes(q));
    }

    if (persistenceFilter.size > 0) {
      rows = rows.filter((r) =>
        r.persistence
          ? persistenceFilter.has(r.persistence as PersistenceValue)
          : persistenceFilter.has("Undefined")
      );
    }

    if (categoryFilter.size > 0) {
      rows = rows.filter((r) =>
        r.scent_category?.some((c) => categoryFilter.has(c.id))
      );
    }

    return rows;
  }, [data, search, persistenceFilter, categoryFilter]);

  // Kolommen
  const columns = React.useMemo(
    () =>
      getFormulationSelectColumns({
        selectedIds,
        onToggleSelect: toggleSelect,
      }),
    [selectedIds]
  );

  // Next
  const handleNext = () => {
    const selected = (data ?? []).filter((a) => selectedIds.has(a.id));
    onNext(selected);
  };

  if (isLoading) return <div className="p-4">Loading…</div>;
  if (isError) return <div className="p-4 text-red-600">{String(error)}</div>;

  return (
    <div className="space-y-4">
      {/* Toolbar boven de tabel: zoek + filters  */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <Input
          placeholder="Zoek op naam…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm rounded-xl"
        />

        {/* Persistence filters (chips met checkbox) */}
        <div className="flex flex-wrap items-center gap-2">
          {["Top", "Middle", "Base", "High", "Bottom", "Undefined"].map((p) => {
            const active = persistenceFilter.has(p as PersistenceValue);
            return (
              <Badge
                key={p}
                variant={active ? "default" : "secondary"}
                className="cursor-pointer select-none"
                onClick={() => togglePersistence(p as PersistenceValue)}
              >
                {p}
              </Badge>
            );
          })}
        </div>

        {/* Category filter (compacte checklist) */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => {
            const active = categoryFilter.has(c.id);
            return (
              <label
                key={c.id}
                className="flex items-center gap-2 rounded-md border px-2 py-1 cursor-pointer"
              >
                <Checkbox
                  checked={active}
                  onCheckedChange={() => toggleCategory(c.id)}
                />
                <span className="text-sm">{c.category}</span>
              </label>
            );
          })}
        </div>

        {/* Geselecteerd teller */}
        <div className="ml-auto text-sm opacity-80">
          Selected: {selectedIds.size}
        </div>
      </div>

      {/* De tabel zelf — hergebruik van je generic DataTable */}
      <DataTable<Aromachemical, unknown>
        columns={columns}
        data={filteredData}
        // géén searchField hier, we doen het zelf met het inputveld erboven
        handleClickAdd={() => {}}
        showAddButton={false}
        initialVisibility={
          {
            // select kolom heeft id "select" en is niet hideable (enableHiding:false)
            name: true,
            persistence: true,
            scent_category: true,
          } as any
        }
      />

      {/* Actieknoppen onderaan */}
      <div className="flex justify-between pt-2">
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
  );
}
