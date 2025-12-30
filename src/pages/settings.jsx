import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { getSettings, saveShopSettings, syncSystemOptions } from '../lib/v1/settingManager';
import {
    Store,
    List,
    FileText,
    Save,
    Trash2,
    Plus,
    MapPin,
    Phone,
    Mail,
    CreditCard,
    Sparkles,
    CheckCircle2,
    Clock,
    User
} from 'lucide-react';

const OptionSection = ({ category, settings, setSettings, handleSyncOptions }) => {
    const items = settings.systemOptions[category.id] || [];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <category.icon size={16} style={{ color: 'var(--primary-500)' }} />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{category.label}</span>
                </div>
                <button
                    className="button-ghost"
                    style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '8px' }}
                    onClick={() => {
                        const val = prompt(`เพิ่ม${category.label}`);
                        if (val) {
                            const updated = [...items, { value: val, label: val }];
                            setSettings({ ...settings, systemOptions: { ...settings.systemOptions, [category.id]: updated } });
                            handleSyncOptions(category.id, updated);
                        }
                    }}
                >
                    <Plus size={12} /> เพิ่ม
                </button>
            </div>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                padding: '12px',
                background: 'var(--bg-main)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                minHeight: '45px'
            }}>
                {items.length === 0 && <span style={{ fontSize: '12px', color: 'var(--text-muted)', italic: true }}>ไม่มีข้อมูล</span>}
                {items.map((item, idx) => (
                    <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        fontSize: '12px',
                        fontWeight: 500,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}>
                        {item.label}
                        <button
                            style={{ border: 'none', background: 'none', color: '#fda4af', cursor: 'pointer', padding: 0, display: 'flex' }}
                            onClick={() => {
                                const updated = items.filter((_, i) => i !== idx);
                                setSettings({ ...settings, systemOptions: { ...settings.systemOptions, [category.id]: updated } });
                                handleSyncOptions(category.id, updated);
                            }}
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('shop');
    const [settings, setSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setIsLoading(true);
        const data = await getSettings();
        if (data) setSettings(data);
        setIsLoading(false);
    };

    const handleSaveShop = async () => {
        setIsSaving(true);
        const result = await saveShopSettings({
            ...settings.shop,
            ...settings.financial,
            ...settings.documents
        });
        if (result.success) {
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
            loadSettings();
        } else {
            alert('Error: ' + result.error);
        }
        setIsSaving(false);
    };

    const handleSyncOptions = async (category, items) => {
        setIsSaving(true);
        // Transform the local UI state back to what syncSystemOptions expects
        const values = items.map(t => t.value);
        const result = await syncSystemOptions(category, values);
        if (result.success) {
            loadSettings();
        } else {
            alert('Error: ' + result.error);
        }
        setIsSaving(false);
    };

    if (isLoading) {
        return <MainLayout title="ตั้งค่าระบบ"><div style={{ padding: '60px', textAlign: 'center' }}>ดาวน์โหลดข้อมูล...</div></MainLayout>;
    }

    if (!settings) {
        return (
            <MainLayout title="ตั้งค่าระบบ">
                <div style={{ padding: '60px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                    <div style={{ color: 'var(--error)', fontWeight: 600 }}>ไม่สามารถโหลดข้อมูลการตั้งค่าได้</div>
                    <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>กรุณาตรวจสอบการเชื่อมต่อฐานข้อมูล หรือสิทธิ์การเข้าถึง</div>
                    <button className="button-primary" onClick={loadSettings}>ลองใหม่อีกครั้ง</button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="ตั้งค่าระบบ">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Tab Navigation */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    background: 'white',
                    padding: '6px',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    width: 'fit-content'
                }}>
                    {[
                        { id: 'shop', label: 'ข้อมูลร้านค้า', icon: Store },
                        { id: 'options', label: 'ตัวเลือกในระบบ', icon: List },
                        { id: 'documents', label: 'ตั้งค่าเอกสาร', icon: FileText }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                borderRadius: '12px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 600,
                                transition: 'all 0.2s',
                                background: activeTab === tab.id ? 'var(--primary-600)' : 'transparent',
                                color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(37, 99, 235, 0.2)' : 'none'
                            }}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="card" style={{ padding: '32px' }}>

                    {activeTab === 'shop' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Standard Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                                <Store size={18} style={{ color: 'var(--primary-500)' }} />
                                <span style={{ fontSize: '15px', fontWeight: 700, color: '#475569', lineHeight: 1 }}>ข้อมูลร้านค้าและพิกัด</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <input
                                    className="input-field"
                                    placeholder="ชื่อร้าน / บริษัท"
                                    value={settings.shop.name || ''}
                                    onChange={e => setSettings({ ...settings, shop: { ...settings.shop, name: e.target.value } })}
                                />
                                <input
                                    className="input-field"
                                    placeholder="ชื่อสถานที่ (เช่น อาคารบี, ชั้น 2)"
                                    value={settings.shop.place_name || ''}
                                    onChange={e => setSettings({ ...settings, shop: { ...settings.shop, place_name: e.target.value } })}
                                />

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <input className="input-field" placeholder="เลขที่" value={settings.shop.number || ''} onChange={e => setSettings({ ...settings, shop: { ...settings.shop, number: e.target.value } })} />
                                    <input className="input-field" placeholder="หมู่ที่" value={settings.shop.villageno || ''} onChange={e => setSettings({ ...settings, shop: { ...settings.shop, villageno: e.target.value } })} />
                                </div>
                                <input className="input-field" placeholder="หมู่บ้าน/คอนโด" value={settings.shop.village || ''} onChange={e => setSettings({ ...settings, shop: { ...settings.shop, village: e.target.value } })} />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <input className="input-field" placeholder="ซอย" value={settings.shop.soi || ''} onChange={e => setSettings({ ...settings, shop: { ...settings.shop, soi: e.target.value } })} />
                                    <input className="input-field" placeholder="ถนน" value={settings.shop.road || ''} onChange={e => setSettings({ ...settings, shop: { ...settings.shop, road: e.target.value } })} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <input className="input-field" placeholder="ตำบล/แขวง" value={settings.shop.subdistrict || ''} onChange={e => setSettings({ ...settings, shop: { ...settings.shop, subdistrict: e.target.value } })} />
                                    <input className="input-field" placeholder="อำเภอ/เขต" value={settings.shop.district || ''} onChange={e => setSettings({ ...settings, shop: { ...settings.shop, district: e.target.value } })} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <input className="input-field" placeholder="จังหวัด" value={settings.shop.province || ''} onChange={e => setSettings({ ...settings, shop: { ...settings.shop, province: e.target.value } })} />
                                    <input className="input-field" placeholder="รหัสไปรษณีย์" value={settings.shop.zipcode || ''} onChange={e => setSettings({ ...settings, shop: { ...settings.shop, zipcode: e.target.value } })} />
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input
                                        className="input-field"
                                        style={{ paddingLeft: '40px' }}
                                        placeholder="Google Maps Link"
                                        value={settings.shop.google_map_link || ''}
                                        onChange={e => setSettings({ ...settings, shop: { ...settings.shop, google_map_link: e.target.value } })}
                                    />
                                </div>

                                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '12px 0' }} />

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <Phone size={18} style={{ color: 'var(--primary-500)' }} />
                                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#475569', lineHeight: 1 }}>ข้อมูลติดต่อและภาษี</span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <input className="input-field" placeholder="เบอร์โทรศัพท์" value={settings.shop.phone || ''} onChange={e => setSettings({ ...settings, shop: { ...settings.shop, phone: e.target.value } })} />
                                    <input className="input-field" placeholder="อีเมล" value={settings.shop.email || ''} onChange={e => setSettings({ ...settings, shop: { ...settings.shop, email: e.target.value } })} />
                                </div>
                                <input className="input-field" placeholder="เลขประจำตัวผู้เสียภาษี" value={settings.shop.tax_id || ''} onChange={e => setSettings({ ...settings, shop: { ...settings.shop, tax_id: e.target.value } })} />

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input
                                            type="checkbox"
                                            id="vat_reg"
                                            checked={settings.financial.vat_registered}
                                            onChange={e => setSettings({ ...settings, financial: { ...settings.financial, vat_registered: e.target.checked } })}
                                        />
                                        <label htmlFor="vat_reg" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>จดทะเบียน VAT</label>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>อัตราภาษี (%):</span>
                                        <input
                                            type="number"
                                            className="input-field"
                                            style={{ width: '80px', padding: '6px 12px' }}
                                            value={settings.financial.vat_rate}
                                            onFocus={e => e.target.select()}
                                            onChange={e => setSettings({ ...settings, financial: { ...settings.financial, vat_rate: e.target.value === '' ? '' : parseFloat(e.target.value) } })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'options' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            {/* Product Options */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6 }}>
                                    <Sparkles size={16} />
                                    <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ตัวเลือกสินค้า</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                                    {[
                                        { id: 'productTypes', label: 'ประเภทสินค้า', icon: List },
                                        { id: 'materials', label: 'วัสดุสินค้า', icon: List },
                                        { id: 'materialColors', label: 'สีวัสดุ', icon: Sparkles },
                                        { id: 'crystalColors', label: 'สีคริสตัล', icon: Sparkles },
                                        { id: 'lightColors', label: 'สีแสงไฟ', icon: Sparkles },
                                        { id: 'remotes', label: 'รีโมท', icon: List },
                                        { id: 'bulbTypes', label: 'ประเภทหลอดไฟ', icon: List }
                                    ].map(category => (
                                        <OptionSection key={category.id} category={category} settings={settings} setSettings={setSettings} handleSyncOptions={handleSyncOptions} />
                                    ))}
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

                            {/* Human Resources */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6 }}>
                                    <User size={16} />
                                    <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ทีมงานและบุคลากร</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                                    {[
                                        { id: 'teamNames', label: 'รายชื่อทีมงาน', icon: User },
                                        { id: 'teamTypes', label: 'ประเภททีม', icon: List },
                                        { id: 'jobPositions', label: 'ตำแหน่งงาน', icon: User },
                                        { id: 'jobLevels', label: 'ระดับงาน', icon: List },
                                        { id: 'employmentTypes', label: 'ประเภทการจ้างงาน', icon: List },
                                        { id: 'paymentTypes', label: 'รูปแบบการจ่ายเงิน', icon: List }
                                    ].map(category => (
                                        <OptionSection key={category.id} category={category} settings={settings} setSettings={setSettings} handleSyncOptions={handleSyncOptions} />
                                    ))}
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

                            {/* Finance */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6 }}>
                                    <CreditCard size={16} />
                                    <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>การเงิน</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                                    {[
                                        { id: 'expenseTypes', label: 'ประเภทรายจ่าย', icon: List }
                                    ].map(category => (
                                        <OptionSection key={category.id} category={category} settings={settings} setSettings={setSettings} handleSyncOptions={handleSyncOptions} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                                <FileText size={18} style={{ color: 'var(--primary-500)' }} />
                                <span style={{ fontSize: '15px', fontWeight: 700, color: '#475569', lineHeight: 1 }}>เงื่อนไขมาตรฐานในเอกสาร</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>เงื่อนไขการเสนอราคา (Default Terms)</label>
                                    <textarea
                                        className="input-field"
                                        rows={6}
                                        style={{ height: 'auto', padding: '12px' }}
                                        value={settings.documents.default_terms || ''}
                                        onChange={e => setSettings({ ...settings, documents: { ...settings.documents, default_terms: e.target.value } })}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>นโยบายการรับประกัน (Warranty Policy)</label>
                                    <textarea
                                        className="input-field"
                                        rows={6}
                                        style={{ height: 'auto', padding: '12px' }}
                                        value={settings.documents.warranty_policy || ''}
                                        onChange={e => setSettings({ ...settings, documents: { ...settings.documents, warranty_policy: e.target.value } })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Final Action Bar */}
                    <div style={{
                        marginTop: '32px',
                        paddingTop: '24px',
                        borderTop: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                                <Clock size={12} />
                                แก้ไขล่าสุดเมื่อ {settings.shop.updated_at ? new Date(settings.shop.updated_at).toLocaleString('th-TH') : '-'}
                            </div>
                        </div>

                        <button
                            disabled={isSaving}
                            onClick={handleSaveShop}
                            className="button-primary"
                            style={{ padding: '12px 32px' }}
                        >
                            {isSaving ? 'กำลังบันทึก...' : (
                                saveSuccess ? <><CheckCircle2 size={18} /> บันทึกสำเร็จ</> : <><Save size={18} /> บันทึกการตั้งค่า</>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
}
