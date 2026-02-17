import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import WikiExplorer from './components/WikiExplorer'
import OpenLibraryExplorer from './components/OpenLibraryExplorer'
import Unsplash from './components/Unsplash'

import './App.css'

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Navbar onToggle={() => setSidebarOpen(s => !s)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main style={{ padding: '1.25rem', paddingTop: '76px', maxWidth: 1200, margin: '0 auto' }}>
        <WikiExplorer />
        <OpenLibraryExplorer />

        <h2 style={{ marginTop: 24 }}>Image APIs</h2>
        <Unsplash />
      </main>
    </>
  )
}

export default App
