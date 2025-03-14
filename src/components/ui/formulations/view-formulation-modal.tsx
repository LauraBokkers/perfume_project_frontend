import { useEffect } from "react";
import CloseIcon from "../../icons/close-icon";
import { fetchFormulationById, type Formulation } from "./formulations-table";
import { useQuery } from "@tanstack/react-query";

interface ViewModalPropType {
    onClose: () => void;
    formulationId: Formulation['id'];
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
                {data && <div>
                    <div className="flex-col flex gap-2 py-2">
                        <h2 className="text-xl font-bold">Formula Details</h2>
                        <p className="text-lg font-semibold">{data.title}</p>
                    </div>
                    <div className="border-custom-background border-2 rounded-xl border-opacity-80 overflow-hidden">
                        <table>
                            <thead className="bg-custom-accentLight">
                                <tr>
                                    <th className="px-4 py-2 text-left">Aroma Chemical</th>
                                    <th className="px-4 py-2 text-left">Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.formula_line?.map((line, idx) => (
                                    <tr key={idx}>
                                        <td className="border px-4 py-2">{line.aroma_chemical.name}</td>
                                        <td className="border px-4 py-2">{line.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>


                }
            </div>
        </div >
    );
};

export default ViewModal;



