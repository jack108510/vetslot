// VetSlot — Supabase Configuration
const SUPABASE_URL = 'https://xacehhtgvubcqdoltazg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhY2VoaHRndnViY3Fkb2x0YXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NDI4NjcsImV4cCI6MjA4OTUxODg2N30.U3RX5jUC5OnV6gjT2p4vEIt7m3Lkx4Q0b6vBq0Qrk-U';
const ROSSLYN_CLINIC_ID = '4e078398-9e45-441e-9771-91dca35be71c';

// Initialize Supabase
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// API helpers
const VetSlotAPI = {
  // Get all open slots with clinic info
  async getSlots(filters = {}) {
    let query = sb
      .from('vetslot_slots')
      .select(`
        *,
        clinic:vetslot_clinics(*)
      `)
      .eq('status', 'open')
      .order('date', { ascending: true });

    if (filters.city) {
      // Will filter client-side since it's on the joined table
    }
    if (filters.procedure_type && filters.procedure_type !== 'all') {
      query = query.in('procedure_type', filters.procedure_type === 'both' ? ['both'] : [filters.procedure_type, 'both']);
    }
    if (filters.species && filters.species !== 'all') {
      query = query.in('species', [filters.species, 'both']);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching slots:', error);
      return [];
    }

    let result = data || [];

    // Filter by available capacity
    result = result.filter(s => s.booked_count < s.capacity);

    // Client-side city filter
    if (filters.city && filters.city !== 'all') {
      result = result.filter(s => s.clinic && s.clinic.city === filters.city);
    }

    return result;
  },

  // Get a single slot with clinic info
  async getSlot(id) {
    const { data, error } = await sb
      .from('vetslot_slots')
      .select(`
        *,
        clinic:vetslot_clinics(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching slot:', error);
      return null;
    }
    return data;
  },

  // Create a reservation
  async createReservation(reservation) {
    const { data, error } = await sb
      .from('vetslot_reservations')
      .insert({
        slot_id: reservation.slot_id,
        pet_name: reservation.pet_name,
        pet_species: reservation.pet_species,
        owner_name: reservation.owner_name,
        owner_email: reservation.owner_email,
        owner_phone: reservation.owner_phone,
        deposit_amount: 50.00,
        status: 'confirmed'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating reservation:', error);
      return null;
    }

    // Increment booked_count
    await sb.rpc('increment_booked_count', { slot_id: reservation.slot_id }).catch(() => {
      // Fallback: manual increment
      const { data: slot } = await sb.from('vetslot_slots').select('booked_count, capacity').eq('id', reservation.slot_id).single();
      if (slot) {
        const newCount = slot.booked_count + 1;
        const updates = { booked_count: newCount };
        if (newCount >= slot.capacity) {
          updates.status = 'full';
        }
        await sb.from('vetslot_slots').update(updates).eq('id', reservation.slot_id);
      }
    });

    return data;
  },

  // Clinic: Create a slot
  async createSlot(slot) {
    const { data, error } = await sb
      .from('vetslot_slots')
      .insert(slot)
      .select()
      .single();

    if (error) {
      console.error('Error creating slot:', error);
      return null;
    }
    return data;
  },

  // Clinic: Get their slots
  async getClinicSlots(clinicId) {
    const { data, error } = await sb
      .from('vetslot_slots')
      .select('*')
      .eq('clinic_id', clinicId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching clinic slots:', error);
      return [];
    }
    return data || [];
  },

  // Clinic: Get reservations for their slots
  async getClinicReservations(clinicId) {
    const { data: slots } = await sb
      .from('vetslot_slots')
      .select('id, date, procedure_type, species')
      .eq('clinic_id', clinicId);

    if (!slots || slots.length === 0) return [];

    const slotIds = slots.map(s => s.id);
    const { data, error } = await sb
      .from('vetslot_reservations')
      .select(`
        *,
        slot:vetslot_slots!inner(date, procedure_type, species)
      `)
      .in('slot_id', slotIds)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reservations:', error);
      return [];
    }
    return data || [];
  },

  // Clinic: Delete/cancel a slot
  async cancelSlot(slotId) {
    const { data, error } = await sb
      .from('vetslot_slots')
      .update({ status: 'cancelled' })
      .eq('id', slotId)
      .select()
      .single();

    if (error) {
      console.error('Error cancelling slot:', error);
      return false;
    }
    return true;
  },

  // Get all cities (for filter dropdown)
  async getCities() {
    const { data, error } = await sb
      .from('vetslot_clinics')
      .select('city')
      .order('city');

    if (error || !data) return ['Edmonton'];
    const cities = [...new Set(data.map(c => c.city))];
    return cities.length > 0 ? cities : ['Edmonton'];
  },

  // Get a single reservation with slot and clinic info
  async getReservation(id) {
    const { data, error } = await sb
      .from('vetslot_reservations')
      .select(`
        *,
        slot:vetslot_slots(
          *,
          clinic:vetslot_clinics(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching reservation:', error);
      return null;
    }
    return data;
  }
};

// Format helpers
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatPrice(price) {
  return `$${parseFloat(price).toFixed(0)}`;
}

function procedureLabel(type) {
  if (type === 'spay') return 'Spay';
  if (type === 'neuter') return 'Neuter';
  return 'Spay or Neuter';
}

function speciesLabel(type) {
  if (type === 'dog') return 'Dogs';
  if (type === 'cat') return 'Cats';
  return 'Dogs & Cats';
}

function procedureBadgeClass(type) {
  if (type === 'spay') return 'bg-purple-100 text-purple-700';
  if (type === 'neuter') return 'bg-blue-100 text-blue-700';
  return 'bg-teal-100 text-teal-700';
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  if (/[AP]M/i.test(timeStr)) return timeStr.trim();
  const parts = timeStr.split(':');
  const hour = parseInt(parts[0], 10);
  const min = parts[1] || '00';
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
  return `${h}:${min} ${ampm}`;
}

function getWhatToBring(clinic) {
  try {
    const wtb = clinic && clinic.what_to_bring;
    if (Array.isArray(wtb)) return wtb;
    if (typeof wtb === 'string' && wtb) return JSON.parse(wtb);
  } catch (e) {}
  return [
    'Vaccination records (up to date)',
    'Carrier or leash for your pet',
    'Photo ID',
    'Payment for remaining balance (due at clinic)'
  ];
}

function getPrepInstructions(clinic) {
  return (clinic && (clinic.prep_instructions || clinic.prepInstructions)) ||
    'No food after midnight the night before. Water is okay until 2 hours before the procedure. Arrive 10 minutes early.';
}
