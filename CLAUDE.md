# VetSlot — Build Instructions

Read /Users/jackserver/.openclaw/workspace/projects/vetslot/MVP-SPEC.md for full spec.

## Build a working MVP of VetSlot:
- A web app where vet clinics post available surgery slots and pet owners reserve them
- Static HTML/CSS/JS frontend (no framework needed — keep it simple and fast)
- Mobile-first responsive design
- Teal + navy color scheme (medical, clean, trustworthy)

## Pages to build:
1. index.html — Home page with hero, search, how it works, featured slots
2. browse.html — Browse all available slots with filters
3. reserve.html — Reserve a specific slot (pet owner enters info)
4. confirmed.html — Booking confirmation
5. clinic.html — Clinic portal (login, post slots, view reservations)

## Use mock data for now (no Supabase connection yet):
- Create a data.js file with sample clinics and slots
- Rosslyn Vet as the test clinic
- 4-5 demo slots with different dates/procedures/prices

## Design requirements:
- Modern, clean, trustworthy
- Mobile-first
- Tailwind CSS via CDN
- No build step — just open in browser
- Card-based layout for slots
- Smooth transitions

## Make it look professional — this is going to be a real product.
