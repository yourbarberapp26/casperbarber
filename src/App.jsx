import { useMemo, useState } from 'react'

// Real services from Casper's Booksy profile – 442 Ridge Rd, Lyndhurst NJ
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
  {
    id: 'ap-1',
    date: '2026-03-10',
    time: '11:00',
    customer: 'Jordan Hayes',
    service: 'Haircut with Beard',
    amount: 60,
    status: 'Completed',
  },
  {
    id: 'ap-2',
    date: '2026-03-09',
    time: '13:30',
    customer: 'Marcus Reed',
    service: 'Beard with "The Works"',
    amount: 45,
    status: 'Completed',
  },
  {
    id: 'ap-3',
    date: '2026-03-13',
    time: '15:00',
    customer: 'Anthony Cole',
    service: 'Gentlemen Haircut / Shape Up',
    amount: 35,
    status: 'Booked',
  },
]

// Mon–Fri 10–7, Sat 10–6 (slots every 30 min)
const timeSlots = [
  '10:00', '10:30',
  '11:00', '11:30',
  '12:00', '12:30',
  '13:00', '13:30',
  '14:00', '14:30',
  '15:00', '15:30',
  '16:00', '16:30',
  '17:00', '17:30',
  '18:00', '18:30',
]

const formatMoney = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

const isWithinLastNDays = (dateString, days) => {
  const now = new Date()
  const date = new Date(`${dateString}T12:00:00`)
  const diff = now.getTime() - date.getTime()
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000
}

// Structured data (JSON-LD) for SEO / Google Business
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BarberShop',
  name: 'Casper',
  url: 'https://casperbarber.com',
  telephone: '(201) 889-6440',
  email: 'emmix21379@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '442 Ridge Rd',
    addressLocality: 'Lyndhurst',
    addressRegion: 'NJ',
    postalCode: '07071',
    addressCountry: 'US',
  },
  openingHours: ['Mo-Fr 10:00-19:00', 'Sa 10:00-18:00'],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '59',
  },
  priceRange: '$35–$100',
}

function App() {
  const [services, setServices] = useState(starterServices)
  const [clients, setClients] = useState(starterClients)
  const [appointments, setAppointments] = useState(starterAppointments)

  const [brand, setBrand] = useState({
    barberName: 'Casper',
    barberEmail: 'emmix21379@gmail.com',
    address: '442 Ridge Rd, Lyndhurst, NJ 07071',
    phone: '(201) 889-6440',
    logoUrl:
      'https://d2zdpiztbgorvt.cloudfront.net/region1/us/697614/biz_photo/88c2c5003f084211a8ba3ccdcc3b55-tanos-barbershop-biz-photo-734d5b5e9544420387ef63266a6f16-booksy.jpeg',
    primary: '#0d0d0d',
    accent: '#c9a84c',
    photos:
      'https://d2zdpiztbgorvt.cloudfront.net/region1/us/697614/inspiration/6693391512cf4c2ba29003959baf2f-casper-inspiration-13a473648bf346d48ba1d5f0f884eb-booksy.jpeg, https://d2zdpiztbgorvt.cloudfront.net/region1/us/697614/inspiration/829c3eada20a4e6e928274559020d8-casper-inspiration-08629ecd624b4b2c800aee11eddc3b-booksy.jpeg, https://d2zdpiztbgorvt.cloudfront.net/region1/us/697614/inspiration/4ab419a3bc714f22a9338574d876dc-casper-inspiration-29375a6e8aa34b4dad62cb7f921dc5-booksy.jpeg, https://d2zdpiztbgorvt.cloudfront.net/region1/us/697614/inspiration/885e369c50814ca487fa93311c760a-casper-inspiration-5a7cc3275bb240eeb64878dfd27abe-booksy.jpeg, https://d2zdpiztbgorvt.cloudfront.net/region1/us/697614/review_photos/92621b18b1554bf0b9e256051250f8b9.jpeg',
  })

  const [booking, setBooking] = useState({
    customer: '',
    phone: '',
    email: '',
    date: '2026-03-14',
    time: '10:00',
    serviceId: starterServices[0].id,
    paymentType: 'deposit',
    tip: 0,
  })

  const [newService, setNewService] = useState({ name: '', price: '', duration: '' })
  const [newClientNote, setNewClientNote] = useState('')
  const [selectedClientId, setSelectedClientId] = useState(starterClients[0].id)
  const [promotion, setPromotion] = useState('')
  const [promoLog, setPromoLog] = useState([])
  const [loyalty, setLoyalty] = useState([
    {
      id: 'ly-1',
      title: '10 Cuts, 11th is Free',
      condition: '10 completed appointments',
      reward: 'Free Gentlemen Haircut / Shape Up ($35 value)',
    },
    {
      id: 'ly-2',
      title: 'Refer a Friend',
      condition: 'Referred client books & completes first visit',
      reward: '$10 off your next haircut',
    },
    {
      id: 'ly-3',
      title: 'VIP Early Access',
      condition: '$500+ lifetime spend',
      reward: 'Priority booking + complimentary hot towel on every visit',
    },
  ])
  const [newReward, setNewReward] = useState({ title: '', condition: '', reward: '' })

  const selectedService = services.find((service) => service.id === booking.serviceId) ?? services[0]
  const selectedClient = clients.find((client) => client.id === selectedClientId) ?? clients[0]

  const unavailableSlots = useMemo(() => {
    return appointments
      .filter((item) => item.date === booking.date && item.status !== 'Cancelled')
      .map((item) => item.time)
  }, [appointments, booking.date])

  const analytics = useMemo(() => {
    const completed = appointments.filter((item) => item.status === 'Completed')
    const dailyRevenue = completed
      .filter((item) => isWithinLastNDays(item.date, 1))
      .reduce((sum, item) => sum + item.amount, 0)
    const weeklyRevenue = completed
      .filter((item) => isWithinLastNDays(item.date, 7))
      .reduce((sum, item) => sum + item.amount, 0)
    const monthlyRevenue = completed
      .filter((item) => isWithinLastNDays(item.date, 30))
      .reduce((sum, item) => sum + item.amount, 0)

    const bookings = appointments.length
    const repeatCustomers = clients.filter((client) => client.history.length > 1).length
    const retention = clients.length ? Math.round((repeatCustomers / clients.length) * 100) : 0

    const serviceMap = completed.reduce((acc, item) => {
      acc[item.service] = (acc[item.service] ?? 0) + 1
      return acc
    }, {})

    const topServices = Object.entries(serviceMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    const totalSpend = completed.reduce((sum, item) => sum + item.amount, 0)
    const averageSpend = clients.length ? Math.round(totalSpend / clients.length) : 0

    return {
      dailyRevenue,
      weeklyRevenue,
      monthlyRevenue,
      bookings,
      repeatCustomers,
      retention,
      topServices,
      averageSpend,
    }
  }, [appointments, clients])

  const handleBookingSubmit = (event) => {
    event.preventDefault()
    if (!booking.customer || !booking.phone || !booking.email || !selectedService) return

    const baseAmount = selectedService.price
    const tipValue = Number(booking.tip) || 0
    const amount = baseAmount + tipValue

    const newAppointment = {
      id: `ap-${Date.now()}`,
      date: booking.date,
      time: booking.time,
      customer: booking.customer,
      service: selectedService.name,
      amount,
      status: 'Booked',
    }

    setAppointments((previous) => [newAppointment, ...previous])

    setClients((previous) => {
      const match = previous.find(
        (client) => client.email.toLowerCase() === booking.email.toLowerCase(),
      )

      if (!match) {
        const created = {
          id: `cl-${Date.now()}`,
          name: booking.customer,
          phone: booking.phone,
          email: booking.email,
          lastAppointment: booking.date,
          history: [{ date: booking.date, service: selectedService.name, amount }],
          notes: '',
        }
        setSelectedClientId(created.id)
        return [created, ...previous]
      }

      setSelectedClientId(match.id)
      return previous.map((client) => {
        if (client.id !== match.id) return client
        return {
          ...client,
          phone: booking.phone,
          lastAppointment: booking.date,
          history: [
            { date: booking.date, service: selectedService.name, amount },
            ...client.history,
          ],
        }
      })
    })

    setBooking((previous) => ({ ...previous, customer: '', phone: '', email: '' }))
  }

  const handleServiceCreate = (event) => {
    event.preventDefault()
    if (!newService.name || !newService.price || !newService.duration) return
    const created = {
      id: `svc-${Date.now()}`,
      name: newService.name,
      price: Number(newService.price),
      duration: Number(newService.duration),
    }
    setServices((previous) => [...previous, created])
    setNewService({ name: '', price: '', duration: '' })
  }

  const updateClientNotes = () => {
    if (!selectedClient || !newClientNote.trim()) return
    setClients((previous) =>
      previous.map((client) =>
        client.id === selectedClient.id
          ? { ...client, notes: `${client.notes} ${newClientNote.trim()}`.trim() }
          : client,
      ),
    )
    setNewClientNote('')
  }

  const handlePromoSend = () => {
    if (!promotion.trim()) return
    const message = `✓ Promo sent to ${clients.length} clients + ${brand.barberEmail}: "${promotion.trim()}"`
    setPromoLog((previous) => [message, ...previous])
    setPromotion('')
  }

  const addReward = (event) => {
    event.preventDefault()
    if (!newReward.title || !newReward.condition || !newReward.reward) return
    setLoyalty((previous) => [
      ...previous,
      { id: `ly-${Date.now()}`, ...newReward },
    ])
    setNewReward({ title: '', condition: '', reward: '' })
  }

  const galleryPhotos = brand.photos
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  return (
    <>
      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="app" style={{ '--brand-accent': brand.accent, '--brand-primary': brand.primary }}>
        {/* ── HERO ── */}
        <header className="hero">
          <div className="hero__topline">
            <span>⭐ 5.0 · 59 reviews</span>
            <span>442 Ridge Rd, Lyndhurst, NJ</span>
            <span>(201) 889-6440</span>
          </div>
          <div className="hero__brand">
            <img src={brand.logoUrl} alt="Casper – Master Barber, Lyndhurst NJ" className="hero__logo" />
            <div>
              <h1>{brand.barberName}</h1>
              <p className="hero__tagline">
                Master barber · Lyndhurst, NJ · Est. 15+ years of elite cuts
              </p>
              <p className="hero__sub">
                Book directly with Casper — no middleman, no fees, just great cuts.
              </p>
              <div className="hero__hours">
                <span>Mon–Fri 10am–7pm</span>
                <span>Sat 10am–6pm</span>
              </div>
            </div>
          </div>
        </header>

        <main className="layout">
          {/* ── BOOKING ── */}
          <section className="card" id="booking">
            <h2>Book an Appointment</h2>
            <p className="section-sub">
              Select your service, choose an open slot, and pay your way.
              Changes allowed up to 1 hour before; 24-hour cancellation policy applies.
            </p>
            <form className="stack" onSubmit={handleBookingSubmit}>
              <label>
                Client Name
                <input
                  value={booking.customer}
                  onChange={(event) => setBooking((prev) => ({ ...prev, customer: event.target.value }))}
                  placeholder="First and last name"
                  required
                />
              </label>
              <label>
                Phone
                <input
                  value={booking.phone}
                  onChange={(event) => setBooking((prev) => ({ ...prev, phone: event.target.value }))}
                  placeholder="(201) 000-0000"
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={booking.email}
                  onChange={(event) => setBooking((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="you@email.com"
                  required
                />
              </label>
              <div className="row">
                <label>
                  Date
                  <input
                    type="date"
                    value={booking.date}
                    onChange={(event) => setBooking((prev) => ({ ...prev, date: event.target.value }))}
                    required
                  />
                </label>
                <label>
                  Service
                  <select
                    value={booking.serviceId}
                    onChange={(event) => setBooking((prev) => ({ ...prev, serviceId: event.target.value }))}
                  >
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} — {formatMoney(service.price)}
                      </option>
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
                  {timeSlots.map((slot) => {
                    const unavailable = unavailableSlots.includes(slot)
                    return (
                      <button
                        key={slot}
                        type="button"
                        className={slot === booking.time ? 'chip chip--active' : 'chip'}
                        disabled={unavailable}
                        onClick={() => setBooking((prev) => ({ ...prev, time: slot }))}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="row">
                <label>
                  Payment
                  <select
                    value={booking.paymentType}
                    onChange={(event) =>
                      setBooking((prev) => ({ ...prev, paymentType: event.target.value }))
                    }
                  >
                    <option value="deposit">Deposit (hold slot)</option>
                    <option value="full">Full Prepayment</option>
                    <option value="pay-later">Pay at Shop</option>
                  </select>
                </label>
                <label>
                  Add Tip ($)
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={booking.tip}
                    onChange={(event) => setBooking((prev) => ({ ...prev, tip: Number(event.target.value) }))}
                  />
                </label>
              </div>

              <button className="btn" type="submit">
                Confirm Booking — Send SMS & Email
              </button>
            </form>
          </section>

          {/* ── SERVICES ── */}
          <section className="card" id="services">
            <h2>Service Menu</h2>
            <p className="section-sub">Casper's full service lineup — edit prices and durations any time.</p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Duration</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td>{service.name}</td>
                      <td>{service.duration} min</td>
                      <td>{formatMoney(service.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <form className="row" onSubmit={handleServiceCreate}>
              <input
                placeholder="New service name"
                value={newService.name}
                onChange={(event) => setNewService((prev) => ({ ...prev, name: event.target.value }))}
              />
              <input
                type="number"
                placeholder="Price"
                value={newService.price}
                onChange={(event) => setNewService((prev) => ({ ...prev, price: event.target.value }))}
              />
              <input
                type="number"
                placeholder="Min"
                value={newService.duration}
                onChange={(event) => setNewService((prev) => ({ ...prev, duration: event.target.value }))}
              />
              <button className="btn btn--small" type="submit">
                + Add
              </button>
            </form>
          </section>

          {/* ── CRM ── */}
          <section className="card" id="crm">
            <h2>Client CRM</h2>
            <p className="section-sub">
              Own your client database — history, preferences, and notes all in one place.
            </p>
            <div className="row">
              <label>
                Select Client
                <select
                  value={selectedClientId}
                  onChange={(event) => setSelectedClientId(event.target.value)}
                >
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
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
                  <h3>Casper's Notes</h3>
                  <p>{selectedClient.notes || 'No notes yet.'}</p>
                  <div className="row">
                    <input
                      placeholder="Add a note..."
                      value={newClientNote}
                      onChange={(event) => setNewClientNote(event.target.value)}
                    />
                    <button type="button" className="btn btn--small" onClick={updateClientNotes}>
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Service</th>
                    <th>Spend</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedClient?.history.map((entry, idx) => (
                    <tr key={`${entry.date}-${idx}`}>
                      <td>{entry.date}</td>
                      <td>{entry.service}</td>
                      <td>{formatMoney(entry.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── NOTIFICATIONS ── */}
          <section className="card" id="notifications">
            <h2>SMS & Email Notifications</h2>
            <p className="section-sub">
              Automated messages sent to clients + Casper's email on every booking event.
            </p>
            <div className="grid-two">
              <div className="message-card">
                <strong>Booking Confirmation</strong>
                <p>
                  "You're booked with Casper at {brand.address}. {booking.date} at {booking.time} —{' '}
                  {selectedService?.name}. We'll see you then!"
                </p>
              </div>
              <div className="message-card">
                <strong>24h Reminder</strong>
                <p>
                  "Hi, just a reminder your appointment with Casper is tomorrow at {booking.time}.
                  Reply RESCHEDULE to change — cancellations need 24hrs notice."
                </p>
              </div>
              <div className="message-card">
                <strong>Reschedule Notice</strong>
                <p>
                  "Your Casper appointment has been moved. Please confirm your new time at
                  casperbarber.com or call (201) 889-6440."
                </p>
              </div>
              <div className="message-card">
                <strong>Post-Visit Thank You</strong>
                <p>
                  "Thanks for coming in! Leave a review on Booksy and refer a friend for $10 off your next cut."
                </p>
              </div>
            </div>
            <p className="muted">All events are also forwarded to {brand.barberEmail}.</p>
          </section>

          {/* ── ANALYTICS ── */}
          <section className="card" id="analytics">
            <h2>Revenue Dashboard</h2>
            <p className="section-sub">
              Business intelligence that Booksy and other marketplace apps don't give you.
            </p>
            <div className="metrics">
              <article>
                <span>Today's Revenue</span>
                <strong>{formatMoney(analytics.dailyRevenue)}</strong>
              </article>
              <article>
                <span>7-Day Revenue</span>
                <strong>{formatMoney(analytics.weeklyRevenue)}</strong>
              </article>
              <article>
                <span>30-Day Revenue</span>
                <strong>{formatMoney(analytics.monthlyRevenue)}</strong>
              </article>
              <article>
                <span>Total Bookings</span>
                <strong>{analytics.bookings}</strong>
              </article>
              <article>
                <span>Repeat Clients</span>
                <strong>{analytics.repeatCustomers}</strong>
              </article>
              <article>
                <span>Retention Rate</span>
                <strong>{analytics.retention}%</strong>
              </article>
              <article>
                <span>Avg Spend / Client</span>
                <strong>{formatMoney(analytics.averageSpend)}</strong>
              </article>
              <article>
                <span>Total Clients</span>
                <strong>{clients.length}</strong>
              </article>
            </div>
            <div className="top-services">
              <h3>Top Services</h3>
              {analytics.topServices.length ? (
                analytics.topServices.map(([serviceName, count]) => (
                  <p key={serviceName}>
                    <span className="dot" /> {serviceName} — {count} booking{count !== 1 ? 's' : ''}
                  </p>
                ))
              ) : (
                <p className="muted">No completed services yet. Mark appointments as Completed to see data.</p>
              )}
            </div>
          </section>

          {/* ── LOYALTY ── */}
          <section className="card" id="loyalty">
            <h2>Loyalty Programs</h2>
            <p className="section-sub">Reward your regulars and keep clients coming back to you — not a platform.</p>
            <div className="rewards">
              {loyalty.map((program) => (
                <article key={program.id}>
                  <h3>{program.title}</h3>
                  <p className="muted">Condition: {program.condition}</p>
                  <p className="reward-value">Reward: {program.reward}</p>
                </article>
              ))}
            </div>
            <form className="stack" onSubmit={addReward}>
              <input
                placeholder="Program title"
                value={newReward.title}
                onChange={(event) => setNewReward((prev) => ({ ...prev, title: event.target.value }))}
              />
              <input
                placeholder="Condition (e.g., 10 visits)"
                value={newReward.condition}
                onChange={(event) =>
                  setNewReward((prev) => ({ ...prev, condition: event.target.value }))
                }
              />
              <input
                placeholder="Reward (e.g., Free haircut)"
                value={newReward.reward}
                onChange={(event) => setNewReward((prev) => ({ ...prev, reward: event.target.value }))}
              />
              <button className="btn btn--small" type="submit">
                Add Program
              </button>
            </form>
          </section>

          {/* ── BRAND ── */}
          <section className="card" id="branding">
            <h2>Brand Settings</h2>
            <p className="section-sub">Personalize casperbarber.com — logo, colors, address, and gallery photos.</p>
            <div className="stack">
              <label>
                Business Name
                <input
                  value={brand.barberName}
                  onChange={(event) => setBrand((prev) => ({ ...prev, barberName: event.target.value }))}
                />
              </label>
              <label>
                Address
                <input
                  value={brand.address}
                  onChange={(event) => setBrand((prev) => ({ ...prev, address: event.target.value }))}
                />
              </label>
              <div className="row">
                <label>
                  Phone
                  <input
                    value={brand.phone}
                    onChange={(event) => setBrand((prev) => ({ ...prev, phone: event.target.value }))}
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={brand.barberEmail}
                    onChange={(event) => setBrand((prev) => ({ ...prev, barberEmail: event.target.value }))}
                  />
                </label>
              </div>
              <label>
                Logo URL
                <input
                  value={brand.logoUrl}
                  onChange={(event) => setBrand((prev) => ({ ...prev, logoUrl: event.target.value }))}
                />
              </label>
              <div className="row">
                <label>
                  Primary Color
                  <input
                    type="color"
                    value={brand.primary}
                    onChange={(event) => setBrand((prev) => ({ ...prev, primary: event.target.value }))}
                  />
                </label>
                <label>
                  Accent Color
                  <input
                    type="color"
                    value={brand.accent}
                    onChange={(event) => setBrand((prev) => ({ ...prev, accent: event.target.value }))}
                  />
                </label>
              </div>
              <label>
                Gallery Photos (comma-separated URLs)
                <textarea
                  rows="3"
                  value={brand.photos}
                  onChange={(event) => setBrand((prev) => ({ ...prev, photos: event.target.value }))}
                />
              </label>
            </div>
            <div className="photo-grid">
              {galleryPhotos.map((photo) => (
                <img key={photo} src={photo} alt="Casper Barbershop" loading="lazy" />
              ))}
            </div>
          </section>

          {/* ── ADMIN ── */}
          <section className="card" id="admin">
            <h2>Admin Panel</h2>
            <p className="section-sub">Manage appointments, update statuses, and blast promotions to all clients.</p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.slice(0, 10).map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.date}</td>
                      <td>{appointment.time}</td>
                      <td>{appointment.customer}</td>
                      <td>{appointment.service}</td>
                      <td>{formatMoney(appointment.amount)}</td>
                      <td>
                        <select
                          value={appointment.status}
                          onChange={(event) => {
                            const nextStatus = event.target.value
                            setAppointments((previous) =>
                              previous.map((item) =>
                                item.id === appointment.id
                                  ? { ...item, status: nextStatus }
                                  : item,
                              ),
                            )
                          }}
                        >
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
            <div className="stack">
              <label>
                Blast Promotion to All Clients
                <textarea
                  rows="2"
                  value={promotion}
                  onChange={(event) => setPromotion(event.target.value)}
                  placeholder='e.g. "Flash deal this Saturday — book before noon for $10 off!"'
                />
              </label>
              <button className="btn" type="button" onClick={handlePromoSend}>
                Send SMS + Email to All Clients
              </button>
              {promoLog.map((entry, i) => (
                <p className="muted" key={i}>
                  {entry}
                </p>
              ))}
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>
            <strong>Casper</strong> · 442 Ridge Rd, Lyndhurst, NJ 07071 · (201) 889-6440
          </p>
          <p>
            casperbarber.com · Booking powered by your own platform, not a third-party marketplace.
          </p>
          <p className="muted">⭐ 5.0 · 59 verified reviews · Mon–Fri 10–7 · Sat 10–6</p>
        </footer>
      </div>
    </>
  )
}

export default App
