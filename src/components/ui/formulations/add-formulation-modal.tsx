import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CloseIcon from "../../icons/close-icon";
import { Formulation } from "./formulations-table";
import AromachemicalsFormulationsTable from "./add-formulation/aromachemicals-formulations-table";
import { Aromachemical } from "@/data-services/fetch-aromachemicals";

type ModalPropType = {
  onClose: () => void;
  handleSubmit: ({ ...props }: Omit<Formulation, "id">) => void;
  isPending: boolean;
};

function AddModal({ onClose, handleSubmit, isPending }: ModalPropType) {
  const [title, setTitle] = useState("");

  // 1) wizard state
  const [step, setStep] = useState<1 | 2>(1);

  // 2) selectie uit stap 1
  const [selectedAromas, setSelectedAromas] = useState<Aromachemical[]>([]);

  // 3) hoeveelheden voor stap 2 (key = aromachemical.id)
  const [quantities, setQuantities] = useState<
    Record<number, number | undefined>
  >({});

  // helpers
  const closeModal = () => onClose();
  const goBackToStep1 = () => setStep(1);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // zijn alle geselecteerde aromachemicals voorzien van een geldige hoeveelheid?
  const isSubmitDisabled =
    selectedAromas.length === 0 ||
    selectedAromas.some((a) => {
      const q = quantities[a.id];
      return q === undefined || q <= 0 || Number.isNaN(q);
    });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // bouw formula_line vanuit geselecteerde aromachemicals + quantities
    const formula_line: Formulation["formula_line"] = selectedAromas.map(
      (a) => ({
        aroma_chemical: a,
        quantity: quantities[a.id] ?? 0, // 0 zou eigenlijk niet moeten kunnen door de disable-check
      })
    );

    handleSubmit({ title, formula_line });
    onClose();
  };

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
          <CloseIcon height={14} width={14} fill="black" />
        </div>

        <form onSubmit={handleFormSubmit}>
          {/* Titelveld (geldig voor beide stappen) */}
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1">
              Title:
            </label>
            <input
              id="name"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border border-gray-300 rounded px-3 py-1"
            />
          </div>

          {/* STAP 1: aromachemicals selecteren */}
          {step === 1 && (
            <AromachemicalsFormulationsTable
              onCancel={closeModal}
              onNext={(selected) => {
                setSelectedAromas(selected);
                // eventueel vorige quantities schonen voor niet meer geselecteerde
                setQuantities((prev) => {
                  const next: Record<number, number | undefined> = {};
                  selected.forEach((a) => {
                    next[a.id] = prev[a.id]; // behoud bestaande waarde als die er was
                  });
                  return next;
                });
                setStep(2);
              }}
              initialSelectedIds={selectedAromas.map((a) => a.id)}
            />
          )}

          {/* STAP 2: hoeveelheden invullen */}
          {step === 2 && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Quantities for selected aromachemicals
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBackToStep1}
                  className="rounded-xl"
                >
                  Terug naar selectie
                </Button>
              </div>

              <div className="border-custom-background border-2 rounded-xl border-opacity-80 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-custom-accentLight">
                    <tr>
                      <th className="px-4 py-2 text-left">Aroma Chemical</th>
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
                          Geen aromachemicals geselecteerd.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {isSubmitDisabled && (
                <p className="text-sm text-red-600">
                  Vul voor alle geselecteerde aromachemicals een hoeveelheid
                  &gt; 0 in.
                </p>
              )}
            </div>
          )}

          {/* Submit-knop onderaan: alleen actief in stap 2 en als alles geldig is */}
          <Button
            type="submit"
            disabled={isPending || step !== 2 || isSubmitDisabled}
            className="bg-blue-600 mt-8 text-white py-2 px-4 rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AddModal;
