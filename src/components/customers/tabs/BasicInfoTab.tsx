import React from 'react';
import { User, Smartphone, Mail, MessageSquare, Facebook, Instagram, AlignLeft, Sparkles, LucideIcon } from 'lucide-react';
import FormInput from '../../common/FormInput';
import FormTextarea from '../../common/FormTextarea';
import DynamicSelect from '../../common/DynamicSelect';
import { Customer } from '../../../types/customer';

interface BasicInfoTabProps {
    formData: Customer;
    onChange: (data: Customer) => void;
    systemOptions: any;
    onAddNewOption: (category: string, value: string) => void;
    onMagicPaste: () => void;
}

export default function BasicInfoTab({
    formData,
    onChange,
    systemOptions,
    onAddNewOption,
    onMagicPaste
}: BasicInfoTabProps) {
    const handleChange = (field: keyof Customer, value: any) => {
        onChange({ ...formData, [field]: value });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <User size={18} style={{ color: 'var(--primary-500)' }} />
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#475569' }}>ข้อมูลพื้นฐาน</span>
                    <button
                        className="magic-icon-btn"
                        onClick={onMagicPaste}
                        title="กรอกอัตโนมัติ (AI)"
                    >
                        <Sparkles size={14} />
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <FormInput
                        label="ชื่อลูกค้า / นิติบุคคล *"
                        value={formData.name}
                        onChange={v => handleChange('name', v)}
                        placeholder="ชื่อลูกค้า / นิติบุคคล *"
                        icon={User}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <FormInput
                            label="เบอร์โทรศัพท์"
                            value={formData.phone}
                            onChange={v => handleChange('phone', v)}
                            placeholder="เบอร์โทรศัพท์"
                            icon={Smartphone}
                        />
                        <FormInput
                            label="อีเมล"
                            value={formData.email}
                            onChange={v => handleChange('email', v)}
                            placeholder="อีเมล (Email)"
                            icon={Mail}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <FormInput
                            label="Line ID"
                            value={formData.line}
                            onChange={v => handleChange('line', v)}
                            placeholder="Line ID"
                            icon={MessageSquare}
                        />
                        <FormInput
                            label="Facebook"
                            value={formData.facebook}
                            onChange={v => handleChange('facebook', v)}
                            placeholder="Facebook"
                            icon={Facebook}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <FormInput
                            label="Instagram"
                            value={formData.instagram}
                            onChange={v => handleChange('instagram', v)}
                            placeholder="Instagram"
                            icon={Instagram}
                        />
                        <DynamicSelect
                            label="ช่องทางที่พบเรา"
                            placeholder="--- ช่องทางที่พบเรา ---"
                            value={formData.media || ''}
                            onChange={v => handleChange('media', String(v))}
                            options={[
                                ...(systemOptions.customerChannels || []),
                                { value: 'FB', label: 'Facebook' },
                                { value: 'Tiktok', label: 'Tiktok' },
                                { value: 'Google', label: 'Google' },
                                { value: 'Referral', label: 'พี่เนแนะนำ' }
                            ].filter((v, i, a) => a.findIndex(t => (t.value === v.value)) === i)}
                            onAddItem={v => onAddNewOption('customerChannels', v)}
                        />
                    </div>

                    <FormTextarea
                        label="หมายเหตุเพิ่มเติม"
                        value={formData.note || ''}
                        onChange={v => handleChange('note', v)}
                        placeholder="หมายเหตุเพิ่มเติม..."
                    />
                </div>
            </div>
        </div>
    );
}
