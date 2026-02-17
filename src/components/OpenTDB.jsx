import React, { useState } from 'react'
import './styles/Images.css'

function decodeHtml(html) {
  try {
    const txt = document.createElement('textarea')
    txt.innerHTML = html
    return txt.value
  } catch (e) {
    return html
  }
}

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function OpenTDB() {
  const [amount, setAmount] = useState(5)
  const [category, setCategory] = useState(18) // Science: Computers
  const [difficulty, setDifficulty] = useState('')
  const [qtype, setQtype] = useState('')
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastApi, setLastApi] = useState(null)
  const [showInfo, setShowInfo] = useState(false)

  async function fetchQuestions() {
    setLoading(true)
    setError(null)
    setQuestions([])
    setIndex(0)
    setSelected(null)
    setRevealed(false)
    try {
      const params = new URLSearchParams()
      params.set('amount', String(amount || 5))
      if (category) params.set('category', String(category))
      if (difficulty) params.set('difficulty', difficulty)
      if (qtype) params.set('type', qtype)
      const url = 'https://opentdb.com/api.php?' + params.toString()
      setLastApi(url)
      const res = await fetch(url)
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const body = await res.json()
      const results = (body.results || []).map(q => {
        const correct = decodeHtml(q.correct_answer)
        const incorrect = (q.incorrect_answers || []).map(a => decodeHtml(a))
        const all = shuffle([correct, ...incorrect])
        return {
          question: decodeHtml(q.question),
          correct,
          options: all,
          type: q.type,
          difficulty: q.difficulty,
          category: q.category
        }
      })
      setQuestions(results)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function selectOption(opt) {
    if (revealed) return
    setSelected(opt)
    // reveal only the correct answer (per your request)
    setRevealed(true)
  }

  function nextQuestion() {
    setSelected(null)
    setRevealed(false)
    if (index + 1 < questions.length) setIndex(i => i + 1)
    else {
      // reached end
      setIndex(0)
    }
  }

  const cur = questions[index]

  return (
    <section className="img-section">
      <div className="img-header">
        <h3>OpenTDB — Trivia</h3>
        <div className="img-actions">
          <button className="info-btn" onClick={() => setShowInfo(true)}>i</button>
        </div>
      </div>

      <div className="img-controls">
        <input type="number" min="1" max="50" value={amount} onChange={e => setAmount(Number(e.target.value || 5))} style={{ width: 80 }} />
        <input placeholder="category id (e.g. 18)" value={category} onChange={e => setCategory(e.target.value)} style={{ width: 140 }} />
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
          <option value="">Any difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select value={qtype} onChange={e => setQtype(e.target.value)}>
          <option value="">Any type</option>
          <option value="multiple">Multiple Choice</option>
          <option value="boolean">True / False</option>
        </select>
        <button onClick={fetchQuestions} className="primary">Fetch Questions</button>
      </div>

      {lastApi && (
        <div className="api-panel small" style={{ marginTop: 8 }}>
          <pre>{lastApi}</pre>
        </div>
      )}

      {loading && <div className="img-loading">Loading…</div>}
      {error && <div className="img-error">{error}</div>}

      {cur && (
        <div style={{ marginTop: 12 }} className="api-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Question {index + 1} / {questions.length}</strong>
            <div style={{ fontSize: 12, color: '#666' }}>{cur.category} — {cur.difficulty}</div>
          </div>
          <div style={{ marginTop: 8, fontSize: 18 }}>{cur.question}</div>

          <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
            {cur.options.map((opt, i) => {
              const isCorrect = opt === cur.correct
              if (!revealed) {
                return (
                  <button key={i} className="img-card" onClick={() => selectOption(opt)} style={{ textAlign: 'left' }}>{opt}</button>
                )
              }
              // when revealed: only highlight the correct option
              return (
                <div key={i} className="img-card" style={{ textAlign: 'left', background: isCorrect ? '#e6f9ec' : '#fafafa', border: isCorrect ? '1px solid #7bd389' : '1px solid #eee' }}>
                  {isCorrect ? (<strong>{opt}</strong>) : (<span style={{ color: '#777' }}>{opt}</span>)}
                </div>
              )
            })}
          </div>

          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button onClick={nextQuestion} className="primary">Next</button>
            <button onClick={() => { setQuestions([]); setIndex(0); setSelected(null); setRevealed(false) }}>Reset</button>
          </div>
        </div>
      )}
      {showInfo && (
        <div className="modal-overlay" onClick={() => setShowInfo(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowInfo(false)}>×</button>
            <h4>OpenTDB — Trivia API</h4>
            <p>Base URL: <code>https://opentdb.com/api.php</code></p>
            <p>Example: <code>https://opentdb.com/api.php?amount=5&category=18</code></p>
            <h5>Parameters</h5>
            <pre className="api-snippet">{'amount=NUMBER (required)\ncategory=ID (optional)\ndifficulty=easy|medium|hard (optional)\ntype=multiple|boolean (optional)'}</pre>
            <h5>Category 18</h5>
            <p>Science: Computers — use <code>category=18</code> for computer science questions.</p>
            <h5>Sample response</h5>
            <pre className="api-snippet">{
              '{"response_code":0,"results":[{"category":"Science: Computers","type":"multiple","difficulty":"medium","question":"What does CPU stand for?","correct_answer":"Central Processing Unit","incorrect_answers":["Central Process Unit","Computer Personal Unit","Central Processor Unit"]}]}'
            }</pre>
            <h5>Notes</h5>
            <ul>
              <li>Questions are returned with HTML entities (e.g. &amp;quot;). Decode before display — this component decodes automatically.</li>
              <li>Shuffle options before showing; this component randomizes order.</li>
              <li>To reveal only the correct answer after a selection, this UI highlights the correct option and dims others.</li>
            </ul>
            <h5>Use cases</h5>
            <ul>
              <li>Multiple-choice quiz UI</li>
              <li>Flashcards / study mode</li>
              <li>Gamified leaderboard or timed rounds</li>
            </ul>
            <p>More categories: General Knowledge (9), Books (10), Film (11), Music (12), History (23), Sports (21), Geography (22).</p>
          </div>
        </div>
      )}
    </section>
  )
}
