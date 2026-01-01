import React, { useState, useEffect } from 'react';
import { X, User, Save, Users, MapPin, CreditCard, FileText } from 'lucide-react';
import { saveEmployee } from '../../lib/v1/employeeManager';
import { getSettings, syncSystemOptions } from '../../lib/v1/settingManager';
import { showError, showSuccess } from '../../lib/sweetAlert';
import MagicPasteModal, { MagicPasteResult } from '../customers/MagicPasteModal';
import { supabase } from '../../lib/supabase';
import { Employee, EmployeeAddress, EmployeeBankAccount, EmployeeDocument, Team, EmployeeContactDB } from '../../types/personnel';
import { SystemOption } from '../../types/settings';

// Import Tab Components
import {
    BasicInfoTab,
    ContactTab,
    AddressTab,
    BankTab,
    DocumentTab,
    EmployeeFormData,
    EmployeeContactUI,
    SystemOptionsMap
} from './tabs';

interface EmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    employee: Employee | null;
    teams: Team[];
    onSaveSuccess: () => void;
}

interface MagicPasteTarget {
    type: 'basic' | 'contact' | 'address' | 'contact_new' | 'address_new' | 'bank';
    id?: number | string;
}

export default function EmployeeModal({ isOpen, onClose, employee, teams, onSaveSuccess }: EmployeeModalProps) {
    const [activeTab, setActiveTab] = useState('basic');
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState<EmployeeFormData>({
        id: undefined,
        eid: 'EP-NEW',
        nickname: '',
        first_name: '',
        last_name: '',
        team_id: '',
        job_position: '',
        job_level: '',
        employment_type: 'พนักงานประจำ',
        work_type: '',
        pay_type: 'รายเดือน',
        pay_rate: 0,
        incentive_rate: 0,
        start_date: '',
        end_date: '',
        status: 'current',
        citizen_id: '',
        birth_date: '',
        contacts: [],
        addresses: [],
        bank_accounts: [],
        documents: []
    });

    const [systemOptions, setSystemOptions] = useState<SystemOptionsMap>({});
    const [isMagicPasteOpen, setIsMagicPasteOpen] = useState(false);
    const [magicPasteTarget, setMagicPasteTarget] = useState<MagicPasteTarget | null>(null);

    // --- Data Transformers ---
    const transformDBToUIContacts = (dbContacts: EmployeeContactDB[]): EmployeeContactUI[] => {
        if (!dbContacts || dbContacts.length === 0) return [{
            id: Date.now(), name: 'เบอร์หลัก', phone: '', line: '', email: '', facebook: '', instagram: '', note: '', is_primary: true
        }];

        const groups: { [key: string]: EmployeeContactUI } = {};
        dbContacts.forEach(c => {
            const key = c.name || 'Unlabeled';
            if (!groups[key]) {
                groups[key] = {
                    id: Date.now() + Math.random(),
                    name: key,
                    phone: '', line: '', email: '', facebook: '', instagram: '', note: '',
                    is_primary: c.is_primary || false
                };
            }
            if (c.contact_type === 'phone') groups[key].phone = c.value;
            if (c.contact_type === 'email') groups[key].email = c.value;
            if (c.contact_type === 'line') groups[key].line = c.value;
            if (c.contact_type === 'facebook') groups[key].facebook = c.value;
            if (c.contact_type === 'instagram') groups[key].instagram = c.value;
            if (c.contact_type === 'note') groups[key].note = c.value;
        });

        return Object.values(groups);
    };

    const transformUIToDBContacts = (uiContacts: EmployeeContactUI[]): EmployeeContactDB[] => {
        const dbContacts: EmployeeContactDB[] = [];
        uiContacts.forEach(c => {
            if (c.phone) dbContacts.push({ contact_type: 'phone', value: c.phone, name: c.name, is_primary: c.is_primary });
            if (c.email) dbContacts.push({ contact_type: 'email', value: c.email, name: c.name, is_primary: c.is_primary });
            if (c.line) dbContacts.push({ contact_type: 'line', value: c.line, name: c.name, is_primary: c.is_primary });
            if (c.facebook) dbContacts.push({ contact_type: 'facebook', value: c.facebook, name: c.name, is_primary: c.is_primary });
            if (c.instagram) dbContacts.push({ contact_type: 'instagram', value: c.instagram, name: c.name, is_primary: c.is_primary });
            if (c.note) dbContacts.push({ contact_type: 'note', value: c.note, name: c.name, is_primary: c.is_primary });
        });
        return dbContacts;
    };

    // --- Effects ---
    useEffect(() => {
        const fetchOptions = async () => {
            const settings = await getSettings();
            if (settings?.systemOptions) {
                setSystemOptions(settings.systemOptions);
            }
        };
        fetchOptions();
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (employee) {
                setFormData({
                    ...employee,
                    eid: employee.eid || '',
                    nickname: employee.nickname || '',
                    first_name: employee.first_name || '',
                    last_name: employee.last_name || '',
                    team_id: employee.team_id || '',
                    job_position: employee.job_position || '',
                    job_level: employee.job_level || '',
                    employment_type: employee.employment_type || 'พนักงานประจำ',
                    work_type: employee.work_type || '',
                    pay_type: employee.pay_type || '',
                    pay_rate: employee.pay_rate || 0,
                    incentive_rate: employee.incentive_rate || 0,
                    status: employee.status || 'current',
                    citizen_id: employee.citizen_id || '',
                    birth_date: employee.birth_date || '',
                    start_date: employee.start_date || '',
                    end_date: employee.end_date || '',
                    contacts: transformDBToUIContacts(employee.contacts || []),
                    addresses: employee.addresses?.length ? employee.addresses : [{ id: Date.now().toString(), label: 'ที่อยู่ปัจจุบัน', is_default: true }],
                    bank_accounts: employee.bank_accounts?.length ? employee.bank_accounts : [{ id: Date.now().toString(), bank_name: 'KBANK', account_number: '', is_default: true }],
                    documents: employee.documents || []
                });
            } else {
                setFormData({
                    id: undefined,
                    eid: 'EP-NEW',
                    nickname: '',
                    first_name: '',
                    last_name: '',
                    team_id: '',
                    job_position: '',
                    job_level: '',
                    employment_type: 'พนักงานประจำ',
                    work_type: '',
                    pay_type: 'รายเดือน',
                    pay_rate: 0,
                    incentive_rate: 0,
                    status: 'current',
                    citizen_id: '',
                    birth_date: '',
                    start_date: '',
                    end_date: '',
                    contacts: [{ id: Date.now(), name: 'เบอร์หลัก', phone: '', line: '', email: '', facebook: '', instagram: '', note: '', is_primary: true }],
                    addresses: [{ id: Date.now().toString(), label: 'ที่อยู่ปัจจุบัน', number: '', villageno: '', village: '', lane: '', road: '', subdistrict: '', district: '', province: '', zipcode: '', maps: '', is_default: true }],
                    bank_accounts: [{ id: Date.now().toString(), bank_name: 'KBANK', account_number: '', is_default: true }],
                    documents: []
                });
            }
            setActiveTab('basic');
        }
    }, [isOpen, employee]);

    // --- Handlers ---
    const handleAddNewOption = async (category: string, newValue: string) => {
        if (!newValue) return;
        const currentList = systemOptions[category] || [];
        if (currentList.some(item => item.value === newValue)) return;

        const updatedList = [...currentList, { id: Date.now(), value: newValue, label: newValue }];
        setSystemOptions(prev => ({ ...prev, [category]: updatedList }));
        await syncSystemOptions(category, updatedList);
    };

    const handleAddNewTeam = async (name: string) => {
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

    const handleMagicPasteResult = (result: MagicPasteResult) => {
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
            if (contact) {
                updateListItem('contacts', id!, 'ALL', {
                    ...contact,
                    name: result.name || contact.name,
                    phone: result.phone || contact.phone,
                    line: result.line || contact.line,
                    email: result.email || contact.email
                });
            }
        } else if (magicPasteTarget?.type === 'address') {
            const { id } = magicPasteTarget;
            const addr = formData.addresses.find(a => a.id === id);
            if (addr) {
                updateListItem('addresses', id!, 'ALL', {
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
            }
        }
    };

    const handleSave = async () => {
        if (!formData.nickname) return showError('กรุณาระบุชื่อเล่นพนักงาน');
        setLoading(true);

        const dbContacts = transformUIToDBContacts(formData.contacts);
        const payload: Employee = {
            ...formData,
            // @ts-ignore - DB contacts structure
            contacts: dbContacts
        };

        const res = await saveEmployee(payload);
        if (res.success) {
            showSuccess(formData.id ? 'อัปเดตข้อมูลสำเร็จ' : 'เพิ่มพนักงานใหม่สำเร็จ');
            onSaveSuccess();
            onClose();
        } else {
            showError('บันทึกไม่สำเร็จ: ' + res.error);
        }
        setLoading(false);
    };

    const updateListItem = (listName: 'contacts' | 'addresses' | 'bank_accounts' | 'documents', id: string | number, field: string, value: any) => {
        // @ts-ignore
        setFormData(prev => ({
            ...prev,
            [listName]: prev[listName].map((item: any) => item.id === id ? (field === 'ALL' ? value : { ...item, [field]: value }) : item)
        }));
    };

    const addListItem = (listName: string, defaultItem: any) => {
        // @ts-ignore
        setFormData(prev => ({
            ...prev,
            [listName]: [...prev[listName], { ...defaultItem, id: Date.now().toString() }]
        }));
    };

    const removeListItem = (listName: 'contacts' | 'addresses' | 'bank_accounts' | 'documents', id: string | number) => {
        // @ts-ignore
        if (formData[listName].length <= 1 && (listName === 'contacts' || listName === 'addresses' || listName === 'bank_accounts')) return showError('ต้องมีอย่างน้อย 1 รายการ');
        // @ts-ignore
        setFormData({ ...formData, [listName]: formData[listName].filter((i: any) => i.id !== id) });
    };

    const handleFileSelect = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
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

    const openMagicPaste = (type: MagicPasteTarget['type'], id?: string | number) => {
        setMagicPasteTarget({ type, id });
        setIsMagicPasteOpen(true);
    };

    if (!isOpen) return null;

    const tabs = [
        { id: 'basic', label: 'ข้อมูลทั่วไป', icon: User },
        { id: 'contact', label: 'ผู้ติดต่อ', icon: Users },
        { id: 'address', label: 'ที่อยู่', icon: MapPin },
        { id: 'bank', label: 'ธนาคาร', icon: CreditCard },
        { id: 'documents', label: 'เอกสาร', icon: FileText }
    ];

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
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                                {employee ? 'แก้ไขข้อมูลพนักงาน' : 'เพิ่มพนักงานใหม่'}
                            </h2>
                            <span style={{ fontSize: '14px', color: '#64748b' }}>
                                {formData.eid || '...'} • {formData.nickname || '...'}
                            </span>
                        </div>
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
                        title="ปิด"
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
                            setFormData={setFormData}
                            teams={teams}
                            systemOptions={systemOptions}
                            onAddNewOption={handleAddNewOption}
                            onAddNewTeam={handleAddNewTeam}
                            onOpenMagicPaste={() => openMagicPaste('basic')}
                        />
                    )}

                    {activeTab === 'contact' && (
                        <ContactTab
                            formData={formData}
                            setFormData={setFormData}
                            onUpdateListItem={updateListItem}
                            onAddListItem={addListItem}
                            onRemoveListItem={removeListItem}
                            onOpenMagicPaste={(type, id) => openMagicPaste(type, id)}
                        />
                    )}

                    {activeTab === 'address' && (
                        <AddressTab
                            formData={formData}
                            setFormData={setFormData}
                            onUpdateListItem={updateListItem}
                            onAddListItem={addListItem}
                            onRemoveListItem={removeListItem}
                            onOpenMagicPaste={(type, id) => openMagicPaste(type, id)}
                        />
                    )}

                    {activeTab === 'bank' && (
                        <BankTab
                            formData={formData}
                            setFormData={setFormData}
                            systemOptions={systemOptions}
                            onUpdateListItem={updateListItem}
                            onAddListItem={addListItem}
                            onRemoveListItem={removeListItem}
                            onAddNewOption={handleAddNewOption}
                            onOpenMagicPaste={(type, id) => openMagicPaste(type, id)}
                        />
                    )}

                    {activeTab === 'documents' && (
                        <DocumentTab
                            formData={formData}
                            setFormData={setFormData}
                            systemOptions={systemOptions}
                            onFileSelect={handleFileSelect}
                            onAddListItem={addListItem}
                            onRemoveListItem={removeListItem}
                            onAddNewOption={handleAddNewOption}
                            onUpdateListItem={updateListItem}
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
                    <button
                        onClick={onClose}
                        disabled={loading}
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
                        disabled={loading}
                        className="button-primary"
                        style={{ flex: 2, padding: '14px', justifyContent: 'center' }}
                    >
                        {loading ? <span style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <Save size={20} />}
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
            </div>
        </div>
    );
}

