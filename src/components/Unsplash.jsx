import React, { useState } from 'react'
import './styles/Images.css'

export default function Unsplash() {
  const [query, setQuery] = useState('nature')
  const defaultKey = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_UNSPLASH_ACCESS_KEY || '' : ''
  const [key, setKey] = useState(defaultKey)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastApi, setLastApi] = useState(null)
  const [showApi, setShowApi] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  async function search() {
    if (!key) return setError('Provide Unsplash Access Key')
    setLoading(true)
    setError(null)
    try {
      const url = 'https://api.unsplash.com/search/photos?query=' + encodeURIComponent(query)
      setLastApi(url + '&client_id=YOUR_KEY')
      const res = await fetch(url, { headers: { Authorization: 'Client-ID ' + key } })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      setResults(data.results || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="img-section">
      <div className="img-header">
        <h3>Unsplash</h3>
        <div className="img-actions">
          <button className="info-btn" onClick={() => setShowInfo(true)}>i</button>
          <button className="view-api" onClick={() => setShowApi(s => !s)}>View API</button>
        </div>
      </div>

      <div className="img-controls">
        <input placeholder="Search query" value={query} onChange={e => setQuery(e.target.value)} />
        <input placeholder="Unsplash Access Key (or set VITE_UNSPLASH_ACCESS_KEY in .env)" value={key} onChange={e => setKey(e.target.value)} />
        <button onClick={search} className="primary">Search</button>
      </div>
      {defaultKey && <div style={{ marginTop: 6, color: '#666', fontSize: 12 }}>Using `VITE_UNSPLASH_ACCESS_KEY` from .env</div>}

      {showApi && lastApi && (
        <div className="api-panel small">
          <pre className="api-url">{lastApi}</pre>
        </div>
      )}

      {loading && <div className="img-loading">Loading…</div>}
      {error && <div className="img-error">{error}</div>}

      <div className="img-grid">
        {results.map(r => (
          <div className="img-card" key={r.id}>
            <img src={r.urls.small} alt={r.alt_description || r.description || 'Unsplash'} />
            <div className="img-meta">{r.user?.name}</div>
          </div>
        ))}
      </div>

      {showInfo && (
        <div className="modal-overlay" onClick={() => setShowInfo(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowInfo(false)}>×</button>
            <h4>Unsplash API — Quick Implementation</h4>
            <p>Base URL: <code>https://api.unsplash.com/search/photos</code></p>
            <pre className="api-snippet">GET https://api.unsplash.com/search/photos?query=nature
Headers: Authorization: Client-ID YOUR_ACCESS_KEY
Response: results[] -> urls.small, user.name</pre>
            <p>For production keep the Access Key on your backend; use server-side proxy for requests if needed.</p>
          </div>
        </div>
      )}
    </section>
  )
}
