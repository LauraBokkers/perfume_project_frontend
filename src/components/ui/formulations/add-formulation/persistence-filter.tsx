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
        <Button className="rounded-xl justify-center w-[155px]">
          {selectedPersistence ?? "Filter op persistence"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white rounded-xl max-h-64 overflow-auto w-[180px]">
        <DropdownMenuItem
          className="cursor-pointer text-sm hover:bg-custom-accentLight focus:bg-custom-accentLight"
          onClick={() => setSelectedPersistence(null)}
        >
          Alle
        </DropdownMenuItem>

        {persistenceValues.map((value) => (
          <DropdownMenuItem
            key={value}
            className={`cursor-pointer text-sm hover:bg-custom-accentLight focus:bg-custom-accentLight ${
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
