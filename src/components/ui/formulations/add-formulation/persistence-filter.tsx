// ui/formulations/add-formulation/persistence-filter.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

type PersistenceFilterProps = {
  persistenceValues: readonly string[];
  selectedPersistence: Set<string>;
  setSelectedPersistence: React.Dispatch<React.SetStateAction<Set<string>>>;
};

export function PersistenceFilter({
  persistenceValues,
  selectedPersistence,
  setSelectedPersistence,
}: PersistenceFilterProps) {
  const togglePersistence = (value: string) => {
    setSelectedPersistence((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const selectedCount = selectedPersistence.size;
  const selectedList = Array.from(selectedPersistence);

  return (
    <div className="flex flex-col gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-xl justify-center w-[155px]">
            {selectedCount === 0
              ? "Persistence filter"
              : `Persistence (${selectedCount})`}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-white rounded-xl max-h-64 overflow-auto w-[--radix-dropdown-menu-trigger-width]">
          {persistenceValues.map((value) => {
            const checked = selectedPersistence.has(value);
            return (
              <DropdownMenuCheckboxItem
                key={value}
                checked={checked}
                onCheckedChange={() => togglePersistence(value)}
                className="cursor-pointer text-sm hover:bg-custom-accentLight focus:bg-custom-accentLight"
              >
                {value}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedCount > 0 && (
        <div className="flex flex-wrap gap-1 text-[13px]">
          {selectedList.map((value) => (
            <span
              key={value}
              className="px-2 py-0.5 rounded-full bg-custom-accentLight/60"
            >
              {value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
