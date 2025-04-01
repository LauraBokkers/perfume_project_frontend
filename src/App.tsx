import AromachemicalsTable from './components/ui/aromachemicals/aromachemicals-table'
import FormulationsTable from './components/ui/formulations/formulations-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ScentCategoriesTable from './components/ui/scent-categories/scent-category-table'

function App() {

  return (
    <div className='bg-custom-background w-screen h-screen overflow-scroll flex flex-col items-center gap-4 p-12 px-28 font-roboto'>
      <Tabs defaultValue="aromachemicals" className="w-full">
        <TabsList className='w-full rounded-lg '>
          <TabsTrigger value="aromachemicals">Aromachemicals</TabsTrigger>
          <TabsTrigger value="formulations">Formulations</TabsTrigger>
          <TabsTrigger value="scent-categories">Scent Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="aromachemicals"><AromachemicalsTable /></TabsContent>
        <TabsContent value="formulations"><FormulationsTable /></TabsContent>
        <TabsContent value="scent-categories"><ScentCategoriesTable /></TabsContent>
      </Tabs>

    </div>
  )
}

export default App
