-- Create handle_updated_at function if it doesn't exist (commonly used name)
CREATE OR REPLACE FUNCTION handle_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ language 'plpgsql';
-- Create system_options_lists table (User provided schema)
CREATE TABLE IF NOT EXISTS public.system_options_lists (
    id uuid not null default gen_random_uuid (),
    category text not null,
    value text not null,
    label text not null,
    sort_order integer null default 0,
    is_active boolean null default true,
    created_at timestamp with time zone not null default timezone ('utc'::text, now()),
    updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
    created_by uuid null,
    updated_by uuid null,
    constraint system_options_lists_pkey primary key (id),
    constraint system_options_lists_category_value_key unique (category, value),
    constraint system_options_lists_created_by_fkey foreign KEY (created_by) references auth.users (id),
    constraint system_options_lists_updated_by_fkey foreign KEY (updated_by) references auth.users (id)
) TABLESPACE pg_default;
-- Trigger
DROP TRIGGER IF EXISTS on_system_options_updated ON system_options_lists;
CREATE TRIGGER on_system_options_updated BEFORE
UPDATE ON system_options_lists FOR EACH ROW EXECUTE FUNCTION handle_updated_at ();
-- Enable RLS
ALTER TABLE system_options_lists ENABLE ROW LEVEL SECURITY;
-- Policy: Allow read access for authenticated users
CREATE POLICY "Allow read access for authenticated users" ON system_options_lists FOR
SELECT TO authenticated USING (true);
-- Policy: Allow all access for authenticated users (for development convenience, can refine later)
CREATE POLICY "Allow full access for authenticated users" ON system_options_lists FOR ALL TO authenticated USING (true);
-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_system_options_lists_category ON system_options_lists(category);
-- Seed initial data for Product Materials
INSERT INTO system_options_lists (category, label, value, sort_order)
VALUES ('product_material', 'เหล็ก', 'Iron', 10),
    ('product_material', 'แก้ว', 'Glass', 20),
    ('product_material', 'คริสตัล', 'Crystal', 30),
    ('product_material', 'ไม้', 'Wood', 40),
    ('product_material', 'พลาสติก', 'Plastic', 50),
    ('product_material', 'อลูมิเนียม', 'Aluminum', 60),
    ('product_material', 'ผ้า', 'Fabric', 70) ON CONFLICT (category, value) DO NOTHING;