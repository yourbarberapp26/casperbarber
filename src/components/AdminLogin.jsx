// ─────────────────────────────────────────────
// ADMIN LOGIN
// ─────────────────────────────────────────────
function AdminLogin({ onSuccess }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (pin === ADMIN_PIN) { onSuccess() }
    else { setError(true); setPin('') }
  }

  return (
    <div className="login-overlay">
      <form className="login-box" onSubmit={handleSubmit}>
        <img src={LOGO} alt="Casper" className="login-logo" />
        <h2>Casper Admin</h2>
        <p className="muted">Enter your PIN to access the dashboard</p>
        <input
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={(e) => { setPin(e.target.value); setError(false) }}
          autoFocus
        />
        {error && <p className="login-error">Incorrect PIN</p>}
        <button className="btn" type="submit">Enter Dashboard</button>
      </form>
    </div>
  )
}