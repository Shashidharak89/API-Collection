import React, { useState } from 'react'
import './Wiki.css'

export default function WikiExplorer() {
  const [mode, setMode] = useState('simple') // 'simple' or 'advanced'
  const [query, setQuery] = useState('Artificial intelligence')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [summary, setSummary] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [lastApi, setLastApi] = useState(null)
  const [showApi, setShowApi] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  async function fetchSummary(title) {
    const q = title || query
    setLoading(true)
    setError(null)
    setSummary(null)
    try {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`
      setLastApi(url)
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const data = await res.json()
      setSummary(data)
    } catch (err) {
      setError('Failed to fetch summary. ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function fetchSearch() {
    setLoading(true)
    setError(null)
    setSearchResults([])
    try {
      const api = 'https://en.wikipedia.org/w/api.php'
      const params = new URLSearchParams({
        origin: '*',
        action: 'query',
        list: 'search',
        srsearch: query,
        format: 'json',
      })
      const url = `${api}?${params.toString()}`
      setLastApi(url)
      setShowApi(false)
      setCopied(false)
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const data = await res.json()
      setSearchResults(data.query?.search || [])
    } catch (err) {
      setError('Failed to search. ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  function onSubmit(e) {
    e && e.preventDefault()
    if (!query.trim()) return setError('Please enter a search term')
    if (mode === 'simple') fetchSummary()
    else fetchSearch()
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
    <section className="wiki">
      <div className="wiki-title-row">
        <h2>Wikipedia Explorer</h2>
        <button className="info-btn" aria-label="About Wikipedia Explorer" onClick={() => setShowInfo(true)}>i</button>
      </div>

      <div className="wiki-controls">
        <div className="modes">
          <button className={mode === 'simple' ? 'active' : ''} onClick={() => setMode('simple')}>Simple (Summary)</button>
          <button className={mode === 'advanced' ? 'active' : ''} onClick={() => setMode('advanced')}>Advanced (Search)</button>
        </div>

        <div className="view-api-wrap">
          <button className="view-api" onClick={() => setShowApi(s => !s)} aria-pressed={showApi}>View API</button>
        </div>

        <form className="wiki-form" onSubmit={onSubmit}>
          <input
            aria-label="Search Wikipedia"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Enter a topic, e.g. Artificial intelligence"
          />
          <button type="submit" className="primary">Search</button>
        </form>
      </div>

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

      {loading && <div className="wiki-loading">Loading…</div>}
      {error && <div className="wiki-error">{error}</div>}

      {mode === 'simple' && summary && (
        <article className="wiki-summary">
          <header>
            <h3>{summary.title}</h3>
            {summary.description && <small className="muted">{summary.description}</small>}
          </header>
          <div className="summary-body">
            {summary.thumbnail?.source && (
              <img src={summary.thumbnail.source} alt={summary.title} />
            )}
            <p>{summary.extract}</p>
          </div>
          {summary.content_urls?.desktop?.page && (
            <a className="external" href={summary.content_urls.desktop.page} target="_blank" rel="noreferrer">Read full page</a>
          )}
        </article>
      )}

      {mode === 'advanced' && (
        <div className="wiki-advanced">
          {searchResults.length === 0 && !loading && <p className="muted">No results yet — try a search.</p>}
          <ul>
            {searchResults.map(r => (
              <li key={r.pageid} className="search-item">
                <div className="item-left">
                  <a href={`https://en.wikipedia.org/?curid=${r.pageid}`} target="_blank" rel="noreferrer" className="result-title">{r.title}</a>
                  <div className="snippet" dangerouslySetInnerHTML={{ __html: r.snippet + '...' }} />
                </div>
                <div className="item-actions">
                  <button onClick={() => fetchSummary(r.title)}>View Summary</button>
                  <a href={`https://en.wikipedia.org/?curid=${r.pageid}`} target="_blank" rel="noreferrer">Open</a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Show simple summary below search results if available */}
      {mode === 'advanced' && summary && (
        <article className="wiki-summary small">
          <header>
            <h3>{summary.title}</h3>
            {summary.description && <small className="muted">{summary.description}</small>}
          </header>
          <div className="summary-body">
            {summary.thumbnail?.source && <img src={summary.thumbnail.source} alt={summary.title} />}
            <p>{summary.extract}</p>
          </div>
          {summary.content_urls?.desktop?.page && (
            <a className="external" href={summary.content_urls.desktop.page} target="_blank" rel="noreferrer">Read full page</a>
          )}
        </article>
      )}

      {showInfo && (
        <div className="wiki-modal-overlay" role="dialog" aria-modal="true" onClick={() => setShowInfo(false)}>
          <div className="wiki-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" aria-label="Close info" onClick={() => setShowInfo(false)}>×</button>
            <h3>About Wikipedia APIs</h3>
            <p><strong>Simple — Wikipedia REST API (summary)</strong>: Fetch concise article summaries, thumbnail, extract and direct page link. Example endpoint:</p>
            <pre className="api-snippet">https://en.wikipedia.org/api/rest_v1/page/summary/Artificial_intelligence</pre>
            <p><strong>Advanced — MediaWiki Action API</strong>: Full search, revisions, categories and metadata. Example search:</p>
            <pre className="api-snippet">https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=AI&format=json&origin=*</pre>
            <p>This explorer supports both: use <em>Simple</em> for quick summaries and <em>Advanced</em> for search results. Click a result's <em>View Summary</em> to fetch the REST summary. The <em>View API</em> panel shows the last request URL and a curl sample which you can copy.</p>
          </div>
        </div>
      )}
    </section>
  )
}
