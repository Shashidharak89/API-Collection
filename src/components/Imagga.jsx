import React, { useState } from 'react'
import './styles/Images.css'

export default function Imagga() {
  const [imageUrl, setImageUrl] = useState('')
  const [key, setKey] = useState('')
  const [secret, setSecret] = useState('')
  const [tags, setTags] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function tag() {
    if (!imageUrl) return setError('Provide image URL')
    setLoading(true)
    setError(null)
    try {
      const url = 'https://api.imagga.com/v2/tags?image_url=' + encodeURIComponent(imageUrl)
      const auth = 'Basic ' + btoa((key || '') + ':' + (secret || ''))
      const res = await fetch(url, { headers: { Authorization: auth } })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      setTags(data.result?.tags || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="img-section">
      <div className="img-header"><h3>Imagga (Auto-tag)</h3></div>
      <div className="img-controls">
        <input placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
        <input placeholder="API key" value={key} onChange={e => setKey(e.target.value)} />
        <input placeholder="API secret" value={secret} onChange={e => setSecret(e.target.value)} />
        <button onClick={tag} className="primary">Tag</button>
      </div>
      {loading && <div className="img-loading">Tagging…</div>}
      {error && <div className="img-error">{error}</div>}
      {tags && (
        <div style={{ marginTop: 12 }}>
          <strong>Tags:</strong>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            {tags.map(t => <span key={t.tag.en} style={{ background: '#fff7f0', padding: '4px 8px', borderRadius: 6 }}>{t.tag.en} ({Math.round(t.confidence)}%)</span>)}
          </div>
        </div>
      )}
    </section>
  )
}
