import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ResponsiveAppBar from './component/nav'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <>
    <ResponsiveAppBar/>
   
    </>
  // </StrictMode>,
)
