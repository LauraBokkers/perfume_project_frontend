import { Button } from "@/components/ui/button";
import CloseIcon from "../../icons/close-icon";
import { useQuery } from "@tanstack/react-query";
import { ScentCategorySchema } from "./aromachemicals-table";
import { z } from "zod";
import { Dispatch, SetStateAction, useState } from "react";
import { API_BASE_URL } from "@/constants";


type ModalPropType = {
    onClose: () => void;
    setScentCategories: Dispatch<SetStateAction<ScentCategory[]>>;
    initialScentCategories: ScentCategory[];
};


export type ScentCategory = z.infer<typeof ScentCategorySchema>

async function fetchScentCategories(): Promise<ScentCategory[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/scent-categories`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        const validatedData = ScentCategorySchema.array().parse(data);

        return validatedData;
    } catch (error) {
        console.error('Failed to fetch scent categories:', error);
        throw error;
    }
}


function ScentCategoryModal({ onClose, setScentCategories, initialScentCategories }: ModalPropType) {

    const [selectedCategories, setSelectedCategories] = useState<Set<number>>(
        new Set(initialScentCategories.map(c => c.id))
    );

    const { data, error, isLoading, isError } = useQuery({
        queryKey: ["scent-categories"],
        queryFn: () => fetchScentCategories(),
    })

    // Handle checkbox toggle

    const handleCheckboxChange = (category: ScentCategory) => {
        setSelectedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(category.id)) {
                newSet.delete(category.id);
            } else {
                newSet.add(category.id);
            }
            return newSet;
        });
    };


    if (isLoading) return <h1>Loading...</h1>
    if (isError) return <pre>{JSON.stringify(error)}</pre>

    return (
        <div
            id="modal"
            className="fixed inset-0 z-50 mx-2 flex items-center justify-center backdrop-brightness-75"
        >
            <div
                id="modal"
                className="fixed inset-0 z-50 mx-2 flex items-center justify-center backdrop-brightness-75"
                onClick={onClose}
            >
                <div
                    className="shadow-hover relative flex flex-col gap-6 rounded-xl bg-white w-auto h-auto max-h-[90vh] overflow-y-auto px-10 py-8"

                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        className="absolute right-4 top-4 h-4 w-4 cursor-pointer"
                        onClick={onClose}
                    >
                        <CloseIcon height={14} width={14} fill="black" />
                    </div>
                    <h2 className="text-xl mb-4">Select your scent category</h2>
                    {data ? (
                        <ul>
                            {data.map((category) => (
                                <li key={category.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`category-${category.id}`}
                                        checked={selectedCategories.has(category.id)}
                                        onChange={() => handleCheckboxChange(category)}
                                    />
                                    <label htmlFor={`category-${category.id}`}>{category.category}</label>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        "No categories found"
                    )}
                    <Button onClick={(e) => {
                        e.preventDefault();
                        if (!data) return;
                        setScentCategories(data.filter(category => selectedCategories.has(category.id)));
                        onClose();
                    }}>Save</Button>
                </div>
            </div>

        </div>
    );
}


export default ScentCategoryModal;