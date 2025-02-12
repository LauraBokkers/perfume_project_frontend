import { z } from 'zod';
import { DataTable } from "../generic-data-table";
import { Payment, columns } from "./formulations-columns"



// Define the Zod schema for the Formula type
const FormulaSchema = z.object({
    id: z.number(),
    title: z.string(),
    formulaLines: z.array(
        z.object({
            aroma_chemical: z.object({
                id: z.number(),
                name: z.string()
            }),
            quantity: z.number()
        })
    ).nullable()

});

export type Formula = z.infer<typeof FormulaSchema>



// Function to fetch formulas from the API
async function fetchFormulas(): Promise<Formula[]> {
    try {
        const response = await fetch('http://localhost:3000/api/formulas');

        // Check if the response is OK (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        // Parse the response as JSON
        const data = await response.json();

        // Validate the response with Zod
        const validatedData = FormulaSchema.array().parse(data);

        return validatedData;
    } catch (error) {
        console.error('Failed to fetch formulas:', error);
        throw error; // re-throw the error for further handling if needed
    }
}



// Function to post a new formula to the API
async function postFormula(newFormula: Omit<Formula, 'id'>): Promise<void> {
    const response = await fetch('http://localhost:3000/api/formulas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFormula),
    });

    if (!response.ok) {
        throw new Error(`Failed to post formula: ${response.statusText}`);
    }
}


async function deleteFormula(idToBeDeleted: Formula["id"]): Promise<void> {
    const response = await fetch(`http://localhost:3000/api/formulas/${idToBeDeleted}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`Failed to delete formula: ${response.statusText}`);
    }
}


async function editFormula({ id, title, formulaLines }: Formula): Promise<void> {
    const response = await fetch(`http://localhost:3000/api/formulas/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title,
            formulaLines: formulaLines?.map(line => ({
                aroma_chemical_id: line.aroma_chemical.id,
                quantity: line.quantity
            }))

        })
    });

    if (!response.ok) {
        throw new Error(`Failed to edit formula: ${response.statusText}`);
    }
}





export default function FormulationsTable() {


    return (
        <div className="container mx-auto py-10">
            <h1>Formulations! TEST</h1>
            <DataTable columns={columns} data={data} />
        </div>

    )
}