import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CloseIcon from "../../icons/close-icon";
import { ScentCategory } from "./scent-category-table";


interface EditScentCategoryModalPropType {
    onClose: () => void;
    handleSubmit: ({ ...props }: { id: ScentCategory['id'], category: ScentCategory["category"] }) => void;
    scentCategory: ScentCategory;
}

const EditScentCategoryModal = ({ onClose, scentCategory, handleSubmit }: EditScentCategoryModalPropType) => {

    const [category, setCategory] = useState<string>(scentCategory.category);

    // Closing modal with keyboard
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
                <div className="flex-col flex gap-2 py-2">
                    <div className='py-4'>
                        <label htmlFor="name" className="block mb-1">Category:</label>
                        <div className="flex justify-between items-center">
                            <input
                                id="name"
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="border border-gray-300 rounded px-3 py-1"
                            />
                        </div>
                    </div>
                </div>
                <Button
                    type="submit"
                    onClick={() => handleSubmit({ id: scentCategory.id, category: category })}

                    className="bg-custom-accentLight hover:bg-green-200 text-black mt-4 py-2 px-4 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Submit changes <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </Button>
            </div>
        </div >
    );
};

export default EditScentCategoryModal;

