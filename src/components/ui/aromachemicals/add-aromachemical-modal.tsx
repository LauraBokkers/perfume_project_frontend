import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CloseIcon from "../../icons/close-icon";
import { Aromachemical } from "./aromachemicals-table";

type ModalPropType = {
    onClose: () => void;
    handleSubmit: ({ ...props }: Omit<Aromachemical, "id">) => void;
    isPending: boolean;
}

function AddModal({ onClose, handleSubmit, isPending }: ModalPropType) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

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
                        handleSubmit({ name, description });
                        onClose();
                    }}
                >
                    <div>
                        <label htmlFor="name" className="block mb-1">Name:</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="border border-gray-300 rounded px-3 py-1"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="mt-2 mb-2 block">Description:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 w-full resize-y mb-4"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-blue-600 text-white py-2 px-4 rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Submit
                    </Button>
                </form>
            </div>
        </div >
    );
};

export default AddModal;