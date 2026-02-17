import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import './App.css'

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Navbar onToggle={() => setSidebarOpen(s => !s)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main style={{ padding: '1.25rem', paddingTop: '76px', maxWidth: 1200, margin: '0 auto' }}>
        <h1>Welcome to API-Collection</h1>
        <p style={{ color: '#444' }}>
          Use the sidebar (hamburger) to browse APIs, tests and examples.
        </p>
        <section id="apis">
          <h2>APIs</h2>
          <p>Placeholder for API list and quick actions.</p>
        </section>
      </main>
    </>
  )
}

export default App
