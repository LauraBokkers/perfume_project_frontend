// ui/formulations/add-formulation/aromachemicals-formulation-columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Aromachemical } from "@/data-services/fetch-aromachemicals";

type ColumnProps = {
  // staat voor selectie wordt in de parent (wrapper) beheerd
  selectedIds: Set<number>;
  onToggleSelect: (row: Aromachemical) => void;
};

export function getFormulationSelectColumns(
  props: ColumnProps
): ColumnDef<Aromachemical>[] {
  const { selectedIds, onToggleSelect } = props;

  const columns: ColumnDef<Aromachemical>[] = [
    {
      id: "select",
      header: () => <span className="sr-only">Select</span>,
      cell: ({ row }) => {
        const item = row.original;
        const checked = selectedIds.has(item.id);
        return (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={checked}
              onCheckedChange={() => onToggleSelect(item)}
              aria-label={`Select ${item.name}`}
            />
          </div>
        );
      },
      maxSize: 50,
      size: 40,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="truncate max-w-[260px]">{row.original.name}</div>
      ),
      maxSize: 50,
      size: 40,
    },
    {
      accessorKey: "persistence",
      header: "Persistence",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          {row.original.persistence ?? "Undefined"}
        </div>
      ),
      maxSize: 50,
      size: 40,
    },
    {
      accessorKey: "scent_category",
      header: "Scent Category",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.scent_category?.length
            ? row.original.scent_category.map((c) => (
                <Badge key={c.id} variant="secondary">
                  {c.category}
                </Badge>
              ))
            : "-"}
        </div>
      ),
      maxSize: 50,
      size: 40,
      enableSorting: false, // sorteren op array is onhandig; filteren kan in wrapper
    },
  ];

  return columns;
}
