import AromachemicalsTable from "./components/ui/aromachemicals/aromachemicals-table";
import FormulationsTable from "./components/ui/formulations/formulations-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScentCategoriesTable from "./components/ui/scent-categories/scent-category-table";
import { useState } from "react";
import { z } from "zod";
import { HomeContent } from "./components/ui/home-content";

export const TabSchema = z.enum([
  "home",
  "aromachemicals",
  "formulations",
  "scent-categories",
]);
type Tab = z.infer<typeof TabSchema>;

function App() {
  const [tab, setTab] = useState<Tab>("home");

  return (
    <div className="bg-custom-background w-screen h-screen overflow-scroll flex flex-col items-center gap-4 p-8 px-4 md:px-28 font-roboto">
      <Tabs defaultValue="home" className="w-full" value={tab}>
        <TabsList className="w-full rounded-lg flex flex-col mb-10 md:mb-4 md:flex-row gap-1">
          <select
            id="odor_strength"
            className="border border-gray-300 rounded px-3 py-2 w-full mb-4 md:hidden"
            value={tab}
            onChange={(e) => {
              const tab = TabSchema.parse(e.target.value);
              setTab(tab);
            }}
          >
            <option value="home">
              {" "}
              <TabsTrigger value="home">Home</TabsTrigger>
            </option>
            <option value="aromachemicals">
              {" "}
              <TabsTrigger value="aromachemicals">Aromachemicals</TabsTrigger>
            </option>
            <option value="formulations">
              {" "}
              <TabsTrigger value="formulations">Formulations</TabsTrigger>
            </option>
            <option value="scent-categories">
              {" "}
              <TabsTrigger value="scent-categories">
                Scent Categories
              </TabsTrigger>
            </option>
          </select>
          <div className="hidden md:flex">
            <TabsTrigger onClick={() => setTab("home")} value="home">
              Home
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setTab("aromachemicals")}
              value="aromachemicals"
            >
              Aromachemicals
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setTab("formulations")}
              value="formulations"
            >
              Formulations
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setTab("scent-categories")}
              value="scent-categories"
            >
              Scent Categories
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="home">
          <HomeContent />
        </TabsContent>
        <TabsContent value="aromachemicals">
          <AromachemicalsTable />
        </TabsContent>
        <TabsContent value="formulations">
          <FormulationsTable />
        </TabsContent>
        <TabsContent value="scent-categories">
          <ScentCategoriesTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
