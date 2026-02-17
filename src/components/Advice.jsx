import React, { useState } from 'react'
import './styles/Images.css'

export default function Advice() {
  const [slip, setSlip] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showInfo, setShowInfo] = useState(false)

  async function fetchAdvice() {
    setLoading(true)
    setError(null)
    setSlip(null)
    try {
      // adviceslip sometimes caches; request fresh
      const res = await fetch('https://api.adviceslip.com/advice', { cache: 'no-store' })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const json = await res.json()
      setSlip(json.slip)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="img-section">
      <div className="img-header">
        <h3>Advice (free)</h3>
        <div className="img-actions">
          <button className="info-btn" onClick={() => setShowInfo(true)}>i</button>
        </div>
      </div>

      <div className="img-controls">
        <button onClick={fetchAdvice} className="primary">Get Advice</button>
      </div>

      {loading && <div className="img-loading">Fetching…</div>}
      {error && <div className="img-error">{error}</div>}

      {slip && (
        <div className="api-panel" style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>#{slip.id}</strong>
            <div style={{ fontSize: 13, color: '#666' }}>
              <button onClick={() => navigator.clipboard?.writeText(slip.advice)}>Copy</button>
            </div>
          </div>
          <div style={{ marginTop: 8, fontSize: 18 }}>{slip.advice}</div>
        </div>
      )}

      {showInfo && (
        <div className="modal-overlay" onClick={() => setShowInfo(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowInfo(false)}>×</button>
            <h4>Advice Slip — Quick Reference</h4>
            <p>Endpoint (no key required):</p>
            <pre className="api-snippet">https://api.adviceslip.com/advice</pre>
            <p>Sample response:</p>
            <pre className="api-snippet">{`{"slip": { "id": 204, "advice": "The best nights out are when people around you are simply having fun."}}`}</pre>
            <p>Use cases: motivation widget, daily insights, small UI reminders.</p>
          </div>
        </div>
      )}
    </section>
  )
}
