import '@/index.css'
import 'unfonts.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Header from '@/components/header'
import App from '@/App.tsx'
import Footer from '@/components/footer.tsx'
import Nav from '@/components/nav'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="flex justify-center flex-col items-center pb-4 pt-12 gap-y-20">
      <Header />
      <div className="flex flex-row gap-x-60">
        <Nav />
        <App />
        <div className="w-48" />
      </div>
      <Footer />
    </div>
  </StrictMode>
)
