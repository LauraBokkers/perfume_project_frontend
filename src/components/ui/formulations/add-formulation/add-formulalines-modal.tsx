import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Formulation } from "../formulations-table";
import { CloseButton } from "../../close-button";
import { Aromachemical } from "@/data-services/fetch-aromachemicals";

interface ModalPropType {
  existingFormulaLines: Formulation["formula_line"];
  selectedIds: Set<number>;
  onToggleSelect: (a: Aromachemical) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const AddFormulalinesModal = ({ onClose, onConfirm }: ModalPropType) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 mx-2 flex items-center justify-center backdrop-brightness-75">
      <div
        className="shadow-hover relative flex h-auto w-auto flex-col gap-6 rounded-xl bg-white px-10 py-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute right-4 top-4 h-4 w-4 cursor-pointer"
          onClick={onClose}
        >
          <CloseButton onClose={onClose} />
        </div>
        <div className="flex h-auto max-w-96 flex-col">
          <h2>Add formulalines!!</h2>
        </div>
        <Button
          onClick={onConfirm}
          className="bg-custom-accentLight hover:bg-green-200 hover:bg-opacity-70 rounded-xl"
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
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default AddFormulalinesModal;
