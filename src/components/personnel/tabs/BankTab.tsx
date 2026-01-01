import React from 'react';
import {
    CreditCard,
    User,
    Trash2,
    Sparkles
} from 'lucide-react';
import DynamicSelect from '../../common/DynamicSelect';
import FormInput from '../../common/FormInput';
import AddItemButton from '../../common/AddItemButton';
import { BankTabProps, SystemOptionsMap } from './types';

// Default bank options
const DEFAULT_BANK_OPTIONS = [
    { value: 'KBANK', label: 'กสิกรไทย (KBANK)' },
    { value: 'SCB', label: 'ไทยพาณิชย์ (SCB)' },
    { value: 'BBL', label: 'กรุงเทพ (BBL)' },
    { value: 'KTB', label: 'กรุงไทย (KTB)' },
    { value: 'TTB', label: 'ทหารไทยธนชาต (TTB)' },
    { value: 'BAY', label: 'กรุงศรี (BAY)' },
    { value: 'GSB', label: 'ออมสิน (GSB)' }
];

interface ExtendedBankTabProps extends BankTabProps {
    systemOptions: SystemOptionsMap;
    onAddNewOption: (category: string, value: string) => Promise<void>;
    onOpenMagicPaste: (type: 'bank', id?: string | number) => void;
}

/**
 * BankTab - ธนาคาร Tab
 * Manages employee bank accounts.
 * Updated to match CustomerModal card-style layout.
 */
export default function BankTab({
    formData,
    systemOptions,
    onUpdateListItem,
    onAddListItem,
    onRemoveListItem,
    onAddNewOption,
    onOpenMagicPaste
}: ExtendedBankTabProps) {
    // Combine system options with defaults, remove duplicates
    const bankOptions = [
        ...(systemOptions.bankNames || []),
        ...DEFAULT_BANK_OPTIONS
    ].filter((v, i, a) => a.findIndex(t => t.value === v.value) === i);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {formData.bank_accounts.map((bank, idx) => (
                <div key={bank.id} className="card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CreditCard size={18} style={{ color: 'var(--primary-500)' }} />
                            <span style={{ fontSize: '15px', fontWeight: 700, color: '#475569' }}>บัญชีธนาคาร #{idx + 1}</span>
                            <button
                                className="magic-icon-btn"
                                onClick={() => onOpenMagicPaste('bank', bank.id)}
                                title="กรอกอัตโนมัติ (AI)"
                            >
                                <Sparkles size={14} />
                            </button>
                            {bank.is_default && (
                                <span className="badge-primary">
                                    PRIMARY
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => onRemoveListItem('bank_accounts', bank.id)}
                            style={{ border: 'none', background: 'none', color: '#fda4af', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            title="ลบบัญชี"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <DynamicSelect
                            label="ธนาคาร"
                            placeholder="เลือกธนาคาร..."
                            value={bank.bank_name}
                            onChange={v => onUpdateListItem('bank_accounts', bank.id, 'bank_name', v)}
                            options={bankOptions}
                            onAddItem={v => onAddNewOption('bankNames', v)}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <FormInput
                                label="เลขที่บัญชี"
                                placeholder="เลขที่บัญชี"
                                value={bank.account_number}
                                onChange={v => onUpdateListItem('bank_accounts', bank.id, 'account_number', v)}
                                icon={CreditCard}
                            />
                            <FormInput
                                label="ชื่อบัญชี"
                                placeholder="ชื่อบัญชี"
                                value={bank.account_name}
                                onChange={v => onUpdateListItem('bank_accounts', bank.id, 'account_name', v)}
                                icon={User}
                            />
                        </div>
                    </div>
                </div>
            ))}
            <AddItemButton
                onClick={() => onAddListItem('bank_accounts', {
                    bank_name: 'KBANK',
                    account_number: '',
                    account_name: '',
                    is_default: false
                })}
                label="เพิ่มบัญชีธนาคาร"
            />
        </div>
    );
}
