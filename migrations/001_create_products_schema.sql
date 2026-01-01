-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    material TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT,
    -- User UUID or Name
    updated_by TEXT -- User UUID or Name
);
-- Use extension for fuzzy search (if not exists)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- Indexes for products
CREATE INDEX IF NOT EXISTS idx_products_product_code ON public.products(product_code);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON public.products USING GIN(name gin_trgm_ops);
-- Create product_variants table
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(uuid) ON DELETE CASCADE,
    sku TEXT UNIQUE NOT NULL,
    -- Format: Code-Size-Color-Crystal
    color TEXT,
    crystal_color TEXT,
    size TEXT,
    -- e.g. L20W20H20
    price NUMERIC NOT NULL DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT,
    updated_by TEXT
);
-- Indexes for product_variants
CREATE INDEX IF NOT EXISTS idx_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON public.product_variants(sku);
-- Trigger to update updated_at (if simple function exists, else simple update on app side is also accepted but trigger is better)
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ language 'plpgsql';
CREATE TRIGGER update_products_updated_at BEFORE
UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_variants_updated_at BEFORE
UPDATE ON public.product_variants FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();