import React from 'react'
import './styles/Nav.css'

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`} role="navigation" aria-hidden={!isOpen}>
        <div className="sidebar-header">
          <h3>API-Collection</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close sidebar">×</button>
        </div>
        <nav className="sidebar-nav">
          <a href="#apis">APIs</a>
          <a href="#tests">Tests</a>
          <a href="#examples">Examples</a>
          <a href="#about">About</a>
        </nav>
      </div>
      <div className={`overlay ${isOpen ? 'visible' : ''}`} onClick={onClose} />
    </>
  )
}
