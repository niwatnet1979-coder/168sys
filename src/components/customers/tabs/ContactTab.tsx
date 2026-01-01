import React from 'react';
import { Users, Sparkles, Trash2, User, Smartphone, Mail, MessageSquare, Facebook, Instagram, AlignLeft } from 'lucide-react';
import FormInput from '../../common/FormInput';
import AddItemButton from '../../common/AddItemButton';
import { Customer, CustomerContact } from '../../../types/customer';

interface ContactTabProps {
    formData: Customer;
    onChange: (data: Customer) => void;
    onMagicPaste: (id: string) => void;
}

export default function ContactTab({ formData, onChange, onMagicPaste }: ContactTabProps) {
    const contacts = formData.contacts || [];

    const handleUpdate = (id: string, field: keyof CustomerContact, value: any) => {
        const updatedContacts = contacts.map(item =>
            String(item.id) === String(id) ? { ...item, [field]: value } : item
        );
        onChange({ ...formData, contacts: updatedContacts });
    };

    const handleRemove = (id: string) => {
        const updatedContacts = contacts.filter(item => String(item.id) !== String(id));
        onChange({ ...formData, contacts: updatedContacts });
    };

    const handleAdd = () => {
        const newContact: CustomerContact = {
            id: Date.now().toString(),
            name: '',
            phone: '',
            email: '',
            line: '',
            facebook: '',
            instagram: '',
            note: ''
        };
        onChange({ ...formData, contacts: [...contacts, newContact] });
    };

    return (
        <div className="flex flex-col gap-6">
            {contacts.map((contact, idx) => (
                <div key={contact.id} className="card p-5 relative border border-slate-100 rounded-2xl shadow-sm bg-white">
                    <div className="flex justify-between items-center mb-5">
                        <div className="flex items-center gap-2">
                            <Users size={18} className="text-primary-500" />
                            <span className="text-[15px] font-bold text-slate-600">ข้อมูลผู้ติดต่อ #{idx + 1}</span>
                            <button
                                className="magic-icon-btn"
                                onClick={() => onMagicPaste(String(contact.id))}
                                title="กรอกอัตโนมัติ (AI)"
                            >
                                <Sparkles size={14} />
                            </button>
                        </div>
                        <button
                            onClick={() => handleRemove(String(contact.id))}
                            style={{ border: 'none', background: 'none', color: '#fda4af', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            className="hover:text-red-500 transition-colors"
                            title="ลบผู้ติดต่อ"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        <FormInput
                            label="ชื่อ-นามสกุล"
                            placeholder="ชื่อ-นามสกุล ของผู้ติดต่อ"
                            value={contact.name}
                            onChange={v => handleUpdate(String(contact.id), 'name', v)}
                            icon={User}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <FormInput
                                label="เบอร์โทรศัพท์"
                                placeholder="เบอร์โทรศัพท์ (ผู้ติดต่อ)"
                                value={contact.phone || ''}
                                onChange={v => handleUpdate(String(contact.id), 'phone', v)}
                                icon={Smartphone}
                            />
                            <FormInput
                                label="อีเมล"
                                placeholder="อีเมล (Email)"
                                value={contact.email || ''}
                                onChange={v => handleUpdate(String(contact.id), 'email', v)}
                                icon={Mail}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <FormInput
                                label="Line ID"
                                placeholder="Line ID"
                                value={contact.line || ''}
                                onChange={v => handleUpdate(String(contact.id), 'line', v)}
                                icon={MessageSquare}
                            />
                            <FormInput
                                label="Facebook"
                                placeholder="Facebook"
                                value={contact.facebook || ''}
                                onChange={v => handleUpdate(String(contact.id), 'facebook', v)}
                                icon={Facebook}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <FormInput
                                label="Instagram"
                                placeholder="Instagram"
                                value={contact.instagram || ''}
                                onChange={v => handleUpdate(String(contact.id), 'instagram', v)}
                                icon={Instagram}
                            />
                            <FormInput
                                label="หมายเหตุ"
                                placeholder="หมายเหตุ (ผู้ติดต่อ)"
                                value={contact.note || ''}
                                onChange={v => handleUpdate(String(contact.id), 'note', v)}
                                icon={AlignLeft}
                            />
                        </div>
                    </div>
                </div>
            ))}

            <AddItemButton onClick={handleAdd} label="เพิ่มผู้ติดต่อสำรอง" />
        </div>
    );
}
