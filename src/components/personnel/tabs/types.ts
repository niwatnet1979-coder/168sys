// Shared Types for Employee Modal Tabs
import { LucideIcon } from 'lucide-react';
import { EmployeeAddress, EmployeeBankAccount, EmployeeDocument, Team, EmployeeContactDB } from '../../../types/personnel';
import { SystemOption } from '../../../types/settings';

// UI Interface for grouped contacts
export interface EmployeeContactUI {
    id: number | string;
    name: string;
    phone: string;
    line: string;
    email: string;
    facebook: string;
    instagram: string;
    note: string;
    is_primary: boolean;
}

// Form data structure used across all tabs
export interface EmployeeFormData {
    id?: string;
    eid: string;
    nickname: string;
    first_name: string;
    last_name: string;
    team_id: string;
    job_position: string;
    job_level: string;
    employment_type: string;
    work_type: string;
    pay_type: string;
    pay_rate: number;
    incentive_rate: number;
    start_date: string;
    end_date: string;
    status: 'current' | 'resigned';
    citizen_id: string;
    birth_date: string;
    contacts: EmployeeContactUI[];
    addresses: EmployeeAddress[];
    bank_accounts: EmployeeBankAccount[];
    documents: EmployeeDocument[];
}

// System options map
export interface SystemOptionsMap {
    [key: string]: SystemOption[];
}

// Props for Tab components
export interface BaseTabProps {
    formData: EmployeeFormData;
    setFormData: React.Dispatch<React.SetStateAction<EmployeeFormData>>;
}

export interface BasicInfoTabProps extends BaseTabProps {
    teams: Team[];
    systemOptions: SystemOptionsMap;
    onAddNewOption: (category: string, value: string) => Promise<void>;
    onAddNewTeam: (name: string) => Promise<void>;
    onOpenMagicPaste: (type: 'basic') => void;
}

export interface ContactTabProps extends BaseTabProps {
    onUpdateListItem: (listName: 'contacts', id: string | number, field: string, value: any) => void;
    onAddListItem: (listName: 'contacts', defaultItem: Partial<EmployeeContactUI>) => void;
    onRemoveListItem: (listName: 'contacts', id: string | number) => void;
    onOpenMagicPaste: (type: 'contact', id: string | number) => void;
}

export interface AddressTabProps extends BaseTabProps {
    onUpdateListItem: (listName: 'addresses', id: string | number, field: string, value: any) => void;
    onAddListItem: (listName: 'addresses', defaultItem: Partial<EmployeeAddress>) => void;
    onRemoveListItem: (listName: 'addresses', id: string | number) => void;
    onOpenMagicPaste: (type: 'address', id: string | number) => void;
}

export interface BankTabProps extends BaseTabProps {
    onUpdateListItem: (listName: 'bank_accounts', id: string | number, field: string, value: any) => void;
    onAddListItem: (listName: 'bank_accounts', defaultItem: Partial<EmployeeBankAccount>) => void;
    onRemoveListItem: (listName: 'bank_accounts', id: string | number) => void;
}

export interface DocumentTabProps extends BaseTabProps {
    onFileSelect: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddListItem: (listName: 'documents', defaultItem: Partial<EmployeeDocument>) => void;
    onRemoveListItem: (listName: 'documents', id: string | number) => void;
}

// Section Title component props
export interface SectionTitleProps {
    icon: LucideIcon;
    text: string;
    onMagicClick?: () => void;
}
