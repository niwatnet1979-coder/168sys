import { BaseEntity } from './index';

export interface Team extends BaseEntity {
    name: string;
    team_type?: string;
    payment_qr_url?: string;
    status: 'active' | 'inactive';
    sort_order?: number;
}

// Matches the DB schema for 'employee_contacts' table
// Matches the DB schema for 'employee_contacts' table
export interface EmployeeContactDB extends Omit<BaseEntity, 'id'> {
    id?: string;
    employee_id?: string;
    name?: string; // Label
    contact_type: string;
    value: string;
    is_primary?: boolean;
}

// UI Representation (aggregated) if we decide to use the fixed-field UI
export interface EmployeeContactUI extends BaseEntity {
    employee_id?: string;
    name?: string; // e.g. "Main Contact"
    phone?: string;
    email?: string;
    line?: string;
    facebook?: string;
    instagram?: string;
    note?: string;
    is_primary?: boolean;
}

export interface EmployeeAddress extends BaseEntity {
    employee_id?: string;
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
}

export interface EmployeeBankAccount extends BaseEntity {
    employee_id?: string;
    bank_name: string;
    account_number: string;
    account_name?: string;
    is_default?: boolean;
}

export interface EmployeeDocument extends BaseEntity {
    employee_id?: string;
    doc_type: string;
    file_url: string;
    file_name?: string;
    file_obj?: File; // For internal UI use before upload
}

export interface Employee extends BaseEntity {
    eid?: string;
    nickname: string;
    first_name?: string;
    last_name?: string;
    fullname?: string;
    team_id?: string;
    team?: Team; // Relations

    job_position?: string;
    job_level?: string;
    employment_type?: string;
    work_type?: string;
    pay_type?: string;
    pay_rate?: number;
    incentive_rate?: number;

    citizen_id?: string;
    birth_date?: string;
    start_date?: string;
    end_date?: string;
    status?: 'current' | 'resigned';

    // Relations is tricky due to DB vs UI mismatch.
    // For now we assume the fetched data follows DB schema, so it's a list of EmployeeContactDB
    contacts?: EmployeeContactDB[];

    addresses?: EmployeeAddress[];
    bank_accounts?: EmployeeBankAccount[];
    documents?: EmployeeDocument[];
}
