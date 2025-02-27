import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CloseIcon from "../../icons/close-icon";
import { FormulaSchema, type Formulation } from "./formulations-table";
import { useQuery } from "@tanstack/react-query";

interface ViewModalPropType {
    onClose: () => void;
    formulationId: Formulation['id'];
}


// Function to fetch specific formulation by id from the API
async function fetchFormulationById(id: Formulation['id']): Promise<Formulation> {
    try {
        const response = await fetch(`http://localhost:3000/api/formulas/get-formula-by-id/${id}`);

        // Check if the response is OK (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        // Parse the response as JSON
        const data = await response.json();

        // Validate the response with Zod
        const validatedData = FormulaSchema.parse(data);

        return validatedData;
    } catch (error) {
        console.error('Failed to fetch formula:', error);
        throw error; // re-throw the error for further handling if needed
    }
}


const ViewModal = ({ onClose, formulationId }: ViewModalPropType) => {

    const { data, error, isLoading, isError } = useQuery({
        queryKey: ["formulation", formulationId],
        queryFn: () => fetchFormulationById(formulationId),
    })

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
                {data && <div className="space-y-4 bg-white">
                    <h2 className="text-xl font-bold">Formula Details</h2>
                    <p className="text-lg font-semibold">{data.title}</p>
                    <table className="w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2 text-left">Aroma Chemical</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.formula_line?.map((line, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="border border-gray-300 px-4 py-2">{line.aroma_chemical.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">{line.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>}
            </div>

        </div >
    );
};

export default ViewModal; 