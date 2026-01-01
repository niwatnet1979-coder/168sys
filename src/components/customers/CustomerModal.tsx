import React, { useState, useEffect } from 'react';
import { X, User, MapPin, FileText, Save, Users, CreditCard } from 'lucide-react';
import { getSettings, syncSystemOptions } from '../../lib/v1/settingManager';
import { Customer, CustomerAddress, CustomerContact, CustomerTaxInvoice } from '../../types/customer';
import { ParsedAddress } from '../../lib/v1/addressParser';
import MagicPasteModal from './MagicPasteModal';
import { Button } from '../common/Button';

// Import Tab Components
import { BasicInfoTab, ContactTab, AddressTab, TaxTab } from './tabs';

interface CustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: Customer | null | undefined;
    onSave: (data: Customer) => Promise<void>;
}

interface SystemOptions {
    customerChannels?: { value: string; label: string }[];
    [key: string]: any;
}

type MagicPasteTargetType = 'basic' | 'contact' | 'address' | 'tax' | null;

interface MagicPasteTarget {
    type: MagicPasteTargetType;
    id?: string | number;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ isOpen, onClose, customer, onSave }) => {
    const [activeTab, setActiveTab] = useState<'basic' | 'contact' | 'address' | 'tax'>('basic');
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<Customer>({
        id: '',
        name: '', phone: '', email: '', line: '', facebook: '', instagram: '',
        media: '', note: '',
        addresses: [],
        contacts: [],
        tax_invoices: []
    });

    const [systemOptions, setSystemOptions] = useState<SystemOptions>({});
    const [isMagicPasteOpen, setIsMagicPasteOpen] = useState(false);
    const [magicPasteTarget, setMagicPasteTarget] = useState<MagicPasteTarget>({ type: null });

    useEffect(() => {
        const fetchOptions = async () => {
            const settings = await getSettings();
            if (settings?.systemOptions) {
                setSystemOptions(settings.systemOptions);
            }
        };
        fetchOptions();
    }, []);

    const handleAddNewOption = async (category: string, newValue: string) => {
        if (!newValue) return;
        const currentList = systemOptions[category] || [];
        if (currentList.some((item: any) => item.value === newValue)) return;

        const updatedList = [...currentList, { value: newValue, label: newValue }];
        setSystemOptions(prev => ({ ...prev, [category]: updatedList }));
        await syncSystemOptions(category, updatedList.map((item: any) => item.value));
    };

    useEffect(() => {
        if (customer) {
            setFormData({
                ...customer,
                addresses: customer.addresses || [],
                contacts: customer.contacts || [],
                tax_invoices: customer.tax_invoices || []
            });
        } else {
            setFormData({
                id: '',
                name: '', phone: '', email: '', line: '', facebook: '', instagram: '',
                media: '', note: '',
                addresses: [{ id: Date.now().toString(), label: 'Home', is_default: true } as CustomerAddress],
                contacts: [{ id: Date.now().toString(), name: '' } as CustomerContact],
                tax_invoices: [{ id: Date.now().toString(), company: '', branch: '00000' } as CustomerTaxInvoice]
            });
        }
    }, [customer, isOpen]);

    const handleMagicPasteResult = (result: ParsedAddress) => {
        if (magicPasteTarget.type === 'basic') {
            setFormData(prev => ({
                ...prev,
                name: result.name || prev.name,
                phone: result.phone || prev.phone,
                line: result.line || prev.line,
                email: result.email || prev.email
            }));
        } else if (magicPasteTarget.type === 'contact') {
            const { id } = magicPasteTarget;
            const contact = formData.contacts?.find(c => String(c.id) === String(id));
            if (contact) {
                const updatedContacts = formData.contacts?.map(c => String(c.id) === String(id) ? {
                    ...c,
                    name: result.name || c.name,
                    phone: result.phone || c.phone,
                    line: result.line || c.line,
                    email: result.email || c.email
                } : c);
                setFormData(prev => ({ ...prev, contacts: updatedContacts }));
            }
        } else if (magicPasteTarget.type === 'address') {
            const { id } = magicPasteTarget;
            const addr = formData.addresses?.find(a => String(a.id) === String(id));
            if (addr) {
                const updatedAddresses = formData.addresses?.map(a => String(a.id) === String(id) ? {
                    ...a,
                    place_name: result.name || a.place_name,
                    number: result.number || a.number,
                    villageno: result.villageno || a.villageno,
                    village: result.village || a.village,
                    lane: result.lane || a.lane,
                    road: result.road || a.road,
                    subdistrict: result.subdistrict || a.subdistrict,
                    district: result.district || a.district,
                    province: result.province || a.province,
                    zipcode: result.zipcode || a.zipcode,
                    maps: result.maps || a.maps
                } : a);
                setFormData(prev => ({ ...prev, addresses: updatedAddresses }));
            }
        } else if (magicPasteTarget.type === 'tax') {
            const { id } = magicPasteTarget;
            const tax = formData.tax_invoices?.find(t => String(t.id) === String(id));
            if (tax) {
                const updatedTax = formData.tax_invoices?.map(t => String(t.id) === String(id) ? {
                    ...t,
                    company: result.name || t.company,
                    taxid: result.taxid || t.taxid,
                    branch: result.branch || t.branch,
                    number: result.number || t.number,
                    villageno: result.villageno || t.villageno,
                    village: result.village || t.village,
                    lane: result.lane || t.lane,
                    road: result.road || t.road,
                    subdistrict: result.subdistrict || t.subdistrict,
                    district: result.district || t.district,
                    province: result.province || t.province,
                    zipcode: result.zipcode || t.zipcode,
                    maps: result.maps || t.maps
                } : t);
                setFormData(prev => ({ ...prev, tax_invoices: updatedTax }));
            }
        }
    };

    const handleSave = async () => {
        if (!formData.name) return alert('กรุณาระบุชื่อลูกค้า');
        setIsSaving(true);
        await onSave(formData);
        setIsSaving(false);
    };

    if (!isOpen) return null;

    const tabs = [
        { id: 'basic', label: 'ข้อมูลทั่วไป', icon: User },
        { id: 'contact', label: 'ผู้ติดต่อ', icon: Users },
        { id: 'address', label: 'ที่อยู่', icon: MapPin },
        { id: 'tax', label: 'ภาษี', icon: FileText }
    ] as const;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            padding: '16px'
        }}>
            <div style={{
                backgroundColor: 'white',
                width: '100%',
                maxWidth: '640px',
                maxHeight: '90vh',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                animation: 'modalSlideUp 0.3s ease-out'
            }}>
                <style>{`
                    @keyframes modalSlideUp {
                        from { transform: translateY(20px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    .custom-tab {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: 12px 8px;
                        gap: 4px;
                        border: none;
                        background: none;
                        cursor: pointer;
                        transition: all 0.2s;
                        border-bottom: 2px solid transparent;
                        flex: 1;
                    }
                    .custom-tab.active {
                        color: var(--primary-600);
                        border-bottom-color: var(--primary-600);
                        background: var(--primary-50);
                    }
                    .custom-tab:not(.active):hover {
                        background: #f8fafc;
                        color: var(--text-main);
                    }
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>

                {/* Header */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            padding: '10px',
                            background: 'var(--primary-100)',
                            color: 'var(--primary-600)',
                            borderRadius: '12px'
                        }}>
                            <User size={20} />
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                            {customer ? 'แก้ไขข้อมูลลูกค้า' : 'เพิ่มลูกค้าใหม่'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px',
                            background: '#f1f5f9',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            color: '#64748b'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div style={{ display: 'flex', background: '#ffffff', borderBottom: '1px solid var(--border-color)' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`custom-tab ${activeTab === tab.id ? 'active' : ''}`}
                        >
                            <tab.icon size={18} />
                            <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600 }}>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Body */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                }}>
                    {activeTab === 'basic' && (
                        <BasicInfoTab
                            formData={formData}
                            onChange={(data) => setFormData(data)}
                            systemOptions={systemOptions}
                            onAddNewOption={handleAddNewOption}
                            onMagicPaste={() => { setMagicPasteTarget({ type: 'basic' }); setIsMagicPasteOpen(true); }}
                        />
                    )}

                    {activeTab === 'contact' && (
                        <ContactTab
                            formData={formData}
                            onChange={(data) => setFormData(data)}
                            onMagicPaste={(id) => { setMagicPasteTarget({ type: 'contact', id }); setIsMagicPasteOpen(true); }}
                        />
                    )}

                    {activeTab === 'address' && (
                        <AddressTab
                            formData={formData}
                            onChange={(data) => setFormData(data)}
                            onMagicPaste={(id) => { setMagicPasteTarget({ type: 'address', id }); setIsMagicPasteOpen(true); }}
                        />
                    )}

                    {activeTab === 'tax' && (
                        <TaxTab
                            formData={formData}
                            onChange={(data) => setFormData(data)}
                            onMagicPaste={(id) => { setMagicPasteTarget({ type: 'tax', id }); setIsMagicPasteOpen(true); }}
                        />
                    )}
                </div>

                {/* Footer Actions */}
                <div style={{
                    padding: '24px',
                    borderTop: '1px solid var(--border-color)',
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="flex-1"
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-[2] justify-center"
                    >
                        {isSaving ? (
                            <span style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                        ) : (
                            <Save size={20} className="mr-2" />
                        )}
                        <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูลลูกค้า'}</span>
                    </Button>
                </div>
            </div>

            <MagicPasteModal
                isOpen={isMagicPasteOpen}
                onClose={() => setIsMagicPasteOpen(false)}
                onParse={handleMagicPasteResult}
            />
        </div>
    );
};

export default CustomerModal;
