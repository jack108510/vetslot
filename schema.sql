-- OpenSlot — Complete Supabase Setup
-- Run this in the Supabase SQL editor (safe to re-run on existing DB)

-- =====================
-- TABLES (CREATE + ADD MISSING COLUMNS)
-- =====================

CREATE TABLE IF NOT EXISTS vetslot_clinics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT DEFAULT 'Edmonton',
  province TEXT DEFAULT 'AB',
  prep_instructions TEXT,
  what_to_bring JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE vetslot_clinics ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE vetslot_clinics ADD COLUMN IF NOT EXISTS prep_instructions TEXT;
ALTER TABLE vetslot_clinics ADD COLUMN IF NOT EXISTS what_to_bring JSONB;

CREATE TABLE IF NOT EXISTS vetslot_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id UUID REFERENCES vetslot_clinics(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TEXT DEFAULT '09:00',
  procedure_type TEXT NOT NULL CHECK (procedure_type IN ('spay', 'neuter', 'both')),
  species TEXT DEFAULT 'both' CHECK (species IN ('dog', 'cat', 'both')),
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  deposit_amount DECIMAL(10,2) DEFAULT 50.00,
  capacity INT DEFAULT 1,
  booked_count INT DEFAULT 0,
  notes TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'full', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE vetslot_slots ADD COLUMN IF NOT EXISTS time TEXT DEFAULT '09:00';
ALTER TABLE vetslot_slots ADD COLUMN IF NOT EXISTS deposit_amount DECIMAL(10,2) DEFAULT 50.00;
ALTER TABLE vetslot_slots ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2);

CREATE TABLE IF NOT EXISTS vetslot_reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_id UUID REFERENCES vetslot_slots(id) ON DELETE CASCADE,
  pet_name TEXT NOT NULL,
  pet_species TEXT CHECK (pet_species IN ('dog', 'cat')),
  owner_name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  owner_phone TEXT NOT NULL,
  deposit_amount DECIMAL(10,2) DEFAULT 50.00,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================
-- FUNCTIONS
-- =====================

-- Atomic increment — auto-closes slot when fully booked
CREATE OR REPLACE FUNCTION increment_booked_count(slot_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE vetslot_slots
  SET
    booked_count = booked_count + 1,
    status = CASE WHEN (booked_count + 1) >= capacity THEN 'full' ELSE status END
  WHERE id = slot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================
-- ROW LEVEL SECURITY
-- =====================

ALTER TABLE vetslot_clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE vetslot_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE vetslot_reservations ENABLE ROW LEVEL SECURITY;

-- Drop old blanket policies
DROP POLICY IF EXISTS slots_select_all ON vetslot_slots;
DROP POLICY IF EXISTS clinics_select_all ON vetslot_clinics;
DROP POLICY IF EXISTS reservations_insert_all ON vetslot_reservations;
DROP POLICY IF EXISTS reservations_select_all ON vetslot_reservations;
DROP POLICY IF EXISTS clinics_all ON vetslot_clinics;
DROP POLICY IF EXISTS slots_all ON vetslot_slots;
DROP POLICY IF EXISTS reservations_update ON vetslot_reservations;

-- Clinics
CREATE POLICY IF NOT EXISTS "clinics_public_read"   ON vetslot_clinics FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "clinics_owner_insert"  ON vetslot_clinics FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS "clinics_owner_update"  ON vetslot_clinics FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Slots
CREATE POLICY IF NOT EXISTS "slots_public_read"     ON vetslot_slots FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "slots_clinic_insert"   ON vetslot_slots FOR INSERT
  WITH CHECK (clinic_id IN (SELECT id FROM vetslot_clinics WHERE user_id = auth.uid()));
CREATE POLICY IF NOT EXISTS "slots_clinic_update"   ON vetslot_slots FOR UPDATE
  USING (clinic_id IN (SELECT id FROM vetslot_clinics WHERE user_id = auth.uid()))
  WITH CHECK (clinic_id IN (SELECT id FROM vetslot_clinics WHERE user_id = auth.uid()));
CREATE POLICY IF NOT EXISTS "slots_clinic_delete"   ON vetslot_slots FOR DELETE
  USING (clinic_id IN (SELECT id FROM vetslot_clinics WHERE user_id = auth.uid()));

-- Reservations: anyone can book (guest checkout), only clinic can read theirs
CREATE POLICY IF NOT EXISTS "reservations_public_insert" ON vetslot_reservations FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "reservations_clinic_read"   ON vetslot_reservations FOR SELECT
  USING (slot_id IN (
    SELECT s.id FROM vetslot_slots s
    JOIN vetslot_clinics c ON s.clinic_id = c.id
    WHERE c.user_id = auth.uid()
  ));
CREATE POLICY IF NOT EXISTS "reservations_clinic_update" ON vetslot_reservations FOR UPDATE
  USING (slot_id IN (
    SELECT s.id FROM vetslot_slots s
    JOIN vetslot_clinics c ON s.clinic_id = c.id
    WHERE c.user_id = auth.uid()
  ));
