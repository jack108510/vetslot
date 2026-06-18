// OpenSlot — Mock Data & Helpers
// Reference date: 2026-06-14

const CLINICS = [
  {
    id: 'clinic-1',
    name: 'Rosslyn Veterinary Clinic',
    shortName: 'Rosslyn Vet',
    email: 'info@rosslynvet.ca',
    phone: '(780) 555-0142',
    address: '10234 Rosslyn Rd NW',
    city: 'Edmonton',
    province: 'AB',
    description: 'Full-service veterinary clinic serving Edmonton\'s north end since 2003. Our surgical team has completed thousands of spay and neuter procedures with outstanding outcomes.',
    prepInstructions: 'No food after 10 PM the night before surgery. Water is fine until midnight. Bring your pet\'s vaccination records and arrive 15 minutes early for check-in.',
    whatToBring: [
      'Vaccination records (rabies certificate required)',
      'Signed consent form (sent by email after booking)',
      'Payment for remaining procedure balance',
      'Your pet\'s regular collar — no choke chains or prong collars'
    ]
  },
  {
    id: 'clinic-2',
    name: 'Millwoods Animal Hospital',
    shortName: 'Millwoods Animal Hospital',
    email: 'reception@millwoodsvet.ca',
    phone: '(780) 555-0278',
    address: '6203 28 Ave NW',
    city: 'Edmonton',
    province: 'AB',
    description: 'Modern veterinary care in the heart of Millwoods. We\'ve been serving the community for over 15 years with compassionate, evidence-based medicine and state-of-the-art surgical facilities.',
    prepInstructions: 'Fast your pet from midnight the night before. Small sips of water are OK until 6 AM. Drop off window is 8–9 AM.',
    whatToBring: [
      'Vaccination records',
      'Payment for remaining balance after deposit',
      'E-collar if you have one (we provide one free of charge if not)'
    ]
  },
  {
    id: 'clinic-3',
    name: 'Calgary South Vet',
    shortName: 'Calgary South Vet',
    email: 'hello@calgarysouthvet.ca',
    phone: '(403) 555-0391',
    address: '4520 Macleod Trail SW',
    city: 'Calgary',
    province: 'AB',
    description: 'Compassionate, affordable veterinary care for Calgary\'s south communities. We specialize in high-volume spay/neuter programs to help reduce pet overpopulation across Alberta.',
    prepInstructions: 'No food after 8 PM the night before. Water is fine until midnight. Check-in is at 8 AM sharp — please be on time.',
    whatToBring: [
      'Proof of current rabies vaccination',
      'Payment for procedure balance',
      'A phone number where you can be reached during surgery'
    ]
  }
];

const SLOTS = [
  {
    id: 'slot-1',
    clinicId: 'clinic-1',
    date: '2026-06-16',
    time: '9:00 AM',
    procedureType: 'spay',
    species: 'cat',
    price: 285,
    deposit: 50,
    capacity: 2,
    bookedCount: 1,
    notes: 'Female cats only. Patients must be at least 4 months old and under 8 years. Includes post-op pain medication and a complimentary e-collar.',
    status: 'open'
  },
  {
    id: 'slot-2',
    clinicId: 'clinic-1',
    date: '2026-06-18',
    time: '8:30 AM',
    procedureType: 'neuter',
    species: 'dog',
    price: 320,
    deposit: 50,
    capacity: 1,
    bookedCount: 0,
    notes: 'Small to medium dogs only (under 30 kg). Pre-op bloodwork is required and can be done day-of for an additional $65. Price includes e-collar and 3-day pain meds.',
    status: 'open'
  },
  {
    id: 'slot-3',
    clinicId: 'clinic-2',
    date: '2026-06-19',
    time: '10:00 AM',
    procedureType: 'spay',
    species: 'dog',
    price: 395,
    deposit: 75,
    capacity: 1,
    bookedCount: 0,
    notes: 'All sizes and breeds welcome. Drop off between 8–9 AM. Pickup same afternoon. Price includes overnight monitoring if medically necessary.',
    status: 'open'
  },
  {
    id: 'slot-4',
    clinicId: 'clinic-1',
    date: '2026-06-23',
    time: '9:00 AM',
    procedureType: 'both',
    species: 'both',
    price: 260,
    deposit: 50,
    capacity: 3,
    bookedCount: 1,
    notes: 'Community low-cost surgery day. Cats and small dogs (under 15 kg) only. Limited spots — reserve early. Includes standard post-op care package.',
    status: 'open'
  },
  {
    id: 'slot-5',
    clinicId: 'clinic-3',
    date: '2026-06-25',
    time: '8:00 AM',
    procedureType: 'neuter',
    species: 'cat',
    price: 175,
    deposit: 30,
    capacity: 4,
    bookedCount: 2,
    notes: 'Male cats only. Quick procedure — most patients ready for pickup by noon. Price includes e-collar and a 3-day supply of pain medication.',
    status: 'open'
  },
  {
    id: 'slot-6',
    clinicId: 'clinic-2',
    date: '2026-06-27',
    time: '9:30 AM',
    procedureType: 'spay',
    species: 'both',
    price: 310,
    deposit: 60,
    capacity: 2,
    bookedCount: 0,
    notes: 'Dogs and cats welcome. E-collar provided at no extra charge. Includes one complimentary follow-up wellness exam within 14 days.',
    status: 'open'
  }
];

const MOCK_RESERVATIONS = [
  {
    id: 'res-1',
    slotId: 'slot-1',
    petName: 'Mittens',
    petSpecies: 'cat',
    ownerName: 'Sarah Chen',
    ownerEmail: 'sarah.chen@gmail.com',
    ownerPhone: '(780) 555-1234',
    depositAmount: 50,
    status: 'confirmed',
    createdAt: '2026-06-12T14:23:00Z'
  },
  {
    id: 'res-2',
    slotId: 'slot-4',
    petName: 'Biscuit',
    petSpecies: 'dog',
    ownerName: 'Marcus Reid',
    ownerEmail: 'marcus.reid@outlook.com',
    ownerPhone: '(780) 555-5678',
    depositAmount: 50,
    status: 'confirmed',
    createdAt: '2026-06-13T09:15:00Z'
  },
  {
    id: 'res-3',
    slotId: 'slot-2',
    petName: 'Cheddar',
    petSpecies: 'dog',
    ownerName: 'Priya Sharma',
    ownerEmail: 'priya.sharma@hotmail.com',
    ownerPhone: '(780) 555-9012',
    depositAmount: 50,
    status: 'confirmed',
    createdAt: '2026-06-13T16:42:00Z'
  }
];

// Helper functions

function getClinic(id) {
  return CLINICS.find(c => c.id === id);
}

function getSlot(id) {
  return SLOTS.find(s => s.id === id);
}

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-CA', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatDateShort(dateStr) {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-CA', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

function formatPrice(price) {
  return '$' + price.toLocaleString();
}

function procedureLabel(type) {
  const labels = { spay: 'Spay', neuter: 'Neuter', both: 'Spay & Neuter' };
  return labels[type] || type;
}

function speciesLabel(species) {
  const labels = { cat: 'Cats', dog: 'Dogs', both: 'Dogs & Cats' };
  return labels[species] || species;
}

function slotsAvailable(slot) {
  return slot.capacity - slot.bookedCount;
}

function procedureBadgeClass(type) {
  const classes = {
    spay: 'bg-pink-100 text-pink-700',
    neuter: 'bg-blue-100 text-blue-700',
    both: 'bg-purple-100 text-purple-700'
  };
  return classes[type] || 'bg-slate-100 text-slate-600';
}

function generateBookingRef() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'OS-';
  for (let i = 0; i < 6; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return ref;
}

function getSessionSlots() {
  try {
    return JSON.parse(sessionStorage.getItem('vetslot_slots') || 'null') || [...SLOTS];
  } catch { return [...SLOTS]; }
}

function updateSessionSlot(slotId) {
  const slots = getSessionSlots();
  const slot = slots.find(s => s.id === slotId);
  if (slot) {
    slot.bookedCount += 1;
    if (slot.bookedCount >= slot.capacity) slot.status = 'full';
    sessionStorage.setItem('vetslot_slots', JSON.stringify(slots));
  }
}
