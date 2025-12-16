import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { type Formulation, fetchFormulationById } from "./formulations-table";
import { useQuery } from "@tanstack/react-query";
import { CloseButton } from "../close-button";
import AddFormulalinesModal from "./add-formulation/add-formulalines-modal";
import { Aromachemical } from "@/data-services/fetch-aromachemicals";

interface EditModalPropType {
  onClose: () => void;
  handleSubmit: ({ ...props }: Formulation) => void;
  formulationId: Formulation["id"];
}

const EditModal = ({
  onClose,
  formulationId,
  handleSubmit,
}: EditModalPropType) => {
  const { data } = useQuery({
    queryKey: ["formulation", formulationId],
    queryFn: () => fetchFormulationById(formulationId),
  });

  const [title, setTitle] = useState<string>("");
  const [formulaLines, setFormulaLines] = useState<Formulation["formula_line"]>(
    []
  );
  const [isAddFormulalinesModalOpen, setIsAddFormulalinesModalOpen] =
    useState(false);

  // Closing modal with keyboard
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
    }
  }

  // selectie van aromachemicals binnen AddFormulalinesModal
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const onToggleSelect = (aroma: Aromachemical) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(aroma.id)) next.delete(aroma.id);
      else next.add(aroma.id);
      return next;
    });
  };

  function handleEditFormulaLines(id: number, quantity: number) {
    setFormulaLines((prev) => {
      return prev?.map((line) => {
        if (line.aroma_chemical.id === id) {
          return {
            ...line,
            quantity,
          };
        }

        return line;
      });
    });
  }

  function handleDeleteFormulaLines(id: number) {
    setFormulaLines((prev) => {
      return prev?.filter((line) => {
        return line.aroma_chemical.id !== id;
      });
    });
  }

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setFormulaLines(data.formula_line);
    }
  }, [data?.title, data?.formula_line]);

  useEffect(() => {
    document.body.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className={
        "fixed inset-0 z-50 mx-2 flex items-center justify-center backdrop-brightness-75"
      }
    >
      <div
        className="shadow-hover relative flex h-auto w-auto flex-col gap-6 rounded-xl bg-white px-10 py-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute right-4 top-4 h-4 w-4 cursor-pointer"
          onClick={() => onClose()}
        >
          <CloseButton onClose={onClose} />
        </div>
        {data && (
          <div>
            <div className="flex-col flex gap-2 py-2">
              <h2 className="text-xl font-bold">Formula Details</h2>
              <div className="py-4">
                <label htmlFor="name" className="block mb-1">
                  Name:
                </label>
                <div className="flex justify-between items-center">
                  <input
                    id="name"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="border border-gray-300 rounded px-3 py-1"
                  />
                  <Button
                    onClick={() => setIsAddFormulalinesModalOpen(true)}
                    className="bg-custom-accentLight bg-opacity-70 rounded-2xl"
                  >
                    Add aromachemical(s){" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </Button>
                  {isAddFormulalinesModalOpen && (
                    <AddFormulalinesModal
                      existingFormulaLines={formulaLines}
                      selectedIds={selectedIds}
                      onToggleSelect={onToggleSelect}
                      onClose={() => setIsAddFormulalinesModalOpen(false)}
                      onConfirm={() => {
                        console.log("clicked");
                        setIsAddFormulalinesModalOpen(false);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="border-custom-background border-2 rounded-xl border-opacity-80 overflow-hidden">
              <table>
                <thead className="bg-custom-accentLight">
                  <tr>
                    <th className="px-4 py-2 text-left">Aroma Chemical</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                    <th className="px-4 py-2 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  {formulaLines?.map((line, idx) => (
                    <tr key={idx}>
                      <td className="border px-4 py-2">
                        {line.aroma_chemical.name}
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          id="quantity"
                          type="number"
                          min={1}
                          value={line.quantity}
                          onChange={(e) =>
                            handleEditFormulaLines(
                              line.aroma_chemical.id,
                              Number(e.target.value)
                            )
                          }
                          required
                          className="border border-gray-300 rounded px-3 py-1 "
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <Button
                          className="bg-red-600 bg-opacity-60 rounded-2xl"
                          onClick={() => {
                            handleDeleteFormulaLines(line.aroma_chemical.id);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button
              type="submit"
              onClick={() =>
                handleSubmit({
                  id: formulationId,
                  title,
                  formula_line: formulaLines,
                })
              }
              className="bg-custom-accentLight hover:bg-green-200 text-black mt-4 py-2 px-4 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Submit changes{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditModal;
