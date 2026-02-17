import React, { useState } from 'react'
import './styles/Images.css'

export default function OpenLibraryCovers() {
  const [coverId, setCoverId] = useState('15158660')
  const [isbn, setIsbn] = useState('9780140328721')
  const [url, setUrl] = useState(null)

  function showByCover() {
    if (!coverId.trim()) return
    setUrl('https://covers.openlibrary.org/b/id/' + encodeURIComponent(coverId) + '-L.jpg')
  }

  function showByIsbn() {
    if (!isbn.trim()) return
    setUrl('https://covers.openlibrary.org/b/isbn/' + encodeURIComponent(isbn) + '-L.jpg')
  }

  return (
    <section className="img-section">
      <div className="img-header">
        <h3>OpenLibrary Covers</h3>
      </div>

      <div className="img-controls">
        <input placeholder="Cover ID" value={coverId} onChange={e => setCoverId(e.target.value)} />
        <button onClick={showByCover} className="primary">Show</button>
        <input placeholder="ISBN" value={isbn} onChange={e => setIsbn(e.target.value)} />
        <button onClick={showByIsbn} className="primary">Show</button>
      </div>

      {url && (
        <div style={{ marginTop: 12 }}>
          <img src={url} alt="cover" style={{ maxWidth: 180, borderRadius: 6 }} />
          <div className="api-snippet" style={{ marginTop: 8 }}>{url}</div>
        </div>
      )}
    </section>
  )
}
