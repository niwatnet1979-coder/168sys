import React from 'react';
import {
    User,
    FileText,
    Briefcase,
    ShieldCheck,
    Sparkles,
    Phone,
    Mail,
    MessageCircle,
    Facebook
} from 'lucide-react';
import DynamicSelect from '../../common/DynamicSelect';
import FormInput from '../../common/FormInput';
import { BasicInfoTabProps } from './types';

/**
 * BasicInfoTab - ข้อมูลทั่วไป Tab
 * Contains employee identification and work information.
 * Updated to match CustomerModal card-style layout.
 */
export default function BasicInfoTab({
    formData,
    setFormData,
    teams,
    systemOptions,
    onAddNewOption,
    onAddNewTeam,
    onOpenMagicPaste
}: BasicInfoTabProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Section 1: ข้อมูลยืนยันตัวตน */}
            <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShieldCheck size={18} style={{ color: 'var(--primary-500)' }} />
                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#475569' }}>ข้อมูลยืนยันตัวตน</span>
                        <button
                            className="magic-icon-btn"
                            onClick={() => onOpenMagicPaste('basic')}
                            title="กรอกอัตโนมัติ (AI)"
                        >
                            <Sparkles size={14} />
                        </button>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <FormInput
                            label="รหัสพนักงาน"
                            value={formData.eid}
                            disabled
                            readOnly
                            icon={FileText}
                            placeholder="รหัสพนักงาน"
                        />
                        <FormInput
                            label="ชื่อเล่น"
                            value={formData.nickname}
                            onChange={v => setFormData(prev => ({ ...prev, nickname: v }))}
                            placeholder="ชื่อเล่น *"
                            icon={User}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <FormInput
                            label="ชื่อจริง"
                            value={formData.first_name}
                            onChange={v => setFormData(prev => ({ ...prev, first_name: v }))}
                            placeholder="ชื่อจริง"
                            icon={User}
                        />
                        <FormInput
                            label="นามสกุล"
                            value={formData.last_name}
                            onChange={v => setFormData(prev => ({ ...prev, last_name: v }))}
                            placeholder="นามสกุล"
                            icon={User}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <FormInput
                            label="เลขประจำตัวประชาชน"
                            value={formData.citizen_id}
                            onChange={v => setFormData(prev => ({ ...prev, citizen_id: v }))}
                            placeholder="เลขประจำตัวประชาชน"
                            icon={ShieldCheck}
                        />
                        <FormInput
                            label="วันเกิด"
                            type="date"
                            value={formData.birth_date}
                            onChange={v => setFormData(prev => ({ ...prev, birth_date: v }))}
                            icon={FileText}
                        />
                    </div>

                    {/* Contact Fields linked to Primary Contact */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <FormInput
                            label="เบอร์โทรศัพท์"
                            value={(() => {
                                const primary = formData.contacts?.find((c: any) => c.is_primary) || formData.contacts?.[0];
                                return primary?.phone || '';
                            })()}
                            onChange={v => {
                                setFormData(prev => {
                                    const contacts = [...(prev.contacts || [])];
                                    const idx = contacts.findIndex((c: any) => c.is_primary);
                                    if (idx >= 0) {
                                        contacts[idx] = { ...contacts[idx], phone: v };
                                    } else if (contacts.length > 0) {
                                        contacts[0] = { ...contacts[0], phone: v, is_primary: true };
                                    } else {
                                        contacts.push({ id: Date.now(), name: 'Main', phone: v, is_primary: true } as any);
                                    }
                                    return { ...prev, contacts };
                                });
                            }}
                            placeholder="08x-xxx-xxxx"
                            icon={Phone}
                        />
                        <FormInput
                            label="อีเมล"
                            value={(() => {
                                const primary = formData.contacts?.find((c: any) => c.is_primary) || formData.contacts?.[0];
                                return primary?.email || '';
                            })()}
                            onChange={v => {
                                setFormData(prev => {
                                    const contacts = [...(prev.contacts || [])];
                                    const idx = contacts.findIndex((c: any) => c.is_primary);
                                    if (idx >= 0) {
                                        contacts[idx] = { ...contacts[idx], email: v };
                                    } else if (contacts.length > 0) {
                                        contacts[0] = { ...contacts[0], email: v, is_primary: true };
                                    } else {
                                        contacts.push({ id: Date.now(), name: 'Main', email: v, is_primary: true } as any);
                                    }
                                    return { ...prev, contacts };
                                });
                            }}
                            placeholder="email@example.com"
                            icon={Mail}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <FormInput
                            label="Line ID"
                            value={(() => {
                                const primary = formData.contacts?.find((c: any) => c.is_primary) || formData.contacts?.[0];
                                return primary?.line || '';
                            })()}
                            onChange={v => {
                                setFormData(prev => {
                                    const contacts = [...(prev.contacts || [])];
                                    const idx = contacts.findIndex((c: any) => c.is_primary);
                                    if (idx >= 0) {
                                        contacts[idx] = { ...contacts[idx], line: v };
                                    } else if (contacts.length > 0) {
                                        contacts[0] = { ...contacts[0], line: v, is_primary: true };
                                    } else {
                                        contacts.push({ id: Date.now(), name: 'Main', line: v, is_primary: true } as any);
                                    }
                                    return { ...prev, contacts };
                                });
                            }}
                            placeholder="Line ID"
                            icon={MessageCircle}
                        />
                        <FormInput
                            label="Facebook"
                            value={(() => {
                                const primary = formData.contacts?.find((c: any) => c.is_primary) || formData.contacts?.[0];
                                return primary?.facebook || '';
                            })()}
                            onChange={v => {
                                setFormData(prev => {
                                    const contacts = [...(prev.contacts || [])];
                                    const idx = contacts.findIndex((c: any) => c.is_primary);
                                    if (idx >= 0) {
                                        contacts[idx] = { ...contacts[idx], facebook: v };
                                    } else if (contacts.length > 0) {
                                        contacts[0] = { ...contacts[0], facebook: v, is_primary: true };
                                    } else {
                                        contacts.push({ id: Date.now(), name: 'Main', facebook: v, is_primary: true } as any);
                                    }
                                    return { ...prev, contacts };
                                });
                            }}
                            placeholder="Facebook Profile"
                            icon={Facebook}
                        />
                    </div>
                </div>
            </div>

            {/* Section 2: ข้อมูลการทำงาน */}
            <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <Briefcase size={18} style={{ color: 'var(--primary-500)' }} />
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#475569' }}>ข้อมูลการทำงาน</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <DynamicSelect
                            label="ตำแหน่ง"
                            placeholder="เลือกหรือพิมพ์เพิ่ม..."
                            value={formData.job_position}
                            onChange={v => setFormData(prev => ({ ...prev, job_position: String(v) }))}
                            options={systemOptions.jobPositions || []}
                            onAddItem={v => onAddNewOption('jobPositions', v)}
                        />
                        <DynamicSelect
                            label="ระดับ (Level)"
                            placeholder="เลือกระดับ..."
                            value={formData.job_level}
                            onChange={v => setFormData(prev => ({ ...prev, job_level: String(v) }))}
                            options={systemOptions.jobLevels || []}
                            onAddItem={v => onAddNewOption('jobLevels', v)}
                        />
                    </div>
                    <DynamicSelect
                        label="เลือกทีมสังกัด"
                        placeholder="เลือกหรือพิมพ์ชื่อทีมใหม่..."
                        value={formData.team_id}
                        onChange={v => setFormData(prev => ({ ...prev, team_id: String(v) }))}
                        options={(teams || []).map(t => ({ value: t.id, label: t.name }))}
                        onAddItem={onAddNewTeam}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <FormInput
                            label="วันเริ่มงาน"
                            type="date"
                            value={formData.start_date}
                            onChange={v => setFormData(prev => ({ ...prev, start_date: v }))}
                            icon={FileText}
                        />
                        <FormInput
                            label="วันสิ้นสุด"
                            type="date"
                            value={formData.end_date}
                            onChange={v => setFormData(prev => ({ ...prev, end_date: v }))}
                            icon={FileText}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <DynamicSelect
                            label="ประเภทจ้าง"
                            placeholder="เลือกประเภท..."
                            value={formData.employment_type}
                            onChange={v => setFormData(prev => ({ ...prev, employment_type: String(v) }))}
                            options={systemOptions.employmentTypes || []}
                            onAddItem={v => onAddNewOption('employmentTypes', v)}
                        />
                        <DynamicSelect
                            label="รูปแบบจ่าย"
                            placeholder="เลือกรูปแบบ..."
                            value={formData.pay_type}
                            onChange={v => setFormData(prev => ({ ...prev, pay_type: String(v) }))}
                            options={systemOptions.paymentTypes || []}
                            onAddItem={v => onAddNewOption('paymentTypes', v)}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <DynamicSelect
                            label="อัตราค่าจ้าง"
                            placeholder="0.00"
                            value={formData.pay_rate}
                            onChange={v => setFormData(prev => ({ ...prev, pay_rate: v === '' ? '' : v }))}
                            options={systemOptions.payRates || []}
                            onAddItem={v => onAddNewOption('payRates', v)}
                        />
                        <DynamicSelect
                            label="ค่าคอมมิชชัน (%)"
                            placeholder="Commission %"
                            value={formData.incentive_rate}
                            onChange={v => setFormData(prev => ({ ...prev, incentive_rate: v === '' ? '' : v }))}
                            options={systemOptions.incentiveRates || []}
                            onAddItem={v => onAddNewOption('incentiveRates', v)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
