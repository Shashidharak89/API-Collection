import React, { useState } from 'react'
import './styles/Images.css'

export default function Replicate() {
  const [prompt, setPrompt] = useState('A fantasy landscape')
  const [key, setKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [resultUrl, setResultUrl] = useState(null)
  const [lastApi, setLastApi] = useState(null)

  async function run() {
    if (!key) return setError('Provide Replicate API key')
    setLoading(true)
    setError(null)
    setResultUrl(null)
    try {
      const url = 'https://api.replicate.com/v1/predictions'
      setLastApi(url)
      const body = JSON.stringify({ version: 'latest', input: { prompt } })
      const res = await fetch(url, { method: 'POST', headers: { Authorization: 'Token ' + key, 'Content-Type': 'application/json' }, body })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error('HTTP ' + res.status + ' - ' + txt)
      }
      const data = await res.json()
      // replicate returns asynchronous prediction; attempt to read output if present
      const output = data.output || data?.result || null
      if (Array.isArray(output) && output.length) setResultUrl(output[0])
      else if (typeof output === 'string') setResultUrl(output)
      else setResultUrl(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="img-section">
      <div className="img-header"><h3>Replicate (Text → Image)</h3></div>
      <div className="img-controls">
        <input value={prompt} onChange={e => setPrompt(e.target.value)} />
        <input placeholder="Replicate API token" value={key} onChange={e => setKey(e.target.value)} />
        <button onClick={run} className="primary">Generate</button>
      </div>

      {lastApi && <div className="api-panel small"><pre className="api-url">{lastApi}</pre></div>}
      {loading && <div className="img-loading">Generating…</div>}
      {error && <div className="img-error">{error}</div>}
      {resultUrl && <div style={{ marginTop: 12 }}><img src={resultUrl} alt="replicate" style={{ maxWidth: 360 }} /></div>}
    </section>
  )
}
