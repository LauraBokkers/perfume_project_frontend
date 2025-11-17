import {
  OdorStrength,
  Persistence,
  Supplier,
  Solvent,
} from "../../../data-services/fetch-aromachemicals";

export const odorStrengthOptions: { value: OdorStrength; label: string }[] = [
  { value: "Undefined", label: "Unknown" },
  { value: "Very_weak", label: "Very weak" },
  { value: "Weak", label: "Weak" },
  { value: "Medium", label: "Medium" },
  { value: "Strong", label: "Strong" },
  { value: "Very_strong", label: "Very strong" },
];

export const persistenceOptions: { value: Persistence; label: string }[] = [
  { value: "Undefined", label: "Unknown" },
  { value: "Top", label: "Top" },
  { value: "High", label: "High" },
  { value: "Middle", label: "Middle" },
  { value: "Bottom", label: "Bottom" },
  { value: "Base", label: "Base" },
];

export const supplierOptions: { value: Supplier; label: string }[] = [
  { value: "Undefined", label: "Unknown" },
  { value: "IFF", label: "IFF" },
  { value: "Firmenich", label: "Firmenich" },
  { value: "Symrise", label: "Symrise" },
  { value: "Givaudan", label: "Givaudan" },
  { value: "Hekserij", label: "Hekserij" },
];

export const solventOptions: { value: Solvent; label: string }[] = [
  { value: "Undefined", label: "Unknown" },
  { value: "DPG", label: "DPG" },
  { value: "Perfumers_alcohol", label: "Perfumer's Alcohol" },
  { value: "IPM", label: "IPM" },
];
