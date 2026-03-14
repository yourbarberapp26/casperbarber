import { useMemo, useState } from 'react'
import { useState } from "react"
import PublicSite from "./pages/public/PublicSite"
import AdminDashboard from "./pages/admin/AdminDashboard"


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