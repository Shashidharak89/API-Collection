import React, { useState } from 'react'
import './styles/Images.css'

export default function FakeStore() {
  const [endpoint, setEndpoint] = useState('products')
  const [products, setProducts] = useState([])
  const [productDetail, setProductDetail] = useState(null)
  const [categories, setCategories] = useState([])
  const [users, setUsers] = useState([])
  const [carts, setCarts] = useState([])
  const [queryId, setQueryId] = useState('1')
  const [limit, setLimit] = useState(5)
  const [cat, setCat] = useState('jewelery')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastApi, setLastApi] = useState(null)
  const [showInfo, setShowInfo] = useState(false)

  const BASE = 'https://fakestoreapi.com'

  async function fetchProducts() {
    setLoading(true); setError(null); setProductDetail(null)
    try {
      const url = `${BASE}/products`
      setLastApi(url)
      const res = await fetch(url)
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      setProducts(data)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function fetchProductById() {
    if (!queryId) return setError('Provide product id')
    setLoading(true); setError(null); setProducts([])
    try {
      const url = `${BASE}/products/${encodeURIComponent(queryId)}`
      setLastApi(url)
      const res = await fetch(url)
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      setProductDetail(data)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function fetchLimited() {
    setLoading(true); setError(null); setProductDetail(null)
    try {
      const url = `${BASE}/products?limit=${Number(limit) || 5}`
      setLastApi(url)
      const res = await fetch(url)
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      setProducts(data)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function fetchCategories() {
    setLoading(true); setError(null)
    try {
      const url = `${BASE}/products/categories`
      setLastApi(url)
      const res = await fetch(url)
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      setCategories(data)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function fetchByCategory() {
    if (!cat) return setError('Provide category')
    setLoading(true); setError(null); setProductDetail(null)
    try {
      const url = `${BASE}/products/category/${encodeURIComponent(cat)}`
      setLastApi(url)
      const res = await fetch(url)
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      setProducts(data)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function fetchUsers() {
    setLoading(true); setError(null)
    try {
      const url = `${BASE}/users`
      setLastApi(url)
      const res = await fetch(url)
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      setUsers(data)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function fetchCarts() {
    setLoading(true); setError(null)
    try {
      const url = `${BASE}/carts`
      setLastApi(url)
      const res = await fetch(url)
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      setCarts(data)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <section className="img-section">
      <div className="img-header">
        <h3>Fake Store API (no key)</h3>
        <div className="img-actions">
          <button className="info-btn" onClick={() => setShowInfo(true)}>i</button>
        </div>
      </div>

      <div className="img-controls">
        <select value={endpoint} onChange={e => setEndpoint(e.target.value)}>
          <option value="products">All Products</option>
          <option value="single">Single Product</option>
          <option value="limit">Limited Products</option>
          <option value="categories">Categories</option>
          <option value="bycat">Products by Category</option>
          <option value="users">Users</option>
          <option value="carts">Carts</option>
        </select>

        {endpoint === 'single' && (
          <>
            <input placeholder="product id" value={queryId} onChange={e => setQueryId(e.target.value)} />
            <button onClick={fetchProductById} className="primary">Get Product</button>
          </>
        )}

        {endpoint === 'limit' && (
          <>
            <input placeholder="limit" value={limit} onChange={e => setLimit(Number(e.target.value || 5))} />
            <button onClick={fetchLimited} className="primary">Get Limited</button>
          </>
        )}

        {endpoint === 'bycat' && (
          <>
            <input placeholder="category (e.g. jewelery)" value={cat} onChange={e => setCat(e.target.value)} />
            <button onClick={fetchByCategory} className="primary">Get By Category</button>
          </>
        )}

        {endpoint === 'products' && (
          <button onClick={fetchProducts} className="primary">Get All Products</button>
        )}

        {endpoint === 'categories' && (
          <button onClick={fetchCategories} className="primary">Get Categories</button>
        )}

        {endpoint === 'users' && (
          <button onClick={fetchUsers} className="primary">Get Users</button>
        )}

        {endpoint === 'carts' && (
          <button onClick={fetchCarts} className="primary">Get Carts</button>
        )}
      </div>

      {lastApi && (
        <div className="api-panel small" style={{ marginTop: 8 }}>
          <pre>{lastApi}</pre>
        </div>
      )}

      {loading && <div className="img-loading">Loading…</div>}
      {error && <div className="img-error">{error}</div>}

      {productDetail && (
        <div className="api-panel" style={{ marginTop: 12 }}>
          <h4>{productDetail.title}</h4>
          <img src={productDetail.image} alt={productDetail.title} style={{ maxWidth: 180 }} />
          <div style={{ marginTop: 8 }}>{productDetail.description}</div>
          <div style={{ marginTop: 8, fontWeight: 700 }}>${productDetail.price}</div>
        </div>
      )}

      {products.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <h4>Products</h4>
          <div className="img-grid">
            {products.map(p => (
              <div className="img-card" key={p.id}>
                <img src={p.image} alt={p.title} style={{ maxHeight: 140 }} />
                <div className="img-meta">{p.title}</div>
                <div style={{ fontSize: 13, color: '#666' }}>${p.price}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {categories.length > 0 && (
        <div style={{ marginTop: 12 }} className="api-panel small">
          <h4>Categories</h4>
          <ul>
            {categories.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}

      {users.length > 0 && (
        <div style={{ marginTop: 12 }} className="api-panel">
          <h4>Users</h4>
          <pre style={{ maxHeight: 300, overflow: 'auto' }}>{JSON.stringify(users, null, 2)}</pre>
        </div>
      )}

      {carts.length > 0 && (
        <div style={{ marginTop: 12 }} className="api-panel">
          <h4>Carts</h4>
          <pre style={{ maxHeight: 300, overflow: 'auto' }}>{JSON.stringify(carts, null, 2)}</pre>
        </div>
      )}

      {showInfo && (
        <div className="modal-overlay" onClick={() => setShowInfo(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowInfo(false)}>×</button>
            <h4>Fake Store API — Quick Reference</h4>
            <p>Base URL: <code>https://fakestoreapi.com</code></p>
            <pre className="api-snippet">GET /products
GET /products/:id
GET /products?limit=5
GET /products/categories
GET /products/category/:category
GET /users
GET /carts</pre>
            <p>Responses are plain JSON with product fields: id, title, price, description, category, image, rating.</p>
          </div>
        </div>
      )}
    </section>
  )
}
