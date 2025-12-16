import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Aromachemical,
  AddAromachemicalSchema,
  OdorStrength,
  Persistence,
  Solvent,
  Supplier,
  SupplierSchema,
  PersistenceSchema,
  SolventSchema,
  OdorStrengthSchema,
} from "../../../data-services/fetch-aromachemicals";
import ScentCategoryModal, {
  ScentCategory,
} from "./select-scent-category-modal";
import {
  odorStrengthOptions,
  persistenceOptions,
  solventOptions,
  supplierOptions,
} from "./aromachemical-types";
import { CloseButton } from "../close-button";

function ErrorLabel({ message }: { message: string }) {
  return <div className="text-xs text-red-600">{message}</div>;
}

type ModalPropType = {
  onClose: () => void;
  onAddAromachemical: ({ ...props }: Omit<Aromachemical, "id">) => void;
  isPending: boolean;
};

function AddModal({ onClose, onAddAromachemical, isPending }: ModalPropType) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [scentCategories, setScentCategories] = useState<ScentCategory[]>([]);
  const [odorStrength, setOdorStrength] = useState<OdorStrength>(
    odorStrengthOptions[0].value
  );
  const [persistence, setPersistence] = useState<Persistence>(
    persistenceOptions[0].value
  );
  const [dilutionMaterial, setDilutionMaterial] = useState<Solvent>(
    solventOptions[0].value
  );
  const [supplier, setSupplier] = useState<Supplier>(supplierOptions[0].value);
  const [ifraLimit, setIfraLimit] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      scent_category: scentCategories,
      odor_strength: odorStrength,
      persistence: persistence,
      dilution_material: dilutionMaterial,
      IFRA_limit: ifraLimit,
      supplier: supplier,
    };
    const { data, success, error } =
      AddAromachemicalSchema.safeParse(newAromachemical);

    if (!success) {
      console.log(error);
      setErrors({
        name: error.formErrors.fieldErrors.name?.[0],
        description: error.formErrors.fieldErrors.description?.[0],
      });
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
      className={
        "fixed inset-0 z-10 p-10 flex items-center justify-center backdrop-brightness-75"
      }
    >
      <div
        className="shadow-hover relative flex my-10 lg:overflow-hidden overflow-y-scroll max-h-full w-full lg:w-1/2 flex-col rounded-xl bg-white px-10 py-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute right-4 top-4 h-4 w-4 cursor-pointer"
          onClick={() => onClose()}
        >
          <CloseButton onClose={onClose} />
        </div>

        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-4 rounded-xl bg-custom-accentLight px-4 py-3 bg-opacity-50">
            <div className="grid lg:grid-cols-2 gap-8 grid-cols-1">
              <div>
                <div className="max-w-[700px] max-h-[500px] overflow-auto p-4 rounded-xl bg-custom-table space-y-4 mb-4">
                  <label htmlFor="name" className="block mb-1">
                    Name:
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border border-gray-300 rounded-lg px-3 py-1 w-full"
                  />
                  {errors?.name && <ErrorLabel message={errors.name} />}
                </div>
                <div className="max-w-[700px] max-h-[500px] overflow-auto p-4 rounded-xl bg-custom-table space-y-4 mb-4">
                  <label htmlFor="description" className="mt-2 mb-2 block">
                    Description:
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full resize-y mb-4"
                  />
                </div>
                {errors?.description && (
                  <ErrorLabel message={errors.description} />
                )}
                <div className="max-w-[700px] max-h-[500px] overflow-auto p-4 rounded-xl bg-custom-table space-y-4 flex flex-col items-start gap-4 mb-4">
                  <label htmlFor="scent_category" className="whitespace-nowrap">
                    Scent Categorie(s):
                  </label>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    type="button"
                    className="rounded-xl justify-center w-[155px] hover:bg-custom-accentLight/60"
                  >
                    {" "}
                    Select scent categories
                  </Button>
                  {isModalOpen && (
                    <ScentCategoryModal
                      setScentCategories={setScentCategories}
                      onClose={() => setIsModalOpen(false)}
                      initialScentCategories={scentCategories}
                    />
                  )}
                  <div className="flex flex-row gap-2 min-w-fit">
                    {scentCategories.map((scentCategory, idx) => {
                      return (
                        <div
                          key={idx}
                          className="text-sm p-2 rounded-md text-white bg-blue-500"
                        >
                          {scentCategory.category}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="max-w-[700px] max-h-[500px] overflow-auto p-4 rounded-xl bg-custom-table space-y-4">
                  <label htmlFor="odor_strength" className="mt-2 mb-2 block">
                    Odor Strength:
                  </label>
                  <select
                    id="odor_strength"
                    value={odorStrength}
                    onChange={(e) => {
                      const odorStrength = OdorStrengthSchema.parse(
                        e.target.value
                      );
                      setOdorStrength(odorStrength);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-4"
                  >
                    {odorStrengthOptions.map((option) => {
                      return (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div>
                <div className="max-w-[700px] max-h-[500px] overflow-auto p-4 rounded-xl bg-custom-table space-y-4 mb-4">
                  <label htmlFor="ifra_limit" className="mt-2 mb-2 block">
                    IFRA Limit:
                  </label>
                  <input
                    type="text"
                    id="ifra_limit"
                    value={ifraLimit}
                    onChange={(e) => setIfraLimit(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full resize-y mb-4"
                  />
                </div>
                <div className="max-w-[700px] max-h-[500px] overflow-auto p-4 rounded-xl bg-custom-table space-y-4 mb-4">
                  <label htmlFor="supplier" className="mt-2 mb-2 block">
                    Supplier:
                  </label>
                  <select
                    id="supplier"
                    value={supplier}
                    onChange={(e) => {
                      const supplier = SupplierSchema.parse(e.target.value);
                      setSupplier(supplier);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-4"
                  >
                    {supplierOptions.map((option) => {
                      return (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="max-w-[700px] max-h-[500px] overflow-auto p-4 rounded-xl bg-custom-table space-y-4 mb-4">
                  <label htmlFor="persistence" className="mt-2 mb-2 block">
                    Persistence:
                  </label>
                  <select
                    id="persistence"
                    value={persistence}
                    onChange={(e) => {
                      const persistence = PersistenceSchema.parse(
                        e.target.value
                      );
                      setPersistence(persistence);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-4"
                  >
                    {persistenceOptions.map((option) => {
                      return (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="max-w-[700px] max-h-[500px] overflow-auto p-4 rounded-xl bg-custom-table space-y-4 mb-4">
                  <label
                    htmlFor="dilution_material"
                    className="mt-2 mb-2 block"
                  >
                    Dilution Material:
                  </label>
                  <select
                    id="dilution_material"
                    value={dilutionMaterial}
                    onChange={(e) => {
                      const dilutionMaterial = SolventSchema.parse(
                        e.target.value
                      );
                      setDilutionMaterial(dilutionMaterial);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-4"
                  >
                    {solventOptions.map((option) => {
                      return (
                        <option
                          className="rounded-lg"
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-start">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 mt-8 text-white py-2 px-4 rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddModal;
