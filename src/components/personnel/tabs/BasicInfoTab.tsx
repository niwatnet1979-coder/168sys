import React from 'react';
import {
    User,
    FileText,
    Briefcase,
    ShieldCheck,
    Sparkles
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
                        <div>
                            <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '4px', display: 'block' }}>วันเริ่มงาน</label>
                            <FormInput
                                type="date"
                                value={formData.start_date}
                                onChange={v => setFormData(prev => ({ ...prev, start_date: v }))}
                                icon={FileText}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '4px', display: 'block' }}>วันสิ้นสุด</label>
                            <FormInput
                                type="date"
                                value={formData.end_date}
                                onChange={v => setFormData(prev => ({ ...prev, end_date: v }))}
                                icon={FileText}
                            />
                        </div>
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
                            onChange={v => setFormData(prev => ({ ...prev, pay_rate: Number(v) || 0 }))}
                            options={systemOptions.payRates || []}
                            onAddItem={v => onAddNewOption('payRates', v)}
                        />
                        <DynamicSelect
                            label="ค่าคอมมิชชัน (%)"
                            placeholder="Commission %"
                            value={formData.incentive_rate}
                            onChange={v => setFormData(prev => ({ ...prev, incentive_rate: Number(v) || 0 }))}
                            options={systemOptions.incentiveRates || []}
                            onAddItem={v => onAddNewOption('incentiveRates', v)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
