import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Formulation } from "../formulations-table";
import { Aromachemical } from "@/data-services/fetch-aromachemicals";
import { CloseButton } from "../../close-button";
import AromachemicalsFormulationsTable from "./aromachemicals-formulations-table";

type ModalPropType = {
  onClose: () => void;
  handleSubmit: ({ ...props }: Omit<Formulation, "id">) => void;
  isPending: boolean;
};

function AddModal({ onClose, handleSubmit, isPending }: ModalPropType) {
  const [title, setTitle] = useState("");

  // wizard state
  const [step, setStep] = useState<1 | 2>(1);

  // geselecteerde aromachemicals (controlled voor stap 1)
  const [selectedAromas, setSelectedAromas] = useState<Aromachemical[]>([]);

  // hoeveelheden (key = a.id)
  const [quantities, setQuantities] = useState<
    Record<number, number | undefined>
  >({});

  const closeModal = () => onClose();
  const goBackToStep1 = () => setStep(1);

  // ESC sluit modal
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
    }
  }

  useEffect(() => {
    document.body.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // validatie
  const isSubmitDisabled =
    title.trim().length === 0 ||
    selectedAromas.length === 0 ||
    selectedAromas.some((a) => {
      const q = quantities[a.id];
      return q === undefined || q <= 0 || Number.isNaN(q);
    });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formula_line: Formulation["formula_line"] = selectedAromas.map(
      (a) => ({
        aroma_chemical: a,
        quantity: quantities[a.id] ?? 0,
      })
    );

    handleSubmit({ title, formula_line });
    console.log("Submitting formulation:", { title, formula_line });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 mx-2 flex items-center justify-center backdrop-brightness-75">
      <div
        className="shadow-hover relative flex h-auto w-auto flex-col gap-6 rounded-xl bg-white px-10 py-8"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <CloseButton onClose={onClose} />
        <h2 className="text-lg font-medium ml-1">Add new formulation</h2>
        <form onSubmit={handleFormSubmit} className="w-[700px]">
          {/* TITLE INPUT */}
          <div className="mb-4 rounded-xl bg-custom-accentLight px-4 py-3 bg-opacity-50">
            <label htmlFor="name" className="block mb-1 text-lg font-medium">
              Title
            </label>
            <input
              id="name"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border border-gray-300 rounded-lg px-3 py-1 w-full"
            />
            {title.trim().length === 0 && (
              <p className="text-sm text-red-600 mt-1">Title is required.</p>
            )}
          </div>

          {/* STEP 1 — SELECT AROMACHEMICALS */}
          <div className="mb-4 rounded-xl bg-custom-accentLight px-4 py-3 bg-opacity-50">
            {step === 1 && (
              <AromachemicalsFormulationsTable
                onCancel={closeModal}
                onNext={(selected) => {
                  setSelectedAromas(selected);

                  // quantities behouden bij teruggaan naar stap 1
                  setQuantities((prev) => {
                    const next: Record<number, number | undefined> = {};
                    selected.forEach((a) => (next[a.id] = prev[a.id]));
                    return next;
                  });

                  setStep(2);
                }}
                selectedAromas={selectedAromas}
                setSelectedAromas={setSelectedAromas}
              />
            )}

            {/* STEP 2 — ENTER QUANTITIES */}
            {step === 2 && (
              <div className="max-h-[500px] overflow-auto p-4 rounded-xl bg-custom-table space-y-4">
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Quantities</h2>
                    <Button
                      type="button"
                      onClick={goBackToStep1}
                      className="rounded-xl justify-center w-[155px] hover:bg-custom-accentLight/60"
                    >
                      Back to selection
                    </Button>
                  </div>

                  <div className="border-custom-background border-2 rounded-xl border-opacity-80 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-custom-accentLight">
                        <tr>
                          <th className="px-4 py-2 text-left">
                            Aroma Chemical
                          </th>
                          <th className="px-4 py-2 text-left">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedAromas.map((a) => (
                          <tr key={a.id}>
                            <td className="border px-4 py-2">{a.name}</td>
                            <td className="border px-4 py-2">
                              <input
                                type="number"
                                min={0}
                                value={quantities[a.id] ?? ""}
                                onChange={(e) =>
                                  setQuantities((prev) => ({
                                    ...prev,
                                    [a.id]: e.target.value
                                      ? Number(e.target.value)
                                      : undefined,
                                  }))
                                }
                                className="border border-gray-300 rounded px-3 py-1 w-32"
                              />
                            </td>
                          </tr>
                        ))}

                        {selectedAromas.length === 0 && (
                          <tr>
                            <td
                              colSpan={2}
                              className="border px-4 py-2 text-center text-sm opacity-70"
                            >
                              No aromachemicals selected.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {isSubmitDisabled && (
                    <p className="text-sm text-red-600">
                      Enter amount &gt; 0 for all aromachemicals.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SUBMIT */}
          <div className="mt-4 flex justify-start">
            <Button
              type="submit"
              disabled={isPending || step !== 2 || isSubmitDisabled}
              className="bg-blue-600 text-white py-2 px-4 rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Submit formulation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddModal;
