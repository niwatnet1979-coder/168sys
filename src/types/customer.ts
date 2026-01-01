import { BaseEntity } from './index';

export interface CustomerContact extends BaseEntity {
    customer_id?: string;
    name: string;
    phone?: string;
    email?: string;
    line?: string;
    facebook?: string;
    instagram?: string;
    note?: string;
    [key: string]: any; // Allow temporary loose typing during dev
}

export interface CustomerAddress extends BaseEntity {
    customer_id?: string;
    label?: string;
    place_name?: string;
    number?: string;
    villageno?: string;
    village?: string;
    lane?: string;
    road?: string;
    subdistrict?: string;
    district?: string;
    province?: string;
    zipcode?: string;
    maps?: string;
    is_default?: boolean;
    [key: string]: any;
}

export interface CustomerTaxInvoice extends BaseEntity {
    customer_id?: string;
    company: string;
    taxid?: string;
    branch?: string;
    number?: string;
    villageno?: string;
    village?: string;
    lane?: string;
    road?: string;
    subdistrict?: string;
    district?: string;
    province?: string;
    zipcode?: string;
    maps?: string;
    [key: string]: any;
}

export interface Customer extends BaseEntity {
    name: string;
    phone?: string;
    email?: string;
    line?: string;
    facebook?: string;
    instagram?: string;
    media?: string;
    note?: string;
    avatar_url?: string;

    // Relations (Often populated)
    addresses?: CustomerAddress[];
    contacts?: CustomerContact[];
    tax_invoices?: CustomerTaxInvoice[];
}
