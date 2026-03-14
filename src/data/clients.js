// src/pages/clients/ClientsPage.jsx
import { useState } from "react"

export const starterClients = [
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