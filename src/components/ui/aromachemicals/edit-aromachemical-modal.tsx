import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  OdorStrength,
  OdorStrengthSchema,
  Persistence,
  PersistenceSchema,
  Solvent,
  SolventSchema,
  Supplier,
  SupplierSchema,
  type Aromachemical,
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

interface ModalPropType {
  onClose: () => void;
  handleSubmit: ({ ...props }: Aromachemical) => void;
  aromachemical: Aromachemical;
  isPending: boolean;
}

const EditModal = ({
  onClose,
  handleSubmit,
  aromachemical,
  isPending,
}: ModalPropType) => {
  const [name, setName] = useState<string>(aromachemical.name);
  const [description, setDescription] = useState(
    aromachemical.description ?? ""
  );

  const [scentCategories, setScentCategories] = useState<ScentCategory[]>(
    aromachemical.scent_category ?? []
  );
  const [odorStrength, setOdorStrength] = useState<OdorStrength>(
    aromachemical.odor_strength ?? odorStrengthOptions[0].value
  );
  const [persistence, setPersistence] = useState<Persistence>(
    aromachemical.persistence ?? persistenceOptions[0].value
  );
  const [dilutionMaterial, setDilutionMaterial] = useState<Solvent>(
    aromachemical.dilution_material ?? solventOptions[0].value
  );
  const [supplier, setSupplier] = useState<Supplier>(
    aromachemical.supplier ?? supplierOptions[0].value
  );
  const [ifraLimit, setIfraLimit] = useState(aromachemical.IFRA_limit ?? "");

  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="fixed inset-0 z-50 mx-2 flex items-center justify-center backdrop-brightness-75">
      <div
        className="shadow-hover relative flex flex-col gap-6 rounded-xl bg-white px-6 py-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute right-4 top-4 h-4 w-4 cursor-pointer"
          onClick={() => onClose()}
        >
          <CloseButton onClose={onClose} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit({
              id: aromachemical.id,
              name: name,
              description: description,
              scent_category: scentCategories,
              odor_strength: odorStrength,
              persistence: persistence,
              dilution_material: dilutionMaterial,
              IFRA_limit: ifraLimit,
              supplier: supplier,
            });
            onClose();
          }}
        >
          <div className="py-3">
            <label htmlFor="name" className="block mb-1">
              Name:
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border border-gray-300 rounded px-3 py-1"
            />
          </div>

          <div className="py-3">
            <label htmlFor="description" className="mt-2 mb-1 block">
              Description:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full resize-y mb-4"
            />
          </div>

          <div className="flex flex-col items-start gap-4 mb-10 mt-4">
            <label htmlFor="scent_category" className="whitespace-nowrap">
              Scent Categorie(s):
            </label>
            <Button
              onClick={() => setIsModalOpen(true)}
              type="button"
              className="bg-blue-600 text-white py-2 px-4 rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Select scent category('s)
            </Button>
            {isModalOpen && (
              <ScentCategoryModal
                setScentCategories={setScentCategories}
                onClose={() => setIsModalOpen(false)}
                initialScentCategories={scentCategories}
              />
            )}
            <div className="flex flex-row gap-2 min-w-fit">
              {scentCategories.map((scentCategory, idx) => (
                <div
                  key={idx}
                  className="text-sm p-2 rounded-md text-white bg-blue-500"
                >
                  {scentCategory.category}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="odor_strength" className="mt-2 mb-2 block">
              Odor Strength:
            </label>
            <select
              id="odor_strength"
              value={odorStrength}
              onChange={(e) => {
                const odorStrength = OdorStrengthSchema.parse(e.target.value);
                setOdorStrength(odorStrength);
              }}
              className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
            >
              {odorStrengthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="ifra_limit" className="mt-2 mb-2 block">
              IFRA Limit:
            </label>
            <input
              type="text"
              id="ifra_limit"
              value={ifraLimit}
              onChange={(e) => setIfraLimit(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full resize-y mb-4"
            />
          </div>

          <div>
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
              className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
            >
              {supplierOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="persistence" className="mt-2 mb-2 block">
              Persistence:
            </label>
            <select
              id="persistence"
              value={persistence}
              onChange={(e) => {
                const persistence = PersistenceSchema.parse(e.target.value);
                setPersistence(persistence);
              }}
              className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
            >
              {persistenceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="dilution_material" className="mt-2 mb-2 block">
              Dilution Material:
            </label>
            <select
              id="dilution_material"
              value={dilutionMaterial}
              onChange={(e) => {
                const dilutionMaterial = SolventSchema.parse(e.target.value);
                setDilutionMaterial(dilutionMaterial);
              }}
              className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
            >
              {solventOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 mt-8 text-white py-2 px-4 rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Submit
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 ml-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
