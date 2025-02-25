import AromachemicalsTable from './components/ui/aromachemicals/aromachemicals-table'
import FormulationsTable from './components/ui/formulations/formulations-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function App() {

  return (
    <div className='bg-custom-background w-screen h-screen overflow-scroll flex flex-col items-center gap-4 p-12 font-roboto'>
      <Tabs defaultValue="aromachemicals" className="w-full max-w-6xl">
        <TabsList className='w-full rounded-lg '>
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
