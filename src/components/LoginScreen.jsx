import { useState } from 'react'

export default function LoginScreen({ team, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const match = team.find(
      (m) => m.contact.toLowerCase() === email.trim().toLowerCase() && m.password === password
    )
    if (match) {
      setError('')
      onLogin(match.id)
    } else {
      setError('Incorrect email or password.')
    }
  }

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="login-title">Team workspace</h1>
        <p className="muted">Sign in to continue.</p>

        <label className="block">
          Email
          <input
            type="email" autoFocus required
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          Password
          <input
            type="password" required
            value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>

        {error && <p className="login-error">{error}</p>}

        <button type="submit">Log in</button>

        <div className="login-hint">
          <p className="muted small">Demo accounts</p>
          {team.map((m) => (
            <p key={m.id} className="muted small">{m.name} ({m.role}) · {m.contact}</p>
          ))}
        </div>
      </form>
    </div>
  )
}
