import React, { useState } from 'react'
import './styles/Images.css'

export default function QRCode() {
  const [data, setData] = useState('HelloWorld')
  const [size, setSize] = useState('200x200')
  const [imgUrl, setImgUrl] = useState('')
  const [error, setError] = useState(null)
  const [showInfo, setShowInfo] = useState(false)

  function buildUrl() {
    if (!data) return ''
    const base = 'https://api.qrserver.com/v1/create-qr-code/'
    const params = new URLSearchParams()
    params.set('data', data)
    if (size) params.set('size', size)
    return base + '?' + params.toString()
  }

  function generate() {
    setError(null)
    if (!data) return setError('Please enter data to encode')
    setImgUrl(buildUrl())
  }

  function copyUrl() {
    const url = buildUrl()
    if (!url) return
    navigator.clipboard?.writeText(url)
  }

  return (
    <section className="img-section">
      <div className="img-header">
        <h3>QR Code (key-free)</h3>
        <div className="img-actions">
          <button className="info-btn" onClick={() => setShowInfo(true)}>i</button>
        </div>
      </div>

      <div className="img-controls">
        <input placeholder="Text or URL to encode" value={data} onChange={e => setData(e.target.value)} />
        <input placeholder="size (e.g. 200x200)" value={size} onChange={e => setSize(e.target.value)} />
        <button onClick={generate} className="primary">Generate</button>
        <button onClick={copyUrl} style={{ marginLeft: 8 }}>Copy URL</button>
      </div>

      {error && <div className="img-error">{error}</div>}

      {imgUrl && (
        <div style={{ marginTop: 12 }}>
          <a href={imgUrl} download target="_blank" rel="noreferrer">
            <img src={imgUrl} alt="QR Code" style={{ maxWidth: 320, borderRadius: 8, border: '1px solid #eee' }} />
          </a>
          <div style={{ marginTop: 6, fontSize: 13, color: '#666' }}>{imgUrl}</div>
        </div>
      )}

      {showInfo && (
        <div className="modal-overlay" onClick={() => setShowInfo(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowInfo(false)}>×</button>
            <h4>QRServer — Quick Reference</h4>
            <p>Endpoint (key-free):</p>
            <pre className="api-snippet">https://api.qrserver.com/v1/create-qr-code/</pre>
            <h5>Basic usage</h5>
            <pre className="api-snippet">https://api.qrserver.com/v1/create-qr-code/?data=HelloWorld</pre>
            <h5>With size</h5>
            <pre className="api-snippet">https://api.qrserver.com/v1/create-qr-code/?data=https://yourapp.com&size=300x300</pre>
            <p>Parameters:</p>
            <pre className="api-snippet">data → text or URL to encode
size → widthxheight (pixels)
format → png, svg, etc. (optional)
margin, ecclevel, bgcolor, color (optional)</pre>
            <p>No API key required — the endpoint returns a QR image directly.</p>
          </div>
        </div>
      )}
    </section>
  )
}
