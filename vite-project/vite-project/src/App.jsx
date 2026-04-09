import './App.css'
import Country from './Country'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <Country />
    </ThemeProvider>
  )
}

export default App
