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
    Users,
    FileText,
    Upload,
    MessageSquare,
    AlignLeft
} from 'lucide-react';
import { saveEmployee } from '../../lib/v1/employeeManager';
import { getSettings, syncSystemOptions } from '../../lib/v1/settingManager';
import { showError, showSuccess, showConfirm } from '../../lib/sweetAlert';
import MagicPasteModal from '../customers/MagicPasteModal';
import { supabase } from '../../lib/supabase';
import DynamicSelect from '../common/DynamicSelect';
import FormInput from '../common/FormInput';

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
        bank_accounts: [{ id: Date.now(), bank_name: 'KBANK', account_number: '', account_name: '', is_default: true }],
        bank_accounts: [{ id: Date.now(), bank_name: 'KBANK', account_number: '', account_name: '', is_default: true }],
        documents: []
    });

    const [systemOptions, setSystemOptions] = useState({});

    // Fetch System Options on Mount
    useEffect(() => {
        const fetchOptions = async () => {
            const settings = await getSettings();
            if (settings?.systemOptions) {
                setSystemOptions(settings.systemOptions);
            }
        };
        fetchOptions();
    }, []);

    const handleAddNewOption = async (category, newValue) => {
        if (!newValue) return;
        const currentList = systemOptions[category] || [];
        // Check duplicate
        if (currentList.some(item => item.value === newValue)) return;

        const updatedList = [...currentList, { value: newValue, label: newValue }];

        // Optimistic Update
        setSystemOptions(prev => ({ ...prev, [category]: updatedList }));

        // Sync to Backend
        await syncSystemOptions(category, updatedList.map(item => item.value));
    };

    const [isMagicPasteOpen, setIsMagicPasteOpen] = useState(false);
    const [magicPasteTarget, setMagicPasteTarget] = useState(null);

    const handleAddNewTeam = async (name) => {
        if (!name) return;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user;
            const { data, error } = await supabase.from('teams').insert({
                name,
                team_type: 'General',
                status: 'active',
                created_by: user?.id
            }).select().single();

            if (error) throw error;

            await onSaveSuccess?.();
            setFormData(prev => ({ ...prev, team_id: data.id }));

        } catch (err) {
            console.error(err);
            showError('ไม่สามารถสร้างทีมได้');
        }
    };

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
                    bank_accounts: employee.bank_accounts?.length ? employee.bank_accounts : [{ id: Date.now(), bank_name: 'KBANK', account_number: '', is_default: true }],
                    documents: employee.documents || []
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
                    bank_accounts: [{ id: Date.now(), bank_name: 'KBANK', account_number: '', is_default: true }],
                    documents: []
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
        if (formData[listName].length <= 1 && (listName === 'contacts' || listName === 'addresses' || listName === 'bank_accounts')) return showError('ต้องมีอย่างน้อย 1 รายการ');
        setFormData({ ...formData, [listName]: formData[listName].filter(i => i.id !== id) });
    };

    if (!isOpen) return null;

    const handleFileSelect = (id, e) => {
        const file = e.target.files[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            updateListItem('documents', id, 'ALL', {
                ...formData.documents.find(d => d.id === id),
                file_url: fileUrl,
                file_name: file.name,
                file_obj: file
            });
        }
    };

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
                        <User size={24} color="white" />
                    </div>
                    <div className="header-text">
                        <h2>{employee ? 'แก้ไขข้อมูลพนักงาน' : 'เพิ่มพนักงานใหม่'}</h2>
                        <span>{formData.eid || '...'} • {formData.nickname || '...'}</span>
                    </div>
                    <button onClick={onClose} className="btn-close"><X size={24} /></button>
                </div>

                {/* Tabs */}
                <div className="tabs-container">
                    {[
                        { id: 'basic', label: 'ข้อมูลทั่วไป', icon: User },
                        { id: 'contact', label: 'ผู้ติดต่อ', icon: Users },
                        { id: 'address', label: 'ที่อยู่', icon: MapPin },
                        { id: 'bank', label: 'ธนาคาร', icon: CreditCard },
                        { id: 'documents', label: 'เอกสาร', icon: FileText }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        >
                            <tab.icon size={18} strokeWidth={2.5} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="modal-body">
                    {activeTab === 'basic' && (
                        <div className="form-stack">
                            <SectionTitle icon={ShieldCheck} text="ข้อมูลยืนยันตัวตน" onMagicClick={() => { setMagicPasteTarget({ type: 'basic' }); setIsMagicPasteOpen(true); }} />
                            <div className="row-2">
                                <FormInput label="รหัสพนักงาน" value={formData.eid} disabled readOnly icon={FileText} />
                                <FormInput label="ชื่อเล่น" value={formData.nickname} onChange={v => setFormData({ ...formData, nickname: v })} placeholder="ชื่อเล่น" icon={User} />
                            </div>
                            <div className="row-2">
                                <FormInput label="ชื่อจริง" value={formData.first_name} onChange={v => setFormData({ ...formData, first_name: v })} placeholder="ชื่อจริง" icon={User} />
                                <FormInput label="นามสกุล" value={formData.last_name} onChange={v => setFormData({ ...formData, last_name: v })} placeholder="นามสกุล" icon={User} />
                            </div>

                            <SectionTitle icon={Briefcase} text="ข้อมูลการทำงาน" />
                            <div className="row-2">
                                <DynamicSelect
                                    label="ตำแหน่ง"
                                    placeholder="เลือกหรือพิมพ์เพิ่ม..."
                                    value={formData.job_position}
                                    onChange={v => setFormData({ ...formData, job_position: v })}
                                    options={systemOptions.jobPositions || []}
                                    onAddItem={v => handleAddNewOption('jobPositions', v)}
                                />
                                <DynamicSelect
                                    label="ระดับ (Level)"
                                    placeholder="เลือกระดับ..."
                                    value={formData.job_level}
                                    onChange={v => setFormData({ ...formData, job_level: v })}
                                    options={systemOptions.jobLevels || []}
                                    onAddItem={v => handleAddNewOption('jobLevels', v)}
                                />
                            </div>
                            <DynamicSelect
                                label="เลือกทีมสังกัด"
                                placeholder="เลือกหรือพิมพ์ชื่อทีมใหม่..."
                                value={formData.team_id}
                                onChange={v => setFormData({ ...formData, team_id: v })}
                                options={(teams || []).map(t => ({ value: t.id, label: t.name }))}
                                onAddItem={handleAddNewTeam}
                            />
                            <div className="row-2">
                                <div className="field-group">
                                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px', marginLeft: '4px', display: 'block' }}>วันเริ่มงาน</label>
                                    <FormInput type="date" value={formData.start_date} onChange={v => setFormData({ ...formData, start_date: v })} icon={FileText} />
                                </div>
                                <div className="field-group">
                                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px', marginLeft: '4px', display: 'block' }}>วันสิ้นสุด</label>
                                    <FormInput type="date" value={formData.end_date} onChange={v => setFormData({ ...formData, end_date: v })} icon={FileText} />
                                </div>
                            </div>

                            <div className="row-2">
                                <DynamicSelect
                                    label="ประเภทจ้าง"
                                    placeholder="เลือกประเภท..."
                                    value={formData.employment_type}
                                    onChange={v => setFormData({ ...formData, employment_type: v })}
                                    options={systemOptions.employmentTypes || []}
                                    onAddItem={v => handleAddNewOption('employmentTypes', v)}
                                />
                                <DynamicSelect
                                    label="รูปแบบจ่าย"
                                    placeholder="เลือกรูปแบบ..."
                                    value={formData.pay_type}
                                    onChange={v => setFormData({ ...formData, pay_type: v })}
                                    options={systemOptions.paymentTypes || []}
                                    onAddItem={v => handleAddNewOption('paymentTypes', v)}
                                />
                            </div>
                            <div className="row-2">
                                <DynamicSelect
                                    label="อัตราค่าจ้าง"
                                    placeholder="0.00"
                                    value={formData.pay_rate}
                                    onChange={v => setFormData({ ...formData, pay_rate: v })}
                                    options={systemOptions.payRates || []}
                                    onAddItem={v => handleAddNewOption('payRates', v)}
                                />
                                <DynamicSelect
                                    label="ค่าคอมมิชชัน (%)"
                                    placeholder="Commission %"
                                    value={formData.incentive_rate}
                                    onChange={v => setFormData({ ...formData, incentive_rate: v })}
                                    options={systemOptions.incentiveRates || []}
                                    onAddItem={v => handleAddNewOption('incentiveRates', v)}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'contact' && (
                        <div className="form-stack">
                            <div className="set-header">
                                <span style={{ color: 'var(--primary-600)' }}>Contact Set #1</span>
                            </div>
                            {formData.contacts.map((contact, idx) => (
                                <div key={contact.id} className="relational-set">
                                    <div className="set-header">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Users size={18} color="var(--primary-500)" />
                                            <span>ผู้ติดต่อ #{idx + 1}</span>
                                            <button className="magic-icon-btn" onClick={() => { setMagicPasteTarget({ type: 'contact', id: contact.id }); setIsMagicPasteOpen(true); }}>
                                                <Sparkles size={14} />
                                            </button>
                                        </div>
                                        <button className="btn-del" onClick={() => removeListItem('contacts', contact.id)}><Trash2 size={16} /></button>
                                    </div>
                                    <FormInput icon={User} placeholder="ชื่อ-นามสกุล" value={contact.name} onChange={v => updateListItem('contacts', contact.id, 'name', v)} />
                                    <div className="row-2">
                                        <FormInput icon={Phone} placeholder="เบอร์โทรศัพท์" value={contact.phone} onChange={v => updateListItem('contacts', contact.id, 'phone', v)} />
                                        <FormInput icon={Mail} placeholder="อีเมล" value={contact.email} onChange={v => updateListItem('contacts', contact.id, 'email', v)} />
                                    </div>
                                    <div className="row-2">
                                        <FormInput icon={MessageSquare} placeholder="Line ID" value={contact.line} onChange={v => updateListItem('contacts', contact.id, 'line', v)} />
                                        <FormInput icon={Facebook} placeholder="Facebook" value={contact.facebook} onChange={v => updateListItem('contacts', contact.id, 'facebook', v)} />
                                    </div>
                                    <FormInput icon={AlignLeft} placeholder="หมายเหตุ" value={contact.note} onChange={v => updateListItem('contacts', contact.id, 'note', v)} />
                                </div>
                            ))}
                            <button className="btn-add-dashed" onClick={() => addListItem('contacts', { name: '', phone: '', line: '', email: '', facebook: '', instagram: '', note: '', is_primary: false })}>
                                <Plus size={18} /> เพิ่มผู้ติดต่อ
                            </button>
                        </div>
                    )}

                    {activeTab === 'address' && (
                        <div className="form-stack">
                            {formData.addresses.map((addr, idx) => (
                                <div key={addr.id} className="relational-set">
                                    <div className="set-header">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <MapPin size={18} color="var(--primary-500)" />
                                            <span>ที่อยู่ #{idx + 1}</span>
                                            <button className="magic-icon-btn" onClick={() => { setMagicPasteTarget({ type: 'address', id: addr.id }); setIsMagicPasteOpen(true); }}>
                                                <Sparkles size={14} />
                                            </button>
                                            {addr.is_default && <span style={{ fontSize: '10px', background: 'var(--primary-500)', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>MAIN</span>}
                                        </div>
                                        <button className="btn-del" onClick={() => removeListItem('addresses', addr.id)}><Trash2 size={16} /></button>
                                    </div>
                                    <FormInput placeholder="ป้ายชื่อ (เช่น บ้าน, หอพัก)" value={addr.label} onChange={v => updateListItem('addresses', addr.id, 'label', v)} icon={MapPin} />
                                    <div className="row-2">
                                        <FormInput placeholder="เลขที่" value={addr.number} onChange={v => updateListItem('addresses', addr.id, 'number', v)} icon={MapPin} />
                                        <FormInput placeholder="หมู่ที่" value={addr.villageno} onChange={v => updateListItem('addresses', addr.id, 'villageno', v)} icon={MapPin} />
                                    </div>
                                    <FormInput placeholder="หมู่บ้าน / อาคาร" value={addr.village} onChange={v => updateListItem('addresses', addr.id, 'village', v)} icon={MapPin} />
                                    <div className="row-2">
                                        <FormInput placeholder="ซอย" value={addr.lane} onChange={v => updateListItem('addresses', addr.id, 'lane', v)} icon={MapPin} />
                                        <FormInput placeholder="ถนน" value={addr.road} onChange={v => updateListItem('addresses', addr.id, 'road', v)} icon={MapPin} />
                                    </div>
                                    <div className="row-2">
                                        <FormInput placeholder="ตำบล / แขวง" value={addr.subdistrict} onChange={v => updateListItem('addresses', addr.id, 'subdistrict', v)} icon={MapPin} />
                                        <FormInput placeholder="อำเภอ / เขต" value={addr.district} onChange={v => updateListItem('addresses', addr.id, 'district', v)} icon={MapPin} />
                                    </div>
                                    <div className="row-2">
                                        <FormInput placeholder="จังหวัด" value={addr.province} onChange={v => updateListItem('addresses', addr.id, 'province', v)} icon={MapPin} />
                                        <FormInput placeholder="รหัสไปรษณีย์" value={addr.zipcode} onChange={v => updateListItem('addresses', addr.id, 'zipcode', v)} icon={MapPin} />
                                    </div>
                                    <FormInput icon={Globe} placeholder="Google Maps Link" value={addr.maps} onChange={v => updateListItem('addresses', addr.id, 'maps', v)} />
                                </div>
                            ))}
                            <button className="btn-add-dashed" onClick={() => addListItem('addresses', { label: 'ที่อยู่เพิ่มเติม', number: '', villageno: '', village: '', lane: '', road: '', subdistrict: '', district: '', province: '', zipcode: '', maps: '', is_default: false })}>
                                <Plus size={18} /> เพิ่มที่อยู่
                            </button>
                        </div>
                    )}

                    {activeTab === 'bank' && (
                        <div className="form-stack">
                            <div className="set-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CreditCard size={18} color="var(--primary-600)" />
                                    <span style={{ color: 'var(--primary-600)' }}>Bank Accounts</span>
                                </div>
                                <button className="magic-icon-btn" title="กรอกอัตโนมัติ (AI)" onClick={() => { setMagicPasteTarget({ type: 'bank', id: formData.bank_accounts[0]?.id }); setIsMagicPasteOpen(true); }} >
                                    <Sparkles size={14} />
                                </button>
                            </div>
                            {formData.bank_accounts.map((bank, idx) => (
                                <div key={bank.id} className="relational-set">
                                    <div className="set-header">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <CreditCard size={18} color="var(--primary-500)" />
                                            <span>บัญชี #{idx + 1}</span>
                                            {bank.is_default && <span style={{ fontSize: '10px', background: 'var(--primary-500)', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>MAIN</span>}
                                        </div>
                                        <button className="btn-del" onClick={() => removeListItem('bank_accounts', bank.id)}><Trash2 size={16} /></button>
                                    </div>
                                    <DynamicSelect
                                        placeholder="เลือกธนาคาร..."
                                        value={bank.bank_name}
                                        onChange={v => updateListItem('bank_accounts', bank.id, 'bank_name', v)}
                                        options={[
                                            ...(systemOptions.bankNames || []),
                                            { value: 'KBANK', label: 'กสิกรไทย (KBANK)' },
                                            { value: 'SCB', label: 'ไทยพาณิชย์ (SCB)' },
                                            { value: 'BBL', label: 'กรุงเทพ (BBL)' },
                                            { value: 'KTB', label: 'กรุงไทย (KTB)' },
                                            { value: 'TTB', label: 'ทหารไทยธนชาต (TTB)' },
                                            { value: 'BAY', label: 'กรุงศรี (BAY)' },
                                            { value: 'GSB', label: 'ออมสิน (GSB)' }
                                        ].filter((v, i, a) => a.findIndex(t => (t.value === v.value)) === i)} // Unique filter in case duplicates
                                        onAddItem={v => handleAddNewOption('bankNames', v)}
                                    />
                                    <FormInput placeholder="เลขที่บัญชี" value={bank.account_number} onChange={v => updateListItem('bank_accounts', bank.id, 'account_number', v)} icon={CreditCard} />
                                    <FormInput placeholder="ชื่อบัญชี" value={bank.account_name} onChange={v => updateListItem('bank_accounts', bank.id, 'account_name', v)} icon={User} />
                                </div>
                            ))}
                            <button className="btn-add-dashed" onClick={() => addListItem('bank_accounts', { bank_name: 'KBANK', account_number: '', account_name: '', is_default: false })}>
                                <Plus size={18} /> เพิ่มบัญชีธนาคาร
                            </button>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="form-stack">
                            {formData.documents?.map((doc, idx) => (
                                <div key={doc.id} className="relational-set">
                                    <div className="set-header">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FileText size={18} color="var(--primary-500)" />
                                            <span>เอกสาร #{idx + 1}</span>
                                        </div>
                                        <button className="btn-del" onClick={() => removeListItem('documents', doc.id)}><Trash2 size={16} /></button>
                                    </div>
                                    <DynamicSelect
                                        placeholder="เลือกประเภทเอกสาร..."
                                        value={doc.doc_type}
                                        onChange={v => updateListItem('documents', doc.id, 'doc_type', v)}
                                        options={[
                                            ...(systemOptions.documentTypes || []),
                                            { value: 'id_card', label: 'บัตรประชาชน' },
                                            { value: 'house_reg', label: 'ทะเบียนบ้าน' },
                                            { value: 'resume', label: 'Resume / CV' },
                                            { value: 'contract', label: 'สัญญาจ้าง' },
                                            { value: 'other', label: 'อื่นๆ' }
                                        ].filter((v, i, a) => a.findIndex(t => (t.value === v.value)) === i)}
                                        onAddItem={v => handleAddNewOption('documentTypes', v)}
                                    />

                                    {/* Upload Area */}
                                    <div
                                        style={{
                                            border: '2px dashed #e2e8f0', borderRadius: '16px',
                                            padding: '20px', textAlign: 'center', cursor: 'pointer',
                                            background: doc.file_url ? '#f8fafc' : 'white',
                                            transition: 'all 0.2s'
                                        }}
                                        onClick={() => document.getElementById(`file-upload-${doc.id}`).click()}
                                    >
                                        {doc.file_url ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                                {doc.file_obj?.type.startsWith('image/') || doc.file_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                                    <img src={doc.file_url} alt="Preview" style={{ maxHeight: '150px', borderRadius: '8px', objectFit: 'contain' }} />
                                                ) : (
                                                    <FileText size={48} color="#94a3b8" />
                                                )}
                                                <span style={{ fontSize: '13px', color: '#64748b' }}>{doc.file_name || 'Attached File'}</span>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
                                                <Upload size={32} />
                                                <span style={{ fontSize: '13px', fontWeight: 600 }}>คลิกเพื่ออัปโหลดรูปหรือไฟล์ PDF</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            id={`file-upload-${doc.id}`}
                                            className="hidden"
                                            accept="image/*,application/pdf"
                                            onChange={(e) => handleFileSelect(doc.id, e)}
                                        />
                                    </div>
                                </div>
                            ))}
                            <button className="btn-add-dashed" onClick={() => addListItem('documents', { doc_type: 'id_card', file_url: '', file_name: '', file_obj: null })}>
                                <Plus size={18} /> เพิ่มเอกสาร
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
                        padding: 24px 32px; background: #fafafa; border-bottom: 1px solid var(--border-color);
                        display: flex; align-items: center; justify-content: space-between; gap: 16px;
                    }
                    .header-badge { width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #3b82f6, #2563eb); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }
                    .header-text h2 { margin: 0; font-size: 20px; font-weight: 700; color: #1e293b; }
                    .header-text span { font-size: 14px; color: #64748b; font-weight: 500; }
                    .btn-close { width: 36px; height: 36px; border-radius: 50%; border: none; background: #f1f5f9; color: #64748b; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
                    .btn-close:hover { background: #e2e8f0; color: #ef4444; transform: rotate(90deg); }

                    .tabs-container {
                        display: flex; padding: 0 32px; border-bottom: 1px solid var(--border-color); background: white;
                        gap: 8px; overflow-x: auto;
                    }
                    .tab-btn {
                        padding: 16px 4px; border: none; background: none; margin-bottom: -1px;
                        display: flex; align-items: center; gap: 8px;
                        color: #94a3b8; font-weight: 600; font-size: 14px; cursor: pointer;
                        border-bottom: 2px solid transparent; transition: all 0.2s;
                    }
                    .tab-btn:hover { color: #64748b; }
                    .tab-btn.active { color: var(--primary-600); border-bottom-color: var(--primary-600); }
                    
                    .modal-body { padding: 32px; overflow-y: auto; flex: 1; }
                    .form-stack { display: flex; flex-direction: column; gap: 12px; } /* Compact Rhythm 12px */
                    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

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
                    .hidden { display: none; }
                `}</style>
            </div>
        </div>
    );

}

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
