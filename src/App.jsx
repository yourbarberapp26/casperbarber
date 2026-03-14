import { useMemo, useState } from 'react'

const ADMIN_PIN = 'casper1'

const starterServices = [
  { id: 'svc-1', name: 'Haircut No Beard', price: 45, duration: 45 },
  { id: 'svc-2', name: 'Haircut with Beard', price: 60, duration: 60 },
  { id: 'svc-3', name: 'Haircut with Beard & Hot Towel', price: 65, duration: 60 },
  { id: 'svc-4', name: 'Gentlemen Haircut / Shape Up', price: 35, duration: 30 },
  { id: 'svc-5', name: 'Beard with "The Works"', price: 45, duration: 45 },
  { id: 'svc-6', name: 'Before/After Hours Appointment', price: 100, duration: 60 },
]

const starterClients = [
  {
    id: 'cl-1',
    name: 'Jordan Hayes',
    phone: '(201) 555-1234',
    email: 'jordan@example.com',
    lastAppointment: '2026-03-10',
    history: [
      { date: '2026-03-10', service: 'Haircut with Beard', amount: 60 },
      { date: '2026-02-24', service: 'Haircut with Beard & Hot Towel', amount: 65 },
      { date: '2026-01-18', service: 'Haircut with Beard', amount: 60 },
    ],
    notes: 'Loyal client for 5+ years. Prefers low taper fade. No alcohol-based products.',
  },
  {
    id: 'cl-2',
    name: 'Marcus Reed',
    phone: '(201) 555-4467',
    email: 'marcus@example.com',
    lastAppointment: '2026-03-09',
    history: [
      { date: '2026-03-09', service: 'Beard with "The Works"', amount: 45 },
      { date: '2026-02-10', service: 'Gentlemen Haircut / Shape Up', amount: 35 },
    ],
    notes: 'Sensitive skin. Prefers warm shave oil finish.',
  },
  {
    id: 'cl-3',
    name: 'Anthony Cole',
    phone: '(201) 555-7790',
    email: 'anthony@example.com',
    lastAppointment: '2026-03-08',
    history: [{ date: '2026-03-08', service: 'Gentlemen Haircut / Shape Up', amount: 35 }],
    notes: 'First-time client. Referred by Marcus.',
  },
]

const starterAppointments = [
  { id: 'ap-1', date: '2026-03-10', time: '11:00', customer: 'Jordan Hayes', service: 'Haircut with Beard', amount: 60, status: 'Completed' },
  { id: 'ap-2', date: '2026-03-09', time: '13:30', customer: 'Marcus Reed', service: 'Beard with "The Works"', amount: 45, status: 'Completed' },
  { id: 'ap-3', date: '2026-03-13', time: '15:00', customer: 'Anthony Cole', service: 'Gentlemen Haircut / Shape Up', amount: 35, status: 'Booked' },
]

const timeSlots = [
  '10:00','10:30','11:00','11:30','12:00','12:30',
  '13:00','13:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00','18:30',
]

const GALLERY_PHOTOS = [
  'https://d2zdpiztbgorvt.cloudfront.net/region1/us/697614/inspiration/6693391512cf4c2ba29003959baf2f-casper-inspiration-13a473648bf346d48ba1d5f0f884eb-booksy.jpeg',
  'https://d2zdpiztbgorvt.cloudfront.net/region1/us/697614/inspiration/829c3eada20a4e6e928274559020d8-casper-inspiration-08629ecd624b4b2c800aee11eddc3b-booksy.jpeg',
  'https://d2zdpiztbgorvt.cloudfront.net/region1/us/697614/inspiration/4ab419a3bc714f22a9338574d876dc-casper-inspiration-29375a6e8aa34b4dad62cb7f921dc5-booksy.jpeg',
  'https://d2zdpiztbgorvt.cloudfront.net/region1/us/697614/inspiration/885e369c50814ca487fa93311c760a-casper-inspiration-5a7cc3275bb240eeb64878dfd27abe-booksy.jpeg',
  'https://d2zdpiztbgorvt.cloudfront.net/region1/us/697614/review_photos/92621b18b1554bf0b9e256051250f8b9.jpeg',
]

const LOGO =
  'https://d2zdpiztbgorvt.cloudfront.net/region1/us/697614/biz_photo/88c2c5003f084211a8ba3ccdcc3b55-tanos-barbershop-biz-photo-734d5b5e9544420387ef63266a6f16-booksy.jpeg'

const formatMoney = (v) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

const isWithinLastNDays = (dateString, days) => {
  const now = new Date()
  const date = new Date(`${dateString}T12:00:00`)
  const diff = now.getTime() - date.getTime()
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000
}

// ─────────────────────────────────────────────
// PUBLIC SITE  (client-facing)
// ─────────────────────────────────────────────
function PublicSite({ services, appointments, onBook, booking, setBooking }) {
  const loyalty = [
    { id: 'ly-1', title: '10 Cuts, 11th is Free', reward: 'Free Gentlemen Haircut / Shape Up ($35 value)' },
    { id: 'ly-2', title: 'Refer a Friend', reward: '$10 off your next haircut' },
    { id: 'ly-3', title: 'VIP Early Access', reward: 'Priority booking + complimentary hot towel on every visit' },
  ]

  const selectedService = services.find((s) => s.id === booking.serviceId) ?? services[0]

  const unavailableSlots = useMemo(() =>
    appointments
      .filter((a) => a.date === booking.date && a.status !== 'Cancelled')
      .map((a) => a.time),
    [appointments, booking.date]
  )

  return (
    <div className="app">
      {/* HERO */}
      <header className="hero">
        <div className="hero__topline">
          <span>⭐ 5.0 · 59 reviews</span>
          <span>442 Ridge Rd, Lyndhurst, NJ</span>
          <span>(201) 889-6440</span>
        </div>
        <div className="hero__brand">
          <img src={LOGO} alt="Casper – Master Barber, Lyndhurst NJ" className="hero__logo" />
          <div>
            <h1>Casper</h1>
            <p className="hero__tagline">Master barber · Lyndhurst, NJ · Est. 15+ years of elite cuts</p>
            <p className="hero__sub">Book directly with Casper — no middleman, no fees, just great cuts.</p>
            <div className="hero__hours">
              <span>Mon–Fri 10am–7pm</span>
              <span>Sat 10am–6pm</span>
            </div>
          </div>
        </div>
      </header>

      <main className="layout">
        {/* BOOKING */}
        <section className="card" id="booking">
          <h2>Book an Appointment</h2>
          <p className="section-sub">
            Pick your service, choose an open slot, and confirm.
            Changes allowed up to 1 hour before · 24-hour cancellation policy.
          </p>
          <form className="stack" onSubmit={onBook}>
            <label>
              Your Name
              <input value={booking.customer} onChange={(e) => setBooking((p) => ({ ...p, customer: e.target.value }))} placeholder="First and last name" required />
            </label>
            <label>
              Phone
              <input value={booking.phone} onChange={(e) => setBooking((p) => ({ ...p, phone: e.target.value }))} placeholder="(201) 000-0000" required />
            </label>
            <label>
              Email
              <input type="email" value={booking.email} onChange={(e) => setBooking((p) => ({ ...p, email: e.target.value }))} placeholder="you@email.com" required />
            </label>
            <div className="row">
              <label>
                Date
                <input type="date" value={booking.date} onChange={(e) => setBooking((p) => ({ ...p, date: e.target.value }))} required />
              </label>
              <label>
                Service
                <select value={booking.serviceId} onChange={(e) => setBooking((p) => ({ ...p, serviceId: e.target.value }))}>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} — {formatMoney(s.price)}</option>
                  ))}
                </select>
              </label>
            </div>

            {selectedService && (
              <div className="service-summary">
                <strong>{selectedService.name}</strong>
                <span>{selectedService.duration} min · {formatMoney(selectedService.price)}</span>
              </div>
            )}

            <div>
              <span className="label-title">Available Time Slots</span>
              <div className="chips">
                {timeSlots.map((slot) => (
                  <button
                    key={slot} type="button"
                    className={slot === booking.time ? 'chip chip--active' : 'chip'}
                    disabled={unavailableSlots.includes(slot)}
                    onClick={() => setBooking((p) => ({ ...p, time: slot }))}
                  >{slot}</button>
                ))}
              </div>
            </div>

            <div className="row">
              <label>
                Payment
                <select value={booking.paymentType} onChange={(e) => setBooking((p) => ({ ...p, paymentType: e.target.value }))}>
                  <option value="deposit">Deposit (hold slot)</option>
                  <option value="full">Full Prepayment</option>
                  <option value="pay-later">Pay at Shop</option>
                </select>
              </label>
              <label>
                Add Tip ($)
                <input type="number" min="0" step="5" value={booking.tip} onChange={(e) => setBooking((p) => ({ ...p, tip: Number(e.target.value) }))} />
              </label>
            </div>

            <button className="btn" type="submit">Confirm Booking</button>
          </form>
        </section>

        {/* SERVICES */}
        <section className="card" id="services">
          <h2>Service Menu</h2>
          <p className="section-sub">Everything Casper offers — pick your service when booking.</p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Service</th><th>Duration</th><th>Price</th></tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.duration} min</td>
                    <td>{formatMoney(s.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* LOYALTY */}
        <section className="card" id="loyalty">
          <h2>Loyalty Rewards</h2>
          <p className="section-sub">Come back, get rewarded.</p>
          <div className="rewards">
            {loyalty.map((p) => (
              <article key={p.id}>
                <h3>{p.title}</h3>
                <p className="reward-value">{p.reward}</p>
              </article>
            ))}
          </div>
        </section>

        {/* GALLERY */}
        <section className="card" id="gallery">
          <h2>The Work</h2>
          <p className="section-sub">Straight from the chair.</p>
          <div className="photo-grid">
            {GALLERY_PHOTOS.map((photo) => (
              <img key={photo} src={photo} alt="Casper Barbershop cut" loading="lazy" />
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p><strong>Casper</strong> · 442 Ridge Rd, Lyndhurst, NJ 07071 · (201) 889-6440</p>
        <p className="muted">⭐ 5.0 · 59 verified reviews · Mon–Fri 10–7 · Sat 10–6</p>
      </footer>
    </div>
  )
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

        {/* ── APPOINTMENTS ── */}
        {activeTab === 'appointments' && (
          <section className="card">
            <h2>Appointments</h2>
            <p className="section-sub">Manage bookings and update statuses.</p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Date</th><th>Time</th><th>Client</th><th>Service</th><th>Amount</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.id}>
                      <td>{a.date}</td>
                      <td>{a.time}</td>
                      <td>{a.customer}</td>
                      <td>{a.service}</td>
                      <td>{formatMoney(a.amount)}</td>
                      <td>
                        <select value={a.status} onChange={(e) => {
                          const s = e.target.value
                          setAppointments((p) => p.map((i) => i.id === a.id ? { ...i, status: s } : i))
                        }}>
                          <option value="Booked">Booked</option>
                          <option value="Completed">Completed</option>
                          <option value="Rescheduled">Rescheduled</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="stack" style={{ marginTop: '1.5rem' }}>
              <label>
                Blast Promotion to All Clients
                <textarea rows="2" value={promotion} onChange={(e) => setPromotion(e.target.value)} placeholder='e.g. "Flash deal this Saturday — book before noon for $10 off!"' />
              </label>
              <button className="btn" type="button" onClick={handlePromoSend}>Send SMS + Email to All Clients</button>
              {promoLog.map((entry, i) => <p className="muted" key={i}>{entry}</p>)}
            </div>
          </section>
        )}

        {/* ── CLIENTS ── */}
        {activeTab === 'clients' && (
          <section className="card">
            <h2>Client Records</h2>
            <p className="section-sub">Full history, preferences, and notes for every client.</p>
            <div className="row">
              <label>
                Select Client
                <select value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)}>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
            </div>
            {selectedClient && (
              <div className="detail-grid">
                <div>
                  <h3>{selectedClient.name}</h3>
                  <p>{selectedClient.phone}</p>
                  <p>{selectedClient.email}</p>
                  <p className="muted">Last visit: {selectedClient.lastAppointment}</p>
                  <p className="badge">{selectedClient.history.length} visit{selectedClient.history.length !== 1 ? 's' : ''}</p>
                </div>
                <div>
                  <h3>Your Notes</h3>
                  <p>{selectedClient.notes || 'No notes yet.'}</p>
                  <div className="row" style={{ marginTop: '0.75rem' }}>
                    <input placeholder="Add a note..." value={newClientNote} onChange={(e) => setNewClientNote(e.target.value)} />
                    <button type="button" className="btn btn--small" onClick={updateClientNotes}>Save</button>
                  </div>
                </div>
              </div>
            )}
            <div className="table-wrap">
              <table>
                <thead><tr><th>Date</th><th>Service</th><th>Spend</th></tr></thead>
                <tbody>
                  {selectedClient?.history.map((entry, i) => (
                    <tr key={i}><td>{entry.date}</td><td>{entry.service}</td><td>{formatMoney(entry.amount)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

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

// ─────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────
function App() {
  const [services, setServices] = useState(starterServices)
  const [clients, setClients] = useState(starterClients)
  const [appointments, setAppointments] = useState(starterAppointments)
  const [adminView, setAdminView] = useState(false) // 'login' | 'dashboard' | false
  const [booking, setBooking] = useState({
    customer: '', phone: '', email: '',
    date: '2026-03-14', time: '10:00',
    serviceId: starterServices[0].id,
    paymentType: 'deposit', tip: 0,
  })

  const handleBook = (e) => {
    e.preventDefault()
    const svc = services.find((s) => s.id === booking.serviceId) ?? services[0]
    if (!booking.customer || !booking.phone || !booking.email || !svc) return
    const amount = svc.price + (Number(booking.tip) || 0)
    const appt = { id: `ap-${Date.now()}`, date: booking.date, time: booking.time, customer: booking.customer, service: svc.name, amount, status: 'Booked' }
    setAppointments((p) => [appt, ...p])
    setClients((p) => {
      const match = p.find((c) => c.email.toLowerCase() === booking.email.toLowerCase())
      if (!match) return [{ id: `cl-${Date.now()}`, name: booking.customer, phone: booking.phone, email: booking.email, lastAppointment: booking.date, history: [{ date: booking.date, service: svc.name, amount }], notes: '' }, ...p]
      return p.map((c) => c.id !== match.id ? c : { ...c, phone: booking.phone, lastAppointment: booking.date, history: [{ date: booking.date, service: svc.name, amount }, ...c.history] })
    })
    setBooking((p) => ({ ...p, customer: '', phone: '', email: '' }))
  }

  // Secret admin entry: click footer 5 times
  const [footerTaps, setFooterTaps] = useState(0)
  const handleFooterTap = () => {
    const next = footerTaps + 1
    setFooterTaps(next)
    if (next >= 5) { setAdminView('login'); setFooterTaps(0) }
  }

  if (adminView === 'login') {
    return <AdminLogin onSuccess={() => setAdminView('dashboard')} />
  }

  if (adminView === 'dashboard') {
    return (
      <AdminDashboard
        services={services} setServices={setServices}
        clients={clients} setClients={setClients}
        appointments={appointments} setAppointments={setAppointments}
        onLogout={() => setAdminView(false)}
      />
    )
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'BarberShop',
        name: 'Casper', url: 'https://casperbarber.com',
        telephone: '(201) 889-6440', email: 'emmix21379@gmail.com',
        address: { '@type': 'PostalAddress', streetAddress: '442 Ridge Rd', addressLocality: 'Lyndhurst', addressRegion: 'NJ', postalCode: '07071', addressCountry: 'US' },
        openingHours: ['Mo-Fr 10:00-19:00', 'Sa 10:00-18:00'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '5.0', reviewCount: '59' },
        priceRange: '$35–$100',
      })}} />
      <PublicSite
        services={services}
        appointments={appointments}
        onBook={handleBook}
        booking={booking}
        setBooking={setBooking}
      />
      {/* Invisible admin trigger on footer */}
      <div className="admin-trigger" onClick={handleFooterTap} aria-hidden="true" />
    </>
  )
}

export default App
