import { z } from "zod";
import { API_BASE_URL } from "@/constants";

// Define Enums
export const OdorStrengthSchema = z.enum([
  "Undefined",
  "Very_weak",
  "Weak",
  "Medium",
  "Strong",
  "Very_strong",
]);
export const SupplierSchema = z.enum([
  "Undefined",
  "IFF",
  "Firmenich",
  "Symrise",
  "Givaudan",
  "Hekserij",
]);

export const persistenceValues = [
  "Undefined",
  "Top",
  "High",
  "Middle",
  "Bottom",
  "Base",
] as const;

export const PersistenceSchema = z.enum(persistenceValues);

export const SolventSchema = z.enum([
  "Undefined",
  "DPG",
  "Perfumers_alcohol",
  "IPM",
]);

export type OdorStrength = z.infer<typeof OdorStrengthSchema>;
export type Supplier = z.infer<typeof SupplierSchema>;
export type Persistence = z.infer<typeof PersistenceSchema>;
export type Solvent = z.infer<typeof SolventSchema>;

// Define ScentCategory Schema
export const ScentCategorySchema = z.object({
  id: z.number(),
  category: z.string(),
});

// Define Aromachemical Schema
export const AddAromachemicalSchema = z.object({
  name: z
    .string()
    .min(3, "Naam moet minimaal 3 karakters hebben.")
    .max(50, "Naam mag niet langer zijn dan 50 karakters."),
  scent_category: z.array(ScentCategorySchema),
  odor_strength: OdorStrengthSchema.nullable(),
  persistence: PersistenceSchema.nullable(),
  dilution_material: SolventSchema.nullable(),
  description: z
    .string()
    .max(1000, "Beschrijving mag niet langer zijn dan 1000 karakters.")
    .nullable(),
  IFRA_limit: z.string().nullable(),
  supplier: SupplierSchema.nullable(),
});

export const AromachemicalSchema = AddAromachemicalSchema.extend({
  id: z.number(),
});

export type Aromachemical = z.infer<typeof AromachemicalSchema>;

// Function to fetch aromachemicals from the API
export async function fetchAromachemicals(): Promise<Aromachemical[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/aromachemicals`);

    // Check if the response is OK (status in the range 200-299)
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    // Parse the response as JSON
    const data = await response.json();

    // Validate the response with Zod
    const validatedData = AromachemicalSchema.array().parse(data);

    return validatedData;
  } catch (error) {
    console.error("Failed to fetch aromachemicals:", error);
    throw error; // re-throw the error for further handling if needed
  }
}
