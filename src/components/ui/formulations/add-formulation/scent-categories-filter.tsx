// ui/formulations/add-formulation/ScentCategoriesFilter.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

type ScentCategoriesFilterProps = {
  allScentCategories: string[];
  selectedScentCategories: Set<string>;
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

  const selectedCount = selectedScentCategories.size;
  const selectedList = Array.from(selectedScentCategories);

  return (
    <div className="flex flex-col gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-xl justify-center w-[155px]">
            {selectedCount === 0
              ? "Scent Category filter"
              : `Scent Categories (${selectedCount})`}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-white rounded-xl max-h-64 overflow-auto w-[155px]">
          {allScentCategories.map((cat) => {
            const checked = selectedScentCategories.has(cat);
            return (
              <DropdownMenuCheckboxItem
                key={cat}
                checked={checked}
                onCheckedChange={() => toggleCategory(cat)}
                className="cursor-pointer text-sm hover:bg-custom-accentLight focus:bg-custom-accentLight"
              >
                {cat}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedCount > 0 && (
        <div className="flex flex-wrap gap-1 text-[13px]">
          {selectedList.map((cat) => (
            <span
              key={cat}
              className="px-2 py-0.5 rounded-full bg-custom-accentLight/60"
            >
              {cat}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
