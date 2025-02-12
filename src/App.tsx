import AromachemicalsTable from './components/ui/aromachemicals/aromachemicals-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function App() {

  return (
    <div className='bg-custom-background w-screen h-screen flex flex-col items-center gap-4'>
      <h1 className='w-full text-center mt-12'>Aromachemicals</h1>
      <AromachemicalsTable />
    </div>
  )
}

export default App
