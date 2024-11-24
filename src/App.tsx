
import viteLogo from '/vite.svg'
import './App.css'
import TablePage from './components/ui/aromas/page'

function App() {

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>Aromachemicals</h1>
      <div>
        <TablePage />
      </div>
    </>
  )
}

export default App
