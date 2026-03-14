// src/pages/public/PublicSite.jsx
import { useState, useMemo } from "react"
import { formatMoney } from "../../utils/helpers"

export default function PublicSite({ services, appointments, onBook, booking, setBooking }) {
  const selectedService = services.find((s) => s.id === booking.serviceId) ?? services[0]

  const unavailableSlots = useMemo(
    () =>
      appointments
        .filter((a) => a.date === booking.date && a.status !== "Cancelled")
        .map((a) => a.time),
    [appointments, booking.date]
  )

  const timeSlots = [
    "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00"
  ]

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
            <p className="hero__tagline">Master barber · Lyndhurst, NJ · 15+ years of elite cuts</p>
            <p className="hero__sub">Book directly — no middleman, no fees, just great cuts.</p>
            <button onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })} className="btn">
              Book Now
            </button>
          </div>
        </div>
      </header>

      <main className="layout">
        {/* BOOKING */}
        <section className="card" id="booking">
          <h2>Book an Appointment</h2>
          <p className="section-sub">Pick your service, choose an open slot, and confirm.</p>
          <form className="stack" onSubmit={onBook}>
            <label>
              Name
              <input
                placeholder="First and last name"
                value={booking.customer}
                onChange={(e) => setBooking((p) => ({ ...p, customer: e.target.value }))}
                required
              />
            </label>
            <label>
              Phone
              <input
                placeholder="(201) 000-0000"
                value={booking.phone}
                onChange={(e) => setBooking((p) => ({ ...p, phone: e.target.value }))}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                placeholder="you@email.com"
                value={booking.email}
                onChange={(e) => setBooking((p) => ({ ...p, email: e.target.value }))}
                required
              />
            </label>

            <div className="row">
              <label>
                Date
                <input
                  type="date"
                  value={booking.date}
                  onChange={(e) => setBooking((p) => ({ ...p, date: e.target.value }))}
                  required
                />
              </label>
              <label>
                Service
                <select
                  value={booking.serviceId}
                  onChange={(e) => setBooking((p) => ({ ...p, serviceId: e.target.value }))}
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {formatMoney(s.price)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {selectedService && (
              <div className="service-summary">
                <strong>{selectedService.name}</strong>
                <span>
                  {selectedService.duration} min · {formatMoney(selectedService.price)}
                </span>
              </div>
            )}

            <div>
              <span className="label-title">Available Time Slots</span>
              <div className="chips">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={slot === booking.time ? "chip chip--active" : "chip"}
                    disabled={unavailableSlots.includes(slot)}
                    onClick={() => setBooking((p) => ({ ...p, time: slot }))}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="row">
              <label>
                Payment
                <select
                  value={booking.paymentType}
                  onChange={(e) => setBooking((p) => ({ ...p, paymentType: e.target.value }))}
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
                  onChange={(e) => setBooking((p) => ({ ...p, tip: Number(e.target.value) }))}
                />
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
                <tr>
                  <th>Service</th>
                  <th>Duration</th>
                  <th>Price</th>
                </tr>
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
            <article>
              <h3>10 Cuts, 11th Free</h3>
              <p className="reward-value">Free Gentlemen Haircut / Shape Up ($35 value)</p>
            </article>
            <article>
              <h3>Refer a Friend</h3>
              <p className="reward-value">$10 off your next haircut</p>
            </article>
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
        <p>
          <strong>Casper</strong> · 442 Ridge Rd, Lyndhurst, NJ 07071 · (201) 889-6440
        </p>
        <p className="muted">⭐ 5.0 · 59 verified reviews · Mon–Fri 10–7 · Sat 10–6</p>
      </footer>
    </div>
  )
}