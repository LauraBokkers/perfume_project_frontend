import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CloseIcon from "../../icons/close-icon";
import { Aromachemical, AromachemicalSchema } from "./aromachemicals-table";

function ErrorLabel({ message }: { message: string }) {
    return <div className="text-xs text-red-600">{message}</div>
}

type ModalPropType = {
    onClose: () => void;
    onAddAromachemical: ({ ...props }: Omit<Aromachemical, "id">) => void;
    isPending: boolean;
}

function AddModal({ onClose, onAddAromachemical, isPending }: ModalPropType) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [scentCategory, setScentCategory] = useState("");
    const [odorStrength, setOdorStrength] = useState("");
    const [persistence, setPersistence] = useState("");
    const [dilutionMaterial, setDilutionMaterial] = useState("");
    const [ifraLimit, setIfraLimit] = useState("");
    const [supplier, setSupplier] = useState("");
    const [errors, setErrors] = useState<{
        name?: string;
        description?: string;
    } | null>(null)

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            onClose();
        }
    }

    function handleSubmit(e: React.FormEvent) {
        setErrors(null);
        e.preventDefault();
        const newAromachemical = {
            name,
            description,
            scent_category: scentCategory,
            odor_strength: odorStrength,
            persistence: persistence,
            dilution_material: dilutionMaterial,
            ifraLimit,
            supplier: supplier
        }
        const { data, success, error } = AromachemicalSchema.safeParse(newAromachemical)

        if (!success) {
            setErrors({
                name: error.formErrors.fieldErrors.name?.[0],
                description: error.formErrors.fieldErrors.description?.[0]
            })
            return;
        }

        onAddAromachemical(data);
        onClose();
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
            className={"fixed inset-0 z-10 p-10 flex items-center justify-center backdrop-brightness-75"}
        >
            <div
                className="shadow-hover relative flex my-10 lg:overflow-hidden overflow-y-scroll max-h-full w-full lg:w-1/2 flex-col rounded-xl bg-white px-10 py-8"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="absolute right-4 top-4 h-4 w-4 cursor-pointer"
                    onClick={() => onClose()}
                >
                    <CloseIcon height={14} width={14} fill="black" />
                </div>
                <form
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <div className="grid lg:grid-cols-2 gap-8 grid-cols-1">
                        <div>
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
                                {errors?.name && <ErrorLabel message={errors.name} />}
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
                            {errors?.description && <ErrorLabel message={errors.description} />}
                            <div>
                                <label htmlFor="scent_category" className="mt-2 mb-2 block">Scent Categorie(s):</label>

                                <input
                                    type='text'
                                    id="scent_category"
                                    value={scentCategory}
                                    onChange={(e) => setScentCategory(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 w-full resize-y mb-4"
                                />
                            </div>
                            <div>
                                <label htmlFor="odor_strength" className="mt-2 mb-2 block">Odor Strength:</label>
                                <select
                                    id="odor_strength"
                                    value={odorStrength}
                                    onChange={(e) => setOdorStrength(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
                                >
                                    <option value="" disabled>Select an option</option>
                                    <option value="Very_weak">Very Weak</option>
                                    <option value="Weak">Weak</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Strong">Strong</option>
                                    <option value="Very_strong">Very Strong</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <div>
                                <label htmlFor="ifra_limit" className="mt-2 mb-2 block">IFRA Limit:</label>
                                <input
                                    type='text'
                                    id="ifra_limit"
                                    value={ifraLimit}
                                    onChange={(e) => setIfraLimit(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 w-full resize-y mb-4"
                                />
                            </div>
                            <div>
                                <label htmlFor="supplier" className="mt-2 mb-2 block">Supplier:</label>
                                <select
                                    id="supplier"
                                    value={supplier}
                                    onChange={(e) => setSupplier(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
                                >
                                    <option value="" disabled>Select a supplier</option>
                                    <option value="IFF">IFF</option>
                                    <option value="Firmenich">Firmenich</option>
                                    <option value="Symrise">Symrise</option>
                                    <option value="Givaudan">Givaudan</option>
                                    <option value="Hekserij">Hekserij</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="persistence" className="mt-2 mb-2 block">Persistence:</label>
                                <select
                                    id="persistence"
                                    value={persistence}
                                    onChange={(e) => setPersistence(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
                                >
                                    <option value="" disabled>Select persistence</option>
                                    <option value="Top">Top</option>
                                    <option value="High">High</option>
                                    <option value="Middle">Middle</option>
                                    <option value="Bottom">Bottom</option>
                                    <option value="Base">Base</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="dilution_material" className="mt-2 mb-2 block">Dilution Material:</label>
                                <select
                                    id="dilution_material"
                                    value={dilutionMaterial}
                                    onChange={(e) => setDilutionMaterial(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
                                >
                                    <option value="" disabled>Select a solvent</option>
                                    <option value="DPG">DPG</option>
                                    <option value="Perfumers_alcohol">Perfumers Alcohol</option>
                                    <option value="IPM">IPM</option>
                                </select>
                            </div></div>
                    </div>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-blue-600 mt-8 text-white py-2 px-4 rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Submit
                    </Button>
                </form>
            </div >
        </div >
    );
};

export default AddModal;