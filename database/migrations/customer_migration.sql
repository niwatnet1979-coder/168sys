-- ==========================================
-- 168sys Customer Module Migration
-- Version: V1.0.0.5 (Self-Healing & Idempotent)
-- Description: Ensures all audit fields exist even if tables already existed.
-- ==========================================
-- 1. Ensure Audit Columns Exist (Self-Healing)
-- Customers
ALTER TABLE IF EXISTS public.customers
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE IF EXISTS public.customers
ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE IF EXISTS public.customers
ADD COLUMN IF NOT EXISTS updated_by UUID;
-- Addresses
ALTER TABLE IF EXISTS public.customer_addresses
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE IF EXISTS public.customer_addresses
ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE IF EXISTS public.customer_addresses
ADD COLUMN IF NOT EXISTS updated_by UUID;
ALTER TABLE IF EXISTS public.customer_addresses
ADD COLUMN IF NOT EXISTS place_name TEXT;
-- Contacts
ALTER TABLE IF EXISTS public.customer_contacts
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE IF EXISTS public.customer_contacts
ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE IF EXISTS public.customer_contacts
ADD COLUMN IF NOT EXISTS updated_by UUID;
ALTER TABLE IF EXISTS public.customer_contacts
ADD COLUMN IF NOT EXISTS facebook TEXT;
ALTER TABLE IF EXISTS public.customer_contacts
ADD COLUMN IF NOT EXISTS instagram TEXT;
-- Tax Invoices
ALTER TABLE IF EXISTS public.customer_tax_invoices
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE IF EXISTS public.customer_tax_invoices
ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE IF EXISTS public.customer_tax_invoices
ADD COLUMN IF NOT EXISTS updated_by UUID;
ALTER TABLE IF EXISTS public.customer_tax_invoices
ADD COLUMN IF NOT EXISTS maps TEXT;
-- 2. Main Tables Structure (Formal Definition)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    line TEXT,
    facebook TEXT,
    instagram TEXT,
    media TEXT,
    note TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    CONSTRAINT customers_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;
CREATE TABLE IF NOT EXISTS public.customer_addresses (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    label TEXT,
    place_name TEXT,
    number TEXT,
    villageno TEXT,
    village TEXT,
    lane TEXT,
    road TEXT,
    subdistrict TEXT,
    district TEXT,
    province TEXT,
    zipcode TEXT,
    maps TEXT,
    distance NUMERIC,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    CONSTRAINT customer_addresses_pkey PRIMARY KEY (id),
    CONSTRAINT customer_addresses_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE
) TABLESPACE pg_default;
CREATE TABLE IF NOT EXISTS public.customer_contacts (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    name TEXT NOT NULL,
    position TEXT,
    phone TEXT,
    email TEXT,
    line TEXT,
    facebook TEXT,
    instagram TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    CONSTRAINT customer_contacts_pkey PRIMARY KEY (id),
    CONSTRAINT customer_contacts_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE
) TABLESPACE pg_default;
CREATE TABLE IF NOT EXISTS public.customer_tax_invoices (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    company TEXT NOT NULL,
    taxid TEXT,
    branch TEXT DEFAULT '00000',
    number TEXT,
    villageno TEXT,
    village TEXT,
    building TEXT,
    lane TEXT,
    road TEXT,
    subdistrict TEXT,
    district TEXT,
    province TEXT,
    zipcode TEXT,
    maps TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    CONSTRAINT customer_tax_invoices_pkey PRIMARY KEY (id),
    CONSTRAINT customer_tax_invoices_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE
) TABLESPACE pg_default;
-- Indexes for Fast Search
CREATE INDEX IF NOT EXISTS idx_customers_name ON public.customers USING btree (name) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers USING btree (phone) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_customers_name_trgm ON public.customers USING gin (name gin_trgm_ops) TABLESPACE pg_default;
-- Safe Realtime Enablement (Idempotent)
DO $$
DECLARE tables TEXT [] := ARRAY ['customers', 'customer_addresses', 'customer_contacts', 'customer_tax_invoices'];
table_name TEXT;
BEGIN FOR table_name IN
SELECT unnest(tables) LOOP IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime'
            AND schemaname = 'public'
            AND tablename = table_name
    ) THEN EXECUTE format(
        'ALTER PUBLICATION supabase_realtime ADD TABLE public.%I',
        table_name
    );
END IF;
END LOOP;
END $$;
-- Automated Updated At Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ language 'plpgsql';
-- Apply Triggers
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at BEFORE
UPDATE ON customers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
DROP TRIGGER IF EXISTS update_customer_addresses_updated_at ON customer_addresses;
CREATE TRIGGER update_customer_addresses_updated_at BEFORE
UPDATE ON customer_addresses FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
DROP TRIGGER IF EXISTS update_customer_contacts_updated_at ON customer_contacts;
CREATE TRIGGER update_customer_contacts_updated_at BEFORE
UPDATE ON customer_contacts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
DROP TRIGGER IF EXISTS update_customer_tax_invoices_updated_at ON customer_tax_invoices;
CREATE TRIGGER update_customer_tax_invoices_updated_at BEFORE
UPDATE ON customer_tax_invoices FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();