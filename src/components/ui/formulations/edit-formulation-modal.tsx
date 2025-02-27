import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CloseIcon from "../../icons/close-icon";
import { type Formulation } from "./formulations-table";

interface ModalPropType {
    onClose: () => void;
    handleSubmit: ({ ...props }: Formulation) => void;
    formulation: Formulation;
    isPending: boolean;
}

const EditModal = ({ onClose, handleSubmit, formulation, isPending }: ModalPropType) => {
    const [title, setTitle] = useState<string>(formulation.title);

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
                        handleSubmit({ id: formulation.id, title });
                        onClose();
                    }}
                >
                    <div className='py-4'>
                        <label htmlFor="name" className="block mb-1">Name:</label>
                        <input
                            id="name"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="border border-gray-300 rounded px-3 py-1"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-custom-accentLight hover:bg-custom-background text-black py-2 px-4 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Submit <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>

                    </Button>
                </form>
            </div>
        </div >
    );
};

export default EditModal;