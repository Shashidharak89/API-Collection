import React, { useState } from 'react'
import './styles/Images.css'

export default function DeepAI() {
  const [prompt, setPrompt] = useState('A cute robot painting')
  const [key, setKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [resultUrl, setResultUrl] = useState(null)

  async function run() {
    if (!key) return setError('Provide DeepAI API key')
    setLoading(true)
    setError(null)
    setResultUrl(null)
    try {
      const url = 'https://api.deepai.org/api/text2img'
      const form = new FormData()
      form.append('text', prompt)
      const res = await fetch(url, { method: 'POST', headers: { 'api-key': key }, body: form })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      setResultUrl(data.output_url)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="img-section">
      <div className="img-header"><h3>DeepAI (text→image)</h3></div>
      <div className="img-controls">
        <input value={prompt} onChange={e => setPrompt(e.target.value)} />
        <input placeholder="DeepAI API key" value={key} onChange={e => setKey(e.target.value)} />
        <button onClick={run} className="primary">Generate</button>
      </div>
      {loading && <div className="img-loading">Generating…</div>}
      {error && <div className="img-error">{error}</div>}
      {resultUrl && <div style={{ marginTop: 12 }}><img src={resultUrl} alt="deepai" style={{ maxWidth: 360 }} /></div>}
    </section>
  )
}
