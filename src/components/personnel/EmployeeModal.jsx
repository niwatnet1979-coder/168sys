import React, { useState, useEffect } from 'react';
import {
    X,
    User,
    Phone,
    MapPin,
    CreditCard,
    Plus,
    Trash2,
    Save,
    Briefcase,
    ShieldCheck,
    Smartphone,
    Globe,
    ChevronDown,
    Mail,
    Facebook,
    Instagram,
    Sparkles,
    Users
} from 'lucide-react';
import { saveEmployee } from '../../lib/v1/employeeManager';
import { showError, showSuccess, showConfirm } from '../../lib/sweetAlert';
import MagicPasteModal from '../customers/MagicPasteModal';

/**
 * EmployeeModal (Corrected V2.2)
 * เน้นโครงสร้างผู้ติดต่อและที่อยู่ให้ละเอียดเทียบเท่ามาตรฐานหน้า Customer
 */
export default function EmployeeModal({ isOpen, onClose, employee, teams, onSaveSuccess }) {
    const [activeTab, setActiveTab] = useState('basic');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        eid: 'EP-NEW',
        nickname: '',
        first_name: '',
        last_name: '',
        team_id: '',
        job_position: '',
        employment_type: 'พนักงานประจำ',
        pay_type: 'รายเดือน',
        pay_rate: 0,
        status: 'current',
        contacts: [{ id: Date.now(), name: 'เบอร์หลัก', phone: '', line: '', email: '', facebook: '', instagram: '', is_primary: true }],
        addresses: [{ id: Date.now(), label: 'ที่อยู่ปัจจุบัน', number: '', villageno: '', village: '', lane: '', road: '', subdistrict: '', district: '', province: '', zipcode: '', is_default: true }],
        bank_accounts: [{ id: Date.now(), bank_name: 'KBANK', account_number: '', account_name: '', is_default: true }]
    });

    const [isMagicPasteOpen, setIsMagicPasteOpen] = useState(false);
    const [magicPasteTarget, setMagicPasteTarget] = useState(null);

    const handleMagicPasteResult = (result) => {
        if (magicPasteTarget?.type === 'basic') {
            const n = result.name || '';
            const [first, ...rest] = n.split(' ');
            setFormData(prev => ({
                ...prev,
                nickname: prev.nickname || first,
                first_name: first || prev.first_name,
                last_name: rest.join(' ') || prev.last_name
            }));
        } else if (magicPasteTarget?.type === 'contact') {
            const { id } = magicPasteTarget;
            const contact = formData.contacts.find(c => c.id === id);
            updateListItem('contacts', id, 'ALL', {
                ...contact,
                name: result.name || contact.name,
                phone: result.phone || contact.phone,
                line: result.line || contact.line,
                email: result.email || contact.email
            });
        } else if (magicPasteTarget?.type === 'address') {
            const { id } = magicPasteTarget;
            const addr = formData.addresses.find(a => a.id === id);
            updateListItem('addresses', id, 'ALL', {
                ...addr,
                label: result.name || addr.label,
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
            });
        } else if (magicPasteTarget?.type === 'contact_new') {
            addListItem('contacts', {
                name: result.name || '',
                phone: result.phone || '',
                line: result.line || '',
                email: result.email || '',
                facebook: result.facebook || '',
                instagram: result.instagram || '',
                note: ''
            });
        } else if (magicPasteTarget?.type === 'address_new') {
            addListItem('addresses', {
                label: result.name || 'ที่อยู่ใหม่',
                number: result.number || '',
                villageno: result.villageno || '',
                village: result.village || '',
                lane: result.lane || '',
                road: result.road || '',
                subdistrict: result.subdistrict || '',
                district: result.district || '',
                province: result.province || '',
                zipcode: result.zipcode || '',
                maps: result.maps || '',
                is_default: false
            });
        }
    };

    useEffect(() => {
        if (isOpen) {
            if (employee) {
                setFormData({
                    ...employee,
                    contacts: employee.contacts?.length ? employee.contacts : [{ id: Date.now(), name: 'เบอร์หลัก', phone: '', line: '', email: '', facebook: '', instagram: '', is_primary: true }],
                    addresses: employee.addresses?.length ? employee.addresses : [{ id: Date.now(), label: 'ที่อยู่ปัจจุบัน', is_default: true }],
                    bank_accounts: employee.bank_accounts?.length ? employee.bank_accounts : [{ id: Date.now(), bank_name: 'KBANK', account_number: '', is_default: true }]
                });
            } else {
                setFormData({
                    id: null,
                    eid: 'EP-NEW',
                    nickname: '',
                    first_name: '',
                    last_name: '',
                    team_id: '',
                    job_position: '',
                    employment_type: 'พนักงานประจำ',
                    pay_type: 'รายเดือน',
                    pay_rate: 0,
                    status: 'current',
                    contacts: [{ id: Date.now(), name: 'เบอร์หลัก', phone: '', line: '', email: '', facebook: '', instagram: '', is_primary: true }],
                    addresses: [{ id: Date.now(), label: 'ที่อยู่ปัจจุบัน', number: '', villageno: '', village: '', lane: '', road: '', subdistrict: '', district: '', province: '', zipcode: '', maps: '', is_default: true }],
                    bank_accounts: [{ id: Date.now(), bank_name: 'KBANK', account_number: '', is_default: true }]
                });
            }
            setActiveTab('basic');
        }
    }, [isOpen, employee]);

    const handleSave = async () => {
        if (!formData.nickname) return showError('กรุณาระบุชื่อเล่นพนักงาน');
        setLoading(true);
        const res = await saveEmployee(formData);
        if (res.success) {
            showSuccess(formData.id ? 'อัปเดตข้อมูลสำเร็จ' : 'เพิ่มพนักงานใหม่สำเร็จ');
            onSaveSuccess();
            onClose();
        } else {
            showError('บันทึกไม่สำเร็จ: ' + res.error);
        }
        setLoading(false);
    };

    const updateListItem = (listName, id, field, value) => {
        setFormData(prev => ({
            ...prev,
            [listName]: prev[listName].map(item => item.id === id ? (field === 'ALL' ? value : { ...item, [field]: value }) : item)
        }));
    };

    const addListItem = (listName, defaultItem) => {
        setFormData(prev => ({
            ...prev,
            [listName]: [...prev[listName], { ...defaultItem, id: Date.now() }]
        }));
    };

    const removeListItem = async (listName, id) => {
        if (formData[listName].length <= 1) return showError('ต้องมีอย่างน้อย 1 รายการ');
        setFormData({ ...formData, [listName]: formData[listName].filter(i => i.id !== id) });
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 3000, padding: '20px'
        }}>
            <div style={{
                background: 'white', width: '100%', maxWidth: '680px',
                maxHeight: '90vh', borderRadius: '28px',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 40px 100px -20px rgba(0,0,0,0.25)',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div className="modal-header">
                    <div className="header-badge">
                        <User size={20} />
                    </div>
                    <div className="header-text">
                        <h2>{formData.id ? 'แก้ไขข้อมูลพนักงาน' : 'เพิ่มพนักงานใหม่'}</h2>
                        <p>{formData.eid} • {formData.nickname || 'รอกรอกชื่อเล่น'}</p>
                    </div>
                    <button className="close-x" onClick={onClose}><X size={20} /></button>
                </div>

                {/* Navbar */}
                <nav className="modal-nav">
                    {[
                        { id: 'basic', label: 'ข้อมูลทั่วไป', icon: User },
                        { id: 'contact', label: 'ผู้ติดต่อ', icon: Phone },
                        { id: 'address', label: 'ที่อยู่', icon: MapPin },
                        { id: 'bank', label: 'ธนาคาร', icon: CreditCard }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon size={18} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Body Content */}
                <div className="modal-body-wrapper">
                    {activeTab === 'basic' && (
                        <div className="form-stack" style={{ gap: '12px' }}>
                            <SectionTitle
                                icon={User}
                                text="ข้อมูลยืนยันตัวตน"
                                onMagicClick={() => { setMagicPasteTarget({ type: 'basic' }); setIsMagicPasteOpen(true); }}
                            />
                            <div className="grid-2">
                                <FormGroup placeholder="รหัสพนักงาน (Auto)" value={formData.eid} disabled readOnly />
                                <FormGroup placeholder="ชื่อเล่น *" value={formData.nickname} onChange={v => setFormData({ ...formData, nickname: v })} />
                            </div>
                            <div className="grid-2">
                                <FormGroup placeholder="ชื่อจริง" value={formData.first_name} onChange={v => setFormData({ ...formData, first_name: v })} />
                                <FormGroup placeholder="นามสกุล" value={formData.last_name} onChange={v => setFormData({ ...formData, last_name: v })} />
                            </div>

                            <SectionTitle icon={Briefcase} text="ข้อมูลการทำงาน" />
                            <div className="grid-2">
                                <FormGroup placeholder="ตำแหน่ง (เช่น ช่างติดตั้ง)" value={formData.job_position} onChange={v => setFormData({ ...formData, job_position: v })} />
                                <FormSelect
                                    value={formData.job_level || ''}
                                    onChange={v => setFormData({ ...formData, job_level: v })}
                                    options={[
                                        { value: '', label: 'เลือกระดับ (Level)' },
                                        { value: 'Staff', label: 'Staff' },
                                        { value: 'Senior', label: 'Senior' },
                                        { value: 'Leader', label: 'Leader' },
                                        { value: 'Manager', label: 'Manager' },
                                        { value: 'Director', label: 'Director' },
                                        { value: 'Executive', label: 'Executive' }
                                    ]}
                                />
                            </div>
                            <FormSelect
                                value={formData.team_id || ''}
                                onChange={v => setFormData({ ...formData, team_id: v })}
                                options={[
                                    { value: '', label: 'เลือกทีมสังกัด' },
                                    ...teams.map(t => ({ value: t.id, label: t.name }))
                                ]}
                            />
                            <div className="grid-2">
                                <div className="field-group">
                                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px', marginLeft: '4px', display: 'block' }}>วันเริ่มงาน</label>
                                    <FormGroup type="date" value={formData.start_date} onChange={v => setFormData({ ...formData, start_date: v })} />
                                </div>
                                <div className="field-group">
                                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px', marginLeft: '4px', display: 'block' }}>วันสิ้นสุด</label>
                                    <FormGroup type="date" value={formData.end_date} onChange={v => setFormData({ ...formData, end_date: v })} />
                                </div>
                            </div>
                            <div className="grid-2">
                                <FormSelect
                                    value={formData.employment_type}
                                    onChange={v => setFormData({ ...formData, employment_type: v })}
                                    options={[
                                        { value: 'พนักงานประจำ', label: 'ประเภทจ้าง: ประจำ' },
                                        { value: 'พนักงานชั่วคราว', label: 'ประเภทจ้าง: ชั่วคราว' }
                                    ]}
                                />
                                <FormSelect
                                    value={formData.pay_type}
                                    onChange={v => setFormData({ ...formData, pay_type: v })}
                                    options={[
                                        { value: 'รายเดือน', label: 'รูปแบบจ่าย: รายเดือน' },
                                        { value: 'รายวัน', label: 'รูปแบบจ่าย: รายวัน' }
                                    ]}
                                />
                            </div>
                            <div className="grid-2">
                                <FormGroup placeholder="อัตราค่าจ้าง (บาท)" type="number" value={formData.pay_rate} onChange={v => setFormData({ ...formData, pay_rate: v })} />
                                <FormGroup placeholder="ค่าคอมมิชชั่น (%)" type="number" value={formData.incentive_rate} onChange={v => setFormData({ ...formData, incentive_rate: v })} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'contact' && (
                        <div className="form-stack">
                            {formData.contacts.map((c, idx) => (
                                <div key={c.id} className="relational-set">
                                    <div className="set-header">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Users size={18} style={{ color: 'var(--primary-500)' }} />
                                            <span>ผู้ติดต่อ #{idx + 1}</span>
                                            <button
                                                className="magic-icon-btn"
                                                onClick={() => { setMagicPasteTarget({ type: 'contact', id: c.id }); setIsMagicPasteOpen(true); }}
                                                title="กรอกอัตโนมัติ (AI)"
                                            >
                                                <Sparkles size={14} />
                                            </button>
                                        </div>
                                        <button className="btn-del" onClick={() => removeListItem('contacts', c.id)}><Trash2 size={16} /></button>
                                    </div>
                                    <div className="grid-single">
                                        <FormGroup placeholder="ชื่อเรียก (เช่น เบอร์หลัก, เบอร์แม่)" value={c.name} onChange={v => updateListItem('contacts', c.id, 'name', v)} />
                                    </div>
                                    <div className="grid-2">
                                        <FormGroup icon={Smartphone} placeholder="เบอร์โทรศัพท์" value={c.phone || ''} onChange={v => updateListItem('contacts', c.id, 'phone', v)} />
                                        <FormGroup icon={Mail} placeholder="อีเมล (Email)" value={c.email || ''} onChange={v => updateListItem('contacts', c.id, 'email', v)} />
                                    </div>
                                    <div className="grid-2">
                                        <FormGroup icon={Globe} placeholder="Line ID" value={c.line || ''} onChange={v => updateListItem('contacts', c.id, 'line', v)} />
                                        <FormGroup icon={Facebook} placeholder="Facebook" value={c.facebook || ''} onChange={v => updateListItem('contacts', c.id, 'facebook', v)} />
                                    </div>
                                    <div className="grid-2">
                                        <FormGroup icon={Instagram} placeholder="Instagram" value={c.instagram || ''} onChange={v => updateListItem('contacts', c.id, 'instagram', v)} />
                                        <FormGroup placeholder="หมายเหตุ (ผู้ติดต่อ)" value={c.note || ''} onChange={v => updateListItem('contacts', c.id, 'note', v)} />
                                    </div>
                                </div>
                            ))}
                            <button className="btn-add-dashed" onClick={() => addListItem('contacts', { name: '', phone: '', line: '', email: '', facebook: '', instagram: '', note: '' })}>
                                <Plus size={18} /> <span>เพิ่มชุดข้อมูลผู้ติดต่อทางการ</span>
                            </button>
                        </div>
                    )}

                    {activeTab === 'address' && (
                        <div className="form-stack">
                            {formData.addresses.map((addr, idx) => (
                                <div key={addr.id} className="relational-set">
                                    <div className="set-header">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <MapPin size={18} style={{ color: 'var(--primary-500)' }} />
                                            <span>ที่อยู่ชุดที่ #{idx + 1}</span>
                                            <button
                                                className="magic-icon-btn"
                                                onClick={() => { setMagicPasteTarget({ type: 'address', id: addr.id }); setIsMagicPasteOpen(true); }}
                                                title="กรอกอัตโนมัติ (AI)"
                                            >
                                                <Sparkles size={14} />
                                            </button>
                                        </div>
                                        <button className="btn-del" onClick={() => removeListItem('addresses', addr.id)}><Trash2 size={16} /></button>
                                    </div>
                                    <div className="grid-single">
                                        <FormGroup placeholder="ป้ายชื่อ (เช่น ตามทะเบียนบ้าน, ที่อยู่ปัจจุบัน)" value={addr.label || ''} onChange={v => updateListItem('addresses', addr.id, 'label', v)} />
                                    </div>
                                    <div className="grid-2">
                                        <FormGroup placeholder="เลขที่" value={addr.number || ''} onChange={v => updateListItem('addresses', addr.id, 'number', v)} />
                                        <FormGroup placeholder="หมู่ที่" value={addr.villageno || ''} onChange={v => updateListItem('addresses', addr.id, 'villageno', v)} />
                                    </div>
                                    <div className="grid-single">
                                        <FormGroup placeholder="หมู่บ้าน / อาคาร" value={addr.village || ''} onChange={v => updateListItem('addresses', addr.id, 'village', v)} />
                                    </div>
                                    <div className="grid-2">
                                        <FormGroup placeholder="ซอย" value={addr.lane || ''} onChange={v => updateListItem('addresses', addr.id, 'lane', v)} />
                                        <FormGroup placeholder="ถนน" value={addr.road || ''} onChange={v => updateListItem('addresses', addr.id, 'road', v)} />
                                    </div>
                                    <div className="grid-2">
                                        <FormGroup placeholder="แขวง/ตำบล" value={addr.subdistrict || ''} onChange={v => updateListItem('addresses', addr.id, 'subdistrict', v)} />
                                        <FormGroup placeholder="เขต/อำเภอ" value={addr.district || ''} onChange={v => updateListItem('addresses', addr.id, 'district', v)} />
                                    </div>
                                    <div className="grid-2">
                                        <FormGroup placeholder="จังหวัด" value={addr.province || ''} onChange={v => updateListItem('addresses', addr.id, 'province', v)} />
                                        <FormGroup placeholder="รหัสไปรษณีย์" value={addr.zipcode || ''} onChange={v => updateListItem('addresses', addr.id, 'zipcode', v)} />
                                    </div>
                                    <div className="grid-single">
                                        <FormGroup icon={Globe} placeholder="Link Google Maps (ถ้ามี)" value={addr.maps || ''} onChange={v => updateListItem('addresses', addr.id, 'maps', v)} />
                                    </div>
                                </div>
                            ))}
                            <button className="btn-add-dashed" onClick={() => addListItem('addresses', { label: '', number: '', villageno: '', village: '', lane: '', road: '', subdistrict: '', district: '', province: '', zipcode: '', maps: '', is_default: false })}>
                                <Plus size={18} /> <span>เพิ่มชุดที่อยู่อื่นๆ</span>
                            </button>
                        </div>
                    )}

                    {activeTab === 'bank' && (
                        <div className="form-stack" style={{ gap: '12px' }}>
                            {formData.bank_accounts.map((bank, idx) => (
                                <div key={bank.id} className="relational-set">
                                    <div className="set-header">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <CreditCard size={18} style={{ color: 'var(--primary-500)' }} />
                                            <span>บัญชีชุดที่ #{idx + 1}</span>
                                            <button
                                                className="magic-icon-btn"
                                                onClick={() => { setMagicPasteTarget({ type: 'bank', id: bank.id }); setIsMagicPasteOpen(true); }}
                                                title="กรอกอัตโนมัติ (AI)"
                                            >
                                                <Sparkles size={14} />
                                            </button>
                                        </div>
                                        <button className="btn-del" onClick={() => removeListItem('bank_accounts', bank.id)}><Trash2 size={16} /></button>
                                    </div>
                                    <div className="grid-2">
                                        <FormSelect
                                            value={bank.bank_name}
                                            onChange={v => updateListItem('bank_accounts', bank.id, 'bank_name', v)}
                                            options={[
                                                { value: 'KBANK', label: 'ธนาคารกสิกรไทย' },
                                                { value: 'SCB', label: 'ธนาคารไทยพาณิชย์' },
                                                { value: 'BBL', label: 'ธนาคารกรุงเทพ' },
                                                { value: 'KTB', label: 'ธนาคารกรุงไทย' },
                                                { value: 'TTB', label: 'ธนาคารทหารไทยธนชาต' }
                                            ]}
                                        />
                                        <FormGroup placeholder="เลขที่บัญชี" value={bank.account_number} onChange={v => updateListItem('bank_accounts', bank.id, 'account_number', v)} />
                                    </div>
                                    <FormGroup placeholder="ชื่อเจ้าของบัญชี" value={bank.account_name} onChange={v => updateListItem('bank_accounts', bank.id, 'account_name', v)} />
                                </div>
                            ))}
                            <button className="btn-add-dashed" onClick={() => addListItem('bank_accounts', { bank_name: 'KBANK', account_number: '', account_name: '', is_default: false })}>
                                <Plus size={18} /> <span>เพิ่มบัญชีธนาคาร</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onClose} disabled={loading}>ยกเลิก</button>
                    <button className="button-primary" onClick={handleSave} disabled={loading} style={{ flex: 2, padding: '14px', justifyContent: 'center' }}>
                        {loading ? <span className="spinner" /> : <Save size={20} />}
                        <span>{loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูลพนักงาน'}</span>
                    </button>
                </div>

                <MagicPasteModal
                    isOpen={isMagicPasteOpen}
                    onClose={() => setIsMagicPasteOpen(false)}
                    onParse={(res) => {
                        handleMagicPasteResult(res);
                        setIsMagicPasteOpen(false);
                    }}
                />

                <style jsx>{`
                    .modal-header {
                        padding: 20px 24px; background: white;
                        border-bottom: 1px solid var(--border-color);
                        display: flex; align-items: center; gap: 16px;
                    }
                    .header-badge {
                        padding: 10px; background: var(--primary-100);
                        color: var(--primary-600); border-radius: 12px;
                        display: flex; align-items: center; justify-content: center;
                    }
                    .header-text h2 { font-size: 1.25rem; font-weight: 700; color: #1e293b; margin: 0; }
                    .header-text p { font-size: 13px; color: #64748b; margin: 0; }
                    .close-x { margin-left: auto; background: #f1f5f9; border: none; padding: 8px; border-radius: 50%; cursor: pointer; color: #94a3b8; }

                    .modal-nav {
                        display: flex; padding: 0 24px; border-bottom: 1px solid var(--border-color);
                        background: white;
                    }
                    .nav-item {
                        display: flex; flex-direction: column; align-items: center; justify-content: center;
                        padding: 12px 8px; gap: 4px; border: none; background: none; flex: 1;
                        color: #94a3b8; font-size: 12px; font-weight: 600; cursor: pointer;
                        transition: 0.2s; border-bottom: 2px solid transparent;
                    }
                    .nav-item.active { color: var(--primary-600); border-bottom-color: var(--primary-600); background: var(--primary-50); }
                    .nav-item:hover:not(.active) { background: #f8fafc; color: #64748b; }

                    .modal-body-wrapper { flex: 1; overflow-y: auto; padding: 24px; background: white; }
                    .form-stack { display: flex; flex-direction: column; gap: 24px; }

                    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
                    .grid-single { display: flex; flex-direction: column; gap: 12px; }

                    .field-group { display: flex; flex-direction: column; flex: 1; }
                    .field-group label { display: none; } /* Rule #71: In-field Labeling */

                    .select-field {
                        /* Inherit from global.css select-field */
                    }

                    .relational-set {
                        padding: 20px; background: white; border-radius: 20px;
                        border: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 12px;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                    }
                    .set-header { display: flex; justify-content: space-between; align-items: center; font-weight: 700; font-size: 15px; color: #475569; }
                    .btn-del { color: #fda4af; background: none; border: none; cursor: pointer; transition: 0.2s; }
                    .btn-del:hover { color: #fb7185; transform: scale(1.1); }

                    .btn-add-dashed {
                        height: 52px; border: 2.5px dashed #e2e8f0; border-radius: 18px;
                        background: none; color: #94a3b8; font-weight: 800; font-size: var(--font-body);
                        display: flex; align-items: center; justify-content: center; gap: 10px;
                        transition: 0.2s; cursor: pointer;
                    }
                    .btn-add-dashed:hover { border-color: var(--primary-300); background: var(--primary-50); color: var(--primary-600); }

                    :global(.magic-icon-btn) {
                        display: flex; align-items: center; justify-content: center;
                        width: 24px; height: 24px; border-radius: 50%;
                        background: var(--primary-50); color: var(--primary-600);
                        border: none; cursor: pointer; transition: all 0.2s; flex-shrink: 0;
                    }
                    :global(.magic-icon-btn:hover) { background: var(--primary-100); transform: scale(1.1); box-shadow: 0 0 12px var(--primary-200); }

                    .modal-actions {
                        padding: 24px; border-top: 1px solid var(--border-color);
                        background: #f8fafc; display: flex; align-items: center; gap: 12px;
                    }
                    .btn-cancel {
                        flex: 1; padding: 14px; background: white; border: 1px solid #e2e8f0;
                        border-radius: 14px; font-weight: 600; color: #64748b; cursor: pointer;
                    }
                    .btn-cancel:hover { background: #f8fafc; }
                `}</style>
            </div>
        </div>
    );

    function SectionTitle({ icon: Icon, text, onMagicClick }) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={18} color="var(--primary-500)" />
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#475569' }}>{text}</span>
                    {onMagicClick && (
                        <button className="magic-icon-btn" onClick={onMagicClick} title="กรอกอัตโนมัติ (AI)">
                            <Sparkles size={14} />
                        </button>
                    )}
                </div>
            </div>
        );
    }

    function FormGroup({ label, value, onChange, placeholder, type = 'text', icon: Icon, disabled, readOnly }) {
        return (
            <div className="field-group" style={{ position: 'relative' }}>
                {Icon && (
                    <Icon
                        size={16}
                        style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#94a3b8',
                            pointerEvents: 'none',
                            zIndex: 1
                        }}
                    />
                )}
                <input
                    className="input-field"
                    type={type}
                    value={value || ''}
                    onChange={e => onChange?.(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    style={{ paddingLeft: Icon ? '38px' : '12px' }}
                />
            </div>
        );
    }

    function FormSelect({ value, onChange, options, icon: Icon }) {
        return (
            <div className="field-group" style={{ position: 'relative' }}>
                {Icon && (
                    <Icon
                        size={16}
                        style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#94a3b8',
                            pointerEvents: 'none',
                            zIndex: 1
                        }}
                    />
                )}
                <select
                    className="select-field"
                    value={value}
                    onChange={e => onChange?.(e.target.value)}
                    style={{ paddingLeft: Icon ? '38px' : '12px' }}
                >
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        );
    }
}
