// ui/formulations/add-formulation/ScentCategoriesFilter.tsx
import * as React from "react";
import { Badge } from "@/components/ui/badge";

type ScentCategoriesFilterProps = {
  // Alle beschikbare categorie-namen
  allScentCategories: string[];
  // Geselecteerde categorieën (als Set<string>)
  selectedScentCategories: Set<string>;
  // Setter uit de parent
  setSelectedScentCategories: React.Dispatch<React.SetStateAction<Set<string>>>;
};

export function ScentCategoriesFilter({
  allScentCategories,
  selectedScentCategories,
  setSelectedScentCategories,
}: ScentCategoriesFilterProps) {
  if (allScentCategories.length === 0) {
    return (
      <div className="text-sm opacity-70">Geen scent categories gevonden.</div>
    );
  }

  const toggleCategory = (cat: string) => {
    setSelectedScentCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {allScentCategories.map((cat) => {
        const isActive = selectedScentCategories.has(cat);

        return (
          <Badge
            key={cat}
            variant={isActive ? "default" : "secondary"}
            className={
              "cursor-pointer select-none transition" +
              (isActive
                ? " bg-blue-600 text-white border border-blue-800 shadow-sm"
                : " bg-gray-50 text-black border border-gray-300 opacity-80 hover:opacity-100")
            }
            onClick={() => toggleCategory(cat)}
          >
            {cat}
          </Badge>
        );
      })}
    </div>
  );
}
