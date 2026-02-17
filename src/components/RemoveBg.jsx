import React, { useState } from 'react'
import './styles/Images.css'

export default function RemoveBg() {
  const [file, setFile] = useState(null)
  const [key, setKey] = useState('')
  const [resultUrl, setResultUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastApi, setLastApi] = useState(null)
  const [showApi, setShowApi] = useState(false)

  async function run() {
    if (!file) return setError('Select an image file')
    if (!key) return setError('Provide Remove.bg API key')
    setLoading(true)
    setError(null)
    setResultUrl(null)
    try {
      const url = 'https://api.remove.bg/v1.0/removebg'
      setLastApi(url)
      const form = new FormData()
      form.append('image_file', file)
      form.append('size', 'auto')
      const res = await fetch(url, { method: 'POST', headers: { 'X-Api-Key': key }, body: form })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error('HTTP ' + res.status + ' - ' + txt)
      }
      const blob = await res.blob()
      const objectUrl = URL.createObjectURL(blob)
      setResultUrl(objectUrl)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="img-section">
      <div className="img-header">
        <h3>Remove.bg (Background Removal)</h3>
        <div className="img-actions">
          <button className="view-api" onClick={() => setShowApi(s => !s)}>View API</button>
        </div>
      </div>

      <div className="img-controls">
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
        <input placeholder="Remove.bg API Key" value={key} onChange={e => setKey(e.target.value)} />
        <button onClick={run} className="primary">Remove BG</button>
      </div>

      {showApi && lastApi && (<div className="api-panel small"><pre className="api-url">{lastApi}</pre></div>)}

      {loading && <div className="img-loading">Processing…</div>}
      {error && <div className="img-error">{error}</div>}

      {resultUrl && (
        <div style={{ marginTop: 12 }}>
          <img src={resultUrl} alt="result" style={{ maxWidth: 320, borderRadius: 6 }} />
        </div>
      )}

      <div style={{ marginTop: 8 }} className="api-snippet">POST https://api.remove.bg/v1.0/removebg (multipart/form-data, header X-Api-Key)</div>
    </section>
  )
}
