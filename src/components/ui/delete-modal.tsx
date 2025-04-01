import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import CloseIcon from "../icons/close-icon";

interface DeleteModalProps {
    onClose: () => void;
    onConfirm: (id: number) => void;
    item: { id: number; name?: string; title?: string };
    itemType: "formulation" | "aromachemical" | "scent category";
}

const DeleteModal = ({ onClose, onConfirm, item, itemType }: DeleteModalProps) => {
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

    const itemName = item.title || item.name || "item";

    return (
        <div
            id="delete-modal"
            className="fixed inset-0 z-50 mx-2 flex items-center justify-center backdrop-brightness-75"
            onClick={onClose}
        >
            <div
                className="shadow-hover relative flex h-auto w-auto flex-col gap-6 rounded-xl bg-white px-10 py-8"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="absolute right-4 top-4 h-4 w-4 cursor-pointer"
                    onClick={onClose}
                >
                    <CloseIcon className="fill-black hover:fill-red-600 transition-colors duration-200 cursor-pointer" height={14} width={14} />
                </div>
                <div className="flex h-auto max-w-96 flex-col">
                    <span className="text-black">
                        Are you sure you want to delete the {itemType} <span className="font-bold">{itemName}</span>?
                    </span>
                </div>
                <Button className="bg-custom-accentLight hover:bg-red-600 hover:bg-opacity-70 rounded-xl" onClick={() => onConfirm(item.id)}>
                    Confirm
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </Button>
            </div>
        </div>
    );
};

export default DeleteModal;
