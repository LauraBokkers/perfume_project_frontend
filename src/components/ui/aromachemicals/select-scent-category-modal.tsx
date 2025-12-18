import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ScentCategorySchema } from "../../../data-services/fetch-aromachemicals";
import { z } from "zod";
import { Dispatch, SetStateAction, useState } from "react";
import { API_BASE_URL } from "@/constants";
import { CloseButton } from "../close-button";

type ModalPropType = {
  onClose: () => void;
  setScentCategories: Dispatch<SetStateAction<ScentCategory[]>>;
  initialScentCategories: ScentCategory[];
};

export type ScentCategory = z.infer<typeof ScentCategorySchema>;

async function fetchScentCategories(): Promise<ScentCategory[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scent-categories`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const validatedData = ScentCategorySchema.array().parse(data);

    return validatedData;
  } catch (error) {
    console.error("Failed to fetch scent categories:", error);
    throw error;
  }
}

function ScentCategoryModal({
  onClose,
  setScentCategories,
  initialScentCategories,
}: ModalPropType) {
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(
    new Set(initialScentCategories.map((c) => c.id))
  );

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["scent-categories"],
    queryFn: () => fetchScentCategories(),
  });

  // Handle checkbox toggle

  const handleCheckboxChange = (category: ScentCategory) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category.id)) {
        newSet.delete(category.id);
      } else {
        newSet.add(category.id);
      }
      return newSet;
    });
  };

  const hasSelection = selectedCategories.size > 0;

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <pre>{JSON.stringify(error)}</pre>;

  return (
    <div
      id="modal"
      className="fixed inset-0 z-50 mx-2 flex items-center justify-center backdrop-brightness-75"
    >
      <div
        id="modal"
        className="fixed inset-0 z-50 mx-2 flex items-center justify-center backdrop-brightness-75"
        onClick={onClose}
      >
        <div
          className=" shadow-hover relative flex flex-col gap-6 rounded-xl bg-white
    w-full max-w-md
    md:max-w-md
    h-auto max-h-[90vh] overflow-y-auto
    px-10 py-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="absolute right-4 top-4 h-4 w-4 cursor-pointer"
            onClick={onClose}
          >
            <CloseButton onClose={onClose} />
          </div>
          <h2 className="text-xl mt-8 mb-2 self-center">
            Select your scent category
          </h2>
          {data ? (
            <ul
              className=" divide-y divide-slate-200
    grid grid-cols-1
    mx-auto
    md:grid-cols-2
    md:divide-y-0
    md:gap-x-6"
            >
              {data.map((category) => {
                const checked = selectedCategories.has(category.id);

                return (
                  <li key={category.id}>
                    <label
                      htmlFor={`category-${category.id}`}
                      className={`
            flex items-center gap-3
            px-3 py-1
            rounded-md
            cursor-pointer
            transition-colors
            hover:bg-custom-accentLight/60
            focus-within:ring-2 focus-within:ring-black/40
            ${checked ? "bg-custom-accentLight font-medium" : ""}
            `}
                    >
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        checked={checked}
                        onChange={() => handleCheckboxChange(category)}
                        className="h-4 w-4 accent-black"
                      />

                      <span className="text-md">{category.category}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          ) : (
            "No categories found"
          )}
          <div className="flex flex-col items-center gap-3">
            <Button
              disabled={!hasSelection}
              className="w-[155px] self-center"
              variant="selector-subtle"
              onClick={(e) => {
                e.preventDefault();
                if (!data || !hasSelection) return;
                setScentCategories(
                  data.filter((category) => selectedCategories.has(category.id))
                );
                onClose();
              }}
            >
              Save
            </Button>

            <span
              className={`
    self-center text-sm text-red-600 
    min-h-[1.25rem]
    ${hasSelection ? "invisible" : "visible"}
  `}
            >
              Geen scent category geselecteerd.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScentCategoryModal;
