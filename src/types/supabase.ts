import { BaseEntity } from './index';
import { Product, ProductVariant } from './product';

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Customer extends BaseEntity {
    name: string;
    phone?: string | null;
    email?: string | null;
    line?: string | null;
    facebook?: string | null;
    instagram?: string | null;
    media?: string | null;
    note?: string | null;
    avatar_url?: string | null;
}

export interface CustomerAddress extends BaseEntity {
    customer_id: string;
    label?: string | null;
    place_name?: string | null;
    number?: string | null;
    villageno?: string | null;
    village?: string | null;
    lane?: string | null;
    road?: string | null;
    subdistrict?: string | null;
    district?: string | null;
    province?: string | null;
    zipcode?: string | null;
    maps?: string | null;
    distance?: number | null;
    is_default?: boolean;
}

export interface CustomerContact extends BaseEntity {
    customer_id: string;
    name: string;
    position?: string | null;
    phone?: string | null;
    email?: string | null;
    line?: string | null;
    facebook?: string | null;
    instagram?: string | null;
    note?: string | null;
}

export interface CustomerTaxInvoice extends BaseEntity {
    customer_id: string;
    company: string;
    taxid?: string | null;
    branch?: string | null;
    number?: string | null;
    villageno?: string | null;
    village?: string | null;
    building?: string | null;
    lane?: string | null;
    road?: string | null;
    subdistrict?: string | null;
    district?: string | null;
    province?: string | null;
    zipcode?: string | null;
    maps?: string | null;
}

export interface Team extends BaseEntity {
    name: string;
    team_type?: string | null;
    payment_qr_url?: string | null;
    status: 'active' | 'inactive';
    sort_order?: number;
}

export interface Employee extends BaseEntity {
    eid?: string | null;
    nickname: string;
    first_name?: string | null;
    last_name?: string | null;
    fullname?: string | null; // Generated column
    team_id?: string | null;
    job_position?: string | null;
    job_level?: string | null;
    employment_type?: string | null;
    work_type?: string | null;
    pay_type?: string | null;
    pay_rate?: number | null;
    incentive_rate?: number | null;
    citizen_id?: string | null;
    birth_date?: string | null; // Date string
    start_date?: string | null; // Date string
    end_date?: string | null; // Date string
    status: 'current' | 'resigned';
}

export interface EmployeeContact extends BaseEntity {
    employee_id: string;
    name?: string | null;
    contact_type: string;
    value: string;
    is_primary?: boolean;
}

export interface EmployeeAddress extends BaseEntity {
    employee_id: string;
    label?: string | null;
    place_name?: string | null;
    number?: string | null;
    villageno?: string | null;
    village?: string | null;
    lane?: string | null;
    road?: string | null;
    subdistrict?: string | null;
    district?: string | null;
    province?: string | null;
    zipcode?: string | null;
    maps?: string | null;
    is_default?: boolean;
}

export interface EmployeeBankAccount extends BaseEntity {
    employee_id: string;
    bank_name: string;
    account_number: string;
    account_name?: string | null;
    is_default?: boolean;
}

export interface EmployeeDocument extends BaseEntity {
    employee_id: string;
    doc_type: string;
    file_url: string;
    file_name?: string | null;
}

export interface Database {
    public: {
        Tables: {
            customers: {
                Row: Customer;
                Insert: Omit<Customer, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at'>>;
            };
            customer_addresses: {
                Row: CustomerAddress;
                Insert: Omit<CustomerAddress, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<CustomerAddress, 'id' | 'created_at' | 'updated_at'>>;
            };
            customer_contacts: {
                Row: CustomerContact;
                Insert: Omit<CustomerContact, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<CustomerContact, 'id' | 'created_at' | 'updated_at'>>;
            };
            customer_tax_invoices: {
                Row: CustomerTaxInvoice;
                Insert: Omit<CustomerTaxInvoice, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<CustomerTaxInvoice, 'id' | 'created_at' | 'updated_at'>>;
            };
            teams: {
                Row: Team;
                Insert: Omit<Team, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Team, 'id' | 'created_at' | 'updated_at'>>;
            };
            employees: {
                Row: Employee;
                Insert: Omit<Employee, 'id' | 'created_at' | 'updated_at' | 'fullname'>;
                Update: Partial<Omit<Employee, 'id' | 'created_at' | 'updated_at' | 'fullname'>>;
            };
            employee_contacts: {
                Row: EmployeeContact;
                Insert: Omit<EmployeeContact, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<EmployeeContact, 'id' | 'created_at' | 'updated_at'>>;
            };
            employee_addresses: {
                Row: EmployeeAddress;
                Insert: Omit<EmployeeAddress, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<EmployeeAddress, 'id' | 'created_at' | 'updated_at'>>;
            };
            employee_bank_accounts: {
                Row: EmployeeBankAccount;
                Insert: Omit<EmployeeBankAccount, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<EmployeeBankAccount, 'id' | 'created_at' | 'updated_at'>>;
            };
            employee_documents: {
                Row: EmployeeDocument;
                Insert: Omit<EmployeeDocument, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<EmployeeDocument, 'id' | 'created_at' | 'updated_at'>>;
            };
            products: {
                Row: Product;
                Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
            };
            product_variants: {
                Row: ProductVariant;
                Insert: Omit<ProductVariant, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<ProductVariant, 'id' | 'created_at' | 'updated_at'>>;
            };
        };
    };
}
