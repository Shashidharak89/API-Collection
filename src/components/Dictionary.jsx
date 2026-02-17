import React, { useState } from 'react'
import './styles/Images.css'
import './styles/Dictionary.css'

export default function Dictionary() {
  const [word, setWord] = useState('innovation')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showInfo, setShowInfo] = useState(false)

  async function lookup() {
    if (!word) return setError('Enter a word')
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
      const res = await fetch(url)
      if (!res.ok) {
        if (res.status === 404) throw new Error('No entry found')
        throw new Error('HTTP ' + res.status)
      }
      const json = await res.json()
      setData(json[0] || null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="img-section">
      <div className="img-header">
        <h3>Dictionary (free)</h3>
        <div className="img-actions">
          <button className="info-btn" onClick={() => setShowInfo(true)}>i</button>
        </div>
      </div>

      <div className="img-controls">
        <input placeholder="Enter a word" value={word} onChange={e => setWord(e.target.value)} />
        <button onClick={lookup} className="primary">Lookup</button>
      </div>

      {loading && <div className="img-loading">Loading…</div>}
      {error && <div className="img-error">{error}</div>}

      {data && (
        <div className="api-panel" style={{ marginTop: 12 }}>
          <h4>{data.word} {data.phonetic ? `— ${data.phonetic}` : ''}</h4>

          {data.phonetics && data.phonetics.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <strong>Phonetics:</strong>
              <ul>
                {data.phonetics.map((p, idx) => (
                  <li key={idx}>{p.text} {p.audio ? (<a href={p.audio} target="_blank" rel="noreferrer">🔊</a>) : null}</li>
                ))}
              </ul>
            </div>
          )}

          {data.meanings && (
            <div>
              <strong>Meanings:</strong>
              {data.meanings.map((m, mi) => (
                <div key={mi} style={{ marginTop: 8 }}>
                  <em>{m.partOfSpeech}</em>
                  <ol>
                    {m.definitions.map((d, di) => (
                      <li key={di}>
                        <div>{d.definition}</div>
                        {d.example && <div style={{ color: '#555', marginTop: 4 }}>Example: {d.example}</div>}
                        {d.synonyms && d.synonyms.length > 0 && <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Synonyms: {d.synonyms.join(', ')}</div>}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}

          {data.license && (
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>License: {data.license.name}</div>
          )}
        </div>
      )}

      {showInfo && (
        <div className="modal-overlay" onClick={() => setShowInfo(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowInfo(false)}>×</button>
            <h4>Dictionary API — Quick Reference</h4>
            <p>Endpoint (no key needed):</p>
            <pre className="api-snippet">https://api.dictionaryapi.dev/api/v2/entries/en/&lt;word&gt;</pre>
            <p>Example:</p>
            <pre className="api-snippet">https://api.dictionaryapi.dev/api/v2/entries/en/innovation</pre>
            <p>Response includes word, phonetics, meanings, partOfSpeech, definitions, examples, synonyms.</p>
          </div>
        </div>
      )}
    </section>
  )
}
