// ui/formulations/add-formulation/persistence-filter.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type PersistenceFilterProps = {
  persistenceValues: readonly string[];
  selectedPersistence: string | null;
  setSelectedPersistence: React.Dispatch<React.SetStateAction<string | null>>;
};

export function PersistenceFilter({
  persistenceValues,
  selectedPersistence,
  setSelectedPersistence,
}: PersistenceFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-xl cursor-pointer">
          {selectedPersistence ?? "Filter op persistence"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-40">
        <DropdownMenuItem
          className="cursor-pointer hover:bg-custom-accentLight text-sm"
          onClick={() => setSelectedPersistence(null)}
        >
          Alle
        </DropdownMenuItem>

        {persistenceValues.map((value) => (
          <DropdownMenuItem
            key={value}
            className={`cursor-pointer hover:bg-custom-accentLight text-sm ${
              selectedPersistence === value ? "font-semibold" : ""
            }`}
            onClick={() => setSelectedPersistence(value)}
          >
            {value}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
