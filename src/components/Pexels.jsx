import React, { useState } from 'react'
import './styles/Images.css'

export default function Pexels() {
  const [query, setQuery] = useState('technology')
  const [key, setKey] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastApi, setLastApi] = useState(null)
  const [showApi, setShowApi] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  async function search() {
    if (!key) return setError('Provide Pexels API Key')
    setLoading(true)
    setError(null)
    try {
      const url = 'https://api.pexels.com/v1/search?query=' + encodeURIComponent(query)
      setLastApi(url)
      const res = await fetch(url, { headers: { Authorization: key } })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      setResults(data.photos || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="img-section">
      <div className="img-header">
        <h3>Pexels</h3>
        <div className="img-actions">
          <button className="info-btn" onClick={() => setShowInfo(true)}>i</button>
          <button className="view-api" onClick={() => setShowApi(s => !s)}>View API</button>
        </div>
      </div>

      <div className="img-controls">
        <input placeholder="Search query" value={query} onChange={e => setQuery(e.target.value)} />
        <input placeholder="Pexels API Key" value={key} onChange={e => setKey(e.target.value)} />
        <button onClick={search} className="primary">Search</button>
      </div>

      {showApi && lastApi && (
        <div className="api-panel small"><pre className="api-url">{lastApi}</pre></div>
      )}

      {loading && <div className="img-loading">Loading…</div>}
      {error && <div className="img-error">{error}</div>}

      <div className="img-grid">
        {results.map(p => (
          <div className="img-card" key={p.id}>
            <img src={p.src.medium} alt={p.alt || p.photographer} />
            <div className="img-meta">{p.photographer}</div>
          </div>
        ))}
      </div>

      {showInfo && (
        <div className="modal-overlay" onClick={() => setShowInfo(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowInfo(false)}>×</button>
            <h4>Pexels API — Quick Implementation</h4>
            <p>Base URL: <code>https://api.pexels.com/v1/search</code></p>
            <pre className="api-snippet">GET https://api.pexels.com/v1/search?query=technology
Headers: Authorization: YOUR_API_KEY
Response: photos[] -> src.medium, photographer</pre>
            <p>Keep your key secure; prefer server-side calls for production.</p>
          </div>
        </div>
      )}
    </section>
  )
}
