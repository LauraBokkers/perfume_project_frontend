import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Aromachemical } from "@/data-services/fetch-aromachemicals";

type ColumnProps = {
  selectedIds: Set<number>;
  onToggleSelect: (row: Aromachemical) => void;
};

export function getFormulationSelectColumns(
  props: ColumnProps
): ColumnDef<Aromachemical>[] {
  const { selectedIds, onToggleSelect } = props;

  return [
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
              onClick={(e) => e.stopPropagation()}
              onCheckedChange={() => onToggleSelect(item)}
              aria-label={`Select ${item.name}`}
            />
          </div>
        );
      },
      maxSize: 30,
      size: 20,
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
      maxSize: 40,
      size: 20,
    },

    {
      id: "scent_category",
      header: "Scent Category",
      accessorFn: (row) =>
        row.scent_category?.map((c) => c.category).join(", ") ?? "-",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original.scent_category?.length
            ? row.original.scent_category.map((c) => c.category).join(", ")
            : "-"}
        </div>
      ),
      maxSize: 50,
      size: 30,
      enableSorting: false,
    },
  ];
}
