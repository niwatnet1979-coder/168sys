-- Release 1.0.0.6: Settings & System Options Schema
-- This script creates the foundational tables for shop settings and dynamic lists with full audit trail.
-- 1. Shop Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    -- Shop Information (Granular Address following Customer Standard)
    name TEXT NOT NULL DEFAULT '168 Interior Lighting',
    place_name TEXT,
    number TEXT,
    villageno TEXT,
    village TEXT,
    soi TEXT,
    road TEXT,
    subdistrict TEXT,
    district TEXT,
    province TEXT,
    zipcode TEXT,
    -- Location & Contact
    google_map_link TEXT,
    phone TEXT,
    email TEXT,
    tax_id TEXT,
    -- Financial Configuration
    vat_registered BOOLEAN DEFAULT false,
    vat_rate DECIMAL(5, 2) DEFAULT 7.00,
    promptpay_qr TEXT,
    -- Document Defaults
    default_terms TEXT,
    warranty_policy TEXT,
    -- Audit Trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);
-- 2. System Options Lists Table
CREATE TABLE IF NOT EXISTS public.system_options_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    -- e.g., 'lightColors', 'materials'
    value TEXT NOT NULL,
    label TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    -- Audit Trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    -- Ensure unique value per category
    UNIQUE(category, value)
);
-- 3. Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_options_lists ENABLE ROW LEVEL SECURITY;
-- 4. RLS Policies
-- Allow all authenticated users to read settings
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'settings'
        AND policyname = 'Allow public read access'
) THEN CREATE POLICY "Allow public read access" ON public.settings FOR
SELECT TO anon,
    authenticated USING (true);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'settings'
        AND policyname = 'Allow authenticated update access'
) THEN CREATE POLICY "Allow authenticated update access" ON public.settings FOR
UPDATE TO authenticated USING (true);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'system_options_lists'
        AND policyname = 'Allow public read access'
) THEN CREATE POLICY "Allow public read access" ON public.system_options_lists FOR
SELECT TO anon,
    authenticated USING (true);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'system_options_lists'
        AND policyname = 'Allow authenticated all access'
) THEN CREATE POLICY "Allow authenticated all access" ON public.system_options_lists FOR ALL TO authenticated USING (true);
END IF;
END $$;
-- 5. Updated At Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = timezone('utc'::text, now());
RETURN NEW;
END;
$$ language 'plpgsql';
DROP TRIGGER IF EXISTS on_settings_updated ON public.settings;
CREATE TRIGGER on_settings_updated BEFORE
UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS on_system_options_updated ON public.system_options_lists;
CREATE TRIGGER on_system_options_updated BEFORE
UPDATE ON public.system_options_lists FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
-- 6. Seed Default Settings & Options (Comprehensive Legacy Migration)
INSERT INTO public.settings (
        id,
        name,
        place_name,
        number,
        villageno,
        village,
        soi,
        road,
        subdistrict,
        district,
        province,
        zipcode,
        phone,
        email,
        tax_id,
        vat_registered,
        vat_rate
    )
VALUES (
        'default',
        '168 อินทีเรีย ไลท์ติ้ง',
        'หมู่บ้านเซนโทร พหล-วิภาวดี2',
        '168/166',
        NULL,
        NULL,
        NULL,
        NULL,
        'คลองหนึ่ง',
        'คลองหลวง',
        'ปทุมธานี',
        '12120',
        '084-282-9465',
        'contact@168lighting.com',
        '0135566027619',
        true,
        7.00
    ) ON CONFLICT (id) DO NOTHING;
-- Seed comprehensive options
INSERT INTO public.system_options_lists (category, value, label, sort_order)
VALUES -- Product Types
    (
        'productTypes',
        'AA โคมไฟระย้า',
        'AA โคมไฟระย้า',
        1
    ),
    (
        'productTypes',
        'AC โคมไฟโถงสูง',
        'AC โคมไฟโถงสูง',
        2
    ),
    (
        'productTypes',
        'AB โคมไฟแขวนโต้ะทานข้าว',
        'AB โคมไฟแขวนโต้ะทานข้าว',
        3
    ),
    (
        'productTypes',
        'LP โคมไฟเดี่ยว',
        'LP โคมไฟเดี่ยว',
        4
    ),
    (
        'productTypes',
        'MM โคมไฟโมเดิ้ล',
        'MM โคมไฟโมเดิ้ล',
        5
    ),
    (
        'productTypes',
        'WL โคมไฟกริ่ง',
        'WL โคมไฟกริ่ง',
        6
    ),
    (
        'productTypes',
        'IN โคมไฟเพดาล',
        'IN โคมไฟเพดาล',
        7
    ),
    ('productTypes', 'RM รีโมท', 'RM รีโมท', 8),
    ('productTypes', 'GI ของขวัญ', 'GI ของขวัญ', 9),
    ('productTypes', 'DV Driver', 'DV Driver', 10),
    ('productTypes', 'LM หลอดไฟ', 'LM หลอดไฟ', 11),
    ('productTypes', 'K9 คริสตัล', 'K9 คริสตัล', 12),
    ('productTypes', 'XX ไม่ระบุ', 'XX ไม่ระบุ', 13),
    -- Materials
    ('materials', 'สแตนเลส', 'สแตนเลส', 1),
    ('materials', 'เหล็ก', 'เหล็ก', 2),
    ('materials', 'อะคริลิก', 'อะคริลิก', 3),
    ('materials', 'พลาสติก', 'พลาสติก', 4),
    ('materials', 'ไม้', 'ไม้', 5),
    -- Material Colors
    ('materialColors', 'GD ทอง', 'GD ทอง', 1),
    (
        'materialColors',
        'PG พิ้งค์โกลด์',
        'PG พิ้งค์โกลด์',
        2
    ),
    (
        'materialColors',
        'RG โรสโกลด์',
        'RG โรสโกลด์',
        3
    ),
    ('materialColors', 'SV เงิน', 'SV เงิน', 4),
    ('materialColors', 'BK ดำ', 'BK ดำ', 5),
    ('materialColors', 'WT ขาว', 'WT ขาว', 6),
    ('materialColors', 'CL ใส', 'CL ใส', 7),
    -- Crystal Colors
    ('crystalColors', 'CL ใส', 'CL ใส', 1),
    ('crystalColors', 'GD ทอง', 'GD ทอง', 2),
    (
        'crystalColors',
        'PG พิ้งค์โกลด์',
        'PG พิ้งค์โกลด์',
        3
    ),
    ('crystalColors', 'RG โรสโกลด์', 'RG โรสโกลด์', 4),
    ('crystalColors', 'SV เงิน', 'SV เงิน', 5),
    ('crystalColors', 'BK ดำ', 'BK ดำ', 6),
    ('crystalColors', 'TEA ชา', 'TEA ชา', 7),
    (
        'crystalColors',
        'SM ควันบุหรี่',
        'SM ควันบุหรี่',
        8
    ),
    -- Light Colors
    ('lightColors', 'warm', 'Warm White', 1),
    ('lightColors', 'cool', 'Cool White', 2),
    ('lightColors', 'white', 'Daylight', 3),
    ('lightColors', '3แสง', '3 แสง', 4),
    -- Remotes
    ('remotes', 'ไม่มีรีโมท', 'ไม่มีรีโมท', 1),
    ('remotes', 'หรี่แสงปรับสี', 'หรี่แสงปรับสี', 2),
    ('remotes', 'หรี่แสง', 'หรี่แสง', 3),
    ('remotes', 'เปิดปิด', 'เปิดปิด', 4),
    -- Bulb Types
    ('bulbTypes', 'E14', 'E14', 1),
    ('bulbTypes', 'E27', 'E27', 2),
    ('bulbTypes', 'G9', 'G9', 3),
    ('bulbTypes', 'GU9', 'GU9', 4),
    ('bulbTypes', 'ไฟเส้น', 'ไฟเส้น', 5),
    ('bulbTypes', 'LED Module', 'LED Module', 6),
    -- Teams
    ('teamNames', 'ทีมช่างกี', 'ทีมช่างกี', 1),
    ('teamNames', 'ทีมQC', 'ทีมQC', 2),
    ('teamNames', 'ทีมSALE', 'ทีมSALE', 3),
    ('teamNames', 'ทีมบริหาร', 'ทีมบริหาร', 4),
    -- Team Types
    ('teamTypes', 'QC', 'QC', 1),
    ('teamTypes', 'ช่าง', 'ช่าง', 2),
    ('teamTypes', 'SALE', 'SALE', 3),
    ('teamTypes', 'บริหาร', 'บริหาร', 4),
    -- HR
    ('jobPositions', 'พนักงาน', 'พนักงาน', 1),
    ('jobPositions', 'บริหาร', 'บริหาร', 2),
    ('jobLevels', 'Staff', 'Staff', 1),
    ('jobLevels', 'Senior', 'Senior', 2),
    ('jobLevels', 'Leader', 'Leader', 3),
    ('jobLevels', 'Manager', 'Manager', 4),
    ('jobLevels', 'Director', 'Director', 5),
    ('jobLevels', 'Executive', 'Executive', 6),
    (
        'employmentTypes',
        'พนักงานประจำ',
        'พนักงานประจำ',
        1
    ),
    (
        'employmentTypes',
        'พนักงานชั่วคราว',
        'พนักงานชั่วคราว',
        2
    ),
    ('paymentTypes', 'รายวัน', 'รายวัน', 1),
    ('paymentTypes', 'รายเดือน', 'รายเดือน', 2),
    ('paymentTypes', 'เหมาจ่าย', 'เหมาจ่าย', 3),
    -- Finance
    ('expenseTypes', 'สินค้า', 'สินค้า', 1),
    (
        'expenseTypes',
        'อุปกรณ์สิ้นเปลือง',
        'อุปกรณ์สิ้นเปลือง',
        2
    ),
    ('expenseTypes', 'ภาษี บัญชี', 'ภาษี บัญชี', 3),
    (
        'expenseTypes',
        'อาคาร สาธารณูปโภค',
        'อาคาร สาธารณูปโภค',
        4
    ),
    (
        'expenseTypes',
        'โฆษณา ส่งเสริมการขาย',
        'โฆษณา ส่งเสริมการขาย',
        5
    ),
    ('expenseTypes', 'อาหาร', 'อาหาร', 6),
    ('expenseTypes', 'รถ เดินทาง', 'รถ เดินทาง', 7),
    ('expenseTypes', 'เงินเดือน', 'เงินเดือน', 8),
    ('expenseTypes', 'ขนส่ง', 'ขนส่ง', 9) ON CONFLICT (category, value) DO NOTHING;
-- 7. Realtime Publication (Idempotent)
DO $$
DECLARE tables TEXT [] := ARRAY ['settings', 'system_options_lists'];
table_name TEXT;
BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_publication
    WHERE pubname = 'supabase_realtime'
) THEN CREATE PUBLICATION supabase_realtime;
END IF;
FOR table_name IN
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