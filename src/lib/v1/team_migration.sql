-- ==========================================
-- 168sys Team & Personnel Module Migration
-- Version: V1.0.0.1
-- Description: Relational Team and Employee management system.
-- ==========================================
-- 1. Teams Table
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    team_type TEXT,
    -- e.g., 'ช่าง', 'QC', 'SALE', 'บริหาร'
    payment_qr_url TEXT,
    status TEXT DEFAULT 'active',
    -- 'active', 'inactive'
    sort_order INTEGER DEFAULT 0,
    -- Audit Trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);
-- 2. Employees Table
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eid TEXT UNIQUE,
    -- Employee ID e.g., E001
    nickname TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    fullname TEXT GENERATED ALWAYS AS (
        CASE
            WHEN first_name IS NOT NULL
            AND last_name IS NOT NULL THEN first_name || ' ' || last_name
            WHEN first_name IS NOT NULL THEN first_name
            ELSE nickname
        END
    ) STORED,
    team_id UUID REFERENCES public.teams(id) ON DELETE
    SET NULL,
        job_position TEXT,
        job_level TEXT,
        employment_type TEXT,
        -- 'พนักงานประจำ', 'พนักงานชั่วคราว'
        work_type TEXT,
        pay_type TEXT,
        -- 'รายวัน', 'รายเดือน', 'เหมาจ่าย'
        pay_rate NUMERIC(12, 2),
        incentive_rate NUMERIC(5, 2),
        -- percentage e.g., 3.00 for 3%
        citizen_id TEXT,
        birth_date DATE,
        start_date DATE,
        end_date DATE,
        status TEXT DEFAULT 'current',
        -- 'current', 'resigned'
        -- Audit Trail
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        created_by UUID REFERENCES auth.users(id),
        updated_by UUID REFERENCES auth.users(id)
);
-- 3. Employee Contacts (Relational following Customer Standard)
CREATE TABLE IF NOT EXISTS public.employee_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    name TEXT,
    -- Label e.g. 'เบอร์หลัก', 'เบอร์ฉุกเฉิน'
    contact_type TEXT NOT NULL,
    -- 'phone', 'email', 'line', 'facebook', 'instagram'
    value TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    -- Audit Trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);
-- 4. Employee Addresses (Relational following Customer Standard)
CREATE TABLE IF NOT EXISTS public.employee_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    label TEXT DEFAULT 'ที่อยู่ปัจจุบัน',
    place_name TEXT,
    number TEXT,
    villageno TEXT,
    village TEXT,
    lane TEXT,
    -- Changed from 'soi' to match customer standard
    road TEXT,
    subdistrict TEXT,
    district TEXT,
    province TEXT,
    zipcode TEXT,
    maps TEXT,
    -- Google Maps link
    is_default BOOLEAN DEFAULT true,
    -- Audit Trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);
-- 5. Employee Bank Accounts
CREATE TABLE IF NOT EXISTS public.employee_bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    bank_name TEXT NOT NULL,
    -- e.g. 'KBANK', 'SCB'
    account_number TEXT NOT NULL,
    account_name TEXT,
    is_default BOOLEAN DEFAULT true,
    -- Audit Trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);
-- 6. Employee Documents/Attachments
CREATE TABLE IF NOT EXISTS public.employee_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL,
    -- 'profile_photo', 'id_card', 'house_reg', 'resume', 'contract'
    file_url TEXT NOT NULL,
    file_name TEXT,
    -- Audit Trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);
-- 7. Indexes for Search (Rule 35-36)
CREATE INDEX IF NOT EXISTS idx_teams_name ON public.teams USING btree (name);
CREATE INDEX IF NOT EXISTS idx_employees_eid ON public.employees USING btree (eid);
CREATE INDEX IF NOT EXISTS idx_employees_nickname_trgm ON public.employees USING gin (nickname gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_employees_fullname_trgm ON public.employees USING gin (fullname gin_trgm_ops);
-- 8. RLS and Realtime (Rule 23)
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_documents ENABLE ROW LEVEL SECURITY;
-- Unified Authenticated Access Policy
DO $$
DECLARE t TEXT;
BEGIN FOR t IN
SELECT unnest(
        ARRAY ['teams', 'employees', 'employee_contacts', 'employee_addresses', 'employee_bank_accounts', 'employee_documents']
    ) LOOP -- Clean up all possible legacy policy names
    EXECUTE format(
        'DROP POLICY IF EXISTS "Allow public read access" ON public.%I',
        t
    );
EXECUTE format(
    'DROP POLICY IF EXISTS "Allow authenticated all access" ON public.%I',
    t
);
EXECUTE format(
    'DROP POLICY IF EXISTS "Allow all access" ON public.%I',
    t
);
-- [Rule 23] Revert to Authenticated Only
EXECUTE format(
    'CREATE POLICY "allow_authenticated_all" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)',
    t
);
END LOOP;
END $$;
-- 8. Updated At Triggers
DO $$
DECLARE t TEXT;
BEGIN FOR t IN
SELECT unnest(
        ARRAY ['teams', 'employees', 'employee_contacts', 'employee_addresses', 'employee_bank_accounts', 'employee_documents']
    ) LOOP EXECUTE format(
        'DROP TRIGGER IF EXISTS on_%I_updated ON public.%I',
        t,
        t
    );
EXECUTE format(
    'CREATE TRIGGER on_%I_updated BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()',
    t,
    t
);
END LOOP;
END $$;
-- 9. Realtime Publication
DO $$
DECLARE tables TEXT [] := ARRAY ['teams', 'employees', 'employee_contacts', 'employee_addresses', 'employee_bank_accounts', 'employee_documents'];
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