import AromachemicalsTable from './components/ui/aromachemicals/aromachemicals-table'
import FormulationsTable from './components/ui/formulations/formulations-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function App() {

  return (
    <div className='bg-custom-background w-screen h-screen flex flex-col items-center gap-4'>
      <Tabs defaultValue="aromachemicals" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="aromachemicals">Aromachemicals</TabsTrigger>
          <TabsTrigger value="formulations">Formulations</TabsTrigger>
        </TabsList>
        <TabsContent value="aromachemicals"><AromachemicalsTable /></TabsContent>
        <TabsContent value="formulations"><FormulationsTable /></TabsContent>
      </Tabs>

    </div>
  )
}

export default App
