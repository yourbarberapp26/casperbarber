// src/pages/admin/AdminDashboard.jsx
import { useState, useMemo } from "react"
import { formatMoney, isWithinLastNDays } from "../../utils/helpers"

export default function AdminDashboard({ services, setServices, clients, setClients, appointments, setAppointments, onLogout }) {
  // your admin dashboard code here
}

// ─────────────────────────────────────────────
// ADMIN DASHBOARD  (Casper only)
// ─────────────────────────────────────────────
function AdminDashboard({ services, setServices, clients, setClients, appointments, setAppointments, onLogout }) {
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id)
  const [newClientNote, setNewClientNote] = useState('')
  const [newService, setNewService] = useState({ name: '', price: '', duration: '' })
  const [promotion, setPromotion] = useState('')
  const [promoLog, setPromoLog] = useState([])
  const [newReward, setNewReward] = useState({ title: '', condition: '', reward: '' })
  const [loyalty, setLoyalty] = useState([
    { id: 'ly-1', title: '10 Cuts, 11th is Free', condition: '10 completed appointments', reward: 'Free Gentlemen Haircut / Shape Up ($35 value)' },
    { id: 'ly-2', title: 'Refer a Friend', condition: 'Referred client books & completes first visit', reward: '$10 off your next haircut' },
    { id: 'ly-3', title: 'VIP Early Access', condition: '$500+ lifetime spend', reward: 'Priority booking + complimentary hot towel on every visit' },
  ])
  const [activeTab, setActiveTab] = useState('appointments')

  const selectedClient = clients.find((c) => c.id === selectedClientId) ?? clients[0]

  const analytics = useMemo(() => {
    const completed = appointments.filter((a) => a.status === 'Completed')
    const dailyRevenue = completed.filter((a) => isWithinLastNDays(a.date, 1)).reduce((s, a) => s + a.amount, 0)
    const weeklyRevenue = completed.filter((a) => isWithinLastNDays(a.date, 7)).reduce((s, a) => s + a.amount, 0)
    const monthlyRevenue = completed.filter((a) => isWithinLastNDays(a.date, 30)).reduce((s, a) => s + a.amount, 0)
    const repeatCustomers = clients.filter((c) => c.history.length > 1).length
    const retention = clients.length ? Math.round((repeatCustomers / clients.length) * 100) : 0
    const serviceMap = completed.reduce((acc, a) => { acc[a.service] = (acc[a.service] ?? 0) + 1; return acc }, {})
    const topServices = Object.entries(serviceMap).sort((a, b) => b[1] - a[1]).slice(0, 3)
    const totalSpend = completed.reduce((s, a) => s + a.amount, 0)
    const averageSpend = clients.length ? Math.round(totalSpend / clients.length) : 0
    return { dailyRevenue, weeklyRevenue, monthlyRevenue, bookings: appointments.length, repeatCustomers, retention, topServices, averageSpend }
  }, [appointments, clients])

  const handleServiceCreate = (e) => {
    e.preventDefault()
    if (!newService.name || !newService.price || !newService.duration) return
    setServices((p) => [...p, { id: `svc-${Date.now()}`, name: newService.name, price: Number(newService.price), duration: Number(newService.duration) }])
    setNewService({ name: '', price: '', duration: '' })
  }

  const updateClientNotes = () => {
    if (!selectedClient || !newClientNote.trim()) return
    setClients((p) => p.map((c) => c.id === selectedClient.id ? { ...c, notes: `${c.notes} ${newClientNote.trim()}`.trim() } : c))
    setNewClientNote('')
  }

  const handlePromoSend = () => {
    if (!promotion.trim()) return
    setPromoLog((p) => [`✓ Sent to ${clients.length} clients: "${promotion.trim()}"`, ...p])
    setPromotion('')
  }

  const addReward = (e) => {
    e.preventDefault()
    if (!newReward.title || !newReward.condition || !newReward.reward) return
    setLoyalty((p) => [...p, { id: `ly-${Date.now()}`, ...newReward }])
    setNewReward({ title: '', condition: '', reward: '' })
  }

  const tabs = [
    { key: 'appointments', label: 'Appointments' },
    { key: 'clients', label: 'Clients' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'services', label: 'Services' },
    { key: 'loyalty', label: 'Loyalty' },
  ]

  return (
    <div className="app admin-mode">
      <header className="admin-header">
        <div className="admin-header__inner">
          <div className="admin-header__left">
            <img src={LOGO} alt="Casper" className="admin-logo" />
            <div>
              <h1>Casper — Admin</h1>
              <p className="admin-sub">Your private dashboard</p>
            </div>
          </div>
          <button className="btn btn--ghost btn--small" onClick={onLogout}>Sign Out</button>
        </div>
        <nav className="admin-tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={activeTab === t.key ? 'admin-tab admin-tab--active' : 'admin-tab'}
              onClick={() => setActiveTab(t.key)}
            >{t.label}</button>
          ))}
        </nav>
      </header>

      <main className="layout">


        {/* ── ANALYTICS ── */}
        {activeTab === 'analytics' && (
          <section className="card">
            <h2>Revenue Dashboard</h2>
            <p className="section-sub">Your numbers — all yours.</p>
            <div className="metrics">
              <article><span>Today</span><strong>{formatMoney(analytics.dailyRevenue)}</strong></article>
              <article><span>7 Days</span><strong>{formatMoney(analytics.weeklyRevenue)}</strong></article>
              <article><span>30 Days</span><strong>{formatMoney(analytics.monthlyRevenue)}</strong></article>
              <article><span>Total Bookings</span><strong>{analytics.bookings}</strong></article>
              <article><span>Repeat Clients</span><strong>{analytics.repeatCustomers}</strong></article>
              <article><span>Retention</span><strong>{analytics.retention}%</strong></article>
              <article><span>Avg Spend</span><strong>{formatMoney(analytics.averageSpend)}</strong></article>
              <article><span>Total Clients</span><strong>{clients.length}</strong></article>
            </div>
            <div className="top-services">
              <h3>Top Services</h3>
              {analytics.topServices.length ? analytics.topServices.map(([name, count]) => (
                <p key={name}><span className="dot" />{name} — {count} booking{count !== 1 ? 's' : ''}</p>
              )) : <p className="muted">No completed services yet.</p>}
            </div>
          </section>
        )}

        {/* ── NOTIFICATIONS ── */}
        {activeTab === 'notifications' && (
          <section className="card">
            <h2>SMS & Email Notifications</h2>
            <p className="section-sub">Automated messages sent to clients on every booking event.</p>
            <div className="grid-two">
              <div className="message-card">
                <strong>Booking Confirmation</strong>
                <p>"You're booked with Casper at 442 Ridge Rd, Lyndhurst NJ. Your appointment is confirmed — we'll see you then!"</p>
              </div>
              <div className="message-card">
                <strong>24h Reminder</strong>
                <p>"Reminder: your appointment with Casper is tomorrow. Reply RESCHEDULE to change — 24hr cancellation policy applies."</p>
              </div>
              <div className="message-card">
                <strong>Reschedule Notice</strong>
                <p>"Your Casper appointment has been moved. Please confirm your new time at casperbarber.com or call (201) 889-6440."</p>
              </div>
              <div className="message-card">
                <strong>Post-Visit Thank You</strong>
                <p>"Thanks for coming in! Leave a review on Booksy and refer a friend for $10 off your next cut."</p>
              </div>
            </div>
            <p className="muted">All events are also forwarded to emmix21379@gmail.com.</p>
          </section>
        )}

        {/* ── SERVICES (admin) ── */}
        {activeTab === 'services' && (
          <section className="card">
            <h2>Manage Services</h2>
            <p className="section-sub">Add or update services and pricing.</p>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Service</th><th>Duration</th><th>Price</th></tr></thead>
                <tbody>
                  {services.map((s) => (
                    <tr key={s.id}><td>{s.name}</td><td>{s.duration} min</td><td>{formatMoney(s.price)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <form className="row" onSubmit={handleServiceCreate} style={{ marginTop: '1rem' }}>
              <input placeholder="Service name" value={newService.name} onChange={(e) => setNewService((p) => ({ ...p, name: e.target.value }))} />
              <input type="number" placeholder="Price" value={newService.price} onChange={(e) => setNewService((p) => ({ ...p, price: e.target.value }))} />
              <input type="number" placeholder="Min" value={newService.duration} onChange={(e) => setNewService((p) => ({ ...p, duration: e.target.value }))} />
              <button className="btn btn--small" type="submit">+ Add</button>
            </form>
          </section>
        )}

        {/* ── LOYALTY (admin) ── */}
        {activeTab === 'loyalty' && (
          <section className="card">
            <h2>Loyalty Programs</h2>
            <p className="section-sub">Manage rewards for your regulars.</p>
            <div className="rewards">
              {loyalty.map((p) => (
                <article key={p.id}>
                  <h3>{p.title}</h3>
                  <p className="muted">Condition: {p.condition}</p>
                  <p className="reward-value">Reward: {p.reward}</p>
                </article>
              ))}
            </div>
            <form className="stack" onSubmit={addReward} style={{ marginTop: '1rem' }}>
              <input placeholder="Program title" value={newReward.title} onChange={(e) => setNewReward((p) => ({ ...p, title: e.target.value }))} />
              <input placeholder="Condition (e.g., 10 visits)" value={newReward.condition} onChange={(e) => setNewReward((p) => ({ ...p, condition: e.target.value }))} />
              <input placeholder="Reward" value={newReward.reward} onChange={(e) => setNewReward((p) => ({ ...p, reward: e.target.value }))} />
              <button className="btn btn--small" type="submit">Add Program</button>
            </form>
          </section>
        )}

      </main>
    </div>
  )
}

