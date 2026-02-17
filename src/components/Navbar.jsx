import React from 'react'
import './Nav.css'

export default function Navbar({ onToggle }) {
  return (
    <header className="nav-header">
      <div className="nav-left">
        <button className="hamburger" onClick={onToggle} aria-label="Open sidebar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="4" width="24" height="2" rx="1" fill="currentColor" />
            <rect y="11" width="24" height="2" rx="1" fill="currentColor" />
            <rect y="18" width="24" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>
        <div className="brand">API-Collection</div>
      </div>
    </header>
  )
}
