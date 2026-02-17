import React, { useState, useEffect } from 'react'
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
  const [endpoint, setEndpoint] = useState('search')
  const [perPage, setPerPage] = useState(12)
  const [page, setPage] = useState(1)
  const [orientation, setOrientation] = useState('')
  const [color, setColor] = useState('')
  const [count, setCount] = useState(1)
  const [photoId, setPhotoId] = useState('')
  const [photoDetail, setPhotoDetail] = useState(null)
  const [photoStats, setPhotoStats] = useState(null)
  const [collections, setCollections] = useState([])
  const [collectionQuery, setCollectionQuery] = useState('')
  const [userName, setUserName] = useState('')
  const [userPhotos, setUserPhotos] = useState([])

  async function search() {
    if (!key) return setError('Provide Unsplash Access Key')
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.set('query', query)
      params.set('per_page', String(perPage))
      params.set('page', String(page))
      if (orientation) params.set('orientation', orientation)
      if (color) params.set('color', color)
      const url = 'https://api.unsplash.com/search/photos?' + params.toString()
      setLastApi(url + '\n\nHeaders:\nAuthorization: Client-ID <REDACTED>')
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

  async function getRandom() {
    if (!key) return setError('Provide Unsplash Access Key')
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (query) params.set('query', query)
      if (count) params.set('count', String(count))
      if (orientation) params.set('orientation', orientation)
      const url = 'https://api.unsplash.com/photos/random?' + params.toString()
      setLastApi(url + '\n\nHeaders:\nAuthorization: Client-ID <REDACTED>')
      const res = await fetch(url, { headers: { Authorization: 'Client-ID ' + key } })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      // random returns object or array based on count
      setResults(Array.isArray(data) ? data : [data])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function listPhotos() {
    if (!key) return setError('Provide Unsplash Access Key')
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.set('per_page', String(perPage))
      params.set('page', String(page))
      const url = 'https://api.unsplash.com/photos?' + params.toString()
      setLastApi(url + '\n\nHeaders:\nAuthorization: Client-ID <REDACTED>')
      const res = await fetch(url, { headers: { Authorization: 'Client-ID ' + key } })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      setResults(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function getPhotoById() {
    if (!key) return setError('Provide Unsplash Access Key')
    if (!photoId) return setError('Provide photo ID')
    setLoading(true)
    setError(null)
    try {
      const url = 'https://api.unsplash.com/photos/' + encodeURIComponent(photoId)
      setLastApi(url + '\n\nHeaders:\nAuthorization: Client-ID <REDACTED>')
      const res = await fetch(url, { headers: { Authorization: 'Client-ID ' + key } })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      setPhotoDetail(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function getPhotoStatistics() {
    if (!key) return setError('Provide Unsplash Access Key')
    if (!photoId) return setError('Provide photo ID')
    setLoading(true)
    setError(null)
    try {
      const url = 'https://api.unsplash.com/photos/' + encodeURIComponent(photoId) + '/statistics'
      setLastApi(url + '\n\nHeaders:\nAuthorization: Client-ID <REDACTED>')
      const res = await fetch(url, { headers: { Authorization: 'Client-ID ' + key } })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      setPhotoStats(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function searchCollections() {
    if (!key) return setError('Provide Unsplash Access Key')
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.set('query', collectionQuery || query)
      params.set('per_page', String(perPage))
      params.set('page', String(page))
      const url = 'https://api.unsplash.com/search/collections?' + params.toString()
      setLastApi(url + '\n\nHeaders:\nAuthorization: Client-ID <REDACTED>')
      const res = await fetch(url, { headers: { Authorization: 'Client-ID ' + key } })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      setCollections(data.results || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function getUserDetails() {
    if (!key) return setError('Provide Unsplash Access Key')
    if (!userName) return setError('Provide username')
    setLoading(true)
    setError(null)
    try {
      const url = 'https://api.unsplash.com/users/' + encodeURIComponent(userName)
      setLastApi(url + '\n\nHeaders:\nAuthorization: Client-ID <REDACTED>')
      const res = await fetch(url, { headers: { Authorization: 'Client-ID ' + key } })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      setPhotoDetail(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function getUserPhotos() {
    if (!key) return setError('Provide Unsplash Access Key')
    if (!userName) return setError('Provide username')
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.set('per_page', String(perPage))
      params.set('page', String(page))
      const url = `https://api.unsplash.com/users/${encodeURIComponent(userName)}/photos?` + params.toString()
      setLastApi(url + '\n\nHeaders:\nAuthorization: Client-ID <REDACTED>')
      const res = await fetch(url, { headers: { Authorization: 'Client-ID ' + key } })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      setUserPhotos(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // If a key is provided via Vite env, automatically perform an initial search
  useEffect(() => {
    if (defaultKey && !key) setKey(defaultKey)
    if (key) {
      // perform a first search once on mount when key exists
      search()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        <select value={endpoint} onChange={e => setEndpoint(e.target.value)}>
          <option value="search">Search Photos</option>
          <option value="random">Random Photo(s)</option>
          <option value="list">List Photos (Feed)</option>
          <option value="photo">Get Photo by ID</option>
          <option value="stats">Photo Statistics</option>
          <option value="collections">Search Collections</option>
          <option value="user">User Details / Photos</option>
        </select>

        {endpoint === 'search' && (
          <>
            <input placeholder="Search query" value={query} onChange={e => setQuery(e.target.value)} />
            <input placeholder="per_page" value={perPage} onChange={e => setPerPage(Number(e.target.value || 0))} />
            <input placeholder="page" value={page} onChange={e => setPage(Number(e.target.value || 1))} />
            <input placeholder="orientation (landscape|portrait|squarish)" value={orientation} onChange={e => setOrientation(e.target.value)} />
            <input placeholder="color (e.g. blue)" value={color} onChange={e => setColor(e.target.value)} />
            <button onClick={search} className="primary">Search</button>
          </>
        )}

        {endpoint === 'random' && (
          <>
            <input placeholder="query" value={query} onChange={e => setQuery(e.target.value)} />
            <input placeholder="count" value={count} onChange={e => setCount(Number(e.target.value || 1))} />
            <input placeholder="orientation" value={orientation} onChange={e => setOrientation(e.target.value)} />
            <button onClick={getRandom} className="primary">Get Random</button>
          </>
        )}

        {endpoint === 'list' && (
          <>
            <input placeholder="per_page" value={perPage} onChange={e => setPerPage(Number(e.target.value || 10))} />
            <input placeholder="page" value={page} onChange={e => setPage(Number(e.target.value || 1))} />
            <button onClick={listPhotos} className="primary">List</button>
          </>
        )}

        {endpoint === 'photo' && (
          <>
            <input placeholder="photo id" value={photoId} onChange={e => setPhotoId(e.target.value)} />
            <button onClick={getPhotoById} className="primary">Get Photo</button>
          </>
        )}

        {endpoint === 'stats' && (
          <>
            <input placeholder="photo id" value={photoId} onChange={e => setPhotoId(e.target.value)} />
            <button onClick={getPhotoStatistics} className="primary">Get Stats</button>
          </>
        )}

        {endpoint === 'collections' && (
          <>
            <input placeholder="collection query" value={collectionQuery} onChange={e => setCollectionQuery(e.target.value)} />
            <input placeholder="per_page" value={perPage} onChange={e => setPerPage(Number(e.target.value || 10))} />
            <input placeholder="page" value={page} onChange={e => setPage(Number(e.target.value || 1))} />
            <button onClick={searchCollections} className="primary">Search Collections</button>
          </>
        )}

        {endpoint === 'user' && (
          <>
            <input placeholder="username" value={userName} onChange={e => setUserName(e.target.value)} />
            <input placeholder="per_page" value={perPage} onChange={e => setPerPage(Number(e.target.value || 10))} />
            <input placeholder="page" value={page} onChange={e => setPage(Number(e.target.value || 1))} />
            <button onClick={getUserDetails} className="primary">Get User</button>
            <button onClick={getUserPhotos} className="primary">Get User Photos</button>
          </>
        )}

        {/* Access key is read from Vite env (VITE_UNSPLASH_ACCESS_KEY) and not editable in UI */}
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
            <img src={r.urls?.small || r.urls?.regular || r.urls?.full || r.url} alt={r.alt_description || r.description || 'Unsplash'} />
            <div className="img-meta">{r.user?.name}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{r.likes ? `${r.likes} likes` : ''}</div>
            <button onClick={() => { setPhotoId(r.id); setPhotoDetail(null); }} style={{ marginTop: 6 }}>Select ID</button>
          </div>
        ))}
      </div>

      {collections.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <h4>Collections</h4>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {collections.map(c => (
              <div key={c.id} style={{ width: 220, border: '1px solid #eee', padding: 8, borderRadius: 8 }}>
                <div style={{ fontWeight: 600 }}>{c.title}</div>
                <div style={{ fontSize: 12, color: '#666' }}>{c.total_photos} photos</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {userPhotos.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <h4>User Photos</h4>
          <div className="img-grid">
            {userPhotos.map(p => (
              <div className="img-card" key={p.id}>
                <img src={p.urls?.small} alt={p.alt_description || 'Unsplash'} />
                <div className="img-meta">{p.user?.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {photoDetail && (
        <div style={{ marginTop: 12 }} className="api-panel">
          <h4>Detail</h4>
          <pre style={{ maxHeight: 300, overflow: 'auto' }}>{JSON.stringify(photoDetail, null, 2)}</pre>
        </div>
      )}

      {photoStats && (
        <div style={{ marginTop: 12 }} className="api-panel">
          <h4>Statistics</h4>
          <pre style={{ maxHeight: 300, overflow: 'auto' }}>{JSON.stringify(photoStats, null, 2)}</pre>
        </div>
      )}

      {showInfo && (
        <div className="modal-overlay" onClick={() => setShowInfo(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowInfo(false)}>×</button>
            <h4>Unsplash API — Reference</h4>
            <p>Base URL: <code>https://api.unsplash.com/</code></p>
            <p>Authentication (required):</p>
            <pre className="api-snippet">Header: Authorization: Client-ID YOUR_ACCESS_KEY
OR: use ?client_id=YOUR_ACCESS_KEY query parameter</pre>

            <h5>1) Search Photos</h5>
            <pre className="api-snippet">GET /search/photos
Example: https://api.unsplash.com/search/photos?query=technology&per_page=10&page=1
Params: query, per_page (max 30), page, orientation, color, content_filter, order_by</pre>

            <h5>2) Get Random Photo(s)</h5>
            <pre className="api-snippet">GET /photos/random
Example: https://api.unsplash.com/photos/random?query=nature&count=5
Params: query, count, orientation</pre>

            <h5>3) List Photos (Feed)</h5>
            <pre className="api-snippet">GET /photos
Example: https://api.unsplash.com/photos?per_page=10&page=1</pre>

            <h5>4) Get Single Photo by ID</h5>
            <pre className="api-snippet">{'GET /photos/{id}\nExample: https://api.unsplash.com/photos/Dwu85P9SOIk'}</pre>

            <h5>5) Photo Statistics</h5>
            <pre className="api-snippet">{'GET /photos/{id}/statistics\nReturns downloads, views, likes data for analytics'}</pre>

            <h5>6) Search Collections</h5>
            <pre className="api-snippet">GET /search/collections
Example: https://api.unsplash.com/search/collections?query=minimal</pre>

            <h5>7) User Details & Photos</h5>
            <pre className="api-snippet">{'GET /users/{username}\nGET /users/{username}/photos\nExample: https://api.unsplash.com/users/john_doe/photos?per_page=10'}</pre>

            <h5>Useful Fields</h5>
            <pre className="api-snippet">photo.urls.small
photo.urls.regular
photo.urls.full
photo.urls.raw
photo.alt_description
photo.user.name
photo.likes</pre>

            <p>Client note: this app reads your key from <code>VITE_UNSPLASH_ACCESS_KEY</code> in <code>.env</code> and keeps it out of the UI. For production, proxy requests through a backend to keep secrets safe and avoid CORS and abuse.</p>
          </div>
        </div>
      )}
    </section>
  )
}
