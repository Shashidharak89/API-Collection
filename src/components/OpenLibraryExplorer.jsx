import React, { useState } from 'react'
import './styles/OpenLibrary.css'

export default function OpenLibraryExplorer() {
  const [mode, setMode] = useState('title') // 'title' or 'author'
  const [query, setQuery] = useState('harry potter')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [details, setDetails] = useState({}) // workKey -> details
  const [expanded, setExpanded] = useState({})
  const [lastApi, setLastApi] = useState(null)
  const [showApi, setShowApi] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const LIMIT = 10

  async function search(pageToFetch = 1, append = false) {
    if (!query.trim()) return setError('Enter a search term')
    setLoading(true)
    setError(null)
    try {
      const api = 'https://openlibrary.org/search.json'
      const params = new URLSearchParams()
      if (mode === 'title') params.set('title', query)
      else params.set('author', query)
      params.set('page', String(pageToFetch))
      params.set('limit', String(LIMIT))

      const url = `${api}?${params.toString()}`
      setLastApi(url)
      setShowApi(false)
      setCopied(false)
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const data = await res.json()

      const docs = data.docs || []
      setResults(prev => (append ? prev.concat(docs) : docs))
      setPage(pageToFetch)
      // OpenLibrary returns numFound and page sizes; compute hasMore
      const start = data.start || 0
      const numFound = data.numFound || 0
      setHasMore(start + docs.length < numFound)
    } catch (err) {
      setError('Search failed. ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadMore() {
    await search(page + 1, true)
  }

  async function fetchWorkDetails(workKey) {
    if (!workKey) return
    if (details[workKey]) return // already fetched
    try {
      setLoading(true)
      const clean = workKey.replace(/^/,'')
      const url = `https://openlibrary.org${workKey}.json`
      setLastApi(url)
      setShowApi(false)
      setCopied(false)
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const data = await res.json()
      setDetails(d => ({ ...d, [workKey]: data }))
    } catch (err) {
      setError('Failed to fetch work details. ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  function toggleExpand(workKey) {
    setExpanded(e => {
      const next = { ...e, [workKey]: !e[workKey] }
      if (next[workKey]) fetchWorkDetails(workKey)
      return next
    })
  }

  async function copyApi() {
    if (!lastApi) return
    try {
      await navigator.clipboard.writeText(lastApi)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // ignore
    }
  }

  return (
    <section className="ol-section">
      <div className="ol-header">
        <div className="ol-title-row">
          <h2>OpenLibrary Explorer</h2>
          <button className="info-btn" aria-label="About OpenLibrary Explorer" onClick={() => setShowInfo(true)}>i</button>
        </div>
        <div className="ol-controls">
          <div className="ol-modes">
            <button className={mode === 'title' ? 'active' : ''} onClick={() => setMode('title')}>Title</button>
            <button className={mode === 'author' ? 'active' : ''} onClick={() => setMode('author')}>Author</button>
          </div>
          <div className="view-api-wrap">
            <button className="view-api" onClick={() => setShowApi(s => !s)} aria-pressed={showApi}>View API</button>
          </div>
          <div className="ol-search">
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by title or author" />
            <button onClick={() => search(1, false)} className="primary">Search</button>
          </div>
        </div>
      </div>

      {loading && <div className="ol-loading">Loading…</div>}
      {error && <div className="ol-error">{error}</div>}

      {showApi && lastApi && (
        <div className="api-panel">
          <div className="api-header">API Endpoint</div>
          <pre className="api-url">{lastApi}</pre>
          <div className="api-actions">
            <button onClick={copyApi} className="copy-btn">{copied ? 'Copied' : 'Copy'}</button>
            <a className="open-api" href={lastApi} target="_blank" rel="noreferrer">Open</a>
            <code className="curl">curl "{lastApi}"</code>
          </div>
        </div>
      )}

      <ul className="ol-results">
        {results.map(doc => {
          const workKey = doc.key || doc.key // usually like "/works/OL82586W"
          const coverId = doc.cover_i
          const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : null
          return (
            <li key={doc.key || doc.cover_edition_key} className="ol-item">
              <div className="ol-item-left">
                <div className="cover">
                  {coverUrl ? <img src={coverUrl} alt={doc.title} /> : <div className="no-cover">No image</div>}
                </div>
              </div>
              <div className="ol-item-body">
                <div className="title-row">
                  <strong className="title">{doc.title}</strong>
                  <div className="meta">{(doc.author_name || []).slice(0,2).join(', ')} • {doc.first_publish_year || '—'}</div>
                </div>
                <div className="ol-actions">
                  <button onClick={() => toggleExpand(workKey)}>{expanded[workKey] ? 'Hide' : 'View more'}</button>
                  {doc.edition_key && doc.edition_key.length > 0 && (
                    <a href={`https://openlibrary.org${doc.key}`} target="_blank" rel="noreferrer">Open</a>
                  )}
                </div>

                {expanded[workKey] && (
                  <div className="work-details">
                    {details[workKey] ? (
                      <div>
                        {details[workKey].description && (
                          <p className="desc">{typeof details[workKey].description === 'string' ? details[workKey].description : details[workKey].description.value}</p>
                        )}
                        {details[workKey].subjects && (
                          <p className="subjects">Subjects: {details[workKey].subjects.slice(0,6).join(', ')}</p>
                        )}
                        <a className="work-link" href={`https://openlibrary.org${workKey}`} target="_blank" rel="noreferrer">View on OpenLibrary</a>
                      </div>
                    ) : (
                      <div className="detail-loading">Loading details…</div>
                    )}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      {hasMore && (
        <div className="load-more-wrap">
          <button onClick={loadMore} className="load-more">Load more results</button>
        </div>
      )}

      {showInfo && (
        <div className="wiki-modal-overlay" role="dialog" aria-modal="true" onClick={() => setShowInfo(false)}>
          <div className="wiki-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" aria-label="Close info" onClick={() => setShowInfo(false)}>×</button>
            <h3>How to use the OpenLibrary APIs (quick guide)</h3>
            <p>This explorer uses the OpenLibrary public APIs. Use the examples below to implement search, cover fetching, and work details in your app.</p>

            <h4>1) Search books (Title / Author)</h4>
            <p>Endpoint (GET):</p>
            <pre className="api-snippet">https://openlibrary.org/search.json?title={'{title}'}&amp;page=1&amp;limit=10</pre>
            <p>Example curl:</p>
            <pre className="api-snippet">curl "https://openlibrary.org/search.json?title=harry+potter&page=1&limit=10"</pre>
            <p>Basic JS fetch:</p>
            <pre className="api-snippet">{`const params = new URLSearchParams({ title: 'harry potter', page: 1, limit: 10 });
const res = await fetch('https://openlibrary.org/search.json?' + params.toString());
const json = await res.json();
// json.docs -> array of results; json.numFound, json.start`}</pre>

            <h4>2) Get book covers</h4>
            <p>Use the cover id (cover_i) from search result:</p>
            <pre className="api-snippet">https://covers.openlibrary.org/b/id/{'{COVER_ID}'}-L.jpg</pre>

            <h4>3) Get work details (on demand)</h4>
            <p>Endpoint (GET):</p>
            <pre className="api-snippet">https://openlibrary.org/works/{'{WORK_ID}'}.json</pre>
            <p>Fetch work details only when the user requests them (e.g. "View more") to avoid loading all data at once. Example:</p>
            <pre className="api-snippet">const res = await fetch('https://openlibrary.org/works/OL82586W.json');
const work = await res.json();
// work.description, work.subjects, work.links, etc.</pre>

            <h4>Notes & tips</h4>
            <ul>
              <li>Pagination: use <code>page</code> and <code>limit</code> on the search endpoint; check <code>numFound</code> and <code>start</code> in the response to determine if more results exist.</li>
              <li>Cover images are served via a simple URL—no auth required.</li>
              <li>For large result sets, call the search API page-by-page and load work details only when needed.</li>
              <li>Example UI flow: search → show small list with covers → user clicks "View more" → fetch work details → display description/subjects.</li>
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}
