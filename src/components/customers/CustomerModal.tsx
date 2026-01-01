import React, { useState, useEffect } from 'react'
import { X, User, MapPin, FileText, Plus, Trash2, Save, Users, Sparkles, Globe, Mail, Smartphone, Facebook, Instagram, AlignLeft, MessageSquare } from 'lucide-react'
import MagicPasteModal from './MagicPasteModal'
import { getSettings, syncSystemOptions } from '../../lib/v1/settingManager'
import DynamicSelect from '../common/DynamicSelect'
import FormInput from '../common/FormInput'
import { Customer, CustomerAddress, CustomerContact, CustomerTaxInvoice } from '../../types/customer'
import { ParsedAddress } from '../../lib/v1/addressParser'

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
    const [activeTab, setActiveTab] = useState<'basic' | 'contact' | 'address' | 'tax'>('basic')
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState<Customer>({
        id: '',
        name: '', phone: '', email: '', line: '', facebook: '', instagram: '',
        media: '', note: '',
        addresses: [],
        contacts: [],
        tax_invoices: []
    })

    const [systemOptions, setSystemOptions] = useState<SystemOptions>({})

    useEffect(() => {
        const fetchOptions = async () => {
            const settings = await getSettings()
            if (settings?.systemOptions) {
                setSystemOptions(settings.systemOptions)
            }
        }
        fetchOptions()
    }, [])

    const handleAddNewOption = async (category: string, newValue: string) => {
        if (!newValue) return
        const currentList = systemOptions[category] || []
        if (currentList.some((item: any) => item.value === newValue)) return

        const updatedList = [...currentList, { value: newValue, label: newValue }]
        setSystemOptions(prev => ({ ...prev, [category]: updatedList }))
        await syncSystemOptions(category, updatedList.map((item: any) => item.value))
    }

    useEffect(() => {
        if (customer) {
            setFormData({
                ...customer,
                addresses: customer.addresses || [],
                contacts: customer.contacts || [],
                tax_invoices: customer.tax_invoices || []
            })
        } else {
            setFormData({
                id: '',
                name: '', phone: '', email: '', line: '', facebook: '', instagram: '',
                media: '', note: '',
                addresses: [{ id: Date.now().toString(), label: 'Home', is_default: true } as CustomerAddress],
                contacts: [{ id: Date.now().toString(), name: '' } as CustomerContact],
                tax_invoices: [{ id: Date.now().toString(), company: '', branch: '00000' } as CustomerTaxInvoice]
            })
        }
    }, [customer, isOpen])

    const [isMagicPasteOpen, setIsMagicPasteOpen] = useState(false)
    const [magicPasteTarget, setMagicPasteTarget] = useState<MagicPasteTarget>({ type: null })

    const handleMagicPasteResult = (result: ParsedAddress) => {
        if (magicPasteTarget.type === 'basic') {
            setFormData(prev => ({
                ...prev,
                name: result.name || prev.name,
                phone: result.phone || prev.phone,
                line: result.line || prev.line,
                email: result.email || prev.email
            }))
        } else if (magicPasteTarget.type === 'contact') {
            const { id } = magicPasteTarget
            const contact = formData.contacts?.find(c => String(c.id) === String(id))
            if (contact) {
                // We use a generic update helper or manual update
                updateListItem('contacts', String(id), 'ALL', {
                    ...contact,
                    name: result.name || contact.name,
                    phone: result.phone || contact.phone,
                    line: result.line || contact.line,
                    email: result.email || contact.email
                })
            }
        } else if (magicPasteTarget.type === 'address') {
            const { id } = magicPasteTarget
            const addr = formData.addresses?.find(a => String(a.id) === String(id))
            if (addr) {
                updateListItem('addresses', String(id), 'ALL', {
                    ...addr,
                    place_name: result.name || addr.place_name,
                    number: result.number || addr.number,
                    villageno: result.villageno || addr.villageno,
                    village: result.village || addr.village,
                    lane: result.lane || addr.lane,
                    road: result.road || addr.road,
                    subdistrict: result.subdistrict || addr.subdistrict,
                    district: result.district || addr.district,
                    province: result.province || addr.province,
                    zipcode: result.zipcode || addr.zipcode,
                    maps: result.maps || addr.maps
                })
            }
        } else if (magicPasteTarget.type === 'tax') {
            const { id } = magicPasteTarget
            const tax = formData.tax_invoices?.find(t => String(t.id) === String(id))
            if (tax) {
                updateListItem('tax_invoices', String(id), 'ALL', {
                    ...tax,
                    company: result.name || tax.company,
                    taxid: result.taxid || tax.taxid,
                    branch: result.branch || tax.branch,
                    number: result.number || tax.number,
                    villageno: result.villageno || tax.villageno,
                    village: result.village || tax.village,
                    lane: result.lane || tax.lane,
                    road: result.road || tax.road,
                    subdistrict: result.subdistrict || tax.subdistrict,
                    district: result.district || tax.district,
                    province: result.province || tax.province,
                    zipcode: result.zipcode || tax.zipcode,
                    maps: result.maps || tax.maps
                })
            }
        }
    }


    if (!isOpen) return null

    const handleSave = async () => {
        if (!formData.name) return alert('กรุณาระบุชื่อลูกค้า')
        setIsSaving(true)
        await onSave(formData)
        setIsSaving(false)
    }

    const tabs = [
        { id: 'basic', label: 'ข้อมูลทั่วไป', icon: User },
        { id: 'contact', label: 'ผู้ติดต่อ', icon: Users },
        { id: 'address', label: 'ที่อยู่', icon: MapPin },
        { id: 'tax', label: 'ภาษี', icon: FileText }
    ] as const;

    const updateListItem = <T extends keyof Customer>(listName: T, id: string, field: string, value: any) => {
        if (!Array.isArray(formData[listName])) return;

        if (field === 'ALL') {
            setFormData(prev => ({
                ...prev,
                [listName]: (prev[listName] as any[]).map(item => String(item.id) === String(id) ? value : item)
            }))
            return
        }
        setFormData(prev => ({
            ...prev,
            [listName]: (prev[listName] as any[]).map(item => String(item.id) === String(id) ? { ...item, [field]: value } : item)
        }))
    }

    const applyAddressToTax = (taxId: string, addressId: string, type: string) => {
        const addr = formData.addresses?.find(a => String(a.id) === String(addressId))
        if (!addr) return

        const tax = formData.tax_invoices?.find(t => String(t.id) === String(taxId))
        if (!tax) return

        if (type === 'registration') {
            const updatedTax: CustomerTaxInvoice = {
                ...tax,
                number: addr.number || '',
                villageno: addr.villageno || '',
                village: addr.village || '',
                lane: addr.lane || '',
                road: addr.road || '',
                subdistrict: addr.subdistrict || '',
                district: addr.district || '',
                province: addr.province || '',
                zipcode: addr.zipcode || '',
                maps: addr.maps || ''
            }
            updateListItem('tax_invoices', taxId, 'ALL', updatedTax)
        }
    }

    const removeListItem = (listName: keyof Customer, id: string) => {
        if (!Array.isArray(formData[listName])) return;
        setFormData(prev => ({
            ...prev,
            [listName]: (prev[listName] as any[]).filter(item => String(item.id) !== String(id))
        }))
    }

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
                    .magic-icon-btn {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        background: var(--primary-50);
                        color: var(--primary-600);
                        border: none;
                        cursor: pointer;
                        transition: all 0.2s;
                        flex-shrink: 0;
                    }
                    .magic-icon-btn:hover {
                        background: var(--primary-100);
                        transform: scale(1.1);
                        box-shadow: 0 0 12px var(--primary-200);
                    }
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                                <User size={18} style={{ color: 'var(--primary-500)' }} />
                                <span style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#475569' }}>ข้อมูลพื้นฐาน</span>
                                <button
                                    className="magic-icon-btn"
                                    onClick={() => { setMagicPasteTarget({ type: 'basic' }); setIsMagicPasteOpen(true); }}
                                    title="กรอกอัตโนมัติ (AI)"
                                >
                                    <Sparkles size={14} />
                                </button>
                            </div>
                            <FormInput
                                label="ชื่อลูกค้า / นิติบุคคล *"
                                value={formData.name}
                                onChange={v => setFormData({ ...formData, name: v })}
                                placeholder="ชื่อลูกค้า / นิติบุคคล *"
                                icon={User}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <FormInput label="เบอร์โทรศัพท์" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} placeholder="เบอร์โทรศัพท์" icon={Smartphone} />
                                <FormInput label="อีเมล" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} placeholder="อีเมล (Email)" icon={Mail} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <FormInput label="Line ID" value={formData.line} onChange={v => setFormData({ ...formData, line: v })} placeholder="Line ID" icon={MessageSquare} />
                                <FormInput label="Facebook" value={formData.facebook} onChange={v => setFormData({ ...formData, facebook: v })} placeholder="Facebook" icon={Facebook} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <FormInput label="Instagram" value={formData.instagram} onChange={v => setFormData({ ...formData, instagram: v })} placeholder="Instagram" icon={Instagram} />
                                <DynamicSelect
                                    label="ช่องทางที่พบเรา"
                                    placeholder="--- ช่องทางที่พบเรา ---"
                                    value={formData.media}
                                    onChange={v => setFormData({ ...formData, media: String(v) })}
                                    options={[
                                        ...(systemOptions.customerChannels || []),
                                        { value: 'FB', label: 'Facebook' },
                                        { value: 'Tiktok', label: 'Tiktok' },
                                        { value: 'Google', label: 'Google' },
                                        { value: 'Referral', label: 'พี่เนแนะนำ' }
                                    ].filter((v, i, a) => a.findIndex(t => (t.value === v.value)) === i)}
                                    onAddItem={v => handleAddNewOption('customerChannels', v)}
                                />
                            </div>
                            <FormInput
                                label="หมายเหตุเพิ่มเติม"
                                value={formData.note}
                                onChange={v => setFormData({ ...formData, note: v })}
                                placeholder="หมายเหตุเพิ่มเติม..."
                                icon={AlignLeft}
                            />
                        </div>
                    )}

                    {activeTab === 'contact' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {formData.contacts?.map((contact, idx) => (
                                <div key={contact.id} className="card" style={{ padding: '20px', position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Users size={18} style={{ color: 'var(--primary-500)' }} />
                                            <span style={{ fontSize: '15px', fontWeight: 700, color: '#475569' }}>ข้อมูลผู้ติดต่อ #{idx + 1}</span>
                                            <button
                                                className="magic-icon-btn"
                                                onClick={() => { setMagicPasteTarget({ type: 'contact', id: contact.id }); setIsMagicPasteOpen(true); }}
                                                title="กรอกอัตโนมัติ (AI)"
                                            >
                                                <Sparkles size={14} />
                                            </button>
                                        </div>
                                        <button onClick={() => removeListItem('contacts', contact.id)} style={{ border: 'none', background: 'none', color: '#fda4af', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <FormInput
                                            label="ชื่อ-นามสกุล"
                                            placeholder="ชื่อ-นามสกุล ของผู้ติดต่อ"
                                            value={contact.name}
                                            onChange={v => updateListItem('contacts', contact.id, 'name', v)}
                                            icon={User}
                                        />
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                            <FormInput
                                                label="เบอร์โทรศัพท์"
                                                placeholder="เบอร์โทรศัพท์ (ผู้ติดต่อ)"
                                                value={contact.phone || ''}
                                                onChange={v => updateListItem('contacts', contact.id, 'phone', v)}
                                                icon={Smartphone}
                                            />
                                            <FormInput
                                                label="อีเมล"
                                                placeholder="อีเมล (Email)"
                                                value={contact.email || ''}
                                                onChange={v => updateListItem('contacts', contact.id, 'email', v)}
                                                icon={Mail}
                                            />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                            <FormInput
                                                label="Line ID"
                                                placeholder="Line ID"
                                                value={contact.line || ''}
                                                onChange={v => updateListItem('contacts', contact.id, 'line', v)}
                                                icon={MessageSquare}
                                            />
                                            <FormInput
                                                label="Facebook"
                                                placeholder="Facebook"
                                                value={contact.facebook || ''}
                                                onChange={v => updateListItem('contacts', contact.id, 'facebook', v)}
                                                icon={Facebook}
                                            />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                            <FormInput
                                                label="Instagram"
                                                placeholder="Instagram"
                                                value={contact.instagram || ''}
                                                onChange={v => updateListItem('contacts', contact.id, 'instagram', v)}
                                                icon={Instagram}
                                            />
                                            <FormInput
                                                label="หมายเหตุ"
                                                placeholder="หมายเหตุ (ผู้ติดต่อ)"
                                                value={contact.note || ''}
                                                onChange={v => updateListItem('contacts', contact.id, 'note', v)}
                                                icon={AlignLeft}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setFormData({ ...formData, contacts: [...(formData.contacts || []), { id: Date.now().toString(), name: '', phone: '', email: '', line: '', facebook: '', instagram: '', note: '' }] })}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    border: '2px dashed #e2e8f0',
                                    borderRadius: '16px',
                                    background: 'none',
                                    color: '#94a3b8',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary-300)'; e.currentTarget.style.color = 'var(--primary-600)'; e.currentTarget.style.background = 'var(--primary-50)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'none'; }}
                            >
                                <Plus size={18} /> เพิ่มผู้ติดต่อสำรอง
                            </button>
                        </div>
                    )}

                    {activeTab === 'address' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {formData.addresses?.map((addr, idx) => (
                                <div key={addr.id} className="card" style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <MapPin size={18} style={{ color: 'var(--primary-500)' }} />
                                            <span style={{ fontSize: '15px', fontWeight: 700, color: '#475569' }}>ข้อมูลที่อยู่ #{idx + 1}</span>
                                            <button
                                                className="magic-icon-btn"
                                                onClick={() => { setMagicPasteTarget({ type: 'address', id: addr.id }); setIsMagicPasteOpen(true); }}
                                                title="กรอกอัตโนมัติ (AI)"
                                            >
                                                <Sparkles size={14} />
                                            </button>
                                            {addr.is_default && (
                                                <span style={{
                                                    padding: '2px 8px',
                                                    background: 'var(--primary-500)',
                                                    color: 'white',
                                                    borderRadius: '4px',
                                                    fontSize: '10px',
                                                    fontWeight: 800,
                                                    marginLeft: '4px',
                                                    display: 'inline-flex',
                                                    alignItems: 'center'
                                                }}>
                                                    PRIMARY
                                                </span>
                                            )}
                                        </div>
                                        <button onClick={() => removeListItem('addresses', addr.id)} style={{ border: 'none', background: 'none', color: '#fda4af', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ position: 'relative' }}>
                                            <FormInput
                                                label="ป้ายชื่อที่อยู่"
                                                placeholder="ป้ายชื่อที่อยู่ (เช่น บ้าน, ออฟฟิศ, หน้าไซต์งาน)"
                                                value={addr.label || ''}
                                                onChange={v => updateListItem('addresses', addr.id, 'label', v)}
                                                icon={MapPin}
                                            />
                                        </div>
                                        <FormInput label="ชื่อสถานที่" placeholder="ชื่อสถานที่ (เช่น ร้านแสงเจริญ, ตึกภิรัช)" value={addr.place_name || ''} onChange={v => updateListItem('addresses', addr.id, 'place_name', v)} icon={MapPin} />
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                            <FormInput label="เลขที่" placeholder="เลขที่" value={addr.number || ''} onChange={v => updateListItem('addresses', addr.id, 'number', v)} icon={MapPin} />
                                            <FormInput label="หมู่ที่" placeholder="หมู่ที่" value={addr.villageno || ''} onChange={v => updateListItem('addresses', addr.id, 'villageno', v)} icon={MapPin} />
                                        </div>
                                        <FormInput label="หมู่บ้าน / อาคาร" placeholder="หมู่บ้าน / อาคาร" value={addr.village || ''} onChange={v => updateListItem('addresses', addr.id, 'village', v)} icon={MapPin} />
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                            <FormInput label="ซอย" placeholder="ซอย" value={addr.lane || ''} onChange={v => updateListItem('addresses', addr.id, 'lane', v)} icon={MapPin} />
                                            <FormInput label="ถนน" placeholder="ถนน" value={addr.road || ''} onChange={v => updateListItem('addresses', addr.id, 'road', v)} icon={MapPin} />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                            <FormInput label="แขวง / ตำบล" placeholder="แขวง / ตำบล" value={addr.subdistrict || ''} onChange={v => updateListItem('addresses', addr.id, 'subdistrict', v)} icon={MapPin} />
                                            <FormInput label="เขต / อำเภอ" placeholder="เขต / อำเภอ" value={addr.district || ''} onChange={v => updateListItem('addresses', addr.id, 'district', v)} icon={MapPin} />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                            <FormInput label="จังหวัด" placeholder="จังหวัด" value={addr.province || ''} onChange={v => updateListItem('addresses', addr.id, 'province', v)} icon={MapPin} />
                                            <FormInput label="รหัสไปรษณีย์" placeholder="รหัสไปรษณีย์" value={addr.zipcode || ''} onChange={v => updateListItem('addresses', addr.id, 'zipcode', v)} icon={MapPin} />
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            <FormInput label="Google Maps Link" placeholder="Link Google Maps (ถ้ามี)" value={addr.maps || ''} onChange={v => updateListItem('addresses', addr.id, 'maps', v)} icon={Globe} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setFormData({ ...formData, addresses: [...(formData.addresses || []), { id: Date.now().toString(), label: 'สาขา ' + ((formData.addresses?.length || 0) + 1) }] })}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    border: '2px dashed #e2e8f0',
                                    borderRadius: '16px',
                                    background: 'none',
                                    color: '#94a3b8',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary-300)'; e.currentTarget.style.color = 'var(--primary-600)'; e.currentTarget.style.background = 'var(--primary-50)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'none'; }}
                            >
                                <Plus size={18} /> เพิ่มที่อยู่ติดตั้งเพิ่ม
                            </button>
                        </div>
                    )}

                    {activeTab === 'tax' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {formData.tax_invoices?.map((tax, idx) => (
                                <div key={tax.id} className="card" style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FileText size={18} style={{ color: 'var(--primary-500)' }} />
                                            <span style={{ fontSize: '15px', fontWeight: 700, color: '#475569' }}>ข้อมูลใบกำกับภาษี #{idx + 1}</span>
                                            <button
                                                className="magic-icon-btn"
                                                onClick={() => { setMagicPasteTarget({ type: 'tax', id: tax.id }); setIsMagicPasteOpen(true); }}
                                                title="กรอกอัตโนมัติ (AI)"
                                            >
                                                <Sparkles size={14} />
                                            </button>
                                        </div>
                                        <button onClick={() => removeListItem('tax_invoices', tax.id)} style={{ border: 'none', background: 'none', color: '#fda4af', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <FormInput label="ชื่อจดทะเบียน" placeholder="ชื่อจดทะเบียนบริษัท หรือ ชื่อบุคคล" value={tax.company} onChange={v => updateListItem('tax_invoices', tax.id, 'company', v)} icon={FileText} />
                                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                                            <FormInput label="เลขประจำตัวผู้เสียภาษี" placeholder="เลขประจำตัวผู้เสียภาษี (13 หลัก)" value={tax.taxid || ''} onChange={v => updateListItem('tax_invoices', tax.id, 'taxid', v)} icon={FileText} />
                                            <FormInput label="รหัสสาขา" placeholder="รหัสสาขา" value={tax.branch || ''} onChange={v => updateListItem('tax_invoices', tax.id, 'branch', v)} icon={FileText} />
                                        </div>

                                        {/* Registered Address */}
                                        <div style={{ marginTop: '12px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <label style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: '#64748b' }}>ที่อยู่ตามใบกำกับภาษี</label>
                                                <select
                                                    style={{ fontSize: '11px', padding: '4px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                                                    onChange={(e) => applyAddressToTax(tax.id, e.target.value, 'registration')}
                                                    value=""
                                                >
                                                    <option value="">--- ดึงข้อมูลจากที่อยู่ ---</option>
                                                    {formData.addresses?.map(a => (
                                                        <option key={a.id} value={a.id}>{a.label || 'ไม่ระบุชื่อ'}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                    <FormInput label="เลขที่" placeholder="เลขที่" value={tax.number || ''} onChange={v => updateListItem('tax_invoices', tax.id, 'number', v)} />
                                                    <FormInput label="หมู่ที่" placeholder="หมู่ที่" value={tax.villageno || ''} onChange={v => updateListItem('tax_invoices', tax.id, 'villageno', v)} />
                                                </div>
                                                <FormInput label="หมู่บ้าน / อาคาร" placeholder="หมู่บ้าน / อาคาร" value={tax.village || ''} onChange={v => updateListItem('tax_invoices', tax.id, 'village', v)} />
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                    <FormInput label="ซอย" placeholder="ซอย" value={tax.lane || ''} onChange={v => updateListItem('tax_invoices', tax.id, 'lane', v)} />
                                                    <FormInput label="ถนน" placeholder="ถนน" value={tax.road || ''} onChange={v => updateListItem('tax_invoices', tax.id, 'road', v)} />
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                    <FormInput label="แขวง / ตำบล" placeholder="แขวง / ตำบล" value={tax.subdistrict || ''} onChange={v => updateListItem('tax_invoices', tax.id, 'subdistrict', v)} />
                                                    <FormInput label="เขต / อำเภอ" placeholder="เขต / อำเภอ" value={tax.district || ''} onChange={v => updateListItem('tax_invoices', tax.id, 'district', v)} />
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                    <FormInput label="จังหวัด" placeholder="จังหวัด" value={tax.province || ''} onChange={v => updateListItem('tax_invoices', tax.id, 'province', v)} />
                                                    <FormInput label="รหัสไปรษณีย์" placeholder="รหัสไปรษณีย์" value={tax.zipcode || ''} onChange={v => updateListItem('tax_invoices', tax.id, 'zipcode', v)} />
                                                </div>
                                                <FormInput label="Google Maps Link" placeholder="Google Maps Link" value={tax.maps || ''} onChange={v => updateListItem('tax_invoices', tax.id, 'maps', v)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setFormData({ ...formData, tax_invoices: [...(formData.tax_invoices || []), { id: Date.now().toString(), company: '' } as CustomerTaxInvoice] })}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    border: '2px dashed #e2e8f0',
                                    borderRadius: '16px',
                                    background: 'none',
                                    color: '#94a3b8',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary-300)'; e.currentTarget.style.color = 'var(--primary-600)'; e.currentTarget.style.background = 'var(--primary-50)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'none'; }}
                            >
                                <Plus size={18} /> เพิ่มชุดข้อมูลภาษี
                            </button>
                        </div>
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
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '14px',
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '14px',
                            fontWeight: 600,
                            color: '#64748b',
                            cursor: 'pointer'
                        }}
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="button-primary"
                        style={{ flex: 2, padding: '14px', justifyContent: 'center' }}
                    >
                        {isSaving ? <span style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <Save size={20} />}
                        <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูลลูกค้า'}</span>
                    </button>
                    <style>{`
                        @keyframes spin { to { transform: rotate(360deg); } }
                    `}</style>
                    <MagicPasteModal
                        isOpen={isMagicPasteOpen}
                        onClose={() => setIsMagicPasteOpen(false)}
                        onParse={handleMagicPasteResult}
                    />
                </div>
            </div>
        </div >
    )
}

export default CustomerModal
