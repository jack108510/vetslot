# VetSlot — Rebuild with Live Supabase Backend

The database is live in Supabase. Now rewrite ALL pages to use the live backend.

## What's already done:
- `supabase-config.js` — API client with all CRUD operations (READ THIS FILE)
- Supabase tables: vetslot_clinics, vetslot_slots, vetslot_reservations
- Rosslyn Vet clinic seeded with 5 demo slots

## Your task:
Rewrite ALL HTML pages to replace mock data with live Supabase calls via the VetSlotAPI in supabase-config.js.

### Pages to rewrite:

1. **index.html** — Home page
   - Featured slots: call `VetSlotAPI.getSlots()` and render real data
   - Search bar links to browse.html with query params

2. **browse.html** — Browse slots
   - Load all open slots via `VetSlotAPI.getSlots(filters)`
   - Filters: city, procedure type, species
   - Render cards dynamically
   - "Reserve" button → reserve.html?id=SLOT_ID

3. **reserve.html** — Reserve a slot
   - Load slot by ID from URL param `?id=X` via `VetSlotAPI.getSlot(id)`
   - Show full details + booking form
   - On submit: call `VetSlotAPI.createReservation(...)` → redirect to confirmed.html?ref=RESERVATION_ID

4. **confirmed.html** — Booking confirmation
   - Load reservation details from URL param
   - Show confirmation with all details

5. **clinic.html** — Clinic portal
   - Hardcoded to Rosslyn (clinic_id in supabase-config.js = ROSSLYN_CLINIC_ID)
   - Show their slots in a table
   - Form to post new slots
   - Show reservations
   - Cancel slot button

### Requirements:
- Add `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>` before supabase-config.js
- Add `<script src="supabase-config.js"></script>` on every page
- Remove all references to data.js (the old mock file)
- Loading states while fetching data
- Error states if API fails
- Empty states if no slots available
- Keep the exact same design (teal/navy, Tailwind, mobile-first)
- All existing styling and layout should remain — just swap data source

### Keep data.js for reference but don't use it in pages anymore.
