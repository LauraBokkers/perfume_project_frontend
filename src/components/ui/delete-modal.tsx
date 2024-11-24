import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import CloseIcon from "../icons/close-icon";
import { Aromachemical } from "./aromas/page";


interface ModalPropType {
    onClose: () => void;
    onConfirm: (id: number) => void;
    aromachemical: Aromachemical;
}

const DeleteModal = ({ onClose, onConfirm, aromachemical }: ModalPropType) => {
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
            id="mail-modal"
            className={"fixed inset-0 z-50 mx-2 flex items-center justify-center backdrop-brightness-75"}
            onClick={() => onClose()}
        >
            <div
                className="shadow-hover relative flex h-auto w-auto flex-col gap-6 rounded-md bg-white px-10 py-8"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="absolute right-4 top-4 h-4 w-4 cursor-pointer"
                    onClick={() => onClose()}
                >
                    <CloseIcon height={14} width={14} fill="white" />
                </div>
                <div className="flex h-auto max-w-96 flex-col">
                    <span className="text-black"> Are you sure you want to delete the aromachemical <span className="font-bold">{aromachemical.name}</span>?</span>
                </div>
                <Button onClick={() => onConfirm(aromachemical.id)}>Confirm</Button>
            </div>
        </div >
    );
};

export default DeleteModal;