import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CloseIcon from "../../icons/close-icon";
import { Formulation } from "./formulations-table";
import AromachemicalsFormulationsTable from "./add-formulation/aromachemicals-formulations-table";
import { Aromachemical } from "../aromachemicals/aromachemicals-table";

type ModalPropType = {
  onClose: () => void;
  handleSubmit: ({ ...props }: Omit<Formulation, "id">) => void;
  isPending: boolean;
};

function AddModal({ onClose, handleSubmit, isPending }: ModalPropType) {
  const [title, setTitle] = useState("");

  // 2) wizard state
  const [step, setStep] = useState<1 | 2>(1);

  // 3) selectie uit stap 1
  const [selectedAromas, setSelectedAromas] = useState<Aromachemical[]>([]);

  // 4) hoeveelheden voor stap 2 (key = aromachemical.id)
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit({ title });
            onClose();
          }}
        >
          <div>
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

          {step === 1 && (
            <AromachemicalsFormulationsTable
              onCancel={closeModal}
              onNext={(selected) => {
                setSelectedAromas(selected);
                setStep(2);
              }}
            />
          )}

          {step === 2 && <div></div>}

          <Button
            type="submit"
            disabled={isPending}
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
