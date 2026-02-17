import React, { useState } from 'react'
import './styles/Images.css'

export default function Cloudinary() {
  const [cloudName, setCloudName] = useState('')
  const [preset, setPreset] = useState('')
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastApi, setLastApi] = useState(null)

  async function upload() {
    if (!cloudName || !preset) return setError('Provide cloud name and upload preset')
    if (!file) return setError('Select a file')
    setLoading(true)
    setError(null)
    try {
      const url = 'https://api.cloudinary.com/v1_1/' + encodeURIComponent(cloudName) + '/image/upload'
      setLastApi(url + ' (upload_preset=' + preset + ')')
      const form = new FormData()
      form.append('file', file)
      form.append('upload_preset', preset)
      const res = await fetch(url, { method: 'POST', body: form })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="img-section">
      <div className="img-header">
        <h3>Cloudinary (Upload & Transform)</h3>
      </div>
      <div className="img-controls">
        <input placeholder="Cloud name" value={cloudName} onChange={e => setCloudName(e.target.value)} />
        <input placeholder="Upload preset" value={preset} onChange={e => setPreset(e.target.value)} />
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
        <button onClick={upload} className="primary">Upload</button>
      </div>

      {lastApi && <div className="api-panel small"><pre className="api-url">{lastApi}</pre></div>}
      {loading && <div className="img-loading">Uploading…</div>}
      {error && <div className="img-error">{error}</div>}

      {result && (
        <div style={{ marginTop: 12 }}>
          <img src={result.secure_url} alt="uploaded" style={{ maxWidth: 240, borderRadius: 6 }} />
          <div className="api-snippet">{result.secure_url}</div>
        </div>
      )}
    </section>
  )
}
