import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CartProvider } from './context/cart.tsx'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <CartProvider>
    <StrictMode>
      <Toaster
        // position="top-right"
        reverseOrder={false}
      />
      <App />
    </StrictMode>
  </CartProvider>
)
