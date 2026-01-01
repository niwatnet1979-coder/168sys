import { BaseEntity } from './index';

export interface ShopSettings {
    name?: string;
    place_name?: string;
    number?: string;
    villageno?: string;
    village?: string;
    soi?: string;
    road?: string;
    subdistrict?: string;
    district?: string;
    province?: string;
    zipcode?: string;
    google_map_link?: string;
    phone?: string;
    email?: string;
    tax_id?: string;
    updated_at?: string;
}

export interface FinancialSettings {
    vat_registered: boolean;
    vat_rate?: number;
    promptpay_qr?: string;
}

export interface DocumentSettings {
    default_terms?: string;
    warranty_policy?: string;
}

export interface SystemOption {
    id: string | number;
    value: string | number;
    label: string;
    category?: string;
}

export interface SystemOptionsMap {
    [key: string]: SystemOption[];
}

export interface SettingsData {
    shop: ShopSettings;
    financial: FinancialSettings;
    documents: DocumentSettings;
    systemOptions: SystemOptionsMap;
}
