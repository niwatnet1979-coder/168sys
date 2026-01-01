import React from 'react';
import {
    Users,
    User,
    Phone,
    Mail,
    MessageSquare,
    Facebook,
    AlignLeft,
    Trash2,
    Sparkles
} from 'lucide-react';
import FormInput from '../../common/FormInput';
import AddItemButton from '../../common/AddItemButton';
import { ContactTabProps } from './types';

/**
 * ContactTab - ผู้ติดต่อ Tab
 * Manages employee contact sets (phone, email, line, facebook).
 * Updated to match CustomerModal card-style layout.
 */
export default function ContactTab({
    formData,
    onUpdateListItem,
    onAddListItem,
    onRemoveListItem,
    onOpenMagicPaste
}: ContactTabProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {formData.contacts.map((contact, idx) => (
                <div key={contact.id} className="card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Users size={18} style={{ color: 'var(--primary-500)' }} />
                            <span style={{ fontSize: '15px', fontWeight: 700, color: '#475569' }}>ข้อมูลผู้ติดต่อ #{idx + 1}</span>
                            <button
                                className="magic-icon-btn"
                                onClick={() => onOpenMagicPaste('contact', contact.id)}
                                title="กรอกอัตโนมัติ (AI)"
                            >
                                <Sparkles size={14} />
                            </button>
                        </div>
                        <button
                            onClick={() => onRemoveListItem('contacts', contact.id)}
                            style={{ border: 'none', background: 'none', color: '#fda4af', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            title="ลบผู้ติดต่อ"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <FormInput
                            label="ชื่อผู้ติดต่อ (Label)"
                            icon={User}
                            placeholder="ชื่อ-นามสกุล / Label (e.g. เบอร์หลัก)"
                            value={contact.name}
                            onChange={v => onUpdateListItem('contacts', contact.id, 'name', v)}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <FormInput
                                label="เบอร์โทรศัพท์"
                                icon={Phone}
                                placeholder="เบอร์โทรศัพท์"
                                value={contact.phone}
                                onChange={v => onUpdateListItem('contacts', contact.id, 'phone', v)}
                            />
                            <FormInput
                                label="อีเมล"
                                icon={Mail}
                                placeholder="อีเมล"
                                value={contact.email}
                                onChange={v => onUpdateListItem('contacts', contact.id, 'email', v)}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <FormInput
                                label="Line ID"
                                icon={MessageSquare}
                                placeholder="Line ID"
                                value={contact.line}
                                onChange={v => onUpdateListItem('contacts', contact.id, 'line', v)}
                            />
                            <FormInput
                                label="Facebook"
                                icon={Facebook}
                                placeholder="Facebook"
                                value={contact.facebook}
                                onChange={v => onUpdateListItem('contacts', contact.id, 'facebook', v)}
                            />
                        </div>
                        <FormInput
                            label="หมายเหตุ"
                            icon={AlignLeft}
                            placeholder="หมายเหตุ"
                            value={contact.note}
                            onChange={v => onUpdateListItem('contacts', contact.id, 'note', v)}
                        />
                    </div>
                </div>
            ))}
            <AddItemButton
                onClick={() => onAddListItem('contacts', {
                    name: 'ผู้ติดต่อใหม่',
                    phone: '',
                    line: '',
                    email: '',
                    facebook: '',
                    instagram: '',
                    note: '',
                    is_primary: false
                })}
                label="เพิ่มผู้ติดต่อสำรอง"
            />
        </div>
    );
}
