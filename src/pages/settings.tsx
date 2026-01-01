import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { getSettings, saveShopSettings, syncSystemOptions } from '../lib/v1/settingManager';
import {
    Store,
    List,
    FileText,
    Save,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { SettingsData, SystemOption } from '../types/settings';
import ShopInfoTab from '../components/settings/tabs/ShopInfoTab';
import SystemOptionsTab from '../components/settings/tabs/SystemOptionsTab';
import DocumentTab from '../components/settings/tabs/DocumentTab';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('shop');
    const [settings, setSettings] = useState<SettingsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setIsLoading(true);
        const data = await getSettings();
        if (data) setSettings(data as SettingsData);
        setIsLoading(false);
    };

    const handleSaveShop = async () => {
        if (!settings) return;
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

    const handleSyncOptions = async (category: string, items: SystemOption[]) => {
        setIsSaving(true);
        const result = await syncSystemOptions(category, items);
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
                        <ShopInfoTab settings={settings} setSettings={setSettings} />
                    )}

                    {activeTab === 'options' && (
                        <SystemOptionsTab settings={settings} setSettings={setSettings} handleSyncOptions={handleSyncOptions} />
                    )}

                    {activeTab === 'documents' && (
                        <DocumentTab settings={settings} setSettings={setSettings} />
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
